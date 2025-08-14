<template>
  <div class="game-container">
    <div class="flex flex-col gap-2 items-center">
      <div class="text-4xl">WordChase</div>
      <div class="text-lg">
        TIME REMAINING: <span class="time">{{ time }}</span>
      </div>
      <div class="text-lg">
        SCORE: <span class="score">{{ score }}</span>
      </div>
    </div>
    <div class="my-4 flex gap-2 justify-center p-3">
      <div
        v-for="(letter, idx) in letters"
        :key="idx"
        class="border-b border-white"
        :class="{ correct: isCorrectWord }"
      >
        {{ letter }}
      </div>
    </div>
    <div class="message">{{ message }}</div>
    <Keyboard :gameOver="gameOver" @key-press="handleClick" />
    <div class="flex gap-2 justify-center mt-4">
      <button
        :disabled="!gameOver"
        class="bg-red-500 px-3 py-1 rounded-xl"
        @click="handlePlay"
      >
        PLAY
      </button>
      <button class="toggle-instructions" @click="toggleInstructions">
        {{ showInstructions ? "Hide" : "" }} Instructions
      </button>
    </div>
    <div v-if="showInstructions">
      <div class="instructions">
        Form as many 6-letter words as possible in 180 seconds
      </div>
      <div class="instructions">
        The computer plays the 1st, 3rd, and 5th letters. You play the rest.
      </div>
      <div class="instructions">Score 1 point for every completed word</div>
      <div class="instructions">
        Lose 1 point if you play a letter that doesn't match a word
      </div>
      <div class="instructions">Good luck!</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import Keyboard from "~/components/WordChase/Keyboard.vue";
import { useWordList } from "~/composables/WordChase/useWordList";

const { words } = useWordList();
const gameWords = computed(() => words.value.filter((w) => w.length === 6));

const letters = ref([]);
const gameOver = ref(true);
const gameCount = ref(0);
const score = ref(0);
const message = ref("");
const isCorrectWord = ref(false);
const time = ref(180);
const showInstructions = ref(false);

function updateWord(lettersArr, gameWordsArr) {
  const matches = gameWordsArr.filter((word) => {
    let isMatch = true;
    lettersArr?.forEach((letter, index) => {
      if (word[index]?.toLowerCase() !== letter) {
        isMatch = false;
      }
    });
    return isMatch;
  });
  const newWord = matches[Math.floor(Math.random() * matches.length)];
  const newLetter = newWord && newWord[lettersArr.length]?.toLowerCase();
  return { newWord, newLetter };
}

function handleClick(ltr) {
  if (gameOver.value) return;
  gameCount.value++;
  const { newWord, newLetter } = updateWord(
    [...letters.value, ltr],
    gameWords.value
  );
  if (!newWord) {
    score.value--;
    const { newLetter } = updateWord([], gameWords.value);
    letters.value = newLetter ? [newLetter] : [];
    return;
  } else {
    if (letters.value.length === 5) {
      letters.value = [...letters.value, ltr];
    } else {
      letters.value = [...letters.value, ltr, newLetter];
    }
  }
}

function handlePlay() {
  gameOver.value = false;
  message.value = "";
  const { newLetter } = updateWord([], gameWords.value);
  letters.value = newLetter ? [newLetter] : [];
  time.value = 180;
  score.value = 0;
}

function toggleInstructions() {
  showInstructions.value = !showInstructions.value;
  if (showInstructions.value) {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

watch(letters, (newVal) => {
  if (newVal.length === 6 && newVal[5] !== "") {
    isCorrectWord.value = true;
    setTimeout(() => {
      score.value++;
      const { newLetter } = updateWord([], gameWords.value);
      letters.value = newLetter ? [newLetter] : [];
      isCorrectWord.value = false;
    }, 2000);
  }
});

watch(gameOver, (val) => {
  if (!val) {
    const { newLetter } = updateWord(letters.value, gameWords.value);
    letters.value = newLetter ? [newLetter] : [];
  }
});

watch([gameOver, time], ([over, t], [prevOver, prevT]) => {
  let timerId;
  if (!over) {
    if (t > 0) {
      timerId = setTimeout(() => {
        time.value--;
      }, 1000);
    }
    if (t === 0) {
      gameOver.value = true;
      message.value = "GAME OVER!!!";
    }
  }
  return () => clearTimeout(timerId);
});
</script>
