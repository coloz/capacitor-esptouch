# capacitor-esptouch

EspTouch V2 Capacitor plugin for ESP32 WiFi provisioning

## 特性

- ✅ 支持EspTouch V2协议
- ✅ Android完整实现
- ✅ iOS完整实现
- ✅ TypeScript类型支持
- ✅ 事件监听机制
- ✅ 自动资源管理

## 安装

```bash
npm install capacitor-esptouch
npx cap sync
```

## Android权限配置

在 `android/app/src/main/AndroidManifest.xml` 中添加必要权限：

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.CHANGE_WIFI_MULTICAST_STATE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

## iOS权限配置

在 `ios/App/App/Info.plist` 中添加必要权限：

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs location access to scan for nearby WiFi networks for device provisioning.</string>

<key>NSLocalNetworkUsageDescription</key>
<string>This app needs local network access to provision IoT devices via EspTouch protocol.</string>

<key>NSBonjourServices</key>
<array>
    <string>_esptouch._udp</string>
</array>
```

详细的iOS配置说明请查看 [iOS配置文档](./ios/iOS-Setup.md)

## 快速开始

```typescript
import { Esptouch } from 'capacitor-esptouch';

// 监听配网结果
await Esptouch.addListener('provisioningResult', (result) => {
  if (result.success) {
    console.log(`设备配网成功! IP: ${result.ip}`);
  }
});

// 开始配网
await Esptouch.startProvisioning({
  ssid: 'YourWiFiName',
  bssid: 'aa:bb:cc:dd:ee:ff',
  password: 'YourWiFiPassword'
});
```

更多详细使用方法请查看 [使用指南](./USAGE.md)

## API

<docgen-index>

* [`startSync()`](#startsync)
* [`stopSync()`](#stopsync)
* [`startProvisioning(...)`](#startprovisioning)
* [`stopProvisioning()`](#stopprovisioning)
* [`close()`](#close)
* [`addListener('provisioningResult', ...)`](#addlistenerprovisioningresult-)
* [`addListener('syncEvent', ...)`](#addlistenersyncevent-)
* [`addListener('provisioningEvent', ...)`](#addlistenerprovisioningevent-)
* [`removeAllListeners()`](#removealllisteners)
* [Interfaces](#interfaces)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### startSync()

```typescript
startSync() => Promise<void>
```

Start synchronization packets

--------------------


### stopSync()

```typescript
stopSync() => Promise<void>
```

Stop synchronization packets

--------------------


### startProvisioning(...)

```typescript
startProvisioning(request: EsptouchProvisioningRequest) => Promise<{ results: EsptouchProvisionResult[]; }>
```

Start provisioning process

| Param         | Type                                                                                |
| ------------- | ----------------------------------------------------------------------------------- |
| **`request`** | <code><a href="#esptouchprovisioningrequest">EsptouchProvisioningRequest</a></code> |

**Returns:** <code>Promise&lt;{ results: EsptouchProvisionResult[]; }&gt;</code>

--------------------


### stopProvisioning()

```typescript
stopProvisioning() => Promise<void>
```

Stop provisioning process

--------------------


### close()

```typescript
close() => Promise<void>
```

Close provisioner instance and release resources

--------------------


### addListener('provisioningResult', ...)

```typescript
addListener(eventName: 'provisioningResult', listenerFunc: (result: EsptouchProvisionResult) => void) => Promise<any>
```

Listen for provisioning results

| Param              | Type                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **`eventName`**    | <code>'provisioningResult'</code>                                                                |
| **`listenerFunc`** | <code>(result: <a href="#esptouchprovisionresult">EsptouchProvisionResult</a>) =&gt; void</code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### addListener('syncEvent', ...)

```typescript
addListener(eventName: 'syncEvent', listenerFunc: (event: { type: 'start' | 'stop' | 'error'; message?: string; }) => void) => Promise<any>
```

Listen for sync events

| Param              | Type                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------ |
| **`eventName`**    | <code>'syncEvent'</code>                                                                   |
| **`listenerFunc`** | <code>(event: { type: 'error' \| 'start' \| 'stop'; message?: string; }) =&gt; void</code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### addListener('provisioningEvent', ...)

```typescript
addListener(eventName: 'provisioningEvent', listenerFunc: (event: { type: 'start' | 'stop' | 'error'; message?: string; }) => void) => Promise<any>
```

Listen for provisioning events

| Param              | Type                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------ |
| **`eventName`**    | <code>'provisioningEvent'</code>                                                           |
| **`listenerFunc`** | <code>(event: { type: 'error' \| 'start' \| 'stop'; message?: string; }) =&gt; void</code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### removeAllListeners()

```typescript
removeAllListeners() => Promise<void>
```

Remove all listeners

--------------------


### Interfaces


#### EsptouchProvisionResult

| Prop          | Type                 |
| ------------- | -------------------- |
| **`ip`**      | <code>string</code>  |
| **`mac`**     | <code>string</code>  |
| **`success`** | <code>boolean</code> |


#### EsptouchProvisioningRequest

| Prop               | Type                |
| ------------------ | ------------------- |
| **`ssid`**         | <code>string</code> |
| **`bssid`**        | <code>string</code> |
| **`password`**     | <code>string</code> |
| **`reservedData`** | <code>string</code> |
| **`aesKey`**       | <code>string</code> |

</docgen-api>
