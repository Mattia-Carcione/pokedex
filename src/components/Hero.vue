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
        <RouterLink :to="{ name: 'home' }" aria-label="Vai alla home">
            <h1 class="pokemon my-5" translate="no">
                {{ title }}
            </h1>
        </RouterLink>
        <p v-if="route.name != 'NotFound'" id="set-gen"
            class="font-bold text-[2rem] text-[var(--color-primary)] [text-shadow:-1px_-1px_0_#0075BE,1px_-1px_0_#0075BE,-1px_1px_0_#0075BE,1px_1px_0_#0075BE]">
            Select a Generation:
        </p>
    </div>
</template>