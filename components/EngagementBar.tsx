"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/components/ThemeProvider";
import CommentsSection from "@/components/CommentsSection";
import {
    subscribeEngagement,
    toggleLike,
    toggleRepost,
    incrementView,
    getUserState,
    setUserState,
    type EngagementData,
} from "@/lib/engagementService";

/* ─── Format counts ─── */
function fmt(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    return n > 0 ? n.toString() : "";
}

/* ─── Glow color map ─── */
const GLOW_COLORS: Record<string, string> = {
    Video: "#FF0000", Short: "#FF00E5", Course: "#3ea6ff", PDF: "#e11d48",
    Tool: "#2ba640", App: "#2563eb", News: "#F59E0B", Prompt: "#A855F7",
    Software: "#00E5FF", Update: "#EC4899", Photo: "#FF6B35", Album: "#FF4081",
};

/* ═══════════════════════════════════════════════
   X / Twitter-Style Icon Components
   ═══════════════════════════════════════════════ */
const IconComment = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
);
const IconRepost = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
);
const IconHeart = ({ filled }: { filled: boolean }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#f91880" : "none"} stroke={filled ? "#f91880" : "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
);
const IconShare = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
    </svg>
);
const IconBookmark = ({ filled }: { filled: boolean }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#1d9bf0" : "none"} stroke={filled ? "#1d9bf0" : "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
);
const IconEye = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
);
const IconCopy = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
);
const IconChat = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
);
const IconExternal = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
);

/* ═══════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════ */
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
    const viewRef = useRef<HTMLDivElement>(null);
    const viewedRef = useRef(false);
    const glowColor = GLOW_COLORS[contentType] ?? "#3ea6ff";

    /* ─── Firestore counts (real-time) ─── */
    const [counts, setCounts] = useState<EngagementData>({ likes: 0, reposts: 0, views: 0, commentCount: 0 });

    /* ─── User own-state (localStorage) ─── */
    const [liked, setLiked] = useState(false);
    const [reposted, setReposted] = useState(false);
    const [saved, setSaved] = useState(false);
    const [likeAnim, setLikeAnim] = useState(false);

    /* ─── UI state ─── */
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    /* ─── Load own-state + subscribe Firestore ─── */
    useEffect(() => {
        const own = getUserState(contentId);
        setLiked(own.liked);
        setReposted(own.reposted);
        setSaved(own.saved);

        const unsub = subscribeEngagement(contentId, setCounts);
        return unsub;
    }, [contentId]);

    /* ─── IntersectionObserver for view count ─── */
    useEffect(() => {
        if (viewedRef.current) return;
        const el = viewRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(([e]) => {
            if (e.isIntersecting && !viewedRef.current) {
                viewedRef.current = true;
                incrementView(contentId);
                obs.disconnect();
            }
        }, { threshold: 0.5 });
        obs.observe(el);
        return () => obs.disconnect();
    }, [contentId]);

    /* ─── Close share menu on outside click ─── */
    useEffect(() => {
        if (!showShareMenu) return;
        const h = () => setShowShareMenu(false);
        setTimeout(() => document.addEventListener("click", h), 0);
        return () => document.removeEventListener("click", h);
    }, [showShareMenu]);

    const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

    /* ─── Handlers ─── */
    const handleLike = (e: React.MouseEvent) => {
        e.stopPropagation();
        const next = !liked;
        setLiked(next);
        setCounts(c => ({ ...c, likes: Math.max(0, c.likes + (next ? 1 : -1)) }));
        if (next) { setLikeAnim(true); setTimeout(() => setLikeAnim(false), 600); }
        const own = getUserState(contentId);
        setUserState(contentId, { ...own, liked: next });
        toggleLike(contentId, liked);       // sync Firestore
    };

    const handleRepost = (e: React.MouseEvent) => {
        e.stopPropagation();
        const next = !reposted;
        setReposted(next);
        setCounts(c => ({ ...c, reposts: Math.max(0, c.reposts + (next ? 1 : -1)) }));
        if (next) flash("Reposted!");
        const own = getUserState(contentId);
        setUserState(contentId, { ...own, reposted: next });
        toggleRepost(contentId, reposted);
    };

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        const next = !saved;
        setSaved(next);
        if (next) flash("Saved!");
        const own = getUserState(contentId);
        setUserState(contentId, { ...own, saved: next });
    };

    const handleComment = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCommentsOpen(p => !p);
    };

    const handleShareClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowShareMenu(p => !p);
    };

    const handleCopyLink = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try { await navigator.clipboard.writeText(window.location.href); flash("Link copied!"); } catch { /* ignore */ }
        setShowShareMenu(false);
    };

    const handleShareToChat = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent("tecsub-share-content", {
            detail: { id: contentId, category: contentType, title: contentTitle ?? contentType },
        }));
        setShowShareMenu(false);
        flash("Opening chat…");
    };

    const handleExternal = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const url = window.location.href;
        try {
            if (navigator.share) { await navigator.share({ title: `TecSub – ${contentType}`, url }); }
            else { await navigator.clipboard.writeText(url); flash("Link copied!"); }
        } catch { try { await navigator.clipboard.writeText(url); flash("Link copied!"); } catch { /* ignore */ } }
        setShowShareMenu(false);
    };

    /* ─── CSS class helpers ─── */
    const xBtn = "x-engage-btn";

    return (
        <div ref={viewRef} className="engagement-wrapper" style={{ "--engage-glow": glowColor } as React.CSSProperties} onClick={e => e.stopPropagation()}>

            {/* ─── X-Style Bar ─── */}
            <div className={`x-engage-bar ${compact ? "compact" : ""}`}>

                {/* Comment */}
                <button onClick={handleComment} className={`${xBtn} x-btn-comment ${commentsOpen ? "active" : ""}`} title="Comments">
                    <span className="x-btn-icon"><IconComment /></span>
                    {counts.commentCount > 0 && <span className="x-btn-count">{fmt(counts.commentCount)}</span>}
                </button>

                {/* Repost */}
                <button onClick={handleRepost} className={`${xBtn} x-btn-repost ${reposted ? "active-repost" : ""}`} title="Repost">
                    <motion.span className="x-btn-icon" animate={reposted ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
                        <IconRepost />
                    </motion.span>
                    {counts.reposts > 0 && <span className="x-btn-count">{fmt(counts.reposts)}</span>}
                </button>

                {/* Like */}
                <button onClick={handleLike} className={`${xBtn} x-btn-like ${liked ? "active-like" : ""}`} title="Like">
                    <motion.span className="x-btn-icon" animate={likeAnim ? { scale: [1, 1.5, 1] } : {}} transition={{ duration: 0.4, type: "spring" }}>
                        <IconHeart filled={liked} />
                    </motion.span>
                    {counts.likes > 0 && <span className="x-btn-count">{fmt(counts.likes)}</span>}
                </button>

                {/* Share */}
                <div className="relative">
                    <button onClick={handleShareClick} className={`${xBtn} x-btn-share`} title="Share">
                        <span className="x-btn-icon"><IconShare /></span>
                    </button>
                    <AnimatePresence>
                        {showShareMenu && (
                            <motion.div initial={{ opacity: 0, scale: 0.9, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 4 }} transition={{ duration: 0.15 }} className="share-menu" onClick={e => e.stopPropagation()}>
                                <button onClick={handleCopyLink} className="share-menu-item"><IconCopy /> Copy link</button>
                                <button onClick={handleShareToChat} className="share-menu-item"><IconChat /> Share to Chat</button>
                                <button onClick={handleExternal} className="share-menu-item"><IconExternal /> Share externally</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Bookmark */}
                <button onClick={handleSave} className={`${xBtn} x-btn-bookmark ${saved ? "active-bookmark" : ""}`} title={saved ? "Saved" : "Save"}>
                    <span className="x-btn-icon"><IconBookmark filled={saved} /></span>
                </button>

                {/* Views — right-aligned */}
                {!compact && (
                    <div className="views-badge ml-auto">
                        <IconEye /><span>{fmt(counts.views)}</span>
                    </div>
                )}
            </div>

            {/* ─── Toast ─── */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="engagement-toast">{toast}</motion.div>
                )}
            </AnimatePresence>

            {/* ─── Comments ─── */}
            <CommentsSection contentId={contentId} isOpen={commentsOpen} />
        </div>
    );
}
