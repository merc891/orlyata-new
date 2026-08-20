import type { Meta, StoryObj } from '@storybook/html-vite';

import { createFoundationPage } from './dom';

interface TypeRole {
  className: string;
  label: string;
  sample: string;
  specification: string;
}

const roles: TypeRole[] = [
  { className: 'type-display', label: 'Display / Hero', sample: 'Сегодня орлята, а завтра — орлы', specification: '80px · 500 · 0.65 · −5px' },
  { className: 'type-heading-1', label: 'Heading 1', sample: 'Хоровая капелла мальчиков', specification: '64px · 500 · 0.8 · −3px' },
  { className: 'type-heading-2', label: 'Heading 2', sample: 'Медиагалерея', specification: '44px · 500 · 0.9 · −2px' },
  { className: 'type-lead', label: 'Lead', sample: 'Музыка помогает услышать друг друга', specification: '36px · 500 · 1 · −1px' },
  { className: 'type-heading-3', label: 'Heading 3', sample: 'Концерт в КЦ «Зеленоград»', specification: '24px · 500 · 1.2 · −1px' },
  { className: 'type-body', label: 'Body', sample: 'В капелле сложилась устойчивая система музыкально-хорового воспитания мальчиков от 5 до 17 лет.', specification: '20px · 400 · 1.4 · −0.5px' },
  { className: 'type-caption', label: 'Caption', sample: 'Выступления · Старший хор · 2026', specification: '14px · 400 · 1.5 · −0.2px' },
];

const meta = {
  title: 'Foundations/Typography',
  render: () => {
    const page = createFoundationPage('Типографика', 'F37 Ginger Cyrillic VF обязателен. Пока WOFF2 отсутствует, браузер показывает fallback; visual snapshots не фиксируются. Tablet/mobile роли проектируются на этапе 4.');
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
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scale: Story = {};
