// ====================
// ====== STARS ========
// ====================

const stars = document.querySelector('.stars');

if (stars) {
    const starFragment = document.createDocumentFragment();
    const starCount = 100;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('span');
        const size = Math.random() * 2 + 1;

        star.classList.add('star');
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.opacity = Math.random();
        star.style.animationDelay = `${Math.random() * 5}s`;

        starFragment.appendChild(star);
    }

    stars.appendChild(starFragment);
}

// =============================
// ===== PROJECT SLIDER =========
// =============================

const container = document.getElementById('projectCards');

if (container) {
    const cards = Array.from(container.querySelectorAll('.project-card'));
    const nextButton = document.getElementById('nextBtn');
    const prevButton = document.getElementById('prevBtn');
    const total = cards.length;
    let activeIndex = 0;

    function updateSlider() {
        cards.forEach((card, i) => {
            let offset = i - activeIndex;

            // Shortest path around the loop keeps the carousel circular.
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            const distance = Math.abs(offset);
            let scale;
            let opacity;
            let blur;
            let zIndex;

            if (distance === 0) {
                scale = 1;
                opacity = 1;
                blur = 0;
                zIndex = 30;
            } else if (distance === 1) {
                scale = 0.78;
                opacity = 0.55;
                blur = 1;
                zIndex = 20;
            } else if (distance === 2) {
                scale = 0.6;
                opacity = 0.25;
                blur = 2;
                zIndex = 10;
            } else {
                scale = 0.5;
                opacity = 0;
                blur = 2;
                zIndex = 0;
            }

            const moveX = offset * 210;

            card.style.transform = `translateX(${moveX}px) scale(${scale})`;
            card.style.opacity = opacity;
            card.style.filter = `blur(${blur}px)`;
            card.style.zIndex = zIndex;
            card.style.pointerEvents = distance > 2 ? 'none' : 'auto';
            card.classList.toggle('is-active', distance === 0);
        });
    }

    function goTo(index) {
        activeIndex = ((index % total) + total) % total;
        updateSlider();
    }

    cards.forEach((card, index) => {
        card.addEventListener('click', () => goTo(index));
    });

    nextButton?.addEventListener('click', () => goTo(activeIndex + 1));
    prevButton?.addEventListener('click', () => goTo(activeIndex - 1));

    updateSlider();
}

// =====================================
// ===== SCROLL REVEAL / CARD STAGGER ===
// =====================================

const revealTargets = document.querySelectorAll(
    '.section-header, .stats-card, .service-card, .project-cards, .about-card, .comment-card, .contact-info, .contact > .start-btn'
);

revealTargets.forEach((element, index) => {
    element.classList.add('reveal');

    // Only stagger normal content groups. Long delays are avoided for mobile.
    if (element.matches('.stats-card, .service-card, .about-card, .comment-card')) {
        const delay = (index % 4) + 1;
        element.classList.add(`reveal-delay-${delay}`);
    }
});

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
        });
    },
    {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px',
    },
);

revealTargets.forEach((element) => revealObserver.observe(element));

// =====================================
// ===== CARD SPOTLIGHT FOLLOW MOUSE =====
// =====================================

const interactiveCards = document.querySelectorAll(
    '.stats-card, .service-card, .about-card, .comment-card'
);

interactiveCards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        card.style.setProperty('--pointer-x', `${x}px`);
        card.style.setProperty('--pointer-y', `${y}px`);
    });
});

// =====================================
// ===== PARALLAX FOR HERO STARS ========
// =====================================

const hero = document.getElementById('hero');

if (hero && stars && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let pointerX = 0;
    let pointerY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = null;

    const renderParallax = () => {
        currentX += (pointerX - currentX) * 0.08;
        currentY += (pointerY - currentY) * 0.08;

        stars.style.transform = `translate3d(${currentX * 8}px, ${currentY * 8}px, 0)`;
        rafId = requestAnimationFrame(renderParallax);
    };

    hero.addEventListener('pointermove', (event) => {
        const rect = hero.getBoundingClientRect();
        pointerX = (event.clientX - rect.left) / rect.width - 0.5;
        pointerY = (event.clientY - rect.top) / rect.height - 0.5;

        if (!rafId) rafId = requestAnimationFrame(renderParallax);
    });

    hero.addEventListener('pointerleave', () => {
        pointerX = 0;
        pointerY = 0;
    });
}

// =====================================
// ===== SCROLL-AWARE NAVBAR ============
// =====================================

const navbar = document.querySelector('.navbar');

if (navbar) {
    const updateNavbar = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 30);
    };

    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });
}
