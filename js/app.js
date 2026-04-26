// 카카오/인앱 브라우저 뷰포트 높이 보정
function setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');
}
setVH();
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', () => setTimeout(setVH, 100));

document.addEventListener('DOMContentLoaded', () => {
    const videoContainer = document.getElementById('videoContainer');
    const introVideo = document.getElementById('introVideo');
    const mainContent = document.getElementById('mainContent');

    // 1. 모바일/PC 반응형 비디오 소스 주입
    function setupVideo() {
        const isMobile = window.innerWidth <= 768; // 768px 이하 모바일로 간주
        const sourceObj = document.createElement('source');
        
        // 기기에 따라 영상 분기처리
        sourceObj.src = isMobile ? 'movie/sero1.mp4' : 'movie/chotohwa_count_down2.mp4';
        sourceObj.type = 'video/mp4';
        
        introVideo.innerHTML = '';
        introVideo.appendChild(sourceObj);
        introVideo.load();
        
        // 비디오가 실제로 재생을 시작할 때 투명도를 해제하여 못생긴 로딩 화면 방지
        introVideo.addEventListener('playing', () => {
            introVideo.classList.add('is-playing');
        });
    }
    setupVideo();

    // 카운트다운 목표 날짜: 2026-09-01 15:00:00
    const targetDate = new Date('2026-09-01T15:00:00').getTime();

    // 2. 비디오 종료 시 시네마틱 트랜지션 (글리치 + 블러/아우라 모드)
    function endIntro() {
        // 이미 종료 처리되었으면 무시 (중복 실행 방지)
        if (introVideo.dataset.ended === 'true') return;
        introVideo.dataset.ended = 'true';

        // 스킵 버튼 숨기기
        const skipBtn = document.getElementById('skipIntroBtn');
        if (skipBtn) {
            skipBtn.classList.add('hidden');
        }

        // 영상 제거 대신, 커다란 블러 후광으로 변경하여 배경 요소로 재활용!
        gsap.to(introVideo, {
            scale: 1.1,         // 거대해지면서
            filter: 'blur(30px) brightness(0.3)', // 어둡고 뿌옇게 글리치 아우라 형성
            duration: 2.0,
            ease: "power2.out"
        });

        // 텍스트/카운트다운 컨텐츠 페이드인
        gsap.to(mainContent, {
            autoAlpha: 1,       // opacity 1, visibility visible
            duration: 2.0,
            delay: 0.2,
            ease: "power2.inOut"
        });
        
        // 메인 글래스 패널 내부 요소들 시네마틱 등장 효과
        gsap.from(".slogan, .target-date, .time-block, .time-divider, .teaser-video, .philosophy-btn-wrapper", {
            y: 50,
            rotationX: 15,
            opacity: 0,
            duration: 1.5,
            stagger: 0.15,
            delay: 0.5,
            ease: "back.out(1.2)"
        });

        // 스크롤 힌트 표시 (인트로 종료 2초 후)
        const scrollHint = document.getElementById('scrollHint');
        if (scrollHint) {
            setTimeout(() => {
                scrollHint.classList.add('is-visible');
            }, 2000);
        }

        // 티저 비디오 재생 (인트로 종료 후 컨텐츠가 나타날 때 처음부터 재생)
        const teaserVideo = document.getElementById('teaserVideo');
        if (teaserVideo) {
            teaserVideo.currentTime = 0;
            teaserVideo.play().then(() => {
                teaserVideo.classList.add('is-loaded');
            }).catch(e => {
                console.log('Auto-play prevented:', e);
                // 자동재생 차단 시에도 영상 표시
                teaserVideo.classList.add('is-loaded');
            });
        }
    }

    introVideo.addEventListener('ended', endIntro);

    // 스킵 버튼 클릭 이벤트
    const skipBtn = document.getElementById('skipIntroBtn');
    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            introVideo.pause(); // 비디오 정지
            endIntro();         // 트랜지션 즉시 실행
        });
    }

    // 스크롤 힌트 숨기기 (스크롤 시 자동 숨김)
    if (mainContent) {
        mainContent.addEventListener('scroll', () => {
            const scrollHint = document.getElementById('scrollHint');
            if (scrollHint && mainContent.scrollTop > 30) {
                scrollHint.classList.remove('is-visible');
            }
        });
    }

    // 3. SVG 프로그레스 링 세팅 및 카운트다운
    const r = 70;
    const circumference = 2 * Math.PI * r;

    // SVG 링들
    const rings = {
        days: document.getElementById('ring-days'),
        hours: document.getElementById('ring-hours'),
        mins: document.getElementById('ring-mins'),
        secs: document.getElementById('ring-secs'),
        ms: document.getElementById('ring-ms')
    };

    // 초기 대시 설정
    Object.values(rings).forEach(ring => {
        if(ring) {
            ring.style.strokeDasharray = `${circumference} ${circumference}`;
            ring.style.strokeDashoffset = circumference;
        }
    });

    function setProgress(ring, percent) {
        if(!ring) return;
        const offset = circumference - (percent / 100) * circumference;
        ring.style.strokeDashoffset = offset;
    }

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance <= 0) {
            document.querySelectorAll('.number').forEach(el => el.innerText = "00");
            return;
        }

        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);
        const ms = Math.floor((distance % 1000) / 10); // 0-99 (두 자리 밀리초)

        document.getElementById('days').innerText = d.toString().padStart(2, '0');
        document.getElementById('hours').innerText = h.toString().padStart(2, '0');
        document.getElementById('mins').innerText = m.toString().padStart(2, '0');
        document.getElementById('secs').innerText = s.toString().padStart(2, '0');
        document.getElementById('ms').innerText = ms.toString().padStart(2, '0');

        // 프로그레스 바 갱신 (예시: day는 365, hour/min/sec는 각 최대치 기준)
        setProgress(rings.days, (d / 365) * 100);
        setProgress(rings.hours, (h / 24) * 100);
        setProgress(rings.mins, (m / 60) * 100);
        setProgress(rings.secs, (s / 60) * 100);
        setProgress(rings.ms, ((distance % 1000) / 1000) * 100);

        // 60fps 부드러운 애니메이션 호출 (밀리초 단위 실시간 업데이트용)
        requestAnimationFrame(updateCountdown);
    }

    // 초 단위 setInterval 대신 requestAnimationFrame 사용 시작
    requestAnimationFrame(updateCountdown);

    // 4. 묵직한 3D 시네마틱 마우스 패럴랙스 효과 (데스크탑 위주)
    if (window.innerWidth > 768) {
        const tiltWrapper = document.getElementById('tiltWrapper');
        const bgImage = document.getElementById('bgImage');

        document.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 40;     // 기울기 강도 (글래스 패널)
            const yAxis = (window.innerHeight / 2 - e.pageY) / 40; 
            
            // 글래스 컴포넌트 3D 틸트
            gsap.to(tiltWrapper, {
                rotationY: xAxis,
                rotationX: yAxis,
                duration: 0.8,
                ease: "power2.out"
            });

            // 배경 이미지 미세한 반대 역동작 (깊이감 증가)
            const bgX = (e.pageX - window.innerWidth / 2) / 60;
            const bgY = (e.pageY - window.innerHeight / 2) / 60;
            gsap.to(bgImage, {
                x: bgX,
                y: bgY,
                duration: 1.5,
                ease: "power2.out"
            });
        });

        // 화면 밖으로 나갈 때 초기화
        document.addEventListener('mouseleave', () => {
            gsap.to(tiltWrapper, { rotationY: 0, rotationX: 0, duration: 1.2, ease: "power3.out" });
            gsap.to(bgImage, { x: 0, y: 0, duration: 1.2, ease: "power3.out" });
        });
    }

    // 5. Philosophy Modal Control
    const openPhilosophyBtn = document.getElementById('openPhilosophyBtn');
    const closePhilosophyBtn = document.getElementById('closePhilosophyBtn');
    const closePhilosophyBottomBtn = document.getElementById('closePhilosophyBottomBtn');
    const philosophyModal = document.getElementById('philosophyModal');

    if (openPhilosophyBtn && closePhilosophyBtn && philosophyModal) {
        const interactionFg = philosophyModal.querySelector('.interaction-fg');

        openPhilosophyBtn.addEventListener('click', () => {
            philosophyModal.classList.add('is-active');
            
            // GSAP 모달 내부 텍스트 순차적 페이드업 애니메이션
            gsap.fromTo(philosophyModal.querySelectorAll('.modal-title, .philosophy-section, .philosophy-interaction'), 
                { y: 30, opacity: 0 }, 
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 0.8, 
                    stagger: 0.15, 
                    ease: "power3.out", 
                    delay: 0.2,
                    onComplete: () => {
                        const interactionBanner = philosophyModal.querySelector('.philosophy-interaction');
                        if (interactionFg && interactionBanner) {
                            // 모달 애니메이션이 끝난 후, 배너가 화면에 보일 때 나타나게 설정
                            const observer = new IntersectionObserver((entries) => {
                                entries.forEach(entry => {
                                    if (entry.isIntersecting) {
                                        interactionFg.classList.add('active');
                                        observer.disconnect(); // 한 번 실행 후 해제
                                    }
                                });
                            }, { threshold: 0.5 }); // 배너가 50% 이상 보일 때 작동
                            
                            observer.observe(interactionBanner);
                            philosophyModal.interactionObserver = observer; // 닫을 때 해제하기 위해 저장
                        }
                    }
                }
            );
        });

        const closeModal = () => {
            philosophyModal.classList.remove('is-active');
            
            if (philosophyModal.interactionObserver) {
                philosophyModal.interactionObserver.disconnect();
                philosophyModal.interactionObserver = null;
            }

            if(interactionFg) {
                // Reset interaction for next open
                setTimeout(() => {
                    interactionFg.classList.remove('active');
                }, 300); // Wait for modal to hide
            }
        };

        closePhilosophyBtn.addEventListener('click', closeModal);
        if (closePhilosophyBottomBtn) closePhilosophyBottomBtn.addEventListener('click', closeModal);

        // Close modal when clicking outside the content area
        philosophyModal.addEventListener('click', (e) => {
            if (e.target === philosophyModal) {
                closeModal();
            }
        });
    }

    // 6. Webtoon Modal Control & Slider
    const openWebtoonBtn = document.getElementById('openWebtoonBtn');
    const closeWebtoonBtn = document.getElementById('closeWebtoonBtn');
    const webtoonModal = document.getElementById('webtoonModal');
    const webtoonSlider = document.getElementById('webtoonSlider');
    const webtoonPrevBtn = document.getElementById('webtoonPrevBtn');
    const webtoonNextBtn = document.getElementById('webtoonNextBtn');
    const webtoonPrevZone = document.getElementById('webtoonPrevZone');
    const webtoonNextZone = document.getElementById('webtoonNextZone');
    const webtoonCurrentPageEl = document.getElementById('webtoonCurrentPage');
    
    let currentWebtoonIndex = 0;
    const totalWebtoonPages = 5;

    const closeWebtoonModal = () => {
        if (webtoonModal) {
            webtoonModal.classList.remove('is-active');
        }
    };

    function updateWebtoonSlider() {
        if (!webtoonSlider) return;
        // 한 페이지당 -100% 씩 X축 이동하여 슬라이드 효과 구현
        const translateX = -(currentWebtoonIndex * 100);
        webtoonSlider.style.transform = `translateX(${translateX}%)`;
        if (webtoonCurrentPageEl) {
            webtoonCurrentPageEl.innerText = currentWebtoonIndex + 1;
        }
    }

    function nextWebtoonPage() {
        if (currentWebtoonIndex < totalWebtoonPages - 1) {
            currentWebtoonIndex++;
            updateWebtoonSlider();
        } else {
            // 마지막 페이지에서 다음 버튼 클릭 시 모달 닫기
            closeWebtoonModal();
        }
    }

    function prevWebtoonPage() {
        if (currentWebtoonIndex > 0) {
            currentWebtoonIndex--;
            updateWebtoonSlider();
        } else {
            // 첫 페이지에서 이전으로 넘길 때 바운스 효과
            gsap.to(webtoonSlider, { x: "+=10px", yoyo: true, repeat: 1, duration: 0.1 });
        }
    }

    if (openWebtoonBtn && closeWebtoonBtn && webtoonModal) {
        openWebtoonBtn.addEventListener('click', () => {
            currentWebtoonIndex = 0;
            updateWebtoonSlider();
            webtoonModal.classList.add('is-active');
        });

        closeWebtoonBtn.addEventListener('click', closeWebtoonModal);
        
        // Background click to close
        webtoonModal.addEventListener('click', (e) => {
            if (e.target === webtoonModal) {
                closeWebtoonModal();
            }
        });

        // Click zones
        if(webtoonPrevZone) webtoonPrevZone.addEventListener('click', prevWebtoonPage);
        if(webtoonNextZone) webtoonNextZone.addEventListener('click', nextWebtoonPage);
        
        // Nav buttons
        if(webtoonPrevBtn) webtoonPrevBtn.addEventListener('click', prevWebtoonPage);
        if(webtoonNextBtn) webtoonNextBtn.addEventListener('click', nextWebtoonPage);

        // Keyboard navigation (Escape to close, Left/Right for pages)
        document.addEventListener('keydown', (e) => {
            if (!webtoonModal.classList.contains('is-active')) return;
            
            if (e.key === 'Escape') {
                closeWebtoonModal();
            } else if (e.key === 'ArrowRight') {
                nextWebtoonPage();
            } else if (e.key === 'ArrowLeft') {
                prevWebtoonPage();
            }
        });

        // 터치 스와이프로 페이지 전환
        let touchStartX = 0;
        let touchStartY = 0;
        let isSwiping = false;

        webtoonModal.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            isSwiping = false;
        }, { passive: true });

        webtoonModal.addEventListener('touchmove', (e) => {
            if (!touchStartX) return;
            const diffX = Math.abs(e.touches[0].clientX - touchStartX);
            const diffY = Math.abs(e.touches[0].clientY - touchStartY);
            // 수평 이동이 수직보다 크면 스와이프로 판단하여 스크롤 방지
            if (diffX > diffY && diffX > 10) {
                isSwiping = true;
                e.preventDefault();
            }
        }, { passive: false });

        webtoonModal.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            const touchEndX = e.changedTouches[0].clientX;
            const diffX = touchStartX - touchEndX;

            // 50px 이상 스와이프 시 동작
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    nextWebtoonPage();  // 왼쪽으로 스와이프 → 다음 페이지
                } else {
                    prevWebtoonPage();  // 오른쪽으로 스와이프 → 이전 페이지
                }
            }
            touchStartX = 0;
            touchStartY = 0;
            isSwiping = false;
        }, { passive: true });
    }
});
