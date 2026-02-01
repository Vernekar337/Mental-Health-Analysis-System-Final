import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const JWT_KEY =
  import.meta.env.VITE_JWT_STORAGE_KEY || 'mental_health_jwt';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor
 * Attach JWT token if present
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(JWT_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor
 * Handle UNAUTHORIZED access ONLY for protected routes
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || '';

    const isAuthRoute =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register');

    if (status === 401 && !isAuthRoute) {
  console.error('401 from:', error.config?.url);
  // TEMP: do NOT auto-logout
}


    return Promise.reject(error);
  }
);

export default api;
