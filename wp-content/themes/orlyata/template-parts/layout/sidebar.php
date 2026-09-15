<?php
/**
 * Desktop sidebar with primary navigation.
 *
 * Expected arguments:
 * - items: Optional navigation items with label, url and current values.
 * - cta_label: Admission CTA label.
 * - cta_url: Admission CTA URL.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;

$sidebar_args = wp_parse_args(
	is_array( $args ?? null ) ? $args : array(),
	array(
		'items'     => array(),
		'cta_label' => __( 'Записаться к нам', 'orlyata' ),
		'cta_url'   => home_url( '/#application' ),
	)
);

$default_items = array(
	array(
		'label'   => __( 'О капелле', 'orlyata' ),
		'url'     => home_url( '/o-kapelle/' ),
		'current' => is_page( 'o-kapelle' ),
	),

	array(
		'label'   => __( 'Новости', 'orlyata' ),
		'url'     => home_url( '/novosti/' ),
		'current' => is_post_type_archive( 'news' ) || is_singular( 'news' ),
	),
	array(
		'label'   => __( 'Медиагалерея', 'orlyata' ),
		'url'     => home_url( '/mediagalereya/' ),
		'current' => is_page( 'mediagalereya' ) || is_post_type_archive( 'photo_album' ) || is_singular( 'photo_album' ) || is_post_type_archive( 'video' ),
	),
	array(
		'label'   => __( 'Ноты', 'orlyata' ),
		'url'     => home_url( '/noty/' ),
		'current' => is_page( 'noty' ) || is_singular( 'score' ),
	),
	array(
		'label'   => __( 'Контакты', 'orlyata' ),
		'url'     => home_url( '/kontakty/' ),
		'current' => is_page( 'kontakty' ),
	),
);

$items     = is_array( $sidebar_args['items'] ) && array() !== $sidebar_args['items']
	? $sidebar_args['items']
	: $default_items;
$cta_label = is_string( $sidebar_args['cta_label'] ) ? trim( $sidebar_args['cta_label'] ) : '';
$cta_url   = is_string( $sidebar_args['cta_url'] ) ? trim( $sidebar_args['cta_url'] ) : '';
$filtered_settings = apply_filters( 'orlyata_site_settings', array() );
$site_settings     = is_array( $filtered_settings ) ? $filtered_settings : array();
$phones            = isset( $site_settings['phones'] ) && is_array( $site_settings['phones'] )
	? array_values( array_filter( $site_settings['phones'], 'is_string' ) )
	: array();
$emails            = isset( $site_settings['emails'] ) && is_array( $site_settings['emails'] )
	? array_values( array_filter( $site_settings['emails'], 'is_string' ) )
	: array();
$menu_contacts     = array();
$menu_socials      = array(
	array(
		'icon'  => 'assets/icons/share/vk.svg',
		'label' => __( 'ВКонтакте', 'orlyata' ),
		'url'   => 'https://vk.ru/zelorlyata',
	),
	array(
		'icon'  => 'assets/icons/share/telegram.svg',
		'label' => __( 'Telegram', 'orlyata' ),
		'url'   => 'https://t.me/zel_orlyata',
	),
);


if ( isset( $emails[0] ) ) {
	$sanitized_email = sanitize_email( $emails[0] );
	if ( '' !== $sanitized_email ) {
		$menu_contacts[] = array(
			'label' => $sanitized_email,
			'href'  => 'mailto:' . $sanitized_email,
		);
	}
}

foreach ( array_slice( $phones, 0, 2 ) as $phone ) {
	$phone_href = preg_replace( '/[^0-9+]/', '', trim( $phone ) );
	if ( is_string( $phone_href ) && '' !== $phone_href ) {
		$menu_contacts[] = array(
			'label' => trim( $phone ),
			'href'  => 'tel:' . $phone_href,
		);
	}
}
?>
<aside class="orlyata-sidebar">
	<a class="orlyata-sidebar__logo-link" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="<?php esc_attr_e( 'Орлята — на главную', 'orlyata' ); ?>">
		<picture class="orlyata-sidebar__logo-picture">
			<source media="(max-width: 767px)" srcset="<?php echo esc_url( get_theme_file_uri( 'assets/icons/logo-white.svg' ) ); ?>">
			<source media="(max-width: 1279px)" srcset="<?php echo esc_url( get_theme_file_uri( 'assets/icons/logo-tablet.svg' ) ); ?>">
			<img class="orlyata-sidebar__logo" src="<?php echo esc_url( get_theme_file_uri( 'assets/icons/logo-orlyata.svg' ) ); ?>" alt="" width="240" height="110">
		</picture>
		<img class="orlyata-sidebar__logo orlyata-sidebar__logo--menu-open" src="<?php echo esc_url( get_theme_file_uri( 'assets/icons/logo-mob.svg' ) ); ?>" alt="" width="131" height="48">
	</a>
	<?php if ( '' !== $cta_label && '' !== $cta_url ) : ?>
		<?php
		get_template_part(
			'template-parts/components/button',
			null,
			array(
				'class'   => 'orlyata-sidebar__tablet-cta',
				'href'    => $cta_url,
				'label'   => $cta_label,
				'variant' => 'primary',
			)
		);
		?>
	<?php endif; ?>
	<?php
	get_template_part(
		'template-parts/components/button',
		null,
		array(
			'aria_controls' => 'orlyata-sidebar-navigation',
			'aria_expanded' => true,
			'class'         => 'orlyata-sidebar__menu-toggle',
			'variant'       => 'menu-tablet',
		)
	);
	?>

	<div class="orlyata-sidebar__menu-panel">
		<div class="orlyata-sidebar__menu-panel-content">
	<nav class="orlyata-sidebar__nav" id="orlyata-sidebar-navigation" aria-label="<?php esc_attr_e( 'Основная навигация', 'orlyata' ); ?>">
		<ul class="orlyata-sidebar__list">
			<?php foreach ( $items as $item ) : ?>
				<?php
				if ( ! is_array( $item ) ) {
					continue;
				}

				$label   = isset( $item['label'] ) && is_string( $item['label'] ) ? trim( $item['label'] ) : '';
				$url     = isset( $item['url'] ) && is_string( $item['url'] ) ? trim( $item['url'] ) : '';
				$current = ! empty( $item['current'] );

				if ( '' === $label || '' === $url ) {
					continue;
				}
				?>
				<li class="orlyata-sidebar__item">
					<a
						class="orlyata-sidebar__link orlyata-text-link orlyata-text-link--color<?php echo $current ? ' is-current' : ''; ?>"
						href="<?php echo esc_url( $url ); ?>"
						<?php if ( $current ) : ?>
							aria-current="page"
						<?php endif; ?>
					>
						<span class="orlyata-text-link__label" data-text="<?php echo esc_attr( $label ); ?>">
							<?php echo esc_html( $label ); ?>
						</span>
					</a>
				</li>
			<?php endforeach; ?>
		</ul>
	</nav>
	<ul class="orlyata-sidebar__menu-socials" aria-label="<?php esc_attr_e( 'Социальные сети', 'orlyata' ); ?>">
		<?php foreach ( $menu_socials as $social ) : ?>
			<li>
				<a class="orlyata-sidebar__menu-social-link" href="<?php echo esc_url( $social['url'] ); ?>" target="_blank" rel="noopener noreferrer" aria-label="<?php echo esc_attr( $social['label'] ); ?>">
					<img src="<?php echo esc_url( get_theme_file_uri( $social['icon'] ) ); ?>" alt="" aria-hidden="true">
				</a>
			</li>
		<?php endforeach; ?>
	</ul>


	<?php if ( array() !== $menu_contacts ) : ?>
		<ul class="orlyata-sidebar__menu-contacts" aria-label="<?php esc_attr_e( 'Контакты', 'orlyata' ); ?>">
			<?php foreach ( $menu_contacts as $contact ) : ?>
				<li class="orlyata-sidebar__menu-contact-item">
					<a class="orlyata-sidebar__menu-contact-link" href="<?php echo esc_url( $contact['href'] ); ?>"><?php echo esc_html( $contact['label'] ); ?></a>
				</li>
			<?php endforeach; ?>
		</ul>
	<?php endif; ?>

	<?php if ( '' !== $cta_label && '' !== $cta_url ) : ?>
		<?php
		get_template_part(
			'template-parts/components/button',
			null,
			array(
				'class'   => 'orlyata-sidebar__cta',
				'href'    => $cta_url,
				'label'   => $cta_label,
				'variant' => 'primary',
			)
		);
		?>
	<?php endif; ?>
		</div>
	</div>
</aside>
