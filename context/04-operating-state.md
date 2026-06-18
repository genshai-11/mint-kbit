# 04 — Operating State

## Current phase

**Phase 4b complete — all content pages delivered. Membership, Centers, and Experts added 2026-06-08. Partners deferred (logos only).**

Design system defined. Image optimization plan documented. Current UI direction is locked to the Seoul Prestige editorial system in `context/07-ui-system.md`, with shared route motion active across public pages.

## Evidence-based progress

- Setup checklist: **12/12 complete**
- Implementation progress: **Phase 4b complete — ten surfaces delivered (Home, Events, Event Detail, News, News Detail, About, Contact, Membership, Centers, Experts)**

Checked evidence is in:

- `context/03-build-plan.md`
- `context/07-ui-system.md`
- `context/audits/repository-hygiene-audit.md`
- `context/audits/source-transfer-audit.md`

## Current blockers

1. ~~Lucy confirmation required before React + Vite scaffold.~~ **Cleared 2026-06-08.**
2. ~~Image optimization script must run before any image component is built.~~ **Done; Sanity migration now prefers optimized `data/assets-opt/` WebP files.**
3. ~~Experts content remains missing (gap — render explicit gap state, do not invent).~~ **Done — gap state page live.**
4. Testimonials remain missing (gap).
5. ~~`SANITY_TOKEN` is not present in local `.env.local`, so membership write migration cannot be run yet.~~ **Cleared 2026-06-17 via Sanity CLI user-token migration.**
6. Production asset hosting now has Sanity CDN path for events and KAT 2025 program library images; final production cutover still requires preview QA and release controls.

## Hermes board

- Board slug: **`kbit-new-project`**
- Board name: **KBIT New React Project**
- Workdir: `C:\Users\gensh\OneDrive\Máy tính\LUCY\PROJECT-WORKPLACE\JOLLY\kbit-new-project`

## Board snapshot

| Task ID | Status | Title |
|---|---|---|
| `t_fc605161` | done | Gate: confirm React + Vite scaffold phase |
| `t_ui_system` | done | Define UI design system (07-ui-system.md) |
| `t_img_plan` | done | Document image optimization plan |
| `t_agents_md` | done | Update AGENTS.md with skills routing + 2-page pilot gate |
| `t_fd2f5034` | done | Scaffold React + Vite TypeScript app |
| `t_img_opt` | done | Run image optimization pipeline (data/assets -> data/assets-opt) |
| `t_tokens_css` | done | Create src/styles/tokens.css from 07-ui-system.md |
| `t_cf342098` | done | Build localized route shell from transferred seed data |
| `t_13847fb4` | done | Create content loaders for seed JSON entities |
| `t_4a_home` | done | [Phase 4a] Build Home page - pilot |
| `t_4a_events` | done | [Phase 4a] Build Events page - pilot |
| `t_4a_qa` | done | [Phase 4a] Visual QA + design iteration -> update 07-ui-system.md |
| `t_4a_gate` | done | [Gate] Lucy confirms Phase 4a design direction |
| `t_4b_pages` | done | [Phase 4b] Build remaining pages after gate |
| `t_0bed4a30` | done | Performance pass: lazy routes, split JSON, bundle report (CWV live run pending — see context/audits/phase-5-performance.md) |
| `t_314397dd` | in_progress | Admin/content operations path — Sanity event runtime sync, optimized migration, membership schema/migration + live membershipProgram migration completed 2026-06-17 |
| `t_eb42c8dd` | todo | Add verification and release controls |
| `t_phase8_membership` | planned | Phase 8 — Membership Platform (Supabase auth + tier-gated docs + separate admin app). Plan in context/03-build-plan.md; awaiting owner sign-off before 8a |

## Next task

Phase 5 performance pass is done (seed JSON split per entity; see `context/audits/phase-5-performance.md`) — only the live Core Web Vitals run on a preview URL remains. CMS cutover progress: Events, Membership, **Settings (Footer/Contact/About)**, **Home hero**, **Partners**, and **Centers** now read from Sanity at runtime with seed fallback (Sanity client dynamic-imported to stay out of the global chunk). Remaining (Experts, News, Page bodies) are each blocked on a small schema/page alignment, documented in `context/audits/sanity-cutover-status.md`. Phase 8 (Supabase membership platform) is planned in `context/03-build-plan.md` and awaits owner sign-off. Next concrete actions: (1) Lighthouse baseline on preview, (2) finish optional Sanity cutover or formally defer it, (3) sign off Phase 8 8a.
