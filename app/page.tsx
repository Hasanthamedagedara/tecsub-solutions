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

export default function Home() {
    const { language } = useAppContext();

    return (
        <>
            {/* Fixed Background — Canvas animation (z-index: 0-1) */}
            <HeroCanvas />

            {/* Invisible ad scripts (Popunder, Push, SmartLink — head-injected) */}
            <AdPlacement format="smart-link" />

            {/* Foreground — All interactive content (z-index: 10+) */}
            <div className="relative" style={{ zIndex: 10 }}>
                <Navbar />

                {/* ─── Hero Section ─── */}
                <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-16">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="text-center max-w-5xl mx-auto"
                    >
                        <motion.h1
                            className="font-bebas text-fluid-hero leading-[0.85] tracking-tight glow-text"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, delay: 0.3 }}
                        >
                            {product.name.split(" ").map((word, i) => (
                                <span key={i} className="block">
                                    {word}
                                </span>
                            ))}
                        </motion.h1>

                        <motion.p
                            className="mt-6 font-bebas text-xl sm:text-3xl md:text-4xl tracking-wider gradient-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            {t(language, "hero_tagline")}
                        </motion.p>

                        <motion.p
                            className="mt-4 text-xs sm:text-sm uppercase tracking-[0.3em]"
                            style={{ color: "var(--text-secondary)" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                        >
                            {t(language, "hero_subtitle")}
                        </motion.p>

                        {/* Core Specs */}
                        <motion.div
                            className="mt-10 flex flex-wrap justify-center gap-4 sm:gap-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.8 }}
                        >
                            {product.coreSpecs.map((spec) => (
                                <div
                                    key={spec.label}
                                    className="flex items-center gap-2 glass-panel px-4 py-2"
                                >
                                    <span className="text-lg">{spec.icon}</span>
                                    <span className="text-xs sm:text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                                        {spec.label}
                                    </span>
                                </div>
                            ))}
                        </motion.div>

                        {/* Scroll Indicator */}
                        <motion.div
                            className="mt-16"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2.2 }}
                        >
                            <p className="text-xs uppercase tracking-[0.3em] mb-4" style={{ color: "var(--text-secondary)" }}>
                                {t(language, "scroll_explore")}
                            </p>
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                className="mx-auto w-6 h-10 rounded-full border-2 border-tecsubCyan/30 flex items-start justify-center pt-2"
                            >
                                <div className="w-1 h-2 rounded-full bg-tecsubCyan" />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* ─── Recent Updates ─── */}
                <RecentUpdates />
                <div className="section-divider mx-4" />

                {/* ─── YouTube Banner ─── */}
                <YouTubeBanner />

                {/* ─── Ad: Banner after hero ─── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                    <AdPlacement format="banner" />
                </div>

                {/* ─── Online Tools ─── */}
                <OnlineTools />

                {/* ─── Ad: In-Content between sections ─── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AdPlacement format="in-content" />
                </div>
                <div className="section-divider mx-4" />

                {/* ─── Tech News ─── */}
                <TechNews />
                <div className="section-divider mx-4" />

                {/* ─── AI Lab, App Forge, Software, Videos, Social ─── */}
                <ContentSections />

                {/* ─── Ad: Native between major sections ─── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                    <AdPlacement format="native" />
                </div>
                <div className="section-divider mx-4" />

                {/* ─── AI Prompts ─── */}
                <AIPromptHub />

                {/* ─── Ad: Banner before courses ─── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AdPlacement format="banner" />
                </div>
                <div className="section-divider mx-4" />

                {/* ─── Courses & Payments ─── */}
                <CoursePlatform />
                <div className="section-divider mx-4" />

                {/* ─── Beta Community ─── */}
                <BetaCommunity />

                {/* ─── Ad: Banner before footer ─── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                    <AdPlacement format="in-content" />
                </div>

                {/* ─── Footer ─── */}
                <Footer />
            </div>
        </>
    );
}
