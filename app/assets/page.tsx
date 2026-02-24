"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ─── Types ─── */
interface AIAsset {
    id: string;
    name: string;
    category: string;
    priceUSD: number;
    priceLKR: number;
    description: string;
    features: string[];
    icon: string;
    color: string;
    period: string;
}

/* ─── Data ─── */
const ASSETS: AIAsset[] = [
    {
        id: "a-suno",
        name: "Suno AI Premium",
        category: "AI Music",
        priceUSD: 10,
        priceLKR: 3000,
        description: "Generate professional-quality music with AI. Unlimited songs, custom lyrics, and studio-quality audio output.",
        features: ["Unlimited Songs", "Custom Lyrics", "Studio Quality", "All Genres", "Commercial License"],
        icon: "🎶",
        color: "#FF6B6B",
        period: "Monthly",
    },
    {
        id: "a-gemini",
        name: "Google Gemini Advanced",
        category: "AI Assistant",
        priceUSD: 10,
        priceLKR: 3000,
        description: "Access Gemini Ultra 1.5 with 1M token context, multimodal reasoning, code generation, and Google ecosystem integration.",
        features: ["Gemini Ultra", "1M Context", "Multimodal", "Code Gen", "Google Integration"],
        icon: "💎",
        color: "#4285F4",
        period: "Monthly",
    },
    {
        id: "a-grok",
        name: "Grok Premium (xAI)",
        category: "AI Assistant",
        priceUSD: 10,
        priceLKR: 3000,
        description: "Real-time knowledge access, unfiltered responses, image generation, and deep reasoning capabilities from xAI.",
        features: ["Real-time Data", "Image Gen", "Deep Reasoning", "Unfiltered", "X Integration"],
        icon: "🧠",
        color: "#1DA1F2",
        period: "Monthly",
    },
    {
        id: "a-yt",
        name: "YouTube Premium",
        category: "Streaming",
        priceUSD: 10,
        priceLKR: 3000,
        description: "Ad-free viewing, background play, offline downloads, YouTube Music Premium included, and Picture-in-Picture mode.",
        features: ["No Ads", "Background Play", "Offline Downloads", "YT Music", "PiP Mode"],
        icon: "▶️",
        color: "#FF0000",
        period: "Monthly",
    },
    {
        id: "a-spotify",
        name: "Spotify Premium",
        category: "Music Streaming",
        priceUSD: 10,
        priceLKR: 3000,
        description: "Ad-free music streaming, unlimited skips, offline listening, HiFi audio quality, and cross-device sync.",
        features: ["No Ads", "Offline Mode", "HiFi Audio", "Unlimited Skips", "Cross-Device"],
        icon: "🎵",
        color: "#1DB954",
        period: "Monthly",
    },
    {
        id: "a-chatgpt",
        name: "ChatGPT Plus",
        category: "AI Assistant",
        priceUSD: 10,
        priceLKR: 3000,
        description: "GPT-4o access, DALL·E image generation, Advanced Data Analysis, custom GPTs, and priority access during peak times.",
        features: ["GPT-4o", "DALL·E 3", "Data Analysis", "Custom GPTs", "Priority Access"],
        icon: "🤖",
        color: "#10A37F",
        period: "Monthly",
    },
    {
        id: "a-midjourney",
        name: "Midjourney Pro",
        category: "AI Art",
        priceUSD: 10,
        priceLKR: 3000,
        description: "Generate stunning AI art with V6 model. Unlimited relaxed generations, fast GPU hours, and commercial license.",
        features: ["V6 Model", "Fast GPU", "Unlimited Relax", "Commercial", "Upscaling"],
        icon: "🎨",
        color: "#C084FC",
        period: "Monthly",
    },
    {
        id: "a-canva",
        name: "Canva Pro",
        category: "Design",
        priceUSD: 10,
        priceLKR: 3000,
        description: "Professional design tool with 100M+ assets, AI-powered tools, brand kit, background remover, and magic resize.",
        features: ["100M+ Assets", "AI Tools", "Brand Kit", "BG Remover", "Magic Resize"],
        icon: "✏️",
        color: "#7B2FF7",
        period: "Monthly",
    },
];

export default function OnlineAssetsPage() {
    const [selectedAsset, setSelectedAsset] = useState<AIAsset | null>(null);
    const [currency, setCurrency] = useState<"usd" | "lkr">("usd");

    const getPrice = (asset: AIAsset) => {
        return currency === "lkr" ? `Rs. ${asset.priceLKR.toLocaleString()}` : `$${asset.priceUSD}`;
    };

    return (
        <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
            <Navbar />
            <div className="pt-24 sm:pt-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                    {/* Hero */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                        <h1 className="font-bebas text-5xl sm:text-7xl gradient-text leading-[0.95] mb-4">
                            🛒 ONLINE ASSETS
                        </h1>
                        <p className="text-sm sm:text-base max-w-2xl mx-auto mb-6" style={{ color: "var(--text-secondary)" }}>
                            Premium AI tools & streaming subscriptions at unbeatable prices. All accounts delivered instantly.
                        </p>

                        {/* Currency Toggle */}
                        <div className="flex justify-center gap-2">
                            <button
                                onClick={() => setCurrency("usd")}
                                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${currency === "usd" ? "bg-tecsubCyan/20 text-tecsubCyan border-2 border-tecsubCyan/30" : "border border-white/10"}`}
                                style={{ color: currency === "usd" ? undefined : "var(--text-secondary)" }}
                            >
                                💵 USD
                            </button>
                            <button
                                onClick={() => setCurrency("lkr")}
                                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${currency === "lkr" ? "bg-yellow-400/20 text-yellow-400 border-2 border-yellow-400/30" : "border border-white/10"}`}
                                style={{ color: currency === "lkr" ? undefined : "var(--text-secondary)" }}
                            >
                                🇱🇰 LKR
                            </button>
                        </div>
                    </motion.div>

                    {/* Assets Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {ASSETS.map((asset, i) => (
                            <motion.div
                                key={asset.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06, duration: 0.4 }}
                                onClick={() => setSelectedAsset(asset)}
                                className="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] flex flex-col"
                                style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${asset.color}30`; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}
                            >
                                <div className="h-1.5" style={{ background: asset.color }} />
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${asset.color}15` }}>
                                            {asset.icon}
                                        </div>
                                        <span className="text-[9px] px-2 py-1 rounded-full font-bold" style={{ background: `${asset.color}15`, color: asset.color }}>
                                            {asset.period}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{asset.name}</h3>
                                    <p className="text-[10px] mb-2" style={{ color: asset.color }}>{asset.category}</p>
                                    <p className="text-[11px] line-clamp-2 mb-3" style={{ color: "var(--text-secondary)" }}>{asset.description}</p>
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {asset.features.slice(0, 3).map((f) => (
                                            <span key={f} className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)" }}>
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-auto flex items-center justify-between">
                                        <span className="font-bold text-lg" style={{ color: asset.color }}>{getPrice(asset)}</span>
                                        <span className="text-[10px] px-3 py-1 rounded-full font-semibold" style={{ background: `${asset.color}15`, color: asset.color }}>
                                            Buy →
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ═══ Asset Detail Modal ═══ */}
                <AnimatePresence>
                    {selectedAsset && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                            onClick={() => setSelectedAsset(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                                className="w-full max-w-md rounded-3xl overflow-hidden"
                                style={{ background: "rgba(12,12,14,0.98)", border: `1px solid ${selectedAsset.color}20` }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="h-2" style={{ background: `linear-gradient(90deg, transparent, ${selectedAsset.color}, transparent)` }} />
                                <div className="p-6">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: `${selectedAsset.color}15` }}>
                                            {selectedAsset.icon}
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>{selectedAsset.name}</h2>
                                            <p className="text-xs" style={{ color: selectedAsset.color }}>{selectedAsset.category} • {selectedAsset.period}</p>
                                        </div>
                                    </div>

                                    <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>{selectedAsset.description}</p>

                                    <div className="mb-5">
                                        <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-primary)" }}>Included Features</h4>
                                        <div className="space-y-1.5">
                                            {selectedAsset.features.map((f) => (
                                                <div key={f} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                                                    <span style={{ color: selectedAsset.color }}>✓</span> {f}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price Box */}
                                    <div className="p-4 rounded-xl mb-4" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                        <div className="flex gap-2 mb-3">
                                            <button onClick={() => setCurrency("usd")} className={`flex-1 py-2 rounded-lg text-xs font-bold ${currency === "usd" ? "ring-2" : "border border-white/10"}`} style={{ color: currency === "usd" ? selectedAsset.color : "var(--text-secondary)", background: currency === "usd" ? `${selectedAsset.color}10` : "transparent" }}>
                                                💵 USD
                                            </button>
                                            <button onClick={() => setCurrency("lkr")} className={`flex-1 py-2 rounded-lg text-xs font-bold ${currency === "lkr" ? "ring-2" : "border border-white/10"}`} style={{ color: currency === "lkr" ? selectedAsset.color : "var(--text-secondary)", background: currency === "lkr" ? `${selectedAsset.color}10` : "transparent" }}>
                                                🇱🇰 LKR
                                            </button>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-3xl font-bold" style={{ color: selectedAsset.color }}>{getPrice(selectedAsset)}</span>
                                            <span className="text-xs ml-2" style={{ color: "var(--text-secondary)" }}>/ month</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button className="flex-1 py-3 rounded-xl font-bold text-sm text-white hover:brightness-110 transition-all" style={{ background: selectedAsset.color }}>
                                            🛒 Purchase — {getPrice(selectedAsset)}
                                        </button>
                                        <button onClick={() => setSelectedAsset(null)} className="px-5 py-3 rounded-xl text-sm font-medium hover:bg-white/10 transition-all" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-secondary)" }}>
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
