"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/components/ThemeProvider";

const PRESETS = [
    { name: "1:1 Square", width: 1080, height: 1080 },
    { name: "16:9 YouTube", width: 1280, height: 720 },
    { name: "9:16 Story", width: 1080, height: 1920 },
];

export default function DesignerPage() {
    const [canvas, setCanvas] = useState<any>(null);
    const [fabric, setFabric] = useState<any>(null);
    const [aspectRatio, setAspectRatio] = useState("1:1 Square");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [layers, setLayers] = useState<any[]>([]);
    const [selectedObject, setSelectedObject] = useState<any>(null);
    const { theme } = useAppContext();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Initialize Fabric
    useEffect(() => {
        const initFabric = async () => {
            const fabricModule = await import("fabric");
            const f = fabricModule.fabric;
            setFabric(f);

            if (canvasRef.current) {
                const fabricCanvas = new f.Canvas(canvasRef.current, {
                    width: 1080,
                    height: 1080,
                    backgroundColor: "#ffffff",
                    preserveObjectStacking: true,
                });

                const updateState = () => {
                    setLayers([...fabricCanvas.getObjects()].reverse());
                    setSelectedObject(fabricCanvas.getActiveObject());
                };

                fabricCanvas.on("object:added", updateState);
                fabricCanvas.on("object:removed", updateState);
                fabricCanvas.on("object:modified", updateState);
                fabricCanvas.on("selection:created", updateState);
                fabricCanvas.on("selection:updated", updateState);
                fabricCanvas.on("selection:cleared", () => setSelectedObject(null));

                setCanvas(fabricCanvas);
                const scale = 0.4;
                fabricCanvas.setDimensions({ width: 1080 * scale, height: 1080 * scale }, { cssOnly: true });
                fabricCanvas.setZoom(scale);
            }
        };
        initFabric();
        return () => { if (canvas) canvas.dispose(); };
    }, []);

    const handleResize = (presetName: string) => {
        if (!canvas) return;
        const preset = PRESETS.find(p => p.name === presetName) || PRESETS[0];
        setAspectRatio(preset.name);
        
        // Dynamic scale based on container height
        const scale = 400 / preset.height;
        
        canvas.setDimensions({ width: preset.width, height: preset.height });
        canvas.setDimensions({ width: preset.width * scale, height: preset.height * scale }, { cssOnly: true });
        canvas.setZoom(scale);
        canvas.renderAll();
    };

    const addText = () => {
        if (!canvas || !fabric) return;
        const text = new fabric.IText("Type something...", {
            left: 100, top: 100,
            fontFamily: "Inter, sans-serif",
            fontSize: 60,
            fill: "#000000",
        });
        canvas.add(text);
        canvas.setActiveObject(text);
    };

    const addShape = (type: string) => {
        if (!canvas || !fabric) return;
        let shape;
        const props = { fill: "#dc2626", left: 150, top: 150 };
        if (type === "rect") shape = new fabric.Rect({ ...props, width: 200, height: 200 });
        else if (type === "circle") shape = new fabric.Circle({ ...props, radius: 100 });
        else if (type === "triangle") shape = new fabric.Triangle({ ...props, width: 200, height: 200 });
        canvas.add(shape);
        canvas.setActiveObject(shape);
    };

    const downloadDesign = () => {
        if (!canvas) return;
        const link = document.createElement("a");
        link.download = `tecsub-design.png`;
        link.href = canvas.toDataURL({ format: "png", multiplier: 2 });
        link.click();
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-[#0a0f1d] text-white font-sans select-none">
            {/* ═══ TOP TOOLBAR ═══ */}
            <header className="h-12 flex items-center justify-between px-4 bg-[#141b2d] border-b border-white/5 z-50">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-bold">T</div>
                        <span className="text-[11px] font-black italic tracking-tighter text-white uppercase">TECSUB Designer</span>
                    </div>
                    <div className="h-6 w-px bg-white/10 mx-2" />
                    <div className="flex items-center gap-3">
                        <select 
                            onChange={(e) => handleResize(e.target.value)}
                            className="bg-[#1e273d] text-[10px] font-bold px-2 py-1 rounded outline-none border border-white/10 cursor-pointer"
                        >
                            {PRESETS.map(p => <option key={p.name}>{p.name}</option>)}
                        </select>
                        <div className="flex gap-1">
                            {["T", "□", "△", "○"].map(icon => <button key={icon} className="w-8 h-8 hover:bg-white/10 rounded flex items-center justify-center text-sm">{icon}</button>)}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 bg-[#1e273d] hover:bg-white/10 rounded text-[10px] font-bold uppercase transition-all">JSON</button>
                    <button className="px-3 py-1.5 bg-[#1e273d] hover:bg-white/10 rounded text-[10px] font-bold uppercase transition-all">Open</button>
                    <div className="h-6 w-px bg-white/10 mx-2" />
                    <span className="text-[10px] font-bold opacity-50">100%</span>
                    <button onClick={downloadDesign} className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-bold uppercase tracking-widest transition-all">Download</button>
                    <div className="flex gap-1 ml-2">
                        <button className="w-8 h-8 bg-blue-600 hover:bg-blue-500 rounded flex items-center justify-center text-xs">Share</button>
                        <button className="w-8 h-8 bg-green-600 hover:bg-green-500 rounded flex items-center justify-center text-xs">WA</button>
                        <button className="w-8 h-8 bg-blue-700 hover:bg-blue-600 rounded flex items-center justify-center text-xs">FB</button>
                    </div>
                </div>
            </header>

            {/* ═══ MAIN EDITOR ═══ */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar */}
                <aside className="w-64 bg-[#141b2d] border-r border-white/5 flex flex-col p-4 space-y-8 overflow-y-auto scrollbar-none">
                    <section>
                        <h3 className="text-[9px] font-black uppercase tracking-[0.2em] mb-4 opacity-40">Icons (Iconify)</h3>
                        <div className="h-32 bg-white/5 rounded-lg border border-white/5 flex items-center justify-center opacity-20">No icons loaded</div>
                    </section>

                    <section>
                        <h3 className="text-[9px] font-black uppercase tracking-[0.2em] mb-4 opacity-40">Shapes</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {["rect", "circle", "triangle"].map(s => (
                                <button key={s} onClick={() => addShape(s)} className="aspect-square bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center border border-white/5 transition-all">
                                    <div className={`w-4 h-4 border-2 border-white/40 ${s === 'circle' ? 'rounded-full' : ''}`} />
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="flex-1">
                        <h3 className="text-[9px] font-black uppercase tracking-[0.2em] mb-4 opacity-40">Layers</h3>
                        <div className="space-y-1.5">
                            {layers.map((obj, i) => (
                                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/5 text-[9px] font-bold uppercase">
                                    <span className="opacity-30">#{layers.length - i}</span>
                                    <span className="text-red-500">{obj.type}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/10">
                        <button onClick={addText} className="py-2 bg-white/5 hover:bg-white/10 rounded text-[9px] font-bold uppercase tracking-widest">+ Text</button>
                        <button onClick={() => addShape("rect")} className="py-2 bg-white/5 hover:bg-white/10 rounded text-[9px] font-bold uppercase tracking-widest">+ Shape</button>
                        <button className="py-2 bg-white/5 hover:bg-white/10 rounded text-[9px] font-bold uppercase tracking-widest col-span-2">+ Image</button>
                        <button className="py-2 bg-white/5 hover:bg-white/10 rounded text-[9px] font-bold uppercase tracking-widest">Move Up</button>
                        <button className="py-2 bg-white/5 hover:bg-white/10 rounded text-[9px] font-bold uppercase tracking-widest">Move Down</button>
                        <button 
                            onClick={() => {
                                if (!canvas) return;
                                const activeObjects = canvas.getActiveObjects();
                                activeObjects.forEach((obj: any) => {
                                    obj.clone((cloned: any) => {
                                        cloned.set({ left: obj.left + 20, top: obj.top + 20 });
                                        canvas.add(cloned);
                                    });
                                });
                                canvas.discardActiveObject().renderAll();
                            }}
                            className="py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded text-[9px] font-bold uppercase tracking-widest"
                        >Duplicate</button>
                        <button 
                            onClick={() => { 
                                if (!canvas) return;
                                const activeObjects = canvas.getActiveObjects();
                                canvas.remove(...activeObjects);
                                canvas.discardActiveObject().renderAll();
                            }}
                            className="py-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded text-[9px] font-bold uppercase tracking-widest"
                        >Delete</button>
                    </div>
                </aside>

                {/* Canvas Area */}
                <main className="flex-1 relative flex flex-col items-center justify-center p-12 bg-[#0a0f1d] overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/checkerboard.png')] opacity-[0.03] pointer-events-none" />
                    <div className="relative shadow-[0_40px_100px_rgba(0,0,0,0.8)] rounded-sm bg-white overflow-hidden transition-all duration-300">
                        <canvas ref={canvasRef} />
                    </div>
                    <div className="mt-8 text-[9px] font-black tracking-widest uppercase opacity-30">{aspectRatio} View Mode</div>
                </main>

                {/* Right Sidebar */}
                <aside className="w-80 bg-[#141b2d] border-l border-white/5 flex flex-col p-6 space-y-8 overflow-y-auto scrollbar-none">
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-yellow-500">✨</span>
                            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">AI Design Assistant</h3>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <textarea placeholder="Describe your design..." className="w-full h-24 bg-transparent outline-none resize-none text-xs opacity-70 mb-4" />
                            <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">✨ Generate</button>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Background</h3>
                            <button onClick={() => setBgColor("#ffffff")} className="text-[9px] font-bold text-red-500 hover:underline">Clean</button>
                        </div>
                        <div className="grid grid-cols-5 gap-2 mb-4">
                            {["#dc2626", "#1e1b4b", "#166534", "#ea580c", "#ffffff", "#f97316", "#0ea5e9", "#4c1d95", "#991b1b", "#000000"].map(color => (
                                <button key={color} onClick={() => setBgColor(color)} className={`aspect-square rounded-md transition-all ${bgColor === color ? "scale-110 ring-2 ring-white/50" : "hover:scale-105"}`} style={{ backgroundColor: color }} />
                            ))}
                        </div>
                    </section>
                </aside>
            </div>

            <footer className="h-8 bg-[#dc2626] flex items-center px-4 justify-between z-50">
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black italic tracking-tighter">Online</span>
                    <span className="text-[9px] font-bold text-white/70">Canvas: Active</span>
                </div>
                <div className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em]">TECSUB Designer Engine v2.0.4</div>
            </footer>

            <style jsx global>{`
                .canvas-container { margin: 0 auto !important; box-shadow: 0 0 50px rgba(0,0,0,0.3); }
                ::-webkit-scrollbar { width: 0px; background: transparent; }
            `}</style>
        </div>
    );
}
