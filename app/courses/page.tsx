"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdPlacement from "@/components/AdPlacement";

/* ─── Types ─── */
interface Course {
    id: string;
    title: string;
    instructor: string;
    priceUSD: number;
    priceLKR: number;
    priceUSDT: number;
    duration: string;
    lessons: number;
    level: string;
    description: string;
    topics: string[];
    icon: string;
    color: string;
    badge?: string;
}

/* ─── Course Data ─── */
const DEFAULT_COURSES: Course[] = [
    {
        id: "c-fb",
        title: "Facebook Marketing Masterclass",
        instructor: "Hasantha Medagedara",
        priceUSD: 19,
        priceLKR: 5700,
        priceUSDT: 19,
        duration: "8 hours",
        lessons: 42,
        level: "Beginner to Advanced",
        description: "Master Facebook Ads, page growth strategies, audience targeting, A/B testing, and monetization techniques for maximum ROI.",
        topics: ["Facebook Ads Manager", "Audience Targeting", "Page Growth", "Pixel Tracking", "A/B Testing", "Monetization"],
        icon: "📘",
        color: "#1877F2",
        badge: "🔥 Popular",
    },
    {
        id: "c-yt",
        title: "YouTube Channel Growth & Monetization",
        instructor: "Hasantha Medagedara",
        priceUSD: 25,
        priceLKR: 7500,
        priceUSDT: 25,
        duration: "12 hours",
        lessons: 56,
        level: "All Levels",
        description: "From zero to monetized channel. SEO optimization, thumbnail design, shorts strategy, and YouTube Studio analytics mastery.",
        topics: ["YouTube SEO", "Thumbnail Design", "Shorts Strategy", "Analytics", "Monetization", "Community Building"],
        icon: "▶️",
        color: "#FF0000",
        badge: "⭐ Best Seller",
    },
    {
        id: "c-tt",
        title: "TikTok Viral Content Blueprint",
        instructor: "Hasantha Medagedara",
        priceUSD: 18,
        priceLKR: 5400,
        priceUSDT: 18,
        duration: "6 hours",
        lessons: 35,
        level: "Beginner",
        description: "Learn the algorithm, trending hooks, editing techniques, and growth hacking strategies to go viral on TikTok.",
        topics: ["TikTok Algorithm", "Viral Hooks", "Editing Tricks", "Trending Audio", "Growth Hacking", "Brand Deals"],
        icon: "🎵",
        color: "#00F2EA",
    },
    {
        id: "c-ig",
        title: "Instagram Business & Reels Mastery",
        instructor: "Hasantha Medagedara",
        priceUSD: 22,
        priceLKR: 6600,
        priceUSDT: 22,
        duration: "9 hours",
        lessons: 48,
        level: "Intermediate",
        description: "Build a powerful Instagram brand with Reels, Stories, carousel posts, influencer marketing, and shoppable content strategies.",
        topics: ["Reels Strategy", "Story Highlights", "Carousel Design", "Hashtag Research", "Influencer Outreach", "Instagram Shopping"],
        icon: "📸",
        color: "#E1306C",
        badge: "🆕 New",
    },
    {
        id: "c-ads",
        title: "Adsterra Monetization Complete Guide",
        instructor: "Hasantha Medagedara",
        priceUSD: 15,
        priceLKR: 4500,
        priceUSDT: 15,
        duration: "5 hours",
        lessons: 28,
        level: "Intermediate",
        description: "Maximize your website revenue with Adsterra. Learn ad placement strategies, format optimization, and traffic monetization.",
        topics: ["Ad Formats", "Placement Strategy", "Traffic Sources", "Revenue Optimization", "Popunder Ads", "Native Ads"],
        icon: "💰",
        color: "#4ADE80",
    },
    {
        id: "c-web",
        title: "Modern Website Development 2026",
        instructor: "Hasantha Medagedara",
        priceUSD: 25,
        priceLKR: 7500,
        priceUSDT: 25,
        duration: "15 hours",
        lessons: 72,
        level: "Beginner to Advanced",
        description: "Build production-ready websites with Next.js, React, Tailwind CSS, and deploy to Vercel. Complete full-stack course.",
        topics: ["Next.js 14+", "React Components", "Tailwind CSS", "TypeScript", "API Routes", "Vercel Deployment"],
        icon: "🌐",
        color: "#38BDF8",
        badge: "⭐ Best Seller",
    },
    {
        id: "c-ai",
        title: "AI & ChatGPT Prompt Engineering",
        instructor: "Hasantha Medagedara",
        priceUSD: 20,
        priceLKR: 6000,
        priceUSDT: 20,
        duration: "10 hours",
        lessons: 52,
        level: "All Levels",
        description: "Master AI tools: ChatGPT, Claude, Gemini, Midjourney. Learn prompt engineering, AI automation, and workflow optimization.",
        topics: ["ChatGPT Mastery", "Prompt Engineering", "AI Automation", "Midjourney Art", "Claude & Gemini", "AI Workflows"],
        icon: "🤖",
        color: "#C084FC",
        badge: "🔥 Popular",
    },
    {
        id: "c-viral",
        title: "Viral AI Video Creation Masterclass",
        instructor: "Hasantha Medagedara",
        priceUSD: 23,
        priceLKR: 6900,
        priceUSDT: 23,
        duration: "11 hours",
        lessons: 58,
        level: "Intermediate",
        description: "Create viral videos using AI tools: Luma AI, Pollo AI, Fliki AI, HeyGen. From script to final render with zero filming.",
        topics: ["Luma AI", "Pollo AI", "Fliki AI", "HeyGen Avatars", "AI Script Writing", "Video Editing"],
        icon: "🎬",
        color: "#F97316",
        badge: "🆕 New",
    },
];

export default function CoursesPage() {
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [currency, setCurrency] = useState<"usd" | "lkr" | "usdt">("usd");
    const [courses, setCourses] = useState<Course[]>(DEFAULT_COURSES);

    /* ─── Sync with admin localStorage ─── */
    useEffect(() => {
        const loadFromStorage = () => {
            const stored = localStorage.getItem("tecsub-admin-courses");
            if (stored) {
                try {
                    const adminItems = JSON.parse(stored);
                    if (adminItems.length > 0) {
                        // Map admin ContentItem format to Course format
                        const mapped: Course[] = adminItems.map((item: { id: string; title: string; category: string; author: string; status: string }, idx: number) => {
                            // Try to find matching default course
                            const def = DEFAULT_COURSES.find(c => c.title === item.title);
                            if (def) return { ...def, id: item.id };
                            // New admin-added course
                            const colors = ["#1877F2", "#FF0000", "#00F2EA", "#E1306C", "#4ADE80", "#38BDF8", "#C084FC", "#F97316"];
                            return {
                                id: item.id,
                                title: item.title,
                                instructor: item.author || "Hasantha Medagedara",
                                priceUSD: 15 + Math.floor(Math.random() * 11),
                                priceLKR: 4500 + Math.floor(Math.random() * 3000),
                                priceUSDT: 15 + Math.floor(Math.random() * 11),
                                duration: "6 hours",
                                lessons: 30 + Math.floor(Math.random() * 30),
                                level: "All Levels",
                                description: `Premium course on ${item.title}. Category: ${item.category}.`,
                                topics: [item.category, "Getting Started", "Advanced Techniques", "Monetization"],
                                icon: "📚",
                                color: colors[idx % colors.length],
                            };
                        }).filter((item: { id: string; title: string; category: string; author: string; status: string }) => {
                            const adminItem = adminItems.find((a: { id: string; status: string }) => a.id === item.id);
                            return !adminItem || adminItem.status !== "archived";
                        });
                        setCourses(mapped);
                        return;
                    }
                } catch { /* ignore parse errors */ }
            }
            // Seed localStorage with defaults on first load
            const seed = DEFAULT_COURSES.map((c, i) => ({
                id: c.id,
                title: c.title,
                type: "courses",
                status: "published" as const,
                category: "Education",
                author: c.instructor,
                createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            }));
            localStorage.setItem("tecsub-admin-courses", JSON.stringify(seed));
            setCourses(DEFAULT_COURSES);
        };

        loadFromStorage();
        // Listen for storage changes (cross-tab real-time sync)
        window.addEventListener("storage", loadFromStorage);
        // Also poll for same-tab changes (admin panel is same origin)
        const interval = setInterval(loadFromStorage, 2000);
        return () => { window.removeEventListener("storage", loadFromStorage); clearInterval(interval); };
    }, []);

    const getPrice = (course: Course) => {
        switch (currency) {
            case "lkr": return `Rs. ${course.priceLKR.toLocaleString()}`;
            case "usdt": return `${course.priceUSDT} USDT`;
            default: return `$${course.priceUSD}`;
        }
    };

    return (
        <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
            <Navbar />
            <div className="pt-24 sm:pt-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                    {/* Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-10"
                    >
                        <h1 className="font-bebas text-5xl sm:text-7xl gradient-text leading-[0.95] mb-4">
                            🎓 PREMIUM COURSES
                        </h1>
                        <p className="text-sm sm:text-base max-w-2xl mx-auto mb-6" style={{ color: "var(--text-secondary)" }}>
                            Master social media, web development, and AI with expert-led courses in Sinhala & English.
                        </p>

                        {/* Currency Selector */}
                        <div className="flex justify-center gap-2">
                            {([
                                { key: "usd" as const, label: "💵 USD", color: "#4ADE80" },
                                { key: "lkr" as const, label: "🇱🇰 LKR", color: "#FFD93D" },
                                { key: "usdt" as const, label: "₮ USDT", color: "#26A17B" },
                            ]).map((c) => (
                                <button
                                    key={c.key}
                                    onClick={() => setCurrency(c.key)}
                                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${currency === c.key
                                        ? "border-2"
                                        : "border border-white/10 hover:border-white/20"
                                        }`}
                                    style={{
                                        color: currency === c.key ? c.color : "var(--text-secondary)",
                                        borderColor: currency === c.key ? `${c.color}50` : undefined,
                                        background: currency === c.key ? `${c.color}10` : "transparent",
                                    }}
                                >
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Course Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {courses.map((course, i) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06, duration: 0.4 }}
                                onClick={() => setSelectedCourse(course)}
                                className="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] flex flex-col"
                                style={{
                                    background: "rgba(0,0,0,0.3)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.borderColor = `${course.color}30`;
                                    (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px ${course.color}10`;
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                                }}
                            >
                                {/* Top bar & badge */}
                                <div className="h-1.5" style={{ background: course.color }} />
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                            style={{ background: `${course.color}15` }}
                                        >
                                            {course.icon}
                                        </div>
                                        {course.badge && (
                                            <span
                                                className="text-[9px] px-2 py-1 rounded-full font-bold"
                                                style={{ background: `${course.color}15`, color: course.color }}
                                            >
                                                {course.badge}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="font-bold text-sm mb-2 line-clamp-2 leading-snug" style={{ color: "var(--text-primary)" }}>
                                        {course.title}
                                    </h3>
                                    <p className="text-[11px] line-clamp-2 mb-3" style={{ color: "var(--text-secondary)" }}>
                                        {course.description}
                                    </p>

                                    {/* Stats */}
                                    <div className="flex items-center gap-3 text-[10px] mb-4" style={{ color: "var(--text-secondary)" }}>
                                        <span>⏱ {course.duration}</span>
                                        <span>📚 {course.lessons} lessons</span>
                                    </div>

                                    {/* Price & CTA */}
                                    <div className="mt-auto flex items-center justify-between">
                                        <span className="font-bold text-base" style={{ color: course.color }}>
                                            {getPrice(course)}
                                        </span>
                                        <span className="text-[10px] px-3 py-1 rounded-full font-semibold" style={{ background: `${course.color}15`, color: course.color }}>
                                            Enroll →
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ═══ Course Detail Modal ═══ */}
                <AnimatePresence>
                    {selectedCourse && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                            onClick={() => setSelectedCourse(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="w-full max-w-lg rounded-3xl overflow-hidden max-h-[85vh] overflow-y-auto"
                                style={{ background: "rgba(12,12,14,0.98)", border: `1px solid ${selectedCourse.color}20` }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="h-2" style={{ background: `linear-gradient(90deg, transparent, ${selectedCourse.color}, transparent)` }} />
                                <div className="p-6">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: `${selectedCourse.color}15` }}>
                                            {selectedCourse.icon}
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-lg leading-snug" style={{ color: "var(--text-primary)" }}>{selectedCourse.title}</h2>
                                            <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>by {selectedCourse.instructor} • {selectedCourse.level}</p>
                                        </div>
                                    </div>

                                    <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>{selectedCourse.description}</p>

                                    <div className="flex items-center gap-4 mb-4 text-xs" style={{ color: "var(--text-secondary)" }}>
                                        <span>⏱ {selectedCourse.duration}</span>
                                        <span>📚 {selectedCourse.lessons} lessons</span>
                                        <span>📊 {selectedCourse.level}</span>
                                    </div>

                                    <div className="mb-5">
                                        <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-primary)" }}>What You'll Learn</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {selectedCourse.topics.map((t) => (
                                                <span key={t} className="text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1.5" style={{ background: `${selectedCourse.color}08`, color: "var(--text-secondary)" }}>
                                                    <span style={{ color: selectedCourse.color }}>✓</span> {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Pricing */}
                                    <div className="p-4 rounded-xl mb-4" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>Choose Currency</span>
                                        </div>
                                        <div className="flex gap-2 mb-3">
                                            {([
                                                { key: "usd" as const, label: "💵 USD" },
                                                { key: "lkr" as const, label: "🇱🇰 LKR" },
                                                { key: "usdt" as const, label: "₮ USDT" },
                                            ]).map((c) => (
                                                <button
                                                    key={c.key}
                                                    onClick={() => setCurrency(c.key)}
                                                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${currency === c.key ? "" : "border border-white/10"}`}
                                                    style={{
                                                        color: currency === c.key ? selectedCourse.color : "var(--text-secondary)",
                                                        outline: currency === c.key ? `2px solid ${selectedCourse.color}` : "none",
                                                        outlineOffset: "-1px",
                                                        background: currency === c.key ? `${selectedCourse.color}10` : "transparent",
                                                    }}
                                                >
                                                    {c.label}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="text-center">
                                            <span className="text-3xl font-bold" style={{ color: selectedCourse.color }}>
                                                {getPrice(selectedCourse)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            className="flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all hover:brightness-110"
                                            style={{ background: selectedCourse.color }}
                                        >
                                            🎓 Enroll Now — {getPrice(selectedCourse)}
                                        </button>
                                        <button
                                            onClick={() => setSelectedCourse(null)}
                                            className="px-5 py-3 rounded-xl text-sm font-medium hover:bg-white/10 transition-all"
                                            style={{ border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-secondary)" }}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ─── Ad: Banner ─── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
                    <AdPlacement format="banner" />
                </div>

                <Footer />
            </div>
        </div>
    );
}
