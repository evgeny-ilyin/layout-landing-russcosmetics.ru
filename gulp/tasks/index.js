/**
 * https://gist.github.com/Shwartz/815fd88e35312fd2844145089e788888
 * Utility to create index file with a list of all files
 */
import fs from "fs"; // filesystem

/**
 * v3 асинхронная, с рабочим колбэком и без таймаута
 * @param {*} done
 */
export const index = (done) => {
	let fileList = "";
	fs.readdir(app.path.build.html, { withFileTypes: true }, (err, dirents) => {
		const filesNames = dirents.filter((dirent) => dirent.isFile()).map((dirent) => dirent.name);
		filesNames.forEach(function (file) {
			fileList += '<li><a href="' + file + '">' + file + "</a></li>";
		});
		fs.writeFile(
			`${app.path.build.html}index-list.html`,
			"<html><head><title>Filelist</title></head><body><h3>Content</h3><ul>" + fileList + "</ul></body></html>",
			(err) => {
				if (err) console.log(err);
				else {
					console.log("index-list.html written successfully");
					done();
				}
			}
		);

		return app.gulp
			.src(`${app.path.build.html}index-list.html`)
			.pipe(
				app.plugins.htmlbeautify({
					indent_with_tabs: true,
					indent_size: 2,
				})
			)
			.pipe(app.gulp.dest(app.path.build.html));
	});
};

/**
 * v2 для использования в сценариях - writeFile, асинхронная с колбэком
 */
// export const index = (done) => {
// 	let fileList = "";

// 	fs.readdir(app.path.build.html, { withFileTypes: true }, (err, dirents) => {
// 		const filesNames = dirents.filter((dirent) => dirent.isFile()).map((dirent) => dirent.name);
// 		filesNames.forEach(function (file) {
// 			fileList += '<li><a href="' + file + '">' + file + "</a></li>";
// 		});
// 	});
// 	fs.writeFile(`${app.path.build.html}index-list.html`, "<html><head></head><body><h3>Content</h3><ul>" + fileList + "</ul></body></html>", (err) => {
// 		if (err) console.log(err);
// 		else {
// 			console.log("index-list.html written successfully");
// 		}
// 	});
// 	// done();
// 	setTimeout(() => done(), 100);
// };

/**
 * v1 для отдельного использования (без сценариев) - writeFileSync, синхронная
 */
// export const index = (done) => {
// 	let fileList = "";
// 	app.plugins.fs.readdir(app.path.build.html, { withFileTypes: true }, (err, dirents) => {
// 		const filesNames = dirents.filter((dirent) => dirent.isFile()).map((dirent) => dirent.name);
// 		filesNames.forEach(function (file) {
// 			if (file != "index-list.html") {
// 				fileList += '<li><a href="' + file + '">' + file + "</a></li>";
// 			}
// 		});
// 		console.log("File write started\n");
// 		app.plugins.fs.writeFileSync(`${app.path.build.html}index-list.html`, "<html><head></head><body><h3>Content</h3><ul>" + fileList + "</ul></body></html>");
// 		console.log("File written successfully\n");
// 	});
// 	done();
// };
