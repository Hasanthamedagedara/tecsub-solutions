"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/components/ThemeProvider";

export default function ImageResizerPage() {
    const [image, setImage] = useState<string | null>(null);
    const [fileName, setFileName] = useState("");
    const [mode, setMode] = useState("size"); // 'size', 'percentage', 'social'
    const [width, setWidth] = useState<number | string>("");
    const [height, setHeight] = useState<number | string>("");
    const [lockAspect, setLockAspect] = useState(true);
    const [aspectRatio, setAspectRatio] = useState(1);
    const [format, setFormat] = useState("png");
    const [quality, setQuality] = useState(90);
    const { theme } = useAppContext();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (f) => {
            const data = f.target?.result as string;
            setImage(data);
            const img = new Image();
            img.onload = () => {
                setWidth(img.width);
                setHeight(img.height);
                setAspectRatio(img.width / img.height);
            };
            img.src = data;
        };
        reader.readAsDataURL(file);
    };

    const handleWidthChange = (val: string) => {
        const w = parseInt(val);
        if (isNaN(w)) {
            setWidth("");
            return;
        }
        setWidth(w);
        if (lockAspect && aspectRatio) {
            setHeight(Math.round(w / aspectRatio));
        }
    };

    const handleHeightChange = (val: string) => {
        const h = parseInt(val);
        if (isNaN(h)) {
            setHeight("");
            return;
        }
        setHeight(h);
        if (lockAspect && aspectRatio) {
            setWidth(Math.round(h * aspectRatio));
        }
    };

    const handleExport = () => {
        if (!image || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
            canvas.width = Number(width);
            canvas.height = Number(height);
            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
            const dataURL = canvas.toDataURL(`image/${format}`, quality / 100);
            const link = document.createElement("a");
            link.download = `resized-${fileName.split('.')[0]}.${format}`;
            link.href = dataURL;
            link.click();
        };
        img.src = image;
    };

    return (
        <div className="min-h-screen flex flex-col font-sans" style={{ background: "var(--yt-bg)", color: "var(--yt-text-primary)" }}>
            {/* ═══ Header ═══ */}
            <header className="h-14 flex items-center justify-between px-6 border-b z-50" style={{ background: "var(--yt-bg-secondary)", borderColor: "var(--yt-border)" }}>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white">IR</div>
                        <span className="text-lg font-black tracking-tighter">TECSUB ImageResizer</span>
                    </div>
                    <nav className="hidden md:flex items-center gap-6 ml-8">
                        {["Resize", "Crop", "Compress", "Convert"].map(tool => (
                            <button key={tool} className="text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 transition-all">{tool}</button>
                        ))}
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <button className="text-xs font-bold uppercase tracking-widest px-4 py-2 hover:bg-white/5 rounded">Login</button>
                    <button className="text-xs font-bold uppercase tracking-widest px-6 py-2 bg-blue-600 text-white rounded-lg shadow-lg">Signup</button>
                </div>
            </header>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* ═══ Left Sidebar: Settings ═══ */}
                <aside className="w-full md:w-[360px] border-r flex flex-col overflow-y-auto" style={{ background: "var(--yt-bg-secondary)", borderColor: "var(--yt-border)" }}>
                    <div className="p-6 space-y-8">
                        <div className="flex items-center gap-2">
                            <button onClick={() => fileInputRef.current?.click()} className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all text-xl">+</button>
                            <button className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">📋</button>
                            <button onClick={() => setImage(null)} className="w-12 h-12 flex items-center justify-center bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 rounded-xl transition-all">🗑️</button>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleUpload} />
                        </div>

                        <section>
                            <h3 className="text-xl font-bold mb-4">Resize Settings</h3>
                            <div className="flex p-1 rounded-xl bg-white/5 mb-6">
                                {["By Size", "As Percentage", "Social Media"].map((m, i) => (
                                    <button 
                                        key={m}
                                        onClick={() => setMode(i === 0 ? "size" : i === 1 ? "percentage" : "social")}
                                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${((i === 0 && mode === "size") || (i === 1 && mode === "percentage") || (i === 2 && mode === "social")) ? "bg-white/10 text-white" : "opacity-40"}`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Width</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={width}
                                            onChange={(e) => handleWidthChange(e.target.value)}
                                            placeholder="Enter Width" 
                                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm font-bold outline-none focus:border-blue-500 transition-all"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black opacity-30">px</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Height</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            value={height}
                                            onChange={(e) => handleHeightChange(e.target.value)}
                                            placeholder="Enter Height" 
                                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm font-bold outline-none focus:border-blue-500 transition-all"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black opacity-30">px</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    id="lockAspect" 
                                    checked={lockAspect} 
                                    onChange={(e) => setLockAspect(e.target.checked)}
                                    className="accent-blue-600"
                                />
                                <label htmlFor="lockAspect" className="text-[11px] font-bold opacity-60 cursor-pointer">Lock Aspect Ratio</label>
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold">Export Settings</h3>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m18 15-6-6-6 6"/></svg>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Target Format</label>
                                    <select 
                                        value={format} 
                                        onChange={(e) => setFormat(e.target.value)}
                                        className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm font-bold outline-none"
                                    >
                                        <option value="png">PNG (Lossless)</option>
                                        <option value="jpeg">JPEG (Compressed)</option>
                                        <option value="webp">WebP (Optimized)</option>
                                    </select>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="mt-auto p-6">
                        <button 
                            onClick={handleExport}
                            disabled={!image}
                            className="w-full h-14 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest shadow-2xl shadow-blue-600/20 transition-all"
                        >
                            Export Image
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                        </button>
                    </div>
                </aside>

                {/* ═══ Main: Preview Area ═══ */}
                <main className="flex-1 bg-[#0a0c10] relative flex flex-col items-center justify-center p-12 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] opacity-[0.03] pointer-events-none" />
                    
                    {!image ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center gap-6 text-center"
                        >
                            <div className="w-24 h-24 rounded-3xl bg-blue-600/10 flex items-center justify-center text-4xl border border-blue-500/20">🖼️</div>
                            <div>
                                <h2 className="text-3xl font-black mb-2">Drop your image here</h2>
                                <p className="text-sm opacity-40">Support PNG, JPG, WebP (Max 10MB)</p>
                            </div>
                            <button onClick={() => fileInputRef.current?.click()} className="px-8 py-3 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Select Image</button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative group"
                        >
                            {/* Toolbar on top of image */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all z-10 shadow-2xl">
                                {["🔄", "↕️", "ℹ️", "✖️"].map(icon => (
                                    <button key={icon} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-all">{icon}</button>
                                ))}
                            </div>
                            
                            <div className="shadow-2xl rounded-sm overflow-hidden bg-white">
                                <img 
                                    src={image} 
                                    alt="Preview" 
                                    className="max-h-[70vh] object-contain"
                                    style={{ 
                                        width: mode === "size" ? "auto" : "100%",
                                    }}
                                />
                            </div>

                            <div className="absolute -bottom-12 left-0 right-0 flex items-center justify-between px-2">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{fileName}</span>
                                <div className="flex items-center gap-3">
                                    <span className="px-2 py-0.5 rounded bg-blue-600 text-[10px] font-black uppercase tracking-widest">{width} x {height}</span>
                                    <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-black uppercase tracking-widest">{format.toUpperCase()}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <canvas ref={canvasRef} className="hidden" />
                </main>
            </div>
        </div>
    );
}
