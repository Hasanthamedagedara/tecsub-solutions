"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/components/ThemeProvider";

export default function ImageEnhancerPage() {
    const [image, setImage] = useState<string | null>(null);
    const [upscale, setUpscale] = useState(2);
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

    const handleEnhance = () => {
        if (!image) return;
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setResult(image); // Simulated result
        }, 4000);
    };

    const t = {
        title: { en: "AI IMAGE ENHANCER", si: "AI රූප වැඩිදියුණු කරන්නා" },
        desc: { en: "Upscale and restore low-resolution photos using neural AI.", si: "අඩු ගුණාත්මක ඡායාරූප උසස් මට්ටමට සහ පැහැදිලි බවට පත් කරන්න." }
    };

    const currentLang = (language === "si" || language === "ta") ? "si" : "en";

    return (
        <div className="min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-300">
            <Navbar />

            <main className="pt-24 sm:pt-32 pb-20 px-4 max-w-5xl mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl sm:text-6xl font-black italic tracking-tighter mb-4 gradient-text uppercase"
                    >
                        {t.title[currentLang]}
                    </motion.h1>
                    <p className="text-[12px] sm:text-[14px] text-gray-500 font-medium">{t.desc[currentLang]}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Controls */}
                    <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
                        <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-3xl p-6">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Enhancement Settings</h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[11px] font-black uppercase mb-3 block">Upscale Factor</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[2, 4, 8].map((f) => (
                                            <button 
                                                key={f}
                                                onClick={() => setUpscale(f)}
                                                className={`py-2 rounded-xl text-xs font-black transition-all ${upscale === f ? "bg-blue-500 text-white shadow-lg" : "bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-white"}`}
                                            >
                                                {f}X
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {["Remove Noise", "Face Restoration", "Color Fix"].map((opt) => (
                                        <label key={opt} className="flex items-center justify-between cursor-pointer group">
                                            <span className="text-[11px] font-bold text-gray-500 group-hover:text-blue-500 transition-colors">{opt}</span>
                                            <div className="w-8 h-4 bg-gray-200 dark:bg-white/10 rounded-full p-0.5 relative">
                                                <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button 
                                onClick={handleEnhance}
                                disabled={!image || processing}
                                className={`w-full mt-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${!image || processing ? "bg-gray-100 dark:bg-white/5 text-gray-300" : "bg-blue-500 text-white shadow-2xl hover:scale-95"}`}
                            >
                                {processing ? "Processing..." : "Enhance Image"}
                            </button>
                        </div>

                        <div className="bg-[#eff6ff] dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 rounded-2xl p-4">
                            <p className="text-[10px] font-bold text-blue-600 leading-tight">Pro Tip: For best results, ensure the image has good lighting and clear subjects.</p>
                        </div>
                    </div>

                    {/* Preview Area */}
                    <div className="lg:col-span-2 order-1 lg:order-2">
                        <div 
                            className={`relative aspect-square sm:aspect-[4/3] rounded-[1.5rem] sm:rounded-[2.5rem] border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden ${image ? "border-transparent" : "border-gray-200 dark:border-white/10 hover:border-blue-500/30 cursor-pointer"}`}
                            onClick={() => !image && fileInputRef.current?.click()}
                        >
                            <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />

                            {image ? (
                                <>
                                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                    {result && (
                                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                                            <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-3xl shadow-2xl text-center">
                                                <div className="text-3xl mb-4">✨</div>
                                                <h4 className="text-lg font-black uppercase italic mb-4">Enhancement Complete</h4>
                                                <button className="px-8 py-3 bg-blue-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl">Download Result</button>
                                            </div>
                                        </div>
                                    )}
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); setImage(null); setResult(null); }}
                                        className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </>
                            ) : (
                                <div className="text-center p-8">
                                    <div className="w-20 h-20 mx-auto bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-6 text-3xl">
                                        🖼️
                                    </div>
                                    <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2">Drop your image here</h3>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select photo to enhance</p>
                                </div>
                            )}

                            {processing && (
                                <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-20">
                                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6" />
                                    <p className="text-[12px] font-black uppercase tracking-[0.3em] text-blue-500">Upscaling Texture...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
