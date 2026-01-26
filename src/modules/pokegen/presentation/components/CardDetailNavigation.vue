<script setup>
import Sprite from './Sprite.vue';

const { next, prev } = defineProps(['next', 'prev']);
</script>

<template>
    <div id="previous">
        <template v-if="prev">
            <RouterLink :to="prev.href" :aria-label="`Vai al Pokémon ${prev.name}`" class="flex flex-col items-center justify-center">
                <Sprite :pokemon="prev" />
                <span class="underline flex items-center mt-1 rounded-full bg-[var(--bg-custom)]/50 p-1 font-bold">
                    <img class="origin-center rotate-90 h-7 w-7" src="/icons/arrowDown.svg" alt="Arrow left icon" />
                    #{{ prev.pokedexNumber }} <span class="hidden lg:block capitalize" translate="no">- {{ prev.name
                    }}</span>
                </span>
            </RouterLink>
        </template>
    </div>
    <div id="next">
        <template v-if="next">
            <RouterLink :to="next.href" :aria-label="`Vai al Pokémon ${next.name}`" class="flex flex-col items-center justify-center">
                <Sprite :pokemon="next" />
                <span class="underline flex items-center mt-1 rounded-full bg-[var(--bg-custom)]/50 p-1 font-bold">
                    #{{ next.pokedexNumber }} <span class="hidden lg:block capitalize" translate="no">- {{ next.name }}</span>
                    <img class="origin-center rotate-270 h-7 w-7" src="/icons/arrowDown.svg" alt="Arrow right icon" />
                </span>
            </RouterLink>
        </template>
    </div>
</template>