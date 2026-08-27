import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { expectGingerLoaded, viewports } from './visual';

async function openSidebar(page: import('@playwright/test').Page, story = 'components-sidebar--default'): Promise<void> {
  await page.setViewportSize({ width: 1920, height: 1030 });
  await page.goto('/iframe.html?id=' + story + '&viewMode=story');
  await expect(page.locator('.orlyata-sidebar')).toBeVisible({ timeout: 15_000 });
  await expectGingerLoaded(page);
}

test('Sidebar has no automatic accessibility violations', async ({ page }) => {
  await openSidebar(page);

  const results = await new AxeBuilder({ page }).disableRules(['landmark-one-main', 'page-has-heading-one']).analyze();
  expect(results.violations).toEqual([]);
});

test('Sidebar matches the approved Figma desktop geometry', async ({ page }) => {
  await openSidebar(page);

  const sidebar = page.locator('.orlyata-sidebar');
  const logo = page.locator('.orlyata-sidebar__logo');
  const navigation = page.locator('.orlyata-sidebar__nav');
  const firstLink = page.locator('.orlyata-sidebar__link').first();
  const cta = page.getByRole('link', { name: 'Записаться к нам' });
  const [sidebarBox, logoBox, navigationBox, linkBox, ctaBox] = await Promise.all([
    sidebar.boundingBox(),
    logo.boundingBox(),
    navigation.boundingBox(),
    firstLink.boundingBox(),
    cta.boundingBox(),
  ]);

  expect(sidebarBox).toMatchObject({ x: 0, y: 0, width: 250, height: 1030 });
  expect(logoBox).toMatchObject({ x: 0, y: 12, width: 240, height: 110 });
  expect(navigationBox).toMatchObject({ x: 0, y: 152, width: 239 });
  expect(linkBox).toMatchObject({ x: 0, y: 168, width: 225, height: 36 });
  expect(ctaBox).toMatchObject({ x: 17, y: 942, width: 207, height: 64 });
  await expect(sidebar).toHaveCSS('border-right-color', 'rgb(212, 212, 212)');
});

test('Sidebar preserves primary navigation and current-page semantics', async ({ page }) => {
  await openSidebar(page, 'components-sidebar--current-page');

  const navigation = page.getByRole('navigation', { name: 'Основная навигация' });
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole('listitem')).toHaveCount(5);
  await expect(navigation.getByRole('link', { name: 'Новости' })).toHaveAttribute('aria-current', 'page');
  await expect(navigation.getByRole('link', { name: 'Новости' })).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(navigation.getByRole('link', { name: 'Новости' })).toHaveCSS('color', 'rgb(24, 23, 23)');
  await expect(page.getByRole('link', { name: 'Орлята — на главную' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Записаться к нам' })).toHaveAttribute('href', '/#application');
});

test('Sidebar navigation has visible keyboard focus and hover feedback', async ({ page }) => {
  await openSidebar(page);

  const firstLink = page.getByRole('link', { name: 'О капелле' });
  await firstLink.focus();
  await expect(firstLink).toHaveCSS('outline-color', 'rgb(33, 166, 66)');
  await expect(firstLink).toHaveCSS('outline-style', 'solid');

  await expect(firstLink).toHaveClass(/orlyata-text-link--color/);
  await expect(firstLink).toHaveCSS('transition-duration', '0.2s, 0.16s, 0.16s');

  await firstLink.hover();
  await expect(firstLink).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(firstLink).toHaveCSS('color', 'rgb(24, 23, 23)');

  const logo = page.locator('.orlyata-sidebar__logo');
  await logo.hover();
  await expect(logo).toHaveCSS('opacity', '0.9');

});

test('Sidebar remains visible in a narrow Storybook Canvas', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 700 });
  await page.goto('/iframe.html?id=components-sidebar--playground&viewMode=story');
  await expect(page.locator('.orlyata-sidebar')).toBeVisible({ timeout: 15_000 });
});

for (const width of [2560, 1920, 1280]) {
  test('Sidebar is available in desktop mode at ' + String(width) + ' px', async ({ page }) => {
    await page.setViewportSize({ width, height: 1030 });
    await page.goto('/iframe.html?id=components-sidebar--default&viewMode=story');
    await expect(page.locator('.orlyata-sidebar')).toBeVisible({ timeout: 15_000 });
  });
}

for (const width of [1279, 768]) {
test('Sidebar becomes a top header at ' + String(width) + ' px', async ({ page }) => {
  await page.setViewportSize({ width, height: 1030 });
  await page.goto('/iframe.html?id=components-sidebar--default&viewMode=story');
  await page.locator('.sidebar-story-preview').evaluate((element) => {
    element.classList.remove('sidebar-story-preview');
  });
  const sidebar = page.locator('.orlyata-sidebar');
  const logo = page.locator('.orlyata-sidebar__logo');
  const toggle = page.getByRole('button', { name: 'Открыть меню' });
  const menuLines = page.locator('.orlyata-sidebar__menu-toggle-line');

  await expect(sidebar).toBeVisible({ timeout: 15_000 });
  await expect(sidebar).toHaveCSS('width', String(width) + 'px');
  await expect(logo).toHaveCSS('height', '74.875px');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(menuLines).toHaveCount(2);
  await expect(menuLines.first()).toHaveCSS('width', '48px');
  await toggle.focus();
  await expect(toggle).toHaveCSS('outline-style', 'solid');
});
}

for (const width of [767, 320]) {
test('Sidebar is removed from layout at ' + String(width) + ' px', async ({ page }) => {
    await page.setViewportSize({ width, height: 1030 });
    await page.goto('/iframe.html?id=components-sidebar--default&viewMode=story');
    await page.locator('.sidebar-story-preview').evaluate((element) => {
      element.classList.remove('sidebar-story-preview');
    });
    await expect(page.locator('.orlyata-sidebar')).toBeHidden({ timeout: 15_000 });
    const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(horizontalOverflow).toBe(false);
  });
}

for (const viewport of viewports) {
  test('Sidebar visual ' + viewport.name, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/iframe.html?id=components-sidebar--default&viewMode=story');
    await expectGingerLoaded(page);
    await expect(page).toHaveScreenshot('components-sidebar--default-' + viewport.name + '.png', { fullPage: true });
  });
}

test('Sidebar Playground responds to serialized Control args', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1030 });
  await page.goto('/iframe.html?id=components-sidebar--playground&viewMode=story&args=ctaLabel:Join;currentPage:contacts');
  await expect(page.getByRole('link', { name: 'Join' })).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole('link', { name: 'Контакты' })).toHaveAttribute('aria-current', 'page');
});
