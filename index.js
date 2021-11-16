// First time using Canvas! Expect lots of notes.

// -=-=- Utility Functions -=-=-

// to get random number between two
function randomMinMax(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

// -=-=-=- Select Canvas and create context -=-=-=-
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

// -=-=-=-=-=-=- Canvas Size Management -=-=-=-=-=-=-

// Manage size of the canvas
const pxRatio = window.devicePixelRatio || 1; // for detecting HighDPI displays
let canvasWidth = window.innerWidth;
let canvasHeight = window.innerHeight;

function setCanvasSize() {
	canvasWidth = window.innerWidth;
	canvasHeight = window.innerHeight;

	canvas.height = pxRatio * canvasHeight;
	canvas.width = pxRatio * canvasWidth;

	canvas.style.width = window.innerWidth + 'px';
	canvas.style.height = window.innerHeight + 'px';

	ctx.scale(pxRatio, pxRatio);

	init();
}

window.addEventListener('resize', () => {
	setCanvasSize();
});

window.addEventListener('click', () => {
	init();
});

// -=-=-=-=-=-=- Globals -=-=-=-=-=-=-
const pallete = ['#0367A6', '#BDDEF2', '#F2B705', '#F28705', '#F25C05'];
let gravityStrength = 1;
let resistance = 0.5;

// -=-=-=-=-=-=- Begin class definitions -=-=-=-=-=-=-

// FPS Counter
class FPSCounter {
	constructor() {
		this.fps = null;
		this.lastCall = performance.now();
	}

	draw() {
		ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
		ctx.fillRect(0, 0, 50, 25);
		ctx.fillStyle = 'white';
		ctx.font = '12px Arial';
		ctx.fillText(`${this.fps} fps`, 5, 16);
	}

	update() {
		let delta = performance.now() - this.lastCall;
		this.lastCall = performance.now();
		this.fps = Math.floor((1 / delta) * 1000);

		this.draw();
	}
}

// Create class for circles
class Circle {
	constructor(x, y, radius, color, xVel, yVel) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.xVel = xVel;
		this.yVel = yVel;
		this.color = color;
	}

	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
		ctx.fillStyle = this.color;
		ctx.fill();
	}

	update() {
		if (this.x + this.radius > canvasWidth || this.x - this.radius < 0) {
			this.xVel = -this.xVel;
		}

		if (this.y + this.radius > canvasHeight) {
			this.y = canvasHeight - this.radius;
			this.yVel = -this.yVel * resistance;
			this.xVel = this.xVel * resistance;
		} else {
			this.yVel += gravityStrength;
		}

		this.x += this.xVel;
		this.y += this.yVel;

		this.draw();
	}
}

// -=-=-=- Create Instances and Render function -=-=-=-

// Creates circles and fps counter
let circles;
let fpsCounter;

function init() {
	circles = [];
	fpsCounter = new FPSCounter();

	for (let i = 0; i < 100; i++) {
		let radius = randomMinMax(10, 50);
		let x = randomMinMax(radius, canvasWidth - radius);
		let y = randomMinMax(radius, canvasHeight / 2 - radius);
		let color = pallete[randomMinMax(0, pallete.length - 1)];
		let xVel = randomMinMax(-20, 20);
		let yVel = randomMinMax(-40, 0);

		circles.push(new Circle(x, y, radius, color, xVel, yVel));
	}
}

// Render the circles and counter
function render() {
	requestAnimationFrame(render);
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);

	// Call draw methods for each circle in array
	for (let circle of circles) {
		circle.update();
	}

	// Draw counter every render cycle
	fpsCounter.update();
}

// Begin!
setCanvasSize();
render();
