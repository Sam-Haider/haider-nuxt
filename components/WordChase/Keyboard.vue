<template>
  <div
    class="keyboard-container w-full fixed bottom-0 left-0 p-4 bg-gray-900/95 backdrop-blur-md"
  >
    <div
      class="keyboard flex flex-col items-center gap-2 max-w-lg mx-auto p-4 rounded-xl bg-gray-800/90 shadow-2xl border-4 border-transparent relative"
    >
      <div class="flex gap-2 w-full justify-center">
        <button
          v-for="key in row1"
          :key="key"
          class="key w-[9%] aspect-square rounded-md bg-gray-700 text-lg font-bold text-cyan-300 shadow-lg border-2 border-t-gray-600 border-l-gray-600 border-r-gray-800 border-b-gray-800 active:translate-y-[2px] active:border-t-gray-700 active:border-l-gray-700 active:shadow-inner active:bg-gray-800 transition-all duration-75 ease hover:bg-gray-600/50 hover:text-cyan-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation relative overflow-hidden after:absolute after:inset-0 after:bg-gradient-to-b after:from-white/10 after:to-transparent"
          :value="key"
          :disabled="gameOver"
          @click="$emit('key-press', key.toLowerCase())"
        >
          {{ key }}
        </button>
      </div>
      <div class="flex gap-2 w-full justify-center">
        <button
          v-for="key in row2"
          :key="key"
          class="key w-[9%] aspect-square rounded-md bg-gray-700 text-lg font-bold text-cyan-300 shadow-lg border-2 border-t-gray-600 border-l-gray-600 border-r-gray-800 border-b-gray-800 active:translate-y-[2px] active:border-t-gray-700 active:border-l-gray-700 active:shadow-inner active:bg-gray-800 transition-all duration-75 ease hover:bg-gray-600/50 hover:text-cyan-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation relative overflow-hidden after:absolute after:inset-0 after:bg-gradient-to-b after:from-white/10 after:to-transparent"
          :value="key"
          :disabled="gameOver"
          @click="$emit('key-press', key.toLowerCase())"
        >
          {{ key }}
        </button>
      </div>
      <div class="flex gap-2 w-full justify-center">
        <button
          v-for="key in row3"
          :key="key"
          class="key w-[9%] aspect-square rounded-md bg-gray-700 text-lg font-bold text-cyan-300 shadow-lg border-2 border-t-gray-600 border-l-gray-600 border-r-gray-800 border-b-gray-800 active:translate-y-[2px] active:border-t-gray-700 active:border-l-gray-700 active:shadow-inner active:bg-gray-800 transition-all duration-75 ease hover:bg-gray-600/50 hover:text-cyan-200 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation relative overflow-hidden after:absolute after:inset-0 after:bg-gradient-to-b after:from-white/10 after:to-transparent"
          :value="key"
          :disabled="gameOver"
          @click="$emit('key-press', key.toLowerCase())"
        >
          {{ key }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  gameOver: Boolean,
});
const row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const row3 = ["Z", "X", "C", "V", "B", "N", "M"];
</script>

<style scoped>
.keyboard {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0 auto;
  background-clip: padding-box;
}

.keyboard::before {
  content: "";
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 12px;
  background: linear-gradient(90deg, #06b6d4, #3b82f6, #a21caf, #06b6d4);
  background-size: 300% 100%;
  animation: moveGradient 4s linear infinite;
  z-index: -1;
}

@keyframes moveGradient {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: -300% 50%;
  }
}

.key {
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
</style>
