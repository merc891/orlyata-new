import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { expectGingerLoaded, viewports } from './visual';

async function openFooter(page: import('@playwright/test').Page, story = 'components-footer--default'): Promise<void> {
  await page.setViewportSize({ width: 1920, height: 800 });
  await page.goto('/iframe.html?id=' + story + '&viewMode=story');
  await expect(page.locator('.orlyata-footer')).toBeVisible({ timeout: 15_000 });
  await expectGingerLoaded(page);
}

test('Footer has no automatic accessibility violations', async ({ page }) => {
  await openFooter(page);

  const results = await new AxeBuilder({ page }).disableRules(['landmark-one-main', 'page-has-heading-one']).analyze();
  expect(results.violations).toEqual([]);
});

test('Footer matches the approved Figma desktop geometry', async ({ page }) => {
  await openFooter(page);

  const footer = page.locator('.orlyata-footer');
  const content = page.locator('.orlyata-footer__content');
  const slogan = page.locator('.orlyata-footer__slogan');
  const navigation = page.locator('.orlyata-footer__navigation');
  const contacts = page.locator('.orlyata-footer__contacts');
  const copyright = page.locator('.orlyata-footer__copyright');
  const legal = page.locator('.orlyata-footer__legal');
  const [footerBox, contentBox, sloganBox, navigationBox, contactsBox, copyrightBox, legalBox] = await Promise.all([
    footer.boundingBox(),
    content.boundingBox(),
    slogan.boundingBox(),
    navigation.boundingBox(),
    contacts.boundingBox(),
    copyright.boundingBox(),
    legal.boundingBox(),
  ]);

  expect(footerBox).toMatchObject({ x: 0, y: 0, width: 1616, height: 469 });
  expect(contentBox).toMatchObject({ x: 48, y: 48, width: 1520, height: 373 });
  expect(sloganBox).toMatchObject({ x: 48, y: 48 });
  expect(navigationBox).toMatchObject({ x: 819, y: 43, width: 190.5, height: 370 });
  expect(contactsBox).toMatchObject({ x: 1224, y: 48, width: 302, height: 272 });
  expect(copyrightBox?.x).toBe(48);
  expect(legalBox?.x).toBe(1224);
  await expect(footer).toHaveCSS('background-color', 'rgb(24, 23, 23)');
  await expect(footer).toHaveCSS('border-radius', '24px');
    await expect(page.getByText('Медиагалерея', { exact: true })).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(page.getByRole('link', { name: 'О капелле' })).toHaveCSS('color', 'rgb(153, 153, 162)');
  await expect(page.locator('.orlyata-footer__address')).toHaveCSS('color', 'rgb(153, 153, 162)');
  await expect(slogan).toContainText('а завтра – орлы!');

  const photoBox = await page.getByRole('link', { name: 'Фото' }).boundingBox();
  const videoBox = await page.getByRole('link', { name: 'Видео' }).boundingBox();
  expect(videoBox?.y).toBeCloseTo((photoBox?.y ?? 0) + 32, 0);
});

for (const width of [1280, 1920, 2560]) {
  test('Footer contact links align with the final primary navigation rows at ' + String(width) + ' px', async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/iframe.html?id=components-footer--default&viewMode=story');
    await expect(page.locator('.orlyata-footer')).toBeVisible({ timeout: 15_000 });
    await expectGingerLoaded(page);

    const footer = page.locator('.orlyata-footer');
    const [teachers, notes, contacts, phonePrimary, phoneSecondary, email] = await Promise.all([
      footer.getByRole('link', { name: 'Педагоги' }).boundingBox(),
      footer.getByRole('link', { name: 'Ноты' }).boundingBox(),
      footer.getByRole('link', { name: 'Контакты' }).boundingBox(),
      footer.getByRole('link', { name: '+7 (925) 434-51-98' }).boundingBox(),
      footer.getByRole('link', { name: '+7 (916) 258-49-12' }).boundingBox(),
      footer.getByRole('link', { name: 'info@zelorlyata.ru' }).boundingBox(),
    ]);

    expect(phonePrimary?.y).toBeCloseTo(teachers?.y ?? 0, 0);
    expect(phoneSecondary?.y).toBeCloseTo(notes?.y ?? 0, 0);
    expect(email?.y).toBeCloseTo(contacts?.y ?? 0, 0);
  });
}

test('Footer exposes semantic routes and contact protocols', async ({ page }) => {
  await openFooter(page);

  const navigation = page.getByRole('navigation', { name: 'Навигация в подвале' });
  await expect(navigation.getByRole('link')).toHaveCount(8);
  await expect(navigation.getByRole('link', { name: 'Фото' })).toHaveAttribute('href', '/mediagalereya/foto/');
  await expect(page.getByRole('link', { name: '+7 (925) 434-51-98' })).toHaveAttribute('href', 'tel:+79254345198');
  await expect(page.getByRole('link', { name: 'info@zelorlyata.ru' })).toHaveAttribute('href', 'mailto:info@zelorlyata.ru');
  await expect(page.getByRole('link', { name: 'Политика конфиденциальности' })).toHaveAttribute('href', '/politika-konfidencialnosti/');
});

test('Footer links have visible keyboard focus and hover feedback', async ({ page }) => {
  await openFooter(page);

  const link = page.getByRole('link', { name: 'О капелле' });
  await link.focus();
  await expect(link).toHaveCSS('outline-color', 'rgb(33, 166, 66)');
  await expect(link).toHaveCSS('outline-style', 'solid');

  await link.hover();
  await expect(link).toHaveCSS('color', 'rgb(255, 255, 255)');
});

test('Footer remains visible in a narrow Storybook Canvas', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 700 });
  await page.goto('/iframe.html?id=components-footer--playground&viewMode=story');
  await expect(page.locator('.orlyata-footer')).toBeVisible({ timeout: 15_000 });
});

for (const width of [2560, 1920, 1280]) {
  test('Footer is available in desktop mode at ' + String(width) + ' px', async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/iframe.html?id=components-footer--default&viewMode=story');
    await expect(page.locator('.orlyata-footer')).toBeVisible({ timeout: 15_000 });
  });
}


for (const { width, gap } of [
  { width: 1280, gap: '16px' },
  { width: 1920, gap: '24px' },
  { width: 2560, gap: '32px' },
]) {
  test('Footer desktop navigation spacing and final-row baseline scale at ' + String(width) + ' px', async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/iframe.html?id=components-footer--default&viewMode=story');
    await expect(page.locator('.orlyata-footer__navigation-group').first()).toHaveCSS('row-gap', gap);

    const [copyrightName, video, legal] = await Promise.all([
      page.locator('.orlyata-footer__copyright span:last-child').boundingBox(),
      page.getByRole('link', { name: 'Видео' }).boundingBox(),
      page.getByRole('link', { name: 'Политика конфиденциальности' }).boundingBox(),
    ]);

    expect(copyrightName?.y).toBeCloseTo(video?.y ?? 0, 0);
    expect(legal?.y).toBeCloseTo(video?.y ?? 0, 0);
  });
}
test('Footer tablet social links match the Sidebar menu control at the reference width', async ({ page }) => {
  await page.setViewportSize({ width: 1279, height: 800 });
  await page.goto('/iframe.html?id=components-footer--default&viewMode=story');
  await page.locator('.footer-story-preview').evaluate((element) => {
    element.classList.remove('footer-story-preview');
  });

  const social = page.locator('.orlyata-footer__social-link').first();
  const socialBox = await social.boundingBox();
  expect(socialBox?.width).toBeCloseTo(64, 0);
  expect(socialBox?.height).toBeCloseTo(64, 0);
});

for (const width of [1279, 768]) {
  test('Footer is available as a two-column tablet layout at ' + String(width) + ' px', async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/iframe.html?id=components-footer--default&viewMode=story');
    await page.locator('.footer-story-preview').evaluate((element) => {
      element.classList.remove('footer-story-preview');
    });
    await expect(page.locator('.orlyata-footer')).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('.orlyata-footer__content')).toHaveCSS('display', 'grid');
    await expect(page.locator('.orlyata-footer__content')).toHaveCSS('row-gap', '64px');
    const [sloganBox, copyrightBox, videoBox, legalBox] = await Promise.all([
      page.locator('.orlyata-footer__slogan').boundingBox(),
      page.locator('.orlyata-footer__copyright').boundingBox(),
      page.getByRole('link', { name: 'Видео' }).boundingBox(),
      page.getByRole('link', { name: 'Политика конфиденциальности' }).boundingBox(),
    ]);

    expect(copyrightBox?.x).toBeGreaterThan((sloganBox?.x ?? 0) + (sloganBox?.width ?? 0));
    expect((copyrightBox?.y ?? 0) + (copyrightBox?.height ?? 0)).toBeCloseTo(
      (sloganBox?.y ?? 0) + (sloganBox?.height ?? 0),
      0,
    );
    expect(legalBox?.y).toBeCloseTo(videoBox?.y ?? 0, 0);
    const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    const footer = page.locator('.orlyata-footer');
    const address = footer.locator('.orlyata-footer__address');
    const [teachers, notes, contacts, phonePrimary, phoneSecondary, email, addressBox, addressLineHeight] = await Promise.all([
      footer.getByRole('link', { name: 'Педагоги' }).boundingBox(),
      footer.getByRole('link', { name: 'Ноты' }).boundingBox(),
      footer.getByRole('link', { name: 'Контакты' }).boundingBox(),
      footer.getByRole('link', { name: '+7 (925) 434-51-98' }).boundingBox(),
      footer.getByRole('link', { name: '+7 (916) 258-49-12' }).boundingBox(),
      footer.getByRole('link', { name: 'info@zelorlyata.ru' }).boundingBox(),
      address.boundingBox(),
      address.evaluate((element) => Number.parseFloat(getComputedStyle(element).lineHeight)),
    ]);

    expect(phonePrimary?.y).toBeCloseTo(teachers?.y ?? 0, 0);
    expect(phoneSecondary?.y).toBeCloseTo(notes?.y ?? 0, 0);
    expect(email?.y).toBeCloseTo(contacts?.y ?? 0, 0);
    await expect(address).toHaveText('г. Зеленоград, Центральная площадь, 1,\nКЦ «Зеленоград»');
    expect(addressBox?.height).toBeCloseTo(addressLineHeight * 2, 0);
    expect(horizontalOverflow).toBe(false);
  });
}

for (const width of [767, 393, 320]) {
  test('Footer becomes a readable mobile flow at ' + String(width) + ' px', async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/iframe.html?id=components-footer--default&viewMode=story');
    await page.locator('.footer-story-preview').evaluate((element) => {
      element.classList.remove('footer-story-preview');
    });
    await expect(page.locator('.orlyata-footer')).toBeVisible({ timeout: 15_000 });
    const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(horizontalOverflow).toBe(false);
  });

  test('Footer contact rows align with the final primary navigation rows at ' + String(width) + ' px', async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/iframe.html?id=components-footer--default&viewMode=story');
    await expect(page.locator('.orlyata-footer')).toBeVisible({ timeout: 15_000 });

    const footer = page.locator('.orlyata-footer');
    const [teachers, notes, contacts, phonePrimary, phoneSecondary, email] = await Promise.all([
      footer.getByRole('link', { name: 'Педагоги' }).boundingBox(),
      footer.getByRole('link', { name: 'Ноты' }).boundingBox(),
      footer.getByRole('link', { name: 'Контакты' }).boundingBox(),
      footer.getByRole('link', { name: '+7 (925) 434-51-98' }).boundingBox(),
      footer.getByRole('link', { name: '+7 (916) 258-49-12' }).boundingBox(),
      footer.getByRole('link', { name: 'info@zelorlyata.ru' }).boundingBox(),
    ]);

    expect(phonePrimary?.y).toBeCloseTo(teachers?.y ?? 0, 0);
    expect(phoneSecondary?.y).toBeCloseTo(notes?.y ?? 0, 0);
    expect(email?.y).toBeCloseTo(contacts?.y ?? 0, 0);
  });
}

for (const viewport of viewports) {
  test('Footer visual ' + viewport.name, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/iframe.html?id=components-footer--default&viewMode=story');
    await expectGingerLoaded(page);
    await expect(page).toHaveScreenshot('components-footer--default-' + viewport.name + '.png', { fullPage: true });
  });
}

test('Footer Playground responds to serialized Control args', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 800 });
  await page.goto('/iframe.html?id=components-footer--playground&viewMode=story&args=legalLabel:Privacy;phonePrimary:12345');
  await expect(page.getByRole('link', { name: 'Privacy' })).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole('link', { name: '12345' })).toHaveAttribute('href', 'tel:12345');
});
