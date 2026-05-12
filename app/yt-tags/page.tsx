"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/components/ThemeProvider";

export default function YTTagsPage() {
    const [url, setUrl] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { theme } = useAppContext();

    const extractTags = () => {
        if (!url) return;
        setIsLoading(true);
        // Simulating extraction logic
        setTimeout(() => {
            const mockTags = ["tecsub", "technology", "coding", "software", "innovation", "sri lanka", "dev", "ai tools"];
            setTags(mockTags);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#050505] text-white font-sans selection:bg-red-500/30">
            <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full text-center space-y-4 mb-12"
                >
                    <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center text-4xl border border-red-500/20 mx-auto shadow-2xl shadow-red-600/10">🎬</div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">YT Tag Extractor</h1>
                    <p className="text-sm opacity-40 font-medium max-w-md mx-auto">Extract hidden meta tags from any YouTube video to optimize your SEO and reach more viewers.</p>
                </motion.div>

                <div className="w-full bg-[#111] border border-white/5 p-2 rounded-2xl flex flex-col sm:flex-row gap-2 shadow-2xl">
                    <input 
                        type="text" 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Paste YouTube Video URL here..."
                        className="flex-1 h-14 bg-transparent px-6 text-sm font-medium outline-none"
                    />
                    <button 
                        onClick={extractTags}
                        disabled={isLoading}
                        className="h-14 px-10 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-red-600/20 transition-all disabled:opacity-50"
                    >
                        {isLoading ? "Extracting..." : "Extract Tags"}
                    </button>
                </div>

                <AnimatePresence>
                    {tags.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3"
                        >
                            {tags.map((tag, i) => (
                                <motion.div 
                                    key={tag}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between group hover:border-red-500/30 transition-all"
                                >
                                    <span className="text-xs font-bold opacity-60 group-hover:opacity-100 transition-all">#{tag}</span>
                                    <button onClick={() => navigator.clipboard.writeText(tag)} className="text-[10px] opacity-0 group-hover:opacity-100 transition-all bg-red-600/20 text-red-500 px-2 py-1 rounded">Copy</button>
                                </motion.div>
                            ))}
                            
                            <button 
                                onClick={() => navigator.clipboard.writeText(tags.join(", "))}
                                className="col-span-full mt-4 py-4 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                            >
                                Copy All Tags
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
