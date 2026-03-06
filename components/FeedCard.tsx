"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

/* ─── Category Color Map ─── */
const categoryColors: Record<string, string> = {
    Video: "#FF0000",
    Tool: "#2ba640",
    News: "#F59E0B",
    Prompt: "#A855F7",
    Course: "#3ea6ff",
    Software: "#00E5FF",
    Update: "#EC4899",
};

const categoryEmojis: Record<string, string> = {
    Video: "🎬",
    Tool: "🛠️",
    News: "📰",
    Prompt: "🤖",
    Course: "🎓",
    Software: "💾",
    Update: "🚀",
};

/* ─── Feed Item Type ─── */
export interface FeedItem {
    id: string;
    title: string;
    description: string;
    category: string;
    icon: string;
    color: string;
    videoId?: string;
    link?: string;
}

/* ─── Random view / time helpers ─── */
function randomViews(): string {
    const n = Math.floor(Math.random() * 500) + 1;
    if (n >= 100) return `${(n / 10).toFixed(0)}K views`;
    return `${n} views`;
}

function randomTimeAgo(): string {
    const units = ["hours", "days", "weeks", "months"];
    const unit = units[Math.floor(Math.random() * units.length)];
    const n = Math.floor(Math.random() * 11) + 1;
    return `${n} ${unit} ago`;
}

function randomDuration(): string {
    const min = Math.floor(Math.random() * 25) + 1;
    const sec = Math.floor(Math.random() * 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
}

/* ─── Card Component ─── */
export default function FeedCard({
    item,
    index,
    onItemClick,
}: {
    item: FeedItem;
    index: number;
    onItemClick?: (item: FeedItem) => void;
}) {
    const color = categoryColors[item.category] || "#3ea6ff";
    const emoji = categoryEmojis[item.category] || "📌";
    const isVideo = item.category === "Video" || (item.category === "Course" && !!item.videoId);

    /* ─── Hover-to-play state ─── */
    const [isHovering, setIsHovering] = useState(false);
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = useCallback(() => {
        if (!isVideo || !item.videoId) return;
        hoverTimer.current = setTimeout(() => {
            setIsHovering(true);
        }, 500);
    }, [isVideo, item.videoId]);

    const handleMouseLeave = useCallback(() => {
        if (hoverTimer.current) {
            clearTimeout(hoverTimer.current);
            hoverTimer.current = null;
        }
        setIsHovering(false);
        setIframeLoaded(false);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: (index % 12) * 0.03 }}
            className="feed-card group"
            onClick={() => onItemClick?.(item)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* ─── Thumbnail ─── */}
            <div className="feed-card-thumbnail">
                {isVideo && item.videoId ? (
                    <>
                        {/* Poster Image */}
                        <img
                            src={`https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`}
                            alt={item.title}
                            className={`w-full h-full object-cover transition-opacity duration-300 ${isHovering && iframeLoaded ? "opacity-0" : "opacity-100"}`}
                            loading="lazy"
                        />

                        {/* YouTube iframe on hover */}
                        {isHovering && (
                            <iframe
                                className="feed-video-iframe"
                                src={`https://www.youtube.com/embed/${item.videoId}?autoplay=1&mute=1&loop=1&playlist=${item.videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
                                title={item.title}
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                onLoad={() => setIframeLoaded(true)}
                            />
                        )}

                        {/* LIVE badge when playing */}
                        {isHovering && iframeLoaded && (
                            <div className="feed-live-badge">
                                <span className="feed-live-dot" />
                                LIVE
                            </div>
                        )}

                        {/* Duration badge (bottom right) */}
                        {!isHovering && (
                            <div className="feed-duration-badge">
                                {randomDuration()}
                            </div>
                        )}
                    </>
                ) : (
                    /* ─── Static thumbnail for non-video items ─── */
                    <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                            background: `linear-gradient(135deg, ${color}20, ${color}10)`,
                        }}
                    >
                        <span className="text-5xl opacity-70 group-hover:scale-110 transition-transform duration-200">
                            {item.icon}
                        </span>
                    </div>
                )}

                {/* Category Badge (non-video) */}
                {!isVideo && (
                    <div className="feed-category-badge">
                        <span>{emoji}</span>
                        {item.category}
                    </div>
                )}
            </div>

            {/* ─── YouTube-Style Card Body: Avatar + Meta ─── */}
            <div className="feed-card-body">
                {/* Channel avatar */}
                <div
                    className="feed-card-avatar"
                    style={{ background: `linear-gradient(135deg, ${color}80, ${color}40)` }}
                >
                    {emoji}
                </div>

                {/* Meta info */}
                <div className="feed-card-meta">
                    <h3 className="feed-card-title">
                        {item.title}
                    </h3>
                    <div className="feed-card-channel">
                        Tecsub Solutions
                    </div>
                    <div className="feed-card-stats">
                        {randomViews()} · {randomTimeAgo()}
                    </div>
                </div>

                {/* Three dot menu */}
                <button
                    className="opacity-0 group-hover:opacity-100 transition-opacity self-start mt-1 p-1"
                    onClick={(e) => { e.stopPropagation(); }}
                    aria-label="More options"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#aaa">
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                </button>
            </div>
        </motion.div>
    );
}
