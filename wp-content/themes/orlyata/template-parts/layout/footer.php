<?php
/**
 * Desktop site footer.
 *
 * Expected arguments:
 * - site_settings: Address, phones and emails supplied by orlyata-core.
 * - navigation: Optional primary navigation items.
 * - media_navigation: Optional media navigation items.
 * - slogan_lines: Two-line static slogan.
 * - legal_label: Visible legal link label.
 * - legal_url: Legal destination.
 * - start_year: First copyright year.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;

$filtered_settings = apply_filters( 'orlyata_site_settings', array() );
$footer_args       = wp_parse_args(
	is_array( $args ?? null ) ? $args : array(),
	array(
		'site_settings'    => null,
		'navigation'       => array(
			array(
				'label' => __( 'О капелле', 'orlyata' ),
				'url'   => home_url( '/o-kapelle/' ),
			),
			array(
				'label' => __( 'Новости', 'orlyata' ),
				'url'   => home_url( '/novosti/' ),
			),
			array(
				'label' => __( 'Достижения', 'orlyata' ),
				'url'   => home_url( '/o-kapelle/#achievements' ),
			),
			array(
				'label' => __( 'Педагоги', 'orlyata' ),
				'url'   => home_url( '/o-kapelle/#teachers' ),
			),
			array(
				'label' => __( 'Ноты', 'orlyata' ),
				'url'   => home_url( '/noty/' ),
			),
			array(
				'label' => __( 'Контакты', 'orlyata' ),
				'url'   => home_url( '/kontakty/' ),
			),
		),
		'media_navigation' => array(
			array(
				'label' => __( 'Фотогалерея', 'orlyata' ),
				'url'   => home_url( '/mediagalereya/foto/' ),
			),
			array(
				'label' => __( 'Видео', 'orlyata' ),
				'url'   => home_url( '/mediagalereya/video/' ),
			),
		),
		'slogan_lines'     => array(
			__( 'Сегодня орлята,', 'orlyata' ),
			__( 'а завтра – орлы', 'orlyata' ),
		),
		'legal_label'      => __( 'Политика конфиденциальности', 'orlyata' ),
		'legal_url'        => home_url( '/politika-konfidencialnosti/' ),
		'start_year'       => 2005,
	)
);
$site_settings     = is_array( $footer_args['site_settings'] )
	? $footer_args['site_settings']
	: ( is_array( $filtered_settings ) ? $filtered_settings : array() );
$address           = isset( $site_settings['address'] ) && is_string( $site_settings['address'] )
	? trim( $site_settings['address'] )
	: '';
$phones            = isset( $site_settings['phones'] ) && is_array( $site_settings['phones'] )
	? array_values( array_filter( $site_settings['phones'], 'is_string' ) )
	: array();
$emails            = isset( $site_settings['emails'] ) && is_array( $site_settings['emails'] )
	? array_values( array_filter( $site_settings['emails'], 'is_string' ) )
	: array();
$navigation        = is_array( $footer_args['navigation'] ) ? $footer_args['navigation'] : array();
$media_navigation  = is_array( $footer_args['media_navigation'] ) ? $footer_args['media_navigation'] : array();
$slogan_lines      = is_array( $footer_args['slogan_lines'] ) ? $footer_args['slogan_lines'] : array();
$legal_label       = is_string( $footer_args['legal_label'] ) ? trim( $footer_args['legal_label'] ) : '';
$legal_url         = is_string( $footer_args['legal_url'] ) ? trim( $footer_args['legal_url'] ) : '';
$start_year        = max( 1900, absint( $footer_args['start_year'] ) );
$current_year      = max( $start_year, absint( wp_date( 'Y' ) ) );
$year_range        = $start_year === $current_year
	? (string) $start_year
	: $start_year . '–' . $current_year;
$has_contacts      = '' !== $address || array() !== $phones || array() !== $emails;

$render_link_list = static function ( array $items, string $class_name ): void {
	?>
	<ul class="<?php echo esc_attr( $class_name ); ?>">
		<?php foreach ( $items as $item ) : ?>
			<?php
			if ( ! is_array( $item ) ) {
				continue;
			}

			$label = isset( $item['label'] ) && is_string( $item['label'] ) ? trim( $item['label'] ) : '';
			$url   = isset( $item['url'] ) && is_string( $item['url'] ) ? trim( $item['url'] ) : '';

			if ( '' === $label || '' === $url ) {
				continue;
			}
			?>
			<li class="orlyata-footer__list-item">
				<a class="orlyata-footer__link" href="<?php echo esc_url( $url ); ?>"><?php echo esc_html( $label ); ?></a>
			</li>
		<?php endforeach; ?>
	</ul>
	<?php
};
?>
<footer class="orlyata-footer">
	<div class="orlyata-footer__content">
		<div class="orlyata-footer__brand">
			<p class="orlyata-footer__slogan">
				<?php foreach ( $slogan_lines as $line ) : ?>
					<?php if ( is_string( $line ) && '' !== trim( $line ) ) : ?>
						<span><?php echo esc_html( trim( $line ) ); ?></span>
					<?php endif; ?>
				<?php endforeach; ?>
			</p>
		</div>

		<p class="orlyata-footer__copyright">
			<span>© <?php echo esc_html( $year_range ); ?></span>
			<span><?php esc_html_e( 'Хоровая капелла мальчиков «Орлята»', 'orlyata' ); ?></span>
		</p>

		<nav class="orlyata-footer__navigation" aria-label="<?php esc_attr_e( 'Навигация в подвале', 'orlyata' ); ?>">
			<div class="orlyata-footer__navigation-group">
				<p class="orlyata-footer__section-title"><?php esc_html_e( 'Навигация', 'orlyata' ); ?></p>
				<?php $render_link_list( $navigation, 'orlyata-footer__list' ); ?>
			</div>
			<div class="orlyata-footer__navigation-group">
				<p class="orlyata-footer__section-title"><?php esc_html_e( 'Медиа', 'orlyata' ); ?></p>
				<?php $render_link_list( $media_navigation, 'orlyata-footer__list' ); ?>
			</div>
		</nav>

		<?php if ( $has_contacts ) : ?>
			<div class="orlyata-footer__contacts">
				<div class="orlyata-footer__contacts-address">
					<p class="orlyata-footer__section-title"><?php esc_html_e( 'Контакты', 'orlyata' ); ?></p>
					<?php if ( '' !== $address ) : ?>
						<address class="orlyata-footer__address"><?php echo esc_html( $address ); ?></address>
					<?php endif; ?>
				</div>

				<div class="orlyata-footer__contact-links">
					<?php foreach ( $phones as $phone ) : ?>
						<?php $phone_href = preg_replace( '/[^0-9+]/', '', trim( $phone ) ); ?>
						<?php if ( is_string( $phone_href ) && '' !== $phone_href ) : ?>
							<a class="orlyata-footer__link" href="tel:<?php echo esc_attr( $phone_href ); ?>"><?php echo esc_html( trim( $phone ) ); ?></a>
						<?php endif; ?>
					<?php endforeach; ?>

					<?php foreach ( $emails as $email ) : ?>
						<?php $sanitized_email = sanitize_email( $email ); ?>
						<?php if ( '' !== $sanitized_email ) : ?>
							<a class="orlyata-footer__link orlyata-footer__link--email" href="mailto:<?php echo esc_attr( $sanitized_email ); ?>"><?php echo esc_html( $sanitized_email ); ?></a>
						<?php endif; ?>
					<?php endforeach; ?>
				</div>
			</div>
		<?php endif; ?>

		<?php if ( '' !== $legal_label && '' !== $legal_url ) : ?>
			<a class="orlyata-footer__link orlyata-footer__legal" href="<?php echo esc_url( $legal_url ); ?>"><?php echo esc_html( $legal_label ); ?></a>
		<?php endif; ?>
	</div>
</footer>
