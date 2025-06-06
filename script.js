// Erzeugen weiterer Quadrate und de Eventhandler für den Close-Button
document.addEventListener("DOMContentLoaded", function () {
	let i = 0,
		x0 = 0,
		y0 = 130;
	const farben = ["red", "green", "blue", "yellow", "orange", "magenta"];
	document.querySelector("#b1")
		.addEventListener("click", function () {
			let newdiv = document.querySelector("#Lager .draggable")
				.cloneNode(true);
			newdiv.style.left = x0 + i * 30 + "px";
			newdiv.style.top = y0 + i * 30 + "px";
			newdiv.style.backgroundColor = farben[i % farben.length];
			i++;
			if (i > 2 * farben.length) {
				i = 0;
				x0 += 30;
			}
			document.querySelector("#outer")
				.appendChild(newdiv);
		}, false);
	document.querySelector("#b2")
		.addEventListener("click", function () {
			let newdiv = document.querySelector("#Lager .fixed")
				.cloneNode(true);
			document.querySelector("#outer")
				.appendChild(newdiv);
		}, false);
		document.querySelector("#b3")
		.addEventListener("click", function () {
			let newdiv = document.querySelector("#Lager .draggable")
				.cloneNode(true);
			newdiv.style.left = x0 + i * 30 + "px";
			newdiv.style.top = y0 + i * 30 + "px";
			newdiv.style.backgroundColor = farben[i % farben.length];
			i++;
			if (i > 2 * farben.length) {
				i = 0;
				x0 += 30;
			}
			document.querySelector("#outer")
				.appendChild(newdiv);
		}, false);
	document.body.addEventListener("click", function (e) {
		if (e.target.classList && e.target.classList.contains("close")) e.target.parentNode
			.parentNode.removeChild(e.target.parentNode);
	}, false);
}, false);
// drag_n_drop.js
// 6. 1. 2021
// Alle Elemente mit der Klasse "draggable" werden verschiebbar gemacht
document.addEventListener("DOMContentLoaded", function () {
	"use strict"
	// Klasse für verschiebbare Elemente
	const drag_class = "draggable";
	// Prüfen, welche Eventmodelle unterstützt werden und welches verwendet werden soll
	const pointer_event = ("PointerEvent" in window);
	const touch_event = ("TouchEvent" in window) && !pointer_event;
	// Einige Variablen
	let pos0; // Pointerposition bei down
	let start; // Position des Dragobjekts bei down
	let zmax = 1000; // Start z-Index für die Dragelemente, muss evtl. angepasst werden
	let dragele = null; // Das aktuelle Dragelement
	// Bestimmen der Pointerposition
	function get_pointer_pos(e) {
			let posx = 0,
				posy = 0;
			if (touch_event && e.targetTouches && e.targetTouches[0] && e.targetTouches[
					0].clientX) {
				posx = e.targetTouches[0].clientX;
				posy = e.targetTouches[0].clientY;
			} else if (e.clientX) {
				posx = e.clientX;
				posy = e.clientY;
			}
			return {
				x: posx,
				y: posy
			};
		} // get_pointer_pos
		//Eventhandler für pointerdown, touchstart oder mousedown
	function handle_down(e) {
			const pos = get_pointer_pos(e);
			down(e, pos);
		} // handle_down
		//Eventhandler für pointermove, touchmove oder mousemove
	function handle_move(e) {
			const pos = get_pointer_pos(e);
			move(e, pos);
		} // handle_move
		//Eventhandler für pointerup, touchend oder mouseup
	function handle_up(e) {
			up(e);
		} // handle_up
		//Eventhandler für keydown
	function handle_keydown(e) {
			const keyCode = e.keyCode;
			let xwert = 0,
				ywert = 0;
			if (keyCode && (keyCode == 27 || keyCode == 37 || keyCode == 38 || keyCode ==
					39 || keyCode == 40)) {
				let delta = e.shiftKey ? 10 : 1;
				down(e, {
					x: 0,
					y: 0
				});
				switch (keyCode) {
				case 37: // links
					xwert = -delta;
					break;
				case 38: // rauf
					ywert = -delta;
					break;
				case 39: // rechts
					xwert = delta;
					break;
				case 40: // runter
					ywert = delta;
					break;
				case 27: // Escape
					esc();
					up(e);
					return;
					break;
				}
				move(e, {
					x: xwert,
					y: ywert
				});
				up(e);
			}
		} // keydown
		// Auswahl des Dragelements und Start der Dragaktion
	function down(e, pos) {
			const target = parent(e.target, drag_class);
			if (target) {
				document.body.style.touchAction = "none";
				e.preventDefault();
				dragele = target;
				start = {
					x: dragele.offsetLeft,
					y: dragele.offsetTop
				};
				pos0 = pos;
				dragele.style.zIndex = ++zmax;
				dragele.focus();
			}
		} // down
		// Bewegen des Dragelements
	function move(e, pos) {
			if (dragele) {
				e.preventDefault();
				dragele.style.left = (start.x + pos.x - pos0.x) + "px";
				dragele.style.top = (start.y + pos.y - pos0.y) + "px";
			}
		} // move
		// Ende der Aktion
	function up(e) {
			if (dragele) {
				dragele = null;
				document.body.style.touchAction = "auto";
			}
		} // up
		// Defokussieren bei ESC-Taste
	function esc() {
			if (dragele) dragele.blur();
		} // esc
		// Dragbares Element mit Tab-Index für die Fokussierbarkeit und Eventhandler für Unterdrückung der Standardaktion versehen
	function finish(ele) {
			ele.tabIndex = 0;
			if (!pointer_event) {
				ele.addEventListener("touchmove", function (e) {
					e.preventDefault()
				}, false);
			}
		} // finish
		// Vorfahrenelement mit Klasse classname suchen
	function parent(child, classname) {
			if (child && "closest" in child) return child.closest("." + classname);
			let ele = child;
			while (ele) {
				if (ele.classList && ele.classList.contains(classname)) return ele;
				else ele = ele.parentElement;
			}
			return null;
		} // parent
		// Alle Eventhandler notieren
	if (pointer_event) {
		document.body.addEventListener("pointerdown", handle_down, false);
		document.body.addEventListener("pointermove", handle_move, false);
		document.body.addEventListener("pointerup", handle_up, false);
	} else if (touch_event) {
		document.body.addEventListener("touchstart", handle_down, false);
		document.body.addEventListener("touchmove", handle_move, false);
		document.body.addEventListener("touchend", handle_up, false);
	} else {
		document.body.addEventListener("mousedown", handle_down, false);
		document.body.addEventListener("mousemove", handle_move, false);
		document.body.addEventListener("mouseup", handle_up, false);
	}
	document.body.addEventListener("keydown", handle_keydown, false);
	// finish für alle verschiebbaren Elemente aufrufen
	const draggable = document.querySelectorAll("." + drag_class);
	for (let i = 0; i < draggable.length; i++) {
		finish(draggable[i]);
	}
	// css-Angaben für die Bedienbarkeit
	const style = document.createElement('style');
	style.innerText = "." + drag_class + ":focus { outline: 1px solid red; } " +
		"." + drag_class +
		" { position: absolute; cursor: move; touch-action: none; } ";
	document.head.appendChild(style);
	// finish für nachträglich erzeugte verschiebbare Elemente aufrufen
	new MutationObserver(function (mutationsList) {
			for (let i = 0; i < mutationsList.length; i++) {
				if (mutationsList[i].type === 'childList') {
					for (let j = 0; j < mutationsList[i].addedNodes.length; j++) {
						if (mutationsList[i].addedNodes[j].classList && mutationsList[i].addedNodes[
								j].classList.contains(drag_class)) {
							finish(mutationsList[i].addedNodes[j]);
						}
					}
				}
			}
		})
		.observe(document.body, {
			childList: true,
			subtree: true
		});
}, false); // DOMContentLoaded
// Ende drag_n_drop.js
