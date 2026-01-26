<script setup>
import Skeleton from './Skeleton.vue';

const {types} = defineProps(['types']);
</script>

<template>
    <div class="flex gap-1" aria-label="Badge dei tipi Pokémon">
        <div v-for="type in types" :key="type.id"
            class="flex flex-col justify-center-safe items-center w-14 h-14 bg-[var(--bg-custom)] rounded-full p-1"
            :aria-label="type.name">
            <Skeleton />
            <img class="rounded-full opacity-0 transition-opacity duration-300" :src="type.icon" :alt="type.name"
                loading="lazy" onload="this.previousElementSibling.style.display='none'; this.style.opacity='1';" />
            <p class="font-bold">{{ type.name }}</p>
        </div>
    </div>
</template>