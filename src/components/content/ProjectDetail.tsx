'use client';

import { useModal } from '@/hooks/useModal';

// Temporary data store for projects. Ideally moved to src/data/projects.ts
const projectsData: Record<string, { title: string; client: string; desc: string; role: string }> = {
    'meeting-experience': {
        title: 'E2E Meeting Experience',
        client: 'Global Organization',
        role: 'Service Design Lead',
        desc: 'Redesigned the entire meeting lifecycle for 50,000+ employees, integrating physical room hardware with digital scheduling tools.'
    },
    'product-offering': {
        title: 'E2E IT Product Offering',
        client: 'Public Sector',
        role: 'Product Strategy',
        desc: 'Defined the service catalog and delivery model for a government IT department transforming into a product-led organization.'
    },
    'it-key-roles': {
        title: 'E2E IT Key Roles',
        client: 'Tech Corp',
        role: 'Governance Design',
        desc: 'Mapped and restructured the key decision-making roles within a complex IT organization to improve velocity and accountability.'
    }
};

export function ProjectDetail() {
    const { activeStop } = useModal();
    const project = activeStop ? projectsData[activeStop] : null;

    if (!project) return <div>Project not found</div>;

    return (
        <div className="space-y-8">
            <div>
                <div className="text-[var(--line-projects)] text-sm font-bold uppercase tracking-widest mb-2">
                    {project.client}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{project.title}</h2>
                <div className="h-1 w-20 bg-[var(--line-projects)] rounded-full" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <div className="text-gray-500">Role</div>
                    <div className="text-white">{project.role}</div>
                </div>
                <div>
                    <div className="text-gray-500">Year</div>
                    <div className="text-white">2024</div>
                </div>
            </div>

            <div className="prose prose-invert max-w-none">
                <p className="text-lg text-gray-300 leading-relaxed">
                    {project.desc}
                </p>
                <p className="text-gray-400">
                    [Detailed case study content would go here, including &quot;The Challenge&quot;, &quot;The Process&quot;,
                    and &quot;The Outcome&quot; sections with images/metrics.]
                </p>
            </div>
        </div>
    );
}
