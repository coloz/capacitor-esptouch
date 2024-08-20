import { registerPlugin } from '@capacitor/core';
const Esptouch = registerPlugin('Esptouch', {
    web: () => import('./web').then(m => new m.EsptouchWeb()),
});
export * from './definitions';
export { Esptouch };
//# sourceMappingURL=index.js.map