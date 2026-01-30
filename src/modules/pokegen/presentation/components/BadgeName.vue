<script setup>
const props = defineProps(['number', 'name']);
</script>

<template>
    <header class="p-1 flex flex-col max-w-2/3 text-wrap" :aria-label="`Numero Pokédex: ${props.number}`">
        <p class="font-bold text-amber-50 text-2xl px-3">#{{ props.number }}</p>
        <div class="bg-[var(--bg-custom)]/75 rounded-full py-2 px-3">
            <h2 class="font-bold tracking-wide text-2xl capitalize" translate="no">
                {{ props.name }}
            </h2>
        </div>
    </header>
</template>