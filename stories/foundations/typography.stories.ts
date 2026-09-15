import type { Meta, StoryObj } from '@storybook/html-vite';

import { createFoundationPage } from './dom';

interface TypeRole {
  className: string;
  label: string;
  sample: string;
  specification: string;
}

const desktopRoles: TypeRole[] = [
  { className: 'type-display', label: 'Display / Hero', sample: 'Сегодня орлята, а завтра — орлы', specification: 'TT Turns · normal · 72px · 500 · 0.7 · −2px at 1920px' },
  { className: 'type-heading-1', label: 'Heading 1', sample: 'Хоровая капелла мальчиков', specification: 'TT Turns · normal · 64px · 500 · 0.9 · −1px at 1920px' },
  { className: 'type-heading-2', label: 'Heading 2', sample: 'Медиагалерея', specification: 'TT Turns · normal · 44px · 500 · 0.9 · −0.5px at 1920px' },
  { className: 'type-lead', label: 'Lead', sample: 'Музыка помогает услышать друг друга', specification: 'TT Turns · normal · 36px · 500 · 1.2 · −0.5px at 1920px' },
  { className: 'type-heading-3', label: 'Heading 3', sample: 'Концерт в КЦ «Зеленоград»', specification: 'TT Turns · normal · 24px · 500 · 1.3 · 0px at 1920px' },
  { className: 'type-body', label: 'Body', sample: 'В капелле сложилась устойчивая система музыкально-хорового воспитания мальчиков от 5 до 17 лет.', specification: 'TT Turns · normal · 20px · 500 · 1.4 · 0px at 1920px' },
  { className: 'type-caption', label: 'Caption', sample: 'Выступления · Старший хор · 2026', specification: 'TT Turns · normal · 14px · 500 · 1.5 · 0px at 1920px' },
];

const mobileRoles: TypeRole[] = [
  { className: 'type-display', label: 'Display / Hero', sample: 'Сегодня орлята, а завтра — орлы', specification: 'TT Turns · normal · 40px · 500 · 0.7 · −1px at 393px' },
  { className: 'type-heading-1', label: 'Heading 1', sample: 'Хоровая капелла мальчиков', specification: 'TT Turns · normal · 40px · 500 · 0.9 · −1px at 393px' },
  { className: 'type-heading-2', label: 'Heading 2', sample: 'Медиагалерея', specification: 'TT Turns · normal · 32px · 500 · 1 · −0.5px at 393px' },
  { className: 'type-menu', label: 'Menu', sample: 'О капелле · Новости · Ноты', specification: 'TT Turns · normal · 24px · 500 · 1 · 0px at 393px' },
  { className: 'type-heading-3', label: 'Heading 3', sample: 'Концерт в КЦ «Зеленоград»', specification: 'TT Turns · normal · 20px · 500 · 1.2 · 0px at 393px' },
  { className: 'type-body', label: 'Body', sample: 'В капелле сложилась устойчивая система музыкально-хорового воспитания мальчиков от 5 до 17 лет.', specification: 'TT Turns · normal · 16px · 500 · 1.4 · 0px at 393px' },
  { className: 'type-body-120', label: 'Body 120', sample: 'Соревнование и фестиваль сохраняют более плотный ритм строки.', specification: 'TT Turns · normal · 16px · 500 · 1.2 · 0px at 393px' },
  { className: 'type-badge', label: 'Badge', sample: 'Сегодня', specification: 'TT Turns · normal · 14px · 500 · 1.4 · 0px at 393px' },
  { className: 'type-caption', label: 'Caption', sample: 'Выступления · Старший хор · 2026', specification: 'TT Turns · normal · 12px · 500 · 1.5 · −0.5px at 393px' },
];

function renderScale(title: string, description: string, roles: TypeRole[], mode: 'desktop' | 'tablet' | 'mobile'): HTMLElement {
  const page = createFoundationPage(title, description);
  page.classList.add(`foundation-page--type-${mode}`);
  const list = document.createElement('div');
  list.className = 'foundation-type-list';

  for (const role of roles) {
    const row = document.createElement('section');
    const metaLine = document.createElement('div');
    const label = document.createElement('strong');
    const specification = document.createElement('code');
    const sample = document.createElement('p');

    row.className = 'foundation-type-row';
    metaLine.className = 'foundation-type-meta type-caption';
    label.textContent = role.label;
    specification.textContent = role.specification;
    sample.className = `foundation-type-sample ${role.className}`;
    sample.textContent = role.sample;

    metaLine.append(label, specification);
    row.append(metaLine, sample);
    list.append(row);
  }

  page.append(list);
  return page;
}

const meta = {
  title: 'Foundations/Typography',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {
  parameters: { viewport: { defaultViewport: 'desktop1920' } },
  render: () => renderScale('Типографика — desktop', 'Desktop reference: 1920px. Desktop roles follow the shared S scale: 66.6667% at 1280px, 100% at 1920px, and 133.3333% at 2560px.', desktopRoles, 'desktop'),
};

export const TabletScale: Story = {
  parameters: { viewport: { defaultViewport: 'tablet768' } },
  render: () => renderScale('Типографика — tablet', 'Tablet reference: 1279px. Roles match the approved desktop reference values and follow Sₜ through 768–1279px.', desktopRoles, 'tablet'),
};

export const MobileScale: Story = {
  parameters: { viewport: { defaultViewport: 'mobile393' } },
  render: () => renderScale('Типографика — mobile', 'Mobile reference: 393px (iPhone 14 Pro). Sizes follow Sₘ through 320–767px.', mobileRoles, 'mobile'),
};
