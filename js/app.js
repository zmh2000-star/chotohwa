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
    const teaserVideo = document.getElementById('teaserVideo');

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

    // 2. 비디오 종료 시 시네마틱 트랜지션 및 백그라운드 리소스 완전 해제
    function endIntro() {
        // 이미 종료 처리되었으면 무시 (중복 실행 방지)
        if (introVideo.dataset.ended === 'true') return;
        introVideo.dataset.ended = 'true';

        // 스킵 버튼 숨기기
        const skipBtn = document.getElementById('skipIntroBtn');
        if (skipBtn) {
            skipBtn.classList.add('hidden');
        }

        // 인트로 비디오 페이드아웃 및 GPU 렌더링 파이프라인에서 완전히 제외
        gsap.to(introVideo, {
            scale: 1.05,
            opacity: 0,
            duration: 1.2,
            ease: "power2.out",
            onComplete: () => {
                introVideo.pause(); // 비디오 디코딩 정지
                if (videoContainer) {
                    videoContainer.style.display = 'none'; // DOM 렌더 트리에서 제외하여 GPU 메모리 해제
                }
            }
        });

        // 텍스트/카운트다운 컨텐츠 페이드인
        gsap.to(mainContent, {
            autoAlpha: 1, // opacity 1, visibility visible
            duration: 1.5,
            delay: 0.1,
            ease: "power2.inOut"
        });
        
        // 메인 글래스 패널 내부 요소들 시네마틱 등장 효과
        gsap.from(".slogan, .target-date, .time-block, .time-divider, .teaser-video, .action-btn-wrapper, .contact-section", {
            y: 40,
            rotationX: 10,
            opacity: 0,
            duration: 1.2,
            stagger: 0.12,
            delay: 0.3,
            ease: "back.out(1.2)"
        });

        // 티저 비디오 재생 (컨텐츠 등장 후 재생)
        if (teaserVideo) {
            teaserVideo.currentTime = 0;
            teaserVideo.play().then(() => {
                teaserVideo.classList.add('is-loaded');
            }).catch(e => {
                console.log('자동 재생 제한:', e);
                teaserVideo.classList.add('is-loaded');
            });
        }

        // 카운트다운 타이머 애니메이션 시작
        startCountdown();
    }

    introVideo.addEventListener('ended', endIntro);

    // 스킵 버튼 클릭 이벤트
    const skipBtn = document.getElementById('skipIntroBtn');
    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            introVideo.pause(); // 비디오 즉시 정지
            endIntro(); // 트랜지션 즉시 실행
        });
    }

    // 3. SVG 프로그레스 링 세팅 및 최적화된 카운트다운 타이머
    const r = 70;
    const circumference = 2 * Math.PI * r;

    // SVG 링 엘리먼트 캐싱
    const rings = {
        days: document.getElementById('ring-days'),
        hours: document.getElementById('ring-hours'),
        mins: document.getElementById('ring-mins'),
        secs: document.getElementById('ring-secs'),
        ms: document.getElementById('ring-ms')
    };

    // DOM 텍스트 엘리먼트 캐싱 (반복 조회 방지)
    const timeTexts = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        mins: document.getElementById('mins'),
        secs: document.getElementById('secs'),
        ms: document.getElementById('ms')
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

    let countdownAnimationId = null;
    let isCountdownActive = false;

    function updateCountdown() {
        if (!isCountdownActive) return;

        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance <= 0) {
            document.querySelectorAll('.number').forEach(el => el.innerText = "00");
            stopCountdown();
            return;
        }

        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);
        const ms = Math.floor((distance % 1000) / 10); // 0-99 (두 자리 밀리초)

        if (timeTexts.days) timeTexts.days.innerText = d.toString().padStart(2, '0');
        if (timeTexts.hours) timeTexts.hours.innerText = h.toString().padStart(2, '0');
        if (timeTexts.mins) timeTexts.mins.innerText = m.toString().padStart(2, '0');
        if (timeTexts.secs) timeTexts.secs.innerText = s.toString().padStart(2, '0');
        if (timeTexts.ms) timeTexts.ms.innerText = ms.toString().padStart(2, '0');

        // 프로그레스 바 갱신
        setProgress(rings.days, (d / 365) * 100);
        setProgress(rings.hours, (h / 24) * 100);
        setProgress(rings.mins, (m / 60) * 100);
        setProgress(rings.secs, (s / 60) * 100);
        setProgress(rings.ms, ((distance % 1000) / 1000) * 100);

        // 다음 프레임 요청
        countdownAnimationId = requestAnimationFrame(updateCountdown);
    }

    // 카운트다운 시작 함수
    function startCountdown() {
        if (!isCountdownActive) {
            isCountdownActive = true;
            countdownAnimationId = requestAnimationFrame(updateCountdown);
        }
    }

    // 카운트다운 일시 정지 함수 (모달 오픈 또는 탭 비활성화 시 불필요한 GPU/CPU 낭비 방지)
    function stopCountdown() {
        if (isCountdownActive) {
            isCountdownActive = false;
            if (countdownAnimationId) {
                cancelAnimationFrame(countdownAnimationId);
                countdownAnimationId = null;
            }
        }
    }

    // 모달 활성화 시 백그라운드 리소스 일시 정지 (GPU 부하 제거)
    function pauseBackgroundActivities() {
        document.body.classList.add('modal-opened');
        stopCountdown();
        if (teaserVideo && !teaserVideo.paused) {
            teaserVideo.pause();
        }
    }

    // 모달 닫힘 시 백그라운드 리소스 재개
    function resumeBackgroundActivities() {
        document.body.classList.remove('modal-opened');
        // 인트로가 완료된 상태에서만 재개
        if (introVideo.dataset.ended === 'true') {
            startCountdown();
            if (teaserVideo && teaserVideo.paused) {
                teaserVideo.play().catch(() => {});
            }
        }
    }

    // 브라우저 탭 활성/비활성 전환 시 백그라운드 리소스 스마트 관리
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopCountdown();
            if (teaserVideo && !teaserVideo.paused) {
                teaserVideo.pause();
            }
        } else {
            const hasActiveModal = document.querySelector('.philosophy-modal-overlay.is-active, .webtoon-modal-overlay.is-active');
            if (!hasActiveModal && introVideo.dataset.ended === 'true') {
                startCountdown();
                if (teaserVideo && teaserVideo.paused) {
                    teaserVideo.play().catch(() => {});
                }
            }
        }
    });

    // 4. 3D 시네마틱 마우스 패럴랙스 효과 (데스크탑 전용)
    if (window.innerWidth > 768) {
        const tiltWrapper = document.getElementById('tiltWrapper');
        const bgImage = document.getElementById('bgImage');

        document.addEventListener('mousemove', (e) => {
            // 모달이 열려 있을 때는 패럴랙스 연산 중단
            if (document.body.classList.contains('modal-opened')) return;

            const xAxis = (window.innerWidth / 2 - e.pageX) / 40; // 기울기 강도 (글래스 패널)
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

    // 5. 무브먼트(Philosophy) 모달 제어
    const openPhilosophyBtn = document.getElementById('openPhilosophyBtn');
    const closePhilosophyBtn = document.getElementById('closePhilosophyBtn');
    const closePhilosophyBottomBtn = document.getElementById('closePhilosophyBottomBtn');
    const philosophyModal = document.getElementById('philosophyModal');

    if (openPhilosophyBtn && closePhilosophyBtn && philosophyModal) {
        const interactionFg = philosophyModal.querySelector('.interaction-fg');

        openPhilosophyBtn.addEventListener('click', () => {
            // 백그라운드 영상 및 타이머 즉시 정지하여 모바일 스크롤 프레임 확보
            pauseBackgroundActivities();
            philosophyModal.classList.add('is-active');
            
            // GSAP 모달 내부 텍스트 순차적 페이드업 애니메이션
            gsap.fromTo(philosophyModal.querySelectorAll('.modal-title, .philosophy-section, .philosophy-interaction'), 
                { y: 25, opacity: 0 }, 
                { 
                    y: 0, 
                    opacity: 1, 
                    duration: 0.6, 
                    stagger: 0.1, 
                    ease: "power3.out", 
                    delay: 0.15,
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
                // 다음 오픈을 위한 인터랙션 리셋
                setTimeout(() => {
                    interactionFg.classList.remove('active');
                }, 300);
            }

            // 백그라운드 영상 및 카운트다운 재개
            resumeBackgroundActivities();
        };

        closePhilosophyBtn.addEventListener('click', closeModal);
        if (closePhilosophyBottomBtn) closePhilosophyBottomBtn.addEventListener('click', closeModal);

        // 모달 배경 영역 클릭 시 닫기
        philosophyModal.addEventListener('click', (e) => {
            if (e.target === philosophyModal) {
                closeModal();
            }
        });
    }

    // 6. 웹툰(Webtoon) 모달 제어 및 슬라이더
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
            resumeBackgroundActivities();
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
            // 백그라운드 영상 및 타이머 일시 정지
            pauseBackgroundActivities();
            currentWebtoonIndex = 0;
            updateWebtoonSlider();
            webtoonModal.classList.add('is-active');
        });

        closeWebtoonBtn.addEventListener('click', closeWebtoonModal);
        
        // 배경 클릭 시 닫기
        webtoonModal.addEventListener('click', (e) => {
            if (e.target === webtoonModal) {
                closeWebtoonModal();
            }
        });

        // 좌우 클릭 터치 영역
        if(webtoonPrevZone) webtoonPrevZone.addEventListener('click', prevWebtoonPage);
        if(webtoonNextZone) webtoonNextZone.addEventListener('click', nextWebtoonPage);
        
        // 이전/다음 버튼
        if(webtoonPrevBtn) webtoonPrevBtn.addEventListener('click', prevWebtoonPage);
        if(webtoonNextBtn) webtoonNextBtn.addEventListener('click', nextWebtoonPage);

        // 키보드 방향키 및 ESC 단축키
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

    // 7. 이메일 클립보드 복사 기능 및 토스트 알림 제어
    const btnCopyEmail = document.getElementById('btnCopyEmail');
    const toastMessage = document.getElementById('toastMessage');

    if (btnCopyEmail && toastMessage) {
        btnCopyEmail.addEventListener('click', () => {
            const emailText = 'zzmmhh2000@kakao.com';

            // 최신 브라우저의 클립보드 API 지원 여부 확인
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(emailText)
                    .then(showToast)
                    .catch(err => {
                        console.error('클립보드 복사 실패:', err);
                        fallbackCopyText(emailText);
                    });
            } else {
                fallbackCopyText(emailText);
            }
        });
    }

    // 토스트 메시지 출력 처리
    function showToast() {
        if (!toastMessage) return;
        toastMessage.classList.add('show');
        
        // 이전 타이머가 실행 중인 경우 초기화하여 겹침 방지
        if (toastMessage.dataset.timeoutId) {
            clearTimeout(Number(toastMessage.dataset.timeoutId));
        }

        const timeoutId = setTimeout(() => {
            toastMessage.classList.remove('show');
        }, 2000);

        toastMessage.dataset.timeoutId = timeoutId;
    }

    // 구형 브라우저 및 인앱 브라우저를 위한 폴백 복사 처리
    function fallbackCopyText(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        
        // 화면 외곽 보이지 않는 곳에 텍스트 영역 임시 배치
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showToast();
        } catch (err) {
            console.error('폴백 복사 기능 오류:', err);
        }
        
        document.body.removeChild(textArea);
    }
});
