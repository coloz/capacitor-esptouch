export interface EsptouchPlugin {
  /**
   * Start ESP-Touch provisioning process
   * @param options Configuration options for ESP-Touch
   */
  start(options: {
    /** WiFi SSID to connect the device to */
    ssid: string;
    /** WiFi BSSID (MAC address of the router) */
    bssid?: string;
    /** WiFi password */
    password?: string;
    /** AES encryption key (optional) */
    aesKey?: string;
    /** Custom data to send to the device (optional) */
    customData?: string;
  }): Promise<EsptouchResult>;
  
  /**
   * Stop the ESP-Touch provisioning process
   */
  stop(): Promise<void>;
}

export interface EsptouchResult {
  /** Device MAC address */
  bssid?: string;
  /** Device IP address */
  ip?: string;
  /** Success message or error details */
  message?: string;
}
