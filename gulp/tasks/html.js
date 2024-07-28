import fileInclude from "gulp-file-include";
import versionNumber from "gulp-version-number";
import webpHtmlNosvg from "gulp-webp-html-nosvg"; // Оборачивает img в picture и добавляет source webp

export const html = () => {
	return (
		app.gulp
			.src(app.path.src.html)
			.pipe(
				app.plugins.plumber(
					app.plugins.notify.onError({
						title: "HTML",
						message: "<%= error.message %>",
					})
				)
			)
			.pipe(fileInclude())
			.pipe(app.plugins.replace(/@img\//g, "img/"))
			.pipe(
				app.plugins.if(
					app.isBuild,
					versionNumber({
						value: "%DT%",
						append: {
							key: "v",
							cover: 0,
							to: ["css", "js"],
						},
						output: {
							file: "gulp/version.json",
						},
					})
				)
			)

			.pipe(webpHtmlNosvg())
			// .pipe(app.plugins.if(app.isBuild, webpHtmlNosvg()))

			.pipe(
				app.plugins.htmlbeautify({
					indent_with_tabs: true,
					indent_size: 2,
				})
			)
			.pipe(app.gulp.dest(app.path.build.html))
			.pipe(app.plugins.browsersync.stream())
	);
};
