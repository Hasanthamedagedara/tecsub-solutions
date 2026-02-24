"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ─── Types ─── */
interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    originalPrice: number;
    rating: number;
    reviews: number;
    description: string;
    features: string[];
    icon: string;
    color: string;
    badge?: string;
    inStock: boolean;
}

/* ─── Demo Products ─── */
const DEFAULT_PRODUCTS: Product[] = [
    {
        id: "p-001", name: "Tecsub Recorder Pro License", category: "Software", price: 29, originalPrice: 49, rating: 4.9, reviews: 234,
        description: "Lifetime license for Tecsub Recorder with all pro features, smart zoom, floating toolbar, and unlimited recording.",
        features: ["Lifetime License", "Smart Zoom", "Floating Toolbar", "4K Recording", "Priority Support"],
        icon: "🎥", color: "#00E5FF", badge: "🔥 Hot Deal", inStock: true,
    },
    {
        id: "p-002", name: "Premium Logo Design Pack", category: "Design", price: 15, originalPrice: 35, rating: 4.7, reviews: 182,
        description: "100+ premium logo templates in AI, SVG, and PNG formats. Fully editable with commercial license included.",
        features: ["100+ Templates", "AI/SVG/PNG", "Commercial License", "Editable Source", "Brand Guidelines"],
        icon: "🎨", color: "#C084FC", badge: "57% OFF", inStock: true,
    },
    {
        id: "p-003", name: "Social Media Template Bundle", category: "Templates", price: 12, originalPrice: 25, rating: 4.8, reviews: 312,
        description: "500+ social media templates for Instagram, Facebook, TikTok, and YouTube. Canva & Figma compatible.",
        features: ["500+ Templates", "All Platforms", "Canva Ready", "Figma Files", "Monthly Updates"],
        icon: "📱", color: "#E1306C", badge: "Best Seller", inStock: true,
    },
    {
        id: "p-004", name: "AI Prompt Engineering Guide", category: "eBook", price: 8, originalPrice: 15, rating: 4.6, reviews: 156,
        description: "Complete guide to mastering ChatGPT, Claude, and Gemini. 200+ curated prompts for productivity and creativity.",
        features: ["200+ Prompts", "PDF + ePub", "Video Bonus", "Lifetime Updates", "Community Access"],
        icon: "📚", color: "#4ADE80", inStock: true,
    },
    {
        id: "p-005", name: "Website Starter Kit", category: "Development", price: 35, originalPrice: 75, rating: 4.9, reviews: 98,
        description: "Complete Next.js website template with admin panel, payment integration, and SEO optimization. Production-ready.",
        features: ["Next.js 14", "Admin Panel", "Payment Ready", "SEO Optimized", "Responsive"],
        icon: "🌐", color: "#38BDF8", badge: "53% OFF", inStock: true,
    },
    {
        id: "p-006", name: "YouTube Thumbnail Pack", category: "Design", price: 10, originalPrice: 20, rating: 4.5, reviews: 267,
        description: "200+ professional YouTube thumbnail templates with attention-grabbing designs. PSD and Canva formats.",
        features: ["200+ Thumbnails", "PSD + Canva", "A/B Test Ready", "Bold Typography", "Click-Optimized"],
        icon: "🖼️", color: "#FF0000", inStock: true,
    },
    {
        id: "p-007", name: "Data Grab V5 Pro License", category: "Software", price: 19, originalPrice: 39, rating: 4.8, reviews: 143,
        description: "Advanced data extraction tool with AI pattern recognition, batch processing, and export to CSV/JSON/Excel.",
        features: ["AI Extraction", "Batch Processing", "CSV/JSON/Excel", "Scheduling", "API Access"],
        icon: "📊", color: "#F97316", badge: "🆕 New", inStock: true,
    },
    {
        id: "p-008", name: "Coding Wallpaper Pack", category: "Media", price: 5, originalPrice: 10, rating: 4.4, reviews: 89,
        description: "50 stunning 4K coding-themed wallpapers for desktop and mobile. Dark mode and light mode variants.",
        features: ["50 Wallpapers", "4K Resolution", "Dark + Light", "Desktop + Mobile", "Monthly Add-ons"],
        icon: "🖥️", color: "#A78BFA", inStock: true,
    },
    {
        id: "p-009", name: "Notion Business Template", category: "Productivity", price: 14, originalPrice: 29, rating: 4.7, reviews: 201,
        description: "All-in-one Notion workspace for freelancers: project management, invoicing, CRM, and content calendar.",
        features: ["Project Management", "Invoicing", "CRM System", "Content Calendar", "Client Portal"],
        icon: "📋", color: "#FFD93D", inStock: true,
    },
    {
        id: "p-010", name: "Sound Effects Pro Pack", category: "Audio", price: 7, originalPrice: 18, rating: 4.6, reviews: 134,
        description: "1000+ royalty-free sound effects for YouTube, podcasts, and games. WAV and MP3 formats included.",
        features: ["1000+ SFX", "Royalty Free", "WAV + MP3", "Categorized", "Commercial Use"],
        icon: "🔊", color: "#EF4444", inStock: true,
    },
    {
        id: "p-011", name: "VPN Ultra Annual Plan", category: "Service", price: 24, originalPrice: 60, rating: 4.8, reviews: 189,
        description: "12-month VPN subscription with 100+ servers worldwide, WireGuard protocol, and unlimited bandwidth.",
        features: ["100+ Servers", "WireGuard", "Unlimited BW", "No Logs", "5 Devices"],
        icon: "🔒", color: "#06B6D4", badge: "60% OFF", inStock: true,
    },
    {
        id: "p-012", name: "Stock Photo Bundle", category: "Media", price: 18, originalPrice: 40, rating: 4.5, reviews: 76,
        description: "500 high-resolution stock photos covering tech, nature, business, and lifestyle. Commercial license.",
        features: ["500 Photos", "4K+ Resolution", "Commercial", "RAW Available", "Quarterly Updates"],
        icon: "📷", color: "#34D399", inStock: true,
    },
];

const CATEGORIES = ["All", "Software", "Design", "Templates", "eBook", "Development", "Media", "Productivity", "Audio", "Service"];

export default function ShopPage() {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"popular" | "price-low" | "price-high">("popular");
    const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);

    /* ─── Sync with admin localStorage ─── */
    useEffect(() => {
        const loadFromStorage = () => {
            const stored = localStorage.getItem("tecsub-admin-shop");
            if (stored) {
                try {
                    const adminItems = JSON.parse(stored);
                    if (adminItems.length > 0) {
                        const mapped: Product[] = adminItems.map((item: { id: string; title: string; category: string; author: string; status: string }, idx: number) => {
                            const def = DEFAULT_PRODUCTS.find(p => p.name === item.title);
                            if (def) return { ...def, id: item.id };
                            const colors = ["#00E5FF", "#C084FC", "#E1306C", "#4ADE80", "#38BDF8", "#FF0000", "#F97316", "#A78BFA"];
                            return {
                                id: item.id, name: item.title, category: item.category || "Software",
                                price: 10 + Math.floor(Math.random() * 25),
                                originalPrice: 30 + Math.floor(Math.random() * 40),
                                rating: 4.5 + Math.random() * 0.4,
                                reviews: 50 + Math.floor(Math.random() * 200),
                                description: `${item.title} — Premium digital product.`,
                                features: ["Full Access", "Lifetime Updates", "Support"],
                                icon: "📦", color: colors[idx % colors.length], inStock: true,
                            };
                        }).filter((item: { id: string }) => {
                            const adminItem = adminItems.find((a: { id: string; status: string }) => a.id === item.id);
                            return !adminItem || adminItem.status !== "archived";
                        });
                        setProducts(mapped);
                        return;
                    }
                } catch { /* ignore */ }
            }
            const seed = DEFAULT_PRODUCTS.map(p => ({
                id: p.id, title: p.name, type: "shop", status: "published" as const,
                category: p.category, author: "Admin",
                createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            }));
            localStorage.setItem("tecsub-admin-shop", JSON.stringify(seed));
            setProducts(DEFAULT_PRODUCTS);
        };
        loadFromStorage();
        window.addEventListener("storage", loadFromStorage);
        const interval = setInterval(loadFromStorage, 2000);
        return () => { window.removeEventListener("storage", loadFromStorage); clearInterval(interval); };
    }, []);

    const filtered = products
        .filter((p) => {
            const matchCat = selectedCategory === "All" || p.category === selectedCategory;
            const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchCat && matchSearch;
        })
        .sort((a, b) => {
            if (sortBy === "price-low") return a.price - b.price;
            if (sortBy === "price-high") return b.price - a.price;
            return b.reviews - a.reviews;
        });

    return (
        <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
            <Navbar />
            <div className="pt-24 sm:pt-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                    {/* Hero */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                        <h1 className="font-bebas text-5xl sm:text-7xl gradient-text leading-[0.95] mb-4">🛍️ TECSUB SHOP</h1>
                        <p className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
                            Digital products, software licenses, templates, and more. Quality guaranteed.
                        </p>
                    </motion.div>

                    {/* Search + Sort */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6 max-w-2xl mx-auto">
                        <div className="relative flex-1">
                            <input
                                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="w-full px-5 py-3 pl-12 rounded-2xl text-sm outline-none"
                                style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-primary)" }}
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: "var(--text-secondary)" }}>🔍</span>
                        </div>
                        <select
                            value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                            className="px-4 py-3 rounded-2xl text-sm outline-none cursor-pointer"
                            style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-primary)" }}
                        >
                            <option value="popular">🔥 Most Popular</option>
                            <option value="price-low">💲 Price: Low → High</option>
                            <option value="price-high">💰 Price: High → Low</option>
                        </select>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat} onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${selectedCategory === cat ? "bg-tecsubCyan/20 text-tecsubCyan border border-tecsubCyan/30" : "border border-white/10 hover:border-white/20"}`}
                                style={{ color: selectedCategory === cat ? undefined : "var(--text-secondary)" }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Products Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filtered.map((product, i) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05, duration: 0.4 }}
                                onClick={() => setSelectedProduct(product)}
                                className="group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] flex flex-col"
                                style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${product.color}30`; }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; }}
                            >
                                <div className="h-1.5" style={{ background: product.color }} />
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${product.color}15` }}>
                                            {product.icon}
                                        </div>
                                        {product.badge && (
                                            <span className="text-[9px] px-2 py-1 rounded-full font-bold" style={{ background: `${product.color}15`, color: product.color }}>
                                                {product.badge}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="font-bold text-sm mb-1 line-clamp-1" style={{ color: "var(--text-primary)" }}>{product.name}</h3>
                                    <p className="text-[10px] mb-2" style={{ color: product.color }}>{product.category}</p>
                                    <p className="text-[11px] line-clamp-2 mb-3" style={{ color: "var(--text-secondary)" }}>{product.description}</p>

                                    <div className="flex items-center gap-2 mb-3 text-[10px]" style={{ color: "var(--text-secondary)" }}>
                                        <span>⭐ {product.rating}</span>
                                        <span>({product.reviews} reviews)</span>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-base" style={{ color: product.color }}>${product.price}</span>
                                            <span className="text-[11px] line-through" style={{ color: "var(--text-secondary)" }}>${product.originalPrice}</span>
                                        </div>
                                        <span className="text-[10px] px-3 py-1 rounded-full font-semibold" style={{ background: `${product.color}15`, color: product.color }}>
                                            Buy →
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-3xl mb-3">🔍</p>
                            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No products found.</p>
                        </div>
                    )}
                </div>

                {/* ═══ Product Detail Modal ═══ */}
                <AnimatePresence>
                    {selectedProduct && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                            onClick={() => setSelectedProduct(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                                className="w-full max-w-md rounded-3xl overflow-hidden"
                                style={{ background: "rgba(12,12,14,0.98)", border: `1px solid ${selectedProduct.color}20` }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="h-2" style={{ background: `linear-gradient(90deg, transparent, ${selectedProduct.color}, transparent)` }} />
                                <div className="p-6">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ background: `${selectedProduct.color}15` }}>
                                            {selectedProduct.icon}
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>{selectedProduct.name}</h2>
                                            <p className="text-xs" style={{ color: selectedProduct.color }}>{selectedProduct.category}</p>
                                            <div className="flex items-center gap-2 mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                                                <span>⭐ {selectedProduct.rating}</span>
                                                <span>({selectedProduct.reviews} reviews)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>{selectedProduct.description}</p>

                                    <div className="mb-5">
                                        <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-primary)" }}>What's Included</h4>
                                        <div className="space-y-1.5">
                                            {selectedProduct.features.map((f) => (
                                                <div key={f} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                                                    <span style={{ color: selectedProduct.color }}>✓</span> {f}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl mb-4" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                        <div className="flex items-center justify-center gap-3">
                                            <span className="text-3xl font-bold" style={{ color: selectedProduct.color }}>${selectedProduct.price}</span>
                                            <span className="text-lg line-through" style={{ color: "var(--text-secondary)" }}>${selectedProduct.originalPrice}</span>
                                            <span className="text-xs px-2 py-1 rounded-full font-bold" style={{ background: `${selectedProduct.color}15`, color: selectedProduct.color }}>
                                                {Math.round((1 - selectedProduct.price / selectedProduct.originalPrice) * 100)}% OFF
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button className="flex-1 py-3 rounded-xl font-bold text-sm text-white hover:brightness-110 transition-all" style={{ background: selectedProduct.color }}>
                                            🛒 Buy Now — ${selectedProduct.price}
                                        </button>
                                        <button onClick={() => setSelectedProduct(null)} className="px-5 py-3 rounded-xl text-sm font-medium hover:bg-white/10 transition-all" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "var(--text-secondary)" }}>
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Footer />
            </div>
        </div>
    );
}
