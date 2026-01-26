<script setup>
const { height, weight, captureRate } = defineProps(['height', 'weight', 'captureRate']);
</script>

<template>
    <table id="pokemon-size" class="w-full rounded-xl my-5 bg-[var(--bg-custom)]/75 p-3" aria-label="Pokémon size information">
        <thead>
            <tr>
                <th class="p-1">Height</th>
                <th class="p-1">Weight</th>
                <th class="p-1">Capture Rate</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="p-1 font-semibold">{{ height }}m</td>
                <td class="p-1 font-semibold">{{ weight }}Kg</td>
                <td class="p-1 font-semibold">{{ captureRate }}%</td>
            </tr>
        </tbody>
    </table>
</template>