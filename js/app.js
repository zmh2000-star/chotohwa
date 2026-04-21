document.addEventListener('DOMContentLoaded', () => {
    const videoContainer = document.getElementById('videoContainer');
    const introVideo = document.getElementById('introVideo');
    const mainContent = document.getElementById('mainContent');

    // 카운트다운 목표 날짜: 2026-09-01 00:00:00
    const targetDate = new Date('2026-09-01T00:00:00').getTime();

    // 1. 비디오 종료 시 시퀀스 처리
    introVideo.addEventListener('ended', () => {
        // 비디오를 서서히 가리고 그 뒤에 준비된 메인 콘텐츠(이미지)를 부드럽게 노출 (Crossfade)
        gsap.to(videoContainer, {
            autoAlpha: 0,
            duration: 1.5,
            ease: "power2.inOut"
        });

        // 텍스트/카운트다운 컨텐츠 페이드인
        gsap.to(mainContent, {
            autoAlpha: 1,
            duration: 2.5,
            delay: 0.5,
            ease: "power2.inOut"
        });
        
        // 추가: 슬로건, 날짜, 카운트다운 요소가 위로 부드럽게 떠오르는 효과
        gsap.from(".slogan, .target-date, .countdown", {
            y: 30,
            opacity: 0,
            duration: 1.5,
            stagger: 0.3,
            delay: 1,
            ease: "power3.out"
        });
    });

    // 2. 카운트다운 타이머 로직
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance <= 0) {
            document.getElementById('days').innerText = "00";
            document.getElementById('hours').innerText = "00";
            document.getElementById('mins').innerText = "00";
            document.getElementById('secs').innerText = "00";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days.toString().padStart(2, '0');
        document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
        document.getElementById('mins').innerText = minutes.toString().padStart(2, '0');
        document.getElementById('secs').innerText = seconds.toString().padStart(2, '0');
    }

    // 초기 및 1초 간격 갱신
    updateCountdown();
    setInterval(updateCountdown, 1000);
});
