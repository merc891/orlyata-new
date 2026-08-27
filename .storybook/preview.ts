import type { Preview } from '@storybook/html-vite';
import type { ViewportMap } from 'storybook/viewport';

import { initializeAboutHeroTitleReveal, initializeAboutSectionReveal, initializeAccordions, initializeMediaCardVideoPreviews } from '../wp-content/themes/orlyata/assets/src/main';
import './preview.css';

const viewport = (name: string, width: number, height: number) => ({
  name,
  styles: {
    height: `${String(height)}px`,
    width: `${String(width)}px`,
  },
});

const orlyataViewports = {
  desktop2560: viewport('Desktop 2560', 2560, 1440),
  desktop1920: viewport('Desktop 1920 — Figma target', 1920, 1080),
  desktop1280: viewport('Desktop 1280', 1280, 960),
  tablet1279: viewport('Tablet 1279', 1279, 960),
  tablet768: viewport('Tablet 768', 768, 1024),
  mobile767: viewport('Mobile 767', 767, 1024),
  mobile320: viewport('Mobile 320', 320, 800),
} satisfies ViewportMap;

const preview = {
  decorators: [
    (story) => {
      const canvas = story();
      window.requestAnimationFrame(initializeMediaCardVideoPreviews);
      window.requestAnimationFrame(() => initializeAccordions());
      window.requestAnimationFrame(() => initializeAboutHeroTitleReveal());
      window.requestAnimationFrame(() => initializeAboutSectionReveal());
      return canvas;
    },
  ],
  parameters: {
    a11y: {
      test: 'error',
    },
    controls: {
      disableSaveFromUI: true,
    },
    layout: 'fullscreen',
    options: {
      storySort: {
        order: ['Foundations', ['Overview', 'Colors', 'Typography', 'Spacing', 'Radius']],
      },
    },
    viewport: {
      options: orlyataViewports,
    },
  },
} satisfies Preview;

export default preview;
