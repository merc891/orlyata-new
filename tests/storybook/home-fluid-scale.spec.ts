import { expect, test } from "@playwright/test";

import { expectGingerLoaded } from "./visual";

test.setTimeout(120_000);

const desktopViewports = [
  { height: 960, scale: 1280 / 1920, width: 1280 },
  { height: 900, scale: 1440 / 1920, width: 1440 },
  { height: 1000, scale: 1600 / 1920, width: 1600 },
  { height: 1080, scale: 1, width: 1920 },
  { height: 1260, scale: 2240 / 1920, width: 2240 },
  { height: 1440, scale: 2560 / 1920, width: 2560 },
] as const;

interface HomeMetrics {
  advantagePadding: number;
  advantageRatio: number;
  applicationRatio: number;
  displayFontSize: number;
  footerRatio: number;
  historyRatio: number;
  mediaBigRatio: number;
  mediaSmallRatio: number;
  newsPadding: number;
  newsGridGap: number;
  newsGridInset: number;
  newsPanelWidth: number;
  newsHeight: number;
  newsRatio: number;
  newsTitleFontSize: number;
  newsWidth: number;
  overflow: number;
  sidebarWidth: number;
}

async function openHome(page: import("@playwright/test").Page): Promise<void> {
  await page.goto("/iframe.html?id=pages-home--desktop-preview&viewMode=story");
  await expectGingerLoaded(page);
  await expect(page.locator(".orlyata-home")).toBeVisible();
}

async function readMetrics(
  page: import("@playwright/test").Page,
): Promise<HomeMetrics> {
  return page.locator(".orlyata-home").evaluate((home) => {
    const box = (selector: string): DOMRect => {
      const value = home
        .querySelector<HTMLElement>(selector)
        ?.getBoundingClientRect();
      if (value === undefined) {
        throw new Error("Missing HomeDesktopPreview selector: " + selector);
      }
      return value;
    };
    const number = (
      selector: string,
      property: "columnGap" | "fontSize" | "paddingLeft" | "paddingTop",
    ): number => {
      const value = home.querySelector<HTMLElement>(selector);
      if (value === null) {
        throw new Error("Missing HomeDesktopPreview selector: " + selector);
      }
      return Number.parseFloat(getComputedStyle(value)[property]);
    };
    const ratio = (selector: string): number => {
      const value = box(selector);
      return value.width / value.height;
    };

    return {
      advantagePadding: number(".orlyata-advantage", "paddingTop"),
      advantageRatio: ratio(".orlyata-advantage"),
      applicationRatio: ratio(".orlyata-home__application-surface"),
      displayFontSize: number(".orlyata-home__hero-title", "fontSize"),
      footerRatio: ratio(".orlyata-footer"),
      historyRatio: ratio(".orlyata-home__history"),
      mediaBigHeight: box(".orlyata-media-card--big").height,
      mediaBigRatio: ratio(".orlyata-media-card--big"),
      mediaSmallHeight: box(".orlyata-media-card--small").height,
      mediaSmallRatio: ratio(".orlyata-media-card--small"),
      newsPadding: number(
        ".orlyata-home__news-grid .orlyata-news-card",
        "paddingLeft",
      ),
      newsGridGap: number(".orlyata-home__news-grid", "columnGap"),
      newsGridInset:
        box(".orlyata-home__news-grid").left -
        box(".orlyata-home__hero-panel--news").left,
      newsPanelWidth: box(".orlyata-home__hero-panel--news").width,
      newsHeight: box(".orlyata-home__news-grid .orlyata-news-card").height,
      newsRatio: ratio(".orlyata-home__news-grid .orlyata-news-card"),
      newsTitleFontSize: number(
        ".orlyata-home__news-grid .orlyata-news-card__title",
        "fontSize",
      ),
      newsWidth: box(".orlyata-home__news-grid .orlyata-news-card").width,
      overflow:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
      sidebarWidth: box(".orlyata-sidebar").width,
    };
  });
}

test("HomeDesktopPreview renders the production composition without horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await openHome(page);

  await expect(
    page.getByRole("heading", { level: 1, name: "Хоровая капелла мальчиков" }),
  ).toBeVisible();
  await expect(
    page.locator(".orlyata-home__news-grid .orlyata-news-card"),
  ).toHaveCount(2);
  await expect(
    page.locator(".orlyata-home__facts .orlyata-advantage"),
  ).toHaveCount(4);
  await expect(
    page.locator(".orlyata-home__media-grid .orlyata-media-card"),
  ).toHaveCount(3);
  await expect(
    page.locator(".orlyata-home__application .orlyata-application-form"),
  ).toHaveCount(1);
  await expect(
    page.locator(".orlyata-home__achievements .orlyata-data-table"),
  ).toHaveCount(1);
  await expect(page.locator(".orlyata-footer")).toHaveCount(1);
  expect((await readMetrics(page)).overflow).toBeLessThanOrEqual(1);
});

test("Home mobile 393px applies the approved MediaCard, History and application spacing", async ({
  page,
}) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await openHome(page);

  const layout = await page.locator(".orlyata-home").evaluate((home) => {
    const element = (selector: string): HTMLElement => {
      const value = home.querySelector<HTMLElement>(selector);
      if (value === null)
        throw new Error("Missing Home mobile selector: " + selector);
      return value;
    };
    const box = (selector: string): DOMRect =>
      element(selector).getBoundingClientRect();
    const style = (selector: string): CSSStyleDeclaration =>
      getComputedStyle(element(selector));
    const lead = box(".orlyata-home__history-lead");
    const teachers = box(".orlyata-home__history-teachers");
    const copy = box(".orlyata-home__history-copy");
    const historyGrid = box(".orlyata-home__history-grid");
    const teacherPhoto = box(".orlyata-home__history-photo");
    const teacherLink = box(".orlyata-home__history-teachers-link");
    const teacherIcon = box(".orlyata-home__history-teachers-link img");

    return {
      applicationInlinePadding: Number.parseFloat(
        style(".orlyata-home__application-surface").paddingLeft,
      ),
      factInsets: Array.from(
        home.querySelectorAll<HTMLElement>(
          ".orlyata-home__facts .orlyata-advantage",
        ),
      ).map((fact) => ({
        accentRight: Number.parseFloat(
          getComputedStyle(fact, "::before").right,
        ),
        valueLeft: Number.parseFloat(getComputedStyle(fact).paddingLeft),
      })),
      bodyLineHeight: Number.parseFloat(
        style(".orlyata-home__history-copy").lineHeight,
      ),
      headingFontSize: Number.parseFloat(
        style(".orlyata-home__application-copy h2").fontSize,
      ),
      leadMarginTop: Number.parseFloat(
        style(".orlyata-home__history-lead").marginTop,
      ),
      leadToTeachers: teachers.top - lead.bottom,
      historyGridWidth: historyGrid.width,
      mediaContentGap: Number.parseFloat(
        style(".orlyata-media-card__content").gap,
      ),
      mediaPlayHeight: box(
        ".orlyata-media-card__play .orlyata-button__icon--play",
      ).height,
      mediaPlayWidth: box(
        ".orlyata-media-card__play .orlyata-button__icon--play",
      ).width,
      teachersToCopy: copy.top - teachers.bottom,
      teacherIconHeight: teacherIcon.height,
      teacherIconWidth: teacherIcon.width,
      teacherLinkHeight: teacherLink.height,
      teacherLinkWidth: teacherLink.width,
      teacherPhotoHeight: teacherPhoto.height,
      teacherPhotoWidth: teacherPhoto.width,
      copyWidth: copy.width,
    };
  });

  expect(layout.mediaContentGap).toBeCloseTo(4, 1);
  expect(layout.mediaPlayWidth).toBeCloseTo(12, 1);
  expect(layout.mediaPlayHeight).toBeCloseTo(12, 1);
  expect(layout.bodyLineHeight).toBeCloseTo(16 * 1.3, 1);
  expect(layout.leadMarginTop).toBe(0);
  expect(layout.leadToTeachers).toBeCloseTo(16, 1);
  expect(layout.teachersToCopy).toBeCloseTo(24, 1);
  expect(layout.copyWidth).toBeCloseTo(layout.historyGridWidth, 1);
  expect(layout.copyWidth).toBeCloseTo(369, 1);
  expect(layout.teacherPhotoWidth).toBeCloseTo(48, 1);
  expect(layout.teacherPhotoHeight).toBeCloseTo(48, 1);
  expect(layout.teacherLinkWidth).toBeCloseTo(48, 1);
  expect(layout.teacherLinkHeight).toBeCloseTo(48, 1);
  expect(layout.headingFontSize).toBeCloseTo(32, 1);
  expect(layout.applicationInlinePadding).toBeCloseTo(12, 1);
  for (const fact of layout.factInsets) {
    expect(fact.accentRight).toBeCloseTo(fact.valueLeft, 1);
    expect(fact.accentRight).toBeCloseTo(12, 1);
  }
});

test("Home mobile aligns each fact accent with its value inset", async ({
  page,
}) => {
  await openHome(page);

  for (const width of [320, 393, 767]) {
    await page.setViewportSize({ width, height: 852 });
    const factInsets = await page
      .locator(".orlyata-home__facts .orlyata-advantage")
      .evaluateAll((facts) =>
        facts.map((fact) => ({
          accentRight: Number.parseFloat(
            getComputedStyle(fact, "::before").right,
          ),
          valueLeft: Number.parseFloat(getComputedStyle(fact).paddingLeft),
        })),
      );

    expect(factInsets).toHaveLength(4);
    for (const fact of factInsets) {
      expect(fact.accentRight).toBeCloseTo(fact.valueLeft, 1);
    }
  }
});

test("Home mobile CTA surface and Footer are full-bleed", async ({ page }) => {
  await openHome(page);

  for (const width of [320, 393, 767]) {
    await page.setViewportSize({ width, height: 852 });
    const [surface, footer] = await Promise.all([
      page.locator(".orlyata-home__application-surface").boundingBox(),
      page.locator(".orlyata-footer").boundingBox(),
    ]);

    for (const box of [surface, footer]) {
      expect(box === null ? 0 : box.x).toBeCloseTo(0, 1);
      expect(box === null ? 0 : box.width).toBeCloseTo(width, 1);
    }
  }
});

test("Home desktop shell, type and component internals follow one scale coefficient", async ({
  page,
}) => {
  await openHome(page);
  await page.waitForTimeout(1_100);
  const measurements = new Map<number, HomeMetrics>();

  for (const viewport of desktopViewports) {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    measurements.set(viewport.width, await readMetrics(page));
  }

  const reference = measurements.get(1920);
  expect(reference).toBeDefined();
  if (reference === undefined) {
    return;
  }

  expect(reference.newsGridInset).toBeCloseTo(24, 1);
  expect(reference.newsWidth).toBeCloseTo(
    (reference.newsPanelWidth - (2 * reference.newsGridInset) - reference.newsGridGap) / 2,
    1,
  );
  expect(reference.newsHeight / reference.newsWidth).toBeCloseTo(270 / 365, 3);

  for (const viewport of desktopViewports) {
    const current = measurements.get(viewport.width);
    expect(current).toBeDefined();
    if (current === undefined) {
      continue;
    }
    expect(current.sidebarWidth / reference.sidebarWidth).toBeCloseTo(
      viewport.scale,
      3,
    );
    expect(current.displayFontSize / reference.displayFontSize).toBeCloseTo(
      viewport.scale,
      3,
    );
    expect(current.newsTitleFontSize / reference.newsTitleFontSize).toBeCloseTo(
      viewport.scale,
      3,
    );
    expect(current.newsPadding / reference.newsPadding).toBeCloseTo(
      viewport.scale,
      3,
    );
    expect(current.newsGridInset / reference.newsGridInset).toBeCloseTo(
      viewport.scale,
      3,
    );
    expect(current.advantagePadding / reference.advantagePadding).toBeCloseTo(
      viewport.scale,
      3,
    );
  }
});

test("Home page preserves component-owned aspect ratios across desktop", async ({
  page,
}) => {
  await openHome(page);

  for (const viewport of desktopViewports) {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    const metrics = await readMetrics(page);
    expect(metrics.newsRatio).toBeCloseTo(365 / 270, 3);
    expect(metrics.advantageRatio).toBeCloseTo(388 / 170, 3);
    expect(metrics.mediaBigRatio).toBeCloseTo(797 / 540, 3);
    expect(metrics.mediaSmallRatio).toBeCloseTo(390 / 540, 3);
  }
});

test("Home History, application CTA and Footer preserve their 1920 shape", async ({
  page,
}) => {
  await openHome(page);
  const measurements = new Map<number, HomeMetrics>();

  for (const viewport of desktopViewports) {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    measurements.set(viewport.width, await readMetrics(page));
  }

  const reference = measurements.get(1920);
  expect(reference).toBeDefined();
  if (reference === undefined) {
    return;
  }

  for (const viewport of desktopViewports) {
    const current = measurements.get(viewport.width);
    expect(current).toBeDefined();
    if (current === undefined) {
      continue;
    }
    expect(current.historyRatio).toBeCloseTo(reference.historyRatio, 2);
    expect(current.applicationRatio).toBeCloseTo(reference.applicationRatio, 2);
    expect(current.footerRatio).toBeCloseTo(reference.footerRatio, 2);
    expect(current.overflow).toBeLessThanOrEqual(1);
  }
});

const homeVisualViewports = [
  { height: 960, name: "1280", width: 1280 },
  { height: 1080, name: "1920", width: 1920 },
  { height: 1440, name: "2560", width: 2560 },
] as const;

async function stabilizeHomeVisual(
  page: import("@playwright/test").Page,
): Promise<void> {
  await page.waitForFunction(() =>
    [...document.images].every((image) => image.complete),
  );
  await page.locator("video").evaluateAll((nodes) => {
    const videos = nodes as HTMLVideoElement[];
    videos.forEach((video) => {
      video.pause();
      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
        video.currentTime = 0;
      }
    });
  });
}

for (const viewport of homeVisualViewports) {
  test("Home desktop visual " + viewport.name, async ({ page }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    await openHome(page);
    await stabilizeHomeVisual(page);

    await expect(page).toHaveScreenshot(
      "pages-home--desktop-preview-" + viewport.name + ".png",
      {
        fullPage: true,
        timeout: 45_000,
      },
    );
  });
}

for (const viewport of [
  { height: 1024, name: "1279", width: 1279 },
  { height: 1024, name: "768", width: 768 },
] as const) {
  test("Home tablet visual " + viewport.name, async ({ page }) => {
    await page.setViewportSize({
      width: viewport.width,
      height: viewport.height,
    });
    await openHome(page);
    await stabilizeHomeVisual(page);

    await expect(page).toHaveScreenshot(
      "pages-home--tablet-preview-" + viewport.name + ".png",
      {
        fullPage: true,
        timeout: 45_000,
      },
    );
  });
}

test("Home preserves owned card geometry and readable metadata across tablet and mobile", async ({
  page,
}) => {
  for (const width of [1279, 1024, 768, 767, 480, 320]) {
    await page.setViewportSize({ width, height: 1024 });
    await openHome(page);
    const layout = await page.locator(".orlyata-home").evaluate((home) => {
      const box = (selector: string): DOMRect => {
        const element = home.querySelector<HTMLElement>(selector);
        if (element === null) {
          throw new Error("Missing Home responsive selector: " + selector);
        }
        return element.getBoundingClientRect();
      };
      const element = (selector: string): HTMLElement => {
        const value = home.querySelector<HTMLElement>(selector);
        if (value === null) {
          throw new Error("Missing Home responsive selector: " + selector);
        }
        return value;
      };
      const style = (
        selector: string,
        property: "aspectRatio" | "fontSize",
      ): string => {
        return getComputedStyle(element(selector))[property];
      };
      const ratio = (selector: string): number => {
        const value = box(selector);
        return value.width / value.height;
      };

      return {
        footer: getComputedStyle(element(".orlyata-footer")).display,
        grid: getComputedStyle(element(".orlyata-home__content-grid"))
          .gridTemplateColumns,
        newsAspectRatio: style(
          ".orlyata-home__news-grid .orlyata-news-card",
          "aspectRatio",
        ),
        newsBadgeFontSize: Number.parseFloat(
          style(".orlyata-home__news-grid .orlyata-badge", "fontSize"),
        ),
        newsRatio: ratio(".orlyata-home__news-grid .orlyata-news-card"),
        newsPosition: getComputedStyle(element(".orlyata-home__news-grid"))
          .position,
        mediaBigHeight: box(".orlyata-media-card--big").height,
        mediaBigRatio: ratio(".orlyata-media-card--big"),
        mediaSmallHeight: box(".orlyata-media-card--small").height,
        mediaSmallRatio: ratio(".orlyata-media-card--small"),
        overflow:
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
        sidebar: getComputedStyle(element(".orlyata-sidebar")).display,
      };
    });

    expect(layout.overflow).toBeLessThanOrEqual(1);
    expect(layout.footer).not.toBe("none");
    expect(layout.sidebar).not.toBe("none");
    // Desktop owns the NewsCard ratio; mobile and tablet use approved Home compositions.
    expect(layout.mediaBigRatio).toBeCloseTo(797 / 540, 3);
    expect(layout.mediaSmallRatio).toBeCloseTo(390 / 540, 3);
    if (width <= 767) {
      expect(layout.newsBadgeFontSize).toBeGreaterThanOrEqual(14);
      expect(layout.grid).not.toContain(" ");
      expect(layout.newsPosition).toBe("relative");
    } else {
      expect(layout.grid).toContain(" ");
    }
  }
});

test("Home mobile MediaCards defer their geometry to the shared component", async ({
  page,
}) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await openHome(page);

  const cards = page.locator(".orlyata-home__media-grid .orlyata-media-card");
  await expect(cards).toHaveCount(3);
  await expect(cards.nth(0)).toHaveCSS("aspect-ratio", "auto");
  await expect(cards.nth(1)).toHaveCSS("aspect-ratio", "auto");
  await expect(cards.nth(2)).toHaveCSS("aspect-ratio", "auto");

  for (const card of await cards.all()) {
    const image = card.locator(".orlyata-media-card__image-wrap");
    const title = card.locator(".orlyata-media-card__title");
    const meta = card.locator(".orlyata-media-card__meta");
    const [cardBox, imageBox, titleBox, metaBox] = await Promise.all([
      card.boundingBox(),
      image.boundingBox(),
      title.boundingBox(),
      meta.boundingBox(),
    ]);
    expect(
      titleBox === null || imageBox === null
        ? undefined
        : titleBox.y - imageBox.y - imageBox.height,
    ).toBeCloseTo(8, 1);
    expect(
      metaBox === null || titleBox === null
        ? undefined
        : metaBox.y - titleBox.y - titleBox.height,
    ).toBeCloseTo(4, 1);
    expect(
      metaBox === null || cardBox === null
        ? undefined
        : metaBox.y + metaBox.height,
    ).toBeCloseTo(cardBox.y + cardBox.height, 1);
  }
});

test("Home tablet achievements aligns Competition with global editorial column 3", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1279, height: 900 });
  await openHome(page);

  const table = page.locator(".orlyata-home__achievements .orlyata-data-table--achievements");
  const headers = table.getByRole("columnheader");
  const [tableBox, competitionBox, gridGap] = await Promise.all([
    table.boundingBox(),
    headers.nth(2).boundingBox(),
    table.evaluate((element) => Number.parseFloat(getComputedStyle(element.querySelector("thead tr") as Element).columnGap)),
  ]);

  expect(competitionBox?.x).toBeCloseTo((tableBox?.x ?? 0) + (tableBox?.width ?? 0) * 0.5 + gridGap / 2, 0);
});

test("Home mobile achievements follow the Figma 58095:5033 record layout", async ({
  page,
}) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await openHome(page);

  const row = page
    .locator(
      ".orlyata-home__achievements .orlyata-data-table--achievements tbody tr",
    )
    .first();
  const cells = row.locator("td");
  const [rowBox, yearBox, achievementBox, competitionBox] =
    await Promise.all([
      row.boundingBox(),
      cells.nth(0).boundingBox(),
      cells.nth(1).boundingBox(),
      cells.nth(2).boundingBox(),
    ]);

  await expect(row).toHaveCSS("display", "grid");
  expect(
    yearBox === null || achievementBox === null ? undefined : yearBox.y,
  ).toBeCloseTo(achievementBox.y, 1);
  expect(
    yearBox === null || achievementBox === null
      ? undefined
      : achievementBox.x - yearBox.x - yearBox.width,
  ).toBeCloseTo(32, 1);
  expect(
    rowBox === null || competitionBox === null
      ? undefined
      : competitionBox.x + competitionBox.width,
  ).toBeCloseTo(rowBox.x + rowBox.width, 1);
  expect(
    competitionBox === null || yearBox === null
      ? undefined
      : competitionBox.y - yearBox.y - yearBox.height,
  ).toBeCloseTo(16, 1);
  await expect(row).toHaveCSS("padding-top", "0px");
  await expect(row).toHaveCSS("margin-bottom", "12px");
  await expect(cells.nth(0)).toHaveCSS("font-size", "16px");
  await expect(cells.nth(0)).toHaveCSS("font-weight", "400");
  await expect(cells.nth(0)).toHaveCSS("line-height", "20.8px");
  await expect(cells.nth(0)).toHaveCSS("color", "rgb(24, 23, 23)");
  await expect(cells.nth(1)).toHaveCSS("font-size", "16px");
  await expect(cells.nth(1)).toHaveText("Лауреат I степени / Старший");
  await expect(cells.nth(1)).toHaveCSS("font-weight", "400");
  await expect(cells.nth(1)).toHaveCSS("color", "rgb(24, 23, 23)");
  await expect(cells.nth(2)).toHaveCSS("font-size", "16px");
  await expect(cells.nth(2)).toHaveCSS("font-weight", "400");
  await expect(cells.nth(2)).toHaveCSS("color", "rgb(113, 113, 122)");
});

test("Home mobile History hides category badges and keeps copy before teachers", async ({
  page,
}) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await openHome(page);

  const history = page.locator(".orlyata-home__history");
  const tags = history.locator(".orlyata-home__history-tags");
  const lead = history.locator(".orlyata-home__history-lead");
  const copy = history.locator(".orlyata-home__history-copy");
  const teachers = history.locator(".orlyata-home__history-teachers");
  const [leadBox, copyBox, teachersBox] = await Promise.all([
    lead.boundingBox(),
    copy.boundingBox(),
    teachers.boundingBox(),
  ]);

  await expect(tags).toHaveCSS("display", "none");
  await expect(copy).toBeVisible();
  await expect(teachers).toBeVisible();
  expect(
    copyBox === null || leadBox === null
      ? undefined
      : copyBox.y - leadBox.y - leadBox.height,
  ).toBeCloseTo(24, 1);
  expect(
    copyBox === null || teachersBox === null ? undefined : teachersBox.y,
  ).toBeGreaterThanOrEqual(copyBox.y + copyBox.height);
});

test("Home mobile History uses Heading 3 and a full-width inline-start copy block", async ({
  page,
}) => {
  for (const width of [320, 393, 767]) {
    await page.setViewportSize({ width, height: 852 });
    await openHome(page);

    const history = await page
      .locator(".orlyata-home__history")
      .evaluate((element) => {
        const lead = element.querySelector<HTMLElement>(
          ".orlyata-home__history-lead",
        );
        const copy = element.querySelector<HTMLElement>(
          ".orlyata-home__history-copy",
        );
        if (lead === null || copy === null)
          throw new Error("Missing Home History copy");
        const leadStyle = getComputedStyle(lead);
        const copyStyle = getComputedStyle(copy);
        const box = copy.getBoundingClientRect();
        return {
          copyLeft: box.left,
          gridWidth: element.querySelector<HTMLElement>(".orlyata-home__history-grid")?.getBoundingClientRect().width,
          copyWidth: box.width,
          fontSize: Number.parseFloat(leadStyle.fontSize),
          letterSpacing: Number.parseFloat(leadStyle.letterSpacing),
            textAlign: copyStyle.textAlign,
        };
      });

    const scale = width / 393;
    expect(history.fontSize).toBeCloseTo(20 * scale, 1);
    expect(history.letterSpacing).toBeCloseTo(-1 * scale, 1);
    expect(history.copyWidth).toBeCloseTo(history.gridWidth ?? 0, 1);
    expect(history.textAlign).toBe("start");
  }
});

test("Home History retains Lead markup on desktop and tablet", async ({ page }) => {
  for (const width of [1920, 1279]) {
    await page.setViewportSize({ width, height: 1080 });
    await openHome(page);
    await expect(page.locator(".orlyata-home__history-lead")).toHaveClass(/type-lead/);
    await expect(page.locator(".orlyata-home__history-lead")).not.toHaveClass(/type-heading-3/);
  }
});

test("Home mobile uses the approved news, facts, and section spacing", async ({
  page,
}) => {
  await page.setViewportSize({ width: 393, height: 1200 });
  await openHome(page);

  const spacing = await page.locator(".orlyata-home").evaluate((home) => {
    const element = (selector: string): HTMLElement => {
      const value = home.querySelector<HTMLElement>(selector);
      if (value === null) {
        throw new Error("Missing Home spacing selector: " + selector);
      }
      return value;
    };
    const pixels = (
      selector: string,
      property: "height" | "marginTop" | "gap" | "paddingLeft" | "paddingRight",
    ): number =>
      Number.parseFloat(getComputedStyle(element(selector))[property]);

    return {
      applicationPaddingLeft: pixels(
        ".orlyata-home__application-surface",
        "paddingLeft",
      ),
      applicationPaddingRight: pixels(
        ".orlyata-home__application-surface",
        "paddingRight",
      ),
      achievementsOffset: pixels(".orlyata-home__achievements", "marginTop"),
      applicationOffset: pixels(".orlyata-home__application", "marginTop"),
      footerOffset: pixels(".orlyata-footer", "marginTop"),
      factsGap: pixels(".orlyata-home__facts", "gap"),
      historyOffset: pixels(".orlyata-home__history", "marginTop"),
      mediaOffset: pixels(".orlyata-home__media-section", "marginTop"),
      newsGap: pixels(".orlyata-home__news-grid", "gap"),
      newsHeight: pixels(".orlyata-home__hero-panel--news", "height"),
    };
  });

  expect(spacing.newsHeight).toBeCloseTo(604, 1);
  expect(spacing.newsGap).toBeCloseTo(12, 1);
  expect(spacing.factsGap).toBeCloseTo(12, 1);
  expect(spacing.mediaOffset).toBeCloseTo(96, 1);
  expect(spacing.historyOffset).toBeCloseTo(96, 1);
  expect(spacing.applicationOffset).toBeCloseTo(72, 1);
  expect(spacing.footerOffset).toBeCloseTo(96, 1);
  expect(spacing.achievementsOffset).toBeCloseTo(96, 1);
  expect(spacing.applicationPaddingLeft).toBeCloseTo(12, 1);
  expect(spacing.applicationPaddingRight).toBeCloseTo(12, 1);
});

test("Home mobile places the terminal CTA gap before Footer", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 1200 });
  await openHome(page);

  const spacing = await page.locator(".orlyata-home").evaluate((home) => {
    const readMargin = (selector: string): number => {
      const element = home.querySelector<HTMLElement>(selector);
      if (element === null) {
        throw new Error("Missing Home terminal spacing selector: " + selector);
      }

      return Number.parseFloat(getComputedStyle(element).marginTop);
    };

    return {
      application: readMargin(".orlyata-home__application"),
      footer: readMargin(".orlyata-footer"),
    };
  });

  expect(spacing.application).toBeCloseTo(72, 0);
  expect(spacing.footer).toBeCloseTo(96, 0);
});

test("Home mobile News uses the approved 520px panel and 200px cards at the 393px reference", async ({
  page,
}) => {
  await page.setViewportSize({ width: 393, height: 1200 });
  await openHome(page);

  const metrics = await page.locator(".orlyata-home").evaluate((home) => {
    const box = (selector: string): DOMRect => {
      const element = home.querySelector<HTMLElement>(selector);
      if (element === null) {
        throw new Error("Missing Home mobile News selector: " + selector);
      }
      return element.getBoundingClientRect();
    };

    return {
      panelHeight: box(".orlyata-home__hero-panel--news").height,
      cardHeight: box(".orlyata-home__news-grid .orlyata-news-card").height,
      badgeHeight: box(".orlyata-home__news-grid .orlyata-badge").height,
      iconContainer: box(".orlyata-home__news-grid .orlyata-badge--icon").width,
      iconGlyph: box(".orlyata-home__news-grid .orlyata-badge__icon").width,
    };
  });

  expect(metrics.panelHeight).toBeCloseTo(520, 0);
  expect(metrics.cardHeight).toBeGreaterThan(199);
  expect(metrics.cardHeight).toBeLessThan(201);
  expect(metrics.badgeHeight).toBeCloseTo(36, 0);
  expect(metrics.iconContainer).toBeCloseTo(36, 0);
  expect(metrics.iconGlyph).toBeCloseTo(16, 0);
});

test("Home mobile first screen follows one S_m coefficient from the 393px reference", async ({
  page,
}) => {
  const reference = {
    displayTracking: -1,
    heading1Tracking: -3,
    heading2Tracking: -1.5,
    fact: 140,
    gap: 12,
    heading3Tracking: -1,
    leadTracking: -1,
    headerHeroGap: 12,
    hero: 520,
    icon: 36,
    bodyTracking: -0.5,
    mediaOffset: 96,
    playTop: 12,
    playIcon: 16,
    sectionLinkIcon: 24,
    news: 520,
    newsCard: 200,
    space12: 12,
    newsBottomInset: 16,
    factsOffset: 16,
    titleBottom: 24,
  };
  const viewports = [320, 393, 767];

  for (const width of viewports) {
    await page.setViewportSize({ width, height: 1200 });
    await openHome(page);
    await page.waitForTimeout(1000);
    const scale = width / 393;

    const layout = await page.locator(".orlyata-home").evaluate((home) => {
      const element = (selector: string): HTMLElement => {
        const value = home.querySelector<HTMLElement>(selector);
        if (value === null) {
          throw new Error("Missing Home mobile scaling selector: " + selector);
        }
        return value;
      };
      const pixels = (
        selector: string,
        property:
          | "height"
          | "width"
          | "paddingLeft"
          | "marginTop"
          | "gap"
          | "bottom"
          | "left"
          | "top",
      ): number => {
        return Number.parseFloat(getComputedStyle(element(selector))[property]);
      };

      const tracking = (token: string): number => {
        const probe = document.createElement("span");
        probe.style.letterSpacing = "var(" + token + ")";
        home.append(probe);
        const value = Number.parseFloat(getComputedStyle(probe).letterSpacing);
        probe.remove();
        return value;
      };

      return {
        bodyTracking: tracking("--letter-spacing-body"),
        displayTracking: tracking("--letter-spacing-display"),
        heading1Tracking: tracking("--letter-spacing-heading-1"),
        heading2Tracking: tracking("--letter-spacing-heading-2"),
        heading3Tracking: tracking("--letter-spacing-heading-3"),
        leadTracking: tracking("--letter-spacing-lead"),
        fact: pixels(".orlyata-home__facts .orlyata-advantage", "height"),
        factsGap: pixels(".orlyata-home__facts", "gap"),
        factsOffset: pixels(".orlyata-home__facts", "marginTop"),
        headerHeroGap:
          element(".orlyata-home__hero-panel--capella").getBoundingClientRect()
            .top -
          element(".orlyata-sidebar__logo-link").getBoundingClientRect().bottom,
        hero: pixels(".orlyata-home__hero-panel--capella", "height"),
        icon: pixels(
          ".orlyata-home__news-grid .orlyata-news-card__meta .orlyata-badge--icon",
          "width",
        ),
        menuIcon: pixels(
          ".orlyata-sidebar__menu-toggle .orlyata-button__menu-icon",
          "width",
        ),
        playIcon: pixels(
          ".orlyata-home__hero-play .orlyata-button__icon--play",
          "width",
        ),
        mediaOffset: pixels(".orlyata-home__media-section", "marginTop"),
        playLeft: pixels(".orlyata-home__hero-play", "left"),
        playTop: pixels(".orlyata-home__hero-play", "top"),
        sectionLinkIcon: pixels(
          ".orlyata-home__news-head .orlyata-text-link__icon-track",
          "width",
        ),
        menuSize: pixels(".orlyata-sidebar__menu-toggle", "width"),
        menuStroke: Number.parseFloat(
          getComputedStyle(
            element(".orlyata-sidebar__menu-toggle .orlyata-button__menu-icon"),
          ).strokeWidth,
        ),
        news: pixels(".orlyata-home__hero-panel--news", "height"),
        newsCard: pixels(
          ".orlyata-home__news-grid .orlyata-news-card",
          "height",
        ),
        newsBackgroundInsetLeft:
          element(".orlyata-home__news-background").getBoundingClientRect()
            .left -
          element(".orlyata-home__hero-panel--news").getBoundingClientRect()
            .left,
        newsBackgroundInsetRight:
          element(".orlyata-home__hero-panel--news").getBoundingClientRect()
            .right -
          element(".orlyata-home__news-background").getBoundingClientRect()
            .right,
        newsGap: pixels(".orlyata-home__news-grid", "gap"),
        newsOuterInsetLeft:
          element(
            ".orlyata-home__news-grid .orlyata-news-card",
          ).getBoundingClientRect().left -
          element(".orlyata-home__hero-panel--news").getBoundingClientRect()
            .left,
        newsOuterInsetRight:
          element(".orlyata-home__hero-panel--news").getBoundingClientRect()
            .right -
          element(
            ".orlyata-home__news-grid .orlyata-news-card",
          ).getBoundingClientRect().right,
        newsBottomInset:
          element(".orlyata-home__hero-panel--news").getBoundingClientRect()
            .bottom -
          element(
            ".orlyata-home__news-grid .orlyata-news-card:last-child",
          ).getBoundingClientRect().bottom,
        newsPaginationDisplay: getComputedStyle(
          element(".orlyata-home__news-pagination"),
        ).display,
        overflow:
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
        titleBottom: pixels(".orlyata-home__hero-title", "bottom"),
        titleLeft: pixels(".orlyata-home__hero-title", "left"),
        newsHeadingLeft:
          element(".orlyata-home__news-head h2").getBoundingClientRect().left -
          element(".orlyata-home__hero-panel--news").getBoundingClientRect()
            .left,
        newsArrowRight:
          element(".orlyata-home__hero-panel--news").getBoundingClientRect()
            .right -
          element(
            ".orlyata-home__news-head .orlyata-text-link",
          ).getBoundingClientRect().right,
      };
    });

    expect(layout.bodyTracking).toBeCloseTo(reference.bodyTracking * scale, 1);
    expect(layout.displayTracking).toBeCloseTo(
      reference.displayTracking * scale,
      1,
    );
    expect(layout.heading1Tracking).toBeCloseTo(
      reference.heading1Tracking * scale,
      1,
    );
    expect(layout.heading2Tracking).toBeCloseTo(
      reference.heading2Tracking * scale,
      1,
    );
    expect(layout.heading3Tracking).toBeCloseTo(
      reference.heading3Tracking * scale,
      1,
    );
    expect(layout.leadTracking).toBeCloseTo(reference.leadTracking * scale, 1);
    if (width === 393) {
      expect(layout.headerHeroGap).toBeCloseTo(reference.headerHeroGap, 0);
    } else {
      expect(layout.headerHeroGap).toBeGreaterThan(0);
    }
    expect(layout.hero).toBeCloseTo(reference.hero * scale, 0);
    expect(layout.titleLeft).toBeCloseTo(reference.space12 * scale, 0);
    expect(layout.playLeft).toBeCloseTo(reference.space12 * scale, 0);
    expect(layout.playTop).toBeCloseTo(reference.playTop * scale, 0);
    expect(layout.sectionLinkIcon).toBeCloseTo(reference.sectionLinkIcon, 0);
    expect(layout.menuIcon).toBeCloseTo(reference.sectionLinkIcon * scale, 0);
    expect(layout.playIcon).toBeCloseTo(reference.playIcon * scale, 0);
    expect(layout.titleBottom).toBeCloseTo(reference.titleBottom * scale, 0);
    expect(layout.newsHeadingLeft).toBeCloseTo(reference.space12 * scale, 0);
    expect(layout.newsArrowRight).toBeCloseTo(reference.space12 * scale, 0);
    expect(layout.news).toBeCloseTo(reference.news * scale, 0);
    expect(layout.newsCard).toBeCloseTo(reference.newsCard * scale, 0);
    expect(layout.newsBackgroundInsetLeft).toBeCloseTo(0, 0);
    expect(layout.newsBackgroundInsetRight).toBeCloseTo(0, 0);
    expect(layout.newsOuterInsetLeft).toBeCloseTo(reference.space12 * scale, 0);
    expect(layout.newsOuterInsetRight).toBeCloseTo(
      reference.space12 * scale,
      0,
    );
    expect(layout.newsBottomInset).toBeCloseTo(
      reference.newsBottomInset * scale,
      0,
    );
    expect(layout.newsPaginationDisplay).toBe("none");
    expect(layout.newsGap).toBeCloseTo(reference.gap * scale, 0);
    expect(layout.icon).toBeCloseTo(reference.icon * scale, 0);
    expect(layout.factsOffset).toBeCloseTo(reference.factsOffset * scale, 0);
    expect(layout.factsGap).toBeCloseTo(reference.gap * scale, 0);
    expect(layout.fact).toBeCloseTo(reference.fact * scale, 0);
    expect(layout.mediaOffset).toBeCloseTo(reference.mediaOffset * scale, 0);
    expect(layout.menuSize).toBeCloseTo(48, 0);
    expect(layout.menuStroke).toBeCloseTo(2 * scale, 0);
    expect(layout.overflow).toBeLessThanOrEqual(1);
  }
});

test("Home mobile Hero preview resumes muted inline playback after pageshow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await openHome(page);

  const state = await page
    .locator(".orlyata-home__hero-preview")
    .evaluate(async (node) => {
      const video = node as HTMLVideoElement;

      video.pause();
      window.dispatchEvent(
        new PageTransitionEvent("pageshow", { persisted: true }),
      );
      await new Promise((resolve) => window.setTimeout(resolve, 300));

      return {
        defaultMuted: video.defaultMuted,
        muted: video.muted,
        source: video.currentSrc,
        paused: video.paused,
        playsInline: video.playsInline,
      };
    });

  expect(state.defaultMuted).toBe(true);
  expect(state.muted).toBe(true);
  expect(state.playsInline).toBe(true);
  expect(state.source).toContain("/videos/home/hero-original.mp4");
  expect(state.paused).toBe(false);
});

test("Home tablet Hero keeps its two equal panels", async ({ page }) => {
  for (const width of [1279, 768]) {
    await page.setViewportSize({ width, height: 1024 });
    await openHome(page);
    const layout = await page.locator(".orlyata-home").evaluate((home) => {
      const element = (selector: string): HTMLElement => {
        const value = home.querySelector<HTMLElement>(selector);
        if (value === null) {
          throw new Error("Missing Home tablet Hero selector: " + selector);
        }
        return value;
      };
      const box = (selector: string): DOMRect =>
        element(selector).getBoundingClientRect();

      return {
        columns: getComputedStyle(element(".orlyata-home__hero"))
          .gridTemplateColumns,
        contentWidth: box(".orlyata-home__content-grid").width,
        news: box(".orlyata-home__hero-panel--news"),
        overflow:
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
        video: box(".orlyata-home__hero-panel--capella"),
      };
    });

    expect(layout.overflow).toBeLessThanOrEqual(1);
    expect(layout.columns.trim().split(" ").length).toBe(2);
    expect(layout.video.width).toBeLessThan(layout.contentWidth);
    expect(layout.video.height).toBeCloseTo(layout.news.height, 1);
  }
});

test("Home tablet NewsCard height follows 270px through S_t", async ({
  page,
}) => {
  for (const width of [1279, 768]) {
    await page.setViewportSize({ width, height: 1024 });
    await openHome(page);
    const card = await page
      .locator(".orlyata-home__news-grid .orlyata-news-card")
      .first()
      .evaluate((element) => {
        const box = element.getBoundingClientRect();
        return { height: box.height, width: box.width };
      });
    const scale = width / 1279;
    expect(card.height).toBeCloseTo(270 * scale, 1);
  }
});
test("Home tablet Footer uses 48px reference padding through S_t", async ({
  page,
}) => {
  for (const width of [1279, 768]) {
    await page.setViewportSize({ width, height: 1024 });
    await openHome(page);
    const padding = await page
      .locator(".orlyata-footer")
      .evaluate((element) => {
        const style = getComputedStyle(element);
        return [
          style.paddingTop,
          style.paddingRight,
          style.paddingBottom,
          style.paddingLeft,
        ].map(Number.parseFloat);
      });
    const expected = 48 * (width / 1279);
    for (const value of padding) {
      expect(value).toBeCloseTo(expected, 1);
    }
  }
});

test("Home tablet History Lead column follows its 600px reference width through S_t", async ({
  page,
}) => {
  for (const width of [1279, 1024, 768]) {
    await page.setViewportSize({ width, height: 1024 });
    await openHome(page);
    const lead = await page
      .locator(".orlyata-home__history-lead")
      .evaluate((element) => element.getBoundingClientRect().width);
    expect(lead).toBeCloseTo(600 * (width / 1279), 1);
  }
});

test("Home tablet History preserves the exact reference words on every line through S_t", async ({
  page,
}) => {
  let reference: { copy: string[]; lead: string[] } | undefined;

  for (const width of [1279, 960, 768]) {
    await page.setViewportSize({ width, height: 1024 });
    await openHome(page);
    const lines = await page
      .locator(".orlyata-home__history")
      .evaluate((history) => {
        const lineWords = (selector: string): string[] => {
          const element = history.querySelector(selector);
          const textNode = element?.firstChild;
          if (
            element === null ||
            textNode === null ||
            textNode === undefined ||
            textNode.nodeType !== Node.TEXT_NODE
          ) {
            throw new Error("Missing History text node: " + selector);
          }

          const text = textNode.textContent ?? "";
          const groups = new Map<number, string[]>();
          for (const match of text.matchAll(/\S+/gu)) {
            const range = document.createRange();
            range.setStart(textNode, match.index);
            range.setEnd(textNode, match.index + match[0].length);
            const top =
              Math.round(range.getBoundingClientRect().top * 100) / 100;
            groups.set(top, [...(groups.get(top) ?? []), match[0]]);
          }
          return [...groups.values()].map((words) => words.join(" "));
        };

        return {
          copy: lineWords(".orlyata-home__history-copy"),
          lead: lineWords(".orlyata-home__history-lead"),
        };
      });

    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      ),
    ).toBeLessThanOrEqual(1);
    if (reference === undefined) {
      reference = lines;
    } else {
      expect(lines).toEqual(reference);
    }
  }
});

test("Home tablet first blocks use the approved full-width composition and desktop component styles", async ({
  page,
}) => {
  for (const width of [1279, 768]) {
    await page.setViewportSize({ width, height: 1024 });
    await openHome(page);
    const layout = await page.locator(".orlyata-home").evaluate((home) => {
      const element = (selector: string): HTMLElement => {
        const value = home.querySelector<HTMLElement>(selector);
        if (value === null) {
          throw new Error(
            "Missing Home tablet composition selector: " + selector,
          );
        }
        return value;
      };
      const box = (selector: string): DOMRect =>
        element(selector).getBoundingClientRect();
      const style = (selector: string): CSSStyleDeclaration =>
        getComputedStyle(element(selector));

      return {
        contentWidth: box(".orlyata-home__content-grid").width,
        factsColumns: style(".orlyata-home__facts").gridTemplateColumns,
        heroColumns: style(".orlyata-home__hero").gridTemplateColumns,
        heroVideoHeight: box(".orlyata-home__hero-panel--capella").height,
        heroNewsHeight: box(".orlyata-home__hero-panel--news").height,
        heroTitleFontSize: Number.parseFloat(
          style(".orlyata-home__hero-title").fontSize,
        ),
        heroVideoWidth: box(".orlyata-home__hero-panel--capella").width,
        heroNewsWidth: box(".orlyata-home__hero-panel--news").width,
        mediaBigHeight: box(".orlyata-media-card--big").height,
        mediaBigWidth: box(".orlyata-media-card--big").width,
        mediaColumns: style(".orlyata-home__media-grid").gridTemplateColumns,
        mediaSmallHeight: box(".orlyata-media-card--small").height,
        newsCardHeight: box(".orlyata-home__news-grid .orlyata-news-card")
          .height,
        newsBadgeFontSize: Number.parseFloat(
          style(".orlyata-news-card .orlyata-badge").fontSize,
        ),
        newsBadgeHeight: box(".orlyata-news-card .orlyata-badge").height,
        newsHeadingFontSize: Number.parseFloat(
          style(".orlyata-home__news-head .type-heading-2").fontSize,
        ),
        newsLinkFontSize: Number.parseFloat(
          style(".orlyata-home__news-head .orlyata-text-link").fontSize,
        ),
        newsTitleFontSize: Number.parseFloat(
          style(".orlyata-news-card__title").fontSize,
        ),
        overflow:
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      };
    });

    expect(layout.overflow).toBeLessThanOrEqual(1);
    expect(layout.heroColumns.trim().split(" ").length).toBe(2);
    expect(layout.heroVideoWidth).toBeCloseTo(layout.heroNewsWidth, 1);
    expect(layout.heroVideoWidth).toBeLessThan(layout.contentWidth);
    expect(layout.heroVideoHeight).toBeGreaterThan(0);
    expect(layout.heroNewsHeight).toBeGreaterThan(0);
    if (width === 1279) {
      expect(layout.heroTitleFontSize).toBeCloseTo(80, 1);
      expect(layout.newsHeadingFontSize).toBeCloseTo(44, 1);
      expect(layout.newsLinkFontSize).toBeCloseTo(20, 1);
      expect(layout.newsTitleFontSize).toBeCloseTo(24, 1);
      expect(layout.newsBadgeFontSize).toBeCloseTo(20, 1);
      expect(layout.newsBadgeHeight).toBeCloseTo(64, 1);
      expect(layout.newsCardHeight).toBeCloseTo(270, 1);
    } else {
      expect(layout.heroTitleFontSize).toBeCloseTo((80 * 768) / 1279, 1);
      expect(layout.newsHeadingFontSize).toBeCloseTo((44 * 768) / 1279, 1);
      expect(layout.newsLinkFontSize).toBeCloseTo((20 * 768) / 1279, 1);
      expect(layout.newsTitleFontSize).toBeCloseTo((24 * 768) / 1279, 1);
      expect(layout.newsBadgeFontSize).toBeCloseTo((20 * 768) / 1279, 1);
      expect(layout.newsBadgeHeight).toBeGreaterThanOrEqual(48);
      expect(layout.newsCardHeight).toBeCloseTo((270 * 768) / 1279, 1);
    }
    expect(layout.factsColumns.trim().split(" ").length).toBe(4);
    expect(layout.mediaColumns.trim().split(" ").length).toBe(2);
    expect(layout.mediaBigWidth).toBeCloseTo(layout.contentWidth, 1);
    expect(layout.mediaBigHeight / layout.mediaBigWidth).toBeCloseTo(
      540 / 797,
      2,
    );
    expect(layout.mediaSmallHeight).toBeGreaterThan(0);
  }
});

test("Home tablet uses the shared 24px heading-to-content gap", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1279, height: 1024 });
  await openHome(page);

  const gaps = await page.locator(".orlyata-home").evaluate((home) => {
    const box = (selector: string): DOMRect => {
      const element = home.querySelector<HTMLElement>(selector);
      if (element === null)
        throw new Error("Missing Home tablet gap selector: " + selector);
      return element.getBoundingClientRect();
    };
    const gap = (section: string, content: string): number => {
      const heading = box(section + " .orlyata-home__section-head");
      const target = box(section + " " + content);
      return target.top - heading.bottom;
    };

    return {
      achievements: gap(
        ".orlyata-home__achievements",
        ".orlyata-home__table-wrap",
      ),
      history: gap(".orlyata-home__history", ".orlyata-home__history-grid"),
      media: gap(".orlyata-home__media-section", ".orlyata-home__media-grid"),
    };
  });

  expect(gaps.achievements).toBeCloseTo(24, 1);
  expect(gaps.media).toBeCloseTo(24, 1);
  expect(gaps.history).toBeCloseTo(24, 1);

  const headerAlignments = await page
    .locator(".orlyata-home__achievements thead th")
    .evaluateAll((headers) =>
      headers.map((header) => {
        const text = document.createRange();
        text.selectNodeContents(header);
        const textBox = text.getBoundingClientRect();
        const headerBox = header.getBoundingClientRect();
        return (
          textBox.top +
          textBox.height / 2 -
          (headerBox.top + headerBox.height / 2)
        );
      }),
    );
  for (const alignment of headerAlignments) {
    expect(Math.abs(alignment)).toBeLessThanOrEqual(1);
  }
});

test("Home keeps achievements between History and the application CTA", async ({
  page,
}) => {
  for (const { height, width } of [
    { height: 1024, width: 320 },
    { height: 1024, width: 768 },
    { height: 1024, width: 1279 },
    { height: 1440, width: 1280 },
    { height: 1440, width: 1920 },
    { height: 1440, width: 2560 },
  ]) {
    await page.setViewportSize({ width, height });
    await openHome(page);

    const order = await page.locator(".orlyata-home").evaluate((home) =>
      Array.from(home.querySelectorAll<HTMLElement>(
        ".orlyata-home__history, .orlyata-home__achievements, .orlyata-home__application",
      )).map((section) => section.className),
    );

    expect(order).toEqual([
      "orlyata-home__section orlyata-home__history",
      "orlyata-home__section orlyata-home__achievements",
      "orlyata-home__section orlyata-home__application",
    ]);
  }
});

test("Home desktop and tablet use the redesigned History composition", async ({
  page,
}) => {
  for (const { width, scale } of [
    { width: 1280, scale: 1280 / 1920 },
    { width: 1920, scale: 1 },
    { width: 2560, scale: 2560 / 1920 },
    { width: 1279, scale: 1 },
  ]) {
    await page.setViewportSize({ width, height: 1440 });
    await openHome(page);

    const bounds = await page
      .locator(".orlyata-home__history")
      .evaluate((history) => {
        const box = (selector: string): DOMRect => {
          const element = history.querySelector<HTMLElement>(selector);
          if (element === null) {
            throw new Error(
              "Missing Home History containment selector: " + selector,
            );
          }

          return element.getBoundingClientRect();
        };

        const historyBox = history.getBoundingClientRect();
        const title = box(".orlyata-home__history-title");
        const lead = box(".orlyata-home__history-lead");
        const copy = box(".orlyata-home__history-copy");
        const sectionHead = history.querySelector<HTMLElement>(
          ".orlyata-home__section-head",
        );
        return {
          historyBottom: historyBox.bottom,
          height: historyBox.height,
          sectionHeadDisplay:
            sectionHead === null ? "missing" : getComputedStyle(sectionHead).display,
          tagsBottom: box(".orlyata-home__history-tags").bottom,
          teachersBottom: box(".orlyata-home__history-teachers").bottom,
          titleToCopy: copy.top - title.bottom,
          titleToLead: title.top - lead.top,
        };
      });

    expect(bounds.height).toBeCloseTo(520 * scale, 1);
    expect(bounds.sectionHeadDisplay).toBe("none");
    expect(bounds.titleToCopy).toBeCloseTo(24 * scale, 1);
    expect(bounds.titleToLead).toBeCloseTo(0, 1);
    expect(bounds.tagsBottom).toBeCloseTo(bounds.historyBottom, 1);
    expect(bounds.teachersBottom).toBeCloseTo(bounds.historyBottom, 1);
  }
});

test("Home mobile uses the approved Capella heading and hides the desktop title", async ({
  page,
}) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await openHome(page);

  const history = page.locator(".orlyata-home__history");
  await expect(history.locator(".orlyata-home__section-head")).toBeVisible();
  await expect(history.locator(".orlyata-home__section-head .orlyata-text-link")).not.toBeVisible();
  await expect(history.getByRole("heading", { level: 2, name: "О капелле" })).toBeVisible();
  await expect(history.locator(".orlyata-home__history-title")).toHaveCSS(
    "display",
    "none",
  );
});
