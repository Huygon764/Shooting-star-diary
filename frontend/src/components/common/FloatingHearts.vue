<script setup lang="ts">
const hearts = ['💖', '💫', '🌟'];
</script>

<template>
  <div class="fixed bottom-5 right-5 pointer-events-none z-10">
    <span
      v-for="(heart, index) in hearts"
      :key="index"
      class="absolute text-2xl animate-float"
      :style="{
        right: `${index * 40}px`,
        animationDelay: `${index * 2}s`,
      }"
    >
      {{ heart }}
    </span>
  </div>
</template>