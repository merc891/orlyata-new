import { expect, test } from '@playwright/test';

import { expectGingerLoaded } from './visual';

for (const width of [320, 767]) {
  test('F37 Ginger does not synthesize styles at ' + String(width) + ' px', async ({ page }) => {
    await page.setViewportSize({ width, height: 1024 });
    await page.goto('/iframe.html?id=pages-home--desktop-preview&viewMode=story');
    await expectGingerLoaded(page);

    await expect(page.locator('.orlyata-home__hero-title')).toHaveCSS('font-synthesis', 'none');
    await expect(page.locator('.orlyata-home__hero-title')).toHaveCSS('font-variation-settings', '"slnt" 0');
  });

  test('ApplicationForm controls keep an upright F37 Ginger face at ' + String(width) + ' px', async ({ page }) => {
    await page.setViewportSize({ width, height: 1024 });
    await page.goto('/iframe.html?id=components-application-form--default&viewMode=story');
    await expectGingerLoaded(page);

    const controls = page.locator(
      '.orlyata-input__field, .orlyata-application-form__submit',
    );

    for (const control of await controls.all()) {
      await expect(control).toHaveCSS('font-style', 'normal');
      await expect(control).toHaveCSS('font-synthesis', 'none');
      await expect(control).toHaveCSS('font-variation-settings', '"slnt" 0');
    }
  });
}
