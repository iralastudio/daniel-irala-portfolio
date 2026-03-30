'use client';

import { SplitScreen } from "@/components/layout/SplitScreen";
import dynamic from 'next/dynamic';

const MetroMap = dynamic(() => import('@/components/metro/MetroMap').then(mod => mod.MetroMap), {
  ssr: false, // Map relies on window hooks
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-background/50 backdrop-blur-sm animate-pulse">
      <div className="w-16 h-16 rounded-full border-4 border-t-[var(--line-projects)] border-r-[var(--line-profile)] border-b-[var(--line-thinking)] border-l-white/10 animate-spin" />
    </div>
  )
});

export default function Home() {
  return (
    <>
      <div className="animate-in fade-in duration-700">
        <SplitScreen>
          <MetroMap />
        </SplitScreen>
      </div>
    </>
  );
}
