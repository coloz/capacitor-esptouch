package com.diandeng.plugin.esptouch;

import android.content.Context;
import android.util.Log;
import com.espressif.iot.esptouch2.provision.EspProvisioner;
import com.espressif.iot.esptouch2.provision.EspProvisioningListener;
import com.espressif.iot.esptouch2.provision.EspProvisioningRequest;
import com.espressif.iot.esptouch2.provision.EspProvisioningResult;
import com.espressif.iot.esptouch2.provision.EspSyncListener;
import com.espressif.iot.esptouch2.provision.TouchNetUtil;

public class Esptouch {

    private static final String TAG = "Esptouch";
    private EspProvisioner provisioner;
    private Context context;
    private EsptouchCallback callback;

    public interface EsptouchCallback {
        void onSyncEvent(String type, String message);
        void onProvisioningEvent(String type, String message);
        void onProvisioningResult(EspProvisioningResult result);
    }

    public Esptouch(Context context) {
        this.context = context;
        this.provisioner = new EspProvisioner(context);
    }

    public void setCallback(EsptouchCallback callback) {
        this.callback = callback;
    }

    public void startSync() {
        Log.d(TAG, "Starting sync packets");
        EspSyncListener listener = new EspSyncListener() {
            @Override
            public void onStart() {
                Log.d(TAG, "Sync started");
                if (callback != null) {
                    callback.onSyncEvent("start", "Sync packets started");
                }
            }

            @Override
            public void onStop() {
                Log.d(TAG, "Sync stopped");
                if (callback != null) {
                    callback.onSyncEvent("stop", "Sync packets stopped");
                }
            }

            @Override
            public void onError(Exception e) {
                Log.e(TAG, "Sync error: " + e.getMessage(), e);
                if (callback != null) {
                    callback.onSyncEvent("error", e.getMessage());
                }
            }
        };
        provisioner.startSync(listener);
    }

    public void stopSync() {
        Log.d(TAG, "Stopping sync packets");
        provisioner.stopSync();
    }

    public void startProvisioning(String ssid, String bssid, String password, String reservedData, String aesKey) {
        Log.d(TAG, "Starting provisioning for BSSID: " + bssid);

        try {
            EspProvisioningRequest.Builder builder = new EspProvisioningRequest.Builder(context);

            // 设置SSID（可选）
            if (ssid != null && !ssid.isEmpty()) {
                builder.setSSID(ssid.getBytes());
            }

            // 设置BSSID（必需）
            if (bssid != null && !bssid.isEmpty()) {
                byte[] bssidBytes = TouchNetUtil.convertBssid2Bytes(bssid);
                if (bssidBytes != null) {
                    builder.setBSSID(bssidBytes);
                } else {
                    if (callback != null) {
                        callback.onProvisioningEvent("error", "Invalid BSSID format: " + bssid);
                    }
                    return;
                }
            } else {
                if (callback != null) {
                    callback.onProvisioningEvent("error", "BSSID is required");
                }
                return;
            }

            // 设置密码（可选）
            if (password != null && !password.isEmpty()) {
                builder.setPassword(password.getBytes());
            }

            // 设置保留数据（可选）
            if (reservedData != null && !reservedData.isEmpty()) {
                builder.setReservedData(reservedData.getBytes());
            }

            // 设置AES密钥（可选）
            if (aesKey != null && !aesKey.isEmpty()) {
                if (aesKey.length() == 16) {
                    builder.setAESKey(aesKey.getBytes());
                } else {
                    Log.w(TAG, "AES key must be 16 bytes, ignoring provided key");
                }
            }

            EspProvisioningRequest request = builder.build();

            EspProvisioningListener listener = new EspProvisioningListener() {
                @Override
                public void onStart() {
                    Log.d(TAG, "Provisioning started");
                    if (callback != null) {
                        callback.onProvisioningEvent("start", "Provisioning started");
                    }
                }

                @Override
                public void onResponse(EspProvisioningResult result) {
                    Log.d(TAG, "Provisioning result: " + result.toString());
                    if (callback != null) {
                        callback.onProvisioningResult(result);
                    }
                }

                @Override
                public void onStop() {
                    Log.d(TAG, "Provisioning stopped");
                    if (callback != null) {
                        callback.onProvisioningEvent("stop", "Provisioning stopped");
                    }
                }

                @Override
                public void onError(Exception e) {
                    Log.e(TAG, "Provisioning error: " + e.getMessage(), e);
                    if (callback != null) {
                        callback.onProvisioningEvent("error", e.getMessage());
                    }
                }
            };

            provisioner.startProvisioning(request, listener);
        } catch (Exception e) {
            Log.e(TAG, "Failed to start provisioning: " + e.getMessage(), e);
            if (callback != null) {
                callback.onProvisioningEvent("error", "Failed to start provisioning: " + e.getMessage());
            }
        }
    }

    public void stopProvisioning() {
        Log.d(TAG, "Stopping provisioning");
        provisioner.stopProvisioning();
    }

    public void close() {
        Log.d(TAG, "Closing provisioner");
        if (provisioner != null) {
            provisioner.close();
            provisioner = null;
        }
    }

    public boolean isProvisioning() {
        return provisioner != null && provisioner.isProvisioning();
    }

    public boolean isSyncing() {
        return provisioner != null && provisioner.isSyncing();
    }
}
