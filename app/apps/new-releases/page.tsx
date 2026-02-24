"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface AppRelease {
    id: string;
    name: string;
    version: string;
    category: string;
    releaseDate: string;
    description: string;
    icon: string;
    color: string;
    isNew: boolean;
}

const DEFAULT_RELEASES: AppRelease[] = [
    { id: "rel-001", name: "Tecsub Recorder 3.0", version: "v3.0.0", category: "Productivity", releaseDate: "Feb 20, 2026", description: "Complete rewrite with smart zoom, floating toolbar, and 9:16 social mode.", icon: "🎥", color: "#00E5FF", isNew: true },
    { id: "rel-002", name: "Data Grab V5", version: "v5.2.1", category: "Utility", releaseDate: "Feb 18, 2026", description: "Enhanced data extraction with AI-powered pattern recognition.", icon: "📊", color: "#4ADE80", isNew: true },
    { id: "rel-003", name: "Tecsub VPN Ultra", version: "v2.1.0", category: "Security", releaseDate: "Feb 15, 2026", description: "New servers in 20+ countries, WireGuard protocol, and split tunneling.", icon: "🔒", color: "#C084FC", isNew: true },
    { id: "rel-004", name: "Code Studio 2.0", version: "v2.0.0", category: "Development", releaseDate: "Feb 12, 2026", description: "AI autocomplete, multi-language support, and integrated terminal.", icon: "💻", color: "#38BDF8", isNew: false },
    { id: "rel-005", name: "Batch Image Resizer", version: "v1.5.0", category: "Media", releaseDate: "Feb 10, 2026", description: "Drag-and-drop batch processing with smart crop and format conversion.", icon: "🖼️", color: "#F97316", isNew: false },
    { id: "rel-006", name: "File Converter Pro", version: "v3.8.0", category: "Utility", releaseDate: "Feb 8, 2026", description: "PDF, DOCX, XLSX, and 50+ format conversions with batch support.", icon: "📁", color: "#EF4444", isNew: false },
];

const STORAGE_KEY = "tecsub-new-releases";

export default function NewReleasesPage() {
    const [releases, setReleases] = useState<AppRelease[]>([]);

    useEffect(() => {
        const loadFromStorage = () => {
            const adminStored = localStorage.getItem("tecsub-admin-new_releases");
            if (adminStored) {
                try {
                    const adminItems = JSON.parse(adminStored);
                    if (adminItems.length > 0) {
                        const mapped: AppRelease[] = adminItems.map((item: { id: string; title: string; category: string; status: string }, idx: number) => {
                            const def = DEFAULT_RELEASES.find(r => r.name === item.title);
                            if (def) return { ...def, id: item.id };
                            const colors = ["#00E5FF", "#4ADE80", "#C084FC", "#38BDF8", "#F97316", "#EF4444"];
                            return {
                                id: item.id, name: item.title, version: "v1.0",
                                category: item.category || "Software",
                                releaseDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
                                description: `${item.title} — New release managed by admin.`,
                                icon: "\ud83d\udce6", color: colors[idx % colors.length], isNew: true,
                            };
                        }).filter((item: { id: string }) => {
                            const adminItem = adminItems.find((a: { id: string; status: string }) => a.id === item.id);
                            return !adminItem || adminItem.status !== "archived";
                        });
                        setReleases(mapped);
                        return;
                    }
                } catch { /* ignore */ }
            }
            const seed = DEFAULT_RELEASES.map(r => ({
                id: r.id, title: r.name, type: "new_releases", status: "published" as const,
                category: r.category, author: "Admin",
                createdAt: r.releaseDate,
            }));
            localStorage.setItem("tecsub-admin-new_releases", JSON.stringify(seed));
            setReleases(DEFAULT_RELEASES);
        };
        loadFromStorage();
        window.addEventListener("storage", loadFromStorage);
        const interval = setInterval(loadFromStorage, 2000);
        return () => { window.removeEventListener("storage", loadFromStorage); clearInterval(interval); };
    }, []);

    return (
        <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
            <Navbar />
            <div className="pt-24 sm:pt-28">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                    {/* Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h1 className="font-bebas text-5xl sm:text-7xl gradient-text leading-[0.95] mb-4">
                            🆕 NEW RELEASES
                        </h1>
                        <p className="text-sm sm:text-base max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
                            Latest software releases and updates from Tecsub Solutions.
                        </p>
                    </motion.div>

                    {/* Releases List */}
                    <div className="space-y-4">
                        {releases.map((release, i) => (
                            <motion.div
                                key={release.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08, duration: 0.4 }}
                                className="flex items-start gap-4 p-5 rounded-2xl group transition-all duration-300 hover:scale-[1.01]"
                                style={{
                                    background: "rgba(0,0,0,0.3)",
                                    border: `1px solid rgba(255,255,255,0.06)`,
                                }}
                            >
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                                    style={{ background: `${release.color}15` }}
                                >
                                    {release.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <h3 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{release.name}</h3>
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full" style={{ background: `${release.color}15`, color: release.color }}>
                                            {release.version}
                                        </span>
                                        {release.isNew && (
                                            <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-tecsubCyan/20 text-tecsubCyan border border-tecsubCyan/30 animate-pulse">
                                                NEW
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs leading-relaxed mb-2" style={{ color: "var(--text-secondary)" }}>
                                        {release.description}
                                    </p>
                                    <div className="flex items-center gap-3 text-[10px]" style={{ color: "var(--text-secondary)" }}>
                                        <span>📁 {release.category}</span>
                                        <span>📅 {release.releaseDate}</span>
                                    </div>
                                </div>
                                <button
                                    className="px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 hover:brightness-110 flex-shrink-0"
                                    style={{ background: release.color, color: "#fff" }}
                                >
                                    ⬇️ Get
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    {releases.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-3xl mb-3">📦</p>
                            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No releases found. Check back soon!</p>
                        </div>
                    )}
                </div>
                <Footer />
            </div>
        </div>
    );
}
