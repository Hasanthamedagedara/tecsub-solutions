"use client";

import { motion } from "framer-motion";
import { product } from "@/data/product";
import { useAppContext } from "@/components/ThemeProvider";
import { t } from "@/data/translations";

import Navbar from "@/components/Navbar";
import HeroCanvas from "@/components/HeroCanvas";
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
            {/* Fixed Background — Canvas animation */}
            <HeroCanvas />

            {/* Foreground — All interactive content */}
            <div className="relative" style={{ zIndex: 10 }}>
                <Navbar />

                {/* ─── Discovery Feed (Primary Home Content) ─── */}
                <div id="discovery-feed" className="pt-14 lg:pt-24">
                    <DiscoveryFeed />
                </div>
                <div className="section-divider mx-4" />

                {/* ─── Hero Brand Banner ─── */}
                <section className="py-16 sm:py-24 flex items-center justify-center px-4 sm:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="text-center max-w-5xl mx-auto"
                    >
                        <motion.h1
                            className="font-bebas text-fluid-xl leading-[0.85] tracking-tight glow-text"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, delay: 0.2 }}
                        >
                            {product.name.split(" ").map((word, i) => (
                                <span key={i} className="block">
                                    {word}
                                </span>
                            ))}
                        </motion.h1>

                        <motion.p
                            className="mt-4 font-bebas text-xl sm:text-2xl md:text-3xl tracking-wider gradient-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            {t(language, "hero_tagline")}
                        </motion.p>

                        <motion.p
                            className="mt-3 text-xs sm:text-sm uppercase tracking-[0.3em]"
                            style={{ color: "var(--text-secondary)" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                        >
                            {t(language, "hero_subtitle")}
                        </motion.p>

                        {/* Core Specs */}
                        <motion.div
                            className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-5"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.1 }}
                        >
                            {product.coreSpecs.map((spec) => (
                                <div
                                    key={spec.label}
                                    className="flex items-center gap-2 glass-panel px-3 py-1.5"
                                >
                                    <span className="text-base">{spec.icon}</span>
                                    <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                                        {spec.label}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>
                </section>
                <div className="section-divider mx-4" />

                {/* ─── Recent Updates ─── */}
                <div id="recent-updates">
                    <RecentUpdates />
                </div>
                <div className="section-divider mx-4" />

                {/* ─── YouTube Banner ─── */}
                <YouTubeBanner />


                {/* ─── Online Tools ─── */}
                <div id="online-tools">
                    <OnlineTools />
                </div>

                <div className="section-divider mx-4" />

                {/* ─── Tech News ─── */}
                <TechNews />

                <div className="section-divider mx-4 mt-8" />



                {/* ─── AI Lab, App Forge, Software, Videos, Social ─── */}
                <div id="content-sections">
                    <ContentSections />
                </div>

                <div className="section-divider mx-4" />

                {/* ─── AI Prompts ─── */}
                <div id="ai-prompts">
                    <AIPromptHub />
                </div>

                <div className="section-divider mx-4" />

                {/* ─── Courses & Payments ─── */}
                <CoursePlatform />
                <div className="section-divider mx-4" />

                {/* ─── Beta Community ─── */}
                <BetaCommunity />

                {/* ─── Ad: Full banner + native before footer ─── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
                    <AdPlacement format="banner" />
                </div>


                {/* ─── Footer ─── */}
                <Footer />
            </div>
        </>
    );
}
