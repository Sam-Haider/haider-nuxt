<template>
    <button class="py-1 px-4 rounded-3xl hover:scale-105 transition-transform duration-150" :class="isEnabled ? 'bg-green-200' : 'bg-green-500'">
        <slot></slot>
    </button>
</template>

<script setup lang="ts">

withDefaults(defineProps<{
    isEnabled: boolean,
}>(), {
    isEnabled: false,
})

</script>