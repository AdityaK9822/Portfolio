/* ============================================================
   stack-pile.js — pile limiter for the CSS sticky scroll stack
   (components.css pins the cards via position:sticky + the view()
   exit animation; this driver only manages the pile on top of that):

   • at most PILE_SIZE (3) layers stay visible in the pile
   • cards behind the front one blur in slowly with scroll — the
     newest covering card ramps the covered card's blur over a 10vh
     window after it pins (same model as js/scroll-stack.js)
   • when the 4th card pins, the pile would exceed 3 → the deepest
     card is buried: it fades out (opacity + extra blur over 0.35vh
     of scroll) while every surviving card shifts up one 16px sticky
     step per buried card, re-compacting the pile to 3 layers
   • the shift runs on the separate `translate` property (not
     transform) so it never fights the CSS exit animation, which
     animates transform/filter only

   Reduced-motion → no-op. Expects render.js to have rendered
   .scroll-stack-card elements inside .scroll-stack.
   ============================================================ */

(function stackPile() {
    const container = document.querySelector('.scroll-stack');
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = Array.from(container.querySelectorAll('.scroll-stack-card'));
    if (cards.length < 2) return;

    /* mirrors components.css geometry: top: calc(90px + i*16px) */
    const BASE_TOP = 90;
    const TOP_STEP = 16;
    const PILE_SIZE = 3;      /* layers kept visible in the pile */
    const BLUR_STEP = 4;      /* px of blur per covering layer */
    const BURY_BLUR = 10;     /* extra blur px while a buried card fades */
    const RAMP_FRAC = 0.1;    /* blur ramp window after a pin, ×viewport */
    const FADE_FRAC = 0.35;   /* buried-card fade window, ×viewport */
    const ENTRY_FRAC = 0.7;   /* entry-scale window before a card pins, ×viewport */
    const ENTRY_SCALE_FROM = 0.75; /* scale at the start of entry */

    /* document-space offsets, cached per layout (offsetTop ignores
       transforms, so pinning never poisons the measurements) */
    let cardTops = [];

    function measure() {
        const containerTop = container.getBoundingClientRect().top + window.scrollY;
        cardTops = cards.map((c) => containerTop + c.offsetTop);
    }

    /* scroll position at which card i pins (reaches its sticky top) */
    const pinScroll = (i) => cardTops[i] - (BASE_TOP + TOP_STEP * i);

    const progress = (scrollTop, start, end) =>
        scrollTop < start ? 0 : scrollTop > end ? 1 : (scrollTop - start) / (end - start);

    /* the shift eases via transition; blur/opacity are scroll-scrubbed
       per frame, so only translate gets a transition */
    cards.forEach((card) => {
        card.style.transition = 'translate 0.35s ease-out';
    });

    const last = new Map();

    function update() {
        if (!cardTops.length) return;
        const scrollTop = window.scrollY;
        const vh = window.innerHeight;

        const pinAt = cardTops.map((_, j) => pinScroll(j));
        const pinnedCount = pinAt.filter((p) => scrollTop >= p).length;

        cards.forEach((card, i) => {
            /* cards pinned above this one */
            let onTop = 0;
            for (let j = i + 1; j < cards.length; j++) {
                if (scrollTop >= pinAt[j]) onTop++;
            }

            /* blur behind: the newest covering card ramps this card's
               blur over the window after it pins — gradual, no steps */
            let blur = 0;
            if (onTop > 0) {
                const k = i + onTop;
                const ramp = progress(scrollTop, pinAt[k], pinAt[k] + RAMP_FRAC * vh);
                blur = (onTop - 1 + ramp) * BLUR_STEP;
            }

            /* pile would exceed PILE_SIZE → bury the deepest card:
               fade it out (and blur it further) as scrolling continues,
               starting the moment the 4th-out card pins */
            let opacity = 1;
            if (onTop >= PILE_SIZE) {
                const buryStart = pinAt[i + PILE_SIZE];
                const fadeT = progress(scrollTop, buryStart, buryStart + FADE_FRAC * vh);
                opacity = 1 - fadeT;
                blur += fadeT * BURY_BLUR;
            }

            /* close freed slots: shift up one TOP_STEP per buried card
               below this one, capped at the pile depth */
            const shiftCount = Math.max(0, Math.min(i, pinnedCount - PILE_SIZE));
            const translate = `0px ${-(TOP_STEP * shiftCount)}px`;

            /* entry: scale up from ENTRY_SCALE_FROM → 1 while scrolling
               toward the pin point — only for the FIRST card */
            let entryScale = 1;
            if (i === 0) {
                const entryStart = pinAt[i] - ENTRY_FRAC * vh;
                const entryT = progress(scrollTop, entryStart, pinAt[i]);
                entryScale = ENTRY_SCALE_FROM + (1 - ENTRY_SCALE_FROM) * entryT;
            }

            const prev = last.get(i) || { blur: 0, opacity: 1, translate: '0px 0px', scale: 1 };
            if (Math.abs(prev.blur - blur) > 0.1) {
                card.style.filter = blur > 0 ? `blur(${blur.toFixed(1)}px)` : 'none';
            }
            if (Math.abs(prev.opacity - opacity) > 0.01) {
                card.style.opacity = opacity < 1 ? opacity.toFixed(2) : '1';
            }
            if (prev.translate !== translate) {
                card.style.translate = translate;
            }
            if (i === 0 && Math.abs(prev.scale - entryScale) > 0.001) {
                card.style.scale = entryScale.toFixed(3);
            }
            last.set(i, { blur, opacity, translate, scale: i === 0 ? entryScale : 1 });
        });
    }

    function setup() {
        measure();
        update();
    }

    let ticking = false;
    function requestUpdate() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            ticking = false;
            update();
        });
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', () => {
        measure();
        requestUpdate();
    });

    /* layout shifts after first paint (webfonts, live GitHub stats)
       invalidate cached offsets → remeasure */
    window.addEventListener('load', () => {
        measure();
        requestUpdate();
    });
    if ('ResizeObserver' in window) {
        new ResizeObserver(() => {
            measure();
            requestUpdate();
        }).observe(container);
    }

    setup();
})();
