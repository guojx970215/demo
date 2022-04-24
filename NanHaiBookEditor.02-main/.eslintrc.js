const jsRules = {
  'react/jsx-indent': ['error', 2],
  'react/jsx-indent-props': ['error', 2],
  'func-style': 'off',
  'no-undef': 'error',
  'no-empty': 'off',
  'no-unused-vars': 'off',
  'prefer-const': 'warn',
  'no-console': 'warn',
  'valid-jsdoc': 'off',
};

const tsRules = {
  ...jsRules,
  '@typescript-eslint/ban-ts-comment': 'off',
  '@typescript-eslint/ban-types': 'off',
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/no-empty-function': 'off',
  '@typescript-eslint/no-empty-interface': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-inferrable-types': 'off',
  '@typescript-eslint/no-non-null-assertion': 'off',
  '@typescript-eslint/no-unused-vars': 'warn',
  '@typescript-eslint/no-var-requires': 'off',
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'warn',
  'import/order': [
    'warn',
    {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
      pathGroups: [
        {
          pattern: 'react',
          group: 'external',
          position: 'before',
        },
      ],
      pathGroupsExcludedImportTypes: ['react'],
      'newlines-between': 'never',
      alphabetize: {
        order: 'asc',
      },
    },
  ],
  'react/prop-types': 'off',
};

const jsonRules = {
  'json/*': ['warn', 'allowComments'],
};

module.exports = {
  plugins: ['react', 'react-hooks', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  env: {
    es2020: true,
    node: true,
    browser: true,
    jest: true,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: jsRules,
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint', 'react', 'react-hooks'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'prettier',
      ],
      rules: tsRules,
    },
    {
      files: ['**/*.json'],
      plugins: ['json'],
      extends: ['plugin:json/recommended'],
      rules: jsonRules,
    },
  ],
};
