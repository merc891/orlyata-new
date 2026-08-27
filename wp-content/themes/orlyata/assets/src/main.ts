import './styles/main.css';
import { initializeApplicationFormValidation } from './application-form-validation';

document.documentElement.classList.add('has-js');

const initializeAboutLifeCarousel = (): void => {
  document.querySelectorAll<HTMLElement>("[data-life-carousel]").forEach((carousel) => {
    const slides = [...carousel.querySelectorAll<HTMLElement>("[data-life-slide]")];
    const selectors = [...carousel.querySelectorAll<HTMLButtonElement>("[data-life-slide-select]")];
    const media = carousel.parentElement?.querySelector<HTMLElement>("[data-life-media]");
    const activeIndex = (): number => Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
    const select = (requestedIndex: number, direction: "next" | "previous"): void => {
      const currentIndex = activeIndex();
      const index = (requestedIndex + slides.length) % slides.length;
      if (index === currentIndex) return;
      slides.forEach((slide, slideIndex) => slide.classList.toggle("is-active", slideIndex === index));
      selectors.forEach((control, controlIndex) => {
        const active = controlIndex === index;
        control.classList.toggle("is-active", active);
        control.setAttribute("aria-pressed", String(active));
      });
      if (media !== null && media !== undefined) media.dataset.lifeActive = String(index);
    };
    carousel.querySelector<HTMLButtonElement>(".orlyata-button--arrow-left")?.addEventListener("click", () => select(activeIndex() - 1, "previous"));
    carousel.querySelector<HTMLButtonElement>(".orlyata-button--arrow-right")?.addEventListener("click", () => select(activeIndex() + 1, "next"));
    selectors.forEach((control, index) => control.addEventListener("click", () => select(index, index > activeIndex() ? "next" : "previous")));
  });
};

initializeAboutLifeCarousel();

import { createMorph, type Morph } from "morphicons/dom";
import type { IconNode } from "morphicons";

const videoPreviewDurationSeconds = 8;

export const initializeMediaCardVideoPreviews = (): void => {
  document.querySelectorAll<HTMLElement>('[data-media-card-video-preview]').forEach((card) => {
    if (card.dataset.previewInitialized === 'true') {
      return;
    }

    card.dataset.previewInitialized = 'true';
    const preview = card.querySelector<HTMLElement>('.orlyata-media-card__preview');
    const video = card.querySelector<HTMLVideoElement>('.orlyata-media-card__preview-video');
    const image = card.querySelector<HTMLImageElement>('.orlyata-media-card__image');

    if (preview === null || video === null || image === null) {
      return;
    }

    let loopStart = Math.max(0, Number.parseFloat(video.dataset.previewStart ?? '0') || 0);
    let loopEnd = loopStart + videoPreviewDurationSeconds;
    const showPreview = (): void => { preview.hidden = false; image.hidden = true; card.dataset.previewState = 'playing'; };
    const showFallback = (): void => { preview.hidden = true; image.hidden = false; card.dataset.previewState = 'fallback'; };
    const play = (): void => { void video.play().then(showPreview).catch(showFallback); };
    const setLoopBounds = (): void => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) { showFallback(); return; }
      loopStart = Math.min(loopStart, Math.max(0, video.duration - videoPreviewDurationSeconds));
      loopEnd = Math.min(loopStart + videoPreviewDurationSeconds, video.duration);
      video.currentTime = loopStart;
      play();
    };

    video.addEventListener('loadedmetadata', setLoopBounds, { once: true });
    video.addEventListener('canplay', play, { once: true });
    video.addEventListener('timeupdate', () => { if (video.currentTime >= loopEnd) { video.currentTime = loopStart; play(); } });
    video.addEventListener('error', showFallback, { once: true });
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) { setLoopBounds(); }
  });
};

initializeMediaCardVideoPreviews();

const initializeHomeHeroVideoDialog = (): void => {
  const dialog = document.querySelector<HTMLDialogElement>('.orlyata-home__hero-dialog');
  const original = dialog?.querySelector<HTMLVideoElement>('.orlyata-home__hero-dialog-video');
  const preview = document.querySelector<HTMLVideoElement>('.orlyata-home__hero-preview');
  const close = dialog?.querySelector<HTMLButtonElement>('.orlyata-home__hero-dialog-close');

  if (
    dialog === null
    || original === null
    || original === undefined
    || close === null
    || close === undefined
    || typeof dialog.showModal !== 'function'
  ) {
    return;
  }


  const restorePreview = (): void => {
    original.pause();
    original.currentTime = 0;
    void preview?.play().catch(() => undefined);
  };

  const closeDialog = (): void => {
    if (dialog.open) {
      dialog.close();
    }
  };

  const openDialog = (): void => {
    if (!dialog.open) {
      dialog.showModal();
    }

    preview?.pause();
    original.currentTime = 0;
    void original.play().catch(() => undefined);
  };

  document.querySelectorAll<HTMLAnchorElement>('.orlyata-home__hero-play').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      openDialog();
    });
  });

  document.querySelectorAll<HTMLElement>('.orlyata-home__hero-video-trigger').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      if (event.target instanceof Element && event.target.closest('.orlyata-home__hero-play') !== null) {
        return;
      }

      openDialog();
    });
  });

  close.addEventListener('click', () => {
    closeDialog();
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      closeDialog();
    }
  });

  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDialog();
  });

  dialog.addEventListener('close', restorePreview);

};

initializeHomeHeroVideoDialog();

document.querySelectorAll<HTMLButtonElement>('.orlyata-sidebar__menu-toggle').forEach((toggle) => {
  const sidebar = toggle.closest<HTMLElement>('.orlyata-sidebar');
  if (sidebar === null) {
    return;
  }

  sidebar.classList.remove('is-menu-open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('is-menu-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    const label = toggle.querySelector<HTMLElement>('.screen-reader-text');
    if (label !== null) {
      label.textContent = isOpen ? 'Закрыть меню' : 'Открыть меню';
    }
  });
});


const accordionPlus: IconNode = [["path", { d: "M5 12h14" }], ["path", { d: "M12 5v14" }]];
const accordionMinus: IconNode = [["path", { d: "M5 12h14" }]];
const accordionMorphs = new WeakMap<HTMLDetailsElement, Morph>();
const initializedAccordions = new WeakSet<HTMLDetailsElement>();
const accordionTransitions = new WeakMap<HTMLDetailsElement, () => void>();

const getAccordionMorph = (accordion: HTMLDetailsElement): Morph | undefined => {
  const existing = accordionMorphs.get(accordion);
  if (existing !== undefined) return existing;
  const path = accordion.querySelector<SVGPathElement>(".orlyata-accordion__toggle-path");
  if (path === null) return undefined;
  const morph = createMorph(path, accordion.open ? accordionMinus : accordionPlus, { reducedMotion: "never" });
  accordionMorphs.set(accordion, morph);
  return morph;
};

const cssDurationToMilliseconds = (value: string, fallback: number): number => {
  const match = value.trim().match(/^([0-9]*\.?[0-9]+)(ms|s)$/i);
  if (match === null) return fallback;
  const amount = Number.parseFloat(match[1] ?? "");
  if (!Number.isFinite(amount)) return fallback;
  return (match[2]?.toLowerCase() === "s" ? amount * 1000 : amount);
};

const setAccordionOpen = (accordion: HTMLDetailsElement, nextOpen: boolean): void => {
  const panel = accordion.querySelector<HTMLElement>(".orlyata-accordion__panel");
  if (panel === null) return;

  const currentHeight = accordion.open ? panel.getBoundingClientRect().height : 0;
  accordionTransitions.get(accordion)?.();

  if (nextOpen) {
    accordion.parentElement?.querySelectorAll<HTMLDetailsElement>(".orlyata-accordion[open]").forEach((other) => {
      if (other !== accordion) setAccordionOpen(other, false);
    });
    accordion.open = true;
  }

  const styles = window.getComputedStyle(accordion);
  const duration = cssDurationToMilliseconds(styles.getPropertyValue("--accordion-animation-duration"), 400);
  const easing = styles.getPropertyValue("--accordion-animation-easing").trim() || "cubic-bezier(0, 0, 0.06, 1)";
  const targetHeight = nextOpen ? panel.scrollHeight : 0;

  panel.dataset.accordionAnimating = "true";
  panel.style.transition = "none";
  panel.style.height = `${String(currentHeight)}px`;
  panel.style.overflow = "hidden";
  void panel.offsetHeight;

  let fallbackTimer = 0;
  const cancel = (): void => {
    window.clearTimeout(fallbackTimer);
    panel.removeEventListener("transitionend", finish);
    panel.style.transition = "none";
    delete panel.dataset.accordionAnimating;
    if (accordionTransitions.get(accordion) === cancel) accordionTransitions.delete(accordion);
  };

  const finish = (event: TransitionEvent): void => {
    if (event.propertyName !== "height") return;
    complete();
  };

  const complete = (): void => {
    window.clearTimeout(fallbackTimer);
    panel.removeEventListener("transitionend", finish);
    if (!nextOpen) accordion.open = false;
    panel.style.removeProperty("height");
    panel.style.removeProperty("overflow");
    panel.style.removeProperty("transition");
    delete panel.dataset.accordionAnimating;
    if (accordionTransitions.get(accordion) === cancel) accordionTransitions.delete(accordion);
  };

  accordionTransitions.set(accordion, cancel);
  panel.addEventListener("transitionend", finish);
  panel.style.transition = `height ${String(duration)}ms ${easing}`;
  panel.style.height = `${String(targetHeight)}px`;
  fallbackTimer = window.setTimeout(complete, duration + 100);
  getAccordionMorph(accordion)?.morphTo(nextOpen ? accordionMinus : accordionPlus, "smooth");
};

export const initializeAccordions = (root: ParentNode = document): void => {
  root.querySelectorAll<HTMLElement>(".orlyata-accordion__summary").forEach((summary) => {
    const accordion = summary.parentElement;
    if (!(accordion instanceof HTMLDetailsElement) || initializedAccordions.has(accordion)) return;
    initializedAccordions.add(accordion);
    summary.addEventListener("click", (event) => {
      event.preventDefault();
      setAccordionOpen(accordion, !accordion.open);
    });
  });
};

initializeAccordions();

const digitsOnly = (value: string): string => value.replace(/\D/g, '');

const formatDateMask = (value: string): string => {
  const digits = digitsOnly(value).slice(0, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);

  if (day.length < 2) {
    return day;
  }
  if (month.length < 2) {
    return day + '.' + month;
  }
  if (year === '') {
    return day + '.' + month + '.';
  }
  return day + '.' + month + '.' + year;
};

const daysInMonth = (year: number, month: number): number => {
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  return [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] ?? 31;
};

const getDateMax = (input: HTMLInputElement): string => {
  const value = input.dataset.dateMax ?? '';
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : new Date().toISOString().slice(0, 10);
};

const correctDateMask = (input: HTMLInputElement): string => {
  const digits = digitsOnly(input.value);
  if (digits.length !== 8) {
    return formatDateMask(digits);
  }
  const max = getDateMax(input);
  const maxYear = Number.parseInt(max.slice(0, 4), 10);
  const year = Math.min(maxYear, Math.max(1, Number.parseInt(digits.slice(4), 10)));
  const month = Math.min(12, Math.max(1, Number.parseInt(digits.slice(2, 4), 10)));
  const day = Math.min(daysInMonth(year, month), Math.max(1, Number.parseInt(digits.slice(0, 2), 10)));
  const normalized = [String(day).padStart(2, '0'), String(month).padStart(2, '0'), String(year).padStart(4, '0')].join('.');
  const current = String(year).padStart(4, '0') + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
  return current > max ? [max.slice(8, 10), max.slice(5, 7), max.slice(0, 4)].join('.') : normalized;
};

const updateInputMaskUnderlay = (input: HTMLInputElement): void => {
  const mask = input.closest('.orlyata-input__control')?.querySelector<HTMLElement>('.orlyata-input__mask');
  const template = mask?.dataset.inputMaskTemplate;

  if (mask === null || mask === undefined || template === undefined) {
    return;
  }

  mask.textContent = [...template]
    .map((character, index) => index < input.value.length ? '\u00a0' : character)
    .join('');
};

const formatPhoneMask = (value: string): string => {
  let digits = digitsOnly(value);
  if (digits.startsWith('7') || digits.startsWith('8')) {
    digits = digits.slice(1);
  }
  digits = digits.slice(0, 10);
  if (digits === '') {
    return '';
  }
  let formatted = '+7 (' + digits.slice(0, 3);
  if (digits.length > 3) {
    formatted += ') ' + digits.slice(3, 6);
  }
  if (digits.length > 6) {
    formatted += '-' + digits.slice(6, 8);
  }
  if (digits.length > 8) {
    formatted += '-' + digits.slice(8, 10);
  }
  return formatted;
};

document.addEventListener('focusin', (event) => {
  const target = event.target;

  if (!(target instanceof HTMLInputElement) || target.dataset.inputMask !== 'phone' || target.value !== '') {
    return;
  }

  target.value = '+7 (';
  target.closest('.orlyata-input')?.classList.add('is-filled');
  updateInputMaskUnderlay(target);
});

document.addEventListener('input', (event) => {
  const target = event.target;

  if (!(target instanceof HTMLInputElement) || !target.classList.contains('orlyata-input__field')) {
    return;
  }

  if (target.dataset.inputMask === 'date') {
    target.value = formatDateMask(target.value);
  } else if (target.dataset.inputMask === 'phone') {
    target.value = formatPhoneMask(target.value);
  }

  target.closest('.orlyata-input')?.classList.toggle('is-filled', target.value !== '');
  updateInputMaskUnderlay(target);
});

document.addEventListener('blur', (event) => {
  const target = event.target;

  if (!(target instanceof HTMLInputElement) || target.dataset.inputMask !== 'date') {
    return;
  }

  target.value = correctDateMask(target);
  target.closest('.orlyata-input')?.classList.toggle('is-filled', target.value !== '');
  updateInputMaskUnderlay(target);
}, true);

const initializeHomeScrollReveal = (selector: string): void => {
  const section = document.querySelector<HTMLElement>(selector);

  if (section === null || section.dataset.revealInitialized === 'true' || !('IntersectionObserver' in window)) {
    return;
  }

  const offsetRem = Number.parseFloat(window.getComputedStyle(section).getPropertyValue('--home-media-reveal-viewport-offset')) || 0;
  const rootFontSize = Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize);
  const viewportOffset = Number.isFinite(offsetRem) && Number.isFinite(rootFontSize) ? offsetRem * rootFontSize : 0;

  section.dataset.revealInitialized = 'true';
  section.classList.add('is-reveal-pending');

  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];

    if (entry === undefined || !entry.isIntersecting) {
      return;
    }

    section.classList.remove('is-reveal-pending');
    section.classList.add('is-revealed');
    observer.unobserve(section);
  }, { rootMargin: `0px 0px -${String(viewportOffset)}px 0px` });

  observer.observe(section);
};

export const initializeHomeMediaReveal = (): void => {
  initializeHomeScrollReveal('.orlyata-home__media-section');
};

export const initializeHomeHistoryReveal = (): void => {
  initializeHomeScrollReveal('.orlyata-home__history');
};

export const initializeHomeApplicationReveal = (): void => {
  initializeHomeScrollReveal('.orlyata-home__application');
};

export const initializeHomeAchievementsReveal = (): void => {
  initializeHomeScrollReveal('.orlyata-home__achievements');
};

initializeHomeMediaReveal();
initializeHomeHistoryReveal();
initializeHomeApplicationReveal();
initializeHomeAchievementsReveal();

export const initializeAboutSectionReveal = (): void => {
  document.querySelectorAll<HTMLElement>(".orlyata-about [data-about-reveal]").forEach((section) => {
    if (section.dataset.revealInitialized === "true" || !("IntersectionObserver" in window)) return;
    const offsetRem = Number.parseFloat(window.getComputedStyle(section).getPropertyValue("--home-media-reveal-viewport-offset")) || 0;
    const rootFontSize = Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize);
    const viewportOffset = Number.isFinite(offsetRem) && Number.isFinite(rootFontSize) ? offsetRem * rootFontSize : 0;
    section.dataset.revealInitialized = "true";
    section.classList.add("is-reveal-pending");
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry === undefined || !entry.isIntersecting) return;
      section.classList.remove("is-reveal-pending");
      section.classList.add("is-revealed");
      observer.unobserve(section);
    }, { rootMargin: `0px 0px -${String(viewportOffset)}px 0px` });
    observer.observe(section);
  });
};

export const initializePageHeroTitleReveal = (): void => {
  document.querySelectorAll<HTMLElement>(".orlyata-page-hero").forEach((hero) => {
    if (hero.dataset.titleRevealInitialized === "true") return;

    hero.dataset.titleRevealInitialized = "true";
    window.requestAnimationFrame(() => {
      hero.classList.add("is-title-revealed");
    });
  });
};

initializePageHeroTitleReveal();
initializeAboutSectionReveal();
initializeApplicationFormValidation();
