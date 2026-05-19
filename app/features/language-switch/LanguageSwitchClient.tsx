"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TRANSLATIONS = {
    en: {
        title: "Trilingual Support",
        desc: "Access all platform features, developer tools, and academic courses seamlessly in English, Sinhala, and Tamil.",
        label: "Selected Language",
        welcome: "Welcome to Tecsub Solutions",
        sub: "Engineering premium software solutions for Sri Lanka.",
        badge: "Active",
    },
    si: {
        title: "ත්‍රිභාෂා සහයෝගය",
        desc: "සියලුම පද්ධති මෙවලම්, ක්‍රමලේඛන පාඨමාලා සහ සංවර්ධන මෙවලම් සිංහල, ඉංග්‍රීසි සහ දෙමළ භාෂාවලින් පහසුවෙන් භාවිතා කරන්න.",
        label: "තෝරාගත් භාෂාව",
        welcome: "ටෙක්සබ් සොලියුෂන්ස් වෙත සාදරයෙන් පිළිගනිමු",
        sub: "ශ්‍රී ලංකාව සඳහා විශිෂ්ටතම මෘදුකාංග සහ තාක්ෂණික විසඳුම්.",
        badge: "සක්‍රීයයි",
    },
    ta: {
        title: "முப்பரிமாண மொழி ஆதரவு",
        desc: "அனைத்து தளம் மற்றும் கல்வி படிப்புகளையும் ஆங்கிலம், சிங்களம் மற்றும் தமிழ் மொழிகளில் தடையின்றி அணுகவும்.",
        label: "தேர்ந்தெடுக்கப்பட்ட மொழி",
        welcome: "டெக்சப் சொல்யூஷன்ஸ் உங்களை வரவேற்கிறது",
        sub: "இலங்கைக்கான பிரீமியம் மென்பொருள் தீர்வுகள்.",
        badge: "செயலில் உள்ளது",
    }
};

export default function LanguageSwitchClient() {
    const [lang, setLang] = useState<"en" | "si" | "ta">("si");
    const active = TRANSLATIONS[lang];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Trilingual Language Options | Tecsub Solutions",
        "description": "Access all platform tools, developer documentation, and courses in English, Sinhala, and Tamil seamlessly.",
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
                        <span className="text-xs uppercase tracking-[0.2em] font-bold text-yt-accent">Global Accessibility</span>
                        <h1 className="font-bebas text-5xl sm:text-7xl gradient-text leading-[0.95] mt-2 mb-4">
                            🗣️ TRILINGUAL OPTIONS
                        </h1>
                        <p className="text-sm sm:text-base max-w-xl mx-auto" style={{ color: "var(--yt-text-secondary)" }}>
                            Sri Lanka's first fully trilingual utility workspace. Switch between English, සිංහල, and தமிழ் dynamically.
                        </p>
                    </div>

                    {/* Interactive Preview Container */}
                    <div 
                        className="rounded-3xl p-6 sm:p-8 mb-8"
                        style={{ background: "var(--yt-bg-secondary)", border: "1px solid var(--yt-border)" }}
                    >
                        <h3 className="font-bold text-lg mb-6 text-center" style={{ color: "var(--yt-text-primary)" }}>
                            Try Live Language Switcher Below
                        </h3>

                        {/* Toggler Bar */}
                        <div className="flex justify-center gap-2 mb-8">
                            {(["en", "si", "ta"] as const).map((l) => (
                                <button
                                    key={l}
                                    onClick={() => setLang(l)}
                                    className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 uppercase tracking-widest ${
                                        lang === l 
                                            ? "bg-yt-accent text-white" 
                                            : "bg-yt-chip-bg text-yt-text-primary hover:bg-yt-bg-hover"
                                    }`}
                                >
                                    {l === "en" ? "English (EN)" : l === "si" ? "සිංහල (SI)" : "தமிழ் (TA)"}
                                </button>
                            ))}
                        </div>

                        {/* Interactive UI Mock Card */}
                        <motion.div
                            key={lang}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-6 rounded-2xl border"
                            style={{ 
                                background: "var(--yt-bg)", 
                                borderColor: "var(--yt-border)",
                                boxShadow: "inset 0 0 20px rgba(0,0,0,0.05)"
                            }}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded bg-yt-accent/15 text-yt-accent">
                                    {active.badge}
                                </span>
                                <span className="text-xs" style={{ color: "var(--yt-text-secondary)" }}>
                                    {active.label}: <strong className="uppercase">{lang}</strong>
                                </span>
                            </div>

                            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--yt-text-primary)" }}>
                                {active.welcome}
                            </h2>
                            <p className="text-sm font-light mb-4" style={{ color: "var(--yt-text-secondary)" }}>
                                {active.sub}
                            </p>

                            <div 
                                className="p-4 rounded-xl text-xs leading-relaxed" 
                                style={{ background: "var(--yt-bg-secondary)", color: "var(--yt-text-secondary)" }}
                            >
                                <strong style={{ color: "var(--yt-text-primary)" }}>{active.title}:</strong> {active.desc}
                            </div>
                        </motion.div>
                    </div>

                    {/* SEO Information & Benefits */}
                    <div className="grid sm:grid-cols-2 gap-6 text-sm">
                        <div className="p-5 rounded-2xl border" style={{ background: "var(--yt-bg-secondary)", borderColor: "var(--yt-border)" }}>
                            <h4 className="font-bold mb-2" style={{ color: "var(--yt-text-primary)" }}>🚀 Absolute Performance</h4>
                            <p style={{ color: "var(--yt-text-secondary)" }}>
                                Switch languages instantly without reload. The local state transition occurs in under 15ms, maintaining focus on active tools.
                            </p>
                        </div>
                        <div className="p-5 rounded-2xl border" style={{ background: "var(--yt-bg-secondary)", borderColor: "var(--yt-border)" }}>
                            <h4 className="font-bold mb-2" style={{ color: "var(--yt-text-primary)" }}>🌐 Inclusive Innovation</h4>
                            <p style={{ color: "var(--yt-text-secondary)" }}>
                                Built using Noto Sans fonts for beautiful, anti-aliased representation of complex Sinhala & Tamil unicode scripts.
                            </p>
                        </div>
                    </div>

                </div>
                <Footer />
            </div>
        </div>
    );
}
