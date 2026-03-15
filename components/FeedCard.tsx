"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import EngagementBar from "@/components/EngagementBar";

/* ─── Category Color Map ─── */
const categoryColors: Record<string, string> = {
    Video: "#FF0000",
    Short: "#FF00E5",
    Tool: "#2ba640",
    News: "#F59E0B",
    Prompt: "#A855F7",
    Course: "#3ea6ff",
    Software: "#00E5FF",
    Update: "#EC4899",
    PDF: "#e11d48",
    App: "#2563eb",
    Photo: "#FF6B35",
    Album: "#FF4081",
    Image: "#E040FB",
    Wallpaper: "#7C4DFF",
    Book: "#FF8F00",
};

const categoryEmojis: Record<string, string> = {
    Video: "🎬",
    Short: "📱",
    Tool: "🛠️",
    News: "📰",
    Prompt: "🤖",
    Course: "🎓",
    Software: "💾",
    Update: "🚀",
    PDF: "📄",
    App: "📲",
    Photo: "📷",
    Album: "🖼️",
    Image: "🏞️",
    Wallpaper: "🎨",
    Book: "📚",
};

/* ─── Content Types ─── */
export type ContentType =
    | "long-video"
    | "short-video"
    | "photo-post"
    | "album"
    | "pdf"
    | "app"
    | "prompt"
    | "software"
    | "course"
    | "news"
    | "tool"
    | "default";

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
    contentType?: ContentType;
    isNew?: boolean;
    aspectRatio?: string;
    pdfUrl?: string;
    ctaLabel?: string;
    albumCount?: number;
}

/* ─── Helpers ─── */
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

function getAspectRatio(contentType?: ContentType): string {
    switch (contentType) {
        case "short-video": return "9 / 16";
        case "photo-post":
        case "album": return "4 / 5";
        case "pdf": return "3 / 4";
        default: return "16 / 9";
    }
}

function hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return "62, 166, 255";
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
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
    const contentType = item.contentType || "default";
    const isVideo = contentType === "long-video" || contentType === "short-video" || item.category === "Video" || (item.category === "Course" && !!item.videoId);
    const isShort = contentType === "short-video";
    const isPDF = contentType === "pdf" || item.category === "PDF";
    const isApp = contentType === "app" || item.category === "App";
    const isAlbum = contentType === "album";

    const [isHovering, setIsHovering] = useState(false);
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleMouseEnter = useCallback(() => {
        if (!isVideo || !item.videoId) return;
        hoverTimer.current = setTimeout(() => setIsHovering(true), 500);
    }, [isVideo, item.videoId]);

    const handleMouseLeave = useCallback(() => {
        if (hoverTimer.current) clearTimeout(hoverTimer.current);
        setIsHovering(false);
        setIframeLoaded(false);
    }, []);

    const glowStyle = {
        "--glow-color": color,
        "--glow-color-rgb": hexToRgb(color),
    } as React.CSSProperties;

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: (index % 12) * 0.03 }}
            className={`feed-card group feed-card-glow ${isShort ? "feed-card-short" : ""}`}
            style={glowStyle}
            onClick={() => {
                if (isPDF) {
                    window.dispatchEvent(new CustomEvent("tecsub-open-pdf", {
                        detail: { url: item.link || item.pdfUrl || "/sample.pdf", title: item.title }
                    }));
                } else {
                    onItemClick?.(item);
                }
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {item.isNew && <div className="feed-new-badge">NEW</div>}

            <div className={`feed-card-thumbnail ${isShort ? "feed-card-thumbnail-short" : ""}`} style={{ aspectRatio: getAspectRatio(contentType) }}>
                {isVideo && item.videoId ? (
                    <>
                        <img
                            src={`https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`}
                            alt={item.title}
                            className={`w-full h-full object-cover transition-opacity duration-300 ${isHovering && iframeLoaded ? "opacity-0" : "opacity-100"}`}
                            loading="lazy"
                        />
                        {isHovering && (
                            <iframe
                                className="feed-video-iframe"
                                src={`https://www.youtube.com/embed/${item.videoId}?autoplay=1&mute=1&loop=1&playlist=${item.videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
                                title={item.title}
                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                onLoad={() => setIframeLoaded(true)}
                            />
                        )}
                        {isHovering && iframeLoaded && <div className="feed-live-badge"><span className="feed-live-dot" /> LIVE</div>}
                        {isShort && <div className="feed-short-indicator">Shorts</div>}
                        {!isHovering && !isShort && <div className="feed-duration-badge">{randomDuration()}</div>}
                    </>
                ) : isPDF ? (
                    <div className="feed-pdf-preview">
                        <div className="feed-pdf-icon-area">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="#e11d48"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h6v6h6v10H6z" /></svg>
                            <span className="feed-pdf-label">PDF</span>
                        </div>
                    </div>
                ) : isApp ? (
                    <div className="feed-app-preview">
                        <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${color}30, ${color}10)` }}>
                            <span className="text-6xl">{item.icon}</span>
                        </div>
                    </div>
                ) : isAlbum ? (
                    <div className="w-full h-full flex items-center justify-center relative" style={{ background: `linear-gradient(135deg, ${color}25, ${color}08)` }}>
                        <span className="text-5xl opacity-70">{item.icon}</span>
                        <div className="feed-album-indicator">{item.albumCount || 3}</div>
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${color}20, ${color}10)` }}>
                        <span className="text-5xl opacity-70 group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                    </div>
                )}
                {!isVideo && !isPDF && !isApp && (
                    <div className="feed-category-badge"><span>{emoji}</span> {item.category}</div>
                )}
            </div>

            <div className="feed-card-body">
                <div className="feed-card-avatar" style={{ background: `linear-gradient(135deg, ${color}80, ${color}40)` }}>{emoji}</div>
                <div className="feed-card-meta">
                    <h3 className="feed-card-title">{item.title}</h3>
                    <div className="feed-card-channel">Tecsub Solutions</div>
                    <div className="feed-card-stats">{randomViews()} · {randomTimeAgo()}</div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity self-start mt-1 p-1" onClick={(e) => e.stopPropagation()}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#aaa"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
                </button>
            </div>

            <EngagementBar contentId={item.id} contentType={item.category} contentTitle={item.title} compact />
        </motion.div>
    );
}