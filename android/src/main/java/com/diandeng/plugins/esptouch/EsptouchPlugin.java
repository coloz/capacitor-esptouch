package com.diandeng.plugins.esptouch;

import android.content.Context;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import com.espressif.iot.esptouch2.provision.EspProvisioner;
import com.espressif.iot.esptouch2.provision.EspProvisioningRequest;
import com.espressif.iot.esptouch2.provision.EspProvisioningListener;
import com.espressif.iot.esptouch2.provision.EspProvisioningResult;
@CapacitorPlugin(name = "Esptouch")
public class EsptouchPlugin extends Plugin {
    private String TAG = "Esptouch";
    private EspProvisioner mProvisioner;
    private int mWillProvisioningCount = 1;

    @PluginMethod
    public void start(PluginCall call) {
        byte[] ssid = call.getString("ssid").getBytes();
        byte[] bssid = call.getString("bssid").getBytes();
        byte[] password = call.getString("password").getBytes();
        byte[] aesKey = call.getString("aesKey").getBytes();
        byte[] customData = call.getString("customData").getBytes();

        Context context= getContext();

        mProvisioner = new EspProvisioner(context);
        EspProvisioningListener listener = new EspProvisioningListener() {
            @Override
            public void onStart() {
                Log.i(TAG, "Esptouch Start");
            }
      
            @Override
            public void onResponse(EspProvisioningResult result) {
                String mac = result.bssid;
                String host = result.address.getHostAddress();
                Log.d(TAG, "Esptouch Response: " + mac + " " + host);
                JSObject device = new JSObject();
                try {
                    device.put("bssid", result.bssid);
                    device.put("ip", result.address.getHostAddress());
                } catch (Exception e) {
                    Log.e(TAG, "unexpected JSON exception", e);
                }
                call.resolve(device);
                mProvisioner.stopProvisioning();
            }
      
            @Override
            public void onStop() {
                Log.i(TAG, "Esptouch Stop");
            }
      
            @Override
            public void onError(Exception e) {
                Log.i(TAG, "Esptouch Error" + e.getMessage());
                JSObject error = new JSObject();
                error.put("error", e.getMessage());
                call.resolve(error);
            }
        };

        EspProvisioningRequest request = new EspProvisioningRequest.Builder(context)
            .setSSID(ssid)
            .setBSSID(bssid)
            .setPassword(password == null ? null : password)
            .setAESKey(aesKey)
            .setReservedData(customData)
            .build();
        mProvisioner.startProvisioning(request, listener);
    }

    @PluginMethod
    public void stop(PluginCall call) {
        if (mProvisioner != null) {
            mProvisioner.stopProvisioning();
            mProvisioner.close();
            mProvisioner = null;
        }
        call.resolve();
    }
}
