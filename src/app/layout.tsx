import type { Metadata } from "next";
import { Providers } from "./providers";
import { Modal } from "@/components/modal/Modal";
import { AccessibilityPanel } from "@/components/accessibility/AccessibilityPanel";
import { ReadingGuide } from "@/components/accessibility/ReadingGuide";
import { montserrat, openSans } from "@/styles/fonts";
import { cn } from "@/lib/cn";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daniel Irala | Service Design Lead & Systems Innovator",
  description: "Making meaning out of chaos because clarity is a form of kindness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          montserrat.variable,
          openSans.variable,
          "antialiased min-h-screen bg-background text-foreground"
        )}
      >
        <Providers>
          {children}
          <Modal />
          <AccessibilityPanel />
          <ReadingGuide />
        </Providers>
      </body>
    </html>
  );
}
