"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/components/ThemeProvider";
import { t } from "@/data/translations";
import CommentsSection from "@/components/CommentsSection";

/* ─── SVG Icons ─── */
const HeartIcon = ({ filled }: { filled: boolean }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#FF4444" : "none"} stroke={filled ? "#FF4444" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);

const RepostIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
);

const ShareIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
);

const BookmarkIcon = ({ filled }: { filled: boolean }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "var(--cyan, #00E5FF)" : "none"} stroke={filled ? "var(--cyan, #00E5FF)" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
);

const CommentIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);

const EyeIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

/* ─── Glow color map by content type ─── */
const GLOW_COLORS: Record<string, string> = {
    Video: "#FF0000",
    Short: "#FF00E5",
    Course: "#3ea6ff",
    PDF: "#e11d48",
    Tool: "#2ba640",
    App: "#2563eb",
    News: "#F59E0B",
    Prompt: "#A855F7",
    Software: "#00E5FF",
    Update: "#EC4899",
    Photo: "#FF6B35",
    Album: "#FF4081",
    Book: "#FF8F00",
};

/* ─── Helper to format numbers ─── */
function formatCount(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    return n.toString();
}

/* ─── Main Component ─── */
export default function EngagementBar({
    contentId,
    contentType = "general",
    contentTitle,
    compact = false,
}: {
    contentId: string;
    contentType?: string;
    contentTitle?: string;
    compact?: boolean;
}) {
    const { language } = useAppContext();
    const ref = useRef<HTMLDivElement>(null);
    const viewedRef = useRef(false);

    const storageKey = `tecsub-engage-${contentType}-${contentId}`;
    const glowColor = GLOW_COLORS[contentType] || "#3ea6ff";

    /* ─── State ─── */
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const [reposted, setReposted] = useState(false);
    const [reposts, setReposts] = useState(0);
    const [saved, setSaved] = useState(false);
    const [views, setViews] = useState(0);
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [commentCount, setCommentCount] = useState(0);
    const [showToast, setShowToast] = useState<string | null>(null);
    const [likeAnim, setLikeAnim] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);

    /* ─── Load persisted state ─── */
    useEffect(() => {
        try {
            const raw = localStorage.getItem(storageKey);
            if (raw) {
                const data = JSON.parse(raw);
                setLiked(data.liked || false);
                setLikes(data.likes || 0);
                setReposted(data.reposted || false);
                setReposts(data.reposts || 0);
                setSaved(data.saved || false);
                setViews(data.views || 0);
            }
            const commentsRaw = localStorage.getItem(`tecsub-comments-${contentId}`);
            if (commentsRaw) {
                const comments = JSON.parse(commentsRaw);
                setCommentCount(comments.length);
            }
        } catch { /* ignore */ }
    }, [storageKey, contentId]);

    /* ─── Persist helper ─── */
    const persist = useCallback((updates: Record<string, unknown>) => {
        try {
            const raw = localStorage.getItem(storageKey);
            const current = raw ? JSON.parse(raw) : {};
            const merged = { ...current, ...updates };
            localStorage.setItem(storageKey, JSON.stringify(merged));
        } catch { /* ignore */ }
    }, [storageKey]);

    /* ─── Views: Intersection Observer ─── */
    useEffect(() => {
        if (viewedRef.current) return;
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !viewedRef.current) {
                    viewedRef.current = true;
                    setViews((prev) => {
                        const next = prev + 1;
                        persist({ views: next });
                        return next;
                    });
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [persist]);

    /* ─── Close share menu on outside click ─── */
    useEffect(() => {
        if (!showShareMenu) return;
        const handler = () => setShowShareMenu(false);
        setTimeout(() => document.addEventListener("click", handler), 0);
        return () => document.removeEventListener("click", handler);
    }, [showShareMenu]);

    /* ─── Toast helper ─── */
    const flash = (msg: string) => {
        setShowToast(msg);
        setTimeout(() => setShowToast(null), 2000);
    };

    /* ─── Handlers ─── */
    const toggleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        const next = !liked;
        const nextCount = next ? likes + 1 : likes - 1;
        setLiked(next);
        setLikes(nextCount);
        if (next) { setLikeAnim(true); setTimeout(() => setLikeAnim(false), 600); }
        persist({ liked: next, likes: nextCount });
    };

    const toggleRepost = (e: React.MouseEvent) => {
        e.stopPropagation();
        const next = !reposted;
        const nextCount = next ? reposts + 1 : reposts - 1;
        setReposted(next);
        setReposts(nextCount);
        if (next) flash(t(language, "reposted") + "!");
        persist({ reposted: next, reposts: nextCount });
    };

    const handleShareClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowShareMenu((prev) => !prev);
    };

    const handleCopyLink = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const url = typeof window !== "undefined" ? window.location.href : "";
        try {
            await navigator.clipboard.writeText(url);
            flash(t(language, "copied") || "Link copied!");
        } catch { /* ignore */ }
        setShowShareMenu(false);
    };

    const handleShareToChat = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent("tecsub-share-content", {
            detail: {
                id: contentId,
                category: contentType,
                title: contentTitle || contentType,
            },
        }));
        setShowShareMenu(false);
        flash("Opening chat...");
    };

    const handleExternalShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const url = typeof window !== "undefined" ? window.location.href : "";
        try {
            if (navigator.share) {
                await navigator.share({ title: `TecSub – ${contentType}`, url });
            } else {
                await navigator.clipboard.writeText(url);
                flash(t(language, "copied") || "Link copied!");
            }
        } catch {
            try {
                await navigator.clipboard.writeText(url);
                flash(t(language, "copied") || "Link copied!");
            } catch { /* ignore */ }
        }
        setShowShareMenu(false);
    };

    const toggleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        const next = !saved;
        setSaved(next);
        if (next) flash(t(language, "saved") + "!");
        persist({ saved: next });
    };

    const toggleComments = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCommentsOpen((prev) => !prev);
        try {
            const raw = localStorage.getItem(`tecsub-comments-${contentId}`);
            if (raw) setCommentCount(JSON.parse(raw).length);
        } catch { /* ignore */ }
    };

    const glowStyle = {
        "--engage-glow": glowColor,
    } as React.CSSProperties;

    return (
        <div ref={ref} className="engagement-wrapper" style={glowStyle} onClick={(e) => e.stopPropagation()}>
            {/* ─── Engagement Bar ─── */}
            <div className={`engagement-bar engagement-bar-glow ${compact ? "engagement-bar-compact" : ""}`}>
                {/* Like */}
                <button onClick={toggleLike} className={`engagement-btn engagement-btn-glow ${liked ? "active" : ""}`} title={t(language, liked ? "liked" : "like")}>
                    <motion.span
                        animate={likeAnim ? { scale: [1, 1.4, 1] } : {}}
                        transition={{ duration: 0.4 }}
                        className="inline-flex"
                    >
                        <HeartIcon filled={liked} />
                    </motion.span>
                    {likes > 0 && <span className="engagement-count">{formatCount(likes)}</span>}
                </button>

                {/* Repost */}
                <button onClick={toggleRepost} className={`engagement-btn engagement-btn-glow ${reposted ? "active reposted" : ""}`} title={t(language, "repost")}>
                    <RepostIcon />
                    {reposts > 0 && <span className="engagement-count">{formatCount(reposts)}</span>}
                </button>

                {/* Comment */}
                <button onClick={toggleComments} className={`engagement-btn engagement-btn-glow ${commentsOpen ? "active" : ""}`} title={t(language, "comment")}>
                    <CommentIcon />
                    {commentCount > 0 && <span className="engagement-count">{formatCount(commentCount)}</span>}
                </button>

                {/* Share */}
                <div className="relative">
                    <button onClick={handleShareClick} className="engagement-btn engagement-btn-glow" title={t(language, "share")}>
                        <ShareIcon />
                    </button>

                    {/* Share Menu */}
                    <AnimatePresence>
                        {showShareMenu && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 4 }}
                                transition={{ duration: 0.15 }}
                                className="share-menu"
                            >
                                <button onClick={handleCopyLink} className="share-menu-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                                    Copy link
                                </button>
                                <button onClick={handleShareToChat} className="share-menu-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                    Share to Chat
                                </button>
                                <button onClick={handleExternalShare} className="share-menu-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                                    Share externally
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Save */}
                <button onClick={toggleSave} className={`engagement-btn engagement-btn-glow ${saved ? "active saved" : ""}`} title={t(language, saved ? "saved" : "save")}>
                    <BookmarkIcon filled={saved} />
                </button>

                {/* Views */}
                {!compact && (
                    <div className="views-badge ml-auto">
                        <EyeIcon />
                        <span>{formatCount(views)} {t(language, "views")}</span>
                    </div>
                )}
            </div>

            {/* ─── Toast ─── */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="engagement-toast"
                    >
                        {showToast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── Comments Section ─── */}
            <CommentsSection contentId={contentId} isOpen={commentsOpen} />
        </div>
    );
}
