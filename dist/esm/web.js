import { WebPlugin } from '@capacitor/core';
export class EsptouchWeb extends WebPlugin {
    async startSync() {
        console.log('EspTouch Web: startSync called - not supported on web');
        throw new Error('EspTouch is not supported on web platform');
    }
    async stopSync() {
        console.log('EspTouch Web: stopSync called - not supported on web');
        throw new Error('EspTouch is not supported on web platform');
    }
    async startProvisioning(request) {
        console.log('EspTouch Web: startProvisioning called - not supported on web', request);
        throw new Error('EspTouch is not supported on web platform');
    }
    async stopProvisioning() {
        console.log('EspTouch Web: stopProvisioning called - not supported on web');
        throw new Error('EspTouch is not supported on web platform');
    }
    async close() {
        console.log('EspTouch Web: close called - not supported on web');
        throw new Error('EspTouch is not supported on web platform');
    }
    async addListener(eventName, listenerFunc) {
        console.log('EspTouch Web: addListener called - not supported on web', eventName, listenerFunc);
        throw new Error('EspTouch is not supported on web platform');
    }
    async removeAllListeners() {
        console.log('EspTouch Web: removeAllListeners called - not supported on web');
        throw new Error('EspTouch is not supported on web platform');
    }
}
//# sourceMappingURL=web.js.map