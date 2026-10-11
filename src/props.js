import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// ---- shared geometry helpers (geometries are cached: the room has a lot of repeated parts) ----
const geoCache = new Map();
const memo = (key, make) => { let g = geoCache.get(key); if (!g) geoCache.set(key, g = make()); return g; };
const k3 = (...v) => v.map((n) => Math.round(n * 1000)).join(',');

export const rbGeo = (w, h, d, r) => memo('b' + k3(w, h, d, r), () =>
  new RoundedBoxGeometry(w, h, d, 3, Math.max(0.001, Math.min(r, w / 2 - 1e-4, h / 2 - 1e-4, d / 2 - 1e-4))));
export function add(g, geo, mat, x = 0, y = 0, z = 0) { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); g.add(m); return m; }
export const box = (g, mat, w, h, d, x, y, z, r = 0.02) => add(g, rbGeo(w, h, d, r), mat, x, y, z);
export const cyl = (g, mat, rt, rb, h, x, y, z, seg = 28) => add(g, memo('c' + k3(rt, rb, h, seg), () => new THREE.CylinderGeometry(rt, rb, h, seg)), mat, x, y, z);
export const sph = (g, mat, r, x, y, z, sx = 1, sy = 1, sz = 1) => { const m = add(g, memo('s' + k3(r), () => new THREE.SphereGeometry(r, 24, 16)), mat, x, y, z); m.scale.set(sx, sy, sz); return m; };
export const cone = (g, mat, r, h, x, y, z, seg = 4) => add(g, memo('k' + k3(r, h, seg), () => new THREE.ConeGeometry(r, h, seg)), mat, x, y, z);
export const torus = (g, mat, R, r, x, y, z, arc = Math.PI * 2) => add(g, memo('t' + k3(R, r, arc), () => new THREE.TorusGeometry(R, r, 10, 40, arc)), mat, x, y, z);
export const tube = (g, mat, pts, r = 0.02, seg = 20) => add(g, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), seg, r, 8), mat);
export const plane = (g, mat, w, h, x, y, z) => add(g, memo('p' + k3(w, h), () => new THREE.PlaneGeometry(w, h)), mat, x, y, z);
export const grp = (g, x = 0, y = 0, z = 0, ry = 0) => { const n = new THREE.Group(); n.position.set(x, y, z); n.rotation.y = ry; g.add(n); return n; };

export function rng(seed) {
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/* ---------------------------------------------------------------- small props */
export function pad(g, M, x, y, z, ry = 0, body = M.plastic) {         // game controller lying flat
  const p = grp(g, x, y, z, ry);
  box(p, body, 0.15, 0.03, 0.065, 0, 0.018, 0, 0.012);
  for (const s of [-1, 1]) sph(p, body, 0.03, s * 0.058, 0.018, 0.03, 1, 0.7, 1.3);
  box(p, M.black, 0.05, 0.004, 0.03, 0, 0.034, -0.005, 0.002);
  for (const s of [-1, 1]) cyl(p, M.black, 0.009, 0.009, 0.012, s * 0.025, 0.036, 0.022, 10);
  box(p, M.led, 0.05, 0.004, 0.004, 0, 0.03, -0.034, 0.001);
  return p;
}
export function can(g, M, mat, x, y, z) {
  cyl(g, mat, 0.033, 0.033, 0.12, x, y + 0.06, z, 16);
  cyl(g, M.metal, 0.028, 0.033, 0.008, x, y + 0.124, z, 16);
}
export const CANS = (M) => [M.canRed, M.canBlue, M.canGreen, M.canYellow, M.canPurple, M.canOrange];

/* ---------------------------------------------------------------- cats */
// sitting cat, origin at the floor between the paws, faces +z
export function catSit(g, M, { fur = M.catBlack, eye = M.eyeAmber, chest = null, s = 1, x = 0, y = 0, z = 0, ry = 0 } = {}, tickers) {
  const c = grp(g, x, y, z, ry); c.scale.setScalar(s);
  sph(c, fur, 0.13, 0, 0.17, -0.02, 1, 1.3, 1.05);
  if (chest) sph(c, chest, 0.085, 0, 0.16, 0.08, 0.9, 1.3, 0.6);
  for (const sx of [-1, 1]) { cyl(c, fur, 0.028, 0.03, 0.15, sx * 0.055, 0.075, 0.08, 10); sph(c, chest || fur, 0.034, sx * 0.055, 0.015, 0.1, 1, 0.6, 1.4); }
  const head = grp(c, 0, 0.37, 0.05);
  catHead(head, M, fur, eye);
  const tail = grp(c, 0, 0.04, -0.14);
  tube(tail, fur, [[0, 0, 0], [0, -0.005, -0.1], [0.09, 0.005, -0.17], [0.16, 0.05, -0.16], [0.2, 0.12, -0.13]], 0.02, 24);
  if (tickers) { const ph = Math.random() * 6; tickers.push((t) => { tail.rotation.y = Math.sin(t * 1.6 + ph) * 0.45; head.rotation.y = Math.sin(t * 0.4 + ph) * 0.25; }); }
  return c;
}
function catHead(head, M, fur, eye) {
  sph(head, fur, 0.1, 0, 0, 0, 1.08, 0.92, 0.95);
  for (const sx of [-1, 1]) {
    const e = cone(head, fur, 0.04, 0.075, sx * 0.065, 0.1, -0.005, 4); e.rotation.y = Math.PI / 4; e.rotation.z = -sx * 0.18;
    const ei = cone(head, M.catPink, 0.02, 0.04, sx * 0.065, 0.095, 0.02, 4); ei.rotation.y = Math.PI / 4; ei.rotation.z = -sx * 0.18;
    sph(head, eye, 0.02, sx * 0.042, 0.015, 0.085, 1, 1.15, 0.5);
    box(head, M.black, 0.006, 0.026, 0.006, sx * 0.042, 0.015, 0.098, 0.002);
  }
  sph(head, M.catPink, 0.012, 0, -0.022, 0.1, 1.2, 0.8, 0.8);
}

// curled sleeping cat, origin at the surface it lies on
export function catCurl(g, M, { fur = M.catOrange, belly = M.catCream, s = 1, x = 0, y = 0, z = 0, ry = 0 } = {}, tickers) {
  const c = grp(g, x, y, z, ry); c.scale.setScalar(s);
  const body = sph(c, fur, 0.2, 0, 0.1, 0, 1.15, 0.58, 1);
  sph(c, belly, 0.1, 0.06, 0.06, 0.12, 1, 0.6, 0.8);
  const head = grp(c, 0.17, 0.09, 0.13, -0.7);
  sph(head, fur, 0.085, 0, 0, 0, 1.1, 0.9, 0.95);
  for (const sx of [-1, 1]) {
    const e = cone(head, fur, 0.033, 0.06, sx * 0.055, 0.075, -0.01, 4); e.rotation.y = Math.PI / 4; e.rotation.z = -sx * 0.2;
    box(head, M.eyeShut, 0.028, 0.004, 0.004, sx * 0.037, 0.008, 0.078, 0.001);
  }
  sph(head, M.catPink, 0.01, 0, -0.018, 0.085, 1.2, 0.8, 0.8);
  tube(c, fur, [[-0.17, 0.06, -0.03], [-0.2, 0.05, 0.1], [-0.08, 0.05, 0.19], [0.05, 0.05, 0.19], [0.11, 0.05, 0.14]], 0.03, 24);
  if (tickers) { const ph = Math.random() * 6; tickers.push((t) => { const b = 1 + Math.sin(t * 1.8 + ph) * 0.035; body.scale.set(1.15, 0.58 * b, 1); }); }
  return c;
}

// standing / walking cat, origin at the floor under its belly, faces +z
export function catStand(g, M, { fur = M.catBlack, eye = M.eyeAmber, s = 1, x = 0, y = 0, z = 0, ry = 0 } = {}, tickers) {
  const c = grp(g, x, y, z, ry); c.scale.setScalar(s);
  sph(c, fur, 0.1, 0, 0.21, 0, 0.95, 0.9, 1.9);
  const legs = [];
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const lg = grp(c, sx * 0.05, 0.2, sz * 0.12); legs.push(lg);
    cyl(lg, fur, 0.022, 0.024, 0.19, 0, -0.1, 0, 10); sph(lg, fur, 0.028, 0, -0.195, 0.01, 1, 0.6, 1.3);
  }
  const head = grp(c, 0, 0.33, 0.2); catHead(head, M, fur, eye);
  const tail = grp(c, 0, 0.24, -0.17);
  tube(tail, fur, [[0, 0, 0], [0, 0.06, -0.07], [0, 0.18, -0.1], [0.03, 0.3, -0.06], [0.07, 0.34, 0]], 0.019, 24);
  if (tickers) { const ph = Math.random() * 6; tickers.push((t) => {
    tail.rotation.z = Math.sin(t * 1.3 + ph) * 0.25; head.rotation.y = Math.sin(t * 0.5 + ph) * 0.35;
    legs.forEach((l, i) => { l.rotation.x = Math.sin(t * 0.8 + ph + (i % 3 ? Math.PI : 0)) * 0.08; });
  }); }
  return c;
}

/* ---------------------------------------------------------------- figures (display) */
export function figure(g, M, kind, { x = 0, y = 0, z = 0, s = 1, ry = 0, hair = M.hairPink, outfit = M.outfitRed } = {}) {
  const f = grp(g, x, y, z, ry); f.scale.setScalar(s);
  cyl(f, M.black, 0.05, 0.055, 0.01, 0, 0.005, 0, 20);
  if (kind === 'girl') {
    for (const sx of [-1, 1]) cyl(f, M.skin, 0.008, 0.008, 0.08, sx * 0.014, 0.05, 0, 8);
    cyl(f, outfit, 0.03, 0.062, 0.07, 0, 0.12, 0, 16);
    cyl(f, M.outfitWhite, 0.026, 0.03, 0.07, 0, 0.17, 0, 12);
    sph(f, M.skin, 0.036, 0, 0.245, 0);
    sph(f, hair, 0.041, 0, 0.255, -0.006);
    for (const sx of [-1, 1]) { sph(f, hair, 0.016, sx * 0.05, 0.22, 0, 0.8, 2.6, 0.9); box(f, M.black, 0.006, 0.01, 0.004, sx * 0.016, 0.243, 0.034, 0.001); }
    for (const sx of [-1, 1]) cyl(f, M.skin, 0.007, 0.007, 0.06, sx * 0.04, 0.17, 0.01, 8);
  } else if (kind === 'mecha') {
    for (const sx of [-1, 1]) { box(f, M.mecha, 0.026, 0.09, 0.034, sx * 0.02, 0.055, 0, 0.005); box(f, M.mechaBlue, 0.03, 0.02, 0.04, sx * 0.02, 0.02, 0.006, 0.005);
      box(f, M.mecha, 0.024, 0.08, 0.03, sx * 0.068, 0.17, 0, 0.005); box(f, M.mechaRed, 0.03, 0.03, 0.036, sx * 0.068, 0.22, 0, 0.005); }
    box(f, M.mecha, 0.09, 0.08, 0.05, 0, 0.16, 0, 0.006);
    box(f, M.mechaBlue, 0.06, 0.04, 0.052, 0, 0.175, 0.002, 0.004);
    box(f, M.mechaRed, 0.05, 0.02, 0.05, 0, 0.13, 0.002, 0.003);
    box(f, M.mecha, 0.05, 0.05, 0.05, 0, 0.235, 0, 0.008);
    box(f, M.mechaGold, 0.01, 0.035, 0.01, -0.02, 0.278, 0.015, 0.002).rotation.z = 0.5;
    box(f, M.mechaGold, 0.01, 0.035, 0.01, 0.02, 0.278, 0.015, 0.002).rotation.z = -0.5;
    box(f, M.eyeGreen, 0.036, 0.008, 0.004, 0, 0.238, 0.026, 0.001);
  } else if (kind === 'chibi') {
    for (const sx of [-1, 1]) cyl(f, M.skin, 0.01, 0.01, 0.04, sx * 0.016, 0.03, 0, 8);
    sph(f, outfit, 0.036, 0, 0.09, 0, 1, 1.05, 0.9);
    sph(f, M.skin, 0.06, 0, 0.17, 0, 1, 0.95, 0.95);
    sph(f, hair, 0.065, 0, 0.183, -0.008, 1, 0.9, 1);
    for (const sx of [-1, 1]) { sph(f, M.hairBlack, 0.014, sx * 0.024, 0.163, 0.052, 1, 1.3, 0.5); sph(f, hair, 0.02, sx * 0.062, 0.14, 0, 0.9, 1.8, 0.9); }
    for (const sx of [-1, 1]) cone(f, hair, 0.022, 0.05, sx * 0.04, 0.245, 0, 4);
  } else if (kind === 'plush') {
    sph(f, M.catWhite, 0.06, 0, 0.07, 0, 1, 0.95, 0.95);
    sph(f, M.catWhite, 0.048, 0, 0.16, 0.005, 1.1, 0.95, 1);
    for (const sx of [-1, 1]) { cone(f, M.catWhite, 0.02, 0.045, sx * 0.038, 0.21, 0, 4); box(f, M.black, 0.007, 0.012, 0.004, sx * 0.02, 0.163, 0.044, 0.001); }
    sph(f, M.catPink, 0.008, 0, 0.152, 0.048);
  }
  return f;
}
const GIRLS = (M) => [[M.hairPink, M.outfitRed], [M.hairBlue, M.outfitWhite], [M.hairSilver, M.outfitNavy], [M.hairBlack, M.outfitYellow]];
// a row of mixed figures along x, centred on x
export function figureRow(g, M, x0, x1, y, z, seed = 1, s = 1) {
  const r = rng(seed), kinds = ['girl', 'mecha', 'chibi', 'girl', 'plush'], n = Math.max(1, Math.round((x1 - x0) / (0.13 * s)));
  for (let i = 0; i < n; i++) {
    const [hair, outfit] = GIRLS(M)[(i + seed) % 4];
    figure(g, M, kinds[Math.floor(r() * kinds.length)], { x: x0 + (i + 0.5) * (x1 - x0) / n, y, z, s: s * (0.85 + r() * 0.25), ry: (r() - 0.5) * 0.6, hair, outfit });
  }
}
export function books(g, M, x0, x1, y, z, seed = 3) {       // standing row of manga / game boxes
  const r = rng(seed), cols = [M.clothA, M.clothC, M.clothD, M.clothE, M.clothF, M.canRed, M.canPurple, M.plastic];
  for (let x = x0; x < x1 - 0.02;) { const w = 0.018 + r() * 0.014, h = 0.15 + r() * 0.06; box(g, cols[Math.floor(r() * cols.length)], w, h, 0.12, x + w / 2, y + h / 2, z, 0.002); x += w + 0.002; }
}

/* ---------------------------------------------------------------- plants */
export function plant(g, M, { kind = 'monstera', x = 0, y = 0, z = 0, s = 1, pot = M.ceramic, seed = 1 } = {}) {
  const p = grp(g, x, y, z); p.scale.setScalar(s);
  const r = rng(seed);
  if (kind !== 'hang') { cyl(p, pot, 0.14, 0.11, 0.26, 0, 0.13, 0, 24); cyl(p, M.soil, 0.13, 0.13, 0.01, 0, 0.256, 0, 24); }
  if (kind === 'monstera') {
    for (let i = 0; i < 11; i++) {
      const a = i * 2.4 + r(), h = 0.35 + r() * 0.5, rr = 0.08 + r() * 0.12, ex = Math.sin(a) * rr, ez = Math.cos(a) * rr;
      tube(p, M.stem, [[0, 0.26, 0], [ex * 0.4, 0.26 + h * 0.6, ez * 0.4], [ex, 0.26 + h, ez]], 0.007, 8);
      const pv = grp(p, ex, 0.26 + h, ez, a); pv.rotation.order = 'YXZ'; pv.rotation.x = 0.35 + r() * 0.5;
      sph(pv, i % 3 ? M.leaf : M.leaf2, 0.14, 0, 0, 0.1, 0.85, 0.06, 1.15);
    }
  } else if (kind === 'snake') {
    for (let i = 0; i < 8; i++) {
      const h = 0.45 + r() * 0.4, b = box(p, i % 2 ? M.leaf : M.leaf2, 0.065, h, 0.014, (r() - 0.5) * 0.14, 0.26 + h / 2, (r() - 0.5) * 0.14, 0.006);
      b.rotation.y = r() * 3; b.rotation.z = (r() - 0.5) * 0.3;
    }
  } else if (kind === 'bush') {
    for (let i = 0; i < 16; i++) sph(p, i % 2 ? M.leaf : M.leaf2, 0.09 + r() * 0.06, (r() - 0.5) * 0.3, 0.36 + r() * 0.34, (r() - 0.5) * 0.3, 1, 0.8, 1);
  } else if (kind === 'palm') {
    cyl(p, M.stem, 0.02, 0.025, 0.7, 0, 0.6, 0, 8);
    for (let i = 0; i < 9; i++) {
      const pv = grp(p, 0, 0.9 + r() * 0.1, 0, i * 0.7 + r()); pv.rotation.order = 'YXZ'; pv.rotation.x = 0.5 + r() * 0.5;
      sph(pv, i % 2 ? M.leaf : M.leaf2, 0.26, 0, 0, 0.22, 0.25, 0.04, 1);
    }
  } else if (kind === 'hang') {                       // trailing plant in a pot on a shelf edge; vines hang down
    cyl(p, pot, 0.09, 0.07, 0.13, 0, 0.065, 0, 20);
    for (let i = 0; i < 9; i++) sph(p, i % 2 ? M.leaf : M.leaf2, 0.05, (r() - 0.5) * 0.14, 0.14 + r() * 0.05, (r() - 0.5) * 0.14, 1, 0.7, 1);
    for (let v = 0; v < 6; v++) {
      const a = v * 1.05 + r(), vx = Math.sin(a) * 0.09, vz = Math.cos(a) * 0.09 + 0.02, n = 4 + Math.floor(r() * 6);
      for (let j = 0; j < n; j++) sph(p, j % 2 ? M.leaf : M.leaf2, 0.028, vx + Math.sin(j * 1.3) * 0.015, 0.1 - j * 0.07, vz + j * 0.004, 1, 0.8, 1);
    }
  }
  return p;
}

/* ---------------------------------------------------------------- monitor */
export function monitor(g, M, x, y, z, ry, w, h, screen) {
  const m = grp(g, x, y, z, ry);
  box(m, M.black, 0.26, 0.012, 0.16, 0, 0.006, 0.02, 0.004);
  box(m, M.dark, 0.05, 0.16, 0.03, 0, 0.09, -0.02, 0.006);
  box(m, M.black, w, h, 0.028, 0, 0.19 + h / 2, 0, 0.006);
  plane(m, screen, w - 0.02, h - 0.02, 0, 0.19 + h / 2, 0.0145);
  box(m, M.rgb, w * 0.8, 0.012, 0.012, 0, 0.19 + h - 0.05, -0.02, 0.002);
  return m;
}
