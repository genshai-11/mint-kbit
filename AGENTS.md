# AGENTS.md

## Project OS status

- Mode: **active build — React + Vite scaffold approved**
- Architecture status: **Accepted — React + Vite, no Next.js**
- Design system status: **Accepted — "Seoul Prestige" defined in `context/07-ui-system.md`**
- Build plan status: **Active — Phase 2 (scaffold) is next**
- Canonical task state: **Hermes Kanban board `kbit-new-project`**

## Core rule

This clean project must **not reuse old Next.js app/source code**. Only migrate/reuse:

- content seed JSON (`data/seed/`)
- local data assets optimized to WebP (`data/assets-opt/`)
- content gap documents

`Plan/` and `stitch-frontend/` already exist in this folder and must be preserved untouched.
Stitch references are for historical study only — `context/07-ui-system.md` is now the design source of truth.

## Migration boundary

The old `kbitassociation.com` website is a content/reference source only. The new React/Vite site must not redirect users back to the old domain.

- Do not render public `href`, `src`, iframe, form action, download URL, or CTA destinations pointing to `kbitassociation.com` or `api.kbitassociation.com`.
- `sourceUrl`, `sourceId`, `originalUrl`, and crawl inventory fields may remain in `data/seed/` only for traceability.
- Any content, image, PDF, form, or downloadable file needed by the UI must be migrated into this project and served locally.
- If a legacy file cannot be migrated yet, show an on-site contact or “request file” flow instead of linking to the legacy domain.

---

## Read order for any agent

1. [AGENTS.md](./AGENTS.md)
2. [CONTEXT.md](./CONTEXT.md)
3. [context/01-prd.md](./context/01-prd.md)
4. [context/02-architecture.md](./context/02-architecture.md)
5. [context/03-build-plan.md](./context/03-build-plan.md)
6. [context/04-operating-state.md](./context/04-operating-state.md)
7. [context/05-decisions.md](./context/05-decisions.md)
8. [context/06-runbook.md](./context/06-runbook.md)
9. [context/07-ui-system.md](./context/07-ui-system.md)
10. [context/08-agent-routing.md](./context/08-agent-routing.md)

---

## Skills routing

Every agent and every session must follow this map. **Search for a skill using `/find-skills` or
`Skill` tool before starting any task type.** Never skip the skill check for the tasks below.

### Before writing any code for the first time in a task

| Trigger | Skill to invoke | Why |
|---|---|---|
| New feature, new component, new page | `superpowers:brainstorming` | Explore intent + design before any implementation |
| Multi-step implementation task | `superpowers:writing-plans` | Write a clear plan before touching files |
| Architectural decision (e.g. routing, data loading) | `architect` | Senior-engineer review of tradeoffs before committing |

### During UI/component build

| Trigger | Skill to invoke | Why |
|---|---|---|
| Building any React component or page | `frontend-design:frontend-design` | Ensures design quality and consistency with `07-ui-system.md` |
| Executing a multi-step plan | `superpowers:executing-plans` | Discipline around sequential task execution |
| Independent tasks that can run in parallel | `superpowers:subagent-driven-development` | Parallelize where safe |

### After building, before marking done

| Trigger | Skill to invoke | Why |
|---|---|---|
| Any page or component complete | `superpowers:verification-before-completion` | Verify it actually works |
| Running the dev server to see changes | `run` | Correct launch sequence for this project type |
| Confirming a fix or feature visually | `verify` | Golden path + edge case check in real browser |
| Pre-PR or pre-commit code quality | `code-review` | Catch bugs + simplification opportunities |

### Debugging

| Trigger | Skill to invoke |
|---|---|
| Something broken, unclear root cause | `superpowers:systematic-debugging` |

### Design iteration (UI/UX improve cycle)

| Trigger | Skill to invoke |
|---|---|
| After 2-page pilot — reviewing what to improve | `superpowers:brainstorming` → then `frontend-design:frontend-design` |
| Updating design tokens or component specs | Update `context/07-ui-system.md` first, then rebuild affected components |

---

## Phase 4 UI pilot rule

**Do not build all pages at once.**

Phase 4 is split into two gates:

### Phase 4a — 2-page pilot (Home + Events)
Build **Home** and **Events** pages only. After both pages are confirmed working in dev:
1. Run visual QA checklist from `context/07-ui-system.md`
2. Identify what to improve in the design system
3. Update `context/07-ui-system.md` with any token/component changes
4. Lucy confirms the updated UI direction before Phase 4b starts

### Phase 4b — Remaining pages
Only start after Lucy confirms Phase 4a design direction.
Build in order: News → Membership → About → Partners → Contact → Experts gap → Centers.

**Reason:** UI/UX needs to be validated early and iterated before committing design patterns across 9 pages.

---

## File placement rules

- `Plan/`: existing docx references; do not modify.
- `stitch-frontend/`: existing screenshots/code references; preserve untouched; historical reference only.
- `data/seed/`: canonical content JSON inputs.
- `data/assets/`: original transferred assets (do not import directly into React).
- `data/assets-opt/`: WebP-optimized assets — this is what React image components must reference.
- `scripts/`: build/optimization scripts (e.g. `optimize-images.mjs`).
- `src/`: React source only.
- `src/styles/tokens.css`: CSS custom properties from `context/07-ui-system.md` — single source of truth for tokens in code.
- `context/`: Project OS only.

---

## Gates

- Do not add Next.js files.
- Do not delete during project-init.
- Do not reference `data/assets/` directly in React — always use `data/assets-opt/`.
- Do not link or redirect public UI to `kbitassociation.com` / `api.kbitassociation.com`; migrate content/files locally first.
- Do not use design values not defined in `context/07-ui-system.md`.
- Do not build Phase 4b pages until Lucy confirms Phase 4a pilot.
- Before production deploy: commit/tag, preview/canary validation, rollback docs, restore-path verification.

---

## Progress update rule

After completing any task:
1. Mark the task done in the Hermes board (`context/04-operating-state.md` board snapshot).
2. Update the checklist in `context/03-build-plan.md` if a checklist item is complete.
3. If a design token or component spec changes, update `context/07-ui-system.md` immediately.
4. Run `/remember save` at the end of any session where files were modified.
