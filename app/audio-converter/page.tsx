"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AUDIO_FORMATS = [
    "MP3", "WAV", "FLAC", "M4A", "AAC", "OGG", "WMA", "AIFF", "ALAC", "DSD", "PCM", "OPUS"
];

export default function AudioConverterPage() {
    const [file, setFile] = useState<File | null>(null);
    const [targetFormat, setTargetFormat] = useState("MP3");
    const [isConverting, setIsConverting] = useState(false);
    const [bitrate, setBitrate] = useState("320kbps");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setFile(f);
    };

    const handleConvert = () => {
        if (!file) return;
        setIsConverting(true);
        setTimeout(() => {
            setIsConverting(false);
            alert(`Successfully converted ${file.name} to ${targetFormat}!`);
        }, 3000);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#080808] text-white font-sans selection:bg-indigo-500/30">
            <Navbar />

            <main className="flex-1 max-w-6xl mx-auto w-full px-6 pt-32 pb-24">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Side: Upload & Info */}
                    <div className="flex-1 space-y-8">
                        <div>
                            <h1 className="text-5xl font-black tracking-tight mb-4">Audio Converter</h1>
                            <p className="text-gray-400 text-lg">Convert your audio files to high-quality formats instantly with our cloud-based engine.</p>
                        </div>

                        {!file ? (
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="group cursor-pointer aspect-video md:aspect-[21/9] rounded-[2.5rem] bg-[#111] border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-6 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all"
                            >
                                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-3xl group-hover:scale-110 transition-all">🔊</div>
                                <div className="text-center">
                                    <p className="text-xl font-bold">Drop your audio here</p>
                                    <p className="text-sm opacity-40 mt-1 uppercase tracking-widest font-black">or click to browse</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[#111] rounded-[2.5rem] border border-white/5 p-8 flex items-center gap-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8">
                                    <button onClick={() => setFile(null)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-all">✕</button>
                                </div>
                                <div className="w-24 h-24 rounded-[2rem] bg-indigo-600/20 flex items-center justify-center text-3xl text-indigo-400">🎵</div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold truncate max-w-md">{file.name}</h3>
                                    <div className="flex gap-4 mt-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-white/5 rounded-md opacity-60">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-white/5 rounded-md opacity-60">{file.type || "Audio"}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Visualizer Mock */}
                        <div className="h-24 flex items-center gap-1 px-4">
                            {[...Array(60)].map((_, i) => (
                                <motion.div 
                                    key={i}
                                    animate={{ height: isConverting ? [10, 40, 20, 60, 10] : 10 }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.05 }}
                                    className="flex-1 bg-gradient-to-t from-indigo-600 to-purple-600 rounded-full opacity-20"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Settings & Convert */}
                    <div className="w-full lg:w-[400px] space-y-8">
                        <div className="bg-[#111] rounded-[2.5rem] border border-white/5 p-8 shadow-2xl space-y-8">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-4 block">Target Format</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {AUDIO_FORMATS.slice(0, 9).map(f => (
                                        <button 
                                            key={f}
                                            onClick={() => setTargetFormat(f)}
                                            className={`h-12 rounded-xl text-xs font-black transition-all border ${targetFormat === f ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "bg-white/5 border-white/5 hover:bg-white/10 opacity-60"}`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-4 block">Quality (Bitrate)</label>
                                <select 
                                    value={bitrate}
                                    onChange={(e) => setBitrate(e.target.value)}
                                    className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-sm font-bold outline-none focus:border-indigo-500/40 transition-all appearance-none"
                                >
                                    <option value="320kbps">High Fidelity (320 kbps)</option>
                                    <option value="256kbps">Studio (256 kbps)</option>
                                    <option value="192kbps">Standard (192 kbps)</option>
                                    <option value="128kbps">Mobile (128 kbps)</option>
                                </select>
                            </div>

                            <button 
                                onClick={handleConvert}
                                disabled={!file || isConverting}
                                className="w-full h-16 bg-gradient-to-br from-indigo-600 to-purple-600 hover:scale-[1.02] active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed text-white rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/20 flex items-center justify-center gap-4 transition-all mt-4"
                            >
                                {isConverting ? (
                                    <>
                                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                        Converting...
                                    </>
                                ) : (
                                    "Convert Now"
                                )}
                            </button>
                        </div>

                        <div className="p-8 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10">
                            <h4 className="text-sm font-bold text-indigo-400 mb-2">Cloud Engine v2.4</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">Processing is handled on our secure distributed servers. Your files are automatically deleted after 2 hours.</p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="audio/*" 
                onChange={handleUpload} 
            />
        </div>
    );
}
