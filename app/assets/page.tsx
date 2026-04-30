"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdPlacement from "@/components/AdPlacement";

/* ─── Types ─── */
interface Asset {
    id: string;
    name: string;
    type: string;
    fileType: string;
    fileSize: string;
    description: string;
    icon: string;
    color: string;
}

/* ─── Demo Assets ─── */
const DEFAULT_ASSETS: Asset[] = [
    { id: "ast-001", name: "Tecsub Brand Kit", type: "Design", fileType: "ZIP (AI, SVG, PNG)", fileSize: "25 MB", description: "Complete brand guidelines, logos, and typography for Tecsub Solutions.", icon: "💎", color: "#3ea6ff" },
    { id: "ast-002", name: "UI Icon Library v2", type: "Icons", fileType: "Figma / SVG", fileSize: "12 MB", description: "500+ custom designed icons for modern web and mobile interfaces.", icon: "✨", color: "#C084FC" },
    { id: "ast-003", name: "Motion Design Templates", type: "Video", fileType: "AE Project", fileSize: "150 MB", description: "Professional After Effects templates for YouTube intros and transitions.", icon: "🎞️", color: "#EF4444" },
    { id: "ast-004", name: "React Component Library", type: "Code", fileType: "NPM / Source", fileSize: "5 MB", description: "Fully accessible, dark-themed React components used in Tecsub projects.", icon: "📦", color: "#4ADE80" },
    { id: "ast-005", name: "3D Tech Models", type: "3D", fileType: "OBJ / GLB", fileSize: "85 MB", description: "High-quality 3D models of tech gadgets and abstract hardware.", icon: "🧱", color: "#F97316" },
    { id: "ast-006", name: "Sound Design Pack", type: "Audio", fileType: "WAV (24-bit)", fileSize: "210 MB", description: "Cyberpunk atmospheric sounds and interface sound effects.", icon: "🎵", color: "#00E5FF" },
];

const TYPES = ["All", "Design", "Icons", "Video", "Code", "3D", "Audio"];

export default function AssetsPage() {
    const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
    const [selectedType, setSelectedType] = useState("All");

    const filtered = DEFAULT_ASSETS.filter((ast) => selectedType === "All" || ast.type === selectedType);

    return (
        <div className="min-h-screen" style={{ background: "var(--yt-bg)" }}>
            <Navbar />
            <div className="pt-24 sm:pt-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                        <h1 className="font-bebas text-5xl sm:text-7xl gradient-text leading-[0.95] mb-4">💎 DIGITAL ASSETS</h1>
                        <p className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: "var(--yt-text-secondary)" }}>
                            Premium resources for creators, developers, and designers.
                        </p>
                    </motion.div>

                    <div className="flex flex-wrap justify-center gap-2 mb-10">
                        {TYPES.map((type) => (
                            <button
                                key={type} onClick={() => setSelectedType(type)}
                                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${selectedType === type ? "bg-yt-accent text-white" : "bg-yt-chip-bg text-yt-text-primary hover:bg-yt-bg-hover"}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((ast, i) => (
                            <motion.div
                                key={ast.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => setSelectedAsset(ast)}
                                className="group relative rounded-2xl overflow-hidden cursor-pointer p-6 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.03]"
                                style={{ background: "var(--yt-bg-secondary)", border: "1px solid var(--yt-border)" }}
                            >
                                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-4 group-hover:rotate-12 transition-transform" style={{ background: `${ast.color}15`, color: ast.color }}>
                                    {ast.icon}
                                </div>
                                <h3 className="font-bold text-lg mb-2">{ast.name}</h3>
                                <p className="text-xs mb-4 line-clamp-2" style={{ color: "var(--yt-text-secondary)" }}>{ast.description}</p>
                                <div className="mt-auto w-full pt-4 border-t border-white/5 flex justify-between items-center text-[10px]" style={{ color: "var(--yt-text-secondary)" }}>
                                    <span>{ast.fileType}</span>
                                    <span className="font-bold" style={{ color: ast.color }}>{ast.fileSize}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <AnimatePresence>
                    {selectedAsset && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                            onClick={() => setSelectedAsset(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                                className="w-full max-w-md rounded-3xl overflow-hidden"
                                style={{ background: "var(--yt-bg-secondary)", border: "1px solid var(--yt-border)" }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-8">
                                    <div className="flex justify-center mb-6">
                                        <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl" style={{ background: `${selectedAsset.color}15`, color: selectedAsset.color }}>
                                            {selectedAsset.icon}
                                        </div>
                                    </div>
                                    <div className="text-center mb-6">
                                        <h2 className="text-2xl font-bold mb-1">{selectedAsset.name}</h2>
                                        <span className="text-xs uppercase tracking-widest font-bold" style={{ color: selectedAsset.color }}>{selectedAsset.type}</span>
                                    </div>
                                    
                                    <p className="text-sm text-center mb-8" style={{ color: "var(--yt-text-secondary)" }}>{selectedAsset.description}</p>
                                    
                                    <div className="p-4 rounded-xl bg-black/20 border border-white/5 mb-8 flex justify-around text-center">
                                        <div>
                                            <p className="text-[10px] text-yt-text-secondary uppercase mb-1">Format</p>
                                            <p className="font-bold text-xs">{selectedAsset.fileType.split(' ')[0]}</p>
                                        </div>
                                        <div className="w-px h-8 bg-white/10" />
                                        <div>
                                            <p className="text-[10px] text-yt-text-secondary uppercase mb-1">Size</p>
                                            <p className="font-bold text-xs">{selectedAsset.fileSize}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <button className="w-full py-4 rounded-xl bg-yt-accent text-white font-bold hover:brightness-110 transition-all">
                                            📦 Download Asset
                                        </button>
                                        <button onClick={() => setSelectedAsset(null)} className="w-full py-3 text-sm font-medium hover:text-white transition-all" style={{ color: "var(--yt-text-secondary)" }}>
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
