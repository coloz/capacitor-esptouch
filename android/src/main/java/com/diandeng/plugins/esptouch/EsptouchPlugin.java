package com.diandeng.plugins.esptouch;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "Esptouch")
public class EsptouchPlugin extends Plugin {

    private Esptouch implementation = new Esptouch();

    @PluginMethod
    public void echo(PluginCall call) {
        String value = call.getString("value");

        JSObject ret = new JSObject();
        ret.put("value", implementation.echo(value));
        call.resolve(ret);
    }

    @PluginMethod
    public void start(PluginCall call) {
        call.resolve("");
    }

    @PluginMethod
    public void stop(PluginCall call) {
        call.resolve("");
    }

    @PluginMethod
    public void onError(Exception e) {
        call.resolve("");
    }
}
