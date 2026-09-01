import { expect, test } from '@playwright/test';

import { expectGingerLoaded } from './visual';

test('Home hero keeps its preview cropped by 2% and scales only the video to 110% on panel hover', async ({ page }) => {
  await page.goto('/iframe.html?id=components-button--variants&viewMode=story');
  await expectGingerLoaded(page);
  await page.locator('#storybook-root').evaluate((root) => {
    root.innerHTML = '<main class="orlyata-home"><div class="orlyata-home__hero-panel orlyata-home__hero-panel--capella orlyata-home__hero-video-trigger"><div class="orlyata-home__hero-panel-content"><video class="orlyata-home__hero-preview"></video></div><h1 class="orlyata-home__hero-title">Хоровая капелла мальчиков</h1></div></main>';
  });

  const hero = page.locator('.orlyata-home__hero-video-trigger');
  const preview = hero.locator('.orlyata-home__hero-preview');
  const beforeHover = await hero.boundingBox();

  await expect(preview).toHaveCSS('transform', 'matrix(1.02, 0, 0, 1.02, 0, 0)');
  await expect(preview).toHaveCSS('transition-duration', '0.4s');
  await expect(preview).toHaveCSS('transition-timing-function', 'cubic-bezier(0.46, 0, 0, 1)');
  await hero.hover();
  await expect(preview).toHaveCSS('transform', 'matrix(1.1, 0, 0, 1.1, 0, 0)');
  expect(await hero.boundingBox()).toEqual(beforeHover);
});


test("Home hero video close control sits above the video and uses the token-coloured SVG icon", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 900 });
  await page.goto("/iframe.html?id=components-button--variants&viewMode=story");
  await expectGingerLoaded(page);
  await page.locator("#storybook-root").evaluate((root) => {
    root.innerHTML = "<dialog class=\"orlyata-home__hero-dialog\" open><div class=\"orlyata-home__hero-dialog-content\"><video class=\"orlyata-home__hero-dialog-video\"></video><button class=\"orlyata-home__hero-dialog-close\" type=\"button\" aria-label=\"Закрыть видео\"><svg aria-hidden=\"true\" focusable=\"false\" viewBox=\"0 0 24 24\" fill=\"none\"><path d=\"M18 6L6 18M6 6L18 18\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path></svg></button></div></dialog>";
  });

  const close = page.getByRole("button", { name: "Закрыть видео" });
  const video = page.locator(".orlyata-home__hero-dialog-video");
  const [closeBox, videoBox] = await Promise.all([close.boundingBox(), video.boundingBox()]);

  await expect(close).toHaveCSS("color", "rgb(24, 23, 23)");
  await expect(page.locator(".orlyata-home__hero-dialog")).toHaveCSS("overflow", "visible");
  await expect(close.locator("svg")).toHaveCSS("width", "24px");
  await expect(close.locator("path")).toHaveAttribute("stroke", "currentColor");
  expect(closeBox?.x).toBeGreaterThanOrEqual((videoBox?.x ?? 0) + (videoBox?.width ?? 0));
  expect(closeBox?.y).toBeCloseTo(videoBox?.y ?? 0, 1);
});
