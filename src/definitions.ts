export interface EsptouchPlugin {
  start(options: {
    ssid: string,
    bssid?: string,
    password?: string,
    aesKey?: string,
    customData?: string
  }): Promise<any>;
  
  stop(): Promise<any>;
}
