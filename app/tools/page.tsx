"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { onlineTools, pdfToolsMenu, pdfSubNav } from "@/data/product";



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
        } else if (activeCategory === "pdf-tools") {
            tools = pdfToolsMenu.flatMap(group => group.items.map(item => ({
                title: item.label,
                description: `Professional PDF utility for ${item.label.toLowerCase()}`,
                category: "PDF Tools",
                icon: item.icon,
                href: item.href,
                badge: (item as any).badge
            }))) as any[];
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
        { id: "pdf-tools", label: "PDF Tools", sub: `${pdfToolsMenu.reduce((acc, group) => acc + group.items.length, 0)} pdf utilities`, icon: "📄" },
        { id: "desktop", label: "Desktop Apps", sub: "2 desktop apps", icon: "💻" },
        { id: "games", label: "Games", sub: `${onlineTools.filter(t => t.category === "Games").length} mini games`, icon: "🎮" },
        { id: "ai-writing", label: "AI & Writing Tools", sub: `${onlineTools.filter(t => t.category === "AI").length} AI tools`, icon: "✨" },
    ], []);

    return (
        <div className="min-h-screen bg-[var(--navy)] text-[var(--text-primary)] font-sans selection:bg-red-500/30 overflow-hidden flex flex-col" style={{ color: "var(--text-primary)" }}>
            <Navbar />
            
            <main className="flex-1 pt-20 flex overflow-hidden">
                {/* ═══ Left Sidebar: Browse ═══ */}
                <aside className="w-72 border-r border-[var(--glass-border)] flex flex-col p-6 space-y-8">
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-6" style={{ color: "var(--text-secondary)" }}>Browse</h2>
                        <div className="space-y-2">
                            {categories.map(cat => (
                                <button 
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all border ${activeCategory === cat.id ? "bg-[var(--glass-bg)] border-[var(--glass-border)] shadow-xl" : "border-transparent opacity-40 hover:opacity-100"}`}
                                >
                                    <div className="text-xl">{cat.icon}</div>
                                    <div className="text-left">
                                        <p className="text-xs font-black uppercase tracking-tight" style={{ color: "var(--text-primary)" }}>{cat.label}</p>
                                        <p className="text-[10px] font-bold opacity-60" style={{ color: "var(--text-secondary)" }}>{cat.sub}</p>
                                    </div>
                                    {activeCategory === cat.id && <div className="ml-auto text-red-500 text-[8px]">▶</div>}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8 mt-auto border-t border-[var(--glass-border)]">
                        <button className="text-red-500 text-xs font-black uppercase tracking-widest hover:underline transition-all">Explore all products →</button>
                    </div>
                </aside>

                {/* ═══ Right Pane: Scrollable Tools ═══ */}
                <section className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-10 pt-8 pb-4">
                        <h1 className="text-3xl font-black italic tracking-tighter gradient-text uppercase mb-1">Tecsub Online Tools</h1>
                        <p className="text-[10px] font-black tracking-[0.3em] uppercase" style={{ color: "var(--text-secondary)" }}>Professional Software & Engineering Solutions</p>
                    </div>
                    
                    {/* Search Area */}
                    <div className="px-10 py-6 border-b border-[var(--glass-border)] bg-[var(--navy)]/80 backdrop-blur-xl z-10 flex items-center justify-between">
                        <div className="relative flex-1 max-w-xl">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-35 text-sm">🔍</span>
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products, tools, and services..." 
                                className="w-full h-12 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl pl-12 pr-4 text-sm font-medium outline-none focus:border-red-500/30 transition-all"
                                style={{ color: "var(--text-primary)" }}
                            />
                        </div>
                        <div className="flex items-center gap-4 ml-8">
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-35" style={{ color: "var(--text-secondary)" }}>Filter by</span>
                            <div className="flex gap-2">
                                {["AI", "Media", "Dev"].map(f => (
                                    <button key={f} className="px-3 py-1 bg-[var(--glass-bg)] rounded-full text-[10px] font-bold border border-[var(--glass-border)] hover:bg-[var(--glass-bg)]/80">{f}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* PDF Sub Nav */}
                    <AnimatePresence>
                        {activeCategory === "pdf-tools" && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="bg-[var(--glass-bg)] border-b border-[var(--glass-border)] overflow-x-auto scrollbar-none whitespace-nowrap px-10 flex items-center gap-6"
                            >
                                {pdfSubNav.map((item, i) => (
                                    <a 
                                        key={i}
                                        href={item.href}
                                        onClick={(e) => { e.preventDefault(); router.push(item.href); }}
                                        className="py-4 text-xs font-bold hover:text-white transition-colors relative group"
                                        style={{ color: "var(--text-secondary)" }}
                                    >
                                        {item.label}
                                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                                    </a>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

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
                                    className="group p-6 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[2rem] flex items-center gap-5 cursor-pointer hover:bg-[var(--glass-bg)]/80 hover:border-red-500/20 transition-all relative overflow-hidden"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-[var(--glass-bg)] flex items-center justify-center text-3xl group-hover:scale-110 transition-all border border-[var(--glass-border)] shadow-2xl">
                                        {tool.icon}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-sm font-black uppercase tracking-tight group-hover:text-red-500 transition-all" style={{ color: "var(--text-primary)" }}>{tool.title}</h3>
                                            {(i % 5 === 0) && <span className="px-1.5 py-0.5 bg-red-600 text-[7px] font-black rounded text-white tracking-widest">HOT</span>}
                                            {(i % 7 === 0) && <span className="px-1.5 py-0.5 bg-blue-600 text-[7px] font-black rounded text-white tracking-widest">NEW</span>}
                                        </div>
                                        <p className="text-[11px] font-medium opacity-60 leading-relaxed line-clamp-2" style={{ color: "var(--text-secondary)" }}>{tool.description}</p>
                                    </div>
                                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination / More info */}
                        <div className="mt-20 pt-10 border-t border-[var(--glass-border)] flex items-center justify-between opacity-50">
                            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>Showing all {filteredTools.length} results</p>
                            <div className="flex gap-4">
                                <button className="text-[10px] font-black uppercase hover:text-white transition-all" style={{ color: "var(--text-secondary)" }}>Terms of Service</button>
                                <button className="text-[10px] font-black uppercase hover:text-white transition-all" style={{ color: "var(--text-secondary)" }}>Privacy Policy</button>
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
