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
  variant: 'default' | 'inverse';
}

export const Playground: StoryObj<BadgeArgs> = {
  args: { label: 'Сегодня', variant: 'default' },
  argTypes: {
    label: { control: 'text', description: 'Краткая метка.' },
    variant: {
      control: 'inline-radio',
      description: 'Обычный вариант или белый поверх изображения.',
      options: ['default', 'inverse'],
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
    appendSection(root, 'Default', [badge('сегодня'), badge('RuTube'), badge('23 мая')]);
    appendSection(root, 'Inverse', [inverseSurface]);
    return root;
  },
};
