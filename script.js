const canvas = document.getElementById("hero-canvas");
const context = canvas.getContext("2d");
const scrollContainer = document.querySelector(".scroll-container");
const brandTitle = document.querySelector(".brand-title");
const brandSubtitle = document.querySelector(".brand-subtitle");
const amberGlow = document.querySelector(".amber-glow");

const frameCount = 300;
// Load images from the local folder provided
const currentFrame = index => (
  `ezgif-226a22263b47b46a-jpg/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
);

const images = [];
let imagesLoaded = 0;

// Initialize Canvas Dimensions
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // Redraw current frame if available
  drawCurrentFrame();
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Preload the image sequence
for (let i = 1; i <= frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  img.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === 1) {
      // Draw first frame immediately when it's loaded
      drawFrame(img);
    }
  };
  images.push(img);
}

function drawFrame(img) {
  // Use "contain" logic to ensure the entire frame is visible, centering it
  const hRatio = canvas.width / img.width;
  const vRatio = canvas.height / img.height;
  const ratio = Math.min(hRatio, vRatio);
  
  const centerShift_x = (canvas.width - img.width * ratio) / 2;
  const centerShift_y = (canvas.height - img.height * ratio) / 2;  

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(
    img,
    0, 0, img.width, img.height,
    centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
  );
}

function drawCurrentFrame() {
  const scrollTop = document.documentElement.scrollTop;
  const maxScroll = scrollContainer.scrollHeight - window.innerHeight;
  
  // Guard against maxScroll being 0 when container is not fully rendered
  if (maxScroll <= 0) return;
  
  let scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScroll));
  
  // Frame index between 0 and frameCount - 1
  const frameIndex = Math.min(
    frameCount - 1,
    Math.floor(scrollFraction * frameCount)
  );

  if (images[frameIndex] && images[frameIndex].complete) {
    drawFrame(images[frameIndex]);
  }
}

// Scroll Event Listener
window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;
  const maxScroll = scrollContainer.scrollHeight - window.innerHeight;
  
  if (maxScroll <= 0) return;
  let scrollFraction = Math.max(0, Math.min(1, scrollTop / maxScroll));
  
  // Use requestAnimationFrame for smooth drawing
  requestAnimationFrame(drawCurrentFrame);
  
  // Text fade-out logic
  if (scrollFraction > 0.05) {
      const opacity = Math.max(0, 1 - (scrollFraction - 0.05) * 8);
      const translateY = Math.min(50, (scrollFraction - 0.05) * 300);
      brandTitle.style.opacity = opacity;
      brandTitle.style.transform = `translateY(-${translateY}px)`;
      brandSubtitle.style.opacity = opacity;
      brandSubtitle.style.transform = `translateY(-${translateY}px)`;
  } else {
      brandTitle.style.opacity = 1;
      brandTitle.style.transform = `translateY(0)`;
      brandSubtitle.style.opacity = 1;
      brandSubtitle.style.transform = `translateY(0)`;
  }
  
  // Amber glow intensifies towards the middle/end when the bottle settles
  if (scrollFraction > 0.4) {
      // Glow goes up to 1 by the end
      amberGlow.style.opacity = Math.min(1, (scrollFraction - 0.4) * 2);
  } else {
      amberGlow.style.opacity = 0;
  }
});
