<script setup>
import { ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();
const title = ref('PokéGen');

watch(() => route.path, (newName) => {
    if(newName?.toString().includes('pokemon'))
        return title.value = 'PokéMon';
    title.value = 'PokéGen';
})
</script>

<template>
    <div class="text-center">
        <RouterLink to="/" aria-label="Vai alla home">
            <h1 class="pokemon mb-15">
                {{ title }}
            </h1>
        </RouterLink>
        <p id="set-gen"
            class="font-bold text-[2rem] text-[var(--color-primary)] [text-shadow:-1px_-1px_0_#0075BE,1px_-1px_0_#0075BE,-1px_1px_0_#0075BE,1px_1px_0_#0075BE]">
            Select Generation:
        </p>
    </div>
</template>