module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'no-multiple-empty-lines': [2, { max: 2 }],
    'semi': [2, 'always'],
    'curly': ['warn'],
    'prefer-template': ['warn'],
    'space-before-function-paren': [0, { anonymous: 'always', named: 'always' }],
    'camelcase': 0,
    'no-return-assign': 0,
    'quotes': ['error', 'single'],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'import/no-unresolved': 0,
    'import/order': [
      'warn', {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type', 'object'],
        'newlines-between': 'always',
      },
    ],
  },
};