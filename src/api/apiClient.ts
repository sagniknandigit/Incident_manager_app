import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5001/api';
  }
  return 'http://localhost:5001/api';
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        const finalToken = `Bearer ${token}`;

        // Ensure headers object exists
        config.headers = config.headers || {};

        // Priority 1: Use the .set() method if available (Axios 1.x standard)
        if (config.headers.set) {
          config.headers.set('Authorization', finalToken);
        }
        // Priority 2: Direct assignment to Authorization property
        else if (config.headers.Authorization !== undefined || Object.isExtensible(config.headers)) {
          (config.headers as any)['Authorization'] = finalToken;
        }

        // Log for frontend debugging
        console.log(`[Axios] Attached token to ${config.url}`);
      }
    } catch (error) {
      console.error('[Axios Interceptor] Token Error:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
