<script setup>
import { GenerationService } from '@/services/generationService';
import { useGenStore } from '@/store/store';
import { onMounted, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();
const storeGen = useGenStore();
const srv = new GenerationService();
const data = ref([]);

onMounted(async () => {
  data.value = await srv.FetchAll();
});
</script>

<template>
    <nav v-if="route.name != 'NotFound'" id="main-nav" class="table mx-auto rounded-[1rem] bg-[#FFF] mt-4 [box-shadow:0_0_15px_0_rgba(0,0,0,0.2)]"
        aria-label="Navigazione generazioni Pokémon">
        <ul class="flex flex-wrap">
            <li v-for="(gen, x) in data">
                <RouterLink :to="gen.href" :aria-label="gen.label" translate="no"
                    class="relative inline-block align-middle text-[var(--color-dark)] text-[1rem] md:text-[2rem] p-3 font-bold overflow-hidden transition-all navigation-link"
                    :class="{ active: ($route.name === 'home' && gen.id == 1) || ($route.name === 'generation' && storeGen.id == gen.id), 'rounded-l-[1rem]': x === 0, 'rounded-r-[1rem]': x === data.length - 1 }">
                    {{ gen.name }}</RouterLink>
            </li>
        </ul>
    </nav>
</template>