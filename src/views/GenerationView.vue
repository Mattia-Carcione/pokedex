<script setup>
import CustomSection from '@/components/CustomSection.vue';
import router from '@/routing';
import { GenerationService } from '@/services/generationService';
import { useGenStore } from '@/store/store';
import { ref, watch } from 'vue';

const props = defineProps({
    id: String
});

const store = useGenStore();
store.setId(props.id);

const srv = new GenerationService();
const data = ref(null);

watch(() => props.id, async (newID) => {
    data.value = await srv.Fetch(newID);
    store.setId(newID);
    if (!data.value)
        router.replace({ name: 'NotFound' });
}, { immediate: true });
</script>

<template>
    <h1 v-if="data">{{ data.id }}</h1>
    <custom-section>

    </custom-section>
</template>


<style scoped></style>
