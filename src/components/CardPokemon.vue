<script setup>
import BadgeName from './BadgeName.vue';
import BagdeType from './BagdeType.vue';
import Sprite from './Sprite.vue';
const props = defineProps(['card']);
const style = 'w-[250px] h-[250px] md:w-[250px] md:h-[250px]';
const firstType = props.card.types[0].color;
const secondaryType = props.card.types[1]?.color ?? props.card.types[0].color;
</script>

<template>
    <article class="pokemon-card relative shadow-xl p-1 rounded-xl transition delay-150 duration-300 ease-in-out hover:scale-110 block" aria-label="Card Pokémon" :style="{ background: `linear-gradient(150deg, ${firstType} 50%, ${secondaryType} 50%)` }">
        <RouterLink :to="props.card.href" aria-label="Vai alla scheda dettagliata di {{props.card.displayName}}" class="block p-5">
            <div class="flex justify-between py-2">
                <BadgeName :number="props.card.id" :name="props.card.displayName" />

                <BagdeType :types="props.card.types" />
            </div>

            <Sprite :sprite="props.card" :class="style" />
        </RouterLink>
    </article>
</template>