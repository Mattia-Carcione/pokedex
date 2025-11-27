<script setup>
import CustomSection from '@/components/CustomSection.vue';
import { PokemonRepository } from '@/repositories/pokemonRepository';

const srv = new PokemonRepository();
const data = await srv.GetAllByGen(1);
console.log(data)
</script>

<template>
    <CustomSection>

    </CustomSection>
</template>

<style scoped></style>
