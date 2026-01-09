<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { StarryBackground, FloatingHearts } from '@/components/common';
import { MESSAGES } from '@/config';
import { useToast } from '@/hooks/useToast';
import { useCreateEntryMutation } from '@/hooks/useEntryMutation';

const router = useRouter();
const authStore = useAuthStore();
const { showToast } = useToast();
const { mutate: createEntry, isPending } = useCreateEntryMutation();

const diaryInput = ref('');

const handleSubmit = () => {
  if (!diaryInput.value.trim()) {
    showToast(MESSAGES.ENTRY.EMPTY_CONTENT, 'warning');
    return;
  }

  createEntry(
    { content: diaryInput.value.trim() },
    {
      onSuccess: () => {
        diaryInput.value = '';
      },
    }
  );
};

const handleLogout = () => {
  authStore.logout();
  showToast(MESSAGES.AUTH.LOGOUT_SUCCESS, 'info');
  router.push('/login');
};
</script>

<template>
  <div class="min-h-screen relative">
    <!-- Background -->
    <StarryBackground />
    <FloatingHearts />

    <!-- Main Content -->
    <div class="relative z-10 max-w-3xl mx-auto px-5 py-8">
      <!-- Header -->
      <div class="text-center mb-8 relative">
        <h1 class="text-white text-4xl md:text-5xl font-bold drop-shadow-lg">
          ✨ Vườn Sao Băng ✨
        </h1>

        <!-- Logout button -->
        <button
          class="absolute right-0 -bottom-1
                 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500
                 text-white text-sm rounded-full
                 hover:shadow-lg hover:shadow-pink-500/30 transition-all cursor-pointer"
          @click="handleLogout"
        >
          Thoát 👋
        </button>
      </div>

      <!-- Welcome Message -->
      <div class="glass-card text-center mb-8">
        <p class="text-white text-lg mb-2">✨ Hiii công chúa của tớ ❤️👸</p>
        <p class="text-white text-lg mb-2">
          Chào mừng cậu tới
          <span class="text-pink-300 font-bold drop-shadow-md">
            Vườn Sao Bănggg 🌠
          </span>
        </p>
        <p class="text-white text-lg">
          — nơi dành riêng cho trái tim bé nhỏ của cậu 💖💭
        </p>
      </div>

      <!-- Main Card -->
      <div class="card">
        <!-- Intro Text -->
        <div class="text-center mb-8">
          <p class="text-purple-900 text-lg mb-2">
            Đây là nơi mà mỗi khi thấy buồn 😢, thấy mệt 🥺,
          </p>
          <p class="text-purple-900 text-lg mb-2">
            hay đơn giản là có điều gì muốn chia sẻ...
          </p>
          <p class="text-purple-900 text-lg">
            Thì cậu có thể ghé vào đây viết vài dòng nèee ✍️🌙
          </p>
        </div>

        <!-- Diary Form -->
        <div class="mb-8">
          <textarea
            v-model="diaryInput"
            placeholder="Viết tâm sự của cậu ở đây nha... 💭✨"
            class="textarea-primary w-full p-2 rounded-lg border border-gray-100 outline-gray-500"
            :disabled="isPending"
          ></textarea>

          <button
            class="btn-primary w-full mt-5"
            :disabled="isPending || !diaryInput.trim()"
            @click="handleSubmit"
          >
            {{ isPending ? 'Đang gửi... ⏳' : 'Gửi lên những vì sao 🌟' }}
          </button>
        </div>

        <!-- Comfort Message -->
        <div class="text-center p-5 bg-purple-50 rounded-2xl mb-8">
          <p class="text-purple-700 mb-1">Dù chỉ là nỗi buồn lướt qua thuiiii,</p>
          <p class="text-purple-700 mb-4">
            thì nhớ là sẽ luôn có ai đó lắng nghe cậu nèee 👂🩵💫
          </p>
          <p class="text-purple-700 mb-1">
            Cho nên là hông cần phải gồng mình lên đâu nha 🥹💪
          </p>
          <p class="text-purple-700">
            Cũng hông cần phải nói điều gì nếu chưa sẵn sàng đâu nè 🤫🫶
          </p>
        </div>

        <!-- Quote Box -->
        <div
          class="bg-gradient-to-br from-pink-50 to-pink-100 
                 rounded-2xl p-6 text-center border-2 border-pink-200"
        >
          <p class="text-pink-700 text-lg italic font-semibold">
            🌷 "Trong khu vườn này, mọi cảm xúc của công chúa đều được yêu thương."
            ❤️💞🌈✨
          </p>
        </div>
      </div>
    </div>
  </div>
</template>