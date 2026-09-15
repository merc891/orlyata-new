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
		'variant'  => 'default',
		'icon_uri' => '',
		'icon'     => '',
	)
);

$label            = is_string( $badge_args['label'] ) ? trim( $badge_args['label'] ) : '';
$icon_uri         = is_string( $badge_args['icon_uri'] ) ? trim( $badge_args['icon_uri'] ) : '';
$icon             = is_string( $badge_args['icon'] ) ? trim( $badge_args['icon'] ) : '';

if ( 1 === preg_match( '/^([^\p{L}\p{N}]*)(\p{L})/u', $label, $matches ) ) {
	$label = $matches[1] . mb_strtoupper( $matches[2], 'UTF-8' ) . mb_substr( $label, mb_strlen( $matches[1] . $matches[2], 'UTF-8' ), null, 'UTF-8' );
}
$allowed_variants = array( 'default', 'dark', 'dark-icon', 'icon', 'inverse', 'filled' );
$variant          = is_string( $badge_args['variant'] ) && in_array( $badge_args['variant'], $allowed_variants, true ) ? $badge_args['variant'] : 'default';
$class_names      = array( 'orlyata-badge', 'orlyata-badge--' . $variant );

if ( is_string( $badge_args['class'] ) && '' !== $badge_args['class'] ) {
	$class_names[] = sanitize_html_class( $badge_args['class'] );
}

if ( '' === $label && ! in_array( $variant, array( 'icon', 'dark-icon' ), true ) ) {
	return;
}

if ( in_array( $variant, array( 'icon', 'dark-icon' ), true ) && '' === $icon_uri && '' === $icon ) {
	return;
}
?>
<span class="<?php echo esc_attr( implode( ' ', $class_names ) ); ?>">
	<?php if ( in_array( $variant, array( 'icon', 'dark-icon' ), true ) ) : ?>
		<?php if ( '' !== $icon ) : ?>
			<span class="orlyata-badge__emoji" aria-hidden="true"><?php echo esc_html( $icon ); ?></span>
		<?php else : ?>
			<img class="orlyata-badge__icon" src="<?php echo esc_url( $icon_uri ); ?>" alt="" aria-hidden="true" />
		<?php endif; ?>
	<?php else : ?>
		<?php echo esc_html( $label ); ?>
	<?php endif; ?>
</span>
