<?php
/**
 * Media archive desktop preview.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;

$media_archive_post_type  = is_post_type_archive( 'video' ) ? 'video' : 'photo_album';
$media_archive_is_video   = 'video' === $media_archive_post_type;
$media_archive_title      = $media_archive_is_video ? __( 'Видео', 'orlyata' ) : __( 'Фото', 'orlyata' );
$media_archive_title_id   = $media_archive_is_video ? 'video-archive-title' : 'photo-archive-title';
$media_archive_categories = \OrlyataCore\Content\PostTypes::get_term_definitions()['orlyata_media_category'];
// phpcs:ignore WordPress.Security.NonceVerification.Recommended,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- Read-only public URL values are individually sanitised below.
$media_archive_requested_categories = isset( $_GET['category'] ) && is_string( $_GET['category'] ) ? explode( ',', wp_unslash( $_GET['category'] ) ) : array();
$media_archive_current_categories   = array_values( array_intersect( array_keys( $media_archive_categories ), array_map( 'sanitize_key', $media_archive_requested_categories ) ) );
$media_archive_rows                 = array(
	array( __( 'Гала-концерт в БЗК (юноши и Вита Нова)', 'orlyata' ), __( '13 июля', 'orlyata' ), __( 'Выступления', 'orlyata' ) ),
	array( __( 'Концерт в КЦ «Зеленоград»', 'orlyata' ), __( '10 июля', 'orlyata' ), __( 'Выступления', 'orlyata' ) ),
	array( __( 'Творческий вечер с участием студентов', 'orlyata' ), __( '25 июля', 'orlyata' ), __( 'Отдых', 'orlyata' ) ),
	array( __( 'Репетиция для нового спектакля', 'orlyata' ), __( '5 августа', 'orlyata' ), __( 'Выступления', 'orlyata' ) ),
	array( __( 'Открытие нового учебного года', 'orlyata' ), __( '1 сентября', 'orlyata' ), __( 'Выступления', 'orlyata' ) ),
	array( __( 'Концерт для родителей и друзей', 'orlyata' ), __( '10 сентября', 'orlyata' ), __( 'Выступления', 'orlyata' ) ),
	array( __( 'Мастер-класс по актерскому мастерству', 'orlyata' ), __( '15 сентября', 'orlyata' ), __( 'Занятия', 'orlyata' ) ),
	array( __( 'Творческий фестиваль «Культурные горизонты»', 'orlyata' ), __( '20 сентября', 'orlyata' ), __( 'Выступления', 'orlyata' ) ),
	array( __( 'Выставка работ студентов', 'orlyata' ), __( '30 сентября', 'orlyata' ), __( 'Отдых', 'orlyata' ) ),
	array( __( 'Гастроли в соседнем городе', 'orlyata' ), __( '10 октября', 'orlyata' ), __( 'Разное', 'orlyata' ) ),
);
$media_archive_rows                 = array_slice( array_merge( $media_archive_rows, $media_archive_rows, $media_archive_rows ), 0, 30 );
$media_archive_row_categories       = array_slice( array_merge( array( 'performance', 'performance', 'leisure', 'performance', 'performance', 'performance', 'rehearsal', 'performance', 'leisure', 'other' ), array( 'performance', 'performance', 'leisure', 'performance', 'performance', 'performance', 'rehearsal', 'performance', 'leisure', 'other' ), array( 'performance', 'performance', 'leisure', 'performance', 'performance', 'performance', 'rehearsal', 'performance', 'leisure', 'other' ) ), 0, 30 );
$media_archive_hidden_rows          = array_map(
	static function ( $row_category ) use ( $media_archive_current_categories ) {
		return array() !== $media_archive_current_categories && ! in_array( $row_category, $media_archive_current_categories, true );
	},
	$media_archive_row_categories
);
$media_archive_url                  = get_post_type_archive_link( $media_archive_post_type );
$media_archive_links                = array_fill(
	0,
	count( $media_archive_rows ),
	$media_archive_is_video ? ( is_string( $media_archive_url ) ? $media_archive_url : home_url( '/mediagalereya/' ) ) : home_url( '/mediagalereya/foto/xi-konkurs-khorov-malchikov-podmoskovya/' )
);
$media_archive_provider_icons       = array_slice( array_merge( array( 'youtube', 'rutube', 'vk', 'youtube', 'rutube', 'vk', 'youtube', 'rutube', 'vk', 'youtube' ), array( 'youtube', 'rutube', 'vk', 'youtube', 'rutube', 'vk', 'youtube', 'rutube', 'vk', 'youtube' ), array( 'youtube', 'rutube', 'vk', 'youtube', 'rutube', 'vk', 'youtube', 'rutube', 'vk', 'youtube' ) ), 0, 30 );

/* translators: %s: media archive title. */
$media_archive_aria_label = sprintf( __( 'Список материалов: %s', 'orlyata' ), $media_archive_title );

get_header();
?>
<div class="orlyata-media-gallery orlyata-media-archive">
	<?php get_template_part( 'template-parts/layout/sidebar' ); ?>
	<main class="orlyata-media-archive__content" id="main">
		<?php
		get_template_part(
			'template-parts/components/page-hero',
			null,
			array(
				'back_label' => __( 'Вернуться в медиагалерею', 'orlyata' ),
				'back_url'   => home_url( '/mediagalereya/' ),
				'image_src'  => get_theme_file_uri( 'assets/images/about/img271.png' ),
				'title'      => $media_archive_title,
				'title_id'   => $media_archive_title_id,
				'variant'    => 'archive',
			)
		);
		?>
		<div class="orlyata-media-archive__body">
				<nav class="orlyata-media-archive__filters" aria-label="<?php esc_attr_e( 'Категории медиа', 'orlyata' ); ?>" data-archive-content-reveal data-media-filters data-media-close-icon="<?php echo esc_url( get_theme_file_uri( 'assets/icons/button-close.svg' ) ); ?>">
				<ul class="orlyata-media-archive__filter-list">
					<?php foreach ( array( '' => __( 'Все', 'orlyata' ) ) + $media_archive_categories as $slug => $label ) : ?>
						<?php
						$is_current      = '' === $slug ? array() === $media_archive_current_categories : in_array( $slug, $media_archive_current_categories, true );
						$next_categories = '' === $slug ? array() : ( $is_current ? array_values( array_diff( $media_archive_current_categories, array( $slug ) ) ) : array_merge( $media_archive_current_categories, array( $slug ) ) );
						$url             = array() === $next_categories ? $media_archive_url : add_query_arg( 'category', implode( ',', $next_categories ), $media_archive_url );
						?>
						<li class="orlyata-media-archive__filter-item" data-media-filter="<?php echo esc_attr( $slug ); ?>">
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
			<section class="orlyata-media-archive__table" data-archive-content-reveal aria-label="<?php echo esc_attr( $media_archive_aria_label ); ?>">
				<?php
				get_template_part(
					'template-parts/components/data-table',
					null,
					array(
						'headers'            => array( __( 'Название', 'orlyata' ), __( 'Дата', 'orlyata' ), __( 'Тип', 'orlyata' ), $media_archive_is_video ? __( 'Открыть видеогалерею', 'orlyata' ) : __( 'Открыть фотогалерею', 'orlyata' ) ),
						'hidden_rows'        => $media_archive_hidden_rows,
						'row_categories'     => $media_archive_row_categories,
						'rows'               => $media_archive_rows,
						'row_links'          => $media_archive_links,
						'row_provider_icons' => $media_archive_is_video ? $media_archive_provider_icons : array(),
						'variant'            => $media_archive_is_video ? 'video' : 'photo',
					)
				);
				?>
			</section>
			<?php get_template_part( 'template-parts/layout/footer' ); ?>
		</div>
	</main>
</div>
<?php
get_footer();
