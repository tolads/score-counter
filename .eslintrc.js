var path = require('path');

module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
  },
  extends: ['airbnb', 'prettier'],
  globals: {
    window: true,
    document: true,
    navigator: true,
  },
  rules: {
    // 'arrow-parens': 'off',
    // 'consistent-return': 'off',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/jsx-one-expression-per-line': 'off',
    'react/prop-types': 'off',
  },
};
