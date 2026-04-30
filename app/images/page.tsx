"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdPlacement from "@/components/AdPlacement";

/* ─── Types ─── */
interface GalleryImage {
    id: string;
    title: string;
    category: string;
    resolution: string;
    author: string;
    description: string;
    icon: string;
    color: string;
    size: string;
}

/* ─── Demo Images ─── */
const DEFAULT_IMAGES: GalleryImage[] = [
    { id: "img-001", title: "Cyberpunk Cityscape", category: "AI Art", resolution: "3840x2160", author: "Tecsub AI", description: "Vibrant neon-lit streets of a futuristic megalopolis.", icon: "🌃", color: "#C084FC", size: "4.2 MB" },
    { id: "img-002", title: "Minimalist Code", category: "Abstract", resolution: "2560x1440", author: "Design Team", description: "Clean, elegant lines of syntax on a dark background.", icon: "💻", color: "#3ea6ff", size: "1.8 MB" },
    { id: "img-003", title: "Forest at Dawn", category: "Nature", resolution: "3840x2160", author: "Lens Master", description: "Sunlight filtering through ancient trees in a mystical forest.", icon: "🌲", color: "#4ADE80", size: "5.5 MB" },
    { id: "img-004", title: "Geometric Flow", category: "Vector", resolution: "5000x5000", author: "Artisan", description: "Perfectly balanced geometric shapes with smooth gradients.", icon: "📐", color: "#F97316", size: "2.1 MB" },
    { id: "img-005", title: "Macro Circuits", category: "Tech", resolution: "1920x1080", author: "Macro Shot", description: "Extreme close-up of a high-performance microprocessor.", icon: "🔌", color: "#34D399", size: "3.4 MB" },
    { id: "img-006", title: "Ocean Deep", category: "Nature", resolution: "3840x2160", author: "Blue Wave", description: "The serene beauty of the deep blue ocean from below.", icon: "🌊", color: "#00E5FF", size: "4.9 MB" },
];

const CATEGORIES = ["All", "AI Art", "Abstract", "Nature", "Vector", "Tech"];

export default function ImagesPage() {
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filtered = DEFAULT_IMAGES.filter((img) => selectedCategory === "All" || img.category === selectedCategory);

    return (
        <div className="min-h-screen" style={{ background: "var(--yt-bg)" }}>
            <Navbar />
            <div className="pt-24 sm:pt-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                        <h1 className="font-bebas text-5xl sm:text-7xl gradient-text leading-[0.95] mb-4">🖼️ TECSUB IMAGES</h1>
                        <p className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: "var(--yt-text-secondary)" }}>
                            High-quality stock photos, AI-generated art, and professional vectors.
                        </p>
                    </motion.div>

                    <div className="flex flex-wrap justify-center gap-2 mb-10">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat} onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${selectedCategory === cat ? "bg-yt-accent text-white" : "bg-yt-chip-bg text-yt-text-primary hover:bg-yt-bg-hover"}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
                        {filtered.map((img, i) => (
                            <motion.div
                                key={img.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => setSelectedImage(img)}
                                className="group relative rounded-2xl overflow-hidden cursor-pointer"
                                style={{ background: "var(--yt-bg-secondary)", border: "1px solid var(--yt-border)" }}
                            >
                                <div className="w-full flex items-center justify-center text-8xl py-20 transition-transform duration-500 group-hover:scale-110" style={{ background: `${img.color}10` }}>
                                    {img.icon}
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                                    <h3 className="text-white font-bold text-lg">{img.title}</h3>
                                    <p className="text-white/70 text-xs">{img.resolution}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                            onClick={() => setSelectedImage(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                                className="w-full max-w-4xl rounded-3xl overflow-hidden"
                                style={{ background: "var(--yt-bg-secondary)", border: "1px solid var(--yt-border)" }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
                                    <div className="flex-1 flex items-center justify-center text-9xl py-20 bg-black/40">
                                        {selectedImage.icon}
                                    </div>
                                    <div className="w-full md:w-80 p-8 flex flex-col">
                                        <h2 className="text-2xl font-bold mb-1">{selectedImage.title}</h2>
                                        <p className="text-xs text-yt-accent mb-4">{selectedImage.category}</p>
                                        
                                        <p className="text-sm mb-6" style={{ color: "var(--yt-text-secondary)" }}>{selectedImage.description}</p>
                                        
                                        <div className="space-y-4 mb-8">
                                            <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                                                <span style={{ color: "var(--yt-text-secondary)" }}>Resolution</span>
                                                <span className="font-mono">{selectedImage.resolution}</span>
                                            </div>
                                            <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                                                <span style={{ color: "var(--yt-text-secondary)" }}>File Size</span>
                                                <span className="font-mono">{selectedImage.size}</span>
                                            </div>
                                            <div className="flex justify-between text-xs border-b border-white/5 pb-2">
                                                <span style={{ color: "var(--yt-text-secondary)" }}>Author</span>
                                                <span>{selectedImage.author}</span>
                                            </div>
                                        </div>

                                        <div className="mt-auto flex flex-col gap-3">
                                            <button className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all">
                                                📥 Download HD
                                            </button>
                                            <button onClick={() => setSelectedImage(null)} className="w-full py-3 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-all">
                                                Close
                                            </button>
                                        </div>
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
