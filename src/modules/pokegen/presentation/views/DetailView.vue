<script setup>
import { onMounted, watch } from 'vue';
import { getControllers } from '@/app/di/Controllers';
import Loader from '@/app/presentation/components/Loader.vue';
import ErrorView from '@/app/presentation/views/404View.vue';

const props = defineProps({
    name: String,
    id: String
});

const { pkmDetailController } = getControllers();

onMounted(async () => {
    await pkmDetailController.loadData(props.id);
});

watch(() => props.id, async (newId) => {
    await pkmDetailController.loadData(newId);
});
</script>

<template>
    <div class="detail-view-wrapper">
        <template v-if="pkmDetailController.isLoading.value">
            <Loader />
        </template>

        <template v-else-if="pkmDetailController.error.value">
            <ErrorView :error="pkmDetailController.error.value" />
        </template>

        <template v-else-if="pkmDetailController.data.value && !pkmDetailController.isLoading.value">
            <div class="flex justify-center py-10">
                <h1 class="text-[var(--text-primary)] text-[2rem] font-bold text-center">Work in progress...</h1>
            </div>
        </template>
    </div>
</template>