import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

// Route meta types
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    guestOnly?: boolean;
  }
}

// Route definitions
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/diary',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      guestOnly: true,
    },
  },
  {
    path: '/diary',
    name: 'Diary',
    component: () => import('@/views/DiaryView.vue'),
    meta: {
      requiresAuth: true,
    },
  },
  {
    // Catch all - redirect to diary
    path: '/:pathMatch(.*)*',
    redirect: '/diary',
  },
];

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  // Check auth on first load
  if (!authStore.isAuthenticated) {
    authStore.checkAuth();
  }

  const isAuthenticated = authStore.isAuthenticated;

  // Route requires auth but user not logged in
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' });
    return;
  }

  // Route is guest only but user is logged in
  if (to.meta.guestOnly && isAuthenticated) {
    next({ name: 'Diary' });
    return;
  }

  // Allow navigation
  next();
});

export default router;
