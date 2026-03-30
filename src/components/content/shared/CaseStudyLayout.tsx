'use client';

import { ReactNode } from 'react';

interface CaseStudyLayoutProps {
    children: ReactNode;
}

export function CaseStudyLayout({ children }: CaseStudyLayoutProps) {
    return (
        <div className="space-y-10 md:space-y-14">
            {children}
        </div>
    );
}
