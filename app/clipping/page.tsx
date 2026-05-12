"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/components/ThemeProvider";

export default function AiClippingPage() {
    const [url, setUrl] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [language, setLanguage] = useState("auto");
    const [length, setLength] = useState("90");
    const { theme } = useAppContext();

    const handleGenerate = () => {
        if (!url) return;
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            alert("AI Clipping started! We are analyzing the video for viral moments. (Demo only)");
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full text-center space-y-4 mb-10"
            >
                <h1 className="text-5xl font-black tracking-tight">AI Clipping</h1>
                <p className="text-gray-400 text-lg">Turn any video into viral clips for TikTok, Shorts, and Reels instantly.</p>
            </motion.div>

            <div className="w-full max-w-xl space-y-6">
                {/* URL Input */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center opacity-40">🔗</div>
                    <input 
                        type="text" 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 text-sm font-medium outline-none focus:border-green-500/50 transition-all"
                    />
                </div>

                {/* Video Preview Card */}
                <div className="bg-[#111] rounded-3xl border border-white/5 p-6 space-y-4 shadow-2xl">
                    <div className="aspect-video bg-black rounded-2xl relative overflow-hidden group cursor-pointer border border-white/5">
                        <img 
                            src="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" 
                            alt="Video Thumbnail"
                            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-all duration-700"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-3xl border border-white/20 group-hover:scale-110 transition-all">▶️</div>
                        </div>
                        <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-[10px] font-black tracking-widest">00:05:30</div>
                    </div>
                    
                    <div>
                        <h3 className="font-bold text-sm">නොමිලේ AI එකෙන් වීඩියෝ ක්ලිප් හදමු - Viral Clips in Sri Lanka</h3>
                        <p className="text-[10px] font-black text-gray-500 mt-1 uppercase tracking-widest">YouTube • tecsub solutions</p>
                    </div>
                </div>

                {/* Settings Panel */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold opacity-60 uppercase tracking-widest">Language</label>
                        <select 
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-2 text-xs font-bold outline-none min-w-[200px]"
                        >
                            <option value="auto">Auto / No translation</option>
                            <option value="en">English</option>
                            <option value="si">Sinhala</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold opacity-60 uppercase tracking-widest">Clip Length</label>
                        <select 
                            value={length}
                            onChange={(e) => setLength(e.target.value)}
                            className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-2 text-xs font-bold outline-none min-w-[200px]"
                        >
                            <option value="90">Auto ( &lt; 90s )</option>
                            <option value="60">Max 60s</option>
                            <option value="30">Max 30s</option>
                        </select>
                    </div>
                </div>

                {/* Action Button */}
                <button 
                    onClick={handleGenerate}
                    disabled={isProcessing}
                    className="w-full h-16 bg-[#00ff88] hover:bg-[#00e67a] text-black rounded-3xl font-black uppercase tracking-[0.2em] text-sm shadow-[0_0_50px_rgba(0,255,136,0.2)] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    {isProcessing ? (
                        <>
                            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            Analyzing Viral Moments...
                        </>
                    ) : (
                        "Generate Viral Clips ✨"
                    )}
                </button>
            </div>
        </div>
    );
}
