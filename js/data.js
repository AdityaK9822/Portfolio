/* ============================================================
   data.js — SINGLE SOURCE OF TRUTH for all site content.
   Mirrors CONTENT.md (the master content doc). Edit here.
   Tier order everywhere: AI & R&D first, Stellar second.
   ============================================================ */

/* ── PROFILE ─────────────────────────────────────────────── */
const PROFILE = {
    name: 'Aditya Kadam',
    firstName: 'Aditya',
    role: 'AI Systems & Agentic Engineering',
    headline: 'Building assistants with a body — AI that senses, acts, and ships.',
    subline: 'Agentic engineering across LLM orchestration, embodied AI, and applied study tools — with a production-discipline background in Stellar/Soroban open source.',
    githubUser: 'AdityaK9822',
    githubUrl: 'https://github.com/AdityaK9822',
    linkedinUrl: 'https://www.linkedin.com/in/aditya-kadam-7a5341373',
    telegramUrl: '',
    xUrl: '',
    // TODO: add your real email — used by copy-button + contact page
    email: '',
    // TODO: get a key at https://web3forms.com (free, no backend) and paste it
    web3formsKey: '',
    about:
        'CS student at ITM Kharghar building agentic AI systems — an embodied LLM assistant wired into the physical world (APRIL), multi-provider agent infrastructure (Polyagent), and applied LLM apps. Background in Stellar/Soroban open source maintenance and security tooling: the systems discipline that ships production-grade AI.',
    openToList: [
        'AI/ML Engineering',
        'AI Agent Infra',
        'LLM Application Dev',
        'Web3 Development',
        'Security Research',
    ],
};

/* ── SKILLS — grouped, AI first (mirrors Resume layout) ──── */
const SKILLS = [
    {
        group: 'ai & agents',
        items: [
            'Claude API (Anthropic)',
            'Ollama / OpenAI-compatible endpoints',
            'MCP (Model Context Protocol)',
            'Multi-agent orchestration',
            'Prompt engineering',
            'Vision models for feed reasoning',
        ],
    },
    {
        group: 'languages',
        items: ['Python', 'TypeScript / JavaScript', 'Rust', 'C++', 'Shell / Bash'],
    },
    {
        group: 'web3 & blockchain',
        items: ['Stellar / Soroban', 'Smart Contracts (Rust)', 'Fee-Bump Transactions', 'Solidity / Web3.js'],
    },
    {
        group: 'frontend & backend',
        items: ['Next.js / React', 'Node.js / REST APIs', 'PostgreSQL / Drizzle ORM', 'HTML / CSS / Tailwind'],
    },
    {
        group: 'infra & tooling',
        items: ['Docker / Kubernetes', 'Git / GitHub Actions', 'Ethical Hacking / CTF'],
    },
];

/* flat list (skills marquee derives from this) */
const SKILL_LIST = SKILLS.flatMap((g) => g.items);

/* ── REPOS ─────────────────────────────────────────────────
   tier:     'ai' (Section A) | 'stellar' (Section B)
   featured: shows on the home page AI grid (A only)
   hidden:   true renders nowhere (AXIOM stays private until flipped)
   badge:    short status strip shown on top of the card
   Stars/forks update automatically via github.js after render.
   ─────────────────────────────────────────────────────────── */
const REPOS = [
    /* ── SECTION A — AI, Agents & R&D ── */
    {
        id: 'april',
        org: 'AdityaK9822',
        name: 'APRIL',
        url: 'https://github.com/AdityaK9822/APRIL',
        badge: ['Flagship R&D', 'Building in the open'],
        desc: 'An LLM assistant with a body in the networked world — it senses, controls, and works with the physical devices around it. Organized into pillars: SEE through IP cameras with a vision model; SENSE ECG/EEG and telemetry via ESP32-connected sensors; ACT on lights, AC, switches, and robot arms; NETWORK discovery and authorized wifi audits; BUILD hardware from CAD → CNC → 3D print → flash. The body is whatever is reachable on the network right now — the ESP32 is the archetypal limb.',
        tags: ['Python', 'AI Agents', 'IoT'],
        tagTone: { 'Python': '', 'AI Agents': 'green', 'IoT': 'blue' },
        tier: 'ai',
        featured: true,
        hidden: false,
        fallback: { stars: null, forks: null },
        short: 'An LLM assistant wired into the physical world — SEE, SENSE, ACT, NETWORK, BUILD. The body is whatever is reachable on the network right now.',
    },
    {
        id: 'synopsi',
        org: 'AdityaK9822',
        name: 'Synopsi',
        url: 'https://github.com/AdityaK9822/synopsi-web',
        badge: ['New · Nov 2026', 'Frontend App'],
        desc: 'A smart academic notes assistant — paste or upload messy lecture notes (.txt/.md/.pdf) and get a structured study pack: Summary → Key Concepts → Revision Questions with an interactive click-to-reveal quiz mode. Runs gemma4:31b on Ollama Cloud, so no local GPU needed. A Fact-Check "Research mode" re-verifies claims from your output against the source notes with exact quoted fragments, and ends with a numbered sources list. Server-side text/PDF extraction, persisted chat threads, and a documented prompt-engineering pipeline (persona + strict output template + few-shot + grounding rules) as the graded core.',
        tags: ['TypeScript', 'Next.js', 'Ollama'],
        tagTone: { 'TypeScript': '', 'Next.js': 'blue', 'Ollama': 'green' },
        tier: 'ai',
        featured: true,
        hidden: false,
        fallback: { stars: null, forks: null },
        short: 'Paste messy lecture notes, get a structured study pack — summary, key concepts, revision quizzes. Runs gemma4 on Ollama Cloud; fact-check mode included.',
    },
    {
        id: 'polyagent',
        org: 'AdityaK9822',
        name: 'Polyagent',
        url: 'https://github.com/AdityaK9822/Polyagent',
        badge: ['MCP Server', 'Agent Infra'],
        desc: 'A multi-provider AI agent bridge for Claude Desktop — an MCP server that lets Claude delegate specialized work (security scans, code review, analysis) to other agents: GLM, OpenAI, Anthropic, AWS Bedrock, Gemini, and Ollama Cloud over an OpenAI-compatible endpoint. Ships with dynamic agent registration, sequential / iterative / parallel pipeline modes, and real loop-prevention — max iterations, confidence thresholds, human approval gates — plus streaming, comprehensive error handling, logging, and metrics.',
        tags: ['Python', 'MCP', 'Multi-Agent'],
        tagTone: { 'Python': '', 'MCP': 'blue', 'Multi-Agent': 'green' },
        tier: 'ai',
        featured: true,
        hidden: false,
        fallback: { stars: null, forks: null },
        short: 'MCP server that lets Claude delegate specialized work to six providers — with pipeline modes, loop prevention, and human approval gates.',
    },
    /* hidden until AXIOM-Firmware is public — flip hidden: false when live */
    {
        id: 'axiom',
        org: 'AdityaK9822',
        name: 'AXIOM-Firmware',
        url: 'https://github.com/AdityaK9822/AXIOM-Firmware',
        badge: ['Embedded', 'Security'],
        desc: 'ESP32-S3 Wi-Fi/BLE lab-controller firmware with a web dashboard and SH1106 OLED display — network monitoring, diagnostics, and authorized wireless security assessment. This is the reference hardware "limb" APRIL plugs compliance-tested radios, sensors, and actuation into: an entire programmable bridge, in a pocket form factor, to the physical side of an agentic system.',
        tags: ['C++', 'ESP32-S3', 'Firmware'],
        tagTone: { 'C++': '', 'ESP32-S3': 'blue', 'Firmware': 'green' },
        tier: 'ai',
        featured: true,
        hidden: false,
        fallback: { stars: null, forks: null },
        short: 'ESP32-S3 lab-controller firmware — the pocket-sized Wi-Fi bridge APRIL plugs compliance-tested radios and sensors into.',
    },
    {
        id: 'claude-skills',
        org: 'AdityaK9822',
        name: 'Claude SKILLS',
        url: 'https://github.com/AdityaK9822/Vibe-coding-Claude-SKILLS',
        badge: ['Agent Tooling', 'Prompt Engineering'],
        desc: 'A small library of Claude skills — practical, no-nonsense behavioral add-ons for AI coding agents that prevent the silly failures: skipping verification, sloppy naming, over-eager refactors. Each skill is a self-contained pattern distilled from real sessions into something any agent (Claude Code, Codex, Gemini, Cursor, OpenCode) can adopt.',
        tags: ['Agent Tooling', 'Prompt Eng'],
        tagTone: {},
        tier: 'ai',
        featured: true,
        hidden: false,
        fallback: { stars: null, forks: null },
        short: 'Practical behavioral add-ons for AI coding agents — self-contained patterns that stop skipped verification and over-eager refactors.',
    },
    {
        id: 'codegraph',
        org: 'AdityaK9822',
        name: 'Codegraph for APRIL',
        url: 'https://github.com/AdityaK9822/codegraph-for-APRIL',
        badge: ['Fork', 'AI Dev Tooling'],
        desc: "An edited fork of a pre-indexed code knowledge graph that auto-syncs on code changes, wired into the APRIL stack — giving participating coding agents (Claude Code, Codex, Gemini, Cursor, OpenCode) instant, accurate retrieval over a living codebase instead of stale grep. This is the memory surgery that lets an agentic system navigate its own 10k+ files without losing the plot.",
        tags: ['TypeScript', 'Fork'],
        tagTone: { 'TypeScript': '', 'Fork': 'red' },
        tier: 'ai',
        featured: true,
        hidden: false,
        fallback: { stars: null, forks: null },
        short: 'Pre-indexed code knowledge graph wired into the APRIL stack — instant, accurate retrieval for coding agents instead of stale grep.',
    },

    /* ── SECTION B — Open Source · Stellar Ecosystem ── */
    {
        id: 'fluid',
        org: 'Stellar-Fluid',
        name: 'fluid',
        url: 'https://github.com/Stellar-Fluid/fluid',
        desc: 'Gas abstraction layer for Stellar. Wraps user transactions in fee-bump envelopes so apps can sponsor XLM fees.',
        tags: ['TypeScript / Rust', 'Fee-Bump', 'Production'],
        tagTone: { 'TypeScript / Rust': '', 'Fee-Bump': 'blue', 'Production': 'green' },
        tier: 'stellar',
        featured: false,
        hidden: false,
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
        tier: 'stellar',
        featured: false,
        hidden: false,
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
        tier: 'stellar',
        featured: false,
        hidden: false,
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
        tier: 'stellar',
        featured: false,
        hidden: false,
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
        tier: 'stellar',
        featured: false,
        hidden: false,
        fallback: { stars: null, forks: null },
    },
];

/* ── ARCHIVE (Section C) — compact track record, no spotlight ── */
const ARCHIVE = [
    { name: 'Hash Cracker', desc: 'CLI tool for cracking MD5, SHA-1/2/3, BLAKE2 hashes via wordlist or brute force. Built for CTF challenges and ethical security research.', meta: 'Python · Security' },
    { name: 'Port Scanner', desc: 'Simple Python TCP port scanner for checking open ports on a target host.', meta: 'Python · Network Security' },
    { name: 'Network Mapper', desc: 'ARP-scan tool using Scapy to discover active devices (IP + MAC) on a local subnet.', meta: 'Python · Network Security' },
    { name: 'DSA E-commerce', desc: 'E-commerce platform in pure C++ demonstrating BST/AVL trees, hash tables, BFS/DFS, 0/1 knapsack, and sorting algorithms.', meta: 'C++ · DSA' },
    { name: 'Smart Insurance Claim Processor', desc: 'Terminal-based (FTXUI) insurance claim processing & risk assessment system in C++.', meta: 'C++ · Terminal UI' },
    { name: 'MedInventory-Desk', desc: 'Clinic/hospital pharmacy inventory system: stock tracking, batch management, expiry alerts.', meta: 'JavaScript · Healthcare' },
    { name: 'Lumnova', desc: 'Digital-wallet frontend with a streamlined payment interface.', meta: 'React · Vite · Fintech' },
    { name: 'buildtrack', desc: 'Construction project management platform with an API and client.', meta: 'JavaScript · Full-stack' },
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
   Each points to posts/<slug>.html. Everything renders from
   this list: journal page, featured post, home teaser.
   ───────────────────────────────────────────────────────── */
const POSTS = [
    {
        slug: 'april-embodied-ai',
        title: 'APRIL: building an assistant with a body',
        date: '2026-11-04',
        tags: ['research', 'agentic-ai'],
        pinned: true,
        excerpt: 'Why "an assistant that can only answer is a chatbot" — the case for embodiment, the SEE/SENSE/ACT/NETWORK/BUILD pillar architecture, and an honest status report.',
    },
    {
        slug: 'new-portfolio',
        title: 'Rebuilding my portfolio in the open',
        date: '2026-11-10',
        tags: ['site'],
        pinned: false,
        excerpt: 'Why I rebuilt this site as plain HTML/CSS with a live-stats engine — and what is shipping next.',
    },
    {
        slug: 'polyagent-many-brains',
        title: 'Polyagent: one orchestrator, many brains',
        date: '2026-10-20',
        tags: ['agents', 'mcp'],
        pinned: false,
        excerpt: 'One agent can\'t do security scans, code review, and analysis equally well. An MCP orchestrator that delegates to six providers — with real loop prevention.',
    },
];

/* ── JOURNAL PAGE HEADLINE ──────────────────────────────── */
const JOURNAL_META = {
    heading: 'journal.log',
    blurb: 'Research notes, build logs and honest status reports — published as plain files in the repo.',
};
