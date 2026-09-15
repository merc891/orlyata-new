import type { Meta, StoryObj } from '@storybook/html-vite';

import { appendSection, badge, createComponentPage } from './content.stories';
import { motionSpecifications } from './motion-specifications';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Badge',
  parameters: { docs: { description: { component: motionSpecifications.badge } } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface BadgeArgs {
  label: string;
  variant: 'default' | 'dark' | 'inverse' | 'filled';
}

export const Playground: StoryObj<BadgeArgs> = {
  args: { label: 'Сегодня', variant: 'default' },
  argTypes: {
    label: { control: 'text', description: 'Краткая метка.' },
    variant: {
      control: 'inline-radio',
      description: 'Обычный, dark, inverse поверх изображения или filled на белой surface.',
      options: ['default', 'dark', 'inverse', 'filled'],
    },
  },
  render: (args) => {
    const root = createComponentPage('Badge Playground', 'Изменяйте текст и вариант метки через Controls.');
    const specimen = document.createElement('div');
    specimen.className = args.variant === 'inverse' ? 'component-inverse-surface' : '';
    specimen.append(badge(args.label, args.variant));
    appendSection(root, 'Preview', [specimen]);
    return root;
  },
};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const root = createComponentPage('Badge', 'Метка для дат и компактных метаданных карточки.');
    const inverseSurface = document.createElement('div');
    inverseSurface.className = 'component-inverse-surface';
    inverseSurface.append(badge('Сегодня', 'inverse'));
    appendSection(root, 'Default', [badge('Сегодня'), badge('RuTube'), badge('23 мая')]);
    appendSection(root, 'Inverse', [inverseSurface]);
    appendSection(root, 'Filled', [badge('Сегодня', 'filled')]);
    appendSection(root, 'Dark', [badge('Выступления', 'dark')]);
    return root;
  },
};

export const Icon: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const root = createComponentPage('Badge / Icon', 'Декоративная категорийная метка сохраняет доступное имя у родительской ссылки.');
    const icon = document.createElement('img');
    const specimen = document.createElement('span');
    icon.alt = '';
    icon.setAttribute('aria-hidden', 'true');
    icon.src = '/wp-content/themes/orlyata/assets/icons/news-category-theatre.svg';
    specimen.className = 'orlyata-badge orlyata-badge--icon';
    specimen.append(icon);
    const darkIcon = specimen.cloneNode(true) as HTMLSpanElement;
    darkIcon.className = 'orlyata-badge orlyata-badge--dark-icon';
    appendSection(root, 'Icon', [specimen]);
    appendSection(root, 'Dark icon', [darkIcon]);
    return root;
  },
};

export const Mobile: Story = {
  parameters: { controls: { disable: true }, viewport: { defaultViewport: 'mobile393' } },
  render: () => {
    const root = createComponentPage('Badge', 'Текстовые и icon-варианты на mobile reference 393 px.');
    const icon = document.createElement('img');
    const specimen = document.createElement('span');
    icon.alt = '';
    icon.setAttribute('aria-hidden', 'true');
    icon.src = '/wp-content/themes/orlyata/assets/icons/news-category-theatre.svg';
    specimen.className = 'orlyata-badge orlyata-badge--icon';
    specimen.append(icon);
    appendSection(root, 'Mobile', [badge('23 мая'), badge('23 мая', 'filled'), specimen]);
    return root;
  },
};
