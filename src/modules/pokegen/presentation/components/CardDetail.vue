<script setup>
import CardDetailNavigation from './CardDetailNavigation.vue';
import BadgeName from './BadgeName.vue';
import BagdeType from './BadgeType.vue';
import GenderRate from './GenderRate.vue';
import PokemonSize from './PokemonSize.vue';
import FlavorTextTable from './FlavorTextTable.vue';
import Sprite from './Sprite.vue';
import StatsInfo from './StatsInfo.vue';
import EvolutionChain from './EvolutionChain.vue';

const { pokemon, prev, next, name } = defineProps(['pokemon', 'prev', 'next', 'name']);

const style = 'w-[250px] h-[250px] md:w-[250px] md:h-[250px]';
const colors = pokemon.types.map(t => t.color);
const [firstType, secondaryType = firstType] = colors;
</script>


<template>
    <div id="details" class="p-1 mt-3" aria-label="Pokémon details">
        <div :id="`info-pokemon-${name}`" class="pokemon-card relative shadow-xl p-1 md:p-5 rounded-xl"
            :style="{ background: `linear-gradient(90deg, ${firstType} 50%, ${secondaryType} 50%)` }"
            aria-label="Pokémon info">

            <!-- Navigation -->
            <div id="detail-nav" aria-label="pokemon navigation" class="flex justify-between py-2">
                <CardDetailNavigation :prev="prev" :next="next" />
            </div>

            <!-- Article -->
            <article id="pokemon-info" aria-label="Pokémon info"
                class="rounded-xl border border-amber-50/50 mt-3 md:p-5">
                <!-- Name and Types -->
                <div id="name-and-types" class="flex justify-between py-2 px-1">
                    <BadgeName :number="pokemon.pokedexNumber" :name="pokemon.name" />

                    <BagdeType :types="pokemon.types" />
                </div>

                <!-- Details -->
                <div id="main-info" aria-label="main pokemon info"
                    class="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-5">
                    <div class="row-span-2 space-y-8 col-span-1">
                        <!-- Sprite -->
                        <div id="sprite" class="flex items-center justify-center">
                            <Sprite :pokemon="pokemon" :className="style" />
                        </div>

                        <!-- Base Info -->
                        <div id="base-info"
                            class="bg-[var(--bg-custom)]/50 rounded-xl p-3 flex flex-col items-center text-center">
                            <p class="mt-3 text-lg font-semibold" translate="no">{{ pokemon.genus }}</p>
                            <div id="pokemon-generation" class="my-2">
                                <RouterLink :to="pokemon.generation.href" :aria-label="pokemon.generation.href.name"
                                    translate="no">
                                    <span class="font-bold text-2xl capitalize underline">{{ pokemon.generation.name
                                    }}</span>
                                </RouterLink>
                            </div>
                            <GenderRate :genderRate="pokemon.genderRate" />
                            <PokemonSize :height="pokemon.height" :weight="pokemon.weight"
                                :captureRate="pokemon.captureRate" />
                        </div>
                    </div>

                    <!-- Detail -->
                    <div id="main-info" class="md:p-5 col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
                        <!-- Flavor Text -->
                        <FlavorTextTable :flavorText="pokemon.flavorText" />

                        <!-- Stats Info -->
                        <StatsInfo :stats="pokemon.stats" />

                        <!-- Evolution Chain -->
                        <EvolutionChain :pokemon="pokemon" />
                    </div>
                </div>
            </article>
        </div>
    </div>
</template>