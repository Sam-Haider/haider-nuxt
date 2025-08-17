<template>
  <div class="game-container max-w-4xl mx-auto mt-8">
    <div class="flex flex-col gap-2 items-center">
      <div class="text-4xl">WordChase</div>
      <div class="text-lg">
        TIME REMAINING: <span class="time">{{ time }}</span>
      </div>
      <div class="text-lg">
        SCORE: <span class="score">{{ score }}</span>
      </div>
    </div>
    <div class="my-4 flex gap-2 justify-center p-3 text-4xl">
      <div
        v-for="(letter, idx) in letters"
        :key="idx"
        :class="{ correct: isCorrectWord }"
        class="border border-2 border-teal-400 w-12 h-12 text-center opacity-0 animate-fade-in"
      >
        {{ letter }}
      </div>
    </div>
    <div class="message">{{ message }}</div>
    <Keyboard :gameOver="gameOver" @key-press="handleClick" />
    <div class="flex gap-2 justify-center mt-4">
      <button
        :disabled="!gameOver"
        class="border-1 border-teal-400 px-3 py-1 rounded-xl"
        @click="handlePlay"
      >
        PLAY
      </button>
      <button class="toggle-instructions" @click="toggleInstructions">
        {{ showInstructions ? "Hide" : "" }} Instructions
      </button>
    </div>
    <div
      v-if="showTargetWord"
      class="flex justify-center mt-4 items-center gap-3"
    >
      <span
        class="text-red-500 text-lg rounded-4xl px-2 border-1 border-red-500"
        >X</span
      ><span>The word was {{ targetWord }}</span>
    </div>
    <div v-if="showInstructions">
      <div class="instructions">
        Form as many 6-letter words as possible in 60 seconds
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

const { words } = await useWordList();
const gameWords = computed(() => words.value.filter((w) => w.length === 6));

const letters = ref([]);
const gameOver = ref(true);
const gameCount = ref(0);
const score = ref(0);
const message = ref("");
const isCorrectWord = ref(false);
const time = ref(60);
const showInstructions = ref(false);
const targetWord = ref("");
const showTargetWord = ref(false);

function handlePlay() {
  gameOver.value = false;
  message.value = "";
  time.value = 60;
  score.value = 0;
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
      const { nextLetter } = getNext([]);
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
    setTimeout(() => {
      score.value++;
      const { nextLetter } = getNext([]);
      letters.value = nextLetter ? [nextLetter] : [];
      isCorrectWord.value = false;
    }, 2000);
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
