'use client';

interface CaseStudyHeroProps {
    category: string;
    title: string;
    lineColor?: 'projects' | 'profile' | 'thinking';
}

export function CaseStudyHero({ category, title, lineColor = 'projects' }: CaseStudyHeroProps) {
    const colorVar = `var(--line-${lineColor})`;

    return (
        <div>
            <div
                className="text-xs md:text-sm font-bold uppercase tracking-widest mb-2"
                style={{ color: colorVar }}
            >
                {category}
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 leading-tight">
                {title}
            </h2>
            <div
                className="h-1 w-16 md:w-20 rounded-full"
                style={{ backgroundColor: colorVar }}
            />
        </div>
    );
}
