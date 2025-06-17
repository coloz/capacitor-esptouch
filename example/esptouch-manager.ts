import type { EsptouchProvisioningRequest, EsptouchProvisionResult } from '../src/definitions';
import { Esptouch } from '../src/index';

export class EsptouchManager {
  private isProvisioning = false;
  private isSyncing = false;

  constructor() {
    this.setupEventListeners();
  }

  /**
   * 设置事件监听器
   */
  private async setupEventListeners() {
    // 监听配网结果
    await Esptouch.addListener('provisioningResult', (result: EsptouchProvisionResult) => {
      console.log('配网结果:', result);
      this.onProvisioningResult(result);
    });

    // 监听配网事件
    await Esptouch.addListener('provisioningEvent', (event) => {
      console.log('配网事件:', event.type, event.message);
      this.onProvisioningEvent(event.type, event.message);
    });

    // 监听同步事件
    await Esptouch.addListener('syncEvent', (event) => {
      console.log('同步事件:', event.type, event.message);
      this.onSyncEvent(event.type, event.message);
    });
  }

  /**
   * 开始设备配网
   */
  async startDeviceProvisioning(params: {
    ssid: string;
    bssid: string;
    password?: string;
    reservedData?: string;
    aesKey?: string;
  }): Promise<void> {
    try {
      if (this.isProvisioning) {
        throw new Error('配网正在进行中');
      }

      console.log('开始设备配网...', params);

      // 先启动同步包
      await this.startSync();

      // 构建配网请求
      const request: EsptouchProvisioningRequest = {
        ssid: params.ssid,
        bssid: params.bssid,
        password: params.password,
        reservedData: params.reservedData,
        aesKey: params.aesKey,
      };

      // 开始配网
      await Esptouch.startProvisioning(request);
      this.isProvisioning = true;

      console.log('配网已启动，等待设备响应...');
    } catch (error) {
      console.error('启动配网失败:', error);
      await this.cleanup();
      throw error;
    }
  }

  /**
   * 停止设备配网
   */
  async stopDeviceProvisioning(): Promise<void> {
    try {
      if (this.isProvisioning) {
        await Esptouch.stopProvisioning();
        this.isProvisioning = false;
        console.log('配网已停止');
      }

      await this.stopSync();
    } catch (error) {
      console.error('停止配网失败:', error);
      throw error;
    }
  }

  /**
   * 开始同步包
   */
  private async startSync(): Promise<void> {
    if (!this.isSyncing) {
      await Esptouch.startSync();
      this.isSyncing = true;
    }
  }

  /**
   * 停止同步包
   */
  private async stopSync(): Promise<void> {
    if (this.isSyncing) {
      await Esptouch.stopSync();
      this.isSyncing = false;
    }
  }

  /**
   * 配网结果处理
   */
  private onProvisioningResult(result: EsptouchProvisionResult) {
    if (result.success) {
      console.log(`设备配网成功!`);
      console.log(`设备IP: ${result.ip}`);
      console.log(`设备MAC: ${result.mac}`);

      // 这里可以添加成功后的业务逻辑
      this.onDeviceConnected(result);
    } else {
      console.log('设备配网失败');
    }
  }

  /**
   * 配网事件处理
   */
  private onProvisioningEvent(type: string, message?: string) {
    switch (type) {
      case 'start':
        console.log('📡 配网开始');
        break;
      case 'stop':
        console.log('⏹️ 配网停止');
        this.isProvisioning = false;
        break;
      case 'error':
        console.error('❌ 配网错误:', message);
        this.onProvisioningError(message || '未知错误');
        break;
    }
  }

  /**
   * 同步事件处理
   */
  private onSyncEvent(type: string, message?: string) {
    switch (type) {
      case 'start':
        console.log('🔄 同步开始');
        break;
      case 'stop':
        console.log('⏹️ 同步停止');
        this.isSyncing = false;
        break;
      case 'error':
        console.error('❌ 同步错误:', message);
        break;
    }
  }  /**
   * 设备连接成功处理
   */
  private onDeviceConnected(result: EsptouchProvisionResult): void {
    // 在这里添加设备连接成功后的逻辑
    // 比如：保存设备信息、导航到设备页面等
    console.log('设备连接成功，可以进行后续操作', result);
    
    // 示例：自动停止配网
    this.stopDeviceProvisioning();
  }
  /**
   * 配网错误处理
   */
  private onProvisioningError(message: string): void {
    // 在这里添加错误处理逻辑
    // 比如：显示错误提示、重试逻辑等
    console.error('配网失败，需要处理错误:', message);
  }

  /**
   * 清理资源
   */
  async cleanup(): Promise<void> {
    try {
      await this.stopDeviceProvisioning();
      await Esptouch.close();
      console.log('EspTouch资源已清理');
    } catch (error) {
      console.error('清理资源失败:', error);
    }
  }
  /**
   * 获取当前状态
   */
  getStatus(): { isProvisioning: boolean; isSyncing: boolean } {
    return {
      isProvisioning: this.isProvisioning,
      isSyncing: this.isSyncing,
    };
  }

  /**
   * 移除所有监听器
   */
  async removeListeners(): Promise<void> {
    await Esptouch.removeAllListeners();
  }
}

// 使用示例
/*
const esptouchManager = new EsptouchManager();

// 开始配网
await esptouchManager.startDeviceProvisioning({
  ssid: 'MyWiFi',
  bssid: 'aa:bb:cc:dd:ee:ff',
  password: 'mypassword'
});

// 停止配网
await esptouchManager.stopDeviceProvisioning();

// 清理资源
await esptouchManager.cleanup();
*/
