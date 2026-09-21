# Responsive Style Guide

This documents the responsive system added to the portfolio so future edits
stay consistent. Read this before changing layout, type, or images.

## 1. What was broken before this pass

| Issue | Where | Fix |
|---|---|---|
| Hero portrait card was a **hard-coded 430px** box | `.hero-photo-card` | `width: min(430px, 100%)` — shrinks below 430px, never overflows |
| Hero photo itself was a **fixed 430×560px**, then jumped to a fixed 26rem square at 640px | `.hero-photo-card img` | `width:100%; height:auto; aspect-ratio: 3/4;` — one consistent shape at every size |
| Hero name/role/intro used **raw `px` font-sizes** that overrode an existing `clamp()` | `.hero-name`, `.hero-role`, `.hero-intro` | Real fluid type with `clamp(min, preferred, max)` |
| Two **conflicting media queries** for the hero grid (`max-width:1100px` stacked, `min-width:1024px` 2-column) fought each other between 1024–1100px | `.hero-grid-layout` | One mobile-first breakpoint at `1024px` |
| Hamburger button (`.nav-toggle`) had no guaranteed hit area | navbar | `min-height/min-width: 44px` + flex-centered icon |
| No `srcset`/`loading` on any `<img>` | whole page | Real responsive image sets + `loading="lazy"` below the fold |
| `overflow-x: hidden` on `<body>` was hiding overflow bugs instead of fixing them | `base.css` | Kept as a safety net, but the actual sources (above) were fixed |

## 2. Breakpoint scale

Mobile-first: base styles target the smallest screen, `min-width` media
queries layer on enhancements as the viewport grows. There's no
`max-width` query left in the hero (the one source of the old conflict).

```
320px   xs   Small phones (iPhone SE)
480px   sm   Large phones
640px   —    (legacy step already used across sections.css/components.css)
768px   md   Tablets (iPad portrait), also used as a nav-grid step
1024px  lg   Small laptops, iPad landscape — desktop nav & multi-column layouts kick in here
1200px  xl   Desktops
1400px  2xl  Large/wide desktops (1920×1080 and above) — container widens to 90rem
```

Most component grids (`.skills-grid`, `.cert-grid`, `.about-grid`, etc.)
already followed this mobile-first pattern (1 column → 2 → 3/4 at
640/768/1024px) and didn't need changes — only the hero section and a
handful of touch targets had the fixed-px bugs listed above.

## 3. Fluid typography

Where a heading needs to scale continuously instead of jumping between
fixed sizes at each breakpoint, we use `clamp(min, preferred, max)`:

```css
.hero-name {
  font-size: clamp(2.25rem, 1.55rem + 4vw, 4.5rem); /* 36px on a 375px phone → 72px on a 1440px+ desktop */
}
```

Reading a clamp: the first value is the floor, the last is the ceiling,
and the middle value is a `rem + vw` formula that interpolates between
them as the viewport changes — no breakpoint jump, no overflow.

**Rule:** never let a clamp's minimum go below `1rem` (16px) for
body/paragraph text — that's the accessibility floor requested for
mobile. Small meta labels (`.chip`, `.skill-pct`, `.cert-institute`,
etc. at 12–14px) are intentionally smaller — they're secondary/UI
labels, not primary reading text, which is normal practice.

## 4. Layout patterns used

- **CSS Grid** for card grids (`skills-grid`, `cert-grid`, `about-grid`,
  `why-grid`, `beyond-grid`, `internship-grid`) — column count increases
  at `min-width` steps.
- **Flexbox** for one-dimensional rows that need to wrap (`.hero-btns`,
  `.project-tags`, `.contact-cta-btns`, `.footer-grid`).
- **`min()` / `clamp()`** instead of fixed `px` anywhere content needs to
  shrink to fit a viewport (hero photo card, all hero typography).
- **`aspect-ratio`** instead of a fixed pixel height/width pair, so
  images keep their shape as they scale (`.hero-photo-card img`).

## 5. Images

Local images (hero photo + 4 certificates) now ship as three or four
pre-resized JPEGs under `images/responsive/` (480w / 800w / 1200w /
full-size, quality 78–80), wired up with `srcset` + `sizes` so the
browser downloads the smallest file that still looks sharp at its
actual rendered size — instead of a phone downloading the same
1600px-wide certificate photo as a 1920px desktop.

- **Hero photo** (`hari passport image.jpeg`): loads eagerly with
  `fetchpriority="high"` because it's the largest above-the-fold
  element (the LCP candidate) — it should *not* be lazy-loaded.
- **Certificate photos** and the **project screenshot**: `loading="lazy"`
  — they're below the fold, so the browser defers fetching them until
  the user is about to scroll to them.
- The remote Pexels project screenshot uses Pexels' own `?w=` resize
  parameter to build a 3-step `srcset` (600/900/1200) without needing a
  local copy.
- Every `<img>` has explicit `width`/`height` attributes (the image's
  real intrinsic pixel size) so the browser can reserve the correct
  aspect ratio before the image or CSS finishes loading — this
  prevents layout shift (CLS) as the page renders.

If you swap in a new photo, regenerate the responsive set the same way
(three widths + the original, JPEG quality ~80) and update the
`srcset` list.

## 6. Touch targets

Every tappable control has a **44×44px minimum hit area**
(`base.css`, "Touch-friendly baseline" section): the hamburger button,
mobile nav menu items, footer social icons, and every `.btn`. This is
enforced with `min-height`/`min-width` so it doesn't fight the
existing padding-based sizing — it just raises the floor.

## 7. Navigation

- Below `1024px`: hamburger menu (`.nav-toggle`) shows a full-width
  dropdown (`.nav-mobile`) with an animated max-height/opacity
  transition.
- The hamburger button now syncs `aria-expanded` / `aria-hidden` with
  its open state, closes on outside click, closes on <kbd>Esc</kbd>,
  and auto-closes if the window is resized/rotated past the desktop
  breakpoint while open (`js/script.js`).
- At `1024px`+: the full horizontal nav + CTA button show, hamburger is
  hidden.

## 8. Verified against

- Desktop: 1920×1080, 1440×900, 1366×768
- Tablet: 768–1024px (portrait & landscape)
- Mobile: 375px (iPhone SE/14), 360–412px (Android), down to 320px
- No horizontal scrollbar at any of the widths above (the hero card was
  the only real offender — see section 1).
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
  was already correct and needed no change — it doesn't block pinch-zoom
  (no `maximum-scale`/`user-scalable=no`), which matters for
  accessibility.
- `prefers-reduced-motion` is already respected in `animations.css` —
  unchanged.

## 9. If something looks broken on a new device

1. Open dev tools → responsive mode → check for a horizontal
   scrollbar. If there is one, search `sections.css` for a fixed `px`
   width/height on the element that's overflowing (this was the root
   cause of every bug fixed in this pass).
2. Prefer `%`, `rem`, `min()`, `clamp()`, or `aspect-ratio` over a raw
   `px` dimension on anything that isn't a small fixed-size icon.
3. Add new breakpoints as `min-width` queries only — mixing `min-width`
   and `max-width` queries on the same property is what caused the
   hero layout bug in section 1.
