<template>
  <NuxtLink to="/games/WordChase" class="absolute right-3">
    <span class="text-4xl">&times;</span>
  </NuxtLink>
  <div class="flex flex-col items-center justify-center p-3">
    <div class="text-4xl mb-3">Rules</div>
    <ul class="list-disc list-inside text-lg max-w-3xl p-3">
      <li>Work with the computer to form as many 6 letter words as possible</li>
      <li>
        If you play a letter that doesn't match a valid English word, you lose a
        life
      </li>
      <li>If you lose 3 lives, it's game over</li>
    </ul>
  </div>
</template>
