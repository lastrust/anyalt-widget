module.exports = {
  root: true,
  env: {
    es6: true,
    es2017: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: '.',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'jest', 'prettier'],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'jest/no-test-callback': 'off',
    'jest/no-export': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-console': 'off',
    'one-var': [
      2,
      {
        var: 'never',
        let: 'never',
        const: 'never',
      },
    ],
    //TODO: Refactor code in future by this next 3 lines rules:
    '@typescript-eslint/no-unsafe-return': 1,
    '@typescript-eslint/no-unsafe-assignment': 1,
    '@typescript-eslint/no-unsafe-member-access': 1,
    '@typescript-eslint/no-unsafe-call': 1,
    '@typescript-eslint/ban-ts-comment': 'off', // TODO: Remove after refactoring
    '@typescript-eslint/no-empty-object-type': 'off'
  },
};
