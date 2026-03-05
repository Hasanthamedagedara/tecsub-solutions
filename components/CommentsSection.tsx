"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/components/ThemeProvider";
import { t } from "@/data/translations";

/* ─── Types ─── */
interface Comment {
    id: string;
    author: string;
    avatar: string;
    text: string;
    timestamp: number;
    likes: number;
    liked: boolean;
    replies: Reply[];
}

interface Reply {
    id: string;
    author: string;
    avatar: string;
    text: string;
    timestamp: number;
    likes: number;
    liked: boolean;
}

const AVATARS = ["🧑‍💻", "👩‍🎨", "🧑‍🔬", "👨‍🚀", "👩‍💼", "🧑‍🎓", "👨‍🏫", "👩‍⚕️"];
const NAMES = ["TechUser", "CodeNinja", "DigitalPro", "ByteMaster", "PixelDev", "CloudRunner", "DataWiz", "NetBuilder"];

function getRandomAvatar() { return AVATARS[Math.floor(Math.random() * AVATARS.length)]; }
function getRandomName() { return NAMES[Math.floor(Math.random() * NAMES.length)] + Math.floor(Math.random() * 999); }
function generateId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

function timeAgo(ts: number): string {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

/* ─── Main Component ─── */
export default function CommentsSection({
    contentId,
    isOpen,
}: {
    contentId: string;
    isOpen: boolean;
}) {
    const { language } = useAppContext();
    const storageKey = `tecsub-comments-${contentId}`;

    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");
    const [userName] = useState(() => getRandomName());
    const [userAvatar] = useState(() => getRandomAvatar());

    // Load from localStorage
    useEffect(() => {
        try {
            const raw = localStorage.getItem(storageKey);
            if (raw) setComments(JSON.parse(raw));
        } catch { /* ignore */ }
    }, [storageKey]);

    // Save to localStorage
    const persist = (updated: Comment[]) => {
        setComments(updated);
        try { localStorage.setItem(storageKey, JSON.stringify(updated)); } catch { /* ignore */ }
    };

    const addComment = () => {
        if (!newComment.trim()) return;
        const comment: Comment = {
            id: generateId(),
            author: userName,
            avatar: userAvatar,
            text: newComment.trim(),
            timestamp: Date.now(),
            likes: 0,
            liked: false,
            replies: [],
        };
        persist([comment, ...comments]);
        setNewComment("");
    };

    const addReply = (commentId: string) => {
        if (!replyText.trim()) return;
        const reply: Reply = {
            id: generateId(),
            author: userName,
            avatar: userAvatar,
            text: replyText.trim(),
            timestamp: Date.now(),
            likes: 0,
            liked: false,
        };
        const updated = comments.map((c) =>
            c.id === commentId ? { ...c, replies: [...c.replies, reply] } : c
        );
        persist(updated);
        setReplyText("");
        setReplyingTo(null);
    };

    const toggleLikeComment = (commentId: string) => {
        const updated = comments.map((c) =>
            c.id === commentId
                ? { ...c, liked: !c.liked, likes: c.liked ? c.likes - 1 : c.likes + 1 }
                : c
        );
        persist(updated);
    };

    const toggleLikeReply = (commentId: string, replyId: string) => {
        const updated = comments.map((c) =>
            c.id === commentId
                ? {
                    ...c,
                    replies: c.replies.map((r) =>
                        r.id === replyId
                            ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 }
                            : r
                    ),
                }
                : c
        );
        persist(updated);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                >
                    <div className="comment-section mt-3 pt-3" style={{ borderTop: "1px solid var(--glass-border)" }}>
                        {/* ─── New Comment Input ─── */}
                        <div className="flex gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                                style={{ background: "rgba(0, 229, 255, 0.1)", border: "1px solid rgba(0, 229, 255, 0.2)" }}>
                                {userAvatar}
                            </div>
                            <div className="flex-1 flex gap-2">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && addComment()}
                                    placeholder={t(language, "write_comment")}
                                    className="comment-input flex-1"
                                />
                                <button
                                    onClick={addComment}
                                    disabled={!newComment.trim()}
                                    className="comment-post-btn"
                                >
                                    {t(language, "post_comment")}
                                </button>
                            </div>
                        </div>

                        {/* ─── Comment List ─── */}
                        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin" }}>
                            <AnimatePresence>
                                {comments.map((comment) => (
                                    <motion.div
                                        key={comment.id}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="comment-card"
                                    >
                                        {/* Comment Header */}
                                        <div className="flex items-start gap-2">
                                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0"
                                                style={{ background: "rgba(0, 229, 255, 0.08)", border: "1px solid rgba(0, 229, 255, 0.15)" }}>
                                                {comment.avatar}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="text-xs font-semibold" style={{ color: "var(--cyan, #00E5FF)" }}>
                                                        {comment.author}
                                                    </span>
                                                    <span className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
                                                        {timeAgo(comment.timestamp)}
                                                    </span>
                                                </div>
                                                <p className="text-xs leading-relaxed" style={{ color: "var(--text-primary)" }}>
                                                    {comment.text}
                                                </p>
                                                {/* Actions */}
                                                <div className="flex items-center gap-3 mt-1.5">
                                                    <button
                                                        onClick={() => toggleLikeComment(comment.id)}
                                                        className="comment-action-btn"
                                                        style={{ color: comment.liked ? "#FF4444" : "var(--text-secondary)" }}
                                                    >
                                                        {comment.liked ? "❤️" : "🤍"} {comment.likes > 0 && comment.likes}
                                                    </button>
                                                    <button
                                                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                                        className="comment-action-btn"
                                                    >
                                                        {t(language, "reply")}
                                                    </button>
                                                </div>

                                                {/* Reply Input */}
                                                <AnimatePresence>
                                                    {replyingTo === comment.id && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="flex gap-2 mt-2 overflow-hidden"
                                                        >
                                                            <input
                                                                type="text"
                                                                value={replyText}
                                                                onChange={(e) => setReplyText(e.target.value)}
                                                                onKeyDown={(e) => e.key === "Enter" && addReply(comment.id)}
                                                                placeholder={`${t(language, "reply")}...`}
                                                                className="comment-input flex-1 text-xs"
                                                                autoFocus
                                                            />
                                                            <button
                                                                onClick={() => addReply(comment.id)}
                                                                disabled={!replyText.trim()}
                                                                className="comment-post-btn text-[10px] px-2 py-1"
                                                            >
                                                                {t(language, "reply")}
                                                            </button>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>

                                                {/* Replies */}
                                                {comment.replies.length > 0 && (
                                                    <div className="mt-2 ml-4 space-y-2 pl-3" style={{ borderLeft: "2px solid rgba(0, 229, 255, 0.1)" }}>
                                                        {comment.replies.map((reply) => (
                                                            <div key={reply.id} className="flex items-start gap-2">
                                                                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0"
                                                                    style={{ background: "rgba(0, 229, 255, 0.06)" }}>
                                                                    {reply.avatar}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 mb-0.5">
                                                                        <span className="text-[10px] font-semibold" style={{ color: "var(--cyan, #00E5FF)" }}>
                                                                            {reply.author}
                                                                        </span>
                                                                        <span className="text-[9px]" style={{ color: "var(--text-secondary)" }}>
                                                                            {timeAgo(reply.timestamp)}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-primary)" }}>
                                                                        {reply.text}
                                                                    </p>
                                                                    <button
                                                                        onClick={() => toggleLikeReply(comment.id, reply.id)}
                                                                        className="comment-action-btn mt-0.5"
                                                                        style={{ color: reply.liked ? "#FF4444" : "var(--text-secondary)" }}
                                                                    >
                                                                        {reply.liked ? "❤️" : "🤍"} {reply.likes > 0 && reply.likes}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {comments.length === 0 && (
                                <p className="text-center text-xs py-4" style={{ color: "var(--text-secondary)" }}>
                                    {t(language, "no_comments")}
                                </p>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
