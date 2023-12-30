# capacitor-esptouch(开发中)

capacitor-esptouch

## Install

```bash
npm install capacitor-esptouch
npx cap sync
```

## API

<docgen-index>

* [`echo(...)`](#echo)
* [`start(...)`](#start)
* [`stop()`](#stop)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### echo(...)

```typescript
echo(options: { value: string; }) => Promise<{ value: string; }>
```

| Param         | Type                            |
| ------------- | ------------------------------- |
| **`options`** | <code>{ value: string; }</code> |

**Returns:** <code>Promise&lt;{ value: string; }&gt;</code>

--------------------


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
