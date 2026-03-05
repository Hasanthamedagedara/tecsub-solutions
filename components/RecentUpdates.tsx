"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/components/ThemeProvider";
import EngagementBar from "@/components/EngagementBar";

/* ─── Update Data ─── */
const recentUpdates = [
    {
        id: 1,
        title: "Website v3.0 Launched with New Design System",
        description: "Complete redesign featuring glassmorphism, dynamic animations, and bilingual support across all pages.",
        category: "Website",
        type: "release",
        date: "2026-02-22",
        time: "10:30 AM",
        isNew: true,
    },
    {
        id: 2,
        title: "AI Prompt Library — 50+ New Prompts Added",
        description: "New curated AI prompts for marketing, development, and content creation workflows.",
        category: "AI",
        type: "feature",
        date: "2026-02-22",
        time: "09:15 AM",
        isNew: true,
    },
    {
        id: 3,
        title: "Tecsub Recorder v2.0 Update Released",
        description: "Smart zoom, floating toolbar, 9:16 social mode, and audio recording improvements.",
        category: "Software",
        type: "update",
        date: "2026-02-21",
        time: "04:00 PM",
        isNew: false,
    },
    {
        id: 4,
        title: "Online Tools Section Now Live",
        description: "12 free browser-based tools — JSON formatter, image compressor, QR generator, and more.",
        category: "Tools",
        type: "feature",
        date: "2026-02-21",
        time: "11:30 AM",
        isNew: false,
    },
    {
        id: 5,
        title: "New YouTube Content: AI Website Review Series",
        description: "Weekly deep-dive reviews analyzing real websites with AI-powered insights.",
        category: "Content",
        type: "content",
        date: "2026-02-20",
        time: "02:00 PM",
        isNew: false,
    },
    {
        id: 6,
        title: "Course Platform — Crypto Payments Enabled",
        description: "Pay for courses with USDT (TRC20) via Binance or Bybit wallets.",
        category: "Platform",
        type: "feature",
        date: "2026-02-20",
        time: "10:00 AM",
        isNew: false,
    },
    {
        id: 7,
        title: "Tech News Feed Integration Complete",
        description: "Daily curated tech news covering AI, quantum computing, mobile, and software developments.",
        category: "Website",
        type: "update",
        date: "2026-02-19",
        time: "03:45 PM",
        isNew: false,
    },
    {
        id: 8,
        title: "Beta Community Sign-Up Open",
        description: "Join the TecSub beta community for early access to new tools and software releases.",
        category: "Community",
        type: "announcement",
        date: "2026-02-19",
        time: "09:00 AM",
        isNew: false,
    },
];

/* ─── Category Colors ─── */
const categoryColors: Record<string, string> = {
    Website: "#00E5FF",
    AI: "#FF4444",
    Software: "#A855F7",
    Tools: "#22C55E",
    Content: "#F59E0B",
    Platform: "#3B82F6",
    Community: "#EC4899",
};

/* ─── Type Icons ─── */
const typeIcons: Record<string, string> = {
    release: "🚀",
    feature: "✨",
    update: "🔄",
    content: "🎬",
    announcement: "📢",
};

/* ─── Ticker Component ─── */
function UpdateTicker() {
    const tickerItems = recentUpdates.filter((u) => u.isNew);

    return (
        <div className="relative overflow-hidden h-8 mb-6">
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--navy)] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--navy)] to-transparent z-10 pointer-events-none" />
            <motion.div
                className="flex items-center gap-8 whitespace-nowrap"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                {[...tickerItems, ...tickerItems].map((item, i) => (
                    <span key={i} className="flex items-center gap-2 text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-tecsubCyan animate-pulse" />
                        <span style={{ color: "var(--text-primary)" }}>{item.title}</span>
                        <span style={{ color: "var(--text-secondary)" }}>• {item.time}</span>
                    </span>
                ))}
            </motion.div>
        </div>
    );
}

/* ─── Main Component ─── */
export default function RecentUpdates() {
    const { language } = useAppContext();
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const [showAll, setShowAll] = useState(false);
    const [selectedUpdate, setSelectedUpdate] = useState<(typeof recentUpdates)[number] | null>(null);

    const visibleUpdates = showAll ? recentUpdates : recentUpdates.slice(0, 4);

    return (
        <>
            <motion.section
                id="updates"
                ref={ref}
                initial={{ opacity: 0, y: 60 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="relative z-10 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
            >
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 sm:mb-12 gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            {/* Live Pulse Indicator */}
                            <div className="relative flex items-center justify-center">
                                <span className="absolute w-4 h-4 rounded-full bg-green-500/30 animate-ping" />
                                <span className="relative w-2.5 h-2.5 rounded-full bg-green-500" />
                            </div>
                            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-green-400">
                                Live Updates
                            </span>
                        </div>
                        <h2 className="font-bebas text-4xl sm:text-6xl md:text-7xl gradient-text leading-[0.95]">
                            Recent Updates
                        </h2>
                        <p className="mt-3 text-base sm:text-lg max-w-xl font-light" style={{ color: "var(--text-secondary)" }}>
                            Stay in the loop — latest releases, features, and announcements.
                        </p>
                    </div>

                    {/* Today's Date Badge */}
                    <div className="glass-panel px-4 py-2 flex items-center gap-2 flex-shrink-0">
                        <svg className="w-4 h-4 text-tecsubCyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                            {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                        </span>
                    </div>
                </div>

                {/* Scrolling Ticker */}
                <UpdateTicker />

                {/* Updates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence mode="popLayout">
                        {visibleUpdates.map((update, i) => (
                            <motion.div
                                key={update.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                                className="glass-panel p-5 sm:p-6 card-hover group cursor-pointer relative overflow-hidden"
                                onClick={() => setSelectedUpdate(update)}
                            >
                                {/* New Badge */}
                                {update.isNew && (
                                    <div className="absolute top-3 right-3 px-2.5 py-0.5 bg-green-500/20 border border-green-500/30 rounded-full">
                                        <span className="text-[10px] uppercase tracking-widest font-bold text-green-400">New</span>
                                    </div>
                                )}

                                {/* Glow line on left */}
                                <div
                                    className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                                    style={{ background: categoryColors[update.category] || "#00E5FF" }}
                                />

                                <div className="pl-4">
                                    {/* Meta Row */}
                                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                                        <span className="text-sm">{typeIcons[update.type] || "📌"}</span>
                                        <span
                                            className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full"
                                            style={{
                                                color: categoryColors[update.category] || "#00E5FF",
                                                background: `${categoryColors[update.category] || "#00E5FF"}15`,
                                                border: `1px solid ${categoryColors[update.category] || "#00E5FF"}30`,
                                            }}
                                        >
                                            {update.category}
                                        </span>
                                        <span className="text-[10px] ml-auto" style={{ color: "var(--text-secondary)" }}>
                                            {update.date} • {update.time}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3
                                        className="font-semibold text-sm sm:text-base mb-1.5 group-hover:text-tecsubCyan transition-colors duration-300 leading-snug"
                                        style={{ color: "var(--text-primary)" }}
                                    >
                                        {update.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                                        {update.description}
                                    </p>
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <EngagementBar contentId={`update-${update.id}`} contentType="update" compact />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Show More / Less */}
                {recentUpdates.length > 4 && (
                    <motion.div
                        className="mt-8 text-center"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.5 }}
                    >
                        <button
                            onClick={() => setShowAll(!showAll)}
                            className="group inline-flex items-center gap-2 px-6 py-3 glass-panel text-sm font-semibold hover:border-tecsubCyan/30 transition-all duration-300"
                            style={{ color: "var(--text-primary)" }}
                        >
                            {showAll ? "Show Less" : `View All Updates (${recentUpdates.length})`}
                            <motion.svg
                                className="w-4 h-4 text-tecsubCyan"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                animate={{ rotate: showAll ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </motion.svg>
                        </button>
                    </motion.div>
                )}
            </motion.section>

            {/* Update Detail Modal */}
            <AnimatePresence>
                {selectedUpdate && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal-overlay"
                        onClick={() => setSelectedUpdate(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass-panel p-6 sm:p-8 max-w-lg w-full"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{typeIcons[selectedUpdate.type] || "📌"}</span>
                                    <span
                                        className="text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full"
                                        style={{
                                            color: categoryColors[selectedUpdate.category] || "#00E5FF",
                                            background: `${categoryColors[selectedUpdate.category] || "#00E5FF"}15`,
                                            border: `1px solid ${categoryColors[selectedUpdate.category] || "#00E5FF"}30`,
                                        }}
                                    >
                                        {selectedUpdate.category}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setSelectedUpdate(null)}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                    style={{ color: "var(--text-secondary)" }}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <h3 className="font-bebas text-2xl sm:text-3xl tracking-wide mb-2" style={{ color: "var(--text-primary)" }}>
                                {selectedUpdate.title}
                            </h3>

                            <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
                                {selectedUpdate.date} • {selectedUpdate.time}
                            </p>

                            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                                {selectedUpdate.description}
                            </p>

                            <div className="mt-6">
                                <button
                                    onClick={() => setSelectedUpdate(null)}
                                    className="px-6 py-2.5 rounded-full bg-tecsubCyan text-tecsubNavy font-semibold text-sm hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all duration-300"
                                >
                                    Got it
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
