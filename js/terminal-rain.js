/* ============================================================
   terminal-rain.js — "Terminal Rain" background, ported from
   React Bits Pro (pro.reactbits.dev/docs/components/terminal-rain)
   to plain JS + Canvas 2D for this site. No React, no deps.

   Streams of glowing glyphs raining down in layered columns:
   three depth layers (back / mid / front) of falling character
   columns, each with a bright head and a fading trail. Reads the
   active theme for its accent color.

   Start behavior: the field opens sparse — only START_LIVE_COLUMNS
   columns are live on the first frame (hero reads near-black);
   every other column is parked above the viewport and streams in
   over the first START_SPREAD seconds. Resizes / theme rebuilds
   mid-session restore a full field.

   Driven by the hero bg switcher in js/hero.js (scene name:
   "terminal rain"). Also usable standalone:

   Usage:  new TerminalRain(container, options)
           instance.wake(active)   instance.destroy()

   Honors prefers-reduced-motion (one static field, no loop).
   ============================================================ */
(function TerminalRainModule() {
    'use strict';

    const GLYPHS = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ0123456789ABCDEF<>{}[]=/\\*+-#$%&';

    const LAYER_DEFS = [
        { fontSize: 11, speedMul: 0.45, opacity: 0.20, spacing: 13, trail: 9 },
        { fontSize: 15, speedMul: 0.85, opacity: 0.40, spacing: 20, trail: 13 },
        { fontSize: 21, speedMul: 1.35, opacity: 0.70, spacing: 30, trail: 17 },
    ];

    /* start state: only this many columns are on-screen at the first frame
       (hero opens near-black); the rest stream in over START_SPREAD seconds */
    const START_LIVE_COLUMNS = 25;
    const START_SPREAD = 3.5;

    function randomGlyph() { return GLYPHS[(Math.random() * GLYPHS.length) | 0]; }

    function isDarkTheme() { return document.documentElement.dataset.theme !== 'light'; }

    function palette() {
        if (isDarkTheme()) {
            return { accent: [34, 197, 94], bright: [187, 247, 208], glow: 'rgba(34,197,94,0.9)' };
        }
        return { accent: [21, 128, 61], bright: [34, 197, 94], glow: 'rgba(21,128,61,0.9)' };
    }

    function TerminalRain(container, options) {
        if (!container) return null;
        const canvas = document.createElement('canvas');
        canvas.className = 'terminal-rain-canvas';
        container.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        let width = 0, height = 0, dpr = 1;
        let layers = [];
        let raf = null;
        let running = false;
        let lastTime = 0;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        /* "settled" = the field has finished streaming in. Rebuilds
           (ResizeObserver / window resize) seed a full field only once
           settled — before that they keep the sparse start, so the
           late layout settling right after page load (deferred scripts,
           font swaps) never re-seeds a full field over it. Reduced-motion
           users start settled: one full static field, no loop. */
        let settled = reduced;
        let startedAt = 0;

        function makeCol(x, ld) {
            const trail = ld.trail + ((Math.random() * 6) | 0);
            const chars = new Array(trail);
            for (let i = 0; i < trail; i++) chars[i] = randomGlyph();
            const step = ld.fontSize * 1.15;
            return {
                x: x,
                /* starts parked above the viewport — buildLayers seeding
                   decides which columns are live on frame one */
                y: -(trail * step) - Math.random() * height * 0.5,
                speed: (70 + Math.random() * 130) * ld.speedMul,
                trail: trail,
                chars: chars,
                delay: Math.random() * START_SPREAD,
            };
        }

        function buildLayers(fullField) {
            layers = [];
            const allCols = [];
            LAYER_DEFS.forEach(function (ld, li) {
                const colCount = Math.max(1, Math.floor(width / ld.spacing));
                const cols = new Array(colCount);
                for (let i = 0; i < colCount; i++) {
                    cols[i] = makeCol(i * ld.spacing + ld.spacing * 0.5, ld);
                    allCols.push(cols[i]);
                }
                layers.push({ fontSize: ld.fontSize, speedMul: ld.speedMul,
                    opacity: ld.opacity, spacing: ld.spacing, trail: ld.trail,
                    layerIdx: li, cols: cols });
            });
            if (fullField) {
                /* resize/theme rebuilds mid-session: restore a full field */
                allCols.forEach(function (col) {
                    col.delay = 0;
                    col.y = Math.random() * height;
                });
            } else {
                /* first load: shuffle, then wake exactly START_LIVE_COLUMNS
                   spread across the layers — everything else streams in */
                for (let i = allCols.length - 1; i > 0; i--) {
                    const j = (Math.random() * (i + 1)) | 0;
                    const t = allCols[i]; allCols[i] = allCols[j]; allCols[j] = t;
                }
                for (let i = 0; i < allCols.length; i++) {
                    if (i < START_LIVE_COLUMNS) {
                        allCols[i].delay = 0;
                        allCols[i].y = Math.random() * height;
                    }
                }
            }
        }

        function resize() {
            const rect = container.getBoundingClientRect();
            width = Math.max(1, Math.round(rect.width || container.clientWidth || 800));
            height = Math.max(1, Math.round(rect.height || container.clientHeight || 600));
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            buildLayers(settled);
            if (reduced) drawFrame(0);
        }

        function drawFrame(dt) {
            const p = palette();
            const ar = p.accent, br = p.bright;
            ctx.clearRect(0, 0, width, height);

            /* back → front */
            for (let li = 0; li < layers.length; li++) {
                const layer = layers[li];
                const fs = layer.fontSize;
                ctx.font = fs + 'px "Space Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                for (let ci = 0; ci < layer.cols.length; ci++) {
                    const col = layer.cols[ci];
                    /* still waiting to stream in — parked above the
                       viewport; burn its delay in real time */
                    if (col.delay > 0) {
                        col.delay -= (dt > 0 ? dt : 0);
                        continue;
                    }
                    col.y += col.speed * (dt > 0 ? dt : 0);
                    /* reset when fully past the bottom */
                    if (col.y - col.trail * fs * 1.15 > height) {
                        col.y = -Math.random() * height * 0.7 - col.trail * fs;
                        col.speed = (70 + Math.random() * 130) * layer.speedMul;
                        for (let i = 0; i < col.chars.length; i++) col.chars[i] = randomGlyph();
                    }
                    /* occasional glyph mutation */
                    if (Math.random() < 0.06) {
                        const idx = (Math.random() * col.chars.length) | 0;
                        col.chars[idx] = randomGlyph();
                    }

                    const step = fs * 1.15;
                    for (let k = 0; k < col.trail; k++) {
                        const cy = col.y - k * step;
                        if (cy < -fs || cy > height + fs) continue;
                        const alpha = layer.opacity * (1 - k / col.trail);
                        if (alpha <= 0.02) continue;
                        if (k === 0) {
                            ctx.shadowColor = p.glow;
                            ctx.shadowBlur = 14;
                            ctx.fillStyle = 'rgba(' + br[0] + ',' + br[1] + ',' + br[2] + ',' + Math.min(1, layer.opacity) + ')';
                        } else {
                            ctx.shadowBlur = 0;
                            ctx.fillStyle = 'rgba(' + ar[0] + ',' + ar[1] + ',' + ar[2] + ',' + alpha + ')';
                        }
                        ctx.fillText(col.chars[k % col.chars.length], col.x, cy);
                    }
                }
                ctx.shadowBlur = 0;
            }
            ctx.globalAlpha = 1;
        }

        function loop() {
            if (!running) return;
            const now = performance.now();
            const dt = Math.min((now - lastTime) / 1000, 0.05);
            lastTime = now;
            drawFrame(dt);
            /* the stream-in window has elapsed — later rebuilds seed a
               full field (small margin past START_SPREAD so the last
               columns are actually on-screen, not just unblocked) */
            if (!settled && startedAt && now - startedAt > (START_SPREAD + 1) * 1000) {
                settled = true;
            }
            raf = requestAnimationFrame(loop);
        }

        function wake(active) {
            if (active) {
                if (!running) {
                    running = true;
                    lastTime = performance.now();
                    if (!startedAt) startedAt = performance.now();
                    drawFrame(0);            /* sparse start frame */
                    if (!reduced) raf = requestAnimationFrame(loop);
                }
            } else {
                running = false;
                if (raf) { cancelAnimationFrame(raf); raf = null; }
            }
        }

        function destroy() {
            running = false;
            if (raf) { cancelAnimationFrame(raf); raf = null; }
            window.removeEventListener('resize', onResize);
            if (ro) ro.disconnect();
            if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        }

        function onResize() { resize(); }

        let ro = null;
        if (typeof ResizeObserver !== 'undefined') {
            ro = new ResizeObserver(function () {
                /* RO delivers an initial entry right after construction —
                   same size we just built with. Ignore no-op deliveries so
                   the sparse start survives; only real size changes rebuild. */
                const rect = container.getBoundingClientRect();
                if (Math.round(rect.width) === width && Math.round(rect.height) === height) return;
                resize();
            });
            ro.observe(container);
        }
        window.addEventListener('resize', onResize);

        resize();

        /* public */
        this.wake = wake;
        this.destroy = destroy;
        this.resize = resize;
    }

    window.TerminalRain = TerminalRain;
})();
