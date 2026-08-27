import { expect, test } from '@playwright/test';

import { expectGingerLoaded } from './visual';

test('About desktop preview renders the Figma composition without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/iframe.html?id=pages-about--desktop-preview&viewMode=story');
  await expectGingerLoaded(page);

  await expect(page.getByRole('heading', { level: 1, name: 'О капелле' })).toBeVisible();
  await expect(page.locator("[data-about-reveal]")).toHaveCount(5);
  await expect(page.locator(".orlyata-page-hero [data-about-reveal]")).toHaveCount(0);
  await expect(page.locator(".orlyata-about__groups[data-about-reveal]")).toHaveCount(0);
  await expect(page.locator(".orlyata-about__groups .orlyata-accordion").first()).toHaveCSS("animation-duration", "0.6s");
  await expect(page.locator(".orlyata-about__intro")).toHaveClass(/is-revealed/);
  await expect(page.locator(".orlyata-about__intro .orlyata-about__lead")).toHaveCSS("animation-duration", "0.6s");
  await expect(page.locator(".orlyata-about__intro .orlyata-about__lead")).toHaveCSS("animation-name", "orlyata-home-media-card-reveal");
  const hero = page.locator('.orlyata-page-hero');
  const heroTitle = hero.locator(".orlyata-page-hero__title");
  await expect(page.locator(".orlyata-about")).toHaveClass(/is-hero-title-revealed/);
  await expect(heroTitle).toHaveCSS("animation-name", "orlyata-about-hero-title-reveal");
  await expect(heroTitle).toHaveCSS("animation-duration", "0.4s");
  await expect(heroTitle).toHaveCSS("animation-timing-function", "cubic-bezier(0, 0, 0.18, 1)");
  await expect(heroTitle).toHaveCSS("transform", "none");
  await expect(hero).toHaveCSS('height', '355px');
  await expect(hero).toHaveCSS('padding-left', '24px');
  await expect(hero).toHaveCSS('padding-bottom', '32px');
  await expect(hero).toHaveCSS('border-top-left-radius', '0px');
  await expect(hero).toHaveCSS('border-bottom-left-radius', '24px');
  expect(await hero.evaluate((node) => {
    const bounds = node.getBoundingClientRect();
    return bounds.left === 250 && bounds.top === 0 && bounds.right === window.innerWidth;
  })).toBe(true);
  const introMetrics = await page.locator('.orlyata-about__intro').evaluate((node) => {
    const lead = node.querySelector<HTMLElement>('.orlyata-about__lead')?.getBoundingClientRect();
    const copy = node.querySelector<HTMLElement>('.orlyata-about__copy')?.getBoundingClientRect();
    const teachers = node.querySelector<HTMLElement>('.orlyata-about__intro-teachers')?.getBoundingClientRect();
    const heroBounds = document.querySelector<HTMLElement>('.orlyata-page-hero')?.getBoundingClientRect();
    if (lead === undefined || copy === undefined || teachers === undefined || heroBounds === undefined) {
      throw new Error('Missing About intro geometry');
    }
    return { lead, copy, teachers, heroBottom: heroBounds.bottom };
  });
  expect(introMetrics.lead.width).toBeCloseTo(690, 1);
  expect(introMetrics.copy.width).toBeCloseTo(720, 1);
  expect(introMetrics.lead.top).toBeCloseTo(introMetrics.copy.top, 1);
  expect(introMetrics.lead.top).toBeCloseTo(introMetrics.heroBottom + 64, 1);
  expect(introMetrics.teachers.bottom).toBeCloseTo(introMetrics.copy.bottom, 1);
  await expect(page.locator('.orlyata-about__groups .orlyata-accordion')).toHaveCount(4);
  await expect(page.locator('.orlyata-about__groups .orlyata-accordion__content')).toHaveCount(4);
  await expect(page.locator('.orlyata-about__groups .orlyata-accordion[open]')).toHaveCount(0);
  await page.locator('.orlyata-about__groups .orlyata-accordion').first().locator('summary').click();
  await expect(page.locator('.orlyata-about__groups .orlyata-accordion').first()).toHaveAttribute('open', '');
  await expect(page.locator('.orlyata-teacher-card')).toHaveCount(6);
  await expect(page.getByText('Мария Андреевна', { exact: true })).toBeVisible();
  await expect(page.getByText('Марьяна Геннадьевна', { exact: true })).toBeVisible();
  expect(await page.locator('.orlyata-teacher-card__photo').evaluateAll((images) => images.map((image) => ({
    height: image.naturalHeight,
    width: image.naturalWidth,
  })))).toEqual(Array.from({ length: 6 }, () => ({ height: 320, width: 320 })));
  await expect(page.getByRole('button', { name: 'Оставить заявку' })).toBeVisible();
  await expect(page.locator('.orlyata-about__achievements tbody tr')).toHaveCount(25);
  await expect(page.getByText('XIII Всероссийский конкурс детских хоров', { exact: true })).toBeVisible();
  const footer = page.locator('.orlyata-footer');
  const achievements = page.locator('.orlyata-about__achievements');
  await expect(footer).toHaveCount(1);
  await expect(page.locator('.orlyata-about__grid .orlyata-footer')).toHaveCount(0);
  expect(await footer.evaluate((node) => node.parentElement?.classList.contains('orlyata-about__body') ?? false)).toBe(true);
  const footerGap = await footer.evaluate((node) => node.getBoundingClientRect().top - document.querySelector<HTMLElement>('.orlyata-about__achievements')!.getBoundingClientRect().bottom);
  expect(footerGap).toBeCloseTo(120, 1);
  await expect(page.getByText('Политика конфиденциальности', { exact: true })).toBeVisible();

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
});

test('About page hero follows the desktop fluid scale at the contract anchors', async ({ page }) => {
  for (const [width, expectedHeight, expectedLeft, expectedPaddingLeft, expectedPaddingBottom] of [
    [1280, 355 * (2 / 3), 250 * (2 / 3), 24 * (2 / 3), 32 * (2 / 3)],
    [1920, 355, 250, 24, 32],
    [2560, 355 * (4 / 3), 250 * (4 / 3), 24 * (4 / 3), 32 * (4 / 3)],
  ] as const) {
    await page.setViewportSize({ width, height: 1080 });
    await page.goto('/iframe.html?id=pages-about--desktop-preview&viewMode=story');
    await expectGingerLoaded(page);
    const hero = page.locator('.orlyata-page-hero');
    const metrics = await hero.evaluate((node) => {
      const bounds = node.getBoundingClientRect();
      const styles = getComputedStyle(node);
      return { height: bounds.height, left: bounds.left, paddingLeft: parseFloat(styles.paddingLeft), paddingBottom: parseFloat(styles.paddingBottom) };
    });
    expect(metrics.height).toBeCloseTo(expectedHeight, 1);
    expect(metrics.left).toBeCloseTo(expectedLeft, 1);
    expect(metrics.paddingLeft).toBeCloseTo(expectedPaddingLeft, 1);
    expect(metrics.paddingBottom).toBeCloseTo(expectedPaddingBottom, 1);
    expect(metrics.left + (await hero.evaluate((node) => node.getBoundingClientRect().width))).toBeCloseTo(width, 1);
  }
});


test('About Life and Teachers preserve their desktop ratios and internal scale', async ({ page }) => {
  const samples: Array<{ width: number; lifeRatio: number; teacherRatio: number; portrait: number; portraitGap: number; headingGap: number; gridGap: number }> = [];

  for (const width of [1280, 1440, 1600, 1920, 2240, 2560]) {
    await page.setViewportSize({ width, height: 1080 });
    await page.goto('/iframe.html?id=pages-about--desktop-preview&viewMode=story');
    await expectGingerLoaded(page);
    await page.locator('.orlyata-about__life-card').waitFor();
    await page.locator('.orlyata-teacher-card__photo').first().waitFor();
    samples.push(await page.evaluate((sampleWidth) => {
      const life = document.querySelector<HTMLElement>('.orlyata-about__life-card');
    const teacher = document.querySelector<HTMLElement>('.orlyata-teacher-card');
    const photo = document.querySelector<HTMLElement>('.orlyata-teacher-card__photo');
      const heading = document.querySelector<HTMLElement>('.orlyata-about__life h2');
      const grid = document.querySelector<HTMLElement>('.orlyata-about__teacher-grid');
      if (!life || !teacher || !photo || !heading || !grid) throw new Error('About geometry is missing');
      const lifeBounds = life.getBoundingClientRect();
      const teacherBounds = teacher.getBoundingClientRect();
      const photoStyles = getComputedStyle(photo);
      const headingStyles = getComputedStyle(heading);
      const gridStyles = getComputedStyle(grid);
      return {
        width: sampleWidth,
        lifeRatio: lifeBounds.width / lifeBounds.height,
        teacherRatio: teacherBounds.width / teacherBounds.height,
        portrait: photo.getBoundingClientRect().width,
        portraitGap: parseFloat(photoStyles.marginBottom),
        headingGap: parseFloat(headingStyles.marginBottom),
        gridGap: parseFloat(gridStyles.columnGap),
      };
    }, width));
  }

  const reference = samples.find((sample) => sample.width === 1920);
  if (reference === undefined) {
    throw new Error('Missing 1920px reference sample');
  }

  expect(reference.lifeRatio).toBeCloseTo(803 / 600, 2);
  expect(reference.teacherRatio).toBeCloseTo(257 / 340, 2);
  expect(reference.portrait).toBeCloseTo(160, 1);
  expect(reference.portraitGap).toBeCloseTo(71, 1);
  expect(reference.headingGap).toBeCloseTo(24, 1);
  expect(reference.gridGap).toBeCloseTo(16, 1);
  for (const sample of samples) {
    const scale = sample.width / 1920;
    expect(sample.lifeRatio).toBeCloseTo(reference.lifeRatio, 3);
    expect(sample.teacherRatio).toBeCloseTo(reference.teacherRatio, 3);
    expect(sample.portrait).toBeCloseTo(reference.portrait * scale, 1);
    expect(sample.portraitGap).toBeCloseTo(reference.portraitGap * scale, 1);
    expect(sample.headingGap).toBeCloseTo(reference.headingGap * scale, 1);
    expect(sample.gridGap).toBeCloseTo(reference.gridGap * scale, 1);
  }
});
