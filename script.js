document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.getElementById('progressBar');
    const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (progressBar) progressBar.style.width = pct + '%';
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });

    const nav = document.getElementById('nav');
    const updateNav = () => {
        if (!nav) return;
        nav.classList.toggle('scrolled', window.scrollY > 12);
    };
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });

    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navLinks.classList.remove('open');
            });
        });
    }

    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealEls.forEach(el => observer.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('in-view'));
    }

    const typedEl = document.getElementById('typedText');
    if (typedEl) {
        const words = ['Websites.', 'Presentations.', 'Resumes.', 'Excel Sheets.', 'Projects.'];
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            typedEl.textContent = 'Websites.';
        } else {
            let wordIndex = 0;
            let charIndex = 0;
            let deleting = false;

            const tick = () => {
                const current = words[wordIndex];

                if (!deleting) {
                    charIndex++;
                    typedEl.textContent = current.slice(0, charIndex);
                    if (charIndex === current.length) {
                        deleting = true;
                        setTimeout(tick, 1400);
                        return;
                    }
                } else {
                    charIndex--;
                    typedEl.textContent = current.slice(0, charIndex);
                    if (charIndex === 0) {
                        deleting = false;
                        wordIndex = (wordIndex + 1) % words.length;
                    }
                }
                setTimeout(tick, deleting ? 45 : 85);
            };
            tick();
        }
    }
});
