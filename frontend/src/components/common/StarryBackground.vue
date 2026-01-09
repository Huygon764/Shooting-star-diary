<script setup lang="ts">
// Pure presentation component - no logic needed
</script>

<template>
  <div class="fixed inset-0 pointer-events-none">
    <!-- Stars layer -->
    <div class="absolute inset-0 stars-bg z-0"></div>

    <!-- Twinkling layer -->
    <div class="absolute inset-0 twinkling-bg z-1"></div>

    <!-- Shooting star -->
    <div
      class="absolute top-5 -right-[100px] w-[100px] h-0.5 
             bg-linear-to-r from-transparent via-white to-transparent 
             animate-shooting z-2"
    ></div>
  </div>
</template>