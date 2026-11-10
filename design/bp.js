/* bp.js — shared blueprint behavior.
   Staggered section reveal: ramp scales with section order on the page,
   delay is applied per-intersection and cleared so hover feedback stays snappy. */
(function revealSections() {
    const sections = [...document.querySelectorAll('.sec')];
    if (!sections.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        sections.forEach((el) => el.classList.add('in'));
        return;
    }
    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((en) => {
                if (!en.isIntersecting) return;
                const el = en.target;
                const i = sections.indexOf(el);
                el.style.transitionDelay = `${Math.min(i * 60, 420)}ms`;
                el.classList.add('in');
                el.addEventListener('transitionend', function clear() {
                    el.style.transitionDelay = '0ms';
                    el.removeEventListener('transitionend', clear);
                });
                io.unobserve(el);
            });
        },
        { threshold: 0.08 }
    );
    sections.forEach((el) => io.observe(el));
})();
