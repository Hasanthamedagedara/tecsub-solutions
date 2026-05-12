"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/components/ThemeProvider";

const FORMATS = [
    "AVIF", "BMP", "EPS", "GIF", "ICNS", "ICO", "JPG", "ODD", "PNG", "PS", "PSD", "TIFF", "WEBP"
];

export default function ImageConverterPage() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [targetFormat, setTargetFormat] = useState("ICO");
    const [isConverting, setIsConverting] = useState(false);
    const { theme } = useAppContext();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const handleConvert = () => {
        if (!file) return;
        setIsConverting(true);
        // Simulating conversion delay
        setTimeout(() => {
            setIsConverting(false);
            alert(`Simulated conversion to ${targetFormat} successful! (Production logic would use a backend or WASM converter here)`);
        }, 2000);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#0d0f14] text-white font-sans selection:bg-red-500/30">
            {/* ═══ Header Section (Visual Flow) ═══ */}
            <div className="h-64 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-red-600/5 to-transparent pointer-events-none" />
                <div className="flex items-center gap-12 z-10">
                    {/* Source Format */}
                    <div className="w-24 h-32 bg-[#1a1d24] rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-2 shadow-2xl transition-all hover:border-white/10">
                        <div className="text-3xl">📄</div>
                        <span className="text-xs font-black opacity-60">{file ? file.name.split('.').pop()?.toUpperCase() : "PNG"}</span>
                    </div>

                    {/* Arrow / Flow */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-xl animate-spin-slow">🔄</div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">TO</span>
                    </div>

                    {/* Target Format */}
                    <div className="w-24 h-32 bg-[#1a1d24] rounded-2xl border border-red-500/20 shadow-[0_0_50px_rgba(220,38,38,0.1)] flex flex-col items-center justify-center gap-2 transition-all hover:border-red-500/40">
                        <div className="text-3xl">📂</div>
                        <span className="text-xs font-black text-red-500">{targetFormat}</span>
                    </div>
                </div>
            </div>

            {/* ═══ Main Editor UI ═══ */}
            <main className="flex-1 max-w-5xl mx-auto w-full px-6 pb-20">
                <div className="bg-[#1a1d24] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                    {/* Toolbar */}
                    <div className="h-16 px-6 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold transition-all flex items-center gap-2">
                                <span>+ Add File</span>
                            </button>
                            {file && <span className="text-xs font-medium opacity-40">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase opacity-30 mr-2">Convert to</span>
                            <div className="px-3 py-2 bg-red-600/10 border border-red-500/20 rounded-lg text-xs font-black text-red-500 flex items-center gap-3">
                                {targetFormat}
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 12 0-6 6z"/></svg>
                            </div>
                        </div>
                    </div>

                    {/* Format Selector Grid */}
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Left: Category Selector */}
                            <div className="w-full md:w-48 space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-20 mb-4">Category</p>
                                <button className="w-full px-4 py-3 bg-white/5 text-left rounded-xl text-xs font-bold border border-white/5">Document</button>
                                <button className="w-full px-4 py-3 bg-red-600/10 text-left rounded-xl text-xs font-black text-red-500 border border-red-500/20">Image</button>
                                <button className="w-full px-4 py-3 hover:bg-white/5 text-left rounded-xl text-xs font-bold transition-all opacity-40">Audio</button>
                            </div>

                            {/* Right: Format Buttons */}
                            <div className="flex-1 space-y-6">
                                <div className="relative">
                                    <input type="text" placeholder="Search Format..." className="w-full h-12 bg-white/5 border border-white/5 rounded-xl px-10 text-sm outline-none focus:border-red-500/40 transition-all" />
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
                                </div>
                                
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                    {FORMATS.map(f => (
                                        <button 
                                            key={f}
                                            onClick={() => setTargetFormat(f)}
                                            className={`h-12 rounded-xl text-[11px] font-black transition-all border ${targetFormat === f ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20" : "bg-white/5 border-white/5 hover:bg-white/10 opacity-60"}`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 bg-black/20 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg text-xs font-bold hover:bg-white/10 transition-all">
                                <span>☁️</span> Save to Cloud
                            </button>
                        </div>
                        <button 
                            onClick={handleConvert}
                            disabled={!file || isConverting}
                            className="px-8 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-20 disabled:cursor-not-allowed text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-red-600/20 flex items-center gap-3 transition-all"
                        >
                            {isConverting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Converting...
                                </>
                            ) : (
                                "Convert Now"
                            )}
                        </button>
                    </div>
                </div>
            </main>

            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleUpload} />

            <style jsx global>{`
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow { animation: spin-slow 8s linear infinite; }
            `}</style>
        </div>
    );
}
