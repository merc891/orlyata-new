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

$table_variant                 = is_string( $table_args['variant'] ) ? $table_args['variant'] : '';
$table_hidden_rows             = is_array( $table_args['hidden_rows'] ) ? $table_args['hidden_rows'] : array();
$table_row_categories          = is_array( $table_args['row_categories'] ) ? $table_args['row_categories'] : array();
$table_row_links               = is_array( $table_args['row_links'] ) ? $table_args['row_links'] : array();
$table_row_provider_icons      = is_array( $table_args['row_provider_icons'] ) ? $table_args['row_provider_icons'] : array();
$table_video_provider_icons    = array(
	'youtube' => array(
		'file_gray'  => 'youtube-gray.svg',
		'file_color' => 'youtube.svg',
		'label'      => __( 'YouTube', 'orlyata' ),
	),
	'rutube'  => array(
		'file_gray'  => 'rutube-gray.svg',
		'file_color' => 'rutube.svg',
		'label'      => __( 'RuTube', 'orlyata' ),
	),
	'vk'      => array(
		'file_gray'  => 'vk-gray.svg',
		'file_color' => 'vk.svg',
		'label'      => __( 'VK', 'orlyata' ),
	),
);
$table_is_achievements         = 'achievements' === $table_variant;
$table_is_teacher_achievements = 'teacher-achievements' === $table_variant;
$table_is_link_list            = in_array( $table_variant, array( 'news', 'photo', 'video', 'notes' ), true );
$table_classes                 = array( 'orlyata-data-table' );
if ( $table_is_achievements ) {
	$table_classes[] = 'orlyata-data-table--achievements';
} elseif ( $table_is_teacher_achievements ) {
	$table_classes[] = 'orlyata-data-table--teacher-achievements';
} elseif ( $table_is_link_list ) {
	$table_classes[] = 'orlyata-data-table--' . $table_variant;
}
?>
<table class="<?php echo esc_attr( implode( ' ', $table_classes ) ); ?>">
	<?php if ( ( $table_is_achievements && 3 === count( $table_args['headers'] ) ) || ( $table_is_link_list && 4 === count( $table_args['headers'] ) ) ) : ?>
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
			$row_author    = isset( $row[1] ) && is_string( $row[1] ) ? $row[1] : '';
			$row_provider  = isset( $table_row_provider_icons[ $row_index ] ) && is_string( $table_row_provider_icons[ $row_index ] ) ? $table_row_provider_icons[ $row_index ] : '';
			$row_link      = isset( $table_row_links[ $row_index ] ) && is_string( $table_row_links[ $row_index ] ) ? $table_row_links[ $row_index ] : '';
			$table_row_cells = $row;
			if ( $table_is_achievements ) {
				$table_achievement = isset( $row[1] ) && is_string( $row[1] ) ? trim( $row[1] ) : '';
				$table_choir       = isset( $row[2] ) && is_string( $row[2] ) ? trim( $row[2] ) : '';
				$table_row_cells   = array(
					isset( $row[0] ) && is_string( $row[0] ) ? $row[0] : '',
					trim( $table_achievement . ( '' !== $table_achievement && '' !== $table_choir ? ' / ' : '' ) . $table_choir ),
					isset( $row[3] ) && is_string( $row[3] ) ? $row[3] : '',
				);
			}
			?>
			<tr<?php echo '' !== $row_category ? ' data-row-category="' . esc_attr( $row_category ) . '"' : ''; ?><?php echo 'notes' === $table_variant && '' !== $row_category ? ' data-notes-choir="' . esc_attr( $row_category ) . '"' : ''; ?><?php echo $table_is_link_list && '' !== $row_link ? ' data-row-link="' . esc_url( $row_link ) . '"' : ''; ?><?php echo $row_is_hidden ? ' hidden' : ''; ?>>
				<?php foreach ( $table_args['headers'] as $index => $header ) : ?>
					<td data-label="<?php echo esc_attr( is_string( $header ) ? $header : '' ); ?>">
						<?php if ( $table_is_link_list && ( count( $table_args['headers'] ) - 1 ) === $index ) : ?>
							<?php if ( '' !== $row_link ) : ?>
								<?php
								$row_provider_icon = 'video' === $table_variant && isset( $table_video_provider_icons[ $row_provider ] ) ? $table_video_provider_icons[ $row_provider ] : null;
								if ( 'notes' === $table_variant ) {
									/* translators: %s: score title. */
									$row_link_aria_label = sprintf( __( 'Скачать файл «%s»', 'orlyata' ), $row_title );
								} elseif ( 'news' === $table_variant ) {
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
										<span class="orlyata-data-table__provider-icon" aria-hidden="true">
										<img class="orlyata-data-table__provider-icon-image orlyata-data-table__provider-icon-image--gray" src="<?php echo esc_url( get_theme_file_uri( 'assets/icons/video-providers/' . $row_provider_icon['file_gray'] ) ); ?>" alt="">
										<img class="orlyata-data-table__provider-icon-image orlyata-data-table__provider-icon-image--color" src="<?php echo esc_url( get_theme_file_uri( 'assets/icons/video-providers/' . $row_provider_icon['file_color'] ) ); ?>" alt="">
									</span>
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
							<?php elseif ( 'notes' === $table_variant && 0 === $index ) : ?>
							<span class="orlyata-data-table__notes-mobile-primary" aria-hidden="true"><?php echo esc_html( trim( $row_title . ( '' !== $row_title && '' !== $row_author ? ' / ' : '' ) . $row_author ) ); ?></span>
							<span class="orlyata-data-table__notes-desktop-value"><?php echo esc_html( isset( $table_row_cells[ $index ] ) && is_string( $table_row_cells[ $index ] ) ? $table_row_cells[ $index ] : '' ); ?></span>
						<?php else : ?>
							<?php echo esc_html( isset( $table_row_cells[ $index ] ) && is_string( $table_row_cells[ $index ] ) ? $table_row_cells[ $index ] : '' ); ?>
						<?php endif; ?>
					</td>
				<?php endforeach; ?>
			</tr>
		<?php endforeach; ?>
	</tbody>
</table>
