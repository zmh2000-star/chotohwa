/* ============================================
   이스터에그 인터랙션
   초토화 포트폴리오 2026
   ============================================ */

function initEasterEggs() {
  // ─── 1. 코나미 코드 (↑↑↓↓←→←→BA) ───
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.code === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        activateKonamiEgg();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  function activateKonamiEgg() {
    // 화면에 불꽃 폭발 효과
    const explosion = document.createElement('div');
    explosion.style.cssText = `
      position: fixed; inset: 0; z-index: 10000;
      display: flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.9);
      animation: fadeIn 0.3s ease;
    `;
    explosion.innerHTML = `
      <div style="text-align: center; animation: slideUp 0.5s ease;">
        <div style="font-size: 6rem; margin-bottom: 1rem;">🔥🔥🔥</div>
        <h2 style="font-family: var(--font-heading-en); font-size: 2rem; background: var(--fire-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          SECRET UNLOCKED!
        </h2>
        <p style="color: var(--text-secondary); margin-top: 1rem; font-size: 1rem;">
          당신은 진정한 탐험가입니다. 🕵️<br>
          초토화의 비밀 무기를 발견했습니다!
        </p>
        <p style="color: var(--text-dim); margin-top: 2rem; font-size: 0.8rem;">
          클릭하면 닫힙니다
        </p>
      </div>
    `;

    explosion.addEventListener('click', () => {
      explosion.style.opacity = '0';
      setTimeout(() => explosion.remove(), 300);
    });

    document.body.appendChild(explosion);

    // 3초 후 자동 닫기
    setTimeout(() => {
      if (explosion.parentNode) {
        explosion.style.opacity = '0';
        setTimeout(() => explosion.remove(), 300);
      }
    }, 5000);
  }

  // ─── 2. 로고 더블클릭 이스터에그 ───
  const logo = document.getElementById('navLogo');
  if (logo) {
    let clickCount = 0;
    let clickTimer = null;

    logo.addEventListener('click', (e) => {
      clickCount++;
      if (clickCount === 5) {
        e.preventDefault();
        clickCount = 0;
        clearTimeout(clickTimer);

        // 페이지 색상 반전 효과 (2초)
        document.body.style.filter = 'invert(1) hue-rotate(180deg)';
        setTimeout(() => {
          document.body.style.filter = '';
        }, 2000);
      }
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 1000);
    });
  }

  // ─── 3. 'ㅊㅌㅎ' or 'cth' 입력 시 효과 ───
  let secretBuffer = '';

  document.addEventListener('keypress', (e) => {
    secretBuffer += e.key;

    // 최근 3글자만 유지
    if (secretBuffer.length > 10) {
      secretBuffer = secretBuffer.slice(-10);
    }

    if (secretBuffer.includes('cth') || secretBuffer.includes('fire')) {
      secretBuffer = '';

      // 불꽃 파티클 쏟아지기
      for (let i = 0; i < 30; i++) {
        createFireParticle();
      }
    }
  });

  function createFireParticle() {
    const particle = document.createElement('div');
    const x = Math.random() * window.innerWidth;
    const emoji = ['🔥', '✨', '💥', '⚡'][Math.floor(Math.random() * 4)];

    particle.textContent = emoji;
    particle.style.cssText = `
      position: fixed;
      top: -20px;
      left: ${x}px;
      font-size: ${Math.random() * 20 + 15}px;
      pointer-events: none;
      z-index: 10000;
      animation: particleFall ${Math.random() * 2 + 1.5}s ease-in forwards;
    `;

    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 3000);
  }

  // 파티클 떨어지기 애니메이션 (동적 추가)
  if (!document.getElementById('easterEggStyles')) {
    const style = document.createElement('style');
    style.id = 'easterEggStyles';
    style.textContent = `
      @keyframes particleFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(${window.innerHeight + 50}px) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

// DOM 로드 후 초기화
document.addEventListener('DOMContentLoaded', initEasterEggs);
