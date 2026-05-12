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
    const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);

    const [recentGenerations, setRecentGenerations] = useState<any[]>([]);

    const menuRef = useRef<HTMLDivElement>(null);
    const sizeRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const shotRef = useRef<HTMLDivElement>(null);
    const resRef = useRef<HTMLDivElement>(null);
    const styleRef = useRef<HTMLDivElement>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (mode === "chat") {
            scrollToBottom();
        }
    }, [messages]);

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
        
        if (mode === "chat") {
            const userMsg = prompt.trim();
            setPrompt("");
            
            // Add user message to history
            const newMessages = [...messages, { role: "user" as const, content: userMsg }];
            setMessages(newMessages);
            setIsGenerating(true);
            setShowPreview(true);

            try {
                const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
                
                // Map UI model name to API model name
                let apiModel = "gemini-1.5-flash";
                if (selectedChatModel.includes("Pro")) apiModel = "gemini-1.5-pro";
                if (selectedChatModel.includes("Ultra")) apiModel = "gemini-2.0-flash-exp"; // Fallback for Ultra

                // Format messages for Gemini API
                const history = newMessages.map(msg => ({
                    role: msg.role === "user" ? "user" : "model",
                    parts: [{ text: msg.content }]
                }));

                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${apiModel}:generateContent?key=${apiKey}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ contents: history })
                });

                const data = await response.json();
                
                if (data.error) {
                    throw new Error(data.error.message);
                }

                const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";
                setMessages(prev => [...prev, { role: "assistant", content: text }]);
                setRecentGenerations(prev => [{ url: "", type: "chat", text: text.substring(0, 30), widthClass: "w-[250px] h-[340px]" }, ...prev]);
            } catch (error: any) {
                console.error("Gemini Error:", error);
                setMessages(prev => [...prev, { role: "assistant", content: `Error: ${error.message || "Service connection failed."}` }]);
            }
        } else {
            setIsGenerating(true);
            setShowPreview(true);
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
                    {/* PREVIEW AREA / CHAT AREA */}
                    <div className="w-full flex justify-center min-h-[400px]">
                        <AnimatePresence mode="wait">
                            {mode === "chat" ? (
                                <motion.div 
                                    key="chat-active"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="w-[95%] h-[500px] rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 bg-black/40 backdrop-blur-md relative shadow-2xl"
                                >
                                    <div className="p-6 h-full overflow-y-auto scrollbar-hide flex flex-col gap-6">
                                        {messages.length === 0 ? (
                                            <div className="flex-1 flex flex-col items-center justify-center opacity-40 text-center p-12">
                                                <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-4xl mb-6 shadow-2xl border border-white/5">✨</div>
                                                <h2 className="text-2xl font-black mb-3 tracking-tight">TecSub AI Assistant</h2>
                                                <p className="text-sm max-w-sm font-medium text-gray-400">Your professional AI partner for creativity, coding, and deep thinking. How can I assist you today?</p>
                                                <div className="flex gap-2 mt-8">
                                                    {["Write a poem", "Explain quantum physics", "Debug my code"].map(hint => (
                                                        <button key={hint} onClick={() => setPrompt(hint)} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[11px] font-bold hover:bg-white/10 transition-all">{hint}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                {messages.map((msg, i) => (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        key={i} 
                                                        className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                                                    >
                                                        <div className={`max-w-[80%] p-5 rounded-2xl text-[14px] leading-relaxed shadow-lg ${
                                                            msg.role === "user" 
                                                            ? "bg-gradient-to-br from-purple-600/30 to-blue-600/30 border border-white/10 text-white rounded-tr-none" 
                                                            : "bg-white/5 border border-white/5 text-gray-100 rounded-tl-none"
                                                        }`}>
                                                            <div className="whitespace-pre-wrap">{msg.content}</div>
                                                        </div>
                                                        <span className="text-[9px] font-bold text-gray-500 mt-2 uppercase tracking-widest px-1">{msg.role}</span>
                                                    </motion.div>
                                                ))}
                                                {isGenerating && (
                                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start">
                                                        <div className="max-w-[80%] p-5 rounded-2xl bg-white/5 border border-white/5 text-gray-400 rounded-tl-none">
                                                            <div className="flex gap-1.5 items-center">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.3s]" />
                                                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.15s]" />
                                                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce" />
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                                <div ref={chatEndRef} />
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            ) : (
                                showPreview && (
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
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative w-full h-full">
                                                <img 
                                                    src={mode === "image" ? "/generations/woman_saree.png" : "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=1200"} 
                                                    className="w-full h-full object-cover" 
                                                    alt="Generated Result" 
                                                />
                                                
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
                                )
                            )}
                        </AnimatePresence>
                    </div>
                    
                <div className="w-full max-w-7xl flex gap-6 px-4">
                    
                    {/* Vertical Mode Selector (Left Sidebar) */}
                    <div className="flex flex-col gap-2 bg-white/5 dark:bg-[#0d0d0d]/80 border border-gray-200 dark:border-white/5 p-2 rounded-3xl backdrop-blur-2xl shadow-2xl h-[calc(100vh-180px)] sticky top-24">
                        <div className="flex-1 flex flex-col gap-2">
                            <button onClick={() => setMode("image")} className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${mode === "image" ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-xl dark:shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] scale-105" : "text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white hover:bg-white/5"}`}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                                <span className="text-[7px] font-black uppercase mt-1 tracking-tighter">Image</span>
                            </button>
                            <button onClick={() => setMode("video")} className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${mode === "video" ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-xl dark:shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] scale-105" : "text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white hover:bg-white/5"}`}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="3"/></svg>
                                <span className="text-[7px] font-black uppercase mt-1 tracking-tighter">Video</span>
                            </button>
                            <button onClick={() => setMode("chat")} className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${mode === "chat" ? "bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-xl dark:shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] scale-105" : "text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white hover:bg-white/5"}`}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 11-7.6-14.7 8.38 8.38 0 013.8.9L21 3.5v8z"/></svg>
                                <span className="text-[7px] font-black uppercase mt-1 tracking-tighter">Chat</span>
                            </button>
                        </div>
                        
                        <div className="pt-2 border-t border-white/5 flex flex-col gap-2">
                            <button className="flex items-center justify-center w-14 h-14 rounded-2xl text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-white hover:bg-white/5 transition-all">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-6">
                        {/* PREVIEW AREA / CHAT AREA */}
                        <div className="w-full flex justify-center min-h-[400px]">
                            <AnimatePresence mode="wait">
                                {mode === "chat" ? (
                                    <motion.div 
                                        key="chat-active"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="w-full h-[550px] rounded-[2.5rem] overflow-hidden border border-gray-200 dark:border-white/10 bg-black/40 backdrop-blur-md relative shadow-2xl"
                                    >
                                        <div className="p-8 h-full overflow-y-auto scrollbar-hide flex flex-col gap-8">
                                            {messages.length === 0 ? (
                                                <div className="flex-1 flex flex-col items-center justify-center opacity-40 text-center p-12">
                                                    <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-5xl mb-8 shadow-2xl border border-white/5">✨</div>
                                                    <h2 className="text-3xl font-black mb-4 tracking-tight text-white">TecSub AI Assistant</h2>
                                                    <p className="text-base max-w-md font-medium text-gray-400">Your professional AI partner for creativity, coding, and deep thinking. How can I assist you today?</p>
                                                    <div className="flex flex-wrap justify-center gap-3 mt-10">
                                                        {["Write a creative poem", "Explain quantum computing", "Help me debug code", "Plan a travel trip"].map(hint => (
                                                            <button key={hint} onClick={() => setPrompt(hint)} className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-[12px] font-bold hover:bg-white/10 transition-all text-white/70">{hint}</button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    {messages.map((msg, i) => (
                                                        <motion.div 
                                                            initial={{ opacity: 0, y: 15 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            key={i} 
                                                            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"} group`}
                                                        >
                                                            <div className={`relative max-w-[80%] p-6 rounded-[1.8rem] text-[15px] leading-relaxed shadow-2xl transition-all ${
                                                                msg.role === "user" 
                                                                ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-tr-none" 
                                                                : "bg-white/5 border border-white/5 text-gray-100 rounded-tl-none backdrop-blur-md"
                                                            }`}>
                                                                <div className="whitespace-pre-wrap">{msg.content}</div>
                                                                
                                                                {/* Message Actions */}
                                                                <div className={`absolute bottom-2 ${msg.role === 'user' ? 'left-2' : 'right-2'} opacity-0 group-hover:opacity-100 transition-opacity flex gap-2`}>
                                                                    <button 
                                                                        onClick={() => {
                                                                            navigator.clipboard.writeText(msg.content);
                                                                            // Could add a toast here
                                                                        }}
                                                                        className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white/50 hover:text-white transition-all"
                                                                        title="Copy message"
                                                                    >
                                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8 4v8a2 2 0 002 2h8m-10-10a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2h-8a2 2 0 01-2-2V4z"/></svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-3 px-1">
                                                                <div className={`w-1.5 h-1.5 rounded-full ${msg.role === "user" ? "bg-blue-400" : "bg-purple-400"}`} />
                                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{msg.role === "user" ? "You" : selectedChatModel}</span>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                    {isGenerating && (
                                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start">
                                                            <div className="max-w-[75%] p-6 rounded-[1.5rem] bg-white/5 border border-white/5 text-gray-400 rounded-tl-none">
                                                                <div className="flex gap-2 items-center">
                                                                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.3s]" />
                                                                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.15s]" />
                                                                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" />
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                    <div ref={chatEndRef} />
                                                </>
                                            )}
                                        </div>
                                    </motion.div>
                                ) : (
                                    showPreview && (
                                        <motion.div 
                                            key="preview-active"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            className="w-full aspect-video rounded-[2.5rem] overflow-hidden border border-gray-200 dark:border-white/10 bg-black relative shadow-2xl"
                                        >
                                            {isGenerating ? (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black">
                                                    <div className="relative w-24 h-24">
                                                        <div className="absolute inset-0 border-4 border-[#d9ff00]/10 rounded-full" />
                                                        <div className="absolute inset-0 border-4 border-t-[#d9ff00] rounded-full animate-spin" />
                                                    </div>
                                                    <div className="flex flex-col items-center gap-2">
                                                        <h2 className="text-[#d9ff00] text-sm font-black uppercase tracking-[0.4em] animate-pulse">Generating</h2>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="relative w-full h-full">
                                                    <img 
                                                        src={mode === "image" ? "/generations/woman_saree.png" : "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=1200"} 
                                                        className="w-full h-full object-cover" 
                                                        alt="Generated Result" 
                                                    />
                                                    
                                                    {/* Preview Metadata Overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-10">
                                                        <div className="flex items-end justify-between">
                                                            <div className="space-y-2">
                                                                <span className="text-[12px] font-black text-[#d9ff00] uppercase tracking-widest">{mode} Success</span>
                                                                <h3 className="text-3xl font-bold text-white max-w-2xl">{prompt}</h3>
                                                            </div>
                                                            <div className="flex gap-4">
                                                                <button onClick={() => setShowPreview(false)} className="h-14 px-8 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white text-sm font-bold transition-all">Create New</button>
                                                                <button onClick={handleDownload} className="h-14 w-14 rounded-2xl bg-[#d9ff00] flex items-center justify-center text-black shadow-lg hover:scale-105 active:scale-95 transition-all"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )
                                )}
                            </AnimatePresence>
                        </div>
                        
                        {/* Interaction Panel */}
                        <div className="flex flex-col gap-4">
                            
                            {/* Director Panel (Only for Video/Image modes) */}
                            <AnimatePresence mode="wait">
                                {mode !== "chat" && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/5 rounded-[1.5rem] p-4 flex flex-col gap-3 shadow-2xl overflow-hidden">
                                        <div className="flex items-center gap-2 mb-1">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400 dark:text-gray-500"><path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z"/></svg>
                                            <span className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-black">Director Panel</span>
                                            <svg className="ml-auto w-4 h-4 text-gray-300 dark:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4">
                                            <div className="flex gap-1.5">
                                                <div className="w-11 h-11 rounded-xl bg-gray-200 dark:bg-white/5 border border-gray-300 dark:border-white/10 flex items-center justify-center text-gray-500"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>
                                                <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-white/[0.01] border border-gray-200 dark:border-white/5" />
                                            </div>
                                            <div className="flex items-center gap-3 bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/5 rounded-xl p-1.5 pr-4 min-w-[130px]">
                                                <div className="w-9 h-9 rounded-lg overflow-hidden bg-white dark:bg-black/40 border border-gray-200 dark:border-white/5"><img src="https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=100&h=100" alt="Movement" className="w-full h-full object-cover opacity-60" /></div>
                                                <div className="flex flex-col"><span className="text-[7px] text-gray-400 dark:text-gray-500 uppercase font-black tracking-tight">Movement</span><span className="text-[12px] font-bold leading-none">Auto</span></div>
                                            </div>
                                            <div className="flex-1 h-10 relative bg-gray-100 dark:bg-black/30 rounded-xl overflow-hidden border border-gray-200 dark:border-white/5">
                                                <svg className="w-full h-full px-4"><path d="M0 20 C 100 20, 200 35, 300 20 S 500 5, 600 20" fill="none" stroke="#3ea6ff" strokeWidth="2" />{[0, 150, 300, 450, 600].map((x, i) => (<circle key={i} cx={x} cy={i === 1 ? 28 : i === 3 ? 12 : 20} r="3" fill="#3ea6ff" />))}</svg>
                                            </div>
                                            <div className="bg-gray-100 dark:bg-white/[0.04] px-4 py-2 rounded-xl border border-gray-200 dark:border-white/5 text-[11px] font-bold flex items-center gap-4">Auto <div className="flex flex-col gap-0.5"><svg width="6" height="6" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400 dark:text-gray-600"><path d="M7 14l5-5 5 5z"/></svg><svg width="6" height="6" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400 dark:text-gray-600"><path d="M7 10l5 5 5-5z"/></svg></div></div>
                                            <div className="bg-gray-100 dark:bg-white/[0.04] px-4 py-2 rounded-xl border border-gray-200 dark:border-white/5 text-[11px] font-bold relative min-w-[100px] h-[34px] flex items-center"><span className="relative z-10 text-gray-700 dark:text-white">4.0s</span><div className="absolute left-[30%] top-0 bottom-0 w-[2px] bg-blue-500 dark:bg-white shadow-[0_0_8px_rgba(59,130,246,0.6)] dark:shadow-[0_0_8px_white]" /></div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Prompt Input Container */}
                            <div className="bg-gray-50 dark:bg-[#0d0d0d] border border-gray-200 dark:border-white/5 rounded-[2.5rem] shadow-2xl p-5 sm:p-6 flex flex-col gap-4">
                                <div className="flex items-start gap-4">
                                    <input type="file" id="file-upload" className="hidden" onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) setPrompt(prev => prev + ` [File: ${file.name}] `);
                                    }} />
                                    <button 
                                        onClick={() => document.getElementById('file-upload')?.click()}
                                        className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 dark:text-gray-500 mt-1 hover:text-white hover:bg-white/10 transition-all active:scale-90"
                                    >
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                                    </button>
                                    <textarea 
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                handleGenerate();
                                            }
                                        }}
                                        placeholder={mode === 'chat' ? "Ask TecSub AI anything..." : "Describe your creative vision..."}
                                        className="w-full bg-transparent border-none outline-none text-xl font-light placeholder:text-gray-400 dark:placeholder:text-gray-800 resize-none min-h-[52px] pt-2"
                                    />
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 dark:border-white/5 pt-4">
                                    <div className="flex flex-wrap items-center gap-2 relative">
                                        {mode === 'image' ? (
                                            /* IMAGE MODE TOOLBAR */
                                            <>
                                                <div className="relative">
                                                    <button onClick={() => setShowModelsMenu(!showModelsMenu)} className={`h-11 px-5 ${showModelsMenu ? 'bg-gray-200 dark:bg-white/10' : 'bg-gray-100 dark:bg-[#1a1a1a]'} hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl border border-gray-200 dark:border-white/10 text-[12px] font-bold flex items-center gap-3 transition-all`}>
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M7 18H3V6h4l2-2h6l2 2h4v12h-4"/><circle cx="12" cy="13" r="3"/></svg>
                                                        {selectedModel}
                                                    </button>
                                                    <AnimatePresence>
                                                        {showModelsMenu && (
                                                            <motion.div ref={menuRef} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-full left-0 mb-4 w-[300px] bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100] backdrop-blur-2xl">
                                                                <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center gap-3"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-400 dark:text-gray-500"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg><input type="text" placeholder="Search models..." className="bg-transparent border-none outline-none text-sm w-full text-gray-500 dark:text-gray-300" /></div>
                                                                <div className="max-h-[350px] overflow-y-auto p-2 space-y-4">
                                                                    <div>
                                                                        <div className="px-3 py-1 flex items-center gap-2 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">✨ Cinematic engines</div>
                                                                        {[{ name: "AI Cast", desc: "Faces and styling" }, { name: "Cinematic Locations", desc: "Environments" }, { name: "Soul Cinema", desc: "Cinema generation" }, { name: "Cinematic Cameras", desc: "Camera controls" }].map(m => (
                                                                            <button key={m.name} onClick={() => { setSelectedModel(m.name); setShowModelsMenu(false); }} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${selectedModel === m.name ? 'bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                                                                                <div className="w-11 h-11 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-xl">🎬</div>
                                                                                <div className="flex flex-col flex-1 text-left"><span className="text-[12px] font-bold">{m.name}</span><span className="text-[10px] text-gray-400 dark:text-gray-500">{m.desc}</span></div>
                                                                                {selectedModel === m.name && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d9ff00" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg>}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                <div className="h-11 flex items-center bg-gray-100 dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-white/10 p-1 px-4 gap-5">
                                                     <button className="text-gray-400 dark:text-gray-600 font-bold text-lg hover:text-gray-600 dark:hover:text-gray-400 transition-colors">—</button>
                                                     <span className="text-[11px] font-black tracking-[0.3em] text-gray-500 dark:text-white">1 / 4</span>
                                                     <button className="text-gray-400 dark:text-gray-600 font-bold text-lg hover:text-gray-600 dark:hover:text-gray-400 transition-colors">+</button>
                                                </div>
                                                <div className="relative">
                                                    <button onClick={() => setShowSizeMenu(!showSizeMenu)} className={`h-11 px-5 ${showSizeMenu ? 'bg-gray-200 dark:bg-white/10' : 'bg-gray-100 dark:bg-[#1a1a1a]'} hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl border border-gray-200 dark:border-white/10 text-[12px] font-bold flex items-center gap-3 transition-all`}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>{selectedSize}</button>
                                                    <AnimatePresence>
                                                        {showSizeMenu && (
                                                            <motion.div ref={sizeRef} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-full left-0 mb-4 w-[220px] bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl p-2 z-[100] backdrop-blur-2xl">
                                                                {[{ ratio: "1:1" }, { ratio: "3:4" }, { ratio: "9:16" }, { ratio: "3:2" }, { ratio: "4:3" }, { ratio: "16:9", cinematic: true }, { ratio: "21:9", cinematic: true }].map(s => (
                                                                    <button key={s.ratio} onClick={() => { setSelectedSize(s.ratio); setShowSizeMenu(false); }} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${selectedSize === s.ratio ? 'bg-gray-100 dark:bg-white/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                                                                        <span className="text-[12px] font-bold flex-1 text-left">{s.ratio}</span>
                                                                        {s.cinematic && <span className="bg-[#d9ff00]/20 text-[#d9ff00] text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Cinematic</span>}
                                                                        {selectedSize === s.ratio && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d9ff00" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg>}
                                                                    </button>
                                                                ))}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                <button className="h-11 px-5 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl border border-gray-200 dark:border-white/10 text-[12px] font-bold flex items-center gap-3 transition-all">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 3l9 9-9 9-9-9 9-9z"/></svg>
                                                    {selectedRes}
                                                </button>
                                                <div className="relative">
                                                    <button onClick={() => setShowGridMenu(!showGridMenu)} className={`h-11 px-5 ${showGridMenu ? 'bg-gray-200 dark:bg-white/10' : 'bg-gray-100 dark:bg-[#1a1a1a]'} hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl border border-gray-200 dark:border-white/10 text-[12px] font-bold flex items-center gap-3 transition-all`}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>{selectedGrid}</button>
                                                    <AnimatePresence>
                                                        {showGridMenu && (
                                                            <motion.div ref={gridRef} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-full left-0 mb-4 w-[200px] bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl p-2 z-[100] backdrop-blur-2xl">
                                                                <div className="px-4 py-2 flex items-center justify-between text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-white/5 mb-2">Grid options</div>
                                                                {["1x1", "2x2", "3x3", "4x4"].map(g => (<button key={g} onClick={() => { setSelectedGrid(g); setShowGridMenu(false); }} className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${selectedGrid === g ? 'bg-gray-100 dark:bg-white/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}><span className="text-[12px] font-bold">{g}</span>{selectedGrid === g && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d9ff00" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg>}</button>))}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                <button className="h-11 w-11 flex items-center justify-center bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 font-black transition-all text-base hover:text-white">@</button>
                                            </>
                                        ) : mode === 'video' ? (
                                            /* VIDEO MODE TOOLBAR */
                                            <>
                                                <div className="relative">
                                                    <button onClick={() => setShowModelsMenu(!showModelsMenu)} className={`h-11 px-5 ${showModelsMenu ? 'bg-gray-200 dark:bg-white/10' : 'bg-gray-100 dark:bg-[#1a1a1a]'} hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl border border-gray-200 dark:border-white/10 text-[12px] font-bold flex items-center gap-3 transition-all`}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>{selectedVideoModel}</button>
                                                    <AnimatePresence>
                                                        {showModelsMenu && (
                                                            <motion.div ref={menuRef} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-full left-0 mb-4 w-[320px] bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100] backdrop-blur-2xl">
                                                                <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center gap-3"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gray-400 dark:text-gray-500"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg><input type="text" placeholder="Search video models..." className="bg-transparent border-none outline-none text-sm w-full text-gray-500 dark:text-gray-300" /></div>
                                                                <div className="max-h-[400px] overflow-y-auto p-2 space-y-5">
                                                                    <div>
                                                                        <div className="px-3 py-1 flex items-center gap-2 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">✨ Cinematic engines</div>
                                                                        {[{ name: "Cinema Studio 3.5", tag: "NEW" }, { name: "Cinema Studio 3.0" }, { name: "Cinema Studio 2.5" }].map(m => (
                                                                            <button key={m.name} onClick={() => { setSelectedVideoModel(m.name); setShowModelsMenu(false); }} className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${selectedVideoModel === m.name ? 'bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                                                                                <div className="w-11 h-11 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-2xl">🎬</div>
                                                                                <div className="flex flex-col flex-1 text-left"><span className="text-[12px] font-bold">{m.name}</span>{m.tag && <span className="w-fit bg-[#d9ff00] text-black text-[8px] font-black px-1.5 rounded-sm mt-0.5">{m.tag}</span>}</div>
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                <div className="relative">
                                                    <button onClick={() => setShowShotMenu(!showShotMenu)} className={`h-11 px-5 ${showShotMenu ? 'bg-gray-200 dark:bg-white/10' : 'bg-gray-100 dark:bg-[#1a1a1a]'} hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl border border-gray-200 dark:border-white/10 text-[12px] font-bold flex items-center gap-3 transition-all`}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 3v18"/></svg>{selectedShot}</button>
                                                    <AnimatePresence>
                                                        {showShotMenu && (
                                                            <motion.div ref={shotRef} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-full left-0 mb-4 w-[200px] bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl p-2 z-[100] backdrop-blur-2xl">
                                                                <div className="px-4 py-2 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100 dark:border-white/5 mb-2">Shot control</div>
                                                                {["Single shot", "Multi-shot Auto", "Multi-shot Manual"].map(s => (<button key={s} onClick={() => { setSelectedShot(s); setShowShotMenu(false); }} className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${selectedShot === s ? 'bg-gray-100 dark:bg-white/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}><span className="text-[12px] font-bold text-left">{s}</span>{selectedShot === s && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d9ff00" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg>}</button>))}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                <div className="relative">
                                                    <button onClick={() => setShowSizeMenu(!showSizeMenu)} className={`h-11 px-5 ${showSizeMenu ? 'bg-gray-200 dark:bg-white/10' : 'bg-gray-100 dark:bg-[#1a1a1a]'} hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl border border-gray-200 dark:border-white/10 text-[12px] font-bold flex items-center gap-3 transition-all`}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>{selectedSize}</button>
                                                    <AnimatePresence>
                                                        {showSizeMenu && (
                                                            <motion.div ref={sizeRef} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-full left-0 mb-4 w-[200px] bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl p-2 z-[100] backdrop-blur-2xl">
                                                                {["1:1", "3:4", "9:16", "3:2", "4:3", "16:9", "21:9"].map(r => (<button key={r} onClick={() => { setSelectedSize(r); setShowSizeMenu(false); }} className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${selectedSize === r ? 'bg-gray-100 dark:bg-white/10' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}><span className="text-[12px] font-bold">{r}</span>{(r === "16:9" || r === "21:9") && <span className="bg-[#d9ff00]/20 text-[#d9ff00] text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Cinema</span>}</button>))}
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
                                                        className={`h-11 px-5 ${showChatModelsMenu ? 'bg-gray-200 dark:bg-white/10' : 'bg-gray-100 dark:bg-[#1a1a1a]'} hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl border border-gray-200 dark:border-white/10 text-[12px] font-bold flex items-center gap-3 transition-all`}
                                                    >
                                                        <span className="text-base">🧠</span> {selectedChatModel}
                                                    </button>

                                                    <AnimatePresence>
                                                        {showChatModelsMenu && (
                                                            <motion.div 
                                                                ref={menuRef}
                                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                                className="absolute bottom-full left-0 mb-4 w-[280px] bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-white/10 rounded-[1.5rem] shadow-2xl overflow-hidden z-[100]"
                                                            >
                                                                <div className="max-h-[400px] overflow-y-auto p-2 space-y-4">
                                                                    {/* Google */}
                                                                    <div>
                                                                        <div className="px-3 py-1 text-[11px] font-black text-purple-600 uppercase tracking-widest mb-1">Google Cloud</div>
                                                                        <div className="space-y-1">
                                                                            {["Gemini 1.5 Flash", "Gemini 1.5 Pro", "Gemini 2.0 Ultra"].map(m => (
                                                                                <button key={m} onClick={() => { setSelectedChatModel(m); setShowChatModelsMenu(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-[14px] font-bold transition-all ${selectedChatModel === m ? 'bg-purple-600/20 text-purple-400 border border-purple-600/30' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                                                                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm ${selectedChatModel === m ? 'bg-purple-600 text-white' : 'bg-purple-100 dark:bg-white/10'}`}>✨</div>
                                                                                    <span className="flex-1">{m}</span>
                                                                                    {selectedChatModel === m && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg>}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                    {/* OpenAI */}
                                                                    <div>
                                                                        <div className="px-3 py-1 text-[11px] font-black text-blue-600 uppercase tracking-widest mb-1">OpenAI</div>
                                                                        <div className="space-y-1">
                                                                            {["GPT-4o", "GPT-4o mini", "o1-preview"].map(m => (
                                                                                <button key={m} onClick={() => { setSelectedChatModel(m); setShowChatModelsMenu(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-[14px] font-bold transition-all ${selectedChatModel === m ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                                                                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm ${selectedChatModel === m ? 'bg-blue-600 text-white' : 'bg-blue-100 dark:bg-white/10'}`}>🤖</div>
                                                                                    <span className="flex-1">{m}</span>
                                                                                    {selectedChatModel === m && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg>}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                                <button className="h-11 px-5 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl border border-gray-200 dark:border-white/10 text-[12px] font-bold flex items-center gap-3 transition-all"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg> Creative</button>
                                                <button className="h-11 px-5 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl border border-gray-200 dark:border-white/10 text-[12px] font-bold flex items-center gap-3 transition-all"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg> Web Search</button>
                                                <button onClick={() => setAutoDownload(!autoDownload)} className={`h-11 px-5 ${autoDownload ? 'bg-[#d9ff00] border-[#d9ff00] text-black' : 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-500'} hover:opacity-80 rounded-xl border border-gray-200 dark:border-white/10 text-[12px] font-bold flex items-center gap-3 transition-all shadow-sm`}>
                                                    <div className={`w-3.5 h-3.5 rounded-full border-[3px] ${autoDownload ? 'bg-black border-black' : 'border-gray-400'}`} /> Auto Download
                                                </button>
                                                <button className="h-11 px-5 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#222] rounded-xl border border-gray-200 dark:border-white/10 text-[12px] font-bold flex items-center gap-3 transition-all"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20M4 19.5V3a2.5 2.5 0 012.5-2.5H20"/></svg> Presentation</button>
                                            </>
                                        )}
                                    </div>

                                    {/* ACTION SECTION */}
                                    <div className="flex items-center gap-3">
                                        {mode === 'image' ? (
                                            <div className="flex items-center gap-4">
                                                <div className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[1.8rem] p-4 px-6 flex flex-col gap-0 min-w-[200px] shadow-lg relative group overflow-hidden">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <div className="flex justify-between items-start relative z-10">
                                                        <span className="text-[14px] font-black leading-none text-gray-900 dark:text-white uppercase tracking-tighter">Studio Digital S35</span>
                                                        <div className="w-6 h-6 rounded-full bg-white dark:bg-black border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-xl">
                                                            <div className="w-3.5 h-3.5 rounded-full bg-blue-500/20 flex items-center justify-center">
                                                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black mt-1.5 leading-tight uppercase tracking-[0.2em] relative z-10">Premium Modern Prime</p>
                                                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black leading-tight uppercase tracking-[0.2em] relative z-10">35 mm • f/4.0 • ISO 100</p>
                                                </div>
 
                                                <button 
                                                    onClick={handleGenerate}
                                                    disabled={isGenerating || !prompt.trim()}
                                                    className={`relative h-16 px-12 rounded-[1.8rem] font-black transition-all flex items-center justify-center overflow-hidden group ${isGenerating || !prompt.trim() ? "bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-700 cursor-not-allowed" : "bg-gradient-to-br from-[#80eeff] to-[#3ea6ff] text-black shadow-[0_20px_40px_rgba(62,166,255,0.3)] hover:scale-[1.05] active:scale-95"}`}
                                                >
                                                    <span className="relative z-10 uppercase tracking-tighter text-[16px] font-black flex items-center gap-3">
                                                        {isGenerating ? "..." : <>GENERATE <span className="text-xl">✨</span> <span className="opacity-40 text-xs">2</span></>}
                                                    </span>
                                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                                </button>
                                            </div>
                                        ) : mode === 'video' ? (
                                            <div className="flex items-center gap-4">
                                                <div className="flex gap-2.5">
                                                    <button className="flex flex-col items-center justify-center w-14 h-14 bg-gray-100 dark:bg-white/5 hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl transition-all group shadow-lg active:scale-90"><span className="text-xl text-gray-400 dark:text-gray-500 group-hover:text-white">+</span><span className="text-[7px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-tighter">Start</span></button>
                                                    <button className="flex flex-col items-center justify-center w-14 h-14 bg-gray-100 dark:bg-white/5 hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-2xl transition-all group shadow-lg active:scale-90"><span className="text-xl text-gray-400 dark:text-gray-500 group-hover:text-white">+</span><span className="text-[7px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-tighter">End</span></button>
                                                </div>
                                                <button onClick={handleGenerate} className="relative h-14 px-10 rounded-2xl font-black bg-gradient-to-br from-[#d9ff00] to-[#b8e600] text-black shadow-2xl uppercase tracking-widest text-[12px] hover:scale-105 active:scale-95 transition-all flex items-center gap-3">Generate <span className="text-lg">✨</span> 8</button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-4">
                                                <div className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-3 px-5 flex flex-col gap-0 shadow-xl border-r-4 border-r-purple-500/50 group hover:bg-white/10 transition-colors cursor-default">
                                                    <span className="text-[12px] font-black leading-none text-gray-900 dark:text-white tracking-tight">TecSub AI Assistant</span>
                                                    <p className="text-[8px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-[0.3em] mt-1">Pro Engine v4.2</p>
                                                </div>
                                                <button onClick={handleGenerate} className="h-14 px-10 rounded-2xl font-black bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-[0_15px_30px_rgba(147,51,234,0.4)] uppercase tracking-widest text-[12px] hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group">
                                                    SEND MESSAGE 
                                                    <span className="text-lg group-hover:rotate-12 transition-transform">✨</span>
                                                </button>
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
