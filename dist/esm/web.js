import { WebPlugin } from '@capacitor/core';
export class EsptouchWeb extends WebPlugin {
    async start(
    // @ts-ignore
    options) {
        throw this.unimplemented('Not implemented on web.');
    }
    async stop() {
        throw this.unimplemented('Not implemented on web.');
    }
}
//# sourceMappingURL=web.js.map