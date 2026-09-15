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
  await expect(play).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(play).toHaveCSS('border-top-width', '0px');
  await expect(previous).toHaveCSS('width', '64px');
  await expect(previous).toHaveCSS('height', '64px');
});

test('Text buttons without the close icon keep 24px end padding in every state', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
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

test('Archive filter Button matches the mobile Badge geometry', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto('/iframe.html?id=components-button--mobile&viewMode=story');
  await expectGingerLoaded(page);

  const filter = page.locator('.orlyata-button--archive-filter').first();
  const close = filter.locator('.orlyata-button__icon');

  await expect(filter).toHaveCSS('height', '36px');
  await expect(filter).toHaveCSS('min-height', '36px');
  await expect(filter).toHaveCSS('font-size', '14px');
  await expect(filter).toHaveCSS('line-height', '16.8px');
  await expect(close).toHaveCSS('width', '16px');
  await expect(close).toHaveCSS('height', '16px');
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

test('Primary, Secondary and Arrow animate their hover feedback over 200ms', async ({ page }) => {
  await page.goto('/iframe.html?id=components-button--variants&viewMode=story');
  await expectGingerLoaded(page);

  const primary = page.locator('.orlyata-button--primary').first();
  const secondary = page.locator('.orlyata-button--secondary').first();
  const arrow = page.locator('.orlyata-button--arrow-right').first();

  for (const button of [primary, secondary, arrow]) {
    await expect(button).toHaveCSS('transition-duration', '0.2s');
    await expect(button).toHaveCSS('transition-timing-function', 'cubic-bezier(0.2, 0, 0, 1)');
  }

  await primary.hover();
  await expect(primary).toHaveCSS('opacity', '0.9');
  await secondary.hover();
  await expect(secondary).toHaveCSS('background-color', 'rgb(234, 234, 235)');
  await arrow.hover();
  await expect(arrow).toHaveCSS('background-color', 'rgb(244, 244, 245)');
});

test('Muted gallery arrows use Neutral 50 and change to Neutral 150 on hover', async ({ page }) => {
  await page.goto('/iframe.html?id=components-button--variants&viewMode=story');
  await expectGingerLoaded(page);

  const mutedArrow = page.getByRole('button', { name: 'Предыдущая фотография' });
  await expect(mutedArrow).toHaveCSS('background-color', 'rgb(244, 244, 245)');
  await expect(mutedArrow).toHaveCSS('transition-duration', '0.2s');
  await mutedArrow.hover();
  await expect(mutedArrow).toHaveCSS('background-color', 'rgb(199, 199, 204)');
});

test('Arrow buttons roll in their respective horizontal directions', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/iframe.html?id=components-button--variants&viewMode=story');
  await expectGingerLoaded(page);

  const leftArrows = page.locator('.orlyata-button--arrow-left .orlyata-button__arrow');
  const rightArrows = page.locator('.orlyata-button--arrow-right .orlyata-button__arrow');
  const leftOutgoing = leftArrows.first();
  const leftIncoming = leftArrows.nth(1);
  const rightOutgoing = rightArrows.first();
  const rightIncoming = rightArrows.nth(1);

  await expect(leftArrows).toHaveCount(2);
  await expect(rightArrows).toHaveCount(2);
  await expect(leftOutgoing).toHaveCSS('transition-duration', '0.4s');
  await expect(leftOutgoing).toHaveCSS('transition-timing-function', 'ease');
  await page.locator('.orlyata-button--arrow-left').hover();
  await expect(leftOutgoing).toHaveCSS('transform', 'matrix(1, 0, 0, 1, -24, 0)');
  await expect(leftIncoming).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');

  await page.locator('.orlyata-button--arrow-right').hover();
  await expect(rightOutgoing).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 24, 0)');
  await expect(rightIncoming).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
});

test('States expose the Arrow hover', async ({ page }) => {
  await page.goto('/iframe.html?id=components-button--states&viewMode=story');
  await expectGingerLoaded(page);

  const arrow = page.locator('.orlyata-button--arrow-right[data-visual-state="hover"]');
  await expect(arrow).toHaveCSS('background-color', 'rgb(244, 244, 245)');
});

test('Default Play remains 64px on hover', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/iframe.html?id=components-button--variants&viewMode=story');
  await expectGingerLoaded(page);

  const play = page.locator('.orlyata-button--play').first();
  await play.hover();
  await expect(play).toHaveCSS('width', '64px');
  await expect(play).toHaveCSS('height', '64px');
  await expect(play).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(play).toHaveCSS('border-top-width', '0px');
});
