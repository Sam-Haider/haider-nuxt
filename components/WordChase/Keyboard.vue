<template>
  <div class="keyboard-container">
    <div class="keyboard">
      <button
        v-for="key in keys"
        :key="key"
        class="key border-1 border-red-500"
        :value="key"
        :disabled="gameOver"
        @click="$emit('key-press', key.toLowerCase())"
      >
        {{ key }}
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  gameOver: Boolean,
});
const keys = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
</script>

<style scoped>
.keyboard {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-width: 400px;
  margin: 0 auto;
}
.key {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.key:hover {
  background: #bdbdbd;
}
</style>
