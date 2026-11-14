/* ============================================================
   terminal-rain.js — "Terminal Rain" background, ported from
   React Bits Pro (pro.reactbits.dev/docs/components/terminal-rain)
   to plain JS + Canvas 2D for this site. No React, no deps.

   Streams of glowing glyphs raining down in layered columns:
   three depth layers (back / mid / front) of falling character
   columns, each with a bright head and a fading trail. Reads the
   active theme for its accent color.

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
        { fontSize: 11, speedMul: 0.45, opacity: 0.45, spacing: 13, trail: 9 },
        { fontSize: 15, speedMul: 0.85, opacity: 0.82, spacing: 20, trail: 13 },
        { fontSize: 21, speedMul: 1.35, opacity: 1.0,  spacing: 30, trail: 17 },
    ];

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

        function makeCol(x, ld) {
            const trail = ld.trail + ((Math.random() * 6) | 0);
            const chars = new Array(trail);
            for (let i = 0; i < trail; i++) chars[i] = randomGlyph();
            const step = ld.fontSize * 1.15;
            return {
                x: x,
                /* seed heads across the full travel range so the field is
                   fully populated on the first frame — no empty warm-up */
                y: Math.random() * (height + trail * step) - trail * step,
                speed: (70 + Math.random() * 130) * ld.speedMul,
                trail: trail,
                chars: chars,
            };
        }

        function buildLayers() {
            layers = [];
            LAYER_DEFS.forEach(function (ld, li) {
                const colCount = Math.max(1, Math.floor(width / ld.spacing));
                const cols = new Array(colCount);
                for (let i = 0; i < colCount; i++) {
                    cols[i] = makeCol(i * ld.spacing + ld.spacing * 0.5, ld);
                }
                layers.push({ fontSize: ld.fontSize, speedMul: ld.speedMul,
                    opacity: ld.opacity, spacing: ld.spacing, trail: ld.trail,
                    layerIdx: li, cols: cols });
            });
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
            buildLayers();
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
                        /* fade toward the tail but never fully transparent —
                           keeps the column readable (0.15 floor) */
                        const alpha = layer.opacity * (0.15 + 0.85 * (1 - k / col.trail));
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
            raf = requestAnimationFrame(loop);
        }

        function wake(active) {
            if (active) {
                if (!running) {
                    running = true;
                    lastTime = performance.now();
                    drawFrame(0);            /* populated field immediately */
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
            ro = new ResizeObserver(function () { resize(); });
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
