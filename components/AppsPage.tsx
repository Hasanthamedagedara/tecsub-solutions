"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { downloads } from "@/data/product";

const TECSUB_APK_URL = "https://drive.google.com/file/d/1Pk7gpQAWMkWvfevSTZPF6_5EwzaFVcdn/view?usp=sharing";

export default function AppsPage() {
    const router = useRouter();
    const [downloadStarted, setDownloadStarted] = useState<string | null>(null);
    const [apkDownloading, setApkDownloading] = useState(false);

    const handleDownload = (url: string, name: string) => {
        setDownloadStarted(name);
        if (url !== "#") {
            window.open(url, "_blank");
        }
        setTimeout(() => setDownloadStarted(null), 3000);
    };

    const handleApkDownload = () => {
        setApkDownloading(true);
        window.open(TECSUB_APK_URL, "_blank");
        setTimeout(() => setApkDownloading(false), 3000);
    };

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6" style={{ background: "var(--navy)" }}>
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => router.push("/")}
                    className="flex items-center gap-2 mb-6 text-sm font-medium hover:text-tecsubCyan transition-colors"
                    style={{ color: "var(--text-secondary)" }}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Home
                </button>

                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="font-bebas text-4xl sm:text-6xl md:text-7xl gradient-text leading-[0.95] mb-3">
                        Our Apps
                    </h1>
                    <p className="text-sm sm:text-base max-w-xl mx-auto font-light" style={{ color: "var(--text-secondary)" }}>
                        Download our apps for Android. Available as direct APK or on Google Play Store.
                    </p>
                </motion.div>

                {/* ═══ Featured TecSub App Hero Card ═══ */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-10 relative overflow-hidden rounded-3xl"
                    style={{
                        background: "linear-gradient(135deg, rgba(0,229,255,0.06) 0%, rgba(0,114,188,0.08) 50%, rgba(0,229,255,0.04) 100%)",
                        border: "1px solid rgba(0,229,255,0.15)",
                    }}
                >
                    {/* Animated glow background */}
                    <div
                        className="absolute inset-0 opacity-30 pointer-events-none"
                        style={{
                            background: "radial-gradient(ellipse at 20% 50%, rgba(0,229,255,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(0,114,188,0.12) 0%, transparent 60%)",
                        }}
                    />

                    <div className="relative p-6 sm:p-8 md:p-10">
                        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                            {/* App Icon */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="flex-shrink-0"
                            >
                                <div
                                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-[1.75rem] flex items-center justify-center relative"
                                    style={{
                                        background: "linear-gradient(135deg, rgba(0,229,255,0.12) 0%, rgba(0,114,188,0.15) 100%)",
                                        border: "2px solid rgba(0,229,255,0.2)",
                                        boxShadow: "0 0 40px rgba(0,229,255,0.1), inset 0 0 30px rgba(0,229,255,0.05)",
                                    }}
                                >
                                    {/* Android Robot Icon */}
                                    <svg className="w-14 h-14 sm:w-16 sm:h-16" viewBox="0 0 24 24" fill="none">
                                        <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10z" fill="#00E5FF" fillOpacity="0.8" />
                                        <path d="M3.5 8C2.67 8 2 8.67 2 9.5v5c0 .83.67 1.5 1.5 1.5S5 15.33 5 14.5v-5C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-5c0-.83-.67-1.5-1.5-1.5z" fill="#00E5FF" fillOpacity="0.6" />
                                        <path d="M7 7h10c.55 0 1 .45 1 1v0H6v0c0-.55.45-1 1-1z" fill="#00E5FF" fillOpacity="0.5" />
                                        <path d="M7 3.5C7 2.67 7.67 2 8.5 2h7c.83 0 1.5.67 1.5 1.5V7H7V3.5z" fill="#00E5FF" fillOpacity="0.9" />
                                        <circle cx="9.5" cy="4.5" r="0.75" fill="#0A0A0B" />
                                        <circle cx="14.5" cy="4.5" r="0.75" fill="#0A0A0B" />
                                        <path d="M8.5 1l-1 1.5" stroke="#00E5FF" strokeWidth="0.5" strokeLinecap="round" strokeOpacity="0.7" />
                                        <path d="M15.5 1l1 1.5" stroke="#00E5FF" strokeWidth="0.5" strokeLinecap="round" strokeOpacity="0.7" />
                                    </svg>
                                    {/* Pulse effect */}
                                    <div
                                        className="absolute inset-0 rounded-[1.75rem] animate-pulse"
                                        style={{
                                            boxShadow: "0 0 30px rgba(0,229,255,0.15)",
                                        }}
                                    />
                                </div>
                            </motion.div>

                            {/* Info */}
                            <div className="flex-1 text-center sm:text-left">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                >
                                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                                        <span
                                            className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full"
                                            style={{
                                                background: "rgba(0,229,255,0.12)",
                                                color: "#00E5FF",
                                                border: "1px solid rgba(0,229,255,0.2)",
                                            }}
                                        >
                                            ⭐ Featured App
                                        </span>
                                        <span
                                            className="text-[10px] uppercase tracking-widest font-semibold px-2 py-1 rounded-full"
                                            style={{
                                                background: "rgba(76,175,80,0.12)",
                                                color: "#4CAF50",
                                                border: "1px solid rgba(76,175,80,0.2)",
                                            }}
                                        >
                                            NEW
                                        </span>
                                    </div>
                                    <h2
                                        className="font-bebas text-3xl sm:text-4xl md:text-5xl tracking-wide mb-1"
                                        style={{ color: "var(--text-primary)" }}
                                    >
                                        TecSub Solutions
                                    </h2>
                                    <p
                                        className="text-xs sm:text-sm leading-relaxed mb-1 max-w-md"
                                        style={{ color: "var(--text-secondary)" }}
                                    >
                                        Your all-in-one tech companion — browse our platform, access tools, watch tutorials, and stay updated. Now available on Android!
                                    </p>
                                    <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 text-[11px]" style={{ color: "var(--text-secondary)" }}>
                                        <span>📱 Android</span>
                                        <span>•</span>
                                        <span>v1.0</span>
                                        <span>•</span>
                                        <span>~10 MB</span>
                                    </div>
                                </motion.div>

                                {/* Download Buttons */}
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                    className="flex flex-col sm:flex-row gap-3 mt-5"
                                >
                                    <button
                                        onClick={handleApkDownload}
                                        className="group relative flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all duration-300 overflow-hidden"
                                        style={{
                                            background: apkDownloading
                                                ? "rgba(76,175,80,0.15)"
                                                : "linear-gradient(135deg, #00E5FF 0%, #0072BC 100%)",
                                            color: apkDownloading ? "#4CAF50" : "#0A0A0B",
                                            border: apkDownloading ? "1px solid rgba(76,175,80,0.3)" : "none",
                                            boxShadow: apkDownloading ? "none" : "0 4px 25px rgba(0,229,255,0.35)",
                                        }}
                                    >
                                        {!apkDownloading && (
                                            <div
                                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                style={{
                                                    background: "linear-gradient(135deg, #00E5FF 0%, #26C6DA 50%, #0072BC 100%)",
                                                }}
                                            />
                                        )}
                                        <span className="relative z-10 flex items-center gap-2.5">
                                            {apkDownloading ? (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Download Started!
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                    Download TecSub APK
                                                </>
                                            )}
                                        </span>
                                    </button>

                                    <a
                                        href="#"
                                        className="py-3.5 px-6 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2.5 transition-all duration-300 hover:bg-white/10"
                                        style={{
                                            background: "rgba(0,0,0,0.4)",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            color: "var(--text-primary)",
                                        }}
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                            <path d="M3.609 1.814L13.793 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92z" fill="#4285F4" />
                                            <path d="M17.556 8.237L5.082.96a1 1 0 00-.523-.146l9.234 9.234 3.763-1.81z" fill="#34A853" />
                                            <path d="M17.556 15.763L13.793 12l3.763-3.763 3.21 1.545c.89.428.89 1.008 0 1.436l-3.21 1.545z" fill="#FBBC04" />
                                            <path d="M4.559 23.186a1 1 0 00.523-.146l12.474-7.277L13.793 12 4.56 21.234z" fill="#EA4335" />
                                        </svg>
                                        Google Play (Soon)
                                    </a>
                                </motion.div>
                            </div>
                        </div>

                        {/* Feature chips */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="flex flex-wrap justify-center sm:justify-start gap-2 mt-6 pt-6"
                            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                        >
                            {["🌐 Web Browser", "🛠️ Online Tools", "📺 Video Gallery", "📰 Tech News", "🎓 Courses", "💬 Notifications"].map((feat) => (
                                <span
                                    key={feat}
                                    className="text-[10px] sm:text-[11px] px-3 py-1.5 rounded-full font-medium"
                                    style={{
                                        background: "rgba(0,229,255,0.05)",
                                        color: "var(--text-secondary)",
                                        border: "1px solid rgba(0,229,255,0.08)",
                                    }}
                                >
                                    {feat}
                                </span>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>

                {/* Divider label */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold" style={{ color: "var(--text-secondary)" }}>
                        More Software
                    </span>
                    <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                </div>

                {/* Apps Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {downloads.map((app, i) => (
                        <motion.div
                            key={app.name}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="glass-panel p-6 sm:p-8 card-hover flex flex-col"
                            style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: "1.25rem" }}
                        >
                            {/* App Icon & Info */}
                            <div className="flex items-center gap-4 mb-4">
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                                    style={{ background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.15)" }}
                                >
                                    {app.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bebas text-xl sm:text-2xl tracking-wide" style={{ color: "var(--text-primary)" }}>
                                        {app.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full border border-tecsubCyan/20 text-tecsubCyan">
                                            v{app.version}
                                        </span>
                                        <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>{app.size}</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-xs sm:text-sm leading-relaxed mb-5 flex-1" style={{ color: "var(--text-secondary)" }}>
                                {app.description}
                            </p>

                            {/* Category Badge */}
                            <div className="mb-4">
                                <span className="text-[10px] uppercase tracking-widest font-semibold px-3 py-1 rounded-full" style={{ background: "rgba(0,229,255,0.06)", color: "var(--text-secondary)" }}>
                                    {app.category}
                                </span>
                            </div>

                            {/* Download Buttons */}
                            <div className="flex flex-col gap-2.5">
                                {/* Demo APK Download */}
                                <button
                                    onClick={() => handleDownload(app.url, app.name)}
                                    className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${downloadStarted === app.name
                                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                        : "bg-tecsubCyan text-tecsubNavy hover:shadow-[0_0_25px_rgba(0,229,255,0.4)]"
                                        }`}
                                >
                                    {downloadStarted === app.name ? (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Download Started
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Download APK
                                        </>
                                    )}
                                </button>

                                {/* Google Play Link */}
                                <a
                                    href="#"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 transition-all duration-300 hover:bg-white/10"
                                    style={{
                                        background: "rgba(0,0,0,0.4)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        color: "var(--text-primary)",
                                    }}
                                >
                                    {/* Google Play Icon */}
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                                        <path d="M3.609 1.814L13.793 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92z" fill="#4285F4" />
                                        <path d="M17.556 8.237L5.082.96a1 1 0 00-.523-.146l9.234 9.234 3.763-1.81z" fill="#34A853" />
                                        <path d="M17.556 15.763L13.793 12l3.763-3.763 3.21 1.545c.89.428.89 1.008 0 1.436l-3.21 1.545z" fill="#FBBC04" />
                                        <path d="M4.559 23.186a1 1 0 00.523-.146l12.474-7.277L13.793 12 4.56 21.234z" fill="#EA4335" />
                                    </svg>
                                    Get on Google Play
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Coming Soon Notice */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 text-center"
                >
                    <div
                        className="glass-panel inline-flex items-center gap-3 px-6 py-3 rounded-full"
                        style={{ border: "1px solid rgba(0,229,255,0.1)" }}
                    >
                        <span className="text-lg">🚀</span>
                        <p className="text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
                            More apps coming soon. Stay tuned!
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
