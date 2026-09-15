# Журнал внедрения desktop fluid scale главной

Источник требований: [desktop-fluid-scaling-audit.md](desktop-fluid-scaling-audit.md).

Диапазон реализации: desktop `1280–2560 px`. Tablet и mobile не входят в текущую миграцию.

## Срез 1. Page-level Storybook и исполнимый тестовый контракт

Статус: завершён; RED-контракт зафиксирован, CSS намеренно не изменён.

Цель: зафиксировать новое ожидаемое поведение до изменения CSS и воспроизвести нарушения текущей реализации.

В scope:

- детерминированная story `Pages/Home / Desktop Preview`, собранная на production-классах;
- переиспользование Storybook-renderers существующих компонентов;
- token/component проверки шкалы `66.6667/100/133.3333%`;
- page-level проверки главной на `1280`, `1440`, `1600`, `1920`, `2240`, `2560 px`;
- проверки component-owned ratios, относительного масштаба внутренних зон и отсутствия горизонтального overflow.

Не входит в срез:

- изменение `tokens.css`;
- изменение `home.css` и component CSS;
- обновление visual baselines;
- tablet/mobile;
- staging deploy.

Затронутые файлы:

- `stories/pages/home.stories.ts`;
- `stories/components/sidebar.stories.ts`;
- `stories/components/footer.stories.ts`;
- `stories/components/application-form.stories.ts`;
- `tests/storybook/fluid-scale.spec.ts`;
- `tests/storybook/home-fluid-scale.spec.ts`.

## Результаты проверок

### RED

Команда:

```bash
docker compose --profile tools run --rm visual npx playwright test tests/storybook/fluid-scale.spec.ts tests/storybook/home-fluid-scale.spec.ts --reporter=line
```

Результат до expected-failure markers: `1 passed`, `7 failed`.

Подтверждённые расхождения:

- базовая desktop-шкала даёт `0.75` вместо `0.6667` на `1280 px`;
- NewsCard на главной имеет ratio `0.9685` вместо `365/312 ≈ 1.1699`;
- History на `1280 px` имеет ratio `2.4522` против reference `2.8985` на `1920 px`;
- отдельно падают shell/radius, component typography, полная геометрия карточек и ApplicationForm.

### Checkpoint

Семь контрактных проверок временно помечены `test.fail(...)` с единым пояснением. Они продолжают исполняться как expected failures и должны потерять marker после соответствующего CSS-среза.

Повторный focused Playwright: `8 passed` с учётом семи expected failures. Структурный тест `HomeDesktopPreview` проходит как обычный обязательный тест и подтверждает состав страницы и отсутствие горизонтального overflow на `1920 px`.

Focused ESLint по затронутым stories/specs проходит. Статический Storybook успешно собран командой `docker compose --profile tools run --rm node npm run build:storybook`; story `Pages/Home / Desktop Preview` присутствует в production build. Review выявил и устранил лишнюю регистрацию renderer-функций как stories: для них добавлен `excludeStories`, а проверка собранного `index.json` подтверждает отсутствие четырёх служебных exports в витрине.

Общий `npm run typecheck` запускается, но остаётся красным из-за двух существовавших до среза ошибок вне новых файлов:

- `tests/storybook/content.spec.ts:144`;
- `tests/storybook/home-teacher-cta-motion.spec.ts:118`.

Новые story и specs дополнительных TypeScript-ошибок не добавили.

## Срез 2. Desktop-токены и shell

Статус: завершён; общая desktop-шкала переведена на утверждённый коэффициент, component/page geometry намеренно оставлена следующему срезу.

Цель: синхронизировать глобальную геометрию desktop-композиции, сохранить значения макета на `1920 px`, cap на `2560 px` и не изменить режим `1279 px` и ниже.

В scope:

- desktop typography и letter-spacing;
- общие spacing, radii и focus-ring geometry;
- Sidebar;
- Footer shell-токены;
- editorial max-width, minimum gutter `24px` и section rhythm;
- минимальная высота интерактивных контролов `48px`;
- исполнимая проверка границы desktop/tablet на `1279px`.

Не входит в срез:

- размеры, ratios и внутренние bespoke-токены Advantage, NewsCard, MediaCard и ApplicationForm;
- page-level overrides и геометрия секций главной;
- обновление visual baselines;
- staging deploy и проверка опубликованного staging.

Затронутые исходные файлы:

- `docs/design-system/tokens.css`;
- `tests/storybook/fluid-scale.spec.ts`;
- `docs/desktop-fluid-scaling-implementation-log.md`.

### Реализация

В `tokens.css` добавлен изолированный desktop-слой `@media (width >= 1280px)`. Значения `1920px` сохранены как reference, а границы и средняя часть каждого token clamp соответствуют `2/3 → 1 → 4/3`. Базовые declarations не изменены и продолжают обслуживать tablet/mobile.

Явные исключения реализованы отдельно:

- `--layout-content-gutter`: минимум `1.5rem / 24px`;
- `--button-height`, `--badge-height`, `--input-height`: минимум `3rem / 48px`;
- line-height, цвета, opacity и full-radius не затронуты.

После GREEN сняты три временных `test.fail` marker:

- display typography и cap;
- shell/radii/gutter/hit-target;
- типографика Button, NewsCard и MediaCard.

Marker полной геометрии компонентов и три page-level markers остаются активными до следующего среза.

### Результаты проверок

Focused Playwright:

```bash
docker compose --profile tools run --rm visual npx playwright test tests/storybook/fluid-scale.spec.ts tests/storybook/home-fluid-scale.spec.ts --reporter=line
```

Результат: `9 passed`, включая четыре ожидаемых failure-контракта следующего среза. Обычными GREEN-проверками подтверждены anchors `1280/1920/2560`, cap после `2560`, единая component typography и неизменность representative values на `1279px`. Структурная Home story не имеет горизонтального overflow на `1920px`; промежуточная page-матрица продолжает исполняться как expected failure до миграции component/page geometry.

Дополнительно успешно выполнены:

- `npm run lint:css`;
- focused ESLint для `tests/storybook/fluid-scale.spec.ts`;
- `npm run build`;
- `npm run build:storybook`.

Storybook build завершился с существующим предупреждением Vite о chunks больше `500 kB`; сборка успешна.

Общий `npm run typecheck` по-прежнему красный только из-за двух ранее зафиксированных ошибок вне файлов среза:

- `tests/storybook/content.spec.ts:144`;
- `tests/storybook/home-teacher-cta-motion.spec.ts:118`.

Новых TypeScript-ошибок срез не добавил.

Инструментальная заметка: штатный `apply_patch` в этой среде недоступен из-за `bwrap: loopback: Failed RTM_NEWADDR`. Изменения внесены точечными exact replacements с обязательной проверкой единственного совпадения; focused diff и тесты проверены после записи.

## Срез 3. Компоненты и desktop-композиция главной

Статус: реализация завершена локально; staging и visual baselines не изменялись.

Цель: перевести component-owned geometry и секции главной на единый коэффициент `S = clamp(2/3, viewport / 1920, 4/3)`, сохранив утверждённые reference-значения на `1920 px` и отдельные tablet/mobile-режимы.

В scope:

- внутренние desktop-токены Button, Badge, Input, ApplicationForm и DataTable;
- размеры и постоянные ratios Advantage, NewsCard и MediaCard;
- устранение desktop page-level overrides размеров и ratios компонентов;
- пропорции History `1617/568`, Application surface `1617/620` и Footer `1616/469`;
- синхронизация Storybook-проверок с reference viewport `1920 px`;
- обязательные проверки anchors `1280/1920/2560`, промежуточных ширин и границы `1279 px`.

Затронутые исходные файлы:

- `docs/design-system/manifest.json`;
- `docs/design-system/tokens.css`;
- `docs/design-system/design-system.md`;
- `docs/desktop-fluid-scaling-audit.md`;
- `wp-content/themes/orlyata/assets/src/styles/components/media-card.css`;
- `wp-content/themes/orlyata/assets/src/styles/components/footer.css`;
- `wp-content/themes/orlyata/assets/src/styles/pages/home.css`;
- профильные specs в `tests/storybook/`.

### Реализация

Все оставшиеся expected-failure markers сняты после GREEN. Страница теперь задаёт компонентам только ширину и место в сетке; desktop ratios принадлежат самим компонентам. Старые значения Home сохранены внутри `@media (width <= 1279px)`, поэтому срез не подменяет утверждённые tablet/mobile-режимы.

Для Footer отдельно зафиксирована минимальная baseline-коррекция на `1280 px`: она компенсирует остановку уменьшения читаемого body-текста и становится нулевой на `1920 px` и выше.

### Результаты проверок

Focused component/Home Playwright после снятия markers: `10 passed`. Проверены anchors `1280/1920/2560`, промежуточные `1440/1600/2240`, cap после `2560`, граница `1279`, постоянные ratios и отсутствие horizontal overflow. CSS lint и focused ESLint проходят. Production build и статический Storybook собраны успешно.

Срез 3 завершён до начала записи visual baselines; staging на этом срезе отдельно не изменялся.

## Срез 4. Visual baselines и опубликованный staging

Статус: desktop-часть завершена 26 августа 2026 года; опубликованные Storybook и WordPress-главная проверены.

В scope:

- новые page-level Home baselines на `1280`, `1920` и `2560 px`;
- обновление затронутых component/foundation baselines только на desktop anchors `1280` и `2560 px`;
- осознанный просмотр Home screenshots и contact sheets компонентов до принятия snapshots;
- повторный visual-regression прогон без режима записи;
- production и Storybook build;
- browser smoke опубликованных Storybook Home и WordPress-главной на `1280`, `1440`, `1600`, `1920`, `2240`, `2560 px`;
- проверка реального scroll-reveal нижних секций на staging.

### Результаты

- Home visual baselines: `3 passed` после повторного запуска без `--update-snapshots`.
- Полная desktop visual-матрица затронутых foundations/components/Home: `36 passed` после повторного запуска без записи.
- Fluid component/Home geometry: `10 passed`.
- CSS lint и focused ESLint затронутых specs: успешно.
- `npm run build:stage`: production assets и статический Storybook собраны; остаётся штатное предупреждение Vite о chunks больше `500 kB`.
- Staging Storybook и WordPress-главная: `200` на всех шести desktop-ширинах, horizontal overflow `0`; на момент среза 4 NewsCard ratio держался около `1.1699` (значение заменено последующей точечной корректировкой ниже), History около `2.9725`, Application около `2.6081`, Footer около `3.4457`.
- Staging boundary/reflow smoke на `1279`, `960`, `768`, `767`, `320 px`: status `200`, overflow `0`, первый Tab попадает на ссылку с видимым solid outline; `960 px` использован как reflow-эквивалент 200% zoom для исходного desktop viewport.
- После последовательного scroll smoke opacity Media, History, Application и Achievements равна `1`; нижние секции не остаются скрытыми.

### Остаточный долг вне desktop-среза

Полный suite до точечного обновления baselines дал `151 passed / 87 failed`: основная масса — старые tablet/mobile visual snapshots, которые намеренно не принимались в desktop-задаче. Отдельный rerun подтвердил axe формы, interactive success-flow и Accordion; две CTA motion-проверки синхронизированы с явным reference viewport `1920 px`. Старая проверка entry-sequence всё ещё ожидает animation на контейнере title, тогда как production и актуальные motion tokens применяют её к вложенному title text; этот motion-контракт не изменялся в fluid-scale задаче.

Общий `typecheck` остаётся красным на двух ранее зафиксированных nullable-ошибках:

- `tests/storybook/content.spec.ts:145`;
- `tests/storybook/home-teacher-cta-motion.spec.ts:120`.

Общий ESLint дополнительно сообщает три существующие ошибки вне файлов desktop fluid-реализации: unused `_header` в story, unnecessary optional chain в validation helper и Unicode spread в `main.ts`; focused ESLint затронутых specs проходит.

## Точечная корректировка NewsCard перед пунктом 5

Статус: завершена 26 августа 2026 года; пункт 5 ещё не начинался.

По уточнению пользователя desktop-reference NewsCard изменён с `365×312 px` на `365×270 px`, то есть `22.8125rem × 16.875rem` и owned ratio `365/270`. В `tokens.css` desktop-высота реализована как `clamp(11.25rem, 14.0625vw, 22.5rem)`: `180 px` на `1280`, `270 px` на `1920`, `360 px` на `2560`. Tablet/mobile base-токены не менялись.

Первый RED изолированного компонента и главной получил фактическую высоту `312 px` вместо `270 px`. После смены desktop-токена изолированный Storybook стал GREEN. Дополнительная staging-проверка выявила, что Home-grid растягивал карточку до `369.5×273.33 px` через `repeat(2, 1fr)`. Второй RED зафиксировал ширину `369.5 px` вместо `365 px`. Корневая причина устранена на уровне размещения: desktop Home-grid теперь выделяет каждой карточке ровно `--news-card-width`, сохраняет `Space 4` между карточками и центрирует двухкарточный ряд; ratio и внутренняя геометрия остаются в компоненте.

Проверки после исправления:

- точный reference на `1920 px`: Storybook и WordPress-главная после завершения hero-анимации — `364.98×269.98 px`;
- anchors `1280/1920/2560`: приблизительно `243.33×179.98`, `364.98×269.98`, `486.66×359.98 px`; smoke `1440/1600/2240` монотонный, ratio около `1.35185`, horizontal overflow `0`;
- fluid component/Home Playwright: `13 passed`; NewsCard accessibility и hover: `3 passed`;
- CSS lint и focused ESLint: успешно;
- Home и изолированные NewsCard visual baselines на `1280/1920/2560` обновлены после просмотра; повторный visual-прогон входит в профильные `13 passed`;
- `npm run build:stage`: production assets и статический Storybook собраны успешно; staging Storybook и WordPress-главная отвечают `200`.

## Следующий срез

Отдельно решить tablet/mobile visual-baseline долг и устаревший Home entry-sequence тест, не смешивая их с завершённым desktop fluid-scale контрактом.


## Срез 5.2.1. «О капелле»: desktop fluid-scale для «Жизни капеллы» и «Педагогов»

Статус: завершён локально; tablet/mobile и staging deploy не входят в этот срез.

В `AboutDesktopPreview` зафиксированы reference-геометрии 1920 px: две колонки «Жизни капеллы» `803×600 px` с ratio `803/600`; карточка педагога `257×340 px` с ratio `257/340`, портрет `160 px` и отступ до имени `71 px`. В `tokens.css` добавлены owned About-токены: портрет и его отступ используют общий desktop `S`; в `about.css` fixed desktop heights заменены выводом высоты из утверждённых ratios. Это не меняет отдельные tablet/mobile rules.

Проверки: manifest JSON валиден; CSS lint и focused ESLint проходят; `tests/storybook/about.spec.ts` проходит на anchors `1280/1920/2560` и smoke `1440/1600/2240`, подтверждая ratios и масштабирование portrait, portrait gap, heading gap и grid gap; production build проходит.


## Срез 5.2.2. Детальная новость: редакционная колонка и галерея

Статус: desktop-preview проверен на staging 28 августа 2026 года.

Для Figma `4566:3587` добавлены page-owned tokens детальной новости: центрированная editorial-колонка `800 px` на reference `1920 px`, отступ от Hero `64 px`, gallery ratio `3 / 2` (`800×533.333 px`), внешний inset стрелок `24 px` и отступ категории `64 px`. Все размеры используют один desktop S через documented `clamp()`; Gallery не получает независимую width/height curve.

Chromium staging smoke на `1280`, `1440`, `1600`, `1920`, `2240`, `2560 px` подтвердил ширины колонки соответственно около `533.33`, `600`, `666.66`, `800`, `933.33`, `1066.66 px`, отсутствие horizontal overflow и ratio gallery около `1.5000`. Проверены server-rendered анонс Heading 3, Body после галереи, Badge категории, три dot-кнопки и переключение следующего слайда.


## Срез 5.2.3. Архивы фото и видео: desktop preview

Статус: desktop-preview проверен на staging 28 августа 2026 года.

Для `/mediagalereya/foto/` и `/mediagalereya/video/` включены versioned CPT archive rewrite-маршруты. Обе страницы используют общий Sidebar, default PageHero и Footer. Заголовки Hero — «Фото» и «Видео». Сразу после Hero находится titleless DataTable: отступ использует уже утверждённый `--media-gallery-hero-content-gap`, то есть 64 px на reference 1920 px и единый desktop S без нового page token. В каждом archive preview 30 server-rendered строк, полученные циклическим повторением десяти утверждённых fixtures; фото использует DataTable `photo`, а видео — `video` с gray/color SVG provider-иконками.

Chromium staging smoke на 1280, 1440, 1600, 1920, 2240 и 2560 px подтвердил для обеих страниц status 200, 30 строк, Footer и отсутствие horizontal overflow. Отступ Hero→таблица масштабируется монотонно: около 42.66, 47.98, 53.33, 63.98, 74.66 и 85.33 px соответственно; погрешность до 0.02 px вызвана subpixel layout.


## Срез 5.2.4. Детальная страница педагога: Чернецов Андрей Викторович

Статус: desktop-preview опубликован и проверен на staging 31 августа 2026 года.

Для desktop-preview зафиксирован вариант `PageHero teacher-detail`: он повторяет детальную новость по Hero `580px` на reference `1920px`, верхнему inset `24px` и внешним углам full-bleed shell. Внутри Hero стрелка `arrow-left` возвращает к «О капелле», inverse Badge «Заслуженный работник культуры РФ» расположен сверху справа. Нижний левый контейнер с должностью имеет ширину `440px`; Display H1 начинается через `24px`, но не наследует ограничение ширины описания. Размеры следуют одному desktop S через `--teacher-detail-hero-content-width` и `--teacher-detail-hero-description-title-gap`; Footer остаётся общим компонентом без page overrides.

Канонический URL педагога — `/o-kapelle/{slug}/`; у `teacher` нет archive, поэтому `/pedagogi/` возвращает `404`. После versioned flush rewrite rules Chromium staging smoke подтвердил `/o-kapelle/andrey-chernetsov/` и `/o-kapelle/` со статусом `200`, высоту Hero `580 px` на `1920 px`, 15 строк достижений и отсутствие horizontal overflow.

Следующий блок — цитата Чернецова из утверждённого контентного источника. Он начинается через `96 px` на reference `1920 px` от таблицы (`--teacher-detail-achievements-quote-gap`). Блок ограничен сверху и снизу hairline `color-border-subtle`, а расстояние от каждой линии до Lead-текста — `24 px` (`--space-5`). Lead занимает колонки 3–4 editorial grid; круглый `vict.png` из intro-блока «О капелле» использует существующий `--home-history-teacher-size`, выровнен по левому краю колонки 1 и по нижнему краю текста. Цитата разделена на два семантических абзаца после фразы «Музыка прекрасно воспитывает душу.»; расстояние между ними — `24 px` (`--space-5`).

После цитаты добавлена локальная галерея из 26 фотографий с исходной страницы педагога. Через `--teacher-detail-quote-gallery-gap` она повторяет PhotoAlbum tile layout: первая плитка каждого ряда занимает две колонки и имеет ratio `800×620 px` на reference `1920 px`, четыре последующие заполняют оставшиеся две колонки; направления больших плиток чередуются по рядам. Серверные ссылки ведут на локальные JPG originals, а локальные cropped PNG previews загружаются в плитках; существующий `data-photo-album-gallery` подключает PhotoSwipe без отдельного JavaScript. Chromium staging smoke на `1280/1440/1600/1920/2240/2560 px` подтвердил 26 плиток, gap `64/72/80/96/112/128 px`, large geometry `527.34×408.69/596.25×462.09/665.17×515.50/800×620/933.33×723.33/1066.66×826.66 px`, нулевой horizontal overflow и PhotoSwipe counter `1 / 26`.
