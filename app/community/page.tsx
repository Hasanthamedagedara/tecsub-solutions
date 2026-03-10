import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BetaCommunity from "@/components/BetaCommunity";

export const metadata: Metadata = {
    title: "Beta Community | Tecsub Solutions",
    description: "Join the Tecsub Beta Testing Community, collaborate securely, give feedback, and unlock exclusive features before anyone else.",
    openGraph: {
        title: "Beta Community | Tecsub Solutions",
        description: "Join the Tecsub Beta Testing Community, collaborate securely, give feedback, and unlock exclusive features before anyone else."
    }
};

export default function CommunityPage() {
    return (
        <div className="min-h-screen" style={{ background: "var(--yt-bg)" }}>
            <Navbar />
            <div className="pt-24 sm:pt-28">
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                    <h1 className="font-bebas text-5xl sm:text-7xl gradient-text leading-[0.95] mb-8 text-center mt-4">
                        TECSUB COMMUNITY
                    </h1>

                    <div className="mb-12">
                        <BetaCommunity />
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}
