import type { Meta, StoryObj } from '@storybook/html-vite';

import { initializeApplicationFormValidation } from '../../wp-content/themes/orlyata/assets/src/application-form-validation';

import { input } from './content.stories';

export type ApplicationFormState =
  | 'default'
  | 'submitting'
  | 'success'
  | 'validation-error'
  | 'network-error'
  | 'server-error';
export type ApplicationFormVariant = 'home' | 'about';

export interface ApplicationFormArgs {
  birthDate: string;
  childName: string;
  fieldError: string;
  formError: string;
  parentName: string;
  phone: string;
  state: ApplicationFormState;
  variant: ApplicationFormVariant;
}

const assetRoot = '/wp-content/themes/orlyata/assets';
const sampleValues = {
  birthDate: '2021-02-16',
  childName: 'Семёнов Эдуард Алексеевич',
  parentName: 'Семёнова Мария Павловна',
  phone: '+7 (926) 232-11-27',
} as const;

function createPrimaryControl(labelText: string, className: string, loading = false): HTMLButtonElement {
  const button = document.createElement('button');
  const label = document.createElement('span');

  button.className = 'orlyata-button orlyata-button--primary ' + className;
  button.type = 'submit';
  label.className = 'orlyata-button__label';
  if (loading) {
    label.textContent = labelText.replace(/\s*(?:…|\.\.\.)\s*$/u, "");
    const dots = document.createElement('span');
    dots.className = 'orlyata-button__loading-dots';
    dots.setAttribute('aria-hidden', 'true');
    for (let index = 0; index < 3; index += 1) {
      const dot = document.createElement('span');
      dot.className = 'orlyata-button__loading-dot';
      dots.append(dot);
    }
    label.append(dots);
  } else {
    label.textContent = labelText;
  }
  button.append(label);

  if (loading) {
    button.classList.add('is-loading');
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
  }

  return button;
}

function createField(
  label: string,
  name: string,
  type: 'text' | 'tel' | 'date',
  value: string,
  identifier: string,
  error = '',
): HTMLDivElement {
  const field = input(label, error === '' ? (value === '' ? 'default' : 'filled') : 'error', identifier, value, error, type);
  const control = field.querySelector<HTMLInputElement>('.orlyata-input__field');

  if (control !== null) {
    control.name = name;
    control.required = true;
    if (name === 'parent_name') {
      control.autocomplete = 'name';
    }
    if (name === 'phone') {
      control.autocomplete = 'tel';
    }
    if (name === 'child_birth_date') {
      control.setAttribute('autocomplete', 'bday');
    }
  }

  return field;
}

function defaultFormError(state: ApplicationFormState): string {
  if (state === 'network-error') {
    return 'Не удалось отправить заявку. Проверьте интернет-соединение и попробуйте ещё раз';
  }
  if (state === 'server-error') {
    return 'Сервис временно недоступен. Попробуйте отправить заявку ещё раз';
  }
  return '';
}

export function createApplicationForm(args: ApplicationFormArgs, identifier = 'preview'): HTMLElement {
  const classes = [
    'orlyata-application-form',
    'orlyata-application-form--' + args.variant,
    'orlyata-application-form--' + args.state,
  ];

  if (args.state === 'success') {
    const root = document.createElement('div');
    const content = document.createElement('div');
    const icon = document.createElement('img');
    const title = document.createElement('h2');
    const copy = document.createElement('p');
    const action = document.createElement('a');
    const actionLabel = document.createElement('span');

    root.className = classes.join(' ');
    root.setAttribute('role', 'status');
    content.className = 'orlyata-application-form__success-content';
    icon.className = 'orlyata-application-form__success-icon';
    icon.src = assetRoot + '/icons/application-success.svg';
    icon.alt = '';
    icon.setAttribute('aria-hidden', 'true');
    title.className = 'orlyata-application-form__success-title';
    title.textContent = 'Заявка принята!';
    copy.className = 'orlyata-application-form__success-copy';
    copy.textContent = 'Нам нужно немного времени, чтобы её обработать и перезвонить вам';
    action.className =
      'orlyata-button orlyata-button--primary orlyata-application-form__success-action';
    action.href = '#application-preview';
    actionLabel.className = 'orlyata-button__label';
    actionLabel.textContent = 'Хорошо';
    action.append(actionLabel);
    content.append(icon, title, copy);
    root.append(content, action);
    return root;
  }

  const form = document.createElement('form');
  const fields = document.createElement('div');
  const formError = args.formError.trim() === '' ? defaultFormError(args.state) : args.formError.trim();
  const phoneError = args.state === 'validation-error'
    ? (args.fieldError.trim() === '' ? 'Введите номер телефона' : args.fieldError.trim())
    : '';

  form.className = classes.join(' ');
  form.id = 'storybook-application-' + identifier;
  form.method = 'post';
  form.action = '#';
  form.noValidate = true;
  const ariaLabel = identifier === 'validation'
    ? 'Форма записи в капеллу — ошибка проверки'
    : identifier === 'network'
      ? 'Форма записи в капеллу — ошибка сети'
      : identifier === 'server'
        ? 'Форма записи в капеллу — ошибка сервера'
        : 'Форма записи в капеллу';
  form.setAttribute('aria-label', ariaLabel);
  if (args.state === 'submitting') {
    form.setAttribute('aria-busy', 'true');
  }

  fields.className = 'orlyata-application-form__fields';
  fields.append(
    createField('ФИО родителя', 'parent_name', 'text', args.parentName, identifier + '-parent'),
    createField('ФИО ребёнка', 'child_name', 'text', args.childName, identifier + '-child'),
    createField('Дата рождения', 'child_birth_date', 'date', args.birthDate, identifier + '-birth'),
    createField('Телефон', 'phone', 'tel', args.phone, identifier + '-phone', phoneError),
  );
  form.append(fields);

  if (formError !== '') {
    const error = document.createElement('p');
    error.className = 'orlyata-application-form__error';
    error.id = form.id + '-form-error';
    error.setAttribute('role', 'alert');
    error.textContent = formError;
    form.setAttribute('aria-describedby', error.id);
    form.append(error);
  }

  const submitLabel = args.variant === 'about' ? 'Оставить заявку' : 'Отправить заявку';

  form.append(
    createPrimaryControl(
      args.state === 'submitting' ? 'Отправляем заявку …' : submitLabel,
      'orlyata-application-form__submit',
      args.state === 'submitting',
    ),
  );

  const privacy = document.createElement('p');
  const privacyLink = document.createElement('a');
  privacy.className = 'orlyata-application-form__privacy';
  privacy.append(document.createTextNode('Нажимая на кнопку, вы соглашаетесь с\u00A0'));
  privacyLink.href = '/politika-konfidencialnosti/';
  privacyLink.textContent = 'политикой конфиденциальности';
  privacy.append(privacyLink);
  form.append(privacy);
  initializeApplicationFormValidation(form);

  return form;
}

function createPreview(args: ApplicationFormArgs, identifier = 'preview'): HTMLElement {
  const preview = document.createElement('div');
  preview.className = 'application-form-story-preview';
  preview.append(createApplicationForm(args, identifier));
  return preview;
}

function createInteractivePreview(): HTMLElement {
  const preview = document.createElement("div");
  const initialArgs: ApplicationFormArgs = {
    birthDate: "",
    childName: "",
    fieldError: "",
    formError: "",
    parentName: "",
    phone: "",
    state: "default",
    variant: "home",
  };

  preview.className = "application-form-story-preview";

  const render = (formArgs: ApplicationFormArgs, state: ApplicationFormState): void => {
    const element = createApplicationForm({ ...formArgs, state }, "interactive");
    preview.replaceChildren(element);

    if (!(element instanceof HTMLFormElement)) {
      return;
    }

    element.addEventListener("submit", (event) => {
      if (event.defaultPrevented) {
        return;
      }

      event.preventDefault();
      const submittedArgs: ApplicationFormArgs = {
        ...formArgs,
        birthDate: element.querySelector<HTMLInputElement>("[name=child_birth_date]")?.value ?? "",
        childName: element.querySelector<HTMLInputElement>("[name=child_name]")?.value ?? "",
        parentName: element.querySelector<HTMLInputElement>("[name=parent_name]")?.value ?? "",
        phone: element.querySelector<HTMLInputElement>("[name=phone]")?.value ?? "",
        state: "default",
      };

      render(submittedArgs, "submitting");
      window.setTimeout(() => { render(submittedArgs, "success"); }, 3_000);
    });
  };

  render(initialArgs, "default");
  return preview;
}

const defaultArgs: ApplicationFormArgs = {
  ...sampleValues,
  fieldError: '',
  formError: '',
  state: 'default',
  variant: 'home',
};

const meta = {
  title: 'Components/Application Form',
  excludeStories: ['createApplicationForm'],
  parameters: {
    viewport: { defaultViewport: 'desktop1920' },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: StoryObj<ApplicationFormArgs> = {
  args: defaultArgs,
  argTypes: {
    birthDate: { control: 'text', description: 'Дата в формате ДД.ММ.ГГГГ; будущая и невозможная дата исправляется на blur.' },
    childName: { control: 'text', description: 'ФИО ребёнка; сохраняется при recoverable error.' },
    fieldError: { control: 'text', description: 'Ошибка телефона в validation-error.' },
    formError: { control: 'text', description: 'Необязательная общая ошибка вместо стандартной.' },
    parentName: { control: 'text', description: 'ФИО родителя; сохраняется при recoverable error.' },
    phone: { control: 'text', description: 'Контактный телефон.' },
    state: {
      control: 'select',
      options: ['default', 'submitting', 'success', 'validation-error', 'network-error', 'server-error'],
    },
    variant: {
      control: 'inline-radio',
      description: 'Контекст страницы; визуальная карточка едина.',
      options: ['home', 'about'],
    },
  },
  render: (args) => createPreview(args),
};

export const Interactive: Story = {
  name: "Interactive demo",
  parameters: { controls: { disable: true } },
  render: () => createInteractivePreview(),
};

export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => createPreview(defaultArgs, 'default'),
};

export const Submitting: Story = {
  parameters: { controls: { disable: true } },
  render: () => createPreview({ ...defaultArgs, state: 'submitting' }, 'submitting'),
};

export const Success: Story = {
  parameters: { controls: { disable: true } },
  render: () => createPreview({ ...defaultArgs, state: 'success' }, 'success'),
};

export const Errors: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const preview = document.createElement('div');
    preview.className = 'application-form-story-preview application-form-story-preview--states';
    preview.append(
      createApplicationForm(
        { ...defaultArgs, fieldError: 'Введите номер телефона', state: 'validation-error' },
        'validation',
      ),
      createApplicationForm({ ...defaultArgs, state: 'network-error' }, 'network'),
      createApplicationForm({ ...defaultArgs, state: 'server-error' }, 'server'),
    );
    return preview;
  },
};
