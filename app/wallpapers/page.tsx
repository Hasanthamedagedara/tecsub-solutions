"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdPlacement from "@/components/AdPlacement";

/* ─── Types ─── */
interface Wallpaper {
    id: string;
    title: string;
    category: string;
    device: "Desktop" | "Mobile" | "Both";
    resolution: string;
    description: string;
    icon: string;
    color: string;
}

/* ─── Demo Wallpapers ─── */
const DEFAULT_WALLPAPERS: Wallpaper[] = [
    { id: "wp-001", title: "Dark Matrix", category: "Abstract", device: "Desktop", resolution: "3840x2160", description: "Falling green code characters on a deep black background.", icon: "📟", color: "#4ADE80" },
    { id: "wp-002", title: "Sunset Waves", category: "Nature", device: "Both", resolution: "5120x2880", description: "Minimalist geometric waves under a warm sunset sky.", icon: "🌅", color: "#F97316" },
    { id: "wp-003", title: "Neon Cyber", category: "Futuristic", device: "Mobile", resolution: "1125x2436", description: "Cyberpunk aesthetic with glowing pink and blue accents.", icon: "🛸", color: "#C084FC" },
    { id: "wp-004", title: "Material Flow", category: "Abstract", device: "Both", resolution: "2560x1440", description: "Smooth liquid transitions inspired by material design.", icon: "🌊", color: "#3ea6ff" },
    { id: "wp-005", title: "Minimal Peaks", category: "Nature", device: "Desktop", resolution: "3840x2160", description: "Flat design mountain range with soft color palette.", icon: "⛰️", color: "#34D399" },
    { id: "wp-006", title: "Glitch Art", category: "Abstract", device: "Mobile", resolution: "1080x1920", description: "Distorted digital signals creating a unique glitch pattern.", icon: "📺", color: "#EF4444" },
];

const CATEGORIES = ["All", "Abstract", "Nature", "Futuristic"];
const DEVICES = ["All", "Desktop", "Mobile"];

export default function WallpapersPage() {
    const [selectedWp, setSelectedWp] = useState<Wallpaper | null>(null);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedDevice, setSelectedDevice] = useState("All");

    const filtered = DEFAULT_WALLPAPERS.filter((wp) => {
        const matchCat = selectedCategory === "All" || wp.category === selectedCategory;
        const matchDev = selectedDevice === "All" || wp.device === selectedDevice || wp.device === "Both";
        return matchCat && matchDev;
    });

    return (
        <div className="min-h-screen" style={{ background: "var(--yt-bg)" }}>
            <Navbar />
            <div className="pt-24 sm:pt-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                        <h1 className="font-bebas text-5xl sm:text-7xl gradient-text leading-[0.95] mb-4">🎨 TECSUB WALLPAPERS</h1>
                        <p className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: "var(--yt-text-secondary)" }}>
                            Stunning 4K wallpapers for your desktop and mobile devices. Optimized for OLED.
                        </p>
                    </motion.div>

                    <div className="flex flex-col items-center gap-4 mb-10">
                        <div className="flex flex-wrap justify-center gap-2">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat} onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${selectedCategory === cat ? "bg-yt-accent text-white" : "bg-yt-chip-bg text-yt-text-primary hover:bg-yt-bg-hover"}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                            {DEVICES.map((dev) => (
                                <button
                                    key={dev} onClick={() => setSelectedDevice(dev)}
                                    className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${selectedDevice === dev ? "border-yt-accent text-yt-accent" : "border-white/10 text-yt-text-secondary hover:border-white/20"}`}
                                    style={{ border: "1px solid" }}
                                >
                                    {dev}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((wp, i) => (
                            <motion.div
                                key={wp.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => setSelectedWp(wp)}
                                className="group relative rounded-3xl overflow-hidden cursor-pointer"
                                style={{ background: "var(--yt-bg-secondary)", border: "1px solid var(--yt-border)" }}
                            >
                                <div className={`w-full flex items-center justify-center text-8xl py-24 transition-all duration-700 group-hover:scale-110 group-hover:rotate-3`} style={{ background: `${wp.color}10` }}>
                                    {wp.icon}
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 className="font-bold text-lg">{wp.title}</h3>
                                        <span className="text-[10px] px-2 py-1 rounded bg-black/20 font-mono" style={{ color: "var(--yt-text-secondary)" }}>{wp.device}</span>
                                    </div>
                                    <p className="text-xs" style={{ color: "var(--yt-text-secondary)" }}>{wp.resolution}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <AnimatePresence>
                    {selectedWp && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                            onClick={() => setSelectedWp(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                                className="w-full max-w-lg rounded-[2.5rem] overflow-hidden"
                                style={{ background: "var(--yt-bg-secondary)", border: "1px solid var(--yt-border)" }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-10 flex flex-col items-center text-center">
                                    <div className="w-32 h-32 rounded-[2rem] flex items-center justify-center text-6xl mb-8" style={{ background: `${selectedWp.color}15` }}>
                                        {selectedWp.icon}
                                    </div>
                                    <h2 className="text-3xl font-bold mb-2">{selectedWp.title}</h2>
                                    <p className="text-sm mb-6" style={{ color: "var(--yt-text-secondary)" }}>{selectedWp.description}</p>
                                    
                                    <div className="flex gap-4 mb-8">
                                        <div className="px-4 py-2 rounded-2xl bg-black/20 border border-white/5">
                                            <p className="text-[9px] uppercase tracking-tighter mb-0.5" style={{ color: "var(--yt-text-secondary)" }}>Category</p>
                                            <p className="font-bold text-xs">{selectedWp.category}</p>
                                        </div>
                                        <div className="px-4 py-2 rounded-2xl bg-black/20 border border-white/5">
                                            <p className="text-[9px] uppercase tracking-tighter mb-0.5" style={{ color: "var(--yt-text-secondary)" }}>Max Res</p>
                                            <p className="font-bold text-xs">{selectedWp.resolution}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col w-full gap-3">
                                        <button className="w-full py-4 rounded-2xl bg-white text-black font-bold hover:bg-gray-200 transition-all">
                                            🚀 Apply as Wallpaper
                                        </button>
                                        <button className="w-full py-4 rounded-2xl bg-yt-accent/10 text-yt-accent font-bold border border-yt-accent/20 hover:bg-yt-accent/20 transition-all">
                                            📥 Download Original
                                        </button>
                                        <button onClick={() => setSelectedWp(null)} className="w-full py-3 text-sm font-medium hover:text-white transition-all mt-2" style={{ color: "var(--yt-text-secondary)" }}>
                                            Go Back
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
                    <AdPlacement format="banner" />
                </div>
                <Footer />
            </div>
        </div>
    );
}
