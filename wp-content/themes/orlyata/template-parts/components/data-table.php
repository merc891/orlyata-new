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
		'variant' => '',
	)
);

if ( ! is_array( $table_args['headers'] ) || ! is_array( $table_args['rows'] ) || array() === $table_args['headers'] ) {
	return;
}

$table_variant = is_string( $table_args['variant'] ) ? $table_args['variant'] : '';
$table_classes = array( 'orlyata-data-table' );
if ( 'achievements' === $table_variant ) {
	$table_classes[] = 'orlyata-data-table--achievements';
}
?>
<table class="<?php echo esc_attr( implode( ' ', $table_classes ) ); ?>">
	<?php if ( 'achievements' === $table_variant && 4 === count( $table_args['headers'] ) ) : ?>
		<colgroup>
			<?php foreach ( $table_args['headers'] as $header ) : ?>
				<col>
			<?php endforeach; ?>
		</colgroup>
	<?php endif; ?>
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
