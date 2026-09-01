import type { Meta, StoryObj } from '@storybook/html-vite';

import { motionSpecifications } from './motion-specifications';

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

export function textLink(label: string, href = '#about', variant: 'roll' | 'color' | 'color-inverse' = 'roll', hasChevron = false): HTMLAnchorElement {
  const link = document.createElement('a');
  const labelElement = document.createElement('span');

  link.className = 'orlyata-text-link orlyata-text-link--' + variant + (hasChevron ? ' orlyata-text-link--with-chevron' : '');
  link.href = href;
  labelElement.className = 'orlyata-text-link__label';
  labelElement.dataset.text = label;
  labelElement.textContent = label;
  link.append(labelElement);

  if (hasChevron) {
    const track = document.createElement('span');

    track.className = 'orlyata-text-link__icon-track';
    track.setAttribute('aria-hidden', 'true');
    for (let iconIndex = 0; iconIndex < 2; iconIndex += 1) {
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

      icon.classList.add('orlyata-text-link__icon');
      icon.setAttribute('viewBox', '0 0 24 24');
      icon.setAttribute('fill', 'none');
      path.setAttribute('d', 'm9 18 6-6-6-6');
      path.setAttribute('stroke', 'currentColor');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      icon.append(path);
      track.append(icon);
    }
    link.append(track);
  }

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
  const fieldMask = type === 'date' || type === 'tel' ? document.createElement('span') : null;
  const id = 'storybook-' + identifier;

  const rawValue = controlledValue ?? (state === 'typing' ? 'Семёнов' : state === 'filled' ? 'Семёнова Мария Павловна' : '');
  const value = type === 'date' && /^\d{4}-\d{2}-\d{2}$/.test(rawValue) ? rawValue.slice(8, 10) + '.' + rawValue.slice(5, 7) + '.' + rawValue.slice(0, 4) : rawValue;
  const error = state === 'error' ? (controlledError ?? 'поле обязательно для заполнения') : '';

  root.className =
    'orlyata-input' +
    (type === 'date' ? ' orlyata-input--date' : type === 'tel' ? ' orlyata-input--tel' : '') +
    (state === 'typing' ? ' is-typing' : '') +
    (state === 'filled' ? ' is-filled' : '') +
    (state === 'error' ? ' has-error' : '');
  control.className = 'orlyata-input__control';
  fieldLabel.className = 'orlyata-input__label';
  fieldLabel.htmlFor = id;
  fieldLabel.textContent = label;
  field.className = 'orlyata-input__field';
  field.id = id;
  if (fieldMask !== null) {
    fieldMask.className = 'orlyata-input__mask';
    fieldMask.setAttribute('aria-hidden', 'true');
    fieldMask.dataset.inputMaskTemplate = type === 'date' ? 'ДД.ММ.ГГГГ' : '+7 (123) 456-78-90';
    fieldMask.textContent = fieldMask.dataset.inputMaskTemplate;
  }
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
  control.append(fieldLabel);
  if (fieldMask !== null) {
    control.append(fieldMask);
  }
  control.append(field);
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

  const panel = document.createElement('div');
  element.className = 'orlyata-accordion';
  element.open = open;
  summary.className = 'orlyata-accordion__summary';
  title.className = 'orlyata-accordion__title';
  title.textContent = titleText;
  meta.className = 'orlyata-accordion__meta';
  meta.textContent = metaText;
  toggle.className = 'orlyata-accordion__toggle';
  toggle.setAttribute("aria-hidden", "true");
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  icon.setAttribute("class", "orlyata-accordion__toggle-icon");
  icon.setAttribute("viewBox", "0 0 24 24");
  path.setAttribute("class", "orlyata-accordion__toggle-path");
  path.setAttribute("d", open ? "M5 12h14" : "M5 12h14M12 5v14");
  icon.append(path);
  toggle.append(icon);
  content.className = "orlyata-accordion__content";
  panel.className = "orlyata-accordion__panel";
  const contentInner = document.createElement("div");
  contentInner.className = "orlyata-accordion__content-inner";
  contentInner.textContent = contentText;
  content.append(contentInner);
  summary.append(title, meta, toggle);
  panel.append(content);
  element.append(summary, panel);

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
  const titleLabel = document.createElement('span');
  titleLabel.className = 'orlyata-news-card__title-label';
  titleLabel.dataset.text = titleText;
  titleLabel.textContent = titleText;
  title.append(titleLabel);
  link.append(icon, title);
  article.append(link, badge(dateLabel));

  return article;
}

type MediaType = 'photo' | 'video';

interface MediaCardOptions {
  mediaType?: MediaType;
  startOffsetSeconds?: number;
  videoEmbedUrl?: string;
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
  provider = '',
  href = '#media',
  options: MediaCardOptions = {},
): HTMLElement {
  const mediaType = options.mediaType ?? 'photo';
  const videoEmbedUrl = options.videoEmbedUrl?.trim() ?? '';
  const videoUrl = options.videoUrl?.trim() ?? '';
  const isVideo = mediaType === 'video';
  const resolvedProvider = isVideo ? (detectVideoProvider(href) || provider) : '';
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
  const titleLabel = document.createElement('span');
  const titleText = controlledTitle ?? (size === 'big' ? 'Гала-концерт в БЗК (юноши и Вита Нова)' : 'Концерт в КЦ «Зеленоград»');
  titleLabel.className = 'orlyata-media-card__title-label';
  titleLabel.dataset.text = titleText;
  titleLabel.textContent = titleText;
  title.append(titleLabel);
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
  } else if (isVideo && videoEmbedUrl !== '') {
    const preview = document.createElement('div');
    const embed = document.createElement('iframe');

    preview.className = 'orlyata-media-card__preview orlyata-media-card__preview--embed';
    preview.setAttribute('aria-hidden', 'true');
    embed.className = 'orlyata-media-card__preview-embed';
    embed.src = videoEmbedUrl;
    embed.title = '';
    embed.tabIndex = -1;
    embed.loading = 'lazy';
    embed.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock';
    preview.append(embed);
    imageWrap.append(image, preview);
  } else {
    imageWrap.append(image);
  }
  content.append(title, meta);
  link.append(imageWrap, content);
  article.append(link);

  if (isVideo) {
    const play = document.createElement('span');
    const playIcon = document.createElement('img');

    play.className = 'orlyata-button orlyata-button--play orlyata-media-card__play';
    play.setAttribute('aria-hidden', 'true');
    playIcon.className = 'orlyata-button__icon orlyata-button__icon--play';
    playIcon.src = `${assetRoot}/icons/button-play.svg`;
    playIcon.alt = '';
    playIcon.setAttribute('aria-hidden', 'true');
    play.append(playIcon);
    link.append(play);
  }

  return article;
}

export function dataTable(
  controlledRows?: string[][],
  variant: 'achievements' | 'teacher-achievements' | 'news' | 'photo' | 'video' = 'achievements',
): HTMLTableElement {
  const table = document.createElement('table');
  const head = table.createTHead();
  const body = table.createTBody();
  const isTeacherAchievements = variant === 'teacher-achievements';
  const isLinkList = variant === 'news' || variant === 'photo' || variant === 'video';
  const headers = variant === 'news'
    ? ['Название', 'Дата', 'Тип', 'Открыть новость']
    : variant === 'photo'
      ? ['Название', 'Дата', 'Тип', 'Открыть фотогалерею']
      : variant === 'video'
        ? ['Название', 'Дата', 'Тип', 'Открыть видеогалерею']
        : isTeacherAchievements
          ? ['Год', 'Достижение']
          : ['Год', 'Достижение', 'Хор', 'Конкурс'];
  const rows = controlledRows ?? (variant === 'news'
    ? [
      ['Расписание капеллы на 2025-2026 год', '13 июля', 'Новости'],
      ['ВНИМАНИЕ! Продолжается набор в хоровую капеллу на новый учебный год!', '10 июля', 'Объявления'],
    ]
    : (variant === 'photo' || variant === 'video')
      ? [
        ['Гала-концерт в БЗК (юноши и Вита Нова)', '13 июля', 'Выступления'],
        ['Концерт в КЦ «Зеленоград»', '10 июля', 'Выступления'],
      ]
    : [
      ['2026', 'Лауреат I степени', 'Старший', 'XI Московский областной открытый конкурс хоров мальчиков Подмосковья'],
      ['2027', 'Лауреат II степени', 'Младший', 'VII Международный фестиваль хорового искусства'],
    ]);
  const headRow = head.insertRow();

  table.className = 'orlyata-data-table orlyata-data-table--' + variant;

  const colGroup = document.createElement('colgroup');
  for (let headerIndex = 0; headerIndex < headers.length; headerIndex += 1) {
    colGroup.append(document.createElement('col'));
  }
  table.append(colGroup);
  headers.forEach((header, index) => {
    const cell = document.createElement('th');
    cell.scope = 'col';
    if (isLinkList && index === headers.length - 1) {
      cell.ariaLabel = header;
    } else {
      cell.textContent = header;
    }
    headRow.append(cell);
  });

  for (const [rowIndex, row] of rows.entries()) {
    const tableRow = body.insertRow();
    headers.forEach((header, index) => {
      const cell = tableRow.insertCell();
      cell.dataset.label = header;
      if (isLinkList && index === headers.length - 1) {
        const link = document.createElement('a');
        link.className = 'orlyata-data-table__row-link';
        link.href = variant === 'news' ? '/novosti/' : variant === 'video' ? '/mediagalereya/video/' : '/mediagalereya/foto/';
        const providers: Array<{ id: string; label: string }> = [
          { id: 'youtube', label: 'YouTube' },
          { id: 'rutube', label: 'RuTube' },
          { id: 'vk', label: 'VK' },
        ];
        const provider = providers[rowIndex % providers.length] ?? { id: 'youtube', label: 'YouTube' };
        const rowTitle = row[0] ?? '';
        link.ariaLabel = variant === 'news' ? 'Открыть новость «' + rowTitle + '»' : variant === 'video' ? 'Открыть видео «' + rowTitle + '» на ' + provider.label : 'Открыть фотогалерею «' + rowTitle + '»';
        if (variant === 'video') {
          const icon = document.createElement('span');
          const grayIcon = document.createElement('img');
          const colorIcon = document.createElement('img');
          icon.className = 'orlyata-data-table__provider-icon';
          icon.setAttribute('aria-hidden', 'true');
          grayIcon.className = 'orlyata-data-table__provider-icon-image orlyata-data-table__provider-icon-image--gray';
          grayIcon.src = assetRoot + '/icons/video-providers/' + provider.id + '-gray.svg';
          grayIcon.alt = '';
          colorIcon.className = 'orlyata-data-table__provider-icon-image orlyata-data-table__provider-icon-image--color';
          colorIcon.src = assetRoot + '/icons/video-providers/' + provider.id + '.svg';
          colorIcon.alt = '';
          icon.append(grayIcon, colorIcon);
          link.append(icon);
        } else {
          const track = document.createElement('span');
          track.className = 'orlyata-data-table__row-arrow-track';
          track.setAttribute('aria-hidden', 'true');
          for (let arrowIndex = 0; arrowIndex < 2; arrowIndex += 1) {
            const arrow = document.createElement('span');
            const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            arrow.className = 'orlyata-data-table__row-arrow';
            icon.setAttribute('viewBox', '0 0 24 24');
            icon.setAttribute('fill', 'none');
            path.setAttribute('d', 'M12 5V19M5 12L12 19L19 12');
            path.setAttribute('stroke', 'currentColor');
            path.setAttribute('stroke-width', '2');
            path.setAttribute('stroke-linecap', 'round');
            path.setAttribute('stroke-linejoin', 'round');
            icon.append(path);
            arrow.append(icon);
            track.append(arrow);
          }
          link.append(track);
        }
        cell.append(link);
      } else {
        cell.textContent = row[index] ?? '';
      }
    });
  }

  return table;
}

const meta = {
  tags: ['autodocs'],
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
  parameters: { docs: { description: { component: motionSpecifications.textLink } } },
  title: 'Components/Link',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface LinkArgs {
  href: string;
  label: string;
  variant: 'roll' | 'color' | 'color-inverse';
}

export const Playground: StoryObj<LinkArgs> = {
  args: { href: '#about', label: 'О капелле', variant: 'color' },
  argTypes: {
    href: { control: 'text', description: 'Адрес ссылки.' },
    label: { control: 'text', description: 'Видимый текст ссылки.' },
    variant: {
      control: 'select',
      description: 'Тип hover: прокрутка текста или плавная смена цвета.',
      options: ['roll', 'color', 'color-inverse'],
    },
  },
  render: (args) => {
    const root = createComponentPage('Link Playground', 'Изменяйте текст и адрес ссылки через Controls.');
    appendSection(root, 'Preview', [textLink(args.label, args.href, args.variant)]);
    return root;
  },
};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const root = createComponentPage('Link', 'Текстовая ссылка для навигации внутри контента и блоков с дополнительной информацией.');

    appendSection(root, 'Variants', [textLink('С прокруткой', '#about', 'roll'), textLink('Со сменой цвета', '#library', 'color'), textLink('С chevron', '#chevron', 'color', true)]);

    return root;
  },
};
