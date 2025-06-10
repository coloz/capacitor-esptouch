'use strict';

var core = require('@capacitor/core');

const Esptouch = core.registerPlugin('Esptouch', {
    web: () => Promise.resolve().then(function () { return web; }).then(m => new m.EsptouchWeb()),
});

class EsptouchWeb extends core.WebPlugin {
    async start(options) {
        console.log('ESP-Touch start called with:', options);
        throw this.unavailable('Not implemented on web.');
    }
    async stop() {
        console.log('ESP-Touch stop called');
        throw this.unavailable('Not implemented on web.');
    }
}

var web = /*#__PURE__*/Object.freeze({
    __proto__: null,
    EsptouchWeb: EsptouchWeb
});

exports.Esptouch = Esptouch;
//# sourceMappingURL=plugin.cjs.js.map
