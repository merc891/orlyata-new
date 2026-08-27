<?php
/**
 * Page hero component.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;

$page_hero_args = wp_parse_args(
	is_array( $args ?? null ) ? $args : array(),
	array(
		'image_alt' => '',
		'image_src' => '',
		'title'     => '',
		'title_id'  => '',
	)
);

if ( ! is_string( $page_hero_args['title'] ) || '' === $page_hero_args['title'] ) {
	return;
}

$page_hero_title_id = is_string( $page_hero_args['title_id'] ) && '' !== $page_hero_args['title_id'] ? $page_hero_args['title_id'] : wp_unique_id( 'page-hero-title-' );
?>
<section class="orlyata-page-hero" aria-labelledby="<?php echo esc_attr( $page_hero_title_id ); ?>">
	<?php if ( is_string( $page_hero_args['image_src'] ) && '' !== $page_hero_args['image_src'] ) : ?>
		<img class="orlyata-page-hero__image" src="<?php echo esc_url( $page_hero_args['image_src'] ); ?>" alt="<?php echo esc_attr( is_string( $page_hero_args['image_alt'] ) ? $page_hero_args['image_alt'] : '' ); ?>">
	<?php endif; ?>
	<h1 class="orlyata-page-hero__title type-display" id="<?php echo esc_attr( $page_hero_title_id ); ?>"><?php echo esc_html( $page_hero_args['title'] ); ?></h1>
</section>
