# EspTouch Capacitor Plugin 完整使用示例

这个示例展示了如何在一个完整的Ionic/Angular应用中使用EspTouch插件。

## 1. 安装和配置

### 安装插件
```bash
npm install capacitor-esptouch
npx cap sync
```

### Android配置
在 `android/app/src/main/AndroidManifest.xml` 中添加权限：
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.CHANGE_WIFI_MULTICAST_STATE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

### iOS配置
在 `ios/App/App/Info.plist` 中添加权限：
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>需要位置权限来扫描附近的WiFi网络进行设备配网</string>
<key>NSLocalNetworkUsageDescription</key>
<string>需要本地网络权限来通过EspTouch协议配置物联网设备</string>
```

## 2. 服务类实现

### esptouch.service.ts
```typescript
import { Injectable } from '@angular/core';
import { Esptouch, EsptouchProvisioningRequest, EsptouchProvisionResult } from 'capacitor-esptouch';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ProvisioningStatus {
  isProvisioning: boolean;
  isSyncing: boolean;
  message: string;
  results: EsptouchProvisionResult[];
}

@Injectable({
  providedIn: 'root'
})
export class EsptouchService {
  private statusSubject = new BehaviorSubject<ProvisioningStatus>({
    isProvisioning: false,
    isSyncing: false,
    message: '',
    results: []
  });

  public status$ = this.statusSubject.asObservable();

  constructor() {
    this.setupEventListeners();
  }

  private async setupEventListeners() {
    // 监听配网结果
    await Esptouch.addListener('provisioningResult', (result: EsptouchProvisionResult) => {
      console.log('配网结果:', result);
      const currentStatus = this.statusSubject.value;
      this.statusSubject.next({
        ...currentStatus,
        results: [...currentStatus.results, result],
        message: result.success ? `设备配网成功: ${result.ip}` : '设备配网失败'
      });
    });

    // 监听配网事件
    await Esptouch.addListener('provisioningEvent', (event) => {
      console.log('配网事件:', event);
      const currentStatus = this.statusSubject.value;
      
      switch (event.type) {
        case 'start':
          this.statusSubject.next({
            ...currentStatus,
            isProvisioning: true,
            message: '配网已开始，请等待设备响应...'
          });
          break;
        case 'stop':
          this.statusSubject.next({
            ...currentStatus,
            isProvisioning: false,
            message: '配网已停止'
          });
          break;
        case 'error':
          this.statusSubject.next({
            ...currentStatus,
            isProvisioning: false,
            message: `配网错误: ${event.message}`
          });
          break;
      }
    });

    // 监听同步事件
    await Esptouch.addListener('syncEvent', (event) => {
      console.log('同步事件:', event);
      const currentStatus = this.statusSubject.value;
      
      switch (event.type) {
        case 'start':
          this.statusSubject.next({
            ...currentStatus,
            isSyncing: true,
            message: '同步包发送中...'
          });
          break;
        case 'stop':
          this.statusSubject.next({
            ...currentStatus,
            isSyncing: false
          });
          break;
        case 'error':
          this.statusSubject.next({
            ...currentStatus,
            isSyncing: false,
            message: `同步错误: ${event.message}`
          });
          break;
      }
    });
  }

  async startProvisioning(config: {
    ssid: string;
    bssid: string;
    password?: string;
    reservedData?: string;
    aesKey?: string;
  }): Promise<void> {
    try {
      // 清空之前的结果
      const currentStatus = this.statusSubject.value;
      this.statusSubject.next({
        ...currentStatus,
        results: [],
        message: '准备开始配网...'
      });

      // 开始同步包
      await Esptouch.startSync();

      // 开始配网
      const request: EsptouchProvisioningRequest = {
        ssid: config.ssid,
        bssid: config.bssid,
        password: config.password,
        reservedData: config.reservedData,
        aesKey: config.aesKey
      };

      await Esptouch.startProvisioning(request);
    } catch (error) {
      console.error('启动配网失败:', error);
      throw error;
    }
  }

  async stopProvisioning(): Promise<void> {
    try {
      await Esptouch.stopProvisioning();
      await Esptouch.stopSync();
    } catch (error) {
      console.error('停止配网失败:', error);
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    try {
      await this.stopProvisioning();
      await Esptouch.removeAllListeners();
      await Esptouch.close();
    } catch (error) {
      console.error('清理资源失败:', error);
    }
  }

  getCurrentStatus(): ProvisioningStatus {
    return this.statusSubject.value;
  }
}
```

## 3. 组件实现

### provisioning.page.ts
```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { EsptouchService, ProvisioningStatus } from '../services/esptouch.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-provisioning',
  templateUrl: './provisioning.page.html',
  styleUrls: ['./provisioning.page.scss'],
})
export class ProvisioningPage implements OnInit, OnDestroy {
  provisioningForm: FormGroup;
  status: ProvisioningStatus;
  private statusSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private esptouchService: EsptouchService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.provisioningForm = this.formBuilder.group({
      ssid: ['', [Validators.required]],
      bssid: ['', [Validators.required, Validators.pattern(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/)]],
      password: [''],
      reservedData: [''],
      aesKey: ['', [Validators.minLength(16), Validators.maxLength(16)]]
    });
  }

  ngOnInit() {
    this.statusSubscription = this.esptouchService.status$.subscribe(
      status => {
        this.status = status;
        if (status.message) {
          this.showToast(status.message);
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
    this.esptouchService.cleanup();
  }

  async onStartProvisioning() {
    if (this.provisioningForm.valid) {
      const loading = await this.loadingController.create({
        message: '正在启动配网...',
        duration: 2000
      });
      await loading.present();

      try {
        const formValue = this.provisioningForm.value;
        await this.esptouchService.startProvisioning({
          ssid: formValue.ssid,
          bssid: formValue.bssid,
          password: formValue.password,
          reservedData: formValue.reservedData,
          aesKey: formValue.aesKey
        });
      } catch (error) {
        await this.showAlert('错误', `启动配网失败: ${error}`);
      } finally {
        await loading.dismiss();
      }
    } else {
      await this.showAlert('表单错误', '请检查输入的信息是否正确');
    }
  }

  async onStopProvisioning() {
    try {
      await this.esptouchService.stopProvisioning();
    } catch (error) {
      await this.showAlert('错误', `停止配网失败: ${error}`);
    }
  }

  async onClearResults() {
    // 清空结果列表的逻辑
    const currentStatus = this.esptouchService.getCurrentStatus();
    // 这里可以实现清空结果的逻辑
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['确定']
    });
    await alert.present();
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom'
    });
    await toast.present();
  }
}
```

### provisioning.page.html
```html
<ion-header>
  <ion-toolbar>
    <ion-title>设备配网</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <form [formGroup]="provisioningForm">
    <ion-list>
      <ion-item>
        <ion-label position="stacked">WiFi名称 (SSID) *</ion-label>
        <ion-input 
          formControlName="ssid" 
          placeholder="请输入WiFi名称"
          type="text">
        </ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">WiFi地址 (BSSID) *</ion-label>
        <ion-input 
          formControlName="bssid" 
          placeholder="aa:bb:cc:dd:ee:ff"
          type="text">
        </ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">WiFi密码</ion-label>
        <ion-input 
          formControlName="password" 
          placeholder="请输入WiFi密码"
          type="password">
        </ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">自定义数据</ion-label>
        <ion-input 
          formControlName="reservedData" 
          placeholder="可选的自定义数据"
          type="text">
        </ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">AES密钥 (16字节)</ion-label>
        <ion-input 
          formControlName="aesKey" 
          placeholder="16字节的AES密钥"
          type="text">
        </ion-input>
      </ion-item>
    </ion-list>
  </form>

  <!-- 状态显示 -->
  <ion-card>
    <ion-card-header>
      <ion-card-title>配网状态</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <p>
        <ion-icon 
          [name]="status?.isProvisioning ? 'radio-button-on' : 'radio-button-off'" 
          [color]="status?.isProvisioning ? 'success' : 'medium'">
        </ion-icon>
        配网状态: {{ status?.isProvisioning ? '进行中' : '已停止' }}
      </p>
      <p>
        <ion-icon 
          [name]="status?.isSyncing ? 'radio-button-on' : 'radio-button-off'" 
          [color]="status?.isSyncing ? 'success' : 'medium'">
        </ion-icon>
        同步状态: {{ status?.isSyncing ? '进行中' : '已停止' }}
      </p>
      <p *ngIf="status?.message">消息: {{ status.message }}</p>
    </ion-card-content>
  </ion-card>

  <!-- 操作按钮 -->
  <ion-button 
    expand="block" 
    (click)="onStartProvisioning()" 
    [disabled]="status?.isProvisioning || !provisioningForm.valid"
    color="primary">
    <ion-icon name="play" slot="start"></ion-icon>
    开始配网
  </ion-button>

  <ion-button 
    expand="block" 
    (click)="onStopProvisioning()" 
    [disabled]="!status?.isProvisioning"
    color="danger">
    <ion-icon name="stop" slot="start"></ion-icon>
    停止配网
  </ion-button>

  <!-- 配网结果 -->
  <ion-card *ngIf="status?.results && status.results.length > 0">
    <ion-card-header>
      <ion-card-title>配网结果</ion-card-title>
      <ion-button 
        fill="clear" 
        size="small" 
        (click)="onClearResults()">
        清空
      </ion-button>
    </ion-card-header>
    <ion-card-content>
      <ion-list>
        <ion-item *ngFor="let result of status.results">
          <ion-icon 
            [name]="result.success ? 'checkmark-circle' : 'close-circle'" 
            [color]="result.success ? 'success' : 'danger'" 
            slot="start">
          </ion-icon>
          <ion-label>
            <h3>{{ result.success ? '成功' : '失败' }}</h3>
            <p>IP: {{ result.ip }}</p>
            <p>MAC: {{ result.mac }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-card-content>
  </ion-card>
</ion-content>
```

## 4. 使用说明

1. **权限请求**: 应用启动时请求必要的权限（位置权限等）
2. **WiFi连接**: 确保设备连接到目标WiFi网络
3. **设备准备**: 确保ESP32设备处于配网模式
4. **开始配网**: 填写表单并点击"开始配网"
5. **等待结果**: 监听配网结果，通常在60-90秒内完成
6. **完成配网**: 获得设备IP地址后可进行后续操作

## 5. 注意事项

- **网络环境**: 手机和设备需要在同一网络环境下
- **权限管理**: 确保应用有必要的网络和位置权限
- **错误处理**: 实现完善的错误处理和用户提示
- **资源清理**: 组件销毁时记得清理资源
- **超时机制**: 配网有90秒超时，可以实现自定义超时逻辑

这个示例提供了一个完整的EspTouch配网解决方案，可以直接在Ionic/Angular项目中使用。
