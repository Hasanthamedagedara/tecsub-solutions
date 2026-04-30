"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdPlacement from "@/components/AdPlacement";

/* ─── Types ─── */
interface Book {
    id: string;
    title: string;
    author: string;
    category: string;
    rating: number;
    pages: number;
    description: string;
    format: string;
    icon: string;
    color: string;
    badge?: string;
}

/* ─── Demo Books ─── */
const DEFAULT_BOOKS: Book[] = [
    {
        id: "b-001", title: "Mastering Next.js 14", author: "Tecsub Editorial", category: "Development", rating: 4.9, pages: 320,
        description: "The ultimate guide to building high-performance web applications with Next.js 14, App Router, and Server Components.",
        format: "PDF / ePub", icon: "💻", color: "#3ea6ff", badge: "Best Seller",
    },
    {
        id: "b-002", title: "AI Engineering: From Zero to Hero", author: "Dr. Arshath", category: "AI / ML", rating: 4.8, pages: 450,
        description: "Learn how to build, fine-tune, and deploy large language models using modern Python frameworks.",
        format: "PDF", icon: "🤖", color: "#4ADE80", badge: "New Release",
    },
    {
        id: "b-003", title: "The Art of Prompting", author: "Sarah Jenkins", category: "AI / Productivity", rating: 4.7, pages: 180,
        description: "A comprehensive handbook on crafting perfect prompts for ChatGPT, Midjourney, and Claude to maximize output quality.",
        format: "PDF / Mobi", icon: "✍️", color: "#C084FC",
    },
    {
        id: "b-004", title: "Cybersecurity Essentials", author: "Mark Thompson", category: "Security", rating: 4.6, pages: 290,
        description: "Protect your digital assets. Learn the fundamentals of network security, ethical hacking, and data encryption.",
        format: "PDF", icon: "🛡️", color: "#F97316",
    },
    {
        id: "b-005", title: "UI/UX Design Patterns", author: "Elena Rossi", category: "Design", rating: 4.9, pages: 210,
        description: "Explore the psychological principles behind successful interfaces and learn how to create intuitive user experiences.",
        format: "Interactive PDF", icon: "🎨", color: "#FF0000", badge: "Featured",
    },
    {
        id: "b-006", title: "Cloud Architecture Guide", author: "AWS Experts", category: "Infrastructure", rating: 4.5, pages: 380,
        description: "Design scalable, resilient systems on the cloud. Covers AWS, Azure, and Google Cloud best practices.",
        format: "PDF", icon: "☁️", color: "#34D399",
    },
];

const CATEGORIES = ["All", "Development", "AI / ML", "AI / Productivity", "Security", "Design", "Infrastructure"];

export default function BooksPage() {
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filtered = DEFAULT_BOOKS.filter((b) => {
        const matchCat = selectedCategory === "All" || b.category.includes(selectedCategory);
        const matchSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.author.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <div className="min-h-screen" style={{ background: "var(--yt-bg)" }}>
            <Navbar />
            <div className="pt-24 sm:pt-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                    {/* Hero */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                        <h1 className="font-bebas text-5xl sm:text-7xl gradient-text leading-[0.95] mb-4">📚 TECSUB BOOKS</h1>
                        <p className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: "var(--yt-text-secondary)" }}>
                            Curated digital library for developers, designers, and tech enthusiasts.
                        </p>
                    </motion.div>

                    {/* Search */}
                    <div className="mb-8 max-w-xl mx-auto">
                        <div className="relative">
                            <input
                                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search books by title or author..."
                                className="w-full px-5 py-3 pl-12 rounded-2xl text-sm outline-none"
                                style={{ background: "rgba(0,0,0,0.4)", border: "1px solid var(--yt-border)", color: "var(--yt-text-primary)" }}
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat} onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${selectedCategory === cat ? "bg-yt-accent text-white" : "bg-yt-chip-bg text-yt-text-primary hover:bg-yt-bg-hover"}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Books Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map((book, i) => (
                            <motion.div
                                key={book.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => setSelectedBook(book)}
                                className="group relative rounded-2xl overflow-hidden cursor-pointer flex flex-col h-full"
                                style={{ background: "var(--yt-bg-secondary)", border: "1px solid var(--yt-border)" }}
                            >
                                <div className="h-48 w-full flex items-center justify-center text-6xl relative overflow-hidden" style={{ background: `${book.color}10` }}>
                                    {book.icon}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="px-4 py-2 rounded-full bg-white text-black font-bold text-xs">Read Sample</div>
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-sm leading-tight line-clamp-2">{book.title}</h3>
                                    </div>
                                    <p className="text-[11px] mb-3" style={{ color: "var(--yt-text-secondary)" }}>by {book.author}</p>
                                    <div className="mt-auto flex items-center justify-between text-[10px]" style={{ color: "var(--yt-text-secondary)" }}>
                                        <span className="px-2 py-1 rounded bg-black/20">{book.format}</span>
                                        <span style={{ color: "var(--yt-accent)" }}>⭐ {book.rating}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Modal */}
                <AnimatePresence>
                    {selectedBook && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                            onClick={() => setSelectedBook(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                                className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
                                style={{ background: "var(--yt-bg-secondary)", border: "1px solid var(--yt-border)" }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-8">
                                    <div className="flex items-start gap-6 mb-6">
                                        <div className="w-24 h-32 rounded-xl flex items-center justify-center text-5xl shrink-0" style={{ background: `${selectedBook.color}15` }}>
                                            {selectedBook.icon}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold mb-1">{selectedBook.title}</h2>
                                            <p className="text-sm mb-2" style={{ color: "var(--yt-text-secondary)" }}>{selectedBook.author}</p>
                                            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-yt-accent/20 text-yt-accent border border-yt-accent/30 uppercase tracking-widest">{selectedBook.category}</span>
                                        </div>
                                    </div>
                                    
                                    <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--yt-text-secondary)" }}>{selectedBook.description}</p>
                                    
                                    <div className="grid grid-cols-3 gap-3 mb-8 text-center">
                                        <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                                            <p className="text-[10px] text-yt-text-secondary uppercase mb-1">Rating</p>
                                            <p className="font-bold text-xs">⭐ {selectedBook.rating}</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                                            <p className="text-[10px] text-yt-text-secondary uppercase mb-1">Pages</p>
                                            <p className="font-bold text-xs">{selectedBook.pages}</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-black/20 border border-white/5">
                                            <p className="text-[10px] text-yt-text-secondary uppercase mb-1">Format</p>
                                            <p className="font-bold text-xs">{selectedBook.format}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button className="flex-1 py-4 rounded-xl bg-yt-accent text-white font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2">
                                            📥 Download Book
                                        </button>
                                        <button onClick={() => setSelectedBook(null)} className="px-6 py-4 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-all">
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
                    <AdPlacement format="banner" />
                </div>
                <Footer />
            </div>
        </div>
    );
}
