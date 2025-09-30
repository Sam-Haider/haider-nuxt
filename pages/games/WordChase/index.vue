<template>
  <div class="max-w-4xl mx-auto py-5 px-3 h-[100vh] flex flex-col">
    <!-- Heading: Title, Rules -->
    <div class="flex justify-center w-full px-4 items-center">
      <div class="text-3xl font-bold">WordChase</div>
    </div>

    <!-- Time Variant Toggle -->
    <div v-if="gameOver" class="flex justify-center w-full px-4 py-3">
      <div class="flex gap-3 items-center text-sm">
        <span class="text-gray-300">Mode:</span>
        <div
          class="relative border border-gray-500 rounded-lg p-1 flex bg-gray-800"
        >
          <!-- Sliding background -->
          <div
            class="absolute top-1 bottom-1 bg-teal-700 rounded-md transition-all duration-300 ease-in-out"
            :class="{
              'left-1 w-[83px]': timeVariant === 'shot',
              'left-[88px] w-[84px]': timeVariant === 'total',
            }"
          ></div>
          <button
            @click="timeVariant = 'shot'"
            class="relative z-10 px-3 py-1 rounded-md transition-colors duration-300"
            :class="
              timeVariant === 'shot'
                ? 'text-white'
                : 'text-gray-300 hover:text-white'
            "
          >
            Shot Clock
          </button>
          <button
            @click="timeVariant = 'total'"
            class="relative z-10 px-3 py-1 rounded-md transition-colors duration-300"
            :class="
              timeVariant === 'total'
                ? 'text-white'
                : 'text-gray-300 hover:text-white'
            "
          >
            Total Time
          </button>
        </div>
      </div>
    </div>

    <!-- Game Status: Lives, Score, Word Attempt Result-->
    <div
      v-if="!gameOver"
      class="border-b-1 border-white-400 p-3 flex flex-col gap-3"
    >
      <div class="text-lg flex h-12 items-center">
        Lives: &nbsp;
        <span class="inline-flex gap-4">
          <Icon
            v-for="i in 3"
            :key="i"
            name="hugeicons:brain-02"
            class="w-8 h-8 text-emerald-600 transition-opacity duration-300"
            :class="i <= livesRemaining ? 'opacity-100' : 'opacity-0'"
          />
        </span>
      </div>
      <div class="flex gap-3 items-center">
        <div class="text-lg h-12">
          Score: <span class="score font-bold text-amber-400">{{ score }}</span>
        </div>
        <div class="text-lg h-12">
          <template v-if="timeVariant === 'total'">
            Time Remaining:
            <span class="score text-gray-300"
              >{{ minutes }}m {{ seconds }}s</span
            >
          </template>
        </div>
      </div>
    </div>
    <div v-else class="h-33"></div>

    <!-- Game Board/Letters -->
    <div class="gap-2 justify-center text-4xl items-center">
      <template v-if="!gameOver">
        <template v-if="timeVariant === 'shot'">
          <div class="flex items-center gap-2 h-12">
            <span class="text-lg">Turn Timer:</span>
            <template v-if="!isKeyboardDisabled">
              <span
                class="score"
                :class="{
                  'text-red-400': shotClockTime <= 3,
                  'text-yellow-400': shotClockTime >= 4 && shotClockTime <= 6,
                  'text-gray-300': shotClockTime > 6,
                }"
                >{{ shotClockTime }}s</span
              >
            </template>
          </div>
        </template>
        <div class="flex flex-col gap-4 h-45">
          <div class="flex justify-center gap-1 px-3 py-6">
            <div
              v-for="idx in 6"
              :key="idx"
              class="border border-2 border-white w-16 text-center flex items-center justify-center aspect-square rounded-md"
            >
              <span
                class="transition-all duration-500"
                :class="{
                  'opacity-0 scale-95': !letters[idx - 1],
                  'opacity-100 scale-100': letters[idx - 1],
                }"
              >
                {{ letters[idx - 1]?.toUpperCase() || "" }}
              </span>
            </div>
          </div>
          <div
            v-if="showTargetWord"
            class="flex justify-center items-center items-center gap-3 text-xl h-12"
          >
            <span
              v-if="isCorrectWord"
              class="text-green-500 text-3xl font-bold flex items-center"
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
            ><span class="text-3xl">{{ targetWord?.toUpperCase() }}</span>
          </div>
          <!-- empty space to avoid layout shift -->
          <div v-else class="h-12"></div>
        </div>
      </template>
      <template v-else>
        <div class="h-45">
          <div v-if="!firstLoad" class="text-sm flex flex-col gap-2">
            <div class="flex gap-1">
              Captured Words:
              <span class="text-amber-400">{{ capturedWords.length }}</span>
            </div>
            <div class="flex gap-2 overflow-x-auto whitespace-nowrap pb-3">
              <div
                v-for="word in capturedWords"
                class="border border1 border-teal-400 rounded-4xl px-2"
              >
                {{ word?.toUpperCase() }}
              </div>
            </div>
            Missed Words:
            <div class="flex gap-2 overflow-x-auto whitespace-nowrap mb-8 pb-3">
              <div
                v-for="word in missedWords"
                class="border border1 border-red-500 rounded-4xl px-2"
              >
                {{ word?.toUpperCase() }}
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-3 justify-center items-center flex-0">
            <button
              class="text-2xl border-1 border-teal-400 px-4 py-1.5 rounded-4xl text-white bg-cyan-900/20"
              @click="handlePlay"
            >
              PLAY {{ !firstLoad ? "AGAIN" : "" }}
            </button>
            <NuxtLink class="text-base text-white" to="/games/WordChase/rules">
              Rules
            </NuxtLink>
          </div>
        </div>
      </template>
    </div>

    <!-- Game Status MAIN -->

    <Keyboard
      :isDisabled="isKeyboardDisabled"
      @key-press="clickHandler"
      class="w-full"
    />
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
const time = ref(120);
const minutes = computed(() => Math.floor(time.value / 60));
const seconds = computed(() => time.value % 60);
const targetWord = ref("");
const capturedWords = ref([]);
const missedWords = ref([]);
const showTargetWord = ref(false);
const firstLoad = ref(true);
const livesRemaining = ref(3);
const isKeyboardDisabled = ref(true);
const intervalId = ref(null);
const timeVariant = ref("shot");
const shotClockTime = ref(10);
const shotClockIntervalId = ref(null);

// End Game if Lives are 0
watch(livesRemaining, (newVal) => {
  if (newVal <= 0) {
    gameOver.value = true;
    isKeyboardDisabled.value = true;
  }
});

// Watch for shot clock expiration
watch(shotClockTime, (newVal) => {
  if (newVal <= 0 && timeVariant.value === "shot" && !gameOver.value) {
    handleShotClockExpiry();
  }
});

// Start or Restart Game
function handlePlay() {
  livesRemaining.value = 3;
  gameOver.value = false;
  firstLoad.value = false;

  // Clear existing timers
  if (intervalId.value) clearInterval(intervalId.value);
  if (shotClockIntervalId.value) clearInterval(shotClockIntervalId.value);

  // Initialize timers based on variant
  if (timeVariant.value === "total") {
    time.value = 120;
    intervalId.value = setInterval(() => {
      if (time.value > 0 && !gameOver.value) {
        time.value--;
      } else if (time.value === 0) {
        gameOver.value = true;
        isKeyboardDisabled.value = true;
      }
    }, 1000);
  } else {
    shotClockTime.value = 10;
  }

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

    // Start shot clock if in shot clock mode
    if (timeVariant.value === "shot") {
      startShotClock();
    }
  }, 700);
}

// Shot Clock Functions
function startShotClock() {
  shotClockTime.value = 10;
  if (shotClockIntervalId.value) clearInterval(shotClockIntervalId.value);
  shotClockIntervalId.value = setInterval(() => {
    if (
      shotClockTime.value > 0 &&
      !gameOver.value &&
      !isKeyboardDisabled.value
    ) {
      shotClockTime.value--;
    }
  }, 1000);
}

function stopShotClock() {
  if (shotClockIntervalId.value) {
    clearInterval(shotClockIntervalId.value);
    shotClockIntervalId.value = null;
  }
}

function handleShotClockExpiry() {
  stopShotClock();
  livesRemaining.value--;
  isKeyboardDisabled.value = true;

  if (livesRemaining.value > 0) {
    // Reset for next turn
    setTimeout(() => {
      letters.value = [];
      setTimeout(() => {
        const { nextLetter, nextWord } = getNext([]);
        targetWord.value = nextWord || "";
        letters.value = nextLetter ? [nextLetter] : [];
        isKeyboardDisabled.value = false;
        startShotClock();
      }, 500);
    }, 1000);
  }
}

// Click Handle Wrapper (disables clicks when keyboard is disabled)
const clickHandler = computed(() => {
  return isKeyboardDisabled.value ? () => {} : handleClick;
});

// Handle User Selection - User's Turn, Then Computer's Turn
function handleClick(ltr) {
  isKeyboardDisabled.value = true;
  if (gameOver.value) return;

  // Stop shot clock when user makes a move
  if (timeVariant.value === "shot") {
    stopShotClock();
  }

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
        if (livesRemaining.value > 0) {
          isKeyboardDisabled.value = false;
          // Restart shot clock for next turn
          if (timeVariant.value === "shot") {
            startShotClock();
          }
        }
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
        // Restart shot clock for next turn
        if (timeVariant.value === "shot") {
          startShotClock();
        }
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
    // Stop shot clock when word is completed
    if (timeVariant.value === "shot") {
      stopShotClock();
    }

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
        // Restart shot clock for next turn
        if (timeVariant.value === "shot") {
          startShotClock();
        }
      }, 500);
    }, 2000);
  }
});

onMounted(() => {
  document.body.style.overflow = "hidden";
});
</script>
