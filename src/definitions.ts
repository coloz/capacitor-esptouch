export interface EsptouchPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;

  start(options: {
    ssid: string,
    bssid?: string,
    password?: string,
    aesKey?: string,
    customData?: string
  }): Promise<any>;
  stop(): Promise<any>;
}
