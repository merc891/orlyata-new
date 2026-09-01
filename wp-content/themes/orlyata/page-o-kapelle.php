<?php
/**
 * About page preview.
 *
 * @package Orlyata
 */

defined( 'ABSPATH' ) || exit;

$groups = array(
	array( 'Подготовительная группа', '5-7 лет', 'Подготовительная группа 5-7 лет занимается изучением основ музыкальной грамоты, постановкой правильного дыхания при пении сидя и стоя, поют несложные произведения, детские песни, учатся играть на блок-флейтах и "шумовых" инструментах: бубне, трещотке, ложках, колокольчиках и т.д.' ),
	array( 'Младший хор', '7-8 лет', 'Хор младших школьников 7-8 лет уже поет несложные 2-х голосные классические произведения, народные песни в обработке для хора, учатся основам вокала, сольфеджио.' ),
	array( 'Старший хор', '8-12 лет', 'С 2011 года в капелле активно занимается группа юношей-баритонов 13-17 лет. Благодаря этому появилась возможность исполнения произведений смешанным (мальчиков и юношей) составом. В репертуаре — произведения русской и зарубежной классической музыки, народные песни в обработках для хора, духовная музыка, песни современных композиторов.' ),
	array( 'Юношеская группа', 'Юношеская группа', 'Группа представляет собой вокальный мужской ансамбль юношей 13-18 лет (баритоны, выпускники и старшие учащиеся капеллы). В репертуаре юношеской группы произведения классики, народные песни, духовная музыка, произведения современных композиторов, песни из кинофильмов. Занимаются сольфеджио, вокалом. Как отдельно, так и вместе со старшим хором участвуют в фестивалях, конкурсах и концертах.' ),
);
$teachers = array(
	array( 'Чернецов', 'Андрей', 'Викторович', 'vict.png', 'andrey-chernetsov' ),
	array( 'Карпман', 'Ирина', 'Рафаиловна', 'karp.png', 'irina-karpman' ),
	array( 'Чернецова', 'Елена', 'Ивановна', 'elena.png', 'elena-chernetsova' ),
	array( 'Климова', 'Марьяна', 'Геннадьевна', 'mar.png', 'maryana-klimova' ),
	array( 'Угольникова', 'Ольга', 'Александровна', 'olg.png', 'olga-ugolnikova' ),
	array( 'Моисеева', 'Мария', 'Андреевна', 'mash.png', 'mariya-moiseeva' ),
);
$rows     = array(
	array( '2026', 'Лауреат I степени', 'Старший', 'XI Московский областной открытый конкурс хоров мальчиков Подмосковья' ),
	array( '2027', 'Лауреат II степени', 'Младший', 'VII Международный фестиваль хорового искусства' ),
	array( '2028', 'Дипломант', 'Старший', 'IV Всероссийский конкурс хоровых коллективов' ),
	array( '2029', 'Лауреат I степени', 'Старший', 'X Международный фестиваль хоровой музыки' ),
	array( '2030', 'Лауреат III степени', 'Младший', 'VIII Мировой конкурс детских хоров' ),
	array( '2031', 'Лауреат I степени', 'Старший', 'VI Всероссийский конкурс академического пения' ),
	array( '2032', 'Лауреат II степени', 'Младший', 'XII Международный хоровой фестиваль' ),
	array( '2033', 'Дипломант', 'Старший', 'III Европейский конкурс хорового исполнения' ),
	array( '2034', 'Лауреат I степени', 'Старший', 'IX Международный фестиваль хорового искусства' ),
	array( '2035', 'Лауреат III степени', 'Младший', 'XV Всероссийский чемпионат хоров' ),
	array( '2036', 'Лауреат II степени', 'Старший', 'IV Международный конкурс хоровых коллективов' ),
	array( '2037', 'Дипломант', 'Старший', 'VIII Всероссийский фестиваль хоровой музыки' ),
	array( '2038', 'Лауреат I степени', 'Старший', 'XI Международный конкурс хорового мастерства' ),
	array( '2039', 'Лауреат II степени', 'Младший', 'VII Европейский фестиваль детских хоров' ),
	array( '2040', 'Дипломант', 'Старший', 'II Всероссийский конкурс хорового искусства' ),
	array( '2041', 'Лауреат III степени', 'Старший', 'X Международный конкурс хоровых ансамблей' ),
	array( '2042', 'Лауреат I степени', 'Старший', 'V Международный фестиваль хорового пения' ),
	array( '2043', 'Лауреат II степени', 'Младший', 'IX Всероссийский конкурс хоровых исполнителей' ),
	array( '2044', 'Дипломант', 'Старший', 'III Международный конкурс хоровой музыки' ),
	array( '2045', 'Лауреат I степени', 'Старший', 'XII Всероссийский фестиваль академического пения' ),
	array( '2046', 'Лауреат III степени', 'Младший', 'VI Международный фестиваль хоровых искусств' ),
	array( '2047', 'Лауреат II степени', 'Старший', 'VII Европейский конкурс хоровых коллективов' ),
	array( '2048', 'Дипломант', 'Старший', 'X Всероссийский конкурс хоровых исполнений' ),
	array( '2049', 'Лауреат I степени', 'Старший', 'VIII Международный фестиваль хоровой культуры' ),
	array( '2050', 'Лауреат II степени', 'Младший', 'XIII Всероссийский конкурс детских хоров' ),
);
get_header(); ?><div class="orlyata-about"><?php get_template_part( 'template-parts/layout/sidebar' ); ?><main class="orlyata-about__content" id="main">
<?php
get_template_part(
	'template-parts/components/page-hero',
	null,
	array(
		'image_src' => get_theme_file_uri( 'assets/images/about/img271.png' ),
		'title'     => __( 'О капелле', 'orlyata' ),
		'title_id'  => 'about-title',
	)
);
?>
<div class="orlyata-about__body"><div class="orlyata-about__grid"><section class="orlyata-about__intro" data-about-reveal><p class="orlyata-about__lead type-lead"><?php esc_html_e( 'Создана руководителями академического хора «Ковчег» — Заслуженным работником РФ Андреем Чернецовым и хормейстером Ириной Карпман', 'orlyata' ); ?></p><div class="orlyata-about__copy type-body"><p><?php esc_html_e( 'Пройдя большой путь в поиске «своего лица и в выборе репертуара, и в стиле работы, планах обучения и приобщения ребят к лучшим образцам певческого искусства, в капелле сложилась устойчивая система музыкально-хорового воспитания мальчиков от 5 до 17 лет.', 'orlyata' ); ?></p><p><?php esc_html_e( 'В репертуаре «Орлят» произведения русской, западно-европейской классики, народные песни в обработках, произведения советских и современных русских композиторов, духовная и патриотическая музыка. «Орлята» принимали участие в театрализованных постановках академического хора «Ковчег» — «Рождественской драме» Св. Дм. Ростовского и «Кармен» Ж. Бизе.', 'orlyata' ); ?></p></div><div class="orlyata-home__history-teachers orlyata-about__intro-teachers"><div class="orlyata-home__history-photos" aria-hidden="true"><span class="orlyata-home__history-photo"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/home/teacher-one.png' ) ); ?>" alt=""></span><span class="orlyata-home__history-photo"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/home/teacher-two.png' ) ); ?>" alt=""></span></div></div></section><section class="orlyata-about__groups">
<?php
foreach ( $groups as $group ) {
	?>
	<?php
	get_template_part(
		'template-parts/components/accordion',
		null,
		array(
			'title' => $group[0],
			'meta'    => $group[1],
			'content' => $group[2],
		)
	);
	?>
	<?php
}
?>
</section><section class="orlyata-about__life" aria-labelledby="life-title" data-about-reveal><h2 class="type-heading-2" id="life-title"><?php esc_html_e( "Жизнь капеллы", "orlyata" ); ?></h2><div class="orlyata-about__life-grid" data-life-carousel><div class="orlyata-about__life-card"><article class="orlyata-about__life-slide is-active" data-life-slide><h3 class="type-lead"><?php esc_html_e( "Выступления", "orlyata" ); ?></h3><div class="orlyata-about__life-copy type-body"><p><?php esc_html_e( "Младшая, старшая группы и юноши регулярно выходят на сцену московских и всероссийских фестивалей.", "orlyata" ); ?></p><p><?php esc_html_e( "За годы существования коллектив неоднократно отмечался наградами конкурсов «Чиста небесная лазурь», «Золотой Витязь», «Музыкальный Олимп» и «Приношение Петру Чайковскому», завоевывая звания лауреатов и дипломантов.", "orlyata" ); ?></p></div></article><article class="orlyata-about__life-slide" data-life-slide><h3 class="type-lead"><?php esc_html_e( "Достижения", "orlyata" ); ?></h3><div class="orlyata-about__life-copy type-body"><p><?php esc_html_e( "Хор «Орлята» становился лауреатом 1 и 2-й степени на международных конкурсах в Швеции, Финляндии, Венгрии, Болгарии, Сербии, Польше, Македонии и Украине.", "orlyata" ); ?></p><p><?php esc_html_e( "Высшими наградами коллектива стали три Гран-При: в Петрозаводске (ноябрь 2014) за победу в конкурсе «Виват, мальчишки!», в Смоленске (апрель 2015) на фестивале «Славься, Глинка!» и в Москве (январь 2016) на конкурсе «Рождественская песнь», где хор завоевал два первых места .", "orlyata" ); ?></p></div></article><article class="orlyata-about__life-slide" data-life-slide><h3 class="type-lead"><?php esc_html_e( "Отдых", "orlyata" ); ?></h3><div class="orlyata-about__life-copy type-body"><p><?php esc_html_e( "В период каникул ребята с педагогами и родителями выезжают в театры, музеи, на экскурсии, летом на отдых, проводят различные спортивные соревнования, с удовольствием играют в футбол, волейбол.", "orlyata" ); ?></p></div></article><div class="orlyata-about__life-arrows" aria-label="<?php esc_attr_e( "Переключение слайдов", "orlyata" ); ?>"><?php get_template_part( "template-parts/components/button", null, array( "variant" => "arrow-left", "aria_label" => __( "Предыдущий слайд", "orlyata" ) ) ); ?><?php get_template_part( "template-parts/components/button", null, array( "variant" => "arrow-right", "aria_label" => __( "Следующий слайд", "orlyata" ) ) ); ?></div><div class="orlyata-about__life-pagination" aria-label="<?php esc_attr_e( "Выбор слайда", "orlyata" ); ?>" role="group"><button class="orlyata-about__life-pagination-button is-active" type="button" aria-label="<?php esc_attr_e( "Слайд 1: Выступления", "orlyata" ); ?>" aria-pressed="true" data-life-slide-select="0"></button><button class="orlyata-about__life-pagination-button" type="button" aria-label="<?php esc_attr_e( "Слайд 2: Достижения", "orlyata" ); ?>" aria-pressed="false" data-life-slide-select="1"></button><button class="orlyata-about__life-pagination-button" type="button" aria-label="<?php esc_attr_e( "Слайд 3: Отдых", "orlyata" ); ?>" aria-pressed="false" data-life-slide-select="2"></button></div></div><div class="orlyata-about__life-media" data-life-media data-life-active="0"><div class="orlyata-about__life-image-track"><img class="orlyata-about__life-image" src="<?php echo esc_url( get_theme_file_uri( "assets/images/about/life.png" ) ); ?>" alt="" data-life-image><img class="orlyata-about__life-image" src="<?php echo esc_url( get_theme_file_uri( "assets/images/about/win.jpg" ) ); ?>" alt="" data-life-image><img class="orlyata-about__life-image" src="<?php echo esc_url( get_theme_file_uri( "assets/images/about/otdykh.jpeg" ) ); ?>" alt="" data-life-image></div></div></section><section class="orlyata-about__teachers" id="teachers" data-about-reveal><h2 class="type-heading-2"><?php esc_html_e( 'Педагоги', 'orlyata' ); ?></h2><div class="orlyata-about__teacher-grid">
<?php
foreach ( $teachers as $teacher ) {
	get_template_part(
		'template-parts/components/teacher-card',
		null,
		array(
			'first_name'  => $teacher[1],
			'image_src'   => get_theme_file_uri( 'assets/images/about/' . $teacher[3] ),
			'last_name'   => $teacher[0],
			'middle_name' => $teacher[2],
			'url' => home_url( '/o-kapelle/' . $teacher[4] . '/' ),
		)
	);
}
?></div></section><section class="orlyata-about__application" id="application" data-about-reveal><h2 class="type-heading-1"><?php esc_html_e( 'Хотите вырастить творческую личность — запишите мальчика в капеллу', 'orlyata' ); ?></h2><div class="orlyata-about__application-surface"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/home/application-background.png' ) ); ?>" alt="" aria-hidden="true">
	<?php
	get_template_part(
		'template-parts/sections/application-form',
		null,
		array(
			'id'           => 'about-application',
			'submit_label' => __( 'Оставить заявку', 'orlyata' ),
			'variant'      => 'about',
		)
	);
	?>
</div></section><section class="orlyata-about__achievements" id="achievements" data-about-reveal><h2 class="type-heading-2"><?php esc_html_e( 'Достижения', 'orlyata' ); ?></h2>
<?php
get_template_part(
	'template-parts/components/data-table',
	null,
	array(
		'headers' => array( 'Год', 'Достижение', 'Хор', 'Конкурс' ),
		'rows'    => $rows,
		'variant' => 'achievements',
	)
);
?>
</section></div><?php get_template_part( 'template-parts/layout/footer' ); ?></div></main></div>
<?php
get_footer();
