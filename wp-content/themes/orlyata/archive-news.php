<?php
/**
 * News archive desktop preview.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;

$news_categories = array(
	''             => __( 'Все', 'orlyata' ),
	'news'         => __( 'Новости', 'orlyata' ),
	'announcement' => __( 'Объявления', 'orlyata' ),
	'achievement'  => __( 'Достижения', 'orlyata' ),
);
// phpcs:ignore WordPress.Security.NonceVerification.Recommended,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- Read-only public URL values are individually sanitised below.
$requested_categories     = isset( $_GET['orlyata_news_category'] ) && is_string( $_GET['orlyata_news_category'] ) ? explode( ',', wp_unslash( $_GET['orlyata_news_category'] ) ) : array();
$current_categories       = array_values( array_intersect( array_keys( $news_categories ), array_map( 'sanitize_key', $requested_categories ) ) );
$current_categories       = array_values( array_filter( $current_categories ) );
$archive_url              = get_post_type_archive_link( 'news' );
$news_preview_source_rows = array(
	array( __( 'Расписание капеллы на 2025-2026 год', 'orlyata' ), __( '13 июля', 'orlyata' ), __( 'Новости', 'orlyata' ), 'news' ),
	array( __( 'ВНИМАНИЕ! Продолжается набор в хоровую капеллу на новый учебный год!', 'orlyata' ), __( '10 июля', 'orlyata' ), __( 'Объявления', 'orlyata' ), 'announcement' ),
	array( __( 'Концерт классической музыки', 'orlyata' ), __( '15 июля', 'orlyata' ), __( 'Новости', 'orlyata' ), 'news' ),
	array( __( 'Запись на индивидуальные занятия по вокалу', 'orlyata' ), __( '20 июля', 'orlyata' ), __( 'Объявления', 'orlyata' ), 'announcement' ),
	array( __( 'Творческий вечер с участием студентов', 'orlyata' ), __( '25 июля', 'orlyata' ), __( 'Новости', 'orlyata' ), 'news' ),
	array( __( 'Начало летних мастер-классов по музыке', 'orlyata' ), __( '30 июля', 'orlyata' ), __( 'Объявления', 'orlyata' ), 'announcement' ),
	array( __( 'Репетиция для нового спектакля', 'orlyata' ), __( '5 августа', 'orlyata' ), __( 'Новости', 'orlyata' ), 'news' ),
	array( __( 'Открытие нового учебного года', 'orlyata' ), __( '1 сентября', 'orlyata' ), __( 'Объявления', 'orlyata' ), 'announcement' ),
	array( __( 'Концерт для родителей и друзей', 'orlyata' ), __( '10 сентября', 'orlyata' ), __( 'Новости', 'orlyata' ), 'news' ),
	array( __( 'Запуск нового проекта «Музыка мира»', 'orlyata' ), __( '15 сентября', 'orlyata' ), __( 'Объявления', 'orlyata' ), 'announcement' ),
	array( __( 'Гастроли по городам России', 'orlyata' ), __( '20 сентября', 'orlyata' ), __( 'Новости', 'orlyata' ), 'news' ),
	array( __( 'Встреча с известными композиторами', 'orlyata' ), __( '25 сентября', 'orlyata' ), __( 'Объявления', 'orlyata' ), 'announcement' ),
	array( __( 'Фестиваль молодых исполнителей', 'orlyata' ), __( '5 октября', 'orlyata' ), __( 'Достижения', 'orlyata' ), 'achievement' ),
	array( __( 'Конкурс хоровых коллективов', 'orlyata' ), __( '15 октября', 'orlyata' ), __( 'Достижения', 'orlyata' ), 'achievement' ),
	array( __( 'Творческая поездка в Европу', 'orlyata' ), __( '25 октября', 'orlyata' ), __( 'Новости', 'orlyata' ), 'news' ),
	array( __( 'Запись на зимние курсы', 'orlyata' ), __( '1 ноября', 'orlyata' ), __( 'Объявления', 'orlyata' ), 'announcement' ),
	array( __( 'Концерт в поддержку благотворительности', 'orlyata' ), __( '10 ноября', 'orlyata' ), __( 'Новости', 'orlyata' ), 'news' ),
	array( __( 'Мастер-класс по композиции', 'orlyata' ), __( '20 ноября', 'orlyata' ), __( 'Объявления', 'orlyata' ), 'announcement' ),
	array( __( 'Репетиция перед новогодним концертом', 'orlyata' ), __( '1 декабря', 'orlyata' ), __( 'Новости', 'orlyata' ), 'news' ),
	array( __( 'Закрытие учебного года', 'orlyata' ), __( '15 декабря', 'orlyata' ), __( 'Объявления', 'orlyata' ), 'announcement' ),
	array( __( 'Годовой отчет о деятельности капеллы', 'orlyata' ), __( '20 декабря', 'orlyata' ), __( 'Новости', 'orlyata' ), 'news' ),
	array( __( 'Участие в международном фестивале', 'orlyata' ), __( '5 января', 'orlyata' ), __( 'Достижения', 'orlyata' ), 'achievement' ),
	array( __( 'Зимний концерт с классической музыкой', 'orlyata' ), __( '10 января', 'orlyata' ), __( 'Новости', 'orlyata' ), 'news' ),
);
$news_preview_items       = array_slice( array_merge( $news_preview_source_rows, $news_preview_source_rows, $news_preview_source_rows ), 0, 50 );
$news_preview_rows        = array();
$news_preview_categories  = array();
foreach ( $news_preview_items as $news_preview_item ) {
	$news_preview_category     = isset( $news_preview_item[3] ) && is_string( $news_preview_item[3] ) ? $news_preview_item[3] : '';
	$news_preview_rows[]       = array_slice( $news_preview_item, 0, 3 );
	$news_preview_categories[] = $news_preview_category;
}
$news_preview_hidden_rows = array_map(
	static function ( $news_preview_category ) use ( $current_categories ) {
		return array() !== $current_categories && ! in_array( $news_preview_category, $current_categories, true );
	},
	$news_preview_categories
);
$news_preview_detail_url  = home_url( '/novosti/pochetnyy-rabotnik-kultury-goroda-moskvy/' );
$news_preview_links       = array_fill( 0, count( $news_preview_rows ), $news_preview_detail_url );

get_header();
?>
<div class="orlyata-news">
	<?php get_template_part( 'template-parts/layout/sidebar' ); ?>
	<main class="orlyata-news__content" id="main">
		<?php
		get_template_part(
			'template-parts/components/page-hero',
			null,
			array(
				'image_src' => get_theme_file_uri( 'assets/images/about/img271.png' ),
				'title'     => __( 'Новости', 'orlyata' ),
				'title_id'  => 'news-title',
			)
		);
		?>
		<div class="orlyata-news__body">
				<nav class="orlyata-news__filters" aria-label="<?php esc_attr_e( 'Категории новостей', 'orlyata' ); ?>" data-archive-content-reveal data-news-filters data-table-filters data-table-filter-parameter="orlyata_news_category" data-table-filter-multiple="true" data-news-close-icon="<?php echo esc_url( get_theme_file_uri( 'assets/icons/button-close.svg' ) ); ?>">
				<ul class="orlyata-news__filter-list">
					<?php foreach ( $news_categories as $slug => $label ) : ?>
						<?php
						$is_current      = '' === $slug ? array() === $current_categories : in_array( $slug, $current_categories, true );
						$next_categories = '' === $slug ? array() : ( $is_current ? array_values( array_diff( $current_categories, array( $slug ) ) ) : array_merge( $current_categories, array( $slug ) ) );
						$url             = array() === $next_categories ? $archive_url : add_query_arg( 'orlyata_news_category', implode( ',', $next_categories ), $archive_url );
						?>
						<li class="orlyata-news__filter-item" data-news-filter="<?php echo esc_attr( $slug ); ?>" data-table-filter="<?php echo esc_attr( $slug ); ?>">
							<?php
							get_template_part(
								'template-parts/components/button',
								null,
								array(
									'href'    => $url,
									'icon'    => $is_current && '' !== $slug ? 'close' : '',
									'label'   => $label,
									'size'    => 'archive-filter',
									'variant' => $is_current ? 'primary' : 'secondary',
								)
							);
							?>
						</li>
					<?php endforeach; ?>
				</ul>
			</nav>
			<div class="orlyata-news__table" data-archive-content-reveal>
				<?php
				get_template_part(
					'template-parts/components/data-table',
					null,
					array(
						'headers'        => array( __( 'Название', 'orlyata' ), __( 'Дата', 'orlyata' ), __( 'Тип', 'orlyata' ), __( 'Открыть новость', 'orlyata' ) ),
						'hidden_rows'    => $news_preview_hidden_rows,
						'row_categories' => $news_preview_categories,
						'rows'           => $news_preview_rows,
						'row_links'      => $news_preview_links,
						'variant'        => 'news',
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
