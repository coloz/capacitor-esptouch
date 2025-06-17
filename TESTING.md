# EspTouch Capacitor Plugin 测试指南

## 环境准备

### 开发环境要求

#### Android开发
- Android Studio Arctic Fox (2020.3.1) 或更高版本
- Android SDK API Level 23+ (Android 6.0+)
- Java 11 或更高版本
- Gradle 7.0+

#### iOS开发
- Xcode 12.0+ 
- iOS 14.0+
- macOS 10.15+

#### Node.js环境
- Node.js 16+
- npm 7+
- Capacitor CLI 4.0+

## 创建测试项目

### 1. 创建新的Ionic/Capacitor项目

```bash
# 安装Ionic CLI
npm install -g @ionic/cli @capacitor/cli

# 创建新项目
ionic start esptouch-test tabs --type=angular --capacitor

cd esptouch-test
```

### 2. 安装EspTouch插件

```bash
# 安装本地插件（开发阶段）
npm install file:../capacitor-esptouch/capacitor-esptouch

# 或者从npm安装（发布后）
# npm install capacitor-esptouch

# 同步到原生平台
npx cap sync
```

### 3. 添加平台支持

```bash
# 添加Android平台
npx cap add android

# 添加iOS平台（仅macOS）
npx cap add ios
```

## Android测试配置

### 1. 权限配置

在 `android/app/src/main/AndroidManifest.xml` 中添加：

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.CHANGE_WIFI_MULTICAST_STATE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

### 2. 创建测试页面

在 `src/app/tab1/tab1.page.ts` 中：

```typescript
import { Component } from '@angular/core';
import { Esptouch } from 'capacitor-esptouch';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  
  wifiInfo = {
    ssid: 'TestWiFi',
    bssid: 'aa:bb:cc:dd:ee:ff',
    password: 'testpassword'
  };
  
  status = {
    isProvisioning: false,
    isSyncing: false,
    message: '',
    results: []
  };

  constructor() {
    this.setupListeners();
  }

  async setupListeners() {
    await Esptouch.addListener('provisioningResult', (result) => {
      console.log('配网结果:', result);
      this.status.results.push(result);
    });

    await Esptouch.addListener('provisioningEvent', (event) => {
      console.log('配网事件:', event);
      this.status.isProvisioning = event.type === 'start';
      this.status.message = `配网${event.type}: ${event.message || ''}`;
    });

    await Esptouch.addListener('syncEvent', (event) => {
      console.log('同步事件:', event);
      this.status.isSyncing = event.type === 'start';
    });
  }

  async startProvisioning() {
    try {
      await Esptouch.startSync();
      await Esptouch.startProvisioning(this.wifiInfo);
      this.status.message = '配网已开始...';
    } catch (error) {
      console.error('启动配网失败:', error);
      this.status.message = `错误: ${error}`;
    }
  }

  async stopProvisioning() {
    try {
      await Esptouch.stopProvisioning();
      await Esptouch.stopSync();
      this.status.message = '配网已停止';
    } catch (error) {
      console.error('停止配网失败:', error);
    }
  }
}
```

在 `src/app/tab1/tab1.page.html` 中：

```html
<ion-header>
  <ion-toolbar>
    <ion-title>EspTouch 测试</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-card>
    <ion-card-header>
      <ion-card-title>WiFi配置</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <ion-item>
        <ion-label position="stacked">SSID</ion-label>
        <ion-input [(ngModel)]="wifiInfo.ssid"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">BSSID</ion-label>
        <ion-input [(ngModel)]="wifiInfo.bssid"></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="stacked">密码</ion-label>
        <ion-input [(ngModel)]="wifiInfo.password" type="password"></ion-input>
      </ion-item>
    </ion-card-content>
  </ion-card>

  <ion-card>
    <ion-card-header>
      <ion-card-title>状态</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <p>配网状态: {{ status.isProvisioning ? '进行中' : '已停止' }}</p>
      <p>同步状态: {{ status.isSyncing ? '进行中' : '已停止' }}</p>
      <p>消息: {{ status.message }}</p>
    </ion-card-content>
  </ion-card>

  <ion-button expand="block" (click)="startProvisioning()" [disabled]="status.isProvisioning">
    开始配网
  </ion-button>
  
  <ion-button expand="block" (click)="stopProvisioning()" [disabled]="!status.isProvisioning" color="danger">
    停止配网
  </ion-button>

  <ion-card *ngIf="status.results.length > 0">
    <ion-card-header>
      <ion-card-title>配网结果</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <ion-list>
        <ion-item *ngFor="let result of status.results">
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

### 3. 运行Android测试

```bash
# 构建并在Android设备上运行
npx cap run android

# 或者在Android Studio中打开
npx cap open android
```

## iOS测试配置

### 1. 权限配置

在 `ios/App/App/Info.plist` 中添加：

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>需要位置权限来扫描WiFi网络进行设备配网</string>

<key>NSLocalNetworkUsageDescription</key>
<string>需要本地网络权限来配置物联网设备</string>

<key>NSBonjourServices</key>
<array>
    <string>_esptouch._udp</string>
</array>
```

### 2. 运行iOS测试

```bash
# 在iOS模拟器中运行
npx cap run ios

# 或者在Xcode中打开
npx cap open ios
```

## 测试场景

### 基础功能测试

1. **插件加载测试**
   - 验证插件是否正确加载
   - 检查API方法是否可用

2. **同步功能测试**
   - 启动/停止同步包
   - 验证同步事件回调

3. **配网功能测试**
   - 使用有效的WiFi信息进行配网
   - 验证配网事件回调
   - 测试配网结果处理

### 错误处理测试

1. **无效参数测试**
   - 空BSSID
   - 错误的BSSID格式
   - 过长的密码

2. **网络环境测试**
   - 没有WiFi连接
   - 无效的WiFi信息
   - 网络超时情况

### 真实设备测试

1. **ESP32设备准备**
   ```c
   // ESP32端代码示例（Arduino）
   #include "WiFi.h"
   #include "ESPAsyncWebServer.h"
   #include <esptouch2.h>
   
   void setup() {
     Serial.begin(115200);
     WiFi.mode(WIFI_AP_STA);
     
     // 启动EspTouch配网
     esptouch2_smartconfig_start();
   }
   ```

2. **测试流程**
   - 将ESP32设置为配网模式
   - 手机连接到目标WiFi网络
   - 运行配网应用
   - 验证ESP32是否成功连接到WiFi

## 性能测试

### 配网成功率测试
- 不同距离下的配网成功率
- 不同WiFi环境下的兼容性
- 批量设备配网测试

### 资源使用测试
- 内存使用情况
- CPU使用率
- 电池消耗

## 调试技巧

### Android调试
```bash
# 查看logcat日志
adb logcat | grep Esptouch

# 过滤特定标签
adb logcat -s EsptouchPlugin
```

### iOS调试
- 在Xcode控制台查看日志
- 使用Console.app查看系统日志

### 网络调试
- 使用Wireshark抓包分析UDP数据包
- 检查广播包是否正确发送

## 常见问题排查

### 权限问题
- 确保应用有位置权限
- 检查WiFi访问权限

### 网络问题
- 确保手机和ESP32在同一网络
- 检查路由器是否支持广播包

### 配网失败
- 验证WiFi密码正确性
- 检查BSSID格式
- 确认ESP32处于配网模式

## 自动化测试

### 单元测试
```typescript
describe('EspTouch Plugin', () => {
  it('should start sync', async () => {
    await expect(Esptouch.startSync()).resolves.toBeUndefined();
  });
  
  it('should reject invalid BSSID', async () => {
    await expect(Esptouch.startProvisioning({
      ssid: 'test',
      bssid: 'invalid',
      password: 'password'
    })).rejects.toThrow();
  });
});
```

### 集成测试
- 测试完整的配网流程
- 验证事件监听器工作正常
- 测试资源清理功能

通过以上测试指南，您可以全面验证EspTouch插件的功能和性能。
