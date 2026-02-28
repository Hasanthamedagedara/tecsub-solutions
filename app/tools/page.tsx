"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdPlacement from "@/components/AdPlacement";
import { onlineTools } from "@/data/product";

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
};

/* ─── Category Colors ─── */
const categoryColors: Record<string, string> = {
    Text: "#FF6B6B", Developer: "#00E5FF", Image: "#FFD93D", Design: "#C084FC",
    Calculator: "#4ADE80", Document: "#F97316", Security: "#38BDF8",
};

export default function OnlineToolsPage() {
    const [activeTool, setActiveTool] = useState<string | null>(null);

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
                                    {toolComponents[activeTool]
                                        ? toolComponents[activeTool]()
                                        : <PlaceholderTool name={activeTool} />
                                    }
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
