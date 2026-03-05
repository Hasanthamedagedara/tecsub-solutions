"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/components/ThemeProvider";
import { t } from "@/data/translations";
import FeedCard from "@/components/FeedCard";
import type { FeedItem } from "@/components/FeedCard";
import {
    videos,
    onlineTools,
    techNews,
    aiPrompts,
    courses,
    downloads,
} from "@/data/product";

/* ─── Build the unified pool of all content ─── */
function buildFeedPool(): FeedItem[] {
    const pool: FeedItem[] = [];

    // Videos
    videos.forEach((v) =>
        pool.push({
            id: `vid-${v.id}`,
            title: v.title,
            description: `Watch this ${v.title.toLowerCase()} video from TecSub Solutions on YouTube.`,
            category: "Video",
            icon: "🎬",
            color: "#FF4444",
            videoId: v.id,
        })
    );

    // Online Tools
    onlineTools.forEach((tool, i) =>
        pool.push({
            id: `tool-${i}`,
            title: tool.title,
            description: tool.description,
            category: "Tool",
            icon: typeof tool.icon === "string" && tool.icon.length <= 3 ? "🛠️" : tool.icon,
            color: "#22C55E",
            link: "/tools",
        })
    );

    // Tech News
    techNews.forEach((news, i) =>
        pool.push({
            id: `news-${i}`,
            title: news.title,
            description: news.summary,
            category: "News",
            icon: "📰",
            color: "#F59E0B",
        })
    );

    // AI Prompts
    aiPrompts.forEach((p, i) =>
        pool.push({
            id: `prompt-${i}`,
            title: p.title,
            description: p.description,
            category: "Prompt",
            icon: "🤖",
            color: "#A855F7",
            link: "/prompts",
        })
    );

    // Courses
    courses.forEach((c, i) =>
        pool.push({
            id: `course-${i}`,
            title: c.title,
            description: c.description,
            category: "Course",
            icon: c.image,
            color: "#3B82F6",
            videoId: c.videoId,
            link: `/course/${i}`,
        })
    );

    // Software Downloads
    downloads.forEach((sw, i) =>
        pool.push({
            id: `sw-${i}`,
            title: sw.name,
            description: sw.description,
            category: "Software",
            icon: sw.icon,
            color: "#00E5FF",
            link: sw.url,
        })
    );

    return pool;
}

/* ─── Fisher-Yates shuffle ─── */
function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const BATCH_SIZE = 12;

/* ─── Filter categories ─── */
const FILTER_CATEGORIES = [
    { key: "All", color: "#00E5FF" },
    { key: "Video", color: "#FF4444" },
    { key: "Tool", color: "#22C55E" },
    { key: "News", color: "#F59E0B" },
    { key: "Prompt", color: "#A855F7" },
    { key: "Course", color: "#3B82F6" },
    { key: "Software", color: "#00E5FF" },
];

/* ─── Skeleton Card ─── */
function SkeletonCard() {
    return (
        <div className="feed-card feed-skeleton">
            <div className="feed-card-thumbnail">
                <div className="w-full h-full skeleton-shimmer" />
            </div>
            <div className="feed-card-body">
                <div className="h-4 w-3/4 rounded skeleton-shimmer mb-2" />
                <div className="h-3 w-full rounded skeleton-shimmer mb-1" />
                <div className="h-3 w-2/3 rounded skeleton-shimmer" />
            </div>
        </div>
    );
}

/* ─── Main Component ─── */
export default function DiscoveryFeed() {
    const { language } = useAppContext();
    const sentinelRef = useRef<HTMLDivElement>(null);
    const chipScrollRef = useRef<HTMLDivElement>(null);

    const [activeFilter, setActiveFilter] = useState("All");
    const [displayCount, setDisplayCount] = useState(BATCH_SIZE);
    const [isLoading, setIsLoading] = useState(true);
    const [shuffledPool, setShuffledPool] = useState<FeedItem[]>([]);

    /* ─── Build & shuffle pool ─── */
    const rawPool = useMemo(() => buildFeedPool(), []);

    const initFeed = useCallback(() => {
        setIsLoading(true);
        setShuffledPool(shuffle(rawPool));
        setDisplayCount(BATCH_SIZE);
        setTimeout(() => setIsLoading(false), 400);
    }, [rawPool]);

    useEffect(() => {
        initFeed();
    }, [initFeed]);

    /* ─── Listen for external reshuffle event (e.g. "All" tab click) ─── */
    useEffect(() => {
        const handleReshuffle = () => initFeed();
        window.addEventListener("tecsub-reshuffle-feed", handleReshuffle);
        return () => window.removeEventListener("tecsub-reshuffle-feed", handleReshuffle);
    }, [initFeed]);

    /* ─── Filtered items ─── */
    const filtered = useMemo(() => {
        if (activeFilter === "All") return shuffledPool;
        return shuffledPool.filter((item) => item.category === activeFilter);
    }, [shuffledPool, activeFilter]);

    const displayed = filtered.slice(0, displayCount);
    const hasMore = displayCount < filtered.length;

    /* ─── Infinite Scroll via Intersection Observer ─── */
    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && hasMore && !isLoading) {
                    setDisplayCount((prev) => Math.min(prev + BATCH_SIZE, filtered.length));
                }
            },
            { rootMargin: "200px" }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [hasMore, isLoading, filtered.length]);

    /* ─── Handlers ─── */
    const handleFilterChange = (key: string) => {
        setActiveFilter(key);
        setDisplayCount(BATCH_SIZE);
    };

    const handleRefresh = () => {
        initFeed();
    };

    const handleItemClick = (item: FeedItem) => {
        if (item.videoId) {
            window.open(`https://www.youtube.com/watch?v=${item.videoId}`, "_blank");
        } else if (item.link && item.link !== "#") {
            if (item.link.startsWith("http")) {
                window.open(item.link, "_blank");
            } else {
                window.location.href = item.link;
            }
        }
    };

    return (
        <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* ─── Section Header ─── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-2.5 mb-3">
                        <div className="relative flex items-center justify-center">
                            <span className="absolute w-4 h-4 rounded-full bg-tecsubCyan/30 animate-ping" />
                            <span className="relative w-2.5 h-2.5 rounded-full bg-tecsubCyan" />
                        </div>
                        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-tecsubCyan">
                            {t(language, "discover")}
                        </span>
                    </div>
                    <h2 className="font-bebas text-4xl sm:text-6xl md:text-7xl gradient-text leading-[0.95]">
                        {t(language, "discover")}
                    </h2>
                    <p className="mt-3 text-base sm:text-lg max-w-xl font-light" style={{ color: "var(--text-secondary)" }}>
                        {t(language, "discover_sub")}
                    </p>
                </div>

                {/* Refresh Button */}
                <motion.button
                    whileHover={{ scale: 1.05, rotate: 180 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    onClick={handleRefresh}
                    className="feed-refresh-btn"
                    title={t(language, "refresh_feed")}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </motion.button>
            </div>

            {/* ─── Filter Chips ─── */}
            <div className="relative mb-8">
                {/* Fade edges */}
                <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[var(--navy)] to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[var(--navy)] to-transparent z-10 pointer-events-none" />

                <div
                    ref={chipScrollRef}
                    className="flex items-center gap-2.5 overflow-x-auto px-2 py-1 scrollbar-hide"
                    style={{ scrollbarWidth: "none" }}
                >
                    {FILTER_CATEGORIES.map((cat) => (
                        <motion.button
                            key={cat.key}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleFilterChange(cat.key)}
                            className={`feed-chip ${activeFilter === cat.key ? "feed-chip-active" : ""}`}
                            style={
                                activeFilter === cat.key
                                    ? { background: `${cat.color}20`, borderColor: `${cat.color}50`, color: cat.color }
                                    : {}
                            }
                        >
                            {t(language, `filter_${cat.key.toLowerCase()}`)}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* ─── Feed Grid ─── */}
            <div className="feed-grid">
                <AnimatePresence mode="popLayout">
                    {isLoading
                        ? Array.from({ length: BATCH_SIZE }).map((_, i) => <SkeletonCard key={`skel-${i}`} />)
                        : displayed.map((item, i) => (
                            <FeedCard
                                key={item.id}
                                item={item}
                                index={i}
                                onItemClick={handleItemClick}
                            />
                        ))}
                </AnimatePresence>
            </div>

            {/* ─── Infinite Scroll Sentinel ─── */}
            {hasMore && !isLoading && (
                <div ref={sentinelRef} className="flex justify-center py-8">
                    <div className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-4 h-4 border-2 border-tecsubCyan/30 border-t-tecsubCyan rounded-full"
                        />
                        {t(language, "loading_more")}
                    </div>
                </div>
            )}

            {/* ─── End of Feed ─── */}
            {!hasMore && !isLoading && displayed.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                >
                    <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
                        {t(language, "no_more_items")}
                    </p>
                    <button onClick={handleRefresh} className="feed-chip feed-chip-active" style={{ background: "rgba(0, 229, 255, 0.1)", borderColor: "rgba(0, 229, 255, 0.3)", color: "#00E5FF" }}>
                        🔄 {t(language, "refresh_feed")}
                    </button>
                </motion.div>
            )}
        </section>
    );
}
