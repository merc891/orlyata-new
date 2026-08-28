import type { Meta, StoryObj } from '@storybook/html-vite';

import { appendSection, createComponentPage, mediaCard } from './content.stories';
import { motionSpecifications } from './motion-specifications';

const meta = {
  tags: ['autodocs'],
  id: 'components-media-card',
  title: 'Components/MediaCard',
  parameters: { docs: { description: { component: motionSpecifications.mediaCard } } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface MediaCardArgs {
  date: string;
  href: string;
  mediaType: 'photo' | 'video';
  size: 'big' | 'small';
  startOffsetSeconds: number;
  title: string;
  videoEmbedUrl: string;
  videoUrl: string;
}

export const Playground: StoryObj<MediaCardArgs> = {
  args: {
    date: 'Сегодня',
    href: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    mediaType: 'video',
    size: 'big',
    startOffsetSeconds: 0,
    title: 'Гала-концерт в БЗК (юноши и Вита Нова)',
    videoEmbedUrl: '',
    videoUrl: '/wp-content/themes/orlyata/assets/videos/home/hero-preview.mp4',
  },
  argTypes: {
    date: { control: 'text' },
    href: { control: 'text' },
    mediaType: { control: 'inline-radio', options: ['photo', 'video'] },
    size: { control: 'inline-radio', options: ['big', 'small'] },
    startOffsetSeconds: { control: { min: 0, step: 1, type: 'number' }, description: 'Смещение начала восьмисекундного video-preview.' },
    title: { control: 'text' },
    videoEmbedUrl: { control: 'text', description: 'Trusted provider iframe-preview URL; card link remains the only action.' },
    videoUrl: { control: 'text', description: 'Локальный или внешний URL muted video-preview.' },
  },
  render: (args) => {
    const root = createComponentPage('MediaCard Playground', 'Video-вариант воспроизводит muted восьмисекундный preview поверх обложки; Play — декоративная метка, карточка ведёт на внешний URL в новой вкладке.');
    appendSection(root, 'Preview', [mediaCard(args.size, args.title, args.date, '', args.href, {
      mediaType: args.mediaType,
      startOffsetSeconds: args.startOffsetSeconds,
      videoEmbedUrl: args.videoEmbedUrl,
      videoUrl: args.videoUrl,
    })]);
    return root;
  },
};

export const ProviderEmbedPreview: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const root = createComponentPage('MediaCard: provider iframe', 'Preview внешнего видеопровайдера остаётся декоративным: карточка является единственной ссылкой.');
    appendSection(root, 'RuTube preview', [mediaCard('big', undefined, '10 июня', 'RuTube', 'https://rutube.ru/play/embed/2ad60bfd20027143c2eac71acdb5faef/', {
      mediaType: 'video',
      videoEmbedUrl: 'https://rutube.ru/play/embed/2ad60bfd20027143c2eac71acdb5faef/?autostartmute=true&autoplay=true',
    })]);
    return root;
  },
};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const root = createComponentPage('Media card', 'Карточка фото- или видеоальбома в большом и малом размере.');
    appendSection(root, 'Variants', [mediaCard('big', undefined, 'Сегодня', 'RuTube', '#media', { mediaType: 'video' }), mediaCard('small', undefined, '23 мая')]);
    return root;
  },
};
