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
  await page.locator('html').evaluate((documentElement) => documentElement.classList.add('has-js'));

  const blocks = page.locator('[data-archive-content-reveal]');
  await expect(blocks).toHaveCount(4);
  await Promise.all((await blocks.all()).map((block) => expect(block).toHaveCSS('opacity', '0')));

  await blocks.evaluateAll((nodes) => nodes.forEach((node) => {
    node.classList.replace('is-reveal-pending', 'is-revealed');
    (node as HTMLElement).style.animationDelay = '999s';
  }));

  await Promise.all((await blocks.all()).map((block) => expect(block).toHaveCSS('animation-name', 'orlyata-home-media-card-reveal')));
  await Promise.all((await blocks.all()).map((block) => expect(block).toHaveCSS('animation-duration', '0.6s')));
  await Promise.all((await blocks.all()).map((block) => expect(block).toHaveCSS('animation-timing-function', 'cubic-bezier(0, 0, 0.18, 1)')));
  await Promise.all((await blocks.all()).map((block) => expect(block).toHaveCSS('opacity', '0')));
});
