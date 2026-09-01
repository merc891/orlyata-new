<?php
/**
 * Media gallery desktop preview.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;

$media_gallery_preview_assets = array(
	'hero'          => get_theme_file_uri( 'assets/images/about/img271.png' ),
	'media_feature' => get_theme_file_uri( 'assets/images/home/media-feature.png' ),
	'media_photo'   => get_theme_file_uri( 'assets/images/home/media-photo.png' ),
	'media_video'   => get_theme_file_uri( 'assets/images/home/media-video.png' ),
);

$photo_gallery_preview_rows           = array(
	array( __( 'Гала-концерт в БЗК (юноши и Вита Нова)', 'orlyata' ), __( '13 июля', 'orlyata' ), __( 'Выступления', 'orlyata' ) ),
	array( __( 'Концерт в КЦ «Зеленоград»', 'orlyata' ), __( '10 июля', 'orlyata' ), __( 'Выступления', 'orlyata' ) ),
	array( __( 'Творческий вечер с участием студентов', 'orlyata' ), __( '25 июля', 'orlyata' ), __( 'Отдых', 'orlyata' ) ),
	array( __( 'Репетиция для нового спектакля', 'orlyata' ), __( '5 августа', 'orlyata' ), __( 'Выступления', 'orlyata' ) ),
	array( __( 'Открытие нового учебного года', 'orlyata' ), __( '1 сентября', 'orlyata' ), __( 'Выступления', 'orlyata' ) ),
	array( __( 'Концерт для родителей и друзей', 'orlyata' ), __( '10 сентября', 'orlyata' ), __( 'Выступления', 'orlyata' ) ),
	array( __( 'Мастер-класс по актерскому мастерству', 'orlyata' ), __( '15 сентября', 'orlyata' ), __( 'Обучение', 'orlyata' ) ),
	array( __( 'Творческий фестиваль «Культурные горизонты»', 'orlyata' ), __( '20 сентября', 'orlyata' ), __( 'Выступления', 'orlyata' ) ),
	array( __( 'Выставка работ студентов', 'orlyata' ), __( '30 сентября', 'orlyata' ), __( 'Отдых', 'orlyata' ) ),
	array( __( 'Гастроли в соседнем городе', 'orlyata' ), __( '10 октября', 'orlyata' ), __( 'Выступления', 'orlyata' ) ),
);
$photo_gallery_preview_links          = array_fill( 0, count( $photo_gallery_preview_rows ), home_url( '/mediagalereya/foto/xi-konkurs-khorov-malchikov-podmoskovya/' ) );
$video_gallery_preview_links          = array_fill( 0, count( $photo_gallery_preview_rows ), home_url( '/mediagalereya/video/' ) );
$video_gallery_preview_provider_icons = array( 'youtube', 'rutube', 'vk', 'youtube', 'rutube', 'vk', 'youtube', 'rutube', 'vk', 'youtube' );

get_header();
?>
<div class="orlyata-media-gallery">
	<?php get_template_part( 'template-parts/layout/sidebar' ); ?>
	<main class="orlyata-media-gallery__content" id="main">
		<?php
		get_template_part(
			'template-parts/components/page-hero',
			null,
			array(
				'image_src' => $media_gallery_preview_assets['hero'],
				'title'     => __( 'Медиагалерея', 'orlyata' ),
				'title_id'  => 'media-gallery-title',
			)
		);
		?>
		<div class="orlyata-media-gallery__body">
			<section class="orlyata-media-gallery__section">
				<div class="orlyata-media-gallery__grid">
					<?php
					get_template_part(
						'template-parts/components/media-card',
						null,
						array(
							'date'       => __( '10 июня', 'orlyata' ),
							'image_alt'  => __( 'Выступление капеллы на гала-концерте', 'orlyata' ),
							'image_url'  => $media_gallery_preview_assets['media_feature'],
							'media_type' => 'video',
							'provider'   => 'RuTube',
							'size'       => 'big',
							'title'      => __( 'Гала-концерт в БЗК (юноши и Вита Нова)', 'orlyata' ),
							'url'        => 'https://rutube.ru/play/embed/2ad60bfd20027143c2eac71acdb5faef/',
						)
					);
					get_template_part(
						'template-parts/components/media-card',
						null,
						array(
							'date'       => __( '23 мая', 'orlyata' ),
							'image_alt'  => __( 'Концерт капеллы в Зеленограде', 'orlyata' ),
							'image_url'  => $media_gallery_preview_assets['media_video'],
							'media_type' => 'video',
							'provider'   => 'RuTube',
							'size'       => 'small',
							'title'      => __( 'Концерт в КЦ «Зеленоград»', 'orlyata' ),
							'url'        => home_url( '/mediagalereya/video/' ),
						)
					);
					get_template_part(
						'template-parts/components/media-card',
						null,
						array(
							'date'       => __( '14 мая', 'orlyata' ),
							'image_alt'  => __( 'Участники капеллы', 'orlyata' ),
							'image_url'  => $media_gallery_preview_assets['media_photo'],
							'media_type' => 'photo',
							'size'       => 'small',
							'title'      => __( 'Концерт лауреатов фестиваля-конкурса VIVAT MUSICA', 'orlyata' ),
							'url'        => home_url( '/mediagalereya/foto/' ),
						)
					);
					?>
				</div>
			</section>

			<section class="orlyata-media-gallery__media-list-section" aria-labelledby="media-gallery-photo-title" data-media-gallery-reveal>
				<div class="orlyata-media-gallery__media-list-section-head">
					<h2 class="type-heading-2" id="media-gallery-photo-title"><?php esc_html_e( 'Фото', 'orlyata' ); ?></h2>
					<?php
					get_template_part(
						'template-parts/components/text-link',
						null,
						array(
							'href'    => home_url( '/mediagalereya/foto/' ),
							'has_chevron' => true,
							'label'   => __( 'Перейти в раздел', 'orlyata' ),
							'variant' => 'color',
						)
					);
					?>
				</div>
				<div class="orlyata-media-gallery__media-list-table">
					<?php
					get_template_part(
						'template-parts/components/data-table',
						null,
						array(
							'headers'   => array( __( 'Название', 'orlyata' ), __( 'Дата', 'orlyata' ), __( 'Тип', 'orlyata' ), __( 'Открыть фотогалерею', 'orlyata' ) ),
							'rows'      => $photo_gallery_preview_rows,
							'row_links' => $photo_gallery_preview_links,
							'variant'   => 'photo',
						)
					);
					?>
				</div>
			</section>

			<section class="orlyata-media-gallery__media-list-section" aria-labelledby="media-gallery-video-title" data-media-gallery-reveal>
				<div class="orlyata-media-gallery__media-list-section-head">
					<h2 class="type-heading-2" id="media-gallery-video-title"><?php esc_html_e( 'Видео', 'orlyata' ); ?></h2>
					<?php
					get_template_part(
						'template-parts/components/text-link',
						null,
						array(
							'href'    => home_url( '/mediagalereya/video/' ),
							'has_chevron' => true,
							'label'   => __( 'Перейти в раздел', 'orlyata' ),
							'variant' => 'color',
						)
					);
					?>
				</div>
				<div class="orlyata-media-gallery__media-list-table">
					<?php
					get_template_part(
						'template-parts/components/data-table',
						null,
						array(
							'headers'            => array( __( 'Название', 'orlyata' ), __( 'Дата', 'orlyata' ), __( 'Тип', 'orlyata' ), __( 'Открыть видеогалерею', 'orlyata' ) ),
							'rows'               => $photo_gallery_preview_rows,
							'row_links'          => $video_gallery_preview_links,
							'row_provider_icons' => $video_gallery_preview_provider_icons,
							'variant'            => 'video',
						)
					);
					?>
				</div>
			</section>
			<?php get_template_part( 'template-parts/layout/footer' ); ?>
		</div>
	</main>
</div>
<?php
get_footer();
