<script setup>
import ScrollToTop from '@/shared/presentation/components/ScrollToTop.vue';
import { RouterView } from 'vue-router';
</script>

<template>
    <Suspense>
      <RouterView />
    </Suspense>
    <ScrollToTop />
</template>

<style scoped></style>
