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
            {/* Fixed Background — Canvas animation */}
            <HeroCanvas />

            {/* Foreground — All interactive content */}
            <div className="relative" style={{ zIndex: 10 }}>
                <Navbar />

                {/* ─── Ad: Top Banner (728×90 / 320×50) ─── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
                    <AdPlacement format="banner" />
                </div>

                {/* ─── Hero Section ─── */}
                <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-8">
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

                {/* ─── Ad: Banner after hero (728×90 / 320×50) ─── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                    <AdPlacement format="banner" />
                </div>

                {/* ─── Online Tools ─── */}
                <OnlineTools />

                {/* ─── Ad: Native between Online Tools & Tech News ─── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AdPlacement format="native" />
                </div>
                <div className="section-divider mx-4" />

                {/* ─── Tech News ─── */}
                <TechNews />

                {/* ─── Ad: Medium Banner + Rectangle after Tech News ─── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
                    <AdPlacement format="banner-md" />
                    <AdPlacement format="rectangle" className="hidden sm:flex" />
                </div>
                <div className="section-divider mx-4 mt-8" />

                {/* ─── Ad: Native before AI Lab ─── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                    <AdPlacement format="in-content" />
                </div>

                {/* ─── AI Lab, App Forge, Software, Videos, Social ─── */}
                <ContentSections />

                {/* ─── Ad: Content with sidebars after Content Sections ─── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-4">
                    <div className="flex justify-center gap-6">
                        {/* Left Sidebar ad — desktop only */}
                        <div className="hidden lg:block flex-shrink-0">
                            <AdPlacement format="sidebar-short" />
                        </div>
                        {/* Center Native ad */}
                        <div className="flex-1 max-w-2xl">
                            <AdPlacement format="native" />
                        </div>
                        {/* Right Sidebar ad — desktop only */}
                        <div className="hidden lg:block flex-shrink-0">
                            <AdPlacement format="sidebar-short" />
                        </div>
                    </div>
                </div>
                <div className="section-divider mx-4" />

                {/* ─── AI Prompts ─── */}
                <AIPromptHub />

                {/* ─── Ad: Banner before courses (468×60 / 320×50) ─── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AdPlacement format="banner-md" />
                </div>

                {/* ─── Ad: Rectangle ad (300×250) ─── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                    <AdPlacement format="rectangle" />
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                    <AdPlacement format="in-content" />
                </div>

                {/* ─── Footer ─── */}
                <Footer />
            </div>
        </>
    );
}
