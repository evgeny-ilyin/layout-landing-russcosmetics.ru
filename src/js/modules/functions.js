/* Проверка поддержки webp браузером */
export function isWebp() {
	function testWebP(callback) {
		let webP = new Image();
		webP.onload = webP.onerror = function () {
			callback(webP.height == 2);
		};
		webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
	}
	testWebP(function (support) {
		if (support == true) {
			document.querySelector("body").classList.add("webp");
		} else {
			document.querySelector("body").classList.add("no-webp");
		}
	});
}

export function stickyHeader() {
	const header = document.querySelector("header");

	let handleScroll = () => {
		if (window.scrollY > 0) {
			header.classList.add("header_fixed");
		} else {
			header.classList.remove("header_fixed");
		}
	};
	window.addEventListener("scroll", handleScroll);
	handleScroll();
}

export function isTouchDevice() {
	const touchClass = "is-touch";
	["load", "resize"].forEach((evt) =>
		window.addEventListener(evt, () => {
			let isTouch = false;
			if ((window.PointerEvent && "maxTouchPoints" in navigator) || (window.PointerEvent && "msMaxTouchPoints" in navigator)) {
				// if Pointer Events are supported, just check maxTouchPoints
				if (navigator.maxTouchPoints > 0) {
					isTouch = true;
				}
			} else {
				// no Pointer Events...
				if (window.matchMedia && window.matchMedia("(any-pointer:coarse)").matches) {
					// check for any-pointer:coarse which mostly means touchscreen
					isTouch = true;
				} else if (window.TouchEvent || "ontouchstart" in window) {
					// last resort - check for exposed touch events API / event handler
					isTouch = true;
				}
			}
			document.body.classList[isTouch ? "add" : "remove"](touchClass);
		})
	);
}

export function closeMenuHandler() {
	const menuToggler = document.getElementById("menu-toggle"),
		menuWrapper = document.querySelector(".menu-wrapper"),
		linkClassName = "nav__link";
	if (!menuToggler || !menuWrapper) return;
	document.addEventListener("click", (e) => {
		console.log(e.target);
		if (menuToggler.checked) {
			if (!menuWrapper.contains(e.target) || e.target.classList.contains(linkClassName)) {
				menuToggler.click();
			}
		}
	});
}

export function cardInfoHandler() {
	// show card's content
	const triggers = document.querySelectorAll(".js-accordion-trigger"),
		isOpenedClass = "is-opened";

	triggers.forEach((trigger) => {
		trigger.addEventListener("click", (e) => {
			e.preventDefault();
			accordionOpen(trigger);
		});

		["resize"].forEach((evt) =>
			window.addEventListener(evt, () => {
				accordionHeight();
			})
		);
	});

	// show item's description by hover
	const cardItems = document.querySelectorAll(".js-card-item"),
		hiddenClass = "hidden";

	cardItems.forEach((el) => {
		if (!el) return;
		el.addEventListener("mouseover", (trigger) => {
			cardAction(trigger, true);
			accordionHeight();
		});

		el.addEventListener("mouseout", (trigger) => {
			cardAction(trigger, false);
			accordionHeight();
		});
	});

	let accordionOpen = (trigger) => {
		// закрыть все остальные
		let opened = trigger.parentElement.querySelectorAll(`.${isOpenedClass}`);

		opened.forEach((el) => {
			if (el != trigger) accordionClose(el);
		});

		trigger.classList.toggle(isOpenedClass);

		let accordionContent = document.querySelector(`[data-id="${trigger.dataset.target}"]`);
		if (!accordionContent) return;

		if (accordionContent.style.maxHeight) {
			accordionContent.style.maxHeight = null;
		} else {
			accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
		}
	};

	let accordionClose = (accordion) => {
		accordion.classList.remove(isOpenedClass);
		document.querySelector(`[data-id="${accordion.dataset.target}"]`).style.maxHeight = null;
	};

	let accordionHeight = () => {
		let opened = document.querySelectorAll(`.${isOpenedClass}`);

		opened.forEach((el) => {
			let accordionContent = document.querySelector(`[data-id="${el.dataset.target}"]`);
			if (!accordionContent) return;

			if (accordionContent.style.maxHeight) {
				accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
			}
		});
	};

	let cardAction = (trigger, action) => {
		const cardContent = document.querySelector(`[data-id="${trigger.target.dataset.target}"]`);
		if (!cardContent) return;

		const commonContent = cardContent.closest(".card-data__bottom").querySelector(".card-data__common");
		if (!commonContent) return;

		commonContent.classList[action ? "add" : "remove"](hiddenClass);
		cardContent.classList[action ? "remove" : "add"](hiddenClass);
	};
}
