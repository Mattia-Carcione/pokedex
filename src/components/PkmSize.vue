<script setup>
const { size } = defineProps(['size']);
</script>

<template>
    <table class="w-full rounded-xl my-5 bg-amber-50/75 ...">
        <thead>
            <tr>
                <th class="p-1">Height</th>
                <th class="p-1">Weight</th>
                <th class="p-1">Capture Rate</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td class="p-1 font-semibold">{{ size.height }}m</td>
                <td class="p-1 font-semibold">{{ size.weight }}Kg</td>
                <td class="p-1 font-semibold">{{ size.captureRate }}%</td>
            </tr>
        </tbody>
    </table>
</template>