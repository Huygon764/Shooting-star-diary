import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { VueQueryPlugin } from '@tanstack/vue-query';
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';

import App from './App.vue';
import router from './router';
import { queryClient } from './libs';

// Styles
import '@/assets/styles/main.css';
import 'vue3-toastify/dist/index.css';  // Import CSS ở đây

// Toast options
const toastOptions: ToastContainerOptions = {
  position: 'top-center',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  theme: 'colored',
};

// Create app
const app = createApp(App);

// Plugins
app.use(createPinia());
app.use(router);
app.use(VueQueryPlugin, { queryClient });
app.use(Vue3Toastify, toastOptions);

// Mount
app.mount('#app');
