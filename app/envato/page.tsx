"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/components/ThemeProvider";

export default function EnvatoDownloaderPage() {
    const [url, setUrl] = useState("");
    const [status, setStatus] = useState<"idle" | "analyzing" | "bypassing" | "ready">("idle");
    const { theme } = useAppContext();

    const handleProcess = () => {
        if (!url) return;
        setStatus("analyzing");
        setTimeout(() => {
            setStatus("bypassing");
            setTimeout(() => {
                setStatus("ready");
            }, 3000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Envato Themed Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#82b440]/5 blur-[120px] rounded-full pointer-events-none" />
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl w-full space-y-12 z-10 text-center"
            >
                <div className="space-y-4">
                    <div className="w-20 h-20 bg-[#82b440]/10 rounded-3xl flex items-center justify-center text-4xl border border-[#82b440]/20 mx-auto shadow-2xl shadow-[#82b440]/10">🍃</div>
                    <h1 className="text-5xl font-black tracking-tighter uppercase italic">Envato <span className="text-[#82b440]">Pro</span> Downloader</h1>
                    <p className="text-gray-400 text-lg font-medium max-w-xl mx-auto">Bypass premium restrictions and download high-quality Envato Elements assets for free (PRO Members Only).</p>
                </div>

                <div className="space-y-6">
                    <div className="bg-[#111] border border-white/5 p-2 rounded-3xl flex flex-col sm:flex-row gap-2 shadow-2xl">
                        <input 
                            type="text" 
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Paste Envato Elements URL here..."
                            className="flex-1 h-16 bg-transparent px-8 text-sm font-bold outline-none"
                        />
                        <button 
                            onClick={handleProcess}
                            disabled={status !== "idle" || !url}
                            className="h-16 px-12 bg-[#82b440] hover:bg-[#719d36] text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-[#82b440]/20 transition-all disabled:opacity-20"
                        >
                            {status === "idle" ? "Bypass & Download" : "Processing..."}
                        </button>
                    </div>

                    <AnimatePresence>
                        {status !== "idle" && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-[#82b440]/20 flex items-center justify-center animate-pulse">⚙️</div>
                                        <div className="text-left">
                                            <p className="text-xs font-black uppercase tracking-widest opacity-40">Current Status</p>
                                            <p className="text-sm font-bold capitalize text-[#82b440]">{status} asset security...</p>
                                        </div>
                                    </div>
                                    {status === "ready" && (
                                        <motion.button 
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            className="px-8 py-3 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                                        >
                                            Download ZIP
                                        </motion.button>
                                    )}
                                </div>

                                {/* Progress Bar */}
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ 
                                            width: status === "analyzing" ? "30%" : status === "bypassing" ? "70%" : "100%" 
                                        }}
                                        className="h-full bg-[#82b440]"
                                    />
                                </div>

                                <div className="grid grid-cols-3 gap-4 text-[9px] font-black uppercase tracking-[0.2em] opacity-30">
                                    <div className={status === "analyzing" ? "text-[#82b440] opacity-100" : ""}>1. Analyzing</div>
                                    <div className={status === "bypassing" ? "text-[#82b440] opacity-100" : ""}>2. Bypassing</div>
                                    <div className={status === "ready" ? "text-[#82b440] opacity-100" : ""}>3. Ready</div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 opacity-30 grayscale hover:grayscale-0 transition-all">
                    {["Templates", "Graphics", "Stock Video", "Photos"].map(cat => (
                        <div key={cat} className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-xs">✓</div>
                            <span className="text-[10px] font-black uppercase tracking-widest">{cat}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
