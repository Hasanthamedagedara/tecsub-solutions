"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/components/ThemeProvider";

export default function HomeLandingPage() {
    const router = useRouter();
    const { language } = useAppContext();

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
        <div className="min-h-screen text-white font-sans overflow-hidden flex flex-col" style={{ background: "var(--navy)" }}>
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

                    <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-10 text-slate-400">
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
                    </div>
                </motion.div>
            </header>

            {/* Stats Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-white/5 relative z-10 bg-black/40">
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {featuredStats.map((stat, index) => (
                        <div key={index} className="space-y-1">
                            <p className="text-3xl sm:text-4xl font-bebas tracking-wide text-tecsubCyan">{stat.value}</p>
                            <p className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-slate-400">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Ecosystem Cards */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-bebas text-3xl sm:text-5xl tracking-wide mb-3">Our Smart Ecosystem</h2>
                        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto font-light">Explore integrated software hubs designed to accelerate development, design, and translation workloads.</p>
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
                                    background: `linear-gradient(135deg, ${node.color} 0%, rgba(10,10,11,0.6) 100%)`,
                                    borderColor: node.borderColor,
                                }}
                            >
                                <div className="text-4xl mb-6">{node.icon}</div>
                                <h3 className="font-bebas text-2xl tracking-wide text-white mb-3 group-hover:text-tecsubCyan transition-colors">
                                    {node.title}
                                </h3>
                                <p className="text-xs text-slate-400 font-light leading-relaxed mb-8 flex-1">
                                    {node.desc}
                                </p>
                                <button
                                    onClick={() => router.push(node.href)}
                                    className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300"
                                    style={{
                                        background: "rgba(255, 255, 255, 0.03)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        color: node.accentColor,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = node.accentColor;
                                        e.currentTarget.style.color = "#000000";
                                        e.currentTarget.style.boxShadow = `0 4px 20px ${node.borderColor}`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
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
            <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-black/30 border-t border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
                        <div className="lg:col-span-1 space-y-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-tecsubCyan">WHY TECSUB</span>
                            <h2 className="font-bebas text-4xl sm:text-6xl leading-[0.95] tracking-wide">
                                Designed For <br />
                                <span className="gradient-text italic">Maximum Power.</span>
                            </h2>
                            <p className="text-xs text-slate-400 font-light leading-relaxed">
                                We combine robust low-latency algorithms with clean, beautiful design systems to offer utilities that just work.
                            </p>
                        </div>

                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {valueProps.map((prop, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                                    <div className="text-2xl">{prop.icon}</div>
                                    <h4 className="font-bold text-sm text-white">{prop.title}</h4>
                                    <p className="text-[11px] text-slate-400 leading-relaxed font-light">{prop.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA Block */}
            <section className="py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden z-10 text-center border-t border-white/5">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[140px] pointer-events-none opacity-20" style={{ background: "radial-gradient(circle, #00E5FF 0%, transparent 70%)" }} />
                
                <div className="max-w-3xl mx-auto relative z-10 space-y-6">
                    <h2 className="font-bebas text-4xl sm:text-6xl tracking-wide leading-none">Ready to Boost Your Digital Workflow?</h2>
                    <p className="text-xs sm:text-sm text-slate-400 font-light max-w-md mx-auto">Get instant access to our entire catalog of developer resources, language tools, and productivity applications.</p>
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
