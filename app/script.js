const fileInput = document.getElementById('fileInput');
const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
const downloadButton = document.getElementById('downloadButton');
const clearButton = document.getElementById('clearButton');
const paddingSlider = document.getElementById('paddingSlider');
const paddingPercentage = document.getElementById('paddingPercentage');
const sliderContainer = document.querySelector('.slider-container');
const canvasPlaceholder = document.getElementById('canvasPlaceholder');

let originalImage = null;
let originalWidth = 0;
let originalHeight = 0;

fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        originalImage = img;
        originalWidth = img.width;
        originalHeight = img.height;

        // Hide the placeholder and show the slider and download button
        canvasPlaceholder.style.display = 'none';
        sliderContainer.style.display = 'block';
        downloadButton.style.display = 'block';

        // Draw the image with initial padding (0%)
        drawImageWithPadding(0);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

paddingSlider.addEventListener('input', (event) => {
  const paddingPercent = parseInt(event.target.value, 10);
  paddingPercentage.textContent = `${paddingPercent}%`;
  drawImageWithPadding(paddingPercent);
});

clearButton.addEventListener('click', () => {
  // Reset canvas and UI elements
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvasPlaceholder.style.display = 'flex';
  sliderContainer.style.display = 'none';
  downloadButton.style.display = 'none';
  paddingSlider.value = 0;
  paddingPercentage.textContent = '0%';
  originalImage = null;
});

downloadButton.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'padded-image.jpg';
  link.href = canvas.toDataURL('image/jpeg');
  link.click();
});

function drawImageWithPadding(paddingPercent) {
  if (!originalImage) return;

  const x = originalHeight;
  const y = originalWidth;
  const minDimension = Math.min(x, y);

  const padding = Math.floor((paddingPercent / 100) * minDimension);

  let paddingTop = 0, paddingBottom = 0, paddingLeft = 0, paddingRight = 0;

  if (x > y) {
    // Case: Height > Width
    paddingTop = padding;
    paddingBottom = padding;
    paddingLeft = Math.floor((x - y) / 2 + padding);
    paddingRight = Math.floor((x - y) / 2 + padding);
  } else {
    // Case: Width > Height
    paddingLeft = padding;
    paddingRight = padding;
    paddingTop = Math.floor((y - x) / 2 + padding);
    paddingBottom = Math.floor((y - x) / 2 + padding);
  }

  // Set canvas dimensions
  canvas.width = y + paddingLeft + paddingRight;
  canvas.height = x + paddingTop + paddingBottom;

  // Fill canvas with white background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the image with padding
  ctx.drawImage(originalImage, paddingLeft, paddingTop, y, x);

  // Dynamically scale the canvas for preview
  const scaleFactor = Math.min(600 / canvas.width, 600 / canvas.height);
  canvas.style.width = `${canvas.width * scaleFactor}px`;
  canvas.style.height = `${canvas.height * scaleFactor}px`;
}
