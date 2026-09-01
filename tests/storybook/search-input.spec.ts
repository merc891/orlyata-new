import { expect, test } from '@playwright/test';

import { expectGingerLoaded } from './visual';

async function openSearchInput(page: import('@playwright/test').Page, story: string): Promise<void> {
  await page.setViewportSize({ width: 1920, height: 800 });
  await page.goto('/iframe.html?id=components-searchinput--' + story + '&viewMode=story');
  await expect(page.locator('.orlyata-search-input__field').first()).toBeVisible({ timeout: 15_000 });
  await expectGingerLoaded(page);
}

test('SearchInput keeps the 16px reference radius in default, typing and focus-visible states', async ({ page }) => {
  await openSearchInput(page, 'states');

  const fields = page.locator('.orlyata-search-input__field');
  await expect(fields).toHaveCount(2);
  await expect(fields.nth(0)).toHaveCSS('border-top-left-radius', '16px');
  await expect(fields.nth(1)).toHaveCSS('border-top-left-radius', '16px');

  await fields.nth(0).focus();
  await expect(fields.nth(0)).toHaveCSS('border-top-left-radius', '16px');
  await expect(fields.nth(0)).toHaveCSS('border-color', 'rgb(33, 166, 66)');
});

test('SearchInput shows its clear action only for entered text', async ({ page }) => {
  await openSearchInput(page, 'states');

  const inputs = page.locator('.orlyata-search-input');
  const clearActions = inputs.locator('.orlyata-search-input__clear');
  await expect(clearActions.nth(0)).toBeHidden();
  await expect(clearActions.nth(1)).toBeVisible();
});
