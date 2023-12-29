export interface EsptouchPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
