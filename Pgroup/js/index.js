document.addEventListener('DOMContentLoaded', () => {
    // 1. Core Elements & Variables
    const header = document.querySelector('.main-header');
    const sections = gsap.utils.toArray('section');
    const navLinks = gsap.utils.toArray('.gnb a');
    const backToTop = document.getElementById('backToTop');
    const progressPath = document.querySelector('#scrollProgress');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileMenu = document.querySelector('.mobile-menu-overlay');

    // 2. GSAP Animations: Hero Entrance
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.5 } });
    heroTl.from('.hero-subtitle', { y: 30, opacity: 0, delay: 0.5 })
        .from('.hero-title', { y: 50, opacity: 0 }, '-=1')
        .from('.hero-desc', { y: 30, opacity: 0 }, '-=1');

    // 3. Performance Optimized Scroll Monitor
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        // Sticky Header & Back to Top logic
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
            if (backToTop) backToTop.classList.add('show');
        } else {
            header.classList.remove('scrolled');
            if (backToTop) backToTop.classList.remove('show');
        }

        // Scroll Progress logic
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressPath) {
            progressPath.style.width = scrolled + "%";
        }

        // Active Link Highlight (ScrollSpy) - Debounced
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, 10);
    });

    // 4. GSAP ScrollTrigger: History Section Animations
    // Stats Counter
    gsap.utils.toArray('.count').forEach(count => {
        gsap.from(count, {
            scrollTrigger: {
                trigger: '.history-top-layout',
                start: 'top 90%',
                once: true
            },
            innerText: 0,
            duration: 2.5,
            snap: { innerText: 1 },
            ease: 'power2.out'
        });
    });

    // History Header & Stats Box Fade-in
    gsap.from('.history-top-layout', {
        scrollTrigger: {
            trigger: '.history-top-layout',
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
    });

    // Timeline Cards Stagger Arrival
    gsap.from('.timeline-card', {
        scrollTrigger: {
            trigger: '.timeline-grid',
            start: 'top 95%'
        },
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power2.out',
        clearProps: 'opacity,transform'
    });

    // 5. GSAP ScrollTrigger: Remaining Section Fade-ins
    const fadeElems = [
        '.chairman-wrapper', '.vision-card', '.section-header',
        '.pillar-category', '.global-content-wrapper', '.partner-card',
        '.synergy-item', '.news-item', '.esg-card', '.contact-grid'
    ];

    const isMobile = window.innerWidth <= 1024;

    fadeElems.forEach(selector => {
        gsap.utils.toArray(selector).forEach(elem => {
            gsap.from(elem, {
                scrollTrigger: {
                    trigger: elem,
                    start: isMobile ? 'top 92%' : 'top 85%', // Trigger slightly earlier on mobile
                    toggleActions: 'play none none none'
                },
                y: 30,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out',
                clearProps: 'opacity,transform'
            });
        });
    });

    // 6. Swiper.js: Member Slider Initialization
    const memberSwiper = new Swiper('.member-swiper', {
        slidesPerView: 1.2,
        spaceBetween: 20,
        centeredSlides: false,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        breakpoints: {
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3.2 },
            1400: { slidesPerView: 4 }
        }
    });

    // 7. Mobile Menu Toggle
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // 8. Contact Form Feedback
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.submit-btn');
            const originalText = btn.innerText;

            btn.disabled = true;
            btn.innerText = '전송 중...';

            setTimeout(() => {
                alert('문의가 성공적으로 전달되었습니다. 감사합니다.');
                btn.disabled = false;
                btn.innerText = originalText;
                contactForm.reset();
            }, 1500);
        });
    }

    // 9. Global Map City Tooltips
    const mapPoints = document.querySelectorAll('.map-point');
    const tooltip = document.createElement('div');
    tooltip.className = 'map-tooltip';
    document.body.appendChild(tooltip);

    const cityNames = ["Seoul, KR", "New York, US", "London, UK", "Tokyo, JP"];

    mapPoints.forEach((point, index) => {
        point.addEventListener('mouseenter', (e) => {
            tooltip.innerText = cityNames[index % cityNames.length];
            tooltip.classList.add('active');
        });

        point.addEventListener('mousemove', (e) => {
            tooltip.style.left = (e.clientX + 15) + 'px';
            tooltip.style.top = (e.clientY + 15) + 'px';
        });

        point.addEventListener('mouseleave', () => {
            tooltip.classList.remove('active');
        });
    });
});
