<?php
/**
 * Single news desktop preview.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;

$news_permalink   = get_permalink();
$news_archive_url = get_post_type_archive_link( 'news' );
$news_terms       = get_the_terms( get_the_ID(), 'orlyata_news_category' );
$news_category    = __( 'Новость', 'orlyata' );

if ( is_array( $news_terms ) && isset( $news_terms[0] ) && $news_terms[0] instanceof WP_Term ) {
	$news_category = match ( $news_terms[0]->slug ) {
		'news'         => __( 'Новость', 'orlyata' ),
		'announcement' => __( 'Объявление', 'orlyata' ),
		'achievement'  => __( 'Достижение', 'orlyata' ),
		default        => $news_terms[0]->name,
	};
}

$news_meta = sprintf(
	/* translators: 1: publication date, 2: news category. */
	__( '%1$s • %2$s', 'orlyata' ),
	get_the_date( 'j F' ),
	$news_category
);
$news_share_url          = rawurlencode( $news_permalink );
$news_share_title        = rawurlencode( get_the_title() );
$news_summary            = trim( (string) get_post_meta( get_the_ID(), 'orlyata_news_summary', true ) );
$news_body_after_gallery = trim( (string) get_post_meta( get_the_ID(), 'orlyata_news_body_after_gallery', true ) );
$news_gallery_ids        = array_slice( OrlyataCore\Content\Media::sanitize_image_attachment_ids( get_post_meta( get_the_ID(), 'orlyata_news_gallery_ids', true ) ), 0, 10 );
$news_gallery_images     = array();

foreach ( $news_gallery_ids as $news_gallery_id ) {
	$news_gallery_images[] = array(
		'attachment_id' => $news_gallery_id,
		'alt'           => get_post_meta( $news_gallery_id, '_wp_attachment_image_alt', true ),
	);
}

if ( array() === $news_gallery_images ) {
	$news_gallery_images = array(
		array(
			'src' => get_theme_file_uri( 'assets/images/about/life.png' ),
			'alt' => __( 'Выступление хоровой капеллы «Орлята»', 'orlyata' ),
		),
		array(
			'src' => get_theme_file_uri( 'assets/images/about/win.jpg' ),
			'alt' => __( 'Участники хоровой капеллы «Орлята»', 'orlyata' ),
		),
		array(
			'src' => get_theme_file_uri( 'assets/images/about/otdykh.jpeg' ),
			'alt' => __( 'Жизнь хоровой капеллы «Орлята»', 'orlyata' ),
		),
	);
}

get_header();
?>
<div class="orlyata-news-detail">
	<?php get_template_part( 'template-parts/layout/sidebar' ); ?>
	<main class="orlyata-news-detail__content" id="main">
		<?php
		get_template_part(
			'template-parts/components/page-hero',
			null,
			array(
				'back_label'  => __( 'Вернуться к списку новостей', 'orlyata' ),
				'back_url'    => is_string( $news_archive_url ) ? $news_archive_url : home_url( '/novosti/' ),
				'image_src'   => get_theme_file_uri( 'assets/images/news/bg-hero2.png' ),
				'meta'        => $news_meta,
				'share_links' => array(
					array(
						'icon'  => get_theme_file_uri( 'assets/icons/share/vk.svg' ),
						'label' => __( 'Поделиться во Вконтакте', 'orlyata' ),
						'url'   => 'https://vk.com/share.php?url=' . $news_share_url . '&title=' . $news_share_title,
					),
					array(
						'icon'  => get_theme_file_uri( 'assets/icons/share/telegram.svg' ),
						'label' => __( 'Поделиться в Telegram', 'orlyata' ),
						'url'   => 'https://t.me/share/url?url=' . $news_share_url . '&text=' . $news_share_title,
					),
					array(
						'icon'  => get_theme_file_uri( 'assets/icons/share/copy-link.svg' ),
						'label' => __( 'Скопировать ссылку на новость', 'orlyata' ),
						'type'  => 'copy',
						'url'   => $news_permalink,
					),
				),
				'title'       => get_the_title(),
				'title_id'    => 'news-detail-title',
				'variant'     => 'news-detail',
			)
		);
		?>
		<div class="orlyata-news-detail__body">
			<article class="orlyata-news-detail__article" aria-labelledby="news-detail-title">
				<?php if ( '' !== $news_summary ) : ?>
					<p class="orlyata-news-detail__summary type-heading-3"><?php echo esc_html( $news_summary ); ?></p>
				<?php endif; ?>

				<?php if ( '' !== trim( get_the_content() ) ) : ?>
					<div class="orlyata-news-detail__copy type-body"><?php the_content(); ?></div>
				<?php endif; ?>

				<section class="orlyata-news-detail__gallery" aria-label="<?php esc_attr_e( 'Фотографии новости', 'orlyata' ); ?>" data-news-gallery data-news-gallery-active="0">
					<div class="orlyata-news-detail__gallery-viewport">
						<div class="orlyata-news-detail__gallery-track">
							<?php foreach ( $news_gallery_images as $news_gallery_image ) : ?>
								<div class="orlyata-news-detail__gallery-slide">
									<?php if ( isset( $news_gallery_image['attachment_id'] ) ) : ?>
										<?php
										echo wp_get_attachment_image(
											(int) $news_gallery_image['attachment_id'],
											'large',
											false,
											array(
												'class'   => 'orlyata-news-detail__gallery-image',
												'alt'     => (string) $news_gallery_image['alt'],
												'loading' => 'lazy',
												'sizes'   => '(min-width: 1280px) var(--news-detail-article-width), 100vw',
											)
										);
										?>
									<?php else : ?>
										<img class="orlyata-news-detail__gallery-image" src="<?php echo esc_url( (string) $news_gallery_image['src'] ); ?>" alt="<?php echo esc_attr( (string) $news_gallery_image['alt'] ); ?>" loading="lazy">
									<?php endif; ?>
								</div>
							<?php endforeach; ?>
						</div>
					</div>
					<?php if ( count( $news_gallery_images ) > 1 ) : ?>
						<div class="orlyata-news-detail__gallery-arrows" aria-label="<?php esc_attr_e( 'Переключение фотографий', 'orlyata' ); ?>">
							<?php
							get_template_part(
								'template-parts/components/button',
								null,
								array(
									'variant'    => 'arrow-left-muted',
									'aria_label' => __( 'Предыдущая фотография', 'orlyata' ),
								)
							);
							?>
							<?php
							get_template_part(
								'template-parts/components/button',
								null,
								array(
									'variant'    => 'arrow-right-muted',
									'aria_label' => __( 'Следующая фотография', 'orlyata' ),
								)
							);
							?>
						</div>
						<div class="orlyata-news-detail__gallery-pagination" aria-label="<?php esc_attr_e( 'Выбор фотографии', 'orlyata' ); ?>" role="group">
							<?php foreach ( $news_gallery_images as $news_gallery_index => $news_gallery_image ) : ?>
								<?php // translators: %d: sequential photo number. ?>
								<button class="orlyata-news-detail__gallery-pagination-button<?php echo 0 === $news_gallery_index ? ' is-active' : ''; ?>" type="button" aria-label="<?php echo esc_attr( sprintf( __( 'Фотография %d', 'orlyata' ), $news_gallery_index + 1 ) ); ?>" aria-pressed="<?php echo 0 === $news_gallery_index ? 'true' : 'false'; ?>" data-news-gallery-select="<?php echo esc_attr( (string) $news_gallery_index ); ?>"></button>
							<?php endforeach; ?>
						</div>
					<?php endif; ?>
				</section>

				<?php if ( '' !== $news_body_after_gallery ) : ?>
					<div class="orlyata-news-detail__copy orlyata-news-detail__copy--after-gallery type-body"><p><?php echo nl2br( esc_html( $news_body_after_gallery ) ); ?></p></div>
				<?php endif; ?>

				<div class="orlyata-news-detail__category">
					<?php get_template_part( 'template-parts/components/badge', null, array( 'label' => $news_category ) ); ?>
				</div>
			</article>
			<?php get_template_part( 'template-parts/layout/footer' ); ?>
		</div>
	</main>
</div>
<?php
get_footer();
