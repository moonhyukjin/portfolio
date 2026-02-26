import * as THREE from 'three';

export function initEarth() {
  const canvas = document.getElementById('earthCanvas');
  const scene = new THREE.Scene();
  const mouse = { x: 0, y: 0 };
  const targetMouse = { x: 0, y: 0 };

  // 지구 관련 메시를 하나의 그룹으로 관리
  // → GSAP은 이 그룹만 움직이면 earth/clouds/atmosphere 전부 같이 이동
  const group = new THREE.Group();
  scene.add(group);

  const camera = setupCamera();
  const renderer = setupRenderer(canvas);
  setupLights(scene);
  const stars = createStars(scene);
  const { earth, clouds } = createEarth(group);
  createAtmosphere(group);
  const { moon, moonPivot } = createMoon(group);
  setupEvents(camera, renderer, targetMouse);
  animate({ renderer, scene, camera, mouse, targetMouse, earth, clouds, stars, moon, moonPivot });

  return {
    mesh: group,
    cam: camera,
    moonOrbit: moonPivot,
  };
}

// ──────────────────────────────────────────────
// Setup
// ──────────────────────────────────────────────

function setupCamera() {
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.set(0, 0, 4.5);
  return camera;
}

function setupRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  return renderer;
}

function setupLights(scene) {
  scene.add(new THREE.AmbientLight(0x0d1a33, 1.5));

  const sun = new THREE.DirectionalLight(0xfff2e0, 3.5);
  sun.position.set(6, 2, 4);
  scene.add(sun);

  const rim = new THREE.DirectionalLight(0x1a44ff, 0.4);
  rim.position.set(-5, -2, -4);
  scene.add(rim);
}

// ──────────────────────────────────────────────
// Objects
// ──────────────────────────────────────────────

function createStars(scene) {
  const count = 5000;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 80 + Math.random() * 120;

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const stars = new THREE.Points(
    geo,
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.25, sizeAttenuation: true }),
  );
  // 별은 그룹 밖(scene 직접) — 스크롤해도 배경으로 고정
  scene.add(stars);
  return stars;
}

function createEarth(group) {
  const loader = new THREE.TextureLoader();

  const earthMaterial = new THREE.MeshPhongMaterial({
    color: 0x1a3a6b,
    emissive: 0x0a1a35,
    specular: 0x224466,
    shininess: 25,
  });

  loader.load('/textures/earth_daymap.jpg', (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    earthMaterial.map = tex;
    earthMaterial.color.setHex(0xffffff);
    earthMaterial.needsUpdate = true;
  });

  loader.load('/textures/earth_specular.jpg', (tex) => {
    earthMaterial.specularMap = tex;
    earthMaterial.specular.setHex(0x6688aa);
    earthMaterial.needsUpdate = true;
  });

  loader.load('/textures/earth_normal.jpg', (tex) => {
    earthMaterial.normalMap = tex;
    earthMaterial.normalScale.set(0.85, 0.85);
    earthMaterial.needsUpdate = true;
  });

  const earth = new THREE.Mesh(new THREE.SphereGeometry(1.5, 64, 64), earthMaterial);
  group.add(earth); // ← group에 추가

  // 구름
  const cloudMat = new THREE.MeshPhongMaterial({
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  loader.load('/textures/earth_clouds.png', (tex) => {
    cloudMat.map = tex;
    cloudMat.alphaMap = tex;
    cloudMat.opacity = 0.3;
    cloudMat.needsUpdate = true;
  });
  const clouds = new THREE.Mesh(new THREE.SphereGeometry(1.515, 64, 64), cloudMat);
  group.add(clouds); // ← group에 추가

  return { earth, clouds };
}

function createAtmosphere(group) {
  const vertexShader = /* glsl */ `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // 내부 대기권 글로우
  const innerMat = new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(0x00aaff) },
      intensity: { value: 1.0 },
    },
    vertexShader,
    fragmentShader: /* glsl */ `
      uniform vec3 glowColor;
      uniform float intensity;
      varying vec3 vNormal;
      void main() {
        float rim = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
        gl_FragColor = vec4(glowColor, rim * intensity);
      }
    `,
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  group.add(new THREE.Mesh(new THREE.SphereGeometry(1.55, 64, 64), innerMat)); // ← group

  // 외부 헤일로
  const outerMat = new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(0x0044bb) },
      intensity: { value: 1.0 },
    },
    vertexShader,
    fragmentShader: /* glsl */ `
      uniform vec3 glowColor;
      uniform float intensity;
      varying vec3 vNormal;
      void main() {
        float rim = pow(0.55 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.5);
        gl_FragColor = vec4(glowColor, clamp(rim, 0.0, 1.0) * intensity * 0.5);
      }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  group.add(new THREE.Mesh(new THREE.SphereGeometry(1.9, 64, 64), outerMat)); // ← group
}

function createMoon(group) {
  const loader = new THREE.TextureLoader();

  const moonMat = new THREE.MeshPhongMaterial({
    color: 0x888888,
    emissive: 0x111111,
    specular: 0x222222,
    shininess: 5,
  });

  loader.load('/textures/moon.jpg', (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    moonMat.map = tex;
    moonMat.color.setHex(0xffffff);
    moonMat.needsUpdate = true;
  });

  const moon = new THREE.Mesh(new THREE.SphereGeometry(0.27, 32, 32), moonMat);
  moon.position.set(2.6, 0, 0);

  // 달을 pivot으로 감싸서 궤도 회전
  const moonPivot = new THREE.Group();
  moonPivot.rotation.x = 0.18; // 궤도 약간 기울임
  moonPivot.add(moon);
  group.add(moonPivot);

  return { moon, moonPivot };
}

// ──────────────────────────────────────────────
// Events
// ──────────────────────────────────────────────

function setupEvents(camera, renderer, targetMouse) {
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  window.addEventListener('mousemove', (e) => {
    targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });
}

// ──────────────────────────────────────────────
// Animation loop
// ──────────────────────────────────────────────

function animate({ renderer, scene, camera, mouse, targetMouse, earth, clouds, stars, moon, moonPivot }) {
  requestAnimationFrame(() =>
    animate({ renderer, scene, camera, mouse, targetMouse, earth, clouds, stars, moon, moonPivot }),
  );

  // 마우스 lerp
  mouse.x += (targetMouse.x - mouse.x) * 0.04;
  mouse.y += (targetMouse.y - mouse.y) * 0.04;

  if (earth) {
    // 지구 자전 (group 기준 로컬 회전)
    earth.rotation.y += 0.0008;
    // 마우스 틸트
    earth.rotation.x += (mouse.y * 0.12 - earth.rotation.x) * 0.03;
    earth.rotation.z += (mouse.x * 0.04 - earth.rotation.z) * 0.03;
  }

  if (clouds) {
    // 구름은 지구보다 살짝 느리게 회전
    clouds.rotation.y += 0.0005;
  }

  if (stars) {
    stars.rotation.y += 0.00005;
  }

  if (moonPivot) {
    // 달 공전 (pivot 회전)
    moonPivot.rotation.y += 0.003;
  }

  if (moon) {
    // 달 자전 (공전과 같은 방향으로 느리게)
    moon.rotation.y += 0.001;
  }

  renderer.render(scene, camera);
}
