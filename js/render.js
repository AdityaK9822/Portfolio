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
    /* concrete feature points: fill the tall bento tiles, scan better than prose */
    const points = r.points
        ? `<ul class="card-points">${r.points.map((p) => `<li>${p}</li>`).join('')}</ul>`
        : '';
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
      ${points}
      ${meta}
      <div class="card-tags">${tags}</div>
      ${link}
    </article>`;
}

/* ── mounts ── */
const visible = REPOS.filter((r) => !r.hidden);

const SCROLL_STACK_IMAGES = {
    april: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    synopsi: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=900&q=80',
    polyagent: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=900&q=80',
    axiom: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=900&q=80',
    'claude-skills': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80',
    codegraph: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80',
};

function renderFeatured() {
    const grid = document.getElementById('featured-grid');
    if (!grid) return;
    const order = ['april', 'axiom', 'synopsi', 'polyagent', 'codegraph', 'claude-skills'];
    const cards = order
        .map((id, idx) => {
            const r = visible.find((x) => x.id === id);
            if (!r || r.tier !== 'ai' || !r.featured) return '';
            const img = SCROLL_STACK_IMAGES[r.id] || '';
            const oneLiner = r.short || (r.desc.split('.')[0] + '.');
            const badge = (r.badge && r.badge[0]) ? r.badge[0] : '';
            return `<article class="scroll-stack-card" style="--i:${idx}; --ssc-bg: url('${img}')">
  <div class="ssc-overlay">
    <div class="ssc-top">
      <span class="ssc-name">${r.org ? r.org + ' / ' : ''}${r.name}</span>
      ${badge ? `<span class="ssc-badge">${badge}</span>` : ''}
    </div>
    <p class="ssc-desc">${oneLiner}</p>
    <div class="ssc-tags">${r.tags.map((t) => `<span class="tag">${t}</span>`).join('')}</div>
    <a class="ssc-link" href="${r.url}" target="_blank" rel="noopener">view on github ↗</a>
  </div>
</article>`;
        })
        .filter(Boolean);
    grid.innerHTML =
        cards.join('') + '<div class="scroll-stack-end" aria-hidden="true"></div>';
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
