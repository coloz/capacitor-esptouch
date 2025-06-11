import Foundation

@objc public class Esptouch: NSObject {
    
    public protocol EsptouchDelegate: AnyObject {
        func onSyncEvent(type: String, message: String?)
        func onProvisioningEvent(type: String, message: String?)
        func onProvisioningResult(ip: String, mac: String, success: Bool)
    }
    
    public weak var delegate: EsptouchDelegate?
    private var provisioner: ESPProvisioner
    private var isProvisioningActive = false
    private var isSyncActive = false
    
    override init() {
        self.provisioner = ESPProvisioner.share()
        super.init()
    }
    
    @objc public func startSync() {
        if isSyncActive {
            delegate?.onSyncEvent(type: "error", message: "Sync is already active")
            return
        }
        
        print("EspTouch iOS: Starting sync packets")
        provisioner.startSync(withDelegate: self)
        isSyncActive = true
    }
    
    @objc public func stopSync() {
        if !isSyncActive {
            return
        }
        
        print("EspTouch iOS: Stopping sync packets")
        provisioner.stopSync()
        isSyncActive = false
    }
    
    @objc public func startProvisioning(ssid: String?, bssid: String, password: String?, reservedData: String?, aesKey: String?) {
        if isProvisioningActive {
            delegate?.onProvisioningEvent(type: "error", message: "Provisioning is already active")
            return
        }
        
        print("EspTouch iOS: Starting provisioning for BSSID: \(bssid)")
        
        let request = ESPProvisioningRequest()
        
        // 设置BSSID（必需）
        if let bssidData = self.convertBSSIDToData(bssid) {
            request.bssid = bssidData
        } else {
            delegate?.onProvisioningEvent(type: "error", message: "Invalid BSSID format")
            return
        }
        
        // 设置SSID（可选）
        if let ssid = ssid, !ssid.isEmpty {
            request.ssid = ssid.data(using: .utf8) ?? Data()
        }
        
        // 设置密码（可选）
        if let password = password, !password.isEmpty {
            request.password = password.data(using: .utf8) ?? Data()
        }
        
        // 设置保留数据（可选）
        if let reservedData = reservedData, !reservedData.isEmpty {
            request.reservedData = reservedData.data(using: .utf8) ?? Data()
        }
        
        // 设置AES密钥（可选）
        if let aesKey = aesKey, !aesKey.isEmpty {
            if aesKey.count == 16 {
                request.aesKey = aesKey
            } else {
                print("EspTouch iOS: AES key must be 16 bytes, ignoring provided key")
            }
        }
        
        // 开始配网
        provisioner.startProvisioning(request, withDelegate: self)
        isProvisioningActive = true
    }
    
    @objc public func stopProvisioning() {
        if !isProvisioningActive {
            return
        }
        
        print("EspTouch iOS: Stopping provisioning")
        provisioner.stopProvisioning()
        isProvisioningActive = false
    }
    
    @objc public func close() {
        print("EspTouch iOS: Closing provisioner")
        stopProvisioning()
        stopSync()
    }
    
    @objc public func isProvisioning() -> Bool {
        return isProvisioningActive
    }
    
    @objc public func isSyncing() -> Bool {
        return isSyncActive
    }
    
    // MARK: - Private Helper Methods
    
    private func convertBSSIDToData(_ bssid: String) -> Data? {
        let cleanBssid = bssid.replacingOccurrences(of: ":", with: "")
        guard cleanBssid.count == 12 else {
            return nil
        }
        
        var data = Data()
        var index = cleanBssid.startIndex
        
        for _ in 0..<6 {
            let endIndex = cleanBssid.index(index, offsetBy: 2)
            let hexString = String(cleanBssid[index..<endIndex])
            
            if let byte = UInt8(hexString, radix: 16) {
                data.append(byte)
            } else {
                return nil
            }
            
            index = endIndex
        }
        
        return data
    }
}

// MARK: - ESPProvisionerDelegate

extension Esptouch: ESPProvisionerDelegate {
    
    public func onSyncStart() {
        print("EspTouch iOS: Sync started")
        delegate?.onSyncEvent(type: "start", message: "Sync packets started")
    }
    
    public func onSyncStop() {
        print("EspTouch iOS: Sync stopped")
        isSyncActive = false
        delegate?.onSyncEvent(type: "stop", message: "Sync packets stopped")
    }
    
    public func onSyncError(_ exception: NSException) {
        print("EspTouch iOS: Sync error: \(exception.reason ?? "Unknown error")")
        isSyncActive = false
        delegate?.onSyncEvent(type: "error", message: exception.reason)
    }
    
    public func onProvisioningStart() {
        print("EspTouch iOS: Provisioning started")
        delegate?.onProvisioningEvent(type: "start", message: "Provisioning started")
    }
    
    public func onProvisioningStop() {
        print("EspTouch iOS: Provisioning stopped")
        isProvisioningActive = false
        delegate?.onProvisioningEvent(type: "stop", message: "Provisioning stopped")
    }
    
    public func onProvisoningScanResult(_ result: ESPProvisioningResult) {
        print("EspTouch iOS: Provisioning result - IP: \(result.address), BSSID: \(result.bssid)")
        delegate?.onProvisioningResult(ip: result.address, mac: result.bssid, success: true)
    }
    
    public func onProvisioningError(_ exception: NSException) {
        print("EspTouch iOS: Provisioning error: \(exception.reason ?? "Unknown error")")
        isProvisioningActive = false
        delegate?.onProvisioningEvent(type: "error", message: exception.reason)
    }
}
