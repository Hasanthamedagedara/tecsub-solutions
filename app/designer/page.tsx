"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/components/ThemeProvider";

export default function DesignerPage() {
    const [activeTab, setActiveTab] = useState("shapes");
    const [aspectRatio, setAspectRatio] = useState("1:1 Square");
    const [bgColor, setBgColor] = useState("#ffffff");
    const { language } = useAppContext();

    return (
        <div className="h-screen bg-[#0a0a0b] text-white flex flex-col overflow-hidden font-sans select-none">
            {/* ═══ Top Header / Toolbar ═══ */}
            <header className="h-14 bg-[#111114] border-b border-white/5 flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-6">
                    <a href="/" className="hover:opacity-70 transition-opacity">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    </a>
                    <div className="flex items-center gap-2">
                        <span className="text-red-500 text-lg font-black italic tracking-tighter">Singlish Designer</span>
                        <span className="bg-red-500/10 text-red-500 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">BETA</span>
                    </div>
                    
                    <div className="h-6 w-px bg-white/5 mx-2" />

                    {/* Aspect Ratio Selector */}
                    <div className="flex items-center bg-white/5 px-3 py-1.5 rounded-lg gap-2 cursor-pointer hover:bg-white/10 transition-all">
                        <span className="text-[10px] font-black uppercase text-gray-400">Ratio</span>
                        <span className="text-[11px] font-bold">{aspectRatio}</span>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex gap-1 mr-4">
                        {["undo", "redo"].map(act => (
                            <button key={act} className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-lg text-gray-400">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    {act === "undo" ? <path d="M3 7v6h6M3 13a9 9 0 1 1 3 7.7"/> : <path d="M21 7v6h-6M21 13a9 9 0 1 0-3 7.7"/>}
                                </svg>
                            </button>
                        ))}
                    </div>
                    <button className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-600/20 flex items-center gap-2 transition-all">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
                        Download
                    </button>
                    <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl">
                        {["Copy", "Share", "WA", "FB"].map(label => (
                            <button key={label} className="px-4 py-1.5 hover:bg-white/5 rounded-lg text-[10px] font-black uppercase text-gray-400 hover:text-white transition-all">{label}</button>
                        ))}
                    </div>
                </div>
            </header>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* ═══ Left Sidebar ═══ */}
                <aside className="w-full lg:w-64 bg-[#111114] border-b lg:border-r border-white/5 flex flex-col order-2 lg:order-1 h-1/3 lg:h-auto">
                    <div className="flex-1 p-4 space-y-8 overflow-y-auto scrollbar-none">
                        {/* Icons Section */}
                        <section>
                            <div className="flex items-center justify-between mb-4 group cursor-pointer">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-white transition-colors">Icons (Iconify)</h3>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m18 15-6-6-6 6"/></svg>
                            </div>
                        </section>

                        {/* Shapes Section */}
                        <section>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Shapes</h3>
                            <div className="grid grid-cols-4 gap-2">
                                {["square", "circle", "triangle", "diamond", "star", "hexagon", "plus", "minus"].map(shape => (
                                    <button key={shape} className="aspect-square bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-all">
                                        <div className={`w-4 h-4 border-2 border-gray-400 group-hover:border-white ${shape === "circle" ? "rounded-full" : ""}`} />
                                    </button>
                                ))}
                            </div>
                        </section>

                        <div className="bg-white/5 p-4 rounded-2xl">
                            <input 
                                type="text" 
                                placeholder="Design name..." 
                                className="w-full bg-transparent border-none outline-none text-[11px] font-bold placeholder:text-gray-600 mb-3"
                            />
                            <button className="w-full py-2 bg-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl">Save</button>
                        </div>

                        {/* Layers Section */}
                        <section>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4">Layers</h3>
                            <div className="space-y-2">
                                <div className="text-[11px] text-gray-600 font-bold italic text-center py-8">No layers yet</div>
                            </div>
                        </section>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="p-4 bg-black/40 border-t border-white/5 grid grid-cols-2 gap-2">
                        <button className="py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase">+ Text</button>
                        <button className="py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase">+ Shape</button>
                        <button className="py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase col-span-2">+ Image</button>
                        <button className="py-2 bg-white/5 rounded-xl text-[9px] font-black uppercase text-gray-500">Move Up</button>
                        <button className="py-2 bg-white/5 rounded-xl text-[9px] font-black uppercase text-gray-500">Move Down</button>
                        <button className="py-2 bg-blue-600/20 text-blue-500 rounded-xl text-[9px] font-black uppercase">Duplicate</button>
                        <button className="py-2 bg-red-600/20 text-red-500 rounded-xl text-[9px] font-black uppercase">Delete</button>
                    </div>
                </aside>

                {/* ═══ Main Canvas Area ═══ */}
                <main className="flex-1 bg-[#050505] relative flex flex-col items-center justify-center p-4 sm:p-12 order-1 lg:order-2 overflow-auto">
                    {/* Background checkerboard for transparency visualization if needed */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] opacity-[0.03] pointer-events-none" />
                    
                    <motion.div 
                        layout
                        className="relative shadow-[0_40px_100px_rgba(0,0,0,0.8)] transition-all origin-center scale-50 sm:scale-75 lg:scale-100"
                        style={{ 
                            width: "540px", 
                            height: "540px", 
                            backgroundColor: bgColor,
                            borderRadius: "16px"
                        }}
                    >
                        {/* Placeholder Content */}
                        <div className="absolute bottom-4 right-4 opacity-30 text-[8px] font-black tracking-widest text-black/40">singlish.lk</div>
                    </motion.div>

                    <div className="mt-8 text-[10px] font-black text-gray-600 tracking-widest uppercase">
                        1080x1080px - 1:1 Square
                    </div>
                </main>

                {/* ═══ Right Sidebar ═══ */}
                <aside className="w-full lg:w-80 bg-[#111114] border-t lg:border-l border-white/5 flex flex-col p-6 space-y-8 overflow-y-auto scrollbar-none order-3">
                    {/* AI Assistant */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">AI Design Assistant</h3>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                            <textarea 
                                placeholder="Describe your design in any language..."
                                className="w-full bg-transparent border-none outline-none resize-none text-[12px] font-medium placeholder:text-gray-600 mb-4 h-20"
                            />
                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                <span className="text-sm">✨</span> Generate
                            </button>
                        </div>
                    </section>

                    {/* Background Controls */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Background</h3>
                            <button className="text-[9px] font-black text-red-500 hover:underline">Clean</button>
                        </div>
                        <div className="grid grid-cols-5 gap-2 mb-6">
                            {[
                                "#dc2626", "#1e1b4b", "#166534", "#ea580c", "#ffffff",
                                "#f97316", "#0ea5e9", "#4c1d95", "#991b1b"
                            ].map(color => (
                                <button 
                                    key={color}
                                    onClick={() => setBgColor(color)}
                                    className={`aspect-square rounded-lg transition-all ${bgColor === color ? "scale-110 shadow-xl border-2 border-white/50" : "hover:scale-105"}`}
                                    style={{ backgroundColor: color }}
                                >
                                    {bgColor === color && color === "#ffffff" && <div className="w-full h-full flex items-center justify-center text-black font-black text-[10px]">✓</div>}
                                    {bgColor === color && color !== "#ffffff" && <div className="w-full h-full flex items-center justify-center text-white font-black text-[10px]">✓</div>}
                                </button>
                            ))}
                        </div>
                        <button className="w-full py-3 bg-white/5 border border-dashed border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7M16 5l2 2 4-4M21 8v.01M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>
                            Upload Background Image
                        </button>
                    </section>
                </aside>
            </div>

            {/* Bottom Status Bar */}
            <footer className="h-8 bg-[#dc2626] flex items-center px-6 justify-between z-50">
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-white italic tracking-tighter">Online</span>
                    <span className="text-[9px] font-bold text-white/70">Canvas: Active</span>
                </div>
                <div className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em]">Tecsub Designer Engine v1.0.4</div>
            </footer>
        </div>
    );
}
