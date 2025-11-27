<script setup>
import { RouterView } from 'vue-router';
import CustomNav from './components/CustomNav.vue';
import Hero from './components/Hero.vue';
</script>

<template>
  <Suspense>

    <header>
      <Hero />
      <CustomNav />
    </header>

  </Suspense>
  <Suspense>
    <main>
      <RouterView />
    </main>
  </Suspense>
</template>

<style scoped></style>
