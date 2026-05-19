"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdPlacement from "@/components/AdPlacement";

/* ─── Types ─── */
interface Software {
    id: string;
    name: string;
    category: string;
    version: string;
    platform: string;
    description: string;
    icon: string;
    color: string;
    size: string;
    badge?: string;
}

/* ─── Demo Software ─── */
const DEFAULT_SOFTWARE: Software[] = [
    { id: "sw-001", name: "Tecsub POS Desktop", category: "Business", version: "v2.1.0", platform: "Windows / Mac", description: "Advanced point of sale system with offline support and inventory management.", icon: "💳", color: "#3ea6ff", size: "45 MB", badge: "Premium" },
    { id: "sw-002", name: "Tecsub App Forge Studio", category: "Development", version: "v1.4.5", platform: "Windows / Linux", description: "Low-code mobile app builder for rapid prototyping and deployment.", icon: "🛠️", color: "#F97316", size: "120 MB", badge: "New" },
    { id: "sw-002b", name: "Tecsub PDF Studio Pro", category: "Utility", version: "v3.2.0", platform: "Windows / Mac", description: "Complete offline PDF toolkit featuring the Bilingual Side-by-Side PDF Merger, Bates Numbering, OCR scans, and 30+ dynamic converters.", icon: "📄", color: "#10B981", size: "64 MB", badge: "Hot" },
    { id: "sw-002c", name: "Tecsub YT Special Studio", category: "Development", version: "v1.1.2", platform: "Windows", description: "High-performance creator dashboard tool for video chapter segmenting, quick MP3/MP4 formatting, and instant timeline slicing.", icon: "🎥", color: "#EF4444", size: "38 MB", badge: "New" },
    { id: "sw-003", name: "Secure Vault", category: "Security", version: "v3.0.2", platform: "All Platforms", description: "Military-grade encryption for your sensitive files and passwords.", icon: "🛡️", color: "#4ADE80", size: "12 MB" },
    { id: "sw-004", name: "AI Image Upscaler", category: "Graphics", version: "v1.2.0", platform: "Desktop", description: "Enhance image resolution up to 8K using deep learning models.", icon: "🖼️", color: "#C084FC", size: "85 MB" },
    { id: "sw-005", name: "Cloud Sync Pro", category: "Utility", version: "v5.1.1", platform: "Windows", description: "Seamlessly synchronize your local data with any major cloud provider.", icon: "☁️", color: "#00E5FF", size: "28 MB" },
    { id: "sw-006", name: "Syntax Editor", category: "Development", version: "v0.9.8", platform: "Web / Desktop", description: "A lightweight, high-performance code editor for web developers.", icon: "📝", color: "#EF4444", size: "15 MB", badge: "Beta" },
];

const CATEGORIES = ["All", "Business", "Development", "Security", "Graphics", "Utility"];

export default function SoftwarePage() {
    const [selectedSw, setSelectedSw] = useState<Software | null>(null);
    const [selectedCat, setSelectedCat] = useState("All");

    const filtered = DEFAULT_SOFTWARE.filter((sw) => selectedCat === "All" || sw.category === selectedCat);

    return (
        <div className="min-h-screen" style={{ background: "var(--yt-bg)" }}>
            <Navbar />
            <div className="pt-24 sm:pt-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                        <h1 className="font-bebas text-5xl sm:text-7xl gradient-text leading-[0.95] mb-4">💻 TECSUB SOFTWARE</h1>
                        <p className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: "var(--yt-text-secondary)" }}>
                            Professional software solutions and tools developed by Tecsub Solutions.
                        </p>
                    </motion.div>

                    <div className="flex flex-wrap justify-center gap-2 mb-10">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat} onClick={() => setSelectedCat(cat)}
                                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${selectedCat === cat ? "bg-yt-accent text-white" : "bg-yt-chip-bg text-yt-text-primary hover:bg-yt-bg-hover"}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((sw, i) => (
                            <motion.div
                                key={sw.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => setSelectedSw(sw)}
                                className="group relative rounded-2xl overflow-hidden cursor-pointer p-6 flex flex-col items-start transition-all duration-300 hover:bg-white/5"
                                style={{ background: "var(--yt-bg-secondary)", border: "1px solid var(--yt-border)" }}
                            >
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4" style={{ background: `${sw.color}15`, color: sw.color }}>
                                    {sw.icon}
                                </div>
                                <div className="flex justify-between w-full mb-1">
                                    <h3 className="font-bold text-lg">{sw.name}</h3>
                                    {sw.badge && <span className="text-[9px] px-2 py-0.5 rounded-full bg-yt-accent/20 text-yt-accent font-bold h-fit">{sw.badge}</span>}
                                </div>
                                <p className="text-xs mb-4 line-clamp-2" style={{ color: "var(--yt-text-secondary)" }}>{sw.description}</p>
                                <div className="mt-auto w-full flex justify-between items-center text-[10px]" style={{ color: "var(--yt-text-secondary)" }}>
                                    <span>{sw.platform}</span>
                                    <span className="font-mono">{sw.version}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <AnimatePresence>
                    {selectedSw && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                            onClick={() => setSelectedSw(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                                className="w-full max-w-lg rounded-3xl overflow-hidden"
                                style={{ background: "var(--yt-bg-secondary)", border: "1px solid var(--yt-border)" }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-8">
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl" style={{ background: `${selectedSw.color}15`, color: selectedSw.color }}>
                                            {selectedSw.icon}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold mb-1">{selectedSw.name}</h2>
                                            <p className="text-sm font-medium" style={{ color: selectedSw.color }}>{selectedSw.category}</p>
                                        </div>
                                    </div>
                                    
                                    <p className="text-sm leading-relaxed mb-8" style={{ color: "var(--yt-text-secondary)" }}>{selectedSw.description}</p>
                                    
                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                                            <p className="text-[10px] text-yt-text-secondary uppercase mb-1">Platform</p>
                                            <p className="font-bold text-xs">{selectedSw.platform}</p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                                            <p className="text-[10px] text-yt-text-secondary uppercase mb-1">File Size</p>
                                            <p className="font-bold text-xs">{selectedSw.size}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <button className="w-full py-4 rounded-xl bg-yt-accent text-white font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2">
                                            📥 Download {selectedSw.version}
                                        </button>
                                        <button onClick={() => setSelectedSw(null)} className="w-full py-3 text-sm font-medium hover:text-white transition-all" style={{ color: "var(--yt-text-secondary)" }}>
                                            Close
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
