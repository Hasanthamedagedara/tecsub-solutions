"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Category Config ─── */
const CATEGORIES = [
    { id: "Video", emoji: "🎬", color: "#FF0000" },
    { id: "News", emoji: "📰", color: "#F59E0B" },
    { id: "Prompt", emoji: "🤖", color: "#A855F7" },
    { id: "Tool", emoji: "🛠️", color: "#2ba640" },
    { id: "Photo", emoji: "📷", color: "#FF6B35" },
    { id: "Update", emoji: "🚀", color: "#EC4899" },
    { id: "PDF", emoji: "📄", color: "#e11d48" },
    { id: "App", emoji: "📲", color: "#2563eb" },
];

export default function PostComposer() {
    const [isOpen, setIsOpen] = useState(false);
    const [isFabVisible, setIsFabVisible] = useState(true);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [linkUrl, setLinkUrl] = useState("");
    const [category, setCategory] = useState("Update");
    const [isPosting, setIsPosting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    /* ─── Listen for external open event ─── */
    useEffect(() => {
        const handler = () => setIsOpen(true);
        window.addEventListener("tecsub-open-composer", handler);
        return () => window.removeEventListener("tecsub-open-composer", handler);
    }, []);

    /* ─── Hide FAB in app mode ─── */
    useEffect(() => {
        if (typeof document !== "undefined") {
            setIsFabVisible(!document.documentElement.classList.contains("is-app"));
        }
    }, []);

    const selectedCategory = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];

    const handlePost = () => {
        if (!title.trim()) return;
        setIsPosting(true);

        // Save to localStorage so it appears in the feed
        try {
            const existing = JSON.parse(localStorage.getItem("tecsub-user-posts") || "[]");
            const newPost = {
                id: `user-post-${Date.now()}`,
                title: title.trim(),
                description: body.trim(),
                category,
                icon: selectedCategory.emoji,
                color: selectedCategory.color,
                link: linkUrl.trim() || undefined,
                contentType: "default",
                isNew: true,
                timestamp: Date.now(),
            };
            existing.unshift(newPost);
            localStorage.setItem("tecsub-user-posts", JSON.stringify(existing));
        } catch { /* ignore */ }

        setTimeout(() => {
            setIsPosting(false);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setIsOpen(false);
                setTitle("");
                setBody("");
                setLinkUrl("");
                setCategory("Update");
                // Trigger feed refresh
                window.dispatchEvent(new Event("tecsub-reshuffle-feed"));
            }, 1500);
        }, 1000);
    };

    return (
        <>
            {/* ─── FAB Button ─── */}
            {isFabVisible && !isOpen && (
                <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
                    onClick={() => setIsOpen(true)}
                    className="composer-fab"
                    aria-label="Create post"
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </motion.button>
            )}

            {/* ─── Composer Modal ─── */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="composer-backdrop"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 28, stiffness: 320 }}
                            className="composer-modal"
                        >
                            {/* Header */}
                            <div className="composer-header">
                                <button onClick={() => setIsOpen(false)} className="composer-close-btn">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                                    </svg>
                                </button>
                                <h3 className="composer-title">Create Post</h3>
                                <button
                                    onClick={handlePost}
                                    disabled={!title.trim() || isPosting}
                                    className="composer-post-btn"
                                    style={{ background: selectedCategory.color }}
                                >
                                    {isPosting ? (
                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    ) : "Post"}
                                </button>
                            </div>

                            {/* Success Overlay */}
                            <AnimatePresence>
                                {showSuccess && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="composer-success"
                                    >
                                        <span className="text-4xl">✅</span>
                                        <p className="text-lg font-semibold mt-2">Posted!</p>
                                        <p className="text-sm text-gray-400">Your post is now live in the feed</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Category Chips */}
                            <div className="composer-categories">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setCategory(cat.id)}
                                        className={`composer-category-chip ${category === cat.id ? "active" : ""}`}
                                        style={category === cat.id ? { background: cat.color + "25", borderColor: cat.color + "60", color: cat.color } : undefined}
                                    >
                                        <span>{cat.emoji}</span>
                                        {cat.id}
                                    </button>
                                ))}
                            </div>

                            {/* Form */}
                            <div className="composer-form">
                                <input
                                    type="text"
                                    placeholder="Post title *"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="composer-input composer-input-title"
                                    maxLength={120}
                                />

                                <textarea
                                    placeholder="What's on your mind? Write something..."
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    className="composer-input composer-input-body"
                                    rows={5}
                                />

                                {/* Attachment Bar */}
                                <div className="composer-attachments">
                                    <div className="flex items-center gap-1">
                                        <button className="composer-attach-btn" title="Add image">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                <polyline points="21 15 16 10 5 21" />
                                            </svg>
                                        </button>
                                        <button className="composer-attach-btn" title="Add video">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polygon points="23 7 16 12 23 17 23 7" />
                                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                                            </svg>
                                        </button>
                                        <button className="composer-attach-btn" title="Add link">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                            </svg>
                                        </button>
                                        <button className="composer-attach-btn" title="Add emoji">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10" />
                                                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                                                <line x1="9" y1="9" x2="9.01" y2="9" />
                                                <line x1="15" y1="9" x2="15.01" y2="9" />
                                            </svg>
                                        </button>
                                    </div>
                                    <span className="text-[11px] text-gray-500">{title.length}/120</span>
                                </div>

                                {/* Optional Link */}
                                <input
                                    type="url"
                                    placeholder="Add a link (optional)"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    className="composer-input"
                                />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
