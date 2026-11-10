/* ============================================================
   hero.js — WebGL wave-grid hero (three.js r128 from CDN).
   Degrades gracefully: if three.js fails to load (or the user
   prefers reduced motion), renders one static frame or nothing.
   ============================================================ */

(function heroBackground() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 100);
    const camBase = new THREE.Vector3(0, 9.5, 15);
    camera.position.copy(camBase);
    camera.lookAt(0, 0, -2);

    /* wave grid of points */
    const COLS = 90;
    const ROWS = 90;
    const SPACING = 0.55;
    const COUNT = COLS * ROWS;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const x0 = new Float32Array(COUNT);      // base x
    const z0 = new Float32Array(COUNT);      // base z
    const cA = new THREE.Color(0x1e293b);    // slate — calm
    const cB = new THREE.Color(0x22c55e);    // green — crest

    let i = 0;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const x = (c - COLS / 2) * SPACING;
            const z = (r - ROWS / 2) * SPACING;
            positions[i * 3] = x;
            positions[i * 3 + 1] = 0;
            positions[i * 3 + 2] = z;
            x0[i] = x;
            z0[i] = z;
            i++;
        }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
        size: 0.055,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
    });

    const points = new THREE.Points(geo, mat);
    points.rotation.x = 0; // camera looks down at the plane
    scene.add(points);

    /* pointer tracking (normalized -1..1) */
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    window.addEventListener('pointermove', (e) => {
        mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });

    function resize() {
        const w = canvas.clientWidth || canvas.parentElement.clientWidth;
        const h = canvas.clientHeight || canvas.parentElement.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize();

    const posAttr = geo.getAttribute('position');
    const colAttr = geo.getAttribute('color');

    function draw(t) {
        for (let i = 0; i < COUNT; i++) {
            const wx = x0[i];
            const wz = z0[i];
            const dist = Math.sqrt(wx * wx + wz * wz);
            const wave =
                Math.sin(dist * 0.85 - t * 1.15) * 0.55 +
                Math.sin(wz * 0.6 + t * 0.4) * 0.35;
            posAttr.array[i * 3 + 1] = wave;
            /* color follows wave height */
            const k = Math.min(Math.max((wave + 0.9) / 2.1, 0), 1) ** 3;
            colAttr.array[i * 3] = cA.r + (cB.r - cA.r) * k;
            colAttr.array[i * 3 + 1] = cA.g + (cB.g - cA.g) * k;
            colAttr.array[i * 3 + 2] = cA.b + (cB.b - cA.b) * k;
        }
        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;
    }

    /* pause rendering when hero is off-screen */
    let visible = true;
    const io = new IntersectionObserver((en) => (visible = en[0].isIntersecting), {
        threshold: 0.02,
    });
    io.observe(canvas);

    function loop(now) {
        if (!visible) {
            requestAnimationFrame(loop);
            return;
        }
        const t = now * 0.001;
        draw(t);
        /* eased pointer parallax */
        mouse.x += (mouse.tx - mouse.x) * 0.04;
        mouse.y += (mouse.ty - mouse.y) * 0.04;
        camera.position.x = camBase.x + mouse.x * 1.6;
        camera.position.y = camBase.y - mouse.y * 0.9;
        camera.lookAt(0, 0, -2);
        renderer.render(scene, camera);
        requestAnimationFrame(loop);
    }

    if (reduced) {
        draw(0);
        renderer.render(scene, camera);
    } else {
        requestAnimationFrame(loop);
    }
})();
