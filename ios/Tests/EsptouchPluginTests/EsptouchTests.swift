import XCTest
@testable import EsptouchPlugin

class EsptouchTests: XCTestCase {
    
    var esptouch: Esptouch!
    
    override func setUpWithError() throws {
        super.setUp()
        esptouch = Esptouch()
    }
    
    override func tearDownWithError() throws {
        esptouch.close()
        esptouch = nil
        super.tearDown()
    }
    
    func testEsptouchInitialization() {
        XCTAssertNotNil(esptouch)
        XCTAssertFalse(esptouch.isProvisioning())
        XCTAssertFalse(esptouch.isSyncing())
    }
    
    func testBSSIDConversion() {
        // 这个测试需要访问私有方法，仅作为示例
        // 实际测试应该通过公共API进行
        let validBssid = "aa:bb:cc:dd:ee:ff"
        let invalidBssid = "invalid-bssid"
        
        // 测试会通过startProvisioning的行为来验证BSSID转换
        esptouch.startProvisioning(
            ssid: "TestSSID",
            bssid: invalidBssid,
            password: "password",
            reservedData: nil,
            aesKey: nil
        )
        
        XCTAssertFalse(esptouch.isProvisioning(), "应该因为无效BSSID而失败")
    }
    
    func testSyncOperations() {
        XCTAssertFalse(esptouch.isSyncing())
        
        esptouch.startSync()
        // 注意：在真实测试中，您可能需要等待异步操作完成
        
        esptouch.stopSync()
        XCTAssertFalse(esptouch.isSyncing())
    }
    
    func testProvisioningOperations() {
        XCTAssertFalse(esptouch.isProvisioning())
        
        esptouch.startProvisioning(
            ssid: "TestSSID",
            bssid: "aa:bb:cc:dd:ee:ff",
            password: "password",
            reservedData: nil,
            aesKey: nil
        )
        
        // 在真实测试中，这里可能需要检查异步状态
        esptouch.stopProvisioning()
        XCTAssertFalse(esptouch.isProvisioning())
    }
    
    func testDelegateCallbacks() {
        let expectation = XCTestExpectation(description: "Delegate callback")
        
        class TestDelegate: Esptouch.EsptouchDelegate {
            let expectation: XCTestExpectation
            
            init(expectation: XCTestExpectation) {
                self.expectation = expectation
            }
            
            func onSyncEvent(type: String, message: String?) {
                if type == "start" {
                    expectation.fulfill()
                }
            }
            
            func onProvisioningEvent(type: String, message: String?) {
                // 测试配网事件
            }
            
            func onProvisioningResult(ip: String, mac: String, success: Bool) {
                // 测试配网结果
            }
        }
        
        let delegate = TestDelegate(expectation: expectation)
        esptouch.delegate = delegate
        
        esptouch.startSync()
        
        wait(for: [expectation], timeout: 5.0)
    }
}
