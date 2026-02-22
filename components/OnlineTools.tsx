"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { onlineTools } from "@/data/product";
import { useAppContext } from "@/components/ThemeProvider";
import { t } from "@/data/translations";

/* ─── Tool Logic Functions ─── */

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
            {output && <button onClick={() => { navigator.clipboard.writeText(output); }} className="tool-btn-primary">📋 Copy</button>}
        </div>
    );
}

function JsonFormatter() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");
    const format = () => {
        try {
            setError("");
            setOutput(JSON.stringify(JSON.parse(input), null, 2));
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Invalid JSON");
            setOutput("");
        }
    };
    const minify = () => {
        try {
            setError("");
            setOutput(JSON.stringify(JSON.parse(input)));
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Invalid JSON");
            setOutput("");
        }
    };
    return (
        <div className="space-y-4">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder='Paste JSON here... e.g. {"name":"test"}' rows={5} className="tool-input font-mono text-xs" />
            <div className="flex gap-2">
                <button onClick={format} className="tool-btn-primary">Format</button>
                <button onClick={minify} className="tool-btn">Minify</button>
            </div>
            {error && <p className="text-red-400 text-xs">❌ {error}</p>}
            {output && <pre className="tool-input font-mono text-xs overflow-x-auto whitespace-pre">{output}</pre>}
        </div>
    );
}

function Base64Tool() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const encode = () => { try { setOutput(btoa(input)); } catch { setOutput("Error encoding"); } };
    const decode = () => { try { setOutput(atob(input)); } catch { setOutput("Invalid Base64 string"); } };
    return (
        <div className="space-y-4">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text or Base64 string..." rows={4} className="tool-input" />
            <div className="flex gap-2">
                <button onClick={encode} className="tool-btn-primary">Encode</button>
                <button onClick={decode} className="tool-btn">Decode</button>
            </div>
            {output && <textarea value={output} readOnly rows={4} className="tool-input" />}
            {output && <button onClick={() => navigator.clipboard.writeText(output)} className="tool-btn">📋 Copy</button>}
        </div>
    );
}

function PasswordGenerator() {
    const [length, setLength] = useState(16);
    const [includeUpper, setIncludeUpper] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [password, setPassword] = useState("");
    const generate = () => {
        let chars = "abcdefghijklmnopqrstuvwxyz";
        if (includeUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (includeNumbers) chars += "0123456789";
        if (includeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
        let pw = "";
        for (let i = 0; i < length; i++) pw += chars[Math.floor(Math.random() * chars.length)];
        setPassword(pw);
    };
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <label className="text-xs" style={{ color: "var(--text-secondary)" }}>Length: {length}</label>
                <input type="range" min={8} max={64} value={length} onChange={(e) => setLength(+e.target.value)} className="flex-1 accent-[#00E5FF]" />
            </div>
            <div className="flex flex-wrap gap-3">
                {[{ label: "Uppercase", val: includeUpper, set: setIncludeUpper }, { label: "Numbers", val: includeNumbers, set: setIncludeNumbers }, { label: "Symbols", val: includeSymbols, set: setIncludeSymbols }].map((o) => (
                    <label key={o.label} className="flex items-center gap-1.5 text-xs cursor-pointer" style={{ color: "var(--text-secondary)" }}>
                        <input type="checkbox" checked={o.val} onChange={() => o.set(!o.val)} className="accent-[#00E5FF]" /> {o.label}
                    </label>
                ))}
            </div>
            <button onClick={generate} className="tool-btn-primary w-full">🔑 Generate Password</button>
            {password && (
                <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: "rgba(0,0,0,0.4)" }}>
                    <code className="flex-1 text-sm font-mono break-all" style={{ color: "var(--text-primary)" }}>{password}</code>
                    <button onClick={() => navigator.clipboard.writeText(password)} className="tool-btn text-xs px-3 py-1.5">Copy</button>
                </div>
            )}
        </div>
    );
}

function QRCodeGenerator() {
    const [text, setText] = useState("");
    const qrUrl = text ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}` : "";
    return (
        <div className="space-y-4">
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter URL or text..." className="tool-input" />
            {qrUrl && (
                <div className="flex flex-col items-center gap-3">
                    <img src={qrUrl} alt="QR Code" className="w-48 h-48 rounded-lg bg-white p-2" />
                    <a href={qrUrl} download="qrcode.png" className="tool-btn-primary text-xs">⬇️ Download QR</a>
                </div>
            )}
        </div>
    );
}

function MarkdownEditor() {
    const [md, setMd] = useState("# Hello World\n\nType **markdown** here...\n\n- Item 1\n- Item 2\n\n> Blockquote");
    const renderMd = (text: string) => {
        return text
            .replace(/^### (.+)$/gm, '<h3 style="font-size:16px;font-weight:bold;margin:8px 0">$1</h3>')
            .replace(/^## (.+)$/gm, '<h2 style="font-size:20px;font-weight:bold;margin:8px 0">$1</h2>')
            .replace(/^# (.+)$/gm, '<h1 style="font-size:24px;font-weight:bold;margin:8px 0">$1</h1>')
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
            .replace(/\*(.+?)\*/g, "<em>$1</em>")
            .replace(/`(.+?)`/g, '<code style="background:rgba(0,229,255,0.1);padding:2px 6px;border-radius:4px;font-size:12px">$1</code>')
            .replace(/^> (.+)$/gm, '<blockquote style="border-left:3px solid #00E5FF;padding-left:12px;margin:8px 0;opacity:0.8">$1</blockquote>')
            .replace(/^- (.+)$/gm, '<li style="margin-left:16px;list-style:disc">$1</li>')
            .replace(/\n/g, "<br/>");
    };
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <textarea value={md} onChange={(e) => setMd(e.target.value)} rows={10} className="tool-input font-mono text-xs" />
            <div className="tool-input overflow-y-auto text-sm" style={{ minHeight: "200px" }} dangerouslySetInnerHTML={{ __html: renderMd(md) }} />
        </div>
    );
}

function UnitConverter() {
    const [value, setValue] = useState("");
    const [fromUnit, setFromUnit] = useState("km");
    const [toUnit, setToUnit] = useState("mi");
    const conversions: Record<string, number> = { km: 1, mi: 1.60934, m: 0.001, ft: 0.0003048, cm: 0.00001, inch: 0.0000254, kg: 1, lb: 0.453592, oz: 0.0283495, g: 0.001, c: 1, f: 1 };
    const units = Object.keys(conversions);
    const convert = () => {
        const v = parseFloat(value);
        if (isNaN(v)) return "—";
        if ((fromUnit === "c" && toUnit === "f")) return ((v * 9 / 5) + 32).toFixed(2) + " °F";
        if ((fromUnit === "f" && toUnit === "c")) return ((v - 32) * 5 / 9).toFixed(2) + " °C";
        const baseValue = v * conversions[fromUnit];
        return (baseValue / conversions[toUnit]).toFixed(4);
    };
    return (
        <div className="space-y-4">
            <input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter value..." className="tool-input" />
            <div className="grid grid-cols-2 gap-3">
                <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="tool-input">{units.map((u) => <option key={u} value={u}>{u.toUpperCase()}</option>)}</select>
                <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="tool-input">{units.map((u) => <option key={u} value={u}>{u.toUpperCase()}</option>)}</select>
            </div>
            {value && <div className="p-3 rounded-lg text-center font-bold text-lg text-tecsubCyan" style={{ background: "rgba(0,0,0,0.3)" }}>{convert()}</div>}
        </div>
    );
}

function ColorPaletteGenerator() {
    const [colors, setColors] = useState<string[]>([]);
    const generate = () => {
        const palette = Array.from({ length: 5 }, () => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"));
        setColors(palette);
    };
    return (
        <div className="space-y-4">
            <button onClick={generate} className="tool-btn-primary w-full">🎨 Generate Palette</button>
            {colors.length > 0 && (
                <div className="flex rounded-xl overflow-hidden h-24">
                    {colors.map((c, i) => (
                        <button key={i} onClick={() => { navigator.clipboard.writeText(c); }} className="flex-1 flex items-end justify-center pb-2 hover:opacity-90 transition-opacity" style={{ background: c }} title={`Click to copy ${c}`}>
                            <span className="text-[10px] font-mono font-bold px-1 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.5)", color: "#fff" }}>{c}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function CssGradientMaker() {
    const [c1, setC1] = useState("#00E5FF");
    const [c2, setC2] = useState("#0072BC");
    const [angle, setAngle] = useState(135);
    const css = `background: linear-gradient(${angle}deg, ${c1}, ${c2});`;
    return (
        <div className="space-y-4">
            <div className="h-32 rounded-xl" style={{ background: `linear-gradient(${angle}deg, ${c1}, ${c2})` }} />
            <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2"><input type="color" value={c1} onChange={(e) => setC1(e.target.value)} className="w-8 h-8 rounded cursor-pointer" /><span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>{c1}</span></div>
                <div className="flex items-center gap-2"><input type="color" value={c2} onChange={(e) => setC2(e.target.value)} className="w-8 h-8 rounded cursor-pointer" /><span className="text-xs font-mono" style={{ color: "var(--text-secondary)" }}>{c2}</span></div>
            </div>
            <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Angle: {angle}°</span>
                <input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(+e.target.value)} className="flex-1 accent-[#00E5FF]" />
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: "rgba(0,0,0,0.4)" }}>
                <code className="flex-1 text-xs font-mono" style={{ color: "var(--text-primary)" }}>{css}</code>
                <button onClick={() => navigator.clipboard.writeText(css)} className="tool-btn text-xs px-3 py-1">Copy</button>
            </div>
        </div>
    );
}

function RegexTester() {
    const [pattern, setPattern] = useState("");
    const [flags, setFlags] = useState("gi");
    const [testStr, setTestStr] = useState("");
    const [matches, setMatches] = useState<string[]>([]);
    const [error, setError] = useState("");
    const test = () => {
        try {
            setError("");
            const re = new RegExp(pattern, flags);
            const found = testStr.match(re) || [];
            setMatches(found);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Invalid regex");
            setMatches([]);
        }
    };
    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <input type="text" value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="Regex pattern..." className="tool-input flex-1 font-mono" />
                <input type="text" value={flags} onChange={(e) => setFlags(e.target.value)} placeholder="Flags" className="tool-input w-16 font-mono text-center" />
            </div>
            <textarea value={testStr} onChange={(e) => setTestStr(e.target.value)} placeholder="Test string..." rows={3} className="tool-input" />
            <button onClick={test} className="tool-btn-primary w-full">Test Regex</button>
            {error && <p className="text-red-400 text-xs">❌ {error}</p>}
            {matches.length > 0 && (
                <div className="p-3 rounded-lg space-y-1" style={{ background: "rgba(0,0,0,0.3)" }}>
                    <p className="text-xs text-tecsubCyan font-semibold">{matches.length} match{matches.length > 1 ? "es" : ""}</p>
                    {matches.map((m, i) => <p key={i} className="text-xs font-mono" style={{ color: "var(--text-primary)" }}>• {m}</p>)}
                </div>
            )}
        </div>
    );
}

function ImageCompressor() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [quality, setQuality] = useState(70);
    const [compressed, setCompressed] = useState("");
    const [sizes, setSizes] = useState({ original: 0, compressed: 0 });

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f) {
            setFile(f);
            setCompressed("");
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(f);
        }
    };

    const compress = () => {
        if (!file || !preview) return;
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL("image/jpeg", quality / 100);
            setCompressed(dataUrl);
            setSizes({ original: file.size, compressed: Math.round((dataUrl.length * 3) / 4) });
        };
        img.src = preview;
    };

    return (
        <div className="space-y-4">
            <input type="file" accept="image/*" onChange={handleFile} className="tool-input text-xs" />
            {preview && (
                <>
                    <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>Quality: {quality}%</span>
                        <input type="range" min={10} max={100} value={quality} onChange={(e) => setQuality(+e.target.value)} className="flex-1 accent-[#00E5FF]" />
                    </div>
                    <button onClick={compress} className="tool-btn-primary w-full">🖼️ Compress</button>
                </>
            )}
            {compressed && (
                <div className="space-y-2">
                    <div className="flex justify-between text-xs" style={{ color: "var(--text-secondary)" }}>
                        <span>Original: {(sizes.original / 1024).toFixed(1)} KB</span>
                        <span>Compressed: {(sizes.compressed / 1024).toFixed(1)} KB</span>
                        <span className="text-green-400">-{(100 - (sizes.compressed / sizes.original) * 100).toFixed(0)}%</span>
                    </div>
                    <a href={compressed} download="compressed.jpg" className="tool-btn-primary block text-center">⬇️ Download</a>
                </div>
            )}
        </div>
    );
}

function PdfTool() {
    return (
        <div className="text-center py-8">
            <p className="text-3xl mb-3">📄</p>
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>PDF Merger & Splitter</p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Coming soon — requires server-side processing.</p>
        </div>
    );
}

/* ─── Tool Registry ─── */
const toolComponents: Record<string, () => JSX.Element> = {
    "Text Case Converter": TextCaseConverter,
    "JSON Formatter": JsonFormatter,
    "Image Compressor": ImageCompressor,
    "Color Palette Generator": ColorPaletteGenerator,
    "Base64 Encoder/Decoder": Base64Tool,
    "Unit Converter": UnitConverter,
    "PDF Merger & Splitter": PdfTool,
    "Password Generator": PasswordGenerator,
    "QR Code Generator": QRCodeGenerator,
    "Markdown Editor": MarkdownEditor,
    "CSS Gradient Maker": CssGradientMaker,
    "Regex Tester": RegexTester,
};

/* ─── Main Component ─── */
export default function OnlineTools() {
    const { language } = useAppContext();
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [activeTool, setActiveTool] = useState<string | null>(null);

    const categoryColors: Record<string, string> = {
        Text: "#FF6B6B",
        Developer: "#00E5FF",
        Image: "#FFD93D",
        Design: "#C084FC",
        Calculator: "#4ADE80",
        Document: "#F97316",
        Security: "#EF4444",
        Utility: "#38BDF8",
    };

    const ActiveToolComponent = activeTool ? toolComponents[activeTool] : null;

    return (
        <>
            <motion.section
                id="tools"
                ref={ref}
                initial={{ opacity: 0, y: 60 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
            >
                <div className="mb-12 sm:mb-16">
                    <h2 className="font-bebas text-4xl sm:text-6xl md:text-7xl gradient-text leading-[0.95]">
                        {t(language, "section_tools")}
                    </h2>
                    <p className="mt-3 text-base sm:text-lg max-w-xl font-light" style={{ color: "var(--text-secondary)" }}>
                        {t(language, "section_tools_sub")}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {onlineTools.map((tool, i) => (
                        <motion.button
                            key={tool.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: i * 0.06 }}
                            onClick={() => setActiveTool(tool.title)}
                            className="glass-panel p-5 card-hover cursor-pointer group relative text-left"
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold flex-shrink-0"
                                    style={{ background: `${categoryColors[tool.category] || "#888"}20`, color: categoryColors[tool.category] || "#888" }}
                                >
                                    {tool.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <span
                                        className="text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full"
                                        style={{ background: `${categoryColors[tool.category] || "#888"}15`, color: categoryColors[tool.category] || "#888" }}
                                    >
                                        {tool.category}
                                    </span>
                                    <h3
                                        className="font-bebas text-lg tracking-wide mt-1.5 mb-1"
                                        style={{ color: "var(--text-primary)" }}
                                    >
                                        {tool.title}
                                    </h3>
                                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                                        {tool.description}
                                    </p>
                                </div>
                            </div>
                            {/* Click hint */}
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[9px] px-2 py-1 rounded-full bg-tecsubCyan/10 text-tecsubCyan font-semibold">Open →</span>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-px rounded-b-xl bg-gradient-to-r from-transparent via-tecsubCyan/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </motion.button>
                    ))}
                </div>
            </motion.section>

            {/* ═══════════ Tool Modal ═══════════ */}
            <AnimatePresence>
                {activeTool && ActiveToolComponent && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
                            onClick={() => setActiveTool(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-4 sm:inset-8 md:inset-12 lg:inset-x-auto lg:inset-y-12 lg:max-w-2xl lg:mx-auto z-[101] overflow-y-auto"
                            style={{
                                background: "rgba(10,10,11,0.97)",
                                backdropFilter: "blur(24px)",
                                border: "1px solid rgba(0,229,255,0.1)",
                                borderRadius: "1.25rem",
                            }}
                        >
                            <div className="p-5 sm:p-8">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="font-bebas text-2xl sm:text-3xl tracking-wide" style={{ color: "var(--text-primary)" }}>
                                        {activeTool}
                                    </h2>
                                    <button
                                        onClick={() => setActiveTool(null)}
                                        className="w-9 h-9 rounded-lg flex items-center justify-center border border-white/10 hover:border-red-500/50 hover:text-red-400 transition-colors text-sm"
                                        style={{ color: "var(--text-secondary)" }}
                                    >
                                        ✕
                                    </button>
                                </div>
                                {/* Tool Content */}
                                <ActiveToolComponent />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
