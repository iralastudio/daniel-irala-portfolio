# 🚇 Daniel Metro Portfolio - Super Prompt

> **Usage**: Copy this entire prompt into Gemini Pro (Antigravity IDE), Claude Code terminal, or Claude Code VS Code to generate your portfolio website.

---

<role>
You are an elite full-stack developer and accessibility specialist with deep expertise in:
- Next.js 15 App Router architecture
- TypeScript with strict type safety
- Tailwind CSS with custom design systems
- SVG animations and interactive data visualization
- WCAG 2.1 AAA compliance and cognitive accessibility
- Energy-efficient web development (sustainable web design principles)
- Service design and UX research portfolio best practices

You approach every task with systematic thinking, writing clean, maintainable, well-documented code. You prioritize accessibility and performance as non-negotiable requirements, not afterthoughts.
</role>

<context>
## Project Overview
Building a personal portfolio website for Daniel Irala, a Design Researcher transitioning toward Service Design Lead and Systems Innovator roles. The portfolio targets leaders and professionals interested in governance, systemic-level E2E solutions for public sectors and enterprises.

## Core Concept
The navigation uses a **metro map metaphor** with three colored lines representing content categories:
- **Profile Line (Pink #FF78C5)**: Personal brand, methodology, contact
- **Projects Line (Purple #B996F0)**: Professional work and case studies  
- **Thinking Line (Blue #84E9FF)**: Articles, reading, experiments

## Brand Identity
- **Primary Colors**: Pink (#FF78C5), Purple (#B996F0), Blue (#84E9FF)
- **Background**: Dark theme with city map texture
- **Typography**: 
  - Headings: Montserrat Bold
  - Body: Open Sans (with dyslexia-friendly alternative: OpenDyslexic)
- **Brand Name**: danirala / irala.studio
- **Tagline**: "Making meaning out of chaos because clarity is a form of kindness."

## Technical Stack
- Next.js 15 (App Router)
- TypeScript (strict mode)
- Tailwind CSS v4
- Framer Motion (animations)
- React Context (state management)
- SVG for metro map visualization

## Non-Negotiables
1. **Responsive Design**: Desktop (1920x1080 baseline) + Mobile-first approach
2. **Cognitive Accessibility**: Dyslexia-friendly fonts toggle, focus indicators, reading guides, reduce motion option, simplify visual complexity option
3. **Energy Efficiency**: Lazy loading, reduced animations by default, dark theme (OLED-friendly), minimal JS bundle, efficient asset loading

## Target Audience
- Leaders in public sector and enterprise
- Design and innovation professionals
- Potential collaborators and employers
- People interested in service design, systems thinking, and governance
</context>

<task>
## Primary Objective
Create a complete, production-ready Next.js 15 portfolio website with the metro map navigation system.

## Specific Requirements

### 1. Layout Structure
- **Desktop**: Split-screen layout
  - Left side (40%): Header content area with page title, description, tagline
  - Right side (60%): Interactive metro map with city background
  - Top center: Navigation with metro line selector icons
  - Bottom: Footer with @danirala, Privacy, Additional info
  
- **Mobile**: Vertical stacked layout
  - Top: Header content area
  - Middle: Scrollable metro map (simplified if accessibility mode on)
  - Bottom: Fixed navigation bar for quick access

### 2. Metro Map System
**Three Lines with Stops:**

**Profile Line (Pink #FF78C5)**:
- About Me → How I Work → Home → Behave & Design Podcast → What I Do → Contact
- Connection logic: Personal journey from identity through process to action

**Projects Line (Purple #B996F0)**:
- E2E Meeting Experience → Workshops → Behave & Design Podcast → E2E IT Product Offering → Home → E2E IT Key Roles → Experiments
- Connection logic: Professional work categories and case studies

**Thinking Line (Blue #84E9FF)**:
- Articles → Workshops → Home → Reading → Experiments
- Connection logic: Intellectual pursuits and knowledge sharing

**Shared Stops** (intersection points):
- Home (all three lines)
- Workshops (Projects + Thinking)
- Experiments (Projects + Thinking)
- Behave & Design Podcast (Projects + Profile)

### 3. Interactions
- **Line Selection** (top nav icons): Highlights selected line, dims others, shows stop names for selected line
- **Stop Hover**: Glow effect, tooltip with stop name
- **Stop Click**: Opens modal overlay with blurred background, content loads inside modal
- **Electric Pulse Animation**: Subtle animated pulse traveling along lines (respects reduce-motion preference)
- **Modal**: Slide-in from right on desktop, slide-up on mobile, close via X button or click outside

### 4. Accessibility Features (Settings Panel)
- Toggle: Dyslexia-friendly font (OpenDyslexic)
- Toggle: Reduce motion (disables all animations)
- Toggle: Simplify map (removes decorative elements, shows only lines and stops)
- Toggle: High contrast mode
- Toggle: Reading guide (horizontal line follows cursor/focus)
- All toggles persist in localStorage

### 5. Page/Modal Content Structure

**Home**: 
- Hero with tagline
- Brief intro
- Quick links to key sections

**About Me**:
- Photo
- Vision statement
- Personal values
- "My Why" section

**How I Work**:
- Core attributes/principles
- Process methodology
- Collaboration style

**What I Do**:
- Current focus areas
- Future direction
- Day-to-day activities

**Contact**:
- Calendly embed or scheduling link
- LinkedIn profile link
- Email: hello.daniel@irala.studio

**Project Pages** (E2E Meeting Experience, E2E IT Product Offering, E2E IT Key Roles):
- Project title and client/context
- Challenge description
- Process overview
- Key outcomes
- Learnings

**Behave & Design Podcast**:
- Embedded player or links
- Episode descriptions
- Platform links
- Spotify/Apple Podcasts integration

**Articles**:
- Grid/list of article cards
- Links to LinkedIn posts
- Future: in-site articles

**Workshops**:
- Portfolio of workshop designs
- Methodologies used
- Outcomes achieved

**Reading**:
- Curated book recommendations
- Brief reviews/takeaways
- Categories/tags

**Experiments**:
- Side projects showcase
- AI Music project
- HADO (Home Hospitalization) project
- This website itself

### 6. Performance & Energy Efficiency
- Images: WebP format, lazy loading, blur placeholders
- Fonts: Subset only needed characters, font-display: swap
- Animations: Off by default, GPU-accelerated when enabled
- Bundle: Code splitting per route, tree shaking
- Dark theme: Default (OLED battery saving)
- Prefers-reduced-motion: Respected automatically
- Static generation where possible
</task>

<instructions>
## Step-by-Step Implementation Guide

### Phase 1: Project Setup
1. Initialize Next.js 15 project with App Router, TypeScript, Tailwind CSS, ESLint
2. Configure Tailwind with custom colors, fonts, and dark theme
3. Set up folder structure (see structure section below)
4. Install dependencies: framer-motion, lucide-react, clsx, tailwind-merge
5. Configure Google Fonts (Montserrat, Open Sans) with next/font
6. Add OpenDyslexic as local font for accessibility toggle

### Phase 2: Core Layout & Components
1. Create root layout with accessibility context provider
2. Build the split-screen layout component
3. Create the metro map SVG component with all lines and stops
4. Implement the modal system with blur overlay
5. Build navigation component with line selector icons
6. Create footer component

### Phase 3: Metro Map Interactivity
1. Define stop coordinates as data structure
2. Implement line highlighting on selection
3. Add stop hover states with tooltips
4. Create electric pulse animation (CSS/Framer Motion)
5. Connect stop clicks to modal system
6. Handle intersection stops (shared between lines)

### Phase 4: Content Pages
1. Create modal content templates for each content type
2. Build About Me section
3. Build How I Work section
4. Build What I Do section
5. Build Contact section with scheduling
6. Create project template component
7. Build Articles grid component
8. Build Workshops portfolio component
9. Build Reading list component
10. Build Experiments showcase component
11. Build Podcast section

### Phase 5: Accessibility Implementation
1. Create accessibility settings panel component
2. Implement dyslexia font toggle with CSS custom properties
3. Implement reduce motion toggle (respects prefers-reduced-motion)
4. Implement simplify map toggle
5. Implement high contrast mode
6. Implement reading guide overlay
7. Ensure all interactive elements have focus states
8. Add skip links for keyboard navigation
9. Test with screen reader (NVDA/VoiceOver)
10. Ensure all WCAG 2.1 AA criteria are met

### Phase 6: Mobile Optimization
1. Implement responsive breakpoints
2. Create mobile navigation bar
3. Adapt metro map for mobile (scrollable, zoomable)
4. Ensure touch targets are minimum 44x44px
5. Test on various device sizes

### Phase 7: Performance & Polish
1. Optimize all images (WebP, compression, sizing)
2. Implement lazy loading for off-screen content
3. Add loading states and skeleton screens
4. Run Lighthouse audit, fix issues
5. Test energy efficiency (reduced CPU/GPU usage)
6. Add page transitions (respecting reduce-motion)

### Phase 8: Deployment
1. Set up Vercel project
2. Connect irala.studio domain
3. Configure analytics (Vercel Analytics or Plausible)
4. Set up CI/CD for automatic deployments
5. Test production build
6. Launch!

## Code Standards
- Use TypeScript strict mode with explicit types
- Follow React Server Components where possible
- Use 'use client' only when necessary (interactivity)
- Keep components small and focused
- Use custom hooks for reusable logic
- Comment complex logic
- Use semantic HTML elements
- Include aria-labels for all interactive elements
</instructions>

<folder_structure>
```
daniel-metro-portfolio/
├── public/
│   ├── fonts/
│   │   └── OpenDyslexic-Regular.woff2
│   ├── images/
│   │   ├── city-map-bg.webp
│   │   ├── daniel-profile.webp
│   │   └── projects/
│   │       ├── meeting-experience.webp
│   │       ├── product-offering.webp
│   │       └── ...
│   ├── favicon.ico
│   └── og-image.png
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with providers
│   │   ├── page.tsx                # Home page
│   │   ├── globals.css             # Global styles + Tailwind
│   │   └── api/
│   │       └── analytics/
│   │           └── route.ts        # Basic analytics endpoint
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── MobileNav.tsx
│   │   │   └── SplitScreen.tsx
│   │   ├── metro/
│   │   │   ├── MetroMap.tsx        # Main SVG map component
│   │   │   ├── MetroLine.tsx       # Individual line component
│   │   │   ├── MetroStop.tsx       # Stop dot component
│   │   │   ├── ElectricPulse.tsx   # Animated pulse effect
│   │   │   ├── LineSelector.tsx    # Top nav line icons
│   │   │   └── StopTooltip.tsx     # Hover tooltip
│   │   ├── modal/
│   │   │   ├── Modal.tsx           # Base modal component
│   │   │   ├── ModalOverlay.tsx    # Blur background
│   │   │   └── ModalContent.tsx    # Content wrapper
│   │   ├── content/
│   │   │   ├── AboutMe.tsx
│   │   │   ├── HowIWork.tsx
│   │   │   ├── WhatIDo.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectDetail.tsx
│   │   │   ├── ArticleGrid.tsx
│   │   │   ├── WorkshopPortfolio.tsx
│   │   │   ├── ReadingList.tsx
│   │   │   ├── Experiments.tsx
│   │   │   └── Podcast.tsx
│   │   ├── accessibility/
│   │   │   ├── AccessibilityPanel.tsx
│   │   │   ├── ReadingGuide.tsx
│   │   │   ├── SkipLinks.tsx
│   │   │   └── FocusRing.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Toggle.tsx
│   │       ├── Card.tsx
│   │       ├── Badge.tsx
│   │       └── Skeleton.tsx
│   ├── contexts/
│   │   ├── AccessibilityContext.tsx
│   │   ├── MetroContext.tsx        # Selected line, active stop
│   │   └── ModalContext.tsx
│   ├── hooks/
│   │   ├── useAccessibility.ts
│   │   ├── useMetroMap.ts
│   │   ├── useModal.ts
│   │   ├── useMediaQuery.ts
│   │   └── useReducedMotion.ts
│   ├── data/
│   │   ├── metro-lines.ts          # Line definitions
│   │   ├── stops.ts                # Stop coordinates and metadata
│   │   ├── projects.ts             # Project content
│   │   ├── articles.ts             # Article links
│   │   ├── books.ts                # Reading list
│   │   └── experiments.ts          # Side projects
│   ├── lib/
│   │   ├── utils.ts                # Utility functions
│   │   ├── cn.ts                   # clsx + tailwind-merge helper
│   │   └── analytics.ts            # Analytics helpers
│   ├── styles/
│   │   └── fonts.ts                # Font configurations
│   └── types/
│       ├── metro.ts                # Metro-related types
│       ├── content.ts              # Content types
│       └── accessibility.ts        # Accessibility types
├── .env.local                      # Environment variables
├── .eslintrc.json
├── next.config.ts
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```
</folder_structure>

<data_structures>
```typescript
// src/types/metro.ts

export type LineId = 'profile' | 'projects' | 'thinking';

export interface MetroLine {
  id: LineId;
  name: string;
  color: string;
  stops: StopId[];
}

export type StopId = 
  | 'home' | 'about-me' | 'how-i-work' | 'what-i-do' | 'contact'
  | 'workshops' | 'meeting-experience' | 'podcast' | 'product-offering'
  | 'it-key-roles' | 'experiments'
  | 'articles' | 'reading';

export interface MetroStop {
  id: StopId;
  name: string;
  lines: LineId[];
  coordinates: {
    desktop: { x: number; y: number };
    mobile: { x: number; y: number };
  };
  contentType: 'page' | 'project' | 'portfolio' | 'grid' | 'list';
}

// src/data/metro-lines.ts

export const metroLines: MetroLine[] = [
  {
    id: 'profile',
    name: 'Profile Line',
    color: '#FF78C5',
    stops: ['about-me', 'how-i-work', 'home', 'podcast', 'what-i-do', 'contact']
  },
  {
    id: 'projects',
    name: 'Projects Line', 
    color: '#B996F0',
    stops: ['meeting-experience', 'workshops', 'podcast', 'product-offering', 'home', 'it-key-roles', 'experiments']
  },
  {
    id: 'thinking',
    name: 'Thinking Line',
    color: '#84E9FF',
    stops: ['articles', 'workshops', 'home', 'reading', 'experiments']
  }
];

// src/data/stops.ts - ALL STOPS WITH COORDINATES

export const metroStops: Record<StopId, MetroStop> = {
  // ===================
  // SHARED HUB (All 3 lines)
  // ===================
  home: {
    id: 'home',
    name: 'Home',
    lines: ['profile', 'projects', 'thinking'],
    coordinates: {
      desktop: { x: 1439, y: 544 },
      mobile: { x: 180, y: 200 }
    },
    contentType: 'page'
  },

  // ===================
  // PROFILE LINE (Pink #FF78C5)
  // ===================
  'about-me': {
    id: 'about-me',
    name: 'About Me',
    lines: ['profile'],
    coordinates: {
      desktop: { x: 1710, y: 274 },
      mobile: { x: 280, y: 80 }
    },
    contentType: 'page'
  },
  'how-i-work': {
    id: 'how-i-work',
    name: 'How I Work',
    lines: ['profile'],
    coordinates: {
      desktop: { x: 1514, y: 368 },
      mobile: { x: 240, y: 120 }
    },
    contentType: 'page'
  },
  'what-i-do': {
    id: 'what-i-do',
    name: 'What I Do',
    lines: ['profile'],
    coordinates: {
      desktop: { x: 1077, y: 767 },
      mobile: { x: 100, y: 300 }
    },
    contentType: 'page'
  },
  'contact': {
    id: 'contact',
    name: 'Contact',
    lines: ['profile'],
    coordinates: {
      desktop: { x: 932, y: 904 },
      mobile: { x: 60, y: 360 }
    },
    contentType: 'page'
  },

  // ===================
  // PROJECTS LINE (Purple #B996F0)
  // ===================
  'meeting-experience': {
    id: 'meeting-experience',
    name: 'E2E Meeting Experience',
    lines: ['projects'],
    coordinates: {
      desktop: { x: 1430, y: 185 },
      mobile: { x: 220, y: 60 }
    },
    contentType: 'project'
  },
  'workshops': {
    id: 'workshops',
    name: 'Workshops',
    lines: ['projects', 'thinking'],
    coordinates: {
      desktop: { x: 1230, y: 301 },
      mobile: { x: 160, y: 100 }
    },
    contentType: 'portfolio'
  },
  'podcast': {
    id: 'podcast',
    name: 'Behave & Design Podcast',
    lines: ['projects', 'profile'],
    coordinates: {
      desktop: { x: 1184, y: 532 },
      mobile: { x: 140, y: 190 }
    },
    contentType: 'page'
  },
  'product-offering': {
    id: 'product-offering',
    name: 'E2E IT Product Offering',
    lines: ['projects'],
    coordinates: {
      desktop: { x: 1302, y: 746 },
      mobile: { x: 180, y: 290 }
    },
    contentType: 'project'
  },
  'it-key-roles': {
    id: 'it-key-roles',
    name: 'E2E IT Key Roles',
    lines: ['projects'],
    coordinates: {
      desktop: { x: 1676, y: 590 },
      mobile: { x: 270, y: 220 }
    },
    contentType: 'project'
  },
  'experiments': {
    id: 'experiments',
    name: 'Experiments',
    lines: ['projects', 'thinking'],
    coordinates: {
      desktop: { x: 1691, y: 914 },
      mobile: { x: 280, y: 360 }
    },
    contentType: 'portfolio'
  },

  // ===================
  // THINKING LINE (Blue #84E9FF)
  // ===================
  'articles': {
    id: 'articles',
    name: 'Articles',
    lines: ['thinking'],
    coordinates: {
      desktop: { x: 1013, y: 268 },
      mobile: { x: 100, y: 90 }
    },
    contentType: 'grid'
  },
  'reading': {
    id: 'reading',
    name: 'Reading',
    lines: ['thinking'],
    coordinates: {
      desktop: { x: 1479, y: 772 },
      mobile: { x: 230, y: 300 }
    },
    contentType: 'list'
  },
};

// src/types/accessibility.ts

export interface AccessibilitySettings {
  dyslexiaFont: boolean;
  reduceMotion: boolean;
  simplifyMap: boolean;
  highContrast: boolean;
  readingGuide: boolean;
}
```
</data_structures>

<examples>
## Example: Metro Stop Component

```tsx
// src/components/metro/MetroStop.tsx
'use client';

import { motion } from 'framer-motion';
import { useMetroMap } from '@/hooks/useMetroMap';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useModal } from '@/hooks/useModal';
import { MetroStop as MetroStopType } from '@/types/metro';
import { cn } from '@/lib/cn';

interface MetroStopProps {
  stop: MetroStopType;
  isHighlighted: boolean;
}

export function MetroStop({ stop, isHighlighted }: MetroStopProps) {
  const { selectedLine } = useMetroMap();
  const { settings } = useAccessibility();
  const { openModal } = useModal();
  
  const isOnSelectedLine = selectedLine 
    ? stop.lines.includes(selectedLine) 
    : true;
  
  const lineColor = stop.lines[0] === 'profile' 
    ? '#FF78C5' 
    : stop.lines[0] === 'projects' 
      ? '#B996F0' 
      : '#84E9FF';

  const handleClick = () => {
    openModal(stop.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(stop.id);
    }
  };

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: isOnSelectedLine ? 1 : 0.3,
        scale: 1 
      }}
      transition={{ 
        duration: settings.reduceMotion ? 0 : 0.3 
      }}
      className="cursor-pointer"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Navigate to ${stop.name}`}
    >
      {/* Outer glow on hover */}
      <circle
        cx={stop.coordinates.desktop.x}
        cy={stop.coordinates.desktop.y}
        r={isHighlighted ? 20 : 12}
        fill={isHighlighted ? lineColor : 'transparent'}
        opacity={0.3}
        className={cn(
          'transition-all duration-300',
          settings.reduceMotion && 'transition-none'
        )}
      />
      
      {/* Main stop dot */}
      <circle
        cx={stop.coordinates.desktop.x}
        cy={stop.coordinates.desktop.y}
        r={8}
        fill="#FFFFFF"
        stroke={lineColor}
        strokeWidth={3}
        className="drop-shadow-lg"
      />
      
      {/* Stop name label (shown when line selected) */}
      {isHighlighted && (
        <text
          x={stop.coordinates.desktop.x}
          y={stop.coordinates.desktop.y - 25}
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize={12}
          fontFamily="var(--font-body)"
          className="pointer-events-none"
        >
          {stop.name}
        </text>
      )}
    </motion.g>
  );
}
```

## Example: Accessibility Context

```tsx
// src/contexts/AccessibilityContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AccessibilitySettings } from '@/types/accessibility';

const defaultSettings: AccessibilitySettings = {
  dyslexiaFont: false,
  reduceMotion: false,
  simplifyMap: false,
  highContrast: false,
  readingGuide: false,
};

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => void;
  resetSettings: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('accessibility-settings');
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse accessibility settings');
      }
    }
    
    // Check system preference for reduced motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    
    if (prefersReducedMotion) {
      setSettings(prev => ({ ...prev, reduceMotion: true }));
    }
    
    setIsHydrated(true);
  }, []);

  // Save to localStorage when settings change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('accessibility-settings', JSON.stringify(settings));
      
      // Apply CSS custom properties
      document.documentElement.classList.toggle(
        'dyslexia-font', 
        settings.dyslexiaFont
      );
      document.documentElement.classList.toggle(
        'reduce-motion', 
        settings.reduceMotion
      );
      document.documentElement.classList.toggle(
        'high-contrast', 
        settings.highContrast
      );
    }
  }, [settings, isHydrated]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}
```

## Example: Modal System

```tsx
// src/components/modal/Modal.tsx
'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useModal } from '@/hooks/useModal';
import { useAccessibility } from '@/hooks/useAccessibility';
import { cn } from '@/lib/cn';

// Content components
import { AboutMe } from '@/components/content/AboutMe';
import { HowIWork } from '@/components/content/HowIWork';
// ... other imports

const contentMap: Record<string, React.ComponentType> = {
  'about-me': AboutMe,
  'how-i-work': HowIWork,
  // ... other mappings
};

export function Modal() {
  const { isOpen, activeStop, closeModal } = useModal();
  const { settings } = useAccessibility();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap and keyboard handling
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
      
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeModal();
      };
      
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, closeModal]);

  const ContentComponent = activeStop ? contentMap[activeStop] : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: settings.reduceMotion ? 0 : 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
            onClick={closeModal}
            aria-hidden="true"
          />
          
          {/* Modal Panel */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ 
              type: settings.reduceMotion ? 'tween' : 'spring',
              duration: settings.reduceMotion ? 0 : 0.3,
              bounce: 0.1
            }}
            className={cn(
              'fixed right-0 top-0 h-full w-full max-w-2xl',
              'bg-gray-900/95 border-l border-gray-800',
              'z-50 overflow-y-auto',
              'md:w-[600px]'
            )}
          >
            {/* Close button */}
            <button
              ref={closeButtonRef}
              onClick={closeModal}
              className={cn(
                'absolute top-4 right-4 p-2 rounded-full',
                'bg-gray-800 hover:bg-gray-700',
                'text-white transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-pink-500'
              )}
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
            
            {/* Content */}
            <div className="p-8 pt-16">
              {ContentComponent && <ContentComponent />}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```
</examples>

<output_format>
When generating code, follow these patterns:

1. **File Creation**: Always specify the full file path and provide complete, production-ready code
2. **Components**: Use functional components with TypeScript interfaces for props
3. **Styling**: Use Tailwind CSS classes, leverage the cn() utility for conditional classes
4. **Accessibility**: Include ARIA attributes, keyboard handlers, and focus management
5. **Performance**: Use React.memo for expensive components, lazy load where appropriate
6. **Comments**: Add JSDoc comments for complex functions, inline comments for non-obvious logic

Output Format for Each Task:
```
## [Task Name]

### Files to Create/Modify:
1. `path/to/file.tsx` - Description

### Code:
[Complete code for each file]

### Testing Notes:
- How to verify this works
- Edge cases to check

### Accessibility Checklist:
- [ ] Keyboard navigable
- [ ] Screen reader tested
- [ ] Focus states visible
- [ ] Reduced motion respected
```
</output_format>

<quality_criteria>
## Success Metrics

### Performance
- Lighthouse Performance score: >90
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Total Blocking Time: <200ms
- Bundle size: <200KB initial JS

### Accessibility
- Lighthouse Accessibility score: 100
- WCAG 2.1 AA compliance: All criteria
- Keyboard navigation: Full site navigable
- Screen reader: All content accessible
- Cognitive: All accessibility toggles functional

### Energy Efficiency
- Animations: Disabled by default or respect prefers-reduced-motion
- Images: All WebP, lazy loaded, properly sized
- Dark theme: Default to reduce screen energy
- CPU: Minimal layout thrashing, efficient renders

### Code Quality
- TypeScript: No any types, strict mode
- ESLint: Zero errors, zero warnings
- Components: Single responsibility, reusable
- Tests: Critical paths covered

### User Experience
- Navigation: Intuitive metro map interaction
- Content: All modals load <500ms
- Mobile: Touch-friendly, responsive
- Feedback: Hover/focus states on all interactive elements
</quality_criteria>

<implementation_notes>
## Key Implementation Details

### SVG Metro Map
The metro map should be a single SVG element with:
- ViewBox: "0 0 1920 1080" for desktop
- Lines drawn as `<path>` elements with proper bezier curves
- Stops as `<g>` groups containing circles and optional labels
- Use CSS transforms for animations (GPU accelerated)

### Responsive Strategy
- Desktop (≥1024px): Split screen, full map
- Tablet (768-1023px): Stacked, scrollable map
- Mobile (<768px): Simplified map, bottom nav

### Modal State Management
Use URL hash for modal state (#about-me, #projects, etc.) to enable:
- Direct linking to content
- Browser back button closes modal
- Shareable links

### Content Future-Proofing
Store content in `/src/data/` as TypeScript objects initially. This makes it easy to:
- Migrate to a CMS later (Sanity, Contentful, etc.)
- Add MDX support for rich content
- Implement a simple JSON API

### Hosting on Vercel
1. Connect GitHub repo to Vercel
2. Add custom domain: irala.studio
3. Configure in Google Domains:
   - A record: 76.76.21.21
   - CNAME: cname.vercel-dns.com
4. Enable Vercel Analytics (free tier)

### Analytics (Basic)
Use Vercel Analytics or add Plausible:
- Page views
- Modal opens
- Line/stop interactions
- Accessibility toggle usage
</implementation_notes>

<next_steps>
After generating initial code:

1. **Customize Coordinates**: Update all stop coordinates based on your city map background
2. **Add Content**: Fill in actual content for each section
3. **Add Images**: Replace placeholders with real images
4. **Test Accessibility**: Run through with keyboard, screen reader, and all toggles
5. **Optimize Performance**: Run Lighthouse, fix any issues
6. **Deploy**: Push to Vercel, configure domain
7. **Iterate**: Gather feedback, refine

Ask me to generate specific components or sections by referencing:
- "Generate the MetroMap component"
- "Create the accessibility settings panel"
- "Set up the project with initial files"
- "Build the modal system"
</next_steps>

---

## Quick Start Commands

```bash
# Initialize project
npx create-next-app@latest daniel-metro-portfolio --typescript --tailwind --eslint --app --src-dir

# Navigate and install dependencies
cd daniel-metro-portfolio
npm install framer-motion lucide-react clsx tailwind-merge

# Start development
npm run dev
```

---

**Ready to generate code?** Just say:
- "Generate Phase 1: Project Setup"
- "Generate the complete metro map system"
- "Generate all accessibility components"
- Or specify any component from the folder structure!