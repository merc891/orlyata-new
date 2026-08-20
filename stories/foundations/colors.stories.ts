import type { Meta, StoryObj } from '@storybook/html-vite';

import { createFoundationPage, createTokenList, type TokenSpecimen } from './dom';

const colors: TokenSpecimen[] = [
  { className: 'foundation-swatch--brand', name: 'Brand', value: '--color-brand · #21a642' },
  { className: 'foundation-swatch--text-primary', name: 'Text primary', value: '--color-text-primary · #181717' },
  { className: 'foundation-swatch--text-secondary', name: 'Text secondary', value: '--color-text-secondary · #71717a' },
  { className: 'foundation-swatch--surface', name: 'Surface', value: '--color-surface · #ffffff' },
  { className: 'foundation-swatch--surface-muted', name: 'Surface muted', value: '--color-surface-muted · #f4f4f5' },
  { className: 'foundation-swatch--surface-inverse', name: 'Surface inverse', value: '--color-surface-inverse · #181717' },
  { className: 'foundation-swatch--surface-photo', name: 'Surface photo', value: '--color-surface-photo · #c6ccc2' },
  { className: 'foundation-swatch--border-subtle', name: 'Border subtle', value: '--color-border-subtle · #c7c7cc' },
  { className: 'foundation-swatch--error', name: 'Error', value: '--color-error · #d63a3a' },
  { className: 'foundation-swatch--neutral-100', name: 'Neutral 100', value: '--color-neutral-100 · #eaeaeb' },
  { className: 'foundation-swatch--neutral-200', name: 'Neutral 200', value: '--color-neutral-200 · #9999a2' },
];

const meta = {
  title: 'Foundations/Colors',
  render: () => {
    const page = createFoundationPage('Цвет', 'Семантические роли из manifest.json. Цвет не используется как единственный носитель смысла.');
    page.append(createTokenList(colors, 'foundation-swatch'));
    return page;
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Palette: Story = {};
