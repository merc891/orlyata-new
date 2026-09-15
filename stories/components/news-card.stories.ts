import type { Meta, StoryObj } from '@storybook/html-vite';

import { appendSection, createComponentPage, newsCard } from './content.stories';
import { motionSpecifications } from './motion-specifications';

const meta = {
  tags: ['autodocs'],
  id: 'components-news-card',
  title: 'Components/NewsCard',
  parameters: { docs: { description: { component: motionSpecifications.newsCard } } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface NewsCardArgs {
  date: string;
  href: string;
  title: string;
}

export const Playground: StoryObj<NewsCardArgs> = {
  args: {
    date: 'сегодня',
    href: '#news',
    title: '«Крылатое сердце» — большой весенний концерт',
  },
  argTypes: {
    date: { control: 'text', description: 'Текст даты в Badge.' },
    href: { control: 'text', description: 'Адрес детальной публикации.' },
    title: { control: 'text', description: 'Заголовок публикации.' },
  },
  render: (args) => {
    const root = createComponentPage('NewsCard Playground', 'Проверяйте реальный русский контент и состояния карточки через Controls.');

    appendSection(root, 'Preview', [newsCard(args.title, args.date, args.href)]);
    return root;
  },
};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const root = createComponentPage('News card', 'Карточка публикации для ленты новостей и блока на главной. Заголовок использует роль Body во всех режимах.');
    appendSection(root, 'Default', [newsCard()]);
    return root;
  },
};

export const Mobile: Story = {
  parameters: { controls: { disable: true }, viewport: { defaultViewport: 'mobile393' } },
  render: () => {
    const root = createComponentPage('News card', 'Карточка публикации для ленты новостей и блока на главной. Заголовок использует роль Body во всех режимах.');
    appendSection(root, 'Default', [newsCard()]);
    return root;
  },
};
