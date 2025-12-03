<script setup>
import CardPokemon from '@/components/CardPokemon.vue';
import CustomSection from '@/components/CustomSection.vue';
import Loader from '@/components/Loader.vue';
import { PokemonSpeciesRepository } from '@/repositories/pokemonSpeciesRepository';
import { PokemonService } from '@/services/pokemonService';
import { useGenStore } from '@/store/store';
import { ref, watch } from 'vue';

const props = defineProps({ id: String });
const store = useGenStore();
store.setId(props.id);
const srv = new PokemonService();
const srvSpcs = new PokemonSpeciesRepository();
const cards = ref(null);

/**
 * Funzione per il caricamento asyncrono dei dati pokémon 
 * @param id identificativo della generazione
 */
async function LoadCards(id) {
    const result = await srv.CreateAllCardByGen(id);
    await srvSpcs.GetAllByGen(id);
    cards.value = result ?? [];
}

watch(() => props.id, async (newID) => {
    store.setId(newID);
    await LoadCards(newID);
}, { immediate: true });
</script>

<template>
    <template v-if="cards && cards.length > 0">
        <custom-section>
            <CardPokemon :card="pkm" v-for="pkm in cards" :key="pkm.id" />
        </custom-section>
    </template>
    <Loader v-else />
</template>
