<?php
/**
 * Input component.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;

$input_args = wp_parse_args(
	is_array( $args ?? null ) ? $args : array(),
	array(
		'autocomplete' => '',
		'disabled'     => false,
		'error'        => '',
		'id'           => '',
		'label'        => '',
		'name'         => '',
		'required'     => false,
		'type'         => 'text',
		'value'        => '',
	)
);

$input_id    = is_string( $input_args['id'] ) ? sanitize_html_class( $input_args['id'] ) : '';
$name        = is_string( $input_args['name'] ) ? sanitize_key( $input_args['name'] ) : '';
$label       = is_string( $input_args['label'] ) ? trim( $input_args['label'] ) : '';
$input_error = is_string( $input_args['error'] ) ? trim( $input_args['error'] ) : '';
$value       = is_string( $input_args['value'] ) ? $input_args['value'] : '';
$types       = array( 'text', 'tel', 'date', 'search' );
$input_type  = is_string( $input_args['type'] ) && in_array( $input_args['type'], $types, true ) ? $input_args['type'] : 'text';
$is_date     = 'date' === $input_type;
$is_phone    = 'tel' === $input_type;
$render_type = $is_date ? 'text' : $input_type;

if ( $is_date && preg_match( '/^(\d{4})-(\d{2})-(\d{2})$/', $value, $matches ) ) {
	$value = $matches[3] . '.' . $matches[2] . '.' . $matches[1];
}

if ( '' === $input_id || '' === $name || '' === $label ) {
	return;
}

$error_id    = $input_id . '-error';
$class_names = array( 'orlyata-input' );

if ( '' !== $value ) {
	$class_names[] = 'is-filled';
}

if ( '' !== $input_error ) {
	$class_names[] = 'has-error';
}

if ( $is_date ) {
	$class_names[] = 'orlyata-input--date';
} elseif ( $is_phone ) {
	$class_names[] = 'orlyata-input--tel';
}

if ( (bool) $input_args['disabled'] ) {
	$class_names[] = 'is-disabled';
}
?>
<div class="<?php echo esc_attr( implode( ' ', $class_names ) ); ?>">
	<div class="orlyata-input__control">
		<label class="orlyata-input__label" for="<?php echo esc_attr( $input_id ); ?>"><?php echo esc_html( $label ); ?></label>
		<?php if ( $is_date ) : ?>
			<span class="orlyata-input__mask" data-input-mask-template="ДД.ММ.ГГГГ" aria-hidden="true">ДД.ММ.ГГГГ</span>
		<?php elseif ( $is_phone ) : ?>
			<span class="orlyata-input__mask" data-input-mask-template="+7 (123) 456-78-90" aria-hidden="true">+7 (123) 456-78-90</span>
		<?php endif; ?>
		<input
			class="orlyata-input__field"
			id="<?php echo esc_attr( $input_id ); ?>"
			name="<?php echo esc_attr( $name ); ?>"
			type="<?php echo esc_attr( $render_type ); ?>"
			value="<?php echo esc_attr( $value ); ?>"
			<?php if ( $is_date ) : ?>
				inputmode="numeric"
				maxlength="10"
				pattern="[0-9]{2}\.[0-9]{2}\.[0-9]{4}"
				data-input-mask="date"
				data-date-max="<?php echo esc_attr( wp_date( 'Y-m-d' ) ); ?>"
			<?php elseif ( $is_phone ) : ?>
				inputmode="tel"
				maxlength="18"
				pattern="\+7 \([0-9]{3}\) [0-9]{3}-[0-9]{2}-[0-9]{2}"
				data-input-mask="phone"
			<?php endif; ?>
			<?php if ( is_string( $input_args['autocomplete'] ) && '' !== $input_args['autocomplete'] ) : ?>
				autocomplete="<?php echo esc_attr( $input_args['autocomplete'] ); ?>"
			<?php endif; ?>
			<?php if ( (bool) $input_args['required'] ) : ?>
				required
			<?php endif; ?>
			<?php if ( (bool) $input_args['disabled'] ) : ?>
				disabled
			<?php endif; ?>
			<?php if ( '' !== $input_error ) : ?>
				aria-invalid="true"
				aria-describedby="<?php echo esc_attr( $error_id ); ?>"
			<?php endif; ?>
		/>
	</div>
	<?php if ( '' !== $input_error ) : ?>
		<p class="orlyata-input__error" id="<?php echo esc_attr( $error_id ); ?>"><?php echo esc_html( $input_error ); ?></p>
	<?php endif; ?>
</div>
