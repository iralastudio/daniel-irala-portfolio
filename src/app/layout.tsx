import type { Metadata } from "next";
import { Providers } from "./providers";
import { montserrat, openSans } from "@/styles/fonts";
import { cn } from "@/lib/cn";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL("https://daniel-irala-portfolio.vercel.app"),
    title: "Daniel Irala | Design Researcher & Service Designer",
    description:
        "Senior Design Researcher and Service Designer at Nestlé IT. Qualitative and quantitative research, " +
        "service design, systems thinking, and journey management in large enterprise environments. Based in Barcelona.",
    keywords: [
        "Design Researcher",
        "Service Designer",
        "UX Research",
        "Systems Thinking",
        "Journey Mapping",
        "Enterprise Design",
        "Qualitative Research",
        "Barcelona",
    ],
    authors: [{ name: "Daniel Irala" }],
    openGraph: {
        title: "Daniel Irala | Design Researcher & Service Designer",
        description:
            "Making meaning out of chaos because clarity is a form of kindness. " +
            "Senior Design Researcher & Service Designer at Nestlé IT.",
        type: "website",
        url: "https://daniel-irala-portfolio.vercel.app",
        siteName: "Daniel Irala",
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Daniel Irala",
    jobTitle: "Senior Design Researcher and Service Designer",
    description:
        "Design Researcher and Service Designer specialising in qualitative and quantitative research, " +
        "service design, systems thinking, and journey management in large enterprise environments.",
    email: "daniel.irala.v@gmail.com",
    sameAs: ["https://www.linkedin.com/in/danirala"],
    address: { "@type": "PostalAddress", addressLocality: "Barcelona", addressCountry: "ES" },
    worksFor: { "@type": "Organization", name: "Nestlé", url: "https://www.nestle.com" },
    knowsAbout: [
        "UX Research",
        "Service Design",
        "Systems Thinking",
        "Journey Mapping",
        "Qualitative Research",
        "Quantitative Research",
        "Enterprise UX",
        "Design Maturity",
        "Co-design Facilitation",
        "Service Blueprinting",
    ],
    url: "https://daniel-irala-portfolio.vercel.app",
};

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body
                className={cn(
                    montserrat.variable,
                    openSans.variable,
                    "antialiased min-h-screen bg-background text-ink"
                )}
            >
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
