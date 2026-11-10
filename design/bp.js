/* bp.js — shared blueprint behavior.

   Landing rule: hero / first screen owns the tab.
   Sections below reveal only after user intent:
   1. scrolling into view (IntersectionObserver), or
   2. the first pointer/key/touch action (one-shot: reveals sections
      with a stagger so "any action" starts the fade sequence). */

(function revealBlueprint() {
    const sections = [...document.querySelectorAll('.sec')];
    if (!sections.length) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
        sections.forEach((el) => el.classList.add('in'));
        return;
    }

    /* keep the first screen section(s) (hero) always on */
    for (let i = 0; i < Math.min(2, sections.length); i++) {
        sections[i].classList.add('in', 'pinned');
    }
    /* start the first section's entrance immediately (no scroll needed) */
    if (sections[1]) sections[1].classList.add('in');

    const startFx = (el, delayMs) => {
        el.style.transitionDelay = `${delayMs}ms`;
        el.classList.add('in');
        el.addEventListener('transitionend', function clear() {
            el.style.transitionDelay = '0ms';
            el.removeEventListener('transitionend', clear);
        });
    };

    /* reveal on scroll into view (normal case) */
    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((en) => {
                if (!en.isIntersecting) return;
                startFx(en.target, Math.min(sections.indexOf(en.target) * 60, 360));
                io.unobserve(en.target);
            });
        },
        { threshold: 0.08 }
    );
    sections
        .filter((el) => !el.classList.contains('in'))
        .forEach((el) => io.observe(el));

    /* any first user action also starts the reveal cascade */
    const begin = () => {
        sections
            .filter((el) => !el.classList.contains('in'))
            .forEach((el, i) => startFx(el, Math.min(i * 60, 360)));
        ['wheel', 'touchstart', 'keydown'].forEach((evt) =>
            window.removeEventListener(evt, begin)
        );
    };
    ['wheel', 'touchstart', 'keydown'].forEach((evt) =>
        window.addEventListener(evt, begin, { passive: true })
    );
})();
