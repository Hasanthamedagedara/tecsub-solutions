"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdPlacement from "@/components/AdPlacement";
import { useRouter } from "next/navigation";

interface ToolItem {
    title: string;
    description: string;
    href: string;
    icon: string;
    type: "widget" | "poster" | "game" | "utility" | "card";
    badge?: string;
}

interface CategoryGroup {
    title: string;
    subtitle: string;
    icon: string;
    color: string;
    accentColor: string;
    glowColor: string;
    tools: ToolItem[];
}

const CATEGORIES: CategoryGroup[] = [
    {
        title: "Vesak & Poson Suite",
        subtitle: "Traditional Buddhist Festival Tools",
        icon: "🪔",
        color: "text-amber-500",
        accentColor: "border-amber-500/20 bg-amber-500/5 hover:border-amber-500/30",
        glowColor: "rgba(245,158,11,0.05)",
        tools: [
            {
                title: "Digital Pandal Builder",
                description: "Build a live 2D digital Vesak/Poson Thorana with custom lighting patterns, devotional loop music, and sponsor banners.",
                href: "/tools/seasonal/digital-pandal",
                icon: "☸️",
                type: "widget",
                badge: "INTERACTIVE"
            },
            {
                title: "Digital Dansala Creator",
                description: "Generate and download a fun digital Dansala poster (Ice Cream, Rice, Chickpeas) with your custom name and photo.",
                href: "/tools/seasonal/digital-dansala",
                icon: "🍧",
                type: "poster",
                badge: "FUN POSTER"
            },
            {
                title: "Digital Verse Book",
                description: "Design beautiful typography cards containing old Sinhala poems and Buddhist verses with serene temple backgrounds.",
                href: "/tools/seasonal/verse-book",
                icon: "📜",
                type: "card"
            }
        ]
    },
    {
        title: "Aluth Avurudu Suite",
        subtitle: "Sinhala & Tamil New Year Celebration Utilities",
        icon: "🌅",
        color: "text-emerald-500",
        accentColor: "border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/30",
        glowColor: "rgba(16,185,129,0.05)",
        tools: [
            {
                title: "Avurudu Nakath Timers",
                description: "Real-time countdown clocks for Avurudu rituals (cooking, meals, work commencement) with traditional Rabana audio cues.",
                href: "/tools/seasonal/avurudu-nakath",
                icon: "⏰",
                type: "utility",
                badge: "AUDIO TIMERS"
            },
            {
                title: "Avurudu Ritual Greetings",
                description: "Create funny 'work commencement' cards (e.g. coding, sleeping, gaming) styled as traditional New Year greeting cards.",
                href: "/tools/seasonal/avurudu-greetings",
                icon: "🧧",
                type: "card"
            },
            {
                title: "Traditional Mini Games",
                description: "Play interactive Sri Lankan village sports online, including Kana Muttiya (Strike the Pot) and Blindfold Elephant Eye.",
                href: "/tools/seasonal/avurudu-games",
                icon: "🎮",
                type: "game",
                badge: "PLAY ONLINE"
            }
        ]
    },
    {
        title: "Christmas & Valentine's Day",
        subtitle: "Holiday Seasons & Romance Specials",
        icon: "❄️",
        color: "text-red-500",
        accentColor: "border-red-500/20 bg-red-500/5 hover:border-red-500/30",
        glowColor: "rgba(239,68,68,0.05)",
        tools: [
            {
                title: "Santa's Personalized Letter",
                description: "Surprise children with a customized letter from the North Pole featuring dynamic names, nice checks, and seal layouts.",
                href: "/tools/seasonal/santa-letter",
                icon: "🎅",
                type: "poster"
            },
            {
                title: "Secret Santa Generator",
                description: "Organize gift exchanges easily. Match participants randomly and get private WhatsApp sharing strings.",
                href: "/tools/seasonal/secret-santa",
                icon: "🎁",
                type: "utility"
            },
            {
                title: "Valentine Love Notes",
                description: "Share a private link to receive anonymous love notes from friends, and export gorgeous glassmorphic image cards.",
                href: "/tools/seasonal/valentine-notes",
                icon: "💖",
                type: "card",
                badge: "ANONYMOUS"
            }
        ]
    },
    {
        title: "Achievements & Goals",
        subtitle: "Special Days & Milestone Cards",
        icon: "🏆",
        color: "text-indigo-500",
        accentColor: "border-indigo-500/20 bg-indigo-500/5 hover:border-indigo-500/30",
        glowColor: "rgba(99,102,241,0.05)",
        tools: [
            {
                title: "Exam Result Fun Poster",
                description: "Create congratulations templates for O/L or A/L results with customizable names, school tags, and custom scores.",
                href: "/tools/seasonal/exam-wishers",
                icon: "🎓",
                type: "poster",
                badge: "AL/OL SEASON"
            },
            {
                title: "New Year Resolution Card",
                description: "Draft 5 key goals for the upcoming year and export a gorgeous portrait card optimized for sharing on Instagram or Facebook Stories.",
                href: "/tools/seasonal/resolution-card",
                icon: "🎯",
                type: "card"
            }
        ]
    }
];

export default function SeasonalToolsDashboard() {
    const router = useRouter();
    return (
        <div className="min-h-screen text-[#f1f1f1]" style={{ background: "#0a0a0b" }}>
            <Navbar />

            <div className="pt-32 pb-20 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Back button */}
                    <button
                        onClick={() => router.push("/tools")}
                        className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-white/50 hover:text-white mb-8 transition-colors"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:-translate-x-1 transition-transform">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Tools
                    </button>

                    {/* Header */}
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4"
                        >
                            User-Generated Content Suite
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter heading-font">
                            SEASONAL <span className="text-orange-500 font-extrabold">CREATIVES</span>
                        </h1>
                        <p className="text-[#888] text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                            Create personalized postcards, build digital pandals, play traditional games, and share milestone celebrations on social media with custom-generated assets.
                        </p>
                    </div>

                    {/* Dashboard Sections */}
                    <div className="space-y-16">
                        {CATEGORIES.map((section, sIdx) => (
                            <div key={sIdx} className="space-y-6">
                                <div className="flex items-center gap-3 border-b border-white/5 pb-3">
                                    <span className="text-2xl">{section.icon}</span>
                                    <div>
                                        <h2 className="text-lg font-black uppercase tracking-wider text-white">
                                            {section.title}
                                        </h2>
                                        <p className="text-xs text-[#666] font-medium">{section.subtitle}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {section.tools.map((tool, tIdx) => (
                                        <div
                                            key={tIdx}
                                            onClick={() => router.push(tool.href)}
                                            className={`group p-6 border rounded-[2rem] flex flex-col justify-between cursor-pointer transition-all relative overflow-hidden h-64 ${section.accentColor}`}
                                        >
                                            {/* Glow sphere effect */}
                                            <div 
                                                className="absolute inset-0 -z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100" 
                                                style={{ background: `radial-gradient(circle at center, ${section.glowColor} 0%, transparent 70%)` }}
                                            />
                                            
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                                                        {tool.icon}
                                                    </div>
                                                    {tool.badge && (
                                                        <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-[8px] font-black tracking-widest text-[#aaa] rounded">
                                                            {tool.badge}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="text-base font-black uppercase tracking-tight text-white group-hover:text-orange-400 transition-colors">
                                                    {tool.title}
                                                </h3>
                                                <p className="text-xs text-[#777] leading-relaxed line-clamp-3 font-light">
                                                    {tool.description}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#aaa] group-hover:text-white transition-colors mt-4">
                                                Launch Tool
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:translate-x-1 transition-transform">
                                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16">
                        <AdPlacement format="banner" />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
