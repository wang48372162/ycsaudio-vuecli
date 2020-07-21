const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': isProduction ? 'error' : 'off',
    'no-debugger': isProduction ? 'error' : 'off',
    'space-before-function-paren': [
      isProduction ? 'error' : 'off',
      {
        anonymous: 'always',
        named: 'never'
      }
    ]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
