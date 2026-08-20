<?php
/**
 * Media validation and external video provider helpers.
 *
 * @package OrlyataCore
 */

namespace OrlyataCore\Content;

defined( 'ABSPATH' ) || exit;

/**
 * Keeps media attachment and provider decisions out of the theme.
 */
final class Media {
	/**
	 * Normalize selected image attachment IDs.
	 *
	 * @param mixed $attachment_ids Candidate IDs.
	 * @return array<int, int>
	 */
	public static function sanitize_image_attachment_ids( mixed $attachment_ids ): array {
		$attachment_ids = is_array( $attachment_ids ) ? $attachment_ids : array();
		$sanitized_ids  = array();

		foreach ( $attachment_ids as $attachment_id ) {
			$attachment_id = absint( $attachment_id );

			if ( 0 !== $attachment_id && self::is_image_attachment( $attachment_id ) ) {
				$sanitized_ids[] = $attachment_id;
			}
		}

		return array_values( array_unique( $sanitized_ids ) );
	}

	/**
	 * Verify an attachment has an image MIME type.
	 *
	 * @param int $attachment_id Attachment ID.
	 * @return bool
	 */
	public static function is_image_attachment( int $attachment_id ): bool {
		$mime_type = get_post_mime_type( $attachment_id );

		return is_string( $mime_type ) && str_starts_with( $mime_type, 'image/' ) && 'image/svg+xml' !== $mime_type;
	}

	/**
	 * Verify an attachment is a PDF.
	 *
	 * @param int $attachment_id Attachment ID.
	 * @return bool
	 */
	public static function is_pdf_attachment( int $attachment_id ): bool {
		return 'application/pdf' === get_post_mime_type( $attachment_id );
	}

	/**
	 * Return the valid cover or a deterministic first-image fallback.
	 *
	 * @param int $post_id Photo album post ID.
	 * @return int
	 */
	public static function get_photo_album_cover_id( int $post_id ): int {
		$image_ids = self::sanitize_image_attachment_ids( get_post_meta( $post_id, 'orlyata_photo_ids', true ) );
		$cover_id  = absint( get_post_meta( $post_id, 'orlyata_photo_cover_id', true ) );

		if ( in_array( $cover_id, $image_ids, true ) ) {
			return $cover_id;
		}

		return $image_ids[0] ?? 0;
	}

	/**
	 * Normalize a supported public video URL or reject it.
	 *
	 * @param mixed $raw_url Candidate URL.
	 * @return string
	 */
	public static function normalize_video_url( mixed $raw_url ): string {
		if ( ! is_string( $raw_url ) ) {
			return '';
		}

		$url   = esc_url_raw( trim( $raw_url ), array( 'https' ) );
		$parts = wp_parse_url( $url );

		if ( ! is_array( $parts ) || empty( $parts['host'] ) || 'https' !== ( $parts['scheme'] ?? '' ) ) {
			return '';
		}

		$host  = strtolower( (string) $parts['host'] );
		$path  = isset( $parts['path'] ) ? (string) $parts['path'] : '';
		$query = array();

		if ( isset( $parts['query'] ) ) {
			parse_str( (string) $parts['query'], $query );
		}

		if ( in_array( $host, array( 'youtu.be', 'www.youtu.be' ), true ) ) {
			$video_id = trim( $path, '/' );

			return self::get_youtube_url( $video_id );
		}

		if ( in_array( $host, array( 'youtube.com', 'www.youtube.com', 'm.youtube.com' ), true ) ) {
			$video_id = isset( $query['v'] ) && is_string( $query['v'] ) ? $query['v'] : '';

			if ( '' === $video_id && preg_match( '#^/shorts/([^/]+)#', $path, $matches ) ) {
				$video_id = $matches[1];
			}

			return self::get_youtube_url( $video_id );
		}

		if ( in_array( $host, array( 'rutube.ru', 'www.rutube.ru' ), true ) && preg_match( '#^/video/([A-Za-z0-9_-]+)#', $path, $matches ) ) {
			return 'https://rutube.ru/video/' . rawurlencode( $matches[1] ) . '/';
		}

		if ( in_array( $host, array( 'vk.com', 'www.vk.com', 'vkvideo.ru', 'www.vkvideo.ru' ), true ) && preg_match( '#^/video(-?[0-9]+_[0-9]+)#', $path, $matches ) ) {
			return 'https://vk.com/video' . $matches[1];
		}

		return '';
	}

	/**
	 * Return a provider identifier based on a normalized URL.
	 *
	 * @param string $normalized_url Normalized external URL.
	 * @return string
	 */
	public static function detect_video_provider( string $normalized_url ): string {
		$host = wp_parse_url( $normalized_url, PHP_URL_HOST );

		return match ( $host ) {
			'www.youtube.com' => 'youtube',
			'rutube.ru'       => 'rutube',
			'vk.com'          => 'vk',
			default           => '',
		};
	}

	/**
	 * Get the public provider label.
	 *
	 * @param string $provider Provider identifier.
	 * @return string
	 */
	public static function get_video_provider_label( string $provider ): string {
		return match ( $provider ) {
			'youtube' => 'YouTube',
			'rutube'  => 'RuTube',
			'vk'      => 'VK Видео',
			default   => '',
		};
	}

	/**
	 * Get a static fallback image URL when a provider permits one.
	 *
	 * @param string $normalized_url Normalized external URL.
	 * @return string
	 */
	public static function get_video_fallback_url( string $normalized_url ): string {
		if ( 'youtube' !== self::detect_video_provider( $normalized_url ) ) {
			return '';
		}

		$query = wp_parse_url( $normalized_url, PHP_URL_QUERY );
		$args  = array();

		if ( is_string( $query ) ) {
			parse_str( $query, $args );
		}

		$video_id = isset( $args['v'] ) && is_string( $args['v'] ) ? $args['v'] : '';

		if ( ! preg_match( '/^[A-Za-z0-9_-]{6,20}$/', $video_id ) ) {
			return '';
		}

		return 'https://i.ytimg.com/vi/' . rawurlencode( $video_id ) . '/hqdefault.jpg';
	}

	/**
	 * Build canonical YouTube watch URLs.
	 *
	 * @param string $video_id Candidate video ID.
	 * @return string
	 */
	private static function get_youtube_url( string $video_id ): string {
		$video_id = trim( $video_id );

		if ( ! preg_match( '/^[A-Za-z0-9_-]{6,20}$/', $video_id ) ) {
			return '';
		}

		return 'https://www.youtube.com/watch?v=' . rawurlencode( $video_id );
	}
}
