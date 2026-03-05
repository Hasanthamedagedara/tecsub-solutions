"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { aiPrompts } from "@/data/product";
import { useAppContext } from "@/components/ThemeProvider";
import { t } from "@/data/translations";
import { useAdminContent, adminToPrompts } from "@/hooks/useAdminContent";
import EngagementBar from "@/components/EngagementBar";

function PromptModal({
    prompt,
    onClose,
    language,
}: {
    prompt: (typeof aiPrompts)[number];
    onClose: () => void;
    language: "en" | "si" | "ta";
}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(prompt.prompt).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleDownloadPDF = () => {
        // Create a simple text-based download
        const content = `${prompt.title}\n\nCategory: ${prompt.category}\n\n${prompt.description}\n\n---\n\n${prompt.prompt}`;
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${prompt.title.replace(/\s+/g, "-").toLowerCase()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-panel p-6 sm:p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <span className="text-xs uppercase tracking-widest font-semibold text-tecsubCyan">
                            {prompt.category}
                        </span>
                        <h3 className="font-bebas text-2xl sm:text-3xl tracking-wide mt-1" style={{ color: "var(--text-primary)" }}>
                            {prompt.title}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                    {prompt.description}
                </p>

                {/* Prompt Content */}
                <div className="rounded-xl p-4 sm:p-6 mb-6 font-mono text-sm leading-relaxed whitespace-pre-wrap"
                    style={{ background: "rgba(0,0,0,0.3)", color: "var(--text-primary)" }}
                >
                    {prompt.prompt}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-tecsubCyan text-tecsubNavy font-semibold text-sm hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all duration-300"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {copied ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            )}
                        </svg>
                        {copied ? t(language, "copied") : t(language, "copy_prompt")}
                    </button>

                    <button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-sm font-semibold hover:border-tecsubCyan hover:text-tecsubCyan transition-all duration-300"
                        style={{ color: "var(--text-primary)" }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {t(language, "download_pdf")}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function AIPromptHub() {
    const { language } = useAppContext();
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [selectedPrompt, setSelectedPrompt] = useState<(typeof aiPrompts)[number] | null>(null);
    const adminPrompts = useAdminContent("prompts");
    const allPrompts = [...aiPrompts, ...adminToPrompts(adminPrompts)];

    const categoryColors: Record<string, string> = {
        Marketing: "#FF6B6B",
        Development: "#00E5FF",
        Content: "#FFD93D",
    };

    return (
        <>
            <motion.section
                id="prompts"
                ref={ref}
                initial={{ opacity: 0, y: 60 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
            >
                <div className="mb-12 sm:mb-16">
                    <h2 className="font-bebas text-4xl sm:text-6xl md:text-7xl gradient-text leading-[0.95]">
                        {t(language, "section_prompts")}
                    </h2>
                    <p className="mt-3 text-base sm:text-lg max-w-xl font-light" style={{ color: "var(--text-secondary)" }}>
                        {t(language, "section_prompts_sub")}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allPrompts.map((prompt, i) => (
                        <motion.div
                            key={prompt.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="glass-panel p-6 card-hover cursor-pointer group"
                            onClick={() => setSelectedPrompt(prompt)}
                        >
                            <span
                                className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full"
                                style={{
                                    background: `${categoryColors[prompt.category]}15`,
                                    color: categoryColors[prompt.category],
                                }}
                            >
                                {prompt.category}
                            </span>

                            <h3 className="font-bebas text-xl tracking-wide mt-3 mb-2" style={{ color: "var(--text-primary)" }}>
                                {prompt.title}
                            </h3>
                            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                                {prompt.description}
                            </p>

                            <div className="flex items-center gap-2 text-xs font-medium text-tecsubCyan">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                {t(language, "preview")}
                            </div>

                            <div onClick={(e) => e.stopPropagation()}>
                                <EngagementBar contentId={`prompt-${prompt.title.replace(/\s+/g, '-').slice(0, 30)}`} contentType="prompt" compact />
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-px rounded-b-xl bg-gradient-to-r from-transparent via-tecsubCyan/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Modal */}
            <AnimatePresence>
                {selectedPrompt && (
                    <PromptModal
                        prompt={selectedPrompt}
                        onClose={() => setSelectedPrompt(null)}
                        language={language}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
