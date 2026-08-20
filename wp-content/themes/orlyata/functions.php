<?php
/**
 * Theme bootstrap.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;

if ( ! defined( 'ORLYATA_THEME_VERSION' ) ) {
	define( 'ORLYATA_THEME_VERSION', '0.1.0' );
}

/**
 * Registers theme-level WordPress features.
 *
 * @return void
 */
function orlyata_setup(): void {
	load_theme_textdomain( 'orlyata', get_template_directory() . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support(
		'html5',
		array(
			'caption',
			'comment-form',
			'comment-list',
			'gallery',
			'navigation-widgets',
			'script',
			'search-form',
			'style',
		)
	);
}
add_action( 'after_setup_theme', 'orlyata_setup' );

/**
 * Loads compiled Vite assets from the production manifest.
 *
 * The development server is intentionally not coupled to WordPress. Storybook
 * and Vite consume the same source files during local component development.
 *
 * @return void
 */
function orlyata_enqueue_assets(): void {
	$manifest_path = get_theme_file_path( 'assets/dist/manifest.json' );

	if ( ! is_readable( $manifest_path ) ) {
		return;
	}

	// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- Reads a local build manifest, not a remote URL.
	$manifest_contents = file_get_contents( $manifest_path );

	if ( false === $manifest_contents ) {
		return;
	}

	$manifest = json_decode( $manifest_contents, true );

	if ( ! is_array( $manifest ) ) {
		return;
	}

	foreach ( $manifest as $entry ) {
		if ( ! is_array( $entry ) || empty( $entry['isEntry'] ) ) {
			continue;
		}

		if ( ! empty( $entry['css'] ) && is_array( $entry['css'] ) ) {
			foreach ( $entry['css'] as $index => $stylesheet ) {
				if ( ! is_string( $stylesheet ) ) {
					continue;
				}

				wp_enqueue_style(
					'orlyata-' . (string) $index,
					get_theme_file_uri( 'assets/dist/' . $stylesheet ),
					array(),
					ORLYATA_THEME_VERSION
				);
			}
		}

		if ( ! empty( $entry['file'] ) && is_string( $entry['file'] ) ) {
			wp_enqueue_script(
				'orlyata',
				get_theme_file_uri( 'assets/dist/' . $entry['file'] ),
				array(),
				ORLYATA_THEME_VERSION,
				true
			);
		}

		break;
	}
}
add_action( 'wp_enqueue_scripts', 'orlyata_enqueue_assets' );
