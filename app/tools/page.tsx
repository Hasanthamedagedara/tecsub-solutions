"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdPlacement from "@/components/AdPlacement";
import { onlineTools } from "@/data/product";
import PdfEditorTool from "@/components/PdfEditorTool";

/* ─── Inline Tool Components ─── */

function TextCaseConverter() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const convert = (mode: string) => {
        let r = input;
        if (mode === "upper") r = input.toUpperCase();
        else if (mode === "lower") r = input.toLowerCase();
        else if (mode === "title") r = input.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
        else if (mode === "sentence") r = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
        else if (mode === "reverse") r = input.split("").reverse().join("");
        setOutput(r);
    };
    return (
        <div className="space-y-4">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter your text here..." rows={4} className="tool-input" />
            <div className="flex flex-wrap gap-2">
                {["upper", "lower", "title", "sentence", "reverse"].map((m) => (
                    <button key={m} onClick={() => convert(m)} className="tool-btn">{m.charAt(0).toUpperCase() + m.slice(1)}</button>
                ))}
            </div>
            {output && <textarea value={output} readOnly rows={4} className="tool-input" />}
            {output && <button onClick={() => navigator.clipboard.writeText(output)} className="tool-btn-primary">📋 Copy</button>}
        </div>
    );
}

function JsonFormatter() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");
    const format = () => { try { setError(""); setOutput(JSON.stringify(JSON.parse(input), null, 2)); } catch (e: unknown) { setError(e instanceof Error ? e.message : "Invalid JSON"); setOutput(""); } };
    const minify = () => { try { setError(""); setOutput(JSON.stringify(JSON.parse(input))); } catch (e: unknown) { setError(e instanceof Error ? e.message : "Invalid JSON"); setOutput(""); } };
    return (
        <div className="space-y-4">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder='Paste JSON here... e.g. {"key":"value"}' rows={5} className="tool-input font-mono text-xs" />
            <div className="flex gap-2">
                <button onClick={format} className="tool-btn-primary">✨ Format</button>
                <button onClick={minify} className="tool-btn">📦 Minify</button>
            </div>
            {error && <p className="text-red-400 text-xs">❌ {error}</p>}
            {output && (
                <>
                    <pre className="tool-input font-mono text-xs overflow-x-auto whitespace-pre" style={{ maxHeight: "200px" }}>{output}</pre>
                    <button onClick={() => navigator.clipboard.writeText(output)} className="tool-btn">📋 Copy</button>
                </>
            )}
        </div>
    );
}

function PasswordGenerator() {
    const [length, setLength] = useState(16);
    const [pw, setPw] = useState("");
    const [options, setOptions] = useState({ upper: true, lower: true, numbers: true, symbols: true });
    const generate = () => {
        let chars = "";
        if (options.upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (options.lower) chars += "abcdefghijklmnopqrstuvwxyz";
        if (options.numbers) chars += "0123456789";
        if (options.symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
        if (!chars) chars = "abcdefghijklmnopqrstuvwxyz";
        let result = "";
        for (let i = 0; i < length; i++) result += chars[Math.floor(Math.random() * chars.length)];
        setPw(result);
    };
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <label className="text-xs" style={{ color: "var(--text-secondary)" }}>Length: {length}</label>
                <input type="range" min={4} max={64} value={length} onChange={(e) => setLength(+e.target.value)} className="flex-1" />
            </div>
            <div className="flex flex-wrap gap-3">
                {Object.entries(options).map(([key, val]) => (
                    <label key={key} className="flex items-center gap-1.5 text-xs cursor-pointer" style={{ color: "var(--text-secondary)" }}>
                        <input type="checkbox" checked={val} onChange={(e) => setOptions({ ...options, [key]: e.target.checked })} />
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                ))}
            </div>
            <button onClick={generate} className="tool-btn-primary w-full">🔐 Generate Password</button>
            {pw && (
                <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: "rgba(0,0,0,0.3)" }}>
                    <code className="flex-1 text-sm font-mono break-all" style={{ color: "#4ADE80" }}>{pw}</code>
                    <button onClick={() => navigator.clipboard.writeText(pw)} className="tool-btn text-xs flex-shrink-0">📋</button>
                </div>
            )}
        </div>
    );
}

function QRCodeGenerator() {
    const [text, setText] = useState("");
    const [qr, setQr] = useState("");
    const generate = () => { if (text) setQr(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(text)}`); };
    return (
        <div className="space-y-4">
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text or URL..." className="tool-input" />
            <button onClick={generate} className="tool-btn-primary w-full">📱 Generate QR Code</button>
            {qr && <div className="text-center p-4 rounded-lg bg-white"><img src={qr} alt="QR" className="mx-auto" style={{ maxWidth: "200px" }} /></div>}
        </div>
    );
}

function Base64Tool() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    return (
        <div className="space-y-4">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text to encode/decode..." rows={3} className="tool-input" />
            <div className="flex gap-2">
                <button onClick={() => setOutput(btoa(input))} className="tool-btn-primary">🔒 Encode</button>
                <button onClick={() => { try { setOutput(atob(input)); } catch { setOutput("Invalid Base64"); } }} className="tool-btn">🔓 Decode</button>
            </div>
            {output && <textarea value={output} readOnly rows={3} className="tool-input" />}
            {output && <button onClick={() => navigator.clipboard.writeText(output)} className="tool-btn">📋 Copy</button>}
        </div>
    );
}

function PlaceholderTool({ name }: { name: string }) {
    return (
        <div className="text-center py-8">
            <p className="text-3xl mb-3">🛠️</p>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{name}</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>Full tool available in the homepage section.</p>
        </div>
    );
}

/* ─── Tool Registry ─── */
const toolComponents: Record<string, () => JSX.Element> = {
    "Text Case Converter": TextCaseConverter,
    "JSON Formatter": JsonFormatter,
    "Password Generator": PasswordGenerator,
    "QR Code Generator": QRCodeGenerator,
    "Base64 Encoder/Decoder": Base64Tool,
    "PDF Editor": PdfEditorTool,
};

/* ─── Category Colors ─── */
const categoryColors: Record<string, string> = {
    Text: "#FF6B6B", Developer: "#00E5FF", Image: "#FFD93D", Design: "#C084FC",
    Calculator: "#4ADE80", Document: "#F97316", Security: "#38BDF8",
};

export default function OnlineToolsPage() {
    const [activeTool, setActiveTool] = useState<string | null>(null);

    // File Handling State
    const [fileUri, setFileUri] = useState<string | null>(null);
    const [fileData, setFileData] = useState<string | null>(null);
    const [fileError, setFileError] = useState<string | null>(null);
    const [showHub, setShowHub] = useState<boolean>(true);
    const [isPdf, setIsPdf] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            const fileParam = urlParams.get('file');
            if (fileParam) {
                setFileUri(fileParam);
                // Attempt to read file data via bridge
                // @ts-expect-error global TecsubApp
                if (window.TecsubApp && window.TecsubApp.getFileContent) {
                    try {
                        // @ts-expect-error global TecsubApp
                        const base64Data = window.TecsubApp.getFileContent(fileParam);
                        if (base64Data) {
                            setFileData(base64Data);
                            // Simple heuristic: if URI ends in .pdf or if base64 starts with JVBERi0 (which is "%PDF-")
                            setIsPdf(fileParam.toLowerCase().endsWith(".pdf") || base64Data.startsWith("JVBERi0"));
                        } else {
                            setFileError("Failed to read file data. Please try again.");
                        }
                    } catch (e) {
                        setFileError("Error reading file via bridge.");
                    }
                } else {
                    setFileError("App bridge not found. Make sure you are using the Tecsub Android App to open this file.");
                }
            }
        }
    }, []);

    // ─── Render Productivity Hub if file opened ───
    if (fileUri && showHub) {
        return (
            <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-primary)" }}>
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-4 pt-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-md w-full p-8 rounded-3xl text-center space-y-6 relative"
                        style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(0,229,255,0.2)" }}
                    >
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-cyan-500/10 blur-[60px] rounded-full pointer-events-none -z-10" />

                        <div className="text-6xl mb-4">✨</div>
                        <h1 className="font-bebas text-4xl sm:text-5xl gradient-text mb-2">TECSUB PRODUCTIVITY HUB</h1>
                        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                            You opened a file from your device. What would you like to do?
                        </p>

                        <div className="text-left bg-black/40 p-3 rounded-lg border border-white/10 text-xs overflow-hidden text-ellipsis mb-6 text-white/70 font-mono break-all">
                            {fileUri}
                        </div>

                        {fileError ? (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                                {fileError}
                            </div>
                        ) : !fileData ? (
                            <div className="p-4 text-sm text-cyan-400 animate-pulse font-medium">
                                Reading file data securely from Android...
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {isPdf && (
                                    <button onClick={() => { setShowHub(false); setActiveTool("PDF Editor"); }} className="tool-btn-primary w-full py-4 flex items-center justify-center gap-3 text-sm">
                                        <span className="text-xl">✏️</span> Edit PDF Content
                                    </button>
                                )}
                                <button className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all text-sm hover:bg-white/10" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}>
                                    <span className="text-xl">🌐</span> Translate
                                </button>
                                <button className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all text-sm hover:bg-white/10" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}>
                                    <span className="text-xl">📤</span> Share to Feed
                                </button>
                            </div>
                        )}

                        <button onClick={() => window.location.href = '/tools'} className="text-xs hover:underline mt-6 block mx-auto transition-colors" style={{ color: "var(--text-secondary)" }}>
                            Close & Return to Tools
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
            <Navbar />
            <div className="pt-24 sm:pt-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                    {/* Hero */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                        <h1 className="font-bebas text-5xl sm:text-7xl gradient-text leading-[0.95] mb-4">
                            🛠️ ONLINE TOOLS
                        </h1>
                        <p className="text-sm sm:text-base max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
                            Free browser-based tools for developers, designers, and creators. No sign-up required.
                        </p>
                    </motion.div>

                    {/* Tools Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                        {onlineTools.map((tool, i) => {
                            const color = categoryColors[tool.category] || "#00E5FF";
                            return (
                                <motion.button
                                    key={tool.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04, duration: 0.4 }}
                                    onClick={() => setActiveTool(activeTool === tool.name ? null : tool.name)}
                                    className={`text-left rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] ${activeTool === tool.name ? "ring-2" : ""}`}
                                    style={{
                                        background: activeTool === tool.name ? `${color}08` : "rgba(0,0,0,0.3)",
                                        border: `1px solid ${activeTool === tool.name ? `${color}40` : "rgba(255,255,255,0.06)"}`,
                                        // @ts-expect-error ring color
                                        "--tw-ring-color": color,
                                    }}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: `${color}15` }}>
                                            {tool.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xs" style={{ color: "var(--text-primary)" }}>{tool.name}</h3>
                                            <span className="text-[9px] font-semibold uppercase" style={{ color }}>{tool.category}</span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] line-clamp-2" style={{ color: "var(--text-secondary)" }}>{tool.desc}</p>
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Active Tool Panel — Full Width */}
                    <AnimatePresence mode="wait">
                        {activeTool && (
                            <motion.div
                                key={activeTool}
                                initial={{ opacity: 0, y: 20, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, y: -10, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="rounded-3xl overflow-hidden"
                                style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(0,229,255,0.1)" }}
                            >
                                <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                    <h2 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                                        {activeTool}
                                    </h2>
                                    <button
                                        onClick={() => setActiveTool(null)}
                                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all text-xs"
                                        style={{ color: "var(--text-secondary)" }}
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="p-6">
                                    {activeTool === "PDF Editor" && fileData ? (
                                        <PdfEditorTool initialBase64Pdf={fileData} initialFileName={fileUri?.split('/').pop() || "Document.pdf"} />
                                    ) : toolComponents[activeTool] ? (
                                        toolComponents[activeTool]()
                                    ) : (
                                        <PlaceholderTool name={activeTool} />
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                {/* ─── Ad: Banner ─── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
                    <AdPlacement format="banner" />
                </div>

                <Footer />
            </div>
        </div>
    );
}
