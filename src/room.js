import * as THREE from 'three';
import { artMesh, neonSign, animeGirl, mecha, catGamer, invader, boyCat, cityCanvas, textCanvas } from './art.js';
import { box, sph, grp, plane, plant, figureRow, books } from './props.js';

// scale a BoxGeometry's UVs so textures keep a constant world size (metres per tile)
function worldUV(geo, w, h, d, tile) {
  const uv = geo.attributes.uv; const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let i = 0; i < 4; i++) {
    const k = f * 4 + i; uv.setXY(k, uv.getX(k) * dims[f][0] / tile, uv.getY(k) * dims[f][1] / tile);
  }
  return geo;
}
function slab(group, mat, x0, x1, y0, y1, z0, z1, tile = 3) {
  const w = x1 - x0, h = y1 - y0, d = z1 - z0;
  const m = new THREE.Mesh(worldUV(new THREE.BoxGeometry(w, h, d), w, h, d, tile), mat);
  m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); m.castShadow = m.receiveShadow = true; group.add(m); return m;
}
function canvasTex(c) { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }

// glowLights: accent-coloured point lights that main.js scales with time of day
export function buildRoom(M, glowLights, tickers) {
  const group = new THREE.Group();
  const T = 0.25, H = 3.3;                       // wall thickness / height
  const X0 = -5, X1 = 5, Z0 = -4, Z1 = 4;        // interior

  // ground + plinth
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), M.ground);
  ground.rotation.x = -Math.PI / 2; ground.position.y = -0.95; ground.receiveShadow = true; group.add(ground);
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(11.4, 0.7, 9.4), M.plinth);
  plinth.position.y = -0.65; plinth.castShadow = plinth.receiveShadow = true; group.add(plinth);
  const trim = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(11.44, 0.72, 9.44)), new THREE.LineBasicMaterial({ color: '#b98cff' }));
  trim.position.y = -0.65; group.add(trim);
  const rim = new THREE.Mesh(new THREE.BoxGeometry(11.6, 0.03, 9.6), M.led);
  rim.position.y = -0.995; group.add(rim);

  // labels on the plinth (front + right side)
  const label = (text, x, z, ry) => {
    const tex = canvasTex(textCanvas(text, { w: 2400, h: 120, bg: 'rgba(0,0,0,0)', color: '#c9a6ff' }));
    const m = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 0.32), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false }));
    m.position.set(x, -0.68, z); m.rotation.y = ry; group.add(m);
  };
  label('GG ROOM · GAMER × CAT × STREAMER', 0, 4.71, 0);
  label('PLAY · STREAM · RELAX · MEOW', 5.71, 0, Math.PI / 2);

  // floor slab (top surface at y = 0)
  slab(group, M.floor, X0 - T, X1 + T, -0.3, 0, Z0 - T, Z1 + T, 2);

  // back wall (z = Z0) with the city window; left wall (x = X0) is solid (TV wall)
  const bw = { x0: 0.1, x1: 1.9, y0: 0.85, y1: 2.65 };
  const back = (x0, x1, y0, y1) => slab(group, M.wall, x0, x1, y0, y1, Z0 - T, Z0, 3);
  back(X0 - T, bw.x0, 0, H); back(bw.x1, X1, 0, H); back(bw.x0, bw.x1, 0, bw.y0); back(bw.x0, bw.x1, bw.y1, H);
  slab(group, M.wallAccent, X0 - T, X0, 0, H, Z0, Z1, 3);

  // baseboards
  const sb = (x0, x1, z0, z1) => slab(group, M.dark, x0, x1, 0, 0.1, z0, z1, 1);
  sb(X0, X1, Z0, Z0 + 0.02); sb(X0, X0 + 0.02, Z0, Z1);

  { // window: frame, glass, night city behind it, blinds-style curtains
    const w = bw.x1 - bw.x0, h = bw.y1 - bw.y0, cx = (bw.x0 + bw.x1) / 2, cy = (bw.y0 + bw.y1) / 2, z = Z0 - T / 2;
    const sky = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.8), M.skyBack); sky.position.set(cx, cy, Z0 - 0.75); group.add(sky);
    const city = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.8), new THREE.MeshBasicMaterial({ map: canvasTex(cityCanvas()), transparent: true, toneMapped: false }));
    city.position.set(cx, cy - 0.45, Z0 - 0.7); group.add(city);
    const gl = new THREE.Mesh(new THREE.PlaneGeometry(w, h), M.glass); gl.position.set(cx, cy, z); gl.renderOrder = 3; group.add(gl);
    const frame = (x, y, fw, fh) => { const m = new THREE.Mesh(new THREE.BoxGeometry(fw, fh, 0.09), M.black); m.position.set(x, y, z); m.castShadow = true; group.add(m); };
    for (const i of [0, 1, 2]) frame(bw.x0 + (w * i) / 2, cy, 0.05, h);
    frame(cx, bw.y0, w, 0.05); frame(cx, bw.y1, w, 0.05);
    slab(group, M.black, bw.x0 - 0.05, bw.x1 + 0.05, bw.y0 - 0.03, bw.y0, Z0 - T, Z0 + 0.1, 1);
    box(group, M.led, w + 0.1, 0.02, 0.02, cx, bw.y1 + 0.06, Z0 + 0.015, 0.004);
    // velvet drapes, tied back: wide at the pelmet, pinched at the tie-back, flaring to the floor
    const TIE = 1.15, TOP = 2.95;
    const drape = (xo, side, wTop, wTie, wBot) => {
      const geo = new THREE.PlaneGeometry(1, TOP, 40, 60); const p = geo.attributes.position;
      const ss = (a, b, v) => { const t = THREE.MathUtils.clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
      for (let i = 0; i < p.count; i++) {
        const t = p.getX(i) + 0.5, y = p.getY(i) + TOP / 2;                       // t: 0 outer edge → 1 inner edge
        const wy = y > TIE ? wTie + (wTop - wTie) * ss(TIE, TOP, y) : wTie + (wBot - wTie) * ss(TIE, 0, y);
        const squeeze = 1 - wy / wTop;
        const x = xo + side * t * wy;
        const z = Z0 + 0.11 + Math.sin(t * Math.PI * 9) * (0.02 + 0.045 * squeeze) + (y < TIE ? 0.02 * ss(TIE, 0, y) : 0);
        p.setXYZ(i, x, y, z);
      }
      geo.computeVertexNormals();
      const m = new THREE.Mesh(geo, M.velvet); m.castShadow = m.receiveShadow = true; group.add(m);
      // glowing tie-back band + wall hook
      const band = box(group, M.led, wTie + 0.04, 0.035, 0.12, xo + side * wTie / 2, TIE, Z0 + 0.12, 0.015); band.rotation.z = side * 0.06;
      box(group, M.metal, 0.03, 0.03, 0.1, xo - side * 0.03, TIE, Z0 + 0.05, 0.01);
    };
    drape(-0.02, 1, 0.46, 0.14, 0.2);
    drape(2.02, -1, 0.46, 0.14, 0.2);
    // pelmet box with LED wash
    box(group, M.black, 2.36, 0.24, 0.2, 1.0, 3.0, Z0 + 0.1, 0.02);
    box(group, M.led, 2.3, 0.012, 0.012, 1.0, 2.875, Z0 + 0.19, 0.003);
    box(group, M.led, 2.3, 0.012, 0.012, 1.0, 3.125, Z0 + 0.19, 0.003);
    const wash = new THREE.PointLight('#a65cff', 0, 3, 2); wash.position.set(1.0, 2.6, Z0 + 0.45); group.add(wash);
    glowLights.push({ light: wash, base: 2.2, follow: true });

    // twinkling string-light curtain inside the window
    const bulbs = [new THREE.MeshBasicMaterial({ color: '#ffd9a0', toneMapped: false }), new THREE.MeshBasicMaterial({ color: '#ffc0e8', toneMapped: false }),
      new THREE.MeshBasicMaterial({ color: '#fff2d8', toneMapped: false })];
    const wire = new THREE.MeshBasicMaterial({ color: '#2a2630' });
    for (let s = 0; s < 14; s++) {
      const x = bw.x0 + 0.08 + s * (w - 0.16) / 13, len = 0.9 + ((s * 7) % 5) * 0.18;
      box(group, wire, 0.003, len, 0.003, x, bw.y1 - 0.04 - len / 2, Z0 - 0.03, 0.001);
      for (let k = 0; k * 0.075 < len; k++) sph(group, bulbs[(s + k) % 3], 0.009, x, bw.y1 - 0.06 - k * 0.075, Z0 - 0.025);
    }
    const base = bulbs.map((b) => b.color.clone());
    tickers.push((t) => bulbs.forEach((b, i) => b.color.copy(base[i]).multiplyScalar(0.55 + 0.45 * Math.sin(t * (1.3 + i * 0.7) + i * 2.1) ** 2)));
  }

  // ---- LED strips along the top of the walls (follow the accent colour) ----
  box(group, M.led, X1 - X0, 0.04, 0.03, 0, H - 0.12, Z0 + 0.015, 0.005);
  box(group, M.led, 0.03, 0.04, Z1 - Z0, X0 + 0.015, H - 0.12, 0, 0.005);
  for (const [x, z] of [[-2.5, -3.6], [3.4, -3.6], [-4.6, 1.5]]) {
    const l = new THREE.PointLight('#a65cff', 0, 7, 2); l.position.set(x, 2.9, z); group.add(l); glowLights.push({ light: l, base: 7, follow: true });
  }

  // ---- back wall decor ----
  const BZ = Z0 + 0.02, LX = X0 + 0.02, R = Math.PI / 2;
  const put = (obj, x, y, z, ry = 0) => { obj.position.set(x, y, z); obj.rotation.y = ry; group.add(obj); return obj; };
  // hexagon light panels
  const hexShape = new THREE.Shape(); for (let i = 0; i < 6; i++) { const a = Math.PI / 3 * i + Math.PI / 6; const x = Math.cos(a) * 0.12, y = Math.sin(a) * 0.12; i ? hexShape.lineTo(x, y) : hexShape.moveTo(x, y); }
  const hexGeo = new THREE.ShapeGeometry(hexShape), hexMats = [M.neonPink, M.neonCyan, M.led, M.neonPink, M.neonCyan, M.white];
  [[0, 0], [0.21, 0.12], [0.21, -0.12], [0, 0.24], [-0.21, 0.12], [0.42, 0], [0.21, 0.36]].forEach(([dx, dy], i) => {
    const m = new THREE.Mesh(hexGeo, hexMats[i % hexMats.length]); m.position.set(-1.25 + dx, 2.3 + dy, BZ + 0.003 * i); group.add(m);
  });
  put(neonSign('gg', '#35f0ff', 0.85), -2.45, 2.72, BZ + 0.01);
  put(neonSign('pad', '#a65cff', 0.6), -2.45, 1.97, BZ + 0.01);
  put(neonSign('text', '#ff3a4a', 0.26, 3.2, 'ON AIR'), -3.95, 2.6, BZ + 0.01);
  put(neonSign('cat', '#ff4fb0', 0.6), 4.62, 2.6, BZ + 0.01);

  const hang = (canvas, w, x, y, z, ry = 0) => put(artMesh(canvas, w, w * 1.25, M.metal), x, y, z, ry);
  hang(animeGirl(), 0.42, 3.05, 2.05, BZ);
  hang(boyCat(), 0.42, 3.75, 2.05, BZ);
  hang(catGamer(), 0.34, -3.95, 1.9, BZ);

  // digital clock
  const clockTex = canvasTex(textCanvas('23:45', { w: 384, h: 128, bg: '#08080b', color: '#ff3a4a', font: '"Courier New", monospace', weight: 700 }));
  box(group, M.black, 0.44, 0.17, 0.04, 4.62, 1.95, BZ + 0.02, 0.01);
  plane(group, new THREE.MeshBasicMaterial({ map: clockTex, toneMapped: false }), 0.4, 0.13, 4.62, 1.95, BZ + 0.041);

  // floating shelves with figures / plants
  const shelf = (x, y, z, w, ry = 0, fill) => {
    const s = grp(group, x, y, z, ry);
    box(s, M.wood, w, 0.035, 0.22, 0, 0, 0.11, 0.006);
    box(s, M.led, w - 0.06, 0.008, 0.008, 0, -0.02, 0.2, 0.001);
    fill(s); return s;
  };
  shelf(-1.0, 1.72, BZ, 0.8, 0, (s) => { figureRow(s, M, -0.36, 0.2, 0.0175, 0.11, 5); plant(s, M, { kind: 'hang', x: 0.3, y: 0.0175, z: 0.1, s: 0.9, pot: M.black, seed: 4 }); });
  shelf(2.3, 1.62, BZ, 0.42, 0, (s) => { plant(s, M, { kind: 'hang', x: -0.08, y: 0.0175, z: 0.1, s: 0.9, seed: 9 }); figureRow(s, M, 0.05, 0.19, 0.0175, 0.11, 2); });
  shelf(-3.95, 1.3, BZ, 0.55, 0, (s) => { books(s, M, -0.25, 0.05, 0.0175, 0.1, 6); figureRow(s, M, 0.06, 0.26, 0.0175, 0.11, 8); });

  // ---- left wall decor ----
  put(neonSign('ps', '#fff', 0.3, 4), LX + 0.01, 2.65, 2.95, R);
  hang(invader(), 0.34, LX, 2.82, -2.15, R);
  hang(mecha(), 0.34, LX, 2.82, -3.35, R);
  shelf(LX, 2.25, 3.55, 0.6, R, (s) => { plant(s, M, { kind: 'hang', x: -0.12, y: 0.0175, z: 0.1, seed: 12 }); figureRow(s, M, 0.02, 0.28, 0.0175, 0.11, 3); });

  return { group, bounds: { X0, X1, Z0, Z1 } };
}
