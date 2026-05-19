"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function DarkModeClient() {
    const [previewTheme, setPreviewTheme] = useState<"dark" | "light">("dark");

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Dynamic Dark Mode Integration | Tecsub Solutions",
        "description": "Experience our sleek premium dark and white lighting modes designed to optimize visual ergonomics across all online utility tools.",
        "publisher": {
            "@type": "Organization",
            "name": "Tecsub Solutions",
            "logo": "https://tecsub.online/logo/tecsub.jpg"
        }
    };

    return (
        <div className="min-h-screen" style={{ background: "var(--yt-bg)" }}>
            {/* SEO JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Navbar />
            <div className="pt-24 sm:pt-28">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                    {/* Hero Header */}
                    <div className="text-center mb-10">
                        <span className="text-xs uppercase tracking-[0.2em] font-bold text-yt-accent">Visual Ergonomics</span>
                        <h1 className="font-bebas text-5xl sm:text-7xl gradient-text leading-[0.95] mt-2 mb-4">
                            🕶️ DYNAMIC DARK MODE
                        </h1>
                        <p className="text-sm sm:text-base max-w-xl mx-auto" style={{ color: "var(--yt-text-secondary)" }}>
                            Restructured HSL lighting modes for perfect reading and minimum eye strain. Toggle local previews instantly below.
                        </p>
                    </div>

                    {/* Interactive Simulator */}
                    <div 
                        className="rounded-3xl p-6 sm:p-8 mb-8"
                        style={{ background: "var(--yt-bg-secondary)", border: "1px solid var(--yt-border)" }}
                    >
                        <h3 className="font-bold text-lg mb-6 text-center" style={{ color: "var(--yt-text-primary)" }}>
                            Interactive Theme Toggling Simulator
                        </h3>

                        {/* Toggler Bar */}
                        <div className="flex justify-center gap-2 mb-8">
                            <button
                                onClick={() => setPreviewTheme("dark")}
                                className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 uppercase tracking-widest flex items-center gap-2 ${
                                    previewTheme === "dark" 
                                        ? "bg-yt-accent text-white" 
                                        : "bg-yt-chip-bg text-yt-text-primary hover:bg-yt-bg-hover"
                                }`}
                            >
                                🌙 Premium Dark
                            </button>
                            <button
                                onClick={() => setPreviewTheme("light")}
                                className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 uppercase tracking-widest flex items-center gap-2 ${
                                    previewTheme === "light" 
                                        ? "bg-yt-accent text-white shadow-lg shadow-blue-500/25" 
                                        : "bg-yt-chip-bg text-yt-text-primary hover:bg-yt-bg-hover"
                                }`}
                            >
                                ☀️ Premium Light
                            </button>
                        </div>

                        {/* Interactive UI Mock Card */}
                        <motion.div
                            key={previewTheme}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="p-6 sm:p-8 rounded-2xl border transition-all duration-500 shadow-2xl"
                            style={{ 
                                background: previewTheme === "dark" ? "#0f0f0f" : "#ffffff", 
                                borderColor: previewTheme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                                color: previewTheme === "dark" ? "#ffffff" : "#0f0f0f"
                            }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <span 
                                    className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded"
                                    style={{
                                        background: previewTheme === "dark" ? "rgba(62,166,255,0.15)" : "rgba(62,166,255,0.1)",
                                        color: "#3ea6ff"
                                    }}
                                >
                                    System Console Mockup
                                </span>
                                <span className="text-xs" style={{ color: previewTheme === "dark" ? "#888" : "#666" }}>
                                    Active theme: <strong className="uppercase">{previewTheme}</strong>
                                </span>
                            </div>

                            <h2 className="text-xl font-bold mb-2">
                                {previewTheme === "dark" ? "🌙 Experience the Sleek Dark Side" : "☀️ Clear & Crisp Reading in Day Light"}
                            </h2>
                            <p className="text-sm font-light mb-6 leading-relaxed" style={{ color: previewTheme === "dark" ? "#aaa" : "#444" }}>
                                This premium mockup changes background, border, text color, and layout elevations using dynamic HSL styles. Try tapping the buttons above to feel the smooth transition.
                            </p>

                            {/* Inner Box */}
                            <div 
                                className="p-4 rounded-xl text-xs leading-relaxed transition-all duration-500" 
                                style={{ 
                                    background: previewTheme === "dark" ? "#1e1e1e" : "#f1f5f9", 
                                    color: previewTheme === "dark" ? "#ccc" : "#334155",
                                    border: previewTheme === "dark" ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)"
                                }}
                            >
                                <strong style={{ color: previewTheme === "dark" ? "#fff" : "#000" }}>Token Optimization:</strong> 
                                {previewTheme === "dark" 
                                    ? " Using HSL(220, 13%, 18%) background variables combined with neon blue highlights to prevent visual fatigue under low ambient light."
                                    : " Using HSL(0, 0%, 100%) combined with high contrast dark slate typography to provide maximum sunlight readability."
                                }
                            </div>
                        </motion.div>
                    </div>

                    {/* SEO Information & Benefits */}
                    <div className="grid sm:grid-cols-2 gap-6 text-sm">
                        <div className="p-5 rounded-2xl border" style={{ background: "var(--yt-bg-secondary)", borderColor: "var(--yt-border)" }}>
                            <h4 className="font-bold mb-2" style={{ color: "var(--yt-text-primary)" }}>🛡️ Ergo-Designed HSL</h4>
                            <p style={{ color: "var(--yt-text-secondary)" }}>
                                Standard white uses absolute #fff and black uses #000, which creates high contrast visual fatigue. Our colors are fine-tuned via HSL offsets for gentle eye care.
                            </p>
                        </div>
                        <div className="p-5 rounded-2xl border" style={{ background: "var(--yt-bg-secondary)", borderColor: "var(--yt-border)" }}>
                            <h4 className="font-bold mb-2" style={{ color: "var(--yt-text-primary)" }}>⚡ Low Energy Consumption</h4>
                            <p style={{ color: "var(--yt-text-secondary)" }}>
                                Reduces power consumption by up to 34% on OLED mobile devices by emitting fewer white subpixels in dark mode.
                            </p>
                        </div>
                    </div>

                </div>
                <Footer />
            </div>
        </div>
    );
}
