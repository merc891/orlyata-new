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
