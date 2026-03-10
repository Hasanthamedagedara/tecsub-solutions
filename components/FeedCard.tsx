"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

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

/* ─── Aspect Ratio Helper ─── */
function getAspectRatio(contentType?: ContentType): string {
    switch (contentType) {
        case "short-video":
            return "9 / 16";
        case "photo-post":
            return "4 / 5";
        case "album":
            return "4 / 5";
        case "pdf":
            return "3 / 4";
        default:
            return "16 / 9";
    }
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
    const isPhoto = contentType === "photo-post";

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

    /* ─── Glow color for card borders ─── */
    const glowStyle = {
        "--glow-color": color,
        "--glow-color-rgb": hexToRgb(color),
    } as React.CSSProperties;

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: (index % 12) * 0.03 }}
                className={`feed-card group feed-card-glow ${isShort ? "feed-card-short" : ""}`}
                style={glowStyle}
                onClick={() => {
                    if (isPDF) {
                        window.dispatchEvent(
                            new CustomEvent("tecsub-open-pdf", {
                                detail: {
                                    url: item.link || item.pdfUrl || "/sample.pdf",
                                    title: item.title,
                                },
                            })
                        );
                    } else {
                        onItemClick?.(item);
                    }
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* ─── NEW Badge ─── */}
                {item.isNew && (
                    <div className="feed-new-badge">NEW</div>
                )}

                {/* ─── Thumbnail ─── */}
                <div
                    className={`feed-card-thumbnail ${isShort ? "feed-card-thumbnail-short" : ""}`}
                    style={{ aspectRatio: getAspectRatio(contentType) }}
                >
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

                            {/* Short video indicator */}
                            {isShort && (
                                <div className="feed-short-indicator">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                        <path d="M10 9.27l4 2.73-4 2.73V9.27M8 5v14l11-7L8 5z" />
                                    </svg>
                                    Shorts
                                </div>
                            )}

                            {/* Duration badge (bottom right) */}
                            {!isHovering && !isShort && (
                                <div className="feed-duration-badge">
                                    {randomDuration()}
                                </div>
                            )}
                        </>
                    ) : isPDF ? (
                        /* ─── PDF Preview Card ─── */
                        <div className="feed-pdf-preview">
                            <div className="feed-pdf-icon-area">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="#e11d48">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h6v6h6v10H6z" />
                                </svg>
                                <span className="feed-pdf-label">PDF</span>
                            </div>
                            <div className="feed-pdf-badge">PDF</div>
                            <div className="feed-pdf-cta-bar">
                                <span className="feed-pdf-cta-text">📄 Download PDF</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                                </svg>
                            </div>
                        </div>
                    ) : isApp ? (
                        /* ─── App Install Card (Instagram Sponsored Style) ─── */
                        <div className="feed-app-preview">
                            <div className="w-full h-full flex items-center justify-center"
                                style={{ background: `linear-gradient(135deg, ${color}30, ${color}10)` }}
                            >
                                <span className="text-6xl">{item.icon}</span>
                            </div>
                            <div className="feed-app-cta-bar">
                                <span>Install Now</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                                </svg>
                            </div>
                        </div>
                    ) : isAlbum ? (
                        /* ─── Album / Multi-photo Post ─── */
                        <div className="w-full h-full flex items-center justify-center relative"
                            style={{ background: `linear-gradient(135deg, ${color}25, ${color}08)` }}
                        >
                            <span className="text-5xl opacity-70">{item.icon}</span>
                            <div className="feed-album-indicator">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                                    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                                </svg>
                                {item.albumCount || 3}
                            </div>
                        </div>
                    ) : (
                        /* ─── Default thumbnail for non-video items ─── */
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

                    {/* Category Badge */}
                    {!isVideo && !isPDF && !isApp && (
                        <div className="feed-category-badge">
                            <span>{emoji}</span>
                            {item.category}
                        </div>
                    )}
                </div>

                {/* ─── Instagram-Style CTA for App/PDF ─── */}
                {(isApp || isPDF) && (
                    <div className={`feed-cta-bar ${isApp ? "feed-cta-blue" : "feed-cta-dark"}`}>
                        <span className="feed-cta-label">
                            {isApp ? "Install Now" : `Download PDF`}
                        </span>
                        <span className="feed-cta-info">
                            {isApp ? "Free" : "Click to Read"}
                        </span>
                    </div>
                )}

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
                {/* ─── Social Action Bar ─── */}
                <div className="flex items-center justify-between w-full px-2 pt-2 pb-1 border-t border-[rgba(255,255,255,0.05)] mt-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); /* Add Like Logic */ }}
                        className="flex items-center gap-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 hover:shadow-[0_0_10px_rgba(239,68,68,0.3)] transition-all px-3 py-1.5 rounded-full"
                        title="Like"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                        <span className="text-xs font-medium">1.2k</span>
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); /* Add Comment Logic */ }}
                        className="flex items-center gap-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 hover:shadow-[0_0_10px_rgba(96,165,250,0.3)] transition-all px-3 py-1.5 rounded-full"
                        title="Comment"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z" /></svg>
                        <span className="text-xs font-medium">48</span>
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); /* Add Repost Logic */ }}
                        className="flex items-center gap-2 text-gray-400 hover:text-green-400 hover:bg-green-400/10 hover:shadow-[0_0_10px_rgba(74,222,128,0.3)] transition-all px-3 py-1.5 rounded-full"
                        title="Repost"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 7v4H5.83l3.58-3.59L8 6l-6 6 6 6 1.41-1.41L5.83 13H21V7h-2z" /></svg>
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            /* Add Share to Chat Logic */
                            window.dispatchEvent(new CustomEvent("tecsub-share-content", { detail: item }));
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity self-start mt-1 p-1"
                        onClick={(e) => { e.stopPropagation(); }}
                        aria-label="More options"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#aaa">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                    </button>
                </div>
                {/* ─── Social Action Bar ─── */}
                <div className="flex items-center justify-between w-full px-2 pt-2 pb-1 border-t border-[rgba(255,255,255,0.05)] mt-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); /* Add Like Logic */ }}
                        className="flex items-center gap-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 hover:shadow-[0_0_10px_rgba(239,68,68,0.3)] transition-all px-3 py-1.5 rounded-full"
                        title="Like"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                        <span className="text-xs font-medium">1.2k</span>
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); /* Add Comment Logic */ }}
                        className="flex items-center gap-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 hover:shadow-[0_0_10px_rgba(96,165,250,0.3)] transition-all px-3 py-1.5 rounded-full"
                        title="Comment"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z" /></svg>
                        <span className="text-xs font-medium">48</span>
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); /* Add Repost Logic */ }}
                        className="flex items-center gap-2 text-gray-400 hover:text-green-400 hover:bg-green-400/10 hover:shadow-[0_0_10px_rgba(74,222,128,0.3)] transition-all px-3 py-1.5 rounded-full"
                        title="Repost"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 7v4H5.83l3.58-3.59L8 6l-6 6 6 6 1.41-1.41L5.83 13H21V7h-2z" /></svg>
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            /* Add Share to Chat Logic */
                            window.dispatchEvent(new CustomEvent("tecsub-share-content", { detail: item }));
                        }}
                        className="flex items-center gap-2 text-gray-400 hover:text-purple-400 hover:bg-purple-400/10 hover:shadow-[0_0_10px_rgba(192,132,252,0.3)] transition-all px-3 py-1.5 rounded-full"
                        title="Share"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z" /></svg>
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); /* Fixed Save Logic */ }}
                        className="flex items-center gap-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 hover:shadow-[0_0_10px_rgba(250,204,21,0.3)] transition-all px-3 py-1.5 rounded-full ml-auto"
                        title="Save"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" /></svg>
                    </button>
                </div>
            </motion.div>
            );
}

            /* ─── Hex to RGB helper ─── */
            function hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            if (!result) return "62, 166, 255";
            return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}
