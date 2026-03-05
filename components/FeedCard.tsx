"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import EngagementBar from "@/components/EngagementBar";

/* ─── Category Color Map ─── */
const categoryColors: Record<string, string> = {
    Video: "#FF4444",
    Tool: "#22C55E",
    News: "#F59E0B",
    Prompt: "#A855F7",
    Course: "#3B82F6",
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
    const color = categoryColors[item.category] || "#00E5FF";
    const emoji = categoryEmojis[item.category] || "📌";
    const isVideo = item.category === "Video" || (item.category === "Course" && !!item.videoId);

    /* ─── Hover-to-play state ─── */
    const [isHovering, setIsHovering] = useState(false);
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = useCallback(() => {
        if (!isVideo || !item.videoId) return;
        // Small delay to avoid loading iframes on quick scroll-by
        hoverTimer.current = setTimeout(() => {
            setIsHovering(true);
        }, 400);
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
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, delay: (index % 12) * 0.04 }}
            className={`feed-card group ${isVideo ? "feed-card-video" : ""}`}
            onClick={() => onItemClick?.(item)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* ─── Thumbnail / Video Preview Area ─── */}
            <div className={`feed-card-thumbnail ${isVideo ? "feed-card-thumbnail-video" : ""}`}>
                {isVideo && item.videoId ? (
                    <>
                        {/* Poster / Thumbnail Image */}
                        <img
                            src={`https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`}
                            alt={item.title}
                            className={`w-full h-full object-cover transition-opacity duration-300 ${isHovering && iframeLoaded ? "opacity-0" : "opacity-100"}`}
                            loading="lazy"
                        />

                        {/* YouTube iframe — loads on hover for live preview */}
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

                        {/* Play Icon Overlay — fades out on hover/play */}
                        <div className={`feed-play-overlay ${isHovering ? "opacity-0" : "opacity-100"}`}>
                            <div className="feed-play-icon">
                                <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>

                        {/* LIVE badge for playing videos */}
                        {isHovering && iframeLoaded && (
                            <div className="feed-live-badge">
                                <span className="feed-live-dot" />
                                LIVE
                            </div>
                        )}
                    </>
                ) : (
                    /* ─── Static thumbnail for non-video items ─── */
                    <div
                        className="w-full h-full flex items-center justify-center"
                        style={{
                            background: `linear-gradient(135deg, ${color}15, ${color}08)`,
                        }}
                    >
                        <span className="text-4xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                            {item.icon}
                        </span>
                    </div>
                )}

                {/* Category Badge */}
                <div
                    className="feed-category-badge"
                    style={{
                        background: `${color}20`,
                        color: color,
                        border: `1px solid ${color}35`,
                        backdropFilter: "blur(8px)",
                    }}
                >
                    <span>{emoji}</span>
                    {item.category}
                </div>
            </div>

            {/* ─── Content ─── */}
            <div className="feed-card-body">
                <h3 className="feed-card-title">
                    {item.title}
                </h3>
                <p className="feed-card-desc">
                    {item.description}
                </p>

                {/* ─── Engagement Bar ─── */}
                <div onClick={(e) => e.stopPropagation()}>
                    <EngagementBar
                        contentId={`feed-${item.id}`}
                        contentType={item.category.toLowerCase()}
                        compact
                    />
                </div>
            </div>

            {/* Bottom glow line */}
            <div
                className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${color}60, transparent)` }}
            />
        </motion.div>
    );
}
