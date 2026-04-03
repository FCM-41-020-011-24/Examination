// ─── ROOM DETECTOR COMPONENT ─────────────────────────────────────────────────
// Updates the HUD label based on player position
AFRAME.registerComponent('room-detector', {
  schema: { label: { type: 'string', default: 'Exterior' } },
  init() {
    this.player = document.getElementById('player');
    this.label  = document.getElementById('room-label');
    this.tick   = AFRAME.utils.throttleTick(this.tick, 300, this);
  },
  tick() {
    if (!this.player || !this.label) return;
    const pos = this.player.getAttribute('position');
    if (!pos) return;

    let room = 'Exterior';

    // Ground floor interior
    if (pos.x > -10 && pos.x < 10 && pos.z > -6 && pos.z < 6 && pos.y < 5) {
      if (pos.x < -3)       room = 'Living Room';
      else if (pos.x > 3)   room = 'Kitchen';
      else                  room = 'Hallway';
    }
    // Bedroom (second floor)
    else if (pos.x > -10 && pos.x < 10 && pos.z > -6 && pos.z < 6 && pos.y >= 5) {
      room = 'Bedroom';
    }
    // Pool area (front)
    else if (pos.z > 8 && pos.z < 22) {
      room = 'Pool Area';
    }
    // Fire pit (further front)
    else if (pos.z > 22) {
      room = 'Fire Pit Lounge';
    }
    // Staircase / hallway
    else if (pos.x >= -1.8 && pos.x <= 1.8 && pos.z >= -6 && pos.z <= 0.5 && pos.y > 2) {
      room = 'Staircase';
    }

    if (this.label.textContent !== room) {
      this.label.style.opacity = '0';
      setTimeout(() => {
        this.label.textContent   = room;
        this.label.style.opacity = '1';
      }, 300);
    }
  }
});

// ─── WATER RIPPLE COMPONENT ───────────────────────────────────────────────────
AFRAME.registerComponent('water-ripple', {
  schema: {
    speed:     { type: 'number', default: 0.5 },
    amplitude: { type: 'number', default: 0.04 }
  },
  init() {
    this.time = 0;
    this.baseY = this.el.getAttribute('position').y;
  },
  tick(t, dt) {
    this.time += dt * 0.001;
    const y = this.baseY + Math.sin(this.time * this.data.speed * Math.PI * 2) * this.data.amplitude;
    this.el.setAttribute('position', `0 ${y} 0`);

    // Subtle hue shift
    const hue = 195 + Math.sin(this.time * 0.3) * 10;
    this.el.setAttribute('material', `color: hsl(${hue}, 75%, 52%)`);
  }
});

// ─── FLAME FLICKER COMPONENT ──────────────────────────────────────────────────
AFRAME.registerComponent('flame-flicker', {
  init() {
    this.time = 0;
  },
  tick(t, dt) {
    this.time += dt * 0.001;
    const sx = 0.85 + Math.sin(this.time * 8.3)  * 0.15;
    const sy = 1.0  + Math.sin(this.time * 6.7)  * 0.2;
    const sz = 0.85 + Math.cos(this.time * 7.1)  * 0.15;
    this.el.setAttribute('scale', `${sx} ${sy} ${sz}`);
  }
});

// ─── ROTATE-Y COMPONENT ───────────────────────────────────────────────────────
AFRAME.registerComponent('rotate-y', {
  schema: { speed: { type: 'number', default: 30 } },
  init() { this.angle = 0; },
  tick(t, dt) {
    this.angle += this.data.speed * (dt / 1000);
    this.el.setAttribute('rotation', `0 ${this.angle} 0`);
  }
});

console.log('[Villa] Custom A-Frame components registered.');