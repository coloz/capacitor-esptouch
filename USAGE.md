# EspTouch Capacitor Plugin 使用指南

这个插件提供了EspTouch V2协议的Capacitor封装，用于ESP32等设备的WiFi配网。

## 安装

```bash
npm install capacitor-esptouch
npx cap sync
```

## Android配置

确保您的Android项目已经添加了必要的权限到 `android/app/src/main/AndroidManifest.xml`：

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.CHANGE_WIFI_MULTICAST_STATE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

## 基本使用

```typescript
import { Esptouch } from 'capacitor-esptouch';

// 添加事件监听器
await Esptouch.addListener('provisioningResult', (result) => {
  console.log('配网结果:', result);
  if (result.success) {
    console.log(`设备IP: ${result.ip}, MAC: ${result.mac}`);
  }
});

await Esptouch.addListener('provisioningEvent', (event) => {
  console.log('配网事件:', event.type, event.message);
});

await Esptouch.addListener('syncEvent', (event) => {
  console.log('同步事件:', event.type, event.message);
});

// 开始同步数据包（可选）
await Esptouch.startSync();

// 开始配网
await Esptouch.startProvisioning({
  ssid: 'YourWiFiName',
  bssid: 'aa:bb:cc:dd:ee:ff', // 必需参数
  password: 'YourWiFiPassword',
  reservedData: 'custom_data', // 可选
  aesKey: '1234567890123456' // 可选，必须16字节
});

// 等待配网完成...

// 停止配网
await Esptouch.stopProvisioning();

// 停止同步
await Esptouch.stopSync();

// 释放资源
await Esptouch.close();
```

## 完整示例

```typescript
import { Esptouch } from 'capacitor-esptouch';

class EsptouchService {
  private isProvisioning = false;

  async startDeviceProvisioning(ssid: string, bssid: string, password: string) {
    try {
      // 设置事件监听
      await this.setupListeners();
      
      // 开始同步包
      await Esptouch.startSync();
      
      // 开始配网
      await Esptouch.startProvisioning({
        ssid,
        bssid,
        password
      });
      
      this.isProvisioning = true;
      console.log('配网已开始...');
      
    } catch (error) {
      console.error('启动配网失败:', error);
      throw error;
    }
  }

  async stopDeviceProvisioning() {
    if (this.isProvisioning) {
      await Esptouch.stopProvisioning();
      await Esptouch.stopSync();
      this.isProvisioning = false;
      console.log('配网已停止');
    }
  }

  private async setupListeners() {
    // 配网结果监听
    await Esptouch.addListener('provisioningResult', (result) => {
      console.log('配网结果:', result);
      if (result.success) {
        console.log(`设备配网成功! IP: ${result.ip}, MAC: ${result.mac}`);
        // 这里可以处理配网成功的逻辑
        this.onDeviceConnected(result);
      }
    });

    // 配网事件监听
    await Esptouch.addListener('provisioningEvent', (event) => {
      switch (event.type) {
        case 'start':
          console.log('配网开始');
          break;
        case 'stop':
          console.log('配网停止');
          this.isProvisioning = false;
          break;
        case 'error':
          console.error('配网错误:', event.message);
          this.onProvisioningError(event.message);
          break;
      }
    });

    // 同步事件监听
    await Esptouch.addListener('syncEvent', (event) => {
      console.log('同步事件:', event.type, event.message);
    });
  }

  private onDeviceConnected(result: any) {
    // 处理设备连接成功
    console.log('设备连接成功，可以进行后续操作');
  }

  private onProvisioningError(message: string) {
    // 处理配网错误
    console.error('配网失败:', message);
  }

  async cleanup() {
    await this.stopDeviceProvisioning();
    await Esptouch.removeAllListeners();
    await Esptouch.close();
  }
}
```

## API 参考

### `startSync()`
开始发送同步数据包

### `stopSync()`
停止发送同步数据包

### `startProvisioning(request)`
开始配网过程
- `request.ssid` (可选): WiFi网络名称
- `request.bssid` (必需): WiFi网络BSSID
- `request.password` (可选): WiFi密码
- `request.reservedData` (可选): 自定义数据，最大64字节
- `request.aesKey` (可选): AES密钥，必须16字节

### `stopProvisioning()`
停止配网过程

### `close()`
关闭provisioner实例并释放资源

## 事件监听

### `provisioningResult`
配网结果事件
```typescript
{
  ip: string;    // 设备IP地址
  mac: string;   // 设备MAC地址
  success: boolean; // 是否成功
}
```

### `provisioningEvent`
配网过程事件
```typescript
{
  type: 'start' | 'stop' | 'error';
  message?: string;
}
```

### `syncEvent`
同步过程事件
```typescript
{
  type: 'start' | 'stop' | 'error';
  message?: string;
}
```

## 注意事项

1. **权限要求**: Android需要位置权限来扫描WiFi网络
2. **网络要求**: 设备需要连接到目标WiFi网络
3. **超时时间**: 配网任务默认运行90秒
4. **资源管理**: 使用完毕后请调用`close()`释放资源
5. **iOS支持**: 当前iOS实现需要集成EspTouch iOS SDK

## 故障排除

1. **配网失败**: 检查WiFi密码和网络连接
2. **找不到设备**: 确保设备处于配网模式
3. **权限错误**: 检查应用权限设置
4. **网络错误**: 确保手机连接到正确的WiFi网络
