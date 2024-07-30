/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// CONCATENATED MODULE: ./src/js/modules/functions.js
/* Проверка поддержки webp браузером */
function isWebp() {
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

function stickyHeader() {
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

function isTouchDevice() {
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

function closeMenuHandler() {
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

function cardInfoHandler() {
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

;// CONCATENATED MODULE: ./src/js/modules/dynamicAdapt.js
/**
 * @typedef {Object} dNode
 * @property {HTMLElement} parent
 * @property {HTMLElement} element
 * @property {HTMLElement} to
 * @property {string} breakpoint
 * @property {string} order
 * @property {number} index
 */

/**
 * @typedef {Object} dMediaQuery
 * @property {string} query
 * @property {number} breakpoint
 */

/**
 * @param {'min' | 'max'} type
 */
function useDynamicAdapt(type = 'max') {

  // if(navigator.userAgentData && navigator.userAgentData.brands.length) {
  //   if (navigator.userAgentData.brands[2].brand.indexOf("ghtho") > -1) return;
  // }

  const className = '_dynamic_adapt_'
  const attrName = 'data-da'

  /** @type {dNode[]} */
  const dNodes = getDNodes()

  /** @type {dMediaQuery[]} */
  const dMediaQueries = getDMediaQueries(dNodes)

  dMediaQueries.forEach((dMediaQuery) => {
    const matchMedia = window.matchMedia(dMediaQuery.query)
    // массив объектов с подходящим брейкпоинтом
    const filteredDNodes = dNodes.filter(({ breakpoint }) => breakpoint === dMediaQuery.breakpoint)
    const mediaHandler = getMediaHandler(matchMedia, filteredDNodes)
    matchMedia.addEventListener('change', mediaHandler)

    mediaHandler()
  })

  function getDNodes() {
    const result = []
    const elements = [...document.querySelectorAll(`[${attrName}]`)]

    elements.forEach((element) => {
      const attr = element.getAttribute(attrName)
      const [toSelector, breakpoint, order] = attr.split(',').map((val) => val.trim())

      const to = document.querySelector(toSelector)

      if (to) {
        result.push({
          parent: element.parentElement,
          element,
          to,
          breakpoint: breakpoint ?? '767',
          order: order !== undefined ? (isNumber(order) ? Number(order) : order) : 'last',
          index: -1,
        })
      }
    })

    return sortDNodes(result)
  }

  /**
   * @param {dNode} items
   * @returns {dMediaQuery[]}
   */
  function getDMediaQueries(items) {
    const uniqItems = [...new Set(items.map(({ breakpoint }) => `(${type}-width: ${breakpoint}px),${breakpoint}`))]

    return uniqItems.map((item) => {
      const [query, breakpoint] = item.split(',')

      return { query, breakpoint }
    })
  }

  /**
   * @param {MediaQueryList} matchMedia
   * @param {dNodes} items
   */
  function getMediaHandler(matchMedia, items) {
    return function mediaHandler() {
      if (matchMedia.matches) {
        items.forEach((item) => {
          moveTo(item)
        })

        items.reverse()
      } else {
        items.forEach((item) => {
          if (item.element.classList.contains(className)) {
            moveBack(item)
          }
        })

        items.reverse()
      }
    }
  }

  /**
   * @param {dNode} dNode
   */
  function moveTo(dNode) {
    const { to, element, order } = dNode
    dNode.index = getIndexInParent(dNode.element, dNode.element.parentElement)
    element.classList.add(className)

    if (order === 'last' || order >= to.children.length) {
      to.append(element)

      return
    }

    if (order === 'first') {
      to.prepend(element)

      return
    }

    to.children[order].before(element)
  }

  /**
   * @param {dNode} dNode
   */
  function moveBack(dNode) {
    const { parent, element, index } = dNode
    element.classList.remove(className)

    if (index >= 0 && parent.children[index]) {
      parent.children[index].before(element)
    } else {
      parent.append(element)
    }
  }

  /**
   * @param {HTMLElement} element
   * @param {HTMLElement} parent
   */
  function getIndexInParent(element, parent) {
    return [...parent.children].indexOf(element)
  }

  /**
   * Функция сортировки массива по breakpoint и order
   * по возрастанию для type = min
   * по убыванию для type = max
   *
   * @param {dNode[]} items
   */
  function sortDNodes(items) {
    const isMin = type === 'min' ? 1 : 0

    return [...items].sort((a, b) => {
      if (a.breakpoint === b.breakpoint) {
        if (a.order === b.order) {
          return 0
        }

        if (a.order === 'first' || b.order === 'last') {
          return -1 * isMin
        }

        if (a.order === 'last' || b.order === 'first') {
          return 1 * isMin
        }

        return 0
      }

      return (a.breakpoint - b.breakpoint) * isMin
    })
  }

  function isNumber(value) {
    return !isNaN(value)
  }
}

;// CONCATENATED MODULE: ./src/js/app.js



addEventListener("DOMContentLoaded", () => {
	useDynamicAdapt();

	isTouchDevice();
	cardInfoHandler();

	// fn.isWebp();
	// fn.stickyHeader();
	// fn.closeMenuHandler();
});

// import "./modules/cookies.js";

/******/ })()
;