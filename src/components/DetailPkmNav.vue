<script setup>
import Sprite from './Sprite.vue';

const { href, card } = defineProps(['href', 'card']);
</script>

<template>
    <RouterLink :to="href" :aria-label="`Vai al Pokémon ${card.name}`" class="flex flex-col items-center justify-center">
        <Sprite :sprite="card" />
        <span class="underline flex items-center mt-1 rounded-full bg-amber-50/50 p-1">
            <slot></slot>
        </span>
    </RouterLink>
</template>