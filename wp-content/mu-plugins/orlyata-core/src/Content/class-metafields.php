<?php
/**
 * Content meta fields and safe admin editing controls.
 *
 * @package OrlyataCore
 */

namespace OrlyataCore\Content;

use WP_Post;

defined( 'ABSPATH' ) || exit;

/**
 * Registers and saves project-owned fields.
 */
final class MetaFields {
	/**
	 * Register meta schema and editor hooks.
	 *
	 * @return void
	 */
	public static function register(): void {
		foreach ( self::get_meta_schema() as $post_type => $fields ) {
			foreach ( $fields as $key => $definition ) {
				register_post_meta(
					$post_type,
					$key,
					array(
						'type'              => $definition['type'],
						'single'            => true,
						'show_in_rest'      => false,
						'sanitize_callback' => $definition['sanitize_callback'],
						'auth_callback'     => static function ( bool $allowed, string $meta_key, int $post_id ): bool {
							return $allowed && current_user_can( 'edit_post', $post_id );
						},
					)
				);
			}
		}

		add_action( 'add_meta_boxes', array( self::class, 'register_meta_boxes' ) );
		add_action( 'save_post', array( self::class, 'save' ), 10, 2 );
		add_action( 'admin_enqueue_scripts', array( self::class, 'enqueue_admin_assets' ) );
	}

	/**
	 * Load the WordPress media frame only for project content editors.
	 *
	 * @param string $hook Current admin hook suffix.
	 * @return void
	 */
	public static function enqueue_admin_assets( string $hook ): void {
		if ( ! in_array( $hook, array( 'post.php', 'post-new.php' ), true ) ) {
			return;
		}

		$screen = get_current_screen();

		if ( ! $screen || ! in_array( $screen->post_type, array( 'teacher', 'score', 'photo_album' ), true ) ) {
			return;
		}

		wp_enqueue_media();
		wp_enqueue_script(
			'orlyata-core-admin-media',
			content_url( 'mu-plugins/orlyata-core/assets/admin-media.js' ),
			array(),
			ORLYATA_CORE_VERSION,
			true
		);
	}


	/**
	 * Add one managed field box per project type.
	 *
	 * @return void
	 */
	public static function register_meta_boxes(): void {
		$labels = array(
			'news'              => __( 'Данные публикации', 'orlyata' ),
			'teacher'           => __( 'Данные педагога', 'orlyata' ),
			'choir_achievement' => __( 'Данные достижения', 'orlyata' ),
			'score'             => __( 'Данные ноты', 'orlyata' ),
			'photo_album'       => __( 'Данные фотоальбома', 'orlyata' ),
			'video'             => __( 'Данные видео', 'orlyata' ),
		);

		foreach ( $labels as $post_type => $label ) {
			add_meta_box(
				'orlyata-core-' . $post_type,
				$label,
				array( self::class, 'render' ),
				$post_type,
				'normal',
				'high'
			);
		}
	}

	/**
	 * Render a post type's controlled fields.
	 *
	 * @param WP_Post $post Current post.
	 * @return void
	 */
	public static function render( WP_Post $post ): void {
		wp_nonce_field( 'orlyata_core_save_meta', 'orlyata_core_meta_nonce' );

		switch ( $post->post_type ) {
			case 'news':
				self::render_news_fields( $post );
				break;
			case 'teacher':
				self::render_teacher_fields( $post );
				break;
			case 'choir_achievement':
				self::render_achievement_fields( $post );
				break;
			case 'score':
				self::render_score_fields( $post );
				break;
			case 'photo_album':
				self::render_photo_album_fields( $post );
				break;
			case 'video':
				self::render_video_fields( $post );
				break;
		}
	}

	/**
	 * Save fields only after WordPress has verified the editor context.
	 *
	 * @param int     $post_id Post ID.
	 * @param WP_Post $post Current post.
	 * @return void
	 */
	public static function save( int $post_id, WP_Post $post ): void {
		if ( ! in_array( $post->post_type, PostTypes::get_content_types(), true ) ) {
			return;
		}

		if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) || ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		$nonce = isset( $_POST['orlyata_core_meta_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['orlyata_core_meta_nonce'] ) ) : '';

		if ( ! wp_verify_nonce( $nonce, 'orlyata_core_save_meta' ) ) {
			return;
		}

		$input = array();

		if ( isset( $_POST['orlyata_core_meta'] ) && is_array( $_POST['orlyata_core_meta'] ) ) {
			$input = map_deep( wp_unslash( $_POST['orlyata_core_meta'] ), 'sanitize_text_field' );
		}

		switch ( $post->post_type ) {
			case 'news':
				self::save_news_fields( $post_id, $input );
				break;
			case 'teacher':
				self::save_teacher_fields( $post_id, $input );
				break;
			case 'choir_achievement':
				self::save_achievement_fields( $post_id, $input );
				break;
			case 'score':
				self::save_score_fields( $post_id, $input );
				break;
			case 'photo_album':
				self::save_photo_album_fields( $post_id, $input );
				break;
			case 'video':
				self::save_video_fields( $post_id, $input );
				break;
		}
	}

	/**
	 * Get every post meta registration definition.
	 *
	 * @return array<string, array<string, array<string, mixed>>>
	 */
	private static function get_meta_schema(): array {
		return array(
			'news'              => array(
				'orlyata_news_summary'         => array(
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_textarea_field',
				),
				'orlyata_news_seo_title'       => array(
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'orlyata_news_seo_description' => array(
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_textarea_field',
				),
			),
			'teacher'           => array(
				'orlyata_teacher_display_name' => array(
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'orlyata_teacher_full_name'    => array(
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'orlyata_teacher_position'     => array(
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'orlyata_teacher_quote'        => array(
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_textarea_field',
				),
				'orlyata_teacher_rank'         => array(
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'orlyata_teacher_achievements' => array(
					'type'              => 'array',
					'sanitize_callback' => array( self::class, 'sanitize_achievement_lines' ),
				),
				'orlyata_teacher_photo_ids'    => array(
					'type'              => 'array',
					'sanitize_callback' => array( Media::class, 'sanitize_image_attachment_ids' ),
				),
			),
			'choir_achievement' => array(
				'orlyata_achievement_year'   => array(
					'type'              => 'integer',
					'sanitize_callback' => 'absint',
				),
				'orlyata_achievement_result' => array(
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'orlyata_achievement_choir'  => array(
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'orlyata_achievement_event'  => array(
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
			),
			'score'             => array(
				'orlyata_score_author'            => array(
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_text_field',
				),
				'orlyata_score_pdf_attachment_id' => array(
					'type'              => 'integer',
					'sanitize_callback' => 'absint',
				),
			),
			'photo_album'       => array(
				'orlyata_photo_ids'      => array(
					'type'              => 'array',
					'sanitize_callback' => array( Media::class, 'sanitize_image_attachment_ids' ),
				),
				'orlyata_photo_cover_id' => array(
					'type'              => 'integer',
					'sanitize_callback' => 'absint',
				),
			),
			'video'             => array(
				'orlyata_video_url'            => array(
					'type'              => 'string',
					'sanitize_callback' => array( Media::class, 'normalize_video_url' ),
				),
				'orlyata_video_description'    => array(
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_textarea_field',
				),
				'orlyata_video_preview_offset' => array(
					'type'              => 'integer',
					'sanitize_callback' => 'absint',
				),
				'orlyata_video_provider'       => array(
					'type'              => 'string',
					'sanitize_callback' => 'sanitize_key',
				),
			),
		);
	}

	/**
	 * Render publication fields.
	 *
	 * @param WP_Post $post Current post.
	 * @return void
	 */
	private static function render_news_fields( WP_Post $post ): void {
		self::render_term_select( $post->ID, 'orlyata_news_category', __( 'Категория', 'orlyata' ), 'news' );
		self::render_textarea( 'summary', __( 'Краткий анонс', 'orlyata' ), (string) get_post_meta( $post->ID, 'orlyata_news_summary', true ), 3 );
		self::render_text_input( 'seo_title', __( 'SEO title', 'orlyata' ), (string) get_post_meta( $post->ID, 'orlyata_news_seo_title', true ) );
		self::render_textarea( 'seo_description', __( 'SEO description', 'orlyata' ), (string) get_post_meta( $post->ID, 'orlyata_news_seo_description', true ), 3 );
	}

	/**
	 * Render teacher fields.
	 *
	 * @param WP_Post $post Current post.
	 * @return void
	 */
	private static function render_teacher_fields( WP_Post $post ): void {
		self::render_text_input( 'display_name', __( 'Отображаемое имя', 'orlyata' ), (string) get_post_meta( $post->ID, 'orlyata_teacher_display_name', true ) );
		self::render_text_input( 'full_name', __( 'ФИО', 'orlyata' ), (string) get_post_meta( $post->ID, 'orlyata_teacher_full_name', true ) );
		self::render_text_input( 'position', __( 'Должность', 'orlyata' ), (string) get_post_meta( $post->ID, 'orlyata_teacher_position', true ) );
		self::render_textarea( 'quote', __( 'Цитата', 'orlyata' ), (string) get_post_meta( $post->ID, 'orlyata_teacher_quote', true ), 3 );
		self::render_text_input( 'rank', __( 'Звание (необязательно)', 'orlyata' ), (string) get_post_meta( $post->ID, 'orlyata_teacher_rank', true ) );
		self::render_textarea( 'achievements', __( 'Личные достижения', 'orlyata' ), self::format_achievement_lines( get_post_meta( $post->ID, 'orlyata_teacher_achievements', true ) ), 5, __( 'По одному достижению в строке: год | название.', 'orlyata' ) );
		self::render_attachment_select( 'teacher_photo_ids', __( 'Фотографии', 'orlyata' ), Media::sanitize_image_attachment_ids( get_post_meta( $post->ID, 'orlyata_teacher_photo_ids', true ) ), 'image', true );
	}

	/**
	 * Render choir achievement fields.
	 *
	 * @param WP_Post $post Current post.
	 * @return void
	 */
	private static function render_achievement_fields( WP_Post $post ): void {
		self::render_text_input( 'achievement_year', __( 'Год', 'orlyata' ), (string) get_post_meta( $post->ID, 'orlyata_achievement_year', true ), 'number', 4 );
		self::render_text_input( 'achievement_result', __( 'Результат / награда', 'orlyata' ), (string) get_post_meta( $post->ID, 'orlyata_achievement_result', true ) );
		self::render_text_input( 'achievement_choir', __( 'Хор', 'orlyata' ), (string) get_post_meta( $post->ID, 'orlyata_achievement_choir', true ) );
		self::render_text_input( 'achievement_event', __( 'Конкурс или событие', 'orlyata' ), (string) get_post_meta( $post->ID, 'orlyata_achievement_event', true ) );
	}

	/**
	 * Render score fields.
	 *
	 * @param WP_Post $post Current post.
	 * @return void
	 */
	private static function render_score_fields( WP_Post $post ): void {
		self::render_text_input( 'score_author', __( 'Автор', 'orlyata' ), (string) get_post_meta( $post->ID, 'orlyata_score_author', true ) );
		self::render_term_select( $post->ID, 'orlyata_score_choir', __( 'Хор', 'orlyata' ), '' );
		self::render_attachment_select( 'score_pdf_attachment_id', __( 'PDF-файл', 'orlyata' ), array( absint( get_post_meta( $post->ID, 'orlyata_score_pdf_attachment_id', true ) ) ), 'application/pdf', false );
	}

	/**
	 * Render photo album fields.
	 *
	 * @param WP_Post $post Current post.
	 * @return void
	 */
	private static function render_photo_album_fields( WP_Post $post ): void {
		$image_ids = Media::sanitize_image_attachment_ids( get_post_meta( $post->ID, 'orlyata_photo_ids', true ) );
		$cover_id  = absint( get_post_meta( $post->ID, 'orlyata_photo_cover_id', true ) );

		self::render_term_select( $post->ID, 'orlyata_media_category', __( 'Категория', 'orlyata' ), 'other' );
		self::render_attachment_select( 'photo_ids', __( 'Фотографии альбома', 'orlyata' ), $image_ids, 'image', true, __( 'Сначала сохраните альбом с выбранными фотографиями, затем выберите обложку из этого набора.', 'orlyata' ) );
		self::render_attachment_select( 'photo_cover_id', __( 'Обложка альбома', 'orlyata' ), array( $cover_id ), 'image', false, '', $image_ids );
	}

	/**
	 * Render video fields.
	 *
	 * @param WP_Post $post Current post.
	 * @return void
	 */
	private static function render_video_fields( WP_Post $post ): void {
		$url      = (string) get_post_meta( $post->ID, 'orlyata_video_url', true );
		$provider = (string) get_post_meta( $post->ID, 'orlyata_video_provider', true );

		self::render_term_select( $post->ID, 'orlyata_media_category', __( 'Категория', 'orlyata' ), 'other' );
		self::render_text_input( 'video_url', __( 'Внешний URL', 'orlyata' ), $url, 'url' );
		self::render_textarea( 'video_description', __( 'Описание', 'orlyata' ), (string) get_post_meta( $post->ID, 'orlyata_video_description', true ), 4 );
		self::render_text_input( 'video_preview_offset', __( 'Начало превью (секунды)', 'orlyata' ), (string) absint( get_post_meta( $post->ID, 'orlyata_video_preview_offset', true ) ), 'number', 0 );
		$provider_label = Media::get_video_provider_label( $provider );
		if ( '' === $provider_label ) {
			$provider_label = __( 'Определяется после сохранения URL.', 'orlyata' );
		}
		?>
		<p><strong><?php esc_html_e( 'Провайдер', 'orlyata' ); ?>:</strong> <?php echo esc_html( $provider_label ); ?></p>
		<?php
	}

	/**
	 * Save news fields.
	 *
	 * @param int                  $post_id Post ID.
	 * @param array<string, mixed> $input Sanitized request shape.
	 * @return void
	 */
	private static function save_news_fields( int $post_id, array $input ): void {
		self::save_text_meta( $post_id, 'orlyata_news_summary', $input['summary'] ?? '', 'sanitize_textarea_field' );
		self::save_text_meta( $post_id, 'orlyata_news_seo_title', $input['seo_title'] ?? '', 'sanitize_text_field' );
		self::save_text_meta( $post_id, 'orlyata_news_seo_description', $input['seo_description'] ?? '', 'sanitize_textarea_field' );
		self::save_term( $post_id, 'orlyata_news_category', $input['orlyata_news_category'] ?? 'news', 'news' );
	}

	/**
	 * Save teacher fields.
	 *
	 * @param int                  $post_id Post ID.
	 * @param array<string, mixed> $input Sanitized request shape.
	 * @return void
	 */
	private static function save_teacher_fields( int $post_id, array $input ): void {
		$fields = array(
			'display_name' => 'orlyata_teacher_display_name',
			'full_name'    => 'orlyata_teacher_full_name',
			'position'     => 'orlyata_teacher_position',
			'quote'        => 'orlyata_teacher_quote',
			'rank'         => 'orlyata_teacher_rank',
		);

		foreach ( $fields as $input_key => $meta_key ) {
			$sanitize_callback = 'quote' === $input_key ? 'sanitize_textarea_field' : 'sanitize_text_field';
			self::save_text_meta( $post_id, $meta_key, $input[ $input_key ] ?? '', $sanitize_callback );
		}

		self::save_array_meta( $post_id, 'orlyata_teacher_achievements', self::sanitize_achievement_lines( $input['achievements'] ?? '' ) );
		self::save_array_meta( $post_id, 'orlyata_teacher_photo_ids', Media::sanitize_image_attachment_ids( $input['teacher_photo_ids'] ?? array() ) );
	}

	/**
	 * Save achievement fields.
	 *
	 * @param int                  $post_id Post ID.
	 * @param array<string, mixed> $input Sanitized request shape.
	 * @return void
	 */
	private static function save_achievement_fields( int $post_id, array $input ): void {
		update_post_meta( $post_id, 'orlyata_achievement_year', absint( $input['achievement_year'] ?? 0 ) );
		self::save_text_meta( $post_id, 'orlyata_achievement_result', $input['achievement_result'] ?? '', 'sanitize_text_field' );
		self::save_text_meta( $post_id, 'orlyata_achievement_choir', $input['achievement_choir'] ?? '', 'sanitize_text_field' );
		self::save_text_meta( $post_id, 'orlyata_achievement_event', $input['achievement_event'] ?? '', 'sanitize_text_field' );
	}

	/**
	 * Save score fields.
	 *
	 * @param int                  $post_id Post ID.
	 * @param array<string, mixed> $input Sanitized request shape.
	 * @return void
	 */
	private static function save_score_fields( int $post_id, array $input ): void {
		$pdf_id = absint( $input['score_pdf_attachment_id'] ?? 0 );

		self::save_text_meta( $post_id, 'orlyata_score_author', $input['score_author'] ?? '', 'sanitize_text_field' );

		if ( 0 === $pdf_id || ! Media::is_pdf_attachment( $pdf_id ) ) {
			delete_post_meta( $post_id, 'orlyata_score_pdf_attachment_id' );
		} else {
			update_post_meta( $post_id, 'orlyata_score_pdf_attachment_id', $pdf_id );
		}

		self::save_term( $post_id, 'orlyata_score_choir', $input['orlyata_score_choir'] ?? '', '' );
	}

	/**
	 * Save photo album fields and enforce cover membership.
	 *
	 * @param int                  $post_id Post ID.
	 * @param array<string, mixed> $input Sanitized request shape.
	 * @return void
	 */
	private static function save_photo_album_fields( int $post_id, array $input ): void {
		$image_ids = Media::sanitize_image_attachment_ids( $input['photo_ids'] ?? array() );
		$cover_id  = absint( $input['photo_cover_id'] ?? 0 );

		self::save_array_meta( $post_id, 'orlyata_photo_ids', $image_ids );

		if ( in_array( $cover_id, $image_ids, true ) ) {
			update_post_meta( $post_id, 'orlyata_photo_cover_id', $cover_id );
		} else {
			delete_post_meta( $post_id, 'orlyata_photo_cover_id' );
		}

		self::save_term( $post_id, 'orlyata_media_category', $input['orlyata_media_category'] ?? 'other', 'other' );
	}

	/**
	 * Save video fields and set its provider only from normalized data.
	 *
	 * @param int                  $post_id Post ID.
	 * @param array<string, mixed> $input Sanitized request shape.
	 * @return void
	 */
	private static function save_video_fields( int $post_id, array $input ): void {
		$url = Media::normalize_video_url( $input['video_url'] ?? '' );

		if ( '' === $url ) {
			delete_post_meta( $post_id, 'orlyata_video_url' );
			delete_post_meta( $post_id, 'orlyata_video_provider' );
		} else {
			update_post_meta( $post_id, 'orlyata_video_url', $url );
			update_post_meta( $post_id, 'orlyata_video_provider', Media::detect_video_provider( $url ) );
		}

		self::save_text_meta( $post_id, 'orlyata_video_description', $input['video_description'] ?? '', 'sanitize_textarea_field' );
		update_post_meta( $post_id, 'orlyata_video_preview_offset', absint( $input['video_preview_offset'] ?? 0 ) );
		self::save_term( $post_id, 'orlyata_media_category', $input['orlyata_media_category'] ?? 'other', 'other' );
	}

	/**
	 * Render a single-line input.
	 *
	 * @param string $key Field key.
	 * @param string $label Visible label.
	 * @param string $value Field value.
	 * @param string $type HTML type.
	 * @param int    $min Minimum numeric value.
	 * @return void
	 */
	private static function render_text_input( string $key, string $label, string $value, string $type = 'text', int $min = 0 ): void {
		?>
		<p>
			<label for="<?php echo esc_attr( 'orlyata-' . $key ); ?>"><?php echo esc_html( $label ); ?></label><br>
			<input class="widefat" id="<?php echo esc_attr( 'orlyata-' . $key ); ?>" name="orlyata_core_meta[<?php echo esc_attr( $key ); ?>]" type="<?php echo esc_attr( $type ); ?>" value="<?php echo esc_attr( $value ); ?>" 
			<?php
			if ( 'number' === $type ) :
				?>
				min="<?php echo esc_attr( (string) $min ); ?>"<?php endif; ?>>
		</p>
		<?php
	}

	/**
	 * Render a multiline input.
	 *
	 * @param string $key Field key.
	 * @param string $label Visible label.
	 * @param string $value Field value.
	 * @param int    $rows Number of rows.
	 * @param string $description Optional help text.
	 * @return void
	 */
	private static function render_textarea( string $key, string $label, string $value, int $rows, string $description = '' ): void {
		?>
		<p>
			<label for="<?php echo esc_attr( 'orlyata-' . $key ); ?>"><?php echo esc_html( $label ); ?></label><br>
			<textarea class="widefat" id="<?php echo esc_attr( 'orlyata-' . $key ); ?>" name="orlyata_core_meta[<?php echo esc_attr( $key ); ?>]" rows="<?php echo esc_attr( (string) $rows ); ?>"><?php echo esc_textarea( $value ); ?></textarea>
			<?php if ( '' !== $description ) : ?>
				<span class="description"><?php echo esc_html( $description ); ?></span>
			<?php endif; ?>
		</p>
		<?php
	}

	/**
	 * Render a controlled taxonomy select.
	 *
	 * @param int    $post_id Post ID.
	 * @param string $taxonomy Taxonomy key.
	 * @param string $label Visible label.
	 * @param string $fallback Default slug.
	 * @return void
	 */
	private static function render_term_select( int $post_id, string $taxonomy, string $label, string $fallback ): void {
		$terms = wp_get_object_terms( $post_id, $taxonomy, array( 'fields' => 'slugs' ) );
		$slug  = is_array( $terms ) && is_string( $terms[0] ?? null ) ? (string) $terms[0] : $fallback;
		?>
		<p>
			<label for="<?php echo esc_attr( 'orlyata-' . $taxonomy ); ?>"><?php echo esc_html( $label ); ?></label><br>
			<select class="widefat" id="<?php echo esc_attr( 'orlyata-' . $taxonomy ); ?>" name="orlyata_core_meta[<?php echo esc_attr( $taxonomy ); ?>]">
				<?php foreach ( PostTypes::get_term_definitions()[ $taxonomy ] as $term_slug => $term_name ) : ?>
					<option value="<?php echo esc_attr( $term_slug ); ?>" <?php selected( $slug, $term_slug ); ?>><?php echo esc_html( $term_name ); ?></option>
				<?php endforeach; ?>
			</select>
		</p>
		<?php
	}

	/**
	 * Render a verified attachment select.
	 *
	 * @param string          $key Field key.
	 * @param string          $label Visible label.
	 * @param array<int, int> $selected_ids Selected IDs.
	 * @param string          $mime_type MIME type or family.
	 * @param bool            $multiple Whether multiple IDs are allowed.
	 * @param string          $description Optional help text.
	 * @param array<int, int> $allowed_ids Optional narrowed IDs.
	 * @return void
	 */
	private static function render_attachment_select( string $key, string $label, array $selected_ids, string $mime_type, bool $multiple, string $description = '', array $allowed_ids = array() ): void {
		$attachments  = self::get_attachments( $mime_type, $allowed_ids );
		$name         = 'orlyata_core_meta[' . $key . ']' . ( $multiple ? '[]' : '' );
		$cover_for    = 'photo_cover_id' === $key ? 'orlyata-photo_ids' : '';
		$button_label = 'image' === $mime_type ? __( 'Загрузить или добавить фотографии', 'orlyata' ) : __( 'Загрузить или выбрать PDF', 'orlyata' );
		?>
		<p>
			<label for="<?php echo esc_attr( 'orlyata-' . $key ); ?>"><?php echo esc_html( $label ); ?></label><br>
			<button class="button button-secondary orlyata-core-media-upload" type="button" data-orlyata-media-target="<?php echo esc_attr( 'orlyata-' . $key ); ?>" data-orlyata-media-type="<?php echo esc_attr( $mime_type ); ?>" data-orlyata-media-multiple="<?php echo esc_attr( $multiple ? 'true' : 'false' ); ?>" data-orlyata-media-title="<?php echo esc_attr( $button_label ); ?>" data-orlyata-media-button="<?php esc_attr_e( 'Использовать выбранные файлы', 'orlyata' ); ?>"><?php echo esc_html( $button_label ); ?></button>
			<select class="widefat orlyata-core-attachment-select" data-orlyata-cover-for="<?php echo esc_attr( $cover_for ); ?>" id="<?php echo esc_attr( 'orlyata-' . $key ); ?>" name="<?php echo esc_attr( $name ); ?>"
			<?php
			if ( $multiple ) :
				?>
				multiple size="8"<?php endif; ?>>
				<option value="0"><?php esc_html_e( '— Не выбрано —', 'orlyata' ); ?></option>
				<?php foreach ( $attachments as $attachment ) : ?>
					<option value="<?php echo esc_attr( (string) $attachment->ID ); ?>" <?php selected( in_array( $attachment->ID, $selected_ids, true ) ); ?>><?php echo esc_html( $attachment->post_title . ' (#' . $attachment->ID . ')' ); ?></option>
				<?php endforeach; ?>
			</select>
			<?php if ( '' !== $description ) : ?>
				<span class="description"><?php echo esc_html( $description ); ?></span>
			<?php endif; ?>
		</p>
		<?php
	}


	/**
	 * Get candidate attachments for controlled select inputs.
	 *
	 * @param string          $mime_type MIME type or family.
	 * @param array<int, int> $allowed_ids Optional narrowed IDs.
	 * @return array<int, WP_Post>
	 */
	private static function get_attachments( string $mime_type, array $allowed_ids = array() ): array {
		$args = array(
			'post_type'      => 'attachment',
			'post_status'    => 'inherit',
			// phpcs:ignore WordPress.WP.PostsPerPage.posts_per_page_posts_per_page -- Editor select is intentionally capped to the controlled media library.
			'posts_per_page' => 500,
			'orderby'        => 'title',
			'order'          => 'ASC',
		);

		if ( array() !== $allowed_ids ) {
			$args['post__in'] = $allowed_ids;
		} else {
			$args['post_mime_type'] = $mime_type;
		}

		$attachments = get_posts( $args );

		return array_values(
			array_filter(
				$attachments,
				static function ( WP_Post $attachment ) use ( $mime_type ): bool {
					return 'image' === $mime_type ? Media::is_image_attachment( $attachment->ID ) : Media::is_pdf_attachment( $attachment->ID );
				}
			)
		);
	}

	/**
	 * Persist allowed taxonomy terms only.
	 *
	 * @param int    $post_id Post ID.
	 * @param string $taxonomy Taxonomy key.
	 * @param mixed  $value Candidate slug.
	 * @param string $fallback Default slug.
	 * @return void
	 */
	private static function save_term( int $post_id, string $taxonomy, mixed $value, string $fallback ): void {
		$slug    = is_string( $value ) ? sanitize_key( $value ) : '';
		$allowed = PostTypes::get_term_definitions()[ $taxonomy ] ?? array();

		if ( ! isset( $allowed[ $slug ] ) ) {
			$slug = $fallback;
		}

		if ( '' !== $slug ) {
			wp_set_object_terms( $post_id, $slug, $taxonomy, false );
		}
	}

	/**
	 * Persist a scalar text meta field, removing empty values.
	 *
	 * @param int      $post_id Post ID.
	 * @param string   $meta_key Meta key.
	 * @param mixed    $value Candidate value.
	 * @param callable $sanitize_callback Sanitizer.
	 * @return void
	 */
	private static function save_text_meta( int $post_id, string $meta_key, mixed $value, callable $sanitize_callback ): void {
		$value = is_scalar( $value ) ? call_user_func( $sanitize_callback, (string) $value ) : '';

		if ( '' === $value ) {
			delete_post_meta( $post_id, $meta_key );
			return;
		}

		update_post_meta( $post_id, $meta_key, $value );
	}

	/**
	 * Persist an array meta field, removing empty values.
	 *
	 * @param int               $post_id Post ID.
	 * @param string            $meta_key Meta key.
	 * @param array<int, mixed> $value Sanitized values.
	 * @return void
	 */
	private static function save_array_meta( int $post_id, string $meta_key, array $value ): void {
		if ( array() === $value ) {
			delete_post_meta( $post_id, $meta_key );
			return;
		}

		update_post_meta( $post_id, $meta_key, $value );
	}

	/**
	 * Convert teacher achievement textarea into structured values.
	 *
	 * @param mixed $value Multiline input.
	 * @return array<int, array{year: int, title: string}>
	 */
	public static function sanitize_achievement_lines( mixed $value ): array {
		$lines        = is_string( $value ) ? preg_split( '/\R/u', $value ) : array();
		$achievements = array();

		if ( ! is_array( $lines ) ) {
			return $achievements;
		}

		foreach ( $lines as $line ) {
			$parts = explode( '|', (string) $line, 2 );
			$year  = absint( trim( $parts[0] ) );
			$title = isset( $parts[1] ) ? sanitize_text_field( trim( $parts[1] ) ) : '';

			if ( 0 !== $year && '' !== $title ) {
				$achievements[] = array(
					'year'  => $year,
					'title' => $title,
				);
			}
		}

		return $achievements;
	}

	/**
	 * Format stored teacher achievements for the admin textarea.
	 *
	 * @param mixed $achievements Stored data.
	 * @return string
	 */
	private static function format_achievement_lines( mixed $achievements ): string {
		if ( ! is_array( $achievements ) ) {
			return '';
		}

		$lines = array();

		foreach ( $achievements as $achievement ) {
			if ( is_array( $achievement ) && isset( $achievement['year'], $achievement['title'] ) ) {
				$lines[] = absint( $achievement['year'] ) . ' | ' . sanitize_text_field( (string) $achievement['title'] );
			}
		}

		return implode( "\n", $lines );
	}
}
