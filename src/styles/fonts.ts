import { Montserrat, Open_Sans } from 'next/font/google';

export const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-heading',
    display: 'swap',
});

export const openSans = Open_Sans({
    subsets: ['latin'],
    variable: '--font-body',
    display: 'swap',
});

// OpenDyslexic will be loaded via CSS @font-face or next/font/local if file is available
