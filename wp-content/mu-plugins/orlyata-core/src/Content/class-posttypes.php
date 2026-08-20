<?php
/**
 * Project post types and closed taxonomies.
 *
 * @package OrlyataCore
 */

namespace OrlyataCore\Content;

defined( 'ABSPATH' ) || exit;

/**
 * Registers content entities owned by orlyata-core.
 */
final class PostTypes {
	/**
	 * Register all post types and taxonomies.
	 *
	 * @return void
	 */
	public static function register(): void {
		self::register_taxonomies();
		self::register_post_types();
		self::seed_closed_terms();
	}

	/**
	 * Get allowed project post types.
	 *
	 * @return array<int, string>
	 */
	public static function get_content_types(): array {
		return array( 'news', 'teacher', 'choir_achievement', 'score', 'photo_album', 'video' );
	}

	/**
	 * Register closed vocabularies.
	 *
	 * @return void
	 */
	private static function register_taxonomies(): void {
		register_taxonomy(
			'orlyata_news_category',
			array( 'news' ),
			self::get_closed_taxonomy_args( __( 'Категории новостей', 'orlyata' ) )
		);
		register_taxonomy(
			'orlyata_media_category',
			array( 'photo_album', 'video' ),
			self::get_closed_taxonomy_args( __( 'Категории медиа', 'orlyata' ) )
		);
		register_taxonomy(
			'orlyata_score_choir',
			array( 'score' ),
			self::get_closed_taxonomy_args( __( 'Хоры', 'orlyata' ) )
		);
	}

	/**
	 * Build the common configuration for a code-owned vocabulary.
	 *
	 * @param string $label Admin-facing singular label.
	 * @return array<string, mixed>
	 */
	private static function get_closed_taxonomy_args( string $label ): array {
		return array(
			'labels'             => array(
				'name'          => $label,
				'singular_name' => $label,
			),
			'public'             => false,
			'publicly_queryable' => false,
			'show_ui'            => false,
			'show_in_menu'       => false,
			'show_in_nav_menus'  => false,
			'show_tagcloud'      => false,
			'show_in_rest'       => false,
			'hierarchical'       => false,
			'rewrite'            => false,
			'query_var'          => false,
			'meta_box_cb'        => false,
			'capabilities'       => array(
				'manage_terms' => 'manage_orlyata_taxonomies',
				'edit_terms'   => 'manage_orlyata_taxonomies',
				'delete_terms' => 'manage_orlyata_taxonomies',
				'assign_terms' => 'edit_posts',
			),
		);
	}

	/**
	 * Register all content post types.
	 *
	 * @return void
	 */
	private static function register_post_types(): void {
		register_post_type(
			'news',
			array(
				'labels'           => self::get_labels( __( 'Новости', 'orlyata' ), __( 'Новость', 'orlyata' ) ),
				'public'           => true,
				'show_in_rest'     => true,
				'has_archive'      => 'novosti',
				'rewrite'          => array(
					'slug'       => 'novosti',
					'with_front' => false,
				),
				'supports'         => array( 'title', 'editor', 'excerpt', 'thumbnail' ),
				'menu_icon'        => 'dashicons-megaphone',
				'capability_type'  => array( 'orlyata_news_item', 'orlyata_news_items' ),
				'map_meta_cap'     => true,
				'delete_with_user' => false,
			)
		);
		register_post_type(
			'teacher',
			array(
				'labels'           => self::get_labels( __( 'Педагоги', 'orlyata' ), __( 'Педагог', 'orlyata' ) ),
				'public'           => true,
				'show_in_rest'     => true,
				'has_archive'      => false,
				'rewrite'          => array(
					'slug'       => 'pedagogi',
					'with_front' => false,
				),
				'supports'         => array( 'title', 'thumbnail', 'page-attributes' ),
				'menu_icon'        => 'dashicons-groups',
				'capability_type'  => array( 'orlyata_teacher_item', 'orlyata_teacher_items' ),
				'map_meta_cap'     => true,
				'delete_with_user' => false,
			)
		);
		register_post_type(
			'choir_achievement',
			array(
				'labels'           => self::get_labels( __( 'Достижения капеллы', 'orlyata' ), __( 'Достижение капеллы', 'orlyata' ) ),
				'public'           => false,
				'show_ui'          => true,
				'show_in_rest'     => false,
				'supports'         => array( 'title', 'page-attributes' ),
				'menu_icon'        => 'dashicons-awards',
				'capability_type'  => array( 'orlyata_choir_achievement_item', 'orlyata_choir_achievement_items' ),
				'map_meta_cap'     => true,
				'delete_with_user' => false,
			)
		);
		register_post_type(
			'score',
			array(
				'labels'           => self::get_labels( __( 'Ноты', 'orlyata' ), __( 'Нота', 'orlyata' ) ),
				'public'           => false,
				'show_ui'          => true,
				'show_in_rest'     => false,
				'supports'         => array( 'title', 'page-attributes' ),
				'menu_icon'        => 'dashicons-media-document',
				'capability_type'  => array( 'orlyata_score_item', 'orlyata_score_items' ),
				'map_meta_cap'     => true,
				'delete_with_user' => false,
			)
		);
		register_post_type(
			'photo_album',
			array(
				'labels'           => self::get_labels( __( 'Фотоальбомы', 'orlyata' ), __( 'Фотоальбом', 'orlyata' ) ),
				'public'           => true,
				'show_in_rest'     => true,
				'has_archive'      => false,
				'rewrite'          => array(
					'slug'       => 'mediagalereya/foto',
					'with_front' => false,
				),
				'supports'         => array( 'title' ),
				'menu_icon'        => 'dashicons-format-gallery',
				'capability_type'  => array( 'orlyata_photo_album_item', 'orlyata_photo_album_items' ),
				'map_meta_cap'     => true,
				'delete_with_user' => false,
			)
		);
		register_post_type(
			'video',
			array(
				'labels'           => self::get_labels( __( 'Видео', 'orlyata' ), __( 'Видео', 'orlyata' ) ),
				'public'           => true,
				'show_in_rest'     => true,
				'has_archive'      => false,
				'rewrite'          => array(
					'slug'       => 'mediagalereya/video',
					'with_front' => false,
				),
				'supports'         => array( 'title' ),
				'menu_icon'        => 'dashicons-video-alt3',
				'capability_type'  => array( 'orlyata_video_item', 'orlyata_video_items' ),
				'map_meta_cap'     => true,
				'delete_with_user' => false,
			)
		);
	}

	/**
	 * Create standard post type labels.
	 *
	 * @param string $plural Plural label.
	 * @param string $singular Singular label.
	 * @return array<string, string>
	 */
	private static function get_labels( string $plural, string $singular ): array {
		return array(
			'name'               => $plural,
			'singular_name'      => $singular,
			'add_new'            => __( 'Добавить', 'orlyata' ),
			/* translators: %s: singular content type label. */
			'add_new_item'       => sprintf( __( 'Добавить: %s', 'orlyata' ), $singular ),
			/* translators: %s: singular content type label. */
			'edit_item'          => sprintf( __( 'Редактировать: %s', 'orlyata' ), $singular ),
			/* translators: %s: singular content type label. */
			'new_item'           => sprintf( __( 'Новый объект: %s', 'orlyata' ), $singular ),
			/* translators: %s: singular content type label. */
			'view_item'          => sprintf( __( 'Открыть: %s', 'orlyata' ), $singular ),
			/* translators: %s: plural content type label. */
			'search_items'       => sprintf( __( 'Искать: %s', 'orlyata' ), $plural ),
			'not_found'          => __( 'Ничего не найдено.', 'orlyata' ),
			'not_found_in_trash' => __( 'В корзине ничего нет.', 'orlyata' ),
			'menu_name'          => $plural,
		);
	}

	/**
	 * Seed terms that are selected in custom meta boxes.
	 *
	 * @return void
	 */
	private static function seed_closed_terms(): void {
		foreach ( self::get_term_definitions() as $taxonomy => $terms ) {
			foreach ( $terms as $slug => $name ) {
				if ( ! term_exists( $slug, $taxonomy ) ) {
					wp_insert_term( $name, $taxonomy, array( 'slug' => $slug ) );
				}
			}
		}
	}

	/**
	 * Get code-owned term definitions.
	 *
	 * @return array<string, array<string, string>>
	 */
	public static function get_term_definitions(): array {
		return array(
			'orlyata_news_category'  => array(
				'news'         => __( 'Новости', 'orlyata' ),
				'announcement' => __( 'Объявления', 'orlyata' ),
				'achievement'  => __( 'Достижения', 'orlyata' ),
			),
			'orlyata_media_category' => array(
				'performance' => __( 'Выступления', 'orlyata' ),
				'rehearsal'   => __( 'Занятия', 'orlyata' ),
				'leisure'     => __( 'Отдых', 'orlyata' ),
				'other'       => __( 'Разное', 'orlyata' ),
			),
			'orlyata_score_choir'    => array(
				'preschool' => __( 'Дошкольники', 'orlyata' ),
				'junior'    => __( 'Младший', 'orlyata' ),
				'senior'    => __( 'Старший', 'orlyata' ),
				'youth'     => __( 'Юноши', 'orlyata' ),
			),
		);
	}
}
