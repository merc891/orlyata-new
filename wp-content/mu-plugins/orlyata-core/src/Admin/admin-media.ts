interface WordPressMediaItem {
	id: number;
	title?: string;
	filename?: string;
}

interface WordPressMediaFrame {
	on( event: 'select', callback: () => void ): void;
	state(): {
		get( name: 'selection' ): {
			toJSON(): WordPressMediaItem[];
		};
	};
	open(): void;
}

interface WordPressMediaOptions {
	title: string;
	button: {
		text: string;
	};
	library: {
		type: string;
	};
	multiple: boolean;
}
interface WordPressWindow extends Window {
	wp?: {
		media: ( options: WordPressMediaOptions ) => WordPressMediaFrame;
	};
}

( () => {
	'use strict';

	const getOption = ( select: HTMLSelectElement, id: string | number ): HTMLOptionElement | undefined =>
		Array.from( select.options ).find( ( option ) => option.value === String( id ) );

	const addOption = ( select: HTMLSelectElement, id: string | number, label: string ): HTMLOptionElement => {
		const existing = getOption( select, id );

		if ( existing ) {
			existing.textContent = label;
			return existing;
		}

		const option = document.createElement( 'option' );
		option.value = String( id );
		option.textContent = label;
		select.append( option );

		return option;
	};

	const syncAlbumCover = ( photoSelect: HTMLSelectElement ): void => {
		const coverSelect = Array.from( document.querySelectorAll<HTMLSelectElement>( '[data-orlyata-cover-for]' ) ).find(
			( select ) => select.dataset.orlyataCoverFor === photoSelect.id,
		);

		if ( ! coverSelect ) {
			return;
		}

		const previousValue = coverSelect.value;
		const placeholder = coverSelect.options[ 0 ];

		if ( ! placeholder ) {
			return;
		}

		coverSelect.replaceChildren( placeholder );

		Array.from( photoSelect.selectedOptions )
			.filter( ( option ) => option.value !== '0' )
			.forEach( ( option ) => {
				addOption( coverSelect, option.value, option.textContent || '' );
			} );

		coverSelect.value = getOption( coverSelect, previousValue ) ? previousValue : '0';
	};

	document.addEventListener( 'click', ( event ) => {
		const trigger = event.target instanceof Element ? event.target.closest<HTMLButtonElement>( '.orlyata-core-media-upload' ) : null;

		const mediaLibrary = ( window as WordPressWindow ).wp?.media;
		if ( ! trigger || ! mediaLibrary ) {
			return;
		}

		const target = document.getElementById( trigger.dataset.orlyataMediaTarget || '' );

		if ( ! ( target instanceof HTMLSelectElement ) ) {
			return;
		}

		const multiple = trigger.dataset.orlyataMediaMultiple === 'true';
		const frame = mediaLibrary( {
			title: trigger.dataset.orlyataMediaTitle || '',
			button: {
				text: trigger.dataset.orlyataMediaButton || '',
			},
			library: {
				type: trigger.dataset.orlyataMediaType || '',
			},
			multiple,
		} );

		frame.on( 'select', () => {
			const selectedMedia = frame.state().get( 'selection' ).toJSON();

			if ( ! multiple ) {
				Array.from( target.options ).forEach( ( option ) => {
					option.selected = false;
				} );
			}

			selectedMedia.forEach( ( media ) => {
				const label = media.title || media.filename || 'File #' + String( media.id );
				addOption( target, media.id, label + ' (#' + String( media.id ) + ')' ).selected = true;
			} );

			const placeholder = target.options[ 0 ];

			if ( multiple && placeholder ) {
				placeholder.selected = false;
			}

			syncAlbumCover( target );
			target.dispatchEvent( new Event( 'change', { bubbles: true } ) );
		} );

		frame.open();
	} );
} )();
