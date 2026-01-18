<script setup>
import { RouterView } from 'vue-router';
import ScrollToTop from './presentation/components/ScrollToTop.vue';
</script>

<template>
    <Suspense>
      <RouterView />
    </Suspense>
    <ScrollToTop />
</template>

<style scoped></style>
