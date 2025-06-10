package com.diandeng.plugins.esptouch;

import android.content.Context;
import android.util.Log;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.Arrays;

import com.espressif.iot.esptouch2.provision.EspProvisioner;
import com.espressif.iot.esptouch2.provision.EspProvisioningRequest;
import com.espressif.iot.esptouch2.provision.EspProvisioningListener;
import com.espressif.iot.esptouch2.provision.EspProvisioningResult;
import com.espressif.iot.esptouch2.provision.TouchNetUtil;

@CapacitorPlugin(name = "Esptouch")
public class EsptouchPlugin extends Plugin {
    private static final int AES_KEY_LENGTH = 16;
    private String TAG = "Esptouch";
    private EspProvisioner mProvisioner;

    @PluginMethod
    public void start(PluginCall call) {
        String ssid = call.getString("ssid");
        String bssid = call.getString("bssid");
        String password = call.getString("password");
        String aesKey = call.getString("aesKey");
        String customData = call.getString("customData");

        if (ssid == null) {
            call.reject("SSID is required");
            return;
        }

        if (bssid == null) {
            call.reject("BSSID is required");
            return;
        }

        Context context = getContext();

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
                    device.put("message", "Device connected successfully");
                } catch (Exception e) {
                    Log.e(TAG, "unexpected JSON exception", e);
                    call.reject("unexpected JSON exception", "UNEXPECTED_JSON", e);
                    return;
                }
                call.resolve(device);
                if (mProvisioner != null) {
                    mProvisioner.stopProvisioning();
                }
            }
      
            @Override
            public void onStop() {
                Log.i(TAG, "Esptouch Stop");
            }
      
            @Override
            public void onError(Exception e) {
                Log.i(TAG, "Esptouch Error: " + e.getMessage());
                call.reject(e.getMessage(), "ESPTOUCH_ERROR", e);
            }
        };

        try {
            EspProvisioningRequest.Builder requestBuilder = new EspProvisioningRequest.Builder(context)
                    .setSSID(ssid.getBytes())
                    .setBSSID(TouchNetUtil.convertBssid2Bytes(bssid));
            
            if (password != null) {
                requestBuilder.setPassword(password.getBytes());
            }
            
            if (aesKey != null && aesKey.length() >= AES_KEY_LENGTH) {
                requestBuilder.setAESKey(Arrays.copyOfRange(aesKey.getBytes(), 0, AES_KEY_LENGTH));
            }
            
            if (customData != null) {
                requestBuilder.setReservedData(customData.getBytes());
            }
            
            EspProvisioningRequest request = requestBuilder.build();
            mProvisioner.startProvisioning(request, listener);
        } catch (Exception e) {
            Log.e(TAG, "unexpected exception", e);
            call.reject(e.getMessage(), "ESPTOUCH_ERROR", e);
        }
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
