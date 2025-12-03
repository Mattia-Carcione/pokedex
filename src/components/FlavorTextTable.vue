<script setup>
import { mapVersionsWithText } from '@/utils/mapVersionToText';

const { generations, flavorTexts } = defineProps(['generations', 'flavorTexts']);
generations.map((x) => {
    const te = mapVersionsWithText(x, flavorTexts)
})
console.log(generations)
</script>

<template>
    <div class="space-y-8">

        <!-- CICLO GENERAZIONI -->
        <div v-for="gen in generations" :key="gen.generation">

            <!-- TITOLO GENERAZIONE -->
            <h2 class="text-xl font-bold mb-3">
                Generation {{ gen.generation }}
            </h2>

            <!-- TABELLA -->
            <table class=" bg-white border border-gray-200">
                <thead class="bg-gray-100 border-b">
                    <tr>
                        <th class="px-4 py-2 text-left">Version</th>
                        <th class="px-4 py-2 text-left">Text</th>
                    </tr>
                </thead>

                <tbody>
                    <!-- CICLO VERSIONI INTERNE -->
                    <tr v-for="item in mapVersionsWithText(gen, flavorTexts)" :key="item.version" class="border-b">
                        <td class="px-4 py-2 font-semibold capitalize" v-if="item.version">
                            {{ item.version }}
                        </td>
                        <td class="px-4 py-2 whitespace-pre-line" v-if="item.version">
                            {{ item.text ?? "No text available" }}
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>
    </div>
</template>
