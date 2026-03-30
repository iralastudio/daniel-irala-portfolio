'use client';

interface Metric {
    value: string | number;
    label: string;
    suffix?: string;
}

interface CaseStudyMetricsProps {
    metrics: Metric[];
}

export function CaseStudyMetrics({ metrics }: CaseStudyMetricsProps) {
    return (
        <section className="py-8 md:py-10 border-y border-white/10">
            <div className={`grid grid-cols-2 lg:grid-cols-${Math.min(metrics.length, 4)} gap-y-8 gap-x-2`}>
                {metrics.map((metric, i) => (
                    <div key={metric.label} className="text-center relative px-1">
                        <div
                            className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-none"
                            style={{
                                background: 'linear-gradient(135deg, var(--line-profile) 0%, var(--line-projects) 50%, var(--line-thinking) 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            {metric.value}{metric.suffix || ''}
                        </div>
                        <div className="text-[10px] md:text-xs text-gray-400 mt-2 uppercase tracking-widest font-medium">
                            {metric.label}
                        </div>
                        {i < metrics.length - 1 && (
                            <div className="hidden lg:block absolute right-0 top-1/4 h-1/2 w-px bg-white/10" />
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
