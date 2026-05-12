"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/components/ThemeProvider";

export default function KeywordGeneratorPage() {
    const [topic, setTopic] = useState("");
    const [keywords, setKeywords] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const generateKeywords = () => {
        if (!topic) return;
        setIsLoading(true);
        setTimeout(() => {
            const mockKeywords = [
                `${topic} guide`, `best ${topic} 2026`, `${topic} tutorials`, 
                `${topic} reviews`, `how to use ${topic}`, `${topic} tips`,
                `${topic} pricing`, `${topic} software`, `top 10 ${topic}`,
                `${topic} for beginners`
            ];
            setKeywords(mockKeywords);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#050505] text-white font-sans selection:bg-blue-500/30">
            <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full text-center space-y-4 mb-12"
                >
                    <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center text-4xl border border-blue-500/20 mx-auto shadow-2xl shadow-blue-600/10">🔍</div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">Keyword Generator</h1>
                    <p className="text-sm opacity-40 font-medium max-w-md mx-auto">Generate high-ranking keywords for your next blog post, video, or product launch using TECSUB AI.</p>
                </motion.div>

                <div className="w-full bg-[#111] border border-white/5 p-2 rounded-2xl flex flex-col sm:flex-row gap-2 shadow-2xl">
                    <input 
                        type="text" 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter your main topic (e.g. Next.js)..."
                        className="flex-1 h-14 bg-transparent px-6 text-sm font-medium outline-none"
                    />
                    <button 
                        onClick={generateKeywords}
                        disabled={isLoading}
                        className="h-14 px-10 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all disabled:opacity-50"
                    >
                        {isLoading ? "Generating..." : "Generate AI Keywords"}
                    </button>
                </div>

                <AnimatePresence>
                    {keywords.length > 0 && (
                        <div className="w-full mt-12 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-black uppercase tracking-widest opacity-40">AI Suggestions</h3>
                                <button onClick={() => navigator.clipboard.writeText(keywords.join(", "))} className="text-[10px] font-black uppercase text-blue-500 hover:underline">Copy All</button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {keywords.map((kw, i) => (
                                    <motion.div 
                                        key={kw}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between group hover:border-blue-500/30 transition-all"
                                    >
                                        <span className="text-sm font-bold opacity-70">{kw}</span>
                                        <span className="text-[10px] font-black text-green-500 opacity-0 group-hover:opacity-100 transition-all">High Volume</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
