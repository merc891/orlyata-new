import type { Meta, StoryObj } from '@storybook/html-vite';

import { motionSpecifications } from './motion-specifications';

export type PageHeroOptions = {
  imageAlt?: string;
  imageSrc: string;
  meta?: string;
  title: string;
  variant?: 'default' | 'news-detail';
};

export function createPageHero({ imageAlt = '', imageSrc, meta = '', title, variant = 'default' }: PageHeroOptions): HTMLElement {
  const hero = document.createElement('section');
  const image = document.createElement('img');
  const content = document.createElement('div');
  const heading = document.createElement('h1');

  hero.className = `orlyata-page-hero orlyata-page-hero--${variant}`;
  image.className = 'orlyata-page-hero__image';
  image.src = imageSrc;
  image.alt = imageAlt;
  content.className = 'orlyata-page-hero__content';
  heading.className = 'orlyata-page-hero__title type-display';
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
      const control = document.createElement('a');
      const iconImage = document.createElement('img');
      control.className = 'orlyata-page-hero__share-control';
      control.href = '#';
      iconImage.src = `/wp-content/themes/orlyata/assets/icons/share/${icon}`;
      iconImage.alt = '';
      control.append(iconImage);
      share.append(control);
    });

    hero.append(back);
    content.append(details);
    hero.append(share);
  }

  content.append(heading);
  hero.append(image, content);
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
  render: () => createPageHero({
    imageSrc: '/wp-content/themes/orlyata/assets/images/news/bg-hero2.png',
    meta: '13 августа • Новость',
    title: 'Почетный работник культуры города Москвы!',
    variant: 'news-detail',
  }),
};
