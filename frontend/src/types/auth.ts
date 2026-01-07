import type { User } from './models.js';

// Login
export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthData {
  user: User;
  token: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: AuthData;
}

// Auth state (for Pinia store)
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
