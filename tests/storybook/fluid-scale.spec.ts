import { expect, test } from '@playwright/test';

import { expectGingerLoaded } from './visual';

const desktopAnchors = [
  { height: 960, scale: 1280 / 1920, width: 1280 },
  { height: 1080, scale: 1, width: 1920 },
  { height: 1440, scale: 2560 / 1920, width: 2560 },
  { height: 1688, scale: 2560 / 1920, width: 3000 },
] as const;

async function openFoundations(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/iframe.html?id=foundations-typography--overview&viewMode=story');
  await expectGingerLoaded(page);
}

test('Desktop fluid overrides do not cross the 1279px mode boundary', async ({ page }) => {
  await page.setViewportSize({ width: 1279, height: 900 });
  await openFoundations(page);
  await page.locator('#storybook-root').evaluate((root) => {
    root.innerHTML = [
      '<div class="fluid-boundary-display"></div>',
      '<div class="fluid-boundary-logo"></div>',
      '<div class="fluid-boundary-radius"></div>',
    ].join('');
    const display = root.querySelector<HTMLElement>('.fluid-boundary-display');
    const logo = root.querySelector<HTMLElement>('.fluid-boundary-logo');
    const radius = root.querySelector<HTMLElement>('.fluid-boundary-radius');
    if (display !== null) {
      display.style.width = 'var(--font-size-display)';
    }
    if (logo !== null) {
      logo.style.width = 'var(--sidebar-logo-width)';
    }
    if (radius !== null) {
      radius.style.borderRadius = 'var(--radius-large)';
    }
  });

  const values = await page.locator('#storybook-root').evaluate((root) => ({
    display: root.querySelector<HTMLElement>('.fluid-boundary-display')?.getBoundingClientRect().width ?? 0,
    logo: root.querySelector<HTMLElement>('.fluid-boundary-logo')?.getBoundingClientRect().width ?? 0,
    radius: Number.parseFloat(getComputedStyle(root.querySelector<HTMLElement>('.fluid-boundary-radius') as HTMLElement).borderTopLeftRadius),
  }));

  expect(values.display).toBeCloseTo(63.96875, 2);
  expect(values.logo).toBeCloseTo(180, 2);
  expect(values.radius).toBeCloseTo(18, 2);
});

test('Desktop display type follows 66.6667/100/133.3333 and caps at 2560', async ({ page }) => {
  await openFoundations(page);
  await page.locator('#storybook-root').evaluate((root) => {
    root.innerHTML = '<div class="fluid-scale-probe" aria-hidden="true"></div>';
    const probe = root.querySelector<HTMLElement>('.fluid-scale-probe');
    if (probe !== null) {
      probe.style.width = 'var(--font-size-display)';
    }
  });

  for (const anchor of desktopAnchors) {
    await page.setViewportSize({ width: anchor.width, height: anchor.height });
    const width = await page.locator('.fluid-scale-probe').evaluate((probe) => probe.getBoundingClientRect().width);
    expect(width / 80).toBeCloseTo(anchor.scale, 3);
  }
});

test('Desktop shell geometry and radii follow S while controls keep the 48px minimum', async ({ page }) => {
  await openFoundations(page);
  await page.locator('#storybook-root').evaluate((root) => {
    root.innerHTML = [
      '<div class="fluid-scale-logo" aria-hidden="true"></div>',
      '<div class="fluid-scale-control" aria-hidden="true"></div>',
      '<div class="fluid-scale-radius" aria-hidden="true"></div>',
      '<div class="fluid-scale-editorial" aria-hidden="true"></div>',
      '<div class="fluid-scale-footer" aria-hidden="true"></div>',
      '<div class="fluid-scale-footer-height" aria-hidden="true"></div>',
      '<div class="fluid-scale-focus" aria-hidden="true"></div>',
      '<div class="fluid-scale-section-gap" aria-hidden="true"></div>',
      '<div class="fluid-scale-gutter" aria-hidden="true"></div>',
    ].join('');
    const dimensions: Record<string, string> = {
      '.fluid-scale-control': 'var(--button-height)',
      '.fluid-scale-editorial': 'var(--layout-editorial-max-width)',
      '.fluid-scale-footer': 'var(--footer-reference-width)',
      '.fluid-scale-footer-height': 'var(--footer-height)',
      '.fluid-scale-focus': 'var(--focus-ring-width)',
      '.fluid-scale-gutter': 'var(--layout-content-gutter)',
      '.fluid-scale-logo': 'var(--sidebar-logo-width)',
      '.fluid-scale-section-gap': 'var(--layout-section-gap)',
    };
    for (const [selector, width] of Object.entries(dimensions)) {
      const element = root.querySelector<HTMLElement>(selector);
      if (element !== null) {
        element.style.width = width;
      }
    }
    const radius = root.querySelector<HTMLElement>('.fluid-scale-radius');
    if (radius !== null) {
      radius.style.borderRadius = 'var(--radius-large)';
    }
  });

  for (const anchor of desktopAnchors) {
    await page.setViewportSize({ width: anchor.width, height: anchor.height });
    const values = await page.locator('#storybook-root').evaluate((root) => {
      const width = (selector: string): number => (
        root.querySelector<HTMLElement>(selector)?.getBoundingClientRect().width ?? 0
      );
      const radius = Number.parseFloat(getComputedStyle(
        root.querySelector<HTMLElement>('.fluid-scale-radius') as HTMLElement,
      ).borderTopLeftRadius);
      return {
        control: width('.fluid-scale-control'),
        editorial: width('.fluid-scale-editorial'),
        footer: width('.fluid-scale-footer'),
        footerHeight: width('.fluid-scale-footer-height'),
        focus: width('.fluid-scale-focus'),
        gutter: width('.fluid-scale-gutter'),
        logo: width('.fluid-scale-logo'),
        radius,
        sectionGap: width('.fluid-scale-section-gap'),
      };
    });
    expect(values.logo / 240).toBeCloseTo(anchor.scale, 3);
    expect(values.radius / 24).toBeCloseTo(anchor.scale, 3);
    expect(values.editorial / 1622).toBeCloseTo(anchor.scale, 3);
    expect(values.footer / 1616).toBeCloseTo(anchor.scale, 3);
    expect(values.footerHeight / 469).toBeCloseTo(anchor.scale, 3);
    expect(values.focus).toBeCloseTo(2 * anchor.scale, 1);
    expect(values.sectionGap / 120).toBeCloseTo(anchor.scale, 3);
    expect(values.gutter).toBeCloseTo(Math.max(24, 24 * anchor.scale), 1);
    expect(values.control).toBeCloseTo(Math.max(48, 64 * anchor.scale), 1);
  }
});

test('Button, NewsCard and MediaCard typography use the same desktop scale', async ({ page }) => {
  await page.goto('/iframe.html?id=components-button--variants&viewMode=story');
  await expectGingerLoaded(page);
  await page.locator('#storybook-root').evaluate((root) => {
    root.innerHTML = [
      '<button class="orlyata-button orlyata-button--primary" type="button">Кнопка</button>',
      '<article class="orlyata-news-card"><h3 class="orlyata-news-card__title">Новость</h3></article>',
      '<article class="orlyata-media-card orlyata-media-card--big"><h3 class="orlyata-media-card__title">Большая карточка</h3></article>',
      '<article class="orlyata-media-card orlyata-media-card--small"><h3 class="orlyata-media-card__title">Малая карточка</h3></article>',
    ].join('');
  });

  for (const anchor of desktopAnchors) {
    await page.setViewportSize({ width: anchor.width, height: anchor.height });
    const values = await page.locator('#storybook-root').evaluate((root) => {
      const size = (selector: string): number => Number.parseFloat(
        getComputedStyle(root.querySelector<HTMLElement>(selector) as HTMLElement).fontSize,
      );
      return {
        button: size('.orlyata-button--primary'),
        mediaBig: size('.orlyata-media-card--big .orlyata-media-card__title'),
        mediaSmall: size('.orlyata-media-card--small .orlyata-media-card__title'),
        news: size('.orlyata-news-card__title'),
      };
    });
    expect(values.button / 20).toBeCloseTo(anchor.scale, 3);
    expect(values.news / 24).toBeCloseTo(anchor.scale, 3);
    expect(values.mediaBig / 36).toBeCloseTo(anchor.scale, 3);
    expect(values.mediaSmall / 24).toBeCloseTo(anchor.scale, 3);
  }
});

test('DataTable desktop rows follow S', async ({ page }) => {
  await page.goto('/iframe.html?id=components-data-table--playground&viewMode=story');
  await expectGingerLoaded(page);
  await page.locator('#storybook-root').evaluate((root) => {
    root.innerHTML = [
      '<table class="orlyata-data-table">',
      '<tbody><tr><td data-label="Год">2026</td></tr></tbody>',
      '</table>',
    ].join('');
  });

  for (const anchor of desktopAnchors) {
    await page.setViewportSize({ width: anchor.width, height: anchor.height });
    const height = await page.locator('.orlyata-data-table td').first().evaluate(
      (cell) => cell.getBoundingClientRect().height,
    );
    expect(height).toBeCloseTo(48 * anchor.scale, 1);
  }
});

test('Desktop cards and ApplicationForm scale their complete geometry', async ({ page }) => {
  await page.goto('/iframe.html?id=components-button--variants&viewMode=story');
  await expectGingerLoaded(page);
  await page.locator('#storybook-root').evaluate((root) => {
    root.innerHTML = [
      '<article class="orlyata-advantage"></article>',
      '<article class="orlyata-news-card"></article>',
      '<article class="orlyata-media-card orlyata-media-card--big"></article>',
      '<article class="orlyata-media-card orlyata-media-card--small"></article>',
      '<form class="orlyata-application-form"></form>',
    ].join('');
  });

  const measurements = new Map<number, Record<string, { height: number; width: number }>>();
  for (const anchor of desktopAnchors) {
    await page.setViewportSize({ width: anchor.width, height: anchor.height });
    measurements.set(anchor.width, await page.locator('#storybook-root').evaluate((root) => {
      const selectors = [
        '.orlyata-advantage',
        '.orlyata-news-card',
        '.orlyata-media-card--big',
        '.orlyata-media-card--small',
        '.orlyata-application-form',
      ];
      return Object.fromEntries(selectors.map((selector) => {
        const box = root.querySelector<HTMLElement>(selector)?.getBoundingClientRect();
        return [selector, { height: box?.height ?? 0, width: box?.width ?? 0 }];
      }));
    }));
  }

  const reference = measurements.get(1920);
  expect(reference).toBeDefined();
  if (reference === undefined) {
    return;
  }

  expect(reference['.orlyata-news-card']?.width).toBeCloseTo(365, 1);
  expect(reference['.orlyata-news-card']?.height).toBeCloseTo(270, 1);

  for (const anchor of desktopAnchors) {
    const current = measurements.get(anchor.width);
    expect(current).toBeDefined();
    if (current === undefined) {
      continue;
    }
    expect(current['.orlyata-advantage']?.width).toBeDefined();
    expect((current['.orlyata-advantage']?.width ?? 0) / (current['.orlyata-advantage']?.height ?? 1)).toBeCloseTo(388 / 170, 3);
    expect((current['.orlyata-news-card']?.width ?? 0) / (current['.orlyata-news-card']?.height ?? 1)).toBeCloseTo(365 / 270, 3);
    expect((current['.orlyata-media-card--big']?.width ?? 0) / (current['.orlyata-media-card--big']?.height ?? 1)).toBeCloseTo(797 / 540, 3);
    expect((current['.orlyata-media-card--small']?.width ?? 0) / (current['.orlyata-media-card--small']?.height ?? 1)).toBeCloseTo(390 / 540, 3);

    for (const selector of Object.keys(reference)) {
      const referenceBox = reference[selector];
      const currentBox = current[selector];
      expect(referenceBox).toBeDefined();
      expect(currentBox).toBeDefined();
      if (referenceBox === undefined || currentBox === undefined) {
        continue;
      }
      expect(currentBox.width / referenceBox.width).toBeCloseTo(anchor.scale, 3);
      expect(currentBox.height / referenceBox.height).toBeCloseTo(anchor.scale, 3);
    }
  }
});
