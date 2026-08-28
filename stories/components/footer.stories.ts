import type { Meta, StoryObj } from '@storybook/html-vite';

import { motionSpecifications } from './motion-specifications';

export interface FooterArgs {
  address: string;
  email: string;
  legalLabel: string;
  phonePrimary: string;
  phoneSecondary: string;
}

const primaryNavigation = [
  ['О капелле', '/o-kapelle/'],
  ['Новости', '/novosti/'],
  ['Достижения', '/o-kapelle/#achievements'],
  ['Педагоги', '/o-kapelle/#teachers'],
  ['Ноты', '/noty/'],
  ['Контакты', '/kontakty/'],
] as const;

const mediaNavigation = [
  ['Фотогалерея', '/mediagalereya/foto/'],
  ['Видео', '/mediagalereya/video/'],
] as const;

function createLink(label: string, href: string, extraClass = ''): HTMLAnchorElement {
  const link = document.createElement('a');
  link.className = 'orlyata-footer__link' + (extraClass === '' ? '' : ' ' + extraClass);
  link.href = href;
  link.textContent = label;
  return link;
}

function createLinkList(items: ReadonlyArray<readonly [string, string]>): HTMLUListElement {
  const list = document.createElement('ul');
  list.className = 'orlyata-footer__list';

  for (const [label, href] of items) {
    const item = document.createElement('li');
    item.className = 'orlyata-footer__list-item';
    item.append(createLink(label, href));
    list.append(item);
  }

  return list;
}

function createNavigationGroup(title: string, items: ReadonlyArray<readonly [string, string]>): HTMLElement {
  const group = document.createElement('div');
  const heading = document.createElement('p');

  group.className = 'orlyata-footer__navigation-group';
  heading.className = 'orlyata-footer__section-title';
  heading.textContent = title;
  group.append(heading, createLinkList(items));
  return group;
}

function phoneHref(phone: string): string {
  return 'tel:' + phone.replaceAll(/[^0-9+]/g, '');
}

export function createFooter(args: FooterArgs): HTMLElement {
  const footer = document.createElement('footer');
  const content = document.createElement('div');
  const brand = document.createElement('div');
  const slogan = document.createElement('p');
  const sloganFirst = document.createElement('span');
  const sloganSecond = document.createElement('span');
  const copyright = document.createElement('p');
  const copyrightYears = document.createElement('span');
  const copyrightName = document.createElement('span');
  const navigation = document.createElement('nav');
  const contacts = document.createElement('div');
  const contactsAddress = document.createElement('div');
  const contactsTitle = document.createElement('p');
  const address = document.createElement('address');
  const contactLinks = document.createElement('div');

  footer.className = 'orlyata-footer';
  content.className = 'orlyata-footer__content';

  brand.className = 'orlyata-footer__brand';
  slogan.className = 'orlyata-footer__slogan';
  sloganFirst.textContent = 'Сегодня орлята,';
  sloganSecond.textContent = 'а завтра – орлы!';
  slogan.append(sloganFirst, sloganSecond);
  brand.append(slogan);

  copyright.className = 'orlyata-footer__copyright';
  copyrightYears.textContent = '© 2005–2026';
  copyrightName.textContent = 'Хоровая капелла мальчиков «Орлята»';
  copyright.append(copyrightYears, copyrightName);

  navigation.className = 'orlyata-footer__navigation';
  navigation.setAttribute('aria-label', 'Навигация в подвале');
  navigation.append(
    createNavigationGroup('Навигация', primaryNavigation),
    createNavigationGroup('Медиа', mediaNavigation),
  );

  contacts.className = 'orlyata-footer__contacts';
  contactsAddress.className = 'orlyata-footer__contacts-address';
  contactsTitle.className = 'orlyata-footer__section-title';
  contactsTitle.textContent = 'Контакты';
  address.className = 'orlyata-footer__address';
  address.textContent = args.address;
  contactsAddress.append(contactsTitle, address);

  contactLinks.className = 'orlyata-footer__contact-links';
  if (args.phonePrimary.trim() !== '') {
    contactLinks.append(createLink(args.phonePrimary, phoneHref(args.phonePrimary)));
  }
  if (args.phoneSecondary.trim() !== '') {
    contactLinks.append(createLink(args.phoneSecondary, phoneHref(args.phoneSecondary)));
  }
  if (args.email.trim() !== '') {
    contactLinks.append(createLink(args.email, 'mailto:' + args.email, 'orlyata-footer__link--email'));
  }
  contacts.append(contactsAddress, contactLinks);

  content.append(
    brand,
    copyright,
    navigation,
    contacts,
    createLink(args.legalLabel, '/politika-konfidencialnosti/', 'orlyata-footer__legal'),
  );
  footer.append(content);
  return footer;
}

function createFooterPreview(args: FooterArgs): HTMLElement {
  const preview = document.createElement('div');
  preview.className = 'footer-story-preview';
  preview.append(createFooter(args));
  return preview;
}

const sampleArgs: FooterArgs = {
  address: 'г. Зеленоград, Центральная площадь, 1\nКЦ «Зеленоград»',
  email: 'info@zelorlyata.ru',
  legalLabel: 'Политика конфиденциальности',
  phonePrimary: '+7 (925) 434-51-98',
  phoneSecondary: '+7 (916) 258-49-12',
};

const meta = {
  tags: ['autodocs'],
  title: 'Components/Footer',
  excludeStories: ['createFooter'],
  parameters: {
    docs: { description: { component: motionSpecifications.footer } },
    viewport: { defaultViewport: 'desktop1920' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: StoryObj<FooterArgs> = {
  args: sampleArgs,
  argTypes: {
    address: { control: 'text', description: 'Адрес из site_settings.' },
    email: { control: 'text', description: 'Контактный email из site_settings.' },
    legalLabel: { control: 'text', description: 'Подтверждённая юридическая ссылка.' },
    phonePrimary: { control: 'text', description: 'Первый телефон из site_settings.' },
    phoneSecondary: { control: 'text', description: 'Второй телефон из site_settings.' },
  },
  render: (args) => createFooterPreview(args),
};

export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => createFooterPreview(sampleArgs),
};
