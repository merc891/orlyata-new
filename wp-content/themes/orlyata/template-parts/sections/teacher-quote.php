<?php
/**
 * Teacher quote desktop preview section.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;
?>
<section class="orlyata-teacher-detail__quote" aria-label="<?php esc_attr_e( 'Цитата Андрея Чернецова', 'orlyata' ); ?>">
	<div class="orlyata-teacher-detail__quote-layout">
		<figure class="orlyata-teacher-detail__quote-portrait">
			<img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/about/vict.png' ) ); ?>" alt="<?php esc_attr_e( 'Андрей Чернецов', 'orlyata' ); ?>" width="240" height="240" loading="lazy" decoding="async">
		</figure>
		<blockquote class="orlyata-teacher-detail__quote-copy type-lead">
			<p><?php esc_html_e( '«Хоров девочек значительно больше, чем мальчиков. Многие родители считают, что мальчикам надо развивать тело и ум. А про воспитание души забывают. А это не менее важно! Музыка прекрасно воспитывает душу.', 'orlyata' ); ?></p>
			<p><?php esc_html_e( 'И мальчикам это необходимо не менее, чем девочкам. Мы стремимся научить петь всех, независимо от их музыкальных способностей. Пока не запоют мужчины, не запоёт страна!»', 'orlyata' ); ?></p>
		</blockquote>
	</div>
</section>
