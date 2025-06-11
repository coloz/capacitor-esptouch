/**
 * EspTouch Capacitor Plugin 测试文件
 * 
 * 这个文件演示了如何在实际应用中使用 EspTouch 插件
 */

import { Esptouch } from 'capacitor-esptouch';

class EsptouchDemo {
  
  async testBasicFunctionality() {
    console.log('🧪 开始测试 EspTouch 基本功能...');
    
    try {
      // 设置事件监听器
      await this.setupListeners();
      
      // 测试开始同步
      console.log('🔄 测试开始同步...');
      await Esptouch.startSync();
      
      // 等待一秒
      await this.delay(1000);
      
      // 测试停止同步
      console.log('⏹️ 测试停止同步...');
      await Esptouch.stopSync();
      
      // 测试配网（使用示例数据）
      console.log('📡 测试开始配网...');
      await Esptouch.startProvisioning({
        ssid: 'TestWiFi',
        bssid: 'aa:bb:cc:dd:ee:ff',
        password: 'testpassword'
      });
      
      // 等待5秒
      await this.delay(5000);
      
      // 停止配网
      console.log('⏹️ 测试停止配网...');
      await Esptouch.stopProvisioning();
      
      // 清理资源
      console.log('🧹 清理资源...');
      await Esptouch.close();
      
      console.log('✅ 基本功能测试完成！');
      
    } catch (error) {
      console.error('❌ 测试失败:', error);
    }
  }
  
  private async setupListeners() {
    console.log('🎧 设置事件监听器...');
    
    // 监听配网结果
    await Esptouch.addListener('provisioningResult', (result) => {
      console.log('📋 配网结果:', {
        ip: result.ip,
        mac: result.mac,
        success: result.success
      });
    });
    
    // 监听配网事件
    await Esptouch.addListener('provisioningEvent', (event) => {
      console.log('📡 配网事件:', event.type, event.message || '');
    });
    
    // 监听同步事件
    await Esptouch.addListener('syncEvent', (event) => {
      console.log('🔄 同步事件:', event.type, event.message || '');
    });
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * 模拟真实配网场景
   */
  async simulateRealProvisioning() {
    console.log('🎭 模拟真实配网场景...');
    
    const wifiConfig = {
      ssid: 'MyHomeWiFi',
      bssid: '12:34:56:78:9a:bc',
      password: 'mywifipassword',
      reservedData: 'custom_device_data'
    };
    
    try {
      await this.setupListeners();
      
      console.log('🚀 开始配网流程...');
      console.log('WiFi配置:', wifiConfig);
      
      // 开始同步包
      await Esptouch.startSync();
      console.log('✅ 同步包已启动');
      
      // 开始配网
      await Esptouch.startProvisioning(wifiConfig);
      console.log('✅ 配网已启动');
      
      // 模拟等待配网结果（实际应用中会通过事件监听器获得结果）
      console.log('⏳ 等待设备响应（最多90秒）...');
      await this.delay(10000); // 等待10秒作为演示
      
      // 手动停止（实际应用中可能根据结果自动停止）
      await Esptouch.stopProvisioning();
      await Esptouch.stopSync();
      await Esptouch.close();
      
      console.log('✅ 配网流程结束');
      
    } catch (error) {
      console.error('❌ 配网失败:', error);
      
      // 确保清理资源
      try {
        await Esptouch.stopProvisioning();
        await Esptouch.stopSync();
        await Esptouch.close();
      } catch (cleanupError) {
        console.error('❌ 清理资源失败:', cleanupError);
      }
    }
  }
  
  /**
   * 测试错误处理
   */
  async testErrorHandling() {
    console.log('🚨 测试错误处理...');
    
    try {
      // 测试无效的BSSID
      await Esptouch.startProvisioning({
        ssid: 'TestWiFi',
        bssid: '', // 空BSSID应该导致错误
        password: 'password'
      });
    } catch (error) {
      console.log('✅ 正确捕获了无效BSSID错误:', error);
    }
    
    try {
      // 测试Web平台的错误（如果在Web上运行）
      if (typeof window !== 'undefined') {
        console.log('🌐 在Web平台上测试...');
        await Esptouch.startSync();
      }
    } catch (error) {
      console.log('✅ 正确处理了Web平台不支持的错误:', error);
    }
  }
}

// 导出供外部使用
export { EsptouchDemo };

// 如果是在开发环境中直接运行
if (typeof window !== 'undefined') {
  (window as any).EsptouchDemo = EsptouchDemo;
  console.log('🎯 EspTouch演示类已挂载到 window.EsptouchDemo');
  console.log('💡 使用方法:');
  console.log('  const demo = new EsptouchDemo();');
  console.log('  demo.testBasicFunctionality();');
  console.log('  demo.simulateRealProvisioning();');
  console.log('  demo.testErrorHandling();');
}
