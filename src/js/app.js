import * as fn from "./modules/functions.js";
import { useDynamicAdapt } from "./modules/dynamicAdapt.js";

addEventListener("DOMContentLoaded", () => {
	useDynamicAdapt();

	fn.isTouchDevice();
	fn.cardInfoHandler();

	// fn.isWebp();
	// fn.stickyHeader();
	// fn.closeMenuHandler();
});

// import "./modules/cookies.js";
import "./modules/fancyapps.js";

