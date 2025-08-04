import uniHelper from '@uni-helper/eslint-config'

export default uniHelper({
  uni: true,
  vue: {
    vueVersion: 2,
    sfcBlocks: false,
  },
  formatters: true,
  markdown: false,
  typescript: false,
  ignores: [
    'uni_modules/',
    'unpackage/',
    'node_modules',
    'dist',
  ],
  rules: {
    'no-console': 'off',
    'no-unused-vars': 'off',
    'vue/no-unused-refs': 'off',
    'unused-imports/no-unused-vars': 'off',
    'eslint-comments/no-unlimited-disable': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'jsdoc/check-param-names': 'off',
    'jsdoc/require-returns-description': 'off',
    'ts/no-empty-object-type': 'off',
    'no-extend-native': 'off',
    'vue/no-v-text-v-html-on-component': 'off',
    'node/prefer-global/process': 'off',
    'vue/html-self-closing': 'off',
  },
})
