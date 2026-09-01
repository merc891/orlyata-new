<?php
/**
 * Project plugin bootstrap.
 *
 * Content types, roles and site settings live here so a theme switch can never
 * remove project data or editorial permissions.
 *
 * @package OrlyataCore
 */

defined( 'ABSPATH' ) || exit;

if ( ! defined( 'ORLYATA_CORE_VERSION' ) ) {
	define( 'ORLYATA_CORE_VERSION', '0.2.3' );
}

require_once __DIR__ . '/src/Roles/class-rolemanager.php';
require_once __DIR__ . '/src/Content/class-posttypes.php';
require_once __DIR__ . '/src/Content/class-media.php';
require_once __DIR__ . '/src/Content/class-metafields.php';
require_once __DIR__ . '/src/Content/class-queries.php';
require_once __DIR__ . '/src/Settings/class-sitesettings.php';

add_filter( 'wp_mail_from', 'orlyata_core_filter_local_mail_from' );
add_action( 'init', array( \OrlyataCore\Content\PostTypes::class, 'register' ), 5 );
add_action( 'init', array( \OrlyataCore\Content\MetaFields::class, 'register' ), 15 );
add_action( 'init', array( \OrlyataCore\Roles\RoleManager::class, 'sync' ), 20 );
add_action( 'init', 'orlyata_core_maybe_flush_rewrite_rules', 99 );

\OrlyataCore\Settings\SiteSettings::register();

/**
 * Use a syntactically valid sender address for the local mail catcher.
 *
 * @param string $email Original sender address.
 * @return string
 */
function orlyata_core_filter_local_mail_from( string $email ): string {
	if ( ! in_array( wp_get_environment_type(), array( 'local', 'development' ), true ) ) {
		return $email;
	}

	return 'wordpress@orlyata.local';
}

/**
 * Flush rewrite rules once after a schema change.
 *
 * Must-use plugins do not have activation hooks, so the versioned option is the
 * narrowest safe moment to regenerate routes.
 *
 * @return void
 */
function orlyata_core_maybe_flush_rewrite_rules(): void {
	$option_name = 'orlyata_core_schema_version';

	if ( ORLYATA_CORE_VERSION === get_option( $option_name ) ) {
		return;
	}

	flush_rewrite_rules( false );
	update_option( $option_name, ORLYATA_CORE_VERSION, false );
}
