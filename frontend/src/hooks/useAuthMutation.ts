import { useMutation } from '@tanstack/vue-query';
import { useRouter } from 'vue-router';
import { AxiosError } from 'axios';
import { authService } from '@/services';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/useToast';
import { MESSAGES } from '@/config';
import type { LoginRequest, AuthData, ApiResponse } from '@/types';

export function useLoginMutation() {
  const router = useRouter();
  const authStore = useAuthStore();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { user, token } = response.data as AuthData;

        // Update store (also saves to localStorage)
        authStore.setAuth(user, token);

        // Show success toast
        showToast(MESSAGES.AUTH.LOGIN_SUCCESS, 'success');

        // Redirect to diary
        router.push('/diary');
      } else {
        // API returned success: false
        showToast(response.message || MESSAGES.AUTH.LOGIN_FAILED, 'error');
      }
    },
    onError: (error: AxiosError<ApiResponse>) => {
      // Get error message from response if available
      const message = error.response?.data?.message || MESSAGES.AUTH.LOGIN_FAILED;
      showToast(message, 'error');
    },
  });
}
