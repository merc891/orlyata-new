import { expect, test } from "@playwright/test";

import { expectGingerLoaded } from "./visual";

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


test("PageHero news-detail keeps the documented desktop controls", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 800 });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: () => Promise.resolve() } });
  });
  await page.goto("/iframe.html?id=components-page-hero--news-detail&viewMode=story");
  await expectGingerLoaded(page);

  const hero = page.locator(".orlyata-page-hero--news-detail");
  const title = page.getByRole("heading", { level: 1, name: "Почетный работник культуры города Москвы!" });

  await expect(hero).toHaveCSS("height", "580px");
  await expect(hero.locator(".orlyata-page-hero__content")).toHaveCSS("width", "800px");
  await expect(page.getByLabel("Вернуться к списку новостей")).toBeVisible();
  await expect(page.getByText("13 августа • Новость")).toBeVisible();
  const shareControls = page.getByLabel("Поделиться новостью").locator(".orlyata-page-hero__share-control");
  await expect(shareControls).toHaveCount(3);
  await expect(page.getByTitle("Поделиться во Вконтакте")).toHaveCount(1);
  await expect(page.getByTitle("Поделиться в Telegram")).toHaveCount(1);
  await expect(page.getByTitle("Скопировать ссылку на новость")).toHaveCount(1);
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


test("PageHero archive reuses the back button without detail controls", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 800 });
  await page.goto("/iframe.html?id=components-page-hero--archive&viewMode=story");
  await expectGingerLoaded(page);

  const hero = page.locator(".orlyata-page-hero--archive");

  await expect(page.getByLabel("Вернуться в медиагалерею")).toBeVisible();
  await expect(hero.locator(".orlyata-page-hero__share")).toHaveCount(0);
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
