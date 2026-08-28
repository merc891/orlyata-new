import type { Meta, StoryObj } from '@storybook/html-vite';

import { accordion, appendSection, createComponentPage } from './content.stories';
import { motionSpecifications } from './motion-specifications';

const meta = {
  tags: ['autodocs'],
  title: 'Components/Accordion',
  parameters: { docs: { description: { component: motionSpecifications.accordion } } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface AccordionArgs {
  content: string;
  meta: string;
  open: boolean;
  title: string;
}

export const Playground: StoryObj<AccordionArgs> = {
  args: {
    content: 'Подготовительная группа 5-7 лет занимается изучением основ музыкальной грамоты, постановкой правильного дыхания при пении сидя и стоя, поёт несложные произведения и учится играть на детских инструментах.',
    meta: '5-7 лет',
    open: false,
    title: 'Подготовительная группа',
  },
  argTypes: {
    content: { control: 'text', description: 'Текст раскрывающейся области.' },
    meta: { control: 'text', description: 'Возраст или другая метаинформация.' },
    open: { control: 'boolean', description: 'Начальное состояние раскрытия.' },
    title: { control: 'text', description: 'Заголовок строки.' },
  },
  render: (args) => {
    const root = createComponentPage('Accordion Playground', 'Изменяйте содержимое и начальное состояние в панели Controls.');
    appendSection(root, 'Preview', [accordion(args.open, args.title, args.meta, args.content)]);
    return root;
  },
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const root = createComponentPage('Accordion', 'Раскрывающийся блок для материалов страницы «О капелле».');
    appendSection(root, 'States', [accordion(false), accordion(true)]);
    return root;
  },
};
