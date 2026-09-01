<?php
/**
 * Notes library desktop preview.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;

$notes_categories = array(
	''             => __( 'Все', 'orlyata' ),
	'preschool'    => __( 'Дошкольники', 'orlyata' ),
	'junior'        => __( 'Младший', 'orlyata' ),
	'senior'        => __( 'Старший', 'orlyata' ),
	'youth'         => __( 'Юноши', 'orlyata' ),
);
// phpcs:ignore WordPress.Security.NonceVerification.Recommended,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- Read-only public URL values are individually sanitised below.
$requested_categories     = isset( $_GET['orlyata_notes_choir'] ) && is_string( $_GET['orlyata_notes_choir'] ) ? explode( ',', wp_unslash( $_GET['orlyata_notes_choir'] ) ) : array();
$current_categories       = array_values( array_intersect( array_keys( $notes_categories ), array_map( 'sanitize_key', $requested_categories ) ) );
$current_categories = array_values( array_filter( $current_categories ) );
$notes_search = isset( $_GET['q'] ) && is_string( $_GET['q'] ) ? sanitize_text_field( wp_unslash( $_GET['q'] ) ) : '';
$archive_url              = home_url( '/noty/' );
$notes_preview_source_rows = array(
	array( __( 'Clair de Lune', 'orlyata' ), __( 'C. Debussy', 'orlyata' ), __( 'Старший хор', 'orlyata' ), 'senior' ),
	array( __( 'Boléro', 'orlyata' ), __( 'M. Ravel', 'orlyata' ), __( 'Старший хор', 'orlyata' ), 'senior' ),
	array( __( 'Ode to Joy', 'orlyata' ), __( 'L. van Beethoven', 'orlyata' ), __( 'Дошкольники', 'orlyata' ), 'preschool' ),
	array( __( 'The Four Seasons: Spring', 'orlyata' ), __( 'A. Vivaldi', 'orlyata' ), __( 'Дошкольники', 'orlyata' ), 'preschool' ),
	array( __( 'Nocturne in E-flat Major', 'orlyata' ), __( 'F. Chopin', 'orlyata' ), __( 'Дошкольники', 'orlyata' ), 'preschool' ),
	array( __( 'Hungarian Dance No. 5', 'orlyata' ), __( 'J. Brahms', 'orlyata' ), __( 'Юноши', 'orlyata' ), 'youth' ),
	array( __( 'The Blue Danube', 'orlyata' ), __( 'J. Strauss II', 'orlyata' ), __( 'Юноши', 'orlyata' ), 'youth' ),
	array( __( 'Gymnopédies No. 1', 'orlyata' ), __( 'E. Satie', 'orlyata' ), __( 'Дошкольники', 'orlyata' ), 'preschool' ),
	array( __( 'Symphony No. 5', 'orlyata' ), __( 'L. van Beethoven', 'orlyata' ), __( 'Старший хор', 'orlyata' ), 'senior' ),
	array( __( 'Eine kleine Nachtmusik', 'orlyata' ), __( 'W. A. Mozart', 'orlyata' ), __( 'Старший хор', 'orlyata' ), 'senior' ),
);
$notes_preview_items = array_merge( $notes_preview_source_rows, $notes_preview_source_rows, $notes_preview_source_rows, $notes_preview_source_rows, $notes_preview_source_rows );
usort(
	$notes_preview_items,
	static function ( array $left, array $right ): int {
		return strnatcasecmp( (string) ( $left[0] ?? '' ), (string) ( $right[0] ?? '' ) );
	}
);
$notes_preview_items       = array_slice( $notes_preview_items, 0, 45 );
$notes_preview_rows        = array();
$notes_preview_categories  = array();
foreach ( $notes_preview_items as $notes_preview_item ) {
	$notes_preview_category     = isset( $notes_preview_item[3] ) && is_string( $notes_preview_item[3] ) ? $notes_preview_item[3] : '';
	$notes_preview_rows[]       = array_slice( $notes_preview_item, 0, 3 );
	$notes_preview_categories[] = $notes_preview_category;
}
$notes_preview_hidden_rows = array_map(
	static function ( $notes_preview_category, $row_index ) use ( $current_categories, $notes_preview_rows, $notes_search ): bool {
		$row_text = implode( ' ', $notes_preview_rows[ $row_index ] ?? array() );
		$matches_search = '' === $notes_search || false !== mb_stripos( $row_text, $notes_search, 0, 'UTF-8' );
		return ( array() !== $current_categories && ! in_array( $notes_preview_category, $current_categories, true ) ) || ! $matches_search;
	},
	$notes_preview_categories,
	array_keys( $notes_preview_categories )
);
$notes_has_results = in_array( false, $notes_preview_hidden_rows, true );
$notes_visible_count = count(
	array_filter(
		$notes_preview_hidden_rows,
		static function ( $notes_preview_row_is_hidden ): bool {
			return false === $notes_preview_row_is_hidden;
		}
	)
);
$notes_file_word = static function ( int $notes_file_count ): string {
	$notes_last_two_digits = $notes_file_count % 100;
	$notes_last_digit      = $notes_file_count % 10;
	if ( $notes_last_two_digits >= 11 && $notes_last_two_digits <= 14 ) {
		return __( 'файлов', 'orlyata' );
	}
	if ( 1 === $notes_last_digit ) {
		return __( 'файл', 'orlyata' );
	}
	if ( $notes_last_digit >= 2 && $notes_last_digit <= 4 ) {
		return __( 'файла', 'orlyata' );
	}
	return __( 'файлов', 'orlyata' );
};
$notes_file_count_label = sprintf( '%d %s', $notes_visible_count, $notes_file_word( $notes_visible_count ) );
$notes_preview_detail_url  = home_url( '/noty/' );
$notes_preview_links       = array_fill( 0, count( $notes_preview_rows ), $notes_preview_detail_url );

get_header();
?>
<div class="orlyata-notes">
	<?php get_template_part( 'template-parts/layout/sidebar' ); ?>
	<main class="orlyata-notes__content" id="main">
		<?php
		get_template_part(
			'template-parts/components/page-hero',
			null,
			array(
				'image_src' => get_theme_file_uri( 'assets/images/about/img271.png' ),
				'corner_meta' => $notes_file_count_label,
				'title'       => __( 'Ноты', 'orlyata' ),
				'title_id'    => 'notes-title',
			)
		);
		?>
		<div class="orlyata-notes__body">
				<nav class="orlyata-notes__filters" aria-label="<?php esc_attr_e( 'Категории нот', 'orlyata' ); ?>" data-archive-content-reveal data-notes-filters data-table-filters data-table-filter-parameter="orlyata_notes_choir" data-table-filter-multiple="true" data-notes-close-icon="<?php echo esc_url( get_theme_file_uri( 'assets/icons/button-close.svg' ) ); ?>">
				<ul class="orlyata-notes__filter-list">
					<?php foreach ( $notes_categories as $slug => $label ) : ?>
						<?php
						$is_current      = '' === $slug ? array() === $current_categories : in_array( $slug, $current_categories, true );
						$next_categories = '' === $slug ? array() : ( $is_current ? array_values( array_diff( $current_categories, array( $slug ) ) ) : array_merge( $current_categories, array( $slug ) ) );
						$url             = array() === $next_categories ? $archive_url : add_query_arg( 'orlyata_notes_choir', implode( ',', $next_categories ), $archive_url );
						?>
						<li class="orlyata-notes__filter-item" data-notes-filter="<?php echo esc_attr( $slug ); ?>" data-table-filter="<?php echo esc_attr( $slug ); ?>">
							<?php
							get_template_part(
								'template-parts/components/button',
								null,
								array(
									'href'    => $url,
									'icon'    => $is_current && '' !== $slug ? 'close' : '',
									'label'   => $label,
									'variant' => $is_current ? 'primary' : 'secondary',
								)
							);
							?>
						</li>
					<?php endforeach; ?>
				</ul>
			</nav>
			<form class="orlyata-notes__search" method="get" role="search" data-archive-content-reveal>
				<?php foreach ( $current_categories as $current_category ) : ?>
					<input type="hidden" name="orlyata_notes_choir" value="<?php echo esc_attr( $current_category ); ?>">
				<?php endforeach; ?>
				<?php
				get_template_part(
					'template-parts/components/search-input',
					null,
					array(
						'id'          => 'notes-search',
						'name'        => 'q',
						'placeholder' => __( 'Поиск по названию, автору', 'orlyata' ),
						'value'       => $notes_search,
					)
				);
				?>
			</form>
			<div class="orlyata-notes__loading" data-notes-loading role="status" aria-live="polite" hidden>
				<span class="screen-reader-text"><?php esc_html_e( 'Идёт поиск', 'orlyata' ); ?></span>
				<span class="orlyata-button__loading-dots" aria-hidden="true"><span class="orlyata-button__loading-dot"></span><span class="orlyata-button__loading-dot"></span><span class="orlyata-button__loading-dot"></span></span>
			</div>
			<section class="orlyata-notes__empty" data-notes-empty aria-live="polite"<?php echo '' !== $notes_search && ! $notes_has_results ? '' : ' hidden'; ?>>
				<img class="orlyata-notes__empty-icon" src="<?php echo esc_url( get_theme_file_uri( 'assets/icons/notes-search-empty.svg' ) ); ?>" alt="">
				<h2 class="orlyata-notes__empty-title"><?php esc_html_e( 'Ничего не нашли...', 'orlyata' ); ?></h2>
				<p class="orlyata-notes__empty-copy"><?php esc_html_e( 'Проверьте, вы нигде не ошиблись при вводе запроса?', 'orlyata' ); ?></p>
			</section>
			<div class="orlyata-notes__table" data-archive-content-reveal<?php echo '' !== $notes_search && ! $notes_has_results ? ' hidden' : ''; ?>>
				<?php
				get_template_part(
					'template-parts/components/data-table',
					null,
					array(
						'headers'        => array( __( 'Название произведения', 'orlyata' ), __( 'Автор', 'orlyata' ), __( 'Хор', 'orlyata' ), __( 'Скачать файл', 'orlyata' ) ),
						'hidden_rows'    => $notes_preview_hidden_rows,
						'row_categories' => $notes_preview_categories,
						'rows'           => $notes_preview_rows,
						'row_links'      => $notes_preview_links,
						'variant'        => 'notes',
					)
				);
				?>
			</div>
			<?php get_template_part( 'template-parts/layout/footer' ); ?>
		</div>
	</main>
</div>
<?php
get_footer();
