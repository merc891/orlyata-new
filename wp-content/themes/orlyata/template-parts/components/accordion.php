<?php
/**
 * Accordion component.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;

$accordion_args = wp_parse_args(
	is_array( $args ?? null ) ? $args : array(),
	array(
		'content' => '',
		'meta'    => '',
		'open'    => false,
		'title'   => '',
	)
);

$accordion_title = is_string( $accordion_args['title'] ) ? trim( $accordion_args['title'] ) : '';
$meta            = is_string( $accordion_args['meta'] ) ? trim( $accordion_args['meta'] ) : '';
$content         = is_string( $accordion_args['content'] ) ? trim( $accordion_args['content'] ) : '';

if ( '' === $accordion_title ) {
	return;
}
?>
<details class="orlyata-accordion" <?php echo (bool) $accordion_args['open'] ? 'open' : ''; ?>>
	<summary class="orlyata-accordion__summary">
		<span class="orlyata-accordion__title"><?php echo esc_html( $accordion_title ); ?></span>
		<?php if ( '' !== $meta ) : ?>
			<span class="orlyata-accordion__meta"><?php echo esc_html( $meta ); ?></span>
		<?php endif; ?>
		<span class="orlyata-accordion__toggle" aria-hidden="true">
			<svg class="orlyata-accordion__toggle-icon" viewBox="0 0 24 24" focusable="false">
				<path
					class="orlyata-accordion__toggle-path"
					d="<?php echo esc_attr( (bool) $accordion_args['open'] ? 'M5 12h14' : 'M5 12h14M12 5v14' ); ?>"
				/>
			</svg>
		</span>
	</summary>
	<div class="orlyata-accordion__panel">
		<div class="orlyata-accordion__content">
			<div class="orlyata-accordion__content-inner"><?php echo esc_html( $content ); ?></div>
		</div>
	</div>
</details>
