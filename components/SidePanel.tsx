"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

/* ─── Feature Tree ─── */
interface Feature {
    label: string;
    color: string;
    href?: string;
    subs?: { label: string; href: string }[];
}

const features: Feature[] = [
    {
        label: "🛠️ Online Tools",
        color: "#00E5FF",
        href: "#tools",
        subs: [
            { label: "Text Case Converter", href: "#tools" },
            { label: "JSON Formatter", href: "#tools" },
            { label: "Image Compressor", href: "#tools" },
            { label: "PDF Converter", href: "#tools" },
            { label: "Image Converter", href: "#tools" },
            { label: "Color Palette Generator", href: "#tools" },
            { label: "Base64 Encoder/Decoder", href: "#tools" },
            { label: "Unit Converter", href: "#tools" },
            { label: "Password Generator", href: "#tools" },
            { label: "QR Code Generator", href: "#tools" },
            { label: "Markdown Editor", href: "#tools" },
            { label: "CSS Gradient Maker", href: "#tools" },
            { label: "Regex Tester", href: "#tools" },
            { label: "PDF Merger & Splitter", href: "#tools" },
        ],
    },
    {
        label: "📦 Software Hub",
        color: "#38BDF8",
        href: "#software",
        subs: [
            { label: "Tecsub Recorder", href: "#software" },
            { label: "Tecsub VPN", href: "#software" },
            { label: "File Converter Pro", href: "#software" },
            { label: "Tecsub Cleaner", href: "#software" },
            { label: "Code Studio", href: "#software" },
            { label: "Tecsub Backup", href: "#software" },
            { label: "Batch Image Resizer", href: "#software" },
        ],
    },
    {
        label: "📰 Tech News",
        color: "#FFD93D",
        href: "#news",
        subs: [
            { label: "AI & Machine Learning", href: "#news" },
            { label: "Quantum Computing", href: "#news" },
            { label: "Web Development", href: "#news" },
            { label: "Mobile & AR", href: "#news" },
        ],
    },
    {
        label: "🤖 AI Lab",
        color: "#C084FC",
        href: "#ai-lab",
        subs: [
            { label: "AI Website Auditor", href: "#ai-lab" },
            { label: "Performance Analytics", href: "#ai-lab" },
            { label: "Smart Recommendations", href: "#ai-lab" },
            { label: "Competitor Analysis", href: "#ai-lab" },
        ],
    },
    {
        label: "🚀 App Forge",
        color: "#F97316",
        href: "#app-forge",
        subs: [
            { label: "Custom App Development", href: "#app-forge" },
            { label: "API Architecture", href: "#app-forge" },
            { label: "Cloud Deployment", href: "#app-forge" },
            { label: "Quality Assurance", href: "#app-forge" },
        ],
    },
    {
        label: "🎬 Tech Videos",
        color: "#FF0000",
        href: "#videos",
        subs: [
            { label: "AI Tutorials", href: "#videos" },
            { label: "Coding Tutorials", href: "#videos" },
            { label: "Software Reviews", href: "#videos" },
        ],
    },
    {
        label: "💡 AI Prompt Hub",
        color: "#4ADE80",
        href: "#prompts",
        subs: [
            { label: "SEO Content Generator", href: "#prompts" },
            { label: "Code Review Assistant", href: "#prompts" },
            { label: "YouTube Script Writer", href: "#prompts" },
            { label: "Social Media Campaign", href: "#prompts" },
            { label: "App Feature Brainstorm", href: "#prompts" },
            { label: "Email Marketing", href: "#prompts" },
        ],
    },
    {
        label: "🎓 Courses",
        color: "#EF4444",
        href: "/courses",
        subs: [
            { label: "📘 Facebook Marketing", href: "/courses" },
            { label: "▶️ YouTube Growth", href: "/courses" },
            { label: "🎵 TikTok Viral", href: "/courses" },
            { label: "📸 Instagram Mastery", href: "/courses" },
            { label: "💰 Adsterra Monetization", href: "/courses" },
            { label: "🌐 Website Development", href: "/courses" },
            { label: "🤖 AI & Prompt Engineering", href: "/courses" },
            { label: "🎬 Viral AI Video", href: "/courses" },
        ],
    },
    {
        label: "🌐 Connect With Us",
        color: "#A78BFA",
        href: "#social",
    },
    {
        label: "📱 Apps",
        color: "#06B6D4",
        href: "/apps",
        subs: [
            { label: "🎮 Mod Apps", href: "/apps/mod" },
            { label: "🆕 New Releases", href: "/apps/new-releases" },
            { label: "📦 All Downloads", href: "/apps" },
        ],
    },
    {
        label: "🛒 Online Assets",
        color: "#10A37F",
        href: "/assets",
        subs: [
            { label: "🎶 Suno AI", href: "/assets" },
            { label: "💎 Gemini", href: "/assets" },
            { label: "🧠 Grok", href: "/assets" },
            { label: "▶️ YouTube Premium", href: "/assets" },
            { label: "🎵 Spotify Premium", href: "/assets" },
        ],
    },
    {
        label: "🛍️ Shop",
        color: "#F59E0B",
        href: "/shop",
        subs: [
            { label: "💻 Software Licenses", href: "/shop" },
            { label: "🎨 Design Packs", href: "/shop" },
            { label: "📱 Templates", href: "/shop" },
            { label: "📚 eBooks", href: "/shop" },
        ],
    },
    {
        label: "ℹ️ About",
        color: "#FB923C",
        href: "/about",
    },
    {
        label: "📩 Contact",
        color: "#34D399",
        href: "#contact",
    },
];

export default function SidePanel() {
    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    const handleNav = (href: string) => {
        setOpen(false);
        setExpanded(null);

        if (href.startsWith("/")) {
            router.push(href);
            return;
        }

        const sectionId = href.replace("#", "");
        if (pathname === "/") {
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        } else {
            router.push(`/#${sectionId}`);
        }
    };

    const toggleExpand = (label: string) => {
        setExpanded(expanded === label ? null : label);
    };

    return (
        <>
            {/* ═══ Toggle Button — fixed left ═══ */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed left-3 top-[50%] -translate-y-1/2 z-[60] w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                style={{
                    background: open ? "rgba(0,229,255,0.15)" : "rgba(10,10,11,0.85)",
                    border: `1px solid ${open ? "rgba(0,229,255,0.4)" : "rgba(255,255,255,0.1)"}`,
                    backdropFilter: "blur(12px)",
                }}
                aria-label="Toggle side panel"
            >
                <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-base"
                    style={{ color: open ? "#00E5FF" : "var(--text-primary)" }}
                >
                    {open ? "✕" : "☰"}
                </motion.span>
            </button>

            {/* ═══ Overlay ═══ */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm"
                        onClick={() => { setOpen(false); setExpanded(null); }}
                    />
                )}
            </AnimatePresence>

            {/* ═══ Panel ═══ */}
            <AnimatePresence>
                {open && (
                    <motion.aside
                        initial={{ x: -320, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -320, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="fixed top-0 left-0 bottom-0 z-[56] w-[280px] sm:w-[300px] overflow-y-auto"
                        style={{
                            background: "rgba(8,8,10,0.96)",
                            backdropFilter: "blur(24px)",
                            borderRight: "1px solid rgba(0,229,255,0.08)",
                        }}
                    >
                        {/* Header */}
                        <div
                            className="px-5 py-5 flex items-center gap-3"
                            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                        >
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/20 bg-white/10 p-1">
                                <img src="/logo/tecsub.svg" alt="Logo" className="w-full h-full object-contain" />
                            </div>
                            <span className="font-bebas text-lg tracking-wider gradient-text">TECSUB</span>
                        </div>

                        {/* Feature List */}
                        <nav className="p-3 space-y-1">
                            {features.map((feat) => {
                                const hasSubs = feat.subs && feat.subs.length > 0;
                                const isExpanded = expanded === feat.label;

                                return (
                                    <div key={feat.label}>
                                        {/* Main Feature Button */}
                                        <button
                                            onClick={() => {
                                                if (hasSubs) {
                                                    toggleExpand(feat.label);
                                                } else if (feat.href) {
                                                    handleNav(feat.href);
                                                }
                                            }}
                                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 group"
                                            style={{
                                                color: feat.color,
                                                background: isExpanded ? `${feat.color}12` : "transparent",
                                            }}
                                            onMouseEnter={(e) => {
                                                (e.currentTarget as HTMLElement).style.background = `${feat.color}15`;
                                            }}
                                            onMouseLeave={(e) => {
                                                (e.currentTarget as HTMLElement).style.background = isExpanded ? `${feat.color}12` : "transparent";
                                            }}
                                        >
                                            <span className="flex items-center gap-2 truncate">
                                                {feat.label}
                                            </span>
                                            {hasSubs && (
                                                <motion.span
                                                    animate={{ rotate: isExpanded ? 180 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="text-[10px] opacity-60 flex-shrink-0"
                                                >
                                                    ▼
                                                </motion.span>
                                            )}
                                            {!hasSubs && (
                                                <span className="text-[10px] opacity-0 group-hover:opacity-60 transition-opacity flex-shrink-0">→</span>
                                            )}
                                        </button>

                                        {/* Sub Features Dropdown */}
                                        <AnimatePresence>
                                            {hasSubs && isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.25 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="ml-4 mt-1 mb-2 space-y-0.5 pl-3" style={{ borderLeft: `2px solid ${feat.color}30` }}>
                                                        {feat.subs!.map((sub) => (
                                                            <button
                                                                key={sub.label}
                                                                onClick={() => handleNav(sub.href)}
                                                                className="w-full text-left px-3 py-1.5 rounded-lg text-[12px] transition-all duration-200"
                                                                style={{ color: "rgba(255,255,255,0.85)" }}
                                                                onMouseEnter={(e) => {
                                                                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                                                                    (e.currentTarget as HTMLElement).style.color = "#ffffff";
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    (e.currentTarget as HTMLElement).style.background = "transparent";
                                                                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)";
                                                                }}
                                                            >
                                                                {sub.label}
                                                            </button>
                                                        ))}

                                                        {/* "Go to section" shortcut at bottom */}
                                                        {feat.href && (
                                                            <button
                                                                onClick={() => handleNav(feat.href!)}
                                                                className="w-full text-left px-3 py-1.5 rounded-lg text-[11px] font-semibold mt-1 transition-all duration-200"
                                                                style={{ color: feat.color, opacity: 0.7 }}
                                                                onMouseEnter={(e) => {
                                                                    (e.currentTarget as HTMLElement).style.opacity = "1";
                                                                    (e.currentTarget as HTMLElement).style.background = `${feat.color}10`;
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    (e.currentTarget as HTMLElement).style.opacity = "0.7";
                                                                    (e.currentTarget as HTMLElement).style.background = "transparent";
                                                                }}
                                                            >
                                                                → View All
                                                            </button>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </nav>

                        {/* Bottom gradient decoration */}
                        <div className="sticky bottom-0 h-16 pointer-events-none" style={{ background: "linear-gradient(transparent, rgba(8,8,10,0.96))" }} />
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
}
