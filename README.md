# capacitor-esptouch
capacitor-esptouch  
· 用于ionic/capacitor应用开发
· 支持esptouch v2  
· android已支持，ios待开发  

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

## 参考引用
[EsptouchForAndroid](https://github.com/EspressifApp/EsptouchForAndroid)  
[EsptouchForIOS](https://github.com/EspressifApp/EsptouchForIOS)  

## 技术支持  
如果你觉得该项目不错，可以打个star支持下  
提供cordova/ionic开发、ESP8266/ESP32开发技术支持服务，300元/每小时  
wechat: coloz999  
