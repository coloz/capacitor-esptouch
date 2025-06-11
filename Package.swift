// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CapacitorEsptouch",
    platforms: [.iOS(.v14)],
    products: [
        .library(
            name: "CapacitorEsptouch",
            targets: ["EsptouchPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "7.0.0")
    ],
    targets: [
        .target(
            name: "EsptouchPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/EsptouchPlugin",
            publicHeadersPath: ".",
            cSettings: [
                .headerSearchPath("ESPUtils")
            ],
            swiftSettings: [
                .interoperabilityMode(.Cxx)
            ]
        ),
        .testTarget(
            name: "EsptouchPluginTests",
            dependencies: ["EsptouchPlugin"],
            path: "ios/Tests/EsptouchPluginTests")
    ]
)