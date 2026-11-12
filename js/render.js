/* ============================================================
   render.js — renders repos / certificates / posts from data.js
   into the page. Auto-detects mount points by id; pages without
   them are untouched. Runs after data.js (defer order).
   ============================================================ */

/* ── repo card markup ──
   tier-aware; hidden repos never render.
   r.badge: status strip (Flagship R&D / MCP Server / Fork …) shown
   above the title so honest state is part of the card. */
function repoCard(r, cats, extraClass) {
    const catAttr = cats ? ` data-cat="${cats.join(' ')}"` : '';
    const cls = `card reveal${r.tier === 'ai' ? ' ai-card' : ''}${extraClass ? ` ${extraClass}` : ''}`;
    const orgLine = r.org ? `<span class="org">${r.org} /</span> ` : '';
    const link = r.url
        ? `<a class="stretched" href="${r.url}" target="_blank" rel="noopener" aria-label="${r.name} on GitHub">${r.name}</a>`
        : '';
    const badges = r.badge
        ? `<div class="card-badges">${r.badge
              .map((b) => `<span class="badge-chip">${b}</span>`)
              .join('')}</div>`
        : '';
    const tags = r.tags
        .map((t) => `<span class="tag ${r.tagTone?.[t] || ''}">${t}</span>`)
        .join('');
    const meta = r.url
        ? `<div class="card-meta" data-repo="${r.org || PROFILE.githubUser}/${r.name}">
             <span>★ <span class="live-stars">—</span></span>
             <span>⑂ <span class="live-forks">—</span></span></div>`
        : `<div class="card-meta"><span>${
              r.fallback.forks ? `${r.fallback.forks} forks` : 'local project'
          }</span></div>`;
    return `<article class="${cls}"${catAttr} data-id="${r.id}">
      <div class="card-top">
        <div class="card-name">${orgLine}${r.name}</div>
        <span class="card-arrow" aria-hidden="true">↗</span>
      </div>
      ${badges}
      <p class="card-desc">${r.desc}</p>
      ${meta}
      <div class="card-tags">${tags}</div>
      ${link}
    </article>`;
}

/* ── mounts ── */
const visible = REPOS.filter((r) => !r.hidden);

function renderFeatured() {
    const grid = document.getElementById('featured-grid');
    if (!grid) return;
    /* home bento — box size ∝ priority (CONTENT.md order):
       #1 APRIL 2×2 hero · #2 AXIOM tall column · #3 Synopsi wide ·
       #4-6 Polyagent / Claude SKILLS / Codegraph small.
       Full copy only on the big tiles; the rest use short blurbs. */
    const bento = {
        april: 'bento-xl',
        axiom: 'bento-tall',
        synopsi: 'bento-w2',
        'claude-skills': 'bento-quiet',
        codegraph: 'bento-fork',
    };
    /* DOM order = pack order; the 2×2 leads so dense packing has no holes.
       work.html keeps its own order (APRIL first) via renderWorkGrid */
    const order = ['april', 'axiom', 'synopsi', 'polyagent', 'claude-skills', 'codegraph'];
    grid.innerHTML = order
        .map((id) => visible.find((r) => r.id === id))
        .filter((r) => r && r.tier === 'ai' && r.featured)
        .map((r) => {
            const cls = bento[r.id] || '';
            const big = cls === 'bento-xl' || cls === 'bento-tall' || cls === 'bento-w2' || cls === 'bento-full';
            return repoCard({ ...r, desc: big ? r.desc : r.short || r.desc }, undefined, cls);
        })
        .join('');
}

function renderStellarStrip() {
    const strip = document.getElementById('stellar-strip');
    if (!strip) return;
    /* home: Stellar is the slim support strip — one line per repo */
    strip.innerHTML = visible
        .filter((r) => r.tier === 'stellar')
        .map(
            (r) => `<a class="strip-row reveal" href="${r.url}" target="_blank" rel="noopener">
          <span class="strip-name">${r.name}</span>
          <span class="strip-desc">${r.desc.split('.')[0]}.</span>
          <span class="strip-meta" aria-hidden="true">↗</span>
        </a>`
        )
        .join('');
}

function renderWorkGrid() {
    const ai = document.getElementById('ai-grid');
    if (ai) ai.innerHTML = visible.filter((r) => r.tier === 'ai').map((r) => repoCard(r)).join('');
    const stellar = document.getElementById('stellar-grid');
    if (stellar)
        stellar.innerHTML = visible
            .filter((r) => r.tier === 'stellar')
            .map((r) => repoCard(r))
            .join('');
}

/* ── archive: compact list, one line per project, no cards —
   kept for track record, not spotlight (CONTENT.md §3) */
function renderArchive() {
    const list = document.getElementById('archive-list');
    if (!list) return;
    list.innerHTML = ARCHIVE.map(
        (a) => `<div class="archive-row reveal">
          <div class="archive-name">${a.name}<span class="archive-meta"> — ${a.meta.toLowerCase()}</span></div>
          <p class="card-desc">${a.desc}</p>
        </div>`
    ).join('');
}

function renderCerts() {
    const grid = document.getElementById('certs-grid');
    if (!grid) return;
    if (!CERTIFICATES.length) {
        grid.outerHTML =
            '<div class="note-box">No certificates published yet — add entries to <code>js/data.js → CERTIFICATES</code> and they appear here automatically.</div>';
        return;
    }
    grid.innerHTML = CERTIFICATES.map((c) => {
        const initials =
            c.title
                .split(' ')
                .filter((w) => /^[A-Z]/.test(w))
                .map((w) => w[0])
                .slice(0, 2)
                .join('') || 'CE';
        const badge = c.badge ? `<img src="${c.badge}" alt="${c.title} badge">` : initials;
        const link = c.url ? `<a href="${c.url}" target="_blank" rel="noopener">↗ verify</a>` : '';
        return `<article class="card reveal cert-card">
        <div class="cert-badge" aria-hidden="true">${badge}</div>
        <div class="card-name">${c.title}</div>
        <p class="card-desc">${c.issuer}${c.issuer && c.date ? ' · ' + c.date : c.date}</p>
        ${link ? `<div class="cert-meta">${c.date || ''}${link}</div>` : ''}
      </article>`;
    }).join('');
}

/* ── journal ── */
function fmtDate(iso) {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    return isNaN(d) ? iso : d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function postTags(p) {
    if (p.date) return p.tags.map((t) => `<span class="tag blue">${t}</span>`).join('');
    return p.tags.map((t) => `<span class="tag upcoming">${t === 'upcoming' ? 'in the making' : t}</span>`).join('');
}

function renderPosts() {
    const feat = document.getElementById('post-featured');
    const list = document.getElementById('post-list');
    if (feat)
        feat.innerHTML = POSTS.filter((p) => p.pinned)
            .map(
                (p) => `<a class="post-featured reveal" href="posts/${p.slug}.html">
        <div class="post-meta"><span class="tag green">pinned</span>${postTags(p)}</div>
        <div class="post-title">${p.title}</div>
        <p class="card-desc">${p.excerpt}</p>
        <div class="post-meta">${fmtDate(p.date)}</div>
      </a>`
            )
            .join('');

    if (list)
        list.innerHTML = POSTS.filter((p) => !p.pinned)
            .map(
                (p) => `<a class="post-row reveal" href="posts/${p.slug}.html">
        <div><div class="post-title">${p.title}</div><p class="card-desc">${p.excerpt}</p></div>
        <span class="post-date">${fmtDate(p.date) || 'draft'}</span>
      </a>`
            )
            .join('');

    /* home headline band — journal.latest under the hero: titles only,
       repeated so the marquee track always fills the width */
    const track = document.getElementById('teaser-track');
    if (track) {
        const headline = (p) =>
            `<a class="headline-item" href="posts/${p.slug}.html">${p.title}<span class="headline-arrow" aria-hidden="true">↗</span></a>`;
        const unique = POSTS.slice(0, 4);
        /* repeat the set until the half plausibly fills any width (cap 10) */
        let items = '';
        for (let i = 0; i < 10; i++) items += headline(unique[i % unique.length]);
        const half = `<div class="teaser-half">${items}</div>`;
        /* visual duplicates are hidden from assistive tech */
        track.innerHTML = half + `<div class="teaser-half" aria-hidden="true">${items}</div>`;
    }

    const blur = document.getElementById('journal-blurb');
    if (blur) blur.textContent = JOURNAL_META.blurb;
}

/* ── skills marquee (home band) + grouped sidebar ── */
function renderSkills() {
    const track = document.getElementById('skills-track');
    if (track) {
        const items = SKILL_LIST.map((s) => `<span>${s}</span>`).join('');
        /* duplicate content for seamless -50% marquee loop */
        track.innerHTML = items + items;
        track.setAttribute('aria-hidden', 'true');
        track.parentElement.insertAdjacentHTML(
            'beforeend',
            `<span class="sr-only" style="position:absolute;left:-9999px;">${SKILL_LIST.join(', ')}</span>`
        );
    }
    const groups = document.getElementById('skills-groups');
    if (groups)
        groups.innerHTML = SKILLS.map(
            (g) => `<div class="skill-group">
          <div class="skill-group-label">${g.group}</div>
          <ul class="skill-items">
            ${g.items.map((s) => `<li>${s}</li>`).join('')}
          </ul>
        </div>`
        ).join('');
}

/* ── contact page: availability list ── */
function renderOpenList() {
    const list = document.getElementById('open-list');
    if (!list) return;
    list.innerHTML = PROFILE.openToList.map((item) => `<li>${item}</li>`).join('');
}

renderFeatured();
renderStellarStrip();
renderWorkGrid();
renderArchive();
renderCerts();
renderPosts();
renderSkills();
renderOpenList();
