import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { env } from "@/config";
import { AUTH, ENDPOINTS } from "@/config/constants";

// Create axios instance
const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
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
    const requestUrl = error.config?.url || "";

    // Skip redirect for login endpoint - let mutation handle it
    const isLoginRequest = requestUrl.includes(ENDPOINTS.AUTH.LOGIN);

    // Handle 401 - Unauthorized (but not for login)
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem(AUTH.TOKEN_KEY);
      localStorage.removeItem(AUTH.USER_KEY);
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
export default apiClient;
