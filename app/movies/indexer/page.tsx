"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdPlacement from "@/components/AdPlacement";

function IndexerContent() {
    const searchParams = useSearchParams();
    const [movieTitle, setMovieTitle] = useState("");
    const [dork, setDork] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const title = searchParams.get("title");
        if (title) {
            setMovieTitle(title);
            // Auto generate if title is provided
            const sanitizedTitle = title.replace(/[^a-zA-Z0-9 ]/g, "");
            const searchString = `intitle:"index of" "${sanitizedTitle}" (mkv|mp4|avi|1080p|720p)`;
            setDork(searchString);
        }
    }, [searchParams]);

    const generateDork = () => {
        if (!movieTitle.trim()) return;
        const sanitizedTitle = movieTitle.replace(/[^a-zA-Z0-9 ]/g, "");
        const searchString = `intitle:"index of" "${sanitizedTitle}" (mkv|mp4|avi|1080p|720p)`;
        setDork(searchString);
    };

    const triggerSearch = () => {
        if (!dork) return;
        const encodedQuery = encodeURIComponent(dork);
        const googleSearchUrl = `https://www.google.com/search?q=${encodedQuery}`;
        window.open(googleSearchUrl, '_blank');
    };

    const copyToClipboard = () => {
        if (!dork) return;
        navigator.clipboard.writeText(dork);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen text-[#f1f1f1]" style={{ background: "#0f0f0f" }}>
            <Navbar />
            
            <div className="pt-32 pb-12 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block px-3 py-1 rounded-full bg-yt-red/10 border border-yt-red/20 text-yt-red text-xs font-bold uppercase tracking-widest mb-4"
                        >
                            Legal Movie Search
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">MOVIE <span className="text-yt-red">INDEXER</span></h1>
                        <p className="text-[#aaa] text-sm md:text-base max-w-2xl mx-auto">
                            Generate advanced Google Dork queries to find open directories and direct download links for your favorite movies. 100% legal search facilitation.
                        </p>
                    </div>

                    {/* Main Tool Card */}
                    <div className="bg-[#1a1a1a] rounded-3xl p-6 md:p-10 border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yt-red/5 blur-[100px] -z-10 rounded-full" />
                        
                        <div className="space-y-6">
                            {/* Input Field */}
                            <div>
                                <label className="block text-xs font-bold text-[#666] uppercase tracking-widest mb-2 ml-1">Movie Title</label>
                                <div className="relative group">
                                    <input 
                                        type="text" 
                                        value={movieTitle}
                                        onChange={(e) => setMovieTitle(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && generateDork()}
                                        placeholder="Enter movie name (e.g. Avatar, John Wick 4)" 
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-lg focus:border-yt-red outline-none transition-all placeholder:text-white/20"
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <button 
                                            onClick={generateDork}
                                            className="bg-yt-red hover:bg-yt-red/90 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-yt-red/20 active:scale-95"
                                        >
                                            Generate
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Output Display */}
                            {dork && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-4 pt-4 border-t border-white/5"
                                >
                                    <div>
                                        <label className="block text-xs font-bold text-[#666] uppercase tracking-widest mb-2 ml-1">Generated Google Dork</label>
                                        <div className="relative group">
                                            <textarea 
                                                readOnly 
                                                value={dork}
                                                className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-sm font-mono text-yt-red min-h-[100px] outline-none"
                                            />
                                            <button 
                                                onClick={copyToClipboard}
                                                className="absolute top-3 right-3 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-white/60 hover:text-white"
                                                title="Copy to Clipboard"
                                            >
                                                {copied ? (
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                ) : (
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button 
                                            onClick={triggerSearch}
                                            className="flex-1 bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/90 transition-all group"
                                        >
                                            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google Search Engine" />
                                            SEARCH ON GOOGLE
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                <polyline points="15 3 21 3 21 9" />
                                                <line x1="10" y1="14" x2="21" y2="3" />
                                            </svg>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* How it works */}
                    <div className="mt-16 grid md:grid-cols-3 gap-8">
                        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 text-2xl mb-4 font-bold">1</div>
                            <h3 className="font-bold mb-2">Input Title</h3>
                            <p className="text-xs text-[#666] leading-relaxed">Enter the exact name of the movie or TV show you are looking for.</p>
                        </div>
                        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5">
                            <div className="w-12 h-12 rounded-xl bg-yt-red/10 flex items-center justify-center text-yt-red text-2xl mb-4 font-bold">2</div>
                            <h3 className="font-bold mb-2">Generate Dork</h3>
                            <p className="text-xs text-[#666] leading-relaxed">Our tool creates a specialized search string that instructs Google to find open directories.</p>
                        </div>
                        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-white/5">
                            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 text-2xl mb-4 font-bold">3</div>
                            <h3 className="font-bold mb-2">Search Google</h3>
                            <p className="text-xs text-[#666] leading-relaxed">Execute the search on Google and browse through direct file indexes hosted on public servers.</p>
                        </div>
                    </div>

                    <div className="mt-12">
                        <AdPlacement format="banner" />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default function MovieIndexerPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center text-white">Loading...</div>}>
            <IndexerContent />
        </Suspense>
    );
}
