# capacitor-esptouch
capacitor-esptouch
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
