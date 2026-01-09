export interface Env {
  apiUrl: string;
  appName: string;
  appVersion: string;
  isDev: boolean;
  isProd: boolean;
}

export const env: Env = {
  // In production with reverse proxy, API is at /api
  // In development, API is at http://localhost:5000/api
  apiUrl: import.meta.env.VITE_API_URL || "/api",
  appName: import.meta.env.VITE_APP_NAME || "Vườn Sao Băng",
  appVersion: import.meta.env.VITE_APP_VERSION || "2.0.0",
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
};
