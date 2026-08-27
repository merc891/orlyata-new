import { expect, test } from '@playwright/test';

import { expectGingerLoaded } from './visual';

const teacherCtaMarkup = `
  <main class="orlyata-home">
    <a class="orlyata-home__history-teachers-link" href="#teachers" aria-label="Перейти к педагогам">
      <span class="orlyata-home__history-teachers-arrow-track" aria-hidden="true">
        <span class="orlyata-home__history-teachers-arrow"><img src="/wp-content/themes/orlyata/assets/icons/button-arrow.svg" alt=""></span>
        <span class="orlyata-home__history-teachers-arrow"><img src="/wp-content/themes/orlyata/assets/icons/button-arrow.svg" alt=""></span>
      </span>
    </a>
  </main>
`;

const sectionHeadsMarkup = `
  <main class="orlyata-home">
    <div class="orlyata-home__news-head"><h2 class="type-heading-2">Новости</h2><a class="orlyata-text-link" href="#news">Все новости</a></div>
    <div class="orlyata-home__section-head"><h2 class="type-heading-2">Медиагалерея</h2><a class="orlyata-text-link" href="#media">Перейти в раздел</a></div>
    <div class="orlyata-home__section-head"><h2 class="type-heading-2">История</h2><a class="orlyata-text-link" href="#history">Подробнее</a></div>
    <div class="orlyata-home__section-head"><h2 class="type-heading-2">Достижения</h2><a class="orlyata-text-link" href="#achievements">Все достижения</a></div>
  </main>
`;

const homeRevealMarkup = `
  <main class="orlyata-home">
    <aside class="orlyata-sidebar">Меню</aside>
    <section class="orlyata-home__hero">
      <div class="orlyata-home__hero-panel orlyata-home__hero-panel--capella"><div class="orlyata-home__hero-panel-content"></div><h1 class="orlyata-home__hero-title"><span class="orlyata-home__hero-title-line"><span class="orlyata-home__hero-title-text">Хоровая</span></span><span class="orlyata-home__hero-title-line"><span class="orlyata-home__hero-title-text">капелла</span></span><span class="orlyata-home__hero-title-line"><span class="orlyata-home__hero-title-text">мальчиков</span></span></h1></div>
      <section class="orlyata-home__hero-panel orlyata-home__hero-panel--news"><div class="orlyata-home__hero-panel-content">Новости</div></section>
    </section>
    <section class="orlyata-home__facts">
      <article class="orlyata-advantage">1</article>
      <article class="orlyata-advantage">2</article>
      <article class="orlyata-advantage">3</article>
      <article class="orlyata-advantage">4</article>
    </section>
  </main>
`;

const mobileNewsMarkup = `
  <main class="orlyata-home">
    <section class="orlyata-home__hero-panel orlyata-home__hero-panel--news" aria-labelledby="mobile-news-title">
      <div class="orlyata-home__hero-panel-content">
        <div class="orlyata-home__news-head"><h2 id="mobile-news-title">Новости</h2><a href="#news">Все новости</a></div>
        <div class="orlyata-home__news-grid">
          <article class="orlyata-news-card">Первая новость</article>
          <article class="orlyata-news-card">Вторая новость</article>
        </div>
      </div>
    </section>
  </main>
`;

async function mountTeacherCta(page: import('@playwright/test').Page): Promise<void> {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/iframe.html?id=components-button--variants&viewMode=story');
  await expectGingerLoaded(page);
  await page.locator('#storybook-root').evaluate((root, markup) => {
    root.innerHTML = markup;
  }, teacherCtaMarkup);
}

async function mountSectionHeads(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/iframe.html?id=components-button--variants&viewMode=story');
  await expectGingerLoaded(page);
  await page.locator('#storybook-root').evaluate((root, markup) => {
    root.innerHTML = markup;
  }, sectionHeadsMarkup);
}

async function mountHomeReveal(page: import('@playwright/test').Page): Promise<void> {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/iframe.html?id=components-button--variants&viewMode=story');
  await expectGingerLoaded(page);
  await page.locator('#storybook-root').evaluate((root, markup) => {
    root.innerHTML = markup;
  }, homeRevealMarkup);
}

test('Home teacher CTA rolls its arrow left-to-right and restores it on pointer leave', async ({ page }) => {
  await mountTeacherCta(page);

  const cta = page.locator('.orlyata-home__history-teachers-link');
  const arrows = cta.locator('.orlyata-home__history-teachers-arrow-track .orlyata-home__history-teachers-arrow');
  const outgoingArrow = arrows.first();
  const incomingArrow = arrows.nth(1);

  await expect(arrows).toHaveCount(2);
  await expect(outgoingArrow).toHaveCSS('transition-duration', '0.4s');
  await expect(outgoingArrow).toHaveCSS('transition-timing-function', 'ease');
  await cta.hover();
  await expect(outgoingArrow).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 24, 0)');
  await expect(incomingArrow).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');

  await page.mouse.move(0, 0);
  await expect(outgoingArrow).toHaveCSS('transform', 'none');
  await expect(incomingArrow).toHaveCSS('transform', 'matrix(1, 0, 0, 1, -24, 0)');
});

test('Home teacher CTA arrow keeps its approved horizontal roll when reduced motion is requested', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await mountTeacherCta(page);

  const cta = page.locator('.orlyata-home__history-teachers-link');
  const outgoingArrow = cta.locator('.orlyata-home__history-teachers-arrow-track .orlyata-home__history-teachers-arrow').first();

  await cta.hover();
  await expect(outgoingArrow).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 24, 0)');
});

test('Home section links align with the bottom edge of their h2 headings on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await mountSectionHeads(page);

  for (const head of await page.locator('.orlyata-home__news-head, .orlyata-home__section-head').all()) {
    const [heading, link] = await Promise.all([head.locator('h2').boundingBox(), head.locator('a').boundingBox()]);

    expect(link === null || heading === null ? undefined : link.y + link.height).toBeCloseTo(
      heading === null ? undefined : heading.y + heading.height,
      1,
    );
  }
});

test('Home news panel keeps its cards in the mobile document flow', async ({ page }) => {
  await mountHomeReveal(page);

  for (const width of [320, 767]) {
    await page.setViewportSize({ width, height: 900 });
    await page.locator('#storybook-root').evaluate((root, markup) => {
      root.innerHTML = markup;
    }, mobileNewsMarkup);

    const panel = page.locator('.orlyata-home__hero-panel--news');
    const content = panel.locator('.orlyata-home__hero-panel-content');
    const grid = panel.locator('.orlyata-home__news-grid');
    const cards = grid.locator('.orlyata-news-card');

    await expect(content).toHaveCSS('position', 'relative');
    await expect(grid).toHaveCSS('position', 'relative');
    await expect(cards).toHaveCount(2);

    const [firstCard, secondCard] = await Promise.all([cards.nth(0).boundingBox(), cards.nth(1).boundingBox()]);
    expect(secondCard?.y).toBeGreaterThan((firstCard?.y ?? 0) + (firstCard?.height ?? 0));
  }
});

test('Home reveals the hero, news and fact cards in the approved entry sequence', async ({ page }) => {
  await mountHomeReveal(page);

  const hero = page.locator('.orlyata-home__hero-panel--capella');
  const news = page.locator('.orlyata-home__hero-panel--news');

  const heroTitle = hero.locator('.orlyata-home__hero-title');
  const heroTitleText = heroTitle.locator('.orlyata-home__hero-title-text');
  const facts = page.locator('.orlyata-home__facts .orlyata-advantage');


  await expect(hero).toHaveCSS('animation-name', 'orlyata-home-hero-panel-mask-reveal');
  await expect(hero).toHaveCSS('animation-duration', '1s');
  await expect(hero).toHaveCSS('animation-timing-function', 'cubic-bezier(0.74, 0, 0, 1)');
  await expect(news).toHaveCSS('animation-name', 'orlyata-home-hero-panel-mask-reveal');
  await expect(news).toHaveCSS('animation-delay', '0s');

  await expect(heroTitle).toHaveCSS('animation-name', 'none');
  await expect(heroTitleText).toHaveCount(3);
  await expect(heroTitleText.nth(0)).toHaveCSS('animation-name', 'orlyata-home-hero-title-fade-in');
  await expect(heroTitleText.nth(0)).toHaveCSS('animation-duration', '0.6s');
  await expect(heroTitleText.nth(0)).toHaveCSS('animation-delay', '0.2s');
  await expect(heroTitleText.nth(0)).toHaveCSS('animation-timing-function', 'cubic-bezier(0.5, 0, 0, 1)');
  expect(await heroTitle.evaluate((title) => title.closest('.orlyata-home__hero-panel-content') === null)).toBe(true);

  await expect(facts.nth(0)).toHaveCSS('animation-name', 'orlyata-home-fact-card-slide-in, orlyata-home-fact-card-fade-in');
  await expect(facts.nth(0)).toHaveCSS('animation-duration', '0.6s, 0.6s');
  await expect(facts.nth(0)).toHaveCSS('animation-timing-function', 'cubic-bezier(0, 0, 0.06, 1), cubic-bezier(0, 0, 0.06, 1)');
  await expect(facts.nth(0)).toHaveCSS('animation-delay', '0.3s, 0.3s');


  await expect(facts.nth(1)).toHaveCSS('animation-delay', '0.3s, 0.3s');
  await expect(facts.nth(2)).toHaveCSS('animation-delay', '0.3s, 0.3s');
  await expect(facts.nth(3)).toHaveCSS('animation-delay', '0.3s, 0.3s');

  await facts.nth(0).evaluate((fact) => {
    fact.style.animationDelay = '999s';
  });
  await expect(facts.nth(0)).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, -40)');
  await expect(facts.nth(0)).toHaveCSS('opacity', '0');
});
