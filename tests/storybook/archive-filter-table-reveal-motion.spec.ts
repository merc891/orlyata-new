import { expect, test } from '@playwright/test';

import { expectGingerLoaded } from './visual';

test('News, Notes, media archives and Contacts reveal their content with one opacity-only pattern', async ({ page }) => {
  await page.goto('/iframe.html?id=components-button--variants&viewMode=story');
  await expectGingerLoaded(page);
  await page.locator('#storybook-root').evaluate((root) => {
    root.innerHTML = `
      <main>
        <section data-archive-content-reveal class="is-reveal-pending"><nav>Фильтры новостей</nav><div>Таблица новостей</div></section>
        <section data-archive-content-reveal class="is-reveal-pending"><nav>Фильтры нот</nav><form role="search">Поиск нот</form><div>Таблица нот</div></section>
        <section data-archive-content-reveal class="is-reveal-pending"><nav>Фильтры медиа</nav><div>Таблица медиа</div></section>
        <section data-archive-content-reveal class="is-reveal-pending">Контакты</section>
      </main>`;
  });
  await page.locator('html').evaluate((documentElement) => { documentElement.classList.add('has-js'); });

  const blocks = page.locator('[data-archive-content-reveal]');
  await expect(blocks).toHaveCount(4);
  await Promise.all((await blocks.all()).map((block) => expect(block).toHaveCSS('opacity', '0')));

  await blocks.evaluateAll((nodes) => { nodes.forEach((node) => {
    node.classList.replace('is-reveal-pending', 'is-revealed');
    (node as HTMLElement).style.animationDelay = '999s';
  }); });

  await Promise.all((await blocks.all()).map((block) => expect(block).toHaveCSS('animation-name', 'orlyata-home-media-card-reveal')));
  await Promise.all((await blocks.all()).map((block) => expect(block).toHaveCSS('animation-duration', '0.6s')));
  await Promise.all((await blocks.all()).map((block) => expect(block).toHaveCSS('animation-timing-function', 'cubic-bezier(0, 0, 0.18, 1)')));
  await Promise.all((await blocks.all()).map((block) => expect(block).toHaveCSS('opacity', '0')));
});


test('Archive tables use a 32px filter gap at 393px and follow the mobile scale', async ({ page }) => {
  await page.goto('/iframe.html?id=components-button--variants&viewMode=story');
  await page.locator('#storybook-root').evaluate((root) => {
    root.innerHTML = `
      <div class="orlyata-news__table is-revealed">Таблица новостей</div>
      <div class="orlyata-notes__table is-revealed">Таблица нот</div>
      <div class="orlyata-media-archive__table is-revealed">Таблица медиа</div>`;
  });

  for (const [width, expectedMargin] of [[320, 32 * 320 / 393], [393, 32], [768, 19.2], [1280, 21.3333]] as const) {
    await page.setViewportSize({ width, height: 800 });
    const margins = await page.locator('.orlyata-news__table, .orlyata-notes__table, .orlyata-media-archive__table').evaluateAll((elements) =>
      elements.map((element) => Number.parseFloat(getComputedStyle(element).marginBlockStart))
    );
    for (const margin of margins) {
      expect(margin).toBeCloseTo(expectedMargin, 1);
    }
  }
});
