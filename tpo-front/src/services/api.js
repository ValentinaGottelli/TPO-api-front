import axios from 'axios';
import { store } from '../store';

const API_BASE_URL = import.meta.env.DEV ? '/api' : 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
});

api.interceptors.request.use(function (config) {
  const token = store.getState()?.auth?.token;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("🔑 Token configured from Redux store");
  } else {
    console.log("⚠️ No token found in Redux store");
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('🚫 Unauthorized - redirecting to auth');
      window.location.href = '/auth';
    } else if (error.response?.status === 403) {
      console.error('🚫 Forbidden - insufficient permissions');
    }
    return Promise.reject(error);
  }
);

export default api;
