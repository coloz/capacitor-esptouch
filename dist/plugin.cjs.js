'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@capacitor/core');

const Esptouch = core.registerPlugin('Esptouch', {
    web: () => Promise.resolve().then(function () { return web; }).then(m => new m.EsptouchWeb()),
});

class EsptouchWeb extends core.WebPlugin {
    async start(
    // @ts-ignore
    options) {
        throw this.unimplemented('Not implemented on web.');
    }
    async stop() {
        throw this.unimplemented('Not implemented on web.');
    }
}

var web = /*#__PURE__*/Object.freeze({
    __proto__: null,
    EsptouchWeb: EsptouchWeb
});

exports.Esptouch = Esptouch;
//# sourceMappingURL=plugin.cjs.js.map
