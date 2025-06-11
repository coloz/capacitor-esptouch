import { WebPlugin } from '@capacitor/core';

import type { EsptouchPlugin, EsptouchProvisioningRequest, EsptouchProvisionResult } from './definitions';

export class EsptouchWeb extends WebPlugin implements EsptouchPlugin {
  async startSync(): Promise<void> {
    console.log('EspTouch Web: startSync called - not supported on web');
    throw new Error('EspTouch is not supported on web platform');
  }

  async stopSync(): Promise<void> {
    console.log('EspTouch Web: stopSync called - not supported on web');
    throw new Error('EspTouch is not supported on web platform');
  }

  async startProvisioning(request: EsptouchProvisioningRequest): Promise<{ results: EsptouchProvisionResult[] }> {
    console.log('EspTouch Web: startProvisioning called - not supported on web', request);
    throw new Error('EspTouch is not supported on web platform');
  }

  async stopProvisioning(): Promise<void> {
    console.log('EspTouch Web: stopProvisioning called - not supported on web');
    throw new Error('EspTouch is not supported on web platform');
  }

  async close(): Promise<void> {
    console.log('EspTouch Web: close called - not supported on web');
    throw new Error('EspTouch is not supported on web platform');
  }

  async addListener(eventName: string, listenerFunc: (...args: any[]) => void): Promise<any> {
    console.log('EspTouch Web: addListener called - not supported on web', eventName, listenerFunc);
    throw new Error('EspTouch is not supported on web platform');
  }

  async removeAllListeners(): Promise<void> {
    console.log('EspTouch Web: removeAllListeners called - not supported on web');
    throw new Error('EspTouch is not supported on web platform');
  }
}
