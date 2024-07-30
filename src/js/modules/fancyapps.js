import { Fancybox } from "@fancyapps/ui";
import { Carousel } from "@fancyapps/ui/dist/carousel/carousel.esm.js";

addEventListener("DOMContentLoaded", () => {
	// Модальные окна
	const ru = {
		CLOSE: "Закрыть",
		NEXT: "Далее",
		PREV: "Назад",
	};

	const optionsBox = {
		l10n: ru,
	};

	Fancybox.bind("[data-fancybox]", optionsBox);

	let carouselBlock2 = document.getElementById("carouselBlock2");
	new Carousel(carouselBlock2, {
		l10n: ru,
		infinite: true,
		Navigation: true,
		Dots: false,
	});
});
