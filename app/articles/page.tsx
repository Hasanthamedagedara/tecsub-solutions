import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticlesClient from "./ArticlesClient";

export const metadata: Metadata = {
    title: "Engineering Articles, Tech News & Tutorials | Tecsub Solutions",
    description: "Read professional technology guides, Next.js architecture insights, AI trends, and local Sri Lankan business SEO strategies curated by Tecsub Solutions.",
    keywords: [
        "Tecsub Articles", "Tech News Sri Lanka", "Software Engineering Guides", 
        "AI Development Trends 2026", "Next.js performance optimization", 
        "Local SEO Sri Lanka", "Web scrapers prevention", "Hasantha Medagedara articles"
    ],
    openGraph: {
        title: "Engineering Articles & Tech News | Tecsub Solutions",
        description: "Read professional technology guides, Next.js architecture insights, AI trends, and local Sri Lankan business SEO strategies curated by Tecsub Solutions.",
        url: "https://tecsub.online/articles",
        type: "website"
    }
};

export default function ArticlesPage() {
    return (
        <div className="min-h-screen relative overflow-hidden" style={{ background: "var(--yt-bg, #0A0A0B)" }}>
            {/* Background decorative glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[150px] pointer-events-none" />

            <Navbar />

            <div className="pt-24 sm:pt-28 pb-20 relative z-10">
                <main>
                    <ArticlesClient />
                </main>
            </div>

            <Footer />
        </div>
    );
}
