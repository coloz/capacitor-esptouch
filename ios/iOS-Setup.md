## iOS配置说明

### 权限配置

在您的iOS应用的 `Info.plist` 文件中添加以下权限：

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs location access to scan for nearby WiFi networks for device provisioning.</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>This app needs location access to scan for nearby WiFi networks for device provisioning.</string>

<key>NSLocalNetworkUsageDescription</key>
<string>This app needs local network access to provision IoT devices via EspTouch protocol.</string>

<key>NSBonjourServices</key>
<array>
    <string>_esptouch._udp</string>
</array>
```

### 框架依赖

插件会自动添加以下框架依赖：
- SystemConfiguration.framework
- Network.framework (iOS 12+)

### 应用传输安全（ATS）配置

如果需要支持本地网络发现，可能需要在Info.plist中添加：

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsLocalNetworking</key>
    <true/>
</dict>
```

### 使用说明

1. 确保设备连接到目标WiFi网络
2. 请求位置权限（iOS要求访问WiFi信息需要位置权限）
3. 调用配网API

### 代码示例

```swift
import CapacitorEsptouch

// 在AppDelegate中注册插件
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    // ... 其他配置
    return true
}
```

### 注意事项

- **iOS 14+**: 需要在Info.plist中声明本地网络使用权限
- **WiFi信息获取**: 需要位置权限才能获取WiFi的SSID和BSSID
- **网络环境**: 建议在WiFi环境下进行设备配网
- **超时时间**: 配网任务默认运行90秒
- **多线程**: 所有网络操作都在后台线程中进行，回调在主线程中执行

### 故障排除

1. **权限问题**: 确保已请求并获得位置权限
2. **网络问题**: 确保设备连接到正确的WiFi网络
3. **配网失败**: 检查WiFi密码和设备是否处于配网模式
4. **编译错误**: 确保Xcode版本支持Swift 5.1+

### 最低系统要求

- iOS 14.0+
- Xcode 12.0+
- Swift 5.1+
