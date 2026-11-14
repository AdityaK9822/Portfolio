/* ============================================================
   scroll-stack.js — React Bits Pro "Scroll Stack", vanilla port
   (same approach as js/gradient-ascii.js). Faithful port of the
   official updateCardTransforms algorithm in window-scroll mode:

   • pinning via translate3d — cards are position:relative, the
     top card sits at stackPosition (15% viewport) + peek per layer
   • scale tweens from 1 → targetScale (baseScale, −itemScale/layer)
     across the card's trigger window
   • blur + brightness depth driven by the "cards on top" count,
     ramped over the newest card's arrival window
   • pile capped at PILE_SIZE (3) visible layers: peek offsets cap
     at the pile depth and buried cards fade + blur out as scroll
     continues, so the stack shows at most 3 cards
   • entry (mirror of the exit): over the last stretch of its travel
     each card rises a little faster, grows from ENTRY_SCALE to full
     size and sharpens from ENTRY_BLUR to clear, lerping to neutral
     exactly at the pin
   • transform writes skipped when nothing changed (official
     lastTransforms change-detection)

   Deliberately omitted from the official version: Lenis smooth
   scrolling (the site scrolls natively) and rotation/tilt (both
   configured to 0). End marker .scroll-stack-end + per-card
   margin-bottom are handled here like the React setup effect.

   Markup (render.js):
     .scroll-stack > article.scroll-stack-card … + .scroll-stack-end
   Reduced-motion → no-op: cards stay in natural flow.
   ============================================================ */

(function scrollStack() {
    const container = document.querySelector('.scroll-stack');
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = Array.from(container.querySelectorAll('.scroll-stack-card'));
    if (!cards.length) return;
    const endMarker = container.querySelector('.scroll-stack-end');

    /* config — mirrors the React component's props */
    const ITEM_DISTANCE = 60;         /* gap between cards in flow (px) — tighter */
    const ITEM_SCALE = 0.07;          /* scale lost per covering layer */
    const ITEM_STACK_DISTANCE = 26;   /* peek offset per pinned layer */
    const STACK_POSITION = 0.15;      /* stackPosition: '15%' of viewport */
    const SCALE_END_POSITION = 0.1;   /* scaleEndPosition: '10%' of viewport */
    const BASE_SCALE = 0.7;           /* floor for the deepest card */
    const DIM_AMOUNT = 0.28;          /* brightness lost per covering layer */
    const BLUR_AMOUNT = 4;            /* px of blur per covering layer */
    const HOLD_DISTANCE = 200;        /* runway held after the last card pins */
    const PILE_SIZE = 3;              /* cards kept visible in the pinned pile */
    const FADE_BLUR = 10;             /* extra blur px while a buried card fades out */
    const FADE_DISTANCE_FRAC = 0.35;  /* buried-card fade window, fraction of viewport */
    /* entry (mirror of the post-complete exit): while a card makes its
       final approach to the pin it rises the last stretch, grows to
       full size and sharpens (blur → clear) */
    const ENTRY_WINDOW_FRAC = 0.4;    /* entry runs over the last 40% of the
                                         card's viewport travel (below the pin) */
    const ENTRY_SCALE = 0.92;         /* size at entry start */
    const ENTRY_BLUR = 10;            /* blur px at entry start */
    const ENTRY_OFFSET_FRAC = 0.12;   /* extra descent at entry start, fraction
                                         of viewport — decays to 0 at the pin */
    /* the CSS-driven era shipped without the scrubber — flip to true
       to restore the 5-frame ticker under the stack */
    const SHOW_SCRUBBER = false;

    /* reference frames extracted from the 5 design screenshots:
       card-top positions (as a fraction of viewport height) and the
       relative blur (px) applied to the pinned card at that step */
    const TIMEFRAMES = [
        { top: 0.085, blur: 0 },
        { top: 0.153, peer: 0.349, blur: 2 },
        { top: 0.139, peer: 0.505, blur: 2 },
        { top: 0.308, blur: 1 },
        { top: 0.174, peer: 0.821, blur: 2 },
    ];

    /* document-space offsets, cached per layout. offsetTop ignores CSS
       transforms, so pinned cards never poison their own measurements
       (getBoundingClientRect would include the translate3d). */
    let cardTops = [];
    let endTop = 0;

    function measure() {
        /* the container itself is never transformed → its rect is stable */
        const containerTop = container.getBoundingClientRect().top + window.scrollY;
        cardTops = cards.map((c) => containerTop + c.offsetTop);
        endTop = endMarker ? containerTop + endMarker.offsetTop : 0;
    }

    const lastTransforms = new Map();
    let stackCompleted = false;

    const progress = (scrollTop, start, end) =>
        scrollTop < start ? 0 : scrollTop > end ? 1 : (scrollTop - start) / (end - start);

    function update() {
        if (!cardTops.length) return;
        const scrollTop = window.scrollY;
        const containerHeight = window.innerHeight;
        const stackPositionPx = STACK_POSITION * containerHeight;
        const scaleEndPositionPx = SCALE_END_POSITION * containerHeight;
        const pinEnd = endTop - containerHeight / 2 + HOLD_DISTANCE;

        cards.forEach((card, i) => {
            const cardTop = cardTops[i];
            /* active card pins at stackPosition; older cards peek above it */
            const triggerStart = cardTop - stackPositionPx;
            const triggerEnd = cardTop - scaleEndPositionPx;

            const scaleProgress = progress(scrollTop, triggerStart, triggerEnd);
            const targetScale = Math.max(BASE_SCALE, 1 - (cards.length - 1 - i) * ITEM_SCALE);
            /* let — the entry animation scales this further down (below) */
            let scale = 1 - scaleProgress * (1 - targetScale);

            /* count how many cards have stacked on top of this one */
            let cardsOnTop = 0;
            for (let j = i + 1; j < cards.length; j++) {
                const jTriggerStart = cardTops[j] - stackPositionPx;
                if (scrollTop >= jTriggerStart) cardsOnTop++;
            }

            /* keep the pile at PILE_SIZE cards: peek offsets cap at the
               pile depth; deeper cards fade + blur out with scroll and
               free their slot (the visible stack never exceeds 3) */
            const pileIndex = Math.min(cardsOnTop, PILE_SIZE - 1);

            /* the newest covering card ramps this card's blur over its
               arrival window — blur creeps in with scroll, no steps */
            let blurProgress = 0;
            if (cardsOnTop > 0) {
                const arriveStart = cardTops[i + cardsOnTop] - stackPositionPx;
                blurProgress = progress(scrollTop, arriveStart, arriveStart + scaleEndPositionPx);
            }

            let blur = (cardsOnTop - 1 + blurProgress) * BLUR_AMOUNT;
            const brightness = Math.max(0.2, 1 - cardsOnTop * DIM_AMOUNT);

            /* buried past the pile → fade out slowly as scrolling
               continues, starting when the card that pushed it pinned */
            let opacity = 1;
            if (cardsOnTop >= PILE_SIZE) {
                const buryStart = cardTops[i + PILE_SIZE] - stackPositionPx;
                const fadeT = progress(
                    scrollTop,
                    buryStart,
                    buryStart + FADE_DISTANCE_FRAC * containerHeight
                );
                opacity = 1 - fadeT;
                blur += fadeT * FADE_BLUR;
            }

            let translateY = 0;
            if (scrollTop >= triggerStart && scrollTop <= pinEnd) {
                translateY = scrollTop - cardTop + stackPositionPx - pileIndex * ITEM_STACK_DISTANCE;
            } else if (scrollTop > pinEnd) {
                translateY = pinEnd - cardTop + stackPositionPx - pileIndex * ITEM_STACK_DISTANCE;
            }

            /* ── entry (mirror of the exit) ──
               Before a card pins it is still in natural flow; over the
               last stretch of its travel up the viewport it rises a
               little faster, grows from ENTRY_SCALE to full size and
               sharpens from ENTRY_BLUR to clear. Everything lerps to
               neutral exactly at triggerStart, so the hand-off into
               the pinned state is seamless. */
            let entryT = 1;
            if (scrollTop < triggerStart) {
                entryT = progress(scrollTop,
                    triggerStart - ENTRY_WINDOW_FRAC * containerHeight,
                    triggerStart);
            }
            if (entryT < 1) {
                translateY += (1 - entryT) * ENTRY_OFFSET_FRAC * containerHeight;
                scale *= ENTRY_SCALE + (1 - ENTRY_SCALE) * entryT;
                blur += (1 - entryT) * ENTRY_BLUR;
            }

            const next = {
                translateY: Math.round(translateY * 100) / 100,
                scale: Math.round(scale * 1000) / 1000,
                blur: Math.round(blur * 10) / 10,
                brightness: Math.round(brightness * 100) / 100,
                opacity: Math.round(opacity * 100) / 100,
            };

            const prev = lastTransforms.get(i);
            const changed =
                !prev ||
                Math.abs(prev.translateY - next.translateY) > 0.1 ||
                Math.abs(prev.scale - next.scale) > 0.001 ||
                Math.abs(prev.blur - next.blur) > 0.1 ||
                Math.abs(prev.brightness - next.brightness) > 0.01 ||
                Math.abs(prev.opacity - next.opacity) > 0.01;
            if (!changed) return;

            card.style.transform =
                `translate3d(0, ${next.translateY}px, 0) scale(${next.scale})`;
            const filters = [];
            if (next.blur > 0) filters.push(`blur(${next.blur}px)`);
            if (next.brightness < 1) filters.push(`brightness(${next.brightness})`);
            card.style.filter = filters.length ? filters.join(' ') : 'none';
            card.style.opacity = next.opacity < 1 ? String(next.opacity) : '1';
            lastTransforms.set(i, next);

            /* last card pinned within the hold window → stack complete
               (official onStackComplete, exposed as a DOM event) */
            if (i === cards.length - 1) {
                const inView = scrollTop >= triggerStart && scrollTop <= pinEnd;
                if (inView && !stackCompleted) {
                    stackCompleted = true;
                    container.dispatchEvent(
                        new CustomEvent('scrollstack:complete', { bubbles: true })
                    );
                } else if (!inView && stackCompleted) {
                    stackCompleted = false;
                }
            }
        });

        /* keep timeframe ticks in sync */
        if (typeof updateScrubber === 'function') updateScrubber(scrollTop);
    }

    function setup() {
        /* official setup effect: spacing in flow; the last card needs no gap */
        cards.forEach((card, i) => {
            if (i < cards.length - 1) card.style.marginBottom = `${ITEM_DISTANCE}px`;
        });
        measure();
        update();
    }

    /* ── timeframes scrubber ─────────────────────────────────────
       Mimics the 5 reference frames (positions + blurs) as discrete
       steps: each tick scrolls to the point where the corresponding
       card begins to stack, and highlights the active frame.
       Gated behind SHOW_SCRUBBER (off — see config). */
    if (SHOW_SCRUBBER) {
        const FRAME_COUNT = Math.min(5, cards.length);
        const scrubber = document.createElement('div');
        scrubber.className = 'timeframe-scrubber';
        scrubber.setAttribute('aria-label', 'Scroll timeframes');
        const ticks = [];
        for (let i = 0; i < FRAME_COUNT; i++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'timeframe-tick';
            btn.textContent = String(i + 1).padStart(2, '0');
            btn.addEventListener('click', () => {
                const spx = STACK_POSITION * window.innerHeight;
                window.scrollTo({ top: Math.max(0, cardTops[i] - spx), behavior: 'smooth' });
            });
            scrubber.appendChild(btn);
            ticks.push(btn);
        }
        container.insertAdjacentElement('afterend', scrubber);
    }

    function updateScrubber(scrollTop) {
        if (!SHOW_SCRUBBER) return;
        const stackPositionPx = STACK_POSITION * window.innerHeight;
        const ticks = document.querySelectorAll('.timeframe-tick');
        let active = 0;
        for (let i = 0; i < Math.min(5, cards.length); i++) {
            const triggerStart = cardTops[i] - stackPositionPx;
            if (scrollTop >= triggerStart) active = i;
        }
        ticks.forEach((t, i) => t.classList.toggle('is-active', i === active));
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

    /* layout shifts after first paint (webfonts, live GitHub stats,
       tag wrapping) would invalidate cached offsets → remeasure */
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
