import { expect, test } from '@playwright/test';

import { expectGingerLoaded } from './visual';

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
      mediaBigRatio: ratio('.orlyata-media-card--big'),
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
  await page.locator('video').evaluateAll(async (nodes) => {
    const videos = nodes as HTMLVideoElement[];
    await Promise.all(videos.map(async (video) => {
      video.pause();
      if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        await new Promise<void>((resolve) => {
          video.addEventListener('loadeddata', () => {
            resolve();
          }, { once: true });
        });
      }
      video.currentTime = 0;
    }));
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
