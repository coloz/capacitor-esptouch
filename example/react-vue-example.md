# React/Vue 使用示例

## React Hook 示例

### useEspTouch.ts (React Hook)
```typescript
import { useState, useEffect, useCallback } from 'react';
import { Esptouch, EsptouchProvisioningRequest, EsptouchProvisionResult } from 'capacitor-esptouch';

interface EspTouchState {
  isProvisioning: boolean;
  isSyncing: boolean;
  message: string;
  results: EsptouchProvisionResult[];
  error: string | null;
}

export const useEspTouch = () => {
  const [state, setState] = useState<EspTouchState>({
    isProvisioning: false,
    isSyncing: false,
    message: '',
    results: [],
    error: null
  });

  useEffect(() => {
    setupEventListeners();
    
    return () => {
      cleanup();
    };
  }, []);

  const setupEventListeners = async () => {
    try {
      // 监听配网结果
      await Esptouch.addListener('provisioningResult', (result: EsptouchProvisionResult) => {
        setState(prev => ({
          ...prev,
          results: [...prev.results, result],
          message: result.success ? `设备配网成功: ${result.ip}` : '设备配网失败'
        }));
      });

      // 监听配网事件
      await Esptouch.addListener('provisioningEvent', (event) => {
        setState(prev => ({
          ...prev,
          isProvisioning: event.type === 'start',
          message: event.type === 'error' ? `配网错误: ${event.message}` : 
                  event.type === 'start' ? '配网已开始...' : '配网已停止',
          error: event.type === 'error' ? event.message || '未知错误' : null
        }));
      });

      // 监听同步事件
      await Esptouch.addListener('syncEvent', (event) => {
        setState(prev => ({
          ...prev,
          isSyncing: event.type === 'start',
          error: event.type === 'error' ? event.message || '同步错误' : null
        }));
      });
    } catch (error) {
      console.error('设置事件监听器失败:', error);
    }
  };

  const startProvisioning = useCallback(async (config: EsptouchProvisioningRequest) => {
    try {
      setState(prev => ({ ...prev, results: [], error: null, message: '准备开始配网...' }));
      
      await Esptouch.startSync();
      await Esptouch.startProvisioning(config);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '启动配网失败';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  const stopProvisioning = useCallback(async () => {
    try {
      await Esptouch.stopProvisioning();
      await Esptouch.stopSync();
    } catch (error) {
      console.error('停止配网失败:', error);
    }
  }, []);

  const cleanup = useCallback(async () => {
    try {
      await stopProvisioning();
      await Esptouch.removeAllListeners();
      await Esptouch.close();
    } catch (error) {
      console.error('清理资源失败:', error);
    }
  }, [stopProvisioning]);

  const clearResults = useCallback(() => {
    setState(prev => ({ ...prev, results: [], error: null }));
  }, []);

  return {
    ...state,
    startProvisioning,
    stopProvisioning,
    clearResults,
    cleanup
  };
};
```

### ProvisioningComponent.tsx (React 组件)
```tsx
import React, { useState } from 'react';
import { useEspTouch } from './hooks/useEspTouch';

interface FormData {
  ssid: string;
  bssid: string;
  password: string;
  reservedData: string;
  aesKey: string;
}

const ProvisioningComponent: React.FC = () => {
  const {
    isProvisioning,
    isSyncing,
    message,
    results,
    error,
    startProvisioning,
    stopProvisioning,
    clearResults
  } = useEspTouch();

  const [formData, setFormData] = useState<FormData>({
    ssid: '',
    bssid: '',
    password: '',
    reservedData: '',
    aesKey: ''
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStart = async () => {
    if (!formData.ssid || !formData.bssid) {
      alert('请填写SSID和BSSID');
      return;
    }

    try {
      await startProvisioning({
        ssid: formData.ssid,
        bssid: formData.bssid,
        password: formData.password || undefined,
        reservedData: formData.reservedData || undefined,
        aesKey: formData.aesKey || undefined
      });
    } catch (error) {
      alert(`启动配网失败: ${error}`);
    }
  };

  const handleStop = async () => {
    try {
      await stopProvisioning();
    } catch (error) {
      alert(`停止配网失败: ${error}`);
    }
  };

  return (
    <div className="provisioning-container">
      <h2>EspTouch 设备配网</h2>
      
      {/* 配置表单 */}
      <div className="form-section">
        <h3>WiFi配置</h3>
        <div className="form-group">
          <label>WiFi名称 (SSID) *</label>
          <input
            type="text"
            value={formData.ssid}
            onChange={(e) => handleInputChange('ssid', e.target.value)}
            placeholder="请输入WiFi名称"
            required
          />
        </div>
        
        <div className="form-group">
          <label>WiFi地址 (BSSID) *</label>
          <input
            type="text"
            value={formData.bssid}
            onChange={(e) => handleInputChange('bssid', e.target.value)}
            placeholder="aa:bb:cc:dd:ee:ff"
            pattern="^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$"
            required
          />
        </div>
        
        <div className="form-group">
          <label>WiFi密码</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="请输入WiFi密码"
          />
        </div>
        
        <div className="form-group">
          <label>自定义数据</label>
          <input
            type="text"
            value={formData.reservedData}
            onChange={(e) => handleInputChange('reservedData', e.target.value)}
            placeholder="可选的自定义数据"
          />
        </div>
        
        <div className="form-group">
          <label>AES密钥 (16字节)</label>
          <input
            type="text"
            value={formData.aesKey}
            onChange={(e) => handleInputChange('aesKey', e.target.value)}
            placeholder="16字节的AES密钥"
            maxLength={16}
          />
        </div>
      </div>

      {/* 状态显示 */}
      <div className="status-section">
        <h3>配网状态</h3>
        <div className="status-item">
          <span className={`status-indicator ${isProvisioning ? 'active' : ''}`}>●</span>
          配网状态: {isProvisioning ? '进行中' : '已停止'}
        </div>
        <div className="status-item">
          <span className={`status-indicator ${isSyncing ? 'active' : ''}`}>●</span>
          同步状态: {isSyncing ? '进行中' : '已停止'}
        </div>
        {message && (
          <div className="status-message">{message}</div>
        )}
        {error && (
          <div className="status-error">错误: {error}</div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="button-section">
        <button
          onClick={handleStart}
          disabled={isProvisioning || !formData.ssid || !formData.bssid}
          className="btn-primary"
        >
          {isProvisioning ? '配网中...' : '开始配网'}
        </button>
        
        <button
          onClick={handleStop}
          disabled={!isProvisioning}
          className="btn-secondary"
        >
          停止配网
        </button>
      </div>

      {/* 配网结果 */}
      {results.length > 0 && (
        <div className="results-section">
          <div className="results-header">
            <h3>配网结果</h3>
            <button onClick={clearResults} className="btn-clear">
              清空
            </button>
          </div>
          <div className="results-list">
            {results.map((result, index) => (
              <div
                key={index}
                className={`result-item ${result.success ? 'success' : 'failure'}`}
              >
                <div className="result-status">
                  {result.success ? '✅' : '❌'} {result.success ? '成功' : '失败'}
                </div>
                <div className="result-details">
                  <div>IP: {result.ip}</div>
                  <div>MAC: {result.mac}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProvisioningComponent;
```

## Vue Composition API 示例

### useEspTouch.ts (Vue Composable)
```typescript
import { ref, reactive, onUnmounted } from 'vue';
import { Esptouch, EsptouchProvisioningRequest, EsptouchProvisionResult } from 'capacitor-esptouch';

export const useEspTouch = () => {
  const isProvisioning = ref(false);
  const isSyncing = ref(false);
  const message = ref('');
  const error = ref<string | null>(null);
  const results = ref<EsptouchProvisionResult[]>([]);

  const setupEventListeners = async () => {
    try {
      await Esptouch.addListener('provisioningResult', (result: EsptouchProvisionResult) => {
        results.value.push(result);
        message.value = result.success ? `设备配网成功: ${result.ip}` : '设备配网失败';
      });

      await Esptouch.addListener('provisioningEvent', (event) => {
        isProvisioning.value = event.type === 'start';
        if (event.type === 'error') {
          error.value = event.message || '未知错误';
          message.value = `配网错误: ${event.message}`;
        } else {
          error.value = null;
          message.value = event.type === 'start' ? '配网已开始...' : '配网已停止';
        }
      });

      await Esptouch.addListener('syncEvent', (event) => {
        isSyncing.value = event.type === 'start';
        if (event.type === 'error') {
          error.value = event.message || '同步错误';
        }
      });
    } catch (err) {
      console.error('设置事件监听器失败:', err);
    }
  };

  const startProvisioning = async (config: EsptouchProvisioningRequest) => {
    try {
      results.value = [];
      error.value = null;
      message.value = '准备开始配网...';
      
      await Esptouch.startSync();
      await Esptouch.startProvisioning(config);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '启动配网失败';
      error.value = errorMessage;
      throw err;
    }
  };

  const stopProvisioning = async () => {
    try {
      await Esptouch.stopProvisioning();
      await Esptouch.stopSync();
    } catch (err) {
      console.error('停止配网失败:', err);
    }
  };

  const cleanup = async () => {
    try {
      await stopProvisioning();
      await Esptouch.removeAllListeners();
      await Esptouch.close();
    } catch (err) {
      console.error('清理资源失败:', err);
    }
  };

  const clearResults = () => {
    results.value = [];
    error.value = null;
  };

  // 组件挂载时设置监听器
  setupEventListeners();

  // 组件卸载时清理资源
  onUnmounted(() => {
    cleanup();
  });

  return {
    isProvisioning,
    isSyncing,
    message,
    error,
    results,
    startProvisioning,
    stopProvisioning,
    clearResults,
    cleanup
  };
};
```

### ProvisioningComponent.vue
```vue
<template>
  <div class="provisioning-container">
    <h2>EspTouch 设备配网</h2>
    
    <!-- 配置表单 -->
    <div class="form-section">
      <h3>WiFi配置</h3>
      <div class="form-group">
        <label>WiFi名称 (SSID) *</label>
        <input
          v-model="formData.ssid"
          type="text"
          placeholder="请输入WiFi名称"
          required
        />
      </div>
      
      <div class="form-group">
        <label>WiFi地址 (BSSID) *</label>
        <input
          v-model="formData.bssid"
          type="text"
          placeholder="aa:bb:cc:dd:ee:ff"
          pattern="^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$"
          required
        />
      </div>
      
      <div class="form-group">
        <label>WiFi密码</label>
        <input
          v-model="formData.password"
          type="password"
          placeholder="请输入WiFi密码"
        />
      </div>
      
      <div class="form-group">
        <label>自定义数据</label>
        <input
          v-model="formData.reservedData"
          type="text"
          placeholder="可选的自定义数据"
        />
      </div>
      
      <div class="form-group">
        <label>AES密钥 (16字节)</label>
        <input
          v-model="formData.aesKey"
          type="text"
          placeholder="16字节的AES密钥"
          maxlength="16"
        />
      </div>
    </div>

    <!-- 状态显示 -->
    <div class="status-section">
      <h3>配网状态</h3>
      <div class="status-item">
        <span :class="['status-indicator', { active: isProvisioning }]">●</span>
        配网状态: {{ isProvisioning ? '进行中' : '已停止' }}
      </div>
      <div class="status-item">
        <span :class="['status-indicator', { active: isSyncing }]">●</span>
        同步状态: {{ isSyncing ? '进行中' : '已停止' }}
      </div>
      <div v-if="message" class="status-message">{{ message }}</div>
      <div v-if="error" class="status-error">错误: {{ error }}</div>
    </div>

    <!-- 操作按钮 -->
    <div class="button-section">
      <button
        @click="handleStart"
        :disabled="isProvisioning || !formData.ssid || !formData.bssid"
        class="btn-primary"
      >
        {{ isProvisioning ? '配网中...' : '开始配网' }}
      </button>
      
      <button
        @click="handleStop"
        :disabled="!isProvisioning"
        class="btn-secondary"
      >
        停止配网
      </button>
    </div>

    <!-- 配网结果 -->
    <div v-if="results.length > 0" class="results-section">
      <div class="results-header">
        <h3>配网结果</h3>
        <button @click="clearResults" class="btn-clear">清空</button>
      </div>
      <div class="results-list">
        <div
          v-for="(result, index) in results"
          :key="index"
          :class="['result-item', result.success ? 'success' : 'failure']"
        >
          <div class="result-status">
            {{ result.success ? '✅' : '❌' }} {{ result.success ? '成功' : '失败' }}
          </div>
          <div class="result-details">
            <div>IP: {{ result.ip }}</div>
            <div>MAC: {{ result.mac }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useEspTouch } from './composables/useEspTouch';

const {
  isProvisioning,
  isSyncing,
  message,
  error,
  results,
  startProvisioning,
  stopProvisioning,
  clearResults
} = useEspTouch();

const formData = reactive({
  ssid: '',
  bssid: '',
  password: '',
  reservedData: '',
  aesKey: ''
});

const handleStart = async () => {
  if (!formData.ssid || !formData.bssid) {
    alert('请填写SSID和BSSID');
    return;
  }

  try {
    await startProvisioning({
      ssid: formData.ssid,
      bssid: formData.bssid,
      password: formData.password || undefined,
      reservedData: formData.reservedData || undefined,
      aesKey: formData.aesKey || undefined
    });
  } catch (err) {
    alert(`启动配网失败: ${err}`);
  }
};

const handleStop = async () => {
  try {
    await stopProvisioning();
  } catch (err) {
    alert(`停止配网失败: ${err}`);
  }
};
</script>

<style scoped>
/* 样式定义 */
.provisioning-container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.form-section, .status-section, .results-section {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.status-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.status-indicator {
  margin-right: 10px;
  font-size: 12px;
  color: #ccc;
}

.status-indicator.active {
  color: #4CAF50;
}

.status-message {
  color: #2196F3;
  font-weight: bold;
}

.status-error {
  color: #f44336;
  font-weight: bold;
}

.button-section {
  display: flex;
  gap: 10px;
}

.btn-primary, .btn-secondary, .btn-clear {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-secondary {
  background-color: #f44336;
  color: white;
}

.btn-clear {
  background-color: #FF9800;
  color: white;
}

.btn-primary:disabled, .btn-secondary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.result-item {
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-item.success {
  background-color: #e8f5e8;
  border: 1px solid #4CAF50;
}

.result-item.failure {
  background-color: #ffeaa7;
  border: 1px solid #f44336;
}

.result-details div {
  font-size: 12px;
  color: #666;
}
</style>
```

这些示例提供了在React和Vue项目中使用EspTouch插件的完整解决方案，包括状态管理、事件处理和用户界面。
