<script setup>
const { genderRate } = defineProps(['genderRate']);
</script>

<template>
    <div id="gender">
        <h3 class="text-2xl font-bold">Gender rate: </h3>
        <span class="font-bold text-lg" v-if="!genderRate">Unknown</span>
        <div class="flex items-center justify-center gap-4 mt-3" v-else>
            <div v-if="genderRate.male > 0">
                <img src="/icons/genders/male.svg" class="size-16 rounded-full bg-amber-50/75 p-1" alt="" />
                <p class="font-semibold">{{ genderRate.male }}%</p>
            </div>
            <div v-if="genderRate.female > 0">
                <img src="/icons/genders/female.svg" class="size-16 rounded-full bg-amber-50/75 p-1" alt="" />
                <p class="font-semibold">{{ genderRate.female }}%</p>
            </div>
        </div>
    </div>
</template>