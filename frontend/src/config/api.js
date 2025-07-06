// API configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000
}

// App configuration
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'Vườn Sao Băng',
  version: import.meta.env.VITE_APP_VERSION || '2.0.0'
}

// API endpoints
export const ENDPOINTS = {
  auth: {
    login: '/users/login',
    register: '/users/register',
    profile: '/users/profile'
  },
  entries: {
    create: '/entries',
    list: '/entries',
    userEntries: (userId) => `/entries/user/${userId}`,
    detail: (id) => `/entries/${id}`,
    update: (id) => `/entries/${id}`,
    delete: (id) => `/entries/${id}`
  }
}

// Helper function to build full URL
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.baseURL}${endpoint}`
}
