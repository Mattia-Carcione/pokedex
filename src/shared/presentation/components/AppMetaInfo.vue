<script setup>
import { APP_VERSION, LAST_UPDATED } from '@/config/buildMeta';
</script>

<template>
    <section aria-label="Version and last update" class="text-sm opacity-90">
        <p>
            Version <strong>{{ APP_VERSION }}</strong>
            <span aria-hidden="true"> · </span>
            <span>Last updated: {{ LAST_UPDATED }}</span>
        </p>
    </section>
</template>
