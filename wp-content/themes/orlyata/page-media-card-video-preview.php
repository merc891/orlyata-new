<?php
/**
 * Standalone MediaCard video-preview check page.
 *
 * @package Orlyata
 */

get_header();
?>
<main id="main" class="orlyata-video-preview-page">
	<section class="orlyata-video-preview-page__inner" aria-labelledby="media-card-video-preview-title">
		<h1 id="media-card-video-preview-title" class="orlyata-video-preview-page__title">MediaCard: видеопревью</h1>
		<p class="orlyata-video-preview-page__description">Отдельная проверка production-компонента без Storybook. Видеопревью запускается сразу и воспроизводит первые 8 секунд по кругу.</p>
		<?php
		get_template_part(
			'template-parts/components/media-card',
			null,
			array(
				'date'                 => 'Сегодня',
				'image_alt'            => 'Концерт капеллы',
				'image_url'            => get_theme_file_uri( 'assets/images/storybook/media-card-big.png' ),
				'media_type'           => 'video',
				'size'                 => 'big',
				'start_offset_seconds' => 0,
				'title'                => 'Гала-концерт в БЗК (юноши и Вита Нова)',
				'url'                  => 'https://cdn.truefilesize.com/mp4/sample-10mb.mp4',
				'video_url'            => 'https://cdn.truefilesize.com/mp4/sample-10mb.mp4',
			)
		);
		?>
	</section>
</main>
<?php
get_footer();
