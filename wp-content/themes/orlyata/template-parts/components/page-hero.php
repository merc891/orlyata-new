<?php
/**
 * Page hero component.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;

$page_hero_args = wp_parse_args(
	is_array( $args ?? null ) ? $args : array(),
	array(
		'image_alt'   => '',
		'image_src'   => '',
		'title'       => '',
		'title_id'    => '',
		'variant'     => 'default',
		'meta'        => '',
		'back_url'    => '',
		'back_label'  => __( 'Вернуться к списку новостей', 'orlyata' ),
		'share_links' => array(),
	)
);

if ( ! is_string( $page_hero_args['title'] ) || '' === $page_hero_args['title'] ) {
	return;
}

$page_hero_variant     = is_string( $page_hero_args['variant'] ) && in_array( $page_hero_args['variant'], array( 'default', 'news-detail' ), true ) ? $page_hero_args['variant'] : 'default';
$page_hero_title_id    = is_string( $page_hero_args['title_id'] ) && '' !== $page_hero_args['title_id'] ? $page_hero_args['title_id'] : wp_unique_id( 'page-hero-title-' );
$page_hero_meta        = is_string( $page_hero_args['meta'] ) ? $page_hero_args['meta'] : '';
$page_hero_back_url    = is_string( $page_hero_args['back_url'] ) ? $page_hero_args['back_url'] : '';
$page_hero_back_label  = is_string( $page_hero_args['back_label'] ) ? $page_hero_args['back_label'] : __( 'Вернуться к списку новостей', 'orlyata' );
$page_hero_share_links = is_array( $page_hero_args['share_links'] ) ? $page_hero_args['share_links'] : array();
?>
<section class="orlyata-page-hero orlyata-page-hero--<?php echo esc_attr( $page_hero_variant ); ?>" aria-labelledby="<?php echo esc_attr( $page_hero_title_id ); ?>">
	<?php if ( is_string( $page_hero_args['image_src'] ) && '' !== $page_hero_args['image_src'] ) : ?>
		<img class="orlyata-page-hero__image" src="<?php echo esc_url( $page_hero_args['image_src'] ); ?>" alt="<?php echo esc_attr( is_string( $page_hero_args['image_alt'] ) ? $page_hero_args['image_alt'] : '' ); ?>">
	<?php endif; ?>
	<?php if ( 'news-detail' === $page_hero_variant && '' !== $page_hero_back_url ) : ?>
		<div class="orlyata-page-hero__back">
			<?php
			get_template_part(
				'template-parts/components/button',
				null,
				array(
					'aria_label' => $page_hero_back_label,
					'href'       => $page_hero_back_url,
					'variant'    => 'arrow-left',
				)
			);
			?>
		</div>
	<?php endif; ?>
	<div class="orlyata-page-hero__content">
		<?php if ( 'news-detail' === $page_hero_variant && '' !== $page_hero_meta ) : ?>
			<p class="orlyata-page-hero__meta type-body"><?php echo esc_html( $page_hero_meta ); ?></p>
		<?php endif; ?>
		<h1 class="orlyata-page-hero__title type-display" id="<?php echo esc_attr( $page_hero_title_id ); ?>"><?php echo esc_html( $page_hero_args['title'] ); ?></h1>
	</div>
	<?php if ( 'news-detail' === $page_hero_variant && array() !== $page_hero_share_links ) : ?>
		<nav class="orlyata-page-hero__share" aria-label="<?php esc_attr_e( 'Поделиться новостью', 'orlyata' ); ?>">
			<?php foreach ( $page_hero_share_links as $page_hero_share_link ) : ?>
				<?php
				if ( ! is_array( $page_hero_share_link ) || ! isset( $page_hero_share_link['icon'], $page_hero_share_link['label'] ) || ! is_string( $page_hero_share_link['icon'] ) || ! is_string( $page_hero_share_link['label'] ) ) {
					continue;
				}
				$is_copy_link = isset( $page_hero_share_link['type'] ) && 'copy' === $page_hero_share_link['type'];
				$share_url    = isset( $page_hero_share_link['url'] ) && is_string( $page_hero_share_link['url'] ) ? $page_hero_share_link['url'] : '';
				?>
				<?php if ( $is_copy_link ) : ?>
					<button class="orlyata-page-hero__share-control" type="button" data-copy-news-link="<?php echo esc_url( $share_url ); ?>" aria-label="<?php echo esc_attr( $page_hero_share_link['label'] ); ?>">
						<img src="<?php echo esc_url( $page_hero_share_link['icon'] ); ?>" alt="" aria-hidden="true">
					</button>
				<?php elseif ( '' !== $share_url ) : ?>
					<a class="orlyata-page-hero__share-control" href="<?php echo esc_url( $share_url ); ?>" target="_blank" rel="noopener noreferrer" aria-label="<?php echo esc_attr( $page_hero_share_link['label'] ); ?>">
						<img src="<?php echo esc_url( $page_hero_share_link['icon'] ); ?>" alt="" aria-hidden="true">
					</a>
				<?php endif; ?>
			<?php endforeach; ?>
		</nav>
	<?php endif; ?>
</section>
