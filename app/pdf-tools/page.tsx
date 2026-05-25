"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { pdfToolsMenu, pdfSubNav } from "@/data/product";

export default function PdfToolsDashboard() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    // Filter tools based on search query
    const filteredMenu = useMemo(() => {
        if (!searchQuery.trim()) return pdfToolsMenu;
        
        return pdfToolsMenu.map(group => {
            const matchedItems = group.items.filter(item => 
                item.label.toLowerCase().includes(searchQuery.toLowerCase())
            );
            return {
                ...group,
                items: matchedItems
            };
        }).filter(group => group.items.length > 0);
    }, [searchQuery]);

    const totalToolsCount = useMemo(() => {
        return pdfToolsMenu.reduce((acc, group) => acc + group.items.length, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[var(--navy)] text-[var(--text-primary)] font-sans selection:bg-red-500/30 overflow-x-hidden flex flex-col">
            <Navbar />
            
            <main className="flex-grow pt-24 sm:pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest mb-4"
                    >
                        <span>📄</span> PDF Tools Suite
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl font-black italic tracking-tighter uppercase mb-4"
                    >
                        TECSUB <span className="text-red-500">PDF SOLUTIONS</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-[13px] sm:text-sm text-gray-400 font-medium leading-relaxed"
                    >
                        Fast, secure, and 100% local in-browser PDF utilities. No server uploads.
                        Your files never leave your device.
                    </motion.p>
                </div>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto mb-16 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-35 text-sm">🔍</span>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search among 40+ PDF tools..." 
                        className="w-full h-12 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl pl-12 pr-4 text-sm font-medium outline-none focus:border-red-500/30 transition-all text-white"
                    />
                </div>

                {/* PDF Sub Navigation horizontal list */}
                <div className="flex gap-3 overflow-x-auto scrollbar-none whitespace-nowrap pb-6 mb-12 border-b border-[var(--glass-border)]">
                    {pdfSubNav.map((nav, idx) => (
                        <button
                            key={idx}
                            onClick={() => router.push(nav.href)}
                            className="px-4 py-2 rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-red-500/20 text-xs font-bold transition-all text-gray-300 hover:text-white"
                        >
                            {nav.label}
                        </button>
                    ))}
                </div>

                {/* Categorized Tools Grid */}
                <div className="space-y-16">
                    {filteredMenu.map((group, groupIdx) => (
                        <div key={groupIdx} className="space-y-6">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-red-500 border-b border-[var(--glass-border)] pb-2 flex items-center gap-2">
                                <span>⚡</span> {group.title}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {group.items.map((tool, toolIdx) => (
                                    <motion.div 
                                        key={tool.label}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: toolIdx * 0.03 + groupIdx * 0.05 }}
                                        onClick={() => router.push(tool.href)}
                                        className="group p-5 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-3xl flex items-center gap-4 cursor-pointer hover:bg-[var(--glass-bg)]/80 hover:border-red-500/20 transition-all relative overflow-hidden"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-[var(--glass-bg)] flex items-center justify-center text-2xl border border-[var(--glass-border)] shadow-md group-hover:scale-105 transition-transform">
                                            {tool.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h3 className="text-xs font-black uppercase tracking-tight text-white group-hover:text-red-500 transition-colors truncate">
                                                    {tool.label}
                                                </h3>
                                                {tool.badge && (
                                                    <span className="px-1.5 py-0.5 bg-red-600 text-[6px] font-black rounded text-white tracking-widest">
                                                        {tool.badge.toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-medium leading-relaxed truncate">
                                                {tool.label} secure processing tool.
                                            </p>
                                        </div>
                                        <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-400"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {filteredMenu.length === 0 && (
                        <div className="text-center py-20 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-3xl">
                            <span className="text-5xl block mb-4">🔍</span>
                            <h3 className="text-lg font-black uppercase tracking-wider mb-2">No Tools Found</h3>
                            <p className="text-xs text-gray-400">We couldn't find any PDF tools matching "{searchQuery}"</p>
                        </div>
                    )}
                </div>

                {/* Footer Stat summary */}
                <div className="mt-24 pt-8 border-t border-[var(--glass-border)] flex flex-wrap items-center justify-between opacity-50 text-[10px] font-black uppercase tracking-widest gap-4">
                    <p>Total {totalToolsCount} browser-based PDF utilities</p>
                    <div className="flex gap-6">
                        <button className="hover:text-white transition-all">Terms</button>
                        <button className="hover:text-white transition-all">Privacy</button>
                    </div>
                </div>
            </main>

            <Footer />
            
            <style jsx global>{`
                ::-webkit-scrollbar { width: 0px; background: transparent; }
                .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
