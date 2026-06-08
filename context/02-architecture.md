# 02 — Architecture

Status: **Accepted — React + Vite clean project; scaffold gate cleared 2026-06-08**

## Accepted direction

Use **React + TypeScript + Vite** for the clean project.

## Explicit non-use

The new project must not reuse or depend on:

- Next.js App Router
- old `src/app`
- old middleware
- old package/config files
- old Prisma runtime code during initial scaffold

## Reused inputs

Only these are migrated/reused now:

- `data/seed/*.json`
- `data/assets/` → optimized to `data/assets-opt/` before use (see Phase 3)
- `data/CONTENT_GAPS.md`

## Accepted app architecture

- React + TypeScript + Vite
- React Router for localized routes (`/:locale/route`, default redirect `/` → `/en/`)
- Static JSON content loaders split by entity (no single giant import)
- Route-level lazy loading (`React.lazy` + `Suspense`)
- CSS custom properties + CSS Modules (no CSS-in-JS runtime, no Tailwind CDN)
- Backend/admin path deferred until public content foundation is stable

**Design source of truth:** `context/07-ui-system.md`
All color tokens, typography, spacing, component specs, and image contracts are defined there.
No agent may introduce design values that are not in that file.

## Load-time architecture

- Public routes must not load admin code
- Heavy gallery/lightbox code lazy-loaded on demand
- JSON split by page/entity — no single root import
- All images served as WebP via `srcset` from `data/assets-opt/`
- `font-display: swap` on all webfonts — no render-blocking fonts
- Bundle budget enforced at Phase 5 (see `context/03-build-plan.md`)
