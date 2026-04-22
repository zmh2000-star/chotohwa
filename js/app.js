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
    }
    setupVideo();

    // 카운트다운 목표 날짜: 2026-09-01 15:00:00
    const targetDate = new Date('2026-09-01T15:00:00').getTime();

    // 2. 비디오 종료 시 시네마틱 트랜지션 (글리치 + 블러/아우라 모드)
    introVideo.addEventListener('ended', () => {
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
        gsap.from(".slogan, .target-date, .time-block, .time-divider, .teaser-video", {
            y: 50,
            rotationX: 15,
            opacity: 0,
            duration: 1.5,
            stagger: 0.15,
            delay: 0.5,
            ease: "back.out(1.2)"
        });
    });

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
});
