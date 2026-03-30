# 🗺️ Daniel Metro Portfolio - Project Roadmap

> **Target**: MVP Launch by Mid-March 2025
> **Working Period**: Full-time for 2 weeks (sick leave), then part-time
> **Developer**: Solo

---

## Timeline Overview

```
Week 1 (Jan 27 - Feb 2)     █████████████████████░░░░  Phase 1 & 2
Week 2 (Feb 3 - Feb 9)      █████████████████████░░░░  Phase 3 & 4  
Week 3 (Feb 10 - Feb 16)    ███████████████░░░░░░░░░░  Phase 5 (part-time)
Week 4 (Feb 17 - Feb 23)    ███████████████░░░░░░░░░░  Phase 6 (part-time)
Week 5+ (Feb 24 - Mar 15)   ██████████░░░░░░░░░░░░░░░  Phase 7 & 8 (polish & launch)
```

---

## 📦 Phase 1: Foundation Setup
**Duration**: 2 days (Jan 27-28)
**Goal**: Project scaffolding with all configurations ready

### Milestones

| # | Task | Est. Time | Deliverable |
|---|------|-----------|-------------|
| 1.1 | Initialize Next.js 15 project | 30 min | Working dev server |
| 1.2 | Configure Tailwind with custom theme | 2 hrs | Brand colors, fonts configured |
| 1.3 | Set up folder structure | 1 hr | All directories created |
| 1.4 | Install & configure dependencies | 1 hr | package.json complete |
| 1.5 | Set up fonts (Google + local OpenDyslexic) | 1 hr | Fonts loading correctly |
| 1.6 | Create base TypeScript types | 1 hr | types/ folder complete |
| 1.7 | Create data files structure | 2 hrs | data/ with metro-lines, stops |
| 1.8 | Set up ESLint + Prettier | 30 min | Linting working |

### Definition of Done
- [ ] `npm run dev` starts without errors
- [ ] Tailwind classes with brand colors work
- [ ] Montserrat and Open Sans load
- [ ] TypeScript strict mode enabled
- [ ] Folder structure matches spec

### Checkpoint Questions
- Can I import components from all defined paths?
- Do the brand colors (#FF78C5, #B996F0, #84E9FF) display correctly?
- Does the dark theme apply by default?

---

## 🏗️ Phase 2: Core Layout & Components
**Duration**: 3 days (Jan 29-31)
**Goal**: Main layout structure working on desktop

### Milestones

| # | Task | Est. Time | Deliverable |
|---|------|-----------|-------------|
| 2.1 | Create root layout with providers | 2 hrs | layout.tsx with contexts |
| 2.2 | Build SplitScreen component | 3 hrs | 40/60 split working |
| 2.3 | Create Header component (left panel) | 2 hrs | Tagline, title area |
| 2.4 | Create Navigation component | 3 hrs | Line selector icons |
| 2.5 | Create Footer component | 1 hr | @danirala, Privacy, Info |
| 2.6 | Build base Modal component | 4 hrs | Slide-in panel with blur |
| 2.7 | Create Modal Context | 2 hrs | Open/close state management |
| 2.8 | Set up city map background | 2 hrs | Background image positioned |

### Definition of Done
- [ ] Split-screen layout renders correctly at 1920x1080
- [ ] Navigation shows three line icons with correct colors
- [ ] Modal opens and closes smoothly
- [ ] Background city map visible on right side
- [ ] All components have TypeScript types

### Checkpoint Questions
- Does the layout match the design screenshot?
- Can I click a nav icon and see visual feedback?
- Does the modal appear over the content with blur?

---

## 🚇 Phase 3: Metro Map System
**Duration**: 4 days (Feb 1-4)
**Goal**: Interactive metro map with all functionality

### Milestones

| # | Task | Est. Time | Deliverable |
|---|------|-----------|-------------|
| 3.1 | Create MetroMap SVG container | 2 hrs | SVG with viewBox |
| 3.2 | Define all stop coordinates | 3 hrs | stops.ts complete |
| 3.3 | Draw metro lines (paths) | 4 hrs | 3 colored lines |
| 3.4 | Create MetroStop component | 3 hrs | Clickable dots |
| 3.5 | Implement line highlighting | 3 hrs | Select line → highlights |
| 3.6 | Add stop hover states | 2 hrs | Glow + tooltip |
| 3.7 | Connect stops to modal | 2 hrs | Click stop → modal opens |
| 3.8 | Create electric pulse animation | 4 hrs | Animated pulse on lines |
| 3.9 | Handle intersection stops | 2 hrs | Home, Workshops, etc. |
| 3.10 | Create Metro Context | 2 hrs | Selected line state |

### Definition of Done
- [ ] All 3 lines visible with correct colors
- [ ] All stops positioned correctly
- [ ] Clicking line icon highlights that line
- [ ] Clicking stop opens modal with correct content ID
- [ ] Hover shows stop name tooltip
- [ ] Electric pulse animates (when motion allowed)
- [ ] Intersection stops show on multiple lines

### Checkpoint Questions
- Can I navigate the entire map with keyboard?
- Do the line paths look like a metro map (not just straight lines)?
- Does the pulse animation respect reduced motion?

### Stop Coordinates Reference
All coordinates now finalized in `src/data/stops.ts`:

```typescript
// Desktop coordinates (1920x1080 viewport) - FINAL

// SHARED HUB
home: { x: 1439, y: 544 }

// PROFILE LINE (Pink)
'about-me': { x: 1710, y: 274 }
'how-i-work': { x: 1514, y: 368 }
'podcast': { x: 1184, y: 532 }      // Behave & Design Podcast
'what-i-do': { x: 1077, y: 767 }
'contact': { x: 932, y: 904 }

// PROJECTS LINE (Purple)
'meeting-experience': { x: 1430, y: 185 }  // E2E Meeting Experience
'workshops': { x: 1230, y: 301 }
'product-offering': { x: 1302, y: 746 }    // E2E IT Product Offering
'it-key-roles': { x: 1676, y: 590 }        // E2E IT Key Roles
'experiments': { x: 1691, y: 914 }

// THINKING LINE (Blue)
'articles': { x: 1013, y: 268 }
'reading': { x: 1479, y: 772 }
```

---

## 📝 Phase 4: Content Components
**Duration**: 3 days (Feb 5-7)
**Goal**: All content sections built and styled

### Milestones

| # | Task | Est. Time | Deliverable |
|---|------|-----------|-------------|
| 4.1 | Build AboutMe component | 2 hrs | Vision, values, why |
| 4.2 | Build HowIWork component | 2 hrs | Attributes, process |
| 4.3 | Build WhatIDo component | 2 hrs | Focus, direction |
| 4.4 | Build Contact component | 2 hrs | Scheduling, LinkedIn |
| 4.5 | Create ProjectDetail template | 3 hrs | Challenge, process, learnings |
| 4.6 | Build ArticleGrid component | 2 hrs | Cards linking to LinkedIn |
| 4.7 | Build WorkshopPortfolio | 2 hrs | Workshop showcases |
| 4.8 | Build ReadingList component | 2 hrs | Book recommendations |
| 4.9 | Build Experiments showcase | 2 hrs | Side projects grid |
| 4.10 | Build Podcast section | 1 hr | Embed/links |
| 4.11 | Populate with real content | 4 hrs | Your actual content |

### Definition of Done
- [ ] Each modal loads correct content component
- [ ] All components styled consistently
- [ ] Images have loading states
- [ ] Content is readable (typography, spacing)
- [ ] Links work (LinkedIn, scheduling)

### Checkpoint Questions
- Is the content hierarchy clear?
- Does each section feel complete?
- Are all external links opening in new tabs?

---

## ♿ Phase 5: Accessibility Implementation
**Duration**: 4 days (Feb 8-11)
**Goal**: Full accessibility compliance

### Milestones

| # | Task | Est. Time | Deliverable |
|---|------|-----------|-------------|
| 5.1 | Create AccessibilityContext | 2 hrs | Settings state management |
| 5.2 | Build AccessibilityPanel UI | 3 hrs | Toggle switches |
| 5.3 | Implement dyslexia font toggle | 2 hrs | OpenDyslexic swap |
| 5.4 | Implement reduce motion toggle | 2 hrs | Disables all animations |
| 5.5 | Implement simplify map toggle | 3 hrs | Minimal map version |
| 5.6 | Implement high contrast mode | 2 hrs | Enhanced contrast |
| 5.7 | Build ReadingGuide component | 3 hrs | Follows cursor/focus |
| 5.8 | Add skip links | 1 hr | Jump to main content |
| 5.9 | Add focus ring styling | 2 hrs | Visible focus states |
| 5.10 | Keyboard navigation audit | 2 hrs | Tab through everything |
| 5.11 | Screen reader testing | 3 hrs | NVDA/VoiceOver pass |
| 5.12 | ARIA labels audit | 2 hrs | All elements labeled |

### Definition of Done
- [ ] All 5 accessibility toggles work
- [ ] Settings persist in localStorage
- [ ] Entire site keyboard navigable
- [ ] Screen reader announces everything correctly
- [ ] prefers-reduced-motion respected by default
- [ ] Focus visible on all interactive elements

### Checkpoint Questions
- Can someone using only a keyboard complete all tasks?
- Does VoiceOver announce stop names when focused?
- Does dyslexia font apply to all text?

### Accessibility Testing Checklist
```
Manual Tests:
[ ] Tab through entire page - logical order?
[ ] Screen reader reads all content?
[ ] Can close modal with Escape key?
[ ] Can activate stop with Enter/Space?
[ ] Focus trapped inside open modal?
[ ] Skip link works?
[ ] Reading guide follows focus?

Automated Tests:
[ ] Lighthouse Accessibility: 100
[ ] axe DevTools: 0 violations
[ ] WAVE: 0 errors
```

---

## 📱 Phase 6: Mobile Optimization
**Duration**: 3 days (Feb 12-14)
**Goal**: Perfect mobile experience

### Milestones

| # | Task | Est. Time | Deliverable |
|---|------|-----------|-------------|
| 6.1 | Define responsive breakpoints | 1 hr | Tailwind config |
| 6.2 | Adapt SplitScreen for mobile | 3 hrs | Stacked layout |
| 6.3 | Create MobileNav component | 3 hrs | Bottom nav bar |
| 6.4 | Make metro map scrollable/zoomable | 4 hrs | Touch gestures |
| 6.5 | Calculate mobile stop coordinates | 3 hrs | Scaled positions |
| 6.6 | Adapt modal for mobile | 2 hrs | Full-screen slide-up |
| 6.7 | Ensure touch targets 44x44px | 2 hrs | All buttons/links |
| 6.8 | Test on real devices | 2 hrs | iOS + Android |

### Definition of Done
- [ ] Layout adapts smoothly at all breakpoints
- [ ] Mobile nav provides easy access to all sections
- [ ] Map is usable on small screens
- [ ] Touch interactions work reliably
- [ ] All text readable without zooming
- [ ] No horizontal scroll issues

### Breakpoints
```css
/* Tailwind config */
sm: 640px   /* Large phones */
md: 768px   /* Tablets */
lg: 1024px  /* Small laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */
```

### Checkpoint Questions
- Can I complete all tasks on a phone one-handed?
- Is the bottom nav always visible?
- Does the map not feel cramped?

---

## 🚀 Phase 7: Performance & Polish
**Duration**: 4 days (Feb 15-18)
**Goal**: Production-ready quality

### Milestones

| # | Task | Est. Time | Deliverable |
|---|------|-----------|-------------|
| 7.1 | Convert images to WebP | 2 hrs | All images optimized |
| 7.2 | Add blur placeholders | 2 hrs | Loading states |
| 7.3 | Implement lazy loading | 2 hrs | Off-screen content |
| 7.4 | Add skeleton screens | 2 hrs | Loading UI |
| 7.5 | Run Lighthouse audit | 1 hr | Baseline scores |
| 7.6 | Fix Lighthouse issues | 4 hrs | All scores >90 |
| 7.7 | Bundle analysis | 2 hrs | Identify bloat |
| 7.8 | Code splitting optimization | 2 hrs | Smaller initial bundle |
| 7.9 | Add page transitions | 2 hrs | Smooth navigation |
| 7.10 | Final visual polish | 3 hrs | Spacing, typography |
| 7.11 | Cross-browser testing | 2 hrs | Chrome, Firefox, Safari |
| 7.12 | Error boundaries | 1 hr | Graceful failures |

### Definition of Done
- [ ] Lighthouse Performance: >90
- [ ] First Contentful Paint: <1.5s
- [ ] Total Blocking Time: <200ms
- [ ] No layout shift (CLS: 0)
- [ ] Works in all major browsers
- [ ] All images lazy loaded
- [ ] Bundle <200KB initial JS

### Checkpoint Questions
- Is the site fast on 3G?
- Do animations feel smooth (60fps)?
- Is the visual design consistent throughout?

---

## 🌐 Phase 8: Deployment & Launch
**Duration**: 2 days (Feb 19-20, then as needed until mid-March)
**Goal**: Live on irala.studio

### Milestones

| # | Task | Est. Time | Deliverable |
|---|------|-----------|-------------|
| 8.1 | Create Vercel account/project | 30 min | Project connected |
| 8.2 | Connect GitHub repository | 30 min | Auto-deployments |
| 8.3 | Configure irala.studio domain | 1 hr | DNS settings |
| 8.4 | Set up SSL certificate | Automatic | HTTPS working |
| 8.5 | Configure Vercel Analytics | 30 min | Basic tracking |
| 8.6 | Test production build | 2 hrs | No bugs |
| 8.7 | Set up redirects | 30 min | www → non-www |
| 8.8 | Create OG image | 1 hr | Social sharing |
| 8.9 | Add meta tags | 1 hr | SEO basics |
| 8.10 | Soft launch (share with friends) | - | Feedback collection |
| 8.11 | Fix feedback issues | 2-4 hrs | Iterations |
| 8.12 | Official launch! | - | 🎉 |

### Definition of Done
- [ ] irala.studio loads the site
- [ ] HTTPS working
- [ ] Analytics tracking
- [ ] OG image shows in social shares
- [ ] No console errors in production
- [ ] 404 page configured

### DNS Configuration (Google Domains → Vercel)
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

### Checkpoint Questions
- Does the site load when I type irala.studio?
- Does the share preview look good on LinkedIn?
- Can I see basic analytics?

---

## 📊 Post-Launch (Ongoing)

### Week 1 After Launch
- [ ] Monitor analytics for issues
- [ ] Collect user feedback
- [ ] Fix critical bugs
- [ ] Optimize based on real usage data

### Month 1-3
- [ ] Add more project case studies
- [ ] Write first article
- [ ] Refine content based on feedback
- [ ] Consider adding blog functionality

### Month 3-6
- [ ] Evaluate CMS integration need
- [ ] Add multilingual support (Spanish?)
- [ ] Consider adding dark/light theme toggle
- [ ] Portfolio refresh with new work

---

## 🛠️ Daily Work Pattern

### Morning (Deep Work: 4 hours)
- Focus on current phase milestone
- No interruptions, complex coding
- Review yesterday's code with fresh eyes

### Afternoon (Flexible: 2-3 hours)
- Testing and debugging
- Content creation/refinement
- Research and problem-solving

### Evening (Optional: 1 hour)
- Planning tomorrow's tasks
- Quick fixes
- Learning/reading documentation

### Daily Standup (Self)
Ask yourself:
1. What did I complete today?
2. What will I work on tomorrow?
3. What's blocking me?

---

## 🆘 Risk Mitigation

### Risk: Metro map takes longer than expected
**Mitigation**: Start with a simplified version (straight lines, basic interactions), enhance iteratively

### Risk: Accessibility features complex
**Mitigation**: Implement one toggle at a time, ship with dyslexia + reduce motion first

### Risk: Mobile layout challenging
**Mitigation**: Consider a simpler mobile nav as MVP, enhance post-launch

### Risk: Content not ready
**Mitigation**: Use placeholder content for launch, real content can be updated

### Risk: Burnout during sick leave
**Mitigation**: Take breaks, don't work past 6 hours/day, celebrate small wins

---

## ✅ MVP Definition

**Minimum Viable Portfolio includes:**
- [x] Home page with map visible
- [x] All 3 metro lines rendered
- [x] Click stop → modal with content
- [x] About Me, How I Work, What I Do, Contact complete
- [x] At least 2 project case studies
- [x] Dyslexia font toggle
- [x] Reduce motion toggle
- [x] Mobile responsive (functional, not perfect)
- [x] Live on irala.studio

**Can be added post-launch:**
- Enhanced animations
- Full reading guide feature
- Simplified map mode
- All project case studies
- Articles and reading lists
- Podcast integration

---

## 📞 Support & Resources

### If Stuck
1. Check Next.js docs: nextjs.org/docs
2. Tailwind CSS docs: tailwindcss.com/docs
3. Framer Motion: framer.com/motion
4. MDN Web Docs for accessibility
5. Ask Claude/Gemini with specific error messages

### Inspiration
- [Stripe.com](https://stripe.com) - Smooth interactions
- [Linear.app](https://linear.app) - Dark theme done right
- [Pentagram.com](https://pentagram.com) - Portfolio grid
- Real metro maps for line styling

---

**You've got this, Daniel! 🚇💜**

Remember: Progress over perfection. Ship the MVP, then iterate.