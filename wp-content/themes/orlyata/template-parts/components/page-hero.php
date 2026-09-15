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
		'image_alt'            => '',
		'image_src'            => '',
		'foreground_image_src' => '',
		'foreground_image_alt' => '',
		'title'                => '',
		'title_id'             => '',
		'variant'              => 'default',
		'meta'                 => '',
		'corner_meta'          => '',
		'corner_badge'         => '',
		'description'          => '',
		'back_url'             => '',
		'back_label'           => __( 'Вернуться к списку новостей', 'orlyata' ),
		'share_links'          => array(),
		'share_label'          => __( 'Поделиться новостью', 'orlyata' ),
	)
);

if ( ! is_string( $page_hero_args['title'] ) || '' === $page_hero_args['title'] ) {
	return;
}

$page_hero_variant              = is_string( $page_hero_args['variant'] ) && in_array( $page_hero_args['variant'], array( 'default', 'archive', 'news-detail', 'teacher-detail' ), true ) ? $page_hero_args['variant'] : 'default';
$page_hero_foreground_image_src = is_string( $page_hero_args['foreground_image_src'] ) ? $page_hero_args['foreground_image_src'] : '';
$page_hero_mobile_image_src     = get_theme_file_uri( 'assets/images/teachers/bg-mobile-inner.png' );
$page_hero_foreground_image_alt = is_string( $page_hero_args['foreground_image_alt'] ) ? $page_hero_args['foreground_image_alt'] : '';

$page_hero_title_id     = is_string( $page_hero_args['title_id'] ) && '' !== $page_hero_args['title_id'] ? $page_hero_args['title_id'] : wp_unique_id( 'page-hero-title-' );
$page_hero_meta         = is_string( $page_hero_args['meta'] ) ? $page_hero_args['meta'] : '';
$page_hero_corner_meta  = is_string( $page_hero_args['corner_meta'] ) ? $page_hero_args['corner_meta'] : '';
$page_hero_corner_badge = is_string( $page_hero_args['corner_badge'] ) ? $page_hero_args['corner_badge'] : '';
$page_hero_description  = is_string( $page_hero_args['description'] ) ? $page_hero_args['description'] : '';
$page_hero_back_url     = is_string( $page_hero_args['back_url'] ) ? $page_hero_args['back_url'] : '';
$page_hero_back_label   = is_string( $page_hero_args['back_label'] ) ? $page_hero_args['back_label'] : __( 'Вернуться к списку новостей', 'orlyata' );
$page_hero_share_links  = is_array( $page_hero_args['share_links'] ) ? $page_hero_args['share_links'] : array();
$page_hero_share_label  = is_string( $page_hero_args['share_label'] ) && '' !== $page_hero_args['share_label'] ? $page_hero_args['share_label'] : __( 'Поделиться новостью', 'orlyata' );
$page_hero_title_class  = 'news-detail' === $page_hero_variant ? 'type-heading-1' : 'type-display';
$page_hero_classes      = array( 'orlyata-page-hero', 'orlyata-page-hero--' . $page_hero_variant );

if ( in_array( $page_hero_variant, array( 'default', 'archive' ), true ) ) {
	$page_hero_classes[] = 'orlyata-page-hero--image-inline-start';
}
?>
<section class="<?php echo esc_attr( implode( ' ', $page_hero_classes ) ); ?>" aria-labelledby="<?php echo esc_attr( $page_hero_title_id ); ?>">
	<?php if ( is_string( $page_hero_args['image_src'] ) && '' !== $page_hero_args['image_src'] ) : ?>
		<picture class="orlyata-page-hero__picture">
			<source media="(max-width: 767px)" srcset="<?php echo esc_url( $page_hero_mobile_image_src ); ?>">
			<img class="orlyata-page-hero__image" src="<?php echo esc_url( $page_hero_args['image_src'] ); ?>" alt="<?php echo esc_attr( is_string( $page_hero_args['image_alt'] ) ? $page_hero_args['image_alt'] : '' ); ?>">
		</picture>
	<?php endif; ?>
	<?php if ( '' !== $page_hero_foreground_image_src ) : ?>
		<img class="orlyata-page-hero__foreground-image" src="<?php echo esc_url( $page_hero_foreground_image_src ); ?>" alt="<?php echo esc_attr( $page_hero_foreground_image_alt ); ?>">
	<?php endif; ?>
	<?php if ( in_array( $page_hero_variant, array( 'archive', 'news-detail', 'teacher-detail' ), true ) && '' !== $page_hero_back_url ) : ?>
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
		<?php if ( in_array( $page_hero_variant, array( 'news-detail', 'teacher-detail' ), true ) && '' !== $page_hero_meta ) : ?>
			<p class="orlyata-page-hero__meta type-body"><?php echo esc_html( $page_hero_meta ); ?></p>
		<?php endif; ?>
		<?php if ( 'teacher-detail' === $page_hero_variant && '' !== $page_hero_description ) : ?>
			<p class="orlyata-page-hero__description type-body"><?php echo esc_html( $page_hero_description ); ?></p>
		<?php endif; ?>
		<h1 class="orlyata-page-hero__title <?php echo esc_attr( $page_hero_title_class ); ?>" id="<?php echo esc_attr( $page_hero_title_id ); ?>"><?php echo esc_html( $page_hero_args['title'] ); ?></h1>
	</div>
	<?php if ( 'teacher-detail' === $page_hero_variant && '' !== $page_hero_corner_badge ) : ?>
		<div class="orlyata-page-hero__badge">
			<?php
			get_template_part(
				'template-parts/components/badge',
				null,
				array(
					'label'   => $page_hero_corner_badge,
					'variant' => 'inverse',
				)
			);
			?>
		</div>
	<?php endif; ?>
	<?php if ( '' !== $page_hero_corner_meta ) : ?>
		<p class="orlyata-page-hero__corner-meta type-body"><?php echo esc_html( $page_hero_corner_meta ); ?></p>
	<?php endif; ?>
	<?php if ( 'news-detail' === $page_hero_variant && array() !== $page_hero_share_links ) : ?>
		<nav class="orlyata-page-hero__share" aria-label="<?php echo esc_attr( $page_hero_share_label ); ?>">
			<?php foreach ( $page_hero_share_links as $page_hero_share_link ) : ?>
				<?php
				if ( ! is_array( $page_hero_share_link ) || ! isset( $page_hero_share_link['icon'], $page_hero_share_link['label'] ) || ! is_string( $page_hero_share_link['icon'] ) || ! is_string( $page_hero_share_link['label'] ) ) {
					continue;
				}
				$is_copy_link = isset( $page_hero_share_link['type'] ) && 'copy' === $page_hero_share_link['type'];
				$share_url    = isset( $page_hero_share_link['url'] ) && is_string( $page_hero_share_link['url'] ) ? $page_hero_share_link['url'] : '';
				?>
				<?php if ( $is_copy_link ) : ?>
					<button class="orlyata-page-hero__share-control orlyata-page-hero__share-control--copy" type="button" data-copy-news-link="<?php echo esc_url( $share_url ); ?>" data-copy-label="<?php echo esc_attr( $page_hero_share_link['label'] ); ?>" aria-label="<?php echo esc_attr( $page_hero_share_link['label'] ); ?>" title="<?php echo esc_attr( $page_hero_share_link['label'] ); ?>" aria-pressed="false">
						<svg class="orlyata-page-hero__copy-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path class="orlyata-page-hero__copy-icon-path" d="M10 8h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2ZM4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2" /></svg>
					</button>
				<?php elseif ( '' !== $share_url ) : ?>
					<a class="orlyata-page-hero__share-control" href="<?php echo esc_url( $share_url ); ?>" target="_blank" rel="noopener noreferrer" title="<?php echo esc_attr( $page_hero_share_link['label'] ); ?>">
						<img src="<?php echo esc_url( $page_hero_share_link['icon'] ); ?>" alt="<?php echo esc_attr( $page_hero_share_link['label'] ); ?>">
					</a>
				<?php endif; ?>
			<?php endforeach; ?>
		</nav>
	<?php endif; ?>
</section>
