<?php
/**
 * Button component.
 *
 * Expected arguments:
 * - label: Visible label for primary and secondary variants.
 * - variant: primary, secondary, play, arrow-left or arrow-right.
 * - href: Optional URL; when present the component renders a link.
 * - icon: Optional close icon for the primary variant.
 * - aria_label: Accessible name for icon-only variants.
 * - disabled: Whether the control is unavailable.
 * - loading: Busy state for button elements only.
 * - loading_label: Visible busy-state label.
 * - type: button, submit or reset.
 * - class: Optional additional class names.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;

$button_args = wp_parse_args(
	is_array( $args ?? null ) ? $args : array(),
	array(
		'label'         => '',
		'variant'       => 'primary',
		'href'          => '',
		'icon'          => '',
		'aria_label'    => '',
		'disabled'      => false,
		'loading'       => false,
		'loading_label' => __( 'Отправка…', 'orlyata' ),
		'type'          => 'button',
		'class'         => '',
	)
);

$allowed_variants = array( 'primary', 'secondary', 'play', 'arrow-left', 'arrow-right' );
$variant          = is_string( $button_args['variant'] ) && in_array( $button_args['variant'], $allowed_variants, true )
	? $button_args['variant']
	: 'primary';
$label            = is_string( $button_args['label'] ) ? trim( $button_args['label'] ) : '';
$href             = is_string( $button_args['href'] ) ? trim( $button_args['href'] ) : '';
$is_icon_only     = in_array( $variant, array( 'play', 'arrow-left', 'arrow-right' ), true );
$loading          = (bool) $button_args['loading'] && '' === $href;
$disabled         = (bool) $button_args['disabled'] || $loading;
$loading_label    = is_string( $button_args['loading_label'] ) && '' !== trim( $button_args['loading_label'] )
	? trim( $button_args['loading_label'] )
	: __( 'Отправка…', 'orlyata' );
$visible_label    = $loading ? $loading_label : $label;
$loading_label_text = $loading ? preg_replace( "/\s*(?:…|\.{3})\s*$/u", "", $visible_label ) : $visible_label;

if ( ! is_string( $loading_label_text ) || "" === $loading_label_text ) {
	$loading_label_text = $visible_label;
}
$button_type      = is_string( $button_args['type'] ) && in_array( $button_args['type'], array( 'button', 'submit', 'reset' ), true )
	? $button_args['type']
	: 'button';
$aria_label       = is_string( $button_args['aria_label'] ) ? trim( $button_args['aria_label'] ) : '';

if ( ! $is_icon_only && '' === $visible_label ) {
	return;
}

if ( $is_icon_only && '' === $aria_label ) {
	$aria_label = match ( $variant ) {
		'play'        => __( 'Воспроизвести', 'orlyata' ),
		'arrow-left'  => __( 'Назад', 'orlyata' ),
		'arrow-right' => __( 'Вперёд', 'orlyata' ),
	};
}

$class_names = array(
	'orlyata-button',
	'orlyata-button--' . $variant,
);

$icon = is_string( $button_args['icon'] ) ? $button_args['icon'] : '';

if ( 'primary' === $variant && 'close' === $icon && ! $loading ) {
	$class_names[] = 'orlyata-button--with-icon';
}

if ( $is_icon_only ) {
	$class_names[] = 'orlyata-button--icon-only';
}

if ( $loading ) {
	$class_names[] = 'is-loading';
}

if ( is_string( $button_args['class'] ) && '' !== trim( $button_args['class'] ) ) {
	$additional_classes = preg_split( '/\s+/', trim( $button_args['class'] ) );

	if ( is_array( $additional_classes ) ) {
		foreach ( $additional_classes as $additional_class ) {
			$sanitized_class = sanitize_html_class( $additional_class );

			if ( '' !== $sanitized_class ) {
				$class_names[] = $sanitized_class;
			}
		}
	}
}

$icon_name = match ( $variant ) {
	'play'        => 'button-play.svg',
	'arrow-left',
	'arrow-right' => 'button-arrow.svg',
	default       => 'primary' === $variant && 'close' === $icon && ! $loading ? 'button-close.svg' : '',
};
$icon_uri = '' !== $icon_name ? get_theme_file_uri( 'assets/icons/' . $icon_name ) : '';

$render_content = static function () use ( $icon_uri, $is_icon_only, $loading, $loading_label_text, $variant, $visible_label ): void {
	if ( ! $is_icon_only ) {
		?>
		<?php if ( $loading ) : ?>
			<span class="orlyata-button__label"><?php echo esc_html( $loading_label_text ); ?><span class="orlyata-button__loading-dots" aria-hidden="true"><span class="orlyata-button__loading-dot"></span><span class="orlyata-button__loading-dot"></span><span class="orlyata-button__loading-dot"></span></span></span>
		<?php else : ?>
			<span class="orlyata-button__label"><?php echo esc_html( $visible_label ); ?></span>
		<?php endif; ?>
		<?php
	}

	if ( '' !== $icon_uri ) {
		if ( in_array( $variant, array( 'arrow-left', 'arrow-right' ), true ) ) {
			?>
			<span class="orlyata-button__arrow-track" aria-hidden="true">
				<span class="orlyata-button__arrow"><img class="orlyata-button__icon orlyata-button__icon--<?php echo esc_attr( $variant ); ?>" src="<?php echo esc_url( $icon_uri ); ?>" alt="" /></span>
				<span class="orlyata-button__arrow"><img class="orlyata-button__icon orlyata-button__icon--<?php echo esc_attr( $variant ); ?>" src="<?php echo esc_url( $icon_uri ); ?>" alt="" /></span>
			</span>
			<?php
			return;
		}
		?>
		<img
			class="orlyata-button__icon orlyata-button__icon--<?php echo esc_attr( $variant ); ?>"
			src="<?php echo esc_url( $icon_uri ); ?>"
			alt=""
			aria-hidden="true"
		/>
		<?php
	}
};

if ( '' !== $href ) {
	?>
	<a
		class="<?php echo esc_attr( implode( ' ', $class_names ) ); ?>"
		<?php if ( ! $disabled ) : ?>
			href="<?php echo esc_url( $href ); ?>"
		<?php else : ?>
			aria-disabled="true"
			tabindex="-1"
		<?php endif; ?>
		<?php if ( $is_icon_only ) : ?>
			aria-label="<?php echo esc_attr( $aria_label ); ?>"
		<?php endif; ?>
	>
		<?php $render_content(); ?>
	</a>
	<?php
	return;
}
?>
<button
	class="<?php echo esc_attr( implode( ' ', $class_names ) ); ?>"
	type="<?php echo esc_attr( $button_type ); ?>"
	<?php if ( $disabled ) : ?>
		disabled
	<?php endif; ?>
	<?php if ( $loading ) : ?>
		aria-busy="true"
	<?php endif; ?>
	<?php if ( $is_icon_only ) : ?>
		aria-label="<?php echo esc_attr( $aria_label ); ?>"
	<?php endif; ?>
>
	<?php $render_content(); ?>
</button>
