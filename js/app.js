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
    const desktopMotionMedia = window.matchMedia('(min-width: 769px) and (hover: hover) and (pointer: fine)');
    const reduceMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    const tiltWrapper = document.getElementById('tiltWrapper');
    const bgImage = document.getElementById('bgImage');
    const teaserSource = teaserVideo?.dataset.src || 'movie/project-energy-wide.mp4';
    let introComplete = false;
    let teaserInView = false;
    let teaserAutoplayBlocked = false;
    let teaserPlayPending = false;
    let teaserPlayRequest = 0;
    let sceneMotionFrame = null;
    let scenePointerX = 0;
    let scenePointerY = 0;

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

        // 모션 감소 설정에서는 긴 이동 효과 없이 메인으로 바로 전환한다.
        if (reduceMotionMedia.matches || typeof gsap === 'undefined') {
            introVideo.pause();
            if (videoContainer) videoContainer.style.display = 'none';
            mainContent.style.opacity = '1';
            mainContent.style.visibility = 'visible';
            completeMainReveal();
            return;
        }

        // 인트로 비디오 페이드아웃 및 GPU 렌더링 파이프라인에서 완전히 제외
        gsap.to(introVideo, {
            opacity: 0,
            duration: 0.7,
            ease: "power2.out",
            onComplete: () => {
                introVideo.pause(); // 비디오 디코딩 정지
                if (videoContainer) {
                    videoContainer.style.display = 'none'; // DOM 렌더 트리에서 제외하여 GPU 메모리 해제
                }
            }
        });

        // 메인 콘텐츠가 실제로 나타난 뒤 티저 자동재생 허용
        gsap.to(mainContent, {
            autoAlpha: 1, // opacity 1, visibility visible
            duration: 0.7,
            delay: 0.1,
            ease: "power2.inOut",
            onComplete: () => {
                completeMainReveal();
            }
        });
        
        // 메인 글래스 패널 내부 요소들 시네마틱 등장 효과
        gsap.from(".slogan, .project-message, .launch-date, .teaser-video, .contact-section, .action-btn-wrapper, .stories-caption", {
            y: 14,
            opacity: 0,
            duration: 0.65,
            stagger: 0.06,
            delay: 0.15,
            ease: "power2.out"
        });

    }

    introVideo.addEventListener('ended', endIntro);

    function completeMainReveal() {
        introComplete = true;
        document.body.classList.add('main-ready');
        syncSceneMotion();
        syncTeaserPlayback();
    }

    // 스킵 버튼 클릭 이벤트
    const skipBtn = document.getElementById('skipIntroBtn');
    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            introVideo.pause(); // 비디오 즉시 정지
            endIntro(); // 트랜지션 즉시 실행
        });
    }

    // 3. 인트로가 끝난 뒤 화면에 보이는 티저만 무음으로 반복 재생한다.
    function canPlayTeaser() {
        return teaserVideo && introComplete && teaserInView && !document.hidden &&
            !document.body.classList.contains('modal-opened');
    }

    function syncTeaserPlayback() {
        if (!teaserVideo) return;
        if (!canPlayTeaser()) {
            teaserVideo.pause();
            return;
        }
        if (!teaserSource || teaserAutoplayBlocked || !teaserVideo.paused || teaserPlayPending) return;

        if (teaserVideo.getAttribute('src') !== teaserSource) {
            teaserVideo.src = teaserSource;
            teaserVideo.load();
        }

        teaserPlayPending = true;
        const request = ++teaserPlayRequest;
        Promise.resolve(teaserVideo.play()).then(() => {
            if (request !== teaserPlayRequest) return;
            teaserPlayPending = false;
            // 재생 요청 도중 스크롤·모달·탭 상태가 바뀌었을 수 있다.
            if (!canPlayTeaser()) teaserVideo.pause();
            teaserVideo.controls = false;
        }).catch(error => {
            if (request !== teaserPlayRequest) return;
            teaserPlayPending = false;
            if (error.name === 'AbortError') {
                // 자동 일시정지로 취소된 요청만 다음 프레임에 재확인한다.
                if (canPlayTeaser()) requestAnimationFrame(syncTeaserPlayback);
                return;
            }
            if (error.name === 'NotAllowedError') {
                teaserAutoplayBlocked = true;
                teaserVideo.controls = true;
            }
        });
    }

    if (teaserVideo) {
        teaserVideo.muted = true;
        teaserVideo.defaultMuted = true;
        teaserVideo.playsInline = true;
        teaserVideo.autoplay = false;
        teaserVideo.loop = true;
        teaserVideo.controls = false;
        teaserVideo.preload = 'none';
        teaserVideo.poster = teaserVideo.dataset.poster || 'img/project-energy-wide.webp';
        teaserVideo.classList.add('is-loaded'); // 재생 전에도 포스터를 표시

        if ('IntersectionObserver' in window) {
            const teaserObserver = new IntersectionObserver(entries => {
                const entry = entries[0];
                teaserInView = entry.isIntersecting && entry.intersectionRatio >= 0.25;
                syncTeaserPlayback();
            }, { threshold: [0, 0.25] });
            teaserObserver.observe(teaserVideo);
        } else {
            const updateTeaserVisibility = () => {
                const rect = teaserVideo.getBoundingClientRect();
                const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
                teaserInView = rect.height > 0 && visibleHeight / rect.height >= 0.25;
                syncTeaserPlayback();
            };
            window.addEventListener('scroll', updateTeaserVisibility, { passive: true });
            mainContent.addEventListener('scroll', updateTeaserVisibility, { passive: true });
            window.addEventListener('resize', updateTeaserVisibility, { passive: true });
            updateTeaserVisibility();
        }

        teaserVideo.addEventListener('playing', () => {
            teaserAutoplayBlocked = false;
            teaserVideo.controls = false;
        });

        // 일부 인앱 브라우저가 무음 자동재생도 막으면 다음 사용자 조작 때 재시도한다.
        const retryBlockedPlayback = () => {
            if (!teaserAutoplayBlocked || !canPlayTeaser()) return;
            teaserAutoplayBlocked = false;
            syncTeaserPlayback();
        };
        document.addEventListener('pointerup', retryBlockedPlayback, { passive: true });
        document.addEventListener('keydown', retryBlockedPlayback);
    }

    // 모달 활성화 시 백그라운드 리소스 일시 정지 (GPU 부하 제거)
    function pauseBackgroundActivities() {
        document.body.classList.add('modal-opened');
        syncSceneMotion();
        syncTeaserPlayback();
    }

    // 모달 닫힘 시 백그라운드 리소스 재개
    function resumeBackgroundActivities() {
        const hasActiveModal = document.querySelector('.philosophy-modal-overlay.is-active, .webtoon-modal-overlay.is-active');
        document.body.classList.toggle('modal-opened', Boolean(hasActiveModal));
        syncSceneMotion();
        syncTeaserPlayback();
    }

    // 브라우저 탭 활성/비활성 전환 시 백그라운드 리소스 스마트 관리
    document.addEventListener('visibilitychange', () => {
        syncSceneMotion();
        syncTeaserPlayback();
    });

    // 4. 원래 마우스 패럴랙스를 절반 강도로 복원한다. 터치 기기에서는 고정한다.
    function canMoveScene() {
        return introComplete && desktopMotionMedia.matches && !reduceMotionMedia.matches &&
            !document.hidden && !document.body.classList.contains('modal-opened') &&
            tiltWrapper && bgImage && typeof gsap !== 'undefined';
    }

    function resetSceneMotion(animate = false) {
        if (sceneMotionFrame !== null) {
            cancelAnimationFrame(sceneMotionFrame);
            sceneMotionFrame = null;
        }
        if (typeof gsap === 'undefined') return;

        const reset = (target, values) => {
            if (!target) return;
            gsap.killTweensOf(target);
            if (animate) {
                gsap.to(target, { ...values, duration: 0.8, ease: 'power3.out', overwrite: true });
            } else {
                gsap.set(target, values);
            }
        };
        reset(tiltWrapper, { rotationY: 0, rotationX: 0 });
        reset(bgImage, { x: 0, y: 0 });
    }

    function syncSceneMotion() {
        const paused = document.hidden || document.body.classList.contains('modal-opened');
        document.body.classList.toggle('motion-paused', paused);
        if (!canMoveScene()) resetSceneMotion();
    }

    function updateSceneMotion() {
        sceneMotionFrame = null;
        if (!canMoveScene()) return;

        // 뷰포트 밖 좌표는 제한해 포커스 전환 시 과도한 회전을 방지한다.
        const x = Math.max(0, Math.min(window.innerWidth, scenePointerX));
        const y = Math.max(0, Math.min(window.innerHeight, scenePointerY));
        const offsetX = x - window.innerWidth / 2;
        const offsetY = y - window.innerHeight / 2;

        gsap.to(tiltWrapper, {
            rotationY: -offsetX / 80, // 기존 /40 → 정확히 50% 강도
            rotationX: -offsetY / 80,
            duration: 0.8,
            ease: 'power2.out',
            overwrite: true
        });
        gsap.to(bgImage, {
            x: offsetX / 120, // 기존 /60 → 정확히 50% 강도
            y: offsetY / 120,
            duration: 1.5,
            ease: 'power2.out',
            overwrite: true
        });
    }

    document.addEventListener('pointermove', event => {
        if (event.pointerType !== 'mouse' || !canMoveScene()) return;
        scenePointerX = event.clientX;
        scenePointerY = event.clientY;
        if (sceneMotionFrame === null) sceneMotionFrame = requestAnimationFrame(updateSceneMotion);
    }, { passive: true });
    document.addEventListener('mouseleave', () => resetSceneMotion(Boolean(canMoveScene())));
    window.addEventListener('blur', () => resetSceneMotion());
    window.addEventListener('resize', () => resetSceneMotion(), { passive: true });
    desktopMotionMedia.addEventListener('change', syncSceneMotion);
    reduceMotionMedia.addEventListener('change', syncSceneMotion);
    syncSceneMotion();

    // 5. 무브먼트(Philosophy) 모달 제어
    const openPhilosophyBtn = document.getElementById('openPhilosophyBtn');
    const closePhilosophyBtn = document.getElementById('closePhilosophyBtn');
    const closePhilosophyBottomBtn = document.getElementById('closePhilosophyBottomBtn');
    const philosophyModal = document.getElementById('philosophyModal');

    if (openPhilosophyBtn && closePhilosophyBtn && philosophyModal) {
        const interactionFg = philosophyModal.querySelector('.interaction-fg');

        openPhilosophyBtn.addEventListener('click', () => {
            // 백그라운드 영상 즉시 정지하여 모바일 스크롤 프레임 확보
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

            // 시청 중이던 영상만 재생 조건에 따라 이어서 재생
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
            // 백그라운드 영상 일시 정지
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
    const contactEmail = document.getElementById('contactEmail');
    const btnCopyEmail = document.getElementById('btnCopyEmail');
    const toastMessage = document.getElementById('toastMessage');

    if (btnCopyEmail && toastMessage) {
        toastMessage.setAttribute('role', 'status');
        toastMessage.setAttribute('aria-live', 'polite');
        btnCopyEmail.addEventListener('click', () => {
            const emailText = contactEmail?.dataset.email || 'zzmmhh2000@kakao.com';

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
    function showToast(message = '이메일 주소가 복사되었습니다!') {
        if (!toastMessage) return;
        toastMessage.textContent = message;
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
        const previousFocus = document.activeElement;
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
            const copied = document.execCommand('copy');
            showToast(copied ? '이메일 주소가 복사되었습니다!' : '이메일 주소를 길게 눌러 복사해 주세요.');
        } catch (err) {
            console.error('폴백 복사 기능 오류:', err);
            showToast('이메일 주소를 길게 눌러 복사해 주세요.');
        }
        
        document.body.removeChild(textArea);
        if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
    }
});
