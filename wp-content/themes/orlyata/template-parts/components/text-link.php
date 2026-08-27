<?php
/**
 * Text link component.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;

$link_args = wp_parse_args(
	is_array( $args ?? null ) ? $args : array(),
	array(
		'href'  => '',
		'label' => '',
		'class'   => '',
		'variant' => 'roll',
	)
);

$href    = is_string( $link_args['href'] ) ? trim( $link_args['href'] ) : '';
$label   = is_string( $link_args['label'] ) ? trim( $link_args['label'] ) : '';
$variant = is_string( $link_args['variant'] ) ? $link_args['variant'] : 'roll';
$variant = in_array( $variant, array( 'roll', 'color', 'color-inverse' ), true ) ? $variant : 'roll';

if ( '' === $href || '' === $label ) {
	return;
}
?>
<a class="orlyata-text-link orlyata-text-link--<?php echo esc_attr( $variant ); ?> <?php echo esc_attr( sanitize_html_class( (string) $link_args['class'] ) ); ?>" href="<?php echo esc_url( $href ); ?>">
	<span class="orlyata-text-link__label" data-text="<?php echo esc_attr( $label ); ?>">
		<?php echo esc_html( $label ); ?>
	</span>
</a>
