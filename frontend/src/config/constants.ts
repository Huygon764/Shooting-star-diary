// Auth constants
export const AUTH = {
  DEFAULT_USERNAME: 'hehe',
  TOKEN_KEY: 'authToken',
  USER_KEY: 'user',
} as const;

// API endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/users/login',
  },
  ENTRIES: {
    CREATE: '/entries',
  },
} as const;

// Toast messages
export const MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Chào mừng công chúa trở lại! 👸✨',
    LOGIN_FAILED: 'Mật khẩu không đúng rồi! 😢',
    LOGOUT_SUCCESS: 'Tạm biệt công chúa! 👋✨',
    SESSION_EXPIRED: 'Phiên đăng nhập hết hạn, đăng nhập lại nhé! 🔐',
    PASSWORD_REQUIRED: 'Nhập mật khẩu đi nào! 🥺',
  },
  ENTRY: {
    CREATED: 'Tâm sự của cậu đã được gửi lên những vì sao rồi nè! ✨🌟',
    EMPTY_CONTENT: 'Cậu chưa viết gì nè... 🥺',
  },
  ERROR: {
    NETWORK: 'Không thể kết nối tới server! 🔧',
    UNKNOWN: 'Có lỗi xảy ra, thử lại nhé! 😔',
  },
} as const;

// Toast types
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
} as const;

export type ToastType = (typeof TOAST_TYPES)[keyof typeof TOAST_TYPES];
