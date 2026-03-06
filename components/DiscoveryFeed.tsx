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

    videos.forEach((v) =>
        pool.push({
            id: `vid-${v.id}`,
            title: v.title,
            description: `Watch this ${v.title.toLowerCase()} video from TecSub Solutions on YouTube.`,
            category: "Video",
            icon: "🎬",
            color: "#FF0000",
            videoId: v.id,
        })
    );

    onlineTools.forEach((tool, i) =>
        pool.push({
            id: `tool-${i}`,
            title: tool.title,
            description: tool.description,
            category: "Tool",
            icon: typeof tool.icon === "string" && tool.icon.length <= 3 ? "🛠️" : tool.icon,
            color: "#2ba640",
            link: "/tools",
        })
    );

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

    courses.forEach((c, i) =>
        pool.push({
            id: `course-${i}`,
            title: c.title,
            description: c.description,
            category: "Course",
            icon: c.image,
            color: "#3ea6ff",
            videoId: c.videoId,
            link: `/course/${i}`,
        })
    );

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

/* ─── Skeleton Card ─── */
function SkeletonCard() {
    return (
        <div className="feed-card feed-skeleton">
            <div className="feed-card-thumbnail">
                <div className="w-full h-full skeleton-shimmer" />
            </div>
            <div className="feed-card-body">
                <div className="w-9 h-9 rounded-full skeleton-shimmer flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-11/12 rounded skeleton-shimmer" />
                    <div className="h-3 w-3/4 rounded skeleton-shimmer" />
                    <div className="h-3 w-1/2 rounded skeleton-shimmer" />
                </div>
            </div>
        </div>
    );
}

/* ─── Main Component ─── */
export default function DiscoveryFeed() {
    const { language } = useAppContext();
    const sentinelRef = useRef<HTMLDivElement>(null);

    const [displayCount, setDisplayCount] = useState(BATCH_SIZE);
    const [isLoading, setIsLoading] = useState(true);
    const [shuffledPool, setShuffledPool] = useState<FeedItem[]>([]);

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

    /* ─── Listen for external reshuffle event ─── */
    useEffect(() => {
        const handleReshuffle = () => initFeed();
        window.addEventListener("tecsub-reshuffle-feed", handleReshuffle);
        return () => window.removeEventListener("tecsub-reshuffle-feed", handleReshuffle);
    }, [initFeed]);

    /* ─── Auto-refresh on tab return ─── */
    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === "visible") {
                initFeed();
            }
        };
        const handleFocus = () => initFeed();

        document.addEventListener("visibilitychange", handleVisibility);
        window.addEventListener("focus", handleFocus);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibility);
            window.removeEventListener("focus", handleFocus);
        };
    }, [initFeed]);

    const displayed = shuffledPool.slice(0, displayCount);
    const hasMore = displayCount < shuffledPool.length;

    /* ─── Infinite Scroll ─── */
    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && hasMore && !isLoading) {
                    setDisplayCount((prev) => Math.min(prev + BATCH_SIZE, shuffledPool.length));
                }
            },
            { rootMargin: "200px" }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [hasMore, isLoading, shuffledPool.length]);

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
        <section id="discovery-feed">
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
                    <div className="flex items-center gap-2 text-sm" style={{ color: "var(--yt-text-secondary)" }}>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-5 h-5 border-2 border-[#3f3f3f] border-t-[#f1f1f1] rounded-full"
                        />
                        Loading...
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
                    <p className="text-sm mb-3" style={{ color: "var(--yt-text-secondary)" }}>
                        No more content to show
                    </p>
                    <button
                        onClick={initFeed}
                        className="chip-item chip-item-active"
                    >
                        🔄 Refresh feed
                    </button>
                </motion.div>
            )}
        </section>
    );
}
