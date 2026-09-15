import type { Meta, StoryObj } from '@storybook/html-vite';

import { createApplicationForm } from '../components/application-form.stories';
import { createButton } from "../components/button.stories";
import { dataTable } from '../components/content.stories';
import { createFooter } from '../components/footer.stories';
import { createPageHero } from '../components/page-hero.stories';
import { createSidebar } from '../components/sidebar.stories';
import { createTeacherCard, teacherImageSources } from '../components/teacher-card.stories';

const assetRoot = '/wp-content/themes/orlyata/assets';

const groups = [
  ['Подготовительная группа', '5-7 лет'],
  ['Младший хор', '7-8 лет'],
  ['Старший хор', '8-12 лет'],
  ['Юношеская группа', '13-18 лет'],
] as const;

const teachers = [
  ['Чернецов', 'Андрей', 'Викторович', teacherImageSources.vict],
  ['Карпман', 'Ирина', 'Рафаиловна', teacherImageSources.karp],
  ['Чернецова', 'Елена', 'Ивановна', teacherImageSources.elena],
  ['Климова', 'Марьяна', 'Геннадьевна', teacherImageSources.mar],
  ['Угольникова', 'Ольга', 'Александровна', teacherImageSources.olg],
  ['Моисеева', 'Мария', 'Андреевна', teacherImageSources.mash],
] as const;

const achievements = [
  ['2026', 'Лауреат I степени', 'Старший', 'XI Московский областной открытый конкурс хоров мальчиков Подмосковья'],
  ['2027', 'Лауреат II степени', 'Младший', 'VII Международный фестиваль хорового искусства'],
  ['2028', 'Дипломант', 'Старший', 'IV Всероссийский конкурс хоровых коллективов'],
  ['2029', 'Лауреат I степени', 'Старший', 'X Международный фестиваль хоровой музыки'],
  ['2030', 'Лауреат III степени', 'Младший', 'VIII Мировой конкурс детских хоров'],
  ['2031', 'Лауреат I степени', 'Старший', 'VI Всероссийский конкурс академического пения'],
  ['2032', 'Лауреат II степени', 'Младший', 'XII Международный хоровой фестиваль'],
  ['2033', 'Дипломант', 'Старший', 'III Европейский конкурс хорового исполнения'],
  ['2034', 'Лауреат I степени', 'Старший', 'IX Международный фестиваль хорового искусства'],
  ['2035', 'Лауреат III степени', 'Младший', 'XV Всероссийский чемпионат хоров'],
  ['2036', 'Лауреат II степени', 'Старший', 'IV Международный конкурс хоровых коллективов'],
  ['2037', 'Дипломант', 'Старший', 'VIII Всероссийский фестиваль хоровой музыки'],
  ['2038', 'Лауреат I степени', 'Старший', 'XI Международный конкурс хорового мастерства'],
  ['2039', 'Лауреат II степени', 'Младший', 'VII Европейский фестиваль детских хоров'],
  ['2040', 'Дипломант', 'Старший', 'II Всероссийский конкурс хорового искусства'],
  ['2041', 'Лауреат III степени', 'Старший', 'X Международный конкурс хоровых ансамблей'],
  ['2042', 'Лауреат I степени', 'Старший', 'V Международный фестиваль хорового пения'],
  ['2043', 'Лауреат II степени', 'Младший', 'IX Всероссийский конкурс хоровых исполнителей'],
  ['2044', 'Дипломант', 'Старший', 'III Международный конкурс хоровой музыки'],
  ['2045', 'Лауреат I степени', 'Старший', 'XII Всероссийский фестиваль академического пения'],
  ['2046', 'Лауреат III степени', 'Младший', 'VI Международный фестиваль хоровых искусств'],
  ['2047', 'Лауреат II степени', 'Старший', 'VII Европейский конкурс хоровых коллективов'],
  ['2048', 'Дипломант', 'Старший', 'X Всероссийский конкурс хоровых исполнений'],
  ['2049', 'Лауреат I степени', 'Старший', 'VIII Международный фестиваль хоровой культуры'],
  ['2050', 'Лауреат II степени', 'Младший', 'XIII Всероссийский конкурс детских хоров'],
];

const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className = '',
  text = '',
): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = text;
  return node;
};

function createGroupRow(titleText: string, metaText: string): HTMLElement {
  const row = el("details", "orlyata-accordion");
  const summary = el("summary", "orlyata-accordion__summary");
  const label = el("span", "orlyata-accordion__label");
  const title = el("span", "orlyata-accordion__title", titleText);
  const separator = el("span", "orlyata-accordion__separator", " / ");
  const meta = el("span", "orlyata-accordion__meta", metaText);
  const toggle = el("span", "orlyata-accordion__toggle");
  const panel = el("div", "orlyata-accordion__panel");
  const content = el("div", "orlyata-accordion__content");
  separator.setAttribute("aria-hidden", "true");
  toggle.setAttribute("aria-hidden", "true");
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  icon.setAttribute("class", "orlyata-accordion__toggle-icon");
  icon.setAttribute("viewBox", "0 0 24 24");
  path.setAttribute("class", "orlyata-accordion__toggle-path");
  path.setAttribute("d", "M5 12h14M12 5v14");
  icon.append(path);
  toggle.append(icon);
  label.append(title, separator, meta);
  summary.append(label, toggle);
  panel.append(content);
  row.append(summary, panel);
  return row;
}

export function createAboutDesktopPreview(): HTMLElement {
  const root = el('div', 'orlyata-about');
  const rail = createSidebar({ ctaLabel: 'Записаться к нам', currentPage: 'about' });
  const main = el('main', 'orlyata-about__content');
  const grid = el('div', 'orlyata-about__grid');

  main.id = 'main';

  const hero = createPageHero({
    imageSrc: `${assetRoot}/images/about/img271.png`,
    title: 'О капелле',
  });

  const intro = el('section', 'orlyata-about__intro');
  intro.dataset.aboutReveal = '';
  const introCopy = el('div', 'orlyata-about__copy type-body');
  introCopy.append(
    el('p', '', 'Пройдя большой путь в поиске «своего лица и в выборе репертуара, и в стиле работы, планах обучения и приобщения ребят к лучшим образцам певческого искусства, в капелле сложилась устойчивая система музыкально-хорового воспитания мальчиков от 5 до 17 лет.'),
    el('p', '', 'В репертуаре «Орлят» произведения русской, западно-европейской классики, народные песни в обработках, произведения советских и современных русских композиторов, духовная и патриотическая музыка. «Орлята» принимали участие в театрализованных постановках академического хора «Ковчег» — «Рождественской драме» Св. Дм. Ростовского и «Кармен» Ж. Бизе.'),
  );
  const introTeachers = el('div', 'orlyata-home__history-teachers orlyata-about__intro-teachers');
  const introPhotos = el('div', 'orlyata-home__history-photos');
  introPhotos.setAttribute('aria-hidden', 'true');
  for (const source of ['/images/home/teacher-one.png', '/images/home/teacher-two.png']) {
    const photo = el('span', 'orlyata-home__history-photo');
    const image = el('img');
    image.src = assetRoot + source;
    image.alt = '';
    photo.append(image);
    introPhotos.append(photo);
  }
  introTeachers.append(introPhotos);
  intro.append(
    el('p', 'orlyata-about__lead type-lead', 'Создана руководителями академического хора «Ковчег» — Заслуженным работником РФ Андреем Чернецовым и хормейстером Ириной Карпман'),
    introCopy,
    introTeachers,
  );

  const groupSection = el('section', 'orlyata-about__groups');
  groups.forEach(([title, meta]) => {
    groupSection.append(createGroupRow(title, meta));
  });

  const life = el('section', 'orlyata-about__life');
  life.dataset.aboutReveal = '';
  const lifeGrid = el("div", "orlyata-about__life-grid");
  const lifeCard = el("div", "orlyata-about__life-card");
  const lifeMedia = el("div", "orlyata-about__life-media");
  const lifeTrack = el("div", "orlyata-about__life-image-track");
  lifeGrid.dataset.lifeCarousel = "";
  lifeMedia.dataset.lifeMedia = "";
  lifeMedia.dataset.lifeActive = "0";
  [["Выступления", "Младшая, старшая группы и юноши регулярно выходят на сцену московских и всероссийских фестивалей."], ["Достижения", "Хор «Орлята» становился лауреатом 1 и 2-й степени на международных конкурсах."], ["Отдых", "В период каникул ребята с педагогами и родителями выезжают в театры, музеи и на экскурсии."]].forEach(([title, copy], index) => {
    const slide = el("article", "orlyata-about__life-slide" + (index === 0 ? " is-active" : ""));
    slide.dataset.lifeSlide = "";
    const lifeMeta = el("div", "orlyata-about__life-meta");
    const lifeBadge = el("span", "orlyata-badge orlyata-badge--dark", title);
    const lifeIcon = el("span", "orlyata-badge orlyata-badge--dark-icon");
    const lifeIconImage = el("img", "orlyata-badge__icon");
    lifeIconImage.src = assetRoot + ("/icons/news-category-news.png");
    lifeIconImage.alt = "";
    lifeIcon.setAttribute("aria-hidden", "true");
    lifeIcon.append(lifeIconImage);
    lifeMeta.append(lifeBadge, lifeIcon);
    slide.append(lifeMeta, el("div", "orlyata-about__life-copy type-body", copy));
    lifeCard.append(slide);
  });
  const lifeArrows = el("div", "orlyata-about__life-arrows");
  lifeArrows.setAttribute("aria-label", "Переключение слайдов");
  lifeArrows.append(createButton({ ariaLabel: "Предыдущий слайд", variant: "arrow-left" }), createButton({ ariaLabel: "Следующий слайд", variant: "arrow-right" }));
  lifeCard.append(lifeArrows);
  ["life.png", "win.jpg", "otdykh.jpeg"].forEach((source) => {
    const image = el("img", "orlyata-about__life-image");
    image.src = assetRoot + "/images/about/" + source;
    image.alt = "";
    lifeTrack.append(image);
  });
  lifeMedia.append(lifeTrack);
  lifeGrid.append(lifeCard, lifeMedia);
  life.append(el('h2', 'type-heading-2', 'Жизнь капеллы'), lifeGrid);

  const teacherSection = el('section', 'orlyata-about__teachers');
  teacherSection.dataset.aboutReveal = '';
  const teacherGrid = el('div', 'orlyata-about__teacher-grid');
  teacherSection.id = 'teachers';
  teacherSection.append(el('h2', 'type-heading-2', 'Педагоги'));
  teachers.forEach(([lastName, firstName, middleName, imageSrc]) => {
    teacherGrid.append(createTeacherCard({ firstName, imageSrc, lastName, middleName }));
  });
  teacherSection.append(teacherGrid);

  const application = el('section', 'orlyata-home__section orlyata-home__application orlyata-about__application');
  application.dataset.aboutReveal = '';
  const surface = el('div', 'orlyata-home__application-surface');
  const background = el('img', 'orlyata-home__application-background');
  background.src = `${assetRoot}/images/home/application-background.png`;
  background.alt = '';
  surface.append(
    background,
    createApplicationForm({
      birthDate: '',
      childName: '',
      fieldError: '',
      formError: '',
      parentName: '',
      phone: '',
      state: 'default',
      variant: 'about',
    }, 'about-page'),
  );
  const applicationTitle = el('h2', 'orlyata-home__application-title type-heading-2');
  const applicationTitleIcon = el('span', 'orlyata-home__application-title-icon');
  applicationTitleIcon.setAttribute('aria-hidden', 'true');
  const applicationTitleIconImage = el('img');
  applicationTitleIconImage.src = assetRoot + '/icons/news-category-news.png';
  applicationTitleIconImage.alt = '';
  applicationTitleIcon.append(applicationTitleIconImage);
  applicationTitle.append('Хотите вырастить творческую личность? ', applicationTitleIcon, ' Запишите мальчика ', el('span', 'orlyata-home__application-title-preposition', 'в капеллу'));
  application.append(applicationTitle, surface);

  const achievementSection = el('section', 'orlyata-home__section orlyata-home__achievements orlyata-about__achievements');
  achievementSection.dataset.aboutReveal = '';
  const achievementHead = el('div', 'orlyata-home__section-head');
  achievementHead.append(el('h2', 'type-heading-2', 'Достижения'));
  const achievementTableWrap = el('div', 'orlyata-home__table-wrap');
  achievementTableWrap.append(dataTable(achievements));
  achievementSection.append(
    achievementHead,
    achievementTableWrap,
  );

  const footer = createFooter({
    address: 'г. Зеленоград, Центральная площадь, 1',
    email: 'info@zelorlyata.ru',
    legalLabel: 'Политика конфиденциальности',
    phonePrimary: '+7 (925) 434-51-98',
    phoneSecondary: '+7 (916) 258-49-12',
  });

  grid.append(
    intro,
    groupSection,
    life,
    teacherSection,
    application,
    achievementSection,
  );
  const body = el('div', 'orlyata-about__body');
  body.append(grid, footer);
  main.append(hero, body);
  root.append(rail, main);
  return root;
}

const meta = {
  id: 'pages-about',
  title: 'Pages/About',
  excludeStories: ['createAboutDesktopPreview'],
  parameters: {
    controls: { disable: true },
    viewport: { defaultViewport: 'desktop1920' },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const DesktopPreview: Story = {
  render: () => createAboutDesktopPreview(),
};
