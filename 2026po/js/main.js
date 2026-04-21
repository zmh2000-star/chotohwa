/* ============================================
   메인 앱 로직
   초토화 포트폴리오 2026
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── 1. 로딩 화면 (고도화) ───
  function initLoader() {
    const loader = document.getElementById('loader');
    const loaderCount = document.getElementById('loaderCount');
    const loaderBar = document.getElementById('loaderBar');
    if (!loader) return;

    // 퍼센트 카운트업
    let progress = 0;
    const countInterval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress > 100) progress = 100;
      
      if (loaderCount) loaderCount.textContent = Math.round(progress) + '%';
      if (loaderBar) loaderBar.style.width = progress + '%';
      
      if (progress >= 100) clearInterval(countInterval);
    }, 150);

    window.addEventListener('load', () => {
      // 카운트 100%로 마무리
      if (loaderCount) loaderCount.textContent = '100%';
      if (loaderBar) loaderBar.style.width = '100%';
      
      setTimeout(() => {
        loader.classList.add('loader--hidden');
        // 로딩 끝나면 히어로 등장 시퀀스 시작
        setTimeout(() => {
          initHeroEntrance();
          initHeroTyping();
        }, 200);
      }, 600);
    });
  }

  // ─── 1.5 히어로 등장 시퀀스 (Staggered Reveal) ───
  function initHeroEntrance() {
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1) 라벨 라인 (좌→우 슬라이드인)
    tl.to('[data-hero-anim="label"]', {
      opacity: 1,
      x: 0,
      duration: 0.6,
    }, 0);

    // 3) "초토화" (스케일업 + 글로우)
    tl.to('[data-hero-anim="main"]', {
      y: 0,
      duration: 0.9,
      ease: 'power4.out',
    }, 0.4);

    // 4) "CHOTOHWA" (페이드업)
    tl.to('[data-hero-anim="en"]', {
      y: 0,
      duration: 0.6,
    }, 0.7);

    // 5) 서브타이틀+타이핑 영역
    tl.to('[data-hero-anim="subtitle"]', {
      opacity: 1,
      duration: 0.5,
    }, 1.0);

    // 6) CTA 버튼
    tl.to('[data-hero-anim="cta"]', {
      opacity: 1,
      y: 0,
      duration: 0.6,
    }, 1.2);

    // 7) 플로팅 스탯 배지 (순차적)
    const statBadges = document.querySelectorAll('[data-hero-anim="stat"]');
    statBadges.forEach((badge, i) => {
      tl.to(badge, {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: 'power2.out',
      }, 1.0 + i * 0.15);
    });
  }

  // ─── 2. 히어로 타이핑 효과 ───
  function initHeroTyping() {
    const typingEl = document.getElementById('heroTyping');
    if (!typingEl) return;

    const phrases = [
      '기획하고, 디자인하고, 개발하고, AI로 완성하다.',
      '장명환, 15년의 여정 하나로.',
      'AI와 함께하는 1인 군단.',
      '전자세계 초토화.'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentText = '';

    function type() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        currentText = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
      } else {
        currentText = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
      }

      typingEl.textContent = currentText;

      let delay = isDeleting ? 30 : 60;

      if (!isDeleting && charIndex === currentPhrase.length) {
        delay = 3000; // 완성 후 대기
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 500;
      }

      setTimeout(type, delay);
    }

    type();
  }

  // ─── 3. 커스텀 커서 (Phase 4: 마그네틱 + 상태 반응) ───
  function initCustomCursor() {
    const cursor = document.getElementById('cursor');
    const glowBg = document.getElementById('glowBg');

    if (!cursor) return;

    // 터치 디바이스 감지 → 커서 비활성화
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      cursor.style.display = 'none';
      if (glowBg) glowBg.style.display = 'none';
      return;
    }

    let cursorX = 0, cursorY = 0;
    let clientX = 0, clientY = 0;

    document.addEventListener('mousemove', (e) => {
      clientX = e.clientX;
      clientY = e.clientY;
    });

    // 부드러운 따라가기
    function animateCursor() {
      cursorX += (clientX - cursorX) * 0.45;
      cursorY += (clientY - cursorY) * 0.45;

      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';

      if (glowBg) {
        glowBg.style.left = clientX + 'px';
        glowBg.style.top = clientY + 'px';
      }

      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // 이벤트 위임 방식으로 호버 감지 (동적 생성된 카드도 대응)
    document.addEventListener('mouseover', (e) => {
      const hoverEl = e.target.closest('a, button, .card, .filter-tab, .timeline__item, .social-link, .modal__link, .modal__tech-badge');
      const textEl = e.target.closest('p, .about__desc, .modal__desc, .purples__role-desc');
      
      if (hoverEl) {
        cursor.classList.add('cursor--hover');
        cursor.classList.remove('cursor--text');
      } else if (textEl) {
        cursor.classList.add('cursor--text');
        cursor.classList.remove('cursor--hover');
      } else {
        cursor.classList.remove('cursor--hover', 'cursor--text');
      }
    });

    // 클릭 반응
    document.addEventListener('mousedown', () => cursor.classList.add('cursor--click'));
    document.addEventListener('mouseup', () => cursor.classList.remove('cursor--click'));

    // 마그네틱 효과 (data-magnetic 속성 대상)
    document.querySelectorAll('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });

    // body 커서 숨기기
    document.body.style.cursor = 'none';
    const styleSheet = document.createElement('style');
    styleSheet.textContent = '*, *::before, *::after { cursor: none !important; }';
    document.head.appendChild(styleSheet);
  }

  // ─── 3.5. GSAP 섹션 전환 연출 (Phase 4) ───
  function initSectionTransitions() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // 각 섹션의 .section__header에 프리미엄 등장 애니메이션
    document.querySelectorAll('.section__header').forEach(header => {
      const label = header.querySelector('.section__label');
      const title = header.querySelector('.section__title');
      const subtitle = header.querySelector('.section__subtitle');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: header,
          start: 'top 80%',
          once: true
        }
      });

      if (label) {
        tl.fromTo(label, 
          { opacity: 0, x: -30 }, 
          { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }, 
          0
        );
      }
      if (title) {
        tl.fromTo(title, 
          { opacity: 0, y: 30, clipPath: 'inset(100% 0 0 0)' }, 
          { opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)', duration: 0.8, ease: 'power3.out' }, 
          0.2
        );
      }
      if (subtitle) {
        tl.fromTo(subtitle, 
          { opacity: 0, y: 15 }, 
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 
          0.5
        );
      }
    });

    // 카드 stagger 등장
    document.querySelectorAll('.grid').forEach(grid => {
      const cards = grid.querySelectorAll('.card, .skills__category, .vision__manifesto-item');
      if (cards.length === 0) return;

      gsap.fromTo(cards,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            once: true
          }
        }
      );
    });

    // 퍼플스 성과 카드 stagger
    const purplesCards = document.querySelectorAll('.purples__achievement-card, .purples__role-card');
    if (purplesCards.length > 0) {
      gsap.fromTo(purplesCards,
        { opacity: 0, y: 30, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: 'back.out(1.2)',
          scrollTrigger: {
            trigger: purplesCards[0].closest('.section, .purples__achievements'),
            start: 'top 80%',
            once: true
          }
        }
      );
    }

    // 마일스톤 타임라인 순차 등장
    const milestones = document.querySelectorAll('.purples__milestone');
    if (milestones.length > 0) {
      gsap.fromTo(milestones,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: milestones[0].closest('.purples__milestone-track'),
            start: 'top 85%',
            once: true
          }
        }
      );
    }
  }

  // ─── 4. 모바일 메뉴 ───
  function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('nav__hamburger--active');
      mobileMenu.classList.toggle('mobile-menu--active');
      document.body.style.overflow = mobileMenu.classList.contains('mobile-menu--active') ? 'hidden' : '';
    });

    // 메뉴 링크 클릭 → 닫기
    mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('nav__hamburger--active');
        mobileMenu.classList.remove('mobile-menu--active');
        document.body.style.overflow = '';
      });
    });
  }

  // ─── 5. 네비게이션 링크 부드러운 스크롤 ───
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);

        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // ─── 6. 사이드 인디케이터 도트 클릭 ───
  function initSideIndicator() {
    const dots = document.querySelectorAll('.side-indicator__dot');
    const sections = ['hero', 'about', 'career', 'projects', 'skills', 'vision', 'contact'];

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        const target = document.getElementById(sections[i]);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ─── 전체 초기화 ───
  initLoader();
  initCustomCursor();
  initMobileMenu();
  initSmoothScroll();
  initSideIndicator();
  initSectionTransitions();

  // 로더 미완료 대비 타이머
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader && !loader.classList.contains('loader--hidden')) {
      loader.classList.add('loader--hidden');
      initHeroEntrance();
      initHeroTyping();
    }
  }, 3000);

});
