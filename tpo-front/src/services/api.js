import axios from 'axios';

// En api.js - debe estar así:
const API_BASE_URL = import.meta.env.DEV ? '/api' : 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
  withCredentials: true, // Important for CORS with cookies
});

// Request interceptor to add auth token
// En api.js, en el interceptor
api.interceptors.request.use(
  (config) => {
    console.log("🚀 URL COMPLETA:", config.baseURL + config.url); // ✅ Agregar esta línea
    console.log("BASE_URL = " + API_BASE_URL)
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        headers: config.headers
      });
    }
    
    return config;
  },
  // ...resto igual

  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error);
    
    const { response } = error;
    
    if (response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token');
      localStorage.removeItem('marketplace_user');
      
      // Only redirect if not already on auth pages
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/register')) {
        window.location.href = '/';
      }
    } else if (response?.status === 403) {
      console.error('Access forbidden - insufficient permissions');
    } else if (response?.status >= 500) {
      console.error('Server error - please try again later');
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - please check your connection');
    } else if (!response) {
      console.error('Network error - please check your connection');
    }
    
    return Promise.reject(error);
  }
);

export default api;