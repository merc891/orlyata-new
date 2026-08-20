import type { StorybookConfig } from '@storybook/html-vite';

const config = {
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  core: {
    disableTelemetry: true,
  },
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  staticDirs: [
    {
      from: '../wp-content/themes/orlyata/assets/fonts',
      to: '/wp-content/themes/orlyata/assets/fonts',
    },
    {
      from: '../wp-content/themes/orlyata/assets/icons',
      to: '/wp-content/themes/orlyata/assets/icons',
    },
    {
      from: '../wp-content/themes/orlyata/assets/images',
      to: '/wp-content/themes/orlyata/assets/images',
    },
    {
      from: '../wp-content/themes/orlyata/assets/videos',
      to: '/wp-content/themes/orlyata/assets/videos',
    },
  ],
  stories: ['../stories/**/*.stories.ts'],
} satisfies StorybookConfig;

export default config;
