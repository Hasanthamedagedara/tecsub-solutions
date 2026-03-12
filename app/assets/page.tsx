"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ─── Types ─── */
interface AIAsset {
    id: string;
    name: string;
    category: string;
    priceUSD: number;
    priceLKR: number;
    description: string;
    features: string[];
    icon: string;
    color: string;
    period: string;
}

/* ─── Data ─── */
const DEFAULT_ASSETS: AIAsset[] = [
    {
        id: "a-suno",
        name: "Suno AI Premium",
        category: "AI Music",
        priceUSD: 10,
        priceLKR: 3000,
        description: "Generate professional-quality music with AI. Unlimited songs, custom lyrics, and studio-quality audio output.",
        features: ["Unlimited Songs", "Custom Lyrics", "Studio Quality", "All Genres", "Commercial License"],
        icon: "🎶",
        color: "#FF6B6B",
        period: "Monthly",
    },
    {
        id: "a-gemini",
        name: "Google Gemini Advanced",
        category: "AI Assistant",
        priceUSD: 10,
        priceLKR: 3000,
        description: "Access Gemini Ultra 1.5 with 1M token context, multimodal reasoning, code generation, and Google ecosystem integration.",
        features: ["Gemini Ultra", "1M Context", "Multimodal", "Code Gen", "Google Integration"],
        icon: "💎",
        color: "#4285F4",
        period: "Monthly",
    },
    {
        id: "a-grok",
        name: "Grok Premium (xAI)",
        category: "AI Assistant",
        priceUSD: 10,
        priceLKR: 3000,
        description: "Real-time knowledge access, unfiltered responses, image generation, and deep reasoning capabilities from xAI.",
        features: ["Real-time Data", "Image Gen", "Deep Reasoning", "Unfiltered", "X Integration"],
        icon: "🧠",
        color: "#1DA1F2",
        period: "Monthly",
    },
    {
        id: "a-yt",
        name: "YouTube Premium",
        category: "Streaming",
        priceUSD: 10,
        priceLKR: 3000,
        description: "Ad-free viewing, background play, offline downloads, YouTube Music Premium included, and Picture-in-Picture mode.",
        features: ["No Ads", "Background Play", "Offline Downloads", "YT Music", "PiP Mode"],
        icon: "▶️",
        color: "#FF0000",
        period: "Monthly",
    },
    {
        id: "a-spotify",
        name: "Spotify Premium",
        category: "Music Streaming",
        priceUSD: 10,
        priceLKR: 3000,
        description: "Ad-free music streaming, unlimited skips, offline listening, HiFi audio quality, and cross-device sync.",
        features: ["No Ads", "Offline Mode", "HiFi Audio", "Unlimited Skips", "Cross-Device"],
        icon: "🎵",
        color: "#1DB954",
        period: "Monthly",
    },
    {
        id: "a-chatgpt",
        name: "ChatGPT Plus",
        category: "AI Assistant",
        priceUSD: 10,
        priceLKR: 3000,
        description: "GPT-4o access, DALL·E image generation, Advanced Data Analysis, custom GPTs, and priority access during peak times.",
        features: ["GPT-4o", "DALL·E 3", "Data Analysis", "Custom GPTs", "Priority Access"],
        icon: "🤖",
        color: "#10A37F",
        period: "Monthly",
    },
    {
        id: "a-midjourney",
        name: "Midjourney Pro",
        category: "AI Art",
        priceUSD: 10,
        priceLKR: 3000,
        description: "Generate stunning AI art with V6 model. Unlimited relaxed generations, fast GPU hours, and commercial license.",
        features: ["V6 Model", "Fast GPU", "Unlimited Relax", "Commercial", "Upscaling"],
        icon: "🎨",
        color: "#C084FC",
        period: "Monthly",
    },
    {
        id: "a-canva",
        name: "Canva Pro",
        category: "Design",
        priceUSD: 10,
        priceLKR: 3000,
        description: "Professional design tool with 100M+ assets, AI-powered tools, brand kit, background remover, and magic resize.",
        features: ["100M+ Assets", "AI Tools", "Brand Kit", "BG Remover", "Magic Resize"],
        icon: "✏️",
        color: "#7B2FF7",
        period: "Monthly",
    },
];

/* ─── Book Types & Data ─── */
interface Book {
    id: string;
    title: string;
    author: string;
    category: string;
    description: string;
    cover: string;
    color: string;
    pages: number;
    fileSize: string;
    pdfPath: string;
    language: string;
}

const BOOKS: Book[] = [
    {
        id: "b-balasha",
        title: "බලශාක්තිය",
        author: "Tecsub Solutions",
        category: "කතා / Story",
        description: "බලශාක්තිය කතාව. මෙය කියවීමට සියලුම සිටින්න වවා.",
        cover: "📚",
        color: "#E74C3C",
        pages: 45,
        fileSize: "22.5 MB",
        pdfPath: "/assets/books/බලශ=.pdf",
        language: "සිංහල",
    },
    {
        id: "b-ai-guide",
        title: "AI Beginner's Guide",
        author: "Tecsub Solutions",
        category: "Technology",
        description: "A comprehensive guide to understanding Artificial Intelligence, Machine Learning, and Deep Learning fundamentals.",
        cover: "🤖",
        color: "#3498DB",
        pages: 80,
        fileSize: "5.2 MB",
        pdfPath: "",
        language: "English",
    },
    {
        id: "b-web-dev",
        title: "Web Development 2026",
        author: "Tecsub Solutions",
        category: "Programming",
        description: "Modern web development techniques including React, Next.js, TypeScript, and serverless architecture patterns.",
        cover: "💻",
        color: "#2ECC71",
        pages: 120,
        fileSize: "8.1 MB",
        pdfPath: "",
        language: "English",
    },
    {
        id: "b-cyber",
        title: "Cybersecurity Essentials",
        author: "Tecsub Solutions",
        category: "Security",
        description: "Essential cybersecurity knowledge including ethical hacking, network security, and data protection best practices.",
        cover: "🔒",
        color: "#9B59B6",
        pages: 95,
        fileSize: "6.7 MB",
        pdfPath: "",
        language: "English",
    },
    {
        id: "b-mobile",
        title: "Mobile App Design",
        author: "Tecsub Solutions",
        category: "Design",
        description: "UI/UX principles for building beautiful, user-friendly mobile applications with modern design patterns.",
        cover: "📱",
        color: "#F39C12",
        pages: 68,
        fileSize: "4.5 MB",
        pdfPath: "",
        language: "English",
    },
];

export default function OnlineAssetsPage() {
    const [selectedAsset, setSelectedAsset] = useState<AIAsset | null>(null);
    const [currency, setCurrency] = useState<"usd" | "lkr">("usd");
    const [assets, setAssets] = useState<AIAsset[]>(DEFAULT_ASSETS);
    const [activeSection, setActiveSection] = useState<"assets" | "books">("assets");
    const [viewingBook, setViewingBook] = useState<Book | null>(null);
    const booksScrollRef = useRef<HTMLDivElement>(null);

    /* ─── Sync with admin localStorage ─── */
    useEffect(() => {
        const loadFromStorage = () => {
            const stored = localStorage.getItem("tecsub-admin-online_assets");
            if (stored) {
                try {
                    const adminItems = JSON.parse(stored);
                    if (adminItems.length > 0) {
                        const mapped: AIAsset[] = adminItems.map((item: { id: string; title: string; category: string; author: string; status: string }, idx: number) => {
                            const def = DEFAULT_ASSETS.find(a => a.name === item.title);
                            if (def) return { ...def, id: item.id };
                            const colors = ["#FF6B6B", "#4285F4", "#1DA1F2", "#FF0000", "#1DB954", "#10A37F", "#C084FC", "#7B2FF7"];
                            return {
                                id: item.id, name: item.title, category: item.category || "AI Tool",
                                priceUSD: 10, priceLKR: 3000,
                                description: `Premium ${item.title} subscription managed by admin.`,
                                features: ["Full Access", "Priority Support", "Monthly Updates"],
                                icon: "💡", color: colors[idx % colors.length], period: "Monthly",
                            };
                        }).filter((item: { id: string }) => {
                            const adminItem = adminItems.find((a: { id: string; status: string }) => a.id === item.id);
                            return !adminItem || adminItem.status !== "archived";
                        });
                        setAssets(mapped);
                        return;
                    }
                } catch { /* ignore */ }
            }
            const seed = DEFAULT_ASSETS.map(a => ({
                id: a.id, title: a.name, type: "online_assets", status: "published" as const,
                category: a.category, author: "Admin",
                createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            }));
            localStorage.setItem("tecsub-admin-online_assets", JSON.stringify(seed));
            setAssets(DEFAULT_ASSETS);
        };
        loadFromStorage();
        window.addEventListener("storage", loadFromStorage);
        const interval = setInterval(loadFromStorage, 2000);
        return () => { window.removeEventListener("storage", loadFromStorage); clearInterval(interval); };
    }, []);

    const getPrice = (asset: AIAsset) => {
        return currency === "lkr" ? `Rs. ${asset.priceLKR.toLocaleString()}` : `$${asset.priceUSD}`;
    };

    return (
        <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
            <Navbar />
            <div className="pt-24 sm:pt-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                    {/* Hero */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                        <h1 className="font-bebas text-5xl sm:text-7xl gradient-text leading-[0.95] mb-4">
                            🛒 ONLINE ASSETS
                        </h1>
                        <p className="text-sm sm:text-base max-w-2xl mx-auto mb-6" style={{ color: "var(--text-secondary)" }}>
                            Premium AI tools & streaming subscriptions at unbeatable prices. All accounts delivered instantly.
                        </p>

                        {/* Currency Toggle */}
                        <div className="flex justify-center gap-2">
                            <button
                                onClick={() => setCurrency("usd")}
                                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${currency === "usd" ? "bg-tecsubCyan/20 text-tecsubCyan border-2 border-tecsubCyan/30" : "border border-white/10"}`}
                                style={{ color: currency === "usd" ? undefined : "var(--text-secondary)" }}
                            >
                                💵 USD
                            </button>
                            <button
                                onClick={() => setCurrency("lkr")}
                                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${currency === "lkr" ? "bg-yellow-400/20 text-yellow-400 border-2 border-yellow-400/30" : "border border-white/10"}`}
                                style={{ color: currency === "lkr" ? undefined : "var(--text-secondary)" }}
                            >
                                🇱🇰 LKR
                            </button>
                        </div>
                    </motion.div>

                    {/* ═══ Section Tabs ═══ */}
                    <div className="flex justify-center mb-8">
                        <div
                            className="flex rounded-2xl p-1.5 gap-1.5"
                            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                        >
                            {(["assets", "books"] as const).map((sec) => (
                                <button
                                    key={sec}
                                    onClick={() => setActiveSection(sec)}
                                    className="px-6 sm:px-10 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300"
                                    style={{
                                        color: activeSection === sec ? "#fff" : "#8899aa",
                                        background:
                                            activeSection === sec
                                                ? "linear-gradient(135deg, rgba(0,229,255,0.25), rgba(0,114,188,0.2))"
                                                : "transparent",
                                        boxShadow:
                                            activeSection === sec
                                                ? "0 0 20px rgba(0,229,255,0.1), inset 0 1px 0 rgba(255,255,255,0.08)"
                                                : "none",
                                    }}
                                >
                                    {sec === "assets" ? "🛠️ Online Assets" : "📚 Books & PDFs"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ═══ Assets Section ═══ */}
                    <AnimatePresence mode="wait">
                        {activeSection === "assets" && (
                            <motion.div
                                key="assets-section"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.25 }}
                            >
                                {/* Assets Grid */}
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                    {assets.map((asset, i) => (
                                        <motion.div
                                            key={asset.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.06, duration: 0.4 }}
                                            onClick={() => setSelectedAsset(asset)}
                                            className="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] flex flex-col"
                                            style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}
                                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${asset.color}30`; }}
                                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}
                                        >
                                            <div className="h-1.5" style={{ background: asset.color }} />
                                            <div className="p-5 flex flex-col flex-1">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${asset.color}15` }}>
                                                        {asset.icon}
                                                    </div>
                                                    <span className="text-[9px] px-2 py-1 rounded-full font-bold" style={{ background: `${asset.color}15`, color: asset.color }}>
                                                        {asset.period}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{asset.name}</h3>
                                                <p className="text-[10px] mb-2" style={{ color: asset.color }}>{asset.category}</p>
                                                <p className="text-[11px] line-clamp-2 mb-3" style={{ color: "var(--text-secondary)" }}>{asset.description}</p>
                                                <div className="flex flex-wrap gap-1 mb-3">
                                                    {asset.features.slice(0, 3).map((f) => (
                                                        <span key={f} className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)" }}>
                                                            {f}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="mt-auto flex items-center justify-between">
                                                    <span className="font-bold text-lg" style={{ color: asset.color }}>{getPrice(asset)}</span>
                                                    <span className="text-[10px] px-3 py-1 rounded-full font-semibold" style={{ background: `${asset.color}15`, color: asset.color }}>
                                                        Buy →
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* ═══ Books Section ═══ */}
                        {activeSection === "books" && (
                            <motion.div
                                key="books-section"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.25 }}
                            >
                                {/* Category Chips — Horizontal Scroll */}
                                <div className="mb-6 -mx-4 px-4">
                                    <div
                                        ref={booksScrollRef}
                                        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
                                        style={{ WebkitOverflowScrolling: "touch" }}
                                    >
                                        {["All", ...[...new Set(BOOKS.map((b) => b.category))]].map((cat) => (
                                            <button
                                                key={cat}
                                                className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap"
                                                style={{
                                                    background: cat === "All" ? "rgba(0,229,255,0.15)" : "rgba(255,255,255,0.05)",
                                                    color: cat === "All" ? "#00E5FF" : "var(--text-secondary)",
                                                    border: `1px solid ${cat === "All" ? "rgba(0,229,255,0.2)" : "rgba(255,255,255,0.08)"}`,
                                                }}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Books Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                    {BOOKS.map((book, i) => (
                                        <motion.div
                                            key={book.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.06, duration: 0.4 }}
                                            className="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] flex flex-col"
                                            style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}
                                            onClick={() => setViewingBook(book)}
                                        >
                                            {/* Book Cover */}
                                            <div
                                                className="relative w-full flex items-center justify-center"
                                                style={{
                                                    background: `linear-gradient(145deg, ${book.color}20, ${book.color}08)`,
                                                    aspectRatio: "3/4",
                                                }}
                                            >
                                                <span className="text-5xl sm:text-6xl">{book.cover}</span>
                                                {/* Language Badge */}
                                                <span
                                                    className="absolute top-2 right-2 text-[8px] px-2 py-0.5 rounded-full font-bold"
                                                    style={{ background: "rgba(0,0,0,0.6)", color: "#fff" }}
                                                >
                                                    {book.language}
                                                </span>
                                                {/* Overlay on hover */}
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white font-semibold">
                                                        View →
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Book Info */}
                                            <div className="p-3 sm:p-4 flex flex-col flex-1">
                                                <h3 className="font-bold text-xs sm:text-sm mb-0.5 line-clamp-2" style={{ color: "var(--text-primary)" }}>
                                                    {book.title}
                                                </h3>
                                                <p className="text-[10px] mb-1" style={{ color: book.color }}>{book.category}</p>
                                                <p className="text-[10px] line-clamp-2 mb-2" style={{ color: "var(--text-secondary)" }}>
                                                    {book.description}
                                                </p>
                                                <div className="mt-auto flex items-center justify-between">
                                                    <span className="text-[9px]" style={{ color: "var(--text-secondary)" }}>
                                                        {book.pages} pages · {book.fileSize}
                                                    </span>
                                                    <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: "rgba(0,229,255,0.1)", color: "#00E5FF" }}>
                                                        FREE
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ═══ Asset Detail Modal ═══ */}
                <AnimatePresence>
                    {selectedAsset && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                            onClick={() => setSelectedAsset(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                                className="w-full max-w-md rounded-3xl overflow-hidden"
                                style={{ background: "rgba(12,12,14,0.98)", border: `1px solid ${selectedAsset.color}20` }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="h-2" style={{ background: `linear-gradient(90deg, transparent, ${selectedAsset.color}, transparent)` }} />
                                <div className="p-6">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: `${selectedAsset.color}15` }}>
                                            {selectedAsset.icon}
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>{selectedAsset.name}</h2>
                                            <p className="text-xs" style={{ color: selectedAsset.color }}>{selectedAsset.category} • {selectedAsset.period}</p>
                                        </div>
                                    </div>

                                    <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>{selectedAsset.description}</p>

                                    <div className="mb-5">
                                        <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-primary)" }}>Included Features</h4>
                                        <div className="space-y-1.5">
                                            {selectedAsset.features.map((f) => (
                                                <div key={f} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                                                    <span style={{ color: selectedAsset.color }}>✓</span> {f}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price Box */}
                                    <div className="p-4 rounded-xl mb-4" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                        <div className="flex gap-2 mb-3">
                                            <button onClick={() => setCurrency("usd")} className={`flex-1 py-2 rounded-lg text-xs font-bold ${currency === "usd" ? "ring-2" : "border border-white/10"}`} style={{ color: currency === "usd" ? selectedAsset.color : "var(--text-secondary)", background: currency === "usd" ? `${selectedAsset.color}10` : "transparent" }}>
                                                💵 USD
                                            </button>
                                            <button onClick={() => setCurrency("lkr")} className={`flex-1 py-2 rounded-lg text-xs font-bold ${currency === "lkr" ? "ring-2" : "border border-white/10"}`} style={{ color: currency === "lkr" ? selectedAsset.color : "var(--text-secondary)", background: currency === "lkr" ? `${selectedAsset.color}10` : "transparent" }}>
                                                🇱🇰 LKR
                                            </button>
                                        </div>
                                        <div className="text-center">
                                            <span className="text-3xl font-bold" style={{ color: selectedAsset.color }}>{getPrice(selectedAsset)}</span>
                                            <span className="text-xs ml-2" style={{ color: "var(--text-secondary)" }}>/ month</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button className="flex-1 py-3 rounded-xl font-bold text-sm text-white hover:brightness-110 transition-all" style={{ background: selectedAsset.color }}>
                                            🛒 Purchase — {getPrice(selectedAsset)}
                                        </button>
                                        <button onClick={() => setSelectedAsset(null)} className="px-5 py-3 rounded-xl text-sm font-medium hover:bg-white/10 transition-all" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-secondary)" }}>
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ═══ Book Viewer Modal ═══ */}
                <AnimatePresence>
                    {viewingBook && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[70] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm"
                            onClick={() => setViewingBook(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                                className="w-full max-w-4xl rounded-3xl overflow-hidden flex flex-col"
                                style={{ background: "rgba(12,12,14,0.98)", border: `1px solid ${viewingBook.color}20`, maxHeight: "95vh" }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div className="h-1.5 flex-shrink-0" style={{ background: `linear-gradient(90deg, transparent, ${viewingBook.color}, transparent)` }} />
                                <div className="flex items-center justify-between px-4 sm:px-6 py-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="text-xl flex-shrink-0">{viewingBook.cover}</span>
                                        <div className="min-w-0">
                                            <h2 className="font-bold text-sm truncate" style={{ color: "var(--text-primary)" }}>{viewingBook.title}</h2>
                                            <p className="text-[10px]" style={{ color: viewingBook.color }}>{viewingBook.author} · {viewingBook.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {viewingBook.pdfPath && (
                                            <a
                                                href={viewingBook.pdfPath}
                                                download
                                                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:brightness-110"
                                                style={{ background: viewingBook.color, color: "#fff" }}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                ⬇️ Download
                                            </a>
                                        )}
                                        <button
                                            onClick={() => setViewingBook(null)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all"
                                            style={{ color: "var(--text-secondary)" }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>

                                {/* PDF Viewer */}
                                <div className="flex-1 min-h-0">
                                    {viewingBook.pdfPath ? (
                                        <iframe
                                            src={viewingBook.pdfPath}
                                            className="w-full h-full border-none"
                                            style={{ minHeight: "60vh" }}
                                            title={viewingBook.title}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                                            <span className="text-6xl mb-4">{viewingBook.cover}</span>
                                            <h3 className="font-bold text-lg mb-2" style={{ color: "var(--text-primary)" }}>{viewingBook.title}</h3>
                                            <p className="text-xs max-w-md mb-4" style={{ color: "var(--text-secondary)" }}>{viewingBook.description}</p>
                                            <div className="flex items-center gap-4 text-xs mb-6" style={{ color: "var(--text-secondary)" }}>
                                                <span>📄 {viewingBook.pages} pages</span>
                                                <span>📁 {viewingBook.fileSize}</span>
                                                <span>🌐 {viewingBook.language}</span>
                                            </div>
                                            <div className="px-6 py-4 rounded-xl" style={{ background: "rgba(0,229,255,0.06)", border: "1px solid rgba(0,229,255,0.15)" }}>
                                                <p className="text-xs font-medium" style={{ color: "#00E5FF" }}>
                                                    📢 This book is coming soon! Stay tuned for the release.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Footer />
            </div>
        </div>
    );
}
