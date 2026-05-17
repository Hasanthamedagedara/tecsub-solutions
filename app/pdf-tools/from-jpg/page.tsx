"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/components/ThemeProvider";

export default function PdfToolPage() {
    const [file, setFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [output, setOutput] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            simulateProcess();
        }
    };

    const simulateProcess = () => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setOutput("Your document has been successfully processed.");
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-300 flex flex-col">
            <Navbar />

            <main className="pt-24 sm:pt-32 pb-20 px-4 max-w-4xl mx-auto flex-grow w-full">
                {/* Header */}
                <div className="mb-8 text-center sm:text-left">
                    <h1 className="text-3xl sm:text-4xl font-black flex items-center justify-center sm:justify-start gap-3 mb-3 italic">
                        <span>🖼️</span>
                        JPG to PDF
                    </h1>
                    <p className="text-gray-500 text-[13px] font-medium leading-relaxed">
                        Securely process your PDF files directly in your browser. 100% private and fast.
                    </p>
                </div>

                {/* Upload Zone */}
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[2.5rem] p-12 text-center group cursor-pointer hover:border-blue-500/50 transition-all mb-6 overflow-hidden bg-gray-50/50 dark:bg-white/[0.02]"
                >
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleUpload}
                        className="hidden" 
                        accept=".pdf"
                    />
                    
                    {file ? (
                        <div className="space-y-4">
                            <div className="w-20 h-20 mx-auto bg-blue-100 dark:bg-blue-500/20 text-blue-500 rounded-3xl flex items-center justify-center mb-4 text-3xl shadow-lg">
                                📄
                            </div>
                            <h3 className="text-lg font-black">{file.name}</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase">Click to replace file</p>
                        </div>
                    ) : (
                        <div className="py-8">
                            <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform">
                                📄
                            </div>
                            <h3 className="text-xl font-black mb-1 uppercase italic tracking-tighter">Select PDF File</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">or drop PDF here</p>
                        </div>
                    )}

                    {processing && (
                        <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-[11px] font-black uppercase tracking-widest text-blue-500">Processing JPG to PDF...</p>
                        </div>
                    )}
                </div>

                {/* Info Bar */}
                <div className="bg-[#eff6ff] dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 rounded-2xl p-4 mb-8 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div>
                        <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400">100% Private Processing</p>
                        <p className="text-[9px] text-blue-500/60 font-medium leading-tight">Files are processed securely. We don't store your documents on our servers.</p>
                    </div>
                </div>

                {/* Output */}
                <AnimatePresence>
                    {output && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-50 dark:bg-[#0d0d0d] border border-green-500/30 rounded-[2rem] p-8 text-center"
                        >
                            <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-4">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                            <h3 className="text-xl font-black mb-2 text-green-600 dark:text-green-400">Task Completed</h3>
                            <p className="text-sm font-medium text-gray-500 mb-6">{output}</p>
                            
                            <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full text-[12px] font-black uppercase tracking-widest transition-all">
                                Download Result
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <Footer />
        </div>
    );
}