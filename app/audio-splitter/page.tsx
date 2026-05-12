"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TRACKS = [
    { id: "music", label: "Music", color: "#10b981", defaultVol: 80 },
    { id: "vocal", label: "Vocal", color: "#6366f1", defaultVol: 0 },
    { id: "bass", label: "Bass", color: "#fbbf24", defaultVol: 70 },
    { id: "drums", label: "Drums", color: "#ec4899", defaultVol: 75 },
];

export default function AudioSplitterPage() {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volumes, setVolumes] = useState<Record<string, number>>({
        music: 80, vocal: 0, bass: 70, drums: 75
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setFile(f);
        setIsProcessing(true);
        // Simulate AI processing
        setTimeout(() => setIsProcessing(false), 3000);
    };

    const handleVolumeChange = (id: string, val: number) => {
        setVolumes(prev => ({ ...prev, [id]: val }));
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#050505] text-white font-sans selection:bg-purple-500/30">
            <Navbar />

            <main className="flex-1 flex flex-col items-center justify-center p-6 pt-24 pb-32">
                <AnimatePresence mode="wait">
                    {!file ? (
                        /* LANDING STATE */
                        <motion.div 
                            key="landing"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center space-y-12 max-w-4xl"
                        >
                            <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-gradient-to-r from-white via-white to-white/20 bg-clip-text text-transparent">
                                Split music into separated parts <br/> with AI-Powered algorithms
                            </h1>
                            
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <div className="absolute inset-0 bg-purple-500/20 blur-[100px] rounded-full group-hover:bg-purple-500/40 transition-all duration-700" />
                                <div className="relative bg-[#111] border border-white/5 p-12 md:p-20 rounded-[3rem] shadow-2xl flex flex-col items-center gap-8 group-hover:border-white/10 transition-all">
                                    <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">🎵</div>
                                    <button className="px-12 py-5 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full text-lg font-black uppercase tracking-widest shadow-xl shadow-purple-600/20 group-hover:shadow-purple-600/40 transition-all active:scale-95">
                                        Browse my files
                                    </button>
                                    <p className="text-sm font-medium opacity-30 uppercase tracking-[0.2em]">Supports MP3, WAV, FLAC • Max 50MB</p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        /* EDITOR STATE */
                        <motion.div 
                            key="editor"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full max-w-6xl space-y-8"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-xl">📁</div>
                                    <div>
                                        <h2 className="text-xl font-bold tracking-tight">{file.name}</h2>
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Processing complete • High Fidelity Mode</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center">
                                        <span className="text-[8px] font-black uppercase opacity-30">Key</span>
                                        <span className="text-sm font-black text-blue-400">C MAJOR</span>
                                    </div>
                                    <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center">
                                        <span className="text-[8px] font-black uppercase opacity-30">BPM</span>
                                        <span className="text-sm font-black text-purple-400">104.9</span>
                                    </div>
                                </div>
                            </div>

                            {/* Track Container */}
                            <div className="bg-[#111] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl relative">
                                {isProcessing && (
                                    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-6">
                                        <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                                        <p className="text-sm font-black uppercase tracking-[0.3em] animate-pulse text-purple-400">Isolating stems...</p>
                                    </div>
                                )}

                                <div className="divide-y divide-white/5">
                                    {TRACKS.map((track) => (
                                        <div key={track.id} className="flex h-32 items-center">
                                            {/* Track Label & Control */}
                                            <div className="w-48 px-8 flex items-center gap-6 border-r border-white/5 bg-black/20">
                                                <div className="flex-1">
                                                    <p className="text-sm font-black uppercase tracking-widest" style={{ color: track.color }}>{track.label}</p>
                                                </div>
                                                <div className="relative h-24 w-4 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-transparent"
                                                        style={{ height: `${volumes[track.id]}%`, backgroundColor: track.color, opacity: 0.3 }}
                                                    />
                                                    <input 
                                                        type="range" 
                                                        min="0" max="100" 
                                                        value={volumes[track.id]} 
                                                        onChange={(e) => handleVolumeChange(track.id, parseInt(e.target.value))}
                                                        className="absolute inset-0 opacity-0 cursor-pointer [writing-mode:bt-lr] appearance-slider-vertical"
                                                    />
                                                    <div className="absolute left-1/2 -translate-x-1/2 bg-white w-3 h-1 rounded-full pointer-events-none" style={{ bottom: `${volumes[track.id]}%` }} />
                                                </div>
                                            </div>
                                            
                                            {/* Waveform Visualization */}
                                            <div className="flex-1 relative overflow-hidden flex items-center px-4">
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
                                                <svg width="100%" height="64" viewBox="0 0 1000 100" preserveAspectRatio="none">
                                                    <path 
                                                        d={generateMockWaveform(track.id)} 
                                                        fill={track.color} 
                                                        fillOpacity={volumes[track.id] / 200 + 0.1}
                                                    />
                                                </svg>
                                                {/* Playhead Mock */}
                                                {isPlaying && (
                                                    <motion.div 
                                                        initial={{ left: 0 }}
                                                        animate={{ left: "100%" }}
                                                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                                        className="absolute top-0 bottom-0 w-px bg-white z-10 shadow-[0_0_15px_white]"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom Controls */}
                            <div className="flex items-center justify-between px-6">
                                <div className="flex items-center gap-8">
                                    <button 
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-all shadow-xl"
                                    >
                                        {isPlaying ? "⏸" : "▶"}
                                    </button>
                                    <button className="text-white/40 hover:text-white transition-all">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 20V4M5 20V4M10 12l5 5-5 5V12z"/></svg>
                                    </button>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
                                        <span className="text-[10px] font-black uppercase opacity-30">Format:</span>
                                        <span className="text-xs font-black text-green-400">MP3</span>
                                    </div>
                                    <button className="px-10 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all active:scale-95 shadow-2xl">
                                        Save Results
                                    </button>
                                    <button onClick={() => setFile(null)} className="p-4 bg-white/5 hover:bg-red-500/10 text-red-500 rounded-2xl transition-all">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <Footer />

            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="audio/*" 
                onChange={handleUpload} 
            />

            <style jsx global>{`
                .appearance-slider-vertical {
                    -webkit-appearance: slider-vertical;
                    width: 100%;
                    height: 100%;
                }
            `}</style>
        </div>
    );
}

// Helper to generate a unique mock waveform path
function generateMockWaveform(seed: string) {
    let path = "M 0 50 ";
    const segments = 100;
    const s = seed.length * 10;
    for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * 1000;
        const amplitude = Math.sin(i * 0.2 + s) * 20 + Math.random() * 15;
        path += `L ${x} ${50 + amplitude} `;
    }
    for (let i = segments; i >= 0; i--) {
        const x = (i / segments) * 1000;
        const amplitude = Math.sin(i * 0.2 + s) * 20 + Math.random() * 15;
        path += `L ${x} ${50 - amplitude} `;
    }
    return path + "Z";
}
