<script setup>
import GenderRate from './GenderRate.vue';
import PokemonSize from './PokemonSize.vue';

const { pokemon } = defineProps(['pokemon']);
</script>
 
<template>
    <!-- Base Info -->
    <div id="base-info" class="bg-[var(--bg-custom)]/50 rounded-xl p-3 flex flex-col items-center text-center">
        <p class="mt-3 text-lg font-semibold" translate="no">{{ pokemon.genus }}</p>
        <div id="pokemon-generation" class="my-2">
            <RouterLink :to="pokemon.generation.href" :aria-label="pokemon.generation.href.name" translate="no">
                <span class="font-bold text-2xl capitalize underline">{{ pokemon.generation.name
                }}</span>
            </RouterLink>
        </div>
        <GenderRate :genderRate="pokemon.genderRate" />
        <PokemonSize :height="pokemon.height" :weight="pokemon.weight" :captureRate="pokemon.captureRate" />
    </div>
</template>
