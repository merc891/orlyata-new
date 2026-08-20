import { existsSync } from 'node:fs';

import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';

export const viewports = [
  { height: 1440, name: '2560', width: 2560 },
  { height: 1080, name: '1920', width: 1920 },
  { height: 960, name: '1280', width: 1280 },
  { height: 960, name: '1279', width: 1279 },
  { height: 1024, name: '768', width: 768 },
  { height: 1024, name: '767', width: 767 },
  { height: 800, name: '320', width: 320 },
] as const;

const fontPath = 'wp-content/themes/orlyata/assets/fonts/f37-ginger-cyrillic-vf.woff2';

if (!existsSync(fontPath)) {
  throw new Error(`Required visual-test font is missing: ${fontPath}`);
}

export const expectGingerLoaded = async (page: Page): Promise<void> => {
  const faces = await page.evaluate(async () => {
    const gingerFaces = [...document.fonts].filter((face) =>
      face.family.includes('F37 Ginger Cyrillic VF'),
    );

    await Promise.all(gingerFaces.map(async (face) => face.load()));

    return gingerFaces.map((face) => face.status);
  });

  expect(faces.length).toBeGreaterThan(0);
  expect(faces).toEqual(faces.map(() => 'loaded'));
};
