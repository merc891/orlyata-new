import { expect, test } from '@playwright/test';

import { expectGingerLoaded } from './visual';

const teacherCtaMarkup = `
  <main class="orlyata-home">
    <style>
      .orlyata-home__history-teachers-link img {
        rotate: -90deg;
      }
    </style>
    <a class="orlyata-home__history-teachers-link" href="#teachers" aria-label="Перейти к педагогам">
      <img src="/wp-content/themes/orlyata/assets/icons/button-arrow.svg" alt="" aria-hidden="true">
    </a>
  </main>
`;

async function mountTeacherCta(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/iframe.html?id=components-button--variants&viewMode=story');
  await expectGingerLoaded(page);
  await page.locator('#storybook-root').evaluate((root, markup) => {
    root.innerHTML = markup;
  }, teacherCtaMarkup);
}

async function renderedX(element: import('@playwright/test').Locator): Promise<number> {
  return element.evaluate((node) => node.getBoundingClientRect().x);
}

test('Home teacher CTA moves its arrow 8px right on hover and returns it on pointer leave', async ({ page }) => {
  await mountTeacherCta(page);

  const cta = page.locator('.orlyata-home__history-teachers-link');
  const arrow = cta.locator('img');

  const initialX = await renderedX(arrow);
  await cta.hover();
  await page.waitForTimeout(350);
  expect((await renderedX(arrow)) - initialX).toBeCloseTo(8, 2);

  await page.mouse.move(0, 0);
  await page.waitForTimeout(350);
  expect((await renderedX(arrow)) - initialX).toBeCloseTo(0, 2);
});

test('Home teacher CTA arrow does not move when reduced motion is requested', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await mountTeacherCta(page);

  const cta = page.locator('.orlyata-home__history-teachers-link');
  const arrow = cta.locator('img');

  const initialX = await renderedX(arrow);
  await cta.hover();
  await page.waitForTimeout(350);
  expect((await renderedX(arrow)) - initialX).toBeCloseTo(0, 2);
});
