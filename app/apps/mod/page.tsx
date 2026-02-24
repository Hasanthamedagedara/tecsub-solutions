"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ─── Types ─── */
interface ModApp {
    id: string;
    name: string;
    version: string;
    category: string;
    size: string;
    rating: number;
    downloads: string;
    description: string;
    features: string[];
    icon: string;
    color: string;
}

/* ─── Default Demo Data ─── */
const DEFAULT_MOD_APPS: ModApp[] = [
    {
        id: "mod-001",
        name: "Spotify Premium",
        version: "v8.9.12",
        category: "Music",
        size: "42 MB",
        rating: 4.8,
        downloads: "12M+",
        description: "Ad-free music streaming with offline downloads, unlimited skips, and high-quality audio.",
        features: ["No Ads", "Offline Mode", "Unlimited Skips", "HQ Audio"],
        icon: "🎵",
        color: "#1DB954",
    },
    {
        id: "mod-002",
        name: "YouTube Vanced",
        version: "v19.03",
        category: "Video",
        size: "85 MB",
        rating: 4.9,
        downloads: "25M+",
        description: "Background play, ad-free viewing, SponsorBlock integration, and picture-in-picture mode.",
        features: ["No Ads", "Background Play", "PiP Mode", "SponsorBlock"],
        icon: "▶️",
        color: "#FF0000",
    },
    {
        id: "mod-003",
        name: "Instagram Pro",
        version: "v310.2",
        category: "Social",
        size: "65 MB",
        rating: 4.6,
        downloads: "8M+",
        description: "Download reels and stories, ghost mode, view deleted messages, and advanced theming.",
        features: ["Download Media", "Ghost Mode", "See Deleted", "Custom Themes"],
        icon: "📸",
        color: "#E1306C",
    },
    {
        id: "mod-004",
        name: "WhatsApp Plus",
        version: "v17.55",
        category: "Messaging",
        size: "55 MB",
        rating: 4.7,
        downloads: "15M+",
        description: "Custom themes, privacy options, anti-delete messages, auto-reply, and message scheduling.",
        features: ["Custom Themes", "Anti-Delete", "Auto Reply", "Hide Status"],
        icon: "💬",
        color: "#25D366",
    },
    {
        id: "mod-005",
        name: "Netflix Mod",
        version: "v8.112",
        category: "Entertainment",
        size: "92 MB",
        rating: 4.5,
        downloads: "6M+",
        description: "Access all content, 4K streaming, download for offline, and no restrictions.",
        features: ["All Content", "4K Quality", "Offline Downloads", "No Region Lock"],
        icon: "🎬",
        color: "#E50914",
    },
    {
        id: "mod-006",
        name: "Minecraft PE",
        version: "v1.21.50",
        category: "Games",
        size: "180 MB",
        rating: 4.8,
        downloads: "20M+",
        description: "All skins unlocked, god mode, unlimited resources, and custom texture packs.",
        features: ["All Skins", "God Mode", "Unlimited Items", "Texture Packs"],
        icon: "⛏️",
        color: "#62B246",
    },
    {
        id: "mod-007",
        name: "Canva Pro",
        version: "v2.256",
        category: "Productivity",
        size: "38 MB",
        rating: 4.7,
        downloads: "9M+",
        description: "All premium templates, remove background, brand kit access, and team features.",
        features: ["All Templates", "BG Remove", "Brand Kit", "Resize Magic"],
        icon: "🎨",
        color: "#7B2FF7",
    },
    {
        id: "mod-008",
        name: "Truecaller Premium",
        version: "v14.22",
        category: "Utility",
        size: "28 MB",
        rating: 4.4,
        downloads: "5M+",
        description: "No ads, advanced caller ID, call recording, and premium badge removal.",
        features: ["No Ads", "Call Recording", "Advanced ID", "No Badge"],
        icon: "📞",
        color: "#0088FF",
    },
    {
        id: "mod-009",
        name: "PicsArt Gold",
        version: "v24.8",
        category: "Photo Editor",
        size: "72 MB",
        rating: 4.6,
        downloads: "7M+",
        description: "All filters and effects unlocked, AI tools, sticker maker, and collage templates.",
        features: ["All Filters", "AI Tools", "Sticker Maker", "No Watermark"],
        icon: "🖼️",
        color: "#FF3366",
    },
    {
        id: "mod-010",
        name: "Telegram Premium",
        version: "v10.12",
        category: "Messaging",
        size: "45 MB",
        rating: 4.8,
        downloads: "10M+",
        description: "Double limits, 4GB uploads, premium stickers, voice-to-text, and no ads.",
        features: ["4GB Uploads", "Premium Stickers", "Voice-to-Text", "No Ads"],
        icon: "✈️",
        color: "#26A5E4",
    },
    {
        id: "mod-011",
        name: "Clash of Clans",
        version: "v16.253",
        category: "Games",
        size: "215 MB",
        rating: 4.7,
        downloads: "18M+",
        description: "Unlimited gems, gold, and elixir. Max troops, instant build, and all heroes unlocked.",
        features: ["Unlimited Gems", "Max Troops", "Instant Build", "All Heroes"],
        icon: "⚔️",
        color: "#F5A623",
    },
    {
        id: "mod-012",
        name: "Kinemaster Pro",
        version: "v7.4.8",
        category: "Video Editor",
        size: "95 MB",
        rating: 4.5,
        downloads: "11M+",
        description: "No watermark, all effects and transitions, chroma key, and multi-layer editing.",
        features: ["No Watermark", "All Effects", "Chroma Key", "Multi-Layer"],
        icon: "🎞️",
        color: "#F44336",
    },
];

const CATEGORIES = ["All", "Music", "Video", "Social", "Messaging", "Entertainment", "Games", "Productivity", "Utility", "Photo Editor", "Video Editor"];

const STORAGE_KEY = "tecsub-mod-apps";

export default function ModAppsPage() {
    const [apps, setApps] = useState<ModApp[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedApp, setSelectedApp] = useState<ModApp | null>(null);

    useEffect(() => {
        const loadFromStorage = () => {
            // Check admin key first (priority)
            const adminStored = localStorage.getItem("tecsub-admin-mod_apps");
            if (adminStored) {
                try {
                    const adminItems = JSON.parse(adminStored);
                    if (adminItems.length > 0) {
                        const mapped: ModApp[] = adminItems.map((item: { id: string; title: string; category: string; status: string }, idx: number) => {
                            const def = DEFAULT_MOD_APPS.find(a => a.name === item.title);
                            if (def) return { ...def, id: item.id };
                            const colors = ["#1DB954", "#FF0000", "#E1306C", "#25D366", "#E50914", "#62B246", "#7B2FF7", "#0088FF"];
                            return {
                                id: item.id, name: item.title, version: "v1.0",
                                category: item.category || "Utility", size: "50 MB", rating: 4.5,
                                downloads: "1K+", description: `${item.title} mod app managed by admin.`,
                                features: ["Full Access", "No Ads", "Premium Unlocked"],
                                icon: "\ud83d\udce6", color: colors[idx % colors.length],
                            };
                        }).filter((item: { id: string }) => {
                            const adminItem = adminItems.find((a: { id: string; status: string }) => a.id === item.id);
                            return !adminItem || adminItem.status !== "archived";
                        });
                        setApps(mapped);
                        return;
                    }
                } catch { /* ignore */ }
            }
            // Seed admin key with defaults
            const seed = DEFAULT_MOD_APPS.map(a => ({
                id: a.id, title: a.name, type: "mod_apps", status: "published" as const,
                category: a.category, author: "Admin",
                createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            }));
            localStorage.setItem("tecsub-admin-mod_apps", JSON.stringify(seed));
            setApps(DEFAULT_MOD_APPS);
        };
        loadFromStorage();
        window.addEventListener("storage", loadFromStorage);
        const interval = setInterval(loadFromStorage, 2000);
        return () => { window.removeEventListener("storage", loadFromStorage); clearInterval(interval); };
    }, []);

    const filteredApps = apps.filter((app) => {
        const matchesCategory = selectedCategory === "All" || app.category === selectedCategory;
        const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
            <Navbar />
            <div className="pt-24 sm:pt-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                    {/* Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h1 className="font-bebas text-5xl sm:text-7xl gradient-text leading-[0.95] mb-4">
                            🎮 MOD APPS
                        </h1>
                        <p className="text-sm sm:text-base max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
                            Premium apps unlocked — free forever. Browse, download, and enjoy.
                        </p>
                    </motion.div>

                    {/* Search */}
                    <div className="max-w-md mx-auto mb-8">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search mod apps..."
                                className="w-full px-5 py-3 pl-12 rounded-2xl text-sm outline-none"
                                style={{
                                    background: "rgba(0,0,0,0.4)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    color: "var(--text-primary)",
                                }}
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: "var(--text-secondary)" }}>🔍</span>
                        </div>
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap justify-center gap-2 mb-10">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${selectedCategory === cat
                                    ? "bg-tecsubCyan/20 text-tecsubCyan border border-tecsubCyan/30"
                                    : "border border-white/10 hover:border-white/20"
                                    }`}
                                style={{ color: selectedCategory === cat ? undefined : "var(--text-secondary)" }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Apps Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredApps.map((app, i) => (
                            <motion.div
                                key={app.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05, duration: 0.4 }}
                                onClick={() => setSelectedApp(app)}
                                className="group rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                                style={{
                                    background: "rgba(0,0,0,0.3)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.borderColor = `${app.color}30`;
                                    (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px ${app.color}10`;
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                                }}
                            >
                                {/* Header */}
                                <div className="flex items-start gap-3 mb-3">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                                        style={{ background: `${app.color}15` }}
                                    >
                                        {app.icon}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>{app.name}</h3>
                                        <p className="text-[10px] font-mono" style={{ color: app.color }}>{app.version}</p>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-[11px] line-clamp-2 mb-3 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                                    {app.description}
                                </p>

                                {/* Features */}
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {app.features.slice(0, 3).map((f) => (
                                        <span
                                            key={f}
                                            className="text-[9px] px-2 py-0.5 rounded-full font-medium"
                                            style={{ background: `${app.color}10`, color: app.color }}
                                        >
                                            {f}
                                        </span>
                                    ))}
                                </div>

                                {/* Stats */}
                                <div className="flex items-center justify-between text-[10px]" style={{ color: "var(--text-secondary)" }}>
                                    <span>⭐ {app.rating}</span>
                                    <span>{app.downloads}</span>
                                    <span>{app.size}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {filteredApps.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-3xl mb-3">🔍</p>
                            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No apps found matching your search.</p>
                        </div>
                    )}
                </div>

                {/* ═══ App Detail Modal ═══ */}
                <AnimatePresence>
                    {selectedApp && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                            onClick={() => setSelectedApp(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="w-full max-w-md rounded-3xl overflow-hidden"
                                style={{
                                    background: "rgba(12,12,14,0.98)",
                                    border: `1px solid ${selectedApp.color}20`,
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header gradient */}
                                <div
                                    className="h-2"
                                    style={{ background: `linear-gradient(90deg, transparent, ${selectedApp.color}, transparent)` }}
                                />

                                <div className="p-6">
                                    {/* App info */}
                                    <div className="flex items-start gap-4 mb-5">
                                        <div
                                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                                            style={{ background: `${selectedApp.color}15` }}
                                        >
                                            {selectedApp.icon}
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>{selectedApp.name}</h2>
                                            <p className="text-xs font-mono" style={{ color: selectedApp.color }}>{selectedApp.version} • {selectedApp.category}</p>
                                            <div className="flex items-center gap-3 mt-1 text-[11px]" style={{ color: "var(--text-secondary)" }}>
                                                <span>⭐ {selectedApp.rating}</span>
                                                <span>📥 {selectedApp.downloads}</span>
                                                <span>📦 {selectedApp.size}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-xs leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>
                                        {selectedApp.description}
                                    </p>

                                    {/* Features */}
                                    <div className="mb-5">
                                        <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-primary)" }}>Features</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedApp.features.map((f) => (
                                                <span
                                                    key={f}
                                                    className="text-[11px] px-3 py-1 rounded-full font-medium"
                                                    style={{ background: `${selectedApp.color}12`, color: selectedApp.color, border: `1px solid ${selectedApp.color}20` }}
                                                >
                                                    ✓ {f}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <button
                                            className="flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:brightness-110"
                                            style={{ background: selectedApp.color }}
                                        >
                                            ⬇️ Download APK
                                        </button>
                                        <button
                                            onClick={() => setSelectedApp(null)}
                                            className="px-5 py-3 rounded-xl text-sm font-medium transition-all hover:bg-white/10"
                                            style={{ border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-secondary)" }}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Footer />
            </div>
        </div>
    );
}
