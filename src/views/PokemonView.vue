<script setup>
import Detail from '@/components/DetailPkm.vue';
import Loader from '@/components/Loader.vue';
import { PokemonSpeciesService } from '@/services/pokemonSpeciesService';
import { ref, watch } from 'vue';

const { name, id } = defineProps({ name: String, id: String });
const srv = new PokemonSpeciesService();
const pkm = ref(null);

/**
 * Funzione per il caricamento asyncrono dei dati pokémon 
 * @param id identificativo della generazione
 */
async function LoadCards(id) {
    const result = await srv.CreateCardDetailPokemon(Number(id));
    pkm.value = result ?? null;
}

watch(() => id, async (newID) => {
    await LoadCards(newID);
}, { immediate: true });
</script>

<template>
    <template v-if="pkm">
        <Detail :card="pkm" :name="name" />
    </template>
    <Loader v-else />
</template>