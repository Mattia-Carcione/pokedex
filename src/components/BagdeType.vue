<script setup>
import Skeleton from './Skeleton.vue';

const props = defineProps(['types']);
const types = props.types ?? [];
const style = props.class ?? 'w-[50px] h-[50px] md:h-[90px] md:w-[90px]';
</script>

<template>
    <div class="flex gap-1 items-center" aria-label="Badge dei tipi Pokémon">
        <div v-for="t in types" :key="t.id" class="flex justify-center-safe items-center w-14 h-14 bg-amber-50 rounded-full p-1" :aria-label="t.name">
            <Skeleton />
            <img class="rounded-full opacity-0 transition-opacity duration-300" :src="t.src" :alt="t.name" loading="lazy"
                onload="this.previousElementSibling.style.display='none'; this.style.opacity='1';" />
        </div>
    </div>
</template>