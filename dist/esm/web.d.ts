import { WebPlugin } from '@capacitor/core';
import type { EsptouchPlugin, EsptouchProvisioningRequest, EsptouchProvisionResult } from './definitions';
export declare class EsptouchWeb extends WebPlugin implements EsptouchPlugin {
    startSync(): Promise<void>;
    stopSync(): Promise<void>;
    startProvisioning(request: EsptouchProvisioningRequest): Promise<{
        results: EsptouchProvisionResult[];
    }>;
    stopProvisioning(): Promise<void>;
    close(): Promise<void>;
    addListener(eventName: string, listenerFunc: (...args: any[]) => void): Promise<any>;
    removeAllListeners(): Promise<void>;
}
