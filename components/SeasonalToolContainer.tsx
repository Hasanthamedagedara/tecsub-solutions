"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdPlacement from "@/components/AdPlacement";

interface ToolDetails {
    title: string;
    description: string;
    icon: string;
    type: string;
    badge?: string;
    path: string;
    colorClass: string;
}

const TOOLS_METADATA: Record<string, ToolDetails> = {
    "digital-pandal": {
        title: "Digital Pandal Builder",
        description: "Build a live 2D digital Vesak/Poson Thorana with custom lighting patterns, devotional loop music, and sponsor banners.",
        icon: "☸️",
        type: "widget",
        badge: "INTERACTIVE",
        path: "/seasonal/digital-pandal.html",
        colorClass: "from-amber-600 to-yellow-400"
    },
    "digital-dansala": {
        title: "Digital Dansala Creator",
        description: "Generate and download a fun digital Dansala poster (Ice Cream, Rice, Chickpeas) with your custom name and photo.",
        icon: "🍧",
        type: "poster",
        badge: "FUN POSTER",
        path: "/seasonal/digital-dansala.html",
        colorClass: "from-amber-500 to-orange-500"
    },
    "verse-book": {
        title: "Digital Verse Book",
        description: "Design beautiful typography cards containing old Sinhala poems and Buddhist verses with serene temple backgrounds.",
        icon: "📜",
        type: "card",
        path: "/seasonal/verse-book.html",
        colorClass: "from-yellow-600 to-amber-700"
    },
    "avurudu-nakath": {
        title: "Avurudu Nakath Timers",
        description: "Real-time countdown clocks for Avurudu rituals (cooking, meals, work commencement) with traditional Rabana audio cues.",
        icon: "⏰",
        type: "utility",
        badge: "AUDIO TIMERS",
        path: "/seasonal/avurudu-nakath.html",
        colorClass: "from-emerald-500 to-teal-600"
    },
    "avurudu-greetings": {
        title: "Avurudu Ritual Greetings",
        description: "Create funny 'work commencement' cards (e.g. coding, sleeping, gaming) styled as traditional New Year greeting cards.",
        icon: "🧧",
        type: "card",
        path: "/seasonal/avurudu-greetings.html",
        colorClass: "from-emerald-600 to-green-500"
    },
    "avurudu-games": {
        title: "Traditional Mini Games",
        description: "Play interactive Sri Lankan village sports online, including Kana Muttiya (Strike the Pot) and Blindfold Elephant Eye.",
        icon: "🎮",
        type: "game",
        badge: "PLAY ONLINE",
        path: "/seasonal/avurudu-games.html",
        colorClass: "from-teal-600 to-emerald-700"
    },
    "santa-letter": {
        title: "Santa's Personalized Letter",
        description: "Surprise children with a customized letter from the North Pole featuring dynamic names, nice checks, and seal layouts.",
        icon: "🎅",
        type: "poster",
        path: "/seasonal/santa-letter.html",
        colorClass: "from-red-600 to-rose-500"
    },
    "secret-santa": {
        title: "Secret Santa Generator",
        description: "Organize gift exchanges easily. Match participants randomly and get private WhatsApp sharing strings.",
        icon: "🎁",
        type: "utility",
        path: "/seasonal/secret-santa.html",
        colorClass: "from-red-500 to-red-700"
    },
    "valentine-notes": {
        title: "Valentine Love Notes",
        description: "Share a private link to receive anonymous love notes from friends, and export gorgeous glassmorphic image cards.",
        icon: "💖",
        type: "card",
        badge: "ANONYMOUS",
        path: "/seasonal/valentine-notes.html",
        colorClass: "from-pink-500 to-rose-500"
    },
    "exam-wishers": {
        title: "Exam Result Fun Poster",
        description: "Create congratulations templates for O/L or A/L results with customizable names, school tags, and custom scores.",
        icon: "🎓",
        type: "poster",
        badge: "AL/OL SEASON",
        path: "/seasonal/exam-wishers.html",
        colorClass: "from-indigo-600 to-blue-500"
    },
    "resolution-card": {
        title: "New Year Resolution Card",
        description: "Draft 5 key goals for the upcoming year and export a gorgeous portrait card optimized for sharing on Instagram or Facebook Stories.",
        icon: "🎯",
        type: "card",
        path: "/seasonal/resolution-card.html",
        colorClass: "from-indigo-500 to-purple-600"
    }
};

export default function SeasonalToolContainer({ toolSlug }: { toolSlug: string }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    const tool = TOOLS_METADATA[toolSlug];

    if (!tool) {
        return (
            <div className="min-h-screen text-[#f1f1f1] flex flex-col justify-between" style={{ background: "#0a0a0b" }}>
                <Navbar />
                <div className="pt-32 pb-20 px-4 text-center flex-1 flex flex-col items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-4xl mb-6">
                        ⚠️
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
                        Tool Not Found
                    </h1>
                    <p className="text-[#888] text-sm md:text-base max-w-md mb-8">
                        The seasonal tool you are looking for does not exist or may have been relocated.
                    </p>
                    <button
                        onClick={() => router.push("/tools/seasonal")}
                        className="px-6 py-3 bg-white text-black font-black uppercase tracking-wider text-xs rounded-xl hover:bg-white/90 transition-all"
                    >
                        Back to Seasonal Tools
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen text-[#f1f1f1]" style={{ background: "#0a0a0b" }}>
            <Navbar />

            <div className="pt-32 pb-20 px-4">
                <div className={`mx-auto transition-all duration-500 ${isExpanded ? "max-w-none px-2 md:px-6" : "max-w-5xl"}`}>
                    {/* Back button */}
                    <button
                        onClick={() => router.push("/tools/seasonal")}
                        className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white/50 hover:text-white mb-8 transition-colors"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:-translate-x-1 transition-transform">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Seasonal
                    </button>

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/5 pb-8">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-3xl shrink-0">
                                {tool.icon}
                            </div>
                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                    <h1 className="text-xl md:text-3xl font-black uppercase tracking-tight text-white">
                                        {tool.title}
                                    </h1>
                                    {tool.badge && (
                                        <span className="px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[8px] font-black tracking-widest rounded">
                                            {tool.badge}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs md:text-sm text-[#888] leading-relaxed max-w-2xl font-light">
                                    {tool.description}
                                </p>
                            </div>
                        </div>

                        {/* Top controls */}
                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                            {/* Expand toggle */}
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                                title={isExpanded ? "Standard width view" : "Wide screen view"}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    {isExpanded ? (
                                        <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7" />
                                    ) : (
                                        <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5M12 12l9-9M12 12l-9 9" />
                                    )}
                                </svg>
                                {isExpanded ? "Collapse View" : "Expand View"}
                            </button>

                            {/* Standalone open */}
                            <a
                                href={tool.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-white text-black hover:bg-white/90 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                            >
                                Open Standalone
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                    <polyline points="15 3 21 3 21 9" />
                                    <line x1="10" y1="14" x2="21" y2="3" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Tool iFrame Container */}
                    <div className="relative w-full rounded-[2rem] border border-white/5 bg-[#121214]/60 backdrop-blur-md overflow-hidden shadow-2xl">
                        {/* Glow header overlay */}
                        <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${tool.colorClass} opacity-60 z-10`} />

                        {/* Spinner */}
                        {isLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0b]/80 z-20 transition-all duration-300">
                                <div className="w-12 h-12 border-4 border-white/5 border-t-orange-500 rounded-full animate-spin mb-4" />
                                <div className="text-xs font-black uppercase tracking-widest text-[#666]">
                                    Launching Interactive Workspace...
                                </div>
                            </div>
                        )}

                        <iframe
                            src={tool.path}
                            className="w-full border-0 min-h-[750px] md:min-h-[850px] h-[80vh] block relative z-10"
                            onLoad={() => setIsLoading(false)}
                            title={tool.title}
                            allow="autoplay; camera; clipboard-write; clipboard-read"
                        />
                    </div>

                    {/* Ad Placement */}
                    <div className="mt-12">
                        <AdPlacement format="banner" />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
