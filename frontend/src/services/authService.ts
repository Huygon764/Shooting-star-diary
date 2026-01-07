import apiClient from '@/libs/axios';
import { ENDPOINTS } from '@/config';
import type { LoginRequest, LoginResponse } from '@/types';

export const authService = {
  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post(ENDPOINTS.AUTH.LOGIN, data);
  },
};
