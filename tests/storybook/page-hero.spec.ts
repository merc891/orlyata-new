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
  await page.goto("/iframe.html?id=components-page-hero--news-detail&viewMode=story");
  await expectGingerLoaded(page);

  const hero = page.locator(".orlyata-page-hero--news-detail");
  const title = page.getByRole("heading", { level: 1, name: "Почетный работник культуры города Москвы!" });

  await expect(hero).toHaveCSS("height", "580px");
  await expect(page.getByLabel("Вернуться к списку новостей")).toBeVisible();
  await expect(page.getByText("13 августа • Новость")).toBeVisible();
  await expect(page.getByLabel("Поделиться новостью").locator(".orlyata-page-hero__share-control")).toHaveCount(3);
  await expect(title).toHaveCSS("animation-name", "orlyata-page-hero-title-reveal");
});


test("PageHero news-detail follows the desktop S envelope", async ({ page }) => {
  for (const [width, expectedHeight] of [[1280, 386.667], [1920, 580], [2560, 773.333]] as const) {
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
