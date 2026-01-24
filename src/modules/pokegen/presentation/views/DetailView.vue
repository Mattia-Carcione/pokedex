<script setup>
import { onMounted, watch } from 'vue';

import Loader from '@/shared/presentation/components/Loader.vue';
import ErrorView from '@/shared/presentation/components/404View.vue';
import { DetailViewModel } from '../viewmodels/DetailViewModel';
import { appContainer } from '@/app/di/AppContainer';
import { TypeRequestEnum } from '../enums/TypeRequestEnum';

const props = defineProps({ name: String });

const pkmDetailController = appContainer.pokemonController();

watch(() => props.name, async (newName) => {
    await pkmDetailController.loadData({ endpoint: newName, req: TypeRequestEnum.DETAIL });
}, { immediate: true });
</script>

<template>
    <div class="detail-view-wrapper">
        <template v-if="pkmDetailController.isLoading.value">
            <Loader />
        </template>

        <template v-else-if="pkmDetailController.error.value">
            <ErrorView :error="pkmDetailController.error.value" />
        </template>

        <template v-else-if="pkmDetailController.data.value && pkmDetailController.data.value.pokemon">
            <template v-if="pkmDetailController.data.value instanceof DetailViewModel && pkmDetailController.data.value.pokemon.length > 0" >
                <!-- Detail view content goes here -->
            </template>
            
            <template v-else>
                <div class="flex justify-center py-10">
                    <h1 class="text-[var(--text-primary)] text-[2rem] font-bold text-center">Data not found.</h1>
                </div>
            </template>
        </template>
    </div>
</template>
