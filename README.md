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

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### start(...)

```typescript
start(options: { ssid: string; bssid?: string; password?: string; aesKey?: string; customData?: string; }) => Promise<any>
```

| Param         | Type                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| **`options`** | <code>{ ssid: string; bssid?: string; password?: string; aesKey?: string; customData?: string; }</code> |

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------


### stop()

```typescript
stop() => Promise<any>
```

**Returns:** <code>Promise&lt;any&gt;</code>

--------------------

</docgen-api>

## 参考引用
[EsptouchForAndroid](https://github.com/EspressifApp/EsptouchForAndroid)  
[EsptouchForIOS](https://github.com/EspressifApp/EsptouchForIOS)  

## 技术支持  
如果你觉得该项目不错，可以打个star支持下  
提供cordova/ionic开发、ESP8266/ESP32开发技术支持服务，300元/每小时  
wechat: coloz999  
