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

if ( '' === $accordion_title || '' === $content ) {
	return;
}
?>
<details class="orlyata-accordion" <?php echo (bool) $accordion_args['open'] ? 'open' : ''; ?>>
	<summary class="orlyata-accordion__summary">
		<span class="orlyata-accordion__title"><?php echo esc_html( $accordion_title ); ?></span>
		<?php if ( '' !== $meta ) : ?>
			<span class="orlyata-accordion__meta"><?php echo esc_html( $meta ); ?></span>
		<?php endif; ?>
		<span class="orlyata-accordion__toggle" aria-hidden="true"></span>
	</summary>
	<div class="orlyata-accordion__content"><?php echo esc_html( $content ); ?></div>
</details>
