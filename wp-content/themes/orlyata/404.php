<?php
/**
 * Not found desktop preview.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>
<div class="orlyata-not-found">
	<?php get_template_part( 'template-parts/layout/sidebar' ); ?>
	<main class="orlyata-not-found__content" id="main">
		<section class="orlyata-not-found__message" data-not-found-message aria-labelledby="not-found-title">
			<img class="orlyata-not-found__icon" src="<?php echo esc_url( get_theme_file_uri( 'assets/icons/notes-search-empty.svg' ) ); ?>" alt="" width="96" height="96">
			<h1 class="orlyata-not-found__title" id="not-found-title"><?php esc_html_e( 'Страница не найдена', 'orlyata' ); ?></h1>
			<p class="orlyata-not-found__copy"><?php esc_html_e( 'Возможно вы ввели верный адрес или страница была удалена', 'orlyata' ); ?></p>
		</section>
		<?php get_template_part( 'template-parts/layout/footer' ); ?>
	</main>
</div>
<?php
get_footer();
