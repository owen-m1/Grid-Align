import alignGrid from '../dist/gridAlign.min.js';

let alignButton = document.getElementById('align');
let resetButton = document.getElementById('reset');
let grid = document.getElementById('grid');
alignButton.addEventListener('click', function() {
	alignGrid(grid, {
		randomizeRows: true
	});
});

resetButton.addEventListener('click', function() {
	generate();
});


let colors = ['#2ffca7', '#fce42f', '#44fc2f', '#fc2f2f', '#fc2feb', '#2f3dfc'];
function generate() {
	grid.innerHTML = '';
	for (let i = 0; i < 100; i++) {
		let div = document.createElement('div');
		div.classList.add('list-group-item');
		div.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
		div.style.width = (Math.random() * 100 + 10) + 'px';
		grid.appendChild(div);
	}
}
generate();