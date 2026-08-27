import { expect, test } from '@playwright/test';

import { expectGingerLoaded } from './visual';

test('Home media reveal keeps separate approved easing for its heading and cards', async ({ page }) => {
  await page.goto('/iframe.html?id=components-button--variants&viewMode=story');
  await expectGingerLoaded(page);
  await page.locator('#storybook-root').evaluate((root) => {
    root.innerHTML = `
      <main class="orlyata-home">
        <section class="orlyata-home__media-section is-revealed">
          <div class="orlyata-home__section-head"><h2>Медиагалерея</h2><a href="#media">Перейти в раздел</a></div>
          <div class="orlyata-home__media-grid">
            <article class="orlyata-media-card">Фото</article><article class="orlyata-media-card">Видео</article>
          </div>
        </section>
      </main>`;
  });
  await page.locator('html').evaluate((documentElement) => {
    documentElement.classList.add('has-js');
  });

  const heading = page.locator('.orlyata-home__media-section .orlyata-home__section-head');
  const card = page.locator('.orlyata-home__media-section .orlyata-media-card').first();

  await expect(heading).toHaveCSS('animation-name', 'orlyata-home-media-reveal');
  await expect(heading).toHaveCSS('animation-duration', '0.6s');
  await expect(heading).toHaveCSS('animation-timing-function', 'cubic-bezier(0, 0, 0.18, 1)');
  await expect(card).toHaveCSS('animation-name', 'orlyata-home-media-card-reveal');
  await expect(card).toHaveCSS('animation-duration', '0.6s');
  await expect(card).toHaveCSS('animation-timing-function', 'cubic-bezier(0, 0, 0.18, 1)');
  await expect(card).toHaveCSS('animation-delay', '0.4s');

  await card.evaluate((node) => {
    node.style.animationDelay = '999s';
  });
  await expect(card).toHaveCSS('opacity', '0');
});
