<?php
// phpcs:ignoreFile WordPress.Files.FileName.NotHyphenatedLowercase -- The WordPress template hierarchy requires the CPT post-type underscore.
/**
 * Photo album desktop preview.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;

$photo_album_preview_images = array(
	'Frame 4264.png',
	'Frame 4268.png',
	'Frame 4261.png',
	'Frame 4269.png',
	'Frame 4266.png',
	'Frame 4267.png',
	'Frame 4262.png',
	'Frame 4259.png',
	'Frame 4260.png',
	'Frame 4275.png',
);
$photo_album_image_dimensions = array(
	'Frame 4264.png' => array( 'width' => 1500, 'height' => 1001 ),
	'Frame 4268.png' => array( 'width' => 1500, 'height' => 1001 ),
	'Frame 4261.png' => array( 'width' => 1500, 'height' => 1001 ),
	'Frame 4269.png' => array( 'width' => 1500, 'height' => 1001 ),
	'Frame 4266.png' => array( 'width' => 1500, 'height' => 1001 ),
	'Frame 4267.png' => array( 'width' => 1500, 'height' => 1500 ),
	'Frame 4262.png' => array( 'width' => 1500, 'height' => 1002 ),
	'Frame 4259.png' => array( 'width' => 1500, 'height' => 2000 ),
	'Frame 4260.png' => array( 'width' => 1500, 'height' => 1001 ),
	'Frame 4275.png' => array( 'width' => 1500, 'height' => 1500 ),
);
$photo_album_preview_title  = __( 'XI Московский областной открытый конкурс хоров мальчиков Подмосковья', 'orlyata' );
$photo_album_related_rows = array(
	array( __( "Гала-концерт в БЗК (юноши и Вита Нова)", "orlyata" ), __( "13 июля", "orlyata" ), __( "Выступления", "orlyata" ) ),
	array( __( "Концерт в КЦ «Зеленоград»", "orlyata" ), __( "10 июля", "orlyata" ), __( "Выступления", "orlyata" ) ),
	array( __( "Творческий вечер с участием студентов", "orlyata" ), __( "25 июля", "orlyata" ), __( "Отдых", "orlyata" ) ),
	array( __( "Репетиция для нового спектакля", "orlyata" ), __( "5 августа", "orlyata" ), __( "Выступления", "orlyata" ) ),
	array( __( "Открытие нового учебного года", "orlyata" ), __( "1 сентября", "orlyata" ), __( "Выступления", "orlyata" ) ),
	array( __( "Концерт для родителей и друзей", "orlyata" ), __( "10 сентября", "orlyata" ), __( "Выступления", "orlyata" ) ),
	array( __( "Мастер-класс по актерскому мастерству", "orlyata" ), __( "15 сентября", "orlyata" ), __( "Обучение", "orlyata" ) ),
	array( __( "Творческий фестиваль «Культурные горизонты»", "orlyata" ), __( "20 сентября", "orlyata" ), __( "Выступления", "orlyata" ) ),
	array( __( "Выставка работ студентов", "orlyata" ), __( "30 сентября", "orlyata" ), __( "Отдых", "orlyata" ) ),
	array( __( "Гастроли в соседнем городе", "orlyata" ), __( "10 октября", "orlyata" ), __( "Выступления", "orlyata" ) ),
);
$photo_album_related_links = array_fill( 0, count( $photo_album_related_rows ), home_url( "/mediagalereya/foto/" ) );
$photo_album_permalink      = get_permalink();
$photo_archive_url          = get_post_type_archive_link( 'photo_album' );

get_header();
?>
<div class="orlyata-photo-album-detail">
	<?php get_template_part( 'template-parts/layout/sidebar' ); ?>
	<main class="orlyata-photo-album-detail__content" id="main">
		<?php
		get_template_part(
			'template-parts/components/page-hero',
			null,
			array(
				'back_label'  => __( 'Вернуться к списку фотоальбомов', 'orlyata' ),
				'back_url'    => is_string( $photo_archive_url ) ? $photo_archive_url : home_url( '/mediagalereya/foto/' ),
				'image_src'   => get_theme_file_uri( 'assets/images/news/bg-hero2.png' ),
				'meta'        => __( '13 августа  •  Фото', 'orlyata' ),
				'share_label' => __( 'Поделиться фотоальбомом', 'orlyata' ),
				'share_links' => array(
					array(
						'icon'  => get_theme_file_uri( 'assets/icons/share/vk.svg' ),
						'label' => __( 'Поделиться во Вконтакте', 'orlyata' ),
						'url'   => 'https://vk.com/share.php?url=' . rawurlencode( $photo_album_permalink ) . '&title=' . rawurlencode( $photo_album_preview_title ),
					),
					array(
						'icon'  => get_theme_file_uri( 'assets/icons/share/telegram.svg' ),
						'label' => __( 'Поделиться в Telegram', 'orlyata' ),
						'url'   => 'https://t.me/share/url?url=' . rawurlencode( $photo_album_permalink ) . '&text=' . rawurlencode( $photo_album_preview_title ),
					),
					array(
						'icon'  => get_theme_file_uri( 'assets/icons/share/copy-link.svg' ),
						'label' => __( 'Скопировать ссылку на фотоальбом', 'orlyata' ),
						'type'  => 'copy',
						'url'   => $photo_album_permalink,
					),
				),
				'title'       => $photo_album_preview_title,
				'title_id'    => 'photo-album-detail-title',
				'variant'     => 'news-detail',
			)
		);
		?>
		<div class="orlyata-photo-album-detail__body">
			<article class="orlyata-photo-album-detail__article" aria-labelledby="photo-album-detail-title">
				<section class="orlyata-photo-album-detail__gallery" aria-label="<?php esc_attr_e( 'Фотографии альбома', 'orlyata' ); ?>" data-photo-album-gallery data-photo-album-reveal>
					<?php foreach ( array_chunk( $photo_album_preview_images, 5 ) as $photo_album_row_index => $photo_album_row_images ) : ?>
						<?php $photo_album_is_complete_row = 5 === count( $photo_album_row_images ); ?>
						<div class="orlyata-photo-album-detail__row<?php echo ! $photo_album_is_complete_row ? ' orlyata-photo-album-detail__row--incomplete' : ''; ?><?php echo $photo_album_is_complete_row && 1 === $photo_album_row_index % 2 ? ' orlyata-photo-album-detail__row--mirrored' : ''; ?>">
							<?php foreach ( $photo_album_row_images as $photo_album_index => $photo_album_image ) : ?>
								<?php
								$photo_album_global_index     = ( $photo_album_row_index * 5 ) + $photo_album_index;
								$photo_album_image_dimension  = $photo_album_image_dimensions[ $photo_album_image ];
								$photo_album_is_large       = $photo_album_is_complete_row && 0 === $photo_album_index;
								$photo_album_preview_variant = $photo_album_is_large ? "large" : "small";
								$photo_album_preview_image   = pathinfo( $photo_album_image, PATHINFO_FILENAME ) . "-" . $photo_album_preview_variant . ".webp";
								$photo_album_preview_width   = "large" === $photo_album_preview_variant ? 800 : 400;
								$photo_album_preview_height  = "large" === $photo_album_preview_variant ? 620 : 310;

								/* translators: %d: sequential photo number. */
								$photo_album_link_label = sprintf( __( 'Открыть фотографию %d', 'orlyata' ), $photo_album_global_index + 1 );
								?>
								<a class="orlyata-photo-album-detail__photo<?php echo $photo_album_is_large ? ' orlyata-photo-album-detail__photo--large' : ''; ?>" href="<?php echo esc_url( get_theme_file_uri( 'assets/images/album/' . $photo_album_image ) ); ?>" data-photo-album-gallery-item data-pswp-width="<?php echo esc_attr( (string) $photo_album_image_dimension['width'] ); ?>" data-pswp-height="<?php echo esc_attr( (string) $photo_album_image_dimension['height'] ); ?>" aria-label="<?php echo esc_attr( $photo_album_link_label ); ?>">
									<img src="<?php echo esc_url( get_theme_file_uri( "assets/images/album/previews/" . $photo_album_preview_image ) ); ?>" width="<?php echo esc_attr( (string) $photo_album_preview_width ); ?>" height="<?php echo esc_attr( (string) $photo_album_preview_height ); ?>" alt="" loading="<?php echo 0 === $photo_album_global_index ? "eager" : "lazy"; ?>" decoding="async">
								</a>
							<?php endforeach; ?>
						</div>
					<?php endforeach; ?>
				</section>
			</article>
			<section class="orlyata-photo-album-detail__related" aria-labelledby="photo-album-related-title">
				<div class="orlyata-photo-album-detail__related-head">
					<h2 class="type-heading-2" id="photo-album-related-title"><?php esc_html_e( "Другие фотоальбомы", "orlyata" ); ?></h2>
				</div>
				<div class="orlyata-photo-album-detail__related-table">
					<?php
					get_template_part(
						"template-parts/components/data-table",
						null,
						array(
							"headers"   => array( __( "Название", "orlyata" ), __( "Дата", "orlyata" ), __( "Тип", "orlyata" ), __( "Открыть фотогалерею", "orlyata" ) ),
							"row_links" => $photo_album_related_links,
							"rows"      => $photo_album_related_rows,
							"variant"   => "photo",
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
