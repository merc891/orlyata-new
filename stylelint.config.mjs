export default {
  ignoreFiles: [
    'node_modules/**',
    'vendor/**',
    'wp-content/themes/orlyata/assets/dist/**',
    'storybook-static/**',
    'playwright-report/**',
    'test-results/**',
  ],
  rules: {
    'block-no-empty': true,
    'color-no-invalid-hex': true,
    'declaration-block-no-duplicate-properties': true,
    'font-family-no-duplicate-names': true,
    'no-duplicate-selectors': true,
    'property-no-unknown': true,
    'media-feature-name-disallowed-list': ['prefers-reduced-motion'],
    'selector-type-no-unknown': true,
    'unit-no-unknown': true,
  },
};

