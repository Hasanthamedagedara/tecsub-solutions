"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/components/ThemeProvider";

export default function HomeLandingPage() {
    const router = useRouter();
    const { language } = useAppContext();

    // YouTube Live Stats Simulation
    const [subs, setSubs] = useState(12450);
    const [views, setViews] = useState(1250400);

    useEffect(() => {
        const interval = setInterval(() => {
            setViews(v => v + Math.floor(Math.random() * 5) + 1);
            if (Math.random() > 0.7) setSubs(s => s + 1);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    const featuredStats = [
        { value: "50K+", label: "Monthly Active Users" },
        { value: "20+", label: "Bilingual Online Utilities" },
        { value: "99.9%", label: "System Uptime" },
        { value: "🇱🇰 #1", label: "Sinhala PDF Engine" },
    ];

    const ecosystemNodes = [
        {
            title: "Online Tools Workspace",
            desc: "Access our comprehensive suite of 20+ utilities including Sinhala Unicode Converters, OCR scanners, and developer formatters.",
            icon: "🌐",
            actionText: "Launch Tools Workspace",
            href: "/tools",
            color: "rgba(0, 229, 255, 0.15)",
            borderColor: "rgba(0, 229, 255, 0.3)",
            accentColor: "#00E5FF",
        },
        {
            title: "Bilingual PDF Merger Pro",
            desc: "Merge original and translated PDF files side-by-side. Featuring the advanced, Sri Lanka-first FM Abhaya legacy decoder.",
            icon: "📑",
            actionText: "Open PDF Merger",
            href: "/pdf-tools",
            color: "rgba(16, 185, 129, 0.15)",
            borderColor: "rgba(16, 185, 129, 0.3)",
            accentColor: "#10B981",
        },
        {
            title: "Tecsub Studio Apps",
            desc: "Download advanced offline packages for desktop. Fully integrated with Tecsub PDF Studio and video editor tools.",
            icon: "💻",
            actionText: "Download Software",
            href: "/software",
            color: "rgba(249, 115, 22, 0.15)",
            borderColor: "rgba(249, 115, 22, 0.3)",
            accentColor: "#F97316",
        },
    ];

    const valueProps = [
        {
            title: "Sri Lankan Localizations",
            desc: "Advanced Sinhala phonetic Unicode keyboards, smart dictionaries, and local fonts decoder support built from scratch.",
            icon: "🦁",
        },
        {
            title: "100% Client-Side Privacy",
            desc: "Your data stays yours. Speech processing, translation decodes, and file merges happen securely in your local browser.",
            icon: "🔒",
        },
        {
            title: "Cyber-Fast Performance",
            desc: "Engineered on premium edge networks. Zero latency loaders, lightweight scripts, and clean, high-performance designs.",
            icon: "⚡",
        },
    ];

    return (
        <div className="min-h-screen text-[var(--yt-text-primary)] font-sans overflow-hidden flex flex-col" style={{ background: "var(--navy)" }}>
            <Navbar />

            {/* Hero Section */}
            <header className="relative pt-36 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center overflow-hidden">
                {/* Glowing Background Gradients */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none opacity-30" style={{ background: "radial-gradient(circle, #0072BC 0%, transparent 70%)" }} />
                <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full blur-[120px] pointer-events-none opacity-20" style={{ background: "radial-gradient(circle, #00E5FF 0%, transparent 70%)" }} />
                
                {/* Visual grid line */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto relative z-10"
                >
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black tracking-[0.25em] uppercase mb-6 bg-white/5 border border-white/10 text-tecsubCyan">
                        ✨ Sri Lanka&apos;s Leading Digital Hub
                    </span>

                    <h1 className="font-bebas text-5xl sm:text-7xl md:text-8xl tracking-tight leading-[0.9] uppercase italic mb-6">
                        Engineering The <br />
                        <span className="gradient-text">Future. Today.</span>
                    </h1>

                    <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-10 text-[var(--yt-text-secondary)]">
                        Welcome to Tecsub Solutions. Access 20+ free high-performance online utility tools, offline desktop software releases, and smart local language systems built for creators.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={() => router.push("/tools")}
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-tecsubCyan to-tecsubBlue text-black shadow-[0_4px_25px_rgba(0,229,255,0.3)] hover:scale-105 transition-all duration-300"
                        >
                            Open Tools Workspace
                        </button>
                        <button
                            onClick={() => router.push("/software")}
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                        >
                            Get Desktop Apps
                        </button>
                        <a
                            href="https://www.youtube.com/@hasanthadilshanmedagedara"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm bg-red-600 text-white shadow-[0_4px_25px_rgba(220,38,38,0.3)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                            Subscribe on YouTube
                        </a>
                    </div>

                    {/* Live YouTube Stats Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="mt-12 inline-flex flex-col sm:flex-row items-center gap-6 px-8 py-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="relative flex items-center justify-center">
                                <span className="absolute w-3 h-3 rounded-full bg-red-500 animate-ping opacity-75" />
                                <span className="relative w-2 h-2 rounded-full bg-red-500" />
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Live Subscribers</span>
                                <span className="text-2xl font-bebas text-white tracking-wider tabular-nums">{subs.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="hidden sm:block w-px h-10 bg-white/10 relative z-10" />
                        <div className="flex items-center gap-4 relative z-10">
                            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <div className="flex flex-col text-left">
                                <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Total Channel Views</span>
                                <span className="text-2xl font-bebas text-white tracking-wider tabular-nums">{views.toLocaleString()}</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </header>

            {/* Stats Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-gray-200 dark:border-white/5 relative z-10 bg-gray-50 dark:bg-black/40">
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {featuredStats.map((stat, index) => (
                        <div key={index} className="space-y-1">
                            <p className="text-3xl sm:text-4xl font-bebas tracking-wide text-tecsubCyan">{stat.value}</p>
                            <p className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-[var(--yt-text-secondary)]">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Ecosystem Cards */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-bebas text-3xl sm:text-5xl tracking-wide mb-3">Our Smart Ecosystem</h2>
                        <p className="text-xs sm:text-sm text-[var(--yt-text-secondary)] max-w-lg mx-auto font-light">Explore integrated software hubs designed to accelerate development, design, and translation workloads.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {ecosystemNodes.map((node, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15, duration: 0.6 }}
                                className="group relative rounded-[2rem] p-8 flex flex-col border transition-all duration-300 hover:scale-[1.02]"
                                style={{
                                    background: `linear-gradient(135deg, ${node.color} 0%, var(--yt-bg-secondary) 100%)`,
                                    borderColor: "var(--yt-border)",
                                }}
                            >
                                <div className="text-4xl mb-6">{node.icon}</div>
                                <h3 className="font-bebas text-2xl tracking-wide text-[var(--yt-text-primary)] mb-3 group-hover:text-tecsubCyan transition-colors">
                                    {node.title}
                                </h3>
                                <p className="text-xs text-[var(--yt-text-secondary)] font-light leading-relaxed mb-8 flex-1">
                                    {node.desc}
                                </p>
                                <button
                                    onClick={() => router.push(node.href)}
                                    className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300"
                                    style={{
                                        background: "var(--yt-bg-hover)",
                                        border: "1px solid var(--yt-border)",
                                        color: node.accentColor,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = node.accentColor;
                                        e.currentTarget.style.color = "#000000";
                                        e.currentTarget.style.boxShadow = `0 4px 20px ${node.borderColor}`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "var(--yt-bg-hover)";
                                        e.currentTarget.style.color = node.accentColor;
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                >
                                    {node.actionText} →
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Values / Why Choose Us */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-gray-50/50 dark:bg-black/30 border-t border-gray-200 dark:border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                        <div className="lg:col-span-1 space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-tecsubCyan">WHY TECSUB</span>
                            <h2 className="font-bebas text-4xl sm:text-6xl leading-[0.95] tracking-wide text-[var(--yt-text-primary)]">
                                Designed For <br />
                                <span className="gradient-text italic">Maximum Power.</span>
                            </h2>
                            <p className="text-xs text-[var(--yt-text-secondary)] font-light leading-relaxed">
                                We combine robust low-latency algorithms with clean, beautiful design systems to offer utilities that just work.
                            </p>
                        </div>

                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {valueProps.map((prop, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 space-y-4 shadow-sm dark:shadow-none">
                                    <div className="text-2xl">{prop.icon}</div>
                                    <h4 className="font-bold text-sm text-[var(--yt-text-primary)]">{prop.title}</h4>
                                    <p className="text-[11px] text-[var(--yt-text-secondary)] leading-relaxed font-light">{prop.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA Block */}
            <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden z-10 text-center border-t border-gray-200 dark:border-white/5">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[140px] pointer-events-none opacity-20" style={{ background: "radial-gradient(circle, #00E5FF 0%, transparent 70%)" }} />
                
                <div className="max-w-3xl mx-auto relative z-10 space-y-6">
                    <h2 className="font-bebas text-4xl sm:text-6xl tracking-wide leading-none text-[var(--yt-text-primary)]">Ready to Boost Your Digital Workflow?</h2>
                    <p className="text-xs sm:text-sm text-[var(--yt-text-secondary)] font-light max-w-md mx-auto">Get instant access to our entire catalog of developer resources, language tools, and productivity applications.</p>
                    <button
                        onClick={() => router.push("/tools")}
                        className="px-10 py-4.5 rounded-2xl font-bold text-sm bg-tecsubCyan text-black shadow-[0_4px_30px_rgba(0,229,255,0.25)] hover:scale-105 transition-all duration-300"
                    >
                        Get Started Free
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    );
}
