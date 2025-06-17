package com.diandeng.plugin.esptouch;

import com.espressif.iot.esptouch2.provision.EspProvisioningResult;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "Esptouch")
public class EsptouchPlugin extends Plugin {

    private Esptouch implementation;

    @Override
    public void load() {
        super.load();
        implementation = new Esptouch(getContext());
        implementation.setCallback(
            new Esptouch.EsptouchCallback() {
                @Override
                public void onSyncEvent(String type, String message) {
                    JSObject event = new JSObject();
                    event.put("type", type);
                    event.put("message", message);
                    notifyListeners("syncEvent", event);
                }

                @Override
                public void onProvisioningEvent(String type, String message) {
                    JSObject event = new JSObject();
                    event.put("type", type);
                    event.put("message", message);
                    notifyListeners("provisioningEvent", event);
                }

                @Override
                public void onProvisioningResult(EspProvisioningResult result) {
                    JSObject resultObj = new JSObject();
                    resultObj.put("ip", result.address != null ? result.address.getHostAddress() : "");
                    resultObj.put("mac", result.bssid != null ? result.bssid : "");
                    resultObj.put("success", result.address != null && result.bssid != null);
                    notifyListeners("provisioningResult", resultObj);
                }
            }
        );
    }

    @PluginMethod
    public void startSync(PluginCall call) {
        try {
            implementation.startSync();
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to start sync: " + e.getMessage());
        }
    }

    @PluginMethod
    public void stopSync(PluginCall call) {
        try {
            implementation.stopSync();
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to stop sync: " + e.getMessage());
        }
    }

    @PluginMethod
    public void startProvisioning(PluginCall call) {
        try {
            String ssid = call.getString("ssid");
            String bssid = call.getString("bssid");
            String password = call.getString("password");
            String reservedData = call.getString("reservedData");
            String aesKey = call.getString("aesKey");

            if (bssid == null || bssid.isEmpty()) {
                call.reject("BSSID is required");
                return;
            }

            implementation.startProvisioning(ssid, bssid, password, reservedData, aesKey);
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to start provisioning: " + e.getMessage());
        }
    }

    @PluginMethod
    public void stopProvisioning(PluginCall call) {
        try {
            implementation.stopProvisioning();
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to stop provisioning: " + e.getMessage());
        }
    }

    @PluginMethod
    public void close(PluginCall call) {
        try {
            implementation.close();
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to close provisioner: " + e.getMessage());
        }
    }

    @Override
    protected void handleOnDestroy() {
        super.handleOnDestroy();
        if (implementation != null) {
            implementation.close();
        }
    }
}
