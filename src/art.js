import * as THREE from 'three';

// Procedural anime / game posters and neon signs, drawn on canvas.
const W = 512, H = 640;
function rng(seed) { let a = seed; return () => { a = (a * 16807) % 2147483647; return a / 2147483647; }; }
function make(draw, w = W, h = H) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); draw(g, w, h); return c;
}
const grad = (g, y0, y1, stops) => { const l = g.createLinearGradient(0, y0, 0, y1); stops.forEach(([o, c]) => l.addColorStop(o, c)); return l; };
const stars = (g, n, seed, ymax = H) => { const r = rng(seed); for (let i = 0; i < n; i++) { g.fillStyle = `rgba(255,255,255,${.3 + r() * .7})`; const s = r() < .1 ? 3 : 1.5; g.fillRect(r() * W, r() * ymax, s, s); } };
function title(g, text, y, color = '#fff', size = 30) {
  g.fillStyle = color; g.font = `800 ${size}px Orbitron, "Noto Sans TC", sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, W / 2, y);
}
function star(g, x, y, r, color) {
  g.fillStyle = color; g.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
  g.closePath(); g.fill();
}

// 1. 魔法少女 (雙馬尾)
export function animeGirl() {
  return make((g) => {
    g.fillStyle = grad(g, 0, H, [[0, '#3b2a8f'], [.55, '#d06ad0'], [1, '#ffb6a8']]); g.fillRect(0, 0, W, H);
    stars(g, 90, 5, 380);
    g.fillStyle = 'rgba(255,240,255,.9)'; g.beginPath(); g.arc(256, 250, 170, 0, 7); g.fill();
    g.fillStyle = 'rgba(255,200,240,.5)'; g.beginPath(); g.arc(256, 250, 200, 0, 7); g.fill();
    // twin tails
    g.fillStyle = '#ff7ab8';
    for (const s of [-1, 1]) {
      g.beginPath(); g.moveTo(256 + s * 62, 200); g.bezierCurveTo(256 + s * 190, 210, 256 + s * 190, 420, 256 + s * 120, 520);
      g.bezierCurveTo(256 + s * 110, 400, 256 + s * 100, 300, 256 + s * 50, 260); g.fill();
    }
    // body
    g.fillStyle = '#fff'; g.beginPath(); g.moveTo(205, 350); g.quadraticCurveTo(256, 330, 307, 350); g.lineTo(340, 600); g.lineTo(172, 600); g.fill();
    g.fillStyle = '#6a4bd6'; g.beginPath(); g.moveTo(205, 350); g.lineTo(256, 400); g.lineTo(307, 350); g.lineTo(290, 340); g.lineTo(256, 370); g.lineTo(222, 340); g.fill();
    g.fillStyle = '#ff5aa5'; g.beginPath(); g.moveTo(240, 395); g.lineTo(272, 395); g.lineTo(256, 425); g.fill();
    // head
    g.fillStyle = '#ffe4d2'; g.beginPath(); g.ellipse(256, 250, 68, 78, 0, 0, 7); g.fill();
    g.fillStyle = '#ff7ab8'; g.beginPath(); g.moveTo(178, 250); g.bezierCurveTo(176, 150, 336, 150, 334, 250); g.bezierCurveTo(320, 205, 290, 195, 256, 206); g.bezierCurveTo(222, 195, 192, 205, 178, 250); g.fill();
    for (const s of [-1, 1]) {
      g.fillStyle = '#fff'; g.beginPath(); g.ellipse(256 + s * 28, 262, 15, 21, 0, 0, 7); g.fill();
      g.fillStyle = '#5b3bd8'; g.beginPath(); g.ellipse(256 + s * 28, 266, 12, 17, 0, 0, 7); g.fill();
      g.fillStyle = '#1a1140'; g.beginPath(); g.ellipse(256 + s * 28, 268, 6, 10, 0, 0, 7); g.fill();
      g.fillStyle = '#fff'; g.beginPath(); g.arc(256 + s * 28 - 4, 260, 4, 0, 7); g.fill();
      g.fillStyle = 'rgba(255,120,140,.45)'; g.beginPath(); g.ellipse(256 + s * 44, 292, 11, 6, 0, 0, 7); g.fill();
    }
    g.strokeStyle = '#c45a6a'; g.lineWidth = 3; g.beginPath(); g.arc(256, 296, 8, .2, Math.PI - .2); g.stroke();
    star(g, 256, 170, 20, '#ffe14f'); star(g, 120, 120, 14, '#fff'); star(g, 400, 90, 18, '#ffe14f'); star(g, 420, 330, 10, '#fff');
    title(g, 'MAGICAL  GIRL', 590, '#fff', 30);
  });
}

// 2. 巨大機器人
export function mecha() {
  return make((g) => {
    g.fillStyle = grad(g, 0, H, [[0, '#0e1a3a'], [.6, '#254a9a'], [1, '#ff8a3c']]); g.fillRect(0, 0, W, H);
    stars(g, 60, 8, 300);
    g.fillStyle = 'rgba(255,255,255,.08)';
    for (let i = 0; i < 14; i++) { g.save(); g.translate(256, 640); g.rotate(-1.4 + i * 0.2); g.fillRect(0, -6, 700, 12); g.restore(); }
    // helmet
    g.fillStyle = '#e9edf5'; g.beginPath(); g.moveTo(150, 460); g.lineTo(150, 250); g.quadraticCurveTo(256, 130, 362, 250); g.lineTo(362, 460); g.lineTo(300, 500); g.lineTo(212, 500); g.fill();
    g.fillStyle = '#2f5fd0'; g.fillRect(150, 400, 212, 44);
    g.fillStyle = '#d63b3b'; g.beginPath(); g.moveTo(256, 100); g.lineTo(222, 200); g.lineTo(290, 200); g.fill();
    g.fillStyle = '#e5b93c'; g.beginPath(); g.moveTo(256, 60); g.lineTo(236, 140); g.lineTo(276, 140); g.fill();
    g.fillStyle = '#e5b93c'; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(256 + s * 100, 190); g.lineTo(256 + s * 190, 90); g.lineTo(256 + s * 130, 230); g.fill(); }
    g.fillStyle = '#10131c'; g.beginPath(); g.moveTo(180, 300); g.lineTo(332, 300); g.lineTo(316, 340); g.lineTo(196, 340); g.fill();
    g.fillStyle = '#7dffb2'; g.shadowColor = '#7dffb2'; g.shadowBlur = 20; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(256 + s * 20, 312); g.lineTo(256 + s * 74, 316); g.lineTo(256 + s * 66, 330); g.lineTo(256 + s * 20, 326); g.fill(); } g.shadowBlur = 0;
    g.fillStyle = '#9aa3b8'; for (let i = 0; i < 4; i++) g.fillRect(226 + i * 18, 460, 8, 36);
    g.fillStyle = '#2a2f3d'; g.fillRect(90, 520, 332, 120);
    title(g, 'GUNDAM  ZERO', 585, '#e9edf5', 30);
  });
}

// 3. 貓咪玩家
export function catGamer() {
  return make((g) => {
    g.fillStyle = grad(g, 0, H, [[0, '#1b1440'], [1, '#402070']]); g.fillRect(0, 0, W, H);
    stars(g, 100, 12, H);
    g.fillStyle = '#ffc94f'; g.beginPath(); g.arc(256, 290, 150, 0, 7); g.fill();
    g.fillStyle = '#1c1c22'; g.beginPath(); g.ellipse(256, 320, 105, 96, 0, 0, 7); g.fill();
    for (const s of [-1, 1]) { g.beginPath(); g.moveTo(256 + s * 96, 260); g.lineTo(256 + s * 92, 170); g.lineTo(256 + s * 30, 230); g.fill(); g.fillStyle = '#f0a0aa'; g.beginPath(); g.moveTo(256 + s * 80, 250); g.lineTo(256 + s * 80, 195); g.lineTo(256 + s * 46, 234); g.fill(); g.fillStyle = '#1c1c22'; }
    // headphones
    g.strokeStyle = '#ff3d94'; g.lineWidth = 16; g.beginPath(); g.arc(256, 300, 120, Math.PI * 1.02, Math.PI * 1.98); g.stroke();
    g.fillStyle = '#ff3d94'; for (const s of [-1, 1]) { g.beginPath(); g.roundRect(256 + s * 122 - 20, 290, 40, 74, 14); g.fill(); }
    for (const s of [-1, 1]) {
      g.fillStyle = '#a4ff7a'; g.beginPath(); g.ellipse(256 + s * 42, 320, 22, 26, 0, 0, 7); g.fill();
      g.fillStyle = '#111'; g.beginPath(); g.ellipse(256 + s * 42, 320, 6, 22, 0, 0, 7); g.fill();
    }
    g.fillStyle = '#f0a0aa'; g.beginPath(); g.moveTo(246, 356); g.lineTo(266, 356); g.lineTo(256, 368); g.fill();
    g.fillStyle = '#2b2b34'; g.beginPath(); g.roundRect(150, 430, 212, 80, 34); g.fill();
    g.fillStyle = '#35f0ff'; g.beginPath(); g.arc(196, 470, 14, 0, 7); g.fill(); g.fillStyle = '#ff4fb0'; g.beginPath(); g.arc(316, 462, 8, 0, 7); g.arc(336, 480, 8, 0, 7); g.fill();
    title(g, 'PLAYER  1  READY', 590, '#35f0ff', 26);
  });
}

// 4. 像素外星人
export function invader() {
  return make((g) => {
    g.fillStyle = '#0a0d1c'; g.fillRect(0, 0, W, H);
    stars(g, 70, 3, H);
    const s = [' 00     00 ', '  00   00  ', ' 000000000 ', '00 00000 00', '00000000000', '0 000000000 0'.trim(), '0 0     0 0', '   00 00   '];
    const spr = ['0010000010', '0001000100', '0011111110', '0110111011', '1111111111', '1011111101', '1010000101', '0001101100'];
    const c = 34;
    spr.forEach((row, y) => [...row].forEach((v, x) => { if (v === '1') { g.fillStyle = y < 4 ? '#7dffb2' : '#35f0ff'; g.shadowColor = g.fillStyle; g.shadowBlur = 14; g.fillRect(86 + x * c, 130 + y * c, c - 3, c - 3); } }));
    g.shadowBlur = 0;
    g.fillStyle = '#ff4fb0'; for (let i = 0; i < 6; i++) g.fillRect(70 + i * 70, 470, 40, 10);
    title(g, 'INSERT  COIN', 560, '#ffe15a', 32);
    g.fillStyle = '#7d8bb0'; g.font = '600 16px Orbitron, sans-serif'; g.fillText('HI-SCORE 999999', W / 2, 600);
  });
}

// 5. 海報：夜空下的少年與貓
export function boyCat() {
  return make((g) => {
    g.fillStyle = grad(g, 0, H, [[0, '#0f1a4a'], [.6, '#5b3fa8'], [1, '#ff9a8a']]); g.fillRect(0, 0, W, H);
    stars(g, 140, 21, 360);
    g.fillStyle = '#fff6d8'; g.beginPath(); g.arc(380, 130, 62, 0, 7); g.fill();
    g.fillStyle = 'rgba(15,10,40,.95)'; g.beginPath(); g.moveTo(0, H); g.lineTo(0, 470); for (let x = 0; x <= W; x += 24) g.lineTo(x, 470 - ((x * 7) % 9) * 9 - (x % 96 === 0 ? 30 : 0)); g.lineTo(W, H); g.fill();
    // roof
    g.fillStyle = '#120c2c'; g.beginPath(); g.moveTo(0, 520); g.lineTo(W, 470); g.lineTo(W, H); g.lineTo(0, H); g.fill();
    // boy + cat silhouette
    g.fillStyle = '#090616'; g.beginPath(); g.ellipse(190, 400, 26, 30, 0, 0, 7); g.fill();
    g.beginPath(); g.moveTo(160, 430); g.quadraticCurveTo(190, 420, 222, 430); g.lineTo(230, 520); g.lineTo(150, 520); g.fill();
    g.beginPath(); g.ellipse(300, 480, 34, 26, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(322, 452, 20, 18, 0, 0, 7); g.fill();
    g.beginPath(); g.moveTo(308, 440); g.lineTo(306, 420); g.lineTo(320, 434); g.moveTo(330, 438); g.lineTo(340, 420); g.lineTo(340, 442); g.fill();
    g.strokeStyle = '#090616'; g.lineWidth = 8; g.beginPath(); g.moveTo(268, 490); g.bezierCurveTo(230, 500, 250, 440, 224, 450); g.stroke();
    star(g, 90, 140, 16, '#fff'); star(g, 240, 80, 10, '#ffe14f');
    title(g, '星 空 之 約', 110, 'rgba(255,255,255,.9)', 30);
  });
}

// neon sign: transparent canvas, drawn as glowing outline text / shapes
export function neonCanvas(kind, color, cw = 512, ch = 512) {
  return make((g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.lineCap = g.lineJoin = 'round';
    const glow = (fn, c = color) => {
      for (const [lw, a, blur] of [[26, .18, 40], [14, .35, 22], [7, 1, 10]]) {
        g.save(); g.shadowColor = c; g.shadowBlur = blur; g.strokeStyle = c; g.globalAlpha = a; g.lineWidth = lw; fn(); g.stroke(); g.restore();
      }
      g.save(); g.strokeStyle = '#fff'; g.globalAlpha = .9; g.lineWidth = 3; fn(); g.stroke(); g.restore();
    };
    if (kind === 'cat') {                                    // cat head outline
      glow(() => {
        g.beginPath(); g.moveTo(90, 200); g.lineTo(80, 60); g.lineTo(170, 120); g.quadraticCurveTo(256, 100, 342, 120); g.lineTo(432, 60); g.lineTo(422, 200);
        g.bezierCurveTo(470, 300, 400, 420, 256, 420); g.bezierCurveTo(112, 420, 42, 300, 90, 200);
      });
      glow(() => { g.beginPath(); g.arc(190, 250, 18, 0, 7); g.moveTo(340, 250); g.arc(322, 250, 18, 0, 7); }, '#35f0ff');
      glow(() => { g.beginPath(); g.moveTo(238, 300); g.lineTo(274, 300); g.lineTo(256, 322); g.closePath(); g.moveTo(256, 322); g.lineTo(256, 340); g.moveTo(256, 340); g.quadraticCurveTo(228, 366, 204, 344); g.moveTo(256, 340); g.quadraticCurveTo(284, 366, 308, 344); }, '#ffe15a');
    } else if (kind === 'gg') {
      g.font = '800 250px Orbitron, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
      glow(() => { g.beginPath(); }); // (no path; text below)
      for (const [lw, a, blur] of [[22, .2, 40], [12, .4, 22], [5, 1, 8]]) { g.save(); g.shadowColor = color; g.shadowBlur = blur; g.strokeStyle = color; g.globalAlpha = a; g.lineWidth = lw; g.strokeText('GG', w / 2, h / 2); g.restore(); }
      g.save(); g.fillStyle = 'rgba(255,255,255,.85)'; g.fillText('GG', w / 2, h / 2); g.restore();
    } else if (kind === 'pad') {                             // game controller
      glow(() => {
        g.beginPath(); g.moveTo(130, 150); g.bezierCurveTo(200, 120, 312, 120, 382, 150); g.bezierCurveTo(440, 180, 470, 380, 420, 390);
        g.bezierCurveTo(380, 396, 350, 300, 320, 290); g.lineTo(192, 290); g.bezierCurveTo(162, 300, 132, 396, 92, 390); g.bezierCurveTo(42, 380, 72, 180, 130, 150);
      });
      glow(() => { g.beginPath(); g.moveTo(150, 205); g.lineTo(150, 255); g.moveTo(125, 230); g.lineTo(175, 230); g.moveTo(342, 200); g.arc(342, 200, 4, 0, 7); g.moveTo(372, 230); g.arc(372, 230, 4, 0, 7); g.moveTo(342, 258); g.arc(342, 258, 4, 0, 7); g.moveTo(312, 230); g.arc(312, 230, 4, 0, 7); }, '#ffe15a');
    } else if (kind === 'heart') {
      glow(() => { g.beginPath(); g.moveTo(256, 400); g.bezierCurveTo(60, 270, 90, 90, 256, 170); g.bezierCurveTo(422, 90, 452, 270, 256, 400); });
    } else if (kind === 'ps') {                              // △ ○ ✕ □
      const u = h * 0.62, cy = h / 2, step = w / 4;
      glow(() => { g.beginPath(); const cx = step * 0.5; g.moveTo(cx, cy - u / 2); g.lineTo(cx + u / 2, cy + u / 2.3); g.lineTo(cx - u / 2, cy + u / 2.3); g.closePath(); }, '#3ff0c8');
      glow(() => { g.beginPath(); g.arc(step * 1.5, cy, u / 2.1, 0, 7); }, '#ff4d6a');
      glow(() => { g.beginPath(); const cx = step * 2.5, a = u / 2.3; g.moveTo(cx - a, cy - a); g.lineTo(cx + a, cy + a); g.moveTo(cx + a, cy - a); g.lineTo(cx - a, cy + a); }, '#6aa8ff');
      glow(() => { g.beginPath(); const cx = step * 3.5, a = u / 2.2; g.rect(cx - a, cy - a, a * 2, a * 2); }, '#ff7ad8');
    } else if (kind === 'text') {
      g.font = `800 ${h * 0.55}px Orbitron, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
      for (const [lw, a, blur] of [[16, .2, 36], [9, .4, 18], [4, 1, 8]]) { g.save(); g.shadowColor = color; g.shadowBlur = blur; g.strokeStyle = color; g.globalAlpha = a; g.lineWidth = lw; g.strokeText(neonCanvas.text, w / 2, h / 2); g.restore(); }
      g.save(); g.fillStyle = 'rgba(255,255,255,.9)'; g.fillText(neonCanvas.text, w / 2, h / 2); g.restore();
    }
  }, cw, ch);
}

// night city seen through the window (transparent sky; the sky colour is a separate plane)
export function cityCanvas() {
  const r = rng(77);
  return make((g, w, h) => {
    g.clearRect(0, 0, w, h);
    for (const [layer, col, hmin, hmax, lit] of [[0, '#1b1838', 120, 300, .25], [1, '#0f0d24', 80, 380, .45], [2, '#07061a', 40, 220, .6]]) {
      for (let x = -20; x < w;) {
        const bw = 40 + r() * 80, bh = hmin + r() * (hmax - hmin), top = h - bh;
        g.fillStyle = col; g.fillRect(x, top, bw, bh);
        if (r() < .25) { g.fillRect(x + bw / 2 - 3, top - 40, 6, 40); g.fillStyle = '#ff3a4a'; g.fillRect(x + bw / 2 - 3, top - 44, 6, 6); }
        for (let yy = top + 8; yy < h - 6; yy += 12) for (let xx = x + 6; xx < x + bw - 8; xx += 10)
          if (r() < lit) { g.fillStyle = ['#ffd98a', '#9fe6ff', '#ffb0e0', '#ffe9c0'][Math.floor(r() * 4)]; g.globalAlpha = .5 + r() * .5; g.fillRect(xx, yy, 5, 6); g.globalAlpha = 1; }
        if (layer === 2 && r() < .2) { g.fillStyle = r() < .5 ? '#ff4fb0' : '#35f0ff'; g.fillRect(x + 6, top + 20, bw - 12, 14); }
        x += bw + 2 + r() * 10;
      }
    }
  }, 1024, 512);
}

export function textCanvas(text, { w = 512, h = 128, bg = '#0b0b10', color = '#ff3a4a', font = 'Orbitron, sans-serif', weight = 800, glow = true } = {}) {
  return make((g) => {
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.font = `${weight} ${h * 0.62}px ${font}`; g.textAlign = 'center'; g.textBaseline = 'middle';
    if (glow) { g.shadowColor = color; g.shadowBlur = 18; }
    g.fillStyle = color; g.fillText(text, w / 2, h / 2 + 4);
  }, w, h);
}

export function neonSign(kind, color, size = 1, aspect = 1, text = '') {
  neonCanvas.text = text;
  const tex = new THREE.CanvasTexture(neonCanvas(kind, color, 512 * aspect, 512)); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(size * aspect, size),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, depthWrite: false }));
  m.renderOrder = 4;
  return m;
}

export function artMesh(canvas, w, h, frameMat, opts = {}) {
  const tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const g = new THREE.Group();
  const bd = opts.border ?? 0.03;
  const mat = new THREE.Mesh(new THREE.BoxGeometry(w + bd * 2, h + bd * 2, 0.02), new THREE.MeshStandardMaterial({ color: '#15161a', roughness: 0.6 }));
  const pic = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55, emissive: '#ffffff', emissiveMap: tex, emissiveIntensity: opts.glow ?? 0.18 }));
  pic.position.z = 0.0115;
  const t = 0.03, fw = w + bd * 2 + t * 2, fh = h + bd * 2 + t * 2;
  const parts = [[fw, t, 0, (fh - t) / 2], [fw, t, 0, -(fh - t) / 2], [t, fh, (fw - t) / 2, 0], [t, fh, -(fw - t) / 2, 0]];
  parts.forEach(([pw, ph, x, y]) => { const m = new THREE.Mesh(new THREE.BoxGeometry(pw, ph, 0.045), frameMat); m.position.set(x, y, 0.01); m.castShadow = m.receiveShadow = true; g.add(m); });
  mat.receiveShadow = pic.receiveShadow = true; g.add(mat, pic);
  return g;
}
