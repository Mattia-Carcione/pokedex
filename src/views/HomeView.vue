<script setup>
import CardPokemon from '@/components/CardPokemon.vue';
import CustomSection from '@/components/CustomSection.vue';
import Loader from '@/components/Loader.vue';
import { PokemonService } from '@/services/pokemonService';

const srv = new PokemonService();
const data = await srv.CreateAllCardByGen(1);
const pkmData = data ?? [];
</script>

<template>
    <template v-if="pkmData && pkmData.length > 0">
        <custom-section>
            <CardPokemon :card="pkm" v-for="pkm in pkmData" :key="pkm.id" />
        </custom-section>
    </template>
    <Loader v-else />
</template>
