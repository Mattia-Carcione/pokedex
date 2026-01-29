<script setup>
import { onMounted } from "vue";
import { appContainer } from './di/AppContainer';
import { RouterView } from 'vue-router';
import ScrollToTop from '@/shared/presentation/components/ScrollToTop.vue';

const pokeApiController = appContainer.pokeApiController();

onMounted(async () => {
  await pokeApiController.loadData();
});
</script>

<template>
    <Suspense>
      <RouterView />
    </Suspense>
    <ScrollToTop />
</template>