"use client";

import { motion } from "framer-motion";
import { product } from "@/data/product";
import { useAppContext } from "@/components/ThemeProvider";
import { t } from "@/data/translations";

import Navbar from "@/components/Navbar";
import RecentUpdates from "@/components/RecentUpdates";
import YouTubeBanner from "@/components/YouTubeBanner";
import OnlineTools from "@/components/OnlineTools";
import TechNews from "@/components/TechNews";
import ContentSections from "@/components/ContentSections";
import AIPromptHub from "@/components/AIPromptHub";
import CoursePlatform from "@/components/CoursePlatform";
import BetaCommunity from "@/components/BetaCommunity";
import AdPlacement from "@/components/AdPlacement";
import Footer from "@/components/Footer";
import DiscoveryFeed from "@/components/DiscoveryFeed";

export default function Home() {
    const { language } = useAppContext();

    return (
        <>
            {/* ─── YouTube Header Bar ─── */}
            <Navbar />

            {/* ─── Content Area (with sidebar margin on desktop) ─── */}
            <div className="yt-content" id="yt-content">

                {/* ─── Discovery Feed (Primary Home Content) ─── */}
                <DiscoveryFeed />

                <div className="section-divider my-8" />

                {/* ─── Hero Brand Banner ─── */}
                <section className="py-12 sm:py-16 flex items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <motion.h1
                            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
                            style={{ color: "var(--yt-text-primary)" }}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                        >
                            {product.name.split(" ").map((word, i) => (
                                <span key={i} className="block">
                                    {word}
                                </span>
                            ))}
                        </motion.h1>

                        <motion.p
                            className="mt-4 text-lg sm:text-xl md:text-2xl font-medium"
                            style={{ color: "var(--yt-accent)" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {t(language, "hero_tagline")}
                        </motion.p>

                        <motion.p
                            className="mt-3 text-sm uppercase tracking-[0.2em]"
                            style={{ color: "var(--yt-text-secondary)" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            {t(language, "hero_subtitle")}
                        </motion.p>

                        {/* Core Specs */}
                        <motion.div
                            className="mt-6 flex flex-wrap justify-center gap-3"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                            {product.coreSpecs.map((spec) => (
                                <div
                                    key={spec.label}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg"
                                    style={{
                                        background: "var(--yt-bg-secondary)",
                                        border: "1px solid var(--yt-border)",
                                    }}
                                >
                                    <span className="text-base">{spec.icon}</span>
                                    <span className="text-xs font-medium" style={{ color: "var(--yt-text-primary)" }}>
                                        {spec.label}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </section>

                <div className="section-divider my-4" />

                {/* ─── Recent Updates ─── */}
                <div id="recent-updates">
                    <RecentUpdates />
                </div>
                <div className="section-divider my-4" />

                {/* ─── YouTube Banner ─── */}
                <YouTubeBanner />

                {/* ─── Online Tools ─── */}
                <div id="online-tools">
                    <OnlineTools />
                </div>
                <div className="section-divider my-4" />

                {/* ─── Tech News ─── */}
                <TechNews />
                <div className="section-divider my-4" />

                {/* ─── AI Lab, App Forge, Software, Videos, Social ─── */}
                <div id="content-sections">
                    <ContentSections />
                </div>
                <div className="section-divider my-4" />

                {/* ─── AI Prompts ─── */}
                <div id="ai-prompts">
                    <AIPromptHub />
                </div>
                <div className="section-divider my-4" />

                {/* ─── Courses & Payments ─── */}
                <CoursePlatform />
                <div className="section-divider my-4" />

                {/* ─── Beta Community ─── */}
                <BetaCommunity />

                {/* ─── Ad ─── */}
                <div className="max-w-full mx-auto mb-4 mt-8">
                    <AdPlacement format="banner" />
                </div>

                {/* ─── Footer ─── */}
                <Footer />
            </div>
        </>
    );
}
