/* ============================================================
   cipher-reveal.js — React Bits "Decrypted Text" (cipher),
   vanilla port. Stable layout: each cell keeps its real glyph's
   width (via an invisible anchor) while the scrambled glyph is
   overlaid and scaleX-fit to that width — so the line never
   re-centers while decoding. Spaces are always spaces.

   Usage: <el data-cipher>Text to scramble</el>
   Optional: data-cipher-speed="ms" (per-char reveal interval),
   data-cipher-duration="ms" (total reveal time, default 2000; per-char
   speed derived from text length so each element lands in ~0.75-1s),
   data-cipher-delay="ms" (start delay, default cascades i*180).
   Degrades gracefully: reduced-motion → shows real text at once.
   ============================================================ */

(function cipherReveal() {
    const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* canvas-based glyph measurement (matches React Bits' advance()) */
    let measureCtx = null;
    const widthCache = new Map();
    function measureWidth(font, glyph) {
        let byFont = widthCache.get(font);
        if (!byFont) { byFont = new Map(); widthCache.set(font, byFont); }
        if (byFont.has(glyph)) return byFont.get(glyph);
        if (!measureCtx) measureCtx = document.createElement('canvas').getContext('2d');
        if (!measureCtx) return 0;
        measureCtx.font = font;
        const w = measureCtx.measureText(glyph).width;
        byFont.set(glyph, w);
        return w;
    }
    function readFont(node) {
        const s = window.getComputedStyle(node);
        return `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
    }
    function fit(font, realChar, glyph) {
        const room = measureWidth(font, realChar);
        const need = measureWidth(font, glyph);
        if (need <= room + 0.01) return 1;
        return Math.max(0.05, room / need);
    }

    const randChar = () => CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];

    /* split text into cells. Each non-space char becomes a cell with
       an invisible anchor (reserves the real width) plus an overlaid,
       scaleX-fit scrambled glyph. Spaces stay as literal spaces. */
    function collectNodes(el) {
        const chars = [];
        (function walk(node) {
            Array.from(node.childNodes).forEach((child) => {
                if (child.nodeType === Node.TEXT_NODE) {
                    const frag = document.createDocumentFragment();
                    Array.from(child.textContent).forEach((ch) => {
                        if (/\s/.test(ch)) {
                            frag.appendChild(document.createTextNode(ch));
                            chars.push({ isSpace: true });
                            return;
                        }
                        const cell = document.createElement('span');
                        cell.className = 'cipher-cell';
                        const anchor = document.createElement('span');
                        anchor.className = 'cipher-anchor';
                        anchor.textContent = ch;
                        anchor.setAttribute('aria-hidden', 'true');
                        const glyph = document.createElement('span');
                        glyph.className = 'cipher-glyph';
                        glyph.setAttribute('aria-hidden', 'true');
                        cell.appendChild(anchor);
                        cell.appendChild(glyph);
                        frag.appendChild(cell);
                        chars.push({ isSpace: false, cell, glyph, realChar: ch });
                    });
                    node.replaceChild(frag, child);
                } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'SCRIPT') {
                    walk(child);
                }
            });
        })(el);
        return chars;
    }

    function scrambleCell(c, font) {
        const g = randChar();
        c.glyph.textContent = g;
        const s = fit(font, c.realChar, g);
        c.glyph.style.transform = s < 1 ? `scaleX(${s})` : '';
    }

    function decode(chars, speedMs, font) {
        const total = chars.length;
        let revealed = 0;
        let start = null;
        function tick(now) {
            if (start === null) start = now;
            const target = Math.floor((now - start) / speedMs);
            while (revealed < Math.min(target, total)) {
                const c = chars[revealed];
                if (!c.isSpace) {
                    c.cell.classList.add('is-revealed');
                }
                revealed++;
            }
            if (revealed >= total) return;
            for (let i = revealed; i < total; i++) {
                const c = chars[i];
                if (c.isSpace) continue;
                scrambleCell(c, font);
            }
            requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    function run() {
        const els = document.querySelectorAll('[data-cipher]');
        els.forEach((el, i) => {
            if (reduced) return; /* leave original text as-is */
            if (el.dataset.cipherBound) return;
            el.dataset.cipherBound = '1';
            const chars = collectNodes(el);
            if (!chars.length) return;
            const font = readFont(el);
            /* cover the text with scrambled glyphs up-front */
            chars.forEach((c) => {
                if (c.isSpace) return;
                scrambleCell(c, font);
            });
            const delay = parseInt(el.dataset.cipherDelay || String(i * 180), 10);
            const duration = parseInt(el.dataset.cipherDuration || '2000', 10);
            const speed = el.dataset.cipherSpeed
                ? parseInt(el.dataset.cipherSpeed, 10)
                : Math.max(20, Math.round(duration / chars.length));
            setTimeout(() => decode(chars, speed, font), delay);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
})();
