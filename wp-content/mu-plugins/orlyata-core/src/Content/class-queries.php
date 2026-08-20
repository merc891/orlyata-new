<?php
/**
 * CMS query helpers consumed by future page templates.
 *
 * @package OrlyataCore
 */

namespace OrlyataCore\Content;

use WP_Post;

defined( 'ABSPATH' ) || exit;

/**
 * Provides safe, deterministic public content selections.
 */
final class Queries {
	/**
	 * Get latest published media by creation/publication date.
	 *
	 * @param string $post_type Either photo_album or video.
	 * @param int    $limit Maximum number of results.
	 * @return array<int, WP_Post>
	 */
	public static function get_latest_media( string $post_type, int $limit = 6 ): array {
		if ( ! in_array( $post_type, array( 'photo_album', 'video' ), true ) ) {
			return array();
		}

		$query = new \WP_Query(
			array(
				'post_type'           => $post_type,
				'post_status'         => 'publish',
				'posts_per_page'      => max( 1, min( 50, $limit ) ),
				'orderby'             => 'date',
				'order'               => 'DESC',
				'no_found_rows'       => true,
				'ignore_sticky_posts' => true,
			)
		);

		return array_values( $query->posts );
	}

	/**
	 * Search scores by title and author, optionally limited to a choir.
	 *
	 * The collection is intentionally small (approximately 100 records), so
	 * filtering normalized server values avoids insecure raw SQL construction.
	 *
	 * @param string $search Search text.
	 * @param string $choir Choir slug.
	 * @return array<int, WP_Post>
	 */
	public static function find_scores( string $search = '', string $choir = '' ): array {
		$args = array(
			'post_type'           => 'score',
			'post_status'         => 'publish',
			'posts_per_page'      => -1,
			'orderby'             => 'title',
			'order'               => 'ASC',
			'no_found_rows'       => true,
			'ignore_sticky_posts' => true,
		);

		if ( '' !== $choir && isset( PostTypes::get_term_definitions()['orlyata_score_choir'][ $choir ] ) ) {
			// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query -- The closed choir vocabulary is the required public filter.
			$args['tax_query'] = array(
				array(
					'taxonomy' => 'orlyata_score_choir',
					'field'    => 'slug',
					'terms'    => $choir,
				),
			);
		}

		$query  = new \WP_Query( $args );
		$search = self::normalize_search_text( $search );

		if ( '' === $search ) {
			return array_values( $query->posts );
		}

		return array_values(
			array_filter(
				$query->posts,
				static function ( WP_Post $score ) use ( $search ): bool {
					$haystack = self::normalize_search_text(
						$score->post_title . ' ' . (string) get_post_meta( $score->ID, 'orlyata_score_author', true )
					);

					return str_contains( $haystack, $search );
				}
			)
		);
	}

	/**
	 * Prepare the data needed by a photo card without exposing raw metadata.
	 *
	 * @param int $post_id Photo album post ID.
	 * @return array{cover_id: int, cover_url: string, image_ids: array<int, int>}
	 */
	public static function get_photo_album_media( int $post_id ): array {
		$cover_id  = Media::get_photo_album_cover_id( $post_id );
		$cover_url = 0 !== $cover_id ? (string) wp_get_attachment_image_url( $cover_id, 'large' ) : '';

		return array(
			'cover_id'  => $cover_id,
			'cover_url' => $cover_url,
			'image_ids' => Media::sanitize_image_attachment_ids( get_post_meta( $post_id, 'orlyata_photo_ids', true ) ),
		);
	}

	/**
	 * Prepare safe card data for an external video.
	 *
	 * @param int $post_id Video post ID.
	 * @return array{url: string, provider: string, provider_label: string, preview_offset: int, fallback_url: string}
	 */
	public static function get_video_media( int $post_id ): array {
		$url      = (string) get_post_meta( $post_id, 'orlyata_video_url', true );
		$provider = Media::detect_video_provider( $url );

		return array(
			'url'            => $url,
			'provider'       => $provider,
			'provider_label' => Media::get_video_provider_label( $provider ),
			'preview_offset' => absint( get_post_meta( $post_id, 'orlyata_video_preview_offset', true ) ),
			'fallback_url'   => Media::get_video_fallback_url( $url ),
		);
	}

	/**
	 * Normalize a Russian search term for case-insensitive comparison.
	 *
	 * @param string $value Source text.
	 * @return string
	 */
	private static function normalize_search_text( string $value ): string {
		$value = trim( wp_strip_all_tags( $value ) );
		$value = preg_replace( '/\s+/u', ' ', $value );

		if ( ! is_string( $value ) ) {
			return '';
		}

		return function_exists( 'mb_strtolower' ) ? mb_strtolower( $value, 'UTF-8' ) : strtolower( $value );
	}
}
