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
			<section class="orlyata-media-gallery__section" aria-labelledby="media-gallery-section-title">
				<div class="orlyata-media-gallery__section-head">
					<h2 class="type-heading-2" id="media-gallery-section-title"><?php esc_html_e( 'Медиагалерея', 'orlyata' ); ?></h2>
					<?php
					get_template_part(
						'template-parts/components/text-link',
						null,
						array(
							'href'    => home_url( '/mediagalereya/' ),
							'label'   => __( 'Перейти в раздел', 'orlyata' ),
							'variant' => 'color',
						)
					);
					?>
				</div>
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
			<?php get_template_part( 'template-parts/layout/footer' ); ?>
		</div>
	</main>
</div>
<?php
get_footer();
