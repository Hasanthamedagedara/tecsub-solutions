"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/components/ThemeProvider";

const PLATFORMS = [
    { name: "YouTube", icon: "🔴", color: "bg-red-600" },
    { name: "TikTok", icon: "🎵", color: "bg-black" },
    { name: "Twitch", icon: "🟣", color: "bg-purple-600" },
    { name: "Vimeo", icon: "🔵", color: "bg-blue-400" },
    { name: "Facebook", icon: "🔷", color: "bg-blue-600" },
    { name: "Drive", icon: "📂", color: "bg-green-500" },
    { name: "Twitter", icon: "🐦", color: "bg-sky-500" },
];

export default function VideoDownloaderPage() {
    const [url, setUrl] = useState("");
    const [activeType, setActiveType] = useState("youtube");
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = () => {
        if (!url) return;
        setIsDownloading(true);
        setTimeout(() => {
            setIsDownloading(false);
            alert("Video processing started! You will receive a high-quality download link soon.");
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-[#080808] text-white font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/5 blur-[120px] rounded-full pointer-events-none" />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl space-y-12 z-10"
            >
                {/* Main Input Area */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative flex items-center bg-[#0d0d0d] rounded-[3rem] p-2 border border-white/5">
                        <div className="flex items-center gap-4 pl-6 flex-1">
                            <span className="text-xl">🎬</span>
                            <input 
                                type="text" 
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="Paste link here: https://youtube.com/watch?v=..."
                                className="w-full bg-transparent outline-none text-sm font-medium h-14"
                            />
                        </div>
                        <button 
                            onClick={handleDownload}
                            className="w-16 h-16 bg-[#00ff88] hover:bg-[#00e67a] text-black rounded-full flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-all"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                        </button>
                    </div>
                </div>

                {/* Switcher Buttons */}
                <div className="flex flex-wrap justify-center gap-3">
                    {[
                        { id: "upload", label: "Upload", icon: "☁️" },
                        { id: "youtube", label: "YouTube Video Link", icon: "🔗" },
                        { id: "other", label: "Other Links", icon: "➕" }
                    ].map(type => (
                        <button 
                            key={type.id}
                            onClick={() => setActiveType(type.id)}
                            className={`px-8 py-3 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all border ${activeType === type.id ? "bg-white/10 border-white/20 text-white" : "bg-white/5 border-transparent text-white/40 hover:bg-white/10"}`}
                        >
                            <span>{type.icon}</span>
                            {type.label}
                        </button>
                    ))}
                </div>

                {/* Social Platform Icons */}
                <div className="flex flex-wrap justify-center gap-6 pt-4">
                    {PLATFORMS.map((p, i) => (
                        <motion.div 
                            key={p.name}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl cursor-pointer hover:scale-110 transition-all shadow-xl shadow-black/50 ${p.color}`}
                        >
                            {p.icon}
                        </motion.div>
                    ))}
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-lg border border-white/10 hover:bg-white/10 cursor-pointer">➕</div>
                </div>

                {/* Footer Text */}
                <div className="text-center space-y-2 pt-12">
                    <p className="text-sm font-bold text-white/60">High-Quality Video Downloader</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20">Unlimited Access • 4K Quality • Ad-Free</p>
                </div>
            </motion.div>
        </div>
    );
}
