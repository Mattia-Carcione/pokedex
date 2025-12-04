<script setup>
import BadgeName from './BadgeName.vue';
import BagdeType from './BagdeType.vue';
import DetailPkmNav from './DetailPkmNav.vue';
import GenderRate from './GenderRate.vue';
import PkmSize from './PkmSize.vue';
import Sprite from './Sprite.vue';
import FlavorTextTable from './FlavorTextTable.vue';

const { card, name } = defineProps(['card', 'name']);
const style = 'w-[250px] h-[250px] md:w-[250px] md:h-[250px]';
</script>

<template>
    <section id="details" class="p-5 mt-3" aria-label="Pokémon details">
        <div :id="`info-pkm-${name}`" class="pokemon-card relative shadow-xl p-5 rounded-xl" :style="{ background: `linear-gradient(150deg, ${card.types[0].color} 50%, ${card.types[1]?.color ?? card.types[0].color} 50%)` }" aria-label="Pokémon info">
            <div id="detail-nav" class="flex justify-between py-2">
                <div id="previous">
                    <template v-if="card.prev">
                        <DetailPkmNav :href="card.prev.href" :card="card.prev">
                            <img class="origin-center rotate-90 h-5 w-5" src="/icons/arrowDown.svg" alt="Arrow left icon" />
                            #{{ card.prev.id }} <span class="hidden lg:block capitalize" translate="no">- {{ card.prev.name }}</span>
                        </DetailPkmNav>
                    </template>
                </div>
                <div id="next">
                    <template v-if="card.next">
                        <DetailPkmNav :href="card.next.href" :card="card.next">
                            #{{ card.next.id }} <span class="hidden lg:block capitalize" translate="no">- {{ card.next.name }}</span>
                            <img class="origin-center rotate-270 h-5 w-5" src="/icons/arrowDown.svg"
                                alt="Arrow right icon" />
                        </DetailPkmNav>
                    </template>
                </div>
            </div>
            <article id="pkm-info" class="rounded-xl border border-amber-50/50 mt-3 md:p-5">
                <div id="name-and-types" class="flex justify-between py-2">
                    <BadgeName :number="card.id" :name="card.displayName" />

                    <BagdeType :types="card.types" />
                </div>
                <div class="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-5">
                    <div class="row-span-2 space-y-8 col-span-1">
                        <!-- Sprite -->
                        <div id="sprite" class="flex items-center justify-center">
                            <Sprite :sprite="card" :class="style" />
                        </div>
                        
                        <!-- Base Info -->
                        <div id="base-info" class="bg-amber-50/50 rounded-xl p-3 flex flex-col items-center text-center">
                            <p class="mt-3 font-semibold" translate="no">{{card.genera}}</p>
                            <div id="pkm-generation" class="my-3">
                                <RouterLink :to="card.generation.href" :aria-label="card.generation.label" translate="no">
                                    <h3 class="text-2xl font-bold underline">
                                        Generation: <span class="font-bold text-lg">{{ card.generation.name }}</span>
                                    </h3>
                                </RouterLink>
                            </div>
                            <GenderRate :genderRate="card.genderRate" />
                            <PkmSize :size="card.size" />
                        </div>
                    </div>

                    <!-- Detail -->
                    <div id="main-info" class="md:p-5 rounded-xl bg-amber-50/50 col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
                            <FlavorTextTable :flavorTexts="card" />
                    </div>
                </div>

            </article>
        </div>
    </section>
</template>