export interface EsptouchProvisioningRequest {
    ssid?: string;
    bssid: string;
    password?: string;
    reservedData?: string;
    aesKey?: string;
}
export interface EsptouchProvisionResult {
    ip: string;
    mac: string;
    success: boolean;
}
export interface EsptouchPlugin {
    /**
     * Start synchronization packets
     */
    startSync(): Promise<void>;
    /**
     * Stop synchronization packets
     */
    stopSync(): Promise<void>;
    /**
     * Start provisioning process
     */
    startProvisioning(request: EsptouchProvisioningRequest): Promise<{
        results: EsptouchProvisionResult[];
    }>;
    /**
     * Stop provisioning process
     */
    stopProvisioning(): Promise<void>;
    /**
     * Close provisioner instance and release resources
     */
    close(): Promise<void>;
    /**
     * Listen for provisioning results
     */
    addListener(eventName: 'provisioningResult', listenerFunc: (result: EsptouchProvisionResult) => void): Promise<any>;
    /**
     * Listen for sync events
     */
    addListener(eventName: 'syncEvent', listenerFunc: (event: {
        type: 'start' | 'stop' | 'error';
        message?: string;
    }) => void): Promise<any>;
    /**
     * Listen for provisioning events
     */
    addListener(eventName: 'provisioningEvent', listenerFunc: (event: {
        type: 'start' | 'stop' | 'error';
        message?: string;
    }) => void): Promise<any>;
    /**
     * Remove all listeners
     */
    removeAllListeners(): Promise<void>;
}
