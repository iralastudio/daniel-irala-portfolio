'use client';

import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface SplitScreenProps {
    children: ReactNode; // The MetroMap
}

export function SplitScreen({ children }: SplitScreenProps) {
    return (
        <div className="relative min-h-screen flex flex-col md:flex-row overflow-hidden">

            {/* Left Panel: Content / Intro with Glass Effect */}
            <div className="w-full md:w-[40%] h-auto md:h-screen flex flex-col order-1 md:order-1 relative z-10 transition-all duration-500 ease-in-out border-b md:border-b-0 md:border-r border-white/10">
                {/* Glass effect background */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[20px] pointer-events-none -z-10" />

                <div className="flex-1">
                    <Header />
                </div>
                
                <div className="hidden md:block border-t border-white/5 bg-black/20 backdrop-blur-md">
                    <Footer />
                </div>
            </div>

            {/* Right Panel: Interactive Map */}
            <main className="w-full md:w-[60%] h-[70vh] md:h-screen order-2 md:order-2 relative bg-gray-950 overflow-hidden shadow-2xl transition-all duration-500 ease-in-out">
                {/* City Background Texture */}
                <div className="absolute inset-0 bg-[url('/images/Background-page-city.png')] bg-cover bg-center pointer-events-none" />

                {/* Dark overlay to make metro lines visible */}
                <div className="absolute inset-0 bg-black/70 pointer-events-none" />

                {children}
            </main>

            {/* Mobile Footer */}
            <div className="md:hidden order-3 p-4 bg-background">
                <Footer />
            </div>
        </div>
    );
}
