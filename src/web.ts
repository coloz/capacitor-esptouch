import { WebPlugin } from '@capacitor/core';

import type { EsptouchPlugin } from './definitions';

export class EsptouchWeb extends WebPlugin implements EsptouchPlugin {
  async start(options: {
    ssid: string;
    bssid?: string;
    password?: string;
    aesKey?: string;
    customData?: string;
  }): Promise<any> {
    console.log('ESP-Touch start called with:', options);
    throw this.unavailable('Not implemented on web.');
  }

  async stop(): Promise<any> {
    console.log('ESP-Touch stop called');
    throw this.unavailable('Not implemented on web.');
  }
}
