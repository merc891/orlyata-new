import type { Meta, StoryObj } from '@storybook/html-vite';

import { initializeNewsShareCopy } from '../../wp-content/themes/orlyata/assets/src/main';
import { motionSpecifications } from './motion-specifications';

export type PageHeroOptions = {
  cornerMeta?: string;
  imageAlt?: string;
  imageSrc: string;
  meta?: string;
  title: string;
  variant?: 'default' | 'news-detail' | 'teacher-detail';
};

export function createPageHero({ cornerMeta = '', imageAlt = '', imageSrc, meta = '', title, variant = 'default' }: PageHeroOptions): HTMLElement {
  const hero = document.createElement('section');
  const image = document.createElement('img');
  const content = document.createElement('div');
  const heading = document.createElement('h1');

  hero.className = `orlyata-page-hero orlyata-page-hero--${variant}`;
  image.className = 'orlyata-page-hero__image';
  image.src = imageSrc;
  image.alt = imageAlt;
  content.className = 'orlyata-page-hero__content';
  heading.className = `orlyata-page-hero__title ${variant === 'news-detail' ? 'type-heading-1' : 'type-display'}`;
  heading.textContent = title;

  if (variant === 'news-detail') {
    const back = document.createElement('a');
    const details = document.createElement('p');
    const share = document.createElement('nav');
    const shareIcons = ['vk.svg', 'telegram.svg', 'copy-link.svg'];

    back.className = 'orlyata-button orlyata-button--arrow-left orlyata-button--icon-only orlyata-page-hero__back';
    back.href = '#';
    back.setAttribute('aria-label', 'Вернуться к списку новостей');
    details.className = 'orlyata-page-hero__meta type-body';
    details.textContent = meta;
    share.className = 'orlyata-page-hero__share';
    share.setAttribute('aria-label', 'Поделиться новостью');

    shareIcons.forEach((icon) => {
      const isCopy = icon === 'copy-link.svg';
      const control = document.createElement(isCopy ? 'button' : 'a');

      control.className = `orlyata-page-hero__share-control${isCopy ? ' orlyata-page-hero__share-control--copy' : ''}`;
      if (isCopy) {
        const copyIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        control.setAttribute('type', 'button');
        control.dataset.copyNewsLink = 'https://example.test/news';
        control.setAttribute('aria-label', 'Скопировать ссылку на новость');
        control.setAttribute('title', 'Скопировать ссылку на новость');
        copyIcon.setAttribute('aria-hidden', 'true');
        copyIcon.classList.add('orlyata-page-hero__copy-icon');
        copyIcon.setAttribute('viewBox', '0 0 24 24');
        path.classList.add('orlyata-page-hero__copy-icon-path');
        path.setAttribute('d', 'M10 8h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2ZM4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2');
        copyIcon.append(path);
        control.append(copyIcon);
      } else {
        const iconImage = document.createElement('img');
        control.setAttribute('href', '#');
        control.setAttribute('title', icon === 'vk.svg' ? 'Поделиться во Вконтакте' : 'Поделиться в Telegram');
        iconImage.src = `/wp-content/themes/orlyata/assets/icons/share/${icon}`;
        iconImage.alt = icon === 'vk.svg' ? 'Поделиться во Вконтакте' : 'Поделиться в Telegram';
        control.append(iconImage);
      }
      share.append(control);
    });

    hero.append(back);
    content.append(details);
    hero.append(share);
  }

  content.append(heading);
  hero.append(image, content);
  if (cornerMeta !== '') {
    const cornerMetaElement = document.createElement('p');
    cornerMetaElement.className = 'orlyata-page-hero__corner-meta type-body';
    cornerMetaElement.textContent = cornerMeta;
    hero.append(cornerMetaElement);
  }
  return hero;
}

const meta = {
  tags: ['autodocs'],
  id: 'components-page-hero',
  title: 'Components/Page hero',
  excludeStories: ['createPageHero'],
  parameters: { controls: { disable: true }, docs: { description: { component: motionSpecifications.pageHero } }, viewport: { defaultViewport: 'desktop1920' } },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => createPageHero({
    imageSrc: '/wp-content/themes/orlyata/assets/images/about/img271.png',
    title: 'О капелле',
  }),
};

export const NewsDetail: Story = {
  render: () => {
    const hero = createPageHero({
      imageSrc: '/wp-content/themes/orlyata/assets/images/news/bg-hero2.png',
      meta: '13 августа • Новость',
      title: 'Почетный работник культуры города Москвы!',
      variant: 'news-detail',
    });
    initializeNewsShareCopy(hero);
    return hero;
  },
};

export const Archive: Story = {
  render: () => {
    const hero = createPageHero({
      imageSrc: "/wp-content/themes/orlyata/assets/images/about/img271.png",
      title: "Фото",
    });
    hero.classList.replace("orlyata-page-hero--default", "orlyata-page-hero--archive");
    const back = document.createElement("a");
    back.className = "orlyata-button orlyata-button--arrow-left orlyata-button--icon-only orlyata-page-hero__back";
    back.href = "/mediagalereya/";
    back.setAttribute("aria-label", "Вернуться в медиагалерею");
    hero.append(back);
    return hero;
  },
};

export const TeacherDetail: Story = {
  render: () => {
    const hero = createPageHero({
      imageAlt: "Чернецов Андрей Викторович",
      imageSrc: "/wp-content/themes/orlyata/assets/images/teachers-chernetsov.png",
      title: "Чернецов Андрей Викторович",
      variant: "teacher-detail",
    });
    const content = hero.querySelector(".orlyata-page-hero__content");
    const title = hero.querySelector(".orlyata-page-hero__title");
    const back = document.createElement("a");
    const description = document.createElement("p");
    const badge = document.createElement("span");

    back.className = "orlyata-button orlyata-button--arrow-left orlyata-button--icon-only orlyata-page-hero__back";
    back.href = "/o-kapelle/";
    back.setAttribute("aria-label", "Вернуться на страницу «О капелле»");
    description.className = "orlyata-page-hero__description type-body";
    description.textContent = "Создатель и художественный руководитель капеллы. Руководитель младшего, старшего хора и юношеской группы, педагог по вокалу";
    badge.className = "orlyata-badge orlyata-badge--inverse";
    badge.textContent = "Заслуженный работник культуры РФ";
    content?.insertBefore(description, title);
    hero.append(back);
    const badgeWrap = document.createElement("div");
    badgeWrap.className = "orlyata-page-hero__badge";
    badgeWrap.append(badge);
    hero.append(badgeWrap);
    return hero;
  },
};

export const CornerMeta: Story = {
  render: () => createPageHero({
    cornerMeta: '45 файлов',
    imageSrc: '/wp-content/themes/orlyata/assets/images/about/img271.png',
    title: 'Ноты',
  }),
};
