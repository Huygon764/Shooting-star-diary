import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { AUTH } from '@/config';
import type { User } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isLoading = ref(false);

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value);

  // Actions
  const setAuth = (newUser: User, newToken: string) => {
    user.value = newUser;
    token.value = newToken;

    // Save to localStorage
    localStorage.setItem(AUTH.TOKEN_KEY, newToken);
    localStorage.setItem(AUTH.USER_KEY, JSON.stringify(newUser));
  };

  const logout = () => {
    user.value = null;
    token.value = null;

    // Clear localStorage
    localStorage.removeItem(AUTH.TOKEN_KEY);
    localStorage.removeItem(AUTH.USER_KEY);
  };

  const checkAuth = () => {
    isLoading.value = true;

    try {
      const savedToken = localStorage.getItem(AUTH.TOKEN_KEY);
      const savedUser = localStorage.getItem(AUTH.USER_KEY);

      if (savedToken && savedUser) {
        token.value = savedToken;
        user.value = JSON.parse(savedUser) as User;
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      logout();
    } finally {
      isLoading.value = false;
    }
  };

  const setLoading = (value: boolean) => {
    isLoading.value = value;
  };

  return {
    // State
    user,
    token,
    isLoading,

    // Getters
    isAuthenticated,

    // Actions
    setAuth,
    logout,
    checkAuth,
    setLoading,
  };
});
