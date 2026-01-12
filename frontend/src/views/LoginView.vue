<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from '@/hooks/useToast';
import { AUTH, MESSAGES } from '@/config';
import { useLoginMutation } from '@/hooks/useAuthMutation';
import { StarryBackground, FloatingHearts } from '@/components/common';

const password = ref('');
const { mutate: login, isPending } = useLoginMutation();
const { showToast } = useToast();

const handleLogin = () => {
  if (!password.value.trim()) {
    showToast(MESSAGES.AUTH.PASSWORD_REQUIRED, 'warning');
    return;
  }

  login({
    username: AUTH.DEFAULT_USERNAME,
    password: password.value,
  });
};
</script>

<template>
  <div class="fixed inset-0">
    <!-- Background -->
    <StarryBackground />
    <FloatingHearts />

    <!-- Login Card -->
    <div class="relative z-10 flex items-center justify-center min-h-screen px-4">
      <div
        class="bg-white/95 backdrop-blur-sm p-10 rounded-3xl shadow-2xl 
               max-w-md w-full text-center"
      >
        <!-- Header -->
        <div class="mb-8">
          <h2 class="text-purple-800 text-3xl font-bold mb-3">
            ✨ Chào công chúa ✨
          </h2>
          <p class="text-purple-600 text-lg">
            Nhập mật khẩu để vào Vườn Sao Băng nha! 🌟
          </p>
        </div>

        <!-- Form -->
        <div class="space-y-5">
          <input
            v-model="password"
            type="password"
            placeholder="Mật khẩu của công chúa... 🔐"
            class="input-primary text-center"
            :disabled="isPending"
            @keyup.enter="handleLogin"
          />

          <button
            class="btn-primary w-full text-xl"
            :disabled="isPending"
            @click="handleLogin"
          >
            {{ isPending ? 'Đang kiểm tra... ⏳' : 'Vào vườn sao 🌟' }}
          </button>
        </div>

        <!-- Footer -->
        <div class="mt-8">
          <p class="text-purple-500 text-sm italic">
            💖 Clà sao bây thôi nha!!! 💖
          </p>
        </div>
      </div>
    </div>
  </div>
</template>