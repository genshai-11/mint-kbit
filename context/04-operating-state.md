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
2. Image optimization script must run before any image component is built.
3. ~~Experts content remains missing (gap — render explicit gap state, do not invent).~~ **Done — gap state page live.**
4. Testimonials remain missing (gap).
5. Production asset hosting not finalized (use local `data/assets-opt/` until Sanity CDN migration is run and verified).

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
| `t_0bed4a30` | todo | Performance pass: lazy routes, split JSON, bundle report |
| `t_314397dd` | in_progress | Plan future admin/content operations path — Sanity Studio/schema/migration tooling verified 2026-06-09 |
| `t_eb42c8dd` | todo | Add verification and release controls |

## Next task

Phase 5 — Performance pass remains the canonical next build task. Sanity Phase 6 setup tooling is now partially implemented; remaining Sanity work requires real project credentials/CORS, live migration, content QA, and frontend wiring.
