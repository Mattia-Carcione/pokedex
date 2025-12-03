<script setup>
import Detail from '@/components/DetailPkm.vue';
import Loader from '@/components/Loader.vue';
import { PokemonSpeciesService } from '@/services/pokemonSpeciesService';
import { useGenStore } from '@/store/store';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const { name } = defineProps({ name: String });
const route = useRoute();
const store = useGenStore();
store.setId(route.query.id);

const srv = new PokemonSpeciesService();
const pkm = ref(null);

/**
 * Funzione per il caricamento asyncrono dei dati pokémon 
 * @param id identificativo della generazione
 */
async function LoadCards(id) {
    const result = await srv.CreateCardDetailPokemon(id);
    pkm.value = result ?? null;
}

watch(() => route.params, async () => {
    const id = route.query.id ?? store.id;
    store.setId(id);
    await LoadCards(id);
}, { immediate: true })
</script>

<template>
    <template v-if="pkm">
        <Detail :card="pkm" :name="name" />
    </template>
    <Loader v-else />
</template>