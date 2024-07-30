// Получить имя папки проекта
import * as nodePath from "path";
const rootFolder = nodePath.basename(nodePath.resolve());

const srcFolder = "./src";
const buildFolder = "./build";

export const path = {
	src: {
		html: `${srcFolder}/*.html`,
		scss: `${srcFolder}/scss/*.scss`,
		js: `${srcFolder}/js/app.js`,
		img: `${srcFolder}/img/**/*.{svg,jpg,jpeg,png,gif,webp,mp4}`,
		fonts: `${srcFolder}/fonts/*.*`,
		svgspriteIn: `${srcFolder}/svg/*.svg`,
		svgspriteOut: `${srcFolder}/html/components/`,
	},
	build: {
		html: `${buildFolder}/`,
		css: `${buildFolder}/css/`,
		js: `${buildFolder}/js/`,
		img: `${buildFolder}/img/`,
		fonts: `${buildFolder}/fonts/`,
		deploy: `${buildFolder}/**/*.*`,
	},
	watch: {
		html: `${srcFolder}/**/*.html`,
		scss: `${srcFolder}/scss/**/*.scss`,
		js: `${srcFolder}/js/**/*.js`,
		img: `${srcFolder}/img/**/*.*`,
		svg: `${srcFolder}/svg/*.svg`,
	},
	clean: buildFolder,
	buildFolder: buildFolder,
	srcFolder: srcFolder,
	rootFolder: rootFolder,
};
