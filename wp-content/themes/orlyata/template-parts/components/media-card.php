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
		'date'                 => '',
		'image_alt'            => '',
		'image_url'            => '',
		'media_type'           => 'photo',
		'provider'             => '',
		'size'                 => 'small',
		'start_offset_seconds' => 0,
		'title'                => '',
		'url'                  => '',
		'video_embed_url'      => '',
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
$date                = is_string( $media_card_args['date'] ) ? trim( $media_card_args['date'] ) : '';
$provider            = is_string( $media_card_args['provider'] ) ? trim( $media_card_args['provider'] ) : '';
$video_embed_url     = is_string( $media_card_args['video_embed_url'] ) ? trim( $media_card_args['video_embed_url'] ) : '';
$video_url           = is_string( $media_card_args['video_url'] ) ? trim( $media_card_args['video_url'] ) : '';
$start_offset        = is_numeric( $media_card_args['start_offset_seconds'] ) ? max( 0, (int) $media_card_args['start_offset_seconds'] ) : 0;
$is_video            = 'video' === $media_type;
$has_native_video_preview = $is_video && '' !== $video_url;
$has_embed_video_preview  = $is_video && '' !== $video_embed_url;
$media_card_classes  = array(
	'orlyata-media-card',
	'orlyata-media-card--' . $size,
);

if ( $is_video ) {
	$media_card_classes[] = 'orlyata-media-card--video';
}

if ( '' === $media_card_title || '' === $url || '' === $image_url || '' === $date ) {
	return;
}
?>
<article class="<?php echo esc_attr( implode( ' ', $media_card_classes ) ); ?>"<?php echo $has_native_video_preview ? ' data-media-card-video-preview' : ''; ?>>
	<a class="orlyata-media-card__link" href="<?php echo esc_url( $url ); ?>"<?php echo $is_video ? ' target="_blank" rel="noopener noreferrer"' : ''; ?>>
		<div class="orlyata-media-card__image-wrap">
			<img class="orlyata-media-card__image" src="<?php echo esc_url( $image_url ); ?>" alt="<?php echo esc_attr( $image_alt ); ?>" />
			<?php if ( $has_native_video_preview ) : ?>
				<div class="orlyata-media-card__preview" hidden>
					<video class="orlyata-media-card__preview-video" src="<?php echo esc_url( $video_url ); ?>" autoplay loop muted playsinline preload="auto" data-preview-duration="8" data-preview-start="<?php echo esc_attr( (string) $start_offset ); ?>" aria-hidden="true" tabindex="-1"></video>
				</div>
			<?php endif; ?>
			<?php if ( $has_embed_video_preview ) : ?>
				<div class="orlyata-media-card__preview orlyata-media-card__preview--embed" aria-hidden="true">
					<iframe class="orlyata-media-card__preview-embed" src="<?php echo esc_url( $video_embed_url ); ?>" title="" tabindex="-1" loading="lazy" allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock"></iframe>
				</div>
			<?php endif; ?>
		</div>
		<div class="orlyata-media-card__content">
			<h3 class="orlyata-media-card__title"><span class="orlyata-media-card__title-label" data-text="<?php echo esc_attr( $media_card_title ); ?>"><?php echo esc_html( $media_card_title ); ?></span></h3>
			<div class="orlyata-media-card__meta">
				<?php
				get_template_part(
					'template-parts/components/badge',
					null,
					array(
						'label'   => $date,
						'variant' => 'big' === $size ? 'inverse' : 'default',
					)
				);
				?>
				<?php if ( $is_video && '' !== $provider ) : ?>
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
		</div>
		<?php if ( $is_video ) : ?>
			<span class="orlyata-button orlyata-button--play orlyata-media-card__play" aria-hidden="true">
				<img class="orlyata-button__icon orlyata-button__icon--play" src="<?php echo esc_url( get_theme_file_uri( 'assets/icons/button-play.svg' ) ); ?>" alt="" aria-hidden="true" />
			</span>
		<?php endif; ?>
	</a>
</article>
