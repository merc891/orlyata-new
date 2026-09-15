<?php
/**
 * Advantage component.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;

$advantage_args = wp_parse_args(
	is_array( $args ?? null ) ? $args : array(),
	array(
		'label' => '',
		'value' => '',
	)
);

$value = is_string( $advantage_args['value'] ) ? trim( $advantage_args['value'] ) : '';
$label = is_string( $advantage_args['label'] ) ? trim( $advantage_args['label'] ) : '';

if ( '' === $value || '' === $label ) {
	return;
}
?>
<div class="orlyata-advantage">
	<div class="orlyata-advantage__stat">
		<span class="orlyata-advantage__accent" aria-hidden="true"></span>
		<p class="orlyata-advantage__value"><?php echo esc_html( $value ); ?></p>
	</div>
	<p class="orlyata-advantage__label"><?php echo esc_html( $label ); ?></p>
</div>
