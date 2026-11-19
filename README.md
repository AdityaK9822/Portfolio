# Portfolio — v2

Dark terminal-aesthetic developer portfolio. **Plain HTML + CSS + vanilla JS — no build step.** Deploy anywhere static files are served (Vercel recommended).

## Structure

```
├── index.html  work.html  certificates.html  journal.html  contact.html
├── posts/        journal posts (plain HTML pages) + _template.html
├── css/
│   ├── base.css        design tokens, reset, typography
│   ├── components.css  navbar, footer, cards, buttons, tags, toast
│   └── pages.css       per-page layouts (hero, forms, grids)
├── js/
│   ├── data.js   ← ALL CONTENT lives here — edit this file
│   ├── render.js renders repos / certs / posts / skills from data
│   ├── github.js live stars & forks via GitHub REST API
│   ├── ui.js     nav state, reveals, copy-email, contact form
│   └── hero.js   WebGL wave-grid hero (three.js)
└── assets/       certificate badge images (assets/certs/), og image
```

## Maintenance — the common edits

| Task | Where |
|---|---|
| Add a repo / change description | `js/data.js → REPOS` |
| Set featured repos (home page) | `js/data.js → REPOS → featured: true` |
| Add a certificate | drop badge in `assets/certs/`, add entry in `data.js → CERTIFICATES` |
| Publish a post | copy `posts/_template.html` → `posts/your-slug.html`, add entry in `data.js → POSTS` |
| Email address | `data.js → PROFILE.email` |
| Enable contact form | free key at web3forms.com → `PROFILE.web3formsKey` |
| Open-to-work list | `data.js → PROFILE.openToList` |

## Before launching (TODO list)

1. `PROFILE.email` — the old site's mailto was empty.
2. `PROFILE.web3formsKey` — [web3forms.com](https://web3forms.com) → key lands in your inbox; form stays disabled without it.
3. Certificate list — page renders a friendly empty-state until provided.
4. `PetAd Frontend` repo URL — placeholder entry has no link yet.
5. Social URLs (X / Telegram) — fields exist in `PROFILE`, blank ones simply don't render.

## Run locally

```bash
cd portfolio
python3 -m http.server 8000     # → http://localhost:8000
```

Opening `index.html` directly from the Finder also works for a quick look.

## Deploy (Vercel)

https://portfolio-pink-eight-52.vercel.app

## Notes

- Stars/forks use the unauthenticated GitHub API (60 req/hr per IP); if it's exhausted, cards show "—".
- Live stat come from repos listed in `data.js` + your own profile.
- Reduced-motion users get a static hero; phones get a lighter double-density point grid.
