import webp from "gulp-webp";
// import imagemin from "gulp-imagemin";
import tinypng from "gulp-tinypng-compress";

export const img = () => {
	return (
		app.gulp
			.src(app.path.src.img, { encoding: false })
			.pipe(
				app.plugins.plumber(
					app.plugins.notify.onError({
						title: "IMG",
						message: "<%= error.message %>",
					})
				)
			)

			// создать webp
			.pipe(app.plugins.newer(app.path.build.img))
			.pipe(webp({ quality: 80 }))
			.pipe(app.gulp.dest(app.path.build.img))

			// перенести все картинки без оптимизации (dev), чтобы работал лайтбокс Fancybox по ссылке на картинку (без замены на picture и webp)
			.pipe(app.plugins.if(!app.isBuild, app.gulp.src(app.path.src.img, { encoding: false })))
			.pipe(app.plugins.if(!app.isBuild, app.gulp.dest(app.path.build.img)))

			// оптимизировать картинки tinypng (prod) с лимитом 500 изображений в месяц
			.pipe(app.plugins.if(app.isBuild, app.gulp.src(app.path.src.img, { encoding: false })))
			.pipe(app.plugins.if(app.isBuild, app.plugins.newer(app.path.build.img)))
			// .pipe(
			// 	app.plugins.if(
			// 		app.isBuild,
			// 		tinypng({
			// 			key: process.env.KEY_TINYPNG,
			// 		})
			// 	)
			// )
			.pipe(app.plugins.if(app.isBuild, app.gulp.dest(app.path.build.img)))

			// imagemin (переключено на tinypng выше)
			// .pipe(app.plugins.if(app.isBuild, app.gulp.src(app.path.src.img, { encoding: false })))
			// .pipe(app.plugins.if(app.isBuild, app.plugins.newer(app.path.build.img)))
			// .pipe(
			// 	app.plugins.if(
			// 		app.isBuild,
			// 		imagemin({
			// 			progressive: true,
			// 			svgoPlugins: [{ removeViewBox: false }],
			// 			interlaced: true,
			// 			optimizationLevel: 3, // 0-7
			// 		})
			// 	)
			// )
			// .pipe(app.plugins.if(app.isBuild, app.gulp.dest(app.path.build.img))

			.pipe(app.plugins.browsersync.stream())
	);
};
