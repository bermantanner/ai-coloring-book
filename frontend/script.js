let isDrawing = false;
let x = 0;
let y = 0;
let curColor = '#000000';
let brushSize = 5;
let drawingStack = []; // This is going to collect drawing history


const drawingCanvas = document.getElementById('drawing-canvas');
const drawingCtx = drawingCanvas.getContext('2d');

const imageCanvas = document.getElementById('image-canvas');
const imageCtx = imageCanvas.getContext('2d');

//Listening for color changes
document.getElementById('color-picker').addEventListener('input', function(event) {
    curColor = event.target.value;
});

//Listening for brush size
document.getElementById('brush-size').addEventListener('input', function(event) {
    brushSize = event.target.value;
    document.getElementById('brush-size-value').textContent = brushSize; /* Send brush size back to HTML for label */
});

//Loading file
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

                //Since this is a new image, we clear history

                drawingStack = [];
                saveDrawingState();

                //console.log("Image loaded with fixed dimensions:", fixedWidth, fixedHeight);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Saving drawing state
function saveDrawingState() {
    const canvasData = drawingCanvas.toDataURL();
    drawingStack.push(canvasData);
}

//Undo functionality
document.getElementById('undo-button').addEventListener('click', function() {
    if (drawingStack.length > 1) {
        drawingStack.pop();
        const previousState = drawingStack[drawingStack.length-1];
        const img = new Image();
        img.src = previousState;
        img.onload = function() {
            drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
            drawingCtx.drawImage(img, 0, 0);
        }
    }
});

//DRAWING! ------------------------
drawingCanvas.addEventListener('mousedown', e => {
    isDrawing = true;
    x = e.offsetX;
    y = e.offsetY;
    //console.log("Drawing started at:", x, y);
});

drawingCanvas.addEventListener('mousemove', e => {
    if (isDrawing) {
        const newX = e.offsetX;
        const newY = e.offsetY;
        drawingCtx.strokeStyle = curColor;
        drawingCtx.lineWidth = brushSize;
        drawingCtx.lineCap = 'round';
        drawingCtx.beginPath();
        drawingCtx.moveTo(x, y);
        drawingCtx.lineTo(newX, newY);
        drawingCtx.stroke();
        //console.log("Drawing to:", newX, newY);
        x = newX;
        y = newY;
    }
});

window.addEventListener('mouseup', () => {
    if (isDrawing) {
        saveDrawingState();
    }
    isDrawing = false;
    //console.log("Drawing ended.");
});
// ---------------------------------

//Downloading picture
document.getElementById('download-button').addEventListener('click', function() {
    // Creating temp canvas to combine the drawing and image canvases
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = drawingCanvas.width;
    tempCanvas.height = drawingCanvas.height;

    // Drawing both canvases onto temp canvas
    tempCtx.drawImage(drawingCanvas, 0, 0);
    tempCtx.drawImage(imageCanvas, 0, 0);

    // Downloading...
    const link = document.createElement('a');
    link.href = tempCanvas.toDataURL('image/png');
    link.download = 'coloring_book_image.png';
    link.click();
});

// Sending prompt to backend server!
document.getElementById('generate-button').addEventListener('click', async () => {
    // Grabbing user prompt
    const prompt = document.getElementById('ai-prompt').value;

    // Sending input to backend, HTTP POST request
    const response = await fetch('http://127.0.0.1:5000/generate-line-drawing', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: `${prompt}` })
    });

    // Waiting for API response
    const data = await response.json();
    
    // Loading and displaying image
    const img = new Image();
    
    img.src = data.image_url;
    img.onload = () => {
        const drawingCanvas = document.getElementById('drawing-canvas');
        const drawingCtx = drawingCanvas.getContext('2d');

        const fixedWidth = 500;
        const fixedHeight = 500;

        drawingCanvas.width = fixedWidth;
        drawingCanvas.height = fixedHeight;

        imageCanvas.width = fixedWidth;
        imageCanvas.height = fixedHeight;

        imageCtx.drawImage(img, 0, 0, fixedWidth, fixedHeight); 

        drawingStack = [];
        saveDrawingState();
    };
});
