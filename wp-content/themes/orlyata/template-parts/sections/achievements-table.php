<?php
/**
 * Shared achievements table section.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;

$achievements_args = wp_parse_args(
	is_array( $args ?? null ) ? $args : array(),
	array(
		'link_href'  => '',
		'link_label' => '',
		'reveal'     => false,
		'rows'       => array(),
		'section_id' => 'achievements',
		'variant'    => 'home',
	)
);

$section_id = is_string( $achievements_args['section_id'] ) ? sanitize_html_class( $achievements_args['section_id'] ) : 'achievements';
$section_id = '' !== $section_id ? $section_id : 'achievements';
$title_id   = $section_id . '-title';
$rows       = is_array( $achievements_args['rows'] ) ? $achievements_args['rows'] : array();
$variant    = 'about' === $achievements_args['variant'] ? 'about' : 'home';
$link_href  = is_string( $achievements_args['link_href'] ) ? $achievements_args['link_href'] : '';
$link_label = is_string( $achievements_args['link_label'] ) ? $achievements_args['link_label'] : '';
?>
<section
	class="orlyata-home__section orlyata-home__achievements orlyata-achievements<?php echo 'about' === $variant ? ' orlyata-about__achievements' : ''; ?>"
	id="<?php echo esc_attr( $section_id ); ?>"
	aria-labelledby="<?php echo esc_attr( $title_id ); ?>"
	<?php if ( (bool) $achievements_args['reveal'] ) : ?>
		data-about-reveal
	<?php endif; ?>
>
	<div class="orlyata-home__section-head">
		<h2 class="type-heading-2" id="<?php echo esc_attr( $title_id ); ?>"><?php esc_html_e( 'Достижения', 'orlyata' ); ?></h2>
		<?php if ( '' !== $link_href && '' !== $link_label ) : ?>
			<?php
			get_template_part(
				'template-parts/components/text-link',
				null,
				array(
					'has_chevron' => true,
					'href'        => $link_href,
					'label'       => $link_label,
					'variant'     => 'color',
				)
			);
			?>
		<?php endif; ?>
	</div>
	<div class="orlyata-home__table-wrap">
		<?php
		get_template_part(
			'template-parts/components/data-table',
			null,
			array(
				'headers' => array( __( 'Год', 'orlyata' ), __( 'Достижение', 'orlyata' ), __( 'Конкурс', 'orlyata' ) ),
				'rows'    => $rows,
				'variant' => 'achievements',
			)
		);
		?>
	</div>
</section>
