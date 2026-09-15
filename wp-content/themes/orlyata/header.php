<?php
/**
 * Global document header.
 *
 * @package Orlyata
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="icon" href="<?php echo esc_url( get_theme_file_uri( 'assets/icons/favicon.svg' ) ); ?>" type="image/svg+xml">
	<link rel="alternate icon" href="<?php echo esc_url( get_theme_file_uri( 'assets/icons/favicon.ico' ) ); ?>" sizes="any">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
