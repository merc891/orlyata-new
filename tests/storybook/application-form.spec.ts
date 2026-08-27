import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

import { expectGingerLoaded, viewports } from './visual';

async function openApplicationForm(
  page: import('@playwright/test').Page,
  story = 'components-application-form--default',
): Promise<void> {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/iframe.html?id=' + story + '&viewMode=story');
  await expect(page.locator('.orlyata-application-form').first()).toBeVisible({ timeout: 15_000 });
  await expectGingerLoaded(page);
}

for (const story of [
  'components-application-form--default',
  'components-application-form--submitting',
  'components-application-form--success',
  'components-application-form--errors',
]) {
  test(story + ' has no automatic accessibility violations', async ({ page }) => {
    await openApplicationForm(page, story);

    const results = await new AxeBuilder({ page })
      .disableRules(['landmark-one-main', 'page-has-heading-one'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

test('ApplicationForm default matches the approved Figma geometry', async ({ page }) => {
  await openApplicationForm(page);

  const form = page.locator('.orlyata-application-form');
  const fields = form.locator('.orlyata-application-form__fields');
  const controls = form.locator('.orlyata-input__control');
  const submit = form.locator('.orlyata-application-form__submit');
  const privacy = form.locator('.orlyata-application-form__privacy');
  const [formBox, fieldsBox, submitBox, privacyBox] = await Promise.all([
    form.boundingBox(),
    fields.boundingBox(),
    submit.boundingBox(),
    privacy.boundingBox(),
  ]);

  expect(formBox).toMatchObject({ x: 32, y: 32, width: 500, height: 536 });
  expect(fieldsBox).toMatchObject({ x: 64, y: 64, width: 436, height: 304 });
  expect(submitBox).toMatchObject({ x: 64, y: 392, width: 436, height: 64 });
  expect(privacyBox).toMatchObject({ x: 64, y: 480, width: 436, height: 56 });
  await expect(controls).toHaveCount(4);
  for (const control of await controls.all()) {
    expect((await control.boundingBox())?.height).toBe(64);
  }
  await expect(form).toHaveCSS('border-radius', '24px');
});

test('ApplicationForm keeps native field and submit semantics', async ({ page }) => {
  await openApplicationForm(page);

  const form = page.getByRole('form', { name: 'Форма записи в капеллу' });
  const parent = page.getByRole('textbox', { name: 'ФИО родителя' });
  const child = page.getByRole('textbox', { name: 'ФИО ребёнка' });
  const birth = page.getByLabel('Дата рождения');
  const phone = page.getByRole('textbox', { name: 'Телефон' });

  await expect(form).toHaveAttribute('method', 'post');
  await expect(form).toHaveAttribute('novalidate', '');
  await expect(parent).toHaveAttribute('name', 'parent_name');
  await expect(parent).toHaveAttribute('autocomplete', 'name');
  await expect(child).toHaveAttribute('name', 'child_name');
  await expect(birth).toHaveAttribute('type', 'text');
  await expect(birth).toHaveAttribute('inputmode', 'numeric');
  await expect(birth).toHaveAttribute('data-input-mask', 'date');
  await expect(birth).toHaveAttribute('autocomplete', 'bday');
  await expect(birth).toHaveAttribute('maxlength', '10');
  await expect(birth).toHaveAttribute('name', 'child_birth_date');
  await expect(phone).toHaveAttribute('type', 'tel');
  await expect(phone).toHaveAttribute('inputmode', 'tel');
  await expect(phone).toHaveAttribute('data-input-mask', 'phone');
  await expect(phone).toHaveAttribute('maxlength', '18');
  await expect(phone).toHaveAttribute('autocomplete', 'tel');
  for (const field of [parent, child, birth, phone]) {
    await expect(field).toHaveAttribute('required', '');
  }
  await expect(page.getByRole('button', { name: 'Отправить заявку' })).toHaveAttribute('type', 'submit');
  const privacy = page.getByRole('link', { name: 'политикой конфиденциальности' });
  await expect(privacy).toHaveAttribute(
    'href',
    '/politika-konfidencialnosti/',
  );
  expect(await privacy.locator('..').evaluate(
    (element) => element.firstChild?.textContent,
  )).toBe(
    'Нажимая на кнопку, вы соглашаетесь с\u00A0',
  );
});

test('ApplicationForm suppresses browser validation bubbles in favour of Input errors', async ({ page }) => {
  await openApplicationForm(page);

  const form = page.getByRole('form', { name: 'Форма записи в капеллу' });
  const parent = page.getByRole('textbox', { name: 'ФИО родителя' });
  const child = page.getByRole('textbox', { name: 'ФИО ребёнка' });
  const birth = page.getByLabel('Дата рождения');
  const phone = page.getByRole('textbox', { name: 'Телефон' });
  const submit = page.getByRole('button', { name: 'Отправить заявку' });

  await form.evaluate((element) => {
    let invalidEvents = 0;
    element.dataset.invalidEvents = String(invalidEvents);
    element.addEventListener('invalid', () => {
      element.dataset.invalidEvents = String(++invalidEvents);
    }, true);
  });
  await parent.fill('');
  await child.fill('');
  await birth.fill('');
  await phone.fill('');
  await phone.blur();
  await phone.focus();
  await expect(phone).toHaveValue('+7 (');
  await submit.click();

  await expect(form).toHaveAttribute('novalidate', '');
  await expect.poll(() => form.getAttribute('data-invalid-events')).toBe('0');
  await expect(form.locator('.orlyata-application-form__error')).toHaveCount(0);
  const errors = form.locator('.orlyata-input__error');
  await expect(errors).toHaveCount(4);
  await expect(errors).toHaveText([
    'Введите ФИО родителя',
    'Введите ФИО ребёнка',
    'Введите дату рождения',
    'Введите номер телефона',
  ]);
  await expect(birth).toHaveAttribute('aria-invalid', 'true');
  await expect(birth.locator('..').locator('..')).toHaveClass(/has-error/);

  await birth.fill('1');

  await expect(form.locator('.orlyata-input__error')).toHaveCount(3);
  await expect(birth).not.toHaveAttribute('aria-invalid');
  await expect(birth.locator('..').locator('..')).not.toHaveClass(/has-error/);
});

test('ApplicationForm masks dates and telephone input', async ({ page }) => {
  await openApplicationForm(page);

  const birth = page.getByLabel('Дата рождения');
  const phone = page.getByRole('textbox', { name: 'Телефон' });
  const dateMask = birth.locator('..').locator('.orlyata-input__mask');
  const phoneMask = phone.locator('..').locator('.orlyata-input__mask');

  await expect(birth).toHaveValue('16.02.2021');
  await birth.fill('');
  await birth.focus();
  await expect(dateMask).toBeVisible();
  await expect(dateMask).toHaveText('ДД.ММ.ГГГГ');
  await expect(dateMask).toHaveCSS('color', 'rgb(111, 111, 120)');
  const [dateMaskBox, birthBox] = await Promise.all([dateMask.boundingBox(), birth.boundingBox()]);
  expect(dateMaskBox?.y).toBeCloseTo(birthBox?.y ?? 0, 1);
  await birth.fill('12');
  await expect(birth).toHaveValue('12.');
  await expect(dateMask).toBeHidden();
  await phone.fill('');
  await phone.blur();
  await phone.focus();
  await expect(phone).toHaveValue('+7 (');
  await expect(phoneMask).toBeHidden();
  await phone.fill('9');
  await expect(phone).toHaveValue('+7 (9');
  await expect(phoneMask).toBeHidden();
  await birth.fill('32132030');
  await birth.blur();
  const max = await birth.getAttribute('data-date-max');
  expect(max).not.toBeNull();
  const formattedMax = (max ?? '').slice(8, 10) + '.' + (max ?? '').slice(5, 7) + '.' + (max ?? '').slice(0, 4);
  await expect(birth).toHaveValue(formattedMax);
  await birth.fill('31022020');
  await birth.blur();
  await expect(birth).toHaveValue('29.02.2020');
  await phone.fill('8abc926232112799');
  await expect(phone).toHaveValue('+7 (926) 232-11-27');
  await phone.press('KeyA');
  await expect(phone).toHaveValue('+7 (926) 232-11-27');
});

test('Submitting preserves values and blocks repeat submission', async ({ page }) => {
  await openApplicationForm(page, 'components-application-form--submitting');

  const form = page.getByRole('form', { name: 'Форма записи в капеллу' });
  const submit = page.getByRole('button', { name: 'Отправляем заявку' });
  await expect(form).toHaveAttribute('aria-busy', 'true');
  await expect(page.getByRole('textbox', { name: 'ФИО родителя' })).toHaveValue('Семёнова Мария Павловна');
  await expect(page.getByRole('textbox', { name: 'Телефон' })).toHaveValue('+7 (926) 232-11-27');
  await expect(submit).toBeDisabled();
  await expect(submit).toHaveCSS('background-color', 'rgb(199, 199, 204)');
  await expect(submit).toHaveCSS('opacity', '1');
  const dots = submit.locator('.orlyata-button__loading-dot');
  await expect(dots).toHaveCount(3);
  await expect(dots.nth(0)).toHaveCSS('animation-name', 'orlyata-button-loading-dot-pulse');
  await expect(dots.nth(1)).toHaveCSS('animation-name', 'orlyata-button-loading-dot-pulse');
  await expect(dots.nth(2)).toHaveCSS('animation-name', 'orlyata-button-loading-dot-pulse');
  await expect(dots.nth(0)).toHaveCSS('animation-duration', '1.35s');
  await expect(dots.nth(1)).toHaveCSS('animation-delay', '0.15s');
  await expect(dots.nth(2)).toHaveCSS('animation-delay', '0.283333s');
  await expect(dots.nth(0)).toHaveCSS('animation-timing-function', 'cubic-bezier(0.333, 0, 0.667, 1)');
  await expect(dots.nth(0)).toHaveCSS('width', '5px');
  await expect(dots.nth(0)).toHaveCSS('height', '5px');
  await expect(dots.nth(0)).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(dots.nth(0)).toHaveCSS('opacity', '1');
  await expect(submit.locator('.orlyata-button__loading-dots')).toHaveCSS('gap', '6.66667px');
  const [dotsBox, labelBox] = await Promise.all([
    submit.locator('.orlyata-button__loading-dots').boundingBox(), submit.locator('.orlyata-button__label').boundingBox(),
  ]);
  expect(Math.abs((dotsBox?.y ?? 0) + (dotsBox?.height ?? 0) / 2 - ((labelBox?.y ?? 0) + (labelBox?.height ?? 0) / 2))).toBeLessThanOrEqual(1);
});

test('Recoverable errors preserve values and expose linked messages', async ({ page }) => {
  await openApplicationForm(page, 'components-application-form--errors');

  const form = page.locator('.orlyata-application-form--validation-error');
  const phone = form.getByRole('textbox', { name: 'Телефон' });
  const fieldError = form.getByText('Введите номер телефона');

  await expect(phone).toHaveValue('+7 (926) 232-11-27');
  await expect(phone).toHaveAttribute('aria-invalid', 'true');
  await expect(phone).toHaveAttribute('aria-describedby', await fieldError.getAttribute('id') ?? '');
  await expect(form).not.toHaveAttribute('aria-describedby');
  await expect(page.locator('.orlyata-application-form--network-error').getByRole('alert')).toContainText(
    'интернет-соединение',
  );
  await expect(page.locator('.orlyata-application-form--server-error').getByRole('alert')).toContainText(
    'временно недоступен',
  );
});

test('Success matches Figma geometry and provides a continuation link', async ({ page }) => {
  await openApplicationForm(page, 'components-application-form--success');

  const root = page.getByRole('status');
  const content = root.locator('.orlyata-application-form__success-content');
  const icon = root.locator('.orlyata-application-form__success-icon');
  const action = root.getByRole('link', { name: 'Хорошо' });
  await expect(root).toHaveCSS('animation-name', 'orlyata-application-form-success-reveal');
  await expect(root).toHaveCSS('animation-duration', '0.4s');
  await root.evaluate(async (element) => {
    await Promise.all(element.getAnimations({ subtree: true }).map((animation) => animation.finished));
  });
  const [rootBox, contentBox, iconBox, actionBox] = await Promise.all([
    root.boundingBox(),
    content.boundingBox(),
    icon.boundingBox(),
    action.boundingBox(),
  ]);

  expect(rootBox?.x).toBeCloseTo(32, 2);
  expect(rootBox?.y).toBeCloseTo(32, 2);
  expect(rootBox?.width).toBeCloseTo(500, 2);
  expect(rootBox?.height).toBeCloseTo(456, 2);
  expect(contentBox).toMatchObject({ x: 64, y: 68, width: 436, height: 224 });
  expect(iconBox).toMatchObject({ width: 96, height: 96 });
  expect(actionBox).toMatchObject({ x: 64, y: 388, width: 436, height: 64 });
  await expect(root.getByRole('heading', { name: 'Заявка принята!' })).toBeVisible();
  await expect(action).toHaveAttribute('href', '#application-preview');
  await expect(action).toHaveCSS('border-radius', '9999px');
});

test('ApplicationForm exposes keyboard focus on controls and privacy link', async ({ page }) => {
  await openApplicationForm(page);

  const parent = page.getByRole('textbox', { name: 'ФИО родителя' });
  const submit = page.getByRole('button', { name: 'Отправить заявку' });
  const privacy = page.getByRole('link', { name: 'политикой конфиденциальности' });

  await parent.focus();
  await expect(parent.locator('..')).toHaveCSS('border-color', 'rgb(33, 166, 66)');
  await submit.focus();
  await expect(submit).toHaveCSS('outline-color', 'rgb(33, 166, 66)');
  await privacy.focus();
  await expect(privacy).toHaveCSS('outline-color', 'rgb(33, 166, 66)');
});

test("ApplicationForm Interactive demo runs the local validation, submitting and success flow", async ({ page }) => {
  await openApplicationForm(page, "components-application-form--interactive");

  await page.getByRole("textbox", { name: "ФИО родителя" }).fill("Семёнова Мария");
  await page.getByRole("textbox", { name: "ФИО ребёнка" }).fill("Семёнов Эдуард");
  await page.getByLabel("Дата рождения").fill("16022021");
  await page.getByRole("textbox", { name: "Телефон" }).fill("9262321127");
  const submittingStartedAt = Date.now();
  await page.getByRole("button", { name: "Отправить заявку" }).click();

  await expect(page.getByRole("form", { name: "Форма записи в капеллу" })).toHaveAttribute("aria-busy", "true");
  await expect(page.getByRole("button", { name: "Отправляем заявку" })).toBeDisabled();
  await page.waitForTimeout(2_700);
  await expect(page.getByRole("status")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Заявка принята!" })).toBeVisible();
  expect(Date.now() - submittingStartedAt).toBeGreaterThanOrEqual(3_000);
});

test('ApplicationForm Playground responds to Controls args', async ({ page }) => {
  await page.goto(
    '/iframe.html?id=components-application-form--playground&viewMode=story&args=state:success;variant:about',
  );
  await expect(page.locator('.orlyata-application-form--about.orlyata-application-form--success')).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByRole('heading', { name: 'Заявка принята!' })).toBeVisible();
});

for (const viewport of viewports) {
  test('ApplicationForm visual ' + viewport.name, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/iframe.html?id=components-application-form--default&viewMode=story');
    await expect(page.locator('.orlyata-application-form')).toBeVisible({ timeout: 15_000 });
    await expectGingerLoaded(page);
    const horizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    const overflowDiagnostics = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('*')]
        .map((element) => ({
          className: element.className,
          clientWidth: element.clientWidth,
          right: element.getBoundingClientRect().right,
          scrollWidth: element.scrollWidth,
          tagName: element.tagName,
        }))
        .filter((item) => item.scrollWidth > item.clientWidth || item.right > document.documentElement.clientWidth + 0.5),
    );
    expect(horizontalOverflow, JSON.stringify(overflowDiagnostics)).toBe(false);
    await expect(page).toHaveScreenshot('components-application-form--default-' + viewport.name + '.png', {
      fullPage: true,
    });
  });
}
