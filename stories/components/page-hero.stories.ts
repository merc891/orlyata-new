import type { Meta, StoryObj } from '@storybook/html-vite';

export type PageHeroOptions = {
  imageAlt?: string;
  imageSrc: string;
  title: string;
};

export function createPageHero({ imageAlt = '', imageSrc, title }: PageHeroOptions): HTMLElement {
  const hero = document.createElement('section');
  const image = document.createElement('img');
  const heading = document.createElement('h1');

  hero.className = 'orlyata-page-hero';
  image.className = 'orlyata-page-hero__image';
  image.src = imageSrc;
  image.alt = imageAlt;
  heading.className = 'orlyata-page-hero__title type-display';
  heading.textContent = title;
  hero.append(image, heading);
  return hero;
}

const meta = {
  id: 'components-page-hero',
  title: 'Components/Page hero',
  excludeStories: ['createPageHero'],
  parameters: { controls: { disable: true }, viewport: { defaultViewport: 'desktop1920' } },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => createPageHero({
    imageSrc: '/wp-content/themes/orlyata/assets/images/about/img271.png',
    title: 'О капелле',
  }),
};
