/**
 * villa.js — Apex Villa
 * - Floor navigation (Ground / Floor 1 / Floor 2 / Garage)
 * - Room label updater
 * - Procedural car builder (replaces car GLB)
 */

// ─── Floor teleport positions ───────────────────────────────────────────────
const FLOORS = {
  ground: { x: 0,  y: 1.6,  z: 20,  label: 'Ground Floor — Living & Kitchen' },
  floor1: { x: 0,  y: 5.9,  z: 2,   label: 'Floor 1 — Bedroom' },
  floor2: { x: 0,  y: 10.2, z: 2,   label: 'Floor 2 — Master Suite' },
  garage: { x: 14, y: 1.6,  z: 1,   label: 'Garage' },
};

// Track current floor
let currentFloor = 'ground';

/**
 * Teleport player to the selected floor.
 * Called by onclick on each floor button.
 */
function goToFloor(floorKey) {
  const floor = FLOORS[floorKey];
  if (!floor) return;

  const player = document.getElementById('player');
  if (!player) return;

  // Set position
  player.setAttribute('position', { x: floor.x, y: floor.y, z: floor.z });

  // Update label
  const label = document.getElementById('room-label');
  if (label) label.textContent = floor.label;

  // Update active button styling
  document.querySelectorAll('.floor-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById('btn-' + floorKey);
  if (activeBtn) activeBtn.classList.add('active');

  currentFloor = floorKey;
}

// ─── Room label auto-update based on player Y position ──────────────────────
function autoUpdateLabel() {
  const player = document.getElementById('player');
  if (!player) return;

  const pos = player.getAttribute('position');
  if (!pos) return;

  const y = parseFloat(pos.y);
  const x = parseFloat(pos.x);
  const z = parseFloat(pos.z);

  let label = 'Exterior';

  // Garage zone
  if (x > 8 && x < 22 && z > -4 && z < 10 && y < 5) {
    label = 'Garage';
  }
  // Ground floor interior
  else if (y < 4.3 && x > -11 && x < 11 && z > -7 && z < 7) {
    if (x < 0) label = 'Living Room';
    else label = 'Kitchen';
  }
  // Pool / outdoor
  else if (z > 9 && z < 22 && y < 3) {
    label = 'Pool Deck';
  }
  // Fire pit
  else if (z >= 22 && y < 3) {
    label = 'Fire Pit Lounge';
  }
  // First floor
  else if (y >= 4.3 && y < 8.6) {
    label = 'Floor 1 — Bedroom';
  }
  // Second floor
  else if (y >= 8.6) {
    if (x > 4) label = 'Floor 2 — En-Suite';
    else label = 'Floor 2 — Master Suite';
  }

  const labelEl = document.getElementById('room-label');
  if (labelEl && labelEl.textContent !== label) {
    labelEl.textContent = label;
  }
}

// ─── Procedural Car Builder ──────────────────────────────────────────────────
/**
 * Builds a sports car from A-Frame primitives inside the garage.
 * Car centre: x=14, y=0, z=0 (inside garage entity at x=14,z=3 → local z=-3)
 */
function buildCar(scene) {
  // We inject into world space — garage is at world x=14, z=3
  // Car sits at world x=14, z=0 (local z=-3 from garage centre)
  const carX = 14, carY = 0, carZ = 0;

  const carColor   = '#c0392b'; // deep red
  const trimColor  = '#111111';
  const glassColor = '#88bbdd';
  const wheelColor = '#1a1a1a';
  const rimColor   = '#c9a84c';

  // Helper to create an a-box element
  function box(opts) {
    const el = document.createElement('a-box');
    Object.entries(opts).forEach(([k, v]) => el.setAttribute(k, v));
    scene.appendChild(el);
    return el;
  }
  function cyl(opts) {
    const el = document.createElement('a-cylinder');
    Object.entries(opts).forEach(([k, v]) => el.setAttribute(k, v));
    scene.appendChild(el);
    return el;
  }

  const cx = carX, cy = carY, cz = carZ;

  // ── Body lower (chassis) ──
  box({ color: carColor, width: 1.9, height: 0.45, depth: 4.2,
        position: `${cx} ${cy+0.52} ${cz}`, roughness: 0.3, metalness: 0.5,
        shadow: 'cast:true' });

  // ── Body upper (cabin) ──
  box({ color: carColor, width: 1.7, height: 0.42, depth: 2.0,
        position: `${cx} ${cy+0.95} ${cz+0.1}`, roughness: 0.3, metalness: 0.5 });

  // ── Roof ──
  box({ color: carColor, width: 1.55, height: 0.18, depth: 1.7,
        position: `${cx} ${cy+1.16} ${cz+0.1}`, roughness: 0.3, metalness: 0.5 });

  // ── Hood (front slope) ──
  box({ color: carColor, width: 1.85, height: 0.18, depth: 1.0,
        position: `${cx} ${cy+0.72} ${cz-1.5}`, rotation: `8 0 0`,
        roughness: 0.3, metalness: 0.5 });

  // ── Boot (rear slope) ──
  box({ color: carColor, width: 1.85, height: 0.18, depth: 0.8,
        position: `${cx} ${cy+0.72} ${cz+1.4}`, rotation: `-6 0 0`,
        roughness: 0.3, metalness: 0.5 });

  // ── Windscreen (front glass) ──
  box({ color: glassColor, opacity: '0.35', width: 1.5, height: 0.45, depth: 0.08,
        position: `${cx} ${cy+1.0} ${cz-0.92}`, rotation: `-22 0 0`,
        transparent: true, metalness: 0.9, roughness: 0.05 });

  // ── Rear windscreen ──
  box({ color: glassColor, opacity: '0.35', width: 1.5, height: 0.4, depth: 0.08,
        position: `${cx} ${cy+1.0} ${cz+1.12}`, rotation: `18 0 0`,
        transparent: true, metalness: 0.9, roughness: 0.05 });

  // ── Side windows (left) ──
  box({ color: glassColor, opacity: '0.3', width: 0.06, height: 0.32, depth: 1.5,
        position: `${cx-0.86} ${cy+0.99} ${cz+0.1}`,
        transparent: true, metalness: 0.9, roughness: 0.05 });

  // ── Side windows (right) ──
  box({ color: glassColor, opacity: '0.3', width: 0.06, height: 0.32, depth: 1.5,
        position: `${cx+0.86} ${cy+0.99} ${cz+0.1}`,
        transparent: true, metalness: 0.9, roughness: 0.05 });

  // ── Front bumper ──
  box({ color: trimColor, width: 1.8, height: 0.22, depth: 0.12,
        position: `${cx} ${cy+0.34} ${cz-2.15}`, roughness: 0.2, metalness: 0.6 });

  // ── Rear bumper ──
  box({ color: trimColor, width: 1.8, height: 0.22, depth: 0.12,
        position: `${cx} ${cy+0.34} ${cz+2.15}`, roughness: 0.2, metalness: 0.6 });

  // ── Front grille ──
  box({ color: trimColor, width: 1.2, height: 0.18, depth: 0.08,
        position: `${cx} ${cy+0.52} ${cz-2.12}`, roughness: 0.1, metalness: 0.8 });

  // ── Headlights (left + right) ──
  box({ color: '#fffde0', width: 0.32, height: 0.12, depth: 0.06,
        position: `${cx-0.7} ${cy+0.58} ${cz-2.12}`,
        emissive: '#fffde0', 'emissive-intensity': 0.9 });
  box({ color: '#fffde0', width: 0.32, height: 0.12, depth: 0.06,
        position: `${cx+0.7} ${cy+0.58} ${cz-2.12}`,
        emissive: '#fffde0', 'emissive-intensity': 0.9 });

  // ── Tail lights ──
  box({ color: '#cc1111', width: 0.35, height: 0.1, depth: 0.06,
        position: `${cx-0.7} ${cy+0.56} ${cz+2.13}`,
        emissive: '#cc1111', 'emissive-intensity': 0.8 });
  box({ color: '#cc1111', width: 0.35, height: 0.1, depth: 0.06,
        position: `${cx+0.7} ${cy+0.56} ${cz+2.13}`,
        emissive: '#cc1111', 'emissive-intensity': 0.8 });

  // ── Side skirts ──
  box({ color: trimColor, width: 0.08, height: 0.1, depth: 3.6,
        position: `${cx-0.96} ${cy+0.34} ${cz}`, roughness: 0.2, metalness: 0.7 });
  box({ color: trimColor, width: 0.08, height: 0.1, depth: 3.6,
        position: `${cx+0.96} ${cy+0.34} ${cz}`, roughness: 0.2, metalness: 0.7 });

  // ── Door handles ──
  box({ color: rimColor, width: 0.18, height: 0.04, depth: 0.04,
        position: `${cx-0.97} ${cy+0.88} ${cz-0.2}`, metalness: 0.9 });
  box({ color: rimColor, width: 0.18, height: 0.04, depth: 0.04,
        position: `${cx+0.97} ${cy+0.88} ${cz-0.2}`, metalness: 0.9 });

  // ── Exhaust pipes ──
  cyl({ color: '#888', radius: 0.055, height: 0.2,
        position: `${cx-0.5} ${cy+0.22} ${cz+2.2}`, rotation: '90 0 0', metalness: 0.8 });
  cyl({ color: '#888', radius: 0.055, height: 0.2,
        position: `${cx+0.5} ${cy+0.22} ${cz+2.2}`, rotation: '90 0 0', metalness: 0.8 });

  // ── Wheels (4 corners) ──
  const wheelPos = [
    { x: cx-1.0, z: cz-1.3 },  // front left
    { x: cx+1.0, z: cz-1.3 },  // front right
    { x: cx-1.0, z: cz+1.3 },  // rear left
    { x: cx+1.0, z: cz+1.3 },  // rear right
  ];

  wheelPos.forEach(wp => {
    // Tyre
    cyl({ color: wheelColor, radius: 0.34, height: 0.24,
          position: `${wp.x} ${cy+0.34} ${wp.z}`,
          rotation: '0 0 90', roughness: 1.0, shadow: 'cast:true' });
    // Rim
    cyl({ color: rimColor, radius: 0.2, height: 0.26,
          position: `${wp.x} ${cy+0.34} ${wp.z}`,
          rotation: '0 0 90', metalness: 0.9, roughness: 0.1 });
    // Hub centre
    cyl({ color: '#222', radius: 0.06, height: 0.28,
          position: `${wp.x} ${cy+0.34} ${wp.z}`,
          rotation: '0 0 90', metalness: 0.6 });
    // Spoke 1
    box({ color: rimColor, width: 0.04, height: 0.27, depth: 0.04,
          position: `${wp.x} ${cy+0.34} ${wp.z}`, metalness: 0.8 });
    // Spoke 2
    box({ color: rimColor, width: 0.27, height: 0.04, depth: 0.04,
          position: `${wp.x} ${cy+0.34} ${wp.z}`, metalness: 0.8 });
  });

  // ── Headlight glow ──
  const glowEl = document.createElement('a-light');
  glowEl.setAttribute('type', 'point');
  glowEl.setAttribute('color', '#fffde0');
  glowEl.setAttribute('intensity', '1.2');
  glowEl.setAttribute('position', `${cx} ${cy+0.6} ${cz-2.4}`);
  glowEl.setAttribute('distance', '6');
  scene.appendChild(glowEl);
}

// ─── Boot sequence ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const scene = document.querySelector('a-scene');

  if (scene.hasLoaded) {
    init(scene);
  } else {
    scene.addEventListener('loaded', () => init(scene));
  }
});

function init(scene) {
  // Build the procedural car in garage
  buildCar(scene);

  // Start room label polling
  setInterval(autoUpdateLabel, 800);

  // Pointer-events fix for nav buttons (pointer lock eats clicks)
  document.querySelectorAll('.floor-btn').forEach(btn => {
    btn.style.pointerEvents = 'all';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const floor = btn.id.replace('btn-', '');
      goToFloor(floor);
    });
  });
}