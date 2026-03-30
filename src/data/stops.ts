import { StopId, MetroStop } from '@/types/metro';

export const metroStops: Record<StopId, MetroStop> = {
    // ===================
    // SHARED HUB (All 3 lines) - Centered
    // ===================
    home: {
        id: 'home',
        name: 'Home Page',
        lines: ['profile', 'projects', 'thinking'],
        coordinates: {
            desktop: { x: 1425, y: 525 },  // Mathematically centered in viewBox (850+575, 50+475)
            mobile: { x: 200, y: 240 }     // Mathematically centered in viewBox (40+160, 30+210)
        },
        contentType: 'page',
        labelPosition: 'right'  // Lines from all directions, right is clearest
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
            mobile: { x: 295, y: 70 }
        },
        contentType: 'page',
        labelPosition: 'right'  // Line comes from bottom-left
    },
    'how-i-work': {
        id: 'how-i-work',
        name: 'How I Work',
        lines: ['profile'],
        coordinates: {
            desktop: { x: 1514, y: 368 },
            mobile: { x: 260, y: 145 }
        },
        contentType: 'page',
        labelPosition: 'right'  // Line from top-right to bottom-left
    },
    'what-i-do': {
        id: 'what-i-do',
        name: 'What I Do',
        lines: ['profile'],
        coordinates: {
            desktop: { x: 1077, y: 767 },
            mobile: { x: 75, y: 320 }
        },
        contentType: 'page',
        labelPosition: 'right'  // Clear space on the right
    },
    'contact': {
        id: 'contact',
        name: 'Contact',
        lines: ['profile'],
        coordinates: {
            desktop: { x: 932, y: 904 },
            mobile: { x: 60, y: 400 }
        },
        contentType: 'page',
        labelPosition: 'right'  // Clear space on the right
    },

    // ===================
    // PROJECTS LINE (Purple #B996F0)
    // ===================
    'meeting-experience': {
        id: 'meeting-experience',
        name: 'Collaboration Design',
        lines: ['projects'],
        coordinates: {
            desktop: { x: 1430, y: 185 },
            mobile: { x: 200, y: 50 }
        },
        contentType: 'project',
        labelPosition: 'top'  // Line goes down, label safe on top
    },
    'workshops': {
        id: 'workshops',
        name: 'Talks & Workshops',
        lines: ['projects', 'thinking'],
        coordinates: {
            desktop: { x: 1230, y: 301 },
            mobile: { x: 130, y: 120 }
        },
        contentType: 'page',
        labelPosition: 'left'  // Lines from top/right, clearer on left
    },
    'podcast': {
        id: 'podcast',
        name: 'Podcast',
        lines: ['projects', 'profile'],
        coordinates: {
            desktop: { x: 1184, y: 532 },
            mobile: { x: 110, y: 225 }
        },
        contentType: 'page',
        labelPosition: 'left'  // Lines from multiple directions
    },
    'product-offering': {
        id: 'product-offering',
        name: 'Service Adoption',
        lines: ['projects'],
        coordinates: {
            desktop: { x: 1302, y: 746 },
            mobile: { x: 165, y: 320 }
        },
        contentType: 'project',
        labelPosition: 'bottom'  // Clear space below
    },
    'it-key-roles': {
        id: 'it-key-roles',
        name: 'Process & AI Opportunities',
        lines: ['projects'],
        coordinates: {
            desktop: { x: 1676, y: 590 },
            mobile: { x: 290, y: 260 }
        },
        contentType: 'project',
        labelPosition: 'right'  // Line comes from left
    },
    'experiments': {
        id: 'experiments',
        name: 'Experiments',
        lines: ['projects', 'thinking'],
        coordinates: {
            desktop: { x: 1691, y: 914 },
            mobile: { x: 295, y: 390 }
        },
        contentType: 'portfolio',
        labelPosition: 'right'  // Lines come from top-left
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
            mobile: { x: 70, y: 85 }
        },
        contentType: 'grid',
        labelPosition: 'top'  // Clear space above
    },
    'reading': {
        id: 'reading',
        name: 'Reading',
        lines: ['thinking'],
        coordinates: {
            desktop: { x: 1479, y: 772 },
            mobile: { x: 245, y: 340 }
        },
        contentType: 'list',
        labelPosition: 'bottom'  // Clear space below
    },
};
