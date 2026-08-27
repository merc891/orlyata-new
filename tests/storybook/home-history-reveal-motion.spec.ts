import { expect, test } from '@playwright/test';

import { expectGingerLoaded } from './visual';

test('Home history reveal uses the approved two-stage motion contract', async ({ page }) => {
  await page.goto('/iframe.html?id=components-button--variants&viewMode=story');
  await expectGingerLoaded(page);
  await page.locator('#storybook-root').evaluate((root) => {
    root.innerHTML = `
      <main class="orlyata-home">
        <section class="orlyata-home__history is-revealed">
          <div class="orlyata-home__section-head"><h2>История</h2><a href="#history">Подробнее</a></div>
          <div class="orlyata-home__history-grid">
            <p>История капеллы</p><a href="#teachers">Педагоги</a>
          </div>
        </section>
      </main>`;
  });
  await page.locator('html').evaluate((documentElement) => {
    documentElement.classList.add('has-js');
  });

  const heading = page.locator('.orlyata-home__history .orlyata-home__section-head');
  const content = page.locator('.orlyata-home__history .orlyata-home__history-grid');

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
