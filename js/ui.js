/* ============================================================
   ui.js — navbar state, mobile menu, scroll reveals, copy email,
   footer year, toast helper.
   ============================================================ */

/* ── active nav link ── */
(function setActiveNav() {
    const page = document.body.dataset.page;
    if (!page) return;
    document.querySelectorAll('.nav-links a').forEach((a) => {
        if (a.dataset.nav === page) a.setAttribute('aria-current', 'page');
    });
})();

/* ── mobile menu ── */
(function mobileMenu() {
    const burger = document.querySelector('.nav-burger');
    const nav = document.querySelector('.nav');
    if (!burger || !nav) return;
    burger.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        burger.setAttribute('aria-expanded', String(open));
    });
    // close when a link is clicked
    nav.querySelectorAll('.nav-links a').forEach((a) =>
        a.addEventListener('click', () => nav.classList.remove('open'))
    );
})();

/* ── scroll reveal ── */
(function setupReveals() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        els.forEach((el) => el.classList.add('in'));
        return;
    }
    const io = new IntersectionObserver(
        (entries) =>
            entries.forEach((en) => {
                if (en.isIntersecting) {
                    en.target.classList.add('in');
                    io.unobserve(en.target);
                }
            }),
        { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
})();

/* ── first user action → fade in everything still hidden ──
   mirrors the blueprint rule: scroll reveals section-by-section,
   but any wheel/touch/key action starts the whole cascade at once */
(function firstActionReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const hidden = document.querySelectorAll('.reveal:not(.in)');
    if (!hidden.length) return;
    const begin = () => {
        hidden.forEach((el, i) => {
            el.style.transitionDelay = `${Math.min(i * 100, 500)}ms`;
            el.classList.add('in');
            el.addEventListener(
                'transitionend',
                function clear() {
                    el.style.transitionDelay = '';
                    el.removeEventListener('transitionend', clear);
                },
                { once: true }
            );
        });
        ['wheel', 'touchstart', 'keydown'].forEach((evt) =>
            window.removeEventListener(evt, begin)
        );
    };
    ['wheel', 'touchstart', 'keydown'].forEach((evt) =>
        window.addEventListener(evt, begin, { passive: true })
    );
})();

/* ── pointer glow: track cursor over cards (delegated, passive) ── */
(function pointerGlow() {
    document.addEventListener(
        'pointermove',
        (e) => {
            const card = e.target.closest?.('.card');
            if (!card) return;
            const r = card.getBoundingClientRect();
            card.style.setProperty('--mx', `${e.clientX - r.left}px`);
            card.style.setProperty('--my', `${e.clientY - r.top}px`);
        },
        { passive: true }
    );
})();

/* ── toast ── */
function toast(msg, tone = 'ok') {
    let t = document.querySelector('.toast');
    if (!t) {
        t = document.createElement('div');
        t.className = 'toast';
        t.setAttribute('role', 'status');
        document.body.appendChild(t);
    }
    if (tone !== 'ok') t.dataset.tone = tone;
    else delete t.dataset.tone;
    t.textContent = msg;
    requestAnimationFrame(() => t.classList.add('show'));
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ── copy email ── */
(function setupCopyEmail() {
    document.querySelectorAll('[data-copy-email]').forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!PROFILE.email) {
                toast('email not set — edit js/data.js → PROFILE.email', 'warn');
                return;
            }
            try {
                await navigator.clipboard.writeText(PROFILE.email);
                toast(PROFILE.email + ' copied to clipboard');
            } catch (_) {
                toast('could not copy email', 'warn');
            }
        });
    });
})();

/* ── dynamic profile bits (socials/email rows on any page) ── */
(function hydrateProfile() {
    document.querySelectorAll('[data-email]').forEach((el) => {
        el.textContent = PROFILE.email || 'you@example.com (set email in js/data.js)';
    });
    document.querySelectorAll('[data-year]').forEach((el) => {
        el.textContent = new Date().getFullYear();
    });
})();

/* ── contact form (Web3Forms) ── */
(function setupForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    const status = document.getElementById('form-status');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!PROFILE.web3formsKey) {
            status.textContent = 'err: form disabled — paste your Web3Forms key in js/data.js → PROFILE.web3formsKey';
            status.className = 'form-status err';
            return;
        }
        const btn = form.querySelector('button[type="submit"]');
        const original = btn.textContent;
        btn.disabled = true;
        btn.textContent = '[ transmitting… ]';
        status.textContent = '';
        status.className = 'form-status';

        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    access_key: PROFILE.web3formsKey,
                    name: form.elements.name.value,
                    email: form.elements.email.value,
                    message: form.elements.message.value,
                }),
            });
            const data = await res.json();
            if (data.success) {
                status.textContent = 'ok > message received — I will get back to you soon.';
                status.className = 'form-status ok';
                form.reset();
            } else {
                throw new Error(data.message || 'unknown error');
            }
        } catch (err) {
            status.textContent = 'err > transmission failed — ' + err.message;
            status.className = 'form-status err';
        } finally {
            btn.disabled = false;
            btn.textContent = original;
        }
    });
})();

/* ── theme toggle (light ⇄ dark) ──
   The <html data-theme> attribute is set pre-paint by the inline head
   script; this keeps the button, meta theme-color and the WebGL hero in
   sync, and persists an explicit choice in localStorage. */
(function themeToggle() {
    const root = document.documentElement;
    const btn = document.querySelector('.nav-theme');
    const meta = document.querySelector('meta[name="theme-color"]');
    const DARK = 'dark';
    const LIGHT = 'light';

    function savedTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (_) {
            return null;
        }
    }

    function applyTheme(mode, persist) {
        const dark = mode === DARK;
        if (dark) root.dataset.theme = DARK;
        else delete root.dataset.theme;
        if (meta) meta.setAttribute('content', dark ? '#080c14' : '#F4F6F1');
        if (btn) {
            btn.setAttribute('aria-pressed', String(dark));
            btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
        }
        if (persist) {
            try {
                localStorage.setItem('theme', mode);
            } catch (_) { /* storage blocked — session-only toggle */ }
        }
        document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: mode } }));
    }

    applyTheme(root.dataset.theme === DARK ? DARK : LIGHT, false);

    if (btn) {
        btn.addEventListener('click', () => {
            applyTheme(root.dataset.theme === DARK ? LIGHT : DARK, true);
        });
    }

    /* follow the OS only while the visitor has not chosen explicitly */
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onScheme = (e) => {
        if (!savedTheme()) applyTheme(e.matches ? DARK : LIGHT, false);
    };
    if (mq.addEventListener) mq.addEventListener('change', onScheme);
    else if (mq.addListener) mq.addListener(onScheme);
})();
