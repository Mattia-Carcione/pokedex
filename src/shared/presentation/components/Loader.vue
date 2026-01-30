<script setup>

</script>

<template>
    <div class="flex flex-col items-center justify-center h-vh gap-6 mt-15" role="status" aria-live="polite">
        <!-- Testo Loading con puntini animati -->
        <div class="text-center pokemon mb-5 flex items-center" aria-label="Loading">
            Loading<span class="ml-1 inline-block" aria-hidden="true">
                <span class="dot-1">.</span>
                <span class="dot-2">.</span>
                <span class="dot-3">.</span>
            </span>
        </div>
    </div>
</template>

<style scoped>
    /* Puntino 1 */
    .dot-1 {
        animation: dot-flash 1.2s infinite;
    }

    /* Puntino 2 */
    .dot-2 {
        animation: dot-flash 1.2s infinite;
        animation-delay: 0.2s;
    }

    /* Puntino 3 */
    .dot-3 {
        animation: dot-flash 1.2s infinite;
        animation-delay: 0.4s;
    }

    @keyframes dot-flash {
        0% {
            opacity: 0;
        }

        30% {
            opacity: 1;
        }

        100% {
            opacity: 0;
        }
    }
</style>