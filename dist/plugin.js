var capacitorEsptouch = (function (exports, core) {
    'use strict';

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

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({}, capacitorExports);
//# sourceMappingURL=plugin.js.map
