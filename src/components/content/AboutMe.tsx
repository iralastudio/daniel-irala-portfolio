'use client';

import Image from 'next/image';

export function AboutMe() {
    return (
        <div className="space-y-5 md:space-y-6">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">About Me</h2>
                <div className="h-1 w-16 md:w-20 bg-[var(--line-profile)] rounded-full" />
            </div>

            {/* Profile Image */}
            <div className="flex justify-center mb-3 md:mb-4">
                <div
                    className="relative w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border-3 transition-all duration-300"
                    style={{
                        borderWidth: '3px',
                        borderStyle: 'solid',
                        borderColor: 'var(--line-profile)',
                        boxShadow: '0 0 20px rgba(255, 120, 197, 0.4), 0 0 40px rgba(255, 120, 197, 0.2)'
                    }}
                >
                    <Image
                        src="/images/daniel-profile.png"
                        alt="Daniel Irala - Design Researcher"
                        fill
                        className="object-cover object-top"
                        style={{ objectPosition: '50% 20%' }}
                        priority
                    />
                </div>
            </div>

            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                I&apos;m Daniel Irala — a Service &amp; Systems Designer who makes the invisible visible.
            </p>

            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
                Organizations run on inherited architectures: handoffs no one owns, decisions made by ghosts of restructures past. I see these tangles as opportunities.
            </p>

            <p className="text-sm md:text-base text-gray-400/80 leading-relaxed mt-1">
                Currently Senior Design Researcher at Nestlé, fostering end-to-end journey design for IT experiences.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="glass-frontstage p-4 md:p-5 rounded-xl border border-[var(--line-profile)]/20 hover:border-[var(--line-profile)]/50 hover:shadow-[0_0_25px_rgba(255,120,197,0.12)] transition-all duration-300">
                    <h3 className="text-base md:text-lg font-bold text-[var(--line-profile)] mb-2">My approach</h3>
                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                        I map complexity, then redesign it with clarity and intention. Service systems, IT experiences, governance frameworks — wherever humans get lost in organizational noise.
                    </p>
                </div>
                <div className="glass-frontstage p-4 md:p-5 rounded-xl border border-[var(--line-profile)]/20 hover:border-[var(--line-profile)]/50 hover:shadow-[0_0_25px_rgba(255,120,197,0.12)] transition-all duration-300">
                    <h3 className="text-base md:text-lg font-bold text-[var(--line-profile)] mb-2">What drives me</h3>
                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                        Clarity is a form of care. Care at scale requires systems that see people — not as users or tickets, but as humans navigating complexity.
                    </p>
                </div>
                <div className="glass-frontstage p-4 md:p-5 rounded-xl border border-[var(--line-profile)]/20 hover:border-[var(--line-profile)]/50 hover:shadow-[0_0_25px_rgba(255,120,197,0.12)] transition-all duration-300">
                    <h3 className="text-base md:text-lg font-bold text-[var(--line-profile)] mb-2">How I see the future</h3>
                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                        The future isn&apos;t a destination — it&apos;s a set of possibilities we shape today. Every system we redesign is a choice about the kind of tomorrow we want.
                    </p>
                </div>
                <div className="glass-frontstage p-4 md:p-5 rounded-xl border border-[var(--line-profile)]/20 hover:border-[var(--line-profile)]/50 hover:shadow-[0_0_25px_rgba(255,120,197,0.12)] transition-all duration-300">
                    <h3 className="text-base md:text-lg font-bold text-[var(--line-profile)] mb-2">My foundation</h3>
                    <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
                        Behavioral science. Systems thinking. Futures thinking. And a stubborn belief that enterprise doesn&apos;t have to mean impersonal.
                    </p>
                </div>
            </div>
        </div>
    );
}
