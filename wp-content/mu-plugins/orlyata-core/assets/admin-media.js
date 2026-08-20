"use strict";
(() => {
    'use strict';
    const getOption = (select, id) => Array.from(select.options).find((option) => option.value === String(id));
    const addOption = (select, id, label) => {
        const existing = getOption(select, id);
        if (existing) {
            existing.textContent = label;
            return existing;
        }
        const option = document.createElement('option');
        option.value = String(id);
        option.textContent = label;
        select.append(option);
        return option;
    };
    const syncAlbumCover = (photoSelect) => {
        const coverSelect = Array.from(document.querySelectorAll('[data-orlyata-cover-for]')).find((select) => select.dataset.orlyataCoverFor === photoSelect.id);
        if (!coverSelect) {
            return;
        }
        const previousValue = coverSelect.value;
        const placeholder = coverSelect.options[0];
        if (!placeholder) {
            return;
        }
        coverSelect.replaceChildren(placeholder);
        Array.from(photoSelect.selectedOptions)
            .filter((option) => option.value !== '0')
            .forEach((option) => {
            addOption(coverSelect, option.value, option.textContent || '');
        });
        coverSelect.value = getOption(coverSelect, previousValue) ? previousValue : '0';
    };
    document.addEventListener('click', (event) => {
        const trigger = event.target instanceof Element ? event.target.closest('.orlyata-core-media-upload') : null;
        const mediaLibrary = window.wp?.media;
        if (!trigger || !mediaLibrary) {
            return;
        }
        const target = document.getElementById(trigger.dataset.orlyataMediaTarget || '');
        if (!(target instanceof HTMLSelectElement)) {
            return;
        }
        const multiple = trigger.dataset.orlyataMediaMultiple === 'true';
        const frame = mediaLibrary({
            title: trigger.dataset.orlyataMediaTitle || '',
            button: {
                text: trigger.dataset.orlyataMediaButton || '',
            },
            library: {
                type: trigger.dataset.orlyataMediaType || '',
            },
            multiple,
        });
        frame.on('select', () => {
            const selectedMedia = frame.state().get('selection').toJSON();
            if (!multiple) {
                Array.from(target.options).forEach((option) => {
                    option.selected = false;
                });
            }
            selectedMedia.forEach((media) => {
                const label = media.title || media.filename || 'File #' + String(media.id);
                addOption(target, media.id, label + ' (#' + String(media.id) + ')').selected = true;
            });
            const placeholder = target.options[0];
            if (multiple && placeholder) {
                placeholder.selected = false;
            }
            syncAlbumCover(target);
            target.dispatchEvent(new Event('change', { bubbles: true }));
        });
        frame.open();
    });
})();
