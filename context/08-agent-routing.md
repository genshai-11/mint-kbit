# 08 — Agent Routing

## Routing model

Use Hermes Kanban for durable task tracking.

## Current lanes

| Lane | Status | Notes |
|---|---|---|
| Orchestrator | active | Project OS, board, gates |
| Content/data | complete | Seed/assets transferred, gaps tracked |
| React scaffold | **unblocked** | Gate cleared 2026-06-08 — proceed with Vite scaffold |
| Image optimization | **unblocked** | Run before first image component; see `context/03-build-plan.md` Phase 3 |
| UI implementation | **active** | Design system in `context/07-ui-system.md` is source of truth |
| Performance | pending | After public pages render |
| Admin/content path | deferred | After public content baseline stable |

## UI lane — now active

The UI lane is unblocked. Source of truth for all styling decisions:

- **Design system:** `context/07-ui-system.md`
- **Color tokens:** `--clr-midnight`, `--clr-navy`, `--clr-gold`, `--clr-ivory` (see 07-ui-system.md)
- **Fonts:** Cormorant Garamond + DM Sans + DM Mono
- **Icons:** Phosphor Icons (`@phosphor-icons/react`)
- **Image contract:** WebP srcset, lazy loading, LQIP

Any agent building UI components must read `context/07-ui-system.md` before writing a single line of CSS or JSX.

## Execution order (next session)

1. Scaffold React + Vite TS app
2. Install dependencies (react-router-dom, @phosphor-icons/react, sharp, vite-imagetools)
3. Create `src/styles/tokens.css` from `context/07-ui-system.md` color + type + spacing tokens
4. Run image optimization pipeline (`data/assets/` → `data/assets-opt/`)
5. Build route shell with locale prefix
6. Wire seed JSON data loaders
7. Build pages in priority order: Home → Events → News → Membership → About → Partners → Contact → Experts gap → Centers

## Rule

No implementation worker should use design values not defined in `context/07-ui-system.md`.
No image component should reference `data/assets/` directly — always use `data/assets-opt/`.
