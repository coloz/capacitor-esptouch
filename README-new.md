# capacitor-esptouch

A Capacitor plugin for ESP-Touch (Smart Config) functionality to configure ESP8266/ESP32 devices.

- 用于 Ionic/Capacitor 应用开发
- 支持 ESP-Touch v2
- 兼容 Capacitor 7.x
- Android 完全支持
- iOS 基础框架已就绪（需要集成 ESP-Touch iOS 库）

## Install

```bash
npm install capacitor-esptouch
npx cap sync
```

## API

<docgen-index>

* [`start(...)`](#start)
* [`stop()`](#stop)
* [Interfaces](#interfaces)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### start(...)

```typescript
start(options: { ssid: string; bssid?: string; password?: string; aesKey?: string; customData?: string; }) => Promise<EsptouchResult>
```

Start ESP-Touch provisioning process

| Param         | Type                                                                                                    | Description                         |
| ------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| **`options`** | <code>{ ssid: string; bssid?: string; password?: string; aesKey?: string; customData?: string; }</code> | Configuration options for ESP-Touch |

**Returns:** <code>Promise&lt;<a href="#esptouchresult">EsptouchResult</a>&gt;</code>

--------------------


### stop()

```typescript
stop() => Promise<void>
```

Stop the ESP-Touch provisioning process

--------------------


### Interfaces


#### EsptouchResult

| Prop          | Type                | Description                      |
| ------------- | ------------------- | -------------------------------- |
| **`bssid`**   | <code>string</code> | Device MAC address               |
| **`ip`**      | <code>string</code> | Device IP address                |
| **`message`** | <code>string</code> | Success message or error details |

</docgen-api>

## 使用示例

```typescript
import { Esptouch } from 'capacitor-esptouch';

// 开始配网
try {
  const result = await Esptouch.start({
    ssid: 'your-wifi-name',
    bssid: 'aa:bb:cc:dd:ee:ff', // 可选，路由器MAC地址
    password: 'your-wifi-password',
    customData: 'optional-custom-data'
  });
  
  console.log('设备配网成功:', result);
  console.log('设备IP:', result.ip);
  console.log('设备MAC:', result.bssid);
} catch (error) {
  console.error('配网失败:', error);
}

// 停止配网
await Esptouch.stop();
```

## 兼容性

- **Capacitor**: 7.x
- **Android**: API 22+ (Android 5.1+)
- **iOS**: 13.0+
- **Web**: 不支持（仅显示错误信息）

## 更新日志

### v1.0.0
- 🎉 升级到 Capacitor 7 兼容性
- ✨ 改进类型定义和接口
- 🛠️ 更好的错误处理
- 🔧 Android 插件优化
- 📱 iOS 基础框架准备就绪

### v0.0.6 及更早版本
- Capacitor 6 支持
- 基础 ESP-Touch 功能

## iOS 实现说明

当前 iOS 版本提供了基础的插件框架，但需要集成实际的 ESP-Touch iOS 库来实现完整功能。要完成 iOS 实现，需要：

1. 在 `CapacitorEsptouch.podspec` 中添加 ESP-Touch iOS 库依赖
2. 在 `EsptouchPlugin.swift` 中集成实际的 ESP-Touch 功能
3. 处理 iOS 特定的网络权限和配置

## 参考引用

- [EsptouchForAndroid](https://github.com/EspressifApp/EsptouchForAndroid)  
- [EsptouchForIOS](https://github.com/EspressifApp/EsptouchForIOS)  
- [Capacitor Plugin Development Guide](https://capacitorjs.com/docs/plugins)

## 技术支持

如果你觉得该项目不错，可以打个 star 支持下  
提供 Cordova/Ionic 开发、ESP8266/ESP32 开发技术支持服务，300元/每小时  
微信: coloz999
