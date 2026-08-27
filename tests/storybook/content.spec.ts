import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { expectGingerLoaded, viewports } from './visual';

const stories = [
  'components-link--variants',
  'components-badge--variants',
  'components-input--states',
  'components-accordion--states',
  'components-advantage--variants',
  'components-news-card--variants',
  'components-teacher-card--variants',
  'components-media-card--variants',
  'components-data-table--variants',
] as const;

async function openStory(page: import('@playwright/test').Page, story: string): Promise<void> {
  await page.goto('/iframe.html?id=' + story + '&viewMode=story');
  await expect(page.locator('main.component-page')).toBeVisible({ timeout: 15_000 });
  await expectGingerLoaded(page);
}

for (const story of stories) {
  test(story + ' has no automatic accessibility violations', async ({ page }) => {
    await openStory(page, story);

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  for (const viewport of viewports) {
    test(story + ' visual ' + viewport.name, async ({ page }) => {
      await page.setViewportSize(viewport);
      await openStory(page, story);
      await expect(page).toHaveScreenshot(story + '-' + viewport.name + '.png', { fullPage: true });
    });
  }
}

const playgroundStories = [
  'components-accordion--playground',
  'components-advantage--playground',
  'components-badge--playground',
  'components-button--playground',
  'components-data-table--playground',
  'components-input--playground',
  'components-link--playground',
  'components-media-card--playground',
  'components-news-card--playground',
  'components-teacher-card--playground',
] as const;

for (const story of playgroundStories) {
  test(story + ' Playground has no automatic accessibility violations', async ({ page }) => {
    await openStory(page, story);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}

test('Link preserves native navigation semantics', async ({ page }) => {
  await openStory(page, 'components-link--variants');

  await expect(page.getByRole('link', { name: 'С прокруткой' })).toBeVisible();
});

test('Link rolls its label into view on hover without changing navigation semantics', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await openStory(page, 'components-link--variants');

  const link = page.getByRole('link', { name: 'С прокруткой' });
  const label = link.locator('.orlyata-text-link__label');

  await expect(label).toHaveAttribute('data-text', 'С прокруткой');
  await expect(label).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 28)');
  await link.hover();
  await expect(label).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
  await expect(link).toHaveCSS('color', 'rgb(24, 23, 23)');
});

test('Link changes color without label movement on hover', async ({ page }) => {
  await openStory(page, 'components-link--variants');

  const link = page.getByRole('link', { name: 'Со сменой цвета' });
  const label = link.locator('.orlyata-text-link__label');

  await expect(link).toHaveCSS('transition-duration', '0.2s, 0.2s');
  await expect(label).toHaveCSS('transform', 'none');
  await link.hover();
  await expect(link).toHaveCSS('color', 'rgb(24, 23, 23)');
});

test('Input preserves native form semantics', async ({ page }) => {
  await openStory(page, 'components-input--states');

  await expect(page.getByRole('textbox', { name: 'ФИО родителя' }).first()).toBeVisible();
});

test('Accordion preserves native disclosure semantics', async ({ page }) => {
  await openStory(page, 'components-accordion--states');

  const accordion = page.locator('.orlyata-accordion').first();
  await expect(accordion).not.toHaveAttribute('open', '');
  await accordion.locator('summary').click();
  await expect(accordion).toHaveAttribute('open', '');
});

test('DataTable preserves semantic table markup', async ({ page }) => {
  await openStory(page, 'components-data-table--variants');

  const table = page.getByRole('table');
  await expect(table).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Достижение' })).toBeVisible();
  const rows = table.locator('tbody tr');
  await expect(rows).toHaveCount(2);
  await expect(rows.first()).toHaveCSS('border-bottom-width', '1px');
  await expect(rows.first()).toHaveCSS('border-bottom-color', 'rgb(199, 199, 204)');
  await expect(rows.last()).toHaveCSS('border-bottom-width', '1px');
});

test('DataTable achievements aligns Year and Competition to editorial columns 1 and 3', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await openStory(page, 'components-data-table--variants');

  const table = page.getByRole('table');
  const headers = table.getByRole('columnheader');
  const [tableBox, headerBoxes] = await Promise.all([
    table.boundingBox(),
    Promise.all((await headers.all()).map((header) => header.boundingBox())),
  ]);

  expect(tableBox).not.toBeNull();
  expect(headerBoxes).toHaveLength(4);

  const tableWidth = tableBox?.width ?? 0;
  const tableStart = tableBox?.x ?? 0;
  const gridGap = 16;
  const editorialColumnWidth = (tableWidth - gridGap * 3) / 4;
  const competitionStart = tableStart + editorialColumnWidth * 2 + gridGap * 2;
  const equalIntermediateColumnWidth = (competitionStart - tableStart) / 3;
  const yearColumnWidth = equalIntermediateColumnWidth * 0.6;
  const remainingColumnWidth = equalIntermediateColumnWidth * 1.2;
  const expectedStarts = [tableStart, tableStart + yearColumnWidth, tableStart + yearColumnWidth + remainingColumnWidth, competitionStart];

  for (const [index, headerBox] of headerBoxes.entries()) {
    expect(headerBox?.x).toBeCloseTo(expectedStarts[index], 1);
  }
});

test('DataTable retains headers and cell labels without horizontal scrolling on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await openStory(page, 'components-data-table--variants');

  await expect(page.getByRole('columnheader', { name: 'Достижение' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Год 2026' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Конкурс XI Московский областной открытый конкурс хоров мальчиков Подмосковья' })).toBeVisible();
  const hasHorizontalOverflow = await page.locator('html').evaluate((element) => element.scrollWidth > element.clientWidth);
  expect(hasHorizontalOverflow).toBe(false);
});

test("Accordion animates disclosure and morphs its icon", async ({ page }) => {
  await openStory(page, "components-accordion--states");
  const accordions = page.locator(".orlyata-accordion");
  const first = accordions.first();
  const second = accordions.nth(1);
  const firstPanel = first.locator(".orlyata-accordion__panel");
  const path = first.locator(".orlyata-accordion__toggle-path");

  await first.locator("summary").click();
  await expect(first).toHaveAttribute("open", "");
  await expect(firstPanel).toHaveCSS("transition-duration", "0.4s");
  await page.waitForTimeout(100);

  const opening = await firstPanel.evaluate((element) => ({
    height: element.getBoundingClientRect().height,
    target: element.scrollHeight,
  }));
  expect(opening.height).toBeGreaterThan(0);
  expect(opening.height).toBeLessThan(opening.target);
  await expect(path).not.toHaveAttribute("d", "M5 12h14M12 5v14");

  await second.locator("summary").click();
  await expect(second).toHaveAttribute("open", "");
  await page.waitForTimeout(500);
  await expect(first).not.toHaveAttribute("open", "");
  await expect(second).toHaveAttribute("open", "");
  await expect(accordions.locator("[open]")).toHaveCount(0);
  await expect(page.locator(".orlyata-accordion[open]")).toHaveCount(1);
});

test('Advantage matches the approved 170px vertical geometry at the 1920px reference', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await openStory(page, 'components-advantage--variants');

  const card = page.locator('.orlyata-advantage').first();
  const value = card.locator('.orlyata-advantage__value');
  const label = card.locator('.orlyata-advantage__label');
  const [cardBox, valueBox, labelBox] = await Promise.all([card.boundingBox(), value.boundingBox(), label.boundingBox()]);

  expect(cardBox?.height).toBeCloseTo(170, 0);
  expect(valueBox?.y).toBeCloseTo(cardBox === null ? 0 : cardBox.y + 24, 1);
  expect(labelBox === null || cardBox === null ? 0 : labelBox.y + labelBox.height).toBeCloseTo(cardBox === null ? 0 : cardBox.y + 154, 0);
  await expect(label).toHaveCSS('color', 'rgb(111, 111, 120)');
});

test('Badge inverse uses the white surface token', async ({ page }) => {
  await openStory(page, 'components-badge--variants');

  const inverse = page.locator('.orlyata-badge--inverse');
  await expect(inverse).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(inverse).toHaveCSS('border-color', 'rgb(255, 255, 255)');
});

test('Input exposes all four Figma states', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await openStory(page, 'components-input--states');

  const inputs = page.locator('.orlyata-input');
  const labels = page.locator('.orlyata-input__label');
  const controls = page.locator('.orlyata-input__control');

  await expect(inputs).toHaveCount(4);
  await expect(inputs.nth(0)).not.toHaveClass(/is-filled|is-typing|has-error/);
  await expect(inputs.nth(1)).toHaveClass(/is-typing/);
  await expect(inputs.nth(2)).toHaveClass(/is-filled/);
  await expect(inputs.nth(3)).toHaveClass(/has-error/);
  await expect(labels.nth(0)).toHaveCSS('font-size', '20px');
  await expect(labels.nth(1)).toHaveCSS('font-size', '14px');
  await expect(labels.nth(2)).toHaveCSS('font-size', '14px');
  await expect(labels.nth(3)).toHaveCSS('font-size', '20px');

  for (const label of await labels.all()) {
    await expect(label).toHaveCSS('color', 'rgb(111, 111, 120)');
  }

  await expect(controls.nth(1)).toHaveCSS('border-color', 'rgb(33, 166, 66)');
  await expect(controls.nth(3)).toHaveCSS('border-color', 'rgb(214, 58, 58)');
  expect((await controls.nth(0).boundingBox())?.height).toBe(64);
});

test('Storybook exposes typed Playground stories for every current component', async ({ request }) => {
  const response = await request.get('/index.json');
  expect(response.ok()).toBe(true);
  const index = await response.json() as { entries: Record<string, unknown> };
  const expected = [
    'components-accordion--playground',
    'components-application-form--playground',
    'components-advantage--playground',
    'components-badge--playground',
    'components-button--playground',
    'components-data-table--playground',
    'components-input--playground',
    'components-link--playground',
    'components-media-card--playground',
    'components-news-card--playground',
    'components-footer--playground',
    'components-sidebar--playground',
  ];

  for (const story of expected) {
    expect(index.entries).toHaveProperty(story);
  }
});

test('Input Playground responds to serialized Control args', async ({ page }) => {
  await page.goto('/iframe.html?id=components-input--playground&viewMode=story&args=label:Name;state:typing;value:Ivan');
  await expect(page.locator('main.component-page')).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('.orlyata-input__label')).toHaveText('Name');
  await expect(page.locator('.orlyata-input__field')).toHaveValue('Ivan');
  await expect(page.locator('.orlyata-input')).toHaveClass(/is-typing/);
});

test('Input matches Figma stacked geometry and uses one focus border', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await openStory(page, 'components-input--states');

  for (const index of [1, 2]) {
    const control = page.locator('.orlyata-input__control').nth(index);
    const label = page.locator('.orlyata-input__label').nth(index);
    const field = page.locator('.orlyata-input__field').nth(index);
    const [controlBox, labelBox, fieldBox] = await Promise.all([
      control.boundingBox(),
      label.boundingBox(),
      field.boundingBox(),
    ]);

    expect(controlBox?.height).toBe(64);
    expect(labelBox?.height).toBe(21);
    expect(fieldBox?.height).toBe(28);
    expect(labelBox === null || fieldBox === null ? undefined : fieldBox.y - labelBox.y - labelBox.height).toBeCloseTo(0, 1);
    expect(controlBox === null || labelBox === null ? undefined : labelBox.y - controlBox.y).toBeCloseTo(7.5, 1);
    expect(controlBox === null || fieldBox === null ? undefined : controlBox.y + controlBox.height - fieldBox.y - fieldBox.height).toBeCloseTo(7.5, 1);
  }

  const defaultControl = page.locator('.orlyata-input__control').first();
  const defaultLabel = page.locator('.orlyata-input__label').first();
  await expect(defaultLabel).toHaveCSS('transition-duration', '0.4s, 0.4s');
  await page.locator('.orlyata-input__field').first().focus();
  await page.waitForTimeout(180);
  await expect(defaultControl).toHaveCSS('border-color', 'rgb(33, 166, 66)');
  await expect(defaultControl).toHaveCSS('outline-style', 'none');
});

test('MediaCard matches 540px cards, small spacing and title weight', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await openStory(page, 'components-media-card--variants');

  const big = page.locator('.orlyata-media-card--big');
  const small = page.locator('.orlyata-media-card--small');
  const smallImage = small.locator('.orlyata-media-card__image-wrap');
  const smallTitle = small.locator('.orlyata-media-card__title');
  const smallMeta = small.locator('.orlyata-media-card__meta');
  const [bigBox, smallBox, imageBox, titleBox, metaBox] = await Promise.all([
    big.boundingBox(),
    small.boundingBox(),
    smallImage.boundingBox(),
    smallTitle.boundingBox(),
    smallMeta.boundingBox(),
  ]);

  expect(bigBox?.height).toBe(540);
  expect(smallBox?.height).toBe(540);
  expect(imageBox === null || titleBox === null ? undefined : titleBox.y - imageBox.y - imageBox.height).toBe(16);
  expect(metaBox === null || smallBox === null ? undefined : metaBox.y + metaBox.height).toBe(smallBox === null ? undefined : smallBox.y + smallBox.height);
  await expect(big.locator('.orlyata-badge--inverse')).toHaveCount(2);
  await expect(big.locator('.orlyata-media-card__title')).toHaveCSS('font-weight', '500');
  await expect(smallTitle).toHaveCSS('font-weight', '500');
});


test('MediaCard renders date first and provider only for video', async ({ page }) => {
  await openStory(page, 'components-media-card--variants');

  const videoCard = page.locator('.orlyata-media-card--big');
  const photoCard = page.locator('.orlyata-media-card--small');

  await expect(videoCard.locator('.orlyata-media-card__meta .orlyata-badge')).toHaveText(['Сегодня', 'RuTube']);
  await expect(photoCard.locator('.orlyata-media-card__meta .orlyata-badge')).toHaveText(['23 мая']);
});

test('MediaCard crops 10% photo scale on hover without changing card geometry', async ({ page }) => {
  await openStory(page, 'components-media-card--variants');

  for (const card of await page.locator('.orlyata-media-card').all()) {
    const image = card.locator('.orlyata-media-card__image');
    await expect(image).toHaveCSS('transition-duration', '0.4s');
    await expect(image).toHaveCSS('transition-timing-function', 'cubic-bezier(0.46, 0, 0, 1)');
    const beforeHover = await card.boundingBox();
    await card.getByRole('link').hover();
    await expect(image).toHaveCSS('transform', 'matrix(1.1, 0, 0, 1.1, 0, 0)');
    const afterHover = await card.boundingBox();
    expect(afterHover?.width).toBe(beforeHover?.width);
    expect(afterHover?.height).toBe(beforeHover?.height);

  }
});

test('MediaCard Playground renders a looping video preview and provider link', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await openStory(page, 'components-media-card--playground');

  const card = page.locator('.orlyata-media-card--video');
  const play = card.locator('.orlyata-media-card__play');
  const image = card.locator('.orlyata-media-card__image');
  const preview = card.locator('.orlyata-media-card__preview');
  const video = card.locator('.orlyata-media-card__preview-video');
  await expect(play).toHaveCSS('width', '64px');
  await card.getByRole('link').hover();
  await expect(play).toHaveCSS('width', '64px');
  await expect(video).toHaveCSS('transform', 'matrix(1.1, 0, 0, 1.1, 0, 0)');
  await expect(video).toHaveCount(1);
  await expect(video).toHaveJSProperty('muted', true);
  await expect(preview).not.toHaveAttribute('hidden', '');
  await expect(image).toHaveAttribute('hidden', '');
  await expect(card.getByRole('link')).toHaveAttribute('target', '_blank');
});

test('MediaCard Playground keeps provider iframe preview non-interactive while the card links to the provider', async ({ page }) => {
  await page.route('https://rutube.ru/play/embed/2ad60bfd20027143c2eac71acdb5faef/?autostartmute=true&autoplay=true', (route) => route.fulfill({ body: '', contentType: 'text/html' }));
  await openStory(page, 'components-media-card--provider-embed-preview');

  const card = page.locator('.orlyata-media-card--video');
  const embed = card.locator('.orlyata-media-card__preview-embed');

  await expect(embed).toHaveAttribute('src', 'https://rutube.ru/play/embed/2ad60bfd20027143c2eac71acdb5faef/?autostartmute=true&autoplay=true');
  await expect(embed).toHaveAttribute('tabindex', '-1');
  await expect(embed).toHaveCSS('pointer-events', 'none');
  await expect(card.getByRole('link')).toHaveAttribute('href', 'https://rutube.ru/play/embed/2ad60bfd20027143c2eac71acdb5faef/');
});

test('MediaCard Playground always shows Play in video cards, never in photos', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/iframe.html?id=components-media-card--playground&viewMode=story&args=mediaType:video;size:small');
  await expect(page.locator('main.component-page')).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('.orlyata-media-card--small.orlyata-media-card--video')).toBeVisible();
  const smallCard = page.locator('.orlyata-media-card--small.orlyata-media-card--video');
  const smallImage = smallCard.locator('.orlyata-media-card__image-wrap');
  const smallPlay = smallCard.locator('.orlyata-media-card__play');
  const [smallCardBox, smallImageBox, smallPlayBox] = await Promise.all([smallCard.boundingBox(), smallImage.boundingBox(), smallPlay.boundingBox()]);
  expect(smallPlayBox?.x).toBe(smallCardBox === null ? undefined : smallCardBox.x + 24);
  expect(smallPlayBox?.y).toBe(smallImageBox === null ? undefined : smallImageBox.y + 16);
  await expect(page.locator('.orlyata-media-card__play')).toBeVisible();
  await expect(page.locator('.orlyata-media-card--video video')).toHaveCount(1);

  await page.goto('/iframe.html?id=components-media-card--playground&viewMode=story&args=mediaType:photo');
  await expect(page.locator('main.component-page')).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('.orlyata-media-card__play')).toHaveCount(0);
  await expect(page.locator('.orlyata-media-card--video video')).toHaveCount(0);
});

test('MediaCard title keeps the separator between multi-line copies on hover', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await openStory(page, 'components-media-card--variants');

  const card = page.locator('.orlyata-media-card--big');
  const label = card.locator('.orlyata-media-card__title-label');

  await card.getByRole('link').hover();
  await page.waitForTimeout(450);

  const [labelBox, transform] = await Promise.all([
    label.boundingBox(),
    label.evaluate((element) => getComputedStyle(element).transform),
  ]);
  const translateY = Number.parseFloat(transform.split(',').at(-1) ?? '0');

  expect(translateY).toBeCloseTo(-(labelBox?.height ?? 0) - 4, 1);
});

test('NewsCard title uses Figma weight 500 and rolls like the published Storybook preview on hover', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await openStory(page, 'components-news-card--variants');

  const card = page.locator('.orlyata-news-card');
  const title = card.locator('.orlyata-news-card__title');
  const label = card.locator('.orlyata-news-card__title-label');

  await expect(title).toHaveCSS('font-weight', '500');
  await expect(card).toHaveCSS('cursor', 'pointer');
  await expect(label).toHaveAttribute('data-text', '«Крылатое сердце» — большой весенний концерт');
  await expect(label).toHaveCSS('transform', 'none');
  await card.hover();
  await page.waitForTimeout(450);

  const [labelBox, transform] = await Promise.all([
    label.boundingBox(),
    label.evaluate((element) => getComputedStyle(element).transform),
  ]);
  const translateY = Number.parseFloat(transform.split(',').at(-1) ?? '0');

  expect(translateY).toBeCloseTo(-(labelBox?.height ?? 0) - 4, 1);
  await expect(label).toHaveCSS('transition-duration', '0.4s');
});

test('TeacherCard uses the stage grid and rolls both text lines on card hover', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await openStory(page, 'components-teacher-card--playground');

  const card = page.locator('.orlyata-teacher-card');
  const grid = page.locator('.orlyata-about__teacher-grid');
  const nameLabel = card.locator('.orlyata-teacher-card__name-label');
  const metaLabel = card.locator('.orlyata-teacher-card__meta-label');
  const photo = card.locator('.orlyata-teacher-card__photo');
  const photoWrap = card.locator('.orlyata-teacher-card__photo-wrap');

  expect(await grid.evaluate((element) => getComputedStyle(element).gridTemplateColumns.trim().split(/\s+/).length)).toBe(6);
  const cardBox = await card.boundingBox();
  await expect(card).toHaveCSS('cursor', 'pointer');
  expect((cardBox?.width ?? 0) / (cardBox?.height ?? 1)).toBeCloseTo(257 / 340, 2);
  await expect(nameLabel).toHaveAttribute('data-text', 'Чернецов');
  await expect(metaLabel).toHaveAttribute('data-text', 'Андрей Викторович');
  await expect(nameLabel).toHaveCSS('transform', 'none');
  await expect(metaLabel).toHaveCSS('transform', 'none');
  await expect(photoWrap).toHaveCSS('width', '160px');
  await expect(photoWrap).toHaveCSS('height', '160px');
  await expect(photo).toHaveCSS('transform', 'none');
  await expect(photo).toHaveCSS('transition-duration', '0.4s');

  await card.hover();
  await page.waitForTimeout(450);
  const photoTransform = await photo.evaluate((element) => getComputedStyle(element).transform);
  const photoScale = Number.parseFloat(photoTransform.split('(')[1]?.split(',')[0] ?? '0');
  expect(photoScale).toBeCloseTo(1.1, 2);

  for (const label of [nameLabel, metaLabel]) {
    const [box, transform] = await Promise.all([
      label.boundingBox(),
      label.evaluate((element) => getComputedStyle(element).transform),
    ]);
    const translateY = Number.parseFloat(transform.split(',').at(-1) ?? '0');

    expect(translateY).toBeCloseTo(-(box?.height ?? 0) - 4, 1);
    await expect(label).toHaveCSS('transition-duration', '0.4s');
  }
});
