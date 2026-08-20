# Хоровая капелла мальчиков «Орлята»

Новый корпоративный сайт капеллы — редизайн и замена существующего сайта [zelorlyata.ru](https://zelorlyata.ru). Проект находится на стадии подготовки к разработке: десктопные макеты и базовые компоненты собраны в Figma, архитектурные и продуктовые правила зафиксированы в документации.

## Документы проекта

- [`AGENTS.md`](AGENTS.md) — обязательные правила работы с репозиторием.
- [`docs/plan.md`](docs/plan.md) — зафиксированная последовательность реализации и критерии перехода между этапами.
- [`docs/project.md`](docs/project.md) — продукт, аудитории, страницы и контентная модель.
- [`docs/architecture.md`](docs/architecture.md) — выбранный стек, границы темы и CMS, инфраструктура и поставка.
- [`docs/design-system/manifest.json`](docs/design-system/manifest.json) — машиночитаемый контракт дизайн-системы.
- [`docs/design-system/design-system.md`](docs/design-system/design-system.md) — визуальные и адаптивные правила.
- [`docs/design-system/component-map.md`](docs/design-system/component-map.md) — соответствие компонентов Figma и будущего кода.
- [`docs/design-system/tokens.css`](docs/design-system/tokens.css) — подтверждённые десктопные токены из Figma.

## Workspace staging

Разработка выполняется на текущем workspace-сервере `89.125.120.78` в воспроизводимом Docker-окружении. Node.js, PHP и Composer на хост устанавливать не требуется.

1. Создайте `.env` и замените значения `change-this-*`:

   ```sh
   ./scripts/init-env.sh
   ```

2. Запустите полный QA и production build:

   ```sh
   ./scripts/check.sh
   ```

3. Установите WordPress и поднимите staging:

   ```sh
   ./scripts/setup-staging.sh
   ```

Доступные адреса:

- сайт — `https://89.125.120.78/`;
- WordPress — `https://89.125.120.78/wp-admin/`;
- Storybook — `https://89.125.120.78/storybook-20260814/`;
- Mailpit — `https://89.125.120.78/mailpit/`.

Сайт и Storybook доступны без HTTP Basic Auth. Nginx отдаёт на всех ответах `X-Robots-Tag: noindex, nofollow, noarchive`, а в WordPress отключена видимость для поисковых систем (`blog_public=0`). `/robots.txt` разрешает обход, чтобы роботы могли получить эти правила `noindex`. Mailpit остаётся закрыт Basic Auth с учётными данными `STAGING_AUTH_USER` и `STAGING_AUTH_PASSWORD` из локального `.env`, поскольку в нём могут быть письма с персональными данными. Администратор WordPress использует отдельные `WP_ADMIN_USER` и `WP_ADMIN_PASSWORD`.

Nginx публикует только `80/443`; WordPress, Mailpit и Vite остаются на loopback или во внутренней Docker-сети. Доверенный IP-сертификат Let's Encrypt действует около шести дней, Certbot проверяет продление каждые 12 часов, а Nginx регулярно перечитывает обновлённый сертификат.

Остановить окружение без удаления данных:

```sh
docker compose --profile staging down
```

## Разработка frontend

```sh
docker compose --profile tools run --rm --service-ports node npm run dev -- --host 0.0.0.0
```

Исходники находятся в `wp-content/themes/orlyata/assets/src`, production build — в `wp-content/themes/orlyata/assets/dist`. Каталог `dist` создаётся сборкой и не коммитится.

F37 Ginger Cyrillic подключён как локальный системный шрифт. Для self-hosted подключения положите `f37-ginger-cyrillic-vf.woff2` в `wp-content/themes/orlyata/assets/fonts`; тема и Storybook подключат его автоматически.

## Storybook

Storybook использует тот же production entrypoint темы, поэтому компоненты и foundations не имеют отдельной копии CSS или TypeScript. Локальный режим:

```sh
docker compose --profile tools run --rm --service-ports node npm run storybook
```

Статическая сборка для staging:

```sh
docker compose --profile tools run --rm node npm run build:storybook
```

В toolbar доступны только обязательные проектные ширины: `2560`, `1920`, `1280`, `1279`, `768`, `767` и `320 px`.

На staging Storybook опубликован в отдельной versioned-области `/storybook-20260814/` с `Cache-Control: no-store`; старый `/storybook/` перенаправляется на неё. Это исключает устаревший browser storage и кэш `index.json` после публикации новых stories.

## Проверки

Полная проверка устанавливает зависимости из lock-файлов, запускает TypeScript strict, ESLint, Stylelint, WPCS, PHPStan и production build:

```sh
./scripts/check.sh
```

Отдельные команды:

```sh
docker compose --profile tools run --rm node npm run typecheck
docker compose --profile tools run --rm node npm run lint:ts
docker compose --profile tools run --rm node npm run lint:css
docker compose --profile tools run --rm node npm run build
docker compose --profile tools run --rm node npm run build:storybook
docker compose --profile tools run --rm visual npm run test:storybook
docker compose --profile tools run --rm qa composer lint:php
docker compose --profile tools run --rm qa composer analyse:php
```

## Структура реализации

- `wp-content/themes/orlyata` — только представление сайта.
- `wp-content/mu-plugins/orlyata-core.php` и `orlyata-core/` — данные и бизнес-правила.
- `compose.yaml` — WordPress 7.0.2/PHP 8.3, MySQL 8.0.46, Mailpit, Nginx и Certbot.
- `docker/proxy` — HTTPS, noindex, Basic Auth для Mailpit и reverse proxy staging-сервера.
- `docker/qa` — воспроизводимое PHP 8.3/Composer-окружение проверок.

## Текущий статус

Этапы 1, 2 и 4 завершены. Этап 3 содержит библиотеку desktop-компонентов и Storybook; далее собираются desktop-страницы на реальных CMS-данных (этап 5), после чего начнётся адаптивный проход (этап 6).
