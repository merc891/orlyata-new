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
  expect(logoBox).toMatchObject({ x: 0, y: 8, width: 240, height: 110 });
  expect(navigationBox).toMatchObject({ x: 0, y: 152, width: 239 });
  expect(linkBox).toMatchObject({ x: 0, y: 168, width: 225, height: 36 });
  expect(ctaBox).toMatchObject({ x: 17, y: 942, width: 207, height: 64 });
  await expect(sidebar).toHaveCSS('border-right-color', 'rgb(212, 212, 212)');
});

test('Sidebar preserves primary navigation and current-page semantics', async ({ page }) => {
  await openSidebar(page, 'components-sidebar--current-page');

  const navigation = page.getByRole('navigation', { name: 'Основная навигация' });
  expect(await navigation.getByRole('link').allTextContents()).toEqual(['О капелле', 'Новости', 'Медиагалерея', 'Ноты', 'Контакты']);
  await expect(navigation.getByRole('listitem')).toHaveCount(5);
  await expect(navigation.getByRole('link', { name: 'Новости' })).toHaveAttribute('aria-current', 'page');
  await expect(navigation.getByRole('link', { name: 'Новости' })).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(navigation.getByRole('link', { name: 'Новости' })).toHaveCSS('color', 'rgb(24, 23, 23)');
  await expect(page.getByRole('link', { name: 'Орлята — на главную' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Записаться к нам' })).toHaveAttribute('href', '/#application');
});

test('Sidebar marks Media gallery as current for its archive routes', async ({ page }) => {
  await openSidebar(page, 'components-sidebar--media-gallery');

  const mediaLink = page.getByRole('link', { name: 'Медиагалерея' });
  await expect(mediaLink).toHaveAttribute('aria-current', 'page');
  await expect(mediaLink).toHaveClass(/is-current/);
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
  const menuIcon = page.locator('.orlyata-button--menu-tablet .orlyata-button__menu-icon');

  await expect(sidebar).toBeVisible({ timeout: 15_000 });
  await expect(sidebar).toHaveCSS('width', String(width) + 'px');
  await expect(logo).toHaveCSS('height', '100.094px');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(menuIcon).toHaveAttribute('width', '24');
  await expect(menuIcon).toHaveAttribute('stroke-width', '2');
  await expect(menuIcon.locator('path')).toHaveAttribute('d', 'M3 8.5C9 8.5 15 8.5 21 8.5M3 15.5C9 15.5 15 15.5 21 15.5');
  await toggle.focus();
  await expect(toggle).toHaveCSS('outline-style', 'solid');
});
}

for (const width of [767, 393, 320]) {
test('Sidebar becomes an accessible mobile header at ' + String(width) + ' px', async ({ page }) => {
    await page.setViewportSize({ width, height: 1030 });
    await page.goto('/iframe.html?id=components-sidebar--default&viewMode=story');
    await page.locator('.sidebar-story-preview').evaluate((element) => {
      element.classList.remove('sidebar-story-preview');
    });
    const sidebar = page.locator('.orlyata-sidebar');
    const logoLink = page.locator('.orlyata-sidebar__logo-link');
    const menuToggle = page.getByRole('button', { name: 'Открыть меню' });
    const menuIcon = menuToggle.locator('.orlyata-button__menu-icon');
    await expect(sidebar).toBeVisible({ timeout: 15_000 });
    const [sidebarBox, logoBox, menuBox] = await Promise.all([sidebar.boundingBox(), logoLink.boundingBox(), menuToggle.boundingBox()]);
    const scale = width / 393;
    expect(logoBox === null || menuBox === null ? undefined : logoBox.y + logoBox.height / 2).toBeCloseTo(menuBox.y + menuBox.height / 2, 1);
    expect(sidebarBox === null ? undefined : sidebarBox.height).toBeCloseTo(Math.max(48, 48 * scale) + 24 * scale, 1);
    expect(logoBox === null ? undefined : logoBox.width).toBeCloseTo(131 * scale, 1);
    expect(logoBox === null ? undefined : logoBox.height).toBeCloseTo(48 * scale, 1);
    await expect.poll(async () => logoLink.locator('.orlyata-sidebar__logo').evaluate((image: HTMLImageElement) => image.currentSrc)).toContain('logo-mob.svg');
    await expect(menuIcon.locator('path')).toHaveAttribute('d', 'M3 8.5C9 8.5 15 8.5 21 8.5M3 15.5C9 15.5 15 15.5 21 15.5');
    const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(horizontalOverflow).toBe(false);
  });
}

test('Sidebar mobile overlay links use the Menu type role', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto('/iframe.html?id=components-sidebar--default&viewMode=story');
  await page.locator('.sidebar-story-preview').evaluate((element) => {
    element.classList.remove('sidebar-story-preview');
  });

  await page.getByRole('button', { name: 'Открыть меню' }).click();
  const link = page.getByRole('navigation', { name: 'Основная навигация' }).getByRole('link').first();
  await expect(link).toHaveCSS('font-size', '24px');
  await expect(link).toHaveCSS('font-weight', '500');
  await expect(link).toHaveCSS('line-height', '24px');
  await expect(link).toHaveCSS('letter-spacing', 'normal');
});

test('Sidebar remains fixed with the shared white surface while scrolling on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto('/iframe.html?id=components-sidebar--default&viewMode=story');
  await page.locator('.sidebar-story-preview').evaluate((element) => {
    element.classList.remove('sidebar-story-preview');
  });

  const sidebar = page.locator('.orlyata-sidebar');
  await expect(sidebar).toHaveCSS('position', 'fixed');
  await expect(sidebar).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await page.evaluate(() => {
    document.body.style.minBlockSize = '200vh';
    window.scrollTo(0, 300);
  });
  await expect.poll(() => sidebar.boundingBox()).toMatchObject({ y: 0, height: 72 });
});

for (const width of [1279, 768, 767, 393, 320]) {
test('Sidebar keeps the current menu link distinct at ' + String(width) + ' px', async ({ page }) => {
  await page.setViewportSize({ width, height: 1030 });
  await page.goto('/iframe.html?id=components-sidebar--current-page&viewMode=story');
  await page.locator('.sidebar-story-preview').evaluate((element) => {
    element.classList.remove('sidebar-story-preview');
  });

  await page.getByRole('button', { name: 'Открыть меню' }).click();
  const navigation = page.getByRole('navigation', { name: 'Основная навигация' });
  const currentLink = navigation.getByRole('link', { name: 'Новости' });
  const inactiveLink = navigation.getByRole('link', { name: 'О капелле' });

  await expect(currentLink).toHaveAttribute('aria-current', 'page');
  await expect(currentLink).toHaveCSS('color', 'rgb(24, 23, 23)');
  await expect(inactiveLink).toHaveCSS('color', 'rgb(113, 113, 122)');
});
}

test('Sidebar mobile menu opens as a full-viewport overlay with an aligned bottom CTA', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto('/iframe.html?id=components-sidebar--default&viewMode=story');
  await page.locator('.sidebar-story-preview').evaluate((element) => {
    element.classList.remove('sidebar-story-preview');
  });

  const toggle = page.getByRole('button', { name: /меню/ });
  const panel = page.locator('.orlyata-sidebar__menu-panel');
  const navigation = page.getByRole('navigation', { name: 'Основная навигация' });
  const cta = page.locator('.orlyata-sidebar__cta');

  await toggle.click();
  await expect(panel).toHaveCSS('position', 'fixed');
  await expect(toggle.locator('.orlyata-button__menu-icon path')).toHaveAttribute('d', 'M18 6C14 10 10 14 6 18M6 6C10 10 14 14 18 18');
  await expect(panel).toHaveCSS('height', '852px');
  await expect(navigation).toHaveCSS('opacity', '1');
  await expect(cta).toBeVisible();
  await expect(cta).toHaveCSS('position', 'absolute');
  await expect(navigation.getByRole('link').first()).toHaveCSS('font-size', '24px');
  await expect(navigation.getByRole('link').first()).toHaveCSS('letter-spacing', '-1px');
  const mobileListGap = await navigation.locator('ul').evaluate((element) => Number.parseFloat(getComputedStyle(element).gap));
  expect(mobileListGap).toBeCloseTo(12, 0);

  const [navigationBox, ctaBox] = await Promise.all([navigation.boundingBox(), cta.boundingBox()]);
  expect(navigationBox?.x).toBeCloseTo(12, 0);
  expect(ctaBox?.x).toBeCloseTo(160, 0);
  expect(852 - (ctaBox?.y ?? 852) - (ctaBox?.height ?? 0)).toBeCloseTo(16, 0);

  await page.evaluate(() => {
    document.body.style.minBlockSize = '200vh';
    window.scrollTo(0, 500);
  });
  await expect(cta).toBeVisible();
  const ctaAfterScroll = await cta.boundingBox();
  expect(852 - (ctaAfterScroll?.y ?? 852) - (ctaAfterScroll?.height ?? 0)).toBeCloseTo(16, 0);

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle.locator('.orlyata-button__menu-icon path')).toHaveAttribute('d', 'M3 8.5C9 8.5 15 8.5 21 8.5M3 15.5C9 15.5 15 15.5 21 15.5');
});

test('Sidebar places Footer social links and the CTA in the approved mobile and tablet menu positions', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto('/iframe.html?id=components-sidebar--default&viewMode=story');
  await page.locator('.sidebar-story-preview').evaluate((element) => {
    element.classList.remove('sidebar-story-preview');
  });

  await page.getByRole('button', { name: /меню/ }).click();

  const socialLinks = page.locator('.orlyata-sidebar__menu-social-link');
  const socials = page.locator('.orlyata-sidebar__menu-socials');
  const cta = page.locator('.orlyata-sidebar__cta');
  await expect(socialLinks).toHaveCount(2);
  await expect(socialLinks.nth(0)).toHaveAttribute('aria-label', 'ВКонтакте');
  await expect(socialLinks.nth(1)).toHaveAttribute('aria-label', 'Telegram');
  await expect(socialLinks.nth(0)).toHaveAttribute('target', '_blank');
  await expect(page.locator('.orlyata-sidebar__menu-contacts')).toBeHidden();

  const [socialsBox, ctaBox] = await Promise.all([socials.boundingBox(), cta.boundingBox()]);
  expect(socialsBox?.x).toBeCloseTo(12, 0);
  expect(socialsBox?.y).toBeCloseTo(788, 0);
  expect(socialsBox?.width).toBeCloseTo(100, 0);
  expect(socialsBox?.height).toBeCloseTo(48, 0);
  expect(ctaBox?.x).toBeCloseTo(160, 0);
  expect((ctaBox?.x ?? 0) + (ctaBox?.width ?? 0)).toBeCloseTo(381, 0);
  expect(852 - (ctaBox?.y ?? 852) - (ctaBox?.height ?? 0)).toBeCloseTo(16, 0);

  await page.setViewportSize({ width: 1279, height: 1030 });
  await page.goto('/iframe.html?id=components-sidebar--default&viewMode=story');
  await page.locator('.sidebar-story-preview').evaluate((element) => {
    element.classList.remove('sidebar-story-preview');
  });
  await page.getByRole('button', { name: /меню/ }).click();

  const tabletSocials = page.locator('.orlyata-sidebar__menu-socials');
  const tabletContacts = page.locator('.orlyata-sidebar__menu-contacts');
  const tabletSocialsBox = await tabletSocials.boundingBox();
  expect(tabletSocialsBox?.x).toBeCloseTo(24, 0);
  expect(tabletSocialsBox?.y).toBeCloseTo(934, 0);
  expect(tabletSocialsBox?.width).toBeCloseTo(132, 0);
  expect(tabletSocialsBox?.height).toBeCloseTo(64, 0);
  await expect(tabletContacts).toBeHidden();
});
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
