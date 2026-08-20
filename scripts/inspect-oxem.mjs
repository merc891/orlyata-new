import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'no-preference' });
const page = await context.newPage();
const session = await context.newCDPSession(page);
const started = [];

await session.send('Animation.enable');
session.on('Animation.animationStarted', ({ animation }) => {
  started.push(animation);
});

await page.goto('https://oxem.ru/', { waitUntil: 'domcontentloaded', timeout: 60_000 });
const heading = page.getByRole('heading', { level: 1 });
await heading.waitFor({ state: 'attached' });
const snapshot = await heading.evaluate((element) => {
  const descendants = [element, ...element.querySelectorAll('*')];

  return {
    html: element.outerHTML,
    parentHtml: element.parentElement?.outerHTML.slice(0, 12_000),
    computed: descendants.map((node) => {
      const styles = getComputedStyle(node);

      return {
        tag: node.tagName,
        className: node.getAttribute('class'),
        text: node.textContent?.trim().slice(0, 120),
        display: styles.display,
        overflow: styles.overflow,
        clipPath: styles.clipPath,
        opacity: styles.opacity,
        transform: styles.transform,
        animationName: styles.animationName,
        animationDuration: styles.animationDuration,
        animationDelay: styles.animationDelay,
        animationTimingFunction: styles.animationTimingFunction,
        transitionProperty: styles.transitionProperty,
        transitionDuration: styles.transitionDuration,
        transitionDelay: styles.transitionDelay,
        transitionTimingFunction: styles.transitionTimingFunction,
      };
    }),
    animations: descendants.flatMap((node) =>
      node.getAnimations().map((animation) => {
        const effect = animation.effect;

        return {
          tag: node.tagName,
          className: node.getAttribute('class'),
          text: node.textContent?.trim().slice(0, 120),
          currentTime: animation.currentTime,
          playState: animation.playState,
          playbackRate: animation.playbackRate,
          timing: effect?.getTiming(),
          computedTiming: effect?.getComputedTiming(),
          keyframes: effect instanceof KeyframeEffect ? effect.getKeyframes() : [],
        };
      }),
    ),
  };
});

await page.waitForTimeout(2_500);
console.log(JSON.stringify({ snapshot, cdpAnimations: started }, null, 2));
await browser.close();
