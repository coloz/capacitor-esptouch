import { WebPlugin } from '@capacitor/core';

import type { EsptouchPlugin } from './definitions';

export class EsptouchWeb extends WebPlugin implements EsptouchPlugin {
  async start(
    // @ts-ignore
    options: {
      ssid: string,
      bssid?: string,
      password?: string,
      aesKey?: string,
      customData?: string
    }): Promise<string> {
    throw this.unimplemented('Not implemented on web.');
  }

  async stop(): Promise<any> {
    throw this.unimplemented('Not implemented on web.');
  }
}
