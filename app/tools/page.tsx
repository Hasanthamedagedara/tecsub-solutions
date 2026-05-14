"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { onlineTools } from "@/data/product";



export default function OnlineToolsPage() {
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState("online");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredTools = useMemo(() => {
        let tools = onlineTools;
        if (activeCategory === "games") {
            tools = tools.filter(t => t.category === "Games");
        } else if (activeCategory === "ai-writing") {
            tools = tools.filter(t => t.category === "AI");
        } else if (activeCategory === "online") {
            tools = tools.filter(t => t.category !== "Games");
        }

        return tools.filter(tool => 
            tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, activeCategory]);

    const categories = useMemo(() => [
        { id: "online", label: "Online Products", sub: `${onlineTools.filter(t => t.category !== "Games").length} web apps`, icon: "🌐" },
        { id: "desktop", label: "Desktop Apps", sub: "2 desktop apps", icon: "💻" },
        { id: "games", label: "Games", sub: `${onlineTools.filter(t => t.category === "Games").length} mini games`, icon: "🎮" },
        { id: "ai-writing", label: "AI & Writing Tools", sub: `${onlineTools.filter(t => t.category === "AI").length} AI tools`, icon: "✨" },
    ], []);

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white font-sans selection:bg-red-500/30 overflow-hidden flex flex-col">
            <Navbar />
            
            <main className="flex-1 pt-20 flex overflow-hidden">
                {/* ═══ Left Sidebar: Browse ═══ */}
                <aside className="w-72 border-r border-white/5 flex flex-col p-6 space-y-8">
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-6">Browse</h2>
                        <div className="space-y-2">
                            {categories.map(cat => (
                                <button 
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all border ${activeCategory === cat.id ? "bg-white/5 border-white/10 shadow-xl" : "border-transparent opacity-40 hover:opacity-100"}`}
                                >
                                    <div className="text-xl">{cat.icon}</div>
                                    <div className="text-left">
                                        <p className="text-xs font-black uppercase tracking-tight">{cat.label}</p>
                                        <p className="text-[10px] font-bold opacity-60">{cat.sub}</p>
                                    </div>
                                    {activeCategory === cat.id && <div className="ml-auto text-red-500 text-[8px]">▶</div>}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8 mt-auto border-t border-white/5">
                        <button className="text-red-500 text-xs font-black uppercase tracking-widest hover:underline transition-all">Explore all products →</button>
                    </div>
                </aside>

                {/* ═══ Right Pane: Scrollable Tools ═══ */}
                <section className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-10 pt-8 pb-4">
                        <h1 className="text-3xl font-black italic tracking-tighter gradient-text uppercase mb-1">Tecsub Online Tools</h1>
                        <p className="text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase">Professional Software & Engineering Solutions</p>
                    </div>
                    
                    {/* Search Area */}
                    <div className="px-10 py-6 border-b border-white/5 bg-[#0a0a0b]/80 backdrop-blur-xl z-10 flex items-center justify-between">
                        <div className="relative flex-1 max-w-xl">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30 text-sm">🔍</span>
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products, tools, and services..." 
                                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-sm font-medium outline-none focus:border-red-500/30 transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-4 ml-8">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-20">Filter by</span>
                            <div className="flex gap-2">
                                {["AI", "Media", "Dev"].map(f => (
                                    <button key={f} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold border border-white/5 hover:bg-white/10">{f}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Grid */}
                    <div className="flex-1 overflow-y-auto p-10 scrollbar-none">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredTools.map((tool, i) => (
                                <motion.div 
                                    key={tool.title}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => tool.href && router.push(tool.href)}
                                    className="group p-6 bg-[#111] border border-white/5 rounded-[2rem] flex items-center gap-5 cursor-pointer hover:bg-white/5 hover:border-red-500/20 transition-all relative overflow-hidden"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl group-hover:scale-110 transition-all border border-white/5 shadow-2xl">
                                        {tool.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-sm font-black uppercase tracking-tight group-hover:text-red-500 transition-all">{tool.title}</h3>
                                            {(i % 5 === 0) && <span className="px-1.5 py-0.5 bg-red-600 text-[7px] font-black rounded text-white tracking-widest">HOT</span>}
                                            {(i % 7 === 0) && <span className="px-1.5 py-0.5 bg-blue-600 text-[7px] font-black rounded text-white tracking-widest">NEW</span>}
                                        </div>
                                        <p className="text-[11px] font-medium opacity-40 leading-relaxed line-clamp-2">{tool.description}</p>
                                    </div>
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination / More info */}
                        <div className="mt-20 pt-10 border-t border-white/5 flex items-center justify-between opacity-30">
                            <p className="text-[10px] font-black uppercase tracking-widest">Showing all {filteredTools.length} results</p>
                            <div className="flex gap-4">
                                <button className="text-[10px] font-black uppercase hover:text-white transition-all">Terms of Service</button>
                                <button className="text-[10px] font-black uppercase hover:text-white transition-all">Privacy Policy</button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            <style jsx global>{`
                ::-webkit-scrollbar { width: 0px; background: transparent; }
                .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
