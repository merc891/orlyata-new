import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { expectGingerLoaded, viewports } from './visual';

const stories = [
  'components-button--variants',
  'components-button--states',
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

test('Button matches the confirmed desktop geometry', async ({ page }) => {
  await page.setViewportSize({ height: 1080, width: 1920 });
  await page.goto('/iframe.html?id=components-button--variants&viewMode=story');
  await expectGingerLoaded(page);

  const primary = page.locator('.orlyata-button--primary').first();
  const secondary = page.locator('.orlyata-button--secondary').first();
  const play = page.locator('.orlyata-button--play');
  const previous = page.locator('.orlyata-button--arrow-left');

  await expect(primary).toHaveCSS('height', '64px');
  await expect(primary).toHaveCSS('font-size', '20px');
  await expect(primary).toHaveCSS('line-height', '28px');
  await expect(primary).toHaveCSS('background-color', 'rgb(24, 23, 23)');
  await expect(secondary).toHaveCSS('height', '64px');
  await expect(play).toHaveCSS('width', '64px');
  await expect(play).toHaveCSS('height', '64px');
  await expect(previous).toHaveCSS('width', '64px');
  await expect(previous).toHaveCSS('height', '64px');
});

test('Text buttons without the close icon keep 24px end padding in every state', async ({ page }) => {
  await page.goto('/iframe.html?id=components-button--variants&viewMode=story');
  await expectGingerLoaded(page);

  const primaryWithoutIcon = page.locator('.orlyata-button--primary:not(.orlyata-button--with-icon)');
  const secondary = page.locator('.orlyata-button--secondary');

  await expect(primaryWithoutIcon).toHaveCSS('padding-right', '24px');

  for (const control of await secondary.all()) {
    await expect(control).toHaveCSS('padding-right', '24px');
  }

  await page.goto('/iframe.html?id=components-button--states&viewMode=story');
  await expectGingerLoaded(page);

  for (const state of ['default', 'hover']) {
    const control = page
      .locator('.component-state')
      .filter({ hasText: state === 'default' ? 'Default' : 'Hover' })
      .locator('.orlyata-button--secondary');

    await expect(control).toHaveCSS('padding-right', '24px');
  }
});

test('Button preserves native semantics and visible keyboard focus', async ({ page }) => {
  await page.goto('/iframe.html?id=components-button--variants&viewMode=story');
  await expectGingerLoaded(page);

  await expect(page.getByRole('button', { name: 'Кнопка' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Подробнее' })).toHaveAttribute('href', '#destination');
  await expect(page.getByRole('button', { name: 'Воспроизвести' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Предыдущий материал' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Следующий материал' })).toBeVisible();

  await page.keyboard.press('Tab');
  const focusedControl = page.locator(':focus-visible');
  await expect(focusedControl).toHaveClass(/orlyata-button/);
  await expect(focusedControl).toHaveCSS('outline-style', 'solid');
});

test('Primary keeps identical geometry when default and active controls are hovered', async ({ page }) => {
  await page.setViewportSize({ height: 1080, width: 1920 });
  await page.goto('/iframe.html?id=components-button--variants&viewMode=story');
  await expectGingerLoaded(page);

  const primaryDefault = page.locator('.orlyata-button--primary.orlyata-button--with-icon').first();
  const defaultBeforeHover = await primaryDefault.boundingBox();
  await primaryDefault.hover();
  await expect(primaryDefault).toHaveCSS('opacity', '0.9');
  expect(await primaryDefault.boundingBox()).toEqual(defaultBeforeHover);

  await page.goto('/iframe.html?id=components-button--states&viewMode=story');
  await expectGingerLoaded(page);

  const primaryActive = page
    .locator('.component-state')
    .filter({ hasText: 'Active' })
    .locator('.orlyata-button--primary');
  const activeBeforeHover = await primaryActive.boundingBox();
  await primaryActive.hover();
  await expect(primaryActive).toHaveCSS('opacity', '0.8');
  expect(await primaryActive.boundingBox()).toEqual(activeBeforeHover);
});

test('States expose static icon hovers', async ({ page }) => {
  await page.goto('/iframe.html?id=components-button--states&viewMode=story');
  await expectGingerLoaded(page);

  const play = page.locator('.orlyata-button--play[data-visual-state="hover"]');
  const arrow = page.locator('.orlyata-button--arrow-right[data-visual-state="hover"]');
  await expect(play).toHaveCSS('width', '64px');
  await expect(arrow).toHaveCSS('background-color', 'rgb(244, 244, 245)');
  expect(await play.evaluate((element) => element.getAnimations())).toHaveLength(0);
});

test('Default Play remains 64px on hover', async ({ page }) => {
  await page.goto('/iframe.html?id=components-button--variants&viewMode=story');
  await expectGingerLoaded(page);

  const play = page.locator('.orlyata-button--play').first();
  await play.hover();
  await expect(play).toHaveCSS('width', '64px');
  await expect(play).toHaveCSS('height', '64px');
});
