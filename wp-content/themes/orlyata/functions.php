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
			wp_enqueue_script_module(
				'orlyata',
				get_theme_file_uri( 'assets/dist/' . $entry['file'] ),
				array(),
				ORLYATA_THEME_VERSION,
				array(
					'in_footer' => true,
				)
			);
		}

		break;
	}
}
add_action( 'wp_enqueue_scripts', 'orlyata_enqueue_assets' );

/**
 * Checks whether the current request is the isolated TT Turns preview.
 *
 * @return bool
 */
function orlyata_is_tt_turns_preview(): bool {
	$request_uri = '';

	if ( isset( $_SERVER['REQUEST_URI'] ) && is_string( $_SERVER['REQUEST_URI'] ) ) {
		$request_uri = sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) );
	}

	$request_path = wp_parse_url( $request_uri, PHP_URL_PATH );

	return is_string( $request_path ) && in_array(
		trailingslashit( $request_path ),
		array( '/tt-turns-preview/', '/tt-turns-antialiased-preview/', '/tt-turns-antialiased-about-preview/' ),
		true
	);
}

/**
 * Checks whether the current request is the antialiased TT Turns variant.
 *
 * @return bool
 */
function orlyata_is_tt_turns_antialiased_preview(): bool {
	$request_uri = '';

	if ( isset( $_SERVER['REQUEST_URI'] ) && is_string( $_SERVER['REQUEST_URI'] ) ) {
		$request_uri = sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) );
	}

	$request_path = wp_parse_url( $request_uri, PHP_URL_PATH );

	return is_string( $request_path ) && in_array(
		trailingslashit( $request_path ),
		array( '/tt-turns-antialiased-preview/', '/tt-turns-antialiased-about-preview/' ),
		true
	);
}

/**
 * Checks whether the current request is the TT Turns About preview.
 *
 * @return bool
 */
function orlyata_is_tt_turns_antialiased_about_preview(): bool {
	$request_uri = '';

	if ( isset( $_SERVER['REQUEST_URI'] ) && is_string( $_SERVER['REQUEST_URI'] ) ) {
		$request_uri = sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) );
	}

	$request_path = wp_parse_url( $request_uri, PHP_URL_PATH );

	return is_string( $request_path ) && '/tt-turns-antialiased-about-preview/' === trailingslashit( $request_path );
}

/**
 * Checks whether the current request is the antialiased Ginger variant.
 *
 * @return bool
 */
function orlyata_is_ginger_antialiased_preview(): bool {
	$request_uri = '';

	if ( isset( $_SERVER['REQUEST_URI'] ) && is_string( $_SERVER['REQUEST_URI'] ) ) {
		$request_uri = sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) );
	}

	$request_path = wp_parse_url( $request_uri, PHP_URL_PATH );

	return is_string( $request_path ) && '/ginger-antialiased-preview/' === trailingslashit( $request_path );
}

/**
 * Adds the isolated preview stylesheet after the normal theme bundle.
 *
 * @return void
 */
function orlyata_enqueue_tt_turns_preview_assets(): void {
	if ( ! orlyata_is_tt_turns_preview() ) {
		return;
	}

	wp_enqueue_style(
		'orlyata-tt-turns-preview',
		get_theme_file_uri( 'assets/experiments/tt-turns-preview.css' ),
		array(),
		ORLYATA_THEME_VERSION
	);
}
add_action( 'wp_enqueue_scripts', 'orlyata_enqueue_tt_turns_preview_assets', 20 );

/**
 * Adds the isolated Ginger smoothing experiment after the normal theme bundle.
 *
 * @return void
 */
function orlyata_enqueue_ginger_antialiased_preview_assets(): void {
	if ( ! orlyata_is_ginger_antialiased_preview() ) {
		return;
	}

	wp_enqueue_style(
		'orlyata-ginger-antialiased-preview',
		get_theme_file_uri( 'assets/experiments/ginger-antialiased-preview.css' ),
		array(),
		ORLYATA_THEME_VERSION
	);
}
add_action( 'wp_enqueue_scripts', 'orlyata_enqueue_ginger_antialiased_preview_assets', 20 );

/**
 * Marks the preview document so its typography overrides cannot affect routes.
 *
 * @param string[] $classes Existing body classes.
 * @return string[]
 */
function orlyata_tt_turns_preview_body_class( array $classes ): array {
	if ( orlyata_is_tt_turns_preview() ) {
		$classes[] = 'orlyata-tt-turns-preview';
	}

	if ( orlyata_is_tt_turns_antialiased_preview() ) {
		$classes[] = 'orlyata-tt-turns-preview--antialiased';
	}

	if ( orlyata_is_ginger_antialiased_preview() ) {
		$classes[] = 'orlyata-ginger-antialiased-preview';
	}

	return $classes;
}
add_filter( 'body_class', 'orlyata_tt_turns_preview_body_class' );

/**
 * Serves the typography experiment as an isolated preview route.
 *
 * The route intentionally reuses the current home markup, but leaves the
 * front-page template and all shared design-system styles untouched.
 *
 * @return void
 */
function orlyata_render_tt_turns_preview(): void {
	if ( ! orlyata_is_tt_turns_preview() && ! orlyata_is_ginger_antialiased_preview() ) {
		return;
	}

	global $wp_query;

	if ( $wp_query instanceof WP_Query ) {
		$wp_query->is_404  = false;
		$wp_query->is_home = true;
	}

	status_header( 200 );
	nocache_headers();
	if ( orlyata_is_tt_turns_antialiased_about_preview() ) {
		require get_theme_file_path( 'page-o-kapelle.php' );
	} else {
		require get_theme_file_path( 'front-page.php' );
	}

	exit;
}
add_action( 'template_redirect', 'orlyata_render_tt_turns_preview', 0 );
