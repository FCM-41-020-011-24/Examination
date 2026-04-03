// ─── CUSTOM CURSOR ───────────────────────────────────────────────────────────
const cursor     = document.querySelector('.cursor');
const cursorRing = document.querySelector('.cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Smooth ring follow
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Cursor expand on hover
document.querySelectorAll('a, button, .enter-btn, .pill').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '14px';
    cursor.style.height = '14px';
    cursorRing.style.width   = '56px';
    cursorRing.style.height  = '56px';
    cursorRing.style.opacity = '0.3';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '8px';
    cursor.style.height = '8px';
    cursorRing.style.width   = '36px';
    cursorRing.style.height  = '36px';
    cursorRing.style.opacity = '0.6';
  });
});

// ─── LOADING BAR ─────────────────────────────────────────────────────────────
const loadBar = document.querySelector('.load-bar');
let progress  = 0;

const loadInterval = setInterval(() => {
  progress += Math.random() * 4;
  if (progress >= 85) {
    clearInterval(loadInterval);
    progress = 85;
  }
  loadBar.style.width = progress + '%';
}, 60);

window.addEventListener('load', () => {
  clearInterval(loadInterval);
  loadBar.style.width = '100%';
  setTimeout(() => { loadBar.style.opacity = '0'; }, 600);
});

// ─── PARALLAX TILT ────────────────────────────────────────────────────────────
const bgImage = document.querySelector('.bg-image');

document.addEventListener('mousemove', (e) => {
  const cx = (e.clientX / window.innerWidth  - 0.5) * 12;
  const cy = (e.clientY / window.innerHeight - 0.5) * 8;
  bgImage.style.transform = `scale(1.08) translate(${cx}px, ${cy}px)`;
});

// ─── ENTER BUTTON ─────────────────────────────────────────────────────────────
const enterBtn = document.querySelector('.enter-btn');
const overlay  = document.getElementById('transition-overlay');

enterBtn.addEventListener('click', (e) => {
  e.preventDefault();

  // Complete the load bar
  loadBar.style.width   = '100%';
  loadBar.style.opacity = '1';

  // Fade to black then navigate
  overlay.classList.add('active');

  setTimeout(() => {
    window.location.href = 'index.html';
  }, 900);
});

// ─── LIVE CLOCK ──────────────────────────────────────────────────────────────
function updateClock() {
  const now = new Date();
  const timeEl = document.getElementById('live-time');
  if (!timeEl) return;
  timeEl.textContent = now.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: false
  });
}
updateClock();
setInterval(updateClock, 1000);
