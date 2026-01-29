<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { appContainer } from '@/app/di/AppContainer';
import { AppRouteName } from '@/app/routing/AppRouteName';
import { TypeRequestEnum } from '@/modules/pokegen/presentation/enums/TypeRequestEnum';

const router = useRouter();
const route = useRoute();

const pokemonController = appContainer.pokemonController();

const query = ref('');
let debounceTimer;

const triggerSearch = async (value) => {
  if (value.length < 3) return;

  await pokemonController.searching({
    endpoint: value,
    req: TypeRequestEnum.SEARCH
  });

  if(route.name === AppRouteName.Generation) return;
  router.push({
    name: AppRouteName.Home,
    query: { search: value }
  });
};

watch(query, (value) => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = window.setTimeout(() => {
    triggerSearch(value);
  }, 400);
});

watch(
  () => route.fullPath,
  () => {
    query.value = '';
    if (debounceTimer) clearTimeout(debounceTimer);
  }
);
</script>
<template>
    <!-- Icona -->
    <span class="mt-3 absolute inset-y-0 left-3 flex items-center text-[var(--color-secondary)]/75 pointer-events-none">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1112 4.5a7.5 7.5 0 014.65 12.15z" />
      </svg>
    </span>
    <input v-model="query" type="text" placeholder="Search Pokémon..." class="mt-3 bg-[#FFF] [box-shadow:0_0_15px_0_rgba(0,0,0,0.2)] p-2 pl-10 rounded-full focus:outline-[var(--color-secondary)]/75 w-full" />
</template>