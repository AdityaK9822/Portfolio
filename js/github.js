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
    /* 1. fetch every linked repo exactly once */
    const metas = [...document.querySelectorAll('[data-repo]')];
    const targetRepos = new Map(
        REPOS.filter((r) => r.url).map((r) => [
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
    const setStat = (id, value) => {
        const el = document.getElementById(id);
        if (el && typeof value === 'number') el.textContent = value.toLocaleString();
    };

    setStat('stat-stars', sum('stargazers_count'));
    setStat('stat-forks', sum('forks_count'));

    if (document.getElementById('stat-followers') || document.getElementById('stat-repos')) {
        try {
            const user = await ghGet(`/users/${PROFILE.githubUser}`);
            setStat('stat-followers', user.followers);
            setStat('stat-repos', user.public_repos);
        } catch (_) {
            /* stats stay at placeholder */
        }
    }
}

/* set working placeholder before fetch */
document
    .querySelectorAll('#stat-stars, #stat-forks, #stat-followers, #stat-repos')
    .forEach((el) => (el.textContent = '…'));

ghLiveStats();
