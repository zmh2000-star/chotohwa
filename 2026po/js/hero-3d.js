/* ============================================
   Three.js 히어로 파티클 씬
   초토화 포트폴리오 2026
   ============================================ */

function initHero3D() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // 씬 설정
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 50;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 파티클 시스템
  const particleCount = 2000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const velocities = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;

    // 랜덤 위치 (구 형태로 분포)
    const radius = 40 + Math.random() * 40;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi) - 30;

    // 색상 (레드 → 오렌지 그래디언트)
    const t = Math.random();
    colors[i3] = 1.0;
    colors[i3 + 1] = t * 0.4;
    colors[i3 + 2] = t * 0.1;

    // 크기
    sizes[i] = Math.random() * 2 + 0.5;

    // 속도
    velocities[i3] = (Math.random() - 0.5) * 0.02;
    velocities[i3 + 1] = (Math.random() - 0.5) * 0.02;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // 파티클 머터리얼
  const material = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // 연결선 (가까운 파티클 끼리)
  // 성능을 위해 연결선은 적은 수만 사용
  const lineGeometry = new THREE.BufferGeometry();
  const lineCount = 100;
  const linePositions = new Float32Array(lineCount * 6);
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xFF3333,
    transparent: true,
    opacity: 0.1,
    blending: THREE.AdditiveBlending
  });

  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);

  // 마우스 인터랙션
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // 스크롤 연동 — 스크롤에 따라 색상 변경
  let scrollProgress = 0;

  window.addEventListener('scroll', () => {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;

    const rect = heroSection.getBoundingClientRect();
    scrollProgress = Math.max(0, Math.min(1, -rect.top / rect.height));
  });

  // 애니메이션 루프
  let time = 0;

  function animate() {
    requestAnimationFrame(animate);
    time += 0.001;

    // 마우스 따라가기 (부드럽게)
    targetX += (mouseX * 5 - targetX) * 0.02;
    targetY += (mouseY * 5 - targetY) * 0.02;

    particles.rotation.x = targetY * 0.1 + time * 0.5;
    particles.rotation.y = targetX * 0.1 + time * 0.3;

    // 파티클 움직임
    const pos = geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      pos[i3] += velocities[i3] + Math.sin(time + i) * 0.01;
      pos[i3 + 1] += velocities[i3 + 1] + Math.cos(time + i) * 0.01;
      pos[i3 + 2] += velocities[i3 + 2];

      // 범위 밖 파티클 리셋
      const dist = Math.sqrt(pos[i3] ** 2 + pos[i3 + 1] ** 2 + pos[i3 + 2] ** 2);
      if (dist > 100) {
        pos[i3] *= 0.5;
        pos[i3 + 1] *= 0.5;
        pos[i3 + 2] *= 0.5;
      }
    }
    geometry.attributes.position.needsUpdate = true;

    // 스크롤에 따른 효과
    material.opacity = 0.6 - scrollProgress * 0.4;
    particles.scale.setScalar(1 + scrollProgress * 0.5);

    // 연결선 업데이트 (간헐적으로)
    if (Math.floor(time * 100) % 5 === 0) {
      updateLines(pos);
    }

    renderer.render(scene, camera);
  }

  function updateLines(positions) {
    const linePos = lineGeometry.attributes.position.array;
    let lineIndex = 0;

    for (let i = 0; i < Math.min(200, particleCount); i++) {
      if (lineIndex >= lineCount * 6) break;

      for (let j = i + 1; j < Math.min(200, particleCount); j++) {
        if (lineIndex >= lineCount * 6) break;

        const i3 = i * 3;
        const j3 = j * 3;
        const dx = positions[i3] - positions[j3];
        const dy = positions[i3 + 1] - positions[j3 + 1];
        const dz = positions[i3 + 2] - positions[j3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 15) {
          linePos[lineIndex++] = positions[i3];
          linePos[lineIndex++] = positions[i3 + 1];
          linePos[lineIndex++] = positions[i3 + 2];
          linePos[lineIndex++] = positions[j3];
          linePos[lineIndex++] = positions[j3 + 1];
          linePos[lineIndex++] = positions[j3 + 2];
        }
      }
    }

    // 남은 라인 초기화
    for (let i = lineIndex; i < lineCount * 6; i++) {
      linePos[i] = 0;
    }

    lineGeometry.attributes.position.needsUpdate = true;
  }

  // 리사이즈 대응
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
}

// DOM 로드 후 초기화
window.addEventListener('load', () => {
  // Three.js 로드 확인 후 실행
  if (typeof THREE !== 'undefined') {
    initHero3D();
  }
});
