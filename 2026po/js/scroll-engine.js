/* ============================================
   GSAP ScrollTrigger 관리
   초토화 포트폴리오 2026
   ============================================ */

function initScrollEngine() {
  // GSAP 로드 여부 확인
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('[초토화] GSAP/ScrollTrigger 미로드 → CSS 폴백 적용');
    // 폴백: 즉시 모든 요소 보이기
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('reveal--visible');
    });
    return;
  }

  console.log('[초토화] GSAP ScrollTrigger 초기화 시작');
  gsap.registerPlugin(ScrollTrigger);

  // ─── 1. 스크롤 등장 (Reveal) 애니메이션 ───
  function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    console.log(`[초토화] Reveal 대상: ${reveals.length}개`);

    reveals.forEach((el) => {
      // 방향별 시작/종료 상태 결정
      let fromVars = { opacity: 0, y: 40 };
      let toVars = { opacity: 1, y: 0 };

      if (el.classList.contains('reveal--left')) {
        fromVars = { opacity: 0, x: -40 };
        toVars = { opacity: 1, x: 0 };
      } else if (el.classList.contains('reveal--right')) {
        fromVars = { opacity: 0, x: 40 };
        toVars = { opacity: 1, x: 0 };
      } else if (el.classList.contains('reveal--scale')) {
        fromVars = { opacity: 0, scale: 0.9 };
        toVars = { opacity: 1, scale: 1 };
      }

      // gsap.fromTo 사용으로 CSS 충돌 방지
      gsap.fromTo(el, fromVars, {
        ...toVars,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          end: 'top 50%',
          toggleActions: 'play none none reverse',
        }
      });
    });
  }

  // ─── 2. 히어로 풀스크린 패럴랙스 ───
  function initHeroParallax() {
    const heroBg = document.getElementById('heroBgPhoto');
    const heroTextArea = document.getElementById('heroTextArea');
    const heroScroll = document.getElementById('heroScroll');
    const heroStatsFloat = document.getElementById('heroStatsFloat');

    // 배경 사진: 스크롤 시 어두워지며 Ken Burns 중단 → GSAP 확대
    if (heroBg) {
      gsap.to(heroBg, {
        filter: 'brightness(0.2) saturate(0.6)',
        scale: 1.1,
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 2,
        }
      });
    }

    // 텍스트: 스크롤 시 위로 사라짐
    if (heroTextArea) {
      gsap.to(heroTextArea, {
        y: -80,
        opacity: 0,
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: '50% top',
          scrub: 1,
        }
      });
    }

    // 플로팅 배지: 텍스트보다 느리게 사라짐 (차별 패럴랙스)
    if (heroStatsFloat) {
      gsap.to(heroStatsFloat, {
        y: -40,
        opacity: 0,
        scrollTrigger: {
          trigger: '#hero',
          start: '5% top',
          end: '45% top',
          scrub: 1.5,
        }
      });
    }

    // 스크롤 유도: 빠르게 사라짐
    if (heroScroll) {
      gsap.to(heroScroll, {
        opacity: 0,
        scrollTrigger: {
          trigger: '#hero',
          start: '8% top',
          end: '20% top',
          scrub: true,
        }
      });
    }
  }

  // ─── 3. 커리어 타임라인 (가로 스크롤 핀) ───
  function initTimelineScroll() {
    const wrapper = document.getElementById('timelineWrapper');
    const track = document.getElementById('timelineTrack');

    if (!wrapper || !track) return;

    // 가로 스크롤 범위 계산
    const getScrollAmount = () => {
      return track.scrollWidth - wrapper.clientWidth;
    };

    gsap.to(track, {
      x: () => -getScrollAmount(),
      ease: 'none',
      scrollTrigger: {
        trigger: wrapper,
        start: 'top 20%',
        end: () => `+=${getScrollAmount()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      }
    });

    // 타임라인 아이템 순차 등장
    const items = track.querySelectorAll('.timeline__item');
    items.forEach((item, i) => {
      gsap.fromTo(item,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: i * 0.1,
          scrollTrigger: {
            trigger: wrapper,
            start: 'top 40%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    });
  }

  // ─── 4. 스킬 바 애니메이션 ───
  function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar__fill');

    skillBars.forEach(bar => {
      const targetWidth = bar.dataset.width;

      gsap.fromTo(bar,
        { width: '0%' },
        {
          width: `${targetWidth}%`,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: bar,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    });
  }

  // ─── 5. 카운트업 애니메이션 ───
  function initCountUp() {
    const counters = document.querySelectorAll('[data-count]');

    counters.forEach(counter => {
      const target = parseInt(counter.dataset.count);
      // stat 또는 purples 성과 카드의 라벨에서 접미사 결정
      const statLabel = counter.closest('.stat')?.querySelector('.stat__label')?.textContent || '';
      const purplesLabel = counter.closest('.purples__achievement-card')?.querySelector('.purples__achievement-label')?.textContent || '';
      const label = statLabel || purplesLabel;

      // 접미사 결정 (라벨 내 괄호 표기도 인식)
      let suffix = '+';
      if (label.includes('억')) suffix = '억+';
      else if (label.includes('배')) suffix = 'x';
      else if (label.includes('명') || label.includes('개') || label.includes('계열사')) suffix = '+';

      ScrollTrigger.create({
        trigger: counter,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo(counter,
            { innerText: 0 },
            {
              innerText: target,
              duration: 2,
              ease: 'power2.out',
              snap: { innerText: 1 },
              onUpdate: function() {
                const current = Math.round(parseFloat(counter.innerText));
                counter.innerText = current + suffix;
              }
            }
          );
        },
        once: true,
      });
    });
  }

  // ─── 6. 비전 섹션 입장 ───
  function initVisionSection() {
    const visionContent = document.querySelector('.vision__content');
    if (!visionContent) return;

    gsap.fromTo('.vision__title',
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#vision',
          start: 'top 50%',
          toggleActions: 'play none none reverse',
        }
      }
    );

    const manifestoItems = document.querySelectorAll('.vision__manifesto-item');
    manifestoItems.forEach((item, i) => {
      gsap.fromTo(item,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          delay: 0.3 + i * 0.2,
          scrollTrigger: {
            trigger: '#vision',
            start: 'top 40%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    });
  }

  // ─── 7. 네비게이션 스크롤 효과 + 진행률 바 ───
  function initNavScroll() {
    const nav = document.getElementById('nav');
    const navProgress = document.getElementById('navProgress');
    if (!nav) return;

    ScrollTrigger.create({
      start: 'top -80',
      end: 99999,
      toggleClass: {
        targets: nav,
        className: 'nav--scrolled'
      }
    });

    // 스크롤 진행률 바
    if (navProgress) {
      window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        navProgress.style.width = progress + '%';
      });
    }
  }

  // ─── 8. 사이드 인디케이터 ───
  function initSideIndicator() {
    const dots = document.querySelectorAll('.side-indicator__dot');
    const sections = ['hero', 'about', 'career', 'projects', 'skills', 'vision', 'contact'];

    sections.forEach((sectionId, i) => {
      const sectionEl = document.getElementById(sectionId);
      if (!sectionEl) return;

      ScrollTrigger.create({
        trigger: sectionEl,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => updateDot(i),
        onEnterBack: () => updateDot(i),
      });
    });

    function updateDot(activeIndex) {
      dots.forEach((dot, i) => {
        dot.classList.toggle('side-indicator__dot--active', i === activeIndex);
      });
    }

    // 도트 클릭 → 스크롤
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        const target = document.getElementById(sections[i]);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ─── 9. 카드 3D 틸트 효과 ───
  function initCardTilt() {
    // 터치 디바이스에서는 비활성화
    if ('ontouchstart' in window) return;

    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;
        
        card.style.transform = `translateY(-6px) perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ─── 10. Featured 카드 자동 적용 ───
  function initFeaturedCards() {
    // 성과 배지가 있는 카드에 featured 클래스 추가
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      const achievement = card.querySelector('.card__achievement');
      if (achievement) {
        card.classList.add('card--featured');
      }
    });
  }

  // ─── 섹션 타이틀 추가 등장 효과 ───
  function initSectionTitles() {
    document.querySelectorAll('.section__title').forEach(title => {
      // 이미 reveal로 처리되는 요소는 건너뛰기
      if (title.closest('.reveal')) return;

      gsap.fromTo(title,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: title,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    });
  }

  // 모든 초기화 실행
  initRevealAnimations();
  initHeroParallax();
  initTimelineScroll();
  initSkillBars();
  initCountUp();
  initVisionSection();
  initNavScroll();
  initSideIndicator();
  initSectionTitles();

  // DOM 완전 로드 후 실행 (프로젝트 카드가 JS로 생성되므로)
  setTimeout(() => {
    initCardTilt();
    initFeaturedCards();
  }, 500);

  // ScrollTrigger 새로고침 (이미지 로드 후)
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

  console.log('[초토화] GSAP ScrollTrigger 초기화 완료');
}

// ─── 초기화 시점 ───
// GSAP CDN 로드를 확실히 기다리기 위한 견고한 초기화
function bootScrollEngine() {
  // GSAP가 로드됐는지 확인
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    initScrollEngine();
  } else {
    // 200ms 간격으로 최대 5초간 재시도
    let attempts = 0;
    const maxAttempts = 25;
    const checkInterval = setInterval(() => {
      attempts++;
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        clearInterval(checkInterval);
        initScrollEngine();
      } else if (attempts >= maxAttempts) {
        clearInterval(checkInterval);
        console.warn('[초토화] GSAP 로드 타임아웃 → CSS 폴백 적용');
        document.querySelectorAll('.reveal').forEach(el => {
          el.classList.add('reveal--visible');
        });
      }
    }, 200);
  }
}

// DOM 로드 완료 후 부트
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootScrollEngine);
} else {
  // 이미 DOM 로드 완료라면 바로 실행
  bootScrollEngine();
}
