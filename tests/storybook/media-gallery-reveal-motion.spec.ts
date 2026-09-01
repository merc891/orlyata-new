import { expect, test } from '@playwright/test';

import { expectGingerLoaded } from './visual';

test('Media gallery list sections use the approved heading and content reveal', async ({ page }) => {
  await page.goto('/iframe.html?id=components-button--variants&viewMode=story');
  await expectGingerLoaded(page);
  await page.locator('#storybook-root').evaluate((root) => {
    root.innerHTML = `
      <main class="orlyata-media-gallery">
        <section class="orlyata-media-gallery__media-list-section is-revealed">
          <div class="orlyata-media-gallery__media-list-section-head"><h2>Фото</h2><a href="#photo">Перейти в раздел</a></div>
          <div class="orlyata-media-gallery__media-list-table">Содержимое фотогалереи</div>
        </section>
      </main>`;
  });
  await page.locator('html').evaluate((documentElement) => {
    documentElement.classList.add('has-js');
  });

  const heading = page.locator('.orlyata-media-gallery__media-list-section-head');
  const content = page.locator('.orlyata-media-gallery__media-list-table');

  await expect(heading).toHaveCSS('animation-name', 'orlyata-home-media-reveal');
  await expect(heading).toHaveCSS('animation-duration', '0.6s');
  await expect(heading).toHaveCSS('animation-timing-function', 'cubic-bezier(0, 0, 0.18, 1)');
  await expect(content).toHaveCSS('animation-name', 'orlyata-home-media-card-reveal');
  await expect(content).toHaveCSS('animation-duration', '0.6s');
  await expect(content).toHaveCSS('animation-timing-function', 'cubic-bezier(0, 0, 0.18, 1)');
  await expect(content).toHaveCSS('animation-delay', '0.4s');

  await content.evaluate((node) => {
    node.style.animationDelay = '999s';
  });
  await expect(content).toHaveCSS('opacity', '0');
});
