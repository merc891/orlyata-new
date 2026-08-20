import type { Meta, StoryObj } from '@storybook/html-vite';

import { appendSection, createComponentPage, dataTable } from './content.stories';

const meta = {
  id: 'components-data-table',
  title: 'Components/DataTable',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface DataTableArgs {
  achievement: string;
  choir: string;
  competition: string;
  year: string;
}

export const Playground: StoryObj<DataTableArgs> = {
  args: {
    achievement: 'Лауреат I степени',
    choir: 'Старший',
    competition: 'XI Московский областной открытый конкурс хоров мальчиков Подмосковья',
    year: '2026',
  },
  argTypes: {
    achievement: { control: 'text' },
    choir: { control: 'text' },
    competition: { control: 'text' },
    year: { control: 'text' },
  },
  render: (args) => {
    const root = createComponentPage('DataTable Playground', 'Изменяйте данные строки через Controls.');
    appendSection(root, 'Preview', [dataTable([[args.year, args.achievement, args.choir, args.competition]])]);
    return root;
  },
};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const root = createComponentPage('Data table', 'Таблица для структурированных списков достижений и нот с нижней разделительной линией под каждой строкой.');
    appendSection(root, 'Default', [dataTable()]);
    return root;
  },
};
