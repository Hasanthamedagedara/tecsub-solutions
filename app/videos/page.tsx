"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdPlacement from "@/components/AdPlacement";

/* ─── Types ─── */
interface Video {
    id: string;
    title: string;
    category: string;
    duration: string;
    views: string;
    date: string;
    thumbnail: string;
    description: string;
    icon: string;
    color: string;
    youtubeId?: string;
}

/* ─── Demo Videos ─── */
const DEFAULT_VIDEOS: Video[] = [
    { id: "vid-001", title: "Next.js 15 Masterclass", category: "Tutorial", duration: "45:20", views: "12K", date: "2 days ago", thumbnail: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=800&q=80", description: "Learn everything about the new features in Next.js 15, including the updated compiler and server actions.", icon: "💻", color: "#3ea6ff", youtubeId: "dQw4w9WgXcQ" },
    { id: "vid-002", title: "Building a POS System", category: "Case Study", duration: "18:45", views: "8.5K", date: "1 week ago", thumbnail: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=800&q=80", description: "A deep dive into how we architected and built the Tecsub Universal POS for global scalability.", icon: "💳", color: "#F97316", youtubeId: "jNQXAC9IVRw" },
    { id: "vid-003", title: "Future of AI in 2026", category: "Insights", duration: "12:10", views: "25K", date: "3 days ago", thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80", description: "Exploring the upcoming trends in generative AI, robotics, and neural interfaces.", icon: "🤖", color: "#4ADE80" },
    { id: "vid-004", title: "UI/UX Design Trends", category: "Design", duration: "08:30", views: "5.2K", date: "5 days ago", thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=800&q=80", description: "Modern design patterns for mobile and web apps in the era of glassmorphism.", icon: "🎨", color: "#C084FC" },
    { id: "vid-005", title: "Cybersecurity 101", category: "Security", duration: "25:00", views: "15K", date: "2 weeks ago", thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80", description: "Protect your personal data. Essential security tips for every internet user.", icon: "🛡️", color: "#EF4444" },
    { id: "vid-006", title: "Cloud Native Architecture", category: "DevOps", duration: "32:15", views: "7.1K", date: "1 month ago", thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80", description: "Designing resilient systems using microservices, Docker, and Kubernetes.", icon: "☁️", color: "#00E5FF" },
];

const CATEGORIES = ["All", "Tutorial", "Case Study", "Insights", "Design", "Security", "DevOps"];

export default function VideosPage() {
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [selectedCat, setSelectedCat] = useState("All");

    const filtered = DEFAULT_VIDEOS.filter((v) => selectedCat === "All" || v.category === selectedCat);

    return (
        <div className="min-h-screen" style={{ background: "var(--yt-bg)" }}>
            <Navbar />
            <div className="pt-24 sm:pt-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                        <h1 className="font-bebas text-5xl sm:text-7xl gradient-text leading-[0.95] mb-4">📺 TECSUB VIDEOS</h1>
                        <p className="text-sm sm:text-base max-w-2xl mx-auto mb-6" style={{ color: "var(--yt-text-secondary)" }}>
                            Watch the latest tutorials, tech news, and system walkthroughs.
                        </p>
                        <a href="https://www.youtube.com/@tecsub.0" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                            Subscribe to @tecsub.0
                        </a>
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

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10">
                        {filtered.map((vid, i) => (
                            <motion.div
                                key={vid.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => setSelectedVideo(vid)}
                                className="group cursor-pointer"
                            >
                                <div className="aspect-video rounded-2xl overflow-hidden relative mb-3 bg-black/20 border border-white/5 bg-cover bg-center" style={{ backgroundImage: `url(${vid.youtubeId ? `https://img.youtube.com/vi/${vid.youtubeId}/maxresdefault.jpg` : vid.thumbnail})` }}>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                                        <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                                            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-bold text-white tracking-widest uppercase">
                                        {vid.duration}
                                    </div>
                                    {!vid.youtubeId && (
                                        <div className="w-full h-full flex items-center justify-center text-6xl" style={{ background: `${vid.color}10` }}>
                                            {vid.icon}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-lg" style={{ background: `${vid.color}15` }}>{vid.icon}</div>
                                    <div>
                                        <h3 className="font-bold text-sm line-clamp-2 leading-snug group-hover:text-yt-accent transition-colors">{vid.title}</h3>
                                        <div className="flex items-center gap-1.5 mt-1.5 text-[11px]" style={{ color: "var(--yt-text-secondary)" }}>
                                            <span>{vid.views} views</span>
                                            <span>•</span>
                                            <span>{vid.date}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <AnimatePresence>
                    {selectedVideo && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                            onClick={() => setSelectedVideo(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                                className="w-full max-w-4xl rounded-3xl overflow-hidden"
                                style={{ background: "var(--yt-bg-secondary)", border: "1px solid var(--yt-border)" }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {selectedVideo.youtubeId ? (
                                    <div className="aspect-video w-full bg-black">
                                        <iframe 
                                            width="100%" 
                                            height="100%" 
                                            src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`} 
                                            title={selectedVideo.title} 
                                            frameBorder="0" 
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                ) : (
                                    <div className="aspect-video w-full bg-black flex items-center justify-center text-9xl relative">
                                        <div className="absolute inset-0 opacity-30 bg-cover bg-center" style={{ backgroundImage: `url(${selectedVideo.thumbnail})` }} />
                                        <span className="relative z-10">{selectedVideo.icon}</span>
                                    </div>
                                )}
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h2 className="text-2xl font-bold mb-2">{selectedVideo.title}</h2>
                                            <div className="flex items-center gap-4 text-xs" style={{ color: "var(--yt-text-secondary)" }}>
                                                <span>{selectedVideo.views} views</span>
                                                <span>{selectedVideo.date}</span>
                                                <span className="px-2 py-0.5 rounded bg-white/5 font-bold text-yt-accent">{selectedVideo.category}</span>
                                            </div>
                                        </div>
                                            <a href="https://www.youtube.com/@tecsub.0" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-full bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)]">Subscribe to Channel</a>
                                    </div>
                                    <p className="text-sm leading-relaxed" style={{ color: "var(--yt-text-secondary)" }}>{selectedVideo.description}</p>
                                    <div className="mt-8 flex justify-end">
                                        <button onClick={() => setSelectedVideo(null)} className="px-6 py-2.5 rounded-xl border border-white/10 font-bold text-xs hover:bg-white/5 transition-all">
                                            Close Player
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
