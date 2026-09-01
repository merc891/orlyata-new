<?php
/**
 * Teacher card component.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;

$teacher_card_args = wp_parse_args(
	is_array( $args ?? null ) ? $args : array(),
	array(
		'first_name'  => '',
		'image_src'   => '',
		'last_name'   => '',
		'middle_name' => '',
		'url' => '',
	)
);

$first_name  = is_string( $teacher_card_args['first_name'] ) ? trim( $teacher_card_args['first_name'] ) : '';
$image_src   = is_string( $teacher_card_args['image_src'] ) ? trim( $teacher_card_args['image_src'] ) : '';
$last_name   = is_string( $teacher_card_args['last_name'] ) ? trim( $teacher_card_args['last_name'] ) : '';
$middle_name = is_string( $teacher_card_args['middle_name'] ) ? trim( $teacher_card_args['middle_name'] ) : '';
$url = is_string( $teacher_card_args['url'] ) ? trim( $teacher_card_args['url'] ) : '';

if ( '' === $first_name || '' === $image_src || '' === $last_name || '' === $middle_name ) {
	return;
}

$full_name = trim( implode( ' ', array( $last_name, $first_name, $middle_name ) ) );
?>
<article class="orlyata-teacher-card"><a class="orlyata-teacher-card__link" href="<?php echo esc_url( $url ); ?>">
	<span class="orlyata-teacher-card__photo-wrap">
		<img class="orlyata-teacher-card__photo" src="<?php echo esc_url( $image_src ); ?>" alt="<?php echo esc_attr( $full_name ); ?>" width="240" height="240" loading="lazy" decoding="async">
	</span>
	<h3 class="orlyata-teacher-card__name"><span class="orlyata-teacher-card__name-label" data-text="<?php echo esc_attr( $last_name ); ?>"><?php echo esc_html( $last_name ); ?></span></h3>
	<p class="orlyata-teacher-card__meta"><span class="orlyata-teacher-card__meta-label" data-text="<?php echo esc_attr( $first_name . ' ' . $middle_name ); ?>"><?php echo esc_html( $first_name . ' ' . $middle_name ); ?></span></p>
</a></article>
