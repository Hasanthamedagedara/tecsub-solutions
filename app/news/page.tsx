import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdPlacement from "@/components/AdPlacement";
import TechNews from "@/components/TechNews";
import RecentUpdates from "@/components/RecentUpdates";

export const metadata: Metadata = {
    title: "News & Technology Updates | Tecsub Solutions",
    description: "Stay up-to-date with the latest tech news, industry trends, and recent software updates from Tecsub Solutions.",
    openGraph: {
        title: "News & Technology Updates | Tecsub Solutions",
        description: "Stay up-to-date with the latest tech news, industry trends, and recent software updates from Tecsub Solutions.",
    }
};

export default function NewsPage() {
    return (
        <div className="min-h-screen" style={{ background: "var(--yt-bg)" }}>
            <Navbar />
            <div className="pt-24 sm:pt-28">
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                    <h1 className="font-bebas text-5xl sm:text-7xl gradient-text leading-[0.95] mb-8 text-center mt-4">
                        TECH NEWS & UPDATES
                    </h1>

                    <div className="mb-12">
                        <RecentUpdates />
                    </div>

                    <div className="section-divider my-8" />

                    <div className="mb-12">
                        <TechNews />
                    </div>

                    <div className="my-8">
                        <AdPlacement format="banner" />
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}
