<?php
/**
 * Application form section.
 *
 * The protected endpoint is implemented by orlyata-core at stage 7. The plugin
 * can inject nonce, idempotency and anti-spam fields through the
 * `orlyata_application_form_hidden_fields` action.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;

$form_args = wp_parse_args(
	is_array( $args ?? null ) ? $args : array(),
	array(
		'action'      => '',
		'aria_label'  => __( 'Форма записи в капеллу', 'orlyata' ),
		'errors'      => array(),
		'form_error'  => '',
		'id'          => 'application',
		'privacy_url' => home_url( '/politika-konfidencialnosti/' ),
		'state'       => 'default',
		'success_url' => home_url( '/' ),
		'values'      => array(),
		'variant'     => 'home',
	)
);

$allowed_states   = array( 'default', 'submitting', 'success', 'validation-error', 'network-error', 'server-error' );
$allowed_variants = array( 'home', 'about' );
$state            = is_string( $form_args['state'] ) && in_array( $form_args['state'], $allowed_states, true )
	? $form_args['state']
	: 'default';
$variant          = is_string( $form_args['variant'] ) && in_array( $form_args['variant'], $allowed_variants, true )
	? $form_args['variant']
	: 'home';
$form_id          = is_string( $form_args['id'] ) ? sanitize_html_class( $form_args['id'] ) : 'application';
$form_id          = '' !== $form_id ? $form_id : 'application';
$values           = is_array( $form_args['values'] ) ? $form_args['values'] : array();
$field_errors     = is_array( $form_args['errors'] ) ? $form_args['errors'] : array();
$is_submitting    = 'submitting' === $state;
$form_error       = is_string( $form_args['form_error'] ) ? trim( $form_args['form_error'] ) : '';

if ( '' === $form_error ) {
	$form_error = match ( $state ) {
		'validation-error' => '',
		'network-error'    => __( 'Не удалось отправить заявку. Проверьте интернет-соединение и попробуйте ещё раз.', 'orlyata' ),
		'server-error'     => __( 'Сервис временно недоступен. Попробуйте отправить заявку ещё раз.', 'orlyata' ),
		default            => '',
	};
}

$class_names = array(
	'orlyata-application-form',
	'orlyata-application-form--' . $variant,
	'orlyata-application-form--' . $state,
);

if ( 'success' === $state ) :
	$success_url = is_string( $form_args['success_url'] ) && '' !== trim( $form_args['success_url'] )
		? $form_args['success_url']
		: home_url( '/' );
	?>
	<div class="<?php echo esc_attr( implode( ' ', $class_names ) ); ?>" role="status">
		<div class="orlyata-application-form__success-content">
			<img
				class="orlyata-application-form__success-icon"
				src="<?php echo esc_url( get_theme_file_uri( 'assets/icons/application-success.svg' ) ); ?>"
				alt=""
				aria-hidden="true"
			/>
			<h2 class="orlyata-application-form__success-title"><?php esc_html_e( 'Заявка принята!', 'orlyata' ); ?></h2>
			<p class="orlyata-application-form__success-copy">
				<?php esc_html_e( 'Нам нужно немного времени, чтобы её обработать и перезвонить вам', 'orlyata' ); ?>
			</p>
		</div>
		<?php
		get_template_part(
			'template-parts/components/button',
			null,
			array(
				'class'   => 'orlyata-application-form__success-action',
				'href'    => $success_url,
				'label'   => __( 'Хорошо', 'orlyata' ),
				'variant' => 'primary',
			)
		);
		?>
	</div>
	<?php
	return;
endif;

$fields = array(
	array(
		'autocomplete' => 'name',
		'label'        => __( 'ФИО родителя', 'orlyata' ),
		'name'         => 'parent_name',
		'type'         => 'text',
	),
	array(
		'autocomplete' => '',
		'label'        => __( 'ФИО ребёнка', 'orlyata' ),
		'name'         => 'child_name',
		'type'         => 'text',
	),
	array(
		'autocomplete' => 'bday',
		'label'        => __( 'Дата рождения', 'orlyata' ),
		'name'         => 'child_birth_date',
		'type'         => 'date',
	),
	array(
		'autocomplete' => 'tel',
		'label'        => __( 'Телефон', 'orlyata' ),
		'name'         => 'phone',
		'type'         => 'tel',
	),
);

$form_action   = is_string( $form_args['action'] ) ? $form_args['action'] : '';
$aria_label    = is_string( $form_args['aria_label'] ) ? trim( $form_args['aria_label'] ) : '';
$privacy_url   = is_string( $form_args['privacy_url'] ) && '' !== trim( $form_args['privacy_url'] )
	? $form_args['privacy_url']
	: home_url( '/politika-konfidencialnosti/' );
$form_error_id = $form_id . '-form-error';
?>
<form
	class="<?php echo esc_attr( implode( ' ', $class_names ) ); ?>"
	id="<?php echo esc_attr( $form_id ); ?>"
	method="post"
	action="<?php echo esc_url( $form_action ); ?>"
	<?php if ( '' !== $aria_label ) : ?>
		aria-label="<?php echo esc_attr( $aria_label ); ?>"
	<?php endif; ?>
	<?php if ( $is_submitting ) : ?>
		aria-busy="true"
	<?php endif; ?>
	<?php if ( '' !== $form_error ) : ?>
		aria-describedby="<?php echo esc_attr( $form_error_id ); ?>"
	<?php endif; ?>
>
	<?php do_action( 'orlyata_application_form_hidden_fields', $variant ); ?>
	<div class="orlyata-application-form__fields">
		<?php foreach ( $fields as $field ) : ?>
			<?php
			$field_name  = $field['name'];
			$field_value = isset( $values[ $field_name ] ) && is_string( $values[ $field_name ] )
				? $values[ $field_name ]
				: '';
			$field_error = isset( $field_errors[ $field_name ] ) && is_string( $field_errors[ $field_name ] )
				? $field_errors[ $field_name ]
				: '';

			get_template_part(
				'template-parts/components/input',
				null,
				array(
					'autocomplete' => $field['autocomplete'],
					'error'        => $field_error,
					'id'           => $form_id . '-' . $field_name,
					'label'        => $field['label'],
					'name'         => $field_name,
					'required'     => true,
					'type'         => $field['type'],
					'value'        => $field_value,
				)
			);
			?>
		<?php endforeach; ?>
	</div>
	<?php if ( '' !== $form_error ) : ?>
		<p class="orlyata-application-form__error" id="<?php echo esc_attr( $form_error_id ); ?>" role="alert">
			<?php echo esc_html( $form_error ); ?>
		</p>
	<?php endif; ?>
	<?php
	get_template_part(
		'template-parts/components/button',
		null,
		array(
			'class'         => 'orlyata-application-form__submit',
			'label'         => __( 'Отправить заявку', 'orlyata' ),
			'loading'       => $is_submitting,
			'loading_label' => __( 'Отправляем заявку …', 'orlyata' ),
			'type'          => 'submit',
			'variant'       => 'primary',
		)
	);
	?>
	<p class="orlyata-application-form__privacy">
		<?php esc_html_e( 'Нажимая на кнопку, вы соглашаетесь с', 'orlyata' ); ?>&nbsp;<a href="<?php echo esc_url( $privacy_url ); ?>"><?php esc_html_e( 'политикой конфиденциальности', 'orlyata' ); ?></a>
	</p>
</form>
