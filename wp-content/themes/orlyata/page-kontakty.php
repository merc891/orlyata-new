<?php
/**
 * Contacts desktop preview.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>
<div class="orlyata-contacts">
	<?php get_template_part( 'template-parts/layout/sidebar' ); ?>
	<main class="orlyata-contacts__content" id="main">
		<?php
		get_template_part(
			'template-parts/components/page-hero',
			null,
			array(
				'image_src' => get_theme_file_uri( 'assets/images/contacts/hero.png' ),
				'title'     => __( 'Контакты', 'orlyata' ),
				'title_id'  => 'contacts-title',
			)
		);
		?>
		<div class="orlyata-contacts__body">
			<section class="orlyata-contacts__details" aria-labelledby="contacts-title" data-archive-content-reveal>
				<div class="orlyata-contacts__row orlyata-contacts__row--address">
					<h2 class="orlyata-contacts__heading type-heading-3"><?php esc_html_e( 'Адрес', 'orlyata' ); ?></h2>
					<address class="orlyata-contacts__address type-heading-3"><?php esc_html_e( 'г. Зеленоград, Центральная площадь, 1 КЦ «Зеленоград»', 'orlyata' ); ?></address>
				</div>
				<div class="orlyata-contacts__row orlyata-contacts__row--connection">
					<h2 class="orlyata-contacts__heading type-heading-3"><?php esc_html_e( 'Связь', 'orlyata' ); ?></h2>
					<div class="orlyata-contacts__connection-grid">
						<a class="orlyata-contacts__value type-heading-3" href="mailto:info@zelorlyata.ru">info@zelorlyata.ru</a>
						<p class="orlyata-contacts__person type-heading-3"><?php esc_html_e( 'Общая электронная почта', 'orlyata' ); ?></p>
						<a class="orlyata-contacts__value type-heading-3" href="tel:+79254345198">+7 (925) 434-51-98</a>
						<p class="orlyata-contacts__person type-heading-3"><?php esc_html_e( 'Ирина Рафаиловна', 'orlyata' ); ?></p>
						<a class="orlyata-contacts__value type-heading-3" href="tel:+79162584912">+7 (916) 258-49-12</a>
						<p class="orlyata-contacts__person type-heading-3"><?php esc_html_e( 'Елена Ивановна', 'orlyata' ); ?></p>
					</div>
				</div>
				<div class="orlyata-contacts__row orlyata-contacts__row--social">
					<h2 class="orlyata-contacts__heading type-heading-3"><?php esc_html_e( 'Соцсети', 'orlyata' ); ?></h2>
					<ul class="orlyata-contacts__social-list" aria-label="<?php esc_attr_e( 'Социальные сети', 'orlyata' ); ?>">
						<li><a class="orlyata-contacts__social-link orlyata-page-hero__share-control" href="https://vk.ru/zelorlyata" target="_blank" rel="noopener noreferrer" aria-label="<?php esc_attr_e( 'ВКонтакте', 'orlyata' ); ?>"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/icons/share/vk.svg' ) ); ?>" alt=""></a></li>
						<li><a class="orlyata-contacts__social-link orlyata-page-hero__share-control" href="https://t.me/zel_orlyata" target="_blank" rel="noopener noreferrer" aria-label="<?php esc_attr_e( 'Telegram', 'orlyata' ); ?>"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/icons/share/telegram.svg' ) ); ?>" alt=""></a></li>
					</ul>
				</div>
			</section>
			<?php get_template_part( 'template-parts/layout/footer' ); ?>
		</div>
	</main>
</div>
<?php
get_footer();
