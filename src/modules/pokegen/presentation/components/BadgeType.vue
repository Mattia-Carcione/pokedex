<script setup>
import Skeleton from './Skeleton.vue';

const props = defineProps(['types']);
</script>

<template>
    <div class="flex gap-1 items-center" aria-label="Badge dei tipi Pokémon">
        <div v-for="type in props.types" :key="type.id"
            class="flex flex-col justify-center-safe items-center w-14 h-14 bg-amber-50 rounded-full p-1"
            :aria-label="type.name">
            <Skeleton />
            <img class="rounded-full opacity-0 transition-opacity duration-300" :src="type.icon" :alt="type.name"
                loading="lazy" onload="this.previousElementSibling.style.display='none'; this.style.opacity='1';" />
            <p class="font-bold">{{ type.name }}</p>
        </div>
    </div>
</template>