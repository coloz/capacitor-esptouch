import { registerPlugin } from '@capacitor/core';

import type { EsptouchPlugin } from './definitions';

const Esptouch = registerPlugin<EsptouchPlugin>('Esptouch', {
  web: () => import('./web').then(m => new m.EsptouchWeb()),
});

export * from './definitions';
export { Esptouch };
