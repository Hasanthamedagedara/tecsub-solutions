"use client";

import { useState, useMemo } from "react";

// Premium Static Articles Data
const ARTICLES_DATA = [
    {
        id: "ai-trends-2026",
        title: "Top AI Development Trends to Watch in 2026",
        excerpt: "Discover the next wave of artificial intelligence integrations, edge-computing models, and the evolution of agentic code automation platforms.",
        category: "AI",
        date: "May 19, 2026",
        readTime: "5 min read",
        author: "Hasantha Medagedara",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
        accent: "#00E5FF",
    },
    {
        id: "nextjs-16-predictions",
        title: "Next.js Core Architecture & Speed Index Performance",
        excerpt: "Deep dive into optimizing server actions, partial pre-rendering strategies, and prefetching local assets to score a perfect 100 on PageSpeed.",
        category: "Software",
        date: "May 15, 2026",
        readTime: "7 min read",
        author: "Tecsub Dev Team",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
        accent: "#3B82F6",
    },
    {
        id: "local-seo-mastery-sri-lanka",
        title: "Mastering Local business SEO & Structured Schema",
        excerpt: "Step-by-step developer guide to setting up valid JSON-LD LocalBusiness data, viewport responsiveness, and multi-lingual hreflang links.",
        category: "Guides",
        date: "May 12, 2026",
        readTime: "6 min read",
        author: "Hasantha Medagedara",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop",
        accent: "#10B981",
    },
    {
        id: "cybersecurity-spam-prevention",
        title: "Modern Email Obfuscation & Security Guidelines",
        excerpt: "Learn how to defend public endpoints and contact details against automated web scrapers using dynamic client-side mount rendering.",
        category: "Tech",
        date: "May 08, 2026",
        readTime: "4 min read",
        author: "Security Labs",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop",
        accent: "#EF4444",
    },
    {
        id: "ui-ux-design-microanimations",
        title: "How Hover Micro-Animations Boost User Engagement",
        excerpt: "Explore the psychological impact of glassmorphic menus, tailoring curated color palettes, and responsive hover transitions on bounce rate.",
        category: "Guides",
        date: "May 04, 2026",
        readTime: "8 min read",
        author: "Tecsub Design",
        image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop",
        accent: "#8B5CF6",
    },
    {
        id: "agentic-coding-workflows",
        title: "The Rise of Autonomous Agentic Coding Assistants",
        excerpt: "Analyzing the paradigms of pair programming, planning mode tasks execution, and the integration of specialized tools inside modern IDEs.",
        category: "AI",
        date: "April 28, 2026",
        readTime: "10 min read",
        author: "AI Research",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
        accent: "#EC4899",
    }
];

const CATEGORIES = ["All", "AI", "Software", "Tech", "Guides"];

export default function ArticlesClient() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Filter and search logic
    const filteredArticles = useMemo(() => {
        return ARTICLES_DATA.filter((article) => {
            const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
            const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, selectedCategory]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="font-bebas text-5xl sm:text-7xl gradient-text leading-[0.95] mb-4 tracking-wider">
                    TECSUB ARTICLES
                </h1>
                <p className="text-[var(--text-secondary)] text-base sm:text-lg" style={{ color: "var(--text-secondary)" }}>
                    Stay informed with technical insights, advanced software patterns, and modern coding guidelines curated by the Tecsub Solutions engineering team.
                </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-4 rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl shadow-xl">
                {/* Category Selector */}
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                                selectedCategory === cat
                                    ? "bg-[var(--text-primary)] text-[var(--navy)] shadow-lg"
                                    : "bg-[var(--glass-bg)] text-[var(--text-secondary)] hover:bg-[var(--glass-bg)]/80 hover:text-[var(--text-primary)]"
                            }`}
                            style={{
                                backgroundColor: selectedCategory === cat ? "var(--text-primary)" : "var(--glass-bg)",
                                color: selectedCategory === cat ? "var(--navy)" : "var(--text-secondary)",
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Search Input */}
                <div className="relative max-w-sm w-full">
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl text-sm border border-[var(--glass-border)] bg-[var(--glass-bg)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300"
                        style={{ color: "var(--text-primary)", backgroundColor: "var(--glass-bg)" }}
                    />
                    <svg
                        className="absolute left-3 top-2.5"
                        style={{ color: "var(--text-secondary)" }}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                </div>
            </div>

            {/* Articles Grid */}
            {filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredArticles.map((article) => (
                        <article
                            key={article.id}
                            className="group flex flex-col rounded-2xl overflow-hidden border border-[var(--glass-border)] bg-[var(--glass-bg)] hover:bg-[var(--glass-bg)]/80 hover:border-cyan-400/30 transition-all duration-500 shadow-lg hover:shadow-cyan-900/5 hover:-translate-y-1.5"
                        >
                            {/* Article Image container */}
                            <div className="relative aspect-[16/10] overflow-hidden bg-gray-900">
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <span
                                    className="absolute top-4 left-4 px-3 py-1 rounded-lg text-xs font-bold tracking-wider uppercase text-black"
                                    style={{ background: article.accent }}
                                >
                                    {article.category}
                                </span>
                            </div>

                            {/* Content Container */}
                            <div className="flex-1 p-6 flex flex-col">
                                <div className="flex items-center gap-3 text-xs mb-3" style={{ color: "var(--text-secondary)" }}>
                                    <span>{article.date}</span>
                                    <span>•</span>
                                    <span>{article.readTime}</span>
                                </div>

                                <h2 className="font-bebas text-2xl sm:text-3xl group-hover:text-cyan-400 transition-colors duration-300 mb-3 tracking-wider leading-tight" style={{ color: "var(--text-primary)" }}>
                                    {article.title}
                                </h2>

                                <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: "var(--text-secondary)" }}>
                                    {article.excerpt}
                                </p>

                                <div className="pt-4 border-t border-[var(--glass-border)] flex items-center justify-between">
                                    <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>By {article.author}</span>
                                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                                        Read Article 
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border border-dashed border-[var(--glass-border)] rounded-2xl bg-[var(--glass-bg)]">
                    <span className="text-4xl">🔍</span>
                    <h3 className="text-lg font-bold mt-4 mb-2" style={{ color: "var(--text-primary)" }}>No articles found</h3>
                    <p className="max-w-xs mx-auto text-sm" style={{ color: "var(--text-secondary)" }}>
                        Try refining your search query or switching to another category tab.
                    </p>
                </div>
            )}
        </div>
    );
}
