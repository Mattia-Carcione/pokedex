<script setup>
import BadgeName from './BadgeName.vue';
import BadgeType from './BadgeType.vue';
import Sprite from './Sprite.vue';

const { card } = defineProps(['card']);
const style = 'w-[250px] h-[250px] md:w-[250px] md:h-[250px]';
const colors = card.types.map(t => t.color);
const [firstType, secondaryType = firstType] = colors;
</script>

<template>
    <article :id="`pokemon-card-${card.id}`"
        class="pokemon-card relative shadow-xl p-1 rounded-xl transition delay-150 duration-300 ease-in-out hover:scale-110 block"
        aria-label="Card Pokémon"
        :style="{ background: `linear-gradient(150deg, ${firstType} 50%, ${secondaryType} 50%)` }">
        <RouterLink :to="card.href" :aria-label="`Vai alla scheda dettagliata di ${card.name}`"
            class="block p-5">
            <div class="flex justify-between py-2 items-center">
                <BadgeName :number="card.pokedexNumber" :name="card.name" />

                <BadgeType :types="card.types" />
            </div>

            <Sprite :pkm="card" :className="style" />
        </RouterLink>
    </article>
</template>