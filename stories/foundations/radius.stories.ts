import type { Meta, StoryObj } from '@storybook/html-vite';

import { createFoundationPage, createTokenList, type TokenSpecimen } from './dom';

const radii: TokenSpecimen[] = [
  { className: 'foundation-radius--small', name: 'Small', value: '--radius-small · 0.5rem' },
  { className: 'foundation-radius--medium', name: 'Medium', value: '--radius-medium · 1rem' },
  { className: 'foundation-radius--large', name: 'Large', value: '--radius-large · 1.5rem' },
  { className: 'foundation-radius--full', name: 'Full', value: '--radius-full · pills and circles only' },
];

const meta = {
  title: 'Foundations/Radius',
  render: () => {
    const page = createFoundationPage('Радиусы', 'Full разрешён только для pills и кругов; карточки используют конечные small, medium или large.');
    page.append(createTokenList(radii, 'foundation-radius'));
    return page;
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {};
