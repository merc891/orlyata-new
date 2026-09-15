<?php
/**
 * Shared application call to action.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;

$cta_args = wp_parse_args(
	is_array( $args ?? null ) ? $args : array(),
	array(
		'form_id'      => 'application',
		'reveal'       => false,
		'section_id'   => 'application',
		'submit_label' => '',
		'variant'      => 'home',
	)
);

$section_id   = is_string( $cta_args['section_id'] ) ? sanitize_html_class( $cta_args['section_id'] ) : 'application';
$section_id   = '' !== $section_id ? $section_id : 'application';
$form_id      = is_string( $cta_args['form_id'] ) ? sanitize_html_class( $cta_args['form_id'] ) : 'application';
$form_id      = '' !== $form_id ? $form_id : 'application';
$variant      = in_array( $cta_args['variant'], array( 'home', 'about' ), true ) ? $cta_args['variant'] : 'home';
$submit_label = is_string( $cta_args['submit_label'] ) ? $cta_args['submit_label'] : '';
$title_id     = $section_id . '-title';
?>
<section
	class="orlyata-home__section orlyata-home__application<?php echo 'about' === $variant ? ' orlyata-about__application' : ''; ?>"
	id="<?php echo esc_attr( $section_id ); ?>"
	aria-labelledby="<?php echo esc_attr( $title_id ); ?>"
	<?php if ( (bool) $cta_args['reveal'] ) : ?>
		data-about-reveal
	<?php endif; ?>
>
	<div class="orlyata-home__application-copy">
		<h2 class="orlyata-home__application-title type-heading-2" id="<?php echo esc_attr( $title_id ); ?>"><?php esc_html_e( 'Хотите вырастить творческую личность? ', 'orlyata' ); ?><span class="orlyata-home__application-title-icon" aria-hidden="true"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/icons/news-category-news.png' ) ); ?>" alt=""></span><?php esc_html_e( ' Запишите мальчика ', 'orlyata' ); ?><span class="orlyata-home__application-title-preposition"><?php esc_html_e( 'в капеллу', 'orlyata' ); ?></span></h2>
	</div>
	<div class="orlyata-home__application-surface">
		<img class="orlyata-home__application-background" src="<?php echo esc_url( get_theme_file_uri( 'assets/images/home/application-background.png' ) ); ?>" alt="" aria-hidden="true">
		<?php
		get_template_part(
			'template-parts/sections/application-form',
			null,
			array(
				'id'           => $form_id,
				'submit_label' => $submit_label,
				'variant'      => $variant,
			)
		);
		?>
	</div>
</section>
