import { expect, test } from '@playwright/test';

import { expectGingerLoaded } from './visual';

test('DataTable teacher-achievements begins Achievement at desktop editorial column 3', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/iframe.html?id=components-data-table--teacher-achievements&viewMode=story');
  await expectGingerLoaded(page);

  const table = page.getByRole('table');
  const headers = table.getByRole('columnheader');
  const [tableBox, yearBox, achievementBox] = await Promise.all([
    table.boundingBox(),
    headers.nth(0).boundingBox(),
    headers.nth(1).boundingBox(),
  ]);

  expect(tableBox).not.toBeNull();
  expect(yearBox).not.toBeNull();
  expect(achievementBox).not.toBeNull();

  const tableWidth = tableBox?.width ?? 0;
  const tableStart = tableBox?.x ?? 0;
  const gridGap = 16;
  const columnWidth = (tableWidth - gridGap * 3) / 4;

  expect(yearBox?.x).toBeCloseTo(tableStart, 1);
  expect(achievementBox?.x).toBeCloseTo(tableStart + columnWidth * 2 + gridGap * 2, 1);
  await expect(table.locator('tbody tr')).toHaveCount(2);

  const bodyCells = table.locator('tbody td');
  await expect(bodyCells.nth(0)).toHaveText('2024');
  await expect(bodyCells.nth(2)).toHaveText('2024');

  const [firstYearTextTop, firstAchievementTextTop, alignment] = await Promise.all([
    bodyCells.nth(0).evaluate((element) => {
      const range = document.createRange();
      range.selectNodeContents(element);
      return range.getBoundingClientRect().top;
    }),
    bodyCells.nth(1).evaluate((element) => {
      const range = document.createRange();
      range.selectNodeContents(element);
      return range.getBoundingClientRect().top;
    }),
    bodyCells.nth(0).evaluate((element) => getComputedStyle(element).alignContent),
  ]);

  expect(alignment).toBe('start');
  expect(firstYearTextTop).toBeCloseTo(firstAchievementTextTop, 1);

  const rowBorders = await table.locator('tbody tr').evaluateAll((rows) => rows.map((row) => getComputedStyle(row).borderBlockEndWidth));

  expect(rowBorders).toEqual(['1px', '0px']);

  await table.locator('tbody tr').nth(1).evaluate((row) => row.setAttribute('hidden', ''));
  await expect(table.locator('tbody tr').first()).toHaveCSS('border-block-end-width', '0px');
});
