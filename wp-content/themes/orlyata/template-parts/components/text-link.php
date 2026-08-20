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
		'class' => '',
	)
);

$href  = is_string( $link_args['href'] ) ? trim( $link_args['href'] ) : '';
$label = is_string( $link_args['label'] ) ? trim( $link_args['label'] ) : '';

if ( '' === $href || '' === $label ) {
	return;
}
?>
<a class="orlyata-text-link <?php echo esc_attr( sanitize_html_class( (string) $link_args['class'] ) ); ?>" href="<?php echo esc_url( $href ); ?>">
	<?php echo esc_html( $label ); ?>
</a>
