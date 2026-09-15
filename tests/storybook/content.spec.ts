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
  await expect(icon.first()).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 24, 0)');
  await expect(icon.nth(1)).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
});

test('Link changes color without label movement on hover', async ({ page }) => {
  await openStory(page, 'components-link--variants');

  const link = page.getByRole('link', { name: 'Со сменой цвета' });
  const label = link.locator('.orlyata-text-link__label');

  await expect(link).toHaveCSS('transition-duration', '0.2s, 0.2s');
  await expect(label).toHaveCSS('transform', 'none');
  await link.hover();
  await expect(link).toHaveCSS('color', 'rgb(24, 23, 23)');
  await expect(icon.first()).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 24, 0)');
  await expect(icon.nth(1)).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
});

test('Input preserves native form semantics', async ({ page }) => {
  await openStory(page, 'components-input--states');

  await expect(page.getByRole('textbox', { name: 'ФИО родителя' }).first()).toBeVisible();
});
test('Link with chevron keeps the icon decorative and aligns it at the approved size and gap', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await openStory(page, 'components-link--variants');

  const link = page.getByRole('link', { name: 'С chevron' });
  const track = link.locator('.orlyata-text-link__icon-track');
  const icon = track.locator('.orlyata-text-link__icon');

  await expect(track).toHaveAttribute('aria-hidden', 'true');
  await expect(track).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 1)');
  await expect(icon).toHaveCount(2);
  await expect(icon.first()).toHaveAttribute('viewBox', '0 0 24 24');
  await expect(icon.first()).toHaveCSS('width', '24px');
  await expect(icon.first()).toHaveCSS('height', '24px');
  const gap = await link.evaluate((element) => getComputedStyle(element).columnGap);
  expect(Number.parseFloat(gap)).toBeCloseTo(4, 3);
  await expect(link).toHaveCSS('color', 'rgb(113, 113, 122)');
  await link.hover();
  await expect(link).toHaveCSS('color', 'rgb(24, 23, 23)');
  await expect(icon.first()).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 24, 0)');
  await expect(icon.nth(1)).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
});

test('Accordion preserves native disclosure semantics', async ({ page }) => {
  await openStory(page, 'components-accordion--states');

  const accordion = page.locator('.orlyata-accordion').first();
  await expect(accordion).not.toHaveAttribute('open', '');
  await accordion.locator('summary').click();
  await expect(accordion).toHaveAttribute('open', '');
  await expect(accordion.locator('.orlyata-accordion__summary')).toHaveCSS('color', 'rgb(24, 23, 23)');
  await accordion.locator('summary').click();
  await expect(accordion).not.toHaveAttribute('open', '');
  await expect(accordion.locator('.orlyata-accordion__summary')).toHaveCSS('color', 'rgb(24, 23, 23)');
});

test('Accordion uses the approved one-line group table row at the 393px mobile reference', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await openStory(page, 'components-accordion--states');

  const accordion = page.locator('.orlyata-accordion').first();
  const summary = accordion.locator('.orlyata-accordion__summary');
  const label = summary.locator('.orlyata-accordion__label');
  const title = summary.locator('.orlyata-accordion__title');
  const separator = summary.locator('.orlyata-accordion__separator');
  const meta = summary.locator('.orlyata-accordion__meta');
  const toggle = summary.locator('.orlyata-accordion__toggle-icon');
  const [summaryBox, titleBox, metaBox, toggleBox] = await Promise.all([
    summary.boundingBox(),
    title.boundingBox(),
    meta.boundingBox(),
    toggle.boundingBox(),
  ]);

  await expect(label).toHaveText('Подготовительная группа / 5-7 лет');
  await expect(separator).toHaveCSS('margin-left', '4px');
  await expect(separator).toHaveCSS('margin-right', '4px');
  expect(summaryBox?.height).toBeCloseTo(40, 1);
  expect(titleBox?.y).toBeCloseTo(metaBox?.y ?? 0, 1);
  expect((metaBox?.y ?? 0) + (metaBox?.height ?? 0) / 2).toBeCloseTo((toggleBox?.y ?? 0) + (toggleBox?.height ?? 0) / 2, 1);
  expect(toggleBox?.width).toBeCloseTo(24, 1);
  await expect(summary).toHaveCSS('column-gap', '8px');
  expect(toggleBox?.height).toBeCloseTo(24, 1);
  expect((toggleBox?.x ?? 0) + (toggleBox?.width ?? 0)).toBeCloseTo((summaryBox?.x ?? 0) + (summaryBox?.width ?? 0), 1);
  await expect(toggle).toHaveCSS('stroke-width', '2px');
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

test('DataTable keeps the 48px header contract on tablet', async ({ page }) => {
  await page.setViewportSize({ width: 1279, height: 900 });
  await openStory(page, 'components-data-table--photo');

  const table = page.getByRole('table');
  const headerRow = table.locator('thead tr');
  const firstHeader = table.getByRole('columnheader').first();
  const [headerBox, rowBox] = await Promise.all([
    headerRow.boundingBox(),
    table.locator('tbody tr').first().boundingBox(),
  ]);

  expect(headerBox?.height).toBeCloseTo(48, 1);
  expect(rowBox?.height).toBeCloseTo(49, 1);
  await expect(headerRow).toHaveCSS('border-bottom-width', '1px');
  await expect(firstHeader).toHaveCSS('vertical-align', 'middle');
});

test('DataTable achievements aligns Competition with global editorial column 3 on desktop and tablet', async ({ page }) => {
  for (const viewport of [
    { width: 1920, height: 1080 },
    { width: 1279, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await openStory(page, 'components-data-table--variants');

    const table = page.getByRole('table');
    const headers = table.getByRole('columnheader');
    const cells = table.locator('tbody tr').first().locator('td');
    const [tableBox, headerBoxes, gridGap] = await Promise.all([
      table.boundingBox(),
      Promise.all((await headers.all()).map((header) => header.boundingBox())),
      table.evaluate((element) => Number.parseFloat(getComputedStyle(element.querySelector('thead tr') as Element).columnGap)),
    ]);

    expect(await headers.allTextContents()).toEqual(['Год', 'Достижение', 'Конкурс']);
    expect(headerBoxes).toHaveLength(3);
    await expect(cells.nth(1)).toHaveText('Лауреат I степени / Старший');

    const trackWidth = ((tableBox?.width ?? 0) * 0.5 - gridGap * 2.5) / 3;
    const tableStart = tableBox?.x ?? 0;
    const expectedStarts = [tableStart, tableStart + trackWidth + gridGap, tableStart + (tableBox?.width ?? 0) * 0.5 + gridGap / 2];

    for (const [index, headerBox] of headerBoxes.entries()) {
      expect(headerBox?.x).toBeCloseTo(expectedStarts[index], 0);
    }
    expect(headerBoxes[1]?.width).toBeCloseTo(trackWidth * 2 + gridGap, 1);
  }
});

test('DataTable photo aligns Name, Date, Type and arrow to the editorial grid', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await openStory(page, 'components-data-table--photo');

  const table = page.getByRole('table');
  const headers = table.getByRole('columnheader');
  const [tableBox, headerBoxes, arrowBox, firstRowBox, headerRowBox] = await Promise.all([
    table.boundingBox(),
    Promise.all((await headers.all()).map((header) => header.boundingBox())),
    table.getByRole('link', { name: /Открыть фотогалерею/ }).first().boundingBox(),
    table.locator('tbody tr').first().boundingBox(),
    table.locator('thead tr').boundingBox(),
  ]);

  expect(tableBox).not.toBeNull();
  expect(headerBoxes).toHaveLength(4);
  expect(arrowBox).not.toBeNull();
  expect(firstRowBox?.height).toBeCloseTo(49, 1);
  expect(headerRowBox?.height).toBeCloseTo(48, 1);
  await expect(table.locator('thead tr')).toHaveCSS('border-bottom-width', '1px');

  const tableWidth = tableBox?.width ?? 0;
  const tableStart = tableBox?.x ?? 0;
  const columnWidth = (tableWidth - 16 * 3) / 4;
  expect(headerBoxes[0]?.x).toBeCloseTo(tableStart, 1);
  expect(headerBoxes[0]?.width).toBeCloseTo(columnWidth * 2 + 16, 1);
  expect(headerBoxes[1]?.x).toBeCloseTo(tableStart + columnWidth * 2 + 16 * 2, 1);
  expect(headerBoxes[2]?.x).toBeCloseTo(tableStart + columnWidth * 3 + 16 * 3, 1);
  expect((arrowBox?.x ?? 0) + (arrowBox?.width ?? 0)).toBeCloseTo(tableStart + tableWidth, 1);
});

test('DataTable photo row hover changes all content to secondary and rolls the arrow', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await openStory(page, 'components-data-table--photo');

  const row = page.locator('.orlyata-data-table--photo tbody tr').first();
  await row.hover();
  await page.waitForTimeout(450);

  await expect(row.locator('td').first()).toHaveCSS('color', 'rgb(113, 113, 122)');
  await expect(row.locator('.orlyata-data-table__row-arrow').first()).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 24, 0)');
  await expect(row.locator('.orlyata-data-table__row-arrow').nth(1)).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
});

test('DataTable video uses 32px provider icons centred in rows instead of arrows', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await openStory(page, 'components-data-table--video');

  const row = page.locator('.orlyata-data-table--video tbody tr').first();
  const icon = row.locator('.orlyata-data-table__provider-icon');
  const grayIcon = row.locator('.orlyata-data-table__provider-icon-image--gray');
  const colorIcon = row.locator('.orlyata-data-table__provider-icon-image--color');
  const [rowBox, iconBox] = await Promise.all([row.boundingBox(), icon.boundingBox()]);

  expect(await row.locator('.orlyata-data-table__row-arrow').count()).toBe(0);
  await expect(grayIcon).toHaveAttribute('src', /youtube-gray.svg/);
  await expect(colorIcon).toHaveAttribute('src', /youtube.svg/);
  expect(await grayIcon.evaluate((element) => element instanceof HTMLImageElement ? element.naturalWidth : 0)).toBe(32);
  expect(await colorIcon.evaluate((element) => element instanceof HTMLImageElement ? element.naturalWidth : 0)).toBe(32);
  await expect(grayIcon).toHaveCSS('opacity', '1');
  await expect(colorIcon).toHaveCSS('opacity', '0');
  await row.hover();
  await page.waitForTimeout(250);
  await expect(grayIcon).toHaveCSS('opacity', '0');
  await expect(colorIcon).toHaveCSS('opacity', '1');
  await expect(row.getByRole('link', { name: /Открыть видео.*YouTube/ })).toBeVisible();
  expect(iconBox?.width).toBeCloseTo(32, 1);
  expect(iconBox?.height).toBeCloseTo(32, 1);
  expect( Math.abs( ( iconBox?.y ?? 0 ) + ( iconBox?.height ?? 0 ) / 2 - ( ( rowBox?.y ?? 0 ) + ( rowBox?.height ?? 0 ) / 2 ) ) ).toBeLessThanOrEqual( 0.5 );
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

test('Advantage keeps its accent aligned with the label and value across responsive references', async ({ page }) => {
  for (const viewport of [
    { width: 1920, height: 1080, expectedGap: 16 },
    { width: 1279, height: 1024, expectedGap: 16 },
    { width: 393, height: 852, expectedGap: 8 },
  ]) {
    await page.setViewportSize(viewport);
    await openStory(page, 'components-advantage--variants');

    const card = page.locator('.orlyata-advantage').first();
    const accent = card.locator('.orlyata-advantage__accent');
    const value = card.locator('.orlyata-advantage__value');
    const label = card.locator('.orlyata-advantage__label');
    const [accentBox, valueBox, labelBox] = await Promise.all([accent.boundingBox(), value.boundingBox(), label.boundingBox()]);

    expect(accentBox === null || labelBox === null ? 0 : accentBox.x).toBeCloseTo(labelBox === null ? 0 : labelBox.x, 1);
    expect(accentBox === null || valueBox === null ? 0 : accentBox.y + (accentBox.height / 2)).toBeCloseTo(valueBox === null ? 0 : valueBox.y + (valueBox.height / 2), 1);
    expect(accentBox === null || valueBox === null ? 0 : valueBox.x - (accentBox.x + accentBox.width)).toBeCloseTo(viewport.expectedGap, 1);
  }
});

test('Badge inverse uses the white surface token', async ({ page }) => {
  await openStory(page, 'components-badge--variants');

  const inverse = page.locator('.orlyata-badge--inverse');
  await expect(inverse).toHaveCSS('color', 'rgb(255, 255, 255)');
  await expect(inverse).toHaveCSS('border-color', 'rgb(255, 255, 255)');
});


test('Badge and NewsCard category markers use the borderless Surface muted fill', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await openStory(page, 'components-badge--variants');
  for (const badge of await page.locator('.orlyata-badge:not(.orlyata-badge--inverse)').all()) {
    await expect(badge).toHaveCSS('background-color', 'rgb(244, 244, 245)');
    await expect(badge).toHaveCSS('border-top-width', '0px');
  }

  await openStory(page, 'components-news-card--variants');
  const iconBadge = page.locator('.orlyata-news-card__meta .orlyata-badge--icon');
  await expect(iconBadge).toHaveCSS('background-color', 'rgb(244, 244, 245)');
  await expect(iconBadge).toHaveCSS('border-top-width', '0px');

  const categoryGlyph = page.locator('.orlyata-news-card__meta .orlyata-badge--icon .orlyata-badge__icon');
  await expect(categoryGlyph).toHaveAttribute('src', /news-category-news\.png$/);
  await expect(categoryGlyph).toHaveCSS('width', '32px');

  await page.setViewportSize({ width: 1279, height: 852 });
  await openStory(page, 'components-news-card--variants');
  await expect(page.locator('.orlyata-news-card__meta .orlyata-badge--icon .orlyata-badge__icon')).toHaveCSS('width', '32px');

  await page.setViewportSize({ width: 393, height: 852 });
  await openStory(page, 'components-news-card--variants');
  await expect(page.locator('.orlyata-news-card__meta .orlyata-badge--icon .orlyata-badge__icon')).toHaveCSS('width', '24px');

  await page.setViewportSize({ width: 320, height: 852 });
  await openStory(page, 'components-news-card--variants');
  const mobileGlyphWidth = await page.locator('.orlyata-news-card__meta .orlyata-badge--icon .orlyata-badge__icon').evaluate((glyph) => parseFloat(getComputedStyle(glyph).width));
  expect(mobileGlyphWidth).toBeLessThan(24);
  expect(mobileGlyphWidth).toBeGreaterThan(19);
});

test('Badge examples capitalize a text label without changing a date month', async ({ page }) => {
  await openStory(page, 'components-badge--variants');

  await expect(page.locator('.orlyata-badge')).toHaveText(['Сегодня', 'RuTube', '23 мая', 'Сегодня']);
});

test('Badge height follows the mobile S_m projection with its text', async ({ page }) => {
  for (const width of [320, 393, 767]) {
    await page.setViewportSize({ width, height: 852 });
    await openStory(page, 'components-badge--variants');

    const badge = page.locator('.orlyata-badge').first();
    const box = await badge.boundingBox();
    const expectedHeight = 36 * width / 393;

    expect(box?.height).toBeCloseTo(expectedHeight, 1);

    if (width === 393) {
      await expect(badge).toHaveCSS("font-size", "14px");
      await expect(badge).toHaveCSS("line-height", "16.8px");
      await expect(badge).toHaveCSS("padding-left", "12px");
      await expect(badge).toHaveCSS("padding-right", "12px");
    }
  }
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
  expect(imageBox?.height).toBe(300);
  expect(imageBox === null || titleBox === null ? undefined : titleBox.y - imageBox.y - imageBox.height).toBe(16);
  expect(metaBox === null || smallBox === null ? undefined : metaBox.y + metaBox.height).toBe(smallBox === null ? undefined : smallBox.y + smallBox.height);
  await expect(big.locator('.orlyata-badge--inverse')).toHaveCount(2);
  await expect(big.locator('.orlyata-media-card__title')).toHaveCSS('font-weight', '500');
  await expect(smallTitle).toHaveCSS('font-weight', '500');
});


test('MediaCard mobile uses one image-overlay title and metadata treatment at the 393px reference', async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await openStory(page, 'components-media-card--variants');

  for (const size of ['big', 'small'] as const) {
    const card = page.locator('.orlyata-media-card--' + size);
    const image = card.locator('.orlyata-media-card__image-wrap');
    const title = card.locator('.orlyata-media-card__title');
    const meta = card.locator(size === 'big' ? '.orlyata-media-card__top-meta' : '.orlyata-media-card__meta');
    const [imageBox, titleBox, metaBox] = await Promise.all([image.boundingBox(), title.boundingBox(), meta.boundingBox()]);
    const gradient = await image.evaluate((element) => { const style = getComputedStyle(element, '::after'); return { backgroundImage: style.backgroundImage, bottom: style.bottom, height: Number.parseFloat(style.height), top: Number.parseFloat(style.top) }; });

    await expect(card).toHaveCSS('aspect-ratio', 'auto');
    await expect(card.locator('.orlyata-media-card__link')).toHaveCSS('display', 'grid');
    expect((imageBox?.width ?? 0) / (imageBox?.height ?? 1)).toBeCloseTo(13 / 10, 3);
    await expect(title).toHaveCSS('inline-size', '310px');
    expect(titleBox?.x).toBeCloseTo((imageBox?.x ?? 0) + 16, 1);
    expect(titleBox === null || imageBox === null ? undefined : imageBox.y + imageBox.height - titleBox.y - titleBox.height).toBeCloseTo(16, 1);
    expect(metaBox === null || titleBox === null ? undefined : titleBox.y - metaBox.y - metaBox.height).toBeCloseTo(8, 1);
    await expect(title).toHaveCSS('color', 'rgb(255, 255, 255)');
    await expect(image).toHaveCSS('--media-card-mobile-gradient-height', '50%');
    await expect(meta).toHaveCSS('gap', '0px');
    await expect(meta.locator('.orlyata-badge')).toHaveCSS('background-color', size === 'big' ? 'rgb(255, 255, 255)' : 'rgb(244, 244, 245)');
    await expect(meta.locator('.orlyata-badge')).toHaveCSS('border-top-width', '0px');
    if (size === 'big') {
      await expect(meta.locator('.orlyata-media-card__play')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
      await expect(meta.locator('.orlyata-media-card__play')).toHaveCSS('border-top-style', 'none');
      await expect(card.locator('.orlyata-media-card__play')).toHaveCSS('width', '36px');
      await expect(card.locator('.orlyata-media-card__play')).toHaveCSS('height', '36px');
    }
    expect(gradient.height).toBeCloseTo((imageBox?.height ?? 0) * 0.5, 1);
    expect(gradient.top + gradient.height).toBeCloseTo(imageBox?.height ?? 0, 1);
    expect(gradient.bottom).toBe('0px');
    expect(gradient.backgroundImage).toContain('linear-gradient');
  }
});

test('MediaCard mobile title width follows S_m', async ({ page }) => {
  for (const width of [320, 393, 767]) {
    await page.setViewportSize({ width, height: 852 });
    await openStory(page, 'components-media-card--variants');

    const title = page.locator('.orlyata-media-card--big .orlyata-media-card__title');
    const inlineSize = await title.evaluate((element) => Number.parseFloat(getComputedStyle(element).inlineSize));

    expect(inlineSize).toBeCloseTo(310 * width / 393, 1);
  }
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
  const smallMeta = smallCard.locator('.orlyata-media-card__meta');
  const smallBadge = smallMeta.locator('.orlyata-badge');
  const smallPlay = smallMeta.locator('.orlyata-media-card__play');
  const [smallBadgeBox, smallPlayBox] = await Promise.all([smallBadge.boundingBox(), smallPlay.boundingBox()]);
  await expect(smallImage.locator('.orlyata-media-card__play')).toHaveCount(0);
  await expect(smallMeta).toHaveCSS('gap', '0px');
  await expect(smallPlay).toHaveCSS('border-top-width', '0px');
  await expect(smallPlay).toHaveCSS('background-color', 'rgb(244, 244, 245)');
  expect(smallPlayBox?.x).toBeCloseTo((smallBadgeBox?.x ?? 0) + (smallBadgeBox?.width ?? 0), 1);
  expect(smallPlayBox?.y).toBeCloseTo(smallBadgeBox?.y, 1);
  await expect(page.locator('.orlyata-media-card__play')).toBeVisible();
  await expect(page.locator('.orlyata-media-card--video video')).toHaveCount(1);

  await page.goto('/iframe.html?id=components-media-card--playground&viewMode=story&args=mediaType:photo');
  await expect(page.locator('main.component-page')).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('.orlyata-media-card__play')).toHaveCount(0);
  await expect(page.locator('.orlyata-media-card--video video')).toHaveCount(0);
});
test('MediaCard desktop and tablet keep date and Play contiguous', async ({ page }) => {
  for (const width of [1920, 1279]) {
    await page.setViewportSize({ width, height: 1080 });
    await page.goto('/iframe.html?id=components-media-card--playground&viewMode=story&args=mediaType:video;size:big');
    await expect(page.locator('main.component-page')).toBeVisible({ timeout: 15_000 });
    const meta = page.locator('.orlyata-media-card--big .orlyata-media-card__top-meta');
    const badge = meta.locator('.orlyata-badge');
    const play = meta.locator('.orlyata-media-card__play');
    const [badgeBox, playBox] = await Promise.all([badge.boundingBox(), play.boundingBox()]);
    await expect(meta).toHaveCSS('gap', '0px');
    await expect(play).toHaveCSS('border-top-width', '0px');
    await expect(badge).toHaveCSS('background-color', 'rgb(255, 255, 255)');
    expect(playBox?.x).toBeCloseTo((badgeBox?.x ?? 0) + (badgeBox?.width ?? 0), 1);
    expect(playBox?.y).toBeCloseTo(badgeBox?.y, 1);
    await page.goto('/iframe.html?id=components-media-card--playground&viewMode=story&args=mediaType:video;size:small');
    const small = page.locator('.orlyata-media-card--small.orlyata-media-card--video');
    const smallMeta = small.locator('.orlyata-media-card__meta');
    const smallBadge = smallMeta.locator('.orlyata-badge');
    const smallPlay = smallMeta.locator('.orlyata-media-card__play');
    const [smallBadgeBox, smallPlayBox] = await Promise.all([smallBadge.boundingBox(), smallPlay.boundingBox()]);
    await expect(small.locator('.orlyata-media-card__image-wrap .orlyata-media-card__play')).toHaveCount(0);
    await expect(smallMeta).toHaveCSS('gap', '0px');
    await expect(smallPlay).toHaveCSS('border-top-width', '0px');
    await expect(smallPlay).toHaveCSS('background-color', 'rgb(244, 244, 245)');
    expect(smallPlayBox?.x).toBeCloseTo((smallBadgeBox?.x ?? 0) + (smallBadgeBox?.width ?? 0), 1);
    expect(smallPlayBox?.y).toBeCloseTo(smallBadgeBox?.y, 1);
  }
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

for (const viewport of [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 320, height: 852 },
]) {
  test('NewsCard keeps adjacent metadata badges on ' + viewport.name, async ({ page }) => {
    await page.setViewportSize(viewport);
    await openStory(page, 'components-news-card--variants');

    await expect(page.locator('.orlyata-news-card__meta')).toHaveCSS('gap', '0px');
  });
}

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

test('Storybook documents the previously missing component variants at the mobile reference', async ({ page, request }) => {
  const response = await request.get('/index.json');
  expect(response.ok()).toBe(true);
  const index = await response.json() as { entries: Record<string, { parameters?: { viewport?: { defaultViewport?: string } } }> };
  const expected = [
    'components-achievements-table--mobile',
    'components-achievements-table--variants',
    'components-data-table--notes',
    'components-advantage--mobile',
    'components-badge--icon',
    'components-badge--mobile',
    'components-button--mobile',
    'components-input--mobile',
    'components-link--color-inverse',
    'components-link--mobile',
    'components-page-hero--mobile',
    'components-searchinput--focus-visible',
    'components-searchinput--mobile',
    'components-searchinput--playground',
  ];

  for (const story of expected) {
    expect(index.entries).toHaveProperty(story);
  }

  const mobileStories = expected.filter((item) => item.endsWith('--mobile'));
  await page.setViewportSize({ width: 393, height: 852 });
  for (const story of mobileStories) {
    await page.goto('/iframe.html?id=' + story + '&viewMode=story');
    await expect(page.locator('#storybook-root')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(393);
  }
});
