let isDrawing = false;
let x = 0;
let y = 0;

const drawingCanvas = document.getElementById('drawing-canvas');
const drawingCtx = drawingCanvas.getContext('2d');

const imageCanvas = document.getElementById('image-canvas');
const imageCtx = imageCanvas.getContext('2d');

document.getElementById('image-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const fixedWidth = 500;
                const fixedHeight = 500;

                drawingCanvas.width = fixedWidth;
                drawingCanvas.height = fixedHeight;

                imageCanvas.width = fixedWidth;
                imageCanvas.height = fixedHeight;

                imageCtx.drawImage(img, 0, 0, fixedWidth, fixedHeight);

                console.log("Image loaded with fixed dimensions:", fixedWidth, fixedHeight);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

drawingCanvas.addEventListener('mousedown', e => {
    isDrawing = true;
    x = e.offsetX;
    y = e.offsetY;
    console.log("Drawing started at:", x, y);
});

drawingCanvas.addEventListener('mousemove', e => {
    if (isDrawing) {
        const newX = e.offsetX;
        const newY = e.offsetY;
        drawingCtx.beginPath();
        drawingCtx.moveTo(x, y);
        drawingCtx.lineTo(newX, newY);
        drawingCtx.stroke();
        console.log("Drawing to:", newX, newY);
        x = newX;
        y = newY;
    }
});

window.addEventListener('mouseup', () => {
    isDrawing = false;
    console.log("Drawing ended.");
});