# F37 Ginger Cyrillic

Поместите webfont в этот каталог под именем `f37-ginger-cyrillic-vf.woff2`.

До появления файла foundation использует установленный в системе локальный
`F37 Ginger Cyrillic VF`. После добавления WOFF2 необходимо первым источником
в `assets/src/styles/fonts.css` указать:

```css
url("../../fonts/f37-ginger-cyrillic-vf.woff2") format("woff2-variations")
```

Файл шрифта не следует заменять похожим или генерировать из другого формата.

