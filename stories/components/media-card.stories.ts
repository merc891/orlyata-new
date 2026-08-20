import type { Meta, StoryObj } from '@storybook/html-vite';

import { appendSection, createComponentPage, mediaCard } from './content.stories';

const meta = {
  id: 'components-media-card',
  title: 'Components/MediaCard',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface MediaCardArgs {
  date: string;
  href: string;
  mediaType: 'photo' | 'video';
  showPlayIcon: boolean;
  size: 'big' | 'small';
  startOffsetSeconds: number;
  title: string;
  videoUrl: string;
}

export const Playground: StoryObj<MediaCardArgs> = {
  args: {
    date: 'Сегодня',
    href: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    mediaType: 'video',
    showPlayIcon: true,
    size: 'big',
    startOffsetSeconds: 0,
    title: 'Гала-концерт в БЗК (юноши и Вита Нова)',
    videoUrl: '/wp-content/themes/orlyata/assets/videos/home/hero-preview.mp4',
  },
  argTypes: {
    date: { control: 'text' },
    href: { control: 'text' },
    mediaType: { control: 'inline-radio', options: ['photo', 'video'] },
    showPlayIcon: { control: 'boolean', description: 'Показывать Play только у video-варианта.' },
    size: { control: 'inline-radio', options: ['big', 'small'] },
    startOffsetSeconds: { control: { min: 0, step: 1, type: 'number' }, description: 'Смещение начала восьмисекундного video-preview.' },
    title: { control: 'text' },
    videoUrl: { control: 'text', description: 'Локальный или внешний URL muted video-preview.' },
  },
  render: (args) => {
    const root = createComponentPage('MediaCard Playground', 'Video-вариант воспроизводит muted восьмисекундный preview поверх обложки; Play — декоративная метка, карточка ведёт на внешний URL в новой вкладке.');
    appendSection(root, 'Preview', [mediaCard(args.size, args.title, args.date, '', args.href, {
      mediaType: args.mediaType,
      showPlayIcon: args.showPlayIcon,
      startOffsetSeconds: args.startOffsetSeconds,
      videoUrl: args.videoUrl,
    })]);
    return root;
  },
};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const root = createComponentPage('Media card', 'Карточка фото- или видеоальбома в большом и малом размере.');
    appendSection(root, 'Variants', [mediaCard('big'), mediaCard('small')]);
    return root;
  },
};
