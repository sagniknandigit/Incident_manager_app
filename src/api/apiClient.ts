import axios from 'axios';

import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5001/api';
  }
  return 'http://localhost:5001/api';
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
});

import AsyncStorage from '@react-native-async-storage/async-storage';

apiClient.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log('[API] Interceptor - Token from storage:', token ? 'FOUND' : 'MISSING');
    if (token) {
      // Handle AxiosHeaders object (Axios v1+) or plain object
      if (typeof (config.headers as any).set === 'function') {
        (config.headers as any).set('Authorization', `Bearer ${token}`);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log('[API] Interceptor - Header set: YES for token', token.substring(0, 5));
    }
  } catch (error) {
    console.error('[API] Interceptor Error:', error);
  }
  return config;
});

export default apiClient;
