/* ── THREE.JS REALISTIC PROCEDURAL 3D DRAGON ───────────────────────────
   A realistic, majestically animated 3D Dragon built with Three.js.
   Features:
   - Anatomically detailed dragon: sculpted skull, predatory snout,
     sharp fangs, glowing reptilian eyes, curved striated horns,
     multi-joint articulated serpentine neck with dorsal spines,
     armored scute breastplates, grand leathery wings with dynamic
     membrane physics and articulated finger spars, sharp obsidian talons,
     and a 12-segment undulating tail with bladed caudal spade.
   - Procedural PBR scale bump maps, leather membrane textures, and
     growth-ring horn striations.
   - Dynamic lifelike kinematics: smooth inverse-kinematic neck & head
     tracking of mouse cursor, realistic multi-joint wing flap cycles
     with phase lag and air resistance, rhythmic breathing chest expansion,
     and whip-like serpentine tail waves.
   - Atmospheric ambient ember particles swirling in 3D space.
   - Interactive Click to Roar & Breathe Fire: Clicking triggers a dynamic
     rearing roar with jaw opening, blazing throat glow, and a high-velocity
     burst of fire particles towards the cursor.
   - Full dark/light theme responsiveness & performance optimization.
   ─────────────────────────────────────────────────────────────────── */
(function () {
  if (typeof THREE === 'undefined') return;

  const container = document.getElementById('hero-canvas');
  if (!container) return;

  // Bail silently if WebGL is unavailable
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl') || probe.getContext('experimental-webgl');
    if (!gl) return;
  } catch (e) { return; }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Scene / Camera / Renderer ──
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.3, 8.2);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = false;
  container.appendChild(renderer.domElement);

  // ── Procedural Environment Map ──
  try {
    const c = document.createElement('canvas');
    c.width = 128; c.height = 64;
    const ctx = c.getContext('2d');
    const g = ctx.createLinearGradient(0, 0, 0, 64);
    g.addColorStop(0, '#2d1810');
    g.addColorStop(0.4, '#1b120c');
    g.addColorStop(0.7, '#0d0907');
    g.addColorStop(1, '#050403');
    ctx.fillStyle = g; ctx.fillRect(0, 0, 128, 64);

    // Warm magma glow from below
    const magma = ctx.createRadialGradient(64, 56, 4, 64, 56, 36);
    magma.addColorStop(0, 'rgba(255, 90, 30, 0.85)');
    magma.addColorStop(1, 'rgba(255, 90, 30, 0)');
    ctx.fillStyle = magma; ctx.fillRect(20, 28, 88, 36);

    // Cool moonlight rim from top-right
    const moon = ctx.createRadialGradient(100, 12, 2, 100, 12, 28);
    moon.addColorStop(0, 'rgba(120, 180, 255, 0.7)');
    moon.addColorStop(1, 'rgba(120, 180, 255, 0)');
    ctx.fillStyle = moon; ctx.fillRect(70, 0, 58, 40);

    const envTex = new THREE.CanvasTexture(c);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    envTex.colorSpace = THREE.SRGBColorSpace;
    scene.environment = new THREE.PMREMGenerator(renderer).fromEquirectangular(envTex).texture;
  } catch (e) {}

  // ── Lighting ──
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambientLight);

  const keyLight = new THREE.PointLight(0xff6a3d, 2.2, 45);
  keyLight.position.set(5, 4, 6);
  scene.add(keyLight);

  const rimLight = new THREE.PointLight(0x4d88ff, 1.8, 40);
  rimLight.position.set(-6, 3, -4);
  scene.add(rimLight);

  const bellyGlow = new THREE.PointLight(0xff4411, 1.2, 30);
  bellyGlow.position.set(0, -4, 3);
  scene.add(bellyGlow);

  const throatLight = new THREE.PointLight(0xff4400, 0.2, 12);
  throatLight.position.set(0, 0, 0.2);

  // ── Procedural Textures Generator ──
  function createCanvasTexture(size, drawFn) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    drawFn(c.getContext('2d'), size);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  // 1. Dragon Reptilian Scales Bump Map
  const scaleBumpMap = createCanvasTexture(512, (ctx, s) => {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, s, s);
    const rows = 28;
    const rowH = s / rows;
    for (let r = 0; r <= rows + 1; r++) {
      const y = r * rowH;
      const cols = 18;
      const colW = s / cols;
      const offsetX = (r % 2 === 0) ? 0 : colW * 0.5;
      for (let c = -1; c <= cols + 1; c++) {
        const x = c * colW + offsetX;
        // Shadow base
        ctx.fillStyle = '#222222';
        ctx.beginPath();
        ctx.ellipse(x, y + rowH * 0.35, colW * 0.48, rowH * 0.65, 0, 0, Math.PI * 2);
        ctx.fill();

        // Highlight center
        const rad = ctx.createRadialGradient(x, y - rowH * 0.1, 0, x, y, colW * 0.42);
        rad.addColorStop(0, '#ffffff');
        rad.addColorStop(0.65, '#a0a0a0');
        rad.addColorStop(1, '#505050');
        ctx.fillStyle = rad;
        ctx.beginPath();
        ctx.ellipse(x, y, colW * 0.42, rowH * 0.58, 0, 0, Math.PI * 2);
        ctx.fill();

        // Scale keel ridge
        ctx.strokeStyle = 'rgba(255,255,255,0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, y - rowH * 0.4);
        ctx.lineTo(x, y + rowH * 0.4);
        ctx.stroke();
      }
    }
  });
  scaleBumpMap.repeat.set(4, 4);

  // 2. Underbelly Armored Plates (Scutes) Texture
  const bellyMap = createCanvasTexture(256, (ctx, s) => {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, s, s);
    const plates = 14;
    const h = s / plates;
    for (let i = 0; i < plates; i++) {
      const y = i * h;
      const grad = ctx.createLinearGradient(0, y, 0, y + h);
      grad.addColorStop(0, '#e8e8e8');
      grad.addColorStop(0.15, '#c0c0c0');
      grad.addColorStop(0.85, '#555555');
      grad.addColorStop(1, '#1a1a1a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, y + 2, s, h - 3);

      // Plate horizontal rib
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(10, y + 5);
      ctx.lineTo(s - 10, y + 5);
      ctx.stroke();
    }
  });
  bellyMap.repeat.set(1, 2);

  // 3. Leathery Wing Membrane Texture with Branching Veins
  const wingTex = createCanvasTexture(512, (ctx, s) => {
    // Base leathery gradient
    const g = ctx.createRadialGradient(s * 0.2, s * 0.2, 10, s * 0.5, s * 0.5, s * 0.7);
    g.addColorStop(0, '#5a2216');
    g.addColorStop(0.4, '#38130c');
    g.addColorStop(0.8, '#240a06');
    g.addColorStop(1, '#150604');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);

    // Vascular vein networks
    ctx.strokeStyle = 'rgba(220, 90, 50, 0.25)';
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 9; i++) {
      let x = 30 + Math.random() * 80;
      let y = 20 + i * 55;
      ctx.beginPath();
      ctx.moveTo(x, y);
      for (let j = 0; j < 6; j++) {
        x += 50 + Math.random() * 30;
        y += (Math.random() - 0.5) * 40;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Leathery micro-folds
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 60; i++) {
      const rx = Math.random() * s;
      const ry = Math.random() * s;
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx + (Math.random() - 0.5) * 40, ry + Math.random() * 30);
      ctx.stroke();
    }
  });

  // 4. Horn Keratin Striations
  const hornBumpMap = createCanvasTexture(256, (ctx, s) => {
    ctx.fillStyle = '#777777';
    ctx.fillRect(0, 0, s, s);
    for (let y = 0; y < s; y += 8) {
      ctx.fillStyle = '#bbbbbb';
      ctx.fillRect(0, y, s, 3);
      ctx.fillStyle = '#222222';
      ctx.fillRect(0, y + 3, s, 3);
    }
    // Longitudinal grooves
    for (let x = 0; x < s; x += 16) {
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(x, 0, 3, s);
    }
  });
  hornBumpMap.repeat.set(1, 4);

  // 5. Fire Particle Sprite Canvas
  const fireCanvas = document.createElement('canvas');
  fireCanvas.width = fireCanvas.height = 64;
  const fCtx = fireCanvas.getContext('2d');
  const fireGrad = fCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
  fireGrad.addColorStop(0, 'rgba(255, 255, 230, 1)');
  fireGrad.addColorStop(0.25, 'rgba(255, 170, 40, 0.9)');
  fireGrad.addColorStop(0.6, 'rgba(230, 60, 10, 0.5)');
  fireGrad.addColorStop(0.9, 'rgba(120, 20, 0, 0.15)');
  fireGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  fCtx.fillStyle = fireGrad;
  fCtx.fillRect(0, 0, 64, 64);
  const fireParticleTex = new THREE.CanvasTexture(fireCanvas);

  // ── Materials ──
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';

  const dragonColors = {
    dark: {
      skin: 0x1f1917,
      skinSub: 0x3d1710,
      belly: 0x8a3818,
      horn: 0x181210,
      wing: 0x4a1810,
      spine: 0xd94420,
      claw: 0x120e0d,
      eye: 0xff8800,
    },
    light: {
      skin: 0x342926,
      skinSub: 0x58241b,
      belly: 0xb54d24,
      horn: 0x221815,
      wing: 0x6e2a1d,
      spine: 0xb83216,
      claw: 0x1a1412,
      eye: 0xff5500,
    }
  };

  let curColors = isLight ? dragonColors.light : dragonColors.dark;

  const matDragonSkin = new THREE.MeshStandardMaterial({
    color: curColors.skin,
    roughness: 0.45,
    metalness: 0.3,
    bumpMap: scaleBumpMap,
    bumpScale: 0.65,
    envMapIntensity: 0.8,
  });

  const matDragonBelly = new THREE.MeshStandardMaterial({
    color: curColors.belly,
    roughness: 0.55,
    metalness: 0.15,
    bumpMap: bellyMap,
    bumpScale: 0.7,
    envMapIntensity: 0.7,
  });

  const matDragonHorn = new THREE.MeshStandardMaterial({
    color: curColors.horn,
    roughness: 0.35,
    metalness: 0.4,
    bumpMap: hornBumpMap,
    bumpScale: 0.6,
    envMapIntensity: 0.9,
  });

  const matDragonSpine = new THREE.MeshStandardMaterial({
    color: curColors.spine,
    roughness: 0.3,
    metalness: 0.4,
    bumpMap: hornBumpMap,
    bumpScale: 0.4,
  });

  const matDragonClaw = new THREE.MeshStandardMaterial({
    color: curColors.claw,
    roughness: 0.25,
    metalness: 0.6,
  });

  const matDragonWing = new THREE.MeshStandardMaterial({
    color: curColors.wing,
    map: wingTex,
    roughness: 0.65,
    metalness: 0.1,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.96,
  });

  const matDragonEye = new THREE.MeshBasicMaterial({
    color: curColors.eye,
  });

  const matDragonPupil = new THREE.MeshBasicMaterial({
    color: 0x050302,
  });

  const matDragonTeeth = new THREE.MeshStandardMaterial({
    color: 0xf5f0e6,
    roughness: 0.3,
    metalness: 0.1,
  });

  const matDragonMouth = new THREE.MeshStandardMaterial({
    color: 0x3d0b0b,
    roughness: 0.7,
  });

  // ── DRAGON RIG HIERARCHY ──
  const dragonRoot = new THREE.Group();
  const dragonBody = new THREE.Group();
  dragonRoot.add(dragonBody);

  // 1. Torso & Muscular Chest
  const chestGeo = new THREE.LatheGeometry([
    new THREE.Vector2(0.08, -1.1),
    new THREE.Vector2(0.24, -0.9),
    new THREE.Vector2(0.42, -0.6),
    new THREE.Vector2(0.56, -0.2),
    new THREE.Vector2(0.62, 0.2),
    new THREE.Vector2(0.58, 0.6),
    new THREE.Vector2(0.46, 0.95),
    new THREE.Vector2(0.32, 1.2),
    new THREE.Vector2(0.22, 1.35),
  ], 20);
  const chestMesh = new THREE.Mesh(chestGeo, matDragonSkin);
  chestMesh.scale.set(0.95, 1, 0.8);
  dragonBody.add(chestMesh);

  // Ventral Breastplates (Overlapping Scutes on chest)
  for (let i = 0; i < 6; i++) {
    const y = -0.6 + i * 0.32;
    const scute = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26 - i * 0.02, 0.32 - i * 0.02, 0.26, 12, 1, false, 0, Math.PI),
      matDragonBelly
    );
    scute.position.set(0, y, 0.36 + (1 - Math.abs(i - 2.5) * 0.3) * 0.1);
    scute.rotation.x = -0.2 + i * 0.06;
    dragonBody.add(scute);
  }

  // Dorsal Spines on Back
  for (let i = 0; i < 6; i++) {
    const spineH = 0.22 + (1 - Math.abs(i - 2.5) * 0.25) * 0.22;
    const spine = new THREE.Mesh(
      new THREE.ConeGeometry(0.055, spineH, 5),
      matDragonSpine
    );
    spine.position.set(0, -0.7 + i * 0.35, -0.42 - (1 - Math.abs(i - 2.5) * 0.25) * 0.08);
    spine.rotation.x = -0.65;
    dragonBody.add(spine);
  }

  // 2. Articulated Neck (5 segments)
  const neckSegments = [];
  let prevNeck = dragonBody;
  const numNeckSegs = 5;

  for (let i = 0; i < numNeckSegs; i++) {
    const segGroup = new THREE.Group();
    if (i === 0) {
      segGroup.position.set(0, 1.25, 0.05);
    } else {
      segGroup.position.set(0, 0.34, 0.08);
    }

    const radTop = 0.25 - i * 0.025;
    const radBtm = 0.30 - i * 0.025;
    const nMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(radTop, radBtm, 0.38, 14),
      matDragonSkin
    );
    nMesh.position.set(0, 0.16, 0);
    segGroup.add(nMesh);

    // Throat plate
    const tPlate = new THREE.Mesh(
      new THREE.CylinderGeometry(radTop * 0.9, radBtm * 0.9, 0.36, 8, 1, false, 0, Math.PI),
      matDragonBelly
    );
    tPlate.position.set(0, 0.16, 0.06);
    segGroup.add(tPlate);

    // Dorsal neck spike
    const nSpike = new THREE.Mesh(
      new THREE.ConeGeometry(0.045, 0.28 - i * 0.03, 5),
      matDragonSpine
    );
    nSpike.position.set(0, 0.2, -radBtm - 0.04);
    nSpike.rotation.x = -0.8;
    segGroup.add(nSpike);

    prevNeck.add(segGroup);
    neckSegments.push(segGroup);
    prevNeck = segGroup;
  }

  // 3. Realistic Dragon Head
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.36, 0.1);
  neckSegments[numNeckSegs - 1].add(headGroup);
  headGroup.add(throatLight);

  // Skull Cranium
  const cranium = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.32, 0.48),
    matDragonSkin
  );
  cranium.position.set(0, 0.1, -0.05);
  headGroup.add(cranium);

  // Snout (Upper Jaw)
  const snout = new THREE.Mesh(
    new THREE.ConeGeometry(0.24, 0.65, 8),
    matDragonSkin
  );
  snout.rotation.x = Math.PI / 2 + 0.15;
  snout.scale.set(0.9, 1, 0.55);
  snout.position.set(0, 0.04, 0.42);
  headGroup.add(snout);

  // Nostril Ridges
  [-0.08, 0.08].forEach(nx => {
    const nostril = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 8, 6),
      matDragonHorn
    );
    nostril.position.set(nx, 0.08, 0.65);
    headGroup.add(nostril);
  });

  // Brow Ridges (Above Eyes)
  [-0.14, 0.14].forEach((bx, idx) => {
    const brow = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.06, 0.28),
      matDragonHorn
    );
    brow.position.set(bx, 0.18, 0.12);
    brow.rotation.z = (idx === 0 ? 0.2 : -0.2);
    brow.rotation.y = (idx === 0 ? -0.2 : 0.2);
    headGroup.add(brow);
  });

  // Eyes (Glowing Reptilian)
  const eyeSockets = [];
  [-0.16, 0.16].forEach((ex, idx) => {
    const eyeG = new THREE.Group();
    eyeG.position.set(ex, 0.12, 0.15);

    // Glowing eyeball
    const eyeball = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 10), matDragonEye);
    eyeball.scale.set(0.8, 1, 1.2);
    eyeG.add(eyeball);

    // Slit pupil
    const pupil = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.09, 0.04), matDragonPupil);
    pupil.position.set(idx === 0 ? -0.03 : 0.03, 0, 0.04);
    eyeG.add(pupil);

    headGroup.add(eyeG);
    eyeSockets.push(eyeG);
  });

  // Primary Curved Horns (Sweeping backwards & outwards)
  function createCurvedHorn(isLeft) {
    const hornRoot = new THREE.Group();
    const sign = isLeft ? -1 : 1;
    hornRoot.position.set(sign * 0.15, 0.22, -0.15);

    const segments = 6;
    let parentG = hornRoot;
    for (let s = 0; s < segments; s++) {
      const t = s / segments;
      const r1 = 0.065 * (1 - t * 0.7);
      const r2 = 0.065 * (1 - (t + 1 / segments) * 0.7);
      const len = 0.18;
      const hMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(r2, r1, len, 10),
        matDragonHorn
      );
      hMesh.position.set(0, len * 0.5, 0);

      const link = new THREE.Group();
      link.add(hMesh);
      // Curve up, backward, and outward
      link.rotation.x = -0.32;
      link.rotation.z = sign * 0.18;
      link.rotation.y = sign * 0.08;
      if (s > 0) link.position.set(0, len * 0.95, 0);
      parentG.add(link);
      parentG = link;
    }
    // Sharp Horn Tip
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.16, 8), matDragonHorn);
    tip.position.set(0, 0.22, 0);
    parentG.add(tip);

    return hornRoot;
  }

  headGroup.add(createCurvedHorn(true));
  headGroup.add(createCurvedHorn(false));

  // Secondary Brow Horns & Cheek Frills
  [-1, 1].forEach(side => {
    // Brow spike
    const bSpike = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.18, 6), matDragonHorn);
    bSpike.position.set(side * 0.18, 0.22, 0.1);
    bSpike.rotation.x = -0.4;
    bSpike.rotation.z = side * 0.6;
    headGroup.add(bSpike);

    // Cheek Spikes (Frills)
    for (let c = 0; c < 3; c++) {
      const cSpike = new THREE.Mesh(new THREE.ConeGeometry(0.025 - c * 0.005, 0.18 - c * 0.03, 6), matDragonSpine);
      cSpike.position.set(side * (0.2 + c * 0.04), 0.02 - c * 0.04, -0.05 - c * 0.06);
      cSpike.rotation.z = side * (1.1 + c * 0.15);
      cSpike.rotation.x = -0.3;
      headGroup.add(cSpike);
    }
  });

  // Occipital Crown Spikes (Top center of head)
  for (let k = 0; k < 3; k++) {
    const crownSpike = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.24 - k * 0.04, 6), matDragonSpine);
    crownSpike.position.set(0, 0.26, -0.08 - k * 0.1);
    crownSpike.rotation.x = -0.9 - k * 0.15;
    headGroup.add(crownSpike);
  }

  // Upper Jaw Fangs
  for (let f = 0; f < 8; f++) {
    const fx = (f % 2 === 0 ? 1 : -1) * (0.07 + Math.floor(f / 2) * 0.035);
    const fz = 0.28 + Math.floor(f / 2) * 0.09;
    const fang = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.08 + (f < 2 ? 0.04 : 0), 6), matDragonTeeth);
    fang.rotation.x = Math.PI + 0.15;
    fang.position.set(fx, -0.04, fz);
    headGroup.add(fang);
  }

  // Articulated Lower Jaw (Pivots open during Roar / Breath)
  const lowerJaw = new THREE.Group();
  lowerJaw.position.set(0, -0.08, 0.05);
  headGroup.add(lowerJaw);

  const jawBone = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.6, 8), matDragonSkin);
  jawBone.rotation.x = Math.PI / 2 - 0.05;
  jawBone.scale.set(0.85, 1, 0.4);
  jawBone.position.set(0, -0.04, 0.32);
  lowerJaw.add(jawBone);

  const jawChin = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.12, 6), matDragonSpine);
  jawChin.rotation.x = -0.4;
  jawChin.position.set(0, -0.09, 0.58);
  lowerJaw.add(jawChin);

  // Lower Jaw Teeth & Tongue
  for (let f = 0; f < 6; f++) {
    const fx = (f % 2 === 0 ? 1 : -1) * (0.055 + Math.floor(f / 2) * 0.03);
    const fz = 0.25 + Math.floor(f / 2) * 0.09;
    const fang = new THREE.Mesh(new THREE.ConeGeometry(0.015, 0.07, 6), matDragonTeeth);
    fang.position.set(fx, 0.02, fz);
    lowerJaw.add(fang);
  }
  const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.03, 0.26), matDragonMouth);
  tongue.position.set(0, 0.01, 0.26);
  lowerJaw.add(tongue);

  // 4. Grand Articulated Dragon Wings (Left & Right)
  const wings = [];

  function createDragonWing(isLeft) {
    const sign = isLeft ? -1 : 1;
    const wingRoot = new THREE.Group();
    wingRoot.position.set(sign * 0.42, 0.55, -0.15);

    // Shoulder -> Humerus (Upper arm)
    const shoulderJoint = new THREE.Group();
    wingRoot.add(shoulderJoint);

    const humerusLen = 0.95;
    const humerus = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.09, humerusLen, 10),
      matDragonSkin
    );
    humerus.position.set(sign * humerusLen * 0.42, humerusLen * 0.35, 0);
    humerus.rotation.z = sign * -0.7;
    humerus.rotation.y = sign * 0.3;
    shoulderJoint.add(humerus);

    // Elbow Joint
    const elbowJoint = new THREE.Group();
    elbowJoint.position.set(sign * humerusLen * 0.82, humerusLen * 0.7, 0);
    shoulderJoint.add(elbowJoint);

    // Forearm (Radius / Ulna)
    const forearmLen = 1.1;
    const forearm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.075, forearmLen, 10),
      matDragonSkin
    );
    forearm.position.set(sign * forearmLen * 0.45, forearmLen * 0.2, 0);
    forearm.rotation.z = sign * 0.6;
    elbowJoint.add(forearm);

    // Wrist Joint (Carpal)
    const wristJoint = new THREE.Group();
    wristJoint.position.set(sign * forearmLen * 0.9, forearmLen * 0.42, 0);
    elbowJoint.add(wristJoint);

    // Thumb Claw (Alula) at wrist
    const thumbClaw = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.2, 6), matDragonClaw);
    thumbClaw.position.set(0, 0.08, 0.05);
    thumbClaw.rotation.x = 0.5;
    wristJoint.add(thumbClaw);

    // 4 Long Wing Digits (Fingers / Spars)
    const digits = [];
    const digitConfigs = [
      { len: 1.5, rotZ: sign * 0.85, rotY: sign * -0.15, rotX: -0.1 },  // Digit 1 (Top leading edge)
      { len: 2.2, rotZ: sign * 0.25, rotY: sign * 0.05, rotX: 0.0 },   // Digit 2 (Main high spar)
      { len: 2.0, rotZ: sign * -0.35, rotY: sign * 0.15, rotX: 0.1 },  // Digit 3 (Mid spar)
      { len: 1.6, rotZ: sign * -0.95, rotY: sign * 0.25, rotX: 0.15 }, // Digit 4 (Trailing spar)
    ];

    digitConfigs.forEach((cfg) => {
      const dGroup = new THREE.Group();
      const spar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.045, cfg.len, 8),
        matDragonSkin
      );
      spar.position.set(0, cfg.len * 0.5, 0);
      dGroup.add(spar);

      // Claw tip on spar
      const claw = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.1, 6), matDragonClaw);
      claw.position.set(0, cfg.len + 0.04, 0);
      dGroup.add(claw);

      dGroup.rotation.z = cfg.rotZ;
      dGroup.rotation.y = cfg.rotY;
      dGroup.rotation.x = cfg.rotX;
      wristJoint.add(dGroup);
      digits.push(dGroup);
    });

    // Leathery Wing Membrane Geometry (Planar shape between arm & digits)
    const membraneShape = new THREE.Shape();
    membraneShape.moveTo(0, 0);
    membraneShape.lineTo(sign * 0.8, 0.7);
    membraneShape.lineTo(sign * 1.6, 1.2);
    membraneShape.lineTo(sign * 2.6, 1.8);
    membraneShape.lineTo(sign * 3.4, 0.8);
    membraneShape.lineTo(sign * 2.8, -0.4);
    membraneShape.lineTo(sign * 1.8, -1.2);
    membraneShape.lineTo(sign * 0.4, -0.8);
    membraneShape.closePath();

    const membraneGeo = new THREE.ShapeGeometry(membraneShape, 12);
    const membraneMesh = new THREE.Mesh(membraneGeo, matDragonWing);
    membraneMesh.position.set(0, 0, -0.02);
    shoulderJoint.add(membraneMesh);

    dragonBody.add(wingRoot);

    return {
      root: wingRoot,
      shoulder: shoulderJoint,
      elbow: elbowJoint,
      wrist: wristJoint,
      digits: digits,
      membrane: membraneMesh,
      isLeft: isLeft,
    };
  }

  wings.push(createDragonWing(true));
  wings.push(createDragonWing(false));

  // 5. Serpentine Dragon Tail (12 Articulated Segments)
  const tailSegments = [];
  let prevTail = dragonBody;
  const numTailSegs = 12;

  for (let t = 0; t < numTailSegs; t++) {
    const tGroup = new THREE.Group();
    if (t === 0) {
      tGroup.position.set(0, -1.0, -0.2);
    } else {
      tGroup.position.set(0, -0.32, -0.04);
    }

    const tRatio = t / numTailSegs;
    const rTop = 0.28 * (1 - tRatio * 0.8);
    const rBtm = 0.28 * (1 - (t + 1) / numTailSegs * 0.8);
    const tLen = 0.36;

    const tMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(rBtm, rTop, tLen, 12),
      matDragonSkin
    );
    tMesh.position.set(0, -tLen * 0.5, 0);
    tGroup.add(tMesh);

    // Tail dorsal spine
    const tSpine = new THREE.Mesh(
      new THREE.ConeGeometry(0.035 * (1 - tRatio * 0.6), 0.2 * (1 - tRatio * 0.5), 5),
      matDragonSpine
    );
    tSpine.position.set(0, -tLen * 0.4, -rTop - 0.02);
    tSpine.rotation.x = -1.1;
    tGroup.add(tSpine);

    prevTail.add(tGroup);
    tailSegments.push(tGroup);
    prevTail = tGroup;
  }

  // Bladed Tail Fluke / Spade (Arrowhead dragon blade on tail tip)
  const tailSpadeShape = new THREE.Shape();
  tailSpadeShape.moveTo(0, 0);
  tailSpadeShape.lineTo(0.24, -0.28);
  tailSpadeShape.lineTo(0.08, -0.55);
  tailSpadeShape.lineTo(0, -0.42);
  tailSpadeShape.lineTo(-0.08, -0.55);
  tailSpadeShape.lineTo(-0.24, -0.28);
  tailSpadeShape.closePath();

  const spadeGeo = new THREE.ExtrudeGeometry(tailSpadeShape, { depth: 0.03, bevelEnabled: false });
  const tailSpade = new THREE.Mesh(spadeGeo, matDragonHorn);
  tailSpade.position.set(0, -0.2, 0);
  tailSegments[numTailSegs - 1].add(tailSpade);

  // 6. Articulated Forelegs & Hindlegs with Talons
  [-1, 1].forEach(side => {
    // Foreleg
    const fLeg = new THREE.Group();
    fLeg.position.set(side * 0.48, 0.1, 0.15);

    const fUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.45, 8), matDragonSkin);
    fUpper.position.set(0, -0.2, 0);
    fUpper.rotation.z = side * 0.25;
    fUpper.rotation.x = 0.3;
    fLeg.add(fUpper);

    const fLower = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.42, 8), matDragonSkin);
    fLower.position.set(side * 0.06, -0.48, 0.12);
    fLower.rotation.x = -0.4;
    fLeg.add(fLower);

    // 3 Talons
    for (let c = 0; c < 3; c++) {
      const claw = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.15, 6), matDragonClaw);
      claw.position.set(side * (0.04 + (c - 1) * 0.04), -0.68, 0.2 + (1 - Math.abs(c - 1)) * 0.04);
      claw.rotation.x = 0.8;
      claw.rotation.z = side * (c - 1) * 0.2;
      fLeg.add(claw);
    }
    dragonBody.add(fLeg);

    // Hindleg
    const hLeg = new THREE.Group();
    hLeg.position.set(side * 0.45, -0.7, -0.1);

    const hThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.55, 8), matDragonSkin);
    hThigh.position.set(0, -0.24, 0);
    hThigh.rotation.z = side * 0.35;
    hThigh.rotation.x = -0.4;
    hLeg.add(hThigh);

    const hShin = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 0.5, 8), matDragonSkin);
    hShin.position.set(side * 0.08, -0.58, -0.15);
    hShin.rotation.x = 0.5;
    hLeg.add(hShin);

    // Rear Talons
    for (let c = 0; c < 3; c++) {
      const claw = new THREE.Mesh(new THREE.ConeGeometry(0.024, 0.16, 6), matDragonClaw);
      claw.position.set(side * (0.06 + (c - 1) * 0.045), -0.82, -0.05 + (1 - Math.abs(c - 1)) * 0.04);
      claw.rotation.x = 0.6;
      hLeg.add(claw);
    }
    dragonBody.add(hLeg);
  });

  scene.add(dragonRoot);

  // ── Atmospheric Ambient Floating Embers ──
  const emberCount = 120;
  const emberGeo = new THREE.BufferGeometry();
  const emberPositions = new Float32Array(emberCount * 3);
  const emberVelocities = [];

  for (let i = 0; i < emberCount; i++) {
    emberPositions[i * 3 + 0] = (Math.random() - 0.5) * 14;
    emberPositions[i * 3 + 1] = (Math.random() - 0.5) * 10 - 2;
    emberPositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    emberVelocities.push({
      vx: (Math.random() - 0.5) * 0.015,
      vy: 0.01 + Math.random() * 0.025,
      vz: (Math.random() - 0.5) * 0.015,
      scale: 0.8 + Math.random() * 1.2,
      phase: Math.random() * Math.PI * 2,
    });
  }
  emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));

  const emberMat = new THREE.PointsMaterial({
    size: 0.18,
    map: fireParticleTex,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const emberPoints = new THREE.Points(emberGeo, emberMat);
  scene.add(emberPoints);

  // ── Dynamic Fire Breath Particle System ──
  const maxFire = 160;
  const fireGeo = new THREE.BufferGeometry();
  const firePos = new Float32Array(maxFire * 3);
  const fireSizes = new Float32Array(maxFire);
  const fireParticles = [];

  for (let i = 0; i < maxFire; i++) {
    firePos[i * 3 + 0] = 0;
    firePos[i * 3 + 1] = -100; // start hidden
    firePos[i * 3 + 2] = 0;
    fireSizes[i] = 0;
    fireParticles.push({
      active: false,
      life: 0,
      maxLife: 1,
      x: 0, y: 0, z: 0,
      vx: 0, vy: 0, vz: 0,
      size: 0.2,
    });
  }
  fireGeo.setAttribute('position', new THREE.BufferAttribute(firePos, 3));
  fireGeo.setAttribute('size', new THREE.BufferAttribute(fireSizes, 1));

  const fireMat = new THREE.PointsMaterial({
    size: 0.65,
    map: fireParticleTex,
    transparent: true,
    opacity: 0.95,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const fireMesh = new THREE.Points(fireGeo, fireMat);
  scene.add(fireMesh);

  // ── Interactive Roar & Fire Breath State ──
  let isRoaring = false;
  let roarTimer = 0;
  const ROAR_DURATION = 2.4;

  function triggerFireBreath() {
    isRoaring = true;
    roarTimer = ROAR_DURATION;
  }

  // Trigger fire breath on clicking hero area
  window.addEventListener('pointerdown', (e) => {
    // Avoid triggering if user clicked a link or button
    if (e.target.closest('a, button, input, textarea')) return;
    triggerFireBreath();
  });

  // ── Mouse Tracking & Parallax ──
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;

  window.addEventListener('pointermove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // ── Responsive Layout & Sizing ──
  function resize() {
    const w = container.clientWidth || window.innerWidth || 1;
    const h = container.clientHeight || window.innerHeight || 1;
    const aspect = w / h;

    renderer.setSize(w, h);
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    if (aspect > 1.1) {
      // Desktop: place majestically on right side to frame text beautifully
      dragonRoot.position.set(Math.min(2.2, aspect * 1.15), -0.2, 0);
      dragonRoot.scale.setScalar(1.0);
    } else {
      // Mobile / Tablet: center dragon slightly higher
      dragonRoot.position.set(0, 0.1, 0);
      dragonRoot.scale.setScalar(aspect < 0.7 ? 0.72 : 0.88);
    }
  }
  resize();

  if ('ResizeObserver' in window) {
    new ResizeObserver(resize).observe(container);
  } else {
    window.addEventListener('resize', resize);
  }

  // ── Dark / Light Theme Dynamic Sync ──
  const themeObserver = new MutationObserver(() => {
    const light = document.documentElement.getAttribute('data-theme') === 'light';
    const c = light ? dragonColors.light : dragonColors.dark;
    matDragonSkin.color.setHex(c.skin);
    matDragonBelly.color.setHex(c.belly);
    matDragonHorn.color.setHex(c.horn);
    matDragonSpine.color.setHex(c.spine);
    matDragonWing.color.setHex(c.wing);
    matDragonClaw.color.setHex(c.claw);
    matDragonEye.color.setHex(c.eye);
    keyLight.color.setHex(light ? 0xcc4422 : 0xff6a3d);
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // ── Animation Loop ──
  const clock = new THREE.Clock();
  let running = true;
  let raf = null;

  function tick() {
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;

    // Smooth Mouse Interpolation (Lerp)
    mouseX += (targetMouseX - mouseX) * 0.06;
    mouseY += (targetMouseY - mouseY) * 0.06;

    // 1. Dragon Root Swaying, Soaring & Parallax
    dragonRoot.rotation.y = Math.sin(t * 0.6) * 0.08 + mouseX * 0.35 - 0.25;
    dragonRoot.rotation.x = Math.sin(t * 0.8) * 0.05 - mouseY * 0.22 + 0.05;
    dragonRoot.rotation.z = Math.sin(t * 0.5) * 0.04 - mouseX * 0.15;
    dragonRoot.position.y += (Math.sin(t * 1.2) * 0.12 - dragonRoot.position.y * 0.05) * 0.05;

    // Rhythmic Breathing Chest expansion
    const breath = Math.sin(t * 1.8);
    chestMesh.scale.x = 0.95 + breath * 0.035;
    chestMesh.scale.z = 0.80 + breath * 0.04;

    // 2. Articulated Serpentine Neck & Head Inverse-Kinematics Lag
    const headTargetYaw = mouseX * 0.75 - 0.2;
    const headTargetPitch = -mouseY * 0.45;

    for (let i = 0; i < numNeckSegs; i++) {
      const seg = neckSegments[i];
      const frac = (i + 1) / numNeckSegs;
      const phaseOffset = i * 0.15;
      seg.rotation.y = headTargetYaw * (frac * 0.5) + Math.sin(t * 1.5 - phaseOffset) * 0.04;
      seg.rotation.x = headTargetPitch * (frac * 0.4) + Math.cos(t * 1.3 - phaseOffset) * 0.03;
      seg.rotation.z = -headTargetYaw * (frac * 0.2);
    }

    headGroup.rotation.y = headTargetYaw * 0.65;
    headGroup.rotation.x = headTargetPitch * 0.55;

    // 3. Realistic Multi-Joint Wing Flap Cycles
    const flapSpeed = isRoaring ? 4.2 : 2.0;
    const flapPhase = t * flapSpeed;
    const flapCycle = Math.sin(flapPhase);
    const flapLag = Math.cos(flapPhase);

    wings.forEach(w => {
      const s = w.isLeft ? -1 : 1;

      if (isRoaring) {
        // Spread wings wide during roar
        w.shoulder.rotation.z = s * (0.2 + Math.sin(t * 3) * 0.15);
        w.shoulder.rotation.x = -0.35;
        w.shoulder.rotation.y = s * 0.4;
        w.elbow.rotation.z = s * 0.3;
      } else {
        // Natural aerodynamic wing stroke
        w.shoulder.rotation.z = s * (flapCycle * 0.42 + 0.1);
        w.shoulder.rotation.x = flapLag * 0.2 - 0.08;
        w.shoulder.rotation.y = s * (flapLag * 0.15 + 0.12);

        // Elbow flexes with phase delay
        w.elbow.rotation.z = s * (Math.sin(flapPhase - 0.6) * 0.35 + 0.15);
        w.wrist.rotation.z = s * (Math.sin(flapPhase - 1.1) * 0.25);

        // Finger spars billow & cup air
        w.digits.forEach((d, idx) => {
          d.rotation.x = Math.sin(flapPhase - 0.8 - idx * 0.2) * 0.12;
        });
      }
    });

    // 4. Undulating Serpentine Tail Wave Physics
    for (let i = 0; i < numTailSegs; i++) {
      const seg = tailSegments[i];
      const iFrac = (i + 1) / numTailSegs;
      const wavePhase = t * 2.2 - i * 0.42;
      seg.rotation.y = Math.sin(wavePhase) * 0.14 * (0.6 + iFrac * 0.8) + mouseX * 0.08;
      seg.rotation.x = Math.cos(wavePhase * 0.8) * 0.07 * (0.5 + iFrac * 0.7) + (mouseY * 0.06);
      seg.rotation.z = Math.sin(wavePhase * 0.5) * 0.04;
    }

    // 5. Fire Breath & Roar Mechanics
    if (roarTimer > 0) {
      roarTimer -= dt;
      const roarProgress = 1 - roarTimer / ROAR_DURATION;

      // Open lower jaw wide
      const openAmount = Math.sin(roarProgress * Math.PI);
      lowerJaw.rotation.x = openAmount * 0.65;

      // Flare throat light
      throatLight.intensity = openAmount * 7.5;
      bellyGlow.intensity = 1.2 + openAmount * 3.0;

      // Emit fire particles from snout
      const snoutWorldPos = new THREE.Vector3();
      snout.getWorldPosition(snoutWorldPos);

      const headForward = new THREE.Vector3(0, 0, 1).applyQuaternion(headGroup.getWorldQuaternion(new THREE.Quaternion()));

      for (let k = 0; k < 4; k++) {
        // Find inactive particle
        const p = fireParticles.find(pt => !pt.active);
        if (p) {
          p.active = true;
          p.life = 0;
          p.maxLife = 0.8 + Math.random() * 0.6;
          p.x = snoutWorldPos.x + (Math.random() - 0.5) * 0.15;
          p.y = snoutWorldPos.y + (Math.random() - 0.5) * 0.15;
          p.z = snoutWorldPos.z + (Math.random() - 0.5) * 0.15;

          const speed = 4.5 + Math.random() * 3.5;
          const spread = 0.35;
          p.vx = (headForward.x + (Math.random() - 0.5) * spread) * speed;
          p.vy = (headForward.y + (Math.random() - 0.5) * spread) * speed;
          p.vz = (headForward.z + (Math.random() - 0.5) * spread) * speed;
          p.size = 0.3 + Math.random() * 0.3;
        }
      }
    } else {
      isRoaring = false;
      lowerJaw.rotation.x = Math.max(0, lowerJaw.rotation.x - dt * 2.5);
      throatLight.intensity = Math.max(0.2, throatLight.intensity - dt * 4.0);
      bellyGlow.intensity = 1.2;
    }

    // 6. Update Fire Particles
    const fPosAttr = fireGeo.attributes.position;
    const fSizeAttr = fireGeo.attributes.size;

    fireParticles.forEach((p, idx) => {
      if (p.active) {
        p.life += dt;
        if (p.life >= p.maxLife) {
          p.active = false;
          fPosAttr.setXYZ(idx, 0, -100, 0);
          fSizeAttr.setX(idx, 0);
        } else {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.z += p.vz * dt;
          p.vx *= 0.96;
          p.vy += 0.8 * dt; // Fire rises
          p.vz *= 0.96;

          const prog = p.life / p.maxLife;
          const curSize = p.size * (1 + prog * 2.5) * (1 - prog * 0.4);

          fPosAttr.setXYZ(idx, p.x, p.y, p.z);
          fSizeAttr.setX(idx, curSize);
        }
      }
    });
    fPosAttr.needsUpdate = true;
    fSizeAttr.needsUpdate = true;

    // 7. Update Ambient Embers
    const ePosAttr = emberGeo.attributes.position;
    const eArr = ePosAttr.array;

    for (let i = 0; i < emberCount; i++) {
      const v = emberVelocities[i];
      eArr[i * 3 + 1] += v.vy;
      eArr[i * 3 + 0] += Math.sin(t * 1.5 + v.phase) * 0.008 + v.vx;
      eArr[i * 3 + 2] += Math.cos(t * 1.5 + v.phase) * 0.008 + v.vz;

      // Respawn when too high
      if (eArr[i * 3 + 1] > 6) {
        eArr[i * 3 + 1] = -5;
        eArr[i * 3 + 0] = (Math.random() - 0.5) * 14;
        eArr[i * 3 + 2] = (Math.random() - 0.5) * 8;
      }
    }
    ePosAttr.needsUpdate = true;

    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }

  if (prefersReduced) {
    dragonRoot.rotation.set(0.1, 0.25, 0);
    headGroup.rotation.y = 0.2;
    renderer.render(scene, camera);
    running = false;
  } else {
    raf = requestAnimationFrame(tick);
  }

  // Pause loop when scrolled offscreen
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!running && !prefersReduced) {
          running = true;
          clock.getDelta();
          raf = requestAnimationFrame(tick);
        }
      } else if (running) {
        running = false;
        if (raf) cancelAnimationFrame(raf);
      }
    }, { threshold: 0.05 });
    io.observe(container);
  }
})();
