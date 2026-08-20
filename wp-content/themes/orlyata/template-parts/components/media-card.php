<?php
/**
 * Media card component.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;

$media_card_args = wp_parse_args(
	is_array( $args ?? null ) ? $args : array(),
	array(
		'category'             => '',
		'image_alt'            => '',
		'image_url'            => '',
		'media_type'           => 'photo',
		'provider'             => '',
		'show_play_icon'       => false,
		'size'                 => 'small',
		'start_offset_seconds' => 0,
		'title'                => '',
		'url'                  => '',
		'video_url'            => '',
	)
);

$allowed_sizes       = array( 'big', 'small' );
$allowed_media_types = array( 'photo', 'video' );
$size                = is_string( $media_card_args['size'] ) && in_array( $media_card_args['size'], $allowed_sizes, true ) ? $media_card_args['size'] : 'small';
$media_type          = is_string( $media_card_args['media_type'] ) && in_array( $media_card_args['media_type'], $allowed_media_types, true ) ? $media_card_args['media_type'] : 'photo';
$media_card_title    = is_string( $media_card_args['title'] ) ? trim( $media_card_args['title'] ) : '';
$url                 = is_string( $media_card_args['url'] ) ? trim( $media_card_args['url'] ) : '';
$image_url           = is_string( $media_card_args['image_url'] ) ? trim( $media_card_args['image_url'] ) : '';
$image_alt           = is_string( $media_card_args['image_alt'] ) ? trim( $media_card_args['image_alt'] ) : '';
$category            = is_string( $media_card_args['category'] ) ? trim( $media_card_args['category'] ) : '';
$provider            = is_string( $media_card_args['provider'] ) ? trim( $media_card_args['provider'] ) : '';
$video_url           = is_string( $media_card_args['video_url'] ) ? trim( $media_card_args['video_url'] ) : '';
$show_play_icon      = 'video' === $media_type && (bool) $media_card_args['show_play_icon'];
$start_offset        = is_numeric( $media_card_args['start_offset_seconds'] ) ? max( 0, (int) $media_card_args['start_offset_seconds'] ) : 0;
$is_video            = 'video' === $media_type && '' !== $video_url;
$media_card_classes  = array(
	'orlyata-media-card',
	'orlyata-media-card--' . $size,
);

if ( $is_video ) {
	$media_card_classes[] = 'orlyata-media-card--video';
}

if ( '' === $media_card_title || '' === $url || '' === $image_url ) {
	return;
}
?>
<article class="<?php echo esc_attr( implode( ' ', $media_card_classes ) ); ?>"<?php echo $is_video ? ' data-media-card-video-preview' : ''; ?>>
	<a class="orlyata-media-card__link" href="<?php echo esc_url( $url ); ?>"<?php echo $is_video ? ' target="_blank" rel="noopener noreferrer"' : ''; ?>>
		<div class="orlyata-media-card__image-wrap">
			<img class="orlyata-media-card__image" src="<?php echo esc_url( $image_url ); ?>" alt="<?php echo esc_attr( $image_alt ); ?>" />
			<?php if ( $is_video ) : ?>
				<div class="orlyata-media-card__preview" hidden>
					<video class="orlyata-media-card__preview-video" src="<?php echo esc_url( $video_url ); ?>" autoplay loop muted playsinline preload="auto" data-preview-duration="8" data-preview-start="<?php echo esc_attr( (string) $start_offset ); ?>" aria-hidden="true" tabindex="-1"></video>
				</div>
			<?php endif; ?>
		</div>
		<div class="orlyata-media-card__content">
			<h3 class="orlyata-media-card__title"><?php echo esc_html( $media_card_title ); ?></h3>
			<?php if ( '' !== $category || '' !== $provider ) : ?>
				<div class="orlyata-media-card__meta">
					<?php if ( '' !== $category ) : ?>
						<?php
						get_template_part(
							'template-parts/components/badge',
							null,
							array(
								'label'   => $category,
								'variant' => 'big' === $size ? 'inverse' : 'default',
							)
						);
						?>
					<?php endif; ?>
					<?php if ( '' !== $provider ) : ?>
						<?php
						get_template_part(
							'template-parts/components/badge',
							null,
							array(
								'label'   => $provider,
								'variant' => 'big' === $size ? 'inverse' : 'default',
							)
						);
						?>
					<?php endif; ?>
				</div>
			<?php endif; ?>
		</div>
	</a>
	<?php if ( $show_play_icon ) : ?>
		<span class="orlyata-button orlyata-button--play orlyata-media-card__play" aria-hidden="true">
			<img class="orlyata-button__icon orlyata-button__icon--play" src="<?php echo esc_url( get_theme_file_uri( 'assets/icons/button-play.svg' ) ); ?>" alt="" aria-hidden="true" />
		</span>
	<?php endif; ?>
</article>
