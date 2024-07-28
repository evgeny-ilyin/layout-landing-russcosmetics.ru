import webpack from "webpack-stream";

export const js = () => {
	return app.gulp
		.src(app.path.src.js)
		.pipe(
			app.plugins.plumber(
				app.plugins.notify.onError({
					title: "JS",
					message: "<%= error.message %>",
				})
			)
		)
		.pipe(
			webpack({
				mode: app.isBuild ? "production" : "development",
				output: {
					filename: "app.js",
				},
				optimization: {
					minimize: false,
				},
			})
		)
		.pipe(app.gulp.dest(app.path.build.js))
		.pipe(
			app.plugins.if(
				app.isBuild,
				webpack({
					mode: app.isBuild ? "production" : "development",
					output: {
						filename: "app.min.js",
					},
				})
			)
		)
		.pipe(app.plugins.if(app.isBuild, app.gulp.dest(app.path.build.js)))
		.pipe(app.plugins.browsersync.stream());
};
