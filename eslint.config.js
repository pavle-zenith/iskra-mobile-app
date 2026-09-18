// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    // Screens use the token-aware primitives, never the raw React Native ones.
    // A raw <Text> skips the bundled fonts; a raw <Pressable> skips the 48pt target.
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/components/primitives/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react-native',
              importNames: ['Text', 'Pressable', 'TouchableOpacity', 'TouchableHighlight'],
              message: 'Use Text / Pressable from @/components/primitives.',
            },
          ],
        },
      ],
    },
  },
  {
    ignores: ['dist/*', 'ios/*', 'android/*', '.expo/*', 'Iskra-Website/*'],
  },
]);
