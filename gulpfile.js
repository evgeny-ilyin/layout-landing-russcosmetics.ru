// Основной модуль
import gulp from "gulp";
// Импорт путей
import { path } from "./gulp/config/path.js";
// Импорт общих плагинов
import { plugins } from "./gulp/config/plugins.js";

// Передаем значения в глобальную переменную
global.app = {
	isBuild: process.argv.includes("--build"),
	isDev: !process.argv.includes("--build"),
	gulp: gulp,
	path: path,
	plugins: plugins,
};

// Импорт задач
// import { vendors } from "./gulp/tasks/vendors.js";
import { reset } from "./gulp/tasks/reset.js";
import { server } from "./gulp/tasks/server.js";
import { html } from "./gulp/tasks/html.js";
import { scss } from "./gulp/tasks/scss.js";
import { js } from "./gulp/tasks/js.js";
import { img } from "./gulp/tasks/img.js";
import { index } from "./gulp/tasks/index.js";
import { fonts } from "./gulp/tasks/fonts.js";
import { svgsprite } from "./gulp/tasks/svgsprite.js";
import { deploy } from "./gulp/tasks/deploy.js";
import { zip } from "./gulp/tasks/zip.js";

// Наблюдатель за изменениями
function watcher() {
	gulp.watch(path.watch.html, html);
	gulp.watch(path.watch.scss, scss);
	gulp.watch(path.watch.js, js);
	gulp.watch(path.watch.img, img);
	gulp.watch(path.watch.svg, svgsprite);
}

// Основные задачи
const mainTasks = gulp.parallel(/* vendors, */ html, scss, js, img, fonts);

// Построение сценариев выполнения задач
const dev = gulp.series(reset, svgsprite, mainTasks, index, gulp.parallel(watcher, server));
const build = gulp.series(reset, svgsprite, mainTasks, index);
const deploy_ghPages = gulp.series(reset, svgsprite, mainTasks, index, deploy);
const make_zip = gulp.series(reset, svgsprite, mainTasks, index, zip);

// Экспорт сценариев
export { dev };
export { build };
export { deploy_ghPages };
export { make_zip };
export { index };
export { svgsprite };

// Выполнение сценария по-умолчанию
gulp.task("default", dev);
