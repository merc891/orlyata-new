<?php
/**
 * Stage 5.1 desktop frontend preview for the home page.
 *
 * Preview fixtures below deliberately stand in for CMS-owned data. They are
 * replaced by orlyata-core queries during stage 5.2.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;

$home_preview_assets = array(
	'application_background' => get_theme_file_uri( 'assets/images/home/application-background.png' ),
	'hero_original'          => get_theme_file_uri( 'assets/videos/home/hero-original.mp4' ),
	'hero_preview'           => get_theme_file_uri( 'assets/videos/home/hero-preview.mp4' ),
	'news_background'        => get_theme_file_uri( 'assets/images/home/news-background.png' ),
	'teacher_one'            => get_theme_file_uri( 'assets/images/home/teacher-one.png' ),
	'teacher_two'            => get_theme_file_uri( 'assets/images/home/teacher-two.png' ),
	'media_feature'          => get_theme_file_uri( 'assets/images/home/media-feature.png' ),
	'media_photo'            => get_theme_file_uri( 'assets/images/home/media-photo.png' ),
	'media_video'            => get_theme_file_uri( 'assets/images/home/media-video.png' ),
);

$home_preview_facts = array(
	array(
		'value' => '80+',
		'label' => __( 'мальчиков и юношей', 'orlyata' ),
	),
	array(
		'value' => '5–17 лет',
		'label' => __( 'возрастной состав', 'orlyata' ),
	),
	array(
		'value' => '6',
		'label' => __( 'опытных педагогов', 'orlyata' ),
	),
	array(
		'value' => '15–20',
		'label' => __( 'выступлений в год', 'orlyata' ),
	),
);

$home_preview_achievements = array(
	array( '2026', __( 'Лауреат I степени', 'orlyata' ), __( 'Старший', 'orlyata' ), __( 'XI Московский областной открытый конкурс хоров мальчиков Подмосковья', 'orlyata' ) ),
	array( '2025', __( 'Лауреат II степени', 'orlyata' ), __( 'Младший', 'orlyata' ), __( 'VII Международный фестиваль хорового искусства', 'orlyata' ) ),
	array( '2024', __( 'Дипломант', 'orlyata' ), __( 'Старший', 'orlyata' ), __( 'IV Всероссийский конкурс хоровых коллективов', 'orlyata' ) ),
	array( '2023', __( 'Лауреат I степени', 'orlyata' ), __( 'Юноши', 'orlyata' ), __( 'X Международный фестиваль хоровой музыки', 'orlyata' ) ),
);

get_header();
?>
<div class="orlyata-home">
	<?php get_template_part( 'template-parts/layout/sidebar' ); ?>
	<main class="orlyata-home__content" id="main">
		<div class="orlyata-home__content-grid">
		<section class="orlyata-home__hero" aria-label="<?php esc_attr_e( 'Главное', 'orlyata' ); ?>">
			<div class="orlyata-home__hero-panel orlyata-home__hero-panel--capella orlyata-home__hero-video-trigger">
				<div class="orlyata-home__hero-panel-content">
				<video class="orlyata-home__hero-preview" src="<?php echo esc_url( $home_preview_assets['hero_preview'] ); ?>" autoplay loop muted playsinline preload="auto" aria-hidden="true" tabindex="-1"></video>
				<?php
				get_template_part(
					'template-parts/components/button',
					null,
					array(
						'aria_label' => __( 'Смотреть видео о капелле', 'orlyata' ),
						'class'      => 'orlyata-home__hero-play',
						'href'       => $home_preview_assets['hero_original'],
						'variant'    => 'play',
					)
				);
				?>
				</div>
				<h1 class="orlyata-home__hero-title type-display"><span class="orlyata-home__hero-title-line"><span class="orlyata-home__hero-title-text"><?php esc_html_e( 'Хоровая', 'orlyata' ); ?></span></span><span class="orlyata-home__hero-title-line"><span class="orlyata-home__hero-title-text"><?php esc_html_e( 'капелла', 'orlyata' ); ?></span></span><span class="orlyata-home__hero-title-line"><span class="orlyata-home__hero-title-text"><?php esc_html_e( 'мальчиков', 'orlyata' ); ?></span></span></h1>
			</div>
			<section class="orlyata-home__hero-panel orlyata-home__hero-panel--news" aria-labelledby="home-news-title">
				<div class="orlyata-home__hero-panel-content">
				<img class="orlyata-home__news-background" src="<?php echo esc_url( $home_preview_assets['news_background'] ); ?>" alt="" aria-hidden="true">
				<div class="orlyata-home__news-head">
					<h2 class="type-heading-2" id="home-news-title"><?php esc_html_e( 'Новости', 'orlyata' ); ?></h2>
					<?php
					get_template_part(
						'template-parts/components/text-link',
						null,
						array(
							'has_chevron' => true,
							'href'        => home_url( '/novosti/' ),
							'label'       => __( 'Все новости', 'orlyata' ),
							'variant'     => 'color-inverse',
						)
					);
					?>
				</div>
				<div class="orlyata-home__news-grid">
				<?php
						get_template_part(
							'template-parts/components/news-card',
							null,
							array(
								'category' => __( 'сегодня', 'orlyata' ),
								'icon_uri' => get_theme_file_uri( 'assets/icons/home/news-theatre.svg' ),
								'title'    => __( '«Крылатое сердце» — большой весенний концерт', 'orlyata' ),
								'url'      => home_url( '/novosti/' ),
							)
						);
						?>
						<?php
						get_template_part(
							'template-parts/components/news-card',
							null,
							array(
								'category' => __( '21 апреля', 'orlyata' ),
								'icon_uri' => get_theme_file_uri( 'assets/icons/home/news-star.svg' ),
								'title'    => __( 'Ансамбль юношей — Лауреаты I степени', 'orlyata' ),
								'url'      => home_url( '/novosti/' ),
							)
						);
						?>
				</div>
				</div>
			</section>
		</section>

		<section class="orlyata-home__facts" aria-label="<?php esc_attr_e( 'В цифрах и фактах', 'orlyata' ); ?>">
			<?php foreach ( $home_preview_facts as $home_preview_fact ) : ?>
				<?php get_template_part( 'template-parts/components/advantage', null, $home_preview_fact ); ?>
			<?php endforeach; ?>
		</section>

		<section class="orlyata-home__section orlyata-home__media-section" aria-labelledby="home-media-title">
			<div class="orlyata-home__section-head">
				<h2 class="type-heading-2" id="home-media-title"><?php esc_html_e( 'Медиагалерея', 'orlyata' ); ?></h2>
				<?php
				get_template_part(
					'template-parts/components/text-link',
					null,
					array(
						'has_chevron' => true,
						'href'        => home_url( '/mediagalereya/' ),
						'label'       => __( 'Перейти в раздел', 'orlyata' ),
						'variant'     => 'color',
					)
				);
				?>
			</div>
			<div class="orlyata-home__media-grid">
				<?php
				get_template_part(
					'template-parts/components/media-card',
					null,
					array(
						'date'       => __( '10 июня', 'orlyata' ),
						'image_alt'  => __( 'Выступление капеллы на гала-концерте', 'orlyata' ),
						'image_url'  => $home_preview_assets['media_feature'],
						'media_type' => 'video',
						'provider'   => 'RuTube',
						'size'       => 'big',
						'url'        => 'https://rutube.ru/play/embed/2ad60bfd20027143c2eac71acdb5faef/',
						'title'      => __( 'Гала-концерт в БЗК (юноши и Вита Нова)', 'orlyata' ),
					)
				);
				?>
				<?php
				get_template_part(
					'template-parts/components/media-card',
					null,
					array(
						'date'       => __( '23 мая', 'orlyata' ),
						'image_alt'  => __( 'Концерт капеллы в Зеленограде', 'orlyata' ),
						'image_url'  => $home_preview_assets['media_video'],
						'media_type' => 'video',
						'provider'   => 'RuTube',
						'size'       => 'small',
						'title'      => __( 'Концерт в КЦ «Зеленоград»', 'orlyata' ),
						'url'        => home_url( '/mediagalereya/video/' ),
					)
				);
				?>
				<?php
				get_template_part(
					'template-parts/components/media-card',
					null,
					array(
						'date'       => __( '14 мая', 'orlyata' ),
						'image_alt'  => __( 'Участники капеллы', 'orlyata' ),
						'image_url'  => $home_preview_assets['media_photo'],
						'media_type' => 'photo',
						'size'       => 'small',
						'title'      => __( 'Концерт лауреатов фестиваля-конкурса VIVAT MUSICA', 'orlyata' ),
						'url'        => home_url( '/mediagalereya/foto/' ),
					)
				);
				?>
			</div>
		</section>

		<section class="orlyata-home__section orlyata-home__history" aria-labelledby="home-history-title">
			<div class="orlyata-home__section-head">
				<h2 class="type-heading-2" id="home-history-title"><?php esc_html_e( 'История', 'orlyata' ); ?></h2>
				<?php
				get_template_part(
					'template-parts/components/text-link',
					null,
					array(
						'has_chevron' => true,
						'href'        => home_url( '/o-kapelle/' ),
						'label'       => __( 'Подробнее', 'orlyata' ),
						'variant'     => 'color',
					)
				);
				?>
			</div>
			<div class="orlyata-home__history-grid">
				<div class="orlyata-home__history-intro">
					<p class="orlyata-home__history-lead type-lead"><?php esc_html_e( 'Создана руководителями академического хора «Ковчег» — Заслуженным работником РФ Андреем Чернецовым и хормейстером Ириной Карпман', 'orlyata' ); ?></p>
					<div class="orlyata-home__history-tags">
						<span class="orlyata-home__history-tag"><?php esc_html_e( 'О капелле', 'orlyata' ); ?></span>
						<span class="orlyata-home__history-tag"><?php esc_html_e( 'Педагоги', 'orlyata' ); ?></span>
					</div>
				</div>
				<div class="orlyata-home__history-details">
					<p class="orlyata-home__history-copy type-body"><?php esc_html_e( 'Пройдя большой путь в поиске «своего лица и в выборе репертуара, и в стиле работы, планах обучения и приобщения ребят к лучшим образцам певческого искусства, в капелле сложилась устойчивая система музыкально-хорового воспитания мальчиков от 5 до 17 лет', 'orlyata' ); ?></p>
					<div class="orlyata-home__history-teachers">
						<div class="orlyata-home__history-photos" aria-hidden="true">
							<span class="orlyata-home__history-photo"><img src="<?php echo esc_url( $home_preview_assets['teacher_one'] ); ?>" alt=""></span>
							<span class="orlyata-home__history-photo"><img src="<?php echo esc_url( $home_preview_assets['teacher_two'] ); ?>" alt=""></span>
						</div>
						<a class="orlyata-home__history-teachers-link" href="<?php echo esc_url( home_url( '/o-kapelle/#teachers' ) ); ?>" aria-label="<?php esc_attr_e( 'Перейти к педагогам', 'orlyata' ); ?>">
							<span class="orlyata-home__history-teachers-arrow-track" aria-hidden="true">
								<span class="orlyata-home__history-teachers-arrow"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/icons/button-arrow.svg' ) ); ?>" alt=""></span>
								<span class="orlyata-home__history-teachers-arrow"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/icons/button-arrow.svg' ) ); ?>" alt=""></span>
							</span>
						</a>
					</div>
				</div>
			</div>
		</section>

		<section class="orlyata-home__section orlyata-home__application" aria-labelledby="home-application-title">
			<div class="orlyata-home__application-copy">
				<h2 class="type-heading-1" id="home-application-title"><?php esc_html_e( 'Хотите вырастить творческую личность — запишите мальчика в капеллу', 'orlyata' ); ?></h2>
			</div>
			<div class="orlyata-home__application-surface">
				<img class="orlyata-home__application-background" src="<?php echo esc_url( $home_preview_assets['application_background'] ); ?>" alt="" aria-hidden="true">
				<?php
				get_template_part(
					'template-parts/sections/application-form',
					null,
					array(
						'id'      => 'application',
						'variant' => 'home',
					)
				);
				?>
			</div>
		</section>

		<section class="orlyata-home__section orlyata-home__achievements" aria-labelledby="home-achievements-title">
			<div class="orlyata-home__section-head">
				<h2 class="type-heading-2" id="home-achievements-title"><?php esc_html_e( 'Достижения', 'orlyata' ); ?></h2>
				<?php
				get_template_part(
					'template-parts/components/text-link',
					null,
					array(
						'has_chevron' => true,
						'href'        => home_url( '/o-kapelle/#achievements' ),
						'label'       => __( 'Все достижения', 'orlyata' ),
						'variant'     => 'color',
					)
				);
				?>
			</div>
			<div class="orlyata-home__table-wrap">
				<?php
				get_template_part(
					'template-parts/components/data-table',
					null,
					array(
						'headers' => array( __( 'Год', 'orlyata' ), __( 'Достижение', 'orlyata' ), __( 'Хор', 'orlyata' ), __( 'Конкурс', 'orlyata' ) ),
						'rows'    => $home_preview_achievements,
						'variant' => 'achievements',
					)
				);
				?>
			</div>
		</section>

		<?php get_template_part( 'template-parts/layout/footer' ); ?>
		</div>
		<dialog class="orlyata-home__hero-dialog" aria-label="<?php esc_attr_e( 'Видео о капелле', 'orlyata' ); ?>">
			<div class="orlyata-home__hero-dialog-content">
				<video class="orlyata-home__hero-dialog-video" src="<?php echo esc_url( $home_preview_assets['hero_original'] ); ?>" controls playsinline preload="metadata"></video>
				<button class="orlyata-home__hero-dialog-close" type="button" aria-label="<?php esc_attr_e( 'Закрыть видео', 'orlyata' ); ?>">
					<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
			</div>
		</dialog>
	</main>
</div>
<?php
get_footer();
