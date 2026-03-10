"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PdfModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState("File Preview");
    const [loading, setLoading] = useState(true);

    /* ─── Listen for open-pdf event ─── */
    useEffect(() => {
        const handleOpenPdf = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail) {
                setPdfUrl(customEvent.detail.url);
                setFileName(customEvent.detail.title || "File Preview");
                setIsOpen(true);
                setLoading(true);
            }
        };

        window.addEventListener("tecsub-open-pdf", handleOpenPdf);
        return () => window.removeEventListener("tecsub-open-pdf", handleOpenPdf);
    }, []);

    const closePdf = () => {
        setIsOpen(false);
        setTimeout(() => setPdfUrl(null), 300); // clear after animation
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="pdf-modal-overlay"
                    onClick={closePdf}
                >
                    <motion.div
                        initial={{ y: 50, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 50, opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="preview-card"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="preview-header">
                            <span id="file-name" className="font-semibold text-lg truncate pr-4">{fileName}</span>
                            <div className="flex items-center gap-3">
                                {pdfUrl && (
                                    <a
                                        href={pdfUrl}
                                        id="download-link"
                                        className="btn-dl"
                                        download
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Download
                                    </a>
                                )}
                                <button
                                    onClick={closePdf}
                                    className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                    aria-label="Close"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Body / Iframe */}
                        <div className="preview-body" id="preview-area">
                            {loading && <div className="loader" id="loader"></div>}
                            
                            {pdfUrl ? (
                                <iframe
                                    id="file-iframe"
                                    src={pdfUrl}
                                    className="w-full h-full border-none"
                                    onLoad={() => setLoading(false)}
                                    title={fileName}
                                    allowFullScreen
                                />
                            ) : (
                                <div className="text-gray-500 font-medium">No PDF URL Provided.</div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
