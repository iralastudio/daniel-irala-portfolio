'use client';

import { Mail, Calendar, Linkedin } from 'lucide-react';

export function Contact() {
    return (
        <div className="space-y-4 md:space-y-5">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Contact</h2>
            <div className="h-1 w-16 md:w-20 bg-[var(--line-profile)] rounded-full mb-4 md:mb-6" />

            <p className="text-sm md:text-base text-gray-300 mb-2 md:mb-3">
                Have a system that needs untangling? A challenge worth mapping? I&apos;m always up for a good conversation.
            </p>


            <div className="space-y-3 md:space-y-4">
                <a
                    href="mailto:hello.daniel@irala.studio"
                    className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group"
                >
                    <div className="p-2 md:p-3 bg-[var(--line-profile)] rounded-full text-black">
                        <Mail className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email</div>
                        <div className="text-sm md:text-base text-white group-hover:text-[var(--line-profile)] transition-colors">hello.daniel@irala.studio</div>
                    </div>
                </a>

                <a
                    href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ2fxy_N5qbgrZvCPAfFTvJ97XXNJhStTuhIqpavHL1ddoZpRTEdQRM2ZO3oF6rTtMUw03ycj4Zq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group"
                >
                    <div className="p-2 md:p-3 bg-[var(--line-profile)] rounded-full text-black">
                        <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Schedule</div>
                        <div className="text-sm md:text-base text-white group-hover:text-[var(--line-profile)] transition-colors">Book a meeting</div>
                    </div>
                </a>

                <a
                    href="https://www.linkedin.com/in/danirala/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors group"
                >
                    <div className="p-2 md:p-3 bg-[var(--line-profile)] rounded-full text-black">
                        <Linkedin className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">LinkedIn</div>
                        <div className="text-sm md:text-base text-white group-hover:text-[var(--line-profile)] transition-colors">Connect on LinkedIn</div>
                    </div>
                </a>
            </div>
        </div>
    );
}
