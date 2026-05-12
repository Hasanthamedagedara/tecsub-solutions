"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
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

/* ─── Category Config ─── */
const categories = [
    { id: "all", label: "All Tools", icon: "🔲" },
    { id: "Text", label: "Text & Writing", icon: "✏️" },
    { id: "Developer", label: "Development", icon: "💻" },
    { id: "Image", label: "Media", icon: "🖼️" },
    { id: "Design", label: "Design", icon: "🎨" },
    { id: "Document", label: "Document", icon: "📄" },
    { id: "Security", label: "Security", icon: "🔒" },
    { id: "Calculator", label: "Math", icon: "📐" },
    { id: "Utility", label: "Utilities", icon: "⚙️" },
];

const categoryColors: Record<string, string> = {
    Text: "#FF6B6B", Developer: "#00E5FF", Image: "#FFD93D", Design: "#C084FC",
    Calculator: "#4ADE80", Document: "#F97316", Security: "#38BDF8", Utility: "#818CF8",
};

/* ─── Tag generator ─── */
const getToolTags = (tool: { title: string; category: string; description: string }): string[] => {
    const tags: string[] = [tool.category];
    const lower = (tool.title + " " + tool.description).toLowerCase();
    if (lower.includes("pdf")) tags.push("PDF");
    if (lower.includes("image") || lower.includes("compress")) tags.push("Image");
    if (lower.includes("text") || lower.includes("case")) tags.push("Text");
    if (lower.includes("code") || lower.includes("json") || lower.includes("regex") || lower.includes("base64")) tags.push("Code");
    if (lower.includes("password") || lower.includes("security")) tags.push("Security");
    if (lower.includes("qr")) tags.push("QR");
    if (lower.includes("color") || lower.includes("gradient") || lower.includes("css")) tags.push("CSS");
    if (lower.includes("convert")) tags.push("Converter");
    if (lower.includes("singlish") || lower.includes("sinhala")) tags.push("Sinhala", "Unicode", "Font");
    if (lower.includes("markdown")) tags.push("Markdown");
    if (lower.includes("unit")) tags.push("Math");
    return [...new Set(tags)];
};

export default function OnlineToolsPage() {
    const router = useRouter();
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    /* File handling (Android bridge) */
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
                // @ts-expect-error global TecsubApp
                if (window.TecsubApp && window.TecsubApp.getFileContent) {
                    try {
                        // @ts-expect-error global TecsubApp
                        const base64Data = window.TecsubApp.getFileContent(fileParam);
                        if (base64Data) {
                            setFileData(base64Data);
                            setIsPdf(fileParam.toLowerCase().endsWith(".pdf") || base64Data.startsWith("JVBERi0"));
                        } else {
                            setFileError("Failed to read file data. Please try again.");
                        }
                    } catch {
                        setFileError("Error reading file via bridge.");
                    }
                } else {
                    setFileError("App bridge not found. Make sure you are using the Tecsub Android App to open this file.");
                }
            }
        }
    }, []);

    /* Filtered tools */
    const filteredTools = useMemo(() => {
        return onlineTools.filter((tool) => {
            const matchCategory = activeCategory === "all" || tool.category === activeCategory;
            const matchSearch = searchQuery === "" ||
                tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tool.category.toLowerCase().includes(searchQuery.toLowerCase());
            return matchCategory && matchSearch;
        });
    }, [activeCategory, searchQuery]);

    /* ─── File Hub Render ─── */
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
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{fileError}</div>
                        ) : !fileData ? (
                            <div className="p-4 text-sm text-cyan-400 animate-pulse font-medium">Reading file data securely from Android...</div>
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
                            </div>
                        )}
                        <button onClick={() => window.location.href = '/tools'} className="text-xs hover:underline mt-6 block mx-auto transition-colors" style={{ color: "var(--text-secondary)" }}>
                            Close &amp; Return to Tools
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }



    /* ─── Main Tools Page ─── */
    return (
        <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
            <Navbar />
            <div className="pt-24 sm:pt-28">
                <div className="kdj-tools-layout">

                    {/* Main Content */}
                    <main className="kdj-tools-main">
                        {/* Search Bar */}
                        <div className="kdj-tools-search-wrap" style={{ marginBottom: "24px" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="kdj-tools-search-icon">
                                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            </svg>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search tools by name, category, or tags..."
                                className="kdj-tools-search-input"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery("")} className="kdj-tools-search-clear">✕</button>
                            )}
                        </div>

                        {/* Category Tabs */}
                        <div className="kdj-tools-categories">
                            <div className="kdj-tools-categories-scroll">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={`kdj-tools-cat-btn ${activeCategory === cat.id ? "active" : ""}`}
                                    >
                                        <span className="kdj-tools-cat-icon">{cat.icon}</span>
                                        <span className="kdj-tools-cat-label">{cat.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Active Tool Panel (if selected) */}
                        <AnimatePresence mode="wait">
                            {activeTool && (
                                <motion.div
                                    key={activeTool}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="kdj-tool-panel"
                                    style={{ marginBottom: "24px" }}
                                >
                                    <div className="kdj-tool-panel-header">
                                        <h2 className="kdj-tool-panel-title">{activeTool}</h2>
                                        <button onClick={() => setActiveTool(null)} className="kdj-tool-panel-close">✕</button>
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

                        {/* Tools Grid */}
                        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
                            {filteredTools.map((tool, i) => {
                                const color = categoryColors[tool.category] || "#00E5FF";
                                const tags = getToolTags(tool);
                                const isActive = activeTool === tool.title;
                                return (
                                    <motion.button
                                        key={tool.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.03, duration: 0.4 }}
                                        onClick={() => {
                                            if (tool.href) {
                                                router.push(tool.href);
                                            } else {
                                                setActiveTool(isActive ? null : tool.title);
                                            }
                                        }}
                                        className={`kdj-tool-card ${isActive ? "active" : ""}`}
                                        style={{
                                            // @ts-expect-error css var
                                            "--tool-accent": color,
                                        }}
                                    >
                                        <div className="kdj-tool-card-header">
                                            <div className="kdj-tool-card-icon" style={{ background: `${color}15`, color }}>
                                                {tool.icon}
                                            </div>
                                            {isActive && (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" className="kdj-tool-card-arrow">
                                                    <path d="M5 12h14"/><path d="M12 5l7 7-7 7"/>
                                                </svg>
                                            )}
                                        </div>
                                        <h3 className="kdj-tool-card-title">{tool.title}</h3>
                                        <p className="kdj-tool-card-desc">{tool.description}</p>
                                        <div className="kdj-tool-card-tags">
                                            {tags.slice(0, 3).map((tag) => (
                                                <span key={tag} className="kdj-tool-card-tag">{tag}</span>
                                            ))}
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {filteredTools.length === 0 && (
                            <div className="text-center py-16">
                                <p className="text-4xl mb-3">🔍</p>
                                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No tools found matching your search.</p>
                            </div>
                        )}

                        <AdPlacement format="banner" />
                    </main>
                </div>

                <Footer />
            </div>
        </div>
    );
}
