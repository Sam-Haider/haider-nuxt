<!-- Todos: 

- Show summary at the end with definitions
- Use only common words from api
- show empty playing board
- animation when you get it right -->
<!-- show words you captured -->

<template>
  <div class="game-container max-w-4xl mx-auto mt-8">
    <div>Build - 8/17 8:08</div>
    <div class="flex flex-col gap-6 items-center">
      <div class="flex justify-between w-full px-4">
        <div></div>
        <button
          class="text-lg border-1 px-3 py-1 rounded-4xl bg-gradient-to-r bg-cyan-900/20 text-white"
          @click="toggleInstructions"
        >
          Rules
        </button>
      </div>
      <div class="text-6xl font-bold">WordChase</div>
      <!-- Game Metadata -->
      <div class="w-100 px-14">
        <div class="text-2xl">
          Game Clock: <span class="time text-teal-400">{{ time }} seconds</span>
        </div>
        <div class="text-2xl">
          Words Captured: <span class="score text-teal-400">{{ score }}</span>
        </div>
        <div
          v-if="showTargetWord"
          class="flex justify-center mt-12 items-center gap-3 text-xl"
        >
          <span v-if="isCorrectWord" class="text-green-500 text-3xl font-bold"
            >✔</span
          >
          <span
            v-else
            class="text-red-500 text-lg rounded-4xl px-2 border-1 border-red-500"
            >X</span
          ><span class="text-3xl">{{ targetWord }}</span>
        </div>
        <div v-else class="h-21"></div>
      </div>
    </div>

    <!-- Game board/Leters -->
    <div class="my-4 flex gap-2 justify-center p-3 text-4xl h-40 items-center">
      <template v-if="!gameOver">
        <div
          v-for="idx in 6"
          :key="idx"
          class="border border-2 border-teal-400 w-16 h-16 text-center flex items-center justify-center"
        >
          {{ letters[idx - 1] || "" }}
        </div>
      </template>
      <template v-else>
        <div class="text-2xl font-bold text-gray-200">
          <div v-if="!firstLoad" class="text-center">
            {{ selectedGameOverMessage }}!
          </div>
          <div class="flex gap-2 justify-center mt-4">
            <button
              class="text-4xl border-1 border-teal-400 px-5 py-2 rounded-4xl text-white bg-cyan-900/20"
              @click="handlePlay"
            >
              PLAY {{ !firstLoad ? "AGAIN" : "" }}
            </button>
          </div>
        </div>
      </template>
    </div>

    <!-- Game Status MAIN -->

    <Keyboard :gameOver="gameOver" @key-press="handleClick" />

    <div
      v-if="showInstructions"
      class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
    >
      <div class="rounded-lg shadow-lg p-6 w-3/4 w-full h-full relative">
        <button
          @click="showInstructions = false"
          class="absolute top-1 right-4 text-gray-500 hover:text-gray-700"
        >
          <span class="text-6xl">&times;</span>
        </button>
        <div class="text-xl px-10 mt-4">
          <div class="instructions">
            <div class="text-4xl text-bold">HOW TO PLAY</div>
            <ul class="flex flex-col gap-2 list-disc mt-8">
              <li>
                Help the computer form as many 6-letter words as possible in 60
                seconds.
              </li>
              <li>Take turns playing one letter at a time.</li>
              <li>Gain a point for every valid word formed.</li>
              <li>Lose a point for invalid letters that don't match a word.</li>
              <li>Good luck!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import Keyboard from "~/components/WordChase/Keyboard.vue";
import { useWordList } from "~/composables/WordChase/useWordList";

const { words } = await useWordList();
const gameWords = computed(() => words.value.filter((w) => w.length === 6));

const letters = ref([]);
const gameOver = ref(true);
const gameCount = ref(0);
const score = ref(0);
const isCorrectWord = ref(false);
const time = ref(60);
const showInstructions = ref(false);
const targetWord = ref("");
const showTargetWord = ref(false);
const firstLoad = ref(true);
const messages = [
  "Well done",
  "Nice try",
  "Good effort",
  "Way to go",
  "Great job",
  "Keep it up",
  "Awesome work",
  "Impressive",
  "You gave it your all",
  "Fantastic attempt",
  "Solid effort",
  "Excellent try",
  "Crushed it",
  "Nailed it",
];
const selectedGameOverMessage = ref("");
const setSelectedGameOverMessage = () => {
  const randomIndex = Math.floor(Math.random() * messages.length);
  selectedGameOverMessage.value = messages[randomIndex];
};

let timerId;

function startTimer() {
  timerId = setInterval(() => {
    if (time.value > 0) {
      time.value--;
    } else {
      clearInterval(timerId);
      setSelectedGameOverMessage();
      gameOver.value = true;
    }
  }, 1000);
}

function handlePlay() {
  gameOver.value = false;
  firstLoad.value = false;
  time.value = 60;
  score.value = 0;
  if (timerId) {
    clearInterval(timerId);
  }
  startTimer();
  const { nextWord, nextLetter } = getNext([]);
  targetWord.value = nextWord || "";
  letters.value = nextLetter ? [nextLetter] : [];
}

function handleClick(ltr) {
  if (gameOver.value) return;
  gameCount.value++;
  const { nextWord, nextLetter } = getNext([...letters.value, ltr], false);
  if (!nextWord) {
    score.value--;
    showTargetWord.value = true;
    setTimeout(() => {
      showTargetWord.value = false;
      const { nextLetter, nextWord } = getNext([]);
      targetWord.value = nextWord || "";
      letters.value = nextLetter ? [nextLetter] : [];
    }, 2000);
    return;
  } else {
    targetWord.value = nextWord;
    if (letters.value.length === 5) {
      letters.value = [...letters.value, ltr];
    } else {
      letters.value = [...letters.value, ltr, nextLetter];
    }
  }
}

function getNext(lettersArr) {
  // Takes the array of letters played so far and finds all possible matching words
  const matches = gameWords.value.filter((word) => {
    let isMatch = true;
    lettersArr?.forEach((letter, index) => {
      if (word[index]?.toLowerCase() !== letter) {
        isMatch = false;
      }
    });
    return isMatch;
  });

  // Finds a random word from the matches and sets it as the current target word
  const nextWord = matches[Math.floor(Math.random() * matches.length)];

  // The next letter to be played is the letter in the new word at the position equal to the length of lettersArr (i.e., the next letter to be played to continue the word)
  const nextLetter = nextWord && nextWord[lettersArr.length]?.toLowerCase();
  return { nextWord, nextLetter };
}

watch(letters, (newVal) => {
  if (newVal.length === 6 && newVal[5] !== "") {
    isCorrectWord.value = true;
    showTargetWord.value = true;

    setTimeout(() => {
      score.value++;
      const { nextLetter, nextWord } = getNext([]);
      targetWord.value = nextWord || "";
      letters.value = nextLetter ? [nextLetter] : [];
      isCorrectWord.value = false;
      showTargetWord.value = false;
    }, 2000);
  }
});

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

onMounted(() => {
  // useOpenAI();
});
</script>
