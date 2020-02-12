module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': 0,
    "no-unused-vars": 'off',
    "generator-star-spacing": "off",
	  "no-tabs":"off",
	  "no-irregular-whitespace":"off",
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
