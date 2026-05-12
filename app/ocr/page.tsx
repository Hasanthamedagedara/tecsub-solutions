"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/components/ThemeProvider";

export default function OcrPage() {
    const [mode, setMode] = useState<"standard" | "ai">("standard");
    const [isPreprocessing, setIsPreprocessing] = useState(true);
    const [image, setImage] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [output, setOutput] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { language } = useAppContext();

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (prev) => {
                setImage(prev.target?.result as string);
                simulateOCR();
            };
            reader.readAsDataURL(file);
        }
    };

    const simulateOCR = () => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setOutput("මෙම රූපයේ අඩංගු සිංහල අකුරු සාර්ථකව හඳුනා ගන්නා ලදී. (This is a simulated OCR result from Tecsub AI Vision engine).");
        }, 3000);
    };

    const t = {
        title: { en: "SINHALA OCR SCANNER", si: "සිංහල OCR ස්කෑනර්" },
        desc: { en: "Photograph any Sinhala text — books, newspapers, signs — and get instant editable Unicode output.", si: "ඕනෑම සිංහල ලේඛනයක් හෝ ඡායාරූපයක් ක්ෂණිකව සංස්කරණය කළ හැකි යුනිකෝඩ් බවට පත් කරන්න." }
    };

    const currentLang = (language === "si" || language === "ta") ? "si" : "en";

    return (
        <div className="min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-300">
            <Navbar />

            <main className="pt-24 sm:pt-32 pb-20 px-4 max-w-4xl mx-auto">
                {/* Mode Toggle */}
                <div className="flex justify-center mb-8">
                    <div className="bg-gray-100 dark:bg-white/5 p-1 rounded-2xl flex flex-wrap justify-center gap-1 shadow-inner">
                        <button 
                            onClick={() => setMode("standard")}
                            className={`px-4 sm:px-6 py-2 rounded-xl text-[10px] sm:text-[11px] font-black uppercase transition-all ${mode === "standard" ? "bg-white dark:bg-[#1a1a1a] shadow-md text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-800"}`}
                        >
                            Standard
                        </button>
                        <button 
                            onClick={() => setMode("ai")}
                            className={`px-4 sm:px-6 py-2 rounded-xl text-[10px] sm:text-[11px] font-black uppercase transition-all flex items-center gap-2 ${mode === "ai" ? "bg-white dark:bg-[#1a1a1a] shadow-md text-red-500" : "text-gray-500 hover:text-red-400"}`}
                        >
                            AI Vision <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-md">PRO</span>
                        </button>
                    </div>
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-black flex items-center gap-3 mb-2 italic">
                        📸 {t.title[currentLang]}
                    </h1>
                    <p className="text-gray-500 text-[13px] font-medium leading-relaxed">
                        {t.desc[currentLang]} Supports Sinhala, Tamil and English. 100% in-browser, private.
                    </p>
                </div>

                {/* Privacy Banner */}
                <div className="bg-[#f0fdf4] dark:bg-green-500/5 border border-green-100 dark:border-green-500/20 rounded-2xl p-4 mb-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div>
                        <h4 className="text-[13px] font-black text-green-600 dark:text-green-400">Zero Uploads. 100% Private</h4>
                        <p className="text-[11px] text-green-500/80 font-medium">Your images are processed <strong className="text-green-700 dark:text-green-300">locally in your browser</strong> using our WebAssembly OCR engine. We never upload your sensitive documents or photos to our servers.</p>
                    </div>
                </div>

                {/* Settings */}
                <div className="bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl p-4 mb-6 flex items-center justify-between">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={isPreprocessing}
                            onChange={(e) => setIsPreprocessing(e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">Enable image preprocessing (higher accuracy)</span>
                    </label>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Recommended for best results</span>
                </div>

                {/* Upload Zone */}
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2.5rem] p-12 text-center group cursor-pointer hover:border-blue-500/50 transition-all mb-6 overflow-hidden"
                >
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleUpload}
                        className="hidden" 
                        accept="image/*"
                    />
                    
                    {image ? (
                        <div className="space-y-4">
                            <img src={image} alt="Preview" className="max-h-64 mx-auto rounded-xl shadow-2xl" />
                            <p className="text-[10px] font-black text-gray-400 uppercase">Click to replace image</p>
                        </div>
                    ) : (
                        <div className="py-8">
                            <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">
                                📷
                            </div>
                            <h3 className="text-xl font-black mb-1 uppercase italic tracking-tighter">Upload an image or use your camera</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">JPG, PNG, WebP · Max 10MB</p>
                        </div>
                    )}

                    {processing && (
                        <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-[11px] font-black uppercase tracking-widest text-blue-500">Analyzing Text Patterns...</p>
                        </div>
                    )}
                </div>

                {/* Info Bar */}
                <div className="bg-[#eff6ff] dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 rounded-2xl p-4 mb-8 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400">First use downloads language packs (~3 MB)</p>
                        <p className="text-[9px] text-blue-500/60 font-medium leading-tight">Language data is cached in your browser — subsequent uses are instant. Text never leaves your device.</p>
                    </div>
                </div>

                {/* Output (if any) */}
                <AnimatePresence>
                    {output && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-50 dark:bg-[#0d0d0d] border border-gray-100 dark:border-white/5 rounded-[2rem] p-8"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Extracted Text</span>
                                <button 
                                    onClick={() => navigator.clipboard.writeText(output)}
                                    className="px-4 py-1.5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-full text-[10px] font-black uppercase hover:text-blue-500 transition-all"
                                >
                                    Copy Result
                                </button>
                            </div>
                            <div className="text-2xl sm:text-3xl font-black leading-relaxed text-gray-900 dark:text-white">
                                {output}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <Footer />
        </div>
    );
}
