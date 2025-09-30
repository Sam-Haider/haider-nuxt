<template>
  <NuxtLink to="/games/WordChase" class="absolute right-3">
    <span class="text-4xl">&times;</span>
  </NuxtLink>
  <div class="flex flex-col items-center justify-center p-3">
    <div class="text-4xl mb-3">Rules</div>
    <ul class="text-lg max-w-3xl p-3 flex flex-col gap-3">
      <li>
        1. Join forces with the computer to form as many 6 letter words as
        possible
      </li>
      <li>
        2. In shot clock mode, you get 12 seconds per letter. In total time
        mode, you get 2 minutes total
      </li>
      <li>
        3. If you play a letter that doesn't match a valid English word, you
        lose a life
      </li>
      <li>4. When 2 minute are up or you lose 3 lives, game over</li>
    </ul>
  </div>
</template>
