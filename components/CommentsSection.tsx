"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    subscribeComments,
    addComment,
    addReply,
    toggleCommentLike,
    getSessionId,
    type FireComment,
} from "@/lib/engagementService";

/* ─── Helpers ─── */
const AVATARS = ["🧑‍💻", "👩‍🎨", "🧑‍🔬", "👨‍🚀", "👩‍💼", "🧑‍🎓", "👨‍🏫", "👩‍⚕️"];
const NAMES = ["TechUser", "CodeNinja", "DigitalPro", "ByteMaster", "PixelDev", "CloudRunner", "DataWiz", "NetBuilder"];
function getRandomAvatar() { return AVATARS[Math.floor(Math.random() * AVATARS.length)]; }
function getRandomName() { return NAMES[Math.floor(Math.random() * NAMES.length)] + Math.floor(Math.random() * 999); }
function timeAgo(ts: number): string {
    const d = Date.now() - ts;
    const m = Math.floor(d / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
}

/* ─── Persistent anonymous user ─── */
function getMyProfile(): { name: string; avatar: string } {
    if (typeof window === "undefined") return { name: "You", avatar: "🧑‍💻" };
    const stored = localStorage.getItem("tecsub-profile");
    if (stored) return JSON.parse(stored);
    const profile = { name: getRandomName(), avatar: getRandomAvatar() };
    localStorage.setItem("tecsub-profile", JSON.stringify(profile));
    return profile;
}

/* ═══════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════ */
export default function CommentsSection({ contentId, isOpen }: { contentId: string; isOpen: boolean }) {
    const [comments, setComments] = useState<FireComment[]>([]);
    const [newText, setNewText] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const sessionId = typeof window !== "undefined" ? getSessionId() : "anon";

    /* ─── Real-time Firestore listener ─── */
    useEffect(() => {
        if (!isOpen) return;
        const unsub = subscribeComments(contentId, setComments);
        return unsub;
    }, [contentId, isOpen]);

    const handleAddComment = async () => {
        if (!newText.trim() || isSubmitting) return;
        setIsSubmitting(true);
        const { name, avatar } = getMyProfile();
        await addComment(contentId, newText.trim(), name, avatar);
        setNewText("");
        setIsSubmitting(false);
    };

    const handleAddReply = async (commentId: string) => {
        if (!replyText.trim() || isSubmitting) return;
        setIsSubmitting(true);
        const { name, avatar } = getMyProfile();
        await addReply(contentId, commentId, replyText.trim(), name, avatar);
        setReplyText("");
        setReplyingTo(null);
        setIsSubmitting(false);
    };

    const handleLikeComment = (commentId: string, currentlyLiked: boolean) => {
        toggleCommentLike(contentId, commentId, currentlyLiked);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="comments-section overflow-hidden"
            >
                {/* ─── New Comment Input ─── */}
                <div className="comment-input-row">
                    <span className="comment-avatar">{getMyProfile().avatar}</span>
                    <div className="flex-1 flex gap-2">
                        <input
                            className="comment-input"
                            placeholder="Add a comment…"
                            value={newText}
                            onChange={e => setNewText(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleAddComment()}
                        />
                        <button
                            onClick={handleAddComment}
                            disabled={!newText.trim() || isSubmitting}
                            className="comment-submit-btn"
                        >
                            {isSubmitting ? "…" : "Post"}
                        </button>
                    </div>
                </div>

                {/* ─── Comments List ─── */}
                {comments.length === 0 ? (
                    <p className="comment-empty">Be the first to comment 💬</p>
                ) : (
                    <div className="comments-list">
                        {comments.map(c => {
                            const iLikedThis = c.likedBy.includes(sessionId);
                            return (
                                <motion.div
                                    key={c.id}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="comment-item"
                                >
                                    {/* Author row */}
                                    <div className="comment-header">
                                        <span className="comment-avatar">{c.avatar}</span>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="comment-author">{c.author}</span>
                                                <span className="comment-time">{timeAgo(c.timestamp)}</span>
                                            </div>
                                            <p className="comment-body">{c.text}</p>
                                            <div className="comment-actions">
                                                <button
                                                    onClick={() => handleLikeComment(c.id, iLikedThis)}
                                                    className={`comment-like-btn ${iLikedThis ? "liked" : ""}`}
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill={iLikedThis ? "#f91880" : "none"} stroke={iLikedThis ? "#f91880" : "currentColor"} strokeWidth="2">
                                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                                    </svg>
                                                    {c.likes > 0 && <span>{c.likes}</span>}
                                                </button>
                                                <button
                                                    onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
                                                    className="comment-reply-btn"
                                                >
                                                    Reply
                                                </button>
                                            </div>

                                            {/* Reply input */}
                                            {replyingTo === c.id && (
                                                <div className="reply-input-row">
                                                    <input
                                                        className="comment-input"
                                                        placeholder={`Reply to ${c.author}…`}
                                                        value={replyText}
                                                        onChange={e => setReplyText(e.target.value)}
                                                        onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleAddReply(c.id)}
                                                        autoFocus
                                                    />
                                                    <button
                                                        onClick={() => handleAddReply(c.id)}
                                                        disabled={!replyText.trim() || isSubmitting}
                                                        className="comment-submit-btn"
                                                    >
                                                        {isSubmitting ? "…" : "Reply"}
                                                    </button>
                                                </div>
                                            )}

                                            {/* Replies */}
                                            {c.replies.length > 0 && (
                                                <div className="replies-list">
                                                    {c.replies.map(r => (
                                                        <div key={r.id} className="reply-item">
                                                            <span className="comment-avatar" style={{ fontSize: 14 }}>{r.avatar}</span>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="comment-author">{r.author}</span>
                                                                    <span className="comment-time">{timeAgo(r.timestamp)}</span>
                                                                </div>
                                                                <p className="comment-body">{r.text}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
