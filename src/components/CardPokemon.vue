<script setup>
import BadgeName from './BadgeName.vue';
import BagdeType from './BagdeType.vue';
import Sprite from './Sprite.vue';
const { card } = defineProps(['card']);
const style = 'w-[250px] h-[250px] md:w-[250px] md:h-[250px]';
const firstType = card.types[0].color;
const secondaryType = card.types[1]?.color ?? card.types[0].color;
</script>

<template>
    <article class="pokemon-card relative shadow-xl p-1 rounded-xl transition delay-150 duration-300 ease-in-out hover:scale-110 block" aria-label="Card Pokémon" :style="{ background: `linear-gradient(150deg, ${firstType} 50%, ${secondaryType} 50%)` }">
        <RouterLink :to="card.href" :aria-label="`Vai alla scheda dettagliata di ${card.displayName}`" class="block p-5">
            <div class="flex justify-between py-2">
                <BadgeName :number="card.id" :name="card.displayName" />

                <BagdeType :types="card.types" />
            </div>

            <Sprite :sprite="card" :class="style" />
        </RouterLink>
    </article>
</template>