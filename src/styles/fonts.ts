import { Montserrat, Open_Sans } from 'next/font/google';

// Original site fonts — kept per Dani's request.
// Montserrat = headings / display + UI labels; Open Sans = body.
export const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-display',
    display: 'swap',
});

export const openSans = Open_Sans({
    subsets: ['latin'],
    variable: '--font-body',
    display: 'swap',
});
