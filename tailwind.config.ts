// Todo: config not working. Investigate later.
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.{js,vue,ts}",
    "./pages/**/*.{js,vue,ts}",
    "./plugins/**/*.{js,ts}",
    "./composables/**/*.{js,ts}",
    "./app.{js,ts,vue}",
    "./nuxt.config.{js,ts}",
    "./assets/**/*.css",
    "./components/**/*.{css,scss,sass,less}",
    "./layouts/**/*.{css,scss,sass,less}",
    "./pages/**/*.{css,scss,sass,less}",
  ],
  theme: {
    extend: {
      colors: {
        custom: {
          "black-90": "#0a0a0a",
          "black-80": "#1a1a1a",
          "black-70": "#2a2a2a",
          "black-60": "#3a3a3a",
          "black-50": "#4a4a4a",
          "sam-test": "#FF0000",
          "cyan-pop": "#1fb4ce",
        },
      },
    },
  },
  plugins: [],
};

export default config;
