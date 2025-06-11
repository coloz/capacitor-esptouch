import Foundation
import Capacitor

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(EsptouchPlugin)
public class EsptouchPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "EsptouchPlugin"
    public let jsName = "Esptouch"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "startSync", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stopSync", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "startProvisioning", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stopProvisioning", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "close", returnType: CAPPluginReturnPromise)
    ]
    private let implementation = Esptouch()

    public override func load() {
        super.load()
        implementation.delegate = self
    }

    @objc func startSync(_ call: CAPPluginCall) {
        implementation.startSync()
        call.resolve()
    }
    
    @objc func stopSync(_ call: CAPPluginCall) {
        implementation.stopSync()
        call.resolve()
    }
    
    @objc func startProvisioning(_ call: CAPPluginCall) {
        let ssid = call.getString("ssid")
        let bssid = call.getString("bssid") ?? ""
        let password = call.getString("password")
        let reservedData = call.getString("reservedData")
        let aesKey = call.getString("aesKey")
        
        if bssid.isEmpty {
            call.reject("BSSID is required")
            return
        }
        
        implementation.startProvisioning(ssid: ssid, bssid: bssid, password: password, reservedData: reservedData, aesKey: aesKey)
        call.resolve()
    }
    
    @objc func stopProvisioning(_ call: CAPPluginCall) {
        implementation.stopProvisioning()
        call.resolve()
    }
    
    @objc func close(_ call: CAPPluginCall) {
        implementation.close()
        call.resolve()
    }
}

extension EsptouchPlugin: Esptouch.EsptouchDelegate {
    public func onSyncEvent(type: String, message: String?) {
        notifyListeners("syncEvent", data: [
            "type": type,
            "message": message ?? ""
        ])
    }
    
    public func onProvisioningEvent(type: String, message: String?) {
        notifyListeners("provisioningEvent", data: [
            "type": type,
            "message": message ?? ""
        ])
    }
    
    public func onProvisioningResult(ip: String, mac: String, success: Bool) {
        notifyListeners("provisioningResult", data: [
            "ip": ip,
            "mac": mac,
            "success": success
        ])
    }
}
