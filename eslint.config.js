import boundaries from 'eslint-plugin-boundaries';
import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import tsParser from '@typescript-eslint/parser';

const layerRules = [
  { from: 'core', allow: ['core'] },
  { from: 'config', allow: ['config'] },
  { from: 'infrastructure', allow: ['core', 'config', 'infrastructure'] },
  { from: 'shared', allow: ['core', 'config', 'infrastructure', 'shared', 'assets'] },
  {
    from: 'modules',
    allow: [
      ['modules', { module: '${module}' }],
      'core',
      'config',
      'shared',
      'infrastructure',
      'assets',
    ],
  },
  { from: 'app', allow: ['core', 'config', 'shared', 'infrastructure', 'modules', 'app', 'assets'] },
];

export default [
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**'],
  },
  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    plugins: {
      vue,
      boundaries,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.ts', '.vue', '.json'],
        },
      },
      'boundaries/ignore': ['**/*.test.*', '**/*.spec.*'],
      'boundaries/elements': [
        { type: 'assets', pattern: 'assets/**' },
        { type: 'app', pattern: 'src/app/**' },
        { type: 'core', pattern: 'src/core/**' },
        { type: 'config', pattern: 'src/config/**' },
        { type: 'infrastructure', pattern: 'src/infrastructure/**' },
        { type: 'shared', pattern: 'src/shared/**' },
        { type: 'modules', pattern: 'src/modules/*/**', capture: ['module'] },
      ],
    },
    rules: {
      'boundaries/no-unknown': 'error',
      'boundaries/element-types': ['error', { default: 'disallow', rules: layerRules }],
    },
  },
];