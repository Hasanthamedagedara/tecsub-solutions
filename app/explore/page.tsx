import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdPlacement from "@/components/AdPlacement";
import ContentSections from "@/components/ContentSections";

export const metadata: Metadata = {
    title: "Explore Hub | Tecsub Solutions",
    description: "Explore AI Lab, App Forge, Software libraries, Videos, and our social media channels to discover cutting-edge solutions.",
    openGraph: {
        title: "Explore Hub | Tecsub Solutions",
        description: "Explore AI Lab, App Forge, Software libraries, Videos, and our social media channels to discover cutting-edge solutions."
    }
};

export default function ExplorePage() {
    return (
        <div className="min-h-screen" style={{ background: "var(--yt-bg)" }}>
            <Navbar />
            <div className="pt-24 sm:pt-28">
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                    <h1 className="font-bebas text-5xl sm:text-7xl gradient-text leading-[0.95] mb-8 text-center mt-4 uppercase">
                        Explore Our Content
                    </h1>

                    <div className="mb-12">
                        <ContentSections />
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
