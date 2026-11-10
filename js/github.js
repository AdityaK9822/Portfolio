/* ============================================================
   github.js — live GitHub stats. One request per repo, updates
   card counters + the home stats box. Fails silently: existing
   placeholders ("…" / "—") simply stay on error.
   ============================================================ */

const GH_API = 'https://api.github.com';

function ghGet(path) {
    return fetch(GH_API + path, {
        headers: { Accept: 'application/vnd.github+json' },
    }).then((res) => (res.ok ? res.json() : Promise.reject(res.status)));
}

async function ghLiveStats() {
    /* 1. fetch every linked repo exactly once (private/hidden excluded) */
    const metas = [...document.querySelectorAll('[data-repo]')];
    const targetRepos = new Map(
        REPOS.filter((r) => r.url && !r.hidden).map((r) => [
            `${r.org || PROFILE.githubUser}/${r.name}`,
            r,
        ])
    );
    const cardRepos = new Set(metas.map((m) => m.dataset.repo));
    for (const full of targetRepos.keys()) {
        if (!cardRepos.has(full)) cardRepos.add(full);
    }

    const repoData = new Map();
    await Promise.allSettled(
        [...cardRepos].map(async (full) => {
            try {
                const repo = await ghGet(`/repos/${full}`);
                repoData.set(full, repo);
                metas
                    .filter((m) => m.dataset.repo === full)
                    .forEach((m) => {
                        const s = m.querySelector('.live-stars');
                        const f = m.querySelector('.live-forks');
                        if (s) s.textContent = repo.stargazers_count?.toLocaleString() ?? '—';
                        if (f) f.textContent = repo.forks_count?.toLocaleString() ?? '—';
                    });
            } catch (_) {
                /* leave placeholders as-is */
            }
        })
    );

    /* timestamp on the work page heading */
    const stamp = document.getElementById('work-updated-at');
    if (stamp && repoData.size) {
        stamp.textContent =
            ' · fetched ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    /* 2. aggregate stats box (home) */
    const sum = (key) =>
        [...repoData.values()].reduce((acc, r) => acc + (r[key] || 0), 0);
    const failStat = (id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = '—';
    };
    const setStat = (id, value) => {
        const el = document.getElementById(id);
        if (!el || typeof value !== 'number') return;
        /* reduced motion or tiny value: set directly */
        if (
            window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
            value < 12
        ) {
            el.textContent = value.toLocaleString();
            return;
        }
        /* count-up on arrival (ease-out cubic) */
        const start = performance.now();
        const DUR = 900;
        const step = (now) => {
            const k = Math.min((now - start) / DUR, 1);
            const eased = 1 - Math.pow(1 - k, 3);
            el.textContent = Math.round(value * eased).toLocaleString();
            if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    /* sums stay at "—" instead of a lying 0 when the API served nothing */
    setStat('stat-stars', repoData.size ? sum('stargazers_count') : failStat('stat-stars'));
    setStat('stat-forks', repoData.size ? sum('forks_count') : failStat('stat-forks'));

    if (document.getElementById('stat-followers') || document.getElementById('stat-repos')) {
        try {
            const user = await ghGet(`/users/${PROFILE.githubUser}`);
            setStat('stat-followers', user.followers);
            setStat('stat-repos', user.public_repos);
        } catch (_) {
            failStat('stat-followers');
            failStat('stat-repos');
        }
    }
}

/* set working placeholder before fetch */
document
    .querySelectorAll('#stat-stars, #stat-forks, #stat-followers, #stat-repos')
    .forEach((el) => (el.textContent = '…'));

ghLiveStats();
