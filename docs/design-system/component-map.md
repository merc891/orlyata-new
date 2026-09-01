# Карта компонентов

Пути ниже — целевая архитектура темы. Для реализованных компонентов путь указывает на существующий production-файл; для остальных — на будущего владельца.

| Figma | Будущий компонент | Варианты/состояния из Figma | Обязательные дополнения |
| --- | --- | --- | --- |
| `Button` `4651:1140` | `template-parts/components/button.php` — реализован | primary/secondary, play, arrows, gallery arrows (Neutral 50 → Neutral 150 hover); default/hover/active/disabled/loading в витрине, реальный keyboard focus-visible; Primary opacity и Secondary/Arrow surface hover за 200ms | отдельная tablet/mobile настройка — этап 6 |
| `Badge` `4651:1187` | `badge.php` — реализован | default, inverse поверх изображения | категории публикаций, selected filter, focus при интерактивности |
| `Link` `4651:1238` | `text-link.php` — реализован | roll, color, color-inverse; default/hover/active; `has_chevron` appends decorative Lucide `chevron-right` from Morphicons, 24×24 px with `space.1` (4 px) gap, 1px downward alignment and left-to-right glyph roll on hover/focus | focus-visible, visited policy |
| `Card news` `4651:1252` | `news-card.php` — реализован | default/hover; при pointer hover карточка вырастает на 20 px вверх за 400 ms по `cubic-bezier(0.46, 0, 0, 1)`, иконка и заголовок поднимаются, а нижний Badge с датой остаётся на месте; заголовок прокручивается вертикально, как в MediaCard; desktop сохраняет aspect-ratio карточки и масштабирует её внутренности | category icon, focus-within, long title, missing content |
| `Advantage` `4651:1331` | `advantage.php` — реализован | stat, reference 1920 px: 388×170 и padding 24/24/16/24; desktop сохраняет aspect-ratio карточки и масштабирует её внутренности | длинные значения, responsive composition |
| `Input` `4651:1477` | `input.php` — реализован | default/typing/filled/error; 64 px, padding 16×2, stacked text без gap, label transition 400ms, ошибки без конечной точки, focus одной brand-границей; date template for focused empty input; empty telephone starts with +7 ( and then formats the entered number without an underlay | disabled, autocomplete, success |
| `SearchInput` | `template-parts/components/search-input.php` — реализован | default/typing/focus-visible/loading; 64 px desktop control, 16 px inline padding, `radius-medium` (16 px reference) in every field state, vertically centred body text and one 1 px brand border during focus/typing; на «Нотах» input запускает 1000 ms loading через 120 px reference от фильтров с тремя переиспользованными Button-точками color-neutral-200, затем показывает результаты или empty-state | empty/error copy follows the separate notes search state contract |
| `Table_row` + `Table_header` | `data-table.php` — реализован | achievements; teacher-achievements (Year repeats in every row, spans columns 1–2 and aligns with the first line of Achievement; Achievement begins at 3 and spans 3–4); news/photo/video: Name spans desktop editorial columns 1–2, Date starts at 3, Type and right-aligned accessible arrow link occupy 4; cursor pointer; hover/focus-within turns all row content secondary and rolls the arrow left-to-right; video replaces the arrow with a centered 32px provider SVG icon (YouTube, RuTube or VK): gray by default and colored on row hover/focus; 1px нижняя граница каждой data-строки. На «Нотах» строки, вновь показанные выбором фильтра, получают page-owned opacity 0→1 за 800 ms | семантические таблицы, mobile mapping, empty state, pagination |
| `Accordeon` `4666:741` | `accordion.php` — реализован | closed/opened; одна открытая строка; раскрытие измеряемой panel-обёртки — 400ms `cubic-bezier(0, 0, 0.06, 1)`, декоративный Plus/Minus 2 px morph через `morphicons/dom` | tablet/mobile refinement |
| `Card` `4651:1333` | `media-card.php` — реализован | big/small по 540 px, first Badge is date; second is provider only for video; inverse Badge у big; static image; content/Play above gradient; Figma Play at 24/24 Big and 24/16 Small; desktop сохраняет aspect-ratio и масштабирует внутренние отступы | photo/video, missing image, focus, responsive ratios |
| PageHero | `page-hero.php` — реализован | default; archive (default geometry and Display H1 plus the existing top `arrow-left` link to «Медиагалерея» on Photo and Video); news-detail (580px at 1920px, Heading 1, back Button, inverse metadata, supplied 48px share controls with shared 200ms opacity hover/active; copy glyph Copy→Check after a successful copy); teacher-detail (580px, top `arrow-left`, inverse Badge at the mirrored top inset, Body description 440px wide and Display H1 after 24px without inheriting that width; a supplied 1.5x foreground portrait is centered over the news-detail background at full Hero height); optional corner-meta is Body inverse; «Ноты» размещают visible file count at 24 px right/24 px bottom on 1920 and reveal a changed value with opacity 0→1 over 400 ms easing-out; title-reveal; owns `radius-large` by default, while full-bleed page shells may override only outer corners; title reveals once from opacity 0 and `translateY(1.25rem)` over 400 ms with `easing-home-reveal` | tablet/mobile refinement |
| 404 page empty state | `404.php` — desktop preview | Sidebar + Footer and existing `notes-search-empty.svg`; server-rendered H1/copy; page-owned 400ms opacity/translateY enter identical to the Notes empty state | tablet/mobile composition — stage 6 |
| Teacher card | `teacher-card.php` — реализован | page-owned About card; at 1920 px: `257×340`, portrait `160×160`; only the explicitly supplied local portrait is rendered, without placeholder/fallback imagery; hover on the full card rolls both text lines with the shared link-roll motion and scales only the portrait to 110% inside its fixed clipping frame with the MediaCard hover timing | real portrait, long name, desktop ratios, hover roll |
| Form containers `4527:7798`, `4527:7830`, `4527:8773` | `sections/application-form.php` — реализован | home/about; default/submitting/success/validation-error/network-error/server-error; 500×536 px и success 500×456 px; desktop масштабирует целиком форму, включая padding, поля, gaps и фон секции; `novalidate`, submit показывает ошибки только через Input; Interactive Storybook demo локально воспроизводит валидацию → submitting → success | endpoint, nonce/idempotency, anti-spam, юридическое решение по отдельному consent-control, mobile — этапы 6 и 7 |
| `Sidebar` `4641:3718` | `layout/sidebar.php` — реализован | reference 1920 px: 250 px; tablet header with logo and two-line burger 768–1279 px; default/hover/focus-visible/active/current-page; semantic primary navigation and admission CTA | mobile menu |
| `Footer` `4641:3638` | `layout/footer.php` — реализован | reference 1920 px: 1616×469 px; tablet 768–1279 px: natural-height two-column flow; default/hover/focus-visible/active; navigation, dynamic contacts, privacy link | mobile |

## Desktop fluid-scale contract

В диапазоне `1280–2560 px` страница и повторяемые компоненты используют единый коэффициент `S`: `66.6667%` на `1280 px`, `100%` на `1920 px`, `133.3333%` на `2560 px`. Страница распределяет ширину и позицию компонента; ratio, типографика, padding, gaps, радиусы, изображения и прочая внутренняя геометрия принадлежат компоненту и масштабируются тем же `S`.

| Компонент | Геометрический контракт desktop |
|---|---|
| NewsCard | Референс `365×270 px` (`22.8125rem × 16.875rem`) на `1920 px`; сохраняет owned ratio `365/270` во всех desktop-композициях, page-level `aspect-ratio: auto` и независимая высота запрещены; desktop-сетка главной выделяет каждой карточке ровно `--news-card-width` и центрирует двухкарточный ряд |
| Advantage | Референс `388×170` на `1920 px`; оболочка и внутренности используют один `S` |
| MediaCard Big / Small | Референсы `797×540` и `390×540`; новый page-specific ratio сначала оформляется как явный вариант компонента |
| ApplicationForm | Поверхность, поля, gaps, action и success-состояние масштабируются согласованно; родитель не задаёт отдельную кривую высоты |
| DataTable | Типографика, padding и minimum row height масштабируются согласованно либо строка получает natural height |
| Sidebar / Footer | Shell использует ту же шкалу, что editorial canvas; фиксированные offsets не создают отдельную геометрию |

Для page-секций «О капелле» desktop-контракт также обязателен: «Жизнь капеллы» использует `803×600 px` на колонку и ratio `803/600`, «Педагоги» — page-owned TeacherCard `257×340 px` с ratio `257/340`; фотография `160 px` и отступ до имени `71 px` следуют общему `S`. TeacherCard содержит только переданный локальный портрет и не выводит заглушку. Эти секции остаются page-owned и не становятся универсальным page-level паттерном.

Обязательные page-level baselines: `1280`, `1920`, `2560 px`; smoke: `1440`, `1600`, `2240 px`. Тесты проверяют ratio и связанную геометрию на реальной странице, а не только в изолированной story.

## Композиционные секции

Секции принадлежат страницам, но собираются из общих компонентов. Footer и Sidebar — единые site-wide компоненты. Их геометрия, данные и states принадлежат компонентам: страницы не создают wrapper-классы или CSS-селекторы для их использования, не переопределяют Footer (ширину, aspect ratio, padding, центрирование, порядок контента или контакты) и не создают page-specific варианты. Разрешены только документированные элементы BEM и утверждённые модификаторы самого компонента; для Sidebar меняются лишь реальные ссылки и состояние текущего маршрута (`aria-current="page"`). Внешний отступ Footer принадлежит компоненту и применяется один раз вне page-grid: `120px` на reference `1920px` с общей desktop-шкалой `S`.

- Hero;
- News preview/list;
- News category filters: page composition reuses Button primary/secondary as server-rendered links; at 1920 px the group begins 64 px below PageHero through `--news-filter-offset-block` and follows desktop S.
- News list: filters and the DataTable are one page-owned reveal block; on viewport entry it reuses the first MediaGallery block’s opacity-only reveal with unchanged delay, duration and easing, and stays visible without JavaScript. The table begins below filters by `--news-filter-table-gap` (32 px at 1920), reuses DataTable `news`, and its desktop four-column allocation matches the photo/video DataTable variant. The server and client share its row-category hidden state, so multi-select filters work after a reload and without one; rows newly shown by a filter fade from opacity 0 to 1 over 800 ms.
- Notes library: filters, the server-rendered search form and DataTable `notes` are one page-owned opacity-only reveal block with the first MediaGallery block’s unchanged delay, duration and easing; without JavaScript it is visible. At 1920 px the table begins 32 px after the filter row through shared `--news-filter-table-gap`, and its download arrow rolls vertically.
- Photo and video archives: filters and DataTable are one page-owned opacity-only reveal block with the first MediaGallery block’s unchanged delay, duration and easing; without JavaScript it is visible. Their shared server-rendered category filters use the News multiple-selection contract: categories are OR-matched, each selected category can be removed independently, and «Все» clears the selection. The comma-separated `category` URL preserves the no-JavaScript fallback and client-side History API; newly shown DataTable rows use the same 800 ms opacity reveal.
- Media preview;
- History;
- Choir groups;
- Teachers;
- Choir achievements;
- Application CTA;
- Score library/search;
- Photo gallery;
- Video embed;
- Contacts: page-owned desktop rows reuse Sidebar, default PageHero and Footer; labels, contact values and social icons are server-rendered and stay available without JavaScript. The rows form one page-owned opacity-only reveal block using the first MediaGallery block’s unchanged delay, duration and easing; without JavaScript they remain visible. The 1920 px reference layout uses the global four-column grid, `64px` Hero-to-content gap, 1px separators and a `96px` reference trailing gap from the final text line to its following separator; only approved `--contacts-*` tokens control their desktop scaling.

Не следует превращать любую секцию в универсальный компонент. Новый общий компонент оправдан повторяемой структурой, поведением и устойчивым API минимум в двух контекстах.

## Контентные соответствия

| UI | Источник CMS |
| --- | --- |
| NewsCard и список новостей | `news` + закрытая taxonomy категории |
| Иконка категории | централизованная карта `category → icon`, не поле каждой записи |
| Teacher card/detail | `teacher` |
| Таблица достижений | `choir_achievement` |
| Таблица нот | `score` + choir filter |
| Фото-карточка/детальная | `photo_album` |
| Видео-карточка/детальная | `video` |
| Footer/Contacts | `site_settings` |
| ApplicationForm | `application` через защищённый endpoint |

## Правило расширения

Если макет требует варианта, которого нет в таблице:

1. проверить, нельзя ли решить задачу композицией существующих вариантов;
2. добавить вариант и его состояния в `manifest.json`;
3. обновить этот файл и tokens при необходимости;
4. только затем менять PHP/CSS/TypeScript;
5. проверить вариант во всех трёх responsive-режимах.
