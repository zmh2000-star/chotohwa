document.addEventListener('DOMContentLoaded', () => {

    // Header Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
        } else {
            header.style.boxShadow = "none";
        }
    });

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');

    menuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    // Tab Interface Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button
            btn.classList.add('active');

            // Show corresponding content
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Smooth Scroll for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                nav.classList.remove('active'); // Close mobile menu
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');
    animatedElements.forEach(el => observer.observe(el));

    // Form Submission Handling
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const company = document.getElementById('company').value;
        const pic = document.getElementById('pic').value;

        // Get selected interests
        const interests = [];
        document.querySelectorAll('input[name="interest"]:checked').forEach(checkbox => {
            interests.push(checkbox.nextElementSibling.innerText);
        });

        if (company && pic) {
            let message = `[문의 접수 완료]\n\n기업명: ${company}\n담당자: ${pic}\n관심분야: ${interests.join(', ') || '없음'}\n\n제휴 제안서가 다운로드 되었습니다. (Simulation)`;
            alert(message);
            // Simulate file download
            // window.location.href = 'path/to/proposal.pdf';
            form.reset();
        }
    });

});
