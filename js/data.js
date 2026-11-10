/* ============================================================
   data.js — SINGLE SOURCE OF TRUTH for all site content.
   Edit this file to update repos, certificates, posts & profile.
   ============================================================ */

/* ── PROFILE ─────────────────────────────────────────────── */
const PROFILE = {
    name: 'Aditya Kadam',
    firstName: 'Aditya',
    role: 'Web3 Developer',
    tagline: 'Open Source Contributor · AI-Integrated Systems',
    githubUser: 'AdityaK9822',
    githubUrl: 'https://github.com/AdityaK9822',
    linkedinUrl: 'https://www.linkedin.com/in/aditya-kadam-7a5341373',
    telegramUrl: '',
    xUrl: '',
    // TODO: add your real email — used by copy-button + contact page
    email: '',
    // TODO: get a key at https://web3forms.com (free, no backend) and paste it
    web3formsKey: '',
    openToList: ['collaborations', 'open source contributions', 'freelance projects'],
    bio: 'CS student at ITM Kharghar and open source contributor specializing in the Stellar blockchain ecosystem. I build AI-integrated Web3 applications — from gasless transaction infrastructure to decentralized payroll platforms — using TypeScript, Rust, and Claude AI.',
    skills: [
        'TypeScript / JavaScript', 'Rust', 'Python', 'C++', 'Stellar / Soroban',
        'Smart Contracts (Rust)', 'Next.js / React', 'Node.js', 'PostgreSQL',
        'Drizzle ORM', 'Claude API (Anthropic)', 'Docker / Kubernetes',
        'GitHub Actions', 'Solidity / Web3.js', 'Ethical Hacking / CTF'
    ],
};

/* ── REPOS ─────────────────────────────────────────────────
   category: 'open-source' | 'project'
   web3:     adds the Web3 filter tag
   featured: shows on the home page
   url:      pass null to omit the link (card renders without one)
   Stars/forks update automatically at runtime via github.js;
   numbers shown before fetch / on failure come from `fallback`.
   ─────────────────────────────────────────────────────────── */
const REPOS = [
    {
        id: 'fluid',
        org: 'Stellar-Fluid',
        name: 'fluid',
        url: 'https://github.com/Stellar-Fluid/fluid',
        desc: 'Gas abstraction layer for Stellar. Wraps user transactions in fee-bump envelopes so apps can sponsor XLM fees.',
        tags: ['TypeScript / Rust', 'Fee-Bump', 'Production'],
        tagTone: { 'TypeScript / Rust': '', 'Fee-Bump': 'blue', 'Production': 'green' },
        category: 'open-source',
        web3: true,
        featured: true,
        fallback: { stars: null, forks: 92 },
    },
    {
        id: 'vestroll',
        org: 'SafeVault',
        name: 'vestroll',
        url: 'https://github.com/SafeVault/vestroll',
        desc: 'Stablecoin & fiat payroll platform on Stellar Soroban. ZK-shielded payments, biometric auth (passkeys), NGN→USDC bridge.',
        tags: ['Next.js 15', 'ZK Proofs', 'Passkeys'],
        tagTone: { 'Next.js 15': '', 'ZK Proofs': 'red', 'Passkeys': 'blue' },
        category: 'open-source',
        web3: true,
        featured: true,
        fallback: { stars: null, forks: 103 },
    },
    {
        id: 'sorotask',
        org: 'SoroLabs',
        name: 'SoroTask',
        url: 'https://github.com/SoroLabs/SoroTask',
        desc: 'Decentralized automation marketplace on Soroban. Rust smart contracts + Keeper bots that execute recurring on-chain tasks.',
        tags: ['Rust / Node.js', 'Smart Contracts'],
        tagTone: { 'Rust / Node.js': '', 'Smart Contracts': 'green' },
        category: 'open-source',
        web3: true,
        featured: true,
        fallback: { stars: null, forks: 39 },
    },
    {
        id: 'mobile-money',
        org: 'sublime247',
        name: 'mobile-money',
        url: 'https://github.com/sublime247/mobile-money',
        desc: 'Backend bridge connecting MTN, Airtel, and Orange mobile money providers with the Stellar network. REST API, PostgreSQL, K8s.',
        tags: ['TypeScript', 'PostgreSQL', 'Kubernetes'],
        tagTone: {},
        category: 'open-source',
        web3: true,
        featured: false,
        fallback: { stars: null, forks: null },
    },
    {
        id: 'nexafx',
        org: 'Nexacore-Org',
        name: 'NexaFx',
        url: 'https://github.com/Nexacore-Org/NexaFx',
        desc: 'Web3-powered DeFi currency exchange. Multi-currency swaps with TypeScript frontend and Stellar blockchain backend.',
        tags: ['Web3', 'Stellar'],
        tagTone: { 'Web3': 'red', 'Stellar': 'green' },
        category: 'open-source',
        web3: true,
        featured: false,
        fallback: { stars: null, forks: null },
    },
    /* ── own projects (repo: AdityaK9822) ── */
    {
        id: 'april',
        org: 'AdityaK9822',
        name: 'APRIL',
        url: 'https://github.com/AdityaK9822/APRIL',
        desc: 'An LLM assistant with a body in the networked world — senses, controls and works with physical devices (cams, sensors, appliances) end to end.',
        tags: ['AI / Agents', 'IoT'],
        tagTone: { 'AI / Agents': 'green', 'IoT': 'blue' },
        category: 'project',
        web3: false,
        featured: false,
        fallback: { stars: null, forks: null },
    },
    {
        id: 'polyagent',
        org: 'AdityaK9822',
        name: 'Polyagent',
        url: 'https://github.com/AdityaK9822/Polyagent',
        desc: 'Multi-provider AI agent bridge — an MCP server letting Claude delegate scans, reviews and analysis to Gemini, Bedrock & OpenAI models.',
        tags: ['MCP', 'Python'],
        tagTone: { 'MCP': 'blue', 'Python': '' },
        category: 'project',
        web3: false,
        featured: false,
        fallback: { stars: null, forks: null },
    },
    {
        id: 'hash-cracker',
        org: 'AdityaK9822',
        name: 'Cryptographic-Hash-Cracker',
        url: 'https://github.com/AdityaK9822/Cryptographic-Hash-Cracker',
        desc: 'CLI tool for cracking MD5, SHA-1/2/3, BLAKE2 hashes via wordlist or brute-force. Built for CTF challenges and ethical security research.',
        tags: ['Security', 'Python'],
        tagTone: { 'Security': 'red', 'Python': '' },
        category: 'project',
        web3: false,
        featured: false,
        fallback: { stars: 1, forks: null },
    },
    {
        id: 'lumnova',
        org: 'AdityaK9822',
        name: 'Lumnova',
        url: 'https://github.com/AdityaK9822/Lumnova',
        desc: 'Modern, responsive digital wallet application built with React and Vite, featuring a streamlined payment interface.',
        tags: ['React / Vite'],
        tagTone: {},
        category: 'project',
        web3: false,
        featured: false,
        fallback: { stars: null, forks: null },
    },
    {
        id: 'buildtrack',
        org: 'AdityaK9822',
        name: 'buildtrack',
        url: 'https://github.com/AdityaK9822/buildtrack',
        desc: 'Construction project management platform with API and client.',
        tags: ['Full-Stack'],
        tagTone: { 'Full-Stack': 'green' },
        category: 'project',
        web3: false,
        featured: false,
        fallback: { stars: null, forks: null },
    },
    /* TODO: add repo URL when public (link rendered only when set) */
    {
        id: 'petad',
        org: null,
        name: 'PetAd Frontend',
        url: null,
        desc: 'Blockchain-backed pet adoption & temporary custody platform. On-chain transaction support with TypeScript.',
        tags: ['Blockchain', 'TypeScript'],
        tagTone: { 'Blockchain': 'green', 'TypeScript': '' },
        category: 'project',
        web3: true,
        featured: false,
        fallback: { stars: 15, forks: 85 },
    },
];

/* ── CERTIFICATES ─────────────────────────────────────────
   TODO: replace examples with yours. Fields:
   title / issuer / date / url (verify link) / badge (assets/…)
   If `badge` omitted, initials are shown instead.
   ───────────────────────────────────────────────────────── */
const CERTIFICATES = [
    {
        title: 'Example — Web3 Development',
        issuer: 'Example Academy',
        date: '2026',
        url: '',
        badge: '',
    },
    /* {
       title: 'Stellar Soroban Smart Contracts',
       issuer: 'Stellar Development Foundation',
       date: '2026',
       url: 'https://…',
       badge: 'assets/certs/soroban.png',
     }, */
];

/* ── JOURNAL POSTS (newest first) ─────────────────────────
   Each points to posts/<slug>.html. Create the file when
   publishing a post; everything renders from this list.
   ───────────────────────────────────────────────────────── */
const POSTS = [
    {
        slug: 'new-portfolio',
        title: 'Rebuilding my portfolio in the open',
        date: '2026-11-10',
        tags: ['site'],
        pinned: true,
        excerpt: 'Why I rebuilt this site as plain HTML/CSS with a live-stats engine — and what is shipping next.',
    },
    {
        slug: 'upcoming-stellar-project',
        title: 'Coming soon: a new Soroban automation tool',
        date: '',
        tags: ['upcoming', 'web3'],
        pinned: false,
        excerpt: 'A teaser for the next thing I am building in the Stellar ecosystem. Details drop here first.',
    },
];

/* ── JOURNAL PAGE HEADLINE ──────────────────────────────── */
const JOURNAL_META = {
    heading: 'journal.log',
    blurb: 'Project announcements, build notes and community updates — published as plain files in the repo.',
};
