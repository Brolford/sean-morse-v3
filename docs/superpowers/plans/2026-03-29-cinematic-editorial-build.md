# Sean Morse v3 — Cinematic Editorial Build

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Cinematic Editorial redesign of Sean Morse's portfolio as a new Astro site in ~/sean-morse-v3/, implementing the approved design spec at docs/superpowers/specs/2026-03-29-cinematic-editorial-redesign.md

**Architecture:** Astro 5.x static site with Tailwind CSS for utilities, CSS custom properties for design tokens, vanilla JS for scroll-triggered animations and interactive components. Data-driven project pages from a single JS data file. Deployed to Cloudflare Pages.

**Tech Stack:** Astro 5.x, Tailwind CSS 3.x, vanilla JavaScript, Google Fonts (Instrument Serif + Space Grotesk), Cloudflare Pages

**Source spec:** ~/sean-morse-rebuild/docs/superpowers/specs/2026-03-29-cinematic-editorial-redesign.md
**Source data:** ~/sean-morse-rebuild/src/data/projects.js (copy, add category + gridMode fields)
**Source content:** ~/sean-morse-rebuild/sean-morse-complete-content.md (Sean's copy, verbatim)

---

## File Structure

```
~/sean-morse-v3/
├── src/
│   ├── layouts/
│   │   └── Base.astro              # HTML shell, fonts, meta, View Transitions
│   ├── components/
│   │   ├── Nav.astro               # 3-state floating nav (frosted → pill → dark pill)
│   │   ├── Footer.astro            # Signature footer
│   │   ├── FeaturedScroll.astro    # Horizontal auto-scrolling featured projects
│   │   ├── BentoGrid.astro         # Category-filtered asymmetric project grid
│   │   ├── CategoryFilter.astro    # Filter pill tabs
│   │   ├── ProjectCard.astro       # Individual bento grid card with breathing
│   │   ├── BrandsGrid.astro        # 5-col brand names grid
│   │   ├── Accolade.astro          # Stat + context interstitial
│   │   ├── CTASection.astro        # Dark CTA with gold button
│   │   ├── ContactPanel.astro      # Slide-up contact form
│   │   ├── HeroSection.astro       # Asymmetric hero with stacked images
│   │   ├── ProjectCollage.astro    # Image layouts for case studies (from v2)
│   │   ├── Accordion.astro         # Problem/Solution/Results (from v2)
│   │   ├── AwardsBar.astro         # Impact metrics for case studies (from v2)
│   │   └── ImageGallery.astro      # 2-col masonry gallery (from v2)
│   ├── pages/
│   │   ├── index.astro             # Homepage
│   │   ├── work.astro              # Work/archive page
│   │   ├── about.astro             # About page
│   │   └── work/
│   │       └── [slug].astro        # Dynamic case study pages
│   ├── data/
│   │   └── projects.js             # Project data (copied from v2, extended)
│   ├── styles/
│   │   └── global.css              # Design tokens, surfaces, animations, base styles
│   └── content/
│       └── copy.js                 # Sean's copy organized by page (from content ref)
├── public/
│   ├── scripts/
│   │   ├── animations.js           # Scroll reveals, stagger, breathing, count-up
│   │   ├── nav.js                  # Nav morph + context-aware theme switching
│   │   ├── featured-scroll.js      # Auto-advance horizontal scroll
│   │   └── category-filter.js      # Bento grid filtering
│   └── fonts/                      # (if self-hosting later)
├── tailwind.config.cjs
├── astro.config.mjs
└── package.json
```

---

### Task 1: Project Scaffolding

**Files:**
- Create: `~/sean-morse-v3/package.json`
- Create: `~/sean-morse-v3/astro.config.mjs`
- Create: `~/sean-morse-v3/tailwind.config.cjs`
- Create: `~/sean-morse-v3/.gitignore`

- [ ] **Step 1: Create Astro project**

```bash
mkdir -p ~/sean-morse-v3 && cd ~/sean-morse-v3
npm create astro@latest . -- --template minimal --no-git --no-install
npm install @astrojs/tailwind@^6 @astrojs/sitemap tailwindcss@^3
```

- [ ] **Step 2: Configure Astro**

`astro.config.mjs`:
```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sean-morse-v3.pages.dev',
  integrations: [tailwind(), sitemap()],
});
```

- [ ] **Step 3: Configure Tailwind**

`tailwind.config.cjs` — minimal config, all design tokens in CSS custom properties:
```javascript
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: { extend: {} },
  plugins: [],
};
```

- [ ] **Step 4: Init git and verify build**

```bash
cd ~/sean-morse-v3 && git init && git add -A && git commit -m "chore: scaffold Astro project"
npm run build
```

---

### Task 2: Design System (global.css)

**Files:**
- Create: `~/sean-morse-v3/src/styles/global.css`

- [ ] **Step 1: Write complete design token system**

All CSS custom properties from the spec: surfaces (light + dark), text hierarchy, accents, typography scale, spacing, radius, easing curves, duration scale. Plus base reset, surface treatments (grain, washes), and animation classes.

- [ ] **Step 2: Verify tokens render**

Create a temporary test page that displays all token values. Verify in browser.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css && git commit -m "feat: design system — tokens, surfaces, typography, motion"
```

---

### Task 3: Base Layout + Fonts

**Files:**
- Create: `~/sean-morse-v3/src/layouts/Base.astro`

- [ ] **Step 1: Write Base layout**

HTML shell with: Google Fonts preconnect + link (Instrument Serif 400/italic, Space Grotesk 300-700), global.css import, View Transitions, skip-to-content link, meta viewport, OG tags template, slot for page content.

- [ ] **Step 2: Verify fonts load**

Run dev server, check Network tab for font loading. Verify Instrument Serif renders in serif, Space Grotesk in sans.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/ && git commit -m "feat: base layout with fonts and View Transitions"
```

---

### Task 4: Project Data

**Files:**
- Create: `~/sean-morse-v3/src/data/projects.js`

- [ ] **Step 1: Copy projects.js from v2 and extend**

Copy from `~/sean-morse-rebuild/src/data/projects.js`. Add `category` field (Packaging | Brand Identity | Art Direction | Strategy | Co-Founder) and `gridMode` field (bento | fullBleed | tightGrid) to each project. Add `featured` boolean for horizontal scroll inclusion.

- [ ] **Step 2: Commit**

```bash
git add src/data/ && git commit -m "feat: project data with categories and grid modes"
```

---

### Task 5: Navigation (3-State)

**Files:**
- Create: `~/sean-morse-v3/src/components/Nav.astro`
- Create: `~/sean-morse-v3/public/scripts/nav.js`

- [ ] **Step 1: Build Nav component**

Three states from spec:
- Default: full-width, frosted float (35% opacity, 20px blur, 14px radius, 16px inset)
- Scrolled light: centered pill (100px radius, max-width 480px, logo → "SM")
- Scrolled dark: inverted pill (dark bg, cream text, gold accent)

HTML structure with data attributes for theme switching. CSS for all three states with transitions.

- [ ] **Step 2: Write nav.js**

Scroll listener (passive) for pill morph at 100px. IntersectionObserver for section theme detection (`data-nav-theme`). Class swaps with 500ms spring transition (shape) + 300ms smooth (color).

- [ ] **Step 3: Verify all three states**

Test: scroll past 100px → pill. Scroll over dark section → dark pill. Back to light → light pill.

- [ ] **Step 4: Commit**

```bash
git add src/components/Nav.astro public/scripts/nav.js && git commit -m "feat: 3-state context-aware floating nav"
```

---

### Task 6: Footer

**Files:**
- Create: `~/sean-morse-v3/src/components/Footer.astro`

- [ ] **Step 1: Build signature footer**

Void bg (#0C0C0B), 2-col grid. Left: name (Instrument Serif 22px), italic tagline, social links with gold hover. Right: copyright. 1px top border.

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro && git commit -m "feat: signature footer"
```

---

### Task 7: Hero Section

**Files:**
- Create: `~/sean-morse-v3/src/components/HeroSection.astro`

- [ ] **Step 1: Build hero**

Asymmetric layout: content left 46% (protected text zone), images right 58% (4 stacked cards with gradient mask). Frosted nav sits over top. Film grain + radial wash on surface. Sean's actual headline copy from content reference. Image cards use project gradient fallbacks with rotation, z-indexing, and hover straighten.

- [ ] **Step 2: Verify text readability**

Confirm gradient mask prevents image overlap with text zone at all viewport widths.

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroSection.astro && git commit -m "feat: asymmetric hero with stacked project images"
```

---

### Task 8: Featured Horizontal Scroll

**Files:**
- Create: `~/sean-morse-v3/src/components/FeaturedScroll.astro`
- Create: `~/sean-morse-v3/public/scripts/featured-scroll.js`

- [ ] **Step 1: Build FeaturedScroll component**

Dark bg section. Horizontal scroll track with scroll-snap. Cards: 240×320px desktop, 85vw mobile. Project name (Instrument Serif), category, year. Gradient overlay for text legibility.

- [ ] **Step 2: Write auto-advance JS**

6s per card auto-scroll. Pause on hover. Resume after 2s hover-out. Disabled on mobile. Respects prefers-reduced-motion.

- [ ] **Step 3: Commit**

```bash
git add src/components/FeaturedScroll.astro public/scripts/featured-scroll.js && git commit -m "feat: featured horizontal scroll with auto-advance"
```

---

### Task 9: Category Filter + Bento Grid

**Files:**
- Create: `~/sean-morse-v3/src/components/CategoryFilter.astro`
- Create: `~/sean-morse-v3/src/components/BentoGrid.astro`
- Create: `~/sean-morse-v3/src/components/ProjectCard.astro`
- Create: `~/sean-morse-v3/public/scripts/category-filter.js`

- [ ] **Step 1: Build CategoryFilter pills**

Pill-shaped tabs: All | Packaging | Brand Identity | Art Direction | Strategy. Active: bronze wash + bronze border + gold text. Inactive: stone border, muted text.

- [ ] **Step 2: Build BentoGrid**

12-col CSS Grid. Row 1: 7+5 span. Row 2: 4+4+4. Projects rendered from data with category tags.

- [ ] **Step 3: Build ProjectCard**

Gradient/image bg, bottom gradient overlay, category label + project name. Hover: scale(1.015). Breathing animation (3s loop, 1.5% scale).

- [ ] **Step 4: Write filter JS**

Click handler on pills. Filter grid items by data-category. Fade out (200ms) → reflow → fade in (400ms, staggered 60ms).

- [ ] **Step 5: Commit**

```bash
git add src/components/CategoryFilter.astro src/components/BentoGrid.astro src/components/ProjectCard.astro public/scripts/category-filter.js && git commit -m "feat: category filter + bento grid with breathing cards"
```

---

### Task 10: Accolade, Brands Grid, CTA, Contact

**Files:**
- Create: `~/sean-morse-v3/src/components/Accolade.astro`
- Create: `~/sean-morse-v3/src/components/BrandsGrid.astro`
- Create: `~/sean-morse-v3/src/components/CTASection.astro`
- Create: `~/sean-morse-v3/src/components/ContactPanel.astro`

- [ ] **Step 1: Build Accolade interstitial**

2-col grid: stat (Instrument Serif 64px gold, text-shadow glow) + context (label + description). Dark bg with radial bronze glow. Count-up animation triggered by scroll.

- [ ] **Step 2: Build BrandsGrid**

5-col grid, 1px gap dividers, dark bg. Brand names in Space Grotesk uppercase. Hover → gold. 3-col on mobile.

- [ ] **Step 3: Build CTASection**

Dark bg, radial bronze glow. Instrument Serif headline with italic em in gold. Gold pill button with hover lift + glow shadow.

- [ ] **Step 4: Build ContactPanel**

Slide-up panel (not modal). Instrument Serif title, visible labels, border-bottom inputs, inline validation, dark pill submit button. Formspree integration.

- [ ] **Step 5: Commit**

```bash
git add src/components/Accolade.astro src/components/BrandsGrid.astro src/components/CTASection.astro src/components/ContactPanel.astro && git commit -m "feat: accolade, brands grid, CTA, contact panel"
```

---

### Task 11: Homepage Assembly

**Files:**
- Create: `~/sean-morse-v3/src/pages/index.astro`

- [ ] **Step 1: Assemble homepage**

Import all components. Flow: Nav → Hero → FeaturedScroll → BentoGrid → Accolade ($320M+) → BrandsGrid → CTASection → Footer. Each section has `data-nav-theme="light"` or `"dark"`.

- [ ] **Step 2: Verify full page flow**

Check section rhythm (light→dark→light→dark→dark→dark→void). Verify nav theme switching works across all sections.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro && git commit -m "feat: homepage assembly with full section flow"
```

---

### Task 12: Animation System

**Files:**
- Create: `~/sean-morse-v3/public/scripts/animations.js`

- [ ] **Step 1: Write scroll reveal system**

IntersectionObserver at 15% threshold. `.animate-reveal`: translateY(24px) → 0, opacity 0 → 1, 400ms spring. `.animate-entrance`: blur(8px) + translateY(20px) + scale(0.96) → clear, 600ms spring. Stagger: 60ms/item via data-delay. One-shot (disconnect after trigger). Reduced-motion: opacity-only at 200ms.

- [ ] **Step 2: Write count-up**

Scroll-triggered number animation for accolade stats. 600ms easeOutExpo. Prefix/suffix static.

- [ ] **Step 3: Write astro:page-load handlers**

Wrap all init functions. Re-initialize on View Transition navigation.

- [ ] **Step 4: Commit**

```bash
git add public/scripts/animations.js && git commit -m "feat: animation system — reveals, entrances, stagger, count-up"
```

---

### Task 13: Work Page

**Files:**
- Create: `~/sean-morse-v3/src/pages/work.astro`

- [ ] **Step 1: Build work page**

Featured horizontal scroll (top section, dark). Category filter + full project grid below (light). Uses same components as homepage but with all projects shown.

- [ ] **Step 2: Commit**

```bash
git add src/pages/work.astro && git commit -m "feat: work page with featured scroll + archive grid"
```

---

### Task 14: About Page

**Files:**
- Create: `~/sean-morse-v3/src/pages/about.astro`

- [ ] **Step 1: Build about page**

Editorial layout. Sean's bio copy verbatim. Large profile photo. Stats as typographic moments (Instrument Serif, large). Accent quote block with bronze left border. Max-width 680px centered.

- [ ] **Step 2: Commit**

```bash
git add src/pages/about.astro && git commit -m "feat: about page — editorial layout"
```

---

### Task 15: Case Study Template

**Files:**
- Create: `~/sean-morse-v3/src/pages/work/[slug].astro`
- Copy+adapt: `ProjectCollage.astro`, `Accordion.astro`, `AwardsBar.astro`, `ImageGallery.astro` from v2

- [ ] **Step 1: Copy case study components from v2**

Adapt ProjectCollage, Accordion, AwardsBar, ImageGallery from ~/sean-morse-rebuild/src/components/. Restyle with new design tokens (Instrument Serif headings, Space Grotesk body, new color tokens).

- [ ] **Step 2: Build [slug].astro template**

getStaticPaths from projects.js. Full-bleed hero image. 2-col layout (story + sidebar). Accordion for problem/solution/results. Awards bar. Image gallery. Next/prev project navigation.

- [ ] **Step 3: Commit**

```bash
git add src/pages/work/ src/components/ProjectCollage.astro src/components/Accordion.astro src/components/AwardsBar.astro src/components/ImageGallery.astro && git commit -m "feat: case study template with adapted v2 components"
```

---

### Task 16: Accessibility + Performance Pass

- [ ] **Step 1: Accessibility audit**

Add visible focus rings (bronze outline), verify heading hierarchy, verify all images have alt text, verify touch targets ≥ 44px, verify skip-to-content link, verify prefers-reduced-motion fallbacks on every animation.

- [ ] **Step 2: Performance**

Add explicit width/height to all images. Verify lazy loading on below-fold. Preload fonts. Run Lighthouse — target ≥ 90 perf, 100 a11y.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "fix: accessibility + performance pass"
```

---

### Task 17: Deploy Preview

- [ ] **Step 1: Create GitHub repo**

```bash
cd ~/sean-morse-v3
gh repo create Brolford/sean-morse-v3 --public --source=. --push
```

- [ ] **Step 2: Set up Cloudflare Pages**

Connect repo to Cloudflare Pages for auto-deploy. Preview URL for critique session.

- [ ] **Step 3: Verify live**

Check deployed site at preview URL. Test nav, scroll, mobile.
