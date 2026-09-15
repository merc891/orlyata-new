import type { Meta, StoryObj } from '@storybook/html-vite';

import { advantage, appendSection, createComponentPage } from './content.stories';
import { motionSpecifications } from './motion-specifications';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Advantage',
  parameters: { docs: { description: { component: motionSpecifications.advantage } } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface AdvantageArgs {
  label: string;
  value: string;
}

export const Playground: StoryObj<AdvantageArgs> = {
  args: { label: 'опытных педагогов', value: '6' },
  argTypes: {
    label: { control: 'text', description: 'Подпись показателя.' },
    value: { control: 'text', description: 'Крупное значение показателя.' },
  },
  render: (args) => {
    const root = createComponentPage('Advantage Playground', 'Проверяйте реальные и длинные значения через Controls.');
    appendSection(root, 'Preview', [advantage(args.value, args.label)]);
    return root;
  },
};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const root = createComponentPage('Advantage', 'Цифровой показатель для утверждённых фактов о капелле.');
    appendSection(root, 'Variants', [advantage('6', 'опытных педагогов'), advantage('35', 'лет истории капеллы')]);
    return root;
  },
};

export const Mobile: Story = {
  parameters: { controls: { disable: true }, viewport: { defaultViewport: 'mobile393' } },
  render: () => {
    const root = createComponentPage('Advantage', 'Мобильное представление цифрового показателя на reference-ширине 393 px.');
    appendSection(root, 'Mobile', [advantage('6', 'опытных педагогов'), advantage('35', 'лет истории капеллы')]);
    return root;
  },
};
