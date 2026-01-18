<script setup>
import Skeleton from './Skeleton.vue';

const { pkm, class: className } = defineProps(['pkm', 'class']);
const style = className ?? 'w-[50px] h-[50px] md:h-[90px] md:w-[90px]';
</script>

<template>
    <div :class="style" class="flex justify-center-safe items-center bg-amber-50/50 rounded-full"
        aria-label="Sprite del Pokémon">
        <Skeleton :class="style" />
        <img :class="style" class="z-10 object-cover opacity-0 transition-opacity duration-300" :src="pkm.sprite"
            :alt="`Sprite ufficiale di ${pkm.name}`" loading="lazy"
            onload="this.previousElementSibling.style.display='none'; this.style.opacity='1';" />
    </div>
</template>