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
	$news_category = $news_terms[0]->name;
}

$news_meta = sprintf(
	/* translators: 1: publication date, 2: news category. */
	__( '%1$s • %2$s', 'orlyata' ),
	get_the_date( 'j F' ),
	$news_category
);
$news_share_url   = rawurlencode( $news_permalink );
$news_share_title = rawurlencode( get_the_title() );

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
						'label' => __( 'Поделиться во ВКонтакте', 'orlyata' ),
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
			<?php get_template_part( 'template-parts/layout/footer' ); ?>
		</div>
	</main>
</div>
<?php
get_footer();
