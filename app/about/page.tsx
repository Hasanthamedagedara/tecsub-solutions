"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
});

export default function AboutPage() {
    return (
        <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
            <Navbar />
            <div className="pt-24 sm:pt-28">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                    {/* ═══ Hero ═══ */}
                    <motion.section {...fadeUp()} className="text-center mb-16 sm:mb-20">
                        <h1 className="font-bebas text-5xl sm:text-7xl md:text-8xl gradient-text leading-[0.95] mb-6">
                            About TECSUB SOLUTIONS
                        </h1>
                        <p
                            className="text-base sm:text-xl max-w-2xl mx-auto leading-relaxed font-light"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            &ldquo;Engineering the Future&rdquo; — More than just a website, TECSUB is a hub for innovation,
                            software development, and technical education in Sri Lanka.
                        </p>
                    </motion.section>

                    {/* ═══ Founder's Journey ═══ */}
                    <motion.section {...fadeUp(0.1)} className="mb-16 grid md:grid-cols-2 gap-8 items-start">
                        <div>
                            <h2 className="font-bebas text-3xl sm:text-4xl tracking-wide text-tecsubCyan mb-4">Our Journey</h2>
                            <p className="mb-4 text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                                Founded by{" "}
                                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                                    Hasantha Medagedara
                                </span>
                                , a dedicated software developer and student at Eastern University, Sri Lanka.
                            </p>
                            <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                                What started as a passion project using simple text editors has evolved into a professional
                                platform built with modern frameworks like Next.js and React. The countless hours of hard
                                work and self-learning have culminated in the creation of TECSUB SOLUTIONS.
                            </p>
                        </div>

                        <div
                            className="rounded-2xl p-6"
                            style={{
                                background: "rgba(0,0,0,0.3)",
                                border: "1px solid rgba(255,255,255,0.08)",
                            }}
                        >
                            <h3 className="font-bebas text-xl tracking-wide mb-4" style={{ color: "var(--text-primary)" }}>
                                Our Technology Stack
                            </h3>
                            <ul className="space-y-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                                {[
                                    { icon: "🚀", title: "Next.js & React", desc: "For high-performance web experiences." },
                                    { icon: "🎨", title: "Tailwind CSS", desc: "For modern, responsive UI and Dark Mode." },
                                    { icon: "✨", title: "Framer Motion", desc: "For smooth, high-quality animations." },
                                    { icon: "⚙️", title: "GitHub Actions", desc: "For seamless CI/CD workflows." },
                                ].map((item) => (
                                    <li key={item.title} className="flex items-start gap-3">
                                        <span className="text-lg flex-shrink-0">{item.icon}</span>
                                        <span>
                                            <strong style={{ color: "var(--text-primary)" }}>{item.title}:</strong> {item.desc}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.section>

                    {/* ═══ YouTube Mission ═══ */}
                    <motion.section
                        {...fadeUp(0.2)}
                        className="mb-16 rounded-3xl p-6 sm:p-10"
                        style={{
                            background: "rgba(0,0,0,0.3)",
                            border: "1px solid rgba(0,229,255,0.15)",
                        }}
                    >
                        <h2 className="font-bebas text-3xl sm:text-4xl tracking-wide mb-4" style={{ color: "var(--text-primary)" }}>
                            Educational Mission on YouTube
                        </h2>
                        <p className="mb-8 text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                            TECSUB is a leading educational channel on YouTube, dedicated to bridging the language gap in
                            technology by providing high-quality tutorials in Sinhala.
                        </p>
                        <div className="grid sm:grid-cols-3 gap-4">
                            {[
                                { title: "AI Tutorials", desc: "Expert guidance on Luma AI, Pollo AI, and Fliki AI.", color: "#00E5FF" },
                                { title: "Prompt Engineering", desc: "Mastering ChatGPT and AI workflows for maximum productivity.", color: "#C084FC" },
                                { title: "Software Tools", desc: "Deep dives into tools like Tecsub Rec and Data Grab V5.", color: "#4ADE80" },
                            ].map((card) => (
                                <div
                                    key={card.title}
                                    className="p-4 rounded-xl"
                                    style={{
                                        background: "rgba(0,0,0,0.4)",
                                        border: `1px solid ${card.color}20`,
                                    }}
                                >
                                    <h4 className="font-semibold text-sm mb-2" style={{ color: card.color }}>
                                        {card.title}
                                    </h4>
                                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                                        {card.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* ═══ Platform Features ═══ */}
                    <motion.section {...fadeUp(0.3)} className="mb-16">
                        <h2 className="font-bebas text-3xl sm:text-4xl tracking-wide text-center mb-10" style={{ color: "var(--text-primary)" }}>
                            Platform Features
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-6">
                            {[
                                { icon: "🌐", title: "Trilingual Support", desc: "Accessible in Sinhala, Tamil, and English.", color: "#00E5FF" },
                                { icon: "💳", title: "Secure Payments", desc: "Integrated with PayHere and Google Pay for safe transactions.", color: "#4ADE80" },
                                { icon: "🛠️", title: "Online Tools", desc: "14+ free developer and productivity tools in your browser.", color: "#FFD93D" },
                                { icon: "🎓", title: "Course Platform", desc: "Premium courses with video content and certificate tracking.", color: "#C084FC" },
                                { icon: "🤖", title: "AI Prompt Hub", desc: "50+ curated AI prompts for creators, developers, and marketers.", color: "#F97316" },
                                { icon: "📦", title: "Software Hub", desc: "Custom-built software downloads including Tecsub Recorder.", color: "#38BDF8" },
                            ].map((feat) => (
                                <div
                                    key={feat.title}
                                    className="flex items-start gap-4 p-5 rounded-xl"
                                    style={{
                                        background: "rgba(0,0,0,0.25)",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                    }}
                                >
                                    <div
                                        className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                                        style={{ background: `${feat.color}15` }}
                                    >
                                        {feat.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>
                                            {feat.title}
                                        </h4>
                                        <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                                            {feat.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* ═══ Most Hyped Software & Apps ═══ */}
                    <motion.section {...fadeUp(0.35)} className="mb-16">
                        <h2 className="font-bebas text-3xl sm:text-4xl tracking-wide text-center mb-3" style={{ color: "var(--text-primary)" }}>
                            🔥 Most Hyped Software & Apps
                        </h2>
                        <p className="text-center text-xs sm:text-sm mb-10 max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
                            Our community's favorites — the tools and apps everyone is talking about.
                        </p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { icon: "🎥", name: "Tecsub Recorder", tag: "Screen Recorder", downloads: "50K+", rating: 4.9, color: "#00E5FF", desc: "Smart zoom, floating toolbar, 4K recording, 9:16 social mode." },
                                { icon: "📊", name: "Data Grab V5", tag: "Data Extraction", downloads: "32K+", rating: 4.8, color: "#F97316", desc: "AI-powered pattern recognition, batch processing, CSV/JSON export." },
                                { icon: "🔒", name: "VPN Ultra", tag: "Privacy & Security", downloads: "45K+", rating: 4.7, color: "#C084FC", desc: "100+ servers, WireGuard protocol, zero-log policy, unlimited bandwidth." },
                                { icon: "🧹", name: "Tecsub Cleaner", tag: "System Utility", downloads: "28K+", rating: 4.6, color: "#4ADE80", desc: "Junk cleaner, RAM optimizer, startup manager, disk analyzer." },
                                { icon: "💻", name: "Code Studio", tag: "IDE", downloads: "22K+", rating: 4.8, color: "#38BDF8", desc: "AI autocomplete, multi-language, integrated terminal, Git support." },
                                { icon: "🎮", name: "Mod Apps Hub", tag: "Modified Apps", downloads: "120K+", rating: 4.9, color: "#FF0000", desc: "Premium apps unlocked — Spotify, YouTube, Instagram, WhatsApp & more." },
                                { icon: "🖼️", name: "Batch Image Resizer", tag: "Media Tool", downloads: "18K+", rating: 4.5, color: "#FFD93D", desc: "Drag-and-drop batch processing, smart crop, format conversion." },
                                { icon: "☁️", name: "Tecsub Backup", tag: "Cloud Storage", downloads: "15K+", rating: 4.6, color: "#34D399", desc: "Encrypted cloud backup, auto-sync, versioning, cross-device access." },
                            ].map((app) => (
                                <div
                                    key={app.name}
                                    className="rounded-2xl p-4 transition-all duration-300 hover:scale-[1.03] group"
                                    style={{
                                        background: "rgba(0,0,0,0.3)",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLElement).style.borderColor = `${app.color}30`;
                                        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px ${app.color}10`;
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                                        (e.currentTarget as HTMLElement).style.boxShadow = "none";
                                    }}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${app.color}15` }}>
                                            {app.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-xs" style={{ color: "var(--text-primary)" }}>{app.name}</h4>
                                            <p className="text-[10px]" style={{ color: app.color }}>{app.tag}</p>
                                        </div>
                                    </div>
                                    <p className="text-[11px] mb-3 leading-relaxed line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                                        {app.desc}
                                    </p>
                                    <div className="flex items-center justify-between text-[10px]" style={{ color: "var(--text-secondary)" }}>
                                        <span>⭐ {app.rating}</span>
                                        <span>📥 {app.downloads}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* ═══ Footer Credit ═══ */}
                    <motion.div
                        {...fadeUp(0.4)}
                        className="text-center pt-10"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                    >
                        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                            © 2026 TECSUB SOLUTIONS | Developed by Hasantha Medagedara
                        </p>
                    </motion.div>
                </div>
                <Footer />
            </div>
        </div>
    );
}
