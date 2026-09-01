import type { Meta, StoryObj } from '@storybook/html-vite';

import { createApplicationForm } from '../components/application-form.stories';
import { advantage, dataTable, mediaCard, newsCard, textLink } from '../components/content.stories';
import { createFooter } from '../components/footer.stories';
import { createSidebar } from '../components/sidebar.stories';

const assetRoot = '/wp-content/themes/orlyata/assets';

function element<K extends keyof HTMLElementTagNameMap>(tag: K, className = '', text = ''): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = text;
  return node;
}

function sectionHead(title: string, identifier: string, label: string, href: string, inverse = false): HTMLElement {
  const head = element('div', 'orlyata-home__section-head');
  const heading = element('h2', 'type-heading-2', title);
  heading.id = identifier;
  head.append(heading, textLink(label, href, inverse ? 'color-inverse' : 'color', true));
  return head;
}

function setImage(card: HTMLElement, source: string, alt: string): HTMLElement {
  const node = card.querySelector<HTMLImageElement>('.orlyata-media-card__image');
  if (node !== null) {
    node.src = assetRoot + source;
    node.alt = alt;
  }
  return card;
}

function createHero(): HTMLElement {
  const hero = element('section', 'orlyata-home__hero');
  hero.setAttribute('aria-label', 'Главное');
  const capella = element('div', 'orlyata-home__hero-panel orlyata-home__hero-panel--capella orlyata-home__hero-video-trigger');
  const capellaContent = element('div', 'orlyata-home__hero-panel-content');
  const preview = element('video', 'orlyata-home__hero-preview');
  preview.src = assetRoot + '/videos/home/hero-preview.mp4';
  preview.autoplay = true;
  preview.loop = true;
  preview.muted = true;
  preview.playsInline = true;
  preview.preload = 'metadata';
  preview.setAttribute('aria-hidden', 'true');
  const play = element('a', 'orlyata-button orlyata-button--play orlyata-home__hero-play');
  play.href = assetRoot + '/videos/home/hero-original.mp4';
  play.setAttribute('aria-label', 'Смотреть видео о капелле');
  const playIcon = element('img', 'orlyata-button__icon orlyata-button__icon--play');
  playIcon.src = assetRoot + '/icons/button-play.svg';
  playIcon.alt = '';
  play.append(playIcon);
  capellaContent.append(preview, play);
  const title = element('h1', 'orlyata-home__hero-title type-display');
  for (const line of ['Хоровая', 'капелла', 'мальчиков']) {
    const lineNode = element('span', 'orlyata-home__hero-title-line');
    lineNode.append(element('span', 'orlyata-home__hero-title-text', line));
    title.append(lineNode);
  }
  capella.append(capellaContent, title);

  const news = element('section', 'orlyata-home__hero-panel orlyata-home__hero-panel--news');
  news.setAttribute('aria-labelledby', 'storybook-home-news-title');
  const newsContent = element('div', 'orlyata-home__hero-panel-content');
  const background = element('img', 'orlyata-home__news-background');
  background.src = assetRoot + '/images/home/news-background.png';
  background.alt = '';
  const newsHead = sectionHead('Новости', 'storybook-home-news-title', 'Все новости', '/novosti/', true);
  newsHead.className = 'orlyata-home__news-head';
  const newsGrid = element('div', 'orlyata-home__news-grid');
  const firstNews = newsCard('«Крылатое сердце» — большой весенний концерт', 'сегодня', '/novosti/');
  const secondNews = newsCard('Ансамбль юношей — Лауреаты I степени', '21 апреля', '/novosti/');
  const firstIcon = firstNews.querySelector<HTMLImageElement>('.orlyata-news-card__icon');
  const secondIcon = secondNews.querySelector<HTMLImageElement>('.orlyata-news-card__icon');
  if (firstIcon !== null) {
    firstIcon.src = assetRoot + '/icons/home/news-theatre.svg';
  }
  if (secondIcon !== null) {
    secondIcon.src = assetRoot + '/icons/home/news-star.svg';
  }
  newsGrid.append(firstNews, secondNews);
  newsContent.append(background, newsHead, newsGrid);
  news.append(newsContent);
  hero.append(capella, news);
  return hero;
}

function createFacts(): HTMLElement {
  const facts = element('section', 'orlyata-home__facts');
  facts.setAttribute('aria-label', 'В цифрах и фактах');
  facts.append(
    advantage('80+', 'мальчиков и юношей'),
    advantage('5–17 лет', 'возрастной состав'),
    advantage('6', 'опытных педагогов'),
    advantage('15–20', 'выступлений в год'),
  );
  return facts;
}

function createMedia(): HTMLElement {
  const section = element('section', 'orlyata-home__section orlyata-home__media-section');
  section.setAttribute('aria-labelledby', 'storybook-home-media-title');
  const grid = element('div', 'orlyata-home__media-grid');
  const feature = mediaCard('big', 'Гала-концерт в БЗК (юноши и Вита Нова)', '10 июня', 'RuTube', 'https://rutube.ru/play/embed/2ad60bfd20027143c2eac71acdb5faef/', { mediaType: 'video' });
  const video = mediaCard('small', 'Концерт в КЦ «Зеленоград»', '23 мая', 'RuTube', '/mediagalereya/video/', { mediaType: 'video' });
  const photo = mediaCard('small', 'Концерт лауреатов фестиваля-конкурса VIVAT MUSICA', '14 мая', '', '/mediagalereya/foto/');
  grid.append(
    setImage(feature, '/images/home/media-feature.png', 'Выступление капеллы на гала-концерте'),
    setImage(video, '/images/home/media-video.png', 'Концерт капеллы в Зеленограде'),
    setImage(photo, '/images/home/media-photo.png', 'Участники капеллы'),
  );
  section.append(sectionHead('Медиагалерея', 'storybook-home-media-title', 'Перейти в раздел', '/mediagalereya/'), grid);
  return section;
}

function createHistory(): HTMLElement {
  const section = element('section', 'orlyata-home__section orlyata-home__history');
  section.setAttribute('aria-labelledby', 'storybook-home-history-title');
  const grid = element('div', 'orlyata-home__history-grid');
  const intro = element('div', 'orlyata-home__history-intro');
  const details = element('div', 'orlyata-home__history-details');
  const tags = element('div', 'orlyata-home__history-tags');
  tags.append(element('span', 'orlyata-home__history-tag', 'О капелле'), element('span', 'orlyata-home__history-tag', 'Педагоги'));
  intro.append(
    element('p', 'orlyata-home__history-lead type-lead', 'Создана руководителями академического хора «Ковчег» — Заслуженным работником РФ Андреем Чернецовым и хормейстером Ириной Карпман'),
    tags,
  );
  const teachers = element('div', 'orlyata-home__history-teachers');
  const photos = element('div', 'orlyata-home__history-photos');
  photos.setAttribute('aria-hidden', 'true');
  for (const source of ['/images/home/teacher-one.png', '/images/home/teacher-two.png']) {
    const photo = element('span', 'orlyata-home__history-photo');
    const teacher = element('img');
    teacher.src = assetRoot + source;
    teacher.alt = '';
    photo.append(teacher);
    photos.append(photo);
  }
  const teacherLink = element('a', 'orlyata-home__history-teachers-link');
  teacherLink.href = '/o-kapelle/#teachers';
  teacherLink.setAttribute('aria-label', 'Перейти к педагогам');
  const arrowTrack = element('span', 'orlyata-home__history-teachers-arrow-track');
  arrowTrack.setAttribute('aria-hidden', 'true');
  for (let index = 0; index < 2; index += 1) {
    const arrow = element('span', 'orlyata-home__history-teachers-arrow');
    const arrowImage = element('img');
    arrowImage.src = assetRoot + '/icons/button-arrow.svg';
    arrowImage.alt = '';
    arrow.append(arrowImage);
    arrowTrack.append(arrow);
  }
  teacherLink.append(arrowTrack);
  teachers.append(photos, teacherLink);
  details.append(
    element('p', 'orlyata-home__history-copy type-body', 'Пройдя большой путь в поиске «своего лица и в выборе репертуара, и в стиле работы, планах обучения и приобщения ребят к лучшим образцам певческого искусства, в капелле сложилась устойчивая система музыкально-хорового воспитания мальчиков от 5 до 17 лет'),
    teachers,
  );
  grid.append(intro, details);
  section.append(sectionHead('История', 'storybook-home-history-title', 'Подробнее', '/o-kapelle/'), grid);
  return section;
}

function createApplication(): HTMLElement {
  const section = element('section', 'orlyata-home__section orlyata-home__application');
  section.id = 'application';
  const copy = element('div', 'orlyata-home__application-copy');
  const heading = element('h2', 'type-heading-1', 'Хотите вырастить творческую личность — запишите мальчика в капеллу');
  heading.id = 'storybook-home-application-title';
  copy.append(heading);
  section.setAttribute('aria-labelledby', heading.id);
  const surface = element('div', 'orlyata-home__application-surface');
  const background = element('img', 'orlyata-home__application-background');
  background.src = assetRoot + '/images/home/application-background.png';
  background.alt = '';
  surface.append(
    background,
    createApplicationForm({
      birthDate: '16.02.2021',
      childName: 'Семёнов Эдуард Алексеевич',
      fieldError: '',
      formError: '',
      parentName: 'Семёнова Мария Павловна',
      phone: '+7 (926) 232-11-27',
      state: 'default',
      variant: 'home',
    }, 'home-page'),
  );
  section.append(copy, surface);
  return section;
}

function createAchievements(): HTMLElement {
  const section = element('section', 'orlyata-home__section orlyata-home__achievements');
  section.setAttribute('aria-labelledby', 'storybook-home-achievements-title');
  const tableWrap = element('div', 'orlyata-home__table-wrap');
  tableWrap.append(dataTable([
    ['2026', 'Лауреат I степени', 'Старший', 'XI Московский областной открытый конкурс хоров мальчиков Подмосковья'],
    ['2025', 'Лауреат II степени', 'Младший', 'VII Международный фестиваль хорового искусства'],
    ['2024', 'Дипломант', 'Старший', 'IV Всероссийский конкурс хоровых коллективов'],
    ['2023', 'Лауреат I степени', 'Юноши', 'X Международный фестиваль хоровой музыки'],
  ]));
  section.append(sectionHead('Достижения', 'storybook-home-achievements-title', 'Все достижения', '/o-kapelle/#achievements'), tableWrap);
  return section;
}

export function createHomeDesktopPreview(): HTMLElement {
  const root = element('div', 'orlyata-home');
  const sidebar = createSidebar({ ctaLabel: 'Записаться к нам', currentPage: 'none' });
  const main = element('main', 'orlyata-home__content');
  main.id = 'main';
  const grid = element('div', 'orlyata-home__content-grid');
  grid.append(createHero(), createFacts(), createMedia(), createHistory(), createApplication(), createAchievements());
  const footer = createFooter({
    address: 'г. Зеленоград,\nЦентральная площадь, 1\nКЦ «Зеленоград»',
    email: 'info@zelorlyata.ru',
    legalLabel: 'Политика конфиденциальности',
    phonePrimary: '+7 (925) 434-51-98',
    phoneSecondary: '+7 (916) 258-49-12',
  });
  grid.append(footer);
  main.append(grid);
  root.append(sidebar, main);
  return root;
}

const meta = {
  id: 'pages-home',
  title: 'Pages/Home',
  excludeStories: ['createHomeDesktopPreview'],
  parameters: {
    controls: { disable: true },
    viewport: { defaultViewport: 'desktop1920' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const DesktopPreview: Story = {
  render: () => createHomeDesktopPreview(),
};
