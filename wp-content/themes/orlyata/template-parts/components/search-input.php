<?php
/**
 * Search input component.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;

$search_input_args = wp_parse_args(
	is_array( $args ?? null ) ? $args : array(),
	array(
		'id'          => '',
		'name'        => 'q',
		'placeholder' => '',
		'value'       => '',
	)
);

$search_input_id          = is_string( $search_input_args['id'] ) ? sanitize_html_class( $search_input_args['id'] ) : '';
$search_input_name        = is_string( $search_input_args['name'] ) ? sanitize_key( $search_input_args['name'] ) : '';
$search_input_placeholder = is_string( $search_input_args['placeholder'] ) ? $search_input_args['placeholder'] : '';
$search_input_value       = is_string( $search_input_args['value'] ) ? $search_input_args['value'] : '';

if ( '' === $search_input_id || '' === $search_input_name || '' === $search_input_placeholder ) {
	return;
}
?>
<div class="orlyata-search-input">
	<label class="screen-reader-text" for="<?php echo esc_attr( $search_input_id ); ?>"><?php echo esc_html( $search_input_placeholder ); ?></label>
	<input class="orlyata-search-input__field" id="<?php echo esc_attr( $search_input_id ); ?>" name="<?php echo esc_attr( $search_input_name ); ?>" type="search" value="<?php echo esc_attr( $search_input_value ); ?>" placeholder="<?php echo esc_attr( $search_input_placeholder ); ?>" data-notes-search>
	<button class="orlyata-search-input__clear" type="button" aria-label="<?php esc_attr_e( 'Очистить поиск', 'orlyata' ); ?>" hidden data-notes-search-clear>
		<svg aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18 6 6 18M6 6l12 12"/></svg>
	</button>
</div>
