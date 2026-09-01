<?php
/** Teacher gallery. @package Orlyata */
defined( 'ABSPATH' ) || exit;
$teacher_gallery_args = wp_parse_args( is_array( $args ?? null ) ? $args : array(), array( 'directory' => '', 'name' => '' ) );
$teacher_gallery_directory = is_string( $teacher_gallery_args['directory'] ) ? sanitize_file_name( $teacher_gallery_args['directory'] ) : '';
$teacher_gallery_name = is_string( $teacher_gallery_args['name'] ) ? $teacher_gallery_args['name'] : '';
$teacher_gallery_files = glob( get_theme_file_path( 'assets/images/teachers/' . $teacher_gallery_directory . '/gallery/*.{jpg,JPG,jpeg,JPEG,png,PNG}' ), GLOB_BRACE );
if ( empty( $teacher_gallery_files ) ) { return; }
?>
<section class="orlyata-teacher-detail__gallery orlyata-photo-album-detail__gallery" aria-label="<?php echo esc_attr( sprintf( __( 'Фотографии: %s', 'orlyata' ), $teacher_gallery_name ) ); ?>" data-photo-album-gallery data-photo-album-reveal>
<?php foreach ( array_chunk( $teacher_gallery_files, 5 ) as $row_index => $row_files ) : $complete = 5 === count( $row_files ); ?>
<div class="orlyata-photo-album-detail__row<?php echo ! $complete ? ' orlyata-photo-album-detail__row--incomplete' : ''; ?><?php echo $complete && 1 === $row_index % 2 ? ' orlyata-photo-album-detail__row--mirrored' : ''; ?>">
<?php foreach ( $row_files as $index => $file ) : $large = $complete && 0 === $index; $size = wp_getimagesize( $file ); $width = is_array( $size ) ? (int) $size[0] : 800; $height = is_array( $size ) ? (int) $size[1] : 620; $relative = str_replace( get_theme_file_path(), '', $file ); ?>
<a class="orlyata-photo-album-detail__photo<?php echo $large ? ' orlyata-photo-album-detail__photo--large' : ''; ?>" href="<?php echo esc_url( get_theme_file_uri( $relative ) ); ?>" data-photo-album-gallery-item data-pswp-width="<?php echo esc_attr( (string) $width ); ?>" data-pswp-height="<?php echo esc_attr( (string) $height ); ?>" aria-label="<?php echo esc_attr( sprintf( __( 'Открыть фотографию %d', 'orlyata' ), ( $row_index * 5 ) + $index + 1 ) ); ?>"><img src="<?php echo esc_url( get_theme_file_uri( $relative ) ); ?>" width="<?php echo esc_attr( (string) $width ); ?>" height="<?php echo esc_attr( (string) $height ); ?>" alt="" loading="lazy" decoding="async"></a>
<?php endforeach; ?>
</div>
<?php endforeach; ?>
</section>
