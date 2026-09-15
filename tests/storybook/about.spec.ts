import { expect, test } from "@playwright/test";

import { expectGingerLoaded } from "./visual";

test("About mobile CTA surface is full-bleed", async ({ page }) => {
  for (const width of [320, 393, 767]) {
    await page.setViewportSize({ width, height: 852 });
    await page.goto(
      "/iframe.html?id=pages-about--desktop-preview&viewMode=story",
    );
    await expectGingerLoaded(page);

    const surface = await page
      .locator(".orlyata-about__application .orlyata-home__application-surface")
      .boundingBox();
    expect(surface === null ? 0 : surface.x).toBeCloseTo(0, 1);
    expect(surface === null ? 0 : surface.width).toBeCloseTo(width, 1);
  }
});

test("About mobile intro uses the shared Heading 3 role", async ({ page }) => {
  for (const width of [320, 393, 767]) {
    await page.setViewportSize({ width, height: 852 });
    await page.goto(
      "/iframe.html?id=pages-about--desktop-preview&viewMode=story",
    );
    await expectGingerLoaded(page);

    const typography = await page
      .locator(".orlyata-about__lead")
      .evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          fontSize: Number.parseFloat(style.fontSize),
          letterSpacing: Number.parseFloat(style.letterSpacing),
        };
      });
    const scale = width / 393;
    expect(typography.fontSize).toBeCloseTo(20 * scale, 1);
    expect(typography.letterSpacing).toBeCloseTo(-1 * scale, 1);
  }
});

test("About intro retains Lead markup on desktop and tablet", async ({ page }) => {
  for (const width of [1920, 1279]) {
    await page.setViewportSize({ width, height: 1080 });
    await page.goto("/iframe.html?id=pages-about--desktop-preview&viewMode=story");
    await expectGingerLoaded(page);
    await expect(page.locator(".orlyata-about__lead")).toHaveClass(/type-lead/);
    await expect(page.locator(".orlyata-about__lead")).not.toHaveClass(/type-heading-3/);
  }
});

test("About achievements keeps the shared Home heading-to-table gap on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 393, height: 852 });

  const readGap = async (sectionSelector: string): Promise<number> =>
    page.locator(sectionSelector).evaluate((section) => {
      const heading = section.querySelector<HTMLElement>(
        ".orlyata-home__section-head",
      );
      const table = section.querySelector<HTMLElement>(".orlyata-data-table");
      if (heading === null || table === null) {
        throw new Error("Missing achievements heading or table");
      }
      return (
        table.getBoundingClientRect().top -
        heading.getBoundingClientRect().bottom
      );
    });

  await page.goto("/iframe.html?id=pages-home--desktop-preview&viewMode=story");
  await expectGingerLoaded(page);
  const homeGap = await readGap(".orlyata-home__achievements");

  await page.goto(
    "/iframe.html?id=pages-about--desktop-preview&viewMode=story",
  );
  await expectGingerLoaded(page);
  await expect
    .poll(() => readGap(".orlyata-about__achievements"))
    .toBeCloseTo(homeGap, 1);
});

for (const width of [320, 393, 767]) {
  test(
    "About mobile keeps one major gap around the shared application section at " +
      String(width) +
      " px",
    async ({ page }) => {
      await page.setViewportSize({ width, height: 852 });
      await page.goto(
        "/iframe.html?id=pages-about--desktop-preview&viewMode=story",
      );
      await expectGingerLoaded(page);

      const gaps = await page.evaluate(() => {
        const box = (selector: string): DOMRect => {
          const element = document.querySelector<HTMLElement>(selector);
          if (element === null) {
            throw new Error("Missing About mobile section: " + selector);
          }
          return element.getBoundingClientRect();
        };
        const teachers = box(".orlyata-about__teachers");
        const application = box(".orlyata-about__application");
        const achievements = box(".orlyata-about__achievements");
        const grid = document.querySelector<HTMLElement>(
          ".orlyata-about__grid",
        );
        if (grid === null) {
          throw new Error("Missing About mobile grid");
        }

        return {
          applicationToAchievements: achievements.top - application.bottom,
          gridGap: Number.parseFloat(getComputedStyle(grid).rowGap),
          teachersToApplication: application.top - teachers.bottom,
        };
      });

      expect(gaps.teachersToApplication).toBeCloseTo(gaps.gridGap, 1);
      expect(gaps.applicationToAchievements).toBeCloseTo(gaps.gridGap, 1);
      if (width === 393) {
        expect(gaps.gridGap).toBeCloseTo(96, 1);
      }
    },
  );
}

for (const width of [320, 393, 767]) {
  test(
    "About achievements uses the shared Home mobile DataTable composition at " +
      String(width) +
      " px",
    async ({ page }) => {
      await page.setViewportSize({ width, height: 852 });

      await page.goto(
        "/iframe.html?id=pages-home--desktop-preview&viewMode=story",
      );
      await expectGingerLoaded(page);
      const homeTableStyles = await page
        .locator(
          ".orlyata-home__achievements .orlyata-data-table--achievements tbody tr",
        )
        .first()
        .evaluate((row) => {
          const styles = getComputedStyle(row);
          return {
            display: styles.display,
            gridTemplateColumns: styles.gridTemplateColumns,
            rowGap: styles.rowGap,
          };
        });

      await page.goto(
        "/iframe.html?id=pages-about--desktop-preview&viewMode=story",
      );
      await expectGingerLoaded(page);
      const section = page.locator(".orlyata-about__achievements");
      const row = section
        .locator(".orlyata-data-table--achievements tbody tr")
        .first();
      await expect(section.locator(".orlyata-home__section-head")).toHaveCount(
        1,
      );
      await expect(section.locator(".orlyata-home__table-wrap")).toHaveCount(1);
      await expect(row).toHaveCSS("display", homeTableStyles.display);
      await expect(row).toHaveCSS(
        "grid-template-columns",
        homeTableStyles.gridTemplateColumns,
      );
      await expect(row).toHaveCSS("row-gap", homeTableStyles.rowGap);
      expect(
        await section.evaluate(
          (element) => element.scrollWidth <= element.clientWidth,
        ),
      ).toBe(true);
    },
  );
}

for (const width of [320, 393, 767]) {
  test(
    "About application title uses the shared Home mobile typography at " +
      String(width) +
      " px",
    async ({ page }) => {
      await page.setViewportSize({ width, height: 852 });

      await page.goto(
        "/iframe.html?id=pages-home--desktop-preview&viewMode=story",
      );
      await expectGingerLoaded(page);
      const homeTitleStyles = await page
        .locator(".orlyata-home__application-copy h2")
        .evaluate((title) => {
          const styles = getComputedStyle(title);
          return {
            fontSize: styles.fontSize,
            fontWeight: styles.fontWeight,
            letterSpacing: styles.letterSpacing,
            lineHeight: styles.lineHeight,
          };
        });

      await page.goto(
        "/iframe.html?id=pages-about--desktop-preview&viewMode=story",
      );
      await expectGingerLoaded(page);
      const aboutTitle = page.locator(".orlyata-about__application > h2");
      await expect(aboutTitle).toHaveCSS("font-size", homeTitleStyles.fontSize);
      await expect(aboutTitle).toHaveCSS(
        "font-weight",
        homeTitleStyles.fontWeight,
      );
      await expect(aboutTitle).toHaveCSS(
        "letter-spacing",
        homeTitleStyles.letterSpacing,
      );
      await expect(aboutTitle).toHaveCSS(
        "line-height",
        homeTitleStyles.lineHeight,
      );
    },
  );
}

test("About tablet keeps one section gap from form to achievements", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1279, height: 1080 });
  await page.goto(
    "/iframe.html?id=pages-about--desktop-preview&viewMode=story",
  );
  await expectGingerLoaded(page);
  const surface = page.locator(
    ".orlyata-about__application .orlyata-home__application-surface",
  );
  const heading = page.locator(".orlyata-about__achievements h2");
  await expect(surface).toHaveCount(1);
  await expect(heading).toHaveCount(1);
  const [surfaceBox, headingBox] = await Promise.all([
    surface.boundingBox(),
    heading.boundingBox(),
  ]);
  if (surfaceBox === null || headingBox === null)
    throw new Error("Missing About form-to-achievements geometry");
  const gap = headingBox.y - surfaceBox.y - surfaceBox.height;
  expect(gap).toBeCloseTo(120, 1);
});

test("About CTA uses the shared section gap after Teachers", async ({
  page,
}) => {
  for (const sample of [
    { width: 1279, desktop: false },
    { width: 1920, desktop: true },
  ]) {
    await page.setViewportSize({ width: sample.width, height: 1080 });
    let homeGap: number | undefined;
    if (sample.desktop) {
      await page.goto(
        "/iframe.html?id=pages-home--desktop-preview&viewMode=story",
      );
      await expectGingerLoaded(page);
      const homeTitle = page.locator(".orlyata-home__application-title");
      const homeHistory = page.locator(".orlyata-home__history");
      await expect(homeTitle).toHaveCount(1);
      await expect(homeHistory).toHaveCount(1);
      homeGap = await page.evaluate(() => {
        const history = document.querySelector<HTMLElement>(
          ".orlyata-home__history",
        ) as HTMLElement;
        const title = document.querySelector<HTMLElement>(
          ".orlyata-home__application-title",
        ) as HTMLElement;
        return (
          title.getBoundingClientRect().top -
          history.getBoundingClientRect().bottom
        );
      });
    }
    await page.goto(
      "/iframe.html?id=pages-about--desktop-preview&viewMode=story",
    );
    await expectGingerLoaded(page);
    const teachers = page.locator(".orlyata-about__teachers");
    const title = page.locator(
      ".orlyata-about__application .orlyata-home__application-title",
    );
    const grid = page.locator(".orlyata-about__grid");
    await expect(teachers).toHaveCount(1);
    await expect(title).toHaveCount(1);
    await expect(grid).toHaveCount(1);
    const gap = await page.evaluate(() => {
      const teachersElement = document.querySelector<HTMLElement>(
        ".orlyata-about__teachers",
      ) as HTMLElement;
      const titleElement = document.querySelector<HTMLElement>(
        ".orlyata-about__application .orlyata-home__application-title",
      ) as HTMLElement;
      const gridElement = document.querySelector<HTMLElement>(
        ".orlyata-about__grid",
      ) as HTMLElement;
      return {
        value:
          titleElement.getBoundingClientRect().top -
          teachersElement.getBoundingClientRect().bottom,
        gridGap: parseFloat(getComputedStyle(gridElement).rowGap),
      };
    });
    expect(gap.value).toBeCloseTo(gap.gridGap, 1);
    if (sample.desktop && homeGap === undefined)
      throw new Error("Missing Home CTA gap");
    if (sample.desktop) {
      expect(gap.value).toBeCloseTo(homeGap, 1);
      expect(gap.value).toBeCloseTo(120, 1);
    }
  }
});

test("Application CTA uses the Figma inline concert icon", async ({
  page,
}) => {
  for (const width of [1279, 1920]) {
    await page.setViewportSize({ width, height: 1080 });
    await page.goto(
      "/iframe.html?id=pages-about--desktop-preview&viewMode=story",
    );
    await expectGingerLoaded(page);
    const title = page.locator(
      ".orlyata-about__application .orlyata-home__application-title",
    );
    const icon = title.locator(".orlyata-home__application-title-icon img");

    await expect(title).toContainText(
      "Хотите вырастить творческую личность? Запишите мальчика в капеллу",
    );
    await expect(icon).toHaveAttribute("src", /news-category-news\.png$/);
    const iconBox = await icon.boundingBox();
    expect(iconBox?.width).toBeCloseTo(64, 1);
    expect(iconBox?.height).toBeCloseTo(64, 1);
  }
});

test("Application CTA mobile icon follows its heading scale", async ({ page }) => {
  for (const width of [320, 393, 767]) {
    await page.setViewportSize({ width, height: 852 });
    await page.goto(
      "/iframe.html?id=pages-home--desktop-preview&viewMode=story",
    );
    await expectGingerLoaded(page);
    const icon = page.locator(".orlyata-home__application-title-icon img");
    const title = page.locator(".orlyata-home__application-title");
    const [iconBox, fontSize] = await Promise.all([
      icon.boundingBox(),
      title.evaluate((node) => Number.parseFloat(getComputedStyle(node).fontSize)),
    ]);

    expect(iconBox?.width).toBeCloseTo(fontSize, 1);
    expect(iconBox?.height).toBeCloseTo(fontSize, 1);
  }
});

test("Application CTA mobile keeps the preposition with its word", async ({ page }) => {
  for (const width of [320, 393, 767]) {
    await page.setViewportSize({ width, height: 852 });
    await page.goto(
      "/iframe.html?id=pages-home--desktop-preview&viewMode=story",
    );
    await expectGingerLoaded(page);
    const preposition = page.locator(".orlyata-home__application-title-preposition");

    await expect(preposition).toHaveText("в капеллу");
    await expect(preposition).toHaveCSS("white-space", "nowrap");
  }
});

test("About desktop preview renders the Figma composition without horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(
    "/iframe.html?id=pages-about--desktop-preview&viewMode=story",
  );
  await expectGingerLoaded(page);

  await expect(
    page.getByRole("heading", { level: 1, name: "О капелле" }),
  ).toBeVisible();
  await expect(page.locator("[data-about-reveal]")).toHaveCount(5);
  await expect(
    page.locator(".orlyata-page-hero [data-about-reveal]"),
  ).toHaveCount(0);
  await expect(
    page.locator(".orlyata-about__groups[data-about-reveal]"),
  ).toHaveCount(0);
  await expect(
    page.locator(".orlyata-about__groups .orlyata-accordion").first(),
  ).toHaveCSS("animation-duration", "0.6s");
  await expect(page.locator(".orlyata-about__intro")).toHaveClass(
    /is-revealed/,
  );
  await expect(
    page.locator(".orlyata-about__intro .orlyata-about__lead"),
  ).toHaveCSS("animation-duration", "0.6s");
  await expect(
    page.locator(".orlyata-about__intro .orlyata-about__lead"),
  ).toHaveCSS("animation-name", "orlyata-home-media-card-reveal");
  const hero = page.locator(".orlyata-page-hero");
  const heroTitle = hero.locator(".orlyata-page-hero__title");
  await expect(heroTitle).toHaveCSS(
    "animation-name",
    "orlyata-page-hero-title-reveal",
  );
  await expect(heroTitle).toHaveCSS("animation-duration", "0.4s");
  await expect(heroTitle).toHaveCSS(
    "animation-timing-function",
    "cubic-bezier(0, 0, 0.18, 1)",
  );
  expect(
    await heroTitle.evaluate((node) =>
      ["none", "matrix(1, 0, 0, 1, 0, 0)"].includes(
        getComputedStyle(node).transform,
      ),
    ),
  ).toBe(true);
  await expect(hero).toHaveCSS("height", "355px");
  await expect(hero).toHaveCSS("padding-left", "24px");
  await expect(hero).toHaveCSS("padding-bottom", "32px");
  await expect(hero).toHaveCSS("border-top-left-radius", "0px");
  await expect(hero).toHaveCSS("border-bottom-left-radius", "24px");
  expect(
    await hero.evaluate((node) => {
      const bounds = node.getBoundingClientRect();
      return (
        bounds.left === 250 &&
        bounds.top === 0 &&
        bounds.right === window.innerWidth
      );
    }),
  ).toBe(true);
  const introMetrics = await page
    .locator(".orlyata-about__intro")
    .evaluate((node) => {
      const lead = node
        .querySelector<HTMLElement>(".orlyata-about__lead")
        ?.getBoundingClientRect();
      const copy = node
        .querySelector<HTMLElement>(".orlyata-about__copy")
        ?.getBoundingClientRect();
      const teachers = node
        .querySelector<HTMLElement>(".orlyata-about__intro-teachers")
        ?.getBoundingClientRect();
      const heroBounds = document
        .querySelector<HTMLElement>(".orlyata-page-hero")
        ?.getBoundingClientRect();
      if (
        lead === undefined ||
        copy === undefined ||
        teachers === undefined ||
        heroBounds === undefined
      ) {
        throw new Error("Missing About intro geometry");
      }
      return { lead, copy, teachers, heroBottom: heroBounds.bottom };
    });
  expect(introMetrics.lead.width).toBeCloseTo(690, 1);
  expect(introMetrics.copy.width).toBeCloseTo(720, 1);
  expect(introMetrics.lead.top).toBeCloseTo(introMetrics.copy.top, 1);
  expect(introMetrics.lead.top).toBeCloseTo(introMetrics.heroBottom + 64, 1);
  expect(introMetrics.teachers.bottom).toBeCloseTo(introMetrics.copy.bottom, 1);
  await expect(
    page.locator(".orlyata-about__groups .orlyata-accordion"),
  ).toHaveCount(4);
  await expect(
    page.locator(".orlyata-about__groups .orlyata-accordion__content"),
  ).toHaveCount(4);
  await expect(
    page.locator(".orlyata-about__groups .orlyata-accordion[open]"),
  ).toHaveCount(0);
  await page
    .locator(".orlyata-about__groups .orlyata-accordion")
    .first()
    .locator("summary")
    .click();
  await expect(
    page.locator(".orlyata-about__groups .orlyata-accordion").first(),
  ).toHaveAttribute("open", "");
  await expect(page.locator(".orlyata-teacher-card")).toHaveCount(6);
  await expect(
    page.getByText("Мария Андреевна", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Марьяна Геннадьевна", { exact: true }),
  ).toBeVisible();
  expect(
    await page.locator(".orlyata-teacher-card__photo").evaluateAll((images) =>
      images.map((image) => ({
        height: image.naturalHeight,
        width: image.naturalWidth,
      })),
    ),
  ).toEqual(Array.from({ length: 6 }, () => ({ height: 320, width: 320 })));
  await expect(
    page.getByRole("button", { name: "Оставить заявку" }),
  ).toBeVisible();
  await expect(
    page.locator(".orlyata-about__achievements tbody tr"),
  ).toHaveCount(25);
  await expect(
    page.getByText("XIII Всероссийский конкурс детских хоров", { exact: true }),
  ).toBeVisible();
  const footer = page.locator(".orlyata-footer");
  const achievements = page.locator(".orlyata-about__achievements");
  await expect(footer).toHaveCount(1);
  await expect(
    page.locator(".orlyata-about__grid .orlyata-footer"),
  ).toHaveCount(0);
  expect(
    await footer.evaluate(
      (node) =>
        node.parentElement?.classList.contains("orlyata-about__body") ?? false,
    ),
  ).toBe(true);
  const footerGap = await footer.evaluate(
    (node) =>
      node.getBoundingClientRect().top -
      document
        .querySelector<HTMLElement>(".orlyata-about__achievements")!
        .getBoundingClientRect().bottom,
  );
  expect(footerGap).toBeCloseTo(120, 1);
  await expect(
    page.getByText("Политика конфиденциальности", { exact: true }),
  ).toBeVisible();

  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
});

test("About page hero follows the desktop fluid scale at the contract anchors", async ({
  page,
}) => {
  for (const [
    width,
    expectedHeight,
    expectedLeft,
    expectedPaddingLeft,
    expectedPaddingBottom,
  ] of [
    [1280, 355 * (2 / 3), 250 * (2 / 3), 24 * (2 / 3), 32 * (2 / 3)],
    [1920, 355, 250, 24, 32],
    [2560, 355 * (4 / 3), 250 * (4 / 3), 24 * (4 / 3), 32 * (4 / 3)],
  ] as const) {
    await page.setViewportSize({ width, height: 1080 });
    await page.goto(
      "/iframe.html?id=pages-about--desktop-preview&viewMode=story",
    );
    await expectGingerLoaded(page);
    const hero = page.locator(".orlyata-page-hero");
    const metrics = await hero.evaluate((node) => {
      const bounds = node.getBoundingClientRect();
      const styles = getComputedStyle(node);
      return {
        height: bounds.height,
        left: bounds.left,
        paddingLeft: parseFloat(styles.paddingLeft),
        paddingBottom: parseFloat(styles.paddingBottom),
      };
    });
    expect(metrics.height).toBeCloseTo(expectedHeight, 1);
    expect(metrics.left).toBeCloseTo(expectedLeft, 1);
    expect(metrics.paddingLeft).toBeCloseTo(expectedPaddingLeft, 1);
    expect(metrics.paddingBottom).toBeCloseTo(expectedPaddingBottom, 1);
    expect(
      metrics.left +
        (await hero.evaluate((node) => node.getBoundingClientRect().width)),
    ).toBeCloseTo(width, 1);
  }
});

test("About Life and Teachers preserve their desktop ratios and internal scale", async ({
  page,
}) => {
  const samples: Array<{
    width: number;
    lifeRatio: number;
    teacherRatio: number;
    portrait: number;
    portraitGap: number;
    headingGap: number;
    gridGap: number;
  }> = [];

  for (const width of [1280, 1440, 1600, 1920, 2240, 2560]) {
    await page.setViewportSize({ width, height: 1080 });
    await page.goto(
      "/iframe.html?id=pages-about--desktop-preview&viewMode=story",
    );
    await expectGingerLoaded(page);
    await page.locator(".orlyata-about__life-card").waitFor();
    await page.locator(".orlyata-teacher-card__photo").first().waitFor();
    samples.push(
      await page.evaluate((sampleWidth) => {
        const life = document.querySelector<HTMLElement>(
          ".orlyata-about__life-card",
        );
        const teacher = document.querySelector<HTMLElement>(
          ".orlyata-teacher-card",
        );
        const photo = document.querySelector<HTMLElement>(
          ".orlyata-teacher-card__photo",
        );
        const heading = document.querySelector<HTMLElement>(
          ".orlyata-about__life h2",
        );
        const grid = document.querySelector<HTMLElement>(
          ".orlyata-about__teacher-grid",
        );
        if (!life || !teacher || !photo || !heading || !grid)
          throw new Error("About geometry is missing");
        const lifeBounds = life.getBoundingClientRect();
        const teacherBounds = teacher.getBoundingClientRect();
        const photoStyles = getComputedStyle(photo);
        const headingStyles = getComputedStyle(heading);
        const gridStyles = getComputedStyle(grid);
        return {
          width: sampleWidth,
          lifeRatio: lifeBounds.width / lifeBounds.height,
          teacherRatio: teacherBounds.width / teacherBounds.height,
          portrait: photo.getBoundingClientRect().width,
          portraitGap: parseFloat(photoStyles.marginBottom),
          headingGap: parseFloat(headingStyles.marginBottom),
          gridGap: parseFloat(gridStyles.columnGap),
        };
      }, width),
    );
  }

  const reference = samples.find((sample) => sample.width === 1920);
  if (reference === undefined) {
    throw new Error("Missing 1920px reference sample");
  }

  expect(reference.lifeRatio).toBeCloseTo(803 / 600, 2);
  expect(reference.teacherRatio).toBeCloseTo(257 / 340, 2);
  expect(reference.portrait).toBeCloseTo(160, 1);
  expect(reference.portraitGap).toBeCloseTo(71, 1);
  expect(reference.headingGap).toBeCloseTo(24, 1);
  expect(reference.gridGap).toBeCloseTo(16, 1);
  for (const sample of samples) {
    const scale = sample.width / 1920;
    expect(sample.lifeRatio).toBeCloseTo(reference.lifeRatio, 3);
    expect(sample.teacherRatio).toBeCloseTo(reference.teacherRatio, 3);
    expect(sample.portrait).toBeCloseTo(reference.portrait * scale, 1);
    expect(sample.portraitGap).toBeCloseTo(reference.portraitGap * scale, 1);
    expect(sample.headingGap).toBeCloseTo(reference.headingGap * scale, 1);
    expect(sample.gridGap).toBeCloseTo(reference.gridGap * scale, 1);
  }
});

test("About groups use the approved one-line Accordion row at the 393px mobile reference", async ({
  page,
}) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto(
    "/iframe.html?id=pages-about--desktop-preview&viewMode=story",
  );
  await expectGingerLoaded(page);

  const summary = page
    .locator(".orlyata-about__groups .orlyata-accordion__summary")
    .first();
  const label = summary.locator(".orlyata-accordion__label");
  const title = summary.locator(".orlyata-accordion__title");
  const meta = summary.locator(".orlyata-accordion__meta");
  const toggle = summary.locator(".orlyata-accordion__toggle-icon");
  const [summaryBox, titleBox, metaBox, toggleBox] = await Promise.all([
    summary.boundingBox(),
    title.boundingBox(),
    meta.boundingBox(),
    toggle.boundingBox(),
  ]);

  if (
    summaryBox === null ||
    titleBox === null ||
    metaBox === null ||
    toggleBox === null
  ) {
    throw new Error("Mobile Accordion geometry is missing");
  }

  await expect(label).toHaveText("Подготовительная группа / 5-7 лет");
  expect(summaryBox.height).toBeCloseTo(48, 1);
  expect(titleBox.y).toBeCloseTo(metaBox.y, 1);
  expect(metaBox.y + metaBox.height / 2).toBeCloseTo(
    toggleBox.y + toggleBox.height / 2,
    1,
  );
  expect(toggleBox.width).toBeCloseTo(16, 1);
  expect(toggleBox.height).toBeCloseTo(16, 1);
  expect(toggleBox.x + toggleBox.width).toBeCloseTo(
    summaryBox.x + summaryBox.width,
    1,
  );
  await expect(toggle).toHaveCSS("stroke-width", "1.8px");
  await summary.click();
  await expect(summary.locator("xpath=..")).toHaveAttribute("open", "");
  const accordion = summary.locator("xpath=..");
  const content = accordion.locator(".orlyata-accordion__content");
  await expect(accordion).toHaveCSS("border-bottom-width", "1px");
  await expect(
    page.locator(".orlyata-about__groups .orlyata-accordion").last(),
  ).toHaveCSS("border-bottom-width", "1px");
  await expect(content).toHaveCSS("margin-top", "8px");
  expect(
    await summary.evaluate((element) => getComputedStyle(element).color),
  ).not.toBe("rgb(113, 113, 122)");
  await summary.click();
  await expect(summary.locator("xpath=..")).not.toHaveAttribute("open", "");
  expect(
    await summary.evaluate((element) => getComputedStyle(element).color),
  ).not.toBe("rgb(113, 113, 122)");
  expect(summaryBox.x + summaryBox.width).toBeLessThanOrEqual(393);

  const lead = page.locator(".orlyata-about__lead");
  const teachers = page.locator(".orlyata-about__intro-teachers");
  const copy = page.locator(".orlyata-about__copy");
  const groups = page.locator(".orlyata-about__groups");
  const [leadBox, teachersBox, copyBox, groupsBox] = await Promise.all([
    lead.boundingBox(),
    teachers.boundingBox(),
    copy.boundingBox(),
    groups.boundingBox(),
  ]);
  if (
    leadBox === null ||
    teachersBox === null ||
    copyBox === null ||
    groupsBox === null
  ) {
    throw new Error("About mobile intro geometry is missing");
  }
  expect(teachersBox.y - leadBox.y - leadBox.height).toBeCloseTo(16, 1);
  expect(teachersBox.x).toBeCloseTo(leadBox.x, 1);
  expect(copyBox.y - teachersBox.y - teachersBox.height).toBeCloseTo(24, 1);
  const paragraphs = copy.locator("p");
  await expect(paragraphs).toHaveCount(2);
  const [firstParagraphBox, secondParagraphBox] = await Promise.all([
    paragraphs.nth(0).boundingBox(),
    paragraphs.nth(1).boundingBox(),
  ]);
  if (firstParagraphBox === null || secondParagraphBox === null) {
    throw new Error("About Body paragraphs are missing");
  }
  expect(
    secondParagraphBox.y - firstParagraphBox.y - firstParagraphBox.height,
  ).toBeCloseTo(8, 1);
  expect(groupsBox.y - copyBox.y - copyBox.height).toBeCloseTo(32, 1);
  await expect(
    page.locator(".orlyata-about__groups .orlyata-accordion__label").last(),
  ).toHaveText("Юношеская группа / 13-18 лет");
});

test("About Body uses 140% outside mobile", async ({ page }) => {
  for (const sample of [
    { width: 1920, expected: 28 },
    { width: 1279, expected: 28 },
    { width: 768, expected: 16.8 },
    { width: 393, expected: 20.8 },
  ]) {
    await page.setViewportSize({ width: sample.width, height: 1080 });
    await page.goto(
      "/iframe.html?id=pages-about--desktop-preview&viewMode=story",
    );
    await expectGingerLoaded(page);
    const lineHeight = await page
      .locator(".orlyata-about__copy")
      .evaluate((node) => parseFloat(getComputedStyle(node).lineHeight));
    expect(lineHeight).toBeCloseTo(sample.expected, 1);
  }
});

test("About tablet anchors Accordion ages in the third editorial column", async ({
  page,
}) => {
  for (const width of [768, 1279]) {
    await page.setViewportSize({ width, height: 1080 });
    await page.goto(
      "/iframe.html?id=pages-about--desktop-preview&viewMode=story",
    );
    await expectGingerLoaded(page);
    const metrics = await page
      .locator(".orlyata-about__groups .orlyata-accordion__summary")
      .first()
      .evaluate((summary) => {
        const meta = summary.querySelector<HTMLElement>(
          ".orlyata-accordion__meta",
        );
        if (meta === null) throw new Error("Missing Accordion age");
        const summaryBox = summary.getBoundingClientRect();
        const metaBox = meta.getBoundingClientRect();
        return {
          width: summaryBox.width,
          metaOffset: metaBox.left - summaryBox.left,
          gap: parseFloat(getComputedStyle(summary).columnGap),
        };
      });
    expect(metrics.metaOffset).toBeCloseTo(
      metrics.width / 2 + metrics.gap / 2,
      1,
    );
    const accordion = page
      .locator(".orlyata-about__groups .orlyata-accordion")
      .first();
    await accordion.locator("summary").click();
    const [ageBox, contentBox] = await Promise.all([
      accordion.locator(".orlyata-accordion__meta").boundingBox(),
      accordion.locator(".orlyata-accordion__content").boundingBox(),
    ]);
    if (ageBox === null || contentBox === null)
      throw new Error("Missing opened tablet Accordion geometry");
    expect(contentBox.x).toBeCloseTo(ageBox.x, 1);
  }
});

test("About Life mobile controls scale with S_m and accept horizontal swipe", async ({
  page,
}) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto(
    "/iframe.html?id=pages-about--desktop-preview&viewMode=story",
  );
  await expectGingerLoaded(page);

  const carousel = page.locator("[data-life-carousel]");
  const previous = carousel.locator(".orlyata-button--arrow-left");
  const next = carousel.locator(".orlyata-button--arrow-right");
  await expect(carousel).toHaveCount(1);
  await expect(previous).toHaveCount(1);
  await expect(next).toHaveCount(1);
  expect((await previous.boundingBox())?.width).toBeCloseTo(48, 1);
  const copy = carousel.locator(".orlyata-about__life-copy").first();
  const card = carousel.locator(".orlyata-about__life-card");
  const title = carousel.locator(".orlyata-about__life-slide.is-active .orlyata-about__life-meta");
  const [copyBox, arrowsBox, titleBox] = await Promise.all([
    copy.boundingBox(),
    carousel.locator(".orlyata-about__life-arrows").boundingBox(),
    title.boundingBox(),
  ]);
  if (copyBox === null || arrowsBox === null || titleBox === null)
    throw new Error("About Life mobile copy or controls are missing");
  const cardBox = await card.boundingBox();
  if (cardBox === null) throw new Error("About Life mobile card is missing");
  expect(copyBox.width).toBeCloseTo(310, 1);
  expect(copyBox.x - cardBox.x).toBeCloseTo(16, 1);
  expect(titleBox.y - cardBox.y).toBeCloseTo(24, 1);
  await expect(card).toHaveCSS("padding", "16px");
  expect(arrowsBox.y - copyBox.y - copyBox.height).toBeCloseTo(24, 1);
  expect(arrowsBox.x).toBeCloseTo(copyBox.x, 1);

  await carousel.dispatchEvent("pointerdown", {
    clientX: 300,
    pointerId: 1,
    pointerType: "touch",
  });
  await carousel.dispatchEvent("pointerup", {
    clientX: 100,
    pointerId: 1,
    pointerType: "touch",
  });
  await expect(carousel.locator("[data-life-slide].is-active")).toHaveCount(1);
  await expect(carousel.locator("[data-life-slide].is-active")).toContainText(
    "Достижения",
  );

  await page.setViewportSize({ width: 320, height: 852 });
  expect((await previous.boundingBox())?.width).toBeCloseTo(39.084, 1);
});

test("About Teachers use the approved two-column mobile grid at 393px", async ({
  page,
}) => {
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto(
    "/iframe.html?id=pages-about--desktop-preview&viewMode=story",
  );
  await expectGingerLoaded(page);

  const section = page.locator(".orlyata-about__teachers");
  const grid = section.locator(".orlyata-about__teacher-grid");
  const cards = grid.locator(".orlyata-teacher-card");
  const firstCard = cards.first();
  const secondCard = cards.nth(1);
  const photo = firstCard.locator(".orlyata-teacher-card__photo-wrap");
  const name = firstCard.locator(".orlyata-teacher-card__name");
  const meta = firstCard.locator(".orlyata-teacher-card__meta");
  const firstName = meta.locator(".orlyata-teacher-card__meta-first");
  const middleName = meta.locator(".orlyata-teacher-card__meta-middle");
  const [
    gridBox,
    firstBox,
    secondBox,
    photoBox,
    nameBox,
    metaBox,
    firstNameBox,
    middleNameBox,
  ] = await Promise.all([
    grid.boundingBox(),
    firstCard.boundingBox(),
    secondCard.boundingBox(),
    photo.boundingBox(),
    name.boundingBox(),
    meta.boundingBox(),
    firstName.boundingBox(),
    middleName.boundingBox(),
  ]);
  if (
    gridBox === null ||
    firstBox === null ||
    secondBox === null ||
    photoBox === null ||
    nameBox === null ||
    metaBox === null ||
    firstNameBox === null ||
    middleNameBox === null
  )
    throw new Error("About Teachers mobile grid geometry is missing");
  expect(firstBox.width).toBeCloseTo((gridBox.width - 12) / 2, 1);
  expect(firstBox.height).toBeCloseTo(260, 1);
  expect(secondBox.x - firstBox.x - firstBox.width).toBeCloseTo(12, 1);
  expect(photoBox.width).toBeCloseTo(120, 1);
  expect(photoBox.height).toBeCloseTo(120, 1);
  expect(photoBox.y - firstBox.y).toBeCloseTo(16, 1);
  expect(
    firstBox.y + firstBox.height - (metaBox.y + metaBox.height),
  ).toBeCloseTo(20, 1);
  await expect(name).toHaveText("Чернецов");
  await expect(name).toHaveCSS("font-size", "16px");
  await expect(name).toHaveCSS("font-weight", "400");
  await expect(firstName).toHaveText("Андрей");
  await expect(middleName).toHaveText("Викторович");
  expect(nameBox.y).toBeLessThan(firstNameBox.y);
  expect(firstNameBox.y).toBeLessThan(middleNameBox.y);
  await expect(section.getByRole("button")).toHaveCount(0);
});

for (const width of [768, 1279]) {
  test(
    "About tablet preserves the desktop intro composition at " +
      String(width) +
      " px",
    async ({ page }) => {
      await page.setViewportSize({ width, height: 1080 });
      await page.goto(
        "/iframe.html?id=pages-about--desktop-preview&viewMode=story",
      );
      await expectGingerLoaded(page);
      const [logo, lead, copy, teachers] = await Promise.all([
        page.locator(".orlyata-sidebar__logo-link").boundingBox(),
        page.locator(".orlyata-about__lead").boundingBox(),
        page.locator(".orlyata-about__copy").boundingBox(),
        page.locator(".orlyata-about__intro-teachers").boundingBox(),
      ]);
      if (
        logo === null ||
        lead === null ||
        copy === null ||
        teachers === null
      ) {
        throw new Error("Missing tablet About composition");
      }
      expect(logo.width).toBeCloseTo((180 * width) / 1279, 1);
      expect(logo.height).toBeCloseTo((100.1 * width) / 1279, 1);
      expect(lead.x).toBeLessThan(copy.x);
      expect(lead.y).toBeCloseTo(copy.y, 1);
      expect(teachers.x).toBeCloseTo(lead.x, 1);
      expect(teachers.y + teachers.height).toBeCloseTo(copy.y + copy.height, 1);
      const paragraphs = page.locator(".orlyata-about__copy p");
      const [first, second] = await Promise.all([
        paragraphs.nth(0).boundingBox(),
        paragraphs.nth(1).boundingBox(),
      ]);
      if (first === null || second === null) {
        throw new Error("Missing About Body paragraphs");
      }
      expect(second.y - first.y - first.height).toBeCloseTo(
        (24 * width) / 1279,
        1,
      );
    },
  );
}

test("About tablet preserves component ratios and the shared S_t shell", async ({
  page,
}) => {
  const samples: Array<{
    width: number;
    hero: number;
    life: number;
    lifeHeight: number;
    lifeCopyInsetStart: number;
    lifeCopyInsetEnd: number;
    teacher: number;
    teacherBottomInset: number;
    teacherHeight: number;
    applicationHeight: number;
    formHeight: number;
    paddingBlock: number;
    overflow: number;
  }> = [];
  for (const width of [768, 960, 1279]) {
    await page.setViewportSize({ width, height: 1080 });
    await page.goto(
      "/iframe.html?id=pages-about--desktop-preview&viewMode=story",
    );
    await expectGingerLoaded(page);
    samples.push(
      await page.evaluate((sampleWidth) => {
        const box = (selector: string) => {
          const element = document.querySelector<HTMLElement>(selector);
          if (element === null)
            throw new Error("Missing About tablet element: " + selector);
          return element.getBoundingClientRect();
        };
        const hero = box(".orlyata-page-hero");
        const life = box(".orlyata-about__life-card");
        const lifeCopy = box(".orlyata-about__life-copy");
        const teacher = box(".orlyata-teacher-card");
        const teacherMeta = box(".orlyata-teacher-card__meta");
        const application = box(".orlyata-home__application-surface");
        const form = box(
          ".orlyata-home__application-surface .orlyata-application-form",
        );
        const styles = getComputedStyle(
          document.querySelector<HTMLElement>(
            ".orlyata-home__application-surface",
          ) as HTMLElement,
        );
        return {
          width: sampleWidth,
          hero: hero.height,
          life: life.width / life.height,
          lifeHeight: life.height,
          lifeCopyInsetStart: lifeCopy.left - life.left,
          lifeCopyInsetEnd: life.right - lifeCopy.right,
          teacher: teacher.width / teacher.height,
          teacherBottomInset: teacher.bottom - teacherMeta.bottom,
          teacherHeight: teacher.height,
          applicationHeight: application.height,
          formHeight: form.height,
          paddingBlock:
            parseFloat(styles.paddingBlockStart) +
            parseFloat(styles.paddingBlockEnd),
          overflow:
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        };
      }, width),
    );
  }
  for (const sample of samples) {
    expect(sample.hero).toBeCloseTo((355 * sample.width) / 1279, 1);
    expect(sample.life).toBeCloseTo(243 / 208, 2);
    expect(sample.lifeHeight).toBeCloseTo((520 * sample.width) / 1279, 1);
    expect(sample.lifeCopyInsetStart).toBeCloseTo(
      (24 * sample.width) / 1279,
      1,
    );
    expect(sample.lifeCopyInsetEnd).toBeCloseTo((24 * sample.width) / 1279, 1);
    expect(sample.teacher).toBeCloseTo(1199 / 1020, 2);
    expect(sample.teacherHeight).toBeCloseTo((340 * sample.width) / 1279, 1);
    expect(sample.teacherBottomInset).toBeCloseTo(
      (24 * sample.width) / 1279,
      1,
    );
    expect(sample.applicationHeight).toBeGreaterThanOrEqual(
      sample.formHeight + sample.paddingBlock - 1,
    );
    expect(sample.overflow).toBeLessThanOrEqual(1);
  }
});
