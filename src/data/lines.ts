import { MetroLine } from '@/types/metro';

export const metroLines: MetroLine[] = [
    {
        id: 'profile',
        name: 'Profile Line',
        color: '#FF78C5',
        stops: ['about-me', 'how-i-work', 'podcast', 'what-i-do', 'contact']
    },
    {
        id: 'projects',
        name: 'Projects Line',
        color: '#B996F0',
        stops: ['meeting-experience', 'workshops', 'podcast', 'product-offering', 'it-key-roles', 'experiments']
    },
    {
        id: 'thinking',
        name: 'Thinking Line',
        color: '#84E9FF',
        stops: ['articles', 'workshops', 'reading', 'experiments']
    }
];
