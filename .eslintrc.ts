// .eslintrc.js
module.exports = {
    extends: [
      'eslint:recommended',
      'plugin:vue/vue3-recommended',
      '@nuxt/eslint-config',
      'prettier'
    ],
    rules: {
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      indent: ['error', 2]
    }
  }