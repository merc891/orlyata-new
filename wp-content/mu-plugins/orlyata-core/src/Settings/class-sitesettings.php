<?php
/**
 * Controlled global contact settings.
 *
 * @package OrlyataCore
 */

namespace OrlyataCore\Settings;

use OrlyataCore\Content\Media;

defined( 'ABSPATH' ) || exit;

/**
 * Registers the small settings surface allowed to content editors.
 */
final class SiteSettings {
	/**
	 * Option key.
	 */
	public const OPTION_NAME = 'orlyata_site_settings';

	/**
	 * Register settings hooks.
	 *
	 * @return void
	 */
	public static function register(): void {
		add_action( 'admin_init', array( self::class, 'register_option' ) );
		add_action( 'admin_menu', array( self::class, 'register_page' ) );
		add_filter( 'option_page_capability_orlyata_site_settings', array( self::class, 'get_option_capability' ) );
	}

	/**
	 * Register option schema.
	 *
	 * @return void
	 */
	public static function register_option(): void {
		register_setting(
			'orlyata_site_settings',
			self::OPTION_NAME,
			array(
				'type'              => 'array',
				'sanitize_callback' => array( self::class, 'sanitize' ),
				'default'           => self::get_defaults(),
			)
		);
	}

	/**
	 * Register the top-level site settings page.
	 *
	 * @return void
	 */
	public static function register_page(): void {
		add_menu_page(
			__( 'Настройки сайта', 'orlyata' ),
			__( 'Настройки сайта', 'orlyata' ),
			// phpcs:ignore WordPress.WP.Capabilities.Unknown -- The capability is registered by RoleManager::sync().
			'edit_orlyata_site_settings',
			'orlyata-site-settings',
			array( self::class, 'render_page' ),
			'dashicons-admin-generic',
			58
		);
	}

	/**
	 * Get Settings API capability.
	 *
	 * @return string
	 */
	public static function get_option_capability(): string {
		return 'edit_orlyata_site_settings';
	}

	/**
	 * Render the controlled settings form.
	 *
	 * @return void
	 */
	public static function render_page(): void {
		// phpcs:ignore WordPress.WP.Capabilities.Unknown -- The capability is registered by RoleManager::sync().
		if ( ! current_user_can( 'edit_orlyata_site_settings' ) ) {
			wp_die( esc_html__( 'Недостаточно прав для изменения настроек сайта.', 'orlyata' ) );
		}

		$settings = self::get();
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Настройки сайта', 'orlyata' ); ?></h1>
			<form action="options.php" method="post">
				<?php settings_fields( 'orlyata_site_settings' ); ?>
				<h2><?php esc_html_e( 'Контакты', 'orlyata' ); ?></h2>
				<table class="form-table" role="presentation">
					<tr>
						<th scope="row"><label for="orlyata-site-address"><?php esc_html_e( 'Адрес', 'orlyata' ); ?></label></th>
						<td><textarea class="large-text" id="orlyata-site-address" name="<?php echo esc_attr( self::OPTION_NAME ); ?>[address]" rows="3"><?php echo esc_textarea( $settings['address'] ); ?></textarea></td>
					</tr>
					<?php self::render_contact_rows( 'phones', __( 'Телефоны', 'orlyata' ), $settings['phones'], 'tel' ); ?>
					<?php self::render_contact_rows( 'emails', __( 'Email', 'orlyata' ), $settings['emails'], 'email' ); ?>
				</table>
				<h2><?php esc_html_e( 'Социальные сети', 'orlyata' ); ?></h2>
				<p class="description"><?php esc_html_e( 'Заполните только нужные строки. Иконка выбирается как ID безопасно загруженного изображения; SVG и HTML не принимаются.', 'orlyata' ); ?></p>
				<table class="widefat striped">
					<thead>
						<tr>
							<th><?php esc_html_e( 'Название', 'orlyata' ); ?></th>
							<th><?php esc_html_e( 'HTTPS URL', 'orlyata' ); ?></th>
							<th><?php esc_html_e( 'ID иконки', 'orlyata' ); ?></th>
						</tr>
					</thead>
					<tbody>
						<?php foreach ( $settings['socials'] as $index => $social ) : ?>
							<tr>
								<td><input class="regular-text" name="<?php echo esc_attr( self::OPTION_NAME . '[socials][' . $index . '][label]' ); ?>" type="text" value="<?php echo esc_attr( $social['label'] ); ?>"></td>
								<td><input class="regular-text" name="<?php echo esc_attr( self::OPTION_NAME . '[socials][' . $index . '][url]' ); ?>" type="url" value="<?php echo esc_attr( $social['url'] ); ?>"></td>
								<td><input class="small-text" min="0" name="<?php echo esc_attr( self::OPTION_NAME . '[socials][' . $index . '][icon_id]' ); ?>" type="number" value="<?php echo esc_attr( (string) $social['icon_id'] ); ?>"></td>
							</tr>
						<?php endforeach; ?>
					</tbody>
				</table>
				<?php submit_button(); ?>
			</form>
		</div>
		<?php
	}

	/**
	 * Sanitize option values.
	 *
	 * @param mixed $value Submitted settings.
	 * @return array{address: string, phones: array<int, string>, emails: array<int, string>, socials: array<int, array{label: string, url: string, icon_id: int}>}
	 */
	public static function sanitize( mixed $value ): array {
		$value = is_array( $value ) ? $value : array();

		return array(
			'address' => isset( $value['address'] ) && is_scalar( $value['address'] ) ? sanitize_textarea_field( (string) $value['address'] ) : '',
			'phones'  => self::sanitize_phones( $value['phones'] ?? array() ),
			'emails'  => self::sanitize_emails( $value['emails'] ?? array() ),
			'socials' => self::sanitize_socials( $value['socials'] ?? array() ),
		);
	}

	/**
	 * Get current settings with stable defaults.
	 *
	 * @return array{address: string, phones: array<int, string>, emails: array<int, string>, socials: array<int, array{label: string, url: string, icon_id: int}>}
	 */
	public static function get(): array {
		$value = get_option( self::OPTION_NAME, self::get_defaults() );

		return self::sanitize( $value );
	}

	/**
	 * Get option defaults.
	 *
	 * @return array{address: string, phones: array<int, string>, emails: array<int, string>, socials: array<int, array{label: string, url: string, icon_id: int}>}
	 */
	private static function get_defaults(): array {
		return array(
			'address' => '',
			'phones'  => array( '', '' ),
			'emails'  => array( '', '' ),
			'socials' => array_fill(
				0,
				5,
				array(
					'label'   => '',
					'url'     => '',
					'icon_id' => 0,
				)
			),
		);
	}

	/**
	 * Render two contact inputs.
	 *
	 * @param string             $key Option array key.
	 * @param string             $label Group label.
	 * @param array<int, string> $values Current values.
	 * @param string             $type HTML input type.
	 * @return void
	 */
	private static function render_contact_rows( string $key, string $label, array $values, string $type ): void {
		?>
		<tr>
			<th scope="row"><?php echo esc_html( $label ); ?></th>
			<td>
				<?php foreach ( array( 0, 1 ) as $index ) : ?>
					<p><input class="regular-text" name="<?php echo esc_attr( self::OPTION_NAME . '[' . $key . '][' . $index . ']' ); ?>" type="<?php echo esc_attr( $type ); ?>" value="<?php echo esc_attr( $values[ $index ] ?? '' ); ?>"></p>
				<?php endforeach; ?>
			</td>
		</tr>
		<?php
	}

	/**
	 * Sanitize two public phone strings.
	 *
	 * @param mixed $values Candidate values.
	 * @return array<int, string>
	 */
	private static function sanitize_phones( mixed $values ): array {
		$values = is_array( $values ) ? $values : array();
		$phones = array();

		foreach ( array( 0, 1 ) as $index ) {
			$phone     = isset( $values[ $index ] ) && is_scalar( $values[ $index ] ) ? (string) $values[ $index ] : '';
			$sanitized = preg_replace( '/[^0-9+()\-\s]/', '', $phone );
			$phones[]  = is_string( $sanitized ) ? trim( $sanitized ) : '';
		}

		return $phones;
	}

	/**
	 * Sanitize two email values.
	 *
	 * @param mixed $values Candidate values.
	 * @return array<int, string>
	 */
	private static function sanitize_emails( mixed $values ): array {
		$values = is_array( $values ) ? $values : array();
		$emails = array();

		foreach ( array( 0, 1 ) as $index ) {
			$email    = isset( $values[ $index ] ) && is_scalar( $values[ $index ] ) ? (string) $values[ $index ] : '';
			$emails[] = sanitize_email( $email );
		}

		return $emails;
	}

	/**
	 * Sanitize up to five social links and safe image icon IDs.
	 *
	 * @param mixed $values Candidate social rows.
	 * @return array<int, array{label: string, url: string, icon_id: int}>
	 */
	private static function sanitize_socials( mixed $values ): array {
		$values  = is_array( $values ) ? $values : array();
		$socials = array();

		foreach ( array( 0, 1, 2, 3, 4 ) as $index ) {
			$row     = isset( $values[ $index ] ) && is_array( $values[ $index ] ) ? $values[ $index ] : array();
			$label   = isset( $row['label'] ) && is_scalar( $row['label'] ) ? sanitize_text_field( (string) $row['label'] ) : '';
			$url     = isset( $row['url'] ) && is_scalar( $row['url'] ) ? esc_url_raw( (string) $row['url'], array( 'https' ) ) : '';
			$icon_id = isset( $row['icon_id'] ) ? absint( $row['icon_id'] ) : 0;

			$socials[] = array(
				'label'   => $label,
				'url'     => $url,
				'icon_id' => Media::is_image_attachment( $icon_id ) ? $icon_id : 0,
			);
		}

		return $socials;
	}
}
