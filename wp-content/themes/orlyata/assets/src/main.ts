import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

const photoAlbumArrowIcon = new URL("../icons/button-arrow.svg", import.meta.url).href;
import './styles/main.css';
import { initializeApplicationFormValidation } from './application-form-validation';

document.documentElement.classList.add('has-js');

const initializeNotFoundMessage = (): void => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.querySelectorAll<HTMLElement>('[data-not-found-message]').forEach((message) => {
        message.classList.add('is-entering');
      });
    });
  });
};

if (document.readyState === 'complete') {
  initializeNotFoundMessage();
} else {
  window.addEventListener('load', initializeNotFoundMessage, { once: true });
}

export const initializeAboutLifeCarousel = (): void => {
  document.querySelectorAll<HTMLElement>("[data-life-carousel]").forEach((carousel) => {
    const slides = [...carousel.querySelectorAll<HTMLElement>("[data-life-slide]")];
    const selectors = [...carousel.querySelectorAll<HTMLButtonElement>("[data-life-slide-select]")];
    const media = carousel.parentElement?.querySelector<HTMLElement>("[data-life-media]");
    const swipeThreshold = 24;
    let swipeStart: { pointerId: number; x: number; y: number } | undefined;
    const activeIndex = (): number => Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
    const select = (requestedIndex: number): void => {
      if (slides.length === 0) return;
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
    carousel.querySelector<HTMLButtonElement>(".orlyata-button--arrow-left")?.addEventListener("click", () => select(activeIndex() - 1));
    carousel.querySelector<HTMLButtonElement>(".orlyata-button--arrow-right")?.addEventListener("click", () => select(activeIndex() + 1));
    selectors.forEach((control, index) => control.addEventListener("click", () => select(index)));
    carousel.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" || event.target instanceof Element && event.target.closest("button")) return;
      swipeStart = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
      carousel.setPointerCapture(event.pointerId);
    });
    carousel.addEventListener("pointerup", (event) => {
      if (swipeStart === undefined || swipeStart.pointerId !== event.pointerId) return;
      const deltaX = event.clientX - swipeStart.x;
      const deltaY = event.clientY - swipeStart.y;
      swipeStart = undefined;
      if (carousel.hasPointerCapture(event.pointerId)) carousel.releasePointerCapture(event.pointerId);
      if (Math.abs(deltaX) < swipeThreshold || Math.abs(deltaX) <= Math.abs(deltaY)) return;
      select(activeIndex() + (deltaX < 0 ? 1 : -1));
    });
    carousel.addEventListener("pointercancel", (event) => {
      if (swipeStart?.pointerId === event.pointerId) swipeStart = undefined;
    });
  });
};

initializeAboutLifeCarousel();

const initializeNewsGalleries = (): void => {
  document.querySelectorAll<HTMLElement>("[data-news-gallery]").forEach((gallery) => {
    const slides = [...gallery.querySelectorAll<HTMLElement>(".orlyata-news-detail__gallery-slide")];
    const selectors = [...gallery.querySelectorAll<HTMLButtonElement>("[data-news-gallery-select]")];
    const viewport = gallery.querySelector<HTMLElement>(".orlyata-news-detail__gallery-viewport");
    const swipeThreshold = 24;
    let swipeStart: { pointerId: number; x: number; y: number } | undefined;
    const activeIndex = (): number => Math.max(0, Number.parseInt(gallery.dataset.newsGalleryActive ?? "0", 10) || 0);
    const select = (requestedIndex: number): void => {
      const index = (requestedIndex + slides.length) % slides.length;
      if (index === activeIndex()) return;
      gallery.dataset.newsGalleryActive = String(index);
      selectors.forEach((control, controlIndex) => {
        const active = controlIndex === index;
        control.classList.toggle("is-active", active);
        control.setAttribute("aria-pressed", String(active));
      });
    };

    gallery.querySelector<HTMLButtonElement>(".orlyata-button--arrow-left-muted")?.addEventListener("click", () => select(activeIndex() - 1));
    gallery.querySelector<HTMLButtonElement>(".orlyata-button--arrow-right-muted")?.addEventListener("click", () => select(activeIndex() + 1));
    selectors.forEach((control, index) => control.addEventListener("click", () => select(index)));
    viewport?.addEventListener("pointerdown", (event) => {
      swipeStart = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
      viewport.setPointerCapture(event.pointerId);
    });
    viewport?.addEventListener("pointerup", (event) => {
      if (swipeStart === undefined || swipeStart.pointerId !== event.pointerId) return;
      const deltaX = event.clientX - swipeStart.x;
      const deltaY = event.clientY - swipeStart.y;
      swipeStart = undefined;
      if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
      if (Math.abs(deltaX) < swipeThreshold || Math.abs(deltaX) <= Math.abs(deltaY)) return;
      select(activeIndex() + (deltaX < 0 ? 1 : -1));
    });
    viewport?.addEventListener("pointercancel", (event) => {
      if (swipeStart?.pointerId === event.pointerId) swipeStart = undefined;
    });
  });
};

initializeNewsGalleries();

const photoAlbumArrowMarkup = (variant: "arrow-left-muted" | "arrow-right-muted"): string => `
  <span class="orlyata-button__arrow-track" aria-hidden="true">
    <span class="orlyata-button__arrow"><img class="orlyata-button__icon orlyata-button__icon--${variant}" src="${photoAlbumArrowIcon}" alt="" /></span>
    <span class="orlyata-button__arrow"><img class="orlyata-button__icon orlyata-button__icon--${variant}" src="${photoAlbumArrowIcon}" alt="" /></span>
  </span>
`;

const initializePhotoAlbumLightboxes = (): void => {
  const duration = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--duration-about-life-slide-transition"));
  const easing = getComputedStyle(document.documentElement).getPropertyValue("--easing-out").trim();

  document.querySelectorAll<HTMLElement>("[data-photo-album-gallery]").forEach((gallery) => {
    let trigger: HTMLAnchorElement | undefined;
    const galleryItems = [...gallery.querySelectorAll<HTMLAnchorElement>("[data-photo-album-gallery-item]")];

    galleryItems.forEach((item) => {
      item.addEventListener("click", () => {
        trigger = item;
      });
    });

    const lightbox = new PhotoSwipeLightbox({
      gallery,
      children: "[data-photo-album-gallery-item]",
      pswpModule: () => import("photoswipe"),
      showAnimationDuration: duration,
      hideAnimationDuration: duration,
      easing,
      returnFocus: false,
      arrowPrev: false,
      arrowNext: false,
    });

    lightbox.on("uiRegister", () => {
      const pswp = lightbox.pswp;
      if (pswp === undefined) return;

      pswp.ui.registerElement({
        name: "photoAlbumPrevious",
        className: "orlyata-button orlyata-button--arrow-left-muted orlyata-button--icon-only orlyata-photo-album-lightbox__arrow orlyata-photo-album-lightbox__arrow--previous",
        isButton: true,
        title: "Предыдущее фото",
        ariaLabel: "Предыдущее фото",
        html: photoAlbumArrowMarkup("arrow-left-muted"),
        appendTo: "wrapper",
        onClick: "prev",
      });

      pswp.ui.registerElement({
        name: "photoAlbumNext",
        className: "orlyata-button orlyata-button--arrow-right-muted orlyata-button--icon-only orlyata-photo-album-lightbox__arrow orlyata-photo-album-lightbox__arrow--next",
        isButton: true,
        title: "Следующее фото",
        ariaLabel: "Следующее фото",
        html: photoAlbumArrowMarkup("arrow-right-muted"),
        appendTo: "wrapper",
        onClick: "next",
      });

      pswp.on("destroy", () => {
        if (trigger === undefined) return;
        trigger.dataset.photoAlbumFocusRestored = "true";
        trigger.addEventListener("blur", () => {
          delete trigger.dataset.photoAlbumFocusRestored;
        }, { once: true });
        trigger.focus();
      });
    });

    lightbox.init();
  });
};

initializePhotoAlbumLightboxes();

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

export const initializeHomeHeroPreviewPlayback = (): void => {
  document.querySelectorAll<HTMLVideoElement>('.orlyata-home__hero-preview').forEach((preview) => {
    const playMutedInlinePreview = (): void => {
      preview.autoplay = true;
      preview.defaultMuted = true;
      preview.loop = true;
      preview.muted = true;
      preview.playsInline = true;
      void preview.play().catch(() => undefined);
    };

    preview.addEventListener('canplay', playMutedInlinePreview, { once: true });
    window.addEventListener('pageshow', playMutedInlinePreview);
    playMutedInlinePreview();
  });
};

initializeHomeHeroPreviewPlayback();

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

const sidebarMenuRevealDelayMs = 400;
const sidebarMenuIcon: IconNode = [['path', { d: 'M3 8.5h18m-18 7h18' }]];
const sidebarCloseIcon: IconNode = [['path', { d: 'M18 6 6 18M6 6l12 12' }]];

const initializedSidebarMenuToggles = new WeakSet<HTMLButtonElement>();

export const initializeSidebarMenus = (): void => {
  document.querySelectorAll<HTMLButtonElement>('.orlyata-sidebar__menu-toggle').forEach((toggle) => {
    if (initializedSidebarMenuToggles.has(toggle)) return;

    const sidebar = toggle.closest<HTMLElement>('.orlyata-sidebar');
    if (sidebar === null) return;

    initializedSidebarMenuToggles.add(toggle);
    sidebar.classList.remove('is-menu-open', 'is-menu-open-content');
    toggle.setAttribute('aria-expanded', 'false');
    const path = toggle.querySelector<SVGPathElement>('.orlyata-button__menu-icon-path');
    const morph = path === null ? undefined : createMorph(path, sidebarMenuIcon, { reducedMotion: 'never' });

    toggle.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('is-menu-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
      morph?.morphTo(isOpen ? sidebarCloseIcon : sidebarMenuIcon);

      if (isOpen) {
        window.setTimeout(() => {
          if (sidebar.classList.contains('is-menu-open')) sidebar.classList.add('is-menu-open-content');
        }, sidebarMenuRevealDelayMs);
      } else {
        sidebar.classList.remove('is-menu-open-content');
      }
    });
  });
};

initializeSidebarMenus();

const homeSidebarScrollThreshold = 0;

const initializeHomeSidebarScrollState = (): void => {
  const sidebar = document.querySelector<HTMLElement>('.home .orlyata-sidebar');
  if (sidebar === null) return;

  const updateScrollState = (): void => {
    const isScrolled = window.scrollY > homeSidebarScrollThreshold;

    if (!isScrolled) {
      sidebar.classList.remove('is-home-scrolled');
      return;
    }

    if (!sidebar.classList.contains('is-home-scrolled')) {
      sidebar.classList.add('is-home-scrolled');
    }
  };

  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();
};

initializeHomeSidebarScrollState();


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
  document.querySelectorAll<HTMLElement>(selector).forEach((section) => {
    if (section.dataset.revealInitialized === 'true' || !('IntersectionObserver' in window)) {
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
  });
};

export const initializeHomeMediaReveal = (): void => {
  initializeHomeScrollReveal('.orlyata-home__media-section');
};

export const initializeMediaGalleryReveal = (): void => {
  initializeHomeScrollReveal('.orlyata-media-gallery__section, .orlyata-media-gallery [data-media-gallery-reveal], [data-archive-content-reveal], [data-photo-album-reveal], .orlyata-teacher-detail [data-teacher-reveal]');
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
initializeMediaGalleryReveal();
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

const copyIcon: IconNode = [["path", { d: "M10 8h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2ZM4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2" }]];
const checkIcon: IconNode = [["path", { d: "m20 6-11 11-5-5" }]];

export const initializeNewsShareCopy = (root: ParentNode = document): void => {
  root.querySelectorAll<HTMLButtonElement>('[data-copy-news-link]').forEach((control) => {
    const path = control.querySelector<SVGPathElement>('.orlyata-page-hero__copy-icon-path');
    const morph = path === null ? undefined : createMorph(path, copyIcon, { reducedMotion: "never" });

    const copyNewsLink = async (): Promise<void> => {
      const url = control.dataset.copyNewsLink;
      if (url === undefined || url === '') return;

      try {
        await navigator.clipboard.writeText(url);
        control.dataset.copyState = 'copied';
        control.setAttribute('aria-pressed', 'true');
        control.setAttribute('aria-label', 'Ссылка скопирована');
        control.setAttribute('title', 'Ссылка скопирована');
        morph?.morphTo(checkIcon);
      } catch {
        // The control retains its initial state when clipboard permissions are denied.
      }
    };

    control.addEventListener('click', () => {
      void copyNewsLink();
    });
  });
};

const initializeDataTableRowLinks = (): void => {
  document.querySelectorAll<HTMLTableRowElement>('[data-row-link]').forEach((row) => {
    if (row.dataset.rowLinkInitialized === 'true') return;
    row.dataset.rowLinkInitialized = 'true';
    row.addEventListener('click', (event) => {
      if ((event.target as Element).closest('a, button, input, select, textarea')) return;
      const url = row.dataset.rowLink;
      if (url !== undefined && url !== '') window.location.assign(url);
    });
  });
};

initializePageHeroTitleReveal();
initializeNewsShareCopy();
initializeDataTableRowLinks();
initializeAboutSectionReveal();
initializeApplicationFormValidation();

const initializeNewsFilters = (): void => {
  document.querySelectorAll<HTMLElement>('[data-news-filters]').forEach((filters) => {
    const items = [...filters.querySelectorAll<HTMLElement>('[data-news-filter]')];
    const closeIconUrl = filters.dataset.newsCloseIcon ?? '';
    const parameter = 'orlyata_news_category';

    const validCategories = (value: string): Set<string> => new Set(
      value.split(',').filter((category) => items.some((item) => item.dataset.newsFilter === category && category !== '')),
    );
    const categoriesFromLocation = (): Set<string> => validCategories(new URL(window.location.href).searchParams.get(parameter) ?? '');
    const categoryUrl = (categories: Set<string>): string => {
      const url = new URL(window.location.href);
      if (categories.size === 0) url.searchParams.delete(parameter);
      else url.searchParams.set(parameter, [...categories].join(','));
      return url.toString();
    };
    const update = (categories: Set<string>): void => {
      document.querySelectorAll<HTMLTableRowElement>('[data-row-category]').forEach((row) => {
        const rowCategory = row.dataset.rowCategory ?? '';
        const wasHidden = row.hidden;
        const isHidden = categories.size !== 0 && !categories.has(rowCategory);
        row.hidden = isHidden;
        if (isHidden) {
          row.classList.remove('is-entering');
        } else if (wasHidden) {
          row.classList.remove('is-entering');
          void row.offsetWidth;
          row.classList.add('is-entering');
        }
      });

      items.forEach((item) => {
        const link = item.querySelector<HTMLAnchorElement>('.orlyata-button');
        if (link === null) return;
        link.getAnimations().forEach((animation) => animation.cancel());
      });

      const before = new Map(items.map((item) => {
        const link = item.querySelector<HTMLAnchorElement>('.orlyata-button');
        return [link, link === null ? undefined : {
          bounds: link.getBoundingClientRect(),
        }] as const;
      }));

      items.forEach((item) => {
        const itemCategory = item.dataset.newsFilter ?? '';
        const link = item.querySelector<HTMLAnchorElement>('.orlyata-button');
        if (link === null) return;
        const selected = itemCategory === '' ? categories.size === 0 : categories.has(itemCategory);
        const isCloseState = selected && itemCategory !== '';
        const nextCategories = new Set(categories);
        if (itemCategory === '') nextCategories.clear();
        else if (nextCategories.has(itemCategory)) nextCategories.delete(itemCategory);
        else nextCategories.add(itemCategory);
        link.classList.toggle('orlyata-button--primary', selected);
        link.classList.toggle('orlyata-button--secondary', !selected);
        link.classList.toggle('orlyata-button--with-icon', isCloseState);
        link.href = categoryUrl(nextCategories);
        link.querySelector('.orlyata-button__icon')?.remove();
        if (isCloseState && closeIconUrl !== '') {
          const icon = document.createElement('img');
          icon.className = 'orlyata-button__icon orlyata-button__icon--close';
          icon.src = closeIconUrl;
          icon.alt = '';
          icon.setAttribute('aria-hidden', 'true');
          link.append(icon);
        }
      });

      before.forEach((previousBounds, link) => {
        if (link === null || previousBounds === undefined) return;
        const currentBounds = link.getBoundingClientRect();
        const translateX = previousBounds.bounds.left - currentBounds.left;
        const scaleX = previousBounds.bounds.width / currentBounds.width;
        if (translateX === 0 || scaleX !== 1) return;
        link.animate(
          [
            { transform: `translateX(${String(translateX)}px)` },
            { transform: 'translateX(0)' },
          ],
          { duration: 400, easing: 'ease-out' },
        );
      });
    };

    update(categoriesFromLocation());
    filters.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>('.orlyata-button');
      const item = link?.closest<HTMLElement>('[data-news-filter]');
      if (link === null || item === null || item === undefined) return;
      event.preventDefault();
      const selected = item.dataset.newsFilter ?? '';
      const nextCategories = categoriesFromLocation();
      if (selected === '') nextCategories.clear();
      else if (nextCategories.has(selected)) nextCategories.delete(selected);
      else nextCategories.add(selected);
      history.pushState({ newsCategories: [...nextCategories] }, '', categoryUrl(nextCategories));
      update(nextCategories);
    });
    window.addEventListener('popstate', () => update(categoriesFromLocation()));
  });
};

initializeNewsFilters();

const initializeMediaFilters = (): void => {
  document.querySelectorAll<HTMLElement>('[data-media-filters]').forEach((filters) => {
    const items = [...filters.querySelectorAll<HTMLElement>('[data-media-filter]')];
    const closeIconUrl = filters.dataset.mediaCloseIcon ?? '';
    const parameter = 'category';
    const validCategories = (value: string): Set<string> => new Set(
      value.split(',').filter((category) => items.some((item) => item.dataset.mediaFilter === category && category !== '')),
    );
    const categoriesFromLocation = (): Set<string> => validCategories(new URL(window.location.href).searchParams.get(parameter) ?? '');
    const categoryUrl = (categories: Set<string>): string => {
      const url = new URL(window.location.href);
      if (categories.size === 0) url.searchParams.delete(parameter);
      else url.searchParams.set(parameter, [...categories].join(','));
      return url.toString();
    };
    const update = (categories: Set<string>): void => {
      document.querySelectorAll<HTMLTableRowElement>('[data-row-category]').forEach((row) => {
        const wasHidden = row.hidden;
        const isHidden = categories.size !== 0 && !categories.has(row.dataset.rowCategory ?? '');
        row.hidden = isHidden;
        if (isHidden) {
          row.classList.remove('is-entering');
        } else if (wasHidden) {
          row.classList.remove('is-entering');
          void row.offsetWidth;
          row.classList.add('is-entering');
        }
      });
      items.forEach((item) => {
        const value = item.dataset.mediaFilter ?? '';
        const link = item.querySelector<HTMLAnchorElement>('.orlyata-button');
        if (link === null) return;
        const selected = value === '' ? categories.size === 0 : categories.has(value);
        const nextCategories = new Set(categories);
        if (value === '') nextCategories.clear();
        else if (nextCategories.has(value)) nextCategories.delete(value);
        else nextCategories.add(value);
        link.classList.toggle('orlyata-button--primary', selected);
        link.classList.toggle('orlyata-button--secondary', !selected);
        link.classList.toggle('orlyata-button--with-icon', selected && value !== '');
        link.href = categoryUrl(nextCategories);
        link.querySelector('.orlyata-button__icon')?.remove();
        if (selected && value !== '' && closeIconUrl !== '') {
          const icon = document.createElement('img');
          icon.className = 'orlyata-button__icon orlyata-button__icon--close';
          icon.src = closeIconUrl;
          icon.alt = '';
          icon.setAttribute('aria-hidden', 'true');
          link.append(icon);
        }
      });
    };
    update(categoriesFromLocation());
    filters.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const item = (event.target as Element).closest<HTMLElement>('[data-media-filter]');
      if (item === null) return;
      event.preventDefault();
      const value = item.dataset.mediaFilter ?? '';
      const nextCategories = categoriesFromLocation();
      if (value === '') nextCategories.clear();
      else if (nextCategories.has(value)) nextCategories.delete(value);
      else nextCategories.add(value);
      history.pushState({ mediaCategories: [...nextCategories] }, '', categoryUrl(nextCategories));
      update(nextCategories);
    });
    window.addEventListener('popstate', () => {
      update(categoriesFromLocation());
    });
  });
};

initializeMediaFilters();

const initializeNotesFilters = (): void => {
  document.querySelectorAll<HTMLElement>('[data-notes-filters]').forEach((filters) => {
    const items = [...filters.querySelectorAll<HTMLElement>('[data-notes-filter]')];
    const closeIconUrl = filters.dataset.notesCloseIcon ?? '';
    const parameter = 'orlyata_notes_choir';
    const validChoirs = (value: string): Set<string> => new Set(value.split(',').filter((choir) => items.some((item) => item.dataset.notesFilter === choir && choir !== '')));
    const choirsFromLocation = (): Set<string> => validChoirs(new URL(window.location.href).searchParams.get(parameter) ?? '');
    const choirUrl = (choirs: Set<string>): string => {
      const url = new URL(window.location.href);
      if (choirs.size === 0) url.searchParams.delete(parameter);
      else url.searchParams.set(parameter, [...choirs].join(','));
      return url.toString();
    };
    const update = (choirs: Set<string>): void => {
      document.querySelectorAll<HTMLTableRowElement>('[data-notes-choir]').forEach((row) => {
        const wasHidden = row.hidden;
        const isHidden = row.dataset.notesSearchMatch === 'false' || (choirs.size !== 0 && !choirs.has(row.dataset.notesChoir ?? ''));
        row.hidden = isHidden;
        if (isHidden) {
          row.classList.remove('is-entering');
        } else if (wasHidden) {
          row.classList.remove('is-entering');
          void row.offsetWidth;
          row.classList.add('is-entering');
        }
      });
      document.dispatchEvent(new Event('notes-results-updated'));
      const before = new Map(items.map((item) => {
        const link = item.querySelector<HTMLAnchorElement>('.orlyata-button');
        link?.getAnimations().forEach((animation) => animation.cancel());
        return [link, link === null ? undefined : link.getBoundingClientRect()] as const;
      }));
      items.forEach((item) => {
        const choir = item.dataset.notesFilter ?? '';
        const link = item.querySelector<HTMLAnchorElement>('.orlyata-button');
        if (link === null) return;
        const selected = choir === '' ? choirs.size === 0 : choirs.has(choir);
        const withClose = selected && choir !== '';
        const next = new Set(choirs);
        if (choir === '') next.clear(); else if (next.has(choir)) next.delete(choir); else next.add(choir);
        link.classList.toggle('orlyata-button--primary', selected);
        link.classList.toggle('orlyata-button--secondary', !selected);
        link.classList.toggle('orlyata-button--with-icon', withClose);
        link.href = choirUrl(next);
        link.querySelector('.orlyata-button__icon')?.remove();
        if (withClose && closeIconUrl !== '') {
          const icon = document.createElement('img');
          icon.className = 'orlyata-button__icon orlyata-button__icon--close';
          icon.src = closeIconUrl;
          icon.alt = '';
          icon.setAttribute('aria-hidden', 'true');
          link.append(icon);
        }
      });
      before.forEach((previous, link) => {
        if (link === null || previous === undefined) return;
        const translateX = previous.left - link.getBoundingClientRect().left;
        if (translateX === 0) return;
        link.animate([{ transform: `translateX(${String(translateX)}px)` }, { transform: 'translateX(0)' }], { duration: 400, easing: 'ease-out' });
      });
    };
    update(choirsFromLocation());
    filters.addEventListener('click', (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>('.orlyata-button');
      const item = link?.closest<HTMLElement>('[data-notes-filter]');
      if (link === null || item === null || item === undefined) return;
      event.preventDefault();
      const selected = item.dataset.notesFilter ?? '';
      const next = choirsFromLocation();
      if (selected === '') next.clear(); else if (next.has(selected)) next.delete(selected); else next.add(selected);
      history.pushState({ notesChoirs: [...next] }, '', choirUrl(next));
      update(next);
    });
    window.addEventListener('popstate', () => update(choirsFromLocation()));
  });
};

initializeNotesFilters();

const initializeNotesSearch = (): void => {
  document.querySelectorAll<HTMLInputElement>('[data-notes-search]').forEach((search) => {
    let searchDelay: number | undefined;
    const loading = document.querySelector<HTMLElement>('[data-notes-loading]');
    const empty = document.querySelector<HTMLElement>('[data-notes-empty]');
    const table = document.querySelector<HTMLElement>('.orlyata-notes__table');
    const updateResults = (): void => {
      const query = search.value.trim().toLocaleLowerCase('ru-RU');
      document.querySelectorAll<HTMLTableRowElement>('[data-notes-choir]').forEach((row) => {
        const cells = row.querySelectorAll<HTMLTableCellElement>('td');
        const searchableText = [cells.item(0)?.textContent ?? '', cells.item(1)?.textContent ?? ''].join(' ').toLocaleLowerCase('ru-RU');
        const matchesSearch = query === '' || searchableText.includes(query);
        row.dataset.notesSearchMatch = String(matchesSearch);
        const choirMatches = new URL(window.location.href).searchParams.get('orlyata_notes_choir')?.split(',').filter(Boolean) ?? [];
        row.hidden = !matchesSearch || (choirMatches.length !== 0 && !choirMatches.includes(row.dataset.notesChoir ?? ''));
      });
      document.dispatchEvent(new Event('notes-results-updated'));
    };
    const update = (): void => {
      if (searchDelay !== undefined) window.clearTimeout(searchDelay);
      if (search.value.trim() === '') {
        loading?.setAttribute('hidden', '');
        updateResults();
        return;
      }
      table?.setAttribute('hidden', '');
      empty?.setAttribute('hidden', '');
      loading?.removeAttribute('hidden');
      searchDelay = window.setTimeout(() => {
        loading?.setAttribute('hidden', '');
        updateResults();
      }, 1000);
    };
    search.addEventListener('input', update);
    updateResults();
  });
};

initializeNotesSearch();

const initializeNotesSearchToggle = (): void => {
  const mobileQuery = window.matchMedia("(max-width: 767px)");
  document.querySelectorAll<HTMLButtonElement>("[data-notes-search-toggle]").forEach((toggle) => {
    const formId = toggle.getAttribute("aria-controls");
    const form = formId === null ? null : document.getElementById(formId) as HTMLFormElement | null;
    const sheet = form?.closest<HTMLElement>("[data-notes-search-sheet]");
    const panel = sheet?.querySelector<HTMLElement>("[data-notes-search-sheet-panel]");
    const field = form?.querySelector<HTMLInputElement>("[data-notes-search]");
    const close = sheet?.querySelector<HTMLButtonElement>(".orlyata-notes__search-sheet-close");
    const controls = document.querySelector<HTMLElement>(".orlyata-notes__controls");
    const backdrop = sheet?.querySelector<HTMLButtonElement>("[data-notes-search-dismiss]");
    if (form === null || sheet === null || panel === null || field === null || close === null || backdrop === null || controls === null) return;

    let isOpen = mobileQuery.matches && field.value.trim() !== "";
    let hasInteracted = false;
    let lockedScrollY: number | undefined;
    let removeKeyboardViewportListener: (() => void) | undefined;

    const updateVisualViewportOffset = (): void => {
      const offset = window.visualViewport?.offsetTop ?? 0;
      document.documentElement.style.setProperty("--notes-search-visual-viewport-offset", String(offset) + "px");
    };

    const lockPageAtControls = (): void => {
      const contentGap = Number.parseFloat(getComputedStyle(panel).columnGap);
      const controlsDocumentTop = window.scrollY + controls.getBoundingClientRect().top;
      lockedScrollY = Math.max(0, controlsDocumentTop - panel.getBoundingClientRect().height - contentGap);
      document.documentElement.style.setProperty("--notes-search-locked-scroll-y", String(lockedScrollY) + "px");
      updateVisualViewportOffset();
      document.body.classList.add("is-notes-search-open");
    };

    const unlockPage = (): void => {
      const restoreScrollY = lockedScrollY ?? window.scrollY;
      document.body.classList.remove("is-notes-search-open");
      document.documentElement.style.removeProperty("--notes-search-locked-scroll-y");
      document.documentElement.style.removeProperty("--notes-search-visual-viewport-offset");
      lockedScrollY = undefined;
      window.scrollTo(0, restoreScrollY);
    };

    const listenForKeyboardViewport = (): void => {
      removeKeyboardViewportListener?.();
      const viewport = window.visualViewport;
      const realign = (): void => { updateVisualViewportOffset(); };
      viewport?.addEventListener("resize", realign);
      viewport?.addEventListener("scroll", realign);
      removeKeyboardViewportListener = (): void => {
        viewport?.removeEventListener("resize", realign);
        viewport?.removeEventListener("scroll", realign);
        removeKeyboardViewportListener = undefined;
      };
    };

    const sync = (): void => {
      const isMobile = mobileQuery.matches;
      if (!isMobile) isOpen = false;
      if (isMobile && !hasInteracted && field.value.trim() !== "") isOpen = true;

      toggle.hidden = !isMobile;
      sheet.hidden = isMobile && !isOpen;
      close.hidden = !isOpen;
      backdrop.hidden = !isOpen;
      toggle.setAttribute("aria-expanded", String(isOpen));

    };

    const open = (): void => {
      hasInteracted = true;
      isOpen = true;
      sync();
      lockPageAtControls();
      listenForKeyboardViewport();
      field.focus({ preventScroll: true });
    };

    const closeSheet = (restoreFocus: boolean): void => {
      removeKeyboardViewportListener?.();
      unlockPage();
      hasInteracted = true;
      isOpen = false;
      sync();
      if (restoreFocus && mobileQuery.matches) toggle.focus();
    };

    toggle.addEventListener("click", open);
    close.addEventListener("click", () => { closeSheet(true); });
    backdrop.addEventListener("click", () => { closeSheet(true); });
    document.addEventListener("keydown", (event) => {
      if (!isOpen || !mobileQuery.matches || event.key !== "Escape") return;
      event.preventDefault();
      closeSheet(true);
    });
    mobileQuery.addEventListener("change", sync);
    sync();
  });
};

initializeNotesSearchToggle();

document.querySelectorAll<HTMLInputElement>('[data-notes-search]').forEach((search) => {
  const clear = search.parentElement?.querySelector<HTMLButtonElement>('[data-notes-search-clear]');
  const syncClear = (): void => { if (clear !== null && clear !== undefined) clear.hidden = search.value === ''; };
  syncClear();
  search.addEventListener('input', syncClear);
  clear?.addEventListener('click', () => {
    search.value = '';
    search.dispatchEvent(new Event('input', { bubbles: true }));
    search.focus();
  });
});

const syncNotesEmptyState = (): void => {
  const search = document.querySelector<HTMLInputElement>('[data-notes-search]');
  const empty = document.querySelector<HTMLElement>('[data-notes-empty]');
  const table = document.querySelector<HTMLElement>('.orlyata-notes__table');
  const loading = document.querySelector<HTMLElement>('[data-notes-loading]');
  if (search === null || empty === null || table === null || loading === null || !loading.hidden) return;
  const hasVisibleRows = [...document.querySelectorAll<HTMLTableRowElement>('[data-notes-choir]')].some((row) => !row.hidden);
  const showEmpty = search.value.trim() !== '' && !hasVisibleRows;
  const wasHidden = empty.hidden;
  empty.hidden = !showEmpty;
  if (showEmpty && wasHidden) {
    empty.classList.remove('is-entering');
    void empty.offsetWidth;
    empty.classList.add('is-entering');
  }
  table.hidden = showEmpty;
};

const syncNotesVisibleFileCount = (): void => {
  const count = [...document.querySelectorAll<HTMLTableRowElement>('[data-notes-choir]')].filter((row) => !row.hidden).length;
  const word = (value: number): string => {
    const lastTwoDigits = value % 100;
    const lastDigit = value % 10;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return 'файлов';
    if (lastDigit === 1) return 'файл';
    if (lastDigit >= 2 && lastDigit <= 4) return 'файла';
    return 'файлов';
  };
  const countElement = document.querySelector<HTMLElement>('.orlyata-notes .orlyata-page-hero__corner-meta');
  const nextLabel = `${String(count)} ${word(count)}`;
  if (countElement !== null && countElement.textContent !== nextLabel) {
    countElement.classList.remove('is-count-changing');
    void countElement.offsetWidth;
    countElement.textContent = nextLabel;
    countElement.classList.add('is-count-changing');
  }
};

document.querySelectorAll<HTMLInputElement>('[data-notes-search]').forEach((search) => search.addEventListener('input', syncNotesEmptyState));
document.addEventListener('notes-results-updated', syncNotesEmptyState);
document.addEventListener('notes-results-updated', syncNotesVisibleFileCount);
syncNotesEmptyState();
syncNotesVisibleFileCount();

const initializeHomeNewsCarousel = (): void => {
  document.querySelectorAll<HTMLElement>("[data-home-news-carousel]").forEach((carousel) => {
    const panel = carousel.closest<HTMLElement>(".orlyata-home__hero-panel--news");
    const slides = [...carousel.querySelectorAll<HTMLElement>(".orlyata-news-card")];
    const home = carousel.closest<HTMLElement>(".orlyata-home");
    const controls = home === null ? [] : [...home.querySelectorAll<HTMLButtonElement>("[data-home-news-select]")];
    if (panel === null || slides.length < 2 || controls.length < 2) return;
    const activeIndex = (): number => Math.max(0, Number.parseInt(carousel.dataset.homeNewsActive ?? "0", 10) || 0);
    const select = (requestedIndex: number): void => {
      const index = (requestedIndex + slides.length) % slides.length;
      if (index === activeIndex()) return;
      carousel.dataset.homeNewsActive = String(index);
      controls.forEach((control, controlIndex) => {
        const active = controlIndex === index;
        control.classList.toggle("is-active", active);
        control.setAttribute("aria-pressed", String(active));
      });
    };
    controls.forEach((control, index) => {
      control.addEventListener("click", () => { select(index); });
    });
    let swipeStart: { pointerId: number; x: number } | undefined;
    panel.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" || event.target instanceof Element && event.target.closest("a, button")) return;
      swipeStart = { pointerId: event.pointerId, x: event.clientX };
      panel.setPointerCapture(event.pointerId);
    });
    panel.addEventListener("pointerup", (event) => {
      if (swipeStart === undefined || swipeStart.pointerId !== event.pointerId) return;
      const deltaX = event.clientX - swipeStart.x;
      swipeStart = undefined;
      if (panel.hasPointerCapture(event.pointerId)) panel.releasePointerCapture(event.pointerId);
      if (Math.abs(deltaX) >= 40) select(deltaX < 0 ? activeIndex() + 1 : activeIndex() - 1);
    });
    panel.addEventListener("pointercancel", (event) => {
      if (swipeStart === undefined || swipeStart.pointerId !== event.pointerId) return;
      swipeStart = undefined;
      if (panel.hasPointerCapture(event.pointerId)) panel.releasePointerCapture(event.pointerId);
    });
  });
};

initializeHomeNewsCarousel();

const initializeApplicationDemo = (): void => {
  if (new URLSearchParams(window.location.search).get("application_demo") !== "1") return;
  document.querySelectorAll<HTMLFormElement>("form.orlyata-application-form").forEach((form) => {
    const initialMarkup = form.outerHTML;
    form.addEventListener("submit", (event) => {
      const fields = [...form.querySelectorAll<HTMLInputElement>(".orlyata-input__field")];
      if (fields.some((field) => field.required && (field.value.trim() === "" || field.value === "+7 ("))) return;
      event.preventDefault();
      const submit = form.querySelector<HTMLButtonElement>(".orlyata-application-form__submit");
      if (submit === null || form.dataset.applicationDemoSubmitting === "true") return;
      form.dataset.applicationDemoSubmitting = "true";
      form.setAttribute("aria-busy", "true"); submit.disabled = true; submit.classList.add("is-loading");
      const label = submit.querySelector<HTMLElement>(".orlyata-button__label"); if (label !== null) label.innerHTML = `Отправляем заявку <span class="orlyata-button__loading-dots" aria-hidden="true"><span class="orlyata-button__loading-dot"></span><span class="orlyata-button__loading-dot"></span><span class="orlyata-button__loading-dot"></span></span>`;
      window.setTimeout(() => {
        form.outerHTML = `<div class="orlyata-application-form orlyata-application-form--success" role="status"><div class="orlyata-application-form__success-content"><img class="orlyata-application-form__success-icon" src="/wp-content/themes/orlyata/assets/icons/application-success.svg" alt=""><h2 class="orlyata-application-form__success-title">Заявка принята!</h2><p class="orlyata-application-form__success-copy">Нам нужно немного времени, чтобы её обработать и перезвонить вам</p></div><a class="orlyata-button orlyata-button--primary orlyata-application-form__success-action" href="#application" data-application-demo-reset><span class="orlyata-button__label">Хорошо</span></a></div>`;
        document.querySelector<HTMLAnchorElement>("[data-application-demo-reset]")?.addEventListener("click", (resetEvent) => { resetEvent.preventDefault(); resetEvent.stopPropagation(); const success = resetEvent.currentTarget.closest<HTMLElement>(".orlyata-application-form--success"); if (success !== null) { success.outerHTML = initialMarkup; initializeApplicationFormValidation(); } });
      }, 3000);
    });
  });
};

initializeApplicationDemo();

document.addEventListener("click", (event) => {
  const reset = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("[data-application-demo-reset]") : null;
  if (reset === null) return;
  event.preventDefault();
});
