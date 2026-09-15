import { expect, test } from "@playwright/test";

import { expectGingerLoaded } from "./visual";

test("Teacher-detail mobile quote transitions use the shared 96px section rhythm", async ({ page }) => {
  for (const [width, expectedGap] of [[320, 320 / 393 * 96], [393, 96], [767, 767 / 393 * 96]] as const) {
    await page.setViewportSize({ width, height: 852 });
    await page.goto("/iframe.html?id=components-page-hero--teacher-detail&viewMode=story");

    const gaps = await page.locator("html").evaluate((root) => {
      const readLength = (token: string): number => {
        const probe = document.createElement("div");
        probe.style.marginBlockStart = "var(" + token + ")";
        root.append(probe);
        const value = parseFloat(getComputedStyle(probe).marginBlockStart);
        probe.remove();
        return value;
      };

      return {
        achievementsToQuote: readLength("--teacher-detail-achievements-quote-gap"),
        quoteToGallery: readLength("--teacher-detail-quote-gallery-gap"),
        section: readLength("--layout-section-gap"),
        viewportWidth: window.innerWidth,
      };
    });

    expect(gaps.viewportWidth).toBe(width);
    expect(gaps.section).toBeCloseTo(expectedGap, 2);
    expect(gaps.achievementsToQuote).toBeCloseTo(gaps.section, 2);
    expect(gaps.quoteToGallery).toBeCloseTo(gaps.section, 2);
  }
});

test("PageHero exposes its shared radius and title reveal", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 800 });
  await page.goto("/iframe.html?id=components-page-hero--default&viewMode=story");
  await expectGingerLoaded(page);

  const hero = page.locator(".orlyata-page-hero");
  const title = page.getByRole("heading", { level: 1, name: "О капелле" });

  await expect(hero).toHaveClass(/is-title-revealed/);
  await expect(hero).toHaveCSS("border-radius", "24px");
  await expect(title).toHaveCSS("animation-name", "orlyata-page-hero-title-reveal");
  await expect(title).toHaveCSS("animation-duration", "0.4s");
  await expect(title).toHaveCSS("animation-timing-function", "cubic-bezier(0, 0, 0.18, 1)");
});


test("PageHero news-detail aligns share controls with the H1 on desktop and tablet", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 800 });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: () => Promise.resolve() } });
  });
  await page.goto("/iframe.html?id=components-page-hero--news-detail&viewMode=story");
  await expectGingerLoaded(page);
  await page.waitForFunction(() => Array.from(document.getAnimations()).every((animation) => animation.playState !== "running"));

  const hero = page.locator(".orlyata-page-hero--news-detail");
  const title = page.getByRole("heading", { level: 1, name: "Почетный работник культуры города Москвы!" });

  await expect(hero).toHaveCSS("height", "580px");
  await expect(title).toHaveClass(/type-heading-1/);
  await expect(hero.locator(".orlyata-page-hero__content")).toHaveCSS("width", "800px");
  await expect(page.getByLabel("Вернуться к списку новостей")).toBeVisible();
  await expect(page.getByText("13 августа • Новость")).toBeVisible();
  const shareControls = page.getByLabel("Поделиться новостью").locator(".orlyata-page-hero__share-control");
  await expect(shareControls).toHaveCount(3);
  await expect(page.getByTitle("Поделиться во Вконтакте")).toHaveCount(1);
  await expect(page.getByTitle("Поделиться в Telegram")).toHaveCount(1);
  await expect(page.getByTitle("Скопировать ссылку на новость")).toHaveCount(1);
  const controlLayout = await hero.evaluate((element) => {
    const heroBox = element.getBoundingClientRect();
    const titleBox = element.querySelector<HTMLElement>(".orlyata-page-hero__title")?.getBoundingClientRect();
    const shareBox = element.querySelector<HTMLElement>(".orlyata-page-hero__share")?.getBoundingClientRect();
    const control = element.querySelector<HTMLElement>(".orlyata-page-hero__share-control");

    return {
      shareTitleBottomDelta: shareBox && titleBox ? Math.abs(shareBox.bottom - titleBox.bottom) : Number.NaN,
      titleBottomInset: titleBox ? heroBox.bottom - titleBox.bottom : Number.NaN,
      controlBackground: control ? getComputedStyle(control).backgroundColor : "",
    };
  });
  expect(controlLayout.shareTitleBottomDelta).toBeLessThan(0.02);
  expect(Math.abs(controlLayout.titleBottomInset - 24)).toBeLessThan(0.02);
  expect(controlLayout.controlBackground).toBe("rgb(255, 255, 255)");
  await shareControls.first().hover();
  await expect(shareControls.first()).toHaveCSS("opacity", "0.9");
  const copyControl = page.getByRole("button", { name: "Скопировать ссылку на новость" });
  await expect(copyControl.locator(".orlyata-page-hero__copy-icon")).toHaveCSS("width", "24px");
  await copyControl.click();
  const copiedControl = page.getByRole("button", { name: "Ссылка скопирована" });
  await expect(copiedControl).toHaveAttribute("data-copy-state", "copied");
  await expect(copiedControl).toHaveAccessibleName("Ссылка скопирована");
  await expect(copiedControl).toHaveAttribute("title", "Ссылка скопирована");
  await expect(title).toHaveCSS("animation-name", "orlyata-page-hero-title-reveal");
});

test("PageHero news-detail aligns share controls with the H1 on tablet", async ({ page }) => {
  for (const width of [1279, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/iframe.html?id=components-page-hero--news-detail&viewMode=story");
    await expectGingerLoaded(page);

    const delta = await page.locator(".orlyata-page-hero--news-detail").evaluate((hero) => {
      const title = hero.querySelector<HTMLElement>(".orlyata-page-hero__title");
      const share = hero.querySelector<HTMLElement>(".orlyata-page-hero__share");

      return title && share ? Math.abs(title.getBoundingClientRect().bottom - share.getBoundingClientRect().bottom) : Number.NaN;
    });

    expect(delta).toBeLessThan(0.02);
  }
});


test("PageHero archive reuses the back button without detail controls", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 800 });
  await page.goto("/iframe.html?id=components-page-hero--archive&viewMode=story");
  await expectGingerLoaded(page);

  const hero = page.locator(".orlyata-page-hero--archive");

  await expect(page.getByLabel("Вернуться в медиагалерею")).toBeVisible();
  await expect(hero.locator(".orlyata-page-hero__share")).toHaveCount(0);
});

test("PageHero default and archive use mobile Heading 1 while news-detail remains excluded", async ({ page }) => {
  for (const storyId of ["components-page-hero--default", "components-page-hero--archive"]) {
    await page.setViewportSize({ width: 393, height: 852 });
    await page.goto("/iframe.html?id=" + storyId + "&viewMode=story");
    const title = page.locator(".orlyata-page-hero__title");

    await expect(title).toHaveCSS("font-size", "40px");
    await expect(title).toHaveCSS("line-height", "36px");
  }
});


test("PageHero variants share the 1.5x mobile inner background aligned to the bottom", async ({ page }) => {
  for (const storyId of [
    "components-page-hero--default",
    "components-page-hero--archive",
    "components-page-hero--news-detail",
    "components-page-hero--teacher-detail",
  ]) {
    await page.setViewportSize({ width: 393, height: 852 });
    await page.goto("/iframe.html?id=" + storyId + "&viewMode=story");

    const hero = page.locator(".orlyata-page-hero");
    const source = hero.locator('source[media="(max-width: 767px)"]');
    const image = hero.locator(".orlyata-page-hero__image");

    await expect(source).toHaveAttribute("srcset", /\/assets\/images\/teachers\/bg-mobile-inner\.png$/);
    await expect(image).toHaveCSS("object-fit", "cover");
    await expect(image).toHaveCSS("object-position", "50% 100%");
  }
});

test("PageHero news-detail follows the desktop S envelope", async ({ page }) => {
  for (const [width, expectedHeight] of [[1280, 386.667], [1440, 435], [1600, 483.333], [1920, 580], [2240, 676.667], [2560, 773.333]] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/iframe.html?id=components-page-hero--news-detail&viewMode=story");
    await expectGingerLoaded(page);

    const dimensions = await page.locator(".orlyata-page-hero--news-detail").evaluate((hero) => ({
      height: hero.getBoundingClientRect().height,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
    }));

    expect(Math.abs(dimensions.height - expectedHeight)).toBeLessThan(0.02);
    expect(dimensions.overflow).toBe(false);
  }
});

test("PageHero news-detail stacks mobile meta, H1 and share controls with safe back-link clearance", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/iframe.html?id=components-page-hero--news-detail&viewMode=story");
  await expectGingerLoaded(page);
  await page.waitForFunction(() => Array.from(document.getAnimations()).every((animation) => animation.playState !== "running"));

  const hero = page.locator(".orlyata-page-hero--news-detail");
  const title = hero.locator(".orlyata-page-hero__title");
  const meta = hero.locator(".orlyata-page-hero__meta");
  const share = hero.locator(".orlyata-page-hero__share");
  const back = hero.locator(".orlyata-page-hero__back");
  const metrics = await hero.evaluate((element) => {
    const titleBox = element.querySelector<HTMLElement>(".orlyata-page-hero__title")?.getBoundingClientRect();
    const metaBox = element.querySelector<HTMLElement>(".orlyata-page-hero__meta")?.getBoundingClientRect();
    const shareBox = element.querySelector<HTMLElement>(".orlyata-page-hero__share")?.getBoundingClientRect();

    return {
      metaTitleGap: titleBox && metaBox ? titleBox.top - metaBox.bottom : Number.NaN,
      titleAfterMeta: titleBox && metaBox ? titleBox.top >= metaBox.bottom : false,
      shareBackTopDelta: shareBox ? Math.abs(shareBox.top - (element.querySelector<HTMLElement>(".orlyata-page-hero__back")?.getBoundingClientRect().top ?? Number.NaN)) : Number.NaN,
      titleBottomInset: titleBox ? element.getBoundingClientRect().bottom - titleBox.bottom : Number.NaN,
      backTop: element.querySelector<HTMLElement>(".orlyata-page-hero__back")?.getBoundingClientRect().top ?? Number.NaN,
      backBottom: element.querySelector<HTMLElement>(".orlyata-page-hero__back")?.getBoundingClientRect().bottom ?? Number.NaN,
      metaTop: metaBox?.top ?? Number.NaN,
      lineHeight: getComputedStyle(element.querySelector<HTMLElement>(".orlyata-page-hero__title")!).lineHeight,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });

  await expect(title).toHaveClass(/type-heading-1/);
  await expect(meta).toBeVisible();
  await expect(share).toBeVisible();
  await expect(back).toBeVisible();
  expect(metrics.lineHeight).toBe("32px");
  expect(metrics.titleAfterMeta).toBe(true);
  expect(Math.abs(metrics.metaTitleGap - 16)).toBeLessThan(0.02);
  expect(metrics.shareBackTopDelta).toBeLessThan(0.02);
  expect(Math.abs(metrics.titleBottomInset - 24)).toBeLessThan(0.02);
  expect(metrics.backTop).toBeGreaterThanOrEqual(72);
  expect(metrics.metaTop - metrics.backBottom).toBeGreaterThanOrEqual(48);
  expect(metrics.overflow).toBe(false);
});

test("PageHero news-detail scales its mobile back control and top inset", async ({ page }) => {
  const measurements: Array<{ backHeight: number; backTop: number }> = [];

  for (const width of [393, 564]) {
    await page.setViewportSize({ width, height: 852 });
    await page.goto("/iframe.html?id=components-page-hero--news-detail&viewMode=story");
    await expectGingerLoaded(page);

    measurements.push(await page.locator(".orlyata-page-hero--news-detail").evaluate((hero) => {
      const back = hero.querySelector<HTMLElement>(".orlyata-page-hero__back")!;

      return {
        backHeight: back.getBoundingClientRect().height,
        backTop: back.getBoundingClientRect().top - hero.getBoundingClientRect().top,
      };
    }));
  }

  expect(measurements[0]?.backHeight).toBeCloseTo(48, 2);
  expect(measurements[1]?.backHeight ?? 0).toBeGreaterThan(measurements[0]?.backHeight ?? 0);
  expect(measurements[1]?.backTop ?? 0).toBeGreaterThan(measurements[0]?.backTop ?? 0);
});

test("PageHero news-detail grows for a four-line mobile H1 without crossing its back link", async ({ page }) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto("/iframe.html?id=components-page-hero--news-detail&viewMode=story");
  await expectGingerLoaded(page);
  await page.waitForFunction(() => Array.from(document.getAnimations()).every((animation) => animation.playState !== "running"));

  const hero = page.locator(".orlyata-page-hero--news-detail");
  const title = hero.locator(".orlyata-page-hero__title");
  await title.evaluate((element) => {
    element.textContent = "Почетный работник культуры города Москвы получил высокую государственную награду за многолетний вклад в развитие хорового искусства";
  });

  const metrics = await hero.evaluate((element) => {
    const title = element.querySelector<HTMLElement>(".orlyata-page-hero__title")!;
    const meta = element.querySelector<HTMLElement>(".orlyata-page-hero__meta")!;
    const back = element.querySelector<HTMLElement>(".orlyata-page-hero__back")!;
    const titleBox = title.getBoundingClientRect();

    return {
      backMetaGap: meta.getBoundingClientRect().top - back.getBoundingClientRect().bottom,
      heroHeight: element.getBoundingClientRect().height,
      lines: Math.round(titleBox.height / parseFloat(getComputedStyle(title).lineHeight)),
      overflow: document.documentElement.scrollWidth > window.innerWidth,
    };
  });

  expect(metrics.lines).toBeGreaterThanOrEqual(4);
  expect(metrics.backMetaGap).toBeGreaterThanOrEqual(48);
  expect(metrics.heroHeight).toBeGreaterThan(348);
  expect(metrics.overflow).toBe(false);
});

test("PageHero teacher-detail keeps the documented desktop content geometry", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 900 });
  await page.goto("/iframe.html?id=components-page-hero--teacher-detail&viewMode=story");
  await expectGingerLoaded(page);

  const hero = page.locator(".orlyata-page-hero--teacher-detail");
  const content = hero.locator(".orlyata-page-hero__content");
  const description = hero.getByText("Создатель и художественный руководитель капеллы.");

  await expect(hero).toHaveCSS("height", "580px");
  await expect(content).toHaveCSS("width", "440px");
  await expect(description).toHaveCSS("margin-bottom", "24px");
  await expect(page.getByLabel("Вернуться на страницу «О капелле»")).toBeVisible();
  await expect(hero.getByText("Заслуженный работник культуры РФ")).toHaveClass(/orlyata-badge--inverse/);

  const titleLineCount = await hero.locator(".orlyata-page-hero__title").evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    return range.getClientRects().length;
  });
  expect(titleLineCount).toBe(1);

  for (const [width, expectedContentWidth] of [[1280, 293.333], [1440, 330], [1600, 366.667], [1920, 440], [2240, 513.333], [2560, 586.667]] as const) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/iframe.html?id=components-page-hero--teacher-detail&viewMode=story");

    const dimensions = await page.locator(".orlyata-page-hero--teacher-detail .orlyata-page-hero__content").evaluate((element) => ({
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      width: element.getBoundingClientRect().width,
    }));

    expect(Math.abs(dimensions.width - expectedContentWidth)).toBeLessThan(0.02);
    expect(dimensions.overflow).toBe(false);
  }
});
test("PageHero teacher-detail reuses the tablet token scope without horizontal overflow", async ({ page }) => {
  for (const width of [1279, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/iframe.html?id=components-page-hero--teacher-detail&viewMode=story");

    const metrics = await page.locator(".orlyata-page-hero--teacher-detail").evaluate((hero) => {
      const title = hero.querySelector<HTMLElement>(".orlyata-page-hero__title");
      const titleBox = title?.getBoundingClientRect();

      return {
        heroHeight: hero.getBoundingClientRect().height,
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        titleRight: titleBox?.right ?? 0,
      };
    });

    expect(metrics.heroHeight).toBeGreaterThan(0);
    expect(metrics.titleRight).toBeLessThanOrEqual(width + 0.5);
    expect(metrics.overflow).toBe(false);
  }
});


test("PageHero teacher-detail mobile keeps a 440px composition below the menu and scales from 393px", async ({ page }) => {
  for (const width of [393, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/iframe.html?id=components-page-hero--teacher-detail&viewMode=story");
    await expectGingerLoaded(page);

    const metrics = await page.locator(".orlyata-page-hero--teacher-detail").evaluate((hero) => {
      const back = hero.querySelector<HTMLElement>(".orlyata-page-hero__back");
      const badge = hero.querySelector<HTMLElement>(".orlyata-page-hero__badge .orlyata-badge");
      const foreground = hero.querySelector<HTMLElement>(".orlyata-page-hero__foreground-image");
      const picture = hero.querySelector<HTMLElement>(".orlyata-page-hero__picture");
      const description = hero.querySelector<HTMLElement>(".orlyata-page-hero__description");
      const title = hero.querySelector<HTMLElement>(".orlyata-page-hero__title");
      const mobileSource = hero.querySelector<HTMLSourceElement>('source[media="(max-width: 767px)"]');

      if (!back || !badge || !foreground || !picture || !description || !title || !mobileSource) {
        throw new Error("Teacher mobile Hero must include back, Badge, foreground portrait, description, title and mobile background.");
      }

      const heroBox = hero.getBoundingClientRect();
      const backBox = back.getBoundingClientRect();
      const badgeBox = badge.getBoundingClientRect();
      const foregroundBox = foreground.getBoundingClientRect();
      const pictureBox = picture.getBoundingClientRect();
      const descriptionBox = description.getBoundingClientRect();
      const descriptionStyle = getComputedStyle(description);
      const titleStyle = getComputedStyle(title);
      const achievementsGapProbe = document.createElement("div");
      achievementsGapProbe.style.marginBlockStart = "var(--teacher-detail-hero-achievements-gap)";
      hero.append(achievementsGapProbe);
      const achievementsGap = parseFloat(getComputedStyle(achievementsGapProbe).marginBlockStart);
      achievementsGapProbe.remove();
      const titleRange = document.createRange();
      titleRange.selectNodeContents(title);

      return {
        achievementsGap,
        background: mobileSource.srcset,
        backgroundHeight: pictureBox.height,
        backgroundTop: pictureBox.top - heroBox.top,
        badgeHeight: badgeBox.height,
        controlsTopDelta: Math.abs(backBox.top - badgeBox.top),
        descriptionColor: descriptionStyle.color,
        descriptionHeight: descriptionBox.height,
        descriptionLeft: descriptionBox.left - heroBox.left,
        descriptionTopGap: descriptionBox.top - pictureBox.bottom,
        descriptionWidth: descriptionBox.width,
        foregroundBottom: pictureBox.bottom - foregroundBox.bottom,
        foregroundCenterDelta: Math.abs((foregroundBox.left + foregroundBox.width / 2) - (heroBox.left + heroBox.width / 2)),
        foregroundWidth: foregroundBox.width,
        heroHeight: heroBox.height,
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        titleFontSize: parseFloat(titleStyle.fontSize),
        titleLetterSpacing: parseFloat(titleStyle.letterSpacing),
        titleLineHeight: parseFloat(titleStyle.lineHeight),
        titleLines: titleRange.getClientRects().length,
      };
    });

    const scale = width / 393;
    const headerHeight = Math.max(48, 48 * scale) + (24 * scale);
    expect(metrics.heroHeight).toBeCloseTo(headerHeight + (440 * scale) + (24 * scale) + metrics.descriptionHeight, 1);
    expect(metrics.backgroundTop).toBeCloseTo(headerHeight, 1);
    expect(metrics.backgroundHeight).toBeCloseTo(440 * scale, 1);
    expect(metrics.foregroundWidth).toBeCloseTo(340 * scale, 1);
    expect(metrics.foregroundBottom).toBeCloseTo(0, 1);
    expect(metrics.foregroundCenterDelta).toBeLessThanOrEqual(0.5);
    expect(metrics.badgeHeight).toBeCloseTo(36 * scale, 1);
    expect(metrics.controlsTopDelta).toBeLessThanOrEqual(0.5);
    expect(metrics.achievementsGap).toBeCloseTo(48 * scale, 1);
    expect(metrics.descriptionWidth).toBeCloseTo(310 * scale, 1);
    expect(metrics.descriptionLeft).toBeCloseTo(12 * scale, 1);
    expect(metrics.descriptionTopGap).toBeCloseTo(24 * scale, 1);
    expect(metrics.descriptionColor).toBe("rgb(113, 113, 122)");
    expect(metrics.background).toContain("/assets/images/teachers/bg-mobile-inner.png");
    expect(metrics.titleLines).toBe(3);
    expect(metrics.titleFontSize).toBeCloseTo(40 * scale, 1);
    expect(metrics.titleLineHeight).toBeCloseTo(36 * scale, 1);
    expect(metrics.titleLetterSpacing).toBeCloseTo(-0.814256, 1);
    expect(metrics.overflow).toBe(false);
  }
});
