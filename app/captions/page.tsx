"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/components/ThemeProvider";

export default function CaptionsPage() {
    const [activeLang, setActiveLang] = useState<"si" | "en" | "ta">("en");
    const [activeTab, setActiveTab] = useState<"upload" | "audio" | "video">("upload");
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [captions, setCaptions] = useState<any[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            simulateGeneration();
        }
    };

    const simulateGeneration = () => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setCaptions([
                { time: "00:01", text: "Welcome to Tecsub AI Captions." },
                { time: "00:04", text: "Generating high-quality subtitles in real-time." },
                { time: "00:08", text: "Supporting Sinhala, English and Tamil languages." }
            ]);
        }, 5000);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-300">
            <Navbar />

            <main className="pt-24 sm:pt-32 pb-20 px-4 max-w-6xl mx-auto">
                {/* Language Header */}
                <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 text-center md:text-left">Target Language</h4>
                        <div className="flex flex-wrap justify-center gap-2">
                            {[
                                { id: "si", label: "LK සිංහල" },
                                { id: "en", label: "US English" },
                                { id: "ta", label: "LK தமிழ்" }
                            ].map((lang) => (
                                <button 
                                    key={lang.id}
                                    onClick={() => setActiveLang(lang.id as any)}
                                    className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase transition-all ${activeLang === lang.id ? "bg-red-600 text-white shadow-xl shadow-red-600/20" : "bg-white dark:bg-white/5 text-gray-400 hover:text-gray-800"}`}
                                >
                                    {lang.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tab Toolbar */}
                <div className="flex justify-center mb-8 overflow-x-auto pb-2 scrollbar-none">
                    <div className="bg-gray-100 dark:bg-white/5 p-1 rounded-2xl flex gap-1 shadow-inner min-w-max">
                        {[
                            { id: "upload", label: "Upload", icon: "📁" },
                            { id: "audio", label: "Record", icon: "🎙️" },
                            { id: "video", label: "Record", icon: "📹" }
                        ].map((tab) => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-4 sm:px-8 py-2.5 rounded-xl text-[10px] sm:text-[11px] font-black uppercase transition-all flex items-center gap-2 sm:gap-3 ${activeTab === tab.id ? "bg-white dark:bg-[#1a1a1a] shadow-md text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-800"}`}
                            >
                                <span className="text-sm">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Upload Zone */}
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2.5rem] p-16 text-center group cursor-pointer hover:border-red-500/30 transition-all mb-8 bg-gray-50/50 dark:bg-white/[0.01]"
                >
                    <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="video/*,audio/*" />
                    <div className="w-20 h-20 mx-auto bg-white dark:bg-white/5 rounded-[2rem] flex items-center justify-center mb-6 text-3xl shadow-xl transition-transform group-hover:scale-110">
                        🎬
                    </div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2">Drop a file here, or <span className="text-red-500">browse</span></h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-loose">
                        Audio: MP3, WAV, M4A, OGG, FLAC · Video: MP4, MOV, WEBM · Up to 5 MB, 2 min
                    </p>

                    {processing && (
                        <div className="absolute inset-0 bg-white/90 dark:bg-black/90 backdrop-blur-md flex flex-col items-center justify-center z-20 rounded-[2.5rem]">
                            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-6" />
                            <p className="text-[12px] font-black uppercase tracking-[0.5em] text-red-500 animate-pulse">Syncing Audio Frames...</p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Preview Area */}
                    <div className="md:col-span-2">
                        <div className="bg-gray-100 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-[1.5rem] sm:rounded-[2.5rem] aspect-video flex flex-col items-center justify-center p-6 sm:p-12 text-center group">
                            {file ? (
                                <div className="space-y-4">
                                    <div className="w-16 h-16 mx-auto bg-green-500/10 text-green-500 rounded-full flex items-center justify-center text-2xl">✓</div>
                                    <h4 className="text-sm font-black uppercase tracking-widest">{file.name}</h4>
                                    <p className="text-[10px] text-gray-500">Ready for playback</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="w-20 h-20 mx-auto bg-gray-200 dark:bg-white/5 rounded-[2rem] flex items-center justify-center text-3xl text-gray-400 opacity-50 group-hover:opacity-100 transition-opacity">
                                        📽️
                                    </div>
                                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-gray-300">No file selected</h3>
                                    <p className="text-[11px] font-medium text-gray-500 uppercase tracking-widest">Upload a video or audio file to get started</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Captions Sidebar */}
                    <div className="md:col-span-1">
                        <div className="bg-white dark:bg-[#0d0d0d] border border-gray-100 dark:border-white/5 rounded-[2.5rem] h-full flex flex-col">
                            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Captions</h3>
                                {captions.length > 0 && <button className="text-[10px] font-black uppercase text-blue-500 hover:underline">Export SRT</button>}
                            </div>
                            <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[400px] scrollbar-none">
                                {captions.length > 0 ? (
                                    captions.map((cap, i) => (
                                        <motion.div 
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            key={i} 
                                            className="p-4 bg-gray-50 dark:bg-white/[0.03] rounded-2xl border border-transparent hover:border-red-500/30 transition-all cursor-pointer group"
                                        >
                                            <span className="text-[10px] font-black text-red-500 mb-2 block">{cap.time}</span>
                                            <p className="text-[13px] font-bold text-gray-800 dark:text-gray-200 leading-relaxed">{cap.text}</p>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center py-20 text-center opacity-30">
                                        <div className="text-2xl mb-4">💬</div>
                                        <p className="text-[11px] font-black uppercase italic tracking-widest">No captions yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Advanced Features Ad */}
                <div className="mt-12 bg-black rounded-[3rem] p-12 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-red-600/10 to-blue-600/10 opacity-50" />
                    <h3 className="text-3xl font-black italic tracking-tighter mb-4 relative z-10">AI-DRIVEN GLOBAL SUBTITLES</h3>
                    <p className="text-gray-500 font-medium max-w-xl mx-auto relative z-10 text-sm">Experience state-of-the-art speech recognition with 99% accuracy across 50+ regional languages. Perfect for social media, education, and professional editing.</p>
                </div>
            </main>

            <Footer />
        </div>
    );
}
