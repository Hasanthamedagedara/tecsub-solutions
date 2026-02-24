"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { techNews } from "@/data/product";
import { useAppContext } from "@/components/ThemeProvider";
import { t } from "@/data/translations";
import { useAdminContent, adminToNews } from "@/hooks/useAdminContent";


/* ─── News Article Modal ─── */
function NewsModal({
    article,
    onClose,
}: {
    article: (typeof techNews)[number];
    onClose: () => void;
}) {
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
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: article.color }} />
                            <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: article.color }}>
                                {article.category}
                            </span>
                            <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                                {article.date}
                            </span>
                        </div>
                        <h3 className="font-bebas text-2xl sm:text-3xl tracking-wide" style={{ color: "var(--text-primary)" }}>
                            {article.title}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0 ml-4"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Full Content */}
                <div
                    className="text-sm leading-relaxed whitespace-pre-line"
                    style={{ color: "var(--text-secondary)" }}
                >
                    {article.fullContent}
                </div>

                {/* Share / Close */}
                <div className="mt-6 flex items-center gap-3">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(
                                `${article.title}\n\n${article.fullContent}`
                            );
                        }}
                        className="px-5 py-2.5 rounded-full border border-white/20 text-sm font-semibold hover:border-tecsubCyan hover:text-tecsubCyan transition-all duration-300"
                        style={{ color: "var(--text-primary)" }}
                    >
                        Copy Article
                    </button>
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-full bg-tecsubCyan text-tecsubNavy font-semibold text-sm"
                    >
                        Close
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ─── Main Component ─── */
export default function TechNews() {
    const { language } = useAppContext();
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [selectedArticle, setSelectedArticle] = useState<(typeof techNews)[number] | null>(null);
    const adminNews = useAdminContent("news");
    const allNews = [...techNews, ...adminToNews(adminNews)];

    return (
        <>
            <motion.section
                id="news"
                ref={ref}
                initial={{ opacity: 0, y: 60 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
            >
                <div className="mb-12 sm:mb-16">
                    <h2 className="font-bebas text-4xl sm:text-6xl md:text-7xl gradient-text leading-[0.95]">
                        {t(language, "section_news")}
                    </h2>
                    <p className="mt-3 text-base sm:text-lg max-w-xl font-light" style={{ color: "var(--text-secondary)" }}>
                        {t(language, "section_news_sub")}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {allNews.map((news, i) => (
                        <motion.article
                            key={news.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: i * 0.12 }}
                            className="glass-panel p-6 sm:p-8 card-hover group cursor-pointer"
                            onClick={() => setSelectedArticle(news)}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: news.color }} />
                                <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: news.color }}>
                                    {news.category}
                                </span>
                                <span className="text-xs ml-auto" style={{ color: "var(--text-secondary)" }}>
                                    {news.date}
                                </span>
                            </div>

                            <h3
                                className="font-bebas text-xl sm:text-2xl tracking-wide mb-2 group-hover:text-tecsubCyan transition-colors duration-300"
                                style={{ color: "var(--text-primary)" }}
                            >
                                {news.title}
                            </h3>

                            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                                {news.summary}
                            </p>

                            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-tecsubCyan opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                                Read more
                                <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </motion.section>

            {/* News Article Modal */}
            <AnimatePresence>
                {selectedArticle && (
                    <NewsModal
                        article={selectedArticle}
                        onClose={() => setSelectedArticle(null)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
