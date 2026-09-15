<?php
/**
 * News card component.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;

$news_card_args = wp_parse_args(
	is_array( $args ?? null ) ? $args : array(),
	array(
		'category' => '',
		'category_slug' => 'news',
		'title'    => '',
		'url'      => '',
	)
);

$news_card_title = is_string( $news_card_args['title'] ) ? trim( $news_card_args['title'] ) : '';
$url             = is_string( $news_card_args['url'] ) ? trim( $news_card_args['url'] ) : '';
$category        = is_string( $news_card_args['category'] ) ? trim( $news_card_args['category'] ) : '';
$category_slug   = is_string( $news_card_args['category_slug'] ) ? sanitize_key( $news_card_args['category_slug'] ) : 'news';
$category_icons = array(
	'news'         => 'news-category-news.png',
	'announcement' => 'news-category-announcement.png',
	'achievement'  => 'news-category-achievement.png',
);
$category_icon  = $category_icons[$category_slug] ?? $category_icons['news'];
$icon_uri       = get_theme_file_uri( 'assets/icons/' . $category_icon );

if ( '' === $news_card_title || '' === $url || '' === $category ) {
	return;
}
?>
<article class="orlyata-news-card">
	<a class="orlyata-news-card__link" href="<?php echo esc_url( $url ); ?>">
		<h3 class="orlyata-news-card__title"><span class="orlyata-news-card__title-label" data-text="<?php echo esc_attr( $news_card_title ); ?>"><?php echo esc_html( $news_card_title ); ?></span></h3>
	</a>
	<div class="orlyata-news-card__meta">
		<?php get_template_part( 'template-parts/components/badge', null, array( 'label' => $category ) ); ?>
		<?php get_template_part( 'template-parts/components/badge', null, array( 'icon_uri' => $icon_uri, 'variant' => 'icon' ) ); ?>
	</div>
</article>
