"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { downloads } from "@/data/product";

export default function AppsPage() {
    const router = useRouter();
    const [downloadStarted, setDownloadStarted] = useState<string | null>(null);

    const handleDownload = (url: string, name: string) => {
        setDownloadStarted(name);
        if (url !== "#") {
            window.open(url, "_blank");
        }
        setTimeout(() => setDownloadStarted(null), 3000);
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
