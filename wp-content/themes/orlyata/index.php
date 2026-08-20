<?php
/**
 * Fallback template.
 *
 * Page-specific templates are added only after their component contracts have
 * been approved in the design system.
 *
 * @package Orlyata
 */

get_header();
?>
<main id="main">
	<?php if ( have_posts() ) : ?>
		<?php while ( have_posts() ) : ?>
			<?php the_post(); ?>
			<article <?php post_class(); ?>>
				<h1><?php the_title(); ?></h1>
				<?php the_content(); ?>
			</article>
		<?php endwhile; ?>
	<?php else : ?>
		<h1><?php esc_html_e( 'Материалы не найдены', 'orlyata' ); ?></h1>
	<?php endif; ?>
</main>
<?php
get_footer();

