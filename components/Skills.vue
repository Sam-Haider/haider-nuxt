<template>
    <div class="bg-gray-950">
        <div class="max-w-[1000px] mx-auto p-8">
            <div>
                <h2 class="text-4xl font-semibold pb-8">Top Skills</h2>
            </div>
            <div class="grid gap-4 grid-cols-[repeat(auto-fit,minmax(100px,1fr))]">
                <div v-for="skill in skills" class="border border-1 border-white rounded-xl py-1 flex items-center justify-center bg-green-500 text-black font-bold">{{ skill }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

const skills = [
  'JavaScript',
  'TypeScript',
  'Vue',
  'Nuxt',
  'Tailwind',
  'React',
  'Storybook',
  'LaunchDarkly',
  'Vitest',
  'Web Vitals',
  'CloudFront',
  'CloudWatch',
  'OpenSearch',
  'SQL',
  'Node.js'
]
</script>