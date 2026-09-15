import type { Meta, StoryObj } from '@storybook/html-vite';

import { appendSection, createComponentPage, input } from './content.stories';
import { motionSpecifications } from './motion-specifications';

type InputState = 'default' | 'typing' | 'filled' | 'error';
type InputType = 'text' | 'tel' | 'date' | 'search';

interface InputArgs {
  error: string;
  label: string;
  state: InputState;
  type: InputType;
  value: string;
}

const meta = {
  tags: ['autodocs'],
  title: 'Components/Input',
  parameters: { docs: { description: { component: motionSpecifications.input } } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: StoryObj<InputArgs> = {
  args: {
    error: 'поле обязательно для заполнения',
    label: 'ФИО родителя',
    state: 'filled',
    type: 'text',
    value: 'Семёнова Мария Павловна',
  },
  argTypes: {
    error: { control: 'text', description: 'Текст ошибки для состояния error.' },
    label: { control: 'text', description: 'Видимая и программная подпись поля.' },
    state: {
      control: 'inline-radio',
      description: 'Визуальное состояние из Figma.',
      options: ['default', 'typing', 'filled', 'error'],
    },
    type: {
      control: 'select',
      description: 'Вариант поля: date использует маску ДД.ММ.ГГГГ без календаря, tel — маску +7.',
      options: ['text', 'tel', 'date', 'search'],
    },
    value: { control: 'text', description: 'Значение для typing и filled.' },
  },
  render: (args) => {
    const root = createComponentPage('Input Playground', 'Изменяйте публичные свойства поля в панели Controls.');
    appendSection(root, 'Preview', [input(args.label, args.state, 'playground', args.value, args.error, args.type)]);
    return root;
  },
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const root = createComponentPage('Input', 'Четыре состояния поля из Figma: default, typing, filled и error.');
    appendSection(root, 'States', [
      input('ФИО родителя', 'default', 'parent-name-default'),
      input('ФИО родителя', 'typing', 'parent-name-typing'),
      input('ФИО родителя', 'filled', 'parent-name-filled'),
      input('ФИО родителя', 'error', 'parent-name-error'),
    ]);
    return root;
  },
};

export const Mobile: Story = {
  parameters: { controls: { disable: true }, viewport: { defaultViewport: 'mobile393' } },
  render: () => {
    const root = createComponentPage('Input', 'Default, заполненное, error и маскированные поля на mobile reference 393 px.');
    appendSection(root, 'Mobile', [
      input('ФИО родителя', 'default', 'mobile-parent-name'),
      input('Дата рождения ребёнка', 'filled', 'mobile-birth-date', '2021-02-16', undefined, 'date'),
      input('Телефон', 'filled', 'mobile-phone', '+7 (926) 232-11-27', undefined, 'tel'),
      input('ФИО ребёнка', 'error', 'mobile-child-name'),
    ]);
    return root;
  },
};
