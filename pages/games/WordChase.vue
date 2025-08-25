<template>
  <div class="max-w-4xl mx-auto py-5 px-3 h-[100vh] flex flex-col">
    <!-- Heading: Title, Rules -->
    <div class="flex justify-center w-full px-4 items-center">
      <div class="text-3xl font-bold">WordChase</div>
    </div>

    <!-- Game Status: Lives, Score, Word Attempt Result-->
    <div
      v-if="!gameOver"
      class="border-b-1 border-white-400 p-3 flex flex-col gap-3"
    >
      <div class="text-2xl flex h-12">
        Lives: &nbsp;
        <span class="inline-flex gap-4">
          <Icon
            v-for="i in 3"
            :key="i"
            name="hugeicons:brain-02"
            class="w-8 h-8 text-teal-400 transition-opacity duration-300"
            :class="i <= livesRemaining ? 'opacity-100' : 'opacity-0'"
          />
        </span>
      </div>
      <div class="text-2xl h-12">
        Score: <span class="score text-teal-400">{{ score }}</span>
      </div>
    </div>
    <div v-else class="h-33"></div>

    <!-- Game Board/Letters -->
    <div class="gap-2 justify-center text-4xl items-center">
      <template v-if="!gameOver">
        <div class="flex flex-col gap-4 h-45">
          <div class="flex justify-center gap-3 px-3 py-6">
            <div
              v-for="idx in 6"
              :key="idx"
              class="border border-2 border-teal-400 w-16 h-16 text-center flex items-center justify-center"
            >
              <span
                class="transition-all duration-500"
                :class="{
                  'opacity-0 scale-95': !letters[idx - 1],
                  'opacity-100 scale-100': letters[idx - 1],
                }"
              >
                {{ letters[idx - 1] || "" }}
              </span>
            </div>
          </div>
          <div
            v-if="showTargetWord"
            class="flex justify-center items-center items-center gap-3 text-xl h-12"
          >
            <span
              v-if="isCorrectWord"
              class="text-green-500 text-3xl font-bold"
            >
              <Icon
                name="material-symbols:check-circle"
                class="text-green-500"
              />
            </span>
            <span
              v-else
              class="text-red-500 text-lg rounded-4xl px-2 border-1 border-red-500"
              >X</span
            ><span class="text-3xl">{{ targetWord }}</span>
          </div>
          <!-- empty space to avoid layout shift -->
          <div v-else class="h-12"></div>
        </div>
      </template>
      <template v-else>
        <div class="h-45">
          <div v-if="!firstLoad" class="text-sm flex flex-col gap-2">
            You Captured:
            <div class="flex gap-2 overflow-x-auto whitespace-nowrap pb-3">
              <div
                v-for="word in capturedWords"
                class="border border1 border-teal-400 rounded-4xl px-2"
              >
                {{ word }}
              </div>
            </div>
            You Missed:
            <div class="flex gap-2 overflow-x-auto whitespace-nowrap mb-8 pb-3">
              <div
                v-for="word in missedWords"
                class="border border1 border-red-500 rounded-4xl px-2"
              >
                {{ word }}
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-3 justify-center items-center flex-0">
            <button
              class="text-3xl border-1 border-teal-400 px-5 py-2 rounded-4xl text-white bg-cyan-900/20"
              @click="handlePlay"
            >
              PLAY {{ !firstLoad ? "AGAIN" : "" }}
            </button>
            <button class="text-base text-white" @click="toggleInstructions">
              Rules
            </button>
          </div>
        </div>
      </template>
    </div>

    <!-- Game Status MAIN -->

    <Keyboard :gameOver="gameOver" @key-press="clickHandler" class="w-full" />
    <div
      v-if="showInstructions"
      class="fixed inset-5 bg-black bg-opacity-50 flex z-50"
    >
      <div class="rounded-lg shadow-lg p-6 relative">
        <button
          @click="showInstructions = false"
          class="absolute top-1 right-4 text-gray-500 hover:text-gray-700"
        >
          <span class="text-6xl">&times;</span>
        </button>
        <div class="text-xl px-10 mt-4">
          <div class="instructions">
            <div class="text-4xl text-bold">Rules</div>
            <ul class="flex flex-col gap-2 list-disc mt-8">
              <li>Make as many 6-letter words as possible</li>
              <li>Alternate turns with the computer to build the word</li>
              <li>3 wrong letters = game over</li>
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

useHead({
  title: "WordChase",
  link: [{ rel: "icon", type: "image/png", href: "/favicon.svg" }],
});

// Initialize Game
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
const capturedWords = ref([]);
const missedWords = ref([]);
const showTargetWord = ref(false);
const firstLoad = ref(true);
const livesRemaining = ref(3);
const isKeyboardDisabled = ref(true);

// End Game if Lives are 0
watch(livesRemaining, (newVal) => {
  if (newVal <= 0) {
    gameOver.value = true;
  }
});

// Start or Restart Game
function handlePlay() {
  livesRemaining.value = 3;
  gameOver.value = false;
  firstLoad.value = false;
  time.value = 60;
  score.value = 0;
  letters.value = [];
  capturedWords.value = [];
  missedWords.value = [];
  // Delay the first letter to allow for fade-in
  setTimeout(() => {
    const { nextWord, nextLetter } = getNext([]);
    targetWord.value = nextWord || "";
    letters.value = nextLetter ? [nextLetter] : [];
    isKeyboardDisabled.value = false;
  }, 700);
}

// Click Handle Wrapper (disables clicks when keyboard is disabled)
const clickHandler = computed(() => {
  return isKeyboardDisabled.value ? () => {} : handleClick;
});

// Handle User Selection - User's Turn, Then Computer's Turn
function handleClick(ltr) {
  isKeyboardDisabled.value = true;
  if (gameOver.value) return;
  gameCount.value++;
  const { nextWord, nextLetter } = getNext([...letters.value, ltr], false);
  if (!nextWord) {
    missedWords.value.push(targetWord.value);
    showTargetWord.value = true;
    setTimeout(() => {
      livesRemaining.value--;
      showTargetWord.value = false;
      letters.value = [];
      setTimeout(() => {
        const { nextLetter, nextWord } = getNext([]);
        targetWord.value = nextWord || "";
        letters.value = nextLetter ? [nextLetter] : [];
        isKeyboardDisabled.value = false;
      }, 500);
    }, 2000);
    return;
  } else {
    targetWord.value = nextWord;
    // Add the user's letter
    setTimeout(() => {
      letters.value = [...letters.value, ltr];
    }, 50);

    // If the word is not complete, add the computer's letter after a delay
    if (letters.value.length < 6 && nextLetter) {
      setTimeout(() => {
        letters.value = [...letters.value, nextLetter];
        isKeyboardDisabled.value = false;
      }, 1500);
    }
  }
}

// Helper to get the next letter and word
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

  // Finds a random word from the matches and sets it as the computer's current target word
  const nextWord = matches[Math.floor(Math.random() * matches.length)];

  // Finds the next letter to be played
  const nextLetter = nextWord && nextWord[lettersArr.length]?.toLowerCase();
  return { nextWord, nextLetter };
}

// Watch for Win Condition
watch(letters, (newVal) => {
  if (newVal.length === 6 && newVal[5] !== "") {
    isCorrectWord.value = true;
    showTargetWord.value = true;
    capturedWords.value.push(targetWord.value);

    setTimeout(() => {
      score.value++;
      letters.value = [];
      isCorrectWord.value = false;
      showTargetWord.value = false;

      // Delay the next word's first letter
      setTimeout(() => {
        const { nextLetter, nextWord } = getNext([]);
        targetWord.value = nextWord || "";
        letters.value = nextLetter ? [nextLetter] : [];
        isKeyboardDisabled.value = false;
      }, 500);
    }, 2000);
  }
});

// Toggle Instructions Modal
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
  document.body.style.overflow = "hidden";
});
</script>
