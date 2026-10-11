import * as THREE from 'three';

function rng(seed) {
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

function canvasTex(w, h, draw, { repeat = [1, 1], color = true, wrap = true } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  if (wrap) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(...repeat);
  t.anisotropy = 8;
  if (color) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const gray = (v) => `rgb(${v | 0},${v | 0},${v | 0})`;

// ---- procedural textures (near-white so material.color tints them) ----
function plankTexture() {
  const r = rng(7);
  return canvasTex(1024, 1024, (g, w, h) => {
    const rows = 10, ph = h / rows;
    for (let i = 0; i < rows; i++) {
      const y = i * ph; let x = -r() * w * 0.6;
      while (x < w) {
        const len = w * (0.5 + r() * 0.5), base = 205 + r() * 40;
        g.fillStyle = gray(base); g.fillRect(x, y, len, ph);
        for (let k = 0; k < 26; k++) {
          const yy = y + r() * ph; g.strokeStyle = `rgba(60,40,20,${0.03 + r() * 0.06})`; g.lineWidth = 0.6 + r() * 1.6;
          g.beginPath(); g.moveTo(x, yy); g.bezierCurveTo(x + len * .3, yy + (r() - .5) * 6, x + len * .6, yy + (r() - .5) * 6, x + len, yy); g.stroke();
        }
        g.fillStyle = 'rgba(30,20,10,.55)'; g.fillRect(x, y, 2, ph);
        x += len;
      }
      g.fillStyle = 'rgba(30,20,10,.6)'; g.fillRect(0, y, w, 2.5);
    }
  });
}
function grainTexture() {
  const r = rng(21);
  return canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = gray(232); g.fillRect(0, 0, w, h);
    for (let i = 0; i < 120; i++) {
      const x = r() * w; g.strokeStyle = `rgba(40,30,20,${0.03 + r() * 0.07})`; g.lineWidth = 0.6 + r() * 2;
      g.beginPath(); g.moveTo(x, 0); g.bezierCurveTo(x + (r() - .5) * 30, h * .33, x + (r() - .5) * 30, h * .66, x + (r() - .5) * 14, h); g.stroke();
    }
  });
}
function plasterTexture() {
  const r = rng(3);
  return canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = gray(240); g.fillRect(0, 0, w, h);
    for (let i = 0; i < 1600; i++) {
      const v = 205 + r() * 50; g.fillStyle = `rgba(${v},${v},${v},${0.08 + r() * 0.12})`;
      g.beginPath(); g.arc(r() * w, r() * h, 2 + r() * 26, 0, 7); g.fill();
    }
  });
}
function linenTexture(size = 256) {
  const r = rng(11);
  return canvasTex(size, size, (g, w, h) => {
    g.fillStyle = gray(232); g.fillRect(0, 0, w, h);
    for (let i = 0; i < h; i += 2) { g.fillStyle = `rgba(0,0,0,${r() * 0.07})`; g.fillRect(0, i, w, 1); }
    for (let i = 0; i < w; i += 2) { g.fillStyle = `rgba(0,0,0,${r() * 0.07})`; g.fillRect(i, 0, 1, h); }
    for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(255,255,255,${r() * 0.12})`; g.fillRect(r() * w, r() * h, 1 + r() * 6, 1); }
  }, { repeat: [3, 3] });
}
// gamer carpet: hex grid + circuit lines
function carpetTexture() {
  const r = rng(5);
  return canvasTex(512, 512, (g, w, h) => {
    g.fillStyle = gray(232); g.fillRect(0, 0, w, h);
    const R = 34, dx = R * 1.5, dy = R * Math.sqrt(3);
    g.strokeStyle = 'rgba(0,0,0,.22)'; g.lineWidth = 3;
    for (let cx = -R, col = 0; cx < w + R; cx += dx, col++) for (let cy = (col % 2 ? dy / 2 : 0) - dy; cy < h + dy; cy += dy) {
      g.beginPath(); for (let i = 0; i < 6; i++) { const a = Math.PI / 3 * i; g.lineTo(cx + R * 0.92 * Math.cos(a), cy + R * 0.92 * Math.sin(a)); } g.closePath(); g.stroke();
      if (r() < 0.16) { g.fillStyle = 'rgba(0,0,0,.14)'; g.fill(); }
    }
    for (let i = 0; i < 6000; i++) { g.fillStyle = `rgba(0,0,0,${r() * 0.05})`; g.fillRect(r() * w, r() * h, 1.5, 1.5); }
  }, { repeat: [2, 2] });
}
function metalTexture() {
  const r = rng(9);
  return canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = gray(226); g.fillRect(0, 0, w, h);
    for (let i = 0; i < 420; i++) { g.fillStyle = `rgba(${r() < .5 ? 0 : 255},${r() < .5 ? 0 : 255},255,0)`; g.strokeStyle = `rgba(255,255,255,${r() * 0.12})`; g.lineWidth = 1;
      const y = r() * h; g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  });
}

// ---- screens (what's playing on the monitors) ----
function screenTex(kind) {
  const r = rng(kind.length * 31 + 1);
  return canvasTex(512, 288, (g, w, h) => {
    if (kind === 'game') {                                     // cyberpunk city shooter
      const sky = g.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, '#1a0b3a'); sky.addColorStop(.55, '#ff3d94'); sky.addColorStop(1, '#ffb86b');
      g.fillStyle = sky; g.fillRect(0, 0, w, h);
      g.fillStyle = '#ffe9a8'; g.beginPath(); g.arc(360, 120, 46, 0, 7); g.fill();
      for (let i = 0; i < 26; i++) {
        const bw = 18 + r() * 30, bh = 50 + r() * 130, bx = i * 21 - 10;
        g.fillStyle = `rgb(${18 + r() * 24},${10 + r() * 14},${44 + r() * 30})`; g.fillRect(bx, h - bh - 30, bw, bh + 30);
        for (let k = 0; k < 14; k++) { g.fillStyle = r() < .5 ? '#27f0ff' : '#ff4fa8'; g.fillRect(bx + 3 + r() * (bw - 8), h - bh - 20 + r() * bh, 2.5, 3.5); }
      }
      g.fillStyle = '#0a0716'; g.fillRect(0, h - 34, w, 34);
      g.strokeStyle = '#7dffb2'; g.lineWidth = 2; g.beginPath(); g.arc(256, 140, 16, 0, 7); g.moveTo(256, 112); g.lineTo(256, 126); g.moveTo(256, 154); g.lineTo(256, 168); g.moveTo(228, 140); g.lineTo(242, 140); g.moveTo(270, 140); g.lineTo(284, 140); g.stroke();
      g.fillStyle = '#ff3d5a'; g.fillRect(16, h - 24, 130, 10); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(16, h - 24, 130, 3);
      g.fillStyle = '#27f0ff'; g.font = '700 16px Orbitron, sans-serif'; g.fillText('VICTORY  24 / 3', 340, 28);
    } else if (kind === 'anime') {                             // anime wallpaper
      const sky = g.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, '#5b6cff'); sky.addColorStop(.6, '#ffa0d0'); sky.addColorStop(1, '#ffe2b8');
      g.fillStyle = sky; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(255,255,255,${.3 + r() * .6})`; g.fillRect(r() * w, r() * 110, 2, 2); }
      for (let i = 0; i < 3; i++) { g.fillStyle = `rgba(255,255,255,${.5 - i * .12})`; g.beginPath(); g.ellipse(90 + i * 150, 170 + i * 8, 90, 20, 0, 0, 7); g.fill(); }
      g.fillStyle = '#26214a'; g.beginPath(); g.moveTo(0, h); g.lineTo(0, 220); for (let x = 0; x <= w; x += 32) g.lineTo(x, 214 + Math.sin(x * .03) * 10 + r() * 6); g.lineTo(w, h); g.fill();
      // girl silhouette with twin tails
      g.fillStyle = '#1c1740'; g.beginPath(); g.ellipse(256, 132, 22, 26, 0, 0, 7); g.fill();
      g.beginPath(); g.moveTo(228, 150); g.quadraticCurveTo(256, 148, 284, 150); g.lineTo(300, 260); g.lineTo(212, 260); g.fill();
      for (const s of [-1, 1]) { g.beginPath(); g.moveTo(256 + s * 20, 116); g.quadraticCurveTo(256 + s * 70, 130, 256 + s * 52, 210); g.quadraticCurveTo(256 + s * 40, 150, 256 + s * 20, 128); g.fill(); }
      g.fillStyle = '#fff'; g.font = '700 22px "Noto Sans TC", sans-serif'; g.textAlign = 'right'; g.fillText('星空の約束', w - 20, 40);
    } else if (kind === 'ps') {                                // console home screen
      const bg = g.createLinearGradient(0, 0, w, h); bg.addColorStop(0, '#0b1446'); bg.addColorStop(.5, '#3a1f8a'); bg.addColorStop(1, '#0a0a2a');
      g.fillStyle = bg; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 6; i++) { const rg = g.createRadialGradient(r() * w, r() * h * .6, 0, r() * w, r() * h * .6, 120); rg.addColorStop(0, `rgba(${150 + r() * 100},${80 + r() * 60},255,.35)`); rg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = rg; g.fillRect(0, 0, w, h); }
      for (let i = 0; i < 160; i++) { g.fillStyle = `rgba(255,255,255,${r()})`; g.fillRect(r() * w, r() * h, 1.2, 1.2); }
      g.fillStyle = '#e8ecff'; g.beginPath(); g.arc(330, 96, 42, 0, 7); g.fill();                         // astronaut
      g.fillStyle = '#2b2f6a'; g.beginPath(); g.ellipse(338, 94, 26, 20, 0, 0, 7); g.fill();
      g.fillStyle = 'rgba(160,200,255,.6)'; g.beginPath(); g.ellipse(344, 88, 8, 5, -.4, 0, 7); g.fill();
      g.fillStyle = '#dfe4f7'; g.beginPath(); g.roundRect(292, 132, 80, 70, 20); g.fill();
      g.fillStyle = '#fff'; g.font = '700 15px sans-serif'; g.fillText('PS5', 18, 26);
      g.font = '12px sans-serif'; g.fillStyle = 'rgba(255,255,255,.75)'; g.fillText('遊戲   媒體', 70, 26);
      const cols = ['#ff5a7a', '#3fd0ff', '#ffc94f', '#8dff8d', '#b98cff', '#ff8a2a', '#5a7aff'];
      for (let i = 0; i < 7; i++) { const s = i ? 44 : 60, x = 18 + (i ? 70 + (i - 1) * 50 : 0), y = i ? 212 : 196;
        const gr = g.createLinearGradient(x, y, x + s, y + s); gr.addColorStop(0, cols[i]); gr.addColorStop(1, '#1a1030'); g.fillStyle = gr; g.beginPath(); g.roundRect(x, y, s, s, 6); g.fill();
        if (!i) { g.strokeStyle = '#fff'; g.lineWidth = 2; g.stroke(); } }
      g.fillStyle = '#fff'; g.font = '700 18px Orbitron, sans-serif'; g.fillText('STAR  VOYAGER', 18, 180);
    } else if (kind === 'obs') {                               // streaming software
      g.fillStyle = '#16171d'; g.fillRect(0, 0, w, h);
      const pv = g.createLinearGradient(0, 10, 0, 180); pv.addColorStop(0, '#4b2bd0'); pv.addColorStop(1, '#ff4fa8'); g.fillStyle = pv; g.fillRect(8, 8, 330, 186);
      g.fillStyle = '#1c1740'; g.beginPath(); g.ellipse(250, 150, 40, 46, 0, 0, 7); g.fill(); g.fillRect(212, 170, 80, 30);
      g.fillStyle = '#ff2a3a'; g.beginPath(); g.roundRect(14, 14, 50, 18, 4); g.fill(); g.fillStyle = '#fff'; g.font = '700 11px sans-serif'; g.fillText('LIVE', 25, 27);
      for (let i = 0; i < 8; i++) { g.fillStyle = i === 2 ? '#3a3f9a' : '#23252e'; g.fillRect(348, 8 + i * 23, 156, 19); g.fillStyle = '#aab'; g.fillRect(356, 15 + i * 23, 60 + r() * 60, 5); }
      for (let i = 0; i < 4; i++) { g.fillStyle = '#23252e'; g.fillRect(8, 204 + i * 19, 330, 14); const lv = 80 + r() * 200; const gr = g.createLinearGradient(12, 0, 330, 0); gr.addColorStop(0, '#34d058'); gr.addColorStop(.7, '#ffd24f'); gr.addColorStop(1, '#ff3d3d'); g.fillStyle = gr; g.fillRect(12, 208 + i * 19, lv, 6); }
      g.fillStyle = '#9146ff'; g.fillRect(348, 200, 156, 36); g.fillStyle = '#fff'; g.font = '700 13px sans-serif'; g.fillText('結束直播', 396, 223);
      g.fillStyle = '#2d6cdf'; g.fillRect(348, 244, 156, 34); g.fillStyle = '#fff'; g.fillText('錄影中 01:24:07', 370, 266);
    } else if (kind === 'waifu') {                             // silver-haired anime girl wallpaper
      const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#2a1c5a'); bg.addColorStop(1, '#b06ad8'); g.fillStyle = bg; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 70; i++) { g.fillStyle = `rgba(255,220,255,${r() * .8})`; g.beginPath(); g.arc(r() * w, r() * h, r() * 2.2, 0, 7); g.fill(); }
      g.fillStyle = '#eef0ff'; g.beginPath(); g.moveTo(186, 300); g.bezierCurveTo(150, 120, 190, 40, 256, 40); g.bezierCurveTo(322, 40, 362, 120, 326, 300); g.fill();
      g.fillStyle = '#ffe6da'; g.beginPath(); g.ellipse(256, 128, 50, 58, 0, 0, 7); g.fill();
      g.fillStyle = '#f4f5ff'; g.beginPath(); g.moveTo(204, 120); g.bezierCurveTo(206, 50, 306, 50, 308, 120); g.bezierCurveTo(290, 90, 270, 84, 256, 96); g.bezierCurveTo(240, 84, 222, 90, 204, 120); g.fill();
      for (const sx of [-1, 1]) { g.fillStyle = '#fff'; g.beginPath(); g.ellipse(256 + sx * 21, 134, 11, 15, 0, 0, 7); g.fill(); g.fillStyle = '#a24bd8'; g.beginPath(); g.ellipse(256 + sx * 21, 137, 9, 12, 0, 0, 7); g.fill(); g.fillStyle = '#fff'; g.beginPath(); g.arc(256 + sx * 21 - 3, 131, 3, 0, 7); g.fill();
        g.fillStyle = 'rgba(255,120,150,.4)'; g.beginPath(); g.ellipse(256 + sx * 34, 156, 8, 4, 0, 0, 7); g.fill(); }
      g.fillStyle = '#5a3a9a'; g.beginPath(); g.moveTo(206, 200); g.quadraticCurveTo(256, 186, 306, 200); g.lineTo(330, h); g.lineTo(182, h); g.fill();
      g.fillStyle = '#ff9ad8'; g.beginPath(); g.moveTo(232, 60); g.lineTo(246, 44); g.lineTo(256, 62); g.lineTo(266, 44); g.lineTo(280, 60); g.fill();
    } else {                                                   // stream / chat
      g.fillStyle = '#0e0f14'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#18191f'; g.fillRect(0, 0, w, 26); g.fillStyle = '#9146ff'; g.beginPath(); g.arc(14, 13, 6, 0, 7); g.fill();
      g.fillStyle = '#bbb'; g.font = '11px sans-serif'; g.fillText('LIVE · 12.4K', 28, 17);
      g.fillStyle = '#2b2440'; g.fillRect(12, 38, 300, 168); g.fillStyle = '#7a5cff'; g.fillRect(12, 38, 300, 168);
      const gr = g.createLinearGradient(12, 38, 312, 206); gr.addColorStop(0, '#5b3bff'); gr.addColorStop(1, '#ff4fa8'); g.fillStyle = gr; g.fillRect(12, 38, 300, 168);
      g.fillStyle = 'rgba(255,255,255,.85)'; g.beginPath(); g.moveTo(140, 90); g.lineTo(200, 122); g.lineTo(140, 154); g.fill();
      for (let i = 0; i < 9; i++) { const y = 42 + i * 24; g.fillStyle = ['#ff6b9d', '#4fd8ff', '#ffd24f', '#8dff8d'][i % 4]; g.fillRect(328, y, 46, 7); g.fillStyle = '#c9c9d2'; g.fillRect(380, y, 40 + r() * 90, 7); }
      g.fillStyle = '#9146ff'; g.fillRect(12, 222, 96, 22); g.fillStyle = '#fff'; g.font = '700 12px sans-serif'; g.fillText('追蹤中', 34, 237);
    }
  }, { wrap: false });
}

// ---- palette: what the user can choose per material slot ----
export const PALETTE = {
  floor: { label: '地板', items: [
    ['深灰木', '#4a4643'], ['淺橡木', '#c9a878'], ['水泥灰', '#a9a7a3'], ['黑胡桃', '#3a2a22'], ['霧藍灰', '#5b6472']] },
  wall: { label: '牆面', items: [
    ['深空灰', '#2b2e38'], ['霧灰', '#c9c7cf'], ['奶霜粉', '#efd9dc'], ['夜藍', '#1f2a44'], ['暗紫夜', '#3a2a4f']] },
  fabric: { label: '寢具/織品', items: [
    ['石墨灰', '#8e8e96'], ['奶油白', '#eeeae4'], ['櫻粉', '#e3b5c2'], ['深藍', '#33405e'], ['墨黑', '#2b2b30']] },
  accent: { label: 'RGB 色', items: [
    ['電光紫', '#a65cff'], ['冰青', '#20e0e8'], ['桃紅', '#ff3d94'], ['螢光綠', '#6aff5c'], ['琥珀橘', '#ff8a2a']] },
  wood: { label: '桌櫃木作', items: [
    ['霧黑', '#2a2a2e'], ['白橡', '#dccdb0'], ['胡桃', '#6c4630'], ['灰木', '#7a7a7c'], ['純白', '#f1f1ee']] },
  metal: { label: '金屬/框', items: [
    ['黑鋼', '#1e1f23'], ['鋁銀', '#b9bcc3'], ['玫瑰金', '#c99a8a'], ['槍灰', '#484b52'], ['珍珠白', '#e8e8ea']] },
  rug: { label: '地毯', items: [
    ['墨黑', '#2a2a30'], ['灰', '#75757c'], ['粉', '#d8a4b6'], ['深紫', '#3c2c5c'], ['深藍', '#284066']] },
};

export function createMaterials() {
  const std = (o) => new THREE.MeshStandardMaterial(o);
  const basic = (o) => new THREE.MeshBasicMaterial({ toneMapped: false, ...o });
  const fur = (c) => std({ color: c, roughness: 1 });
  const M = {
    floor: std({ map: plankTexture(), roughness: 0.5, metalness: 0 }),
    wall: std({ map: plasterTexture(), bumpMap: plasterTexture(), bumpScale: 0.5, roughness: 0.95 }),
    wallAccent: std({ map: plasterTexture(), roughness: 0.95 }),
    wood: std({ map: grainTexture(), roughness: 0.55 }),
    fabric: std({ map: linenTexture(), bumpMap: linenTexture(), bumpScale: 0.5, roughness: 0.95 }),
    accent: std({ map: linenTexture(), roughness: 0.85 }),
    metal: std({ map: metalTexture(), roughness: 0.35, metalness: 0.75 }),
    rug: std({ map: carpetTexture(), bumpMap: carpetTexture(), bumpScale: 0.8, roughness: 1 }),
    dark: std({ color: '#17181c', roughness: 0.45, metalness: 0.35 }),
    black: std({ color: '#0d0e11', roughness: 0.6 }),
    plastic: std({ color: '#f2f2f4', roughness: 0.35 }),
    ceramic: std({ color: '#efe9de', roughness: 0.3 }),
    leaf: std({ color: '#3f7f45', roughness: 0.8, flatShading: true }),
    leaf2: std({ color: '#6fb05a', roughness: 0.8, flatShading: true }),
    soil: std({ color: '#2c2521', roughness: 1 }),
    terracotta: std({ color: '#b8674a', roughness: 0.9 }),
    velvet: new THREE.MeshPhysicalMaterial({ color: '#1d1a26', roughness: 0.85, sheen: 1, sheenRoughness: 0.35,
      sheenColor: new THREE.Color('#8a5cff'), side: THREE.DoubleSide }),
    blackout: std({ color: '#25242c', roughness: 1, side: THREE.DoubleSide }),
    glass: std({ color: '#cfe4f2', roughness: 0.05, transparent: true, opacity: 0.1, depthWrite: false,
      emissive: new THREE.Color('#9ccaf2'), emissiveIntensity: 0.5 }),
    vitrine: std({ color: '#dff3ff', roughness: 0.05, transparent: true, opacity: 0.16, depthWrite: false }),
    paint: std({ color: '#f4f0e6', roughness: 0.8 }),
    plinth: std({ color: '#0c0f14', roughness: 0.55, metalness: 0.2 }),
    ground: std({ color: '#141b23', roughness: 0.75 }),
    // light emitters (not affected by tone mapping)
    led: basic({ color: '#a65cff' }),                 // follows the accent slot
    rgb: basic({ color: '#ff3d94' }),                 // cycles through hues
    neonPink: basic({ color: '#ff4fb0' }),
    neonCyan: basic({ color: '#35f0ff' }),
    neonYellow: basic({ color: '#ffe15a' }),
    white: basic({ color: '#ffffff' }),
    // monitor content
    scrGame: basic({ map: screenTex('game') }),
    scrAnime: basic({ map: screenTex('anime') }),
    scrChat: basic({ map: screenTex('chat') }),
    scrPS: basic({ map: screenTex('ps') }),
    scrOBS: basic({ map: screenTex('obs') }),
    scrWaifu: basic({ map: screenTex('waifu') }),
    // drinks + snacks
    canRed: std({ color: '#d7263d', roughness: 0.3, metalness: 0.5 }), canBlue: std({ color: '#2459d6', roughness: 0.3, metalness: 0.5 }),
    canGreen: std({ color: '#35b24a', roughness: 0.3, metalness: 0.5 }), canYellow: std({ color: '#f2c230', roughness: 0.3, metalness: 0.5 }),
    canPurple: std({ color: '#7b3fd6', roughness: 0.3, metalness: 0.5 }), canOrange: std({ color: '#ff7a1a', roughness: 0.3, metalness: 0.5 }),
    cardboard: std({ color: '#b98a5a', roughness: 0.9 }), pizza: std({ color: '#e7a948', roughness: 0.8 }), popcorn: std({ color: '#f6e7b0', roughness: 0.9 }),
    fridgeIn: basic({ color: '#b6e4ff' }),
    bulb: std({ color: '#ffe2b8', emissive: new THREE.Color('#ffb866'), emissiveIntensity: 1.4 }),
    recRed: basic({ color: '#ff2a3a' }),
    skyBack: new THREE.MeshBasicMaterial({ color: '#070b16' }),
    stem: std({ color: '#3f6b36', roughness: 0.8 }),
    // cats
    catOrange: fur('#d9873c'), catCream: fur('#f1dfc0'), catBlack: fur('#1f1f24'), catWhite: fur('#f4f1ec'),
    catGray: fur('#8b8f9a'), catPink: std({ color: '#f0a0aa', roughness: 0.8 }),
    eyeGreen: basic({ color: '#a4ff7a' }), eyeAmber: basic({ color: '#ffd24a' }), eyeShut: std({ color: '#2a2422', roughness: 1 }),
    // figures
    skin: std({ color: '#f6d9c4', roughness: 0.6 }),
    hairPink: std({ color: '#f57fb5', roughness: 0.5 }), hairBlue: std({ color: '#5aa9ff', roughness: 0.5 }),
    hairSilver: std({ color: '#d8dbe6', roughness: 0.5 }), hairBlack: std({ color: '#25232b', roughness: 0.5 }),
    outfitRed: std({ color: '#d63b4b', roughness: 0.6 }), outfitWhite: std({ color: '#f1f1f5', roughness: 0.6 }),
    outfitNavy: std({ color: '#2b3a67', roughness: 0.6 }), outfitYellow: std({ color: '#f2c14e', roughness: 0.6 }),
    mecha: std({ color: '#e8eaf0', roughness: 0.35, metalness: 0.1 }), mechaBlue: std({ color: '#2f5fd0', roughness: 0.4 }),
    mechaRed: std({ color: '#d63b3b', roughness: 0.4 }), mechaGold: std({ color: '#e5b93c', roughness: 0.3, metalness: 0.6 }),
    // clothes
    clothA: std({ color: '#e8e1d6', roughness: 1 }), clothB: std({ color: '#2b2b30', roughness: 1 }),
    clothC: std({ color: '#c96a8c', roughness: 1 }), clothD: std({ color: '#3f5f9a', roughness: 1 }),
    clothE: std({ color: '#7f9a72', roughness: 1 }), clothF: std({ color: '#d8b46a', roughness: 1 }),
  };
  return M;
}
