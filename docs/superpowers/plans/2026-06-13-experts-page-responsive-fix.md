# Experts Page — Responsive & Display Fix Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 4 confirmed issues on the `/experts` page — text overflow, broken responsive layout, invisible backdrop image, and excessive card text.

**Architecture:** All fixes are CSS-only or minor TSX text adjustments. No new components. Root causes identified by static analysis of `Experts.module.css` and `Experts.tsx`.

**Tech Stack:** React + Vite, CSS Modules, design tokens from `src/styles/tokens.css`

---

## Root Cause Analysis

| Issue | Root Cause |
|---|---|
| Text overflow / horizontal scroll | Large `clamp` font on `statFeatureNum` at intermediate widths; `marqueeTrack` escaping `.marqueeSection` on some browsers; missing `overflow-x: hidden` on shell |
| Responsive broken | `directoryLayout` gap too large (`sp-9` = 96px) squeezes profile grid at intermediate widths; no intermediate breakpoint at 768–900px; `profileGrid` 2-col too narrow on mid-tablets |
| Image not showing | `.collaborateBackdrop` lacks `overflow: hidden`; `::after` overlay stacks on top of img without establishing a proper stacking context on the backdrop div |
| Card text too long | Fallback `desc` text in collaborate feature card is 2 long sentences; no `max-width` or line-clamp on the `collaborateFeatureBody p` |
| Process connector line | `.processSteps` missing `position: relative` — `::before` pseudo falls back to nearest positioned ancestor, rendering in wrong location |

---

## Files

| File | Action |
|---|---|
| `src/pages/Experts.module.css` | Modify — fix positioning, overflow, responsive, font clamp, image display, connector line |
| `src/pages/Experts.tsx` | Modify — shorten fallback text in collaborate feature card |

---

## Task 1 — Fix critical CSS positioning bugs

**Files:**
- Modify: `src/pages/Experts.module.css`

- [ ] **Step 1.1 — Add `position: relative` to `.processSteps`**

Without this the `::before` connector line is positioned relative to the wrong ancestor.

Find in `.processSteps`:
```css
.processSteps {
  position: relative;   /* ADD THIS */
  display: grid;
  gap: var(--sp-5);
}
```

- [ ] **Step 1.2 — Add `overflow: hidden` to `.collaborateBackdrop`**

This ensures the overlay `::after` clips correctly and the img fills the container:
```css
.collaborateBackdrop {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;   /* ADD THIS */
}
```

- [ ] **Step 1.3 — Add explicit `position: relative` to backdrop for stacking**

Needed for `::after` to be positioned relative to the backdrop div:
```css
.collaborateBackdrop {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}
/* already established via `position: absolute` — ::after uses this as anchor */
```

- [ ] **Step 1.4 — Verify build passes**

```bash
npm run build
```
Expected: `✓ built in X.XXs` — no errors.

---

## Task 2 — Fix text overflow and horizontal scroll

**Files:**
- Modify: `src/pages/Experts.module.css`

- [ ] **Step 2.1 — Add overflow protection on `.pageShell`**

```css
.pageShell {
  background: var(--clr-ivory);
  overflow-x: hidden;   /* ADD — prevents marquee or watermark from causing horizontal scroll */
}
```

- [ ] **Step 2.2 — Tighten marquee containment**

```css
.marqueeSection {
  overflow: hidden;           /* already exists — keep */
  /* ADD: */
  max-width: 100vw;           /* hard cap */
}
```

- [ ] **Step 2.3 — Reduce `statFeatureNum` clamp minimum**

72px at mobile is too large relative to `50+`. Drop minimum to 56px so it reads cleanly at 375px:
```css
.statFeatureNum {
  font-size: clamp(56px, 10vw, 128px);  /* was clamp(72px, ...) */
}
```

- [ ] **Step 2.4 — Reduce `ctaHeadline` mobile size**

At 375px, "Are you a Korean" at `clamp(40px, 5vw, 64px)` = 40px can overflow. Add per-element override in mobile breakpoint (Task 3 handles this in the responsive block).

- [ ] **Step 2.5 — Build and check**

```bash
npm run build
```
Expected: `✓ built` — no errors.

---

## Task 3 — Fix responsive breakpoints

**Files:**
- Modify: `src/pages/Experts.module.css`

- [ ] **Step 3.1 — Reduce `directoryLayout` gap from 96px → 48px**

`var(--sp-9)` = 96px is too large for a 2-column layout at 1280px max container. Change to `var(--sp-7)` = 48px:
```css
.directoryLayout {
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  gap: var(--sp-7);    /* was var(--sp-9) */
  align-items: start;
}
```

- [ ] **Step 3.2 — Add intermediate 900px breakpoint**

Between 1080px and 680px there's no breakpoint. Add one at 900px to handle tablet portrait (768px–1080px) edge cases:

```css
@media (max-width: 900px) {
  .profileGrid {
    grid-template-columns: 1fr;  /* 1 column on tablet portrait */
  }

  .collaborateFeature {
    min-height: 320px;
  }

  .collaborateFeatureBody {
    padding: var(--sp-5);
  }
}
```

- [ ] **Step 3.3 — Fix CTA headline mobile overflow**

Add inside the `max-width: 680px` block:
```css
@media (max-width: 680px) {
  /* existing rules ... */
  .ctaHeadline {
    font-size: clamp(28px, 7vw, 40px);  /* smaller clamp for narrow screens */
  }

  .statFeatureNum {
    font-size: clamp(52px, 13vw, 80px); /* at 375px = 52px, less overflow risk */
  }
}
```

- [ ] **Step 3.4 — Build and check**

```bash
npm run build
```
Expected: `✓ built` — no errors.

---

## Task 4 — Fix collaborate backdrop image

**Files:**
- Modify: `src/pages/Experts.module.css`
- Modify: `src/pages/Experts.tsx`

- [ ] **Step 4.1 — Strengthen image fill CSS**

Ensure the img is explicitly blocked and fills parent:
```css
.collaborateBackdropImg {
  display: block;              /* explicit — global img is block, but reinforce */
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;  /* show faces/action at top of frame */
  transition: transform 900ms var(--ease-out-expo);
}
```

- [ ] **Step 4.2 — Remove height HTML attribute from Img call**

The HTML `height={640}` attribute can confuse some browser layout engines when CSS says `height: 100%`. Remove it:

In `Experts.tsx`, find the collaborate Img and change:
```tsx
<Img
  src="news/news-kat-2025-elevating-korea-vietnam-medical-aesthetic-collaboration-inline-1-6841cdc8.jpg"
  alt=""
  className={s.collaborateBackdropImg}
  loading="lazy"
  sizes="(max-width: 900px) 100vw, 56vw"
  width={900}
  height={640}   {/* REMOVE this line */}
/>
```
After:
```tsx
<Img
  src="news/news-kat-2025-elevating-korea-vietnam-medical-aesthetic-collaboration-inline-1-6841cdc8.jpg"
  alt=""
  className={s.collaborateBackdropImg}
  loading="lazy"
  sizes="(max-width: 900px) 100vw, 56vw"
  width={900}
/>
```

- [ ] **Step 4.3 — Change from `loading="lazy"` to `loading="eager"` for above-fold or critical images**

The collaborate section is ~60% down the page. Keep lazy but ensure `sizes` is correct. No change needed here.

- [ ] **Step 4.4 — Build and check**

```bash
npm run build
```
Expected: `✓ built` — no errors.

---

## Task 5 — Fix excessive text in collaborate feature card

**Files:**
- Modify: `src/pages/Experts.tsx`

- [ ] **Step 5.1 — Shorten the fallback description text**

Current fallback in `collaborateFeatureBody`:
```
"Participate in intensive training programs and international workshops, sharing expertise with the next generation of practitioners."
```

This is 1 sentence (good length). The real issue may be that `localize()` returns the full `desc` text from the JSON which might be longer. Add CSS line-clamp as a visual guard:

```css
.collaborateFeatureBody p {
  color: var(--clr-mist);
  line-height: 1.75;
  font-size: var(--type-body);
  max-width: 400px;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

- [ ] **Step 5.2 — Add `max-width` guard to process card body text**

```css
.processCard p {
  color: var(--clr-stone);
  line-height: 1.72;
  font-size: var(--type-body);
  max-width: 56ch;   /* ADD: prevent very wide lines */
}
```

- [ ] **Step 5.3 — Build final**

```bash
npm run build
```
Expected: `✓ built in X.XXs` — no errors.

---

## Verification Checklist

After all tasks, manually check:
- [ ] No horizontal scroll at 375px, 768px, 1280px viewports
- [ ] Collaborate section shows the real photo behind the dark overlay
- [ ] Vetting process connector line is vertically centered through the circles
- [ ] CTA headline doesn't overflow at 375px
- [ ] Profile cards are 1 column at 900px and below
- [ ] Profile cards are 2 columns at 1080px+ (inside the sticky copy layout)
- [ ] Stats section collapses cleanly at ≤1080px
