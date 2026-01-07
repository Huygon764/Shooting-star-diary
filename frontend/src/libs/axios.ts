import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config';
import { AUTH } from '@/config/constants';

// Create axios instance
const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(AUTH.TOKEN_KEY);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => {
    // Return data directly
    return response.data;
  },
  (error: AxiosError) => {
    // Handle 401 - Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH.TOKEN_KEY);
      localStorage.removeItem(AUTH.USER_KEY);

      // Redirect to login (will be handled by router guard)
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
