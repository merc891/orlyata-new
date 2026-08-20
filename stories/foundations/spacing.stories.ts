import type { Meta, StoryObj } from '@storybook/html-vite';

import { createFoundationPage, createTokenList, type TokenSpecimen } from './dom';

const spacing: TokenSpecimen[] = [
  { className: 'foundation-measure--0', name: 'Space 0', value: '--space-0 · 0' },
  { className: 'foundation-measure--1', name: 'Space 1', value: '--space-1 · 0.25rem' },
  { className: 'foundation-measure--2', name: 'Space 2', value: '--space-2 · 0.5rem' },
  { className: 'foundation-measure--4', name: 'Space 4', value: '--space-4 · 1rem' },
  { className: 'foundation-measure--5', name: 'Space 5', value: '--space-5 · 1.5rem' },
  { className: 'foundation-measure--7', name: 'Space 7', value: '--space-7 · 2.5rem' },
];

const meta = {
  title: 'Foundations/Spacing',
  render: () => {
    const page = createFoundationPage('Интервалы', 'Только подтверждённые Figma Variables. Другие значения проходят аудит повторяемости до появления токена.');
    page.append(createTokenList(spacing, 'foundation-measure'));
    return page;
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {};
