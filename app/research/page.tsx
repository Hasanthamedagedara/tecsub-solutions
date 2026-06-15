"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdPlacement from "@/components/AdPlacement";

interface PaperData {
    title: string;
    authors: string[];
    journal: string;
    year: string;
    doi: string;
    abstract: string;
    pdfUrl: string | null;
    publisher: string;
}

export default function ResearchDiscoveryPage() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [paper, setPaper] = useState<PaperData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<"info" | "viewer">("info");

    const extractDOI = (input: string) => {
        const doiRegex = /\b(10\.\d{4,9}\/[-._;()/:A-Z0-9]+)\b/i;
        const match = input.match(doiRegex);
        return match ? match[1] : input.trim();
    };

    const fetchPaperData = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setError(null);
        setPaper(null);
        setViewMode("info");

        const doi = extractDOI(query);

        try {
            // 1. Fetch Metadata from Crossref
            const crossrefRes = await fetch(`https://api.crossref.org/works/${doi}`);
            if (!crossrefRes.ok) throw new Error("Paper not found. Please check the DOI or URL.");
            const crossrefData = await crossrefRes.json();
            const work = crossrefData.message;

            // 2. Fetch Open Access info from Unpaywall
            const unpaywallRes = await fetch(`https://api.unpaywall.org/v2/${doi}?email=research@tecsub.online`);
            const unpaywallData = await unpaywallRes.json();

            const paperInfo: PaperData = {
                title: work.title?.[0] || "No title available",
                authors: work.author?.map((a: any) => `${a.given} ${a.family}`) || [],
                journal: work["container-title"]?.[0] || "Unknown Journal",
                year: work.issued?.["date-parts"]?.[0]?.[0]?.toString() || "N/A",
                doi: work.DOI,
                abstract: work.abstract?.replace(/<[^>]*>?/gm, '') || "Abstract not available for this paper.",
                pdfUrl: unpaywallData.best_oa_location?.url_for_pdf || unpaywallData.best_oa_location?.url || null,
                publisher: work.publisher || "Unknown Publisher"
            };

            setPaper(paperInfo);
        } catch (err: any) {
            setError(err.message || "An error occurred while fetching data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--yt-bg)] text-[var(--yt-text-primary)]">
            <Navbar />
            
            <div className="pt-32 pb-12 px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4"
                        >
                            Open Access Discovery
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter">RESEARCH <span className="text-blue-500">DISCOVERY</span></h1>
                        <p className="text-[#888] text-sm md:text-base max-w-2xl mx-auto">
                            Instantly find and view millions of open-access research papers using DOIs or URLs. Powered by Crossref and Unpaywall.
                        </p>
                    </div>

                    {/* Search Section */}
                    <div className="max-w-3xl mx-auto mb-12">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative flex items-center bg-[var(--yt-bg-secondary)] border border-[var(--yt-border)] p-2 rounded-2xl overflow-hidden">
                                <span className="pl-4 text-white/30">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                                </span>
                                <input 
                                    type="text" 
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && fetchPaperData()}
                                    placeholder="Enter DOI or Paste Paper URL (e.g. 10.1145/3313831.3376131)" 
                                    className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-sm md:text-base placeholder:text-white/10"
                                />
                                <button 
                                    onClick={fetchPaperData}
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            Searching...
                                        </>
                                    ) : "Discovery"}
                                </button>
                            </div>
                        </div>
                        {error && <p className="mt-4 text-red-400 text-center text-sm font-medium">⚠️ {error}</p>}
                    </div>

                    {/* Results Section */}
                    <AnimatePresence mode="wait">
                        {paper && (
                            <motion.div 
                                key={paper.doi}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="grid lg:grid-cols-12 gap-8"
                            >
                                {/* Info Sidebar */}
                                <div className="lg:col-span-4 space-y-6">
                                    <div className="bg-[var(--yt-bg-secondary)] rounded-3xl p-6 border border-[var(--yt-border)] h-fit">
                                        <div className="mb-6">
                                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-2">Publisher & Journal</span>
                                            <h3 className="font-bold text-lg leading-tight">{paper.journal}</h3>
                                            <p className="text-sm text-[#666] mt-1">{paper.publisher} · {paper.year}</p>
                                        </div>

                                        <div className="space-y-4 pt-6 border-t border-white/5">
                                            <div>
                                                <span className="text-[10px] font-black text-[#444] uppercase tracking-widest block mb-1">DOI</span>
                                                <p className="text-xs font-mono text-[#888] break-all">{paper.doi}</p>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black text-[#444] uppercase tracking-widest block mb-1">Authors</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {paper.authors.slice(0, 5).map((a, i) => (
                                                        <span key={i} className="px-2 py-1 bg-white/5 rounded text-[10px] font-medium border border-white/5">{a}</span>
                                                    ))}
                                                    {paper.authors.length > 5 && <span className="text-[10px] text-[#444]">+{paper.authors.length - 5} more</span>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 space-y-3">
                                            {paper.pdfUrl ? (
                                                <>
                                                    <button 
                                                        onClick={() => setViewMode(viewMode === "viewer" ? "info" : "viewer")}
                                                        className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                                        {viewMode === "viewer" ? "Back to Abstract" : "View Full Paper"}
                                                    </button>
                                                    <a 
                                                        href={paper.pdfUrl} 
                                                        target="_blank" 
                                                        className="w-full py-4 rounded-2xl bg-[var(--yt-bg-hover)] border border-[var(--yt-border)] text-[var(--yt-text-primary)] font-black text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                                        Download PDF
                                                    </a>
                                                </>
                                            ) : (
                                                <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-center text-xs font-medium">
                                                    🔒 This paper is behind a paywall. No open-access version found.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <AdPlacement format="banner" />
                                </div>

                                {/* Content Area */}
                                <div className="lg:col-span-8">
                                    <div className="bg-[var(--yt-bg-secondary)] rounded-3xl border border-[var(--yt-border)] overflow-hidden min-h-[500px]">
                                        <AnimatePresence mode="wait">
                                            {viewMode === "info" ? (
                                                <motion.div 
                                                    key="abstract"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="p-8 md:p-12"
                                                >
                                                    <h2 className="text-2xl md:text-4xl font-bold mb-8 leading-tight">{paper.title}</h2>
                                                    <div className="prose prose-invert max-w-none">
                                                        <h4 className="text-blue-500 uppercase tracking-widest text-[10px] font-black mb-4">Abstract</h4>
                                                        <p className="text-[var(--yt-text-secondary)] leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                                                            {paper.abstract}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <motion.div 
                                                    key="viewer"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="h-[800px] w-full"
                                                >
                                                    <div className="h-full w-full bg-white">
                                                        <iframe 
                                                            src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(paper.pdfUrl || "")}`}
                                                            className="w-full h-full border-none"
                                                            title="Paper Viewer"
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Features/Info */}
                    {!paper && !loading && (
                        <div className="mt-16 grid md:grid-cols-3 gap-8">
                            <div className="p-6 bg-[var(--yt-bg-secondary)] rounded-3xl border border-[var(--yt-border)]">
                                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 text-2xl mb-4 font-bold">📚</div>
                                <h3 className="font-bold mb-2">50M+ Papers</h3>
                                <p className="text-xs text-[#666] leading-relaxed">Search through a massive database of journals and conference papers from IEEE, ACM, Elsevier, and more.</p>
                            </div>
                            <div className="p-6 bg-[var(--yt-bg-secondary)] rounded-3xl border border-[var(--yt-border)]">
                                <div className="w-12 h-12 rounded-2xl bg-cyan-600/10 flex items-center justify-center text-cyan-500 text-2xl mb-4 font-bold">🌍</div>
                                <h3 className="font-bold mb-2">Open Access</h3>
                                <p className="text-xs text-[#666] leading-relaxed">Automatically identifies legal open-access versions of research papers so you can read them for free.</p>
                            </div>
                            <div className="p-6 bg-[var(--yt-bg-secondary)] rounded-3xl border border-[var(--yt-border)]">
                                <div className="w-12 h-12 rounded-2xl bg-purple-600/10 flex items-center justify-center text-purple-500 text-2xl mb-4 font-bold">⚡</div>
                                <h3 className="font-bold mb-2">Instant Viewer</h3>
                                <p className="text-xs text-[#666] leading-relaxed">Built-in PDF viewer powered by PDF.js allows you to read documents directly within the TecSub environment.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}
