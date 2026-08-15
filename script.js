document.addEventListener('DOMContentLoaded', () => {
    // Scroll progress bar
    const progressBar = document.getElementById('progressBar');
    const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = pct + '%';
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });

    // Scroll-reveal for cards using IntersectionObserver
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
        // Fallback: just show everything
        revealEls.forEach(el => el.classList.add('in-view'));
    }

    // Profile photo fallback: if profile.jpg is missing, show a themed avatar instead
    const profileImg = document.getElementById('profileImg');
    const avatarFallback = document.getElementById('avatarFallback');
    if (profileImg && avatarFallback) {
        profileImg.addEventListener('error', () => {
            profileImg.hidden = true;
            avatarFallback.hidden = false;
        });
    }
});
