import type { Meta, StoryObj } from '@storybook/html-vite';

type ButtonVariant = 'primary' | 'secondary' | 'play' | 'arrow-left' | 'arrow-right';
type VisualState = 'default' | 'hover' | 'active' | 'disabled' | 'loading';

interface ButtonOptions {
  ariaLabel?: string;
  href?: string;
  icon?: 'close';
  label?: string;
  state?: VisualState;
  variant: ButtonVariant;
}

const iconRoot = '/wp-content/themes/orlyata/assets/icons';

function createButton(options: ButtonOptions): HTMLAnchorElement | HTMLButtonElement {
  const isIconOnly = ['play', 'arrow-left', 'arrow-right'].includes(options.variant);
  const isLoading = options.state === 'loading' && options.href === undefined;
  const isDisabled = options.state === 'disabled' || isLoading;
  const control = options.href === undefined ? document.createElement('button') : document.createElement('a');

  control.className = `orlyata-button orlyata-button--${options.variant}`;

  if (isIconOnly) {
    control.classList.add('orlyata-button--icon-only');
    control.setAttribute('aria-label', options.ariaLabel ?? '');
  }

  if (options.icon === 'close' && options.variant === 'primary' && !isLoading) {
    control.classList.add('orlyata-button--with-icon');
  }

  if (isLoading) {
    control.classList.add('is-loading');
    control.setAttribute('aria-busy', 'true');
  }

  if (options.state !== undefined && options.state !== 'default' && options.state !== 'loading') {
    control.dataset.visualState = options.state;
  }

  if (control instanceof HTMLButtonElement) {
    control.type = 'button';
    control.disabled = isDisabled;
  } else if (isDisabled) {
    control.setAttribute('aria-disabled', 'true');
    control.tabIndex = -1;
  } else {
    control.href = options.href ?? '#';
  }

  if (!isIconOnly) {
    const label = document.createElement('span');
    label.className = 'orlyata-button__label';
    label.textContent = isLoading ? 'Отправка…' : (options.label ?? 'Кнопка');
    control.append(label);
  }

  const iconName = options.variant === 'play'
    ? 'button-play.svg'
    : options.variant.startsWith('arrow-')
      ? 'button-arrow.svg'
      : options.icon === 'close' && !isLoading
        ? 'button-close.svg'
        : undefined;

  if (iconName !== undefined) {
    const icon = document.createElement('img');
    icon.className = `orlyata-button__icon orlyata-button__icon--${options.variant}`;
    icon.src = `${iconRoot}/${iconName}`;
    icon.alt = '';
    icon.setAttribute('aria-hidden', 'true');
    control.append(icon);
  }

  return control;
}

function createComponentPage(title: string, description: string): HTMLElement {
  const main = document.createElement('main');
  const header = document.createElement('header');
  const heading = document.createElement('h1');
  const note = document.createElement('p');

  main.className = 'component-page';
  header.className = 'component-header';
  heading.className = 'type-heading-1';
  heading.textContent = title;
  note.className = 'type-body';
  note.textContent = description;
  header.append(heading, note);
  main.append(header);

  return main;
}

function appendSection(page: HTMLElement, title: string, controls: HTMLElement[]): void {
  const section = document.createElement('section');
  const heading = document.createElement('h2');
  const row = document.createElement('div');

  section.className = 'component-section';
  heading.className = 'type-heading-3';
  heading.textContent = title;
  row.className = 'component-row';
  row.append(...controls);
  section.append(heading, row);
  page.append(section);
}

function stateSpecimen(name: string, options: ButtonOptions): HTMLElement {
  const specimen = document.createElement('div');
  const label = document.createElement('span');

  specimen.className = 'component-state';
  label.className = 'type-caption';
  label.textContent = name;
  specimen.append(label, createButton(options));

  return specimen;
}

const meta = {
  title: 'Components/Button',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface ButtonPlaygroundArgs {
  ariaLabel: string;
  asLink: boolean;
  label: string;
  state: VisualState;
  variant: ButtonVariant;
  withClose: boolean;
}

export const Playground: StoryObj<ButtonPlaygroundArgs> = {
  args: {
    ariaLabel: 'Воспроизвести',
    asLink: false,
    label: 'Кнопка',
    state: 'default',
    variant: 'primary',
    withClose: true,
  },
  argTypes: {
    ariaLabel: { control: 'text', description: 'Доступное имя icon-only вариантов.' },
    asLink: { control: 'boolean', description: 'Рендерить текстовый вариант как ссылку.' },
    label: { control: 'text', description: 'Видимый текст кнопки.' },
    state: { control: 'select', options: ['default', 'hover', 'active', 'disabled', 'loading'] },
    variant: { control: 'select', options: ['primary', 'secondary', 'play', 'arrow-left', 'arrow-right'] },
    withClose: { control: 'boolean', description: 'Добавить Figma close-иконку в Primary.' },
  },
  render: (args) => {
    const page = createComponentPage('Button Playground', 'Проверяйте варианты, состояния и семантику через Controls.');
    const isTextVariant = args.variant === 'primary' || args.variant === 'secondary';
    const options: ButtonOptions = {
      ariaLabel: args.ariaLabel,
      label: args.label,
      state: args.state,
      variant: args.variant,
    };
    if (args.asLink && isTextVariant) {
      options.href = '#destination';
    }
    if (args.withClose) {
      options.icon = 'close';
    }
    appendSection(page, 'Preview', [createButton(options)]);
    return page;
  },
};

export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const page = createComponentPage('Button', 'Production-компонент по Figma 4651:1140. Наведите курсор или перейдите Tab, чтобы проверить реальные состояния.');

    appendSection(page, 'Текстовые', [
      createButton({ icon: 'close', label: 'Кнопка', variant: 'primary' }),
      createButton({ label: 'Кнопка', variant: 'primary' }),
      createButton({ label: 'Кнопка', variant: 'secondary' }),
      createButton({ href: '#destination', label: 'Подробнее', variant: 'secondary' }),
    ]);
    appendSection(page, 'Иконки', [
      createButton({ ariaLabel: 'Воспроизвести', variant: 'play' }),
      createButton({ ariaLabel: 'Предыдущий материал', variant: 'arrow-left' }),
      createButton({ ariaLabel: 'Следующий материал', variant: 'arrow-right' }),
    ]);

    return page;
  },
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const page = createComponentPage('Состояния Button', 'Default и hover сверены с Figma. Active, disabled и loading — проектные дополнения; реальный keyboard focus проверяется интерактивно.');

    appendSection(page, 'Primary', [
      stateSpecimen('Default', { icon: 'close', label: 'Кнопка', state: 'default', variant: 'primary' }),
      stateSpecimen('Hover', { icon: 'close', label: 'Кнопка', state: 'hover', variant: 'primary' }),
      stateSpecimen('Active', { icon: 'close', label: 'Кнопка', state: 'active', variant: 'primary' }),
      stateSpecimen('Disabled', { icon: 'close', label: 'Кнопка', state: 'disabled', variant: 'primary' }),
      stateSpecimen('Loading', { icon: 'close', label: 'Кнопка', state: 'loading', variant: 'primary' }),
    ]);
    appendSection(page, 'Secondary', [
      stateSpecimen('Default', { label: 'Кнопка', state: 'default', variant: 'secondary' }),
      stateSpecimen('Hover', { label: 'Кнопка', state: 'hover', variant: 'secondary' }),
    ]);
    appendSection(page, 'Play', [
      stateSpecimen('Default', { ariaLabel: 'Воспроизвести', state: 'default', variant: 'play' }),
      stateSpecimen('Hover', { ariaLabel: 'Воспроизвести', state: 'hover', variant: 'play' }),
    ]);
    appendSection(page, 'Arrow', [
      stateSpecimen('Default · влево', { ariaLabel: 'Предыдущий материал', state: 'default', variant: 'arrow-left' }),
      stateSpecimen('Default · вправо', { ariaLabel: 'Следующий материал', state: 'default', variant: 'arrow-right' }),
      stateSpecimen('Hover · влево', { ariaLabel: 'Предыдущий материал', state: 'hover', variant: 'arrow-left' }),
      stateSpecimen('Hover · вправо', { ariaLabel: 'Следующий материал', state: 'hover', variant: 'arrow-right' }),
    ]);

    return page;
  },
};
