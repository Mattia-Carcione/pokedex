<script setup>
import { ref } from "vue";
import Sprite from "./Sprite.vue";

const { pokemon } = defineProps(['pokemon']);
const style = 'w-25 h-25 lg:w-[150px] lg:h-[150px]';
const arrayLength= pokemon.evolution.some(
    stage =>
        (stage.evolutions?.length ?? 0) > 2 ||
        (stage.pokemons?.length ?? 0) > 2
);
</script>
<template>
    <div class="mt-3 bg-[var(--bg-custom)]/50 rounded-xl p-5">
        <h2 class="font-bold text-xl p-3 text-center">Evolution Chain</h2>

        <!-- container principale: colonne -->
        <div :class="`flex ${arrayLength ? 'flex-row' : 'flex-col lg:flex-row'} justify-around items-center gap-6`">
            <template v-for="(stage, i) in pokemon.evolution" :key="i">
                <!-- Colonna dello stage -->
                <div class="flex flex-col items-center gap-4 w-full lg:w-auto">

                    <!-- Ciclo dei Pokémon base in questo stage -->
                    <template v-if="i === 0" v-for="pokemon in stage.pokemons" :key="pokemon.name">
                        <div class="flex flex-col items-center gap-1">
                            <Sprite
                                :pokemon="{ name: pokemon.name, sprite: pokemon.sprite }"
                                :className="style" />
                            <div class="capitalize font-semibold text-center">{{ pokemon.name }}</div>
                        </div>
                    </template>

                    <!-- Evoluzioni con trigger -->
                    <div v-if="stage.evolutions?.length" :class="`flex  ${arrayLength ? 'flex-col' : 'flex-row lg:flex-col'} items-center gap-6 mt-2 w-full`">
                        <template v-for="evo in stage.evolutions" :key="evo.to">
                            <div :class="`flex ${arrayLength ? 'flex-row' : 'flex-col lg:flex-row'} items-center justify-center gap-8 w-full mt-5`">

                                <!-- freccia + trigger -->
                                <div class="flex flex-col lg:flex-row items-center text-gray-600 w-full gap-2">

                                    <!-- info evoluzione (solo se presenti) -->
                                    <div class="text-xs capitalize space-y-1 text-center" translate="no">

                                        <!-- item -->
                                        <template v-if="evo.item" >
                                            <Sprite :pokemon="{
                                                name: evo.item,
                                                sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${evo.item.toLowerCase()}.png`
                                            }" className="w-5 h-5 mx-auto" />
                                            <p class="text-sm font-semibold">{{ evo.item }}</p>
                                        </template>

                                        <!-- genere -->
                                        <p class="text-sm font-semibold" v-if="evo.gender">({{ evo.gender }})</p>

                                        <!-- livello -->
                                        <p class="text-sm font-semibold" v-if="evo.minLevel">Level {{ evo.minLevel }}</p>

                                        <!-- felicità -->
                                        <p class="text-sm font-semibold" v-if="evo.minHappiness">Happiness</p>

                                        <!-- momento del giorno -->
                                        <p class="text-sm font-semibold" v-if="evo.timeOfDay">({{ evo.timeOfDay }})</p>

                                        <!-- mossa conosciuta -->
                                        <p class="text-sm font-semibold" v-if="evo.knownMove">Move: {{ evo.knownMove }}</p>

                                        <!-- tipo mossa conosciuta -->
                                        <p class="text-sm font-semibold" v-if="evo.knownMoveType">Knowing move type:<br>{{ evo.knownMoveType }}</p>

                                        <!-- luogo -->
                                        <p class="text-sm font-semibold" v-if="evo.location">
                                            Level up at: <br>
                                            {{ evo.location }}
                                        </p>

                                        <!-- stats fisiche -->
                                        <p class="text-sm font-semibold" v-if="evo.relativePhysicalStats !== undefined">
                                            Physical stats {{ evo.relativePhysicalStats > 0 ? '>' : '<' }} </p>

                                    </div>

                                    <!-- freccia (SEMPRE PRESENTE) -->
                                    <svg :class="`w-5 h-5  ${arrayLength ? 'rotate-90' : 'rotate-180 lg:rotate-90'} shrink-0`" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M12 0v8" />
                                        <path d="M6 6l6-6 6 6" />
                                    </svg>

                                </div>

                                <!-- Pokémon evoluto -->
                                <div class="flex flex-col items-center">
                                    <Sprite
                                        :pokemon="{ name: evo.to, sprite: evo.toSprite }"
                                        :className="style" />
                                    <div class="capitalize text-sm font-semibold mt-1">{{ evo.to }}</div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>