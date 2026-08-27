import type { Meta, StoryObj } from '@storybook/html-vite';

import { createComponentPage } from './content.stories';

export interface TeacherCardArgs {
  firstName: string;
  imageSrc: string;
  lastName: string;
  middleName: string;
}

export const teacherImageSources = {
  elena: '/wp-content/themes/orlyata/assets/images/about/elena.png',
  karp: '/wp-content/themes/orlyata/assets/images/about/karp.png',
  mar: '/wp-content/themes/orlyata/assets/images/about/mar.png',
  mash: '/wp-content/themes/orlyata/assets/images/about/mash.png',
  olg: '/wp-content/themes/orlyata/assets/images/about/olg.png',
  vict: '/wp-content/themes/orlyata/assets/images/about/vict.png',
} as const;

export function createTeacherCard({ firstName, imageSrc, lastName, middleName }: TeacherCardArgs): HTMLElement {
  const card = document.createElement('article');
  const image = document.createElement('img');
  const photo = document.createElement('span');
  const name = document.createElement('h3');
  const meta = document.createElement('p');
  const nameLabel = document.createElement('span');
  const metaLabel = document.createElement('span');
  const fullGivenName = `${firstName} ${middleName}`;

  card.className = 'orlyata-teacher-card';
  image.className = 'orlyata-teacher-card__photo';
  photo.className = 'orlyata-teacher-card__photo-wrap';
  image.src = imageSrc;
  image.alt = `${lastName} ${firstName} ${middleName}`;
  image.width = 240;
  image.height = 240;
  image.decoding = 'async';
  name.className = 'orlyata-teacher-card__name';
  nameLabel.className = 'orlyata-teacher-card__name-label';
  nameLabel.dataset.text = lastName;
  nameLabel.textContent = lastName;
  meta.className = 'orlyata-teacher-card__meta';
  metaLabel.className = 'orlyata-teacher-card__meta-label';
  metaLabel.dataset.text = fullGivenName;
  metaLabel.textContent = fullGivenName;
  name.append(nameLabel);
  meta.append(metaLabel);
  photo.append(image);
  card.append(photo, name, meta);

  return card;
}

function appendTeacherPreview(root: HTMLElement, cards: HTMLElement[]): void {
  const section = document.createElement('section');
  const grid = document.createElement('div');

  section.className = 'teacher-card-story-preview';
  grid.className = 'orlyata-about__teacher-grid';
  grid.append(...cards);
  section.append(grid);
  root.append(section);
}

const meta = {
  id: 'components-teacher-card',
  title: 'Components/Teacher card',
  excludeStories: ['createTeacherCard', 'teacherImageSources'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: StoryObj<TeacherCardArgs> = {
  args: {
    firstName: 'Андрей',
    imageSrc: teacherImageSources.vict,
    lastName: 'Чернецов',
    middleName: 'Викторович',
  },
  argTypes: {
    firstName: { control: 'text', description: 'Имя педагога.' },
    imageSrc: { control: 'text', description: 'URL утверждённого портрета.' },
    lastName: { control: 'text', description: 'Фамилия педагога.' },
    middleName: { control: 'text', description: 'Отчество педагога.' },
  },
  render: (args) => {
    const root = createComponentPage('Teacher card Playground', 'Карточка использует только переданный портрет без фоновой заглушки.');
    appendTeacherPreview(root, [createTeacherCard(args)]);
    return root;
  },
};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const root = createComponentPage('Teacher card', 'Утверждённые портреты педагогов для страницы «О капелле».');
    appendTeacherPreview(root, [
      createTeacherCard({ firstName: 'Андрей', imageSrc: teacherImageSources.vict, lastName: 'Чернецов', middleName: 'Викторович' }),
      createTeacherCard({ firstName: 'Ирина', imageSrc: teacherImageSources.karp, lastName: 'Карпман', middleName: 'Рафаиловна' }),
      createTeacherCard({ firstName: 'Елена', imageSrc: teacherImageSources.elena, lastName: 'Чернецова', middleName: 'Ивановна' }),
      createTeacherCard({ firstName: 'Марьяна', imageSrc: teacherImageSources.mar, lastName: 'Климова', middleName: 'Геннадьевна' }),
      createTeacherCard({ firstName: 'Ольга', imageSrc: teacherImageSources.olg, lastName: 'Угольникова', middleName: 'Александровна' }),
      createTeacherCard({ firstName: 'Мария', imageSrc: teacherImageSources.mash, lastName: 'Моисеева', middleName: 'Андреевна' }),
    ]);
    return root;
  },
};
