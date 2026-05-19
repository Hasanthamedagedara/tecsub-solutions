"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdPlacement from "@/components/AdPlacement";
import { PDFDocument } from "pdf-lib";

interface FileState {
    bytes: ArrayBuffer | null;
    fileName: string;
    pageCount: number;
    pages: string[]; // Store rendered page image urls
}

export default function PdfAlignerPage() {
    const [leftFile, setLeftFile] = useState<FileState>({ bytes: null, fileName: "", pageCount: 0, pages: [] });
    const [rightFile, setRightFile] = useState<FileState>({ bytes: null, fileName: "", pageCount: 0, pages: [] });
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    const [pdfjsLoaded, setPdfjsLoaded] = useState(false);

    const leftInputRef = useRef<HTMLInputElement>(null);
    const rightInputRef = useRef<HTMLInputElement>(null);

    // Dynamically load PDF.js from CDN to avoid NextJS SSR and Webpack worker bundling headaches
    useEffect(() => {
        if (typeof window === "undefined") return;
        if ((window as any).pdfjsLib) {
            setPdfjsLoaded(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
        script.async = true;
        script.onload = () => {
            const pdfjsLib = (window as any).pdfjsLib;
            if (pdfjsLib) {
                pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
                setPdfjsLoaded(true);
            }
        };
        document.body.appendChild(script);

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    const processFile = async (file: File, side: "left" | "right") => {
        if (!file || file.type !== "application/pdf") return;
        if (!pdfjsLoaded) {
            alert("PDF engine is initializing, please try again in a second.");
            return;
        }

        setLoading(true);
        setLoadingText(`Parsing and rendering pages for ${file.name}...`);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfjsLib = (window as any).pdfjsLib;
            
            // Render previews
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer.slice(0) });
            const pdfDoc = await loadingTask.promise;
            
            const pageUrls: string[] = [];
            
            for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
                const page = await pdfDoc.getPage(pageNum);
                const viewport = page.getViewport({ scale: 1.5 });
                
                const canvas = document.createElement("canvas");
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    await page.render({ canvasContext: ctx, viewport }).promise;
                    pageUrls.push(canvas.toDataURL("image/webp"));
                }
            }

            const stateUpdate = {
                bytes: arrayBuffer,
                fileName: file.name,
                pageCount: pdfDoc.numPages,
                pages: pageUrls
            };

            if (side === "left") {
                setLeftFile(stateUpdate);
            } else {
                setRightFile(stateUpdate);
            }
        } catch (err) {
            console.error("Failed to parse PDF file", err);
            alert(`Error reading PDF file: ${err instanceof Error ? err.message : "Unknown error"}`);
        } finally {
            setLoading(false);
        }
    };

    const alignAndExport = async () => {
        if (!leftFile.bytes || !rightFile.bytes) return;

        setLoading(true);
        setLoadingText("Aligning and building side-by-side PDF document...");

        try {
            const leftSourceDoc = await PDFDocument.load(leftFile.bytes);
            const rightSourceDoc = await PDFDocument.load(rightFile.bytes);
            const mergedPdf = await PDFDocument.create();

            const leftPageCount = leftSourceDoc.getPageCount();
            const rightPageCount = rightSourceDoc.getPageCount();
            const totalTargetPages = Math.max(leftPageCount, rightPageCount);

            for (let i = 0; i < totalTargetPages; i++) {
                let pageWidth = 595.28; // Standard A4 Width in points
                let pageHeight = 841.89; // Standard A4 Height in points

                if (i < leftPageCount) {
                    const leftPageRef = leftSourceDoc.getPages()[i];
                    pageWidth = leftPageRef.getWidth();
                    pageHeight = leftPageRef.getHeight();
                } else if (i < rightPageCount) {
                    const rightPageRef = rightSourceDoc.getPages()[i];
                    pageWidth = rightPageRef.getWidth();
                    pageHeight = rightPageRef.getHeight();
                }

                // Add landscape page at exactly twice the A4 width
                const newPage = mergedPdf.addPage([pageWidth * 2, pageHeight]);

                if (i < leftPageCount) {
                    const [embeddedLeft] = await mergedPdf.copyPages(leftSourceDoc, [i]);
                    const pageStructure = await mergedPdf.embedPage(embeddedLeft);
                    newPage.drawPage(pageStructure, { x: 0, y: 0, width: pageWidth, height: pageHeight });
                }

                if (i < rightPageCount) {
                    const [embeddedRight] = await mergedPdf.copyPages(rightSourceDoc, [i]);
                    const pageStructure = await mergedPdf.embedPage(embeddedRight);
                    newPage.drawPage(pageStructure, { x: pageWidth, y: 0, width: pageWidth, height: pageHeight });
                }
            }

            const mergedPdfBytes = await mergedPdf.save();
            const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `Bilingual_Aligned_SideBySide_${Date.now()}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Failed to merge side by side PDFs", err);
            alert("Error during alignment compiler tasks.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#0f172a]" style={{ background: "var(--bg-primary)" }}>
            <Navbar />

            {/* Ambient Background Glow Elements */}
            <div className="absolute top-[10%] right-[10%] w-[350px] h-[350px] bg-tecsubCyan/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[90px] pointer-events-none" />

            <main className="flex-grow max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-8 flex flex-col">
                {/* Back Link & Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <a href="/" className="inline-flex items-center text-xs text-tecsubCyan hover:underline gap-1.5 mb-2 transition-all">
                            <span>← Back to Products</span>
                        </a>
                        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            Bilingual Side-by-Side PDF Aligner
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1">
                            Align original and translated PDFs side-by-side into a single landscape document.
                        </p>
                    </div>

                    <button
                        onClick={alignAndExport}
                        disabled={!leftFile.bytes || !rightFile.bytes}
                        className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all duration-300 ${
                            leftFile.bytes && rightFile.bytes
                                ? "bg-gradient-to-r from-tecsubCyan to-blue-600 text-black shadow-lg shadow-tecsubCyan/20 hover:scale-[1.02] cursor-pointer"
                                : "bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5"
                        }`}
                    >
                        <span>Export Side-by-Side PDF</span>
                    </button>
                </div>

                {/* Main Split Panels */}
                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[500px] mb-8">
                    {/* Left Column: Original */}
                    <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col relative overflow-hidden">
                        <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                            <h2 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
                                Left Side: Original PDF
                            </h2>
                            {leftFile.pageCount > 0 && (
                                <span className="text-[10px] sm:text-xs font-mono px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                    {leftFile.pageCount} pages
                                </span>
                            )}
                        </div>

                        {leftFile.pages.length === 0 ? (
                            <div 
                                onClick={() => leftInputRef.current?.click()}
                                className="flex-grow border-2 border-dashed border-white/10 hover:border-tecsubCyan/30 hover:bg-tecsubCyan/[0.02] rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer transition-all duration-300 group"
                            >
                                <input 
                                    ref={leftInputRef}
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) processFile(file, "left");
                                    }}
                                />
                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-full group-hover:scale-105 transition-transform mb-4">
                                    <svg className="w-8 h-8 text-gray-400 group-hover:text-tecsubCyan" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <p className="text-sm font-semibold text-white group-hover:text-tecsubCyan transition-colors">
                                    Upload Original PDF
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Click or drag and drop PDF here
                                </p>
                            </div>
                        ) : (
                            <div className="flex-grow overflow-y-auto max-h-[600px] space-y-4 p-2 bg-black/20 rounded-xl border border-white/5 scrollbar-thin">
                                {leftFile.pages.map((url, idx) => (
                                    <div key={idx} className="bg-black/40 p-2.5 rounded-lg border border-white/5 flex flex-col items-center shadow-md">
                                        <img src={url} alt={`Left PDF Page ${idx + 1}`} className="w-full h-auto rounded" />
                                        <span className="text-[10px] text-gray-500 font-mono mt-2">PAGE {idx + 1}</span>
                                    </div>
                                ))}
                                <button
                                    onClick={() => setLeftFile({ bytes: null, fileName: "", pageCount: 0, pages: [] })}
                                    className="w-full py-2.5 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs font-semibold rounded-lg transition-all"
                                >
                                    Remove Document
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Translated */}
                    <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col relative overflow-hidden">
                        <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4">
                            <h2 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                                Right Side: Translated PDF
                            </h2>
                            {rightFile.pageCount > 0 && (
                                <span className="text-[10px] sm:text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    {rightFile.pageCount} pages
                                </span>
                            )}
                        </div>

                        {rightFile.pages.length === 0 ? (
                            <div 
                                onClick={() => rightInputRef.current?.click()}
                                className="flex-grow border-2 border-dashed border-white/10 hover:border-tecsubCyan/30 hover:bg-tecsubCyan/[0.02] rounded-xl flex flex-col items-center justify-center p-8 cursor-pointer transition-all duration-300 group"
                            >
                                <input 
                                    ref={rightInputRef}
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) processFile(file, "right");
                                    }}
                                />
                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-full group-hover:scale-105 transition-transform mb-4">
                                    <svg className="w-8 h-8 text-gray-400 group-hover:text-tecsubCyan" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <p className="text-sm font-semibold text-white group-hover:text-tecsubCyan transition-colors">
                                    Upload Translated PDF
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Click or drag and drop PDF here
                                </p>
                            </div>
                        ) : (
                            <div className="flex-grow overflow-y-auto max-h-[600px] space-y-4 p-2 bg-black/20 rounded-xl border border-white/5 scrollbar-thin">
                                {rightFile.pages.map((url, idx) => (
                                    <div key={idx} className="bg-black/40 p-2.5 rounded-lg border border-white/5 flex flex-col items-center shadow-md">
                                        <img src={url} alt={`Right PDF Page ${idx + 1}`} className="w-full h-auto rounded" />
                                        <span className="text-[10px] text-gray-500 font-mono mt-2">PAGE {idx + 1}</span>
                                    </div>
                                ))}
                                <button
                                    onClick={() => setRightFile({ bytes: null, fileName: "", pageCount: 0, pages: [] })}
                                    className="w-full py-2.5 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs font-semibold rounded-lg transition-all"
                                >
                                    Remove Document
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <AdPlacement format="banner" className="mb-6" />
            </main>

            {/* Spinner Overlay */}
            <AnimatePresence>
                {loading && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-[#0B0F19]/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4"
                    >
                        <div className="w-12 h-12 border-4 border-tecsubCyan border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-gray-300 font-medium tracking-wide">
                            {loadingText}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
