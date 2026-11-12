/* ============================================================
   hero.js — WebGL hero backgrounds (three.js r128 from CDN).
   FIVE scenes behind a cycle switcher (bg_prev / bg_next):
   wave grid · network mesh · floating solids · starfield ·
   wireframe terrain. Degrades gracefully: no three.js → nothing;
   reduced motion → one static frame of the current scene.
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
    const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 200);

    /* palette — matches the site tokens */
    const GREEN = new THREE.Color(0x22c55e);
    const SLATE = new THREE.Color(0x1e293b);
    const FAINT = new THREE.Color(0x475569);

    /* pointer tracking (normalized -1..1) for gentle parallax */
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    window.addEventListener('pointermove', (e) => {
        mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });

    /* ── helpers ─────────────────────────────────────────────── */
    function disposeGroup(group) {
        group.traverse((obj) => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                (Array.isArray(obj.material) ? obj.material : [obj.material])
                    .forEach((m) => m.dispose());
            }
        });
        scene.remove(group);
    }

    /* ── 1 · WAVE GRID (the original) ────────────────────────── */
    function buildWaveGrid() {
        const COLS = 90, ROWS = 90, SPACING = 0.55;
        const COUNT = COLS * ROWS;
        const positions = new Float32Array(COUNT * 3);
        const colors = new Float32Array(COUNT * 3);
        const x0 = new Float32Array(COUNT);
        const z0 = new Float32Array(COUNT);
        let i = 0;
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                positions[i * 3] = (c - COLS / 2) * SPACING;
                positions[i * 3 + 1] = 0;
                positions[i * 3 + 2] = (r - ROWS / 2) * SPACING;
                x0[i] = positions[i * 3];
                z0[i] = positions[i * 3 + 2];
                i++;
            }
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        const points = new THREE.Points(geo, new THREE.PointsMaterial({
            size: 0.055, vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false,
        }));
        const group = new THREE.Group();
        group.add(points);
        scene.add(group);
        return {
            group,
            camBase: new THREE.Vector3(0, 9.5, 15),
            look: new THREE.Vector3(0, 0, -2),
            update(t) {
                const pos = geo.getAttribute('position');
                const col = geo.getAttribute('color');
                for (let j = 0; j < COUNT; j++) {
                    const wave =
                        Math.sin(Math.hypot(x0[j], z0[j]) * 0.85 - t * 1.15) * 0.55 +
                        Math.sin(z0[j] * 0.6 + t * 0.4) * 0.35;
                    pos.array[j * 3 + 1] = wave;
                    const k = Math.min(Math.max((wave + 0.9) / 2.1, 0), 1) ** 3;
                    col.array[j * 3] = SLATE.r + (GREEN.r - SLATE.r) * k;
                    col.array[j * 3 + 1] = SLATE.g + (GREEN.g - SLATE.g) * k;
                    col.array[j * 3 + 2] = SLATE.b + (GREEN.b - SLATE.b) * k;
                }
                pos.needsUpdate = true;
                col.needsUpdate = true;
            },
        };
    }

    /* ── 2 · NETWORK MESH — "the body is whatever is reachable" ─ */
    function buildNetworkMesh() {
        const NODES = 72;
        const rng = () => Math.random();
        const pts = [];
        for (let i = 0; i < NODES; i++) {
            pts.push(new THREE.Vector3(
                (rng() - 0.5) * 36,
                (rng() - 0.5) * 14,
                -rng() * 26 + 4
            ));
        }
        /* nodes: soft glowing points */
        const nGeo = new THREE.BufferGeometry().setFromPoints(pts);
        const nodes = new THREE.Points(nGeo, new THREE.PointsMaterial({
            size: 0.28, color: GREEN, transparent: true, opacity: 0.85, depthWrite: false,
        }));

        /* edges: each node → its 2 nearest neighbours (dedup'd) */
        const seen = new Set();
        const edgePts = [];
        for (let i = 0; i < NODES; i++) {
            const d = pts
                .map((p, j) => ({ j, d: p.distanceToSquared(pts[i]) }))
                .filter((o) => o.j !== i)
                .sort((a, b) => a.d - b.d)
                .slice(0, 2);
            d.forEach(({ j }) => {
                const key = i < j ? `${i}-${j}` : `${j}-${i}`;
                if (seen.has(key)) return;
                seen.add(key);
                edgePts.push(pts[i], pts[j]);
            });
        }
        const eGeo = new THREE.BufferGeometry().setFromPoints(edgePts);
        const edges = new THREE.LineSegments(eGeo, new THREE.LineBasicMaterial({
            color: FAINT, transparent: true, opacity: 0.28,
        }));

        const group = new THREE.Group();
        group.add(edges);
        group.add(nodes);
        scene.add(group);
        return {
            group,
            camBase: new THREE.Vector3(0, 0.5, 24),
            look: new THREE.Vector3(0, 0, -8),
            update(t) {
                group.rotation.y = t * 0.05;
                group.position.y = Math.sin(t * 0.4) * 0.6;
            },
        };
    }

    /* ── 3 · FLOATING WIREFRAME SOLIDS — devices adrift ──────── */
    function buildSolids() {
        const group = new THREE.Group();
        const shapes = [
            () => new THREE.BoxGeometry(1.4, 1.4, 1.4),
            () => new THREE.OctahedronGeometry(1),
            () => new THREE.IcosahedronGeometry(1),
            () => new THREE.TorusGeometry(0.8, 0.3, 8, 16),
        ];
        const solids = [];
        for (let i = 0; i < 14; i++) {
            const geo = new THREE.WireframeGeometry(shapes[i % shapes.length]());
            const mesh = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({
                color: i % 3 === 0 ? GREEN : SLATE,
                transparent: true,
                opacity: i % 3 === 0 ? 0.55 : 0.4,
            }));
            mesh.position.set(
                (Math.random() - 0.5) * 34,
                (Math.random() - 0.5) * 14,
                -Math.random() * 24 + 4
            );
            mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
            mesh.userData.spin = new THREE.Vector3(
                (Math.random() - 0.5) * 0.4,
                (Math.random() - 0.5) * 0.4,
                (Math.random() - 0.5) * 0.2
            );
            mesh.userData.base = mesh.position.y;
            solids.push(mesh);
            group.add(mesh);
        }
        scene.add(group);
        return {
            group,
            camBase: new THREE.Vector3(0, 1.5, 20),
            look: new THREE.Vector3(0, 0, -4),
            update(t) {
                solids.forEach((m, i) => {
                    m.rotation.x += m.userData.spin.x * 0.016;
                    m.rotation.y += m.userData.spin.y * 0.016;
                    m.position.y = m.userData.base + Math.sin(t * 0.6 + i) * 0.8;
                });
            },
        };
    }

    /* ── 4 · STARFIELD — deep space drifting past ────────────── */
    function buildStarfield() {
        const COUNT = 900;
        const positions = new Float32Array(COUNT * 3);
        const colors = new Float32Array(COUNT * 3);
        for (let i = 0; i < COUNT; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 70;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
            positions[i * 3 + 2] = -Math.random() * 130 + 10;
            const c = Math.random() < 0.18 ? GREEN : FAINT;
            const dim = 0.4 + Math.random() * 0.6;
            colors[i * 3] = c.r * dim;
            colors[i * 3 + 1] = c.g * dim;
            colors[i * 3 + 2] = c.b * dim;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        const stars = new THREE.Points(geo, new THREE.PointsMaterial({
            size: 0.14, vertexColors: true, transparent: true, opacity: 0.9, depthWrite: false,
        }));
        const group = new THREE.Group();
        group.add(stars);
        scene.add(group);
        return {
            group,
            camBase: new THREE.Vector3(0, 0, 14),
            look: new THREE.Vector3(0, 0, -10),
            update(t) {
                const pos = geo.getAttribute('position');
                for (let i = 0; i < COUNT; i++) {
                    pos.array[i * 3 + 2] += 0.22;
                    if (pos.array[i * 3 + 2] > 12) pos.array[i * 3 + 2] = -120;
                }
                pos.needsUpdate = true;
                group.rotation.z = Math.sin(t * 0.1) * 0.04;
            },
        };
    }

    /* ── 5 · WIREFRAME TERRAIN — glide over a digital landscape  */
    function buildTerrain() {
        const COLS = 72, ROWS = 46, SPACING = 0.72;
        const COUNT = COLS * ROWS;
        const x0 = new Float32Array(COUNT);
        const z0 = new Float32Array(COUNT);
        let i = 0;
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                x0[i] = (c - COLS / 2) * SPACING;
                z0[i] = 12 - r * 1.45;   /* rows recede into the distance */
                i++;
            }
        }
        /* line segments: right + toward-viewer neighbour per point */
        const segIdx = [];
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const p = r * COLS + c;
                if (c < COLS - 1) segIdx.push(p, p + 1);
                if (r < ROWS - 1) segIdx.push(p, p + COLS);
            }
        }
        const linePos = new Float32Array(segIdx.length * 3);
        const lineCol = new Float32Array(segIdx.length * 3);
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(lineCol, 3));
        const lines = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({
            vertexColors: true, transparent: true, opacity: 0.75,
        }));
        const group = new THREE.Group();
        group.add(lines);
        scene.add(group);
        const h = new Float32Array(COUNT);
        return {
            group,
            camBase: new THREE.Vector3(0, 5.5, 20),
            look: new THREE.Vector3(0, -1, -14),
            update(t) {
                /* heights scroll toward the viewer → reads as gliding */
                const scroll = t * 2.2;
                for (let j = 0; j < COUNT; j++) {
                    h[j] =
                        Math.sin((z0[j] + scroll) * 0.35) * 0.9 +
                        Math.sin((x0[j] * 0.5 + (z0[j] + scroll) * 0.22) + t * 0.6) * 0.7 +
                        Math.sin(x0[j] * 0.9) * 0.35;
                }
                let v = 0;
                for (let s = 0; s < segIdx.length; s++) {
                    const p = segIdx[s];
                    linePos[v] = x0[p];
                    linePos[v + 1] = h[p];
                    linePos[v + 2] = z0[p];
                    /* crest glow, fading with depth */
                    const k = Math.min(Math.max((h[p] + 1.9) / 3.4, 0), 1) ** 2;
                    const fade = Math.min(Math.max(1 + z0[p] / 60, 0.25), 1);
                    lineCol[v] = (SLATE.r + (GREEN.r - SLATE.r) * k) * fade;
                    lineCol[v + 1] = (SLATE.g + (GREEN.g - SLATE.g) * k) * fade;
                    lineCol[v + 2] = (SLATE.b + (GREEN.b - SLATE.b) * k) * fade;
                    v += 3;
                }
                geo.getAttribute('position').needsUpdate = true;
                geo.getAttribute('color').needsUpdate = true;
            },
        };
    }

    /* ── variant registry + switcher ─────────────────────────── */
    const VARIANTS = [
        { name: 'wave grid',    build: buildWaveGrid },
        { name: 'network mesh', build: buildNetworkMesh },
        { name: 'solids',       build: buildSolids },
        { name: 'starfield',    build: buildStarfield },
        { name: 'terrain',      build: buildTerrain },
    ];
    let idx = 0;
    let current = null;

    function activate(n) {
        if (current) disposeGroup(current.group);
        idx = (n + VARIANTS.length) % VARIANTS.length;
        current = VARIANTS[idx].build();
        camera.position.copy(current.camBase);
        camera.lookAt(current.look);
        const label = document.getElementById('bg-label');
        if (label) label.textContent = VARIANTS[idx].name;
        if (reduced) {
            current.update(0);
            renderer.render(scene, camera);
        }
    }

    const prevBtn = document.getElementById('bg-prev');
    const nextBtn = document.getElementById('bg-next');
    if (prevBtn) prevBtn.addEventListener('click', () => activate(idx - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => activate(idx + 1));

    function resize() {
        const w = canvas.clientWidth || canvas.parentElement.clientWidth;
        const h = canvas.clientHeight || canvas.parentElement.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize();

    /* pause rendering when hero is off-screen */
    let visible = true;
    const io = new IntersectionObserver((en) => (visible = en[0].isIntersecting), {
        threshold: 0.02,
    });
    io.observe(canvas);

    activate(0);

    function loop(now) {
        if (!visible) {
            requestAnimationFrame(loop);
            return;
        }
        const t = now * 0.001;
        current.update(t);
        /* eased pointer parallax on the camera */
        mouse.x += (mouse.tx - mouse.x) * 0.04;
        mouse.y += (mouse.ty - mouse.y) * 0.04;
        camera.position.x = current.camBase.x + mouse.x * 1.6;
        camera.position.y = current.camBase.y - mouse.y * 0.9;
        camera.lookAt(current.look);
        renderer.render(scene, camera);
        requestAnimationFrame(loop);
    }

    if (!reduced) requestAnimationFrame(loop);
})();
