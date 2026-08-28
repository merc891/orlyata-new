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
		'headers'            => array(),
		'hidden_rows'        => array(),
		'row_categories'     => array(),
		'rows'               => array(),
		'variant'            => '',
		'row_links'          => array(),
		'row_provider_icons' => array(),
	)
);

if ( ! is_array( $table_args['headers'] ) || ! is_array( $table_args['rows'] ) || array() === $table_args['headers'] ) {
	return;
}

$table_variant              = is_string( $table_args['variant'] ) ? $table_args['variant'] : '';
$table_hidden_rows          = is_array( $table_args['hidden_rows'] ) ? $table_args['hidden_rows'] : array();
$table_row_categories       = is_array( $table_args['row_categories'] ) ? $table_args['row_categories'] : array();
$table_row_links            = is_array( $table_args['row_links'] ) ? $table_args['row_links'] : array();
$table_row_provider_icons   = is_array( $table_args['row_provider_icons'] ) ? $table_args['row_provider_icons'] : array();
$table_video_provider_icons = array(
	'youtube' => array(
		'file'  => 'youtube.png',
		'label' => __( 'YouTube', 'orlyata' ),
	),
	'rutube'  => array(
		'file'  => 'rutube.png',
		'label' => __( 'RuTube', 'orlyata' ),
	),
	'vk'      => array(
		'file'  => 'vk.png',
		'label' => __( 'VK', 'orlyata' ),
	),
);
$table_is_link_list         = in_array( $table_variant, array( 'news', 'photo', 'video' ), true );
$table_classes              = array( 'orlyata-data-table' );
if ( 'achievements' === $table_variant ) {
	$table_classes[] = 'orlyata-data-table--achievements';
} elseif ( $table_is_link_list ) {
	$table_classes[] = 'orlyata-data-table--' . $table_variant;
}
?>
<table class="<?php echo esc_attr( implode( ' ', $table_classes ) ); ?>">
	<?php if ( ( 'achievements' === $table_variant || $table_is_link_list ) && 4 === count( $table_args['headers'] ) ) : ?>
		<colgroup>
			<?php foreach ( $table_args['headers'] as $header ) : ?>
				<col>
			<?php endforeach; ?>
		</colgroup>
	<?php endif; ?>
	<thead>
		<tr>
			<?php foreach ( $table_args['headers'] as $index => $header ) : ?>
				<?php $is_link_list_link_column = $table_is_link_list && ( count( $table_args['headers'] ) - 1 ) === $index; ?>
				<th scope="col"<?php echo $is_link_list_link_column ? ' aria-label="' . esc_attr( is_string( $header ) ? $header : '' ) . '"' : ''; ?>>
					<?php if ( ! $is_link_list_link_column ) : ?>
						<?php echo esc_html( is_string( $header ) ? $header : '' ); ?>
					<?php endif; ?>
				</th>
			<?php endforeach; ?>
		</tr>
	</thead>
	<tbody>
		<?php foreach ( $table_args['rows'] as $row_index => $row ) : ?>
			<?php if ( ! is_array( $row ) ) : ?>
				<?php continue; ?>
			<?php endif; ?>
			<?php
			$row_category  = isset( $table_row_categories[ $row_index ] ) && is_string( $table_row_categories[ $row_index ] ) ? $table_row_categories[ $row_index ] : '';
			$row_is_hidden = isset( $table_hidden_rows[ $row_index ] ) && true === $table_hidden_rows[ $row_index ];
			$row_title     = isset( $row[0] ) && is_string( $row[0] ) ? $row[0] : '';
			$row_provider  = isset( $table_row_provider_icons[ $row_index ] ) && is_string( $table_row_provider_icons[ $row_index ] ) ? $table_row_provider_icons[ $row_index ] : '';
			?>
			<tr<?php echo 'news' === $table_variant && '' !== $row_category ? ' data-news-category="' . esc_attr( $row_category ) . '"' : ''; ?><?php echo $row_is_hidden ? ' hidden' : ''; ?>>
				<?php foreach ( $table_args['headers'] as $index => $header ) : ?>
					<td data-label="<?php echo esc_attr( is_string( $header ) ? $header : '' ); ?>">
						<?php if ( $table_is_link_list && ( count( $table_args['headers'] ) - 1 ) === $index ) : ?>
							<?php $row_link = isset( $table_row_links[ $row_index ] ) && is_string( $table_row_links[ $row_index ] ) ? $table_row_links[ $row_index ] : ''; ?>
							<?php if ( '' !== $row_link ) : ?>
								<?php
								$row_provider_icon = 'video' === $table_variant && isset( $table_video_provider_icons[ $row_provider ] ) ? $table_video_provider_icons[ $row_provider ] : null;
								if ( 'news' === $table_variant ) {
									/* translators: %s: data-table row title. */
									$row_link_aria_label = sprintf( __( 'Открыть новость «%s»', 'orlyata' ), $row_title );
								} elseif ( is_array( $row_provider_icon ) ) {
									/* translators: 1: data-table row title, 2: video provider. */
									$row_link_aria_label = sprintf( __( 'Открыть видео «%1$s» на %2$s', 'orlyata' ), $row_title, $row_provider_icon['label'] );
								} else {
									/* translators: %s: data-table row title. */
									$row_link_aria_label = sprintf( __( 'Открыть галерею «%s»', 'orlyata' ), $row_title );
								}
								?>
								<a class="orlyata-data-table__row-link" href="<?php echo esc_url( $row_link ); ?>" aria-label="<?php echo esc_attr( $row_link_aria_label ); ?>">
									<?php if ( is_array( $row_provider_icon ) ) : ?>
										<img class="orlyata-data-table__provider-icon" src="<?php echo esc_url( get_theme_file_uri( 'assets/icons/video-providers/' . $row_provider_icon['file'] ) ); ?>" alt="" aria-hidden="true">
									<?php else : ?>
										<span class="orlyata-data-table__row-arrow-track" aria-hidden="true">
											<span class="orlyata-data-table__row-arrow">
												<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M12 5V19M5 12L12 19L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
												</svg>
											</span>
											<span class="orlyata-data-table__row-arrow">
												<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M12 5V19M5 12L12 19L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
												</svg>
											</span>
										</span>
									<?php endif; ?>
								</a>
							<?php endif; ?>
						<?php else : ?>
							<?php echo esc_html( isset( $row[ $index ] ) && is_string( $row[ $index ] ) ? $row[ $index ] : '' ); ?>
						<?php endif; ?>
					</td>
				<?php endforeach; ?>
			</tr>
		<?php endforeach; ?>
	</tbody>
</table>
