<?php
/**
 * Plugin Name: Орлята Core
 * Description: Контентная модель и бизнес-правила сайта «Орлята».
 * Version: 0.1.0
 * Requires PHP: 8.3
 *
 * @package OrlyataCore
 */

defined( 'ABSPATH' ) || exit;

$orlyata_core_bootstrap = __DIR__ . '/orlyata-core/bootstrap.php';

if ( is_readable( $orlyata_core_bootstrap ) ) {
	require_once $orlyata_core_bootstrap;
}
