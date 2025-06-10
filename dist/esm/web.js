import { WebPlugin } from '@capacitor/core';
export class EsptouchWeb extends WebPlugin {
    async start(options) {
        console.log('ESP-Touch start called with:', options);
        throw this.unavailable('Not implemented on web.');
    }
    async stop() {
        console.log('ESP-Touch stop called');
        throw this.unavailable('Not implemented on web.');
    }
}
//# sourceMappingURL=web.js.map