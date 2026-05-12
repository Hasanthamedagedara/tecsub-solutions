"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const VIDEO_FORMATS = [
    "MP4", "MKV", "MOV", "AVI", "WMV", "WEBM", "FLV", "MPEG", "3GP", "VOB"
];

const RESOLUTIONS = [
    "Original", "4K (3840x2160)", "2K (2560x1440)", "1080p (1920x1080)", "720p (1280x720)", "480p (854x480)"
];

export default function VideoConverterPage() {
    const [file, setFile] = useState<File | null>(null);
    const [targetFormat, setTargetFormat] = useState("MP4");
    const [resolution, setResolution] = useState("Original");
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setFile(f);
        setProgress(0);
    };

    const handleConvert = () => {
        if (!file) return;
        setIsConverting(true);
        let p = 0;
        const interval = setInterval(() => {
            p += Math.random() * 10;
            if (p >= 100) {
                p = 100;
                clearInterval(interval);
                setIsConverting(false);
                alert(`Successfully converted ${file.name} to ${targetFormat} (${resolution})!`);
            }
            setProgress(p);
        }, 300);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#050505] text-white font-sans selection:bg-red-500/30">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-32 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Left Panel: Preview & Progress (7 cols) */}
                    <div className="lg:col-span-7 space-y-8">
                        <div>
                            <h1 className="text-6xl font-black tracking-tighter mb-4 italic">Video Converter</h1>
                            <p className="text-gray-500 text-xl font-medium">Ultra-fast 4K video transcoding with zero quality loss.</p>
                        </div>

                        {!file ? (
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="group cursor-pointer aspect-video rounded-[3rem] bg-[#0a0a0a] border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-8 hover:border-red-500/40 hover:bg-red-500/5 transition-all shadow-inner"
                            >
                                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-4xl group-hover:scale-110 transition-all group-hover:bg-red-600 group-hover:text-white">🎥</div>
                                <div className="text-center space-y-2">
                                    <p className="text-2xl font-black uppercase tracking-tight">Drop video files</p>
                                    <p className="text-sm opacity-30 font-black uppercase tracking-[0.3em]">Support for 100+ formats</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="aspect-video rounded-[3rem] bg-[#0a0a0a] border border-white/5 overflow-hidden shadow-2xl relative group">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-12">
                                        <h3 className="text-3xl font-black tracking-tight mb-2">{file.name}</h3>
                                        <div className="flex gap-6 items-center">
                                            <span className="text-xs font-black uppercase tracking-widest text-red-500">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                            <span className="text-xs font-black uppercase tracking-widest opacity-40">{file.type || "Video Source"}</span>
                                        </div>
                                    </div>
                                    {/* Mock Poster */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-blue-600/10 -z-10" />
                                    
                                    {isConverting && (
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-xl flex flex-col items-center justify-center p-12">
                                            <div className="w-full max-w-md space-y-6">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-sm font-black uppercase tracking-[0.3em] text-red-500 animate-pulse">Encoding...</span>
                                                    <span className="text-4xl font-black italic">{Math.round(progress)}%</span>
                                                </div>
                                                <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 p-1">
                                                    <motion.div 
                                                        className="h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)]"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${progress}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => setFile(null)} className="text-xs font-black uppercase tracking-widest opacity-30 hover:opacity-100 transition-all">✕ Change Video</button>
                            </div>
                        )}
                    </div>

                    {/* Right Panel: Settings (5 cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-[#0a0a0a] rounded-[3rem] border border-white/5 p-10 shadow-2xl space-y-10">
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Format</label>
                                    <span className="px-2 py-1 bg-red-600/10 text-red-500 text-[8px] font-black rounded italic">PRO ENGINE</span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {VIDEO_FORMATS.map(f => (
                                        <button 
                                            key={f}
                                            onClick={() => setTargetFormat(f)}
                                            className={`h-14 rounded-2xl text-xs font-black transition-all border ${targetFormat === f ? "bg-white border-white text-black shadow-2xl" : "bg-white/5 border-white/5 hover:bg-white/10 opacity-40"}`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-6 block">Output Resolution</label>
                                <div className="space-y-3">
                                    {RESOLUTIONS.map(res => (
                                        <button 
                                            key={res}
                                            onClick={() => setResolution(res)}
                                            className={`w-full h-14 px-6 rounded-2xl text-xs font-bold flex items-center justify-between transition-all border ${resolution === res ? "bg-red-600/10 border-red-600 text-red-500" : "bg-white/5 border-white/5 hover:bg-white/10 opacity-60"}`}
                                        >
                                            <span>{res}</span>
                                            {resolution === res && <span>✓</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button 
                                onClick={handleConvert}
                                disabled={!file || isConverting}
                                className="w-full h-20 bg-red-600 hover:bg-red-500 disabled:opacity-20 disabled:cursor-not-allowed text-white rounded-[1.5rem] text-sm font-black uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(220,38,38,0.3)] flex items-center justify-center gap-4 transition-all"
                            >
                                {isConverting ? "Processing..." : "Start Transcoding"}
                            </button>
                        </div>

                        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[#111] to-black border border-white/5">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center text-red-500">⚡</div>
                                <h4 className="text-sm font-black uppercase tracking-widest">Hardware Acceleration</h4>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed font-medium">Using your local GPU for faster processing. Your video never leaves your browser for maximum privacy.</p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="video/*" 
                onChange={handleUpload} 
            />
        </div>
    );
}
