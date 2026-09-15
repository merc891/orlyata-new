import type { Meta, StoryObj } from '@storybook/html-vite';

import { motionSpecifications } from './motion-specifications';

type CurrentPage = 'none' | 'about' | 'media' | 'news' | 'scores' | 'contacts';

export interface SidebarArgs {
  ctaLabel: string;
  currentPage: CurrentPage;
}

const navigationItems = [
  { id: 'about', label: 'О капелле', url: '/o-kapelle/' },
  { id: 'news', label: 'Новости', url: '/novosti/' },
  { id: 'media', label: 'Медиагалерея', url: '/mediagalereya/' },
  { id: 'scores', label: 'Ноты', url: '/noty/' },
  { id: 'contacts', label: 'Контакты', url: '/kontakty/' },
] as const;

export function createSidebar(args: SidebarArgs): HTMLElement {
  const sidebar = document.createElement('aside');
  const logoLink = document.createElement('a');
  const logoPicture = document.createElement('picture');
  const mobileLogoSource = document.createElement('source');
  const tabletLogoSource = document.createElement('source');
  const logo = document.createElement('img');
  const navigation = document.createElement('nav');
  const toggle = document.createElement('button');
  const menuPanel = document.createElement('div');
  const menuPanelContent = document.createElement('div');
  const list = document.createElement('ul');
  const cta = document.createElement('a');
  const ctaText = document.createElement('span');
  const tabletCta = document.createElement('a');
  const tabletCtaText = document.createElement('span');
  const contacts = document.createElement('ul');
  const socials = document.createElement('ul');

  sidebar.className = 'orlyata-sidebar';

  logoLink.className = 'orlyata-sidebar__logo-link';
  logoLink.href = '/';
  logoLink.setAttribute('aria-label', 'Орлята — на главную');
  logoPicture.className = 'orlyata-sidebar__logo-picture';
  mobileLogoSource.media = '(max-width: 767px)';
  mobileLogoSource.srcset = '/wp-content/themes/orlyata/assets/icons/logo-mob.svg';
  tabletLogoSource.media = '(max-width: 1279px)';
  tabletLogoSource.srcset = '/wp-content/themes/orlyata/assets/icons/logo-tablet.svg';
  logo.className = 'orlyata-sidebar__logo';
  logo.src = '/wp-content/themes/orlyata/assets/icons/logo-orlyata.svg';
  logo.alt = '';
  logo.width = 240;
  logo.height = 110;
  logoPicture.append(mobileLogoSource, tabletLogoSource, logo);
  logoLink.append(logoPicture);

  toggle.className = 'orlyata-button orlyata-button--menu-tablet orlyata-button--icon-only orlyata-sidebar__menu-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-controls', 'sidebar-navigation');
  toggle.setAttribute('aria-expanded', 'true');
  toggle.innerHTML = '<svg class="orlyata-button__icon orlyata-button__menu-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path class="orlyata-button__menu-icon-path" d="M3 8.5h18m-18 7h18"></path></svg>';
  toggle.setAttribute('aria-label', 'Открыть меню');

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

  tabletCta.className = 'orlyata-button orlyata-button--primary orlyata-sidebar__tablet-cta';
  tabletCta.href = '/#application';
  tabletCtaText.className = 'orlyata-button__label';
  tabletCtaText.textContent = args.ctaLabel;
  tabletCta.append(tabletCtaText);

  cta.className = 'orlyata-button orlyata-button--primary orlyata-sidebar__cta';
  menuPanel.className = 'orlyata-sidebar__menu-panel';
  menuPanelContent.className = 'orlyata-sidebar__menu-panel-content';
  cta.href = '/#application';
  ctaText.className = 'orlyata-button__label';
  ctaText.textContent = args.ctaLabel;
  cta.append(ctaText);

  contacts.className = 'orlyata-sidebar__menu-contacts';
  contacts.setAttribute('aria-label', 'Контакты');
  for (const contact of [
    { label: 'info@zelorlyata.ru', href: 'mailto:info@zelorlyata.ru' },
    { label: '+7 (925) 434-51-98', href: 'tel:+79254345198' },
    { label: '+7 (916) 258-49-12', href: 'tel:+79162584912' },
  ]) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    item.className = 'orlyata-sidebar__menu-contact-item';
    link.className = 'orlyata-sidebar__menu-contact-link';
    link.href = contact.href;
    link.textContent = contact.label;
    item.append(link);
    contacts.append(item);
  }

  socials.className = 'orlyata-sidebar__menu-socials';
  socials.setAttribute('aria-label', 'Социальные сети');
  for (const social of [
    { label: 'ВКонтакте', url: 'https://vk.ru/zelorlyata', icon: 'vk.svg' },
    { label: 'Telegram', url: 'https://t.me/zel_orlyata', icon: 'telegram.svg' },
  ]) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    const icon = document.createElement('img');
    link.className = 'orlyata-sidebar__menu-social-link';
    link.href = social.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', social.label);
    icon.src = '/wp-content/themes/orlyata/assets/icons/share/' + social.icon;
    icon.alt = '';
    icon.setAttribute('aria-hidden', 'true');
    link.append(icon);
    item.append(link);
    socials.append(item);
  }

  menuPanelContent.append(navigation, socials, contacts, cta);
  menuPanel.append(menuPanelContent);
  sidebar.append(logoLink, tabletCta, toggle, menuPanel);
  return sidebar;
}

function createSidebarPreview(args: SidebarArgs): HTMLElement {
  const preview = document.createElement('div');
  preview.className = 'sidebar-story-preview';
  preview.append(createSidebar(args));
  return preview;
}

const meta = {
  tags: ['autodocs'],
  title: 'Components/Sidebar',
  excludeStories: ['createSidebar'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: motionSpecifications.sidebar } },
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

export const Mobile: Story = {
  parameters: { controls: { disable: true }, viewport: { defaultViewport: 'mobile393' } },
  render: () => createSidebarPreview({ ctaLabel: 'Записаться к нам', currentPage: 'none' }),
};

export const CurrentPage: Story = {
  parameters: { controls: { disable: true } },
  render: () => createSidebarPreview({ ctaLabel: 'Записаться к нам', currentPage: 'news' }),
};

export const MediaGallery: Story = {
  parameters: { controls: { disable: true } },
  render: () => createSidebarPreview({ ctaLabel: 'Записаться к нам', currentPage: 'media' }),
};
