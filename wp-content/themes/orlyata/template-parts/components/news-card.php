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
		'icon_uri' => '',
		'title'    => '',
		'url'      => '',
	)
);

$news_card_title = is_string( $news_card_args['title'] ) ? trim( $news_card_args['title'] ) : '';
$url             = is_string( $news_card_args['url'] ) ? trim( $news_card_args['url'] ) : '';
$category        = is_string( $news_card_args['category'] ) ? trim( $news_card_args['category'] ) : '';
$icon_uri        = is_string( $news_card_args['icon_uri'] ) ? trim( $news_card_args['icon_uri'] ) : '';

if ( '' === $news_card_title || '' === $url || '' === $category ) {
	return;
}
?>
<article class="orlyata-news-card">
	<a class="orlyata-news-card__link" href="<?php echo esc_url( $url ); ?>">
		<?php if ( '' !== $icon_uri ) : ?>
			<img class="orlyata-news-card__icon" src="<?php echo esc_url( $icon_uri ); ?>" alt="" aria-hidden="true" />
		<?php endif; ?>
		<h3 class="orlyata-news-card__title"><span class="orlyata-news-card__title-label" data-text="<?php echo esc_attr( $news_card_title ); ?>"><?php echo esc_html( $news_card_title ); ?></span></h3>
	</a>
	<?php get_template_part( 'template-parts/components/badge', null, array( 'label' => $category ) ); ?>
</article>
