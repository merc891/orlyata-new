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

test('mobile large block radius follows the 16px reference token', async ({ page }) => {
  for (const width of [320, 393, 767]) {
    await page.setViewportSize({ width, height: 852 });
    await page.goto('/iframe.html?id=foundations-radius--scale&viewMode=story');
    await expectGingerLoaded(page);

    expect(Number.parseFloat(await page.locator('.foundation-radius--large').evaluate((element) => getComputedStyle(element).borderRadius))).toBeCloseTo(16 * width / 393, 3);
  }
});

test('mobile typography story exposes every role parameter, including tracking', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto('/iframe.html?id=foundations-typography--mobile-scale&viewMode=story');
  await expectGingerLoaded(page);

  const specifications = page.locator('.foundation-type-meta code');
  await expect(specifications).toHaveCount(9);
  await expect(specifications.nth(0)).toContainText('TT Turns · normal · 40px · 500 · 0.7 · −1px');
  await expect(specifications.nth(1)).toContainText('TT Turns · normal · 40px · 500 · 0.9 · −1px');
  await expect(specifications.nth(2)).toContainText('TT Turns · normal · 32px · 500 · 1 · −0.5px');
  await expect(specifications.nth(3)).toContainText('TT Turns · normal · 24px · 500 · 1 · 0px');
  await expect(specifications.nth(4)).toContainText('TT Turns · normal · 20px · 500 · 1.2 · 0px');
  await expect(specifications.nth(5)).toContainText('TT Turns · normal · 16px · 500 · 1.4 · 0px');
  await expect(specifications.nth(6)).toContainText('TT Turns · normal · 16px · 500 · 1.2 · 0px');
  await expect(specifications.nth(7)).toContainText('TT Turns · normal · 14px · 500 · 1.4 · 0px');
  await expect(specifications.nth(8)).toContainText('TT Turns · normal · 12px · 500 · 1.5 · −0.5px');

  const samples = page.locator('.foundation-type-sample');
  await expect(samples.nth(0)).toHaveCSS('letter-spacing', '-1px');
  await expect(samples.nth(1)).toHaveCSS('letter-spacing', '-1px');
  await expect(samples.nth(2)).toHaveCSS('letter-spacing', '-0.5px');
  await expect(samples.nth(3)).toHaveCSS('letter-spacing', 'normal');
  await expect(samples.nth(4)).toHaveCSS('letter-spacing', 'normal');
  await expect(samples.nth(5)).toHaveCSS('letter-spacing', 'normal');
  await expect(samples.nth(6)).toHaveCSS('letter-spacing', 'normal');
  await expect(samples.nth(7)).toHaveCSS('letter-spacing', 'normal');
  await expect(samples.nth(8)).toHaveCSS('letter-spacing', '-0.5px');

  const expectedRoles = [
    { size: '40px', weight: '500', lineHeight: '28px' },
    { size: '40px', weight: '500', lineHeight: '36px' },
    { size: '32px', weight: '500', lineHeight: '32px' },
    { size: '24px', weight: '500', lineHeight: '24px' },
    { size: '20px', weight: '500', lineHeight: '24px' },
    { size: '16px', weight: '500', lineHeight: '22.4px' },
    { size: '16px', weight: '500', lineHeight: '19.2px' },
    { size: '14px', weight: '500', lineHeight: '19.6px' },
    { size: '12px', weight: '500', lineHeight: '18px' },
  ];

  for (const [index, expected] of expectedRoles.entries()) {
    await expect(samples.nth(index)).toHaveCSS('font-size', expected.size);
    await expect(samples.nth(index)).toHaveCSS('font-weight', expected.weight);
    await expect(samples.nth(index)).toHaveCSS('line-height', expected.lineHeight);
  }
});
