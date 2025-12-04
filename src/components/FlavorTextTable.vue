<script setup>
import { PokeApiService } from '@/services/pokeApiService';
import { mapGenerationFlavorTextList } from '@/utils/mapVersionToText';

const { flavorTexts } = defineProps(['flavorTexts']);
const srv = new PokeApiService();
const generations = await srv.GetVersionDetail();
const b = mapGenerationFlavorTextList(generations, flavorTexts)
console.log(b)
</script>

<template>
    <div class="flex flex-col space-y-2 w-full mx-auto">
        <h2 class="font-bold text-xl p-3">
            Flavor Text Entry
        </h2>
        <!-- CICLO GENERAZIONI -->
        <template v-for="item in mapGenerationFlavorTextList(generations, flavorTexts)" :key="item.version">
            <template v-if="item.flavorText.length > 0">
                <!-- TABELLA -->
                <div class="bg-amber-50/75 rounded-xl md:p-2">
                    <h3 class="text-center font-bold text-lg pb-3">
                        Generation {{ item.generation }}
                    </h3>
                    <table class="w-full">

                        <tbody class="space-y-[1px]">
                            <!-- CICLO VERSIONI INTERNE -->
                            <tr class="flex flex-col md:block border rounded-xl bg-amber-50" v-for="(value, index) in item.flavorText">
                                <td class="p-1 md:p-5 font-bold capitalize text-center" v-if="value.version">
                                    {{ value.version }}
                                </td>
                                <td class="p-1 md:p-2 rounded-xl" v-if="value.version">
                                    {{ value.text ?? "No text available" }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </template>
    </div>
</template>
