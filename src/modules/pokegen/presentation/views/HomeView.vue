<script setup>
    import { onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { watch } from 'vue';
    import { getControllers } from '@/app/di/Controllers';
    
    import { AppRouteName } from '@/shared/core/enums/AppRouteName';
    import Loader from '@/app/presentation/components/Loader.vue';
    import CustomSection from '@/app/presentation/layout/CustomSection.vue';
    import Card from '../components/Card.vue';
    import ErrorView from '@/app/presentation/views/404View.vue';

    const { pkmByGenController } = getControllers();
    const { id } = defineProps({ id: String });
    const router = useRouter();
    
    onMounted(async () => {
        await pkmByGenController.loadData(id);
    });
    watch(() => id, async (newId) => {
        await pkmByGenController.loadData(newId);
    });
</script>

<template>
    <template v-if="pkmByGenController.isLoading.value">
        <Loader />
    </template>
    <template v-if="pkmByGenController.data.value && !pkmByGenController.isLoading.value">
        <CustomSection>
            <Card :card="pkm" v-for="pkm in pkmByGenController.data.value.pokemon" :key="pkm.id" />
        </CustomSection>
    </template>
    <template v-if="pkmByGenController.error.value">
        <ErrorView :error="pkmByGenController.error.value" />
    </template>
</template>