import type { Meta, StoryObj } from '@storybook/html-vite';

const assetRoot = '/wp-content/themes/orlyata/assets';

export function createComponentPage(title: string, description: string): HTMLElement {
  const main = document.createElement('main');
  const header = document.createElement('header');
  const heading = document.createElement('h1');
  const note = document.createElement('p');

  main.className = 'component-page';
  header.className = 'component-header';
  heading.className = 'type-heading-1';
  heading.textContent = title;
  note.className = 'type-body';
  note.textContent = description;
  header.append(heading, note);
  main.append(header);

  return main;
}

export function appendSection(root: HTMLElement, title: string, elements: HTMLElement[]): void {
  const element = document.createElement('section');
  const heading = document.createElement('h2');
  const row = document.createElement('div');

  element.className = 'component-section';
  heading.className = 'type-heading-3';
  heading.textContent = title;
  row.className = 'component-row';
  row.append(...elements);
  element.append(heading, row);
  root.append(element);
}

export function textLink(label: string, href = '#about'): HTMLAnchorElement {
  const link = document.createElement('a');

  link.className = 'orlyata-text-link';
  link.href = href;
  link.textContent = label;

  return link;
}

export function badge(label: string, variant: 'default' | 'inverse' = 'default'): HTMLSpanElement {
  const element = document.createElement('span');

  element.className = 'orlyata-badge orlyata-badge--' + variant;
  element.textContent = label;

  return element;
}

export function input(
  label: string,
  state: 'default' | 'typing' | 'filled' | 'error',
  identifier: string,
  controlledValue?: string,
  controlledError?: string,
  type: 'text' | 'tel' | 'date' | 'search' = 'text',
): HTMLDivElement {
  const root = document.createElement('div');
  const control = document.createElement('div');
  const fieldLabel = document.createElement('label');
  const field = document.createElement('input');
  const id = 'storybook-' + identifier;

  const rawValue = controlledValue ?? (state === 'typing' ? 'Семёнов' : state === 'filled' ? 'Семёнова Мария Павловна' : '');
  const value = type === 'date' && /^\d{4}-\d{2}-\d{2}$/.test(rawValue) ? rawValue.slice(8, 10) + '.' + rawValue.slice(5, 7) + '.' + rawValue.slice(0, 4) : rawValue;
  const error = state === 'error' ? (controlledError ?? 'поле обязательно для заполнения') : '';

  root.className =
    'orlyata-input' +
    (state === 'typing' ? ' is-typing' : '') +
    (state === 'filled' ? ' is-filled' : '') +
    (state === 'error' ? ' has-error' : '');
  control.className = 'orlyata-input__control';
  fieldLabel.className = 'orlyata-input__label';
  fieldLabel.htmlFor = id;
  fieldLabel.textContent = label;
  field.className = 'orlyata-input__field';
  field.id = id;
  field.name = id;
  field.type = type === 'date' ? 'text' : type;
  field.value = value;
  if (type === 'date') {
    field.inputMode = 'numeric';
    field.maxLength = 10;
    field.pattern = '[0-9]{2}\\.[0-9]{2}\\.[0-9]{4}';
    field.dataset.inputMask = 'date';
    field.dataset.dateMax = new Date().toISOString().slice(0, 10);
  }
  if (type === 'tel') {
    field.inputMode = 'tel';
    field.maxLength = 18;
    field.pattern = '\\+7 \\([0-9]{3}\\) [0-9]{3}-[0-9]{2}-[0-9]{2}';
    field.dataset.inputMask = 'phone';
  }
  control.append(fieldLabel, field);
  root.append(control);

  if (error !== '') {
    const errorElement = document.createElement('p');
    errorElement.className = 'orlyata-input__error';
    errorElement.id = id + '-error';
    errorElement.textContent = error;
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', errorElement.id);
    root.append(errorElement);
  }

  return root;
}

export function accordion(
  open: boolean,
  titleText = 'Подготовительная группа',
  metaText = '5-7 лет',
  contentText = 'Подготовительная группа 5-7 лет занимается изучением основ музыкальной грамоты, постановкой правильного дыхания при пении сидя и стоя, поёт несложные произведения и учится играть на детских инструментах.',
): HTMLDetailsElement {
  const element = document.createElement('details');
  const summary = document.createElement('summary');
  const title = document.createElement('span');
  const meta = document.createElement('span');
  const toggle = document.createElement('span');
  const content = document.createElement('div');

  element.className = 'orlyata-accordion';
  element.open = open;
  summary.className = 'orlyata-accordion__summary';
  title.className = 'orlyata-accordion__title';
  title.textContent = titleText;
  meta.className = 'orlyata-accordion__meta';
  meta.textContent = metaText;
  toggle.className = 'orlyata-accordion__toggle';
  toggle.setAttribute('aria-hidden', 'true');
  content.className = 'orlyata-accordion__content';
  content.textContent = contentText;
  summary.append(title, meta, toggle);
  element.append(summary, content);

  return element;
}

export function advantage(value: string, label: string): HTMLDivElement {
  const element = document.createElement('div');
  const number = document.createElement('p');
  const text = document.createElement('p');

  element.className = 'orlyata-advantage';
  number.className = 'orlyata-advantage__value';
  number.textContent = value;
  text.className = 'orlyata-advantage__label';
  text.textContent = label;
  element.append(number, text);

  return element;
}

export function newsCard(
  titleText = '«Крылатое сердце» — большой весенний концерт',
  dateLabel = 'сегодня',
  href = '#news',
): HTMLElement {
  const article = document.createElement('article');
  const link = document.createElement('a');
  const icon = document.createElement('img');
  const title = document.createElement('h3');

  article.className = 'orlyata-news-card';
  link.className = 'orlyata-news-card__link';
  link.href = href;
  icon.className = 'orlyata-news-card__icon';
  icon.src = assetRoot + '/icons/news-category-theatre.svg';
  icon.alt = '';
  title.className = 'orlyata-news-card__title';
  title.textContent = titleText;
  link.append(icon, title);
  article.append(link, badge(dateLabel));

  return article;
}

type MediaType = 'photo' | 'video';

interface MediaCardOptions {
  mediaType?: MediaType;
  showPlayIcon?: boolean;
  startOffsetSeconds?: number;
  videoUrl?: string;
}


function detectVideoProvider(url: string): string {
  try {
    const hostname = new URL(url).hostname.toLowerCase();

    if (hostname === 'youtu.be' || hostname.endsWith('youtube.com')) {
      return 'YouTube';
    }

    if (hostname.endsWith('rutube.ru')) {
      return 'RuTube';
    }

    if (hostname.endsWith('vk.com') || hostname.endsWith('vkvideo.ru')) {
      return 'VK Видео';
    }
  } catch {
    return '';
  }

  return '';
}

export function mediaCard(
  size: 'big' | 'small',
  controlledTitle?: string,
  controlledDate?: string,
  provider = 'RuTube',
  href = '#media',
  options: MediaCardOptions = {},
): HTMLElement {
  const mediaType = options.mediaType ?? 'photo';
  const videoUrl = options.videoUrl?.trim() ?? '';
  const isVideo = mediaType === 'video';
  const showPlayIcon = isVideo && (options.showPlayIcon ?? false);
  const resolvedProvider = isVideo ? detectVideoProvider(videoUrl) : provider;
  const article = document.createElement('article');
  const link = document.createElement('a');
  const imageWrap = document.createElement('div');
  const image = document.createElement('img');
  const content = document.createElement('div');
  const title = document.createElement('h3');
  const meta = document.createElement('div');

  article.className = `orlyata-media-card orlyata-media-card--${size}${isVideo ? ' orlyata-media-card--video' : ''}`;
  link.className = 'orlyata-media-card__link';
  link.href = href;
  if (isVideo) {
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
  imageWrap.className = 'orlyata-media-card__image-wrap';
  image.className = 'orlyata-media-card__image';
  image.src = `${assetRoot}/images/storybook/media-card-${size}.png`;
  image.alt = 'Концерт капеллы';
  content.className = 'orlyata-media-card__content';
  title.className = 'orlyata-media-card__title';
  title.textContent = controlledTitle ?? (size === 'big' ? 'Гала-концерт в БЗК (юноши и Вита Нова)' : 'Концерт в КЦ «Зеленоград»');
  meta.className = 'orlyata-media-card__meta';
  meta.append(badge(controlledDate ?? (size === 'big' ? 'Сегодня' : '23 мая'), size === 'big' ? 'inverse' : 'default'));

  if (resolvedProvider !== '') {
    meta.append(badge(resolvedProvider, size === 'big' ? 'inverse' : 'default'));
  }

  if (isVideo && videoUrl !== '') {
    const preview = document.createElement('div');
    const video = document.createElement('video');

    article.dataset.mediaCardVideoPreview = '';
    preview.className = 'orlyata-media-card__preview';
    preview.hidden = true;
    video.className = 'orlyata-media-card__preview-video';
    video.src = videoUrl;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.dataset.previewDuration = '8';
    video.dataset.previewStart = String(options.startOffsetSeconds ?? 0);
    video.setAttribute('aria-hidden', 'true');
    video.tabIndex = -1;
    preview.append(video);
    imageWrap.append(image, preview);
  } else {
    imageWrap.append(image);
  }
  content.append(title, meta);
  link.append(imageWrap, content);
  article.append(link);

  if (showPlayIcon) {
    const play = document.createElement('span');
    const playIcon = document.createElement('img');

    play.className = 'orlyata-button orlyata-button--play orlyata-media-card__play';
    play.setAttribute('aria-hidden', 'true');
    playIcon.className = 'orlyata-button__icon orlyata-button__icon--play';
    playIcon.src = `${assetRoot}/icons/button-play.svg`;
    playIcon.alt = '';
    playIcon.setAttribute('aria-hidden', 'true');
    play.append(playIcon);
    article.append(play);
  }

  return article;
}

export function dataTable(controlledRows?: string[][]): HTMLTableElement {
  const table = document.createElement('table');
  const head = table.createTHead();
  const body = table.createTBody();
  const headers = ['Год', 'Достижение', 'Хор', 'Конкурс'];
  const rows = controlledRows ?? [
    ['2026', 'Лауреат I степени', 'Старший', 'XI Московский областной открытый конкурс хоров мальчиков Подмосковья'],
    ['2027', 'Лауреат II степени', 'Младший', 'VII Международный фестиваль хорового искусства'],
  ];
  const headRow = head.insertRow();

  table.className = 'orlyata-data-table';
  for (const header of headers) {
    const cell = document.createElement('th');
    cell.scope = 'col';
    cell.textContent = header;
    headRow.append(cell);
  }

  for (const row of rows) {
    const tableRow = body.insertRow();
    row.forEach((value, index) => {
      const cell = tableRow.insertCell();
      cell.dataset.label = headers[index];
      cell.textContent = value;
    });
  }

  return table;
}

const meta = {
  excludeStories: [
    'accordion',
    'advantage',
    'appendSection',
    'badge',
    'createComponentPage',
    'dataTable',
    'input',
    'mediaCard',
    'newsCard',
    'textLink',
  ],
  title: 'Components/Link',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface LinkArgs {
  href: string;
  label: string;
}

export const Playground: StoryObj<LinkArgs> = {
  args: { href: '#about', label: 'О капелле' },
  argTypes: {
    href: { control: 'text', description: 'Адрес ссылки.' },
    label: { control: 'text', description: 'Видимый текст ссылки.' },
  },
  render: (args) => {
    const root = createComponentPage('Link Playground', 'Изменяйте текст и адрес ссылки через Controls.');
    appendSection(root, 'Preview', [textLink(args.label, args.href)]);
    return root;
  },
};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const root = createComponentPage('Link', 'Текстовая ссылка для навигации внутри контента и блоков с дополнительной информацией.');

    appendSection(root, 'Variants', [textLink('О капелле'), textLink('Нотная библиотека')]);

    return root;
  },
};
