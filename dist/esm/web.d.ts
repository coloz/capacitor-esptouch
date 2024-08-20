import { WebPlugin } from '@capacitor/core';
import type { EsptouchPlugin } from './definitions';
export declare class EsptouchWeb extends WebPlugin implements EsptouchPlugin {
    start(options: {
        ssid: string;
        bssid?: string;
        password?: string;
        aesKey?: string;
        customData?: string;
    }): Promise<string>;
    stop(): Promise<any>;
}
