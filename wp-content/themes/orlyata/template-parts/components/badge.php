<?php
/**
 * Badge component.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;

$badge_args = wp_parse_args(
	is_array( $args ?? null ) ? $args : array(),
	array(
		'label'   => '',
		'class'   => '',
		'variant' => 'default',
	)
);

$label            = is_string( $badge_args['label'] ) ? trim( $badge_args['label'] ) : '';
$allowed_variants = array( 'default', 'inverse' );
$variant          = is_string( $badge_args['variant'] ) && in_array( $badge_args['variant'], $allowed_variants, true ) ? $badge_args['variant'] : 'default';
$class_names      = array( 'orlyata-badge', 'orlyata-badge--' . $variant );

if ( is_string( $badge_args['class'] ) && '' !== $badge_args['class'] ) {
	$class_names[] = sanitize_html_class( $badge_args['class'] );
}

if ( '' === $label ) {
	return;
}
?>
<span class="<?php echo esc_attr( implode( ' ', $class_names ) ); ?>">
	<?php echo esc_html( $label ); ?>
</span>
