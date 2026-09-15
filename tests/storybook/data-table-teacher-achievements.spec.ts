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

  await table.locator('tbody tr').nth(1).evaluate((row) => { row.setAttribute('hidden', ''); });
  await expect(table.locator('tbody tr').first()).toHaveCSS('border-block-end-width', '0px');
});


test("DataTable News mobile places the name above the date and grows naturally", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 1024 });
  await page.goto("/iframe.html?id=components-data-table--news&viewMode=story");
  await expectGingerLoaded(page);

  const row = page.getByRole("table").locator("tbody tr").first();
  await row.locator("td").nth(0).evaluate((cell) => {
    cell.innerHTML = "Первая строка<br>Вторая строка<br>Третья строка";
  });

  const metrics = await row.evaluate((element) => {
    const cells = Array.from(element.querySelectorAll("td"));
    const name = cells[0];
    const date = cells[1];
    const arrow = element.querySelector(".orlyata-data-table__row-arrow-track");
    if (!name || !date || !arrow) {
      throw new Error("News mobile row must include Name, Date and arrow.");
    }

    const rowBox = element.getBoundingClientRect();
    const nameBox = name.getBoundingClientRect();
    const dateBox = date.getBoundingClientRect();
    const arrowBox = arrow.getBoundingClientRect();
    const arrowSvgBox = arrow.querySelector("svg")?.getBoundingClientRect();
    const arrowPath = arrow.querySelector("path");
    const style = getComputedStyle(element);
    const firstLineRange = document.createRange();
    firstLineRange.selectNodeContents(name);
    const firstLineBox = firstLineRange.getClientRects()[0];

    return {
      arrowTop: arrowBox.top - rowBox.top,
      arrowHeight: arrowBox.height,
      arrowSvgHeight: arrowSvgBox?.height ?? 0,
      arrowSvgWidth: arrowSvgBox?.width ?? 0,
      iconFirstLineCenterDelta: arrowSvgBox && firstLineBox
        ? Math.abs((arrowSvgBox.top + arrowSvgBox.height / 2) - (firstLineBox.top + firstLineBox.height / 2))
        : Number.POSITIVE_INFINITY,
      dateStart: dateBox.left - rowBox.left,
      dateTop: dateBox.top - rowBox.top,
      arrowSize: arrowBox.width,
      arrowStroke: arrowPath ? getComputedStyle(arrowPath).strokeWidth : "",
      leadingTrack: parseFloat(style.gridTemplateColumns),
      marginBottom: parseFloat(style.marginBottom),
      dateBelowName: dateBox.top >= nameBox.bottom,
      nameBottom: nameBox.bottom - rowBox.top,
      nameTop: nameBox.top - rowBox.top,
      nameStart: nameBox.left - rowBox.left,
      paddingBottom: parseFloat(style.paddingBottom),
      rowGap: parseFloat(style.rowGap),
      rowHeight: rowBox.height,
    };
  });

  expect(metrics.leadingTrack).toBeCloseTo(24, 1);
  expect(metrics.nameStart).toBeCloseTo(56, 1);
  expect(metrics.dateStart).toBeCloseTo(metrics.nameStart, 1);
  expect(metrics.arrowSize).toBeCloseTo(16, 1);
  expect(metrics.arrowHeight).toBeCloseTo(24, 1);
  expect(metrics.arrowSvgWidth).toBeCloseTo(16, 1);
  expect(metrics.arrowSvgHeight).toBeCloseTo(16, 1);
  expect(metrics.iconFirstLineCenterDelta).toBeLessThanOrEqual(1);
  expect(metrics.arrowStroke).toBe("1.5px");
  expect(metrics.rowGap).toBeCloseTo(2, 1);
  expect(metrics.paddingBottom).toBeCloseTo(12, 1);
  expect(metrics.marginBottom).toBeCloseTo(12, 1);
  expect(metrics.arrowTop).toBeCloseTo(metrics.nameTop, 1);
  expect(metrics.nameTop).toBeCloseTo(0, 1);
  expect(metrics.dateBelowName).toBe(true);
  expect(metrics.nameBottom).toBeLessThanOrEqual(metrics.rowHeight - metrics.paddingBottom + 0.5);
});

test("DataTable News tablet grows with multiline names and aligns first lines", async ({ page }) => {
  for (const width of [1279, 768]) {
    await page.setViewportSize({ width, height: 1024 });
    await page.goto("/iframe.html?id=components-data-table--news&viewMode=story");
    await expectGingerLoaded(page);

    const row = page.getByRole("table").locator("tbody tr").first();
    const baselineHeight = await row.evaluate((element) => element.getBoundingClientRect().height);
    await row.locator("td").first().evaluate((element) => {
      element.innerHTML = "Первая строка<br>Вторая строка<br>Третья строка";
    });

    const metrics = await row.evaluate((element) => {
      const cells = Array.from(element.querySelectorAll("td"));
      const arrow = element.querySelector(".orlyata-data-table__row-arrow-track");
      if (!arrow) {
        throw new Error("News row must include its arrow.");
      }

      const rowBox = element.getBoundingClientRect();
      const arrowBox = arrow.getBoundingClientRect();
      const firstTextTop = (cell: Element) => {
        const range = document.createRange();
        range.selectNodeContents(cell);
        return range.getClientRects()[0]?.top ?? cell.getBoundingClientRect().top;
      };
      const titleStyle = getComputedStyle(cells[0]);
      const titleBox = cells[0].getBoundingClientRect();
      const rowStyle = getComputedStyle(element);
      const expectedContentHeight =
        cells[0].scrollHeight + parseFloat(rowStyle.borderBlockEndWidth);

      return {
        alignments: cells.map((cell) => getComputedStyle(cell).alignContent),
        arrowTop: arrowBox.top - rowBox.top,
        expectedContentHeight,
        firstLineTops: cells.slice(0, 3).map((cell) => firstTextTop(cell) - rowBox.top),
        paddingBottom: parseFloat(titleStyle.paddingBottom),
        paddingTop: parseFloat(titleStyle.paddingTop),
        rowHeight: rowBox.height,
        titleHeight: titleBox.height,
      };
    });

    expect(metrics.rowHeight).toBeGreaterThan(baselineHeight);
    expect(Math.abs(metrics.rowHeight - metrics.expectedContentHeight)).toBeLessThanOrEqual(1);
    expect(metrics.titleHeight).toBeCloseTo(metrics.rowHeight - 1, 1);
    expect(metrics.paddingTop).toBeCloseTo(metrics.paddingBottom, 2);
    expect(metrics.alignments.slice(0, 3)).toEqual(["start", "start", "start"]);
    expect(metrics.firstLineTops[1]).toBeCloseTo(metrics.firstLineTops[0], 1);
    expect(metrics.firstLineTops[2]).toBeCloseTo(metrics.firstLineTops[0], 1);
    expect(Math.abs(metrics.arrowTop - metrics.firstLineTops[0])).toBeLessThanOrEqual(1.1);
  }
});


test('DataTable News narrows only the Name row cells by 10 percent on tablet', async ({ page }) => {
  for (const [width, expectedNameScale] of [
    [1279, 0.9],
    [768, 0.9],
    [1280, 1],
    [1920, 1],
  ] as const) {
    await page.setViewportSize({ width, height: 1024 });
    await page.goto('/iframe.html?id=components-data-table--news&viewMode=story');
    await expectGingerLoaded(page);

    const metrics = await page.getByRole('table').locator('tbody tr').first().evaluate((element) => {
      const style = getComputedStyle(element);
      const tracks = style.gridTemplateColumns.split(' ').map(Number.parseFloat);
      const gap = Number.parseFloat(style.columnGap);
      const equalTrack = (element.getBoundingClientRect().width - gap * 3) / 4;
      const defaultNameWidth = equalTrack * 2 + gap;
      const nameWidth = element.querySelector('td')?.getBoundingClientRect().width ?? 0;

      return { defaultNameWidth, equalTrack, nameWidth, tracks };
    });

    expect(metrics.tracks).toHaveLength(4);
    for (const track of metrics.tracks) {
      expect(track / metrics.equalTrack).toBeCloseTo(1, 2);
    }
    expect(metrics.nameWidth / metrics.defaultNameWidth).toBeCloseTo(expectedNameScale, 2);
  }
});


test("DataTable Notes mobile reuses the News reading record with a downward download arrow", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/iframe.html?id=components-data-table--mobile-notes&viewMode=story");
  await expectGingerLoaded(page);

  const table = page.getByRole("table");
  const row = table.locator("tbody tr").first();
  const primary = row.locator(".orlyata-data-table__notes-mobile-primary");
  const category = row.locator("td").nth(2);

  await expect(primary).toHaveText("Bolero / M.Ravel");
  await expect(primary).toBeVisible();
  await expect(row.locator(".orlyata-data-table__notes-desktop-value")).toBeHidden();
  await expect(category).toHaveText("Старший хор");
  await expect(table.getByRole("columnheader").nth(1)).toHaveText("Автор");
  await expect(table.getByRole("link", { name: "Скачать ноты «Bolero»" })).toBeVisible();

  const metrics = await row.evaluate((element) => {
    const primaryCell = element.querySelector("td:nth-child(1)");
    const categoryCell = element.querySelector("td:nth-child(3)");
    const arrowSvg = element.querySelector(".orlyata-data-table__row-arrow svg");
    if (!primaryCell || !categoryCell || !arrowSvg) {
      throw new Error("Notes mobile row must include primary text, choir category and download arrow.");
    }
    const primaryStyle = getComputedStyle(primaryCell);
    const categoryStyle = getComputedStyle(categoryCell);
    return {
      arrowRotate: getComputedStyle(arrowSvg).rotate,
      categoryBelowPrimary: categoryCell.getBoundingClientRect().top > primaryCell.getBoundingClientRect().top,
      primaryColor: primaryStyle.color,
      categoryColor: categoryStyle.color,
    };
  });

  expect(metrics.arrowRotate).toBe("0deg");
  expect(metrics.categoryBelowPrimary).toBe(true);
  expect(metrics.primaryColor).not.toBe(metrics.categoryColor);
});


test("DataTable teacher-achievements reuses the Home mobile reading record without Competition", async ({ page }) => {
  for (const width of [393, 320]) {
    await page.setViewportSize({ width, height: 1024 });
    await page.goto("/iframe.html?id=components-data-table--teacher-achievements&viewMode=story");
    await expectGingerLoaded(page);

    const row = page.getByRole("table").locator("tbody tr").first();
    const metrics = await row.evaluate((element) => {
      const cells = Array.from(element.querySelectorAll("td"));
      const year = cells[0];
      const achievement = cells[1];
      if (!year || !achievement) {
        throw new Error("Teacher achievements row must include Year and Achievement.");
      }

      const rowBox = element.getBoundingClientRect();
      const yearBox = year.getBoundingClientRect();
      const achievementBox = achievement.getBoundingClientRect();
      const header = element.closest("table")?.querySelector("thead");
      const rowStyle = getComputedStyle(element);

      return {
        achievementStart: achievementBox.left - rowBox.left,
        columns: rowStyle.gridTemplateColumns.split(" ").filter(Boolean).length,
        display: rowStyle.display,
        hasCompetition: cells.length > 2,
        headerHeight: header?.getBoundingClientRect().height ?? 0,
        inset: parseFloat(getComputedStyle(achievement).marginInlineStart),
        yearStart: yearBox.left - rowBox.left,
      };
    });

    expect(metrics.display).toBe("grid");
    expect(metrics.columns).toBe(2);
    expect(metrics.yearStart).toBeCloseTo(0, 1);
    expect(metrics.achievementStart).toBeGreaterThan(metrics.yearStart);
    expect(metrics.inset).toBeGreaterThan(0);
    expect(metrics.hasCompetition).toBe(false);
    expect(metrics.headerHeight).toBeLessThanOrEqual(1);
  }
});


test("DataTable teacher-achievements grows a multiline mobile row while preserving the Home padding", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 1024 });
  await page.goto("/iframe.html?id=components-data-table--teacher-achievements&viewMode=story");
  await expectGingerLoaded(page);

  const row = page.getByRole("table").locator("tbody tr").first();
  await row.locator("td").nth(1).evaluate((cell) => {
    cell.textContent = "Краткое достижение";
  });
  const baselineHeight = await row.evaluate((element) => element.getBoundingClientRect().height);
  await row.locator("td").nth(1).evaluate((cell) => {
    cell.textContent = "Многострочное достижение проверяет, что строка автоматически увеличивается по высоте и сохраняет нижний отступ перед разделительной линией. ".repeat(4);
  });

  const metrics = await row.evaluate((element) => {
    const achievement = element.querySelectorAll("td")[1];
    if (!achievement) {
      throw new Error("Teacher achievements row must include Achievement.");
    }

    const rowBox = element.getBoundingClientRect();
    const achievementBox = achievement.getBoundingClientRect();
    const style = getComputedStyle(element);

    return {
      height: rowBox.height,
      paddingBottom: parseFloat(style.paddingBottom),
      spaceBeforeBorder: rowBox.bottom - achievementBox.bottom - parseFloat(style.borderBottomWidth),
    };
  });

  expect(metrics.height).toBeGreaterThan(baselineHeight);
  expect(metrics.paddingBottom).toBeGreaterThan(0);
  expect(metrics.spaceBeforeBorder).toBeCloseTo(metrics.paddingBottom, 1);
});

test("DataTable teacher-achievements ends its final mobile record without an outer margin", async ({ page }) => {
  for (const width of [393, 320]) {
    await page.setViewportSize({ width, height: 1024 });
    await page.goto("/iframe.html?id=components-data-table--teacher-achievements&viewMode=story");
    await expectGingerLoaded(page);

    await expect(page.getByRole("table").locator("tbody tr").last()).toHaveCSS("margin-bottom", "0px");
  }
});
