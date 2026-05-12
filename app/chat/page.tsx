"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AIChatPage() {
    const [mode, setMode] = useState<"image" | "video" | "chat">("chat");
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [autoDownload, setAutoDownload] = useState(false);
    
    // Menu Visibility States
    const [showModelsMenu, setShowModelsMenu] = useState(false);
    const [showSizeMenu, setShowSizeMenu] = useState(false);
    const [showGridMenu, setShowGridMenu] = useState(false);
    const [showShotMenu, setShowShotMenu] = useState(false);
    const [showResMenu, setShowResMenu] = useState(false);
    const [showStyleMenu, setShowStyleMenu] = useState(false);
    const [showChatModelsMenu, setShowChatModelsMenu] = useState(false);

    // Selection States
    const [selectedModel, setSelectedModel] = useState("Cinematic Cameras");
    const [selectedVideoModel, setSelectedVideoModel] = useState("Cinema Studio 3.5");
    const [selectedSize, setSelectedSize] = useState("16:9");
    const [selectedGrid, setSelectedGrid] = useState("1x1");
    const [selectedShot, setSelectedShot] = useState("Single shot");
    const [selectedRes, setSelectedRes] = useState("1080p");
    const [selectedStyle, setSelectedStyle] = useState("General");
    const [selectedChatModel, setSelectedChatModel] = useState("Gemini 1.5 Flash");
    const [chatResponse, setChatResponse] = useState("");

    const [recentGenerations, setRecentGenerations] = useState<any[]>([]);

    const menuRef = useRef<HTMLDivElement>(null);
    const sizeRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const shotRef = useRef<HTMLDivElement>(null);
    const resRef = useRef<HTMLDivElement>(null);
    const styleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (menuRef.current && !menuRef.current.contains(target)) {
                setShowModelsMenu(false);
                setShowChatModelsMenu(false);
            }
            if (sizeRef.current && !sizeRef.current.contains(target)) setShowSizeMenu(false);
            if (gridRef.current && !gridRef.current.contains(target)) setShowGridMenu(false);
            if (shotRef.current && !shotRef.current.contains(target)) setShowShotMenu(false);
            if (resRef.current && !resRef.current.contains(target)) setShowResMenu(false);
            if (styleRef.current && !styleRef.current.contains(target)) setShowStyleMenu(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDownload = () => {
        if (mode === "chat") return;
        const url = mode === "image" ? "/generations/woman_saree.png" : "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=1200";
        const link = document.createElement("a");
        link.href = url;
        link.download = `tecsub-${mode}-${Date.now()}.${mode === "image" ? "png" : "mp4"}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);
        setShowPreview(true);
        
        if (mode === "chat") {
            try {
                const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
                });
                const data = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Generation error.";
                setChatResponse(text);
                setRecentGenerations(prev => [{ url: "", type: "chat", text: text.substring(0, 30), widthClass: "w-[250px] h-[340px]" }, ...prev]);
            } catch (error) {
                setChatResponse("Service connection failed.");
            }
        } else {
            // Mock for image/video cinematic flow
            setTimeout(() => {
                setIsGenerating(false);
                const mockUrl = mode === "image" ? "/generations/woman_saree.png" : "/generations/tea_plantation.png";
                setRecentGenerations(prev => [{ url: mockUrl, type: mode, widthClass: mode === "image" ? "w-[210px] h-[340px]" : "w-[500px] h-[340px]" }, ...prev]);
                if (autoDownload) handleDownload();
            }, 3000);
            return;
        }
        setIsGenerating(false);
    };
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-[#050505] text-gray-900 dark:text-white selection:bg-lime-500/30 font-sans antialiased transition-colors duration-300">
            <Navbar />

            <main className="flex-1 flex flex-col items-center p-4 pt-12">
                
                {/* GENERATION PREVIEW GALLERY (Requested Type - Moved to Top) */}
                <div className="w-full mb-12 overflow-hidden">
                    <div className="max-w-[98%] mx-auto flex gap-4 items-start">
                        {/* Left Side Icons - Styled like screenshot */}
                        <div className="flex flex-col gap-8 pt-4 px-3">
                            <button className="text-gray-400 hover:text-white transition-colors">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
                            </button>
                            <button className="text-gray-400 hover:text-white transition-colors">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            </button>
                            <button className="text-gray-400 hover:text-white transition-colors">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-x-auto scrollbar-hide flex gap-4 py-2 snap-x">
                            {recentGenerations.map((gen, idx) => (
                                <motion.div 
                                    key={idx}
                                    whileHover={{ scale: 1.01 }}
                                    className={`relative flex-shrink-0 group overflow-hidden rounded-[2rem] border border-white/5 bg-black/40 shadow-2xl snap-start ${gen.widthClass}`}
                                >
                                    <img 
                                        src={gen.url} 
                                        alt="Generation" 
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100" 
                                    />
                                    
                                    {/* Type Icon Overlay - Small in bottom left as per screenshot */}
                                    <div className="absolute bottom-4 left-4 w-6 h-6 rounded-md bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 shadow-lg">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center w-full">
                <div className="w-full max-w-5xl flex flex-col gap-4">
                    
                    {/* PREVIEW AREA (Google Flow Style) */}
                    <div className="w-full flex justify-center">
                        <AnimatePresence mode="wait">
                            {showPreview && (
                                <motion.div 
                                    key="preview-active"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="w-[90%] aspect-video rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 bg-black relative shadow-2xl"
                                >
                                    {isGenerating ? (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black">
                                            <div className="relative w-24 h-24">
                                                <div className="absolute inset-0 border-4 border-[#d9ff00]/10 rounded-full" />
                                                <div className="absolute inset-0 border-4 border-t-[#d9ff00] rounded-full animate-spin" />
                                            </div>
                                            <div className="flex flex-col items-center gap-2">
                                                <h2 className="text-[#d9ff00] text-sm font-black uppercase tracking-[0.4em] animate-pulse">Generating</h2>
                                                <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: "100%" }}
                                                        transition={{ duration: 3, ease: "easeInOut" }}
                                                        className="h-full bg-[#d9ff00]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative w-full h-full">
                                            {mode === "chat" ? (
                                                <div className="p-8 h-full bg-[#0a0a0a] overflow-y-auto scrollbar-hide">
                                                    <div className="max-w-2xl mx-auto space-y-6">
                                                        <div className="bg-blue-600/10 border border-blue-600/20 p-4 rounded-2xl text-blue-400 text-sm">{prompt}</div>
                                                        <div className="text-gray-300 text-base leading-relaxed whitespace-pre-wrap">{chatResponse}</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <img 
                                                    src={mode === "image" ? "/generations/woman_saree.png" : "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=1200"} 
                                                    className="w-full h-full object-cover" 
                                                    alt="Generated Result" 
                                                />
                                            )}
                                            
                                            {/* Preview Metadata Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                                                <div className="flex items-end justify-between">
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-black text-[#d9ff00] uppercase tracking-widest">{mode} Success</span>
                                                        <h3 className="text-2xl font-bold text-white max-w-xl">{prompt}</h3>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <button onClick={() => setShowPreview(false)} className="h-12 px-6 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white text-xs font-bold transition-all">Create New</button>
                                                        <button onClick={handleDownload} className="h-12 w-12 rounded-xl bg-[#d9ff00] flex items-center justify-center text-black shadow-lg hover:scale-105 active:scale-95 transition-all"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    
                    <div className="flex items-start gap-4">
                        
                        {/* Vertical Mode Selector */}
                        <div className="flex flex-col gap-1 bg-gray-50 dark:bg-[#0d0d0d]/80 border border-gray-200 dark:border-white/5 p-1 rounded-xl backdrop-blur-xl shadow-sm">
                            <button onClick={() => setMode("image")} className={`flex flex-col items-center justify-center w-10 h-10 rounded-lg transition-all ${mode === "image" ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-md dark:shadow-inner" : "text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white"}`}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                                <span className="text-[6px] font-black uppercase mt-0.5">Image</span>
                            </button>
                            <button onClick={() => setMode("video")} className={`flex flex-col items-center justify-center w-10 h-10 rounded-lg transition-all ${mode === "video" ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-md dark:shadow-inner" : "text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white"}`}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                                <span className="text-[6px] font-black uppercase mt-0.5">Video</span>
                            </button>
                            <button onClick={() => setMode("chat")} className={`flex flex-col items-center justify-center w-10 h-10 rounded-lg transition-all ${mode === "chat" ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-md dark:shadow-inner" : "text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white"}`}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 11-7.6-14.7 8.38 8.38 0 013.8.9L21 3.5v8z"/></svg>
                                <span className="text-[6px] font-black uppercase mt-0.5">Chat</span>
                            </button>
                        </div>

                        {/* Main Interaction Area */}
                        <div className="flex-1 flex flex-col gap-2.5">
                            
                            {/* Director Panel (Only for Video/Image modes) */}
                            <AnimatePresence mode="wait">
                                {mode !== "chat" && (
                                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="mb-1 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/5 rounded-xl p-3 flex flex-col gap-2 shadow-sm dark:shadow-2xl overflow-hidden">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400 dark:text-gray-500"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>
                                            <span className="text-[8px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-bold">Director Panel</span>
                                            <svg className="ml-auto w-3 h-3 text-gray-300 dark:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <div className="flex gap-1">
                                                <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-white/5 border border-gray-300 dark:border-white/10 flex items-center justify-center text-gray-500"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>
                                                <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-white/[0.01] border border-gray-200 dark:border-white/5" />
                                            </div>
                                            <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/5 rounded-lg p-1 pr-2 min-w-[110px]">
                                                <div className="w-7 h-7 rounded overflow-hidden bg-white dark:bg-black/40 border border-gray-200 dark:border-white/5"><img src="https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=100&h=100" alt="Movement" className="w-full h-full object-cover opacity-60" /></div>
                                                <div className="flex flex-col"><span className="text-[6px] text-gray-400 dark:text-gray-500 uppercase font-black tracking-tighter">Movement</span><span className="text-[10px] font-bold leading-none">Auto</span></div>
                                            </div>
                                            <div className="flex-1 h-8 relative bg-gray-100 dark:bg-black/30 rounded-lg overflow-hidden border border-gray-200 dark:border-white/5">
                                                <svg className="w-full h-full px-4"><path d="M0 16 C 100 16, 200 28, 300 16 S 500 4, 600 16" fill="none" stroke="#3ea6ff" strokeWidth="1.5" />{[0, 150, 300, 450, 600].map((x, i) => (<circle key={i} cx={x} cy={i === 1 ? 22 : i === 3 ? 10 : 16} r="2.5" fill="#3ea6ff" />))}</svg>
                                            </div>
                                            <div className="bg-gray-100 dark:bg-white/[0.04] px-2 py-1 rounded-lg border border-gray-200 dark:border-white/5 text-[9px] font-bold flex items-center gap-3">Auto <div className="flex flex-col gap-0.5"><svg width="5" height="5" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400 dark:text-gray-600"><path d="M7 14l5-5 5 5z"/></svg><svg width="5" height="5" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400 dark:text-gray-600"><path d="M7 10l5 5 5-5z"/></svg></div></div>
                                            <div className="bg-gray-100 dark:bg-white/[0.04] px-3 py-1 rounded-lg border border-gray-200 dark:border-white/5 text-[9px] font-bold relative min-w-[90px] h-[26px] flex items-center"><span className="relative z-10 text-gray-700 dark:text-white">4s</span><div className="absolute left-[20%] top-0 bottom-0 w-[1.5px] bg-blue-500 dark:bg-white shadow-[0_0_5px_rgba(59,130,246,0.5)] dark:shadow-[0_0_5px_white]" /></div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Prompt Input Container */}
                            <div className="bg-gray-50 dark:bg-[#0d0d0d] border border-gray-200 dark:border-white/5 rounded-2xl shadow-sm dark:shadow-2xl p-3 sm:p-3.5 flex flex-col gap-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 dark:text-gray-500 mt-0.5">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                                    </div>
                                    <textarea 
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        placeholder="Describe your scene - use @ to add characters & locations"
                                        className="w-full bg-transparent border-none outline-none text-base sm:text-lg font-light placeholder:text-gray-300 dark:placeholder:text-gray-800 resize-none min-h-[40px] pt-1"
                                    />
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex flex-wrap items-center gap-2 relative">
                                        {mode === 'image' ? (
                                            /* IMAGE MODE TOOLBAR */
                                            <>
                                                <div className="relative">
                                                    <button onClick={() => setShowModelsMenu(!showModelsMenu)} className={`h-10 px-4 ${showModelsMenu ? 'bg-gray-200 dark:bg-white/10' : 'bg-gray-100 dark:bg-[#1a1a1a]'} hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl border border-gray-200 dark:border-white/10 text-[11px] font-bold flex items-center gap-2 transition-all`}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M7 18H3V6h4l2-2h6l2 2h4v12h-4"/><circle cx="12" cy="13" r="3"/></svg>
                                                        {selectedModel}
                                                    </button>
                                                    <AnimatePresence>
                                                        {showModelsMenu && (
                                                            <motion.div ref={menuRef} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-full left-0 mb-3 w-[280px] bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden z-[100] backdrop-blur-2xl">
                                                                <div className="p-3 border-b border-gray-100 dark:border-white/5 flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-400 dark:text-gray-500"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg><input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-xs w-full text-gray-500 dark:text-gray-300" /></div>
                                                                <div className="max-h-[350px] overflow-y-auto p-2 space-y-4">
                                                                    <div>
                                                                        <div className="px-3 py-1 flex items-center gap-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">✨ Cinematic models</div>
                                                                        {[{ name: "AI Cast", desc: "Faces and styling" }, { name: "Cinematic Locations", desc: "Environments" }, { name: "Soul Cinema", desc: "Cinema generation" }, { name: "Cinematic Cameras", desc: "Camera controls" }].map(m => (
                                                                            <button key={m.name} onClick={() => { setSelectedModel(m.name); setShowModelsMenu(false); }} className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${selectedModel === m.name ? 'bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                                                                                <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center">🎬</div>
                                                                                <div className="flex flex-col flex-1"><span className="text-[11px] font-bold">{m.name}</span><span className="text-[9px] text-gray-400 dark:text-gray-500">{m.desc}</span></div>
                                                                                {selectedModel === m.name && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d9ff00" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                <div className="h-10 flex items-center bg-gray-100 dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-white/10 p-0.5 px-3 gap-4">
                                                     <button className="text-gray-400 dark:text-gray-600 font-bold text-sm hover:text-gray-600 dark:hover:text-gray-400">—</button>
                                                     <span className="text-[10px] font-black tracking-widest text-gray-500 dark:text-white">1/4</span>
                                                     <button className="text-gray-400 dark:text-gray-600 font-bold text-sm hover:text-gray-600 dark:hover:text-gray-400">+</button>
                                                </div>
                                                <div className="relative">
                                                    <button onClick={() => setShowSizeMenu(!showSizeMenu)} className={`h-10 px-4 ${showSizeMenu ? 'bg-gray-200 dark:bg-white/10' : 'bg-gray-100 dark:bg-[#1a1a1a]'} hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl border border-gray-200 dark:border-white/10 text-[11px] font-bold flex items-center gap-2 transition-all`}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>{selectedSize}</button>
                                                    <AnimatePresence>
                                                        {showSizeMenu && (
                                                            <motion.div ref={sizeRef} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-full left-0 mb-3 w-[200px] bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-2xl p-2 z-[100] backdrop-blur-2xl">
                                                                {[{ ratio: "1:1" }, { ratio: "3:4" }, { ratio: "9:16" }, { ratio: "3:2" }, { ratio: "4:3" }, { ratio: "16:9", cinematic: true }, { ratio: "21:9", cinematic: true }].map(s => (
                                                                    <button key={s.ratio} onClick={() => { setSelectedSize(s.ratio); setShowSizeMenu(false); }} className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${selectedSize === s.ratio ? 'bg-gray-100 dark:bg-white/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                                                                        <span className="text-[11px] font-bold flex-1">{s.ratio}</span>
                                                                        {s.cinematic && <span className="bg-[#d9ff00]/20 text-[#d9ff00] text-[7px] font-black px-1.5 rounded-full uppercase">Cinematic</span>}
                                                                        {selectedSize === s.ratio && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d9ff00" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg>}
                                                                    </button>
                                                                ))}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                <button className="h-10 px-4 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl border border-gray-200 dark:border-white/10 text-[11px] font-bold flex items-center gap-2">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 3l9 9-9 9-9-9 9-9z"/></svg>
                                                    {selectedRes}
                                                </button>
                                                <div className="relative">
                                                    <button onClick={() => setShowGridMenu(!showGridMenu)} className={`h-10 px-4 ${showGridMenu ? 'bg-gray-200 dark:bg-white/10' : 'bg-gray-100 dark:bg-[#1a1a1a]'} hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl border border-gray-200 dark:border-white/10 text-[11px] font-bold flex items-center gap-2 transition-all`}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>{selectedGrid}</button>
                                                    <AnimatePresence>
                                                        {showGridMenu && (
                                                            <motion.div ref={gridRef} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-full left-0 mb-3 w-[180px] bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-2xl p-2 z-[100] backdrop-blur-2xl">
                                                                <div className="px-3 py-2 flex items-center justify-between text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-white/5 mb-1">Grid generation <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg></div>
                                                                {["1x1", "2x2", "3x3", "4x4"].map(g => (<button key={g} onClick={() => { setSelectedGrid(g); setShowGridMenu(false); }} className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all ${selectedGrid === g ? 'bg-gray-100 dark:bg-white/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}><span className="text-[11px] font-bold">{g}</span>{selectedGrid === g && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d9ff00" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg>}</button>))}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                <button className="h-10 w-10 flex items-center justify-center bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 font-bold transition-all text-sm">@</button>
                                            </>
                                        ) : mode === 'video' ? (
                                            /* VIDEO MODE TOOLBAR */
                                            <>
                                                <div className="relative">
                                                    <button onClick={() => setShowModelsMenu(!showModelsMenu)} className={`h-10 px-4 ${showModelsMenu ? 'bg-gray-200 dark:bg-white/10' : 'bg-gray-100 dark:bg-[#1a1a1a]'} hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl border border-gray-200 dark:border-white/10 text-[11px] font-bold flex items-center gap-3 transition-all`}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>{selectedVideoModel}</button>
                                                    <AnimatePresence>
                                                        {showModelsMenu && (
                                                            <motion.div ref={menuRef} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-full left-0 mb-3 w-[300px] bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden z-[100] backdrop-blur-2xl">
                                                                <div className="p-3 border-b border-gray-100 dark:border-white/5 flex items-center gap-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-400 dark:text-gray-500"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg><input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-xs w-full text-gray-500 dark:text-gray-300" /></div>
                                                                <div className="max-h-[400px] overflow-y-auto p-2 space-y-4">
                                                                    <div>
                                                                        <div className="px-3 py-1 flex items-center gap-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">✨ Cinematic models</div>
                                                                        {[{ name: "Cinema Studio 3.5", tag: "NEW" }, { name: "Cinema Studio 3.0" }, { name: "Cinema Studio 2.5" }].map(m => (
                                                                            <button key={m.name} onClick={() => { setSelectedVideoModel(m.name); setShowModelsMenu(false); }} className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${selectedVideoModel === m.name ? 'bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                                                                                <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center text-lg">🎬</div>
                                                                                <div className="flex flex-col flex-1"><span className="text-[11px] font-bold">{m.name}</span>{m.tag && <span className="bg-[#d9ff00] text-black text-[7px] font-black px-1 rounded-sm">{m.tag}</span>}</div>
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                    <div>
                                                                        <div className="px-3 py-1 flex items-center gap-2 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">✦ Featured models</div>
                                                                        {[{ name: "Kling 3.0", tag: "EXCLUSIVE", res: "4K" }, { name: "Seedance 2.0", tag: "NEW", res: "720p" }, { name: "HappyHorse", tag: "NEW", res: "1080p" }].map(m => (
                                                                            <button key={m.name} onClick={() => { setSelectedVideoModel(m.name); setShowModelsMenu(false); }} className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all ${selectedVideoModel === m.name ? 'bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                                                                                <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center text-lg">⚡</div>
                                                                                <div className="flex flex-col flex-1"><span className="text-[11px] font-bold">{m.name}</span><span className="bg-[#d9ff00] text-black text-[7px] font-black px-1 rounded-sm">{m.tag}</span><span className="text-[8px] text-gray-400 dark:text-gray-500">{m.res}</span></div>
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                <div className="relative">
                                                    <button onClick={() => setShowShotMenu(!showShotMenu)} className={`h-10 px-4 ${showShotMenu ? 'bg-gray-200 dark:bg-white/10' : 'bg-gray-100 dark:bg-[#1a1a1a]'} hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl border border-gray-200 dark:border-white/10 text-[11px] font-bold flex items-center gap-2 transition-all`}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18"/></svg>{selectedShot}</button>
                                                    <AnimatePresence>
                                                        {showShotMenu && (
                                                            <motion.div ref={shotRef} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-full left-0 mb-3 w-[180px] bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-2xl p-2 z-[100] backdrop-blur-2xl">
                                                                <div className="px-3 py-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-white/5 mb-1">Shot Control</div>
                                                                {["Single shot", "Multi-shot Auto", "Multi-shot Manual"].map(s => (<button key={s} onClick={() => { setSelectedShot(s); setShowShotMenu(false); }} className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all ${selectedShot === s ? 'bg-gray-100 dark:bg-white/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}><span className="text-[11px] font-bold">{s}</span>{selectedShot === s && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d9ff00" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg>}</button>))}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                <div className="relative">
                                                    <button onClick={() => setShowSizeMenu(!showSizeMenu)} className={`h-10 px-4 ${showSizeMenu ? 'bg-gray-200 dark:bg-white/10' : 'bg-gray-100 dark:bg-[#1a1a1a]'} hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl border border-gray-200 dark:border-white/10 text-[11px] font-bold flex items-center gap-2 transition-all`}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>{selectedSize}</button>
                                                    <AnimatePresence>
                                                        {showSizeMenu && (
                                                            <motion.div ref={sizeRef} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-full left-0 mb-3 w-[180px] bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-2xl p-2 z-[100] backdrop-blur-2xl">
                                                                {["1:1", "3:4", "9:16", "3:2", "4:3", "16:9", "21:9"].map(r => (<button key={r} onClick={() => { setSelectedSize(r); setShowSizeMenu(false); }} className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all ${selectedSize === r ? 'bg-gray-100 dark:bg-white/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}><span className="text-[11px] font-bold">{r}</span>{(r === "16:9" || r === "21:9") && <span className="bg-[#d9ff00]/20 text-[#d9ff00] text-[7px] font-black px-1 rounded uppercase">Cinema</span>}</button>))}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                <div className="relative">
                                                    <button onClick={() => setShowResMenu(!showResMenu)} className={`h-10 px-4 ${showResMenu ? 'bg-gray-200 dark:bg-white/10' : 'bg-gray-100 dark:bg-[#1a1a1a]'} hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl border border-gray-200 dark:border-white/10 text-[11px] font-bold flex items-center gap-2 transition-all`}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 3l9 9-9 9-9-9 9-9z"/></svg>{selectedRes}</button>
                                                    <AnimatePresence>
                                                        {showResMenu && (
                                                            <motion.div ref={resRef} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-full left-0 mb-3 w-[150px] bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-2xl p-2 z-[100] backdrop-blur-2xl">
                                                                {["720p", "1080p", "2K", "4K"].map(r => (<button key={r} onClick={() => { setSelectedRes(r); setShowResMenu(false); }} className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all ${selectedRes === r ? 'bg-gray-100 dark:bg-white/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}><span className="text-[11px] font-bold">{r}</span>{selectedRes === r && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d9ff00" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg>}</button>))}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                <div className="relative">
                                                    <button onClick={() => setShowStyleMenu(!showStyleMenu)} className={`h-10 px-4 ${showStyleMenu ? 'bg-gray-200 dark:bg-white/10' : 'bg-gray-100 dark:bg-[#1a1a1a]'} hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl border border-gray-200 dark:border-white/10 text-[11px] font-bold flex items-center gap-2 transition-all`}><div className="w-5 h-5 rounded overflow-hidden border border-gray-200 dark:border-white/10"><img src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=50" alt="Style" className="w-full h-full object-cover" /></div>{selectedStyle}</button>
                                                    <AnimatePresence>
                                                        {showStyleMenu && (
                                                            <motion.div ref={styleRef} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-full left-0 mb-3 w-[600px] bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl dark:shadow-2xl p-4 z-[100] backdrop-blur-2xl overflow-hidden">
                                                                <div className="px-1 py-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-white/5 mb-3">Genre</div>
                                                                <div className="grid grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-1">
                                                                    {[
                                                                        { name: "General", img: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809" },
                                                                        { name: "Action", img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1" },
                                                                        { name: "Horror", img: "https://images.unsplash.com/photo-1509248961158-e54f6934749c" },
                                                                        { name: "Comedy", img: "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a" },
                                                                        { name: "Western", img: "https://images.unsplash.com/photo-1533134486753-c833f074868f" },
                                                                        { name: "Suspense", img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26" },
                                                                        { name: "Romance", img: "https://images.unsplash.com/photo-1518199266791-cdd210672460" },
                                                                        { name: "Drama", img: "https://images.unsplash.com/photo-1485846234645-a62644f84728" },
                                                                    ].map(s => (
                                                                        <button key={s.name} onClick={() => { setSelectedStyle(s.name); setShowStyleMenu(false); }} className={`flex flex-col gap-1.5 group transition-all`}>
                                                                            <div className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${selectedStyle === s.name ? 'border-[#d9ff00] ring-4 ring-[#d9ff00]/20' : 'border-gray-200 dark:border-white/5 group-hover:border-gray-300 dark:group-hover:border-white/20'}`}>
                                                                                <img src={`${s.img}?auto=format&fit=crop&q=80&w=150`} alt={s.name} className="w-full h-full object-cover" />
                                                                                {selectedStyle === s.name && <div className="absolute inset-0 bg-[#d9ff00]/10 flex items-center justify-center"><div className="w-5 h-5 rounded-full bg-[#d9ff00] flex items-center justify-center text-black shadow-lg"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg></div></div>}
                                                                            </div>
                                                                            <span className={`text-[10px] font-bold text-center ${selectedStyle === s.name ? 'text-[#d9ff00]' : 'text-gray-400 dark:text-gray-500'}`}>{s.name}</span>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </>
                                        ) : (
                                            /* CHAT TOOLBAR */
                                            <>
                                                <div className="relative">
                                                    <button 
                                                        onClick={() => setShowChatModelsMenu(!showChatModelsMenu)}
                                                        className={`h-10 px-4 ${showChatModelsMenu ? 'bg-gray-200 dark:bg-white/10' : 'bg-gray-100 dark:bg-[#1a1a1a]'} hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl border border-gray-200 dark:border-white/10 text-[11px] font-bold flex items-center gap-3 transition-all`}
                                                    >
                                                        <span className="text-sm">🧠</span> {selectedChatModel}
                                                    </button>

                                                    <AnimatePresence>
                                                        {showChatModelsMenu && (
                                                            <motion.div 
                                                                ref={menuRef}
                                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                className="absolute bottom-full left-0 mb-3 w-[260px] bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl dark:shadow-2xl overflow-hidden z-[100]"
                                                            >
                                                                <div className="max-h-[400px] overflow-y-auto p-1.5 space-y-3">
                                                                    {/* OpenAI */}
                                                                    <div>
                                                                        <div className="px-2 py-1 text-[11px] font-bold text-blue-600">OpenAI</div>
                                                                        <div className="space-y-0.5">
                                                                            {["GPT-5.5", "GPT-5.5 Thinking", "GPT-5.4 mini"].map(m => (
                                                                                <button key={m} onClick={() => { setSelectedChatModel(m); setShowChatModelsMenu(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-[13px] font-medium transition-all ${selectedChatModel === m ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                                                                                    <div className={`w-6 h-6 rounded flex items-center justify-center text-xs ${selectedChatModel === m ? 'bg-white/20' : 'bg-gray-100 dark:bg-white/10'}`}>🤖</div>
                                                                                    <span className="flex-1">{m}</span>
                                                                                    {selectedChatModel === m && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                    {/* Anthropic */}
                                                                    <div>
                                                                        <div className="px-2 py-1 text-[11px] font-bold text-orange-600">Anthropic</div>
                                                                        <div className="space-y-0.5">
                                                                            {["Claude Sonnet 4.6", "Claude Sonnet 4.6 Thinking", "Claude Opus 4.7", "Claude Haiku 4.5"].map(m => (
                                                                                <button key={m} onClick={() => { setSelectedChatModel(m); setShowChatModelsMenu(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-[13px] font-medium transition-all ${selectedChatModel === m ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                                                                                    <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-black ${selectedChatModel === m ? 'bg-white/20' : 'bg-[#d97706] text-white'}`}>A\</div>
                                                                                    <span className="flex-1">{m}</span>
                                                                                    {selectedChatModel === m && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                    {/* Google */}
                                                                    <div>
                                                                        <div className="px-2 py-1 text-[11px] font-bold text-purple-600">Google</div>
                                                                        <div className="space-y-0.5">
                                                                            {["Gemini 1.5 Flash", "Gemini 1.5 Pro"].map(m => (
                                                                                <button key={m} onClick={() => { setSelectedChatModel(m); setShowChatModelsMenu(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-[13px] font-medium transition-all ${selectedChatModel === m ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                                                                                    <div className={`w-6 h-6 rounded flex items-center justify-center text-xs ${selectedChatModel === m ? 'bg-white/20' : 'bg-purple-100 dark:bg-white/10'}`}>✨</div>
                                                                                    <span className="flex-1">{m}</span>
                                                                                    {selectedChatModel === m && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                <button className="h-10 px-4 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl border border-gray-200 dark:border-white/10 text-[11px] font-bold flex items-center gap-2 transition-all"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg> Creative</button>
                                                <button className="h-10 px-4 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl border border-gray-200 dark:border-white/10 text-[11px] font-bold flex items-center gap-2 transition-all"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg> Web Search</button>
                                                <button onClick={() => setAutoDownload(!autoDownload)} className={`h-10 px-4 ${autoDownload ? 'bg-[#d9ff00] border-[#d9ff00] text-black' : 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-500'} hover:opacity-80 rounded-xl border border-gray-200 dark:border-white/10 text-[11px] font-bold flex items-center gap-2 transition-all`}>
                                                    <div className={`w-3 h-3 rounded-full border-2 ${autoDownload ? 'bg-black border-black' : 'border-gray-400'}`} /> Auto Download
                                                </button>
                                                <button className="h-10 px-4 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl border border-gray-200 dark:border-white/10 text-[11px] font-bold flex items-center gap-2 transition-all"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20M4 19.5V3a2.5 2.5 0 012.5-2.5H20"/></svg> Presentation</button>
                                            </>
                                        )}
                                    </div>

                                    {/* ACTION SECTION */}
                                    <div className="flex items-center gap-2">
                                        {mode === 'image' ? (
                                            <div className="flex items-center gap-2">
                                                <div className="bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl p-3 px-4 flex flex-col gap-0 min-w-[150px] shadow-sm dark:shadow-lg relative">
                                                    <div className="flex justify-between items-start">
                                                        <span className="text-[11px] font-bold leading-none text-gray-900 dark:text-white">Studio Digital S35</span>
                                                        <div className="w-5 h-5 rounded-full bg-white dark:bg-black border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-sm">
                                                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500/20 flex items-center justify-center">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold mt-1 leading-tight">Premium Modern Prime,</p>
                                                    <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold leading-tight">35 mm, f/4</p>
                                                </div>
 
                                                <button 
                                                    onClick={handleGenerate}
                                                    disabled={isGenerating || !prompt.trim()}
                                                    className={`relative h-14 px-8 rounded-2xl font-black transition-all flex items-center justify-center overflow-hidden ${isGenerating || !prompt.trim() ? "bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-700 cursor-not-allowed" : "bg-gradient-to-br from-[#80eeff] to-[#3ea6ff] text-black shadow-lg dark:shadow-[0_10px_20px_rgba(62,166,255,0.3)] hover:scale-[1.02] active:scale-[0.98]"}`}
                                                >
                                                    <span className="uppercase tracking-tighter text-[13px] font-black">
                                                        {isGenerating ? "..." : <>GENERATE ✨ 2</>}
                                                    </span>
                                                </button>
                                            </div>
                                        ) : mode === 'video' ? (
                                            <div className="flex items-center gap-1.5">
                                                <div className="flex gap-1">
                                                    <button className="flex flex-col items-center justify-center w-10 h-10 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#222] border border-gray-200 dark:border-white/10 rounded-lg transition-all group"><span className="text-[10px] text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">+</span><span className="text-[5px] font-bold text-gray-400 dark:text-gray-500">START</span></button>
                                                    <button className="flex flex-col items-center justify-center w-10 h-10 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#222] border border-gray-200 dark:border-white/10 rounded-lg transition-all group"><span className="text-[10px] text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">+</span><span className="text-[5px] font-bold text-gray-400 dark:text-gray-500">END</span></button>
                                                </div>
                                                <button onClick={handleGenerate} className="relative h-10 px-7 rounded-lg font-black bg-gradient-to-br from-[#d9ff00] to-[#b8e600] text-black shadow-md uppercase tracking-wider text-[10px]">Generate ✨ 8</button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <div className="bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-lg p-1.5 px-2.5 flex flex-col gap-0 shadow-sm dark:shadow-lg"><span className="text-[9px] font-bold leading-none text-gray-900 dark:text-white">TecSub Assistant</span><p className="text-[6px] text-gray-400 dark:text-gray-500 font-bold uppercase">Pro Engine v4.2</p></div>
                                                <button onClick={handleGenerate} className="h-10 px-6 rounded-lg font-black bg-gradient-to-br from-[#c084fc] to-[#9333ea] text-white shadow-md uppercase tracking-wider text-[10px]">SEND MESSAGE ✨</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}
