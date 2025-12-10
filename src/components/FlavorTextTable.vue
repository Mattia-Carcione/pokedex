<script setup>
import { PokeApiService } from '@/services/pokeApiService';
import { mapGenerationFlavorTextList } from '@/utils/mapVersionToText';

const { flavorTexts } = defineProps(['flavorTexts']);
const srv = new PokeApiService();
const generations = await srv.GetVersionDetail('it');
</script>

<template>
    <div class="flex flex-col space-y-2 w-full mx-auto">
        <h2 class="font-bold text-xl p-3">
            Flavor Text Entry
        </h2>
        <!-- CICLO GENERAZIONI -->
        <template v-for="(item, x) in mapGenerationFlavorTextList(generations, flavorTexts)" :key="item.version">
            <template v-if="item.flavorText.length > 0 && item.flavorText.filter(x => Boolean(x.version)).length > 0">
                <!-- TABELLA -->
                <div class="bg-amber-50/75 rounded-xl md:p-2">
                    <h3 class="text-center font-bold text-lg pb-3">
                        Generation {{ item.generation }}
                    </h3>
                    <table class="w-full">

                        <tbody class="space-y-[1px]">
                            <!-- CICLO VERSIONI INTERNE -->
                            <template v-for="value in item.flavorText">
                                <tr class="flex flex-col lg:block border rounded-xl bg-amber-50" v-if="value.version">
                                    <td class="p-1 md:p-3 font-bold capitalize text-center w-full lg:w-32">
                                        {{ value.version.name }}
                                    </td>
                                    <td class="p-1 md:px-3 rounded-xl">
                                        {{ value.text ?? "No text available" }}
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </template>
        </template>
    </div>
</template>
