<?php
/**
 * Content-editor role and custom capability management.
 *
 * @package OrlyataCore
 */

namespace OrlyataCore\Roles;

defined( 'ABSPATH' ) || exit;

/**
 * Synchronizes project capabilities without relying on activation hooks.
 */
final class RoleManager {
	/**
	 * Content types owned by the project.
	 *
	 * @var array<string, string>
	 */
	private const CAPABILITY_TYPES = array(
		'news'              => 'orlyata_news_item',
		'teacher'           => 'orlyata_teacher_item',
		'choir_achievement' => 'orlyata_choir_achievement_item',
		'score'             => 'orlyata_score_item',
		'photo_album'       => 'orlyata_photo_album_item',
		'video'             => 'orlyata_video_item',
	);

	/**
	 * Ensure roles have the project capabilities.
	 *
	 * @return void
	 */
	public static function sync(): void {
		$editor = get_role( 'content_editor' );

		if ( null === $editor ) {
			add_role(
				'content_editor',
				__( 'Редактор контента', 'orlyata' ),
				array(
					'read'         => true,
					'upload_files' => true,
				)
			);
			$editor = get_role( 'content_editor' );
		}

		$administrator = get_role( 'administrator' );

		if ( null !== $editor ) {
			$editor->add_cap( 'read' );
			$editor->add_cap( 'upload_files' );
			$editor->add_cap( 'edit_orlyata_site_settings' );

			foreach ( self::CAPABILITY_TYPES as $capability_type ) {
				foreach ( self::get_content_editor_capabilities( $capability_type ) as $capability ) {
					$editor->add_cap( $capability );
				}
			}

			foreach ( self::get_prohibited_capabilities() as $capability ) {
				$editor->remove_cap( $capability );
			}
		}

		if ( null !== $administrator ) {
			$administrator->add_cap( 'edit_orlyata_site_settings' );
			$administrator->add_cap( 'manage_orlyata_taxonomies' );

			foreach ( self::CAPABILITY_TYPES as $capability_type ) {
				foreach ( self::get_administrator_capabilities( $capability_type ) as $capability ) {
					$administrator->add_cap( $capability );
				}
			}
		}
	}

	/**
	 * Get all capabilities the content editor requires for a content type.
	 *
	 * @param string $singular Singular capability type.
	 * @return array<int, string>
	 */
	private static function get_content_editor_capabilities( string $singular ): array {
		$plural = $singular . 's';

		return array(
			'edit_' . $singular,
			'read_' . $singular,
			'delete_' . $singular,
			'edit_' . $plural,
			'edit_others_' . $plural,
			'publish_' . $plural,
			'delete_' . $plural,
			'delete_private_' . $plural,
			'delete_published_' . $plural,
			'delete_others_' . $plural,
			'edit_private_' . $plural,
			'edit_published_' . $plural,
		);
	}

	/**
	 * Administrators also may read private project content.
	 *
	 * @param string $singular Singular capability type.
	 * @return array<int, string>
	 */
	private static function get_administrator_capabilities( string $singular ): array {
		$capabilities   = self::get_content_editor_capabilities( $singular );
		$capabilities[] = 'read_private_' . $singular . 's';

		return $capabilities;
	}

	/**
	 * High-risk core capabilities never belong to content editors.
	 *
	 * @return array<int, string>
	 */
	private static function get_prohibited_capabilities(): array {
		return array(
			'activate_plugins',
			'create_users',
			'delete_plugins',
			'delete_themes',
			'delete_users',
			'edit_dashboard',
			'edit_files',
			'edit_plugins',
			'edit_theme_options',
			'edit_themes',
			'edit_users',
			'export',
			'import',
			'install_plugins',
			'install_themes',
			'list_users',
			'manage_categories',
			'manage_links',
			'manage_options',
			'manage_network',
			'moderate_comments',
			'promote_users',
			'remove_users',
			'switch_themes',
			'update_core',
			'update_plugins',
			'update_themes',
		);
	}
}
