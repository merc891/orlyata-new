import type { Meta, StoryObj } from '@storybook/html-vite';

type CurrentPage = 'none' | 'about' | 'media' | 'news' | 'scores' | 'contacts';

export interface SidebarArgs {
  ctaLabel: string;
  currentPage: CurrentPage;
}

const navigationItems = [
  { id: 'about', label: 'О капелле', url: '/o-kapelle/' },
  { id: 'media', label: 'Медиагалерея', url: '/mediagalereya/' },
  { id: 'news', label: 'Новости', url: '/novosti/' },
  { id: 'scores', label: 'Ноты', url: '/noty/' },
  { id: 'contacts', label: 'Контакты', url: '/kontakty/' },
] as const;

export function createSidebar(args: SidebarArgs): HTMLElement {
  const sidebar = document.createElement('aside');
  const logoLink = document.createElement('a');
  const logo = document.createElement('img');
  const navigation = document.createElement('nav');
  const toggle = document.createElement('button');
  const list = document.createElement('ul');
  const cta = document.createElement('a');
  const ctaText = document.createElement('span');

  sidebar.className = 'orlyata-sidebar';

  logoLink.className = 'orlyata-sidebar__logo-link';
  logoLink.href = '/';
  logoLink.setAttribute('aria-label', 'Орлята — на главную');
  logo.className = 'orlyata-sidebar__logo';
  logo.src = '/wp-content/themes/orlyata/assets/icons/logo-orlyata.svg';
  logo.alt = '';
  logo.width = 240;
  logo.height = 110;
  logoLink.append(logo);

  toggle.className = 'orlyata-sidebar__menu-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-controls', 'sidebar-navigation');
  toggle.setAttribute('aria-expanded', 'true');
  toggle.setAttribute('aria-label', 'Открыть меню');
  toggle.innerHTML = '<span class="orlyata-sidebar__menu-toggle-line" aria-hidden="true"></span><span class="orlyata-sidebar__menu-toggle-line" aria-hidden="true"></span>';

  navigation.className = 'orlyata-sidebar__nav';
  navigation.id = 'sidebar-navigation';
  navigation.setAttribute('aria-label', 'Основная навигация');
  list.className = 'orlyata-sidebar__list';

  for (const item of navigationItems) {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    const label = document.createElement('span');

    listItem.className = 'orlyata-sidebar__item';
    link.className = 'orlyata-sidebar__link orlyata-text-link orlyata-text-link--color';
    link.href = item.url;
    label.className = 'orlyata-text-link__label';
    label.dataset.text = item.label;
    label.textContent = item.label;
    link.append(label);

    if (item.id === args.currentPage) {
      link.classList.add('is-current');
      link.setAttribute('aria-current', 'page');
    }

    listItem.append(link);
    list.append(listItem);
  }

  navigation.append(list);

  cta.className = 'orlyata-button orlyata-button--primary orlyata-sidebar__cta';
  cta.href = '/#application';
  ctaText.className = 'orlyata-button__label';
  ctaText.textContent = args.ctaLabel;
  cta.append(ctaText);

  sidebar.append(logoLink, toggle, navigation, cta);
  return sidebar;
}

function createSidebarPreview(args: SidebarArgs): HTMLElement {
  const preview = document.createElement('div');
  preview.className = 'sidebar-story-preview';
  preview.append(createSidebar(args));
  return preview;
}

const meta = {
  title: 'Components/Sidebar',
  excludeStories: ['createSidebar'],
  parameters: {
    viewport: { defaultViewport: 'desktop1920' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: StoryObj<SidebarArgs> = {
  args: {
    ctaLabel: 'Записаться к нам',
    currentPage: 'news',
  },
  argTypes: {
    ctaLabel: { control: 'text', description: 'Текст CTA записи.' },
    currentPage: {
      control: 'select',
      description: 'Текущий раздел, отмеченный aria-current.',
      options: ['none', 'about', 'media', 'news', 'scores', 'contacts'],
    },
  },
  render: (args) => createSidebarPreview(args),
};

export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => createSidebarPreview({ ctaLabel: 'Записаться к нам', currentPage: 'none' }),
};

export const CurrentPage: Story = {
  parameters: { controls: { disable: true } },
  render: () => createSidebarPreview({ ctaLabel: 'Записаться к нам', currentPage: 'news' }),
};
