import { ScaleExperience } from '@/components/scale/ScaleExperience';
import { CrawlableContent } from '@/components/scale/CrawlableContent';

// The visible experience is the interactive system map + click-to-open windows.
// CrawlableContent is a hidden, server-rendered mirror so the substance stays
// readable to search engines and screen readers without the canvas.
export default function Home() {
    return (
        <main className="relative">
            <CrawlableContent />
            <ScaleExperience />
        </main>
    );
}
