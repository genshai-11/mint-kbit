# Repository Hygiene Audit

Target: `C:\Users\gensh\OneDrive\Máy tính\LUCY\PROJECT-WORKPLACE\JOLLY\kbit-new-project`

## Existing folders before execution
| Path | Classification | Rule |
|---|---|---|
| `Plan/` | canonical reference | Preserve untouched |
| `stitch-frontend/` | canonical deferred UI reference | Preserve untouched; study later |
| `.pi/gsd/` | tooling/reference/unclear | Keep untouched; do not depend on for clean app runtime |

## Created this run
| Path | Classification | Rule |
|---|---|---|
| `AGENTS.md` | canonical Project OS | Read first |
| `CONTEXT.md` | canonical domain language | Read second |
| `context/` | canonical Project OS | Maintain with task changes |
| `data/seed/` | canonical transferred content data | Source for clean React scaffold |
| `data/assets/` | canonical transferred local assets | Optimize later before public serving |
| `data/CONTENT_GAPS.md` | canonical gap report | Keep gaps visible |

## Not created this run
- `src/`
- `package.json`
- React/Vite app runtime

Reason: scaffold remains gated until Lucy confirms scaffold phase.

## Delete candidates
None. No deletion during project-init.

## Duplicate/legacy candidates
None in target runtime because no source runtime exists yet. `Plan/` and `stitch-frontend/` are intentionally preserved reference folders.

## Human confirmation needed before future removal
- Anything under `Plan/`
- Anything under `stitch-frontend/`
- Anything under `.pi/`
- Any transferred seed or asset file
