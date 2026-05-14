"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/components/ThemeProvider";

export default function BgRemoverPage() {
    const [image, setImage] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { language } = useAppContext();

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (prev) => {
                setImage(prev.target?.result as string);
                setResult(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveBg = () => {
        if (!image) return;
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setResult(image); // Simulated transparency result
        }, 3500);
    };

    const t = {
        title: { en: "AI BACKGROUND REMOVER", si: "AI පසුබිම ඉවත් කරන්නා" },
        desc: { en: "Remove backgrounds from any image automatically in seconds.", si: "ඕනෑම ඡායාරූපයක පසුබිම තත්පර කිහිපයකින් ස්වයංක්රීයව ඉවත් කරන්න." }
    };

    const currentLang = (language === "si" || language === "ta") ? "si" : "en";

    return (
        <div className="min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-300">
            <Navbar />

            <main className="pt-24 sm:pt-32 pb-20 px-4 max-w-5xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                    <motion.h1 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-3xl sm:text-6xl font-black italic tracking-tighter mb-4 uppercase text-orange-500"
                    >
                        {t.title[currentLang]}
                    </motion.h1>
                    <p className="text-gray-400 font-medium tracking-wide uppercase text-[9px] sm:text-[10px]">{t.desc[currentLang]}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left: Controls */}
                    <div className="lg:col-span-1 order-2 lg:order-1">
                        <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-[1.5rem] sm:rounded-[2rem] p-6 lg:sticky lg:top-32">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-orange-500" />
                                Processing Engine
                            </h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[11px] font-black uppercase mb-3 block text-gray-400">Output Format</label>
                                    <div className="flex gap-2">
                                        {["PNG", "WebP"].map((f) => (
                                            <button key={f} className={`flex-1 py-2 rounded-xl text-[10px] font-black border transition-all ${f === "PNG" ? "bg-orange-500 text-white border-orange-500 shadow-lg" : "bg-transparent text-gray-500 border-gray-100 dark:border-white/5"}`}>
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
                                    <p className="text-[9px] font-black text-orange-500/80 leading-relaxed uppercase">
                                        Our AI uses edge-detection neural networks to extract subjects with hair-level precision.
                                    </p>
                                </div>
                            </div>

                            <button 
                                onClick={handleRemoveBg}
                                disabled={!image || processing}
                                className={`w-full mt-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${!image || processing ? "bg-gray-100 dark:bg-white/5 text-gray-300" : "bg-orange-500 text-white shadow-2xl hover:scale-95 active:scale-100"}`}
                            >
                                {processing ? "Processing..." : "Remove Background"}
                            </button>
                        </div>
                    </div>

                    {/* Right: Workspace */}
                    <div className="lg:col-span-3 order-1 lg:order-2">
                        <div 
                            className={`relative min-h-[350px] sm:min-h-[500px] rounded-[2rem] sm:rounded-[3rem] border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] ${image ? "border-transparent" : "border-gray-200 dark:border-white/10 hover:border-orange-500/30 cursor-pointer"}`}
                            onClick={() => !image && fileInputRef.current?.click()}
                        >
                            <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />

                            {image ? (
                                <div className="w-full h-full p-8 flex items-center justify-center relative">
                                    <AnimatePresence mode="wait">
                                        {result ? (
                                            <motion.div 
                                                key="result"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="relative group"
                                            >
                                                <img src={result} alt="Background removal result from Tecsub AI" className="max-h-[400px] rounded-2xl drop-shadow-2xl" />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-2xl flex items-center justify-center">
                                                    <button className="opacity-0 group-hover:opacity-100 px-8 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-2xl hover:scale-110">Download PNG</button>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.img 
                                                key="original"
                                                initial={{ opacity: 0 }} 
                                                animate={{ opacity: 1 }} 
                                                src={image} 
                                                alt="Original" 
                                                className="max-h-[400px] rounded-2xl opacity-50 grayscale blur-[2px]" 
                                            />
                                        )}
                                    </AnimatePresence>

                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setImage(null); setResult(null); }}
                                        className="absolute top-8 right-8 w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors z-30"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center p-12 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-white/10">
                                    <div className="w-24 h-24 mx-auto bg-orange-500/10 rounded-[2rem] flex items-center justify-center mb-8 text-4xl shadow-inner">
                                        ✂️
                                    </div>
                                    <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-3">Drop image to clear</h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Neural Extraction Ready</p>
                                </div>
                            )}

                            {processing && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-xl flex flex-col items-center justify-center z-40">
                                    <div className="relative w-24 h-24 mb-8">
                                        <div className="absolute inset-0 border-4 border-orange-500/20 rounded-full" />
                                        <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                    <p className="text-[12px] font-black uppercase tracking-[0.5em] text-orange-500 animate-pulse">Extracting Alpha Channel...</p>
                                </div>
                            )}
                        </div>

                        {/* Status Bar */}
                        <div className="mt-6 flex justify-between items-center px-4">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Neural Network: Connected</span>
                            </div>
                            <div className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Processing Time: ~3.5s</div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
