const requiredFieldMessages: Record<string, string> = {
  child_birth_date: 'Введите дату рождения',
  child_name: 'Введите ФИО ребёнка',
  parent_name: 'Введите ФИО родителя',
  phone: 'Введите номер телефона',
};

const getFieldRoot = (field: HTMLInputElement): HTMLElement | null =>
  field.closest<HTMLElement>('.orlyata-input');

const clearClientFieldError = (field: HTMLInputElement): void => {
  if (field.dataset.applicationValidationError !== 'true') {
    return;
  }

  const root = getFieldRoot(field);
  const error = root?.querySelector<HTMLElement>('[data-application-client-error="true"]');

  delete field.dataset.applicationValidationError;
  error?.remove();

  if (root?.querySelector('.orlyata-input__error') === null) {
    root?.classList.remove('has-error');
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
  }
};

const showClientFieldError = (field: HTMLInputElement): void => {
  const root = getFieldRoot(field);

  if (root === null) {
    return;
  }

  let error = root.querySelector<HTMLElement>('.orlyata-input__error');

  if (error === null) {
    error = document.createElement('p');
    error.className = 'orlyata-input__error';
    error.id = field.id + '-error';
    error.dataset.applicationClientError = 'true';
    error.textContent = requiredFieldMessages[field.name] ?? 'Заполните поле';
    root.append(error);
    field.dataset.applicationValidationError = 'true';
  }

  root.classList.add('has-error');
  field.setAttribute('aria-invalid', 'true');
  field.setAttribute('aria-describedby', error.id);
};

const isEmptyRequiredField = (field: HTMLInputElement): boolean =>
  field.required && (
    field.value.trim() === ''
    || (field.dataset.inputMask === 'phone' && field.value === '+7 (')
  );

export const initializeApplicationFormValidation = (root: ParentNode = document): void => {
  const forms = root instanceof HTMLFormElement
    ? [root]
    : [...root.querySelectorAll<HTMLFormElement>('form.orlyata-application-form')];

  forms.forEach((form) => {
    if (form.dataset.applicationValidationInitialized === 'true') {
      return;
    }

    form.dataset.applicationValidationInitialized = 'true';
    form.addEventListener('submit', (event) => {
      const invalidFields = [...form.querySelectorAll<HTMLInputElement>('.orlyata-input__field')]
        .filter(isEmptyRequiredField);

      if (invalidFields.length === 0) {
        return;
      }

      event.preventDefault();
      invalidFields.forEach(showClientFieldError);
      invalidFields[0]?.focus();
    });
    form.addEventListener('input', (event) => {
      if (event.target instanceof HTMLInputElement) {
        clearClientFieldError(event.target);
      }
    });
  });
};
