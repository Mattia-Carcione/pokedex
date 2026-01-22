<script setup>
import { RouterView } from 'vue-router';
import ScrollToTop from '@/shared/components/ScrollToTop.vue';
</script>

<template>
    <Suspense>
      <RouterView />
    </Suspense>
    <ScrollToTop />
</template>

<style scoped></style>
