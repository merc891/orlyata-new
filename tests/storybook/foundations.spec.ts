import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { expectGingerLoaded, viewports } from './visual';

const stories = [
  'foundations-colors--palette',
  'foundations-typography--scale',
  'foundations-spacing--scale',
  'foundations-radius--scale',
] as const;

for (const story of stories) {
  test(`${story} has no automatic accessibility violations`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${story}&viewMode=story`);
    await expect(page.locator('#storybook-root')).toBeVisible();
    await expectGingerLoaded(page);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  for (const viewport of viewports) {
    test(`${story} visual ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(`/iframe.html?id=${story}&viewMode=story`);
      await expect(page.locator('#storybook-root')).toBeVisible();
      await expectGingerLoaded(page);
      await expect(page).toHaveScreenshot(`${story}-${viewport.name}.png`, { fullPage: true });
    });
  }
}
