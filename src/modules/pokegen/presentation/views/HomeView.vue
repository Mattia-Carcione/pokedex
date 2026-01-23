<script setup>
    import { onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { watch } from 'vue';
    
    import { AppRouteName } from '@/app/routing/AppRouteName';
    import { appContainer } from '@/app/di/AppContainer';
    import Loader from '@/shared/presentation/components/Loader.vue';
    import CustomSection from '@/shared/presentation/components/CustomSection.vue';
    import Card from '../components/Card.vue';
    import ErrorView from '@/shared/presentation/components/404View.vue';
    import { HomeViewModel } from '../viewmodels/HomeViewModel';
    import { TypeRequestEnum } from '../enums/TypeRequestEnum';

    const pkmByGenController = appContainer.pokemonController();
    const { id } = defineProps({ id: String });
    const router = useRouter();
    const message = '';
    
    watch(() => id, async (newId) => {
        await pkmByGenController.loadData({endpoint: newId, req: TypeRequestEnum.HOME});
    }, { immediate: true });
</script>

<template>
    <template v-if="pkmByGenController.isLoading.value">
        <Loader />
    </template>

    <template v-if="pkmByGenController.data.value && !pkmByGenController.isLoading.value">
        <template v-if="pkmByGenController.data.value instanceof HomeViewModel && pkmByGenController.data.value.pokemon">
            <CustomSection>
                <Card :card="pkm" v-for="pkm in pkmByGenController.data.value.pokemon" :key="pkm.id" />
            </CustomSection>
        </template>
        
        <template v-else>
            <h2 class="text-[var(--text-primary)] text-[2rem] font-bold text-center py-10">
                No Pokémon found for this generation.
            </h2>
        </template>
        
    </template>

    <template v-if="pkmByGenController.error.value">
        <ErrorView :error="pkmByGenController.error.value" />
    </template>
</template>
