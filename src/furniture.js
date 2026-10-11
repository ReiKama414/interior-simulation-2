import * as THREE from 'three';
import { add, box, cyl, sph, cone, torus, tube, grp, plane, rng, pad, can, CANS, catSit, catCurl, catStand, figure, figureRow, books, plant, monitor } from './props.js';
import { animeGirl, textCanvas } from './art.js';

/* ---------------------------------------------------------------- glass display cabinet */
function vitrine(g, M, glow, w, h, d, shelves, fill) {
  box(g, M.black, w, 0.06, d, 0, 0.03, 0, 0.006);                                   // plinth
  box(g, M.black, w, 0.04, d, 0, h - 0.02, 0, 0.006);                                // top
  box(g, M.black, 0.03, h, d, -w / 2 + 0.015, h / 2, 0, 0.004); box(g, M.black, 0.03, h, d, w / 2 - 0.015, h / 2, 0, 0.004);
  box(g, M.dark, w - 0.06, h - 0.1, 0.015, 0, h / 2, -d / 2 + 0.012, 0.002);           // back panel
  shelves.forEach((y, i) => {
    box(g, M.vitrine, w - 0.06, 0.012, d - 0.04, 0, y, 0.005, 0.002);
    box(g, M.led, w - 0.08, 0.01, 0.012, 0, y - 0.02, d / 2 - 0.05, 0.002);
    fill(g, y + 0.006, i);
  });
  box(g, M.led, w - 0.08, 0.01, 0.012, 0, h - 0.05, d / 2 - 0.05, 0.002);
  for (const sx of [-1, 1]) {                                                       // two glass doors
    const door = box(g, M.vitrine, w / 2 - 0.035, h - 0.1, 0.01, sx * (w / 4 - 0.005), h / 2, d / 2 - 0.008, 0.002); door.renderOrder = 2;
    box(g, M.black, 0.015, h - 0.1, 0.02, sx * 0.012, h / 2, d / 2 - 0.006, 0.003);
    box(g, M.metal, 0.012, 0.22, 0.02, sx * 0.04, h * 0.5, d / 2 + 0.006, 0.004);
  }
  const l = new THREE.PointLight('#c9a6ff', 0, 2.6, 2); l.position.set(0, h * 0.6, d / 2 + 0.1); g.add(l); glow.push({ light: l, base: 1.6 });
}

// ---------- the pieces (origin = floor centre, front faces +z) ----------
export function createFurniture(M, lamps, glow, tickers) {
  const lamp = (g, x, y, z, intensity, color = '#ffb866', dist = 9) => {
    const l = new THREE.PointLight(color, 0, dist, 2); l.position.set(x, y, z); g.add(l);
    lamps.push({ light: l, base: intensity }); return l;
  };
  const glowLight = (g, x, y, z, intensity, color, dist = 4, follow = false) => {
    const l = new THREE.PointLight(color, 0, dist, 2); l.position.set(x, y, z); g.add(l); glow.push({ light: l, base: intensity, follow }); return l;
  };
  const cans = CANS(M);
  const snacks = [M.canRed, M.canYellow, M.canBlue, M.canGreen, M.canOrange, M.canPurple, M.clothC];

  const defs = [];
  const def = (key, name, w, d, build, pos, rot = 0, opts = {}) => defs.push({ key, name, w, d, build, pos, rot, ...opts });

  /* =================================================================== PS5 LOUNGE */
  def('tv', 'PS5 大螢幕電視櫃', 2.6, 0.5, (g) => {
    // console carcass (open middle bay)
    box(g, M.black, 2.5, 0.04, 0.4, 0, 0.02, 0, 0.004);
    box(g, M.wood, 2.6, 0.04, 0.46, 0, 0.06, 0, 0.006);
    box(g, M.wood, 2.6, 0.04, 0.46, 0, 0.42, 0, 0.006);
    for (const sx of [-1, 1]) { box(g, M.wood, 0.04, 0.34, 0.46, sx * 1.28, 0.24, 0, 0.004); box(g, M.wood, 0.03, 0.34, 0.44, sx * 0.6, 0.24, 0, 0.004); }
    box(g, M.black, 2.54, 0.34, 0.02, 0, 0.24, -0.215, 0.003);
    for (const sx of [-1, 1]) { box(g, M.wood, 0.64, 0.32, 0.02, sx * 0.94, 0.24, 0.225, 0.005); box(g, M.metal, 0.26, 0.012, 0.014, sx * 0.94, 0.36, 0.24, 0.004); }
    box(g, M.wood, 1.17, 0.02, 0.42, 0, 0.24, 0, 0.004);
    box(g, M.led, 1.12, 0.008, 0.01, 0, 0.395, 0.19, 0.002); box(g, M.led, 2.46, 0.01, 0.01, 0, 0.004, 0.19, 0.002);
    for (let i = 0; i < 16; i++) box(g, [M.canRed, M.canBlue, M.black, M.plastic, M.canPurple, M.canYellow][i % 6], 0.016, 0.16 + (i % 3) * 0.01, 0.13, -0.5 + i * 0.024, 0.335 + (i % 3) * 0.005, 0.02, 0.003);
    box(g, M.plastic, 0.24, 0.1, 0.15, 0.3, 0.13, 0.02, 0.04);                                           // VR headset
    box(g, M.black, 0.24, 0.03, 0.1, -0.3, 0.095, 0.02, 0.01);                                          // charging dock
    pad(g, M, -0.36, 0.11, 0.02, 0.2); pad(g, M, -0.22, 0.11, 0.03, -0.1);
    // on top: PS5 standing, soundbar, controller, figure, plant
    const ps = grp(g, -1.0, 0.44, 0);
    box(ps, M.plastic, 0.03, 0.4, 0.24, -0.04, 0.2, 0, 0.03); box(ps, M.black, 0.05, 0.38, 0.17, 0, 0.19, 0, 0.01); box(ps, M.plastic, 0.03, 0.4, 0.24, 0.04, 0.2, 0, 0.03);
    box(ps, M.neonCyan, 0.004, 0.3, 0.004, -0.026, 0.2, 0.11, 0.001); box(ps, M.neonCyan, 0.004, 0.3, 0.004, 0.026, 0.2, 0.11, 0.001);
    box(g, M.black, 1.0, 0.07, 0.1, 0, 0.475, 0.12, 0.02);
    pad(g, M, 0.6, 0.44, 0.1, 0.4, M.black);
    figure(g, M, 'mecha', { x: 1.12, y: 0.44, z: 0.02, s: 1.2, ry: -0.3 });
    plant(g, M, { kind: 'bush', x: 0.85, y: 0.44, z: -0.06, s: 0.45, pot: M.black, seed: 21 });
    // wall TV with bias lighting
    box(g, M.black, 2.2, 1.26, 0.05, 0, 1.45, -0.19, 0.01);
    plane(g, M.scrPS, 2.16, 1.21, 0, 1.45, -0.164);
    box(g, M.led, 2.26, 1.32, 0.005, 0, 1.45, -0.235, 0.004);
    glowLight(g, 0, 1.45, 0.25, 3, '#a65cff', 4.5, true);
    // floating shelf above TV
    box(g, M.wood, 2.1, 0.035, 0.22, 0, 2.36, -0.14, 0.006);
    box(g, M.led, 2.0, 0.008, 0.008, 0, 2.338, -0.04, 0.001);
    figureRow(g, M, -0.95, 0.55, 2.3775, -0.14, 11, 1.05);
    plant(g, M, { kind: 'hang', x: 0.8, y: 2.3775, z: -0.13, seed: 5 });
  }, [-4.75, 0.0], 1);

  def('sofa', 'L 型沙發 (黑貓)', 2.6, 1.7, (g) => {
    // main run: x -1.3..1.3, z -0.85..0.1 · chaise: x 0.4..1.3, z 0.1..0.85
    for (const [x, z] of [[-1.22, -0.78], [1.22, -0.78], [-1.22, 0.04], [1.22, 0.78], [0.47, 0.78]]) cyl(g, M.black, 0.025, 0.02, 0.06, x, 0.03, z, 10);
    box(g, M.clothB, 2.6, 0.24, 0.95, 0, 0.18, -0.375, 0.04);
    box(g, M.clothB, 0.9, 0.24, 0.75, 0.85, 0.18, 0.475, 0.04);
    for (const x of [-0.72, 0.03]) box(g, M.clothB, 0.74, 0.14, 0.72, x, 0.37, -0.25, 0.06);
    box(g, M.clothB, 0.88, 0.14, 1.45, 0.85, 0.37, 0.115, 0.06);
    box(g, M.clothB, 2.6, 0.48, 0.22, 0, 0.5, -0.74, 0.05);
    for (const x of [-0.72, 0.03, 0.85]) { const b = box(g, M.clothB, 0.74, 0.38, 0.16, x, 0.62, -0.56, 0.07); b.rotation.x = -0.12;
      for (const dy of [-0.08, 0.08]) for (const dx of [-0.18, 0, 0.18]) sph(b, M.black, 0.012, dx, dy, 0.08, 1, 1, 0.4); }
    box(g, M.clothB, 0.2, 0.52, 0.95, -1.2, 0.3, -0.375, 0.07);
    const p1 = box(g, M.accent, 0.4, 0.4, 0.12, -0.85, 0.6, -0.42, 0.06); p1.rotation.set(-0.3, 0.2, 0.08);
    const p2 = box(g, M.plastic, 0.36, 0.36, 0.11, 0.25, 0.58, -0.44, 0.06); p2.rotation.set(-0.3, -0.15, -0.1);
    box(g, M.accent, 0.5, 0.04, 0.95, -1.2, 0.575, -0.3, 0.02);                                           // blanket over the arm
    box(g, M.accent, 0.5, 0.3, 0.03, -1.2, 0.43, 0.17, 0.01);
    catSit(g, M, { fur: M.catBlack, eye: M.eyeAmber, s: 1, x: 0.9, y: 0.44, z: -0.3, ry: -0.3 }, tickers);
    pad(g, M, 0.75, 0.44, 0.45, 0.8);
  }, [-1.3, 0.3], 3);

  def('coffee', '茶几 (披薩 + 手把)', 1.4, 0.75, (g) => {
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(g, M.black, 0.04, 0.4, 0.04, sx * 0.66, 0.2, sz * 0.33, 0.006);
    box(g, M.wood, 1.4, 0.04, 0.75, 0, 0.42, 0, 0.01);
    box(g, M.wood, 1.3, 0.025, 0.65, 0, 0.12, 0, 0.006);
    box(g, M.led, 1.34, 0.01, 0.01, 0, 0.395, 0.36, 0.002); box(g, M.led, 1.34, 0.01, 0.01, 0, 0.395, -0.36, 0.002);
    const T = 0.44;
    // pizza box (open) with slices
    box(g, M.cardboard, 0.36, 0.035, 0.36, -0.38, T + 0.018, 0.06, 0.005);
    const lid = box(g, M.cardboard, 0.36, 0.01, 0.36, -0.38, T + 0.12, -0.14, 0.004); lid.rotation.x = -1.1;
    cyl(g, M.pizza, 0.16, 0.16, 0.012, -0.38, T + 0.04, 0.06, 32);
    for (let i = 0; i < 6; i++) { const a = i * 1.05; sph(g, M.canRed, 0.018, -0.38 + Math.cos(a) * 0.09, T + 0.047, 0.06 + Math.sin(a) * 0.09, 1, 0.3, 1); }
    pad(g, M, 0.05, T, 0.18, 0.3); pad(g, M, 0.24, T, -0.12, -0.5, M.black);
    box(g, M.dark, 0.2, 0.014, 0.09, 0.45, T + 0.007, 0.15, 0.007);                                       // handheld
    box(g, M.neonCyan, 0.025, 0.016, 0.085, 0.34, T + 0.008, 0.15, 0.006); box(g, M.neonPink, 0.025, 0.016, 0.085, 0.56, T + 0.008, 0.15, 0.006);
    can(g, M, M.canRed, 0.02, T, -0.2); can(g, M, M.canBlue, 0.52, T, -0.2); can(g, M, M.canGreen, 0.6, T, -0.1);
    cyl(g, M.ceramic, 0.08, 0.06, 0.07, 0.25, T + 0.035, 0.2, 24);                                        // popcorn bowl
    for (let i = 0; i < 10; i++) sph(g, M.popcorn, 0.02, 0.25 + Math.cos(i * 2.3) * 0.04 * (i % 3), T + 0.075, 0.2 + Math.sin(i * 2.3) * 0.04 * (i % 3));
    for (const [x, z, c, r] of [[-0.1, -0.22, M.canYellow, 0.5], [0.62, 0.22, M.canPurple, -0.3]]) { const b = box(g, c, 0.16, 0.04, 0.2, x, T + 0.02, z, 0.02); b.rotation.y = r; }
    // lower shelf: game boxes + magazines
    books(g, M, -0.55, -0.05, 0.1325, 0, 4);
    box(g, M.clothD, 0.3, 0.02, 0.22, 0.3, 0.145, 0, 0.004); box(g, M.clothC, 0.28, 0.02, 0.2, 0.32, 0.165, 0.02, 0.004);
  }, [-2.75, 0.2], 1);

  def('rug', '絨毛地毯', 3.6, 2.8, (g) => {
    box(g, M.rug, 3.6, 0.03, 2.8, 0, 0.015, 0, 0.012);
    for (const [w, d, x, z] of [[3.6, 0.05, 0, 1.375], [3.6, 0.05, 0, -1.375], [0.05, 2.8, 1.775, 0], [0.05, 2.8, -1.775, 0]]) box(g, M.accent, w, 0.032, d, x, 0.016, z, 0.004);
  }, [-2.6, 0.3], 0, { rug: true });

  def('pouf', '圓形坐墩', 0.55, 0.55, (g) => {
    cyl(g, M.clothB, 0.27, 0.25, 0.34, 0, 0.17, 0, 32);
    sph(g, M.clothB, 0.27, 0, 0.34, 0, 1, 0.18, 1);
    torus(g, M.black, 0.27, 0.012, 0, 0.3, 0).rotation.x = Math.PI / 2;
  }, [-3.3, 1.75], 0, { round: true });

  def('beanbag', '懶骨頭 (黑貓)', 0.95, 0.95, (g) => {
    sph(g, M.accent, 0.46, 0, 0.25, 0, 1, 0.55, 1);
    const back = sph(g, M.accent, 0.36, 0, 0.5, -0.22, 1.05, 1.05, 0.7); back.rotation.x = -0.3;
    sph(g, M.plastic, 0.2, 0.24, 0.42, 0.22, 1, 0.45, 1);
    catSit(g, M, { fur: M.catBlack, eye: M.eyeAmber, s: 0.95, x: -0.08, y: 0.44, z: 0.08, ry: 0.7 }, tickers);
  }, [-3.9, 3.15], 0, { round: true });

  /* =================================================================== SNACKS + SODA */
  def('cart', '零食推車', 0.7, 0.45, (g) => {
    for (const [x, z] of [[-0.32, -0.19], [0.32, -0.19], [-0.32, 0.19], [0.32, 0.19]]) { cyl(g, M.metal, 0.01, 0.01, 0.76, x, 0.44, z, 8); sph(g, M.black, 0.03, x, 0.03, z); }
    const tiers = [0.14, 0.44, 0.74];
    tiers.forEach((y) => { box(g, M.metal, 0.66, 0.015, 0.4, 0, y, 0, 0.004); for (const s of [-1, 1]) box(g, M.metal, 0.66, 0.04, 0.008, 0, y + 0.02, s * 0.2, 0.002); });
    cyl(g, M.metal, 0.01, 0.01, 0.4, 0.36, 0.83, 0, 8).rotation.x = Math.PI / 2;
    const r = rng(8);
    // top: cup noodles, chips, lamp
    for (const [x, z] of [[-0.24, -0.08], [-0.24, 0.08], [-0.12, 0]]) { cyl(g, M.plastic, 0.045, 0.034, 0.1, x, 0.8, z, 18); cyl(g, M.canRed, 0.047, 0.047, 0.006, x, 0.853, z, 18); }
    for (let i = 0; i < 3; i++) { const b = box(g, snacks[i + 1], 0.13, 0.18, 0.05, 0.02 + i * 0.09, 0.84, (i - 1) * 0.05, 0.02); b.rotation.set(-0.15, (r() - 0.5) * 0.5, (r() - 0.5) * 0.2); }
    cyl(g, M.black, 0.04, 0.05, 0.02, 0.24, 0.758, 0.1, 18); cyl(g, M.metal, 0.006, 0.006, 0.14, 0.24, 0.83, 0.1, 8); sph(g, M.bulb, 0.055, 0.24, 0.92, 0.1);
    lamp(g, 0.24, 0.92, 0.1, 2.2, '#ffb866', 3.5);
    // middle: soda cans
    for (let i = 0; i < 5; i++) for (const z of [-0.08, 0.08]) can(g, M, cans[(i + (z > 0 ? 2 : 0)) % cans.length], -0.24 + i * 0.12, 0.4475, z);
    // bottom: snack boxes
    for (let i = 0; i < 4; i++) box(g, snacks[(i + 3) % snacks.length], 0.13, 0.12 + r() * 0.08, 0.3, -0.22 + i * 0.145, 0.21 + 0.01, 0, 0.01);
  }, [-0.1, 2.05], 0);

  def('fridge', '汽水冰箱', 0.6, 0.6, (g) => {
    const H = 1.05;
    for (const sx of [-1, 1]) box(g, M.black, 0.04, H, 0.56, sx * 0.28, H / 2, -0.02, 0.008);
    box(g, M.black, 0.6, 0.08, 0.56, 0, H - 0.04, -0.02, 0.008); box(g, M.black, 0.6, 0.12, 0.56, 0, 0.06, -0.02, 0.008);
    box(g, M.fridgeIn, 0.52, H - 0.2, 0.02, 0, H / 2 + 0.02, -0.28, 0.003);
    [0.13, 0.4, 0.66].forEach((y, k) => {
      box(g, M.vitrine, 0.52, 0.01, 0.48, 0, y, -0.03, 0.002);
      for (let i = 0; i < 5; i++) for (const z of [-0.14, 0.06]) can(g, M, cans[(i + k * 2 + (z > 0 ? 1 : 0)) % cans.length], -0.2 + i * 0.1, y + 0.005, z);
    });
    const door = box(g, M.vitrine, 0.54, H - 0.18, 0.012, 0, H / 2 + 0.02, 0.265, 0.003); door.renderOrder = 2;
    box(g, M.metal, 0.02, 0.4, 0.03, 0.24, 0.6, 0.29, 0.006);
    box(g, M.led, 0.52, 0.012, 0.012, 0, H - 0.09, 0.27, 0.002);
    // top: six-pack + cups + chips
    box(g, M.cardboard, 0.3, 0.13, 0.2, -0.1, H + 0.065, -0.02, 0.01);
    for (let i = 0; i < 3; i++) for (const z of [-0.07, 0.03]) cyl(g, M.metal, 0.03, 0.03, 0.01, -0.2 + i * 0.1, H + 0.135, z, 14);
    for (let i = 0; i < 3; i++) cyl(g, M.plastic, 0.035, 0.028, 0.1, 0.17, H + 0.05 + i * 0.02, -0.05, 16);
    const bag = box(g, M.canYellow, 0.14, 0.2, 0.05, 0.16, H + 0.1, 0.12, 0.02); bag.rotation.set(-0.2, 0.3, 0.1);
    glowLight(g, 0, 0.6, 0.5, 1.4, '#7fd6ff', 2.4);
  }, [-1.05, -3.7], 0);

  /* =================================================================== STREAMING DESK */
  def('desk', '直播電競桌 (三螢幕)', 2.4, 0.8, (g) => {
    box(g, M.wood, 2.4, 0.05, 0.8, 0, 0.75, 0, 0.012);
    // left drawer pedestal
    box(g, M.wood, 0.45, 0.72, 0.72, -0.95, 0.36, 0, 0.008);
    for (const y of [0.15, 0.38, 0.6]) { box(g, M.dark, 0.43, 0.006, 0.004, -0.95, y + 0.1, 0.361, 0.001); box(g, M.metal, 0.12, 0.014, 0.016, -0.95, y, 0.365, 0.004); }
    box(g, M.metal, 0.05, 0.73, 0.7, 1.17, 0.365, 0, 0.008);
    box(g, M.metal, 1.9, 0.06, 0.03, 0.2, 0.55, -0.32, 0.005);
    box(g, M.led, 2.36, 0.012, 0.012, 0, 0.722, 0.39, 0.002);
    // PC tower under the right side
    const pc = grp(g, 0.85, 0, 0.02);
    box(pc, M.black, 0.24, 0.5, 0.46, 0, 0.25, 0, 0.012);
    box(pc, M.vitrine, 0.012, 0.44, 0.4, -0.123, 0.25, 0, 0.003);
    for (let i = 0; i < 3; i++) { torus(pc, M.rgb, 0.045, 0.008, 0, 0.1 + i * 0.13, 0.232); cyl(pc, M.dark, 0.036, 0.036, 0.006, 0, 0.1 + i * 0.13, 0.23, 16).rotation.x = Math.PI / 2; }
    box(pc, M.rgb, 0.006, 0.05, 0.3, -0.115, 0.3, 0, 0.001);
    glowLight(g, 0.85, 0.3, 0.35, 1.2, '#ff4fb0', 2.2);
    // mat, monitors, webcam
    box(g, M.black, 1.2, 0.006, 0.42, 0, 0.778, 0.13, 0.003);
    box(g, M.rgb, 1.2, 0.004, 0.006, 0, 0.782, 0.34, 0.001);
    monitor(g, M, 0, 0.775, -0.24, 0, 0.82, 0.44, M.scrWaifu);
    monitor(g, M, -0.82, 0.775, -0.18, 0.45, 0.56, 0.33, M.scrOBS);
    monitor(g, M, 0.82, 0.775, -0.18, -0.45, 0.56, 0.33, M.scrGame);
    box(g, M.black, 0.09, 0.035, 0.045, 0, 1.425, -0.235, 0.01); cyl(g, M.dark, 0.012, 0.012, 0.006, 0, 1.425, -0.211, 12).rotation.x = Math.PI / 2;
    // keyboard + mouse
    box(g, M.dark, 0.44, 0.022, 0.15, -0.05, 0.792, 0.15, 0.006);
    const kb = plane(g, M.rgb, 0.42, 0.125, -0.05, 0.8035, 0.15); kb.rotation.x = -Math.PI / 2;
    for (let i = 0; i < 6; i++) box(g, M.black, 0.42, 0.003, 0.006, -0.05, 0.805, 0.1 + i * 0.02, 0.001);
    for (let i = 0; i < 14; i++) box(g, M.black, 0.005, 0.003, 0.125, -0.24 + i * 0.03, 0.805, 0.15, 0.001);
    box(g, M.dark, 0.062, 0.03, 0.108, 0.34, 0.795, 0.15, 0.02); box(g, M.rgb, 0.04, 0.004, 0.004, 0.34, 0.812, 0.2, 0.001);
    // stream deck
    box(g, M.black, 0.13, 0.03, 0.09, 0.5, 0.79, 0.2, 0.01);
    const btn = [M.neonPink, M.neonCyan, M.neonYellow, M.led, M.recRed];
    for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) box(g, btn[(i + j) % 5], 0.018, 0.006, 0.018, 0.45 + i * 0.024, 0.806, 0.175 + j * 0.024, 0.002);
    // mic on a boom arm
    box(g, M.black, 0.05, 0.04, 0.06, -1.1, 0.795, -0.3, 0.006);
    tube(g, M.black, [[-1.1, 0.8, -0.3], [-1.1, 1.15, -0.28], [-0.98, 1.3, -0.1], [-0.82, 1.2, 0.08]], 0.009, 24);
    const mic = cyl(g, M.dark, 0.028, 0.028, 0.14, -0.8, 1.09, 0.1, 18);
    cyl(g, M.metal, 0.03, 0.03, 0.05, -0.8, 1.13, 0.1, 18);
    torus(g, M.black, 0.055, 0.004, -0.8, 1.08, 0.2).rotation.x = 0.1;
    plane(g, M.vitrine, 0.1, 0.1, -0.8, 1.08, 0.2);
    // headset stand, cup, figure, plant
    cyl(g, M.metal, 0.05, 0.055, 0.012, 1.0, 0.781, 0.12);
    cyl(g, M.metal, 0.008, 0.008, 0.26, 1.0, 0.91, 0.12, 8);
    torus(g, M.dark, 0.085, 0.012, 1.0, 1.02, 0.12, Math.PI);
    for (const sx of [-1, 1]) { cyl(g, M.dark, 0.05, 0.05, 0.035, 1.0 + sx * 0.085, 0.99, 0.12).rotation.z = Math.PI / 2; cyl(g, M.rgb, 0.03, 0.03, 0.038, 1.0 + sx * 0.085, 0.99, 0.12).rotation.z = Math.PI / 2; }
    cyl(g, M.ceramic, 0.04, 0.032, 0.09, 0.66, 0.82, 0.3, 18);
    figure(g, M, 'girl', { x: 1.08, y: 0.775, z: -0.26, s: 0.9, ry: -0.5, hair: M.hairSilver, outfit: M.outfitNavy });
    plant(g, M, { kind: 'snake', x: -1.08, y: 0.775, z: 0.22, s: 0.45, pot: M.black, seed: 3 });
    lamp(g, 0, 1.05, 0.05, 2.5, '#9fb8ff', 4);
  }, [-2.6, -3.6], 0);

  def('chair', '電競椅', 0.75, 0.75, (g) => {
    for (let i = 0; i < 5; i++) {
      const a = i * Math.PI * 2 / 5, l = box(g, M.dark, 0.34, 0.03, 0.05, Math.cos(a) * 0.17, 0.09, Math.sin(a) * 0.17, 0.01); l.rotation.y = -a;
      cyl(g, M.black, 0.025, 0.025, 0.05, Math.cos(a) * 0.32, 0.035, Math.sin(a) * 0.32, 12);
    }
    cyl(g, M.metal, 0.03, 0.035, 0.3, 0, 0.26, 0, 12);
    box(g, M.dark, 0.5, 0.09, 0.5, 0, 0.47, 0.03, 0.05);
    for (const sx of [-1, 1]) box(g, M.accent, 0.08, 0.1, 0.46, sx * 0.235, 0.5, 0.03, 0.035);
    for (const sx of [-1, 1]) { box(g, M.dark, 0.05, 0.02, 0.28, sx * 0.3, 0.68, 0.02, 0.008); box(g, M.metal, 0.03, 0.2, 0.05, sx * 0.3, 0.58, 0.02, 0.006); }
    const back = grp(g, 0, 0.5, -0.25); back.rotation.x = -0.14;
    box(back, M.dark, 0.5, 0.62, 0.11, 0, 0.32, 0, 0.05);
    for (const sx of [-1, 1]) box(back, M.accent, 0.09, 0.6, 0.12, sx * 0.235, 0.32, 0.005, 0.04);
    box(back, M.dark, 0.44, 0.34, 0.12, 0, 0.75, 0, 0.06);
    for (const sx of [-1, 1]) box(back, M.accent, 0.06, 0.32, 0.125, sx * 0.19, 0.75, 0.005, 0.03);
    box(back, M.accent, 0.3, 0.13, 0.05, 0, 0.9, 0.09, 0.05);
    box(back, M.accent, 0.3, 0.12, 0.05, 0, 0.25, 0.09, 0.05);
    box(back, M.rgb, 0.03, 0.3, 0.005, 0, 0.6, 0.062, 0.001);
  }, [-2.6, -2.7], 2);

  const tripod = (g, top) => {
    for (let i = 0; i < 3; i++) { const a = i * 2.094 + 0.5, l = cyl(g, M.black, 0.008, 0.008, 0.62, Math.cos(a) * 0.13, 0.28, Math.sin(a) * 0.13, 8); l.rotation.set(-Math.sin(a) * 0.45, 0, Math.cos(a) * 0.45); }
    cyl(g, M.black, 0.012, 0.012, top - 0.5, 0, 0.5 + (top - 0.5) / 2, 0, 10);
  };
  def('ringlight', '直播環形燈', 0.5, 0.5, (g) => {
    tripod(g, 1.55);
    const ring = grp(g, 0, 1.75, 0, -0.5);
    torus(ring, M.white, 0.2, 0.022, 0, 0, 0);
    torus(ring, M.black, 0.2, 0.026, 0, 0, -0.012);
    box(ring, M.black, 0.015, 0.2, 0.015, 0, -0.1, -0.01, 0.004);
    box(ring, M.black, 0.075, 0.15, 0.012, 0, 0, 0.01, 0.01); plane(ring, M.scrChat, 0.065, 0.13, 0, 0, 0.017);
    glowLight(g, 0, 1.75, 0.35, 2.4, '#ffffff', 4.5);
  }, [-4.1, -3.55], 1);

  def('camera', '直播攝影機', 0.5, 0.5, (g) => {
    tripod(g, 1.3);
    box(g, M.black, 0.08, 0.03, 0.08, 0, 1.31, 0, 0.008);
    box(g, M.black, 0.15, 0.1, 0.09, 0, 1.38, 0, 0.015);
    const lens = cyl(g, M.dark, 0.035, 0.04, 0.1, 0, 1.38, 0.09, 20); lens.rotation.x = Math.PI / 2;
    cyl(g, M.vitrine, 0.03, 0.03, 0.004, 0, 1.38, 0.141, 20).rotation.x = Math.PI / 2;
    sph(g, M.recRed, 0.009, 0.06, 1.44, 0.04);
    box(g, M.dark, 0.1, 0.07, 0.01, -0.09, 1.39, -0.02, 0.004).rotation.y = 0.8;
  }, [-1.15, -2.85], 3);

  /* =================================================================== COLLECTION WALL */
  def('wardrobe', '玻璃衣櫃', 1.2, 0.6, (g) => {
    const w = 1.2, h = 2.1, d = 0.58;
    for (const sx of [-1, 1]) box(g, M.black, 0.04, h, d, sx * (w / 2 - 0.02), h / 2, 0, 0.004);
    box(g, M.black, w, 0.04, d, 0, h - 0.02, 0, 0.004); box(g, M.black, w, 0.08, d, 0, 0.04, 0, 0.004);
    box(g, M.dark, w - 0.06, h - 0.1, 0.015, 0, h / 2, -d / 2 + 0.01, 0.002);
    cyl(g, M.metal, 0.01, 0.01, w - 0.1, 0, 1.85, -0.02, 8).rotation.z = Math.PI / 2;
    [M.clothB, M.clothA, M.clothD, M.clothB, M.clothC, M.clothB, M.clothE, M.clothA].forEach((c, i) => {
      const hg = grp(g, -0.47 + i * 0.134, 1.85, -0.02, 1.35);
      torus(hg, M.metal, 0.018, 0.003, 0, 0.015, 0, Math.PI * 1.5);
      const len = i % 3 === 0 ? 0.95 : 0.7;
      box(hg, c, 0.4, len, 0.04, 0, -len / 2 - 0.06, 0, 0.02);
      box(hg, c, 0.48, 0.1, 0.045, 0, -0.07, 0, 0.03);
    });
    box(g, M.black, w - 0.08, 0.02, d - 0.04, 0, 0.5, 0, 0.004);
    for (let i = 0; i < 4; i++) for (const y of [0.08, 0.51]) {                         // sneakers
      const x = -0.42 + i * 0.28, c = [M.plastic, M.clothB, M.canRed, M.plastic][i];
      for (const dx of [-0.04, 0.04]) { box(g, c, 0.07, 0.07, 0.22, x + dx, y + 0.035, 0.02, 0.025); box(g, M.plastic, 0.072, 0.02, 0.222, x + dx, y + 0.01, 0.02, 0.006); }
    }
    box(g, M.led, w - 0.1, 0.01, 0.01, 0, h - 0.06, d / 2 - 0.05, 0.002);
    for (const sx of [-1, 1]) { const door = box(g, M.vitrine, w / 2 - 0.035, h - 0.1, 0.01, sx * (w / 4 - 0.005), h / 2, d / 2 - 0.005, 0.002); door.renderOrder = 2;
      box(g, M.black, 0.02, h - 0.1, 0.02, sx * 0.012, h / 2, d / 2 - 0.004, 0.003); box(g, M.metal, 0.012, 0.3, 0.02, sx * 0.04, 1.1, d / 2 + 0.008, 0.004); }
    box(g, M.cardboard, 0.42, 0.24, 0.4, -0.3, h + 0.12, 0, 0.01); box(g, M.plastic, 0.36, 0.2, 0.4, 0.18, h + 0.1, 0, 0.02);
    glowLight(g, 0, 1.5, 0.45, 1.2, '#d8c4ff', 2.2);
  }, [-4.7, -3.35], 1);

  def('cabinetA', '公仔展示櫃', 1.0, 0.45, (g) => {
    vitrine(g, M, glow, 1.0, 2.0, 0.45, [0.4, 0.8, 1.2, 1.6], (gg, y, i) => {
      if (i === 0) { figure(gg, M, 'mecha', { x: -0.22, y, z: 0, s: 1.1, ry: 0.2 }); figure(gg, M, 'mecha', { x: 0.24, y, z: 0, s: 1.1, ry: -0.2 }); }
      else figureRow(gg, M, -0.42, 0.42, y, 0.02, 20 + i, 1);
    });
    figure(g, M, 'mecha', { x: -0.2, y: 2.0, z: 0, s: 1.4 }); plant(g, M, { kind: 'hang', x: 0.25, y: 2.0, z: 0.05, seed: 30 });
  }, [-4.775, -2.15], 1);

  def('shelf', '開放公仔層架', 0.9, 0.4, (g) => {
    const w = 0.9, h = 1.9, d = 0.38;
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(g, M.black, 0.03, h, 0.03, sx * (w / 2 - 0.015), h / 2, sz * (d / 2 - 0.015), 0.004);
    const lv = [0.06, 0.45, 0.85, 1.25, 1.65, h - 0.02];
    lv.forEach((y, i) => { box(g, M.wood, w, 0.025, d, 0, y, 0, 0.004); if (i) box(g, M.led, w - 0.06, 0.008, 0.008, 0, y - 0.017, d / 2 - 0.03, 0.001); });
    const top = (i) => lv[i] + 0.0125;
    box(g, M.clothB, 0.38, 0.3, 0.32, -0.2, top(0) + 0.15, 0, 0.03); box(g, M.accent, 0.38, 0.3, 0.32, 0.2, top(0) + 0.15, 0, 0.03);
    books(g, M, -0.4, 0.1, top(1), 0, 13); pad(g, M, 0.25, top(1), 0.05, 0.3);
    figureRow(g, M, -0.4, 0.4, top(2), 0.02, 14);
    books(g, M, -0.4, -0.05, top(3), 0, 15); figure(g, M, 'chibi', { x: 0.2, y: top(3), z: 0.02, hair: M.hairBlue, outfit: M.outfitWhite });
    plant(g, M, { kind: 'bush', x: -0.25, y: top(4), z: 0, s: 0.45, pot: M.black, seed: 16 }); figureRow(g, M, -0.05, 0.4, top(4), 0.02, 17);
    plant(g, M, { kind: 'hang', x: 0.25, y: top(5), z: 0.05, seed: 18 });
    cyl(g, M.black, 0.035, 0.045, 0.02, -0.2, top(5) + 0.01, 0, 16); sph(g, M.bulb, 0.06, -0.2, top(5) + 0.08, 0);
  }, [-4.8, 1.95], 1);

  def('plantCorner', '龜背芋', 0.55, 0.55, (g) => plant(g, M, { kind: 'monstera', s: 1.15, pot: M.black, seed: 2 }), [-4.62, 3.62], 0, { round: true });

  /* =================================================================== WINDOW + CATS */
  def('cattree', '貓跳台 (窗邊)', 0.7, 0.7, (g) => {
    box(g, M.fabric, 0.7, 0.07, 0.7, 0, 0.035, 0, 0.02);
    const post = (x, z, h) => { cyl(g, M.cardboard, 0.055, 0.055, h, x, h / 2 + 0.07, z, 16); for (let i = 0; i < h / 0.05; i++) cyl(g, M.cardboard, 0.058, 0.058, 0.008, x, 0.1 + i * 0.05, z, 16); };
    post(-0.18, -0.18, 1.35); post(0.2, 0.18, 0.85);
    box(g, M.fabric, 0.55, 0.06, 0.55, 0.05, 0.5, 0.05, 0.03);
    const hut = grp(g, 0.1, 0.9, 0.1);
    box(hut, M.fabric, 0.42, 0.34, 0.42, 0, 0.17, 0, 0.05);
    cyl(hut, M.black, 0.11, 0.11, 0.02, 0, 0.14, 0.215, 24).rotation.x = Math.PI / 2;
    box(hut, M.accent, 0.46, 0.05, 0.46, 0, 0.36, 0, 0.03);
    box(g, M.fabric, 0.6, 0.06, 0.6, -0.05, 1.42, -0.05, 0.03);
    box(g, M.accent, 0.48, 0.05, 0.48, -0.05, 1.47, -0.05, 0.03);
    catSit(g, M, { fur: M.catBlack, eye: M.eyeGreen, s: 1.0, x: -0.05, y: 1.495, z: -0.02, ry: 0.8 }, tickers);
    const toy = grp(g, 0.2, 0.86, 0.3);
    cyl(toy, M.black, 0.003, 0.003, 0.24, 0, -0.12, 0, 6); sph(toy, M.neonPink, 0.03, 0, -0.26, 0);
    tickers.push((t) => { toy.rotation.z = Math.sin(t * 2.2) * 0.35; });
    catCurl(g, M, { fur: M.catOrange, belly: M.catCream, s: 0.85, x: 0.02, y: 0.53, z: 0.02, ry: 2.4 }, tickers);
  }, [-0.4, -3.6], 0);

  def('sideboard', '窗邊矮櫃', 1.6, 0.45, (g) => {
    box(g, M.black, 1.56, 0.05, 0.4, 0, 0.025, 0, 0.004);
    box(g, M.wood, 1.6, 0.5, 0.45, 0, 0.3, 0, 0.012);
    for (const x of [-0.53, 0, 0.53]) { box(g, M.dark, 0.5, 0.42, 0.01, x, 0.3, 0.226, 0.004); box(g, M.metal, 0.1, 0.012, 0.014, x, 0.44, 0.235, 0.004); }
    box(g, M.led, 1.56, 0.01, 0.01, 0, 0.045, 0.2, 0.002);
    figureRow(g, M, -0.75, -0.05, 0.55, 0.02, 31, 1.05);
    plant(g, M, { kind: 'bush', x: 0.2, y: 0.55, z: 0, s: 0.55, pot: M.ceramic, seed: 32 });
    cyl(g, M.black, 0.04, 0.05, 0.02, 0.62, 0.56, 0, 16); sph(g, M.bulb, 0.07, 0.62, 0.65, 0, 1, 0.9, 1);
    lamp(g, 0.62, 0.66, 0.05, 1.6, '#ffb866', 3);
    can(g, M, M.canPurple, 0.42, 0.55, 0.1);
  }, [0.95, -3.775], 0);

  def('snake', '虎尾蘭', 0.3, 0.3, (g) => plant(g, M, { kind: 'snake', s: 1.0, pot: M.black, seed: 40 }), [1.95, -3.3], 0, { round: true });

  /* =================================================================== BED CORNER */
  const nightstand = (g, withClock) => {
    box(g, M.wood, 0.45, 0.52, 0.42, 0, 0.26, 0, 0.012);
    box(g, M.dark, 0.41, 0.006, 0.004, 0, 0.3, 0.211, 0.001);
    for (const y of [0.16, 0.41]) box(g, M.metal, 0.09, 0.012, 0.014, 0, y, 0.216, 0.004);
    box(g, M.led, 0.43, 0.008, 0.008, 0, 0.01, 0.19, 0.002);
    cyl(g, M.ceramic, 0.02, 0.028, 0.08, -0.06, 0.56, -0.05, 16);
    sph(g, M.bulb, 0.085, -0.06, 0.66, -0.05, 1, 0.85, 1);
    lamp(g, -0.06, 0.68, -0.02, 2.2, '#ffb3d0', 4);
    if (withClock) figure(g, M, 'plush', { x: 0.12, y: 0.52, z: 0.06, s: 1, ry: -0.4 });
    else { cyl(g, M.vitrine, 0.03, 0.026, 0.09, 0.13, 0.565, 0.08, 14); box(g, M.dark, 0.07, 0.008, 0.14, 0.12, 0.524, -0.05, 0.003); }
  };
  def('nightL', '床頭櫃', 0.45, 0.44, (g) => nightstand(g, false), [2.3, -3.78], 0);
  def('nightR', '床頭櫃', 0.45, 0.44, (g) => nightstand(g, true), [4.78, -3.78], 0);

  def('bed', '收納平台床 (黑貓午睡)', 1.9, 2.3, (g) => {
    // local: headboard at z -1.15..-1.05, platform z -1.05..1.15
    box(g, M.wood, 1.9, 0.28, 2.2, 0, 0.18, 0.05, 0.02);                                    // platform (y .04–.32)
    box(g, M.black, 1.8, 0.04, 2.1, 0, 0.02, 0.05, 0.006);
    box(g, M.led, 1.86, 0.012, 2.16, 0, 0.034, 0.05, 0.004);                                // under-glow, inside the footprint
    for (let i = 0; i < 4; i++) { const z = -0.72 + i * 0.52; box(g, M.black, 0.01, 0.2, 0.44, 0.951, 0.18, z, 0.002); box(g, M.plastic, 0.02, 0.16, 0.38, 0.955, 0.17, z, 0.008); }
    for (const x of [-0.5, 0.1, 0.62]) { box(g, M.black, 0.5, 0.2, 0.01, x, 0.18, 1.151, 0.002); box(g, M.plastic, 0.44, 0.16, 0.02, x, 0.17, 1.155, 0.008); }
    box(g, M.plastic, 1.8, 0.22, 2.08, 0, 0.43, 0.06, 0.07);                                // mattress (top y .54, z -0.98..1.10)
    box(g, M.fabric, 1.86, 0.16, 1.52, 0, 0.55, 0.35, 0.07);                                // duvet (y .47–.63, z -0.41..1.11)
    box(g, M.accent, 1.88, 0.05, 0.42, 0, 0.655, 0.82, 0.02);                               // folded throw
    for (const x of [-0.44, 0.44]) { const p = box(g, M.fabric, 0.74, 0.16, 0.4, x, 0.63, -0.74, 0.07); p.rotation.x = -0.28; }
    for (const [x, m] of [[-0.3, M.accent], [0.32, M.plastic]]) { const p = box(g, m, 0.38, 0.34, 0.1, x, 0.76, -0.52, 0.05); p.rotation.x = -0.35; }
    box(g, M.wood, 1.94, 1.1, 0.1, 0, 0.55, -1.1, 0.015);                                   // headboard
    box(g, M.fabric, 1.72, 0.52, 0.05, 0, 0.8, -1.03, 0.04);
    for (let i = 0; i < 5; i++) box(g, M.dark, 0.004, 0.5, 0.004, -0.68 + i * 0.34, 0.8, -1.004, 0.001);
    box(g, M.wood, 1.94, 0.04, 0.24, 0, 1.12, -1.03, 0.006);                               // headboard shelf
    box(g, M.led, 1.86, 0.008, 0.008, 0, 1.098, -0.915, 0.001);
    figureRow(g, M, -0.9, -0.2, 1.14, -1.02, 41);
    plant(g, M, { kind: 'bush', x: 0.1, y: 1.14, z: -1.03, s: 0.35, pot: M.ceramic, seed: 42 });
    cyl(g, M.black, 0.035, 0.04, 0.02, 0.4, 1.15, -1.03, 16); sph(g, M.bulb, 0.06, 0.4, 1.22, -1.03);
    figureRow(g, M, 0.55, 0.92, 1.14, -1.02, 43);
    // body pillow with anime print
    box(g, M.plastic, 0.36, 0.12, 1.0, -0.58, 0.69, 0.05, 0.05);
    const tex = new THREE.CanvasTexture(animeGirl()); tex.colorSpace = THREE.SRGBColorSpace;
    const pr = plane(g, new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 }), 0.3, 0.9, -0.58, 0.752, 0.05); pr.rotation.set(-Math.PI / 2, 0, Math.PI);
    catCurl(g, M, { fur: M.catGray, belly: M.catWhite, x: 0.35, y: 0.63, z: 0.2, ry: 0.5, s: 1.1 }, tickers);
    glowLight(g, 0, 0.15, 1.5, 1.4, '#a65cff', 3, true);
  }, [3.6, -2.85], 0);

  def('rug2', '床邊絨毛地毯', 2.6, 1.9, (g) => {
    const m = cyl(g, M.rug, 1, 1, 0.03, 0, 0.015, 0, 48); m.scale.set(1.3, 1, 0.95);
  }, [3.5, -1.55], 0, { rug: true, round: true });

  def('rgblamp', 'RGB 落地燈', 0.4, 0.4, (g) => {
    cyl(g, M.metal, 0.16, 0.18, 0.03, 0, 0.015, 0, 28);
    cyl(g, M.dark, 0.03, 0.03, 1.6, 0, 0.83, 0, 12);
    cyl(g, M.rgb, 0.018, 0.018, 1.4, 0, 0.83, 0.03, 10);
    glowLight(g, 0, 1.2, 0.2, 4, '#ff4fb0', 5);
  }, [2.3, -1.4], 0, { round: true });

  def('rack', '落地衣架', 1.2, 0.5, (g) => {
    for (const sx of [-0.56, 0.56]) { cyl(g, M.black, 0.014, 0.014, 1.72, sx, 0.86, 0, 10); box(g, M.black, 0.05, 0.03, 0.46, sx, 0.015, 0, 0.008); sph(g, M.black, 0.025, sx, 1.72, 0); }
    cyl(g, M.black, 0.012, 0.012, 1.14, 0, 1.62, 0, 10).rotation.z = Math.PI / 2;
    box(g, M.wood, 1.1, 0.03, 0.38, 0, 0.36, 0, 0.006);
    [M.clothB, M.clothD, M.clothB, M.clothA, M.clothB, M.clothC, M.clothB, M.clothE].forEach((c, i) => {
      const hg = grp(g, -0.46 + i * 0.13, 1.62, 0, 1.3);
      torus(hg, M.metal, 0.02, 0.003, 0, 0.018, 0, Math.PI * 1.5);
      const long = i % 3 === 0;
      box(hg, c, 0.38, long ? 0.8 : 0.58, 0.05, 0, long ? -0.44 : -0.34, 0, 0.02);
      box(hg, c, 0.5, 0.11, 0.05, 0, -0.08, 0, 0.03);
    });
    sph(g, M.clothB, 0.09, -0.36, 1.82, 0, 1, 0.7, 1); sph(g, M.canPurple, 0.09, 0.3, 1.82, 0, 1, 0.7, 1);
    for (const [x, c] of [[-0.35, M.plastic], [0.05, M.clothB], [0.4, M.canRed]]) box(g, c, 0.3, 0.14, 0.32, x, 0.445, 0, 0.012);
    // cat-face tote on the side
    box(g, M.black, 0.3, 0.34, 0.06, 0.4, 0.2, 0.22, 0.03);
    sph(g, M.eyeAmber, 0.02, 0.35, 0.24, 0.255, 1, 1, 0.4); sph(g, M.eyeAmber, 0.02, 0.45, 0.24, 0.255, 1, 1, 0.4);
  }, [4.65, 0.5], 3);

  /* =================================================================== GAME CORNER (front right) */
  def('arcade', '復古街機', 0.7, 0.7, (g) => {
    for (const sx of [-1, 1]) { box(g, M.black, 0.04, 1.75, 0.7, sx * 0.33, 0.875, 0, 0.008); box(g, M.accent, 0.045, 1.6, 0.05, sx * 0.33, 0.85, 0.3, 0.004); }
    box(g, M.black, 0.62, 1.75, 0.04, 0, 0.875, -0.33, 0.004);
    box(g, M.dark, 0.62, 0.85, 0.04, 0, 0.425, 0.2, 0.006);
    box(g, M.recRed, 0.05, 0.08, 0.01, -0.08, 0.55, 0.222, 0.003); box(g, M.recRed, 0.05, 0.08, 0.01, 0.08, 0.55, 0.222, 0.003);
    const cp = grp(g, 0, 0.93, 0.26); cp.rotation.x = 0.25;
    box(cp, M.dark, 0.62, 0.05, 0.28, 0, 0, 0, 0.01);
    cyl(cp, M.black, 0.008, 0.008, 0.08, -0.16, 0.06, 0, 8); sph(cp, M.canRed, 0.028, -0.16, 0.1, 0);
    [M.neonPink, M.neonCyan, M.neonYellow, M.recRed, M.led, M.white].forEach((m, i) => cyl(cp, m, 0.02, 0.02, 0.02, 0.02 + (i % 3) * 0.08, 0.03, (i < 3 ? -0.04 : 0.05), 14));
    const scr = grp(g, 0, 1.3, 0.1); scr.rotation.x = -0.2;
    box(scr, M.black, 0.6, 0.48, 0.04, 0, 0, 0, 0.006); plane(scr, M.scrGame, 0.54, 0.4, 0, 0, 0.021);
    const mq = new THREE.MeshBasicMaterial({ map: (() => { const t = new THREE.CanvasTexture(textCanvas('GAME ZONE', { w: 900, h: 128, bg: '#1a0b3a', color: '#35f0ff' })); t.colorSpace = THREE.SRGBColorSpace; return t; })(), toneMapped: false });
    box(g, M.black, 0.62, 0.18, 0.2, 0, 1.66, 0.12, 0.006); plane(g, mq, 0.58, 0.15, 0, 1.66, 0.221);
    glowLight(g, 0, 1.3, 0.6, 1.4, '#35f0ff', 2.6);
  }, [3.6, 0.9], 0);

  def('simrig', '賽車模擬座椅', 0.7, 1.3, (g) => {
    box(g, M.black, 0.08, 0.05, 1.3, -0.26, 0.025, 0, 0.01); box(g, M.black, 0.08, 0.05, 1.3, 0.26, 0.025, 0, 0.01);
    box(g, M.black, 0.6, 0.05, 0.08, 0, 0.025, -0.55, 0.01); box(g, M.black, 0.6, 0.05, 0.08, 0, 0.025, 0.5, 0.01);
    box(g, M.dark, 0.48, 0.1, 0.5, 0, 0.3, -0.3, 0.04); box(g, M.black, 0.3, 0.26, 0.3, 0, 0.14, -0.3, 0.02);
    const back = grp(g, 0, 0.32, -0.55); back.rotation.x = -0.35;
    box(back, M.dark, 0.48, 0.75, 0.1, 0, 0.38, 0, 0.05);
    for (const sx of [-1, 1]) box(back, M.accent, 0.08, 0.7, 0.12, sx * 0.21, 0.36, 0.01, 0.04);
    for (const sx of [-1, 1]) box(g, M.accent, 0.07, 0.12, 0.46, sx * 0.23, 0.36, -0.3, 0.035);
    box(g, M.black, 0.06, 0.55, 0.06, 0, 0.3, 0.28, 0.01);
    const wheel = grp(g, 0, 0.66, 0.2); wheel.rotation.x = -0.35;
    box(wheel, M.black, 0.16, 0.1, 0.1, 0, 0, 0.06, 0.02);
    torus(wheel, M.black, 0.14, 0.02, 0, 0, 0); box(wheel, M.dark, 0.24, 0.04, 0.02, 0, 0, 0, 0.01); box(wheel, M.rgb, 0.05, 0.01, 0.01, 0, 0.13, 0.01, 0.002);
    for (const x of [-0.1, 0, 0.1]) { const p = box(g, M.metal, 0.06, 0.12, 0.02, x, 0.12, 0.42, 0.005); p.rotation.x = -0.5; }
    box(g, M.black, 0.05, 0.75, 0.05, 0, 0.375, 0.6, 0.008);
    monitor(g, M, 0, 0.72, 0.6, Math.PI, 0.62, 0.36, M.scrGame);
  }, [1.85, 1.0], 3);

  def('tunnel', '貓咪隧道', 0.9, 0.35, (g) => {
    const t = add(g, new THREE.CylinderGeometry(0.16, 0.16, 0.85, 28, 1, true), M.blackout, 0, 0.16, 0); t.rotation.z = Math.PI / 2;
    for (let i = 0; i < 6; i++) torus(g, M.accent, 0.16, 0.01, -0.4 + i * 0.16, 0.16, 0).rotation.y = Math.PI / 2;
    sph(g, M.catGray, 0.035, 0.52, 0.03, 0.08, 1.4, 0.8, 1);                                          // toy mouse
    catSit(g, M, { fur: M.catWhite, eye: M.eyeGreen, s: 0.75, x: -0.55, y: 0, z: 0.05, ry: 1.2 }, tickers);
  }, [3.0, 2.4], 0);

  def('rug3', '圓形貓咪地墊', 2.2, 1.8, (g) => {
    const m = cyl(g, M.accent, 1, 1, 0.025, 0, 0.0125, 0, 48); m.scale.set(1.1, 1, 0.9);
    const m2 = cyl(g, M.rug, 1, 1, 0.028, 0, 0.014, 0, 48); m2.scale.set(1.0, 1, 0.8);
  }, [2.6, 2.8], 0, { rug: true, round: true });

  /* =================================================================== LAZY FLOOR CORNER (front left) */
  def('lounge', '懶人床墊角 (Switch + 大娃娃)', 2.0, 1.4, (g) => {
    // mattress: z -0.65..0.55 (back edge faces the room)
    box(g, M.black, 1.92, 0.03, 1.22, 0, 0.015, -0.05, 0.01);
    box(g, M.fabric, 1.9, 0.17, 1.2, 0, 0.115, -0.05, 0.07);
    for (let i = 1; i < 4; i++) box(g, M.dark, 0.004, 0.004, 1.16, -0.95 + i * 0.475, 0.2, -0.05, 0.001);
    const T = 0.2;                                                             // mattress top
    // bolster + leaning pillows along the back
    cyl(g, M.accent, 0.1, 0.1, 1.8, 0, T + 0.1, -0.56, 24).rotation.z = Math.PI / 2;
    for (const [x, m, r] of [[-0.25, M.plastic, 0.15], [0.2, M.accent, -0.1], [0.62, M.clothC, 0.2]]) {
      const p = box(g, m, 0.42, 0.4, 0.12, x, T + 0.24, -0.4, 0.06); p.rotation.set(-0.45, r, 0);
    }
    // rumpled blanket
    const b1 = box(g, M.accent, 1.0, 0.04, 0.75, 0.35, T + 0.02, 0.12, 0.02); b1.rotation.y = 0.18;
    const b2 = box(g, M.accent, 0.5, 0.06, 0.7, -0.1, T + 0.04, 0.2, 0.03); b2.rotation.set(0, 0.1, 0.08);
    // Switch (screen + joy-cons), snacks, drink
    const sw = grp(g, 0.1, T + 0.045, 0.3, -0.35);
    box(sw, M.black, 0.17, 0.012, 0.1, 0, 0.006, 0, 0.004);
    const scr = plane(sw, M.scrAnime, 0.14, 0.08, 0, 0.0125, 0); scr.rotation.x = -Math.PI / 2;
    box(sw, M.neonCyan, 0.035, 0.014, 0.1, -0.1, 0.007, 0, 0.012); box(sw, M.neonPink, 0.035, 0.014, 0.1, 0.1, 0.007, 0, 0.012);
    const chips = box(g, M.canOrange, 0.16, 0.05, 0.22, 0.58, T + 0.025, 0.36, 0.025); chips.rotation.y = -0.5;
    can(g, M, M.canPurple, 0.9, 0.0, 0.62);                                  // on the floor beside
    pad(g, M, -0.3, T + 0.04, 0.38, 0.6, M.black);
    // big sitting anime doll (≈70 cm)
    const d = grp(g, -0.62, T, -0.18, 0.35);
    sph(d, M.outfitWhite, 0.17, 0, 0.16, 0, 1, 1.1, 0.9);
    box(d, M.outfitNavy, 0.3, 0.06, 0.2, 0, 0.26, 0.04, 0.03);
    sph(d, M.canRed, 0.035, 0, 0.3, 0.14, 1.4, 0.8, 0.6);
    for (const sx of [-1, 1]) {
      const leg = cyl(d, M.skin, 0.048, 0.048, 0.26, sx * 0.08, 0.05, 0.17, 14); leg.rotation.x = Math.PI / 2;
      sph(d, M.outfitNavy, 0.058, sx * 0.08, 0.05, 0.31, 1, 1, 1.3);
      const arm = sph(d, M.outfitWhite, 0.05, sx * 0.17, 0.17, 0.05, 1, 2.2, 1); arm.rotation.z = sx * 0.4;
      sph(d, M.hairPink, 0.07, sx * 0.21, 0.4, -0.06, 0.8, 2.3, 0.8);          // twin tails
    }
    const head = grp(d, 0, 0.45, 0);
    sph(head, M.skin, 0.16, 0, 0, 0);
    sph(head, M.hairPink, 0.172, 0, 0.035, -0.035, 1.05, 0.95, 0.95);
    box(head, M.hairPink, 0.26, 0.06, 0.06, 0, 0.1, 0.12, 0.03);             // bangs
    for (const sx of [-1, 1]) {
      sph(head, M.mechaBlue, 0.032, sx * 0.06, -0.01, 0.145, 1, 1.35, 0.4);
      sph(head, M.white, 0.01, sx * 0.06 - 0.01, 0.02, 0.157);
      sph(head, M.catPink, 0.02, sx * 0.1, -0.06, 0.13, 1.3, 0.6, 0.4);
      cone(head, M.hairPink, 0.04, 0.08, sx * 0.1, 0.17, -0.02, 4).rotation.z = -sx * 0.3; // cat-ear hair
    }
    box(head, M.canRed, 0.12, 0.05, 0.03, 0, 0.16, -0.08, 0.02);              // ribbon
    // cat napping on the blanket + little moon lamp
    catCurl(g, M, { fur: M.catCream, belly: M.catWhite, s: 0.85, x: 0.5, y: T + 0.04, z: 0.02, ry: -0.8 }, tickers);
    sph(g, M.bulb, 0.09, 0.84, T + 0.09, 0.44);
    lamp(g, 0.84, T + 0.3, 0.44, 1.8, '#ffc98a', 3.5);
  }, [-2.2, 3.2], 0);

  /* =================================================================== FLOOR CATS + PLANTS */
  def('catbed', '貓窩 (橘貓)', 0.6, 0.6, (g) => {
    cyl(g, M.accent, 0.28, 0.3, 0.05, 0, 0.025, 0, 32);
    torus(g, M.fabric, 0.27, 0.07, 0, 0.1, 0).rotation.x = Math.PI / 2;
    cyl(g, M.fabric, 0.25, 0.25, 0.04, 0, 0.06, 0, 32);
    catCurl(g, M, { fur: M.catOrange, belly: M.catCream, s: 1.15, x: 0, y: 0.075, z: 0, ry: 0.6 }, tickers);
  }, [2.2, 2.9], 0, { round: true });

  def('station', '貓砂盆 + 餐碗', 0.9, 0.45, (g) => {
    const lb = grp(g, -0.22, 0, 0);
    box(lb, M.plastic, 0.42, 0.14, 0.36, 0, 0.07, 0, 0.03);
    box(lb, M.cardboard, 0.36, 0.02, 0.3, 0, 0.145, 0, 0.005);
    box(g, M.accent, 0.34, 0.012, 0.3, 0.3, 0.006, 0.02, 0.005);
    for (const z of [-0.06, 0.1]) { cyl(g, M.ceramic, 0.055, 0.04, 0.045, 0.3, 0.035, z, 20); cyl(g, M.cardboard, 0.043, 0.043, 0.008, 0.3, 0.05, z, 20); }
  }, [3.6, 3.65], 0);

  def('catWalk', '黑貓 (散步中)', 0.3, 0.55, (g) => catStand(g, M, { fur: M.catBlack, eye: M.eyeAmber, s: 1.05 }, tickers), [1.2, 3.2], 0);

  def('cat', '貓咪 (三花)', 0.45, 0.4, (g) => {
    const c = catSit(g, M, { fur: M.catCream, chest: M.catWhite, eye: M.eyeGreen, s: 1.1, ry: 0.4 }, tickers);
    sph(c, M.catOrange, 0.07, -0.08, 0.26, -0.03, 1, 0.6, 0.8); sph(c, M.catBlack, 0.06, 0.09, 0.2, -0.05, 1, 0.7, 0.8);
    sph(g, M.neonYellow, 0.035, 0.2, 0.035, 0.12);
  }, [0.1, 0.9], 0);

  def('monstera', '龜背芋', 0.6, 0.6, (g) => plant(g, M, { kind: 'monstera', s: 1.0, pot: M.ceramic, seed: 50 }), [0.6, 2.45], 0, { round: true });
  def('palm', '散尾葵', 0.55, 0.55, (g) => plant(g, M, { kind: 'palm', s: 1.1, pot: M.black, seed: 51 }), [0.3, -1.0], 0, { round: true });
  def('bushR', '盆栽', 0.55, 0.55, (g) => plant(g, M, { kind: 'bush', s: 1.1, pot: M.ceramic, seed: 52 }), [4.6, 2.3], 0, { round: true });

  return defs;
}
