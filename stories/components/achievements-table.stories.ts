import type { Meta, StoryObj } from '@storybook/html-vite';

import { dataTable, textLink } from './content.stories';
import { motionSpecifications } from './motion-specifications';

function createAchievementsTable(withLink = true): HTMLElement {
  const section = document.createElement('section');
  const heading = document.createElement('h2');
  const head = document.createElement('div');
  const tableWrap = document.createElement('div');

  section.className = 'orlyata-home__section orlyata-home__achievements orlyata-achievements';
  section.setAttribute('aria-labelledby', 'storybook-achievements-title');
  head.className = 'orlyata-home__section-head';
  heading.className = 'type-heading-2';
  heading.id = 'storybook-achievements-title';
  heading.textContent = 'Достижения';
  head.append(heading);
  if (withLink) {
    head.append(textLink('Все достижения', '/o-kapelle/#achievements', 'color', true));
  }
  tableWrap.className = 'orlyata-home__table-wrap';
  tableWrap.append(dataTable());
  section.append(head, tableWrap);
  return section;
}

const meta = {
  tags: ['autodocs'],
  id: 'components-achievements-table',
  title: 'Components/AchievementsTable',
  excludeStories: ['createAchievementsTable'],
  parameters: { docs: { description: { component: motionSpecifications.dataTable } } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => createAchievementsTable(true),
};

export const WithoutLink: Story = {
  parameters: { controls: { disable: true } },
  render: () => createAchievementsTable(false),
};

export const Mobile: Story = {
  parameters: { controls: { disable: true }, viewport: { defaultViewport: 'mobile393' } },
  render: () => createAchievementsTable(true),
};
