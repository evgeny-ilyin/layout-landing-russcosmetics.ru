import * as dartSass from "sass";
import gulpSass from "gulp-sass";
import sourcemaps from "gulp-sourcemaps";
import rename from "gulp-rename";
import cleanCss from "gulp-clean-css"; // Сжатие CSS
import autoprefixer from "gulp-autoprefixer";
import tildeImporter from "node-sass-tilde-importer"; // Замена пути к node_modules/ на ~

//! Для прода
// import stripCssComments from "gulp-strip-css-comments";
import groupCssMediaQueries from "gulp-group-css-media-queries";
import webpcss from "gulp-webpcss"; // Добавление стилей webp/no-webp в конец css

const sass = gulpSass(dartSass);

export const scss = () => {
	return (
		app.gulp
			.src(app.path.src.scss)
			.pipe(
				app.plugins.plumber(
					app.plugins.notify.onError({
						title: "SCSS",
						message: "<%= error.message %>",
					})
				)
			)
			.pipe(app.plugins.if(app.isDev, sourcemaps.init()))
			.pipe(
				sass({
					importer: tildeImporter,
					outputStyle: "expanded",
				})
			)
			.pipe(app.plugins.if(app.isBuild, groupCssMediaQueries())) //! карта некорректна с этим модулем, поэтому только для прода
			.pipe(
				//! isWebp() в /js/modules/functions.js
				webpcss({
					webpClass: ".webp",
					noWebpClass: ".no-webp",
				})
			)
			.pipe(
				app.plugins.if(
					app.isBuild,
					autoprefixer({
						grid: true,
						overrideBrowserslist: ["last 3 versions"],
						cascade: true,
					})
				)
			)
			.pipe(
				app.plugins.if(
					app.isDev,
					sourcemaps.write({
						// includeContent: false
					})
				)
			)
			.pipe(app.plugins.replace(/@img\//g, "../img/"))

			// beautified css (prod)
			.pipe(app.plugins.if(app.isBuild, cleanCss({ level: { 1: { specialComments: 0 } }, format: "beautify" })))
			.pipe(app.plugins.if(app.isBuild, app.gulp.dest(app.path.build.css)))

			// minified css (prod)
			.pipe(app.plugins.if(app.isBuild, cleanCss()))
			.pipe(
				app.plugins.if(
					app.isBuild,
					rename({
						suffix: ".min",
						extname: ".css",
						// extname: ".min.css",
					})
				)
			)

			.pipe(app.gulp.dest(app.path.build.css))
			.pipe(app.plugins.browsersync.stream())
	);
};
