import Foundation

@objc public class Esptouch: NSObject {
    @objc public func echo(_ value: String) -> String {
        print(value)
        return value
    }
}
