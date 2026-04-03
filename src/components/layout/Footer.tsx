'use client';

export function Footer() {
    return (
        <footer className="w-full py-4 md:py-6 px-8 text-xs md:text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4 z-10 relative">
            <div className="flex gap-4">
                <span>&copy; {new Date().getFullYear()} irala.studio</span>
            </div>
            <div className="flex gap-4">
                <a href="mailto:hello.daniel@irala.studio" className="hover:text-foreground transition-all duration-300">
                    hello.daniel@irala.studio
                </a>
            </div>
        </footer>
    );
}
