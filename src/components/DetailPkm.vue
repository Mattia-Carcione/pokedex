<script setup>
import BadgeName from './BadgeName.vue';
import BagdeType from './BagdeType.vue';
import DetailPkmNav from './DetailPkmNav.vue';
import GenderRate from './GenderRate.vue';
import PkmSize from './PkmSize.vue';
import Sprite from './Sprite.vue';

const { card, name } = defineProps(['card', 'name']);
const style = 'w-[250px] h-[250px] md:w-[250px] md:h-[250px]';
</script>

<template>
    <section id="details" class="p-5 mt-3" aria-label="Pokémon details">
        <div :id="`info-pkm-${name}`" class="pokemon-card relative shadow-xl p-5 rounded-xl"
            :style="{ background: `linear-gradient(150deg, ${card.types[0].color} 50%, ${card.types[1]?.color ?? card.types[0].color} 50%)` }"
            aria-label="Pokémon info">
            <div class="flex justify-between py-2">
                <div id="previous">
                    <template v-if="card.prev">
                        <DetailPkmNav :href="card.prev.href" :card="card.prev">
                            <img class="origin-center rotate-90 h-5 w-5" src="/icons/arrowDown.svg" alt="Arrow left icon" />
                            #{{ card.prev.id }} <span class="hidden lg:block" translate="no">- {{ card.prev.name }}</span>
                        </DetailPkmNav>
                    </template>
                </div>
                <div id="next">
                    <template v-if="card.next">
                        <DetailPkmNav :href="card.next.href" :card="card.next">
                            #{{ card.next.id }} <span class="hidden lg:block" translate="no">- {{ card.next.name }}</span>
                            <img class="origin-center rotate-270 h-5 w-5" src="/icons/arrowDown.svg"
                                alt="Arrow right icon" />
                        </DetailPkmNav>
                    </template>
                </div>
            </div>
            <div class="rounded-xl border border-amber-50/50 mt-3 p-5">
                <div class="flex justify-between py-2">
                    <BadgeName :number="card.id" :name="card.displayName" />

                    <BagdeType :types="card.types" />
                </div>
                <div class="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 grid-rows-2">

                    <!-- Sprite -->
                    <div id="sprite" class="flex items-center justify-center order-1 md:order-1 md:col-span-1">
                        <Sprite :sprite="card" :class="style" />
                    </div>

                    <!-- Detail -->
                    <div id="detail"
                        class="rounded-xl bg-amber-50/50 order-3 md:order-2 md:col-span-2 lg:col-span-3 xl:col-span-4 row-span-2">
                    </div>

                    <!-- Gender -->
                    <div class="bg-amber-50/50 rounded-xl p-3 flex flex-col items-center text-center order-2 md:order-3 md:col-span-1">
                        <p class="mt-3 font-semibold" translate="no">{{card.genera}}</p>
                        <div id="pkm-generation" class="my-3">
                            <h3 class="text-2xl font-bold">
                                Generation: <span class="font-bold text-lg">{{ card.generation }}</span>
                            </h3>
                        </div>
                        <GenderRate :genderRate="card.genderRate" />
                        <PkmSize :size="card.size" />
                    </div>

                </div>

            </div>
        </div>
    </section>
</template>