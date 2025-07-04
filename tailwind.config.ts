import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './app.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.ts',
  ],
  theme: {
    extend: {
      colors: {
        // ✅ flat keys only
        'black-90': '#0a0a0a',
        'black-80': '#1a1a1a',
        'black-70': '#2a2a2a',
        'black-60': '#3a3a3a',
        'black-50': '#4a4a4a',
        'sam-test': '#FF0000'
      },
    },
  },
  plugins: [],
}

export default config