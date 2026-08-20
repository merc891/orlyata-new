import type { Meta, StoryObj } from '@storybook/html-vite';

type CurrentPage = 'none' | 'about' | 'media' | 'news' | 'scores' | 'contacts';

interface SidebarArgs {
  ctaLabel: string;
  currentPage: CurrentPage;
  isHome: boolean;
}

const navigationItems = [
  { id: 'about', label: 'О капелле', url: '/o-kapelle/' },
  { id: 'media', label: 'Медиагалерея', url: '/mediagalereya/' },
  { id: 'news', label: 'Новости', url: '/novosti/' },
  { id: 'scores', label: 'Ноты', url: '/noty/' },
  { id: 'contacts', label: 'Контакты', url: '/kontakty/' },
] as const;

function createSidebar(args: SidebarArgs): HTMLElement {
  const sidebar = document.createElement('aside');
  const logoLink = document.createElement('a');
  const logo = document.createElement('img');
  const navigation = document.createElement('nav');
  const list = document.createElement('ul');
  const cta = document.createElement('a');
  const ctaText = document.createElement('span');

  sidebar.className = 'orlyata-sidebar' + (args.isHome ? ' orlyata-sidebar--home' : '');

  logoLink.className = 'orlyata-sidebar__logo-link';
  logoLink.href = '/';
  logoLink.setAttribute('aria-label', 'Орлята — на главную');
  logo.className = 'orlyata-sidebar__logo';
  logo.src = '/wp-content/themes/orlyata/assets/icons/logo-orlyata.svg';
  logo.alt = '';
  logo.width = 240;
  logo.height = 110;
  logoLink.append(logo);

  navigation.className = 'orlyata-sidebar__nav';
  navigation.setAttribute('aria-label', 'Основная навигация');
  list.className = 'orlyata-sidebar__list';

  for (const item of navigationItems) {
    const listItem = document.createElement('li');
    const link = document.createElement('a');

    listItem.className = 'orlyata-sidebar__item';
    link.className = 'orlyata-sidebar__link';
    link.href = item.url;
    link.textContent = item.label;

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

  sidebar.append(logoLink, navigation, cta);
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
    isHome: false,
  },
  argTypes: {
    ctaLabel: { control: 'text', description: 'Текст CTA записи.' },
    currentPage: {
      control: 'select',
      description: 'Текущий раздел, отмеченный aria-current.',
      options: ['none', 'about', 'media', 'news', 'scores', 'contacts'],
    },
    isHome: {
      control: 'boolean',
      description: 'Главная страница: hover логотипа отключён.',
    },
  },
  render: (args) => createSidebarPreview(args),
};

export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => createSidebarPreview({ ctaLabel: 'Записаться к нам', currentPage: 'none', isHome: false }),
};

export const CurrentPage: Story = {
  parameters: { controls: { disable: true } },
  render: () => createSidebarPreview({ ctaLabel: 'Записаться к нам', currentPage: 'news', isHome: false }),
};

export const Home: Story = {
  parameters: { controls: { disable: true } },
  render: () => createSidebarPreview({ ctaLabel: 'Записаться к нам', currentPage: 'none', isHome: true }),
};
