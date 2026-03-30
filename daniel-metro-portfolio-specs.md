# 🎨 Daniel Metro Portfolio - Technical Specifications

> Quick reference for development

---

## Color System

### Brand Colors
```css
/* Primary Metro Line Colors */
--color-pink: #FF78C5;      /* Profile Line */
--color-purple: #B996F0;    /* Projects Line */
--color-blue: #84E9FF;      /* Thinking Line */

/* Background & Surface */
--color-bg-primary: #0A0A0B;
--color-bg-secondary: #141416;
--color-bg-elevated: #1C1C1F;

/* Text */
--color-text-primary: #FFFFFF;
--color-text-secondary: #A1A1AA;
--color-text-muted: #71717A;

/* Borders */
--color-border: #27272A;
--color-border-hover: #3F3F46;

/* States */
--color-focus-ring: #FF78C5;
--color-overlay: rgba(0, 0, 0, 0.6);
```

### Tailwind Config Colors
```typescript
// tailwind.config.ts
const config = {
  theme: {
    extend: {
      colors: {
        pink: {
          DEFAULT: '#FF78C5',
          light: '#FFB3DB',
          dark: '#CC5F9E',
        },
        purple: {
          DEFAULT: '#B996F0',
          light: '#D4BFF7',
          dark: '#9478C0',
        },
        cyan: {
          DEFAULT: '#84E9FF',
          light: '#B3F1FF',
          dark: '#6ABACC',
        },
        surface: {
          DEFAULT: '#0A0A0B',
          secondary: '#141416',
          elevated: '#1C1C1F',
        },
      },
    },
  },
};
```

---

## Typography

### Font Stack
```css
/* Headings */
font-family: 'Montserrat', system-ui, sans-serif;
font-weight: 700;

/* Body */
font-family: 'Open Sans', system-ui, sans-serif;
font-weight: 400;

/* Accessibility - Dyslexia */
font-family: 'OpenDyslexic', system-ui, sans-serif;
```

### Type Scale
```css
/* Headings */
--text-h1: 3rem;      /* 48px */
--text-h2: 2.25rem;   /* 36px */
--text-h3: 1.5rem;    /* 24px */
--text-h4: 1.25rem;   /* 20px */

/* Body */
--text-lg: 1.125rem;  /* 18px */
--text-base: 1rem;    /* 16px */
--text-sm: 0.875rem;  /* 14px */
--text-xs: 0.75rem;   /* 12px */

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

---

## Metro Map Stop Coordinates

### Desktop (1920 × 1080 viewport)

```typescript
// src/data/stops.ts

export const desktopStopCoordinates: Record<StopId, { x: number; y: number }> = {
  // ===================
  // SHARED HUB
  // ===================
  'home': { x: 1439, y: 544 },              // CENTER HUB (all 3 lines)

  // ===================
  // PROFILE LINE (Pink)
  // Route: About Me → How I Work → Home → Podcast → What I Do → Contact
  // ===================
  'about-me': { x: 1710, y: 274 },          // Top right
  'how-i-work': { x: 1514, y: 368 },        // Upper middle
  'podcast': { x: 1184, y: 532 },           // Behave & Design Podcast (shared with Projects)
  'what-i-do': { x: 1077, y: 767 },         // Lower left
  'contact': { x: 932, y: 904 },            // Bottom left

  // ====================
  // PROJECTS LINE (Purple)
  // Route: Meeting Experience → Workshops → Podcast → Product Offering → Home → IT Key Roles → Experiments
  // ====================
  'meeting-experience': { x: 1430, y: 185 }, // E2E Meeting Experience - Top
  'workshops': { x: 1230, y: 301 },          // Shared with Thinking line
  'product-offering': { x: 1302, y: 746 },   // E2E IT Product Offering - Lower middle
  'it-key-roles': { x: 1676, y: 590 },       // E2E IT Key Roles - Right side
  'experiments': { x: 1691, y: 914 },        // Shared with Thinking - Bottom right

  // ====================
  // THINKING LINE (Blue)
  // Route: Articles → Workshops → Home → Reading → Experiments
  // ====================
  'articles': { x: 1013, y: 268 },           // Top left
  'reading': { x: 1479, y: 772 },            // Below Home, right side
  // 'workshops' - coordinates defined above (shared)
  // 'experiments' - coordinates defined above (shared)
};

// Stop metadata
export const stopMeta: Record<StopId, { 
  name: string; 
  lines: LineId[]; 
  contentType: ContentType 
}> = {
  'home': {
    name: 'Home',
    lines: ['profile', 'projects', 'thinking'],
    contentType: 'page',
  },
  'about-me': {
    name: 'About Me',
    lines: ['profile'],
    contentType: 'page',
  },
  'how-i-work': {
    name: 'How I Work',
    lines: ['profile'],
    contentType: 'page',
  },
  'what-i-do': {
    name: 'What I Do',
    lines: ['profile'],
    contentType: 'page',
  },
  'contact': {
    name: 'Contact',
    lines: ['profile'],
    contentType: 'page',
  },
  'workshops': {
    name: 'Workshops',
    lines: ['projects', 'thinking'],
    contentType: 'portfolio',
  },
  'meeting-experience': {
    name: 'E2E Meeting Experience',
    lines: ['projects'],
    contentType: 'project',
  },
  'podcast': {
    name: 'Behave & Design Podcast',
    lines: ['projects', 'profile'],
    contentType: 'page',
  },
  'product-offering': {
    name: 'E2E IT Product Offering',
    lines: ['projects'],
    contentType: 'project',
  },
  'it-key-roles': {
    name: 'E2E IT Key Roles',
    lines: ['projects'],
    contentType: 'project',
  },
  'experiments': {
    name: 'Experiments',
    lines: ['projects', 'thinking'],
    contentType: 'portfolio',
  },
  'articles': {
    name: 'Articles',
    lines: ['thinking'],
    contentType: 'grid',
  },
  'reading': {
    name: 'Reading',
    lines: ['thinking'],
    contentType: 'list',
  },
};
```

### Mobile (360 × 800 viewport - scaled)

```typescript
// Mobile coordinates should be recalculated
// Based on a smaller viewport with the map taking ~70% of screen width

export const mobileStopCoordinates: Record<StopId, { x: number; y: number }> = {
  // Scale factor: 360/1920 ≈ 0.1875 for X
  // Offset and adjust for mobile-friendly spacing
  
  'home': { x: 180, y: 200 },
  'about-me': { x: 120, y: 180 },
  'how-i-work': { x: 150, y: 130 },
  // ... calculate others based on layout
};
```

---

## Line Path Definitions

### SVG Path Data

```typescript
// src/data/metro-paths.ts

// Profile Line (Pink #FF78C5)
// Route: About Me → How I Work → Home → Podcast → What I Do → Contact
export const profileLinePath = `
  M 1710 274
  Q 1612 321, 1514 368
  Q 1476 456, 1439 544
  Q 1311 538, 1184 532
  Q 1130 649, 1077 767
  Q 1004 835, 932 904
`;

// Projects Line (Purple #B996F0)
// Route: Meeting Experience → Workshops → Podcast → Product Offering → Home → IT Key Roles → Experiments
export const projectsLinePath = `
  M 1430 185
  Q 1330 243, 1230 301
  Q 1207 416, 1184 532
  Q 1243 639, 1302 746
  M 1184 532
  Q 1311 538, 1439 544
  Q 1557 567, 1676 590
  Q 1683 752, 1691 914
`;

// Thinking Line (Blue #84E9FF)
// Route: Articles → Workshops → Home → Reading → Experiments
export const thinkingLinePath = `
  M 1013 268
  Q 1121 284, 1230 301
  Q 1334 422, 1439 544
  Q 1459 658, 1479 772
  M 1439 544
  Q 1565 729, 1691 914
`;
```

---

## Responsive Breakpoints

```typescript
// Design system breakpoints

const breakpoints = {
  sm: '640px',   // Large phones
  md: '768px',   // Tablets
  lg: '1024px',  // Small laptops
  xl: '1280px',  // Desktops  
  '2xl': '1536px', // Large desktops
  '3xl': '1920px', // Full HD (design baseline)
};

// Layout behavior at each breakpoint
const layouts = {
  'sm': 'single-column, stacked, bottom-nav',
  'md': 'single-column, larger-map, bottom-nav',
  'lg': 'split-screen-begins, 40/60',
  'xl': 'full-split-screen, enhanced-interactions',
  '2xl': 'design-baseline, all-features',
};
```

---

## Spacing System

```css
/* Based on 4px grid */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

---

## Animation Tokens

```css
/* Durations */
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--duration-pulse: 2000ms;

/* Easings */
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

/* Electric pulse animation */
@keyframes electric-pulse {
  0% {
    stroke-dashoffset: 100%;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    stroke-dashoffset: 0%;
    opacity: 0;
  }
}
```

---

## Accessibility Tokens

```css
/* Focus ring */
--focus-ring-width: 2px;
--focus-ring-offset: 2px;
--focus-ring-color: var(--color-pink);

/* Minimum touch target */
--touch-target-min: 44px;

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast mode */
.high-contrast {
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #E0E0E0;
  --color-bg-primary: #000000;
  --color-border: #FFFFFF;
}
```

---

## Z-Index Scale

```css
--z-base: 0;
--z-dropdown: 10;
--z-sticky: 20;
--z-modal-backdrop: 40;
--z-modal: 50;
--z-popover: 60;
--z-tooltip: 70;
--z-toast: 80;
--z-accessibility-panel: 90;
--z-reading-guide: 100;
```

---

## Component Size Reference

| Component | Desktop | Mobile |
|-----------|---------|--------|
| Stop dot radius | 8px | 12px (larger touch) |
| Stop glow radius | 20px | 24px |
| Modal width | 600px | 100% |
| Bottom nav height | - | 64px |
| Header height | 72px | 56px |
| Line stroke width | 4px | 3px |
| Focus ring | 2px | 3px |

---

## Content Types

```typescript
type ContentType = 
  | 'page'      // Static content (About, Contact)
  | 'project'   // Case study format
  | 'portfolio' // Grid of items (Workshops, Experiments)
  | 'grid'      // Card grid (Articles)
  | 'list'      // Vertical list (Reading)
  | 'embed';    // External embed (Podcast)
```

---

## File Naming Conventions

```
Components: PascalCase.tsx (MetroMap.tsx)
Hooks: camelCase with 'use' prefix (useMetroMap.ts)
Utils: camelCase.ts (formatDate.ts)
Types: camelCase.ts (metro.ts)
Data: kebab-case.ts (metro-lines.ts)
Styles: component.module.css or globals.css
Images: kebab-case.webp (city-map-bg.webp)
```

---

## Git Commit Convention

```
type(scope): description

Types:
- feat: new feature
- fix: bug fix
- style: styling changes
- refactor: code restructure
- docs: documentation
- chore: maintenance
- a11y: accessibility
- perf: performance

Examples:
feat(metro): add electric pulse animation
fix(modal): close on escape key
a11y(stops): add ARIA labels
perf(images): convert to WebP format
```

---

## Quick Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build
npm run start           # Start production server
npm run lint            # Run ESLint
npm run type-check      # TypeScript check

# Testing
npm run lighthouse      # Run Lighthouse audit
npm run a11y            # Run accessibility tests

# Deployment
npm run deploy          # Deploy to Vercel
```

---

## Environment Variables

```bash
# .env.local

# Analytics (optional)
NEXT_PUBLIC_ANALYTICS_ID=

# Contact form (if using)
CONTACT_EMAIL=hello.daniel@irala.studio

# Feature flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_EXPERIMENTS=true
```

---

## Browser Support

```
Chrome: last 2 versions
Firefox: last 2 versions  
Safari: last 2 versions
Edge: last 2 versions
iOS Safari: last 2 versions
Android Chrome: last 2 versions
```

**Progressive Enhancement:**
- Core content works without JS
- Animations gracefully degrade
- Touch events have mouse fallbacks

---

## Performance Budgets

| Metric | Budget | Critical |
|--------|--------|----------|
| Total JS | <200KB | <150KB |
| Total CSS | <50KB | <30KB |
| Largest image | <200KB | <100KB |
| Font files | <100KB | <50KB |
| FCP | <1.5s | <1s |
| LCP | <2.5s | <2s |
| TBT | <200ms | <100ms |
| CLS | <0.1 | 0 |

---

## Quick Links

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Vercel Deployment](https://vercel.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [OpenDyslexic Font](https://opendyslexic.org/)