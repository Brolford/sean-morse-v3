# Trophy Case — Editorial Ledger

**Date:** 2026-03-29
**Component:** TrophyCase.astro (replaces AccomplishmentGallery + ImpactMetrics)
**Location:** Homepage, between Hero and Featured Scroll

---

## Purpose

Pure credibility section. "Here's why you should hire him." Shows Sean's most impressive project outcomes — the stats that make a prospect stop scrolling. No images (the work sections handle that). The numbers are the visual.

## Layout

**Editorial Ledger** — 2x3 grid (2 columns, 3 rows) with hairline dividers on dark charcoal. Centered within max-width container. Each cell contains: stat, label, project attribution.

## The 6 Stats

| Position | Stat | Label | Attribution |
|----------|------|-------|-------------|
| Row 1, Col 1 | #1 | Dieline Award — Dairy | Alec's Ice Cream |
| Row 1, Col 2 | $320M+ | Revenue Influenced | Liquid I.V. |
| Row 2, Col 1 | 7x | Distribution Growth | Alec's Ice Cream |
| Row 2, Col 2 | Acquired | By Unilever | Liquid I.V. |
| Row 3, Col 1 | NEXTY | Finalist x2 | Alec's Ice Cream |
| Row 3, Col 2 | Whole Foods | National Placement | Alec's Ice Cream |

## Visual Specification

### Surface
- Background: `--surface-charcoal` (#121210)
- Radial bronze glow at 5% opacity behind grid center
- Section overline: "Recognition" — centered, `text-label` class, `--accent-gold`
- `data-nav-theme="dark"` for nav color swap

### Per-Cell Typography
- **Stat:** Instrument Serif, `clamp(32px, 4vw, 48px)`, `--accent-gold` (#D4A574), line-height 1
- **Label:** Space Grotesk 11px, uppercase, 2px letter-spacing, color `#7D5F40` (darkened bronze, passes 4.5:1 on charcoal)
- **Attribution:** Space Grotesk 11px, `--text-fog` (#B5AFA5)

### Grid Structure
- CSS Grid: `grid-template-columns: 1fr 1fr`
- Hairline dividers: 1px `rgba(255,255,255,0.06)` — both vertical (between columns) and horizontal (between rows)
- Cell padding: `--space-5` (32px) vertical, `--space-4` (24px) horizontal
- Text alignment: centered within each cell
- Max-width: 800px, centered with `margin: 0 auto`

### Section Spacing
- Padding: `var(--space-section)` top and bottom (clamp 48px–96px)
- Overline margin-bottom: `--space-6` (48px)

## Animation

- Numeric stats ($320M+, 7x): count-up on scroll via existing `animations.js` `[data-count-to]` system
- Non-numeric stats (#1, Acquired, NEXTY, Whole Foods): standard `animate-reveal` with `animate-stagger` (60ms delays)
- All 6 cells use stagger: data-delay 1–6

## Responsive

- **Tablet (<=768px):** 2x3 grid maintained, cells get narrower, stat font scales down via clamp
- **Mobile (<=480px):** Stack to 1 column. Cells full-width. Horizontal dividers only. Vertical divider removed.

## Accessibility

- Section: `aria-label="Career recognition and impact"`
- Stat contrast: gold on charcoal = 7.2:1 (passes AAA)
- Label contrast: darkened bronze on charcoal — verify >= 4.5:1
- Attribution contrast: fog on charcoal = 5.8:1 (passes AA)
- Count-up respects `prefers-reduced-motion` (shows final value instantly)

## What Changes on Homepage

1. **Remove** `AccomplishmentGallery` import and component from index.astro
2. **Remove** `ImpactMetrics` import and component from index.astro
3. **Add** `TrophyCase` import between HeroSection and FeaturedScroll
4. **Delete** `AccomplishmentGallery.astro` file (no longer used)
5. **Delete** `ImpactMetrics.astro` file (no longer used)

### New Homepage Flow
Hero → **Trophy Case** → Featured Scroll → Bento Grid → Brands Grid → CTA → Footer

## Also Fix: Featured Scroll

While touching the homepage, fix the Featured Scroll issues:
- Cards too narrow: change `flex: 0 0 min(320px, 40vw)` to `flex: 0 0 min(420px, 75vw)` for larger, more impactful cards
- Section should be full-width (no side padding on the track — cards bleed to edges)
- Verify auto-rotation script is working (6s advance, pause on hover, loop)
