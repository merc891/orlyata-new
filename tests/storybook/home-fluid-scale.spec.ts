import { expect, test } from '@playwright/test';

import { expectGingerLoaded } from './visual';

test.setTimeout(120_000);

const desktopViewports = [
  { height: 960, scale: 1280 / 1920, width: 1280 },
  { height: 900, scale: 1440 / 1920, width: 1440 },
  { height: 1000, scale: 1600 / 1920, width: 1600 },
  { height: 1080, scale: 1, width: 1920 },
  { height: 1260, scale: 2240 / 1920, width: 2240 },
  { height: 1440, scale: 2560 / 1920, width: 2560 },
] as const;

interface HomeMetrics {
  advantagePadding: number;
  advantageRatio: number;
  applicationRatio: number;
  displayFontSize: number;
  footerRatio: number;
  historyRatio: number;
  mediaBigRatio: number;
  mediaSmallRatio: number;
  newsPadding: number;
  newsHeight: number;
  newsRatio: number;
  newsTitleFontSize: number;
  newsWidth: number;
  overflow: number;
  sidebarWidth: number;
}

async function openHome(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/iframe.html?id=pages-home--desktop-preview&viewMode=story');
  await expectGingerLoaded(page);
  await expect(page.locator('.orlyata-home')).toBeVisible();
}

async function readMetrics(page: import('@playwright/test').Page): Promise<HomeMetrics> {
  return page.locator('.orlyata-home').evaluate((home) => {
    const box = (selector: string): DOMRect => {
      const value = home.querySelector<HTMLElement>(selector)?.getBoundingClientRect();
      if (value === undefined) {
        throw new Error('Missing HomeDesktopPreview selector: ' + selector);
      }
      return value;
    };
    const number = (selector: string, property: 'fontSize' | 'paddingLeft' | 'paddingTop'): number => {
      const value = home.querySelector<HTMLElement>(selector);
      if (value === null) {
        throw new Error('Missing HomeDesktopPreview selector: ' + selector);
      }
      return Number.parseFloat(getComputedStyle(value)[property]);
    };
    const ratio = (selector: string): number => {
      const value = box(selector);
      return value.width / value.height;
    };

    return {
      advantagePadding: number('.orlyata-advantage', 'paddingTop'),
      advantageRatio: ratio('.orlyata-advantage'),
      applicationRatio: ratio('.orlyata-home__application-surface'),
      displayFontSize: number('.orlyata-home__hero-title', 'fontSize'),
      footerRatio: ratio('.orlyata-footer'),
      historyRatio: ratio('.orlyata-home__history'),
      mediaBigHeight: box('.orlyata-media-card--big').height,
      mediaBigRatio: ratio('.orlyata-media-card--big'),
      mediaSmallHeight: box('.orlyata-media-card--small').height,
      mediaSmallRatio: ratio('.orlyata-media-card--small'),
      newsPadding: number('.orlyata-home__news-grid .orlyata-news-card', 'paddingLeft'),
      newsHeight: box('.orlyata-home__news-grid .orlyata-news-card').height,
      newsRatio: ratio('.orlyata-home__news-grid .orlyata-news-card'),
      newsTitleFontSize: number('.orlyata-home__news-grid .orlyata-news-card__title', 'fontSize'),
      newsWidth: box('.orlyata-home__news-grid .orlyata-news-card').width,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      sidebarWidth: box('.orlyata-sidebar').width,
    };
  });
}

test('HomeDesktopPreview renders the production composition without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await openHome(page);

  await expect(page.getByRole('heading', { level: 1, name: 'Хоровая капелла мальчиков' })).toBeVisible();
  await expect(page.locator('.orlyata-home__news-grid .orlyata-news-card')).toHaveCount(2);
  await expect(page.locator('.orlyata-home__facts .orlyata-advantage')).toHaveCount(4);
  await expect(page.locator('.orlyata-home__media-grid .orlyata-media-card')).toHaveCount(3);
  await expect(page.locator('.orlyata-home__application .orlyata-application-form')).toHaveCount(1);
  await expect(page.locator('.orlyata-home__achievements .orlyata-data-table')).toHaveCount(1);
  await expect(page.locator('.orlyata-footer')).toHaveCount(1);
  expect((await readMetrics(page)).overflow).toBeLessThanOrEqual(1);
});

test('Home desktop shell, type and component internals follow one scale coefficient', async ({ page }) => {
  await openHome(page);
  const measurements = new Map<number, HomeMetrics>();

  for (const viewport of desktopViewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    measurements.set(viewport.width, await readMetrics(page));
  }

  const reference = measurements.get(1920);
  expect(reference).toBeDefined();
  if (reference === undefined) {
    return;
  }

  expect(reference.newsWidth).toBeCloseTo(365, 1);
  expect(reference.newsHeight).toBeCloseTo(270, 1);

  for (const viewport of desktopViewports) {
    const current = measurements.get(viewport.width);
    expect(current).toBeDefined();
    if (current === undefined) {
      continue;
    }
    expect(current.sidebarWidth / reference.sidebarWidth).toBeCloseTo(viewport.scale, 3);
    expect(current.displayFontSize / reference.displayFontSize).toBeCloseTo(viewport.scale, 3);
    expect(current.newsTitleFontSize / reference.newsTitleFontSize).toBeCloseTo(viewport.scale, 3);
    expect(current.newsPadding / reference.newsPadding).toBeCloseTo(viewport.scale, 3);
    expect(current.advantagePadding / reference.advantagePadding).toBeCloseTo(viewport.scale, 3);
  }
});

test('Home page preserves component-owned aspect ratios across desktop', async ({ page }) => {
  await openHome(page);

  for (const viewport of desktopViewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    const metrics = await readMetrics(page);
    expect(metrics.newsRatio).toBeCloseTo(365 / 270, 3);
    expect(metrics.advantageRatio).toBeCloseTo(388 / 170, 3);
    expect(metrics.mediaBigRatio).toBeCloseTo(797 / 540, 3);
    expect(metrics.mediaSmallRatio).toBeCloseTo(390 / 540, 3);
  }
});

test('Home History, application CTA and Footer preserve their 1920 shape', async ({ page }) => {
  await openHome(page);
  const measurements = new Map<number, HomeMetrics>();

  for (const viewport of desktopViewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    measurements.set(viewport.width, await readMetrics(page));
  }

  const reference = measurements.get(1920);
  expect(reference).toBeDefined();
  if (reference === undefined) {
    return;
  }

  for (const viewport of desktopViewports) {
    const current = measurements.get(viewport.width);
    expect(current).toBeDefined();
    if (current === undefined) {
      continue;
    }
    expect(current.historyRatio).toBeCloseTo(reference.historyRatio, 2);
    expect(current.applicationRatio).toBeCloseTo(reference.applicationRatio, 2);
    expect(current.footerRatio).toBeCloseTo(reference.footerRatio, 2);
    expect(current.overflow).toBeLessThanOrEqual(1);
  }
});


const homeVisualViewports = [
  { height: 960, name: '1280', width: 1280 },
  { height: 1080, name: '1920', width: 1920 },
  { height: 1440, name: '2560', width: 2560 },
] as const;

async function stabilizeHomeVisual(page: import('@playwright/test').Page): Promise<void> {
  await page.waitForFunction(() => [...document.images].every((image) => image.complete));
  await page.locator('video').evaluateAll((nodes) => {
    const videos = nodes as HTMLVideoElement[];
    videos.forEach((video) => {
      video.pause();
      if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
        video.currentTime = 0;
      }
    });
  });
}

for (const viewport of homeVisualViewports) {
  test('Home desktop visual ' + viewport.name, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await openHome(page);
    await stabilizeHomeVisual(page);

    await expect(page).toHaveScreenshot('pages-home--desktop-preview-' + viewport.name + '.png', {
      fullPage: true,
      timeout: 45_000,
    });
  });
}

for (const viewport of [
  { height: 1024, name: '1279', width: 1279 },
  { height: 1024, name: '768', width: 768 },
] as const) {
  test('Home tablet visual ' + viewport.name, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await openHome(page);
    await stabilizeHomeVisual(page);

    await expect(page).toHaveScreenshot('pages-home--tablet-preview-' + viewport.name + '.png', {
      fullPage: true,
      timeout: 45_000,
    });
  });
}

test('Home preserves owned card geometry and readable metadata across tablet and mobile', async ({ page }) => {
  for (const width of [1279, 1024, 768, 767, 480, 320]) {
    await page.setViewportSize({ width, height: 1024 });
    await openHome(page);
    const layout = await page.locator('.orlyata-home').evaluate((home) => {
      const box = (selector: string): DOMRect => {
        const element = home.querySelector<HTMLElement>(selector);
        if (element === null) {
          throw new Error('Missing Home responsive selector: ' + selector);
        }
        return element.getBoundingClientRect();
      };
      const element = (selector: string): HTMLElement => {
        const value = home.querySelector<HTMLElement>(selector);
        if (value === null) {
          throw new Error('Missing Home responsive selector: ' + selector);
        }
        return value;
      };
      const style = (selector: string, property: 'aspectRatio' | 'fontSize'): string => {
        return getComputedStyle(element(selector))[property];
      };
      const ratio = (selector: string): number => {
        const value = box(selector);
        return value.width / value.height;
      };

      return {
      footer: getComputedStyle(element('.orlyata-footer')).display,
      grid: getComputedStyle(element('.orlyata-home__content-grid')).gridTemplateColumns,
      newsAspectRatio: style('.orlyata-home__news-grid .orlyata-news-card', 'aspectRatio'),
      newsBadgeFontSize: Number.parseFloat(style('.orlyata-home__news-grid .orlyata-badge', 'fontSize')),
      newsRatio: ratio('.orlyata-home__news-grid .orlyata-news-card'),
      newsPosition: getComputedStyle(element('.orlyata-home__news-grid')).position,
      mediaBigHeight: box('.orlyata-media-card--big').height,
      mediaBigRatio: ratio('.orlyata-media-card--big'),
      mediaSmallHeight: box('.orlyata-media-card--small').height,
      mediaSmallRatio: ratio('.orlyata-media-card--small'),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      sidebar: getComputedStyle(element('.orlyata-sidebar')).display,
      };
    });

    expect(layout.overflow).toBeLessThanOrEqual(1);
    expect(layout.footer).not.toBe("none");
    expect(layout.sidebar).not.toBe("none");
    expect(layout.newsAspectRatio).toBe('365 / 270');
    expect(layout.newsRatio).toBeCloseTo(365 / 270, 3);
    expect(layout.mediaBigRatio).toBeCloseTo(797 / 540, 3);
    expect(layout.mediaSmallRatio).toBeCloseTo(390 / 540, 3);
    if (width <= 767) {
      expect(layout.newsBadgeFontSize).toBeGreaterThanOrEqual(14);
      expect(layout.grid).not.toContain(' ');
      expect(layout.newsPosition).toBe('relative');
    } else {
      expect(layout.grid).toContain(' ');
    }
  }
});

test('Home tablet first blocks use the approved full-width composition and desktop component styles', async ({ page }) => {
  for (const width of [1279, 768]) {
    await page.setViewportSize({ width, height: 1024 });
    await openHome(page);
    const layout = await page.locator('.orlyata-home').evaluate((home) => {
      const element = (selector: string): HTMLElement => {
        const value = home.querySelector<HTMLElement>(selector);
        if (value === null) {
          throw new Error('Missing Home tablet composition selector: ' + selector);
        }
        return value;
      };
      const box = (selector: string): DOMRect => element(selector).getBoundingClientRect();
      const style = (selector: string): CSSStyleDeclaration => getComputedStyle(element(selector));

      return {
        contentWidth: box('.orlyata-home__content-grid').width,
        factsColumns: style('.orlyata-home__facts').gridTemplateColumns,
        heroColumns: style('.orlyata-home__hero').gridTemplateColumns,
        heroVideoHeight: box('.orlyata-home__hero-panel--capella').height,
        heroNewsHeight: box('.orlyata-home__hero-panel--news').height,
        heroTitleFontSize: Number.parseFloat(style('.orlyata-home__hero-title').fontSize),
        heroVideoWidth: box('.orlyata-home__hero-panel--capella').width,
        mediaBigHeight: box('.orlyata-media-card--big').height,
        mediaBigWidth: box('.orlyata-media-card--big').width,
        mediaColumns: style('.orlyata-home__media-grid').gridTemplateColumns,
        mediaSmallHeight: box('.orlyata-media-card--small').height,
        newsBadgeFontSize: Number.parseFloat(style('.orlyata-news-card .orlyata-badge').fontSize),
        newsBadgeHeight: box('.orlyata-news-card .orlyata-badge').height,
        newsColumns: style('.orlyata-home__news-grid').gridTemplateColumns,
        newsHeadingFontSize: Number.parseFloat(style('.orlyata-home__news-head .type-heading-2').fontSize),
        newsLinkFontSize: Number.parseFloat(style('.orlyata-home__news-head .orlyata-text-link').fontSize),
        newsTitleFontSize: Number.parseFloat(style('.orlyata-news-card__title').fontSize),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });

    expect(layout.overflow).toBeLessThanOrEqual(1);
    expect(layout.heroColumns).not.toContain(' ');
    expect(layout.heroVideoWidth).toBeCloseTo(layout.contentWidth, 1);
    expect(layout.heroVideoHeight).toBeGreaterThan(0);
    expect(layout.heroNewsHeight).toBeGreaterThan(0);
    expect(layout.newsColumns).toContain(' ');
    if (width === 1279) {
      expect(layout.heroTitleFontSize).toBeCloseTo(80, 1);
      expect(layout.newsHeadingFontSize).toBeCloseTo(44, 1);
      expect(layout.newsLinkFontSize).toBeCloseTo(20, 1);
      expect(layout.newsTitleFontSize).toBeCloseTo(24, 1);
      expect(layout.newsBadgeFontSize).toBeCloseTo(20, 1);
      expect(layout.newsBadgeHeight).toBeGreaterThanOrEqual(64);
    } else {
      expect(layout.heroTitleFontSize).toBeCloseTo(80 * 768 / 1279, 1);
      expect(layout.newsHeadingFontSize).toBeCloseTo(44 * 768 / 1279, 1);
      expect(layout.newsLinkFontSize).toBeCloseTo(20 * 768 / 1279, 1);
      expect(layout.newsTitleFontSize).toBeCloseTo(24 * 768 / 1279, 1);
      expect(layout.newsBadgeFontSize).toBeCloseTo(20 * 768 / 1279, 1);
      expect(layout.newsBadgeHeight).toBeGreaterThanOrEqual(48);
    }
    expect(layout.factsColumns.trim().split(' ').length).toBe(4);
    expect(layout.mediaColumns.trim().split(' ').length).toBe(2);
    expect(layout.mediaBigWidth).toBeCloseTo(layout.contentWidth, 1);
    expect(layout.mediaBigHeight / layout.mediaBigWidth).toBeCloseTo(540 / 797, 2);
    expect(layout.mediaSmallHeight).toBeGreaterThan(0);
  }
});
