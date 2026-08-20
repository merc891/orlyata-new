<?php
/**
 * Data table component.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;

$table_args = wp_parse_args(
	is_array( $args ?? null ) ? $args : array(),
	array(
		'headers' => array(),
		'rows'    => array(),
	)
);

if ( ! is_array( $table_args['headers'] ) || ! is_array( $table_args['rows'] ) || array() === $table_args['headers'] ) {
	return;
}
?>
<table class="orlyata-data-table">
	<thead>
		<tr>
			<?php foreach ( $table_args['headers'] as $header ) : ?>
				<th scope="col"><?php echo esc_html( is_string( $header ) ? $header : '' ); ?></th>
			<?php endforeach; ?>
		</tr>
	</thead>
	<tbody>
		<?php foreach ( $table_args['rows'] as $row ) : ?>
			<?php if ( ! is_array( $row ) ) : ?>
				<?php continue; ?>
			<?php endif; ?>
			<tr>
				<?php foreach ( $table_args['headers'] as $index => $header ) : ?>
					<td data-label="<?php echo esc_attr( is_string( $header ) ? $header : '' ); ?>">
						<?php echo esc_html( isset( $row[ $index ] ) && is_string( $row[ $index ] ) ? $row[ $index ] : '' ); ?>
					</td>
				<?php endforeach; ?>
			</tr>
		<?php endforeach; ?>
	</tbody>
</table>
