// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

// Screens use the token-aware primitives, never the raw React Native ones.
// A raw <Text> skips the bundled fonts; a raw <Pressable> skips the 48pt target.
const rawPrimitives = {
  name: 'react-native',
  importNames: ['Text', 'Pressable', 'TouchableOpacity', 'TouchableHighlight'],
  message: 'Use Text / Pressable from @/components/primitives.',
};

// UI never talks to the network. It reads and writes SQLite through @/data/repo; only the
// sync engine and auth reach Supabase. This is what keeps a screen from ever spinning
// mid-craving.
const networkClients = [
  {
    name: '@supabase/supabase-js',
    message: 'UI never talks to Supabase. Read and write through @/data/repo.',
  },
  {
    name: '@/data/supabase',
    message: 'UI never talks to Supabase. Read and write through @/data/repo.',
  },
];

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/components/primitives/**'],
    rules: {
      'no-restricted-imports': ['error', { paths: [rawPrimitives] }],
    },
  },
  {
    files: ['src/app/**/*.{ts,tsx}', 'src/components/**/*.{ts,tsx}', 'src/features/**/*.{ts,tsx}'],
    ignores: ['src/components/primitives/**'],
    rules: {
      'no-restricted-imports': ['error', { paths: [rawPrimitives, ...networkClients] }],
    },
  },
  {
    ignores: [
      'dist/*',
      'ios/*',
      'android/*',
      '.expo/*',
      'Iskra-Website/*',
      'ISKRA - mobile claude design export/*',
    ],
  },
]);
