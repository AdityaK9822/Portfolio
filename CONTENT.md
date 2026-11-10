# CONTENT.md — Master Content Source (AI-First)

**This is the single source of truth for all copy on the portfolio (`data.js`, every page, journal posts) and `Resume.html`.**
Any future edit starts here, then flows outward. Last synced with GitHub: **2026-11-10** via `gh repo list AdityaK9822`.

---

## 0. Brand identity

| Token | Value |
|---|---|
| Name | Aditya Kadam (`AdityaK9822`) |
| Role / headline | AI Systems & Agentic Engineering |
| Brandline (tagline) | LLM-FIRST SYSTEMS · AGENTS · EMBODIED AI · OPEN SOURCE |
| One-liner | Building assistants with a body — AI that senses, acts, and ships. |
| Identity shift | Web3 Developer first → **AI systems engineer first**, Web3/security retained as proof of range. |
| Rationale | Last 90 days of pushes are almost entirely AI (APRIL · synopsi-web · Polyagent · Claude-SKILLS · codegraph-for-APRIL); Stellar maintenance is steady-state. |

### STORY (hero intro paragraph)

> I build agentic AI systems: an embodied LLM assistant wired into the physical world (APRIL), multi-provider agent infrastructure (Polyagent), and applied LLM apps you actually use to study. The throughput that makes this possible is my decade-shaped habit of shipping — production Stellar/Soroban contracts, maintainer duties across open source repos, and security tooling. AI is the current form; engineering discipline is the constant.

### ABOUT (data.js → PROFILE.about) — final copy

> CS student at ITM Kharghar building agentic AI systems — an embodied LLM assistant wired into the physical world (APRIL), multi-provider agent infrastructure (Polyagent), and applied LLM apps. Background in Stellar/Soroban open source maintenance and security tooling: the systems discipline that ships production-grade AI.

### OPEN TO (data.js → PROFILE.openToList) — new order

1. AI/ML Engineering
2. AI Agent Infra
3. LLM Application Dev
4. Web3 Development
5. Security Research

---

## 1. SECTION A — AI, AGENTS & R&D

Section label: **AI, Agents & R&D**
Section intro line (work.html):

> Active research and shipping. Flagship is an embodied agent; everything else is infrastructure around it — orchestration, dev tooling, and applied LLM apps.

Card copy below is final and goes straight into `data.js → REPOS` (all 6 with `featured: true` and listed in this exact order).

---

### 1.1 APRIL — flagship R&D

- **Repo:** `AdityaK9822/APRIL`
- **Language:** Python · **Pushed:** 2026-11-08
- **Badges:** `Flagship R&D` `Building in the open` (NOT "production" — repo README explicitly says "nothing here is built yet: this is the scope, not a feature list". Honesty on the card is part of the brand.)

**Card title:** APRIL

**Card description (final):**
> An LLM assistant with a body in the networked world — it senses, controls, and works with the physical devices around it. Organized into pillars: **SEE** through IP cameras with a vision model; **SENSE** ECG/EEG and telemetry via ESP32-connected sensors; **ACT** on lights, AC, switches, and robot arms; **NETWORK** discovery and authorized wifi audits; **BUILD** hardware from CAD → CNC → 3D print → flash. The body is whatever is reachable on the network right now — the ESP32 is the archetypal limb.

**Repo GitHub description (fix once, optional shortening):**
> An LLM assistant with a body in the networked world — it senses, controls, and works with the physical devices around it

**Topics to push to repo:** `ai-agent` `llm` `embodied-ai` `agent-framework` `iot` `esp32` `home-automation` `robotics` `machine-learning` `open-source`

**Longer blurb for journal post / resume detail:** see §5.

---

### 1.2 synopsi-web — latest shipped AI app

- **Repo:** `AdityaK9822/synopsi-web`
- **Language:** TypeScript · **Pushed:** 2026-11-02
- **Badges:** `New · Nov 2026` `Frontend App` (currently has no GitHub description/topics — both should be set; use the lines below)

**Card title:** Synopsi

**Card description (final):**
> A smart academic notes assistant — paste or upload messy lecture notes (.txt/.md/.pdf) and get a structured study pack: Summary → Key Concepts → Revision Questions with an interactive click-to-reveal quiz mode. Runs `gemma4:31b` on Ollama Cloud, so no local GPU needed. A Fact-Check "Research mode" re-verifies claims from your output against the source notes with exact quoted fragments, and ends with a numbered sources list. Server-side text/PDF extraction, persisted chat threads, and a documented prompt-engineering pipeline (persona + strict output template + few-shot example + grounding rules) as the graded core.

**Repo GitHub description (set):**
> AI study-pack generator: messy notes → summary → key concepts → revision questions → interactive quiz. Next.js 16 + Ollama gemma4:31b.

**Topics to push:** `nextjs` `llm` `ollama` `study-tools` `pdf-processor` `quiz-app` `prompt-engineering` `education`

---

### 1.3 Polyagent — agent infrastructure

- **Repo:** `AdityaK9822/Polyagent`
- **Language:** Python · **Pushed:** 2026-09-10
- **Badges:** `MCP Server` `Agent Infra`

**Card title:** Polyagent

**Card description (final):**
> A multi-provider AI agent bridge for Claude Desktop — an MCP server that lets Claude delegate specialized work (security scans, code review, analysis) to other agents: GLM, OpenAI, Anthropic, AWS Bedrock, Gemini, and Ollama Cloud over an OpenAI-compatible endpoint. Ships with dynamic agent registration, sequential / iterative / parallel pipeline modes, and real loop-prevention — max iterations, confidence thresholds, human approval gates — plus streaming, comprehensive error handling, logging, and metrics.

**Repo GitHub description (already fine, tighten):**
> Multi-provider AI agent bridge — an MCP server that lets Claude Desktop delegate tasks (security scans, code review, analysis) to Gemini, GLM, OpenAI, Anthropic, Bedrock

**Topics (already good):** keep as-is (`ai-agents`, `aws-bedrock`, `claude`, `code-review`, `gemini`, `llm`, `mcp`, `mcp-server`, `openai`, `python`).

---

### 1.4 AXIOM-Firmware — embedded/hardware limb

- **Repo:** `AdityaK9822/AXIOM-Firmware`
- **Language:** C++ · **Pushed:** 2026-09-07
- **Status on portfolio:** Card is written now, live as soon as repo is public. **ACTION FOR ADITYA: flip `AXIOM-Firmware` to public.** Until then this card stays hidden (data.js `hidden: true`).
- **Badges:** `Embedded` `Security`

**Card title:** AXIOM-Firmware

**Card description (final):**
> ESP32-S3 Wi-Fi/BLE lab-controller firmware with a web dashboard and SH1106 OLED display — network monitoring, diagnostics, and authorized wireless security assessment. This is the reference hardware "limb" APRIL plugs compliance-tested radios, sensors, and actuation into: an entire programmable bridge, in a pocket form factor, to the physical side of an agentic system.

**Repo GitHub description (set):**
> ESP32-S3 Wi-Fi/BLE lab controller — firmware + web dashboard + OLED for network monitoring, diagnostics, and authorized wireless security testing.

**Topics to push:** `esp32` `esp32-s3` `firmware` `arduino` `ble` `wifi` `network-monitoring` `security-tools` `oled` `iot`

---

### 1.5 Vibe-coding-Claude-SKILLS — agent tooling

- **Repo:** `AdityaK9822/Vibe-coding-Claude-SKILLS`
- **Language:** (mixed — README-driven)
- **Pushed:** 2026-08-13
- **Badges:** `Agent Tooling` `Prompt Engineering`

**Card title:** Claude SKILLS

**Card description (final):**
> A small library of Claude skills — practical, no-nonsense behavioral add-ons for AI coding agents that prevent the silly failures: skipping verification, sloppy naming, over-eager refactors. Each skill is a self-contained pattern distilled from real sessions into something any agent (Claude Code, Codex, Gemini, Cursor, OpenCode) can adopt.

**Repo GitHub description (already good, tighten):**
> Simple, practical Claude skills that stop agent coding failures

**Topics to push:** `claude` `claude-code` `claude-skills` `prompt-engineering` `agent-framework`

---

### 1.6 codegraph-for-APRIL — code intelligence

- **Repo:** `AdityaK9822/codegraph-for-APRIL`
- **Language:** TypeScript (edited fork)
- **Pushed:** 2026-11-01
- **Badges:** `Fork` `AI Dev Tooling`

**Card title:** Codegraph for APRIL

**Card description (final):**
> An edited fork of a pre-indexed code knowledge graph that auto-syncs on code changes, wired into the APRIL stack — giving participating coding agents (Claude Code, Codex, Gemini, Cursor, OpenCode) instant, accurate retrieval over a living codebase instead of stale grep. This is the memory surgery that lets an agentic system navigate its own 10k+ files without losing the plot.

**Repo GitHub description (already fine):** keep as-is.

---

### SECTION A — Summary table (for reference, not for site render)

| # | Project | Language | Tag class | Live date |
|---|---|---|---|---|
| 1 | APRIL | Python | R&D · AI Agents | Building |
| 2 | Synopsi | TypeScript | Applied LLM | Nov 2026 |
| 3 | Polyagent | Python | Agent Infra · MCP | 2026 |
| 4 | AXIOM-Firmware | C++ | Embedded · Security | Hidden until public |
| 5 | Claude SKILLS | — | Agent Tooling | 2026 |
| 6 | Codegraph for APRIL | TypeScript | AI Dev Tooling | 2026 |

---

## 2. SECTION B — Open Source · Stellar Ecosystem (secondary)

Section label: **Open Source · Stellar Ecosystem**
Section intro line (work.html):

> Where I learned shipping discipline — production contracts, fee abstraction, keeper bots. This is the ecosystem I currently maintain inside, via drip.network's Stellar Waves program.

All five existing cards stay in the portfolio, same order, same copy, marked `featured: false`:

1. **Stellar-Fluid / fluid** — Gas abstraction layer for Stellar. Wraps user transactions in fee-bump envelopes so apps can sponsor XLM fees. 21 production releases, 92 forks. *(TypeScript / Rust · Production)*
2. **SafeVault / vestroll** — Stablecoin & fiat payroll platform on Stellar Soroban. ZK-shielded payments, biometric auth (passkeys), NGN→USDC bridge. *(Next.js 15 · ZK Proofs)*
3. **SoroLabs / SoroTask** — Decentralized automation marketplace on Soroban. Rust smart contracts + Keeper bots that execute recurring on-chain tasks. *(Rust / Node.js · Smart Contracts)*
4. **sublime247 / mobile-money** — Backend bridge connecting MTN, Airtel, and Orange mobile money providers with the Stellar network. REST API, PostgreSQL, Docker, Kubernetes. *(TypeScript · PostgreSQL)*
5. **Nexacore-Org / NexaFx** — Web3-powered DeFi currency exchange platform. Multi-currency swaps with TypeScript frontend and Stellar blockchain backend. *(Web3 · Stellar)*

NAVIGATION RULE: on `index.html` (hero + featured grid), show **AI tier first (2×3 grid)**. Stellar gets a slim strip: one line per repo linking out, no full cards, to keep AI as the main event.

---

## 3. SECTION C — Archive (compact)

Section label: **Archive**
Section intro line:

> Security tooling, DSA projects, and early shipping. Smaller cards, lighter treatment — kept for track record, not spotlight.

Render as a 2-column compact list (one line of name + one-line description), not full cards:

- **Hash Cracker** — CLI tool for cracking MD5, SHA-1/2/3, BLAKE2 hashes via wordlist or brute force. Built for CTF challenges and ethical security research. *(Python · Security)*
- **Port Scanner** — Simple Python TCP port scanner for checking open ports on a target host. *(Python · Network Security)*
- **Network Mapper** — ARP-scan tool using Scapy to discover active devices (IP + MAC) on a local subnet. *(Python · Network Security)*
- **DSA E-commerce (C++)** — E-commerce platform in pure C++ demonstrating BST/AVL trees, hash tables, BFS/DFS, 0/1 knapsack, and sorting algorithms. *(C++ · DSA)*
- **Smart Insurance Claim Processor** — Terminal-based (FTXUI) insurance claim processing & risk assessment system in C++. *(C++ · Terminal UI)*
- **MedInventory-Desk** — Clinic/hospital pharmacy inventory system: stock tracking, batch management, expiry alerts. *(JavaScript · Healthcare)*
- **Lumnova** — Digital-wallet frontend with a streamlined payment interface. *(React · Vite · Fintech)*
- **buildtrack** — Construction project management platform with an API and client. *(Javascript · Full-stack)*

DEMOTE (do NOT render, not even archive): `Restaurant-Management-API`, `EmployeeAPI`, `assignment-*` repos, `React-MCQ-Quiz`, `Meme-Battle`, `500.co-clone`, `TraceChain`, `Portfolio` (old), `Photo-MCQ/att.git` internals, `Tanko-d`, `offer-hub-monorepo`, `micopay-protocol`, `Stellar-Search`, `SoroTask-fork`, `vestroll-fork`, `fluxora-contracts`, `facilpay-contracts`, `Alien-Protocol`, `ruview`, `akkuea`, `LynxX`, `Pactum`, `harness2`, `atreus`. These are either homework, forks of work, or private.

---

## 4. SKILLS (data.js → SKILLS, `Resume.html` mirrors this exactly)

Group 1 (first, most emphasized): **AI & AGENTS**
- Claude API (Anthropic)
- Ollama / OpenAI-compatible endpoints
- MCP (Model Context Protocol)
- Multi-agent orchestration (pipelines, gate-keeping, loop prevention)
- Prompt engineering (system templates, few-shot, grounding, fact-check)
- Vision models for camera / feed reasoning

Group 2: **LANGUAGES**
- Python
- TypeScript / JavaScript
- Rust
- C++
- Shell / Bash

Group 3: **WEB3 & BLOCKCHAIN**
- Stellar / Soroban
- Smart Contracts (Rust)
- Fee-Bump Transactions
- Solidity / Web3.js

Group 4: **FRONTEND & BACKEND**
- Next.js / React
- Node.js / REST APIs
- PostgreSQL / Drizzle ORM
- HTML / CSS / Tailwind

Group 5: **INFRA & TOOLING**
- Docker / Kubernetes
- Git / GitHub Actions
- Ethical Hacking / CTF

NOT APPLIED / not honest: don't add "PyTorch" / "TensorFlow" or "ML Research" unless actually trained a model — repo doesn't support it yet.

---

## 5. JOURNAL POSTS (data.js → POSTS)

### Post 1 — "APRIL: building an assistant with a body"
- **Slug:** `april-embodied-ai`
- **Status:** the truth-telling R&D post. Frame deliberately — this is not "announcing a finished product", it's "here is my research bet".
- **Outline:**
  1. Why "an assistant that can only answer is a chatbot" — the case for embodiment.
  2. The pillar architecture: SEE / SENSE / ACT / NETWORK / BUILD.
  3. Why the ESP32 is the archetypal limb — a programmable wifi bridge, not a gadget.
  4. Honest status: "Nothing here is built yet — this is the scope, not a feature list." Then what IS in flight (vision-model integration, ESP32 reference firmware).
  5. What requests will look like when it works ("Who's at the gate?", "Log my ECG for an hour and flag anything odd").
  6. Call for collaborators on sensing/network domains.

### Post 2 — "Polyagent: one orchestrator, many brains"
- **Slug:** `polyagent-many-brains`
- **Outline:**
  1. The problem — one agent can't do security scans, code review, and analysis equally well; model TCO also matters.
  2. Quick architecture diagram: `Claude Desktop <=> MCP Server <=> external agents`.
  3. Agent registry, pipeline modes (sequential / iterative / parallel).
  4. Loop prevention deep-dive: max iterations, confidence thresholds, human approval.
  5. Streaming + metrics; production hardening.
  6. Where this goes next.

---

## 6. SECTION D — Experience & Education (unchanged, kept for parity)

### Open Source Maintainer — Stellar Waves Program · drip.network
**March 2026 – Present**
- Maintained and contributed to multiple open source repositories within the Stellar ecosystem, coordinated by drip.network's Stellar Waves program.
- Reviewed and merged pull requests, triaged issues, and maintained code quality standards across active contributor communities.
- Contributed to TypeScript and Rust codebases handling blockchain transaction flows, fee abstraction, and smart contract automation on Soroban.

### B.Tech — Computer Science & Engineering
ITM Skills University · Kharghar, Navi Mumbai · **2025 – Present**

---

## 7. `Resume.html` — full reordered copy (ready to paste)

### 7.1 Header
- Heading: **Aditya Kadam**
- Tagline: **AI Systems & Agentic Engineering · LLM Apps · Open Source**
- Links: GitHub `AdityaK9822`, LinkedIn, Contact

### 7.2 About section
> CS student at ITM Kharghar building agentic AI systems — an embodied LLM assistant wired into the physical world (APRIL), multi-provider agent infrastructure (Polyagent), and applied LLM apps. Background in Stellar/Soroban open source maintenance and security tooling: the systems discipline that ships production-grade AI.

### 7.3 Projects section → full reorder, AI first

Title heading: **AI Projects & R&D** (not just "Projects") — the five AI cards (§1.1–§1.6 minus AXIOM, which stays private) in order 1–6, then the minor archive items collapsed into a single line at the end:
> **Also:** Cryptographic Hash Cracker · Port Scanner · Network Mapper · DSA e-commerce in C++ · Smart Insurance Claim Processing (FTXUI) · MedInventory · Lumnova · buildtrack

### 7.4 Open Source Contributions section (unchanged from current file content — Stellar 5 cards)

### 7.5 Skills section — reordered to mirror data.js §4 exactly, AI group first.
Heading under this order: **AI/ML** as the first column, not last.

### 7.6 Experience & Education — unchanged.

---

## 8. `index.html` / `work.html` headline copy

Hero headline (index): **Building assistants with a body — AI that senses, acts, and ships.**
Hero subline: *Agentic engineering across LLM orchestration, embodied AI, and applied study tools — with a production-discipline background in Stellar/Soroban open source.*

Work page top headline: **What I'm building now** → AI tier first, then the Stellar open-source section.

---

## 9. Execution checklist (sequence for implementers)

1. [ ] Update `js/data.js` — REPOS reorder (AI tier first, 6 entries, `featured: true`, AXIOM `hidden: true`), PROFILE.about/tagline/openToList, SKILLS new order, POSTS add 2 new items.
2. [ ] Update `work.html` — reorder sections (AI / Open Source / Archive), new section intro lines from §1 / §2 / §3.
3. [ ] Update `index.html` — hero headline from §8, featured grid = AI 2×3.
4. [ ] Update `Resume.html` — full copy from §7.
5. [ ] Write `posts/april-embodied-ai.html` (from `_template.html`).
6. [ ] Write `posts/polyagent-many-brains.html` (from `_template.html`).
7. [ ] Set GitHub repo descriptions/topics for `synopsi-web` + `AXIOM-Firmware` (lines in §1.2 / §1.4).
8. [ ] ACTION for Aditya: flip `AXIOM-Firmware` public → then set its card `hidden: false`.
9. [ ] Optional follow-up: shift profile README (`AdityaK9822/AdityaK9822`) accent purple→AI-forward banner language.
10. [ ] Verify: `python3 -m http.server 8000` (README's standard)—hero render, cards render, live star counts, no 404s, resume + portfolio consistent.

---

## 10. Explicit non-goals (what NOT to claim)

- No "ML Research" / "PyTorch / TensorFlow" claims for this portfolio. No paper citations, no benchmarks.
- APRIL gets **no production badge**, only "Flagship R&D" / "Building in the open".
- Polyagent is a ready tool; keep its badge neutral (`Agent Infra`/`MCP Server`), don't call it "production" either since user-driven adoption data isn't available.
- `codegraph-for-APRIL` is labeled a **fork** (transparency, avoids stolen credit).
- Don't claim "PhD-track" or formal lab affiliation anywhere.
