<template>
  <component
    :is="isExternal ? 'a' : NuxtLink"
    :href="isExternal ? to : undefined"
    :to="!isExternal ? to : undefined"
    target="_blank"
    rel="noopener noreferrer"
    class="text-green-500 underline hover:text-green-600"
  >
    <slot />
  </component>
</template>
  
<script setup lang="ts">
import { NuxtLink } from '#components'

const props = withDefaults(defineProps<{
  to: string
  isExternal?: boolean
  }>(), {
    isExternal: false
  }
)

</script>