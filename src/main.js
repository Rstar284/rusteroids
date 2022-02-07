import init, { App } from './wasm/rusteroids.js';

const height = window.screen.height;
const width = window.screen.width;

const screenCanvas = document.querySelector('canvas');
const screenContext = screenCanvas.getContext('2d');
const drawingCanvas = document.createElement('canvas');
const drawingContext = drawingCanvas.getContext('2d');
const effectsCanvas = document.createElement('canvas');
const effectsContext = effectsCanvas.getContext('2d');
const effects = effectsContext.filter ? true : false;

let app, memory, time;
let flat = false;
let frames = 0;
let seconds = 0;

function resize() {
    const _height = window.screen.height;
    const _width = window.screen.width;

    effectsCanvas.height = _height;
    effectsCanvas.width = _width;

    screenCanvas.height = _height;
    screenCanvas.width = _width;

    drawingCanvas.height = 3 * _height;
    drawingCanvas.width = 3 * _width;
}

async function main() {
    effectsCanvas.height = height;
    effectsCanvas.width = width;

    screenCanvas.style.opacity = '1';
    screenCanvas.height = height;
    screenCanvas.width = width;

    drawingCanvas.height = 3 * height;
    drawingCanvas.width = 3 * width;

    drawingContext.strokeStyle = '#9c9c9c';
    drawingContext.lineCap = 'round';
    drawingContext.lineJoin = 'round';
    drawingContext.setTransform(1, 0, 0, 1, width, height);

    document.querySelector('body').style.visibility = 'visible';

    window.addEventListener('keydown', handleKey(true));
    window.addEventListener('keyup', handleKey(false));
    window.addEventListener('click', toggleFlat);
    window.addEventListener('resive', resize);

    const wasm = await init();
    memory = wasm.memory;
    app = App.new();
    time = performance.now();

    loop(time);
}

function loop(now) {
    let dt = (now - time) / 1000;
    app.step(dt, bitpackControls());
    time = now;
    draw();
    requestAnimationFrame(loop);

    // If frame rate is low, enable flat mode
    if (effects && !flat && dt) {
        frames += 1;
        seconds += dt;
        if (2 <= seconds) {
            if (frames / seconds < 30) {
                toggleFlat();
            }

            frames = 0;
            seconds = 0;
        }
    }
}

function toggleFlat() {
    flat = !flat;

    document.body.className = flat ? 'flat' : '';
    screenCanvas.className = flat ? 'flat' : '';
}

// Controls

const controls = {
    left: false,
    right: false,
    thrust: false,
    fire: false,
    shield: false,
    start: false
};

function bitpackControls() {
    return (
        0 +
        (controls.left ? 1 : 0) +
        (controls.right ? 2 : 0) +
        (controls.thrust ? 4 : 0) +
        (controls.fire ? 8 : 0) +
        (controls.shield ? 16 : 0) +
        (controls.start ? 32 : 0)
    );
}

function handleKey(down) {
    return function (event) {
        let control = keyToControl(event.key);
        if (control !== null) {
            controls[control] = down;
            event.preventDefault();
        }
    };
}

function keyToControl(key) {
    switch (key.toLowerCase()) {
        /* case 'escape':
        case 'r':
            app.free(); */

        case 'arrowleft':
        case 'j':
            return 'left';

        case 'arrowright':
        case 'l':
            return 'right';

        case 'arrowup':
        case 'i':
            return 'thrust';

        case 's':
            return 'shield';

        case 'f':
            return 'fire';

        case 'enter':
            return 'start';

        default:
            return null;
    }
}

// Drawing

function draw() {
    // Render
    const list = app.render();
    const length = list.length();
    const paths = new Uint32Array(memory.buffer, list.paths(), length * 2);
    const alphas = new Float64Array(memory.buffer, list.alphas(), length);
    const ends = new Uint8Array(memory.buffer, list.ends(), length);
    const points = new Float64Array(
        memory.buffer,
        list.points(),
        list.points_length() * 2
    );

    // Drawing
    drawingContext.clearRect(-width, -height, 3 * width, 3 * height);
    for (let i = 0; i < length; i += 1) {
        drawPoints(
            drawingContext,
            points,
            paths[i * 2],
            paths[i * 2 + 1],
            alphas[i],
            ends[i] === 1
        );
    }
    list.free();

    // Drawing -> Screen
    screenContext.clearRect(0, 0, width, height);
    for (let row in [0, 1, 2]) {
        for (let col in [0, 1, 2]) {
            screenContext.drawImage(
                drawingCanvas,
                col * width,
                row * height,
                width,
                height,
                0,
                0,
                width,
                height
            );
        }
    }

    // Effects -> Screen
    if (effects && !flat) {
        effectsContext.clearRect(0, 0, width, height);
        effectsContext.globalAlpha = 0.4;
        effectsContext.filter = 'blur(20px)';
        effectsContext.shadowBlur = '10';
        effectsContext.drawImage(screenCanvas, 0, 0, width, height);
        effectsContext.filter = 'blur(3px)';
        effectsContext.drawImage(screenCanvas, 0, 0, width, height);
        screenContext.drawImage(effectsCanvas, 0, 0, width, height);
    }
}

function drawPoints(context, points, index, length, alpha, isClosed) {
    context.beginPath();
    context.globalAlpha = alpha;
    context.lineWidth = 0.6 + alpha;
    context.moveTo(points[index * 2], points[index * 2 + 1]);
    for (let i = index + 1; i < index + length; i += 1) {
        context.lineTo(points[i * 2], points[i * 2 + 1]);
    }

    if (isClosed) {
        context.closePath();
    }

    context.stroke();
}

main();
