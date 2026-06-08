# 05 — Decisions

## Accepted

| ID | Decision | Source |
|---|---|---|
| DEC-001 | Create clean project at `kbit-new-project`. | Lucy |
| DEC-002 | Do not use Next.js in the new clean project. | Lucy |
| DEC-003 | Use React + Vite + TypeScript. | Lucy |
| DEC-004 | Migrate/reuse only content, data, and assets. | Lucy |
| DEC-005 | Do not migrate/reuse design references now; preserve `stitch-frontend/` for UI study reference. | Lucy |
| DEC-006 | Improve load time as a first-class build-plan concern. | Lucy |
| DEC-007 | Adopt "Seoul Prestige" design system: midnight navy + ivory + single gold accent. Defined in `context/07-ui-system.md`. | Lucy 2026-06-08 |
| DEC-008 | All assets must be converted to WebP via Sharp CLI before use in React components. Optimized output goes to `data/assets-opt/`. | Lucy 2026-06-08 |
| DEC-009 | Typography: Cormorant Garamond (display) + DM Sans (body) + DM Mono (stats). Rationale: editorial precision, legible in VI/KO diacritics, distinct from Stitch's Libre Caslon + Hanken Grotesk. | Lucy 2026-06-08 |
| DEC-010 | Use Phosphor Icons (`@phosphor-icons/react`) — not Heroicons or Material Icons. | Lucy 2026-06-08 |
| DEC-011 | Image component contract: `srcset` at 400w/800w/1200w WebP, `loading="lazy"` except hero, explicit `width`/`height`, LQIP placeholder. | Lucy 2026-06-08 |
| DEC-012 | Scaffold gate cleared. React + Vite scaffold is approved to proceed. | Lucy 2026-06-08 |

## Candidate / gated

| ID | Candidate | Gate |
|---|---|---|
| CAND-002 | Use React Router localized route shell (`/:locale/route`). | Confirm at scaffold phase — now unblocked |
| CAND-003 | Add bundle/load-time tooling (`rollup-plugin-visualizer`) immediately after scaffold. | Confirm at scaffold phase — now unblocked |
| CAND-004 | Run Sharp image optimization script before first image component is built. | Confirm script works on local Node.js version |
