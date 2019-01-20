"use strict";

let options = {
	animation: 1000,
	randomizeRows: true
};

function alignGrid(el, userOptions) {
	userOptions && mergeObj(options, userOptions);
	let grid = [[]],
		elRect = el.getBoundingClientRect(),
		lengthPropety = 'width',
		oppLengthProperty = 'height',
		children = Array.from(el.children),
		elLength = elRect[lengthPropety];


	let animateRectsBefore = children.map(a => {
		return {
			rect: a.getBoundingClientRect(),
			el: a
		};
	});

	let rows = Math.floor(children[children.length - 1].getBoundingClientRect().bottom / children[0].getBoundingClientRect()[oppLengthProperty]);


	// Make new 2D array
	let newGrid = [];
	for (let i = 0; i < rows; i++) {
		newGrid.push([]);
	}


	let pool = children.map((el, i) => {
		return {
			rect: el.getBoundingClientRect(),
			el,
			originalIndex: i
		};
	});


	for (let row = 0; row < rows; row++) {
		let widthLeft = elLength;


		while (true) {
			let currentLastInRow = 0;
			for (let i in newGrid[row]) {
				currentLastInRow += newGrid[row][i].rect.width;
			}

			let differencesSorted = pool.sort(function(a, b) {
				if (!a || !b) return;

				let aPotentialEnd = currentLastInRow + a.el.getBoundingClientRect()[lengthPropety],
					bPotentialEnd = currentLastInRow + b.el.getBoundingClientRect()[lengthPropety];


				a.difference = (elLength - aPotentialEnd);
				b.difference = (elLength - bPotentialEnd);

				return a.difference - b.difference;
			});


			let chosenEl = differencesSorted[0];
			if (!chosenEl) break;
			
			let currDiff = chosenEl.difference;
			let chosenIndex = 0;

			while (currDiff < 0) {
				chosenIndex++;
				if (chosenIndex > differencesSorted.length - 1) {
					break;
				}
				chosenEl = differencesSorted[chosenIndex];
				currDiff = chosenEl.difference;
			}

			// If overflowing, new row
			if (currDiff < 0) {
				break;
			}


			pool.splice(pool.indexOf(chosenEl), 1);

			widthLeft -= chosenEl.el.getBoundingClientRect()[lengthPropety];

			newGrid[row].push(chosenEl);
		}
		newGrid[row] = newGrid[row].sort((a, b) => a.originalIndex - b.originalIndex);
	}
	if (options.randomizeRows) {
		let rowsExcludingLast = newGrid.slice(0, newGrid.length - 1);
		newGrid = [newGrid[newGrid.length - 1]];

		newGrid = [...shuffle(rowsExcludingLast), ...newGrid];
	}

	while (el.hasChildNodes()) {
		el.removeChild(el.lastChild);
	}

	// Reconstruct
	for (let i in newGrid) {
		for (let n in newGrid[i]) {
			el.appendChild(newGrid[i][n].el);
		}
	}

	// Animation
	for (let i in newGrid) {
		for (let n in newGrid[i]) {
			animate(animateRectsBefore.find(a => a.el === newGrid[i][n].el).rect, newGrid[i][n].el);
		}
	}
}



function mergeObj(to, from) {
	for (let prop in from) {
		to[prop] = from[prop];
	}
}


function _css(el, prop, val) {
	let style = el && el.style;

	if (style) {
		if (val === void 0) {
			if (document.defaultView && document.defaultView.getComputedStyle) {
				val = document.defaultView.getComputedStyle(el, '');
			}
			else if (el.currentStyle) {
				val = el.currentStyle;
			}

			return prop === void 0 ? val : val[prop];
		}
		else {
			if (!(prop in style) && prop.indexOf('webkit') === -1) {
				prop = '-webkit-' + prop;
			}

			style[prop] = val + (typeof val === 'string' ? '' : 'px');
		}
	}
}

let repaint;
function animate(prevRect, target) {
	let ms = options.animation;
	if (target.animated) return;

	if (ms) {
		let currentRect = target.getBoundingClientRect();

		if (prevRect.nodeType === 1) {
			prevRect = prevRect.getBoundingClientRect();
		}

		// Check if actually moving position
		if ((prevRect.left + prevRect.width / 2) !== (currentRect.left + currentRect.width / 2)
			|| (prevRect.top + prevRect.height / 2) !== (currentRect.top + currentRect.height / 2)
		) {
			_css(target, 'transition', 'none');
			_css(target, 'transform', 'translate('
				+ (prevRect.left - currentRect.left) + 'px,'
				+ (prevRect.top - currentRect.top) + 'px)'
			);
			repaint = target.offsetWidth;
			_css(target, 'transition', 'transform ' + ms + 'ms');
			_css(target, 'transform', 'translate(0,0)');
		}

		(typeof target.animated === 'number') && clearTimeout(target.animated);
		target.animated = setTimeout(function () {
			_css(target, 'transition', '');
			_css(target, 'transform', '');
			target.animated = false;
		}, ms);
	}
}



function shuffle(array) {
    let counter = array.length - 1;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

module.exports = alignGrid;