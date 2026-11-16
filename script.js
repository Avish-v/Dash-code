document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.getElementById('progressBar');
    const nav = document.getElementById('nav');

    const updateScrollState = () => {
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = documentHeight > 0 ? (window.scrollY / documentHeight) * 100 : 0;
        if (progressBar) progressBar.style.width = `${Math.min(progress, 100)}%`;
        if (nav) nav.classList.toggle('scrolled', window.scrollY > 12);
    };

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });

    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const setMenuState = (isOpen) => {
        if (!navToggle || !navLinks) return;
        navToggle.classList.toggle('open', isOpen);
        navLinks.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
        navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    };

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => setMenuState(!navLinks.classList.contains('open')));
        navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenuState(false)));
        window.addEventListener('resize', () => {
            if (window.innerWidth > 760) setMenuState(false);
        });
    }

    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealElements.forEach((element) => observer.observe(element));
    } else {
        revealElements.forEach((element) => element.classList.add('in-view'));
    }

    const typedElement = document.getElementById('typedText');
    if (typedElement) {
        const words = ['build --with-purpose', 'design --for-people', 'launch --with-confidence'];
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            typedElement.textContent = words[0];
        } else {
            let word = 0;
            let character = 0;
            let deleting = false;
            const type = () => {
                const current = words[word];
                character += deleting ? -1 : 1;
                typedElement.textContent = current.slice(0, character);
                if (!deleting && character === current.length) {
                    deleting = true;
                    window.setTimeout(type, 1350);
                    return;
                }
                if (deleting && character === 0) {
                    deleting = false;
                    word = (word + 1) % words.length;
                }
                window.setTimeout(type, deleting ? 28 : 55);
            };
            type();
        }
    }

    const serviceSelect = document.getElementById('service');
    document.querySelectorAll('[data-service]').forEach((link) => {
        link.addEventListener('click', () => {
            if (serviceSelect) serviceSelect.value = link.dataset.service || '';
        });
    });

    const enquiryForm = document.getElementById('enquiryForm');
    const formError = document.getElementById('formError');
    if (enquiryForm && formError) {
        enquiryForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const fullName = enquiryForm.elements.fullName.value.trim();
            const email = enquiryForm.elements.email.value.trim();
            const phone = enquiryForm.elements.phone.value.trim();
            const service = enquiryForm.elements.service.value;
            const project = enquiryForm.elements.project.value.trim();
            const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (!fullName || !emailIsValid || !service || !project) {
                formError.textContent = 'Please complete your name, a valid email, service selection and project description.';
                const firstInvalid = !fullName ? enquiryForm.elements.fullName : !emailIsValid ? enquiryForm.elements.email : !service ? enquiryForm.elements.service : enquiryForm.elements.project;
                firstInvalid.focus();
                return;
            }

            formError.textContent = 'Opening your email application with the enquiry details.';
            const subject = encodeURIComponent(`Project enquiry from ${fullName}`);
            const message = encodeURIComponent(`Hello DASH CODE,\n\nName: ${fullName}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nService: ${service}\n\nProject details:\n${project}\n\nThank you.`);
            window.location.href = `mailto:dashcode07@gmail.com?subject=${subject}&body=${message}`;
        });
    }
});
