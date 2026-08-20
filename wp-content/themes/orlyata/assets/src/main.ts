import './styles/main.css';

document.documentElement.classList.add('has-js');

const prefersReducedMotion = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  document.querySelectorAll<HTMLAnchorElement>('.orlyata-home__hero-play').forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();

      if (!dialog.open) {
        dialog.showModal();
      }

      preview?.pause();
      original.currentTime = 0;
      void original.play().catch(() => undefined);
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


document.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) { return; }
  const summary = target.closest<HTMLElement>('.orlyata-accordion__summary');
  const accordion = summary?.parentElement;
  if (!(summary instanceof HTMLElement) || !(accordion instanceof HTMLDetailsElement)) { return; }
  const content = accordion.querySelector<HTMLElement>('.orlyata-accordion__content');
  if (content === null) { return; }

  event.preventDefault();
  content.getAnimations().forEach((animation) => { animation.cancel(); });
  if (prefersReducedMotion()) { accordion.open = !accordion.open; return; }
  const styles = window.getComputedStyle(accordion);
  const duration = Number.parseFloat(styles.getPropertyValue('--duration-normal')) || 240;
  const easing = styles.getPropertyValue('--easing-standard').trim();

  if (!accordion.open) {
    accordion.open = true;
    content.animate([{ height: '0', opacity: 0 }, { height: String(content.scrollHeight) + 'px', opacity: 1 }], { duration, easing });
    return;
  }

  const animation = content.animate([{ height: String(content.scrollHeight) + 'px', opacity: 1 }, { height: '0', opacity: 0 }], { duration, easing });
  void animation.finished.then(() => { accordion.open = false; }).catch(() => undefined);
});

const digitsOnly = (value: string): string => value.replace(/\D/g, '');

const formatDateMask = (value: string): string => {
  const digits = digitsOnly(value).slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter((part) => part !== '');
  return parts.join('.');
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
});

document.addEventListener('blur', (event) => {
  const target = event.target;

  if (!(target instanceof HTMLInputElement) || target.dataset.inputMask !== 'date') {
    return;
  }

  target.value = correctDateMask(target);
  target.closest('.orlyata-input')?.classList.toggle('is-filled', target.value !== '');
}, true);
