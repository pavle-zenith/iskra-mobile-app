// Integration tests against the live Supabase project. Never part of `npm test`, which must
// pass with no network. Run with `npm run test:rls`.
//
// Plain Node, not the jest-expo preset: that preset installs React Native's fetch stub, and
// these tests need real HTTP. Babel is only here to strip TypeScript; its preset ships inside
// the expo package, so resolve it from there.
const babelPresetExpo = require.resolve('babel-preset-expo', {
  paths: [require.resolve('expo/package.json')],
});

module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/integration'],
  transform: { '^.+\\.[jt]sx?$': ['babel-jest', { presets: [babelPresetExpo] }] },
  testTimeout: 30_000,
};
