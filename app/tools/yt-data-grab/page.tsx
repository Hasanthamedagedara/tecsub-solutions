"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ─── Types ─── */
interface ExtractedData {
    category: string;
    fields: { label: string; value: string }[];
}

/* ─── Demo Data Generator ─── */
function generateDemoData(url: string, type: string): ExtractedData[] {
    const videoId = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1] || "dQw4w9WgXcQ";
    const now = new Date();

    if (type === "video") {
        return [
            {
                category: "📹 Video Data",
                fields: [
                    { label: "Video ID", value: videoId },
                    { label: "Video URL", value: `https://youtube.com/watch?v=${videoId}` },
                    { label: "Title", value: "How to Build a Website with Next.js 14 — Full Tutorial 2026" },
                    { label: "Description", value: "In this comprehensive tutorial, learn how to build production-ready websites using Next.js 14, React, Tailwind CSS, and more..." },
                    { label: "Tags", value: "nextjs, react, tailwindcss, tutorial, webdev, 2026, typescript" },
                    { label: "Keywords", value: "next.js tutorial, react 2026, web development, tailwind css, full stack" },
                    { label: "Upload Date", value: now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
                    { label: "Upload Time", value: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) },
                    { label: "Duration", value: "24:38" },
                    { label: "Transcript Available", value: "Yes — English (auto-generated), Sinhala" },
                    { label: "Category", value: "Science & Technology" },
                    { label: "License", value: "Standard YouTube License" },
                ],
            },
            {
                category: "📊 Engagement Data",
                fields: [
                    { label: "View Count", value: (Math.floor(Math.random() * 500000) + 50000).toLocaleString() },
                    { label: "Like Count", value: (Math.floor(Math.random() * 20000) + 2000).toLocaleString() },
                    { label: "Dislike Count", value: "Hidden" },
                    { label: "Comment Count", value: (Math.floor(Math.random() * 3000) + 200).toLocaleString() },
                    { label: "View-to-Like Ratio", value: `${(Math.random() * 5 + 3).toFixed(1)}%` },
                    { label: "Engagement Rate", value: `${(Math.random() * 8 + 4).toFixed(2)}%` },
                    { label: "Avg Watch Time", value: `${Math.floor(Math.random() * 10 + 8)}:${Math.floor(Math.random() * 59).toString().padStart(2, "0")}` },
                    { label: "Sentiment Score", value: `${(Math.random() * 0.3 + 0.7).toFixed(2)} (Positive)` },
                ],
            },
        ];
    } else if (type === "channel") {
        return [
            {
                category: "📺 Channel Data",
                fields: [
                    { label: "Channel Name", value: "TECSUB" },
                    { label: "Channel ID", value: "UC" + videoId.slice(0, 9) + "XYZ" },
                    { label: "Subscriber Count", value: (Math.floor(Math.random() * 500000) + 10000).toLocaleString() },
                    { label: "Total View Count", value: (Math.floor(Math.random() * 50000000) + 1000000).toLocaleString() },
                    { label: "Video Count", value: (Math.floor(Math.random() * 500) + 50).toString() },
                    { label: "Join Date", value: "Mar 15, 2021" },
                    { label: "Country", value: "Sri Lanka 🇱🇰" },
                    { label: "Custom URL", value: "@tecsub" },
                    { label: "Featured Channels", value: "TechBurner, CodeWithHarry, Fireship" },
                    { label: "Verified Status", value: "✓ Verified" },
                ],
            },
        ];
    } else {
        return [
            {
                category: "💬 Comment Data (Top 5)",
                fields: [
                    { label: "Comment #1", value: `"Amazing tutorial! Very clear and helpful 🔥" — @techfan2026 • 3 days ago • ❤️ 142 likes` },
                    { label: "Comment #2", value: `"Best Next.js tutorial I've seen this year" — @webdev_pro • 1 week ago • ❤️ 98 likes` },
                    { label: "Comment #3", value: `"Can you make a video on deployment?" — @codingNewbie • 5 days ago • ❤️ 67 likes • 3 replies` },
                    { label: "Comment #4", value: `"This helped me build my portfolio site 🎉" — @student_dev • 2 weeks ago • ❤️ 45 likes` },
                    { label: "Comment #5", value: `"Subscribed! Your explain is perfect" — @sinhala_dev • 4 days ago • ❤️ 31 likes` },
                    { label: "Total Comments", value: (Math.floor(Math.random() * 3000) + 200).toLocaleString() },
                    { label: "Sentiment Breakdown", value: "84% Positive • 12% Neutral • 4% Negative" },
                    { label: "Top Keywords", value: "tutorial, helpful, amazing, clear, subscribe" },
                    { label: "Avg Likes/Comment", value: (Math.random() * 20 + 5).toFixed(1) },
                ],
            },
        ];
    }
}

/* ─── Data Type Tabs ─── */
const DATA_TYPES = [
    { id: "video", label: "📹 Video Data", desc: "Extract video metadata, tags, transcripts" },
    { id: "channel", label: "📺 Channel Data", desc: "Subscriber count, join date, location" },
    { id: "comments", label: "💬 Engagement Data", desc: "Comments, sentiment, like ratios" },
];

export default function YTDataGrabPage() {
    const [url, setUrl] = useState("");
    const [activeType, setActiveType] = useState("video");
    const [results, setResults] = useState<ExtractedData[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleExtract = async () => {
        if (!url.trim()) { setError("Please enter a YouTube URL"); return; }
        if (!url.includes("youtube.com") && !url.includes("youtu.be")) { setError("Please enter a valid YouTube URL"); return; }
        setError("");
        setLoading(true);
        setResults(null);

        // Simulate API call
        await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000));

        setResults(generateDemoData(url, activeType));
        setLoading(false);
    };

    const exportCSV = () => {
        if (!results) return;
        let csv = "Category,Field,Value\n";
        results.forEach((cat) => {
            cat.fields.forEach((f) => {
                csv += `"${cat.category}","${f.label}","${f.value.replace(/"/g, '""')}"\n`;
            });
        });
        const blob = new Blob([csv], { type: "text/csv" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `yt-data-grab-${activeType}-${Date.now()}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const exportJSON = () => {
        if (!results) return;
        const json = JSON.stringify(results, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `yt-data-grab-${activeType}-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    const copyAll = () => {
        if (!results) return;
        const text = results.map((cat) =>
            `${cat.category}\n${cat.fields.map((f) => `  ${f.label}: ${f.value}`).join("\n")}`
        ).join("\n\n");
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
            <Navbar />
            <div className="pt-24 sm:pt-28">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                    {/* Hero */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                        <h1 className="font-bebas text-5xl sm:text-7xl gradient-text leading-[0.95] mb-4">
                            📊 YT DATA GRAB
                        </h1>
                        <p className="text-sm sm:text-base max-w-2xl mx-auto mb-2" style={{ color: "var(--text-secondary)" }}>
                            Extract video data, channel info, and engagement metrics from any YouTube URL.
                        </p>
                    </motion.div>

                    {/* Info Table — What You Can Extract */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="mb-10 rounded-2xl overflow-hidden"
                        style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                        <div className="p-4 text-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>
                                What You Can Extract
                            </h3>
                        </div>
                        <div className="grid grid-cols-3 divide-x divide-white/5">
                            {[
                                {
                                    title: "Video Data",
                                    color: "#00E5FF",
                                    items: ["Video ID & URL", "Title & Description", "Tags & Keywords", "Upload Date & Time", "Transcript/Captions"],
                                },
                                {
                                    title: "Channel Data",
                                    color: "#C084FC",
                                    items: ["Subscriber Count", "Total View Count", "Channel Join Date", "Country/Location", "Featured Channels"],
                                },
                                {
                                    title: "Engagement Data",
                                    color: "#4ADE80",
                                    items: ["Comment Text", "Comment Author & Date", "Number of Likes/Replies", "Sentiment Score (Advanced)", "View-to-Like Ratio"],
                                },
                            ].map((col) => (
                                <div key={col.title} className="p-4">
                                    <h4 className="text-xs font-bold mb-3 text-center" style={{ color: col.color }}>{col.title}</h4>
                                    <ul className="space-y-1.5">
                                        {col.items.map((item) => (
                                            <li key={item} className="text-[11px] flex items-center gap-1.5" style={{ color: "var(--text-secondary)" }}>
                                                <span style={{ color: col.color }}>•</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* URL Input */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={url}
                                    onChange={(e) => { setUrl(e.target.value); setError(""); }}
                                    placeholder="Paste YouTube URL here... (e.g. https://youtube.com/watch?v=...)"
                                    className="w-full px-5 py-4 pl-12 rounded-2xl text-sm outline-none"
                                    style={{ background: "rgba(0,0,0,0.4)", border: error ? "1px solid #EF4444" : "1px solid rgba(255,255,255,0.08)", color: "var(--text-primary)" }}
                                    onKeyDown={(e) => e.key === "Enter" && handleExtract()}
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔗</span>
                            </div>
                            <button
                                onClick={handleExtract}
                                disabled={loading}
                                className="px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:brightness-110 disabled:opacity-50 flex-shrink-0"
                                style={{ background: "linear-gradient(135deg, #00E5FF, #1E40AF)", color: "#0A0A0B" }}
                            >
                                {loading ? "⏳ Extracting..." : "🚀 Extract Data"}
                            </button>
                        </div>
                        {error && <p className="text-xs text-red-400 mt-2 ml-1">{error}</p>}
                    </motion.div>

                    {/* Data Type Tabs */}
                    <div className="flex flex-wrap gap-3 mb-8">
                        {DATA_TYPES.map((dt) => (
                            <button
                                key={dt.id}
                                onClick={() => { setActiveType(dt.id); setResults(null); }}
                                className={`flex-1 sm:flex-initial px-5 py-3 rounded-xl text-left transition-all duration-300 ${activeType === dt.id ? "border-2" : "border border-white/10 hover:border-white/20"}`}
                                style={{
                                    borderColor: activeType === dt.id ? "#00E5FF50" : undefined,
                                    background: activeType === dt.id ? "rgba(0,229,255,0.06)" : "rgba(0,0,0,0.2)",
                                }}
                            >
                                <p className="text-xs font-bold" style={{ color: activeType === dt.id ? "#00E5FF" : "var(--text-primary)" }}>{dt.label}</p>
                                <p className="text-[10px] mt-0.5" style={{ color: "var(--text-secondary)" }}>{dt.desc}</p>
                            </button>
                        ))}
                    </div>

                    {/* Results */}
                    <AnimatePresence mode="wait">
                        {loading && (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="text-center py-16"
                            >
                                <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl" style={{ background: "rgba(0,229,255,0.05)", border: "1px solid rgba(0,229,255,0.1)" }}>
                                    <div className="w-5 h-5 border-2 border-tecsubCyan/30 border-t-tecsubCyan rounded-full animate-spin" />
                                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Extracting {activeType} data...</span>
                                </div>
                            </motion.div>
                        )}

                        {results && !loading && (
                            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                {/* Export Toolbar */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <button onClick={exportCSV} className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:brightness-110" style={{ background: "rgba(74,222,128,0.1)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.2)" }}>
                                        📄 Export CSV
                                    </button>
                                    <button onClick={exportJSON} className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:brightness-110" style={{ background: "rgba(0,229,255,0.1)", color: "#00E5FF", border: "1px solid rgba(0,229,255,0.2)" }}>
                                        📋 Export JSON
                                    </button>
                                    <button onClick={copyAll} className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:brightness-110" style={{ background: "rgba(192,132,252,0.1)", color: "#C084FC", border: "1px solid rgba(192,132,252,0.2)" }}>
                                        📎 Copy All
                                    </button>
                                </div>

                                {/* Data Cards */}
                                <div className="space-y-4">
                                    {results.map((section) => (
                                        <div
                                            key={section.category}
                                            className="rounded-2xl overflow-hidden"
                                            style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}
                                        >
                                            <div className="px-5 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,229,255,0.03)" }}>
                                                <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{section.category}</h3>
                                            </div>
                                            <div className="divide-y divide-white/5">
                                                {section.fields.map((field) => (
                                                    <div key={field.label} className="px-5 py-3 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 group hover:bg-white/[0.02] transition-all">
                                                        <span className="text-[11px] font-semibold uppercase tracking-wider flex-shrink-0 sm:w-44" style={{ color: "#00E5FF" }}>
                                                            {field.label}
                                                        </span>
                                                        <span className="text-xs flex-1 break-all" style={{ color: "var(--text-secondary)" }}>
                                                            {field.value}
                                                        </span>
                                                        <button
                                                            onClick={() => navigator.clipboard.writeText(field.value)}
                                                            className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 px-2 py-1 rounded-lg hover:bg-white/10"
                                                            style={{ color: "var(--text-secondary)" }}
                                                        >
                                                            📋
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Empty State */}
                    {!results && !loading && (
                        <div className="text-center py-16">
                            <p className="text-4xl mb-4">📊</p>
                            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Paste a YouTube URL and hit Extract</p>
                            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>Results will appear here with full export options.</p>
                        </div>
                    )}
                </div>
                <Footer />
            </div>
        </div>
    );
}
