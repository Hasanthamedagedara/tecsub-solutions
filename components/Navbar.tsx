"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/components/ThemeProvider";
import { useRouter, usePathname } from "next/navigation";
import AuthButton from "@/components/AuthButton";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { onlineTools, downloads, pdfToolsMenu } from "@/data/product";
import EmailLink from "@/components/EmailLink";

/* ─── Detect if running inside Android WebView app ─── */
function isAppWebView(): boolean {
    if (typeof window === "undefined") return false;
    const ua = navigator.userAgent || "";
    if (ua.includes("TECSUB_APP_USER_AGENT") || /TecsubApp/i.test(ua) || /; wv\)/.test(ua)) return true;
    const params = new URLSearchParams(window.location.search);
    if (params.get("app") === "1" || params.get("mode") === "app") return true;
    return false;
}

/* ─── Nav Menu Data ─── */
const MEGA_CATEGORIES = [
    { id: "online", label: "Online Products", desc: "Professional web tools", icon: "🌐" },
    { id: "pdf-tools", label: "PDF Tools", desc: "Edit, Merge & Convert PDFs", icon: "📄" },
    { id: "desktop", label: "Desktop Apps", desc: "Native software", icon: "💻" },
    { id: "games", label: "Games", desc: "Retro & modern arcade", icon: "🎮" },
    { id: "ai-writing", label: "AI & Writing Tools", desc: "Next-gen writing assistants", icon: "✨" },
];

const productsMenu = {
    items: [
        { label: "Online Tools", icon: "🔧", href: "/tools", color: "#f59e0b" },
        { label: "PDF Tools", icon: "📑", href: "/pdf-tools", color: "#10b981" },
        { label: "Desktop Apps", icon: "💻", href: "/software", color: "#3b82f6" },
        { label: "Sinhala Typing", icon: "සි", href: "/singlish", color: "#8b5cf6" },
    ]
};

const resourcesMenu = [
    { label: "Blog", desc: "Articles & tutorials", icon: "📝", href: "/news", color: "#6366f1" },
    { label: "TECSUB POSS", desc: "Integrated System Solutions", icon: "🔄", href: "/explore", color: "#22c55e" },
    { label: "Events", desc: "Live & online events", icon: "📅", href: "/community", color: "#ef4444" },
    { label: "Docs", desc: "API & developer guides", icon: "📚", href: "/about", color: "#6366f1" },
    { label: "Courses", desc: "Video courses & paths", icon: "🎓", href: "/courses", color: "#ef4444" },
    { label: "Software", desc: "Developer tools & extensions", icon: "💻", href: "/software", color: "#22c55e" },
    { label: "Apps", desc: "Mobile & native web utilities", icon: "📱", href: "/apps", color: "#3b82f6" },
    { label: "Books", desc: "Academic e-books & references", icon: "📚", href: "/books", color: "#8b5cf6" },
    { label: "Movies", desc: "Media indexing & streaming", icon: "🎬", href: "/movies", color: "#ec4899" },
    { label: "Images", desc: "Stock assets & visual gallery", icon: "🖼️", href: "/images", color: "#f43f5e" },
    { label: "Wallpapers", desc: "Custom designed themes", icon: "🎨", href: "/wallpapers", color: "#06b6d4" },
    { label: "Assets", desc: "3D resources & template items", icon: "📦", href: "/assets", color: "#f97316" },
];

const academyMenu = [
    { label: "Courses", desc: "Video courses & paths", icon: "🎓", href: "/courses", color: "#ef4444" },
    { label: "TECSUB Books", desc: "E-books & digital guides", icon: "📗", href: "/books", color: "#22c55e" },
    { label: "About", desc: "Mission & philosophy", icon: "ℹ️", href: "/about", color: "#3b82f6", soon: true },
    { label: "Certificates", desc: "Verify earned certificates", icon: "🏆", href: "/courses", color: "#22c55e", soon: true },
    { label: "Testimonials", desc: "Student success stories", icon: "⭐", href: "/courses", color: "#9ca3af", soon: true },
];

const solutionsMenu = [
    { label: "Enterprise", desc: "Solutions for businesses", icon: "🏢", href: "/about", color: "#6366f1" },
    { label: "Startups", desc: "Launch & grow faster", icon: "🚀", href: "/about", color: "#22c55e" },
    { label: "Developers", desc: "APIs & integrations", icon: "⚡", href: "/tools", color: "#f59e0b" },
    { label: "Education", desc: "Learning platforms", icon: "📖", href: "/courses", color: "#ef4444" },
];

const aboutMenu = [
    { label: "Our Story", desc: "Who we are", icon: "📌", href: "/about", color: "#6366f1" },
    { label: "Team", desc: "Meet the creators", icon: "👥", href: "/about", color: "#22c55e" },
    { label: "Careers", desc: "Join the team", icon: "💼", href: "/about", color: "#f59e0b", soon: true },
    { label: "Contact", desc: "Get in touch", icon: "✉️", href: "/about", color: "#3b82f6" },
];

/* ─── KDJ-Style Header Bar ─── */
export default function Navbar() {
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [activeMegaCategory, setActiveMegaCategory] = useState("online");
    const [profileOpen, setProfileOpen] = useState(false);
    const [isApp, setIsApp] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasMembership, setHasMembership] = useState(false);
    const { theme, toggleTheme } = useAppContext();
    const router = useRouter();
    const pathname = usePathname();
    const navRef = useRef<HTMLElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setIsApp(isAppWebView());
        
        const checkMembership = () => {
            const isPro = localStorage.getItem("tecsub_sub_pro_paid") === "true";
            const isUltra = localStorage.getItem("tecsub_sub_ultra_paid") === "true";
            setHasMembership(isPro || isUltra);
        };
        checkMembership();
        window.addEventListener("storage", checkMembership);

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => {
            unsubscribe();
            window.removeEventListener("storage", checkMembership);
        };
    }, []);

    /* Close menus on outside click */
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    /* Close mobile menu on route change */
    useEffect(() => {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
    }, [pathname]);

    const handleSearch = () => {
        if (searchQuery.trim()) console.log("Search:", searchQuery);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setProfileOpen(false);
            router.push('/');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const handleDropdownEnter = useCallback((key: string) => {
        if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
        setActiveDropdown(key);
    }, []);

    const handleDropdownLeave = useCallback(() => {
        dropdownTimeoutRef.current = setTimeout(() => setActiveDropdown(null), 200);
    }, []);

    const getFilteredItems = useCallback(() => {
        if (activeMegaCategory === "online") {
            return onlineTools.filter(t => t.category !== "Games" && t.category !== "AI").map(t => ({
                label: t.title,
                desc: t.description,
                icon: t.icon,
                href: t.href || "/tools",
                color: t.color,
                badge: (t as any).badge
            }));
        }
        if (activeMegaCategory === "desktop") {
            return downloads.map(d => ({
                label: d.name,
                desc: d.description,
                icon: d.icon,
                href: "/software",
                color: "#6366f1"
            }));
        }
        if (activeMegaCategory === "games") {
            return onlineTools.filter(t => t.category === "Games").map(t => ({
                label: t.title,
                desc: t.description,
                icon: t.icon,
                href: t.href || "/games",
                color: t.color
            }));
        }
        if (activeMegaCategory === "ai-writing") {
            return onlineTools.filter(t => t.category === "AI").map(t => ({
                label: t.title.replace("Tecsub ",""),
                desc: t.description,
                icon: t.icon,
                href: t.href || "/ai-tools",
                color: t.color,
                badge: (t as any).badge
            }));
        }
        return [];
    }, [activeMegaCategory]);

    if (isApp) return null;

    /* ─── Reusable Dropdown Item ─── */
    const DropdownItem = ({ item, onClick }: { item: { label: string; desc: string; icon: string; href: string; color?: string; badge?: string; soon?: boolean }; onClick?: () => void }) => (
        <a
            href={item.soon ? undefined : item.href}
            onClick={(e) => {
                if (item.soon) { e.preventDefault(); return; }
                e.preventDefault();
                router.push(item.href);
                setActiveDropdown(null);
                onClick?.();
            }}
            className={`kdj-mega-card ${item.soon ? 'kdj-soon' : ''}`}
        >
            <div className="kdj-mega-card-icon" style={{ background: `${item.color || '#6366f1'}10`, color: item.color || '#6366f1' }}>
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
            </div>
            <div className="kdj-mega-card-text">
                <div className="kdj-mega-card-label-wrap">
                    <span className="kdj-mega-card-label">
                        {item.label}
                    </span>
                    {item.badge && (
                        <span className="kdj-card-badge" style={{ background: item.badge === 'HOT' ? '#ef4444' : '#3b82f6' }}>
                            {item.badge}
                        </span>
                    )}
                </div>
                <span className="kdj-mega-card-desc">{item.desc}</span>
            </div>
        </a>
    );

    /* ─── Nav Link with Dropdown ─── */
    const NavDropdown = ({ id, label, badge, children }: { id: string; label: string; badge?: string; children: React.ReactNode }) => (
        <div
            className="kdj-nav-item-wrap"
            onMouseEnter={() => handleDropdownEnter(id)}
            onMouseLeave={handleDropdownLeave}
        >
            <button
                className={`kdj-nav-link ${activeDropdown === id ? 'active' : ''}`}
                onClick={() => setActiveDropdown(activeDropdown === id ? null : id)}
            >
                {label}
                {badge && <span className="kdj-nav-badge">{badge}</span>}
                <svg className="kdj-chevron" width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                    <path d="M2.5 3.5L5 6L7.5 3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                </svg>
            </button>
            <AnimatePresence>
                {activeDropdown === id && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className="kdj-dropdown"
                        onMouseEnter={() => handleDropdownEnter(id)}
                        onMouseLeave={handleDropdownLeave}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    return (
        <>
            {/* ═══ Top Utility Bar ═══ */}
            <div className="kdj-topbar">
                <div className="kdj-topbar-left">
                    <span className="kdj-topbar-item">📞 +94 72 612 8749</span>
                    <span className="kdj-topbar-sep">·</span>
                    <EmailLink email="tecsubsolutions@gmail.com" className="kdj-topbar-item hover:underline">
                        ✉️ tecsubsolutions@gmail.com
                    </EmailLink>
                </div>
                <div className="kdj-topbar-right">
                    <span className="kdj-topbar-flag">🇱🇰 Made in Sri Lanka</span>
                </div>
            </div>

            {/* ═══ Main Navigation ═══ */}
            <header className="kdj-header" id="yt-header" ref={navRef}>
                {/* Logo */}
                <a href="/" className="kdj-logo" onClick={(e) => { e.preventDefault(); router.push('/'); }}>
                    <div className="kdj-logo-img">
                        <img src="/logo/tecsub.jpg" alt="TecSub Logo" />
                    </div>
                </a>

                {/* Desktop Nav Items */}
                <nav className="kdj-nav">
                    {/* Products Mega Menu */}
                    <NavDropdown id="products" label="TOOLS">
                        <div className="kdj-mega-products">
                            <div className="kdj-mega-sidebar">
                                <div className="kdj-mega-sidebar-title">BROWSE</div>
                                {MEGA_CATEGORIES.map((cat) => (
                                    <div
                                        key={cat.id}
                                        onMouseEnter={() => setActiveMegaCategory(cat.id)}
                                        onClick={() => {
                                            setActiveMegaCategory(cat.id);
                                            // Optional: router.push(cat.href) if you want the category labels to be links too
                                        }}
                                        className={`kdj-mega-sidebar-item ${activeMegaCategory === cat.id ? 'active' : ''}`}
                                    >
                                        <span style={{ fontSize: '16px' }}>{cat.icon}</span>
                                        <div>
                                            <div className="kdj-mega-sidebar-label">{cat.label}</div>
                                            <div className="kdj-mega-sidebar-desc">{cat.desc}</div>
                                        </div>
                                        {activeMegaCategory === cat.id && <span className="kdj-mega-arrow">›</span>}
                                    </div>
                                ))}
                            </div>
                            <div className="kdj-mega-grid-wrap">
                                <div className="kdj-mega-grid">
                                    <AnimatePresence mode="wait">
                                        <motion.div 
                                            key={activeMegaCategory}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className={activeMegaCategory === "pdf-tools" ? "w-full" : "kdj-mega-grid-inner"}
                                        >
                                            {activeMegaCategory === "pdf-tools" ? (
                                                <div className="flex flex-col gap-6 w-full pb-8 pr-2">
                                                    {pdfToolsMenu.map((group) => (
                                                        <div key={group.title} className="flex flex-col gap-2">
                                                            <div className="text-[11px] font-black uppercase text-gray-500 tracking-[0.1em] pl-3 border-b border-white/5 pb-2">
                                                                {group.title}
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                {group.items.map((item) => (
                                                                    <DropdownItem 
                                                                        key={item.label} 
                                                                        item={{
                                                                            label: item.label,
                                                                            desc: `PDF ${item.label}`,
                                                                            icon: item.icon,
                                                                            href: item.href,
                                                                            color: "#10b981",
                                                                            badge: (item as any).badge
                                                                        }} 
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                getFilteredItems().map((item) => (
                                                    <DropdownItem key={item.label} item={item} />
                                                ))
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                        <div className="kdj-mega-footer">
                            <a href="/tools" onClick={(e) => { e.preventDefault(); router.push('/tools'); setActiveDropdown(null); }} className="kdj-explore-link">
                                Explore all products →
                            </a>
                        </div>
                    </NavDropdown>

                    {/* Resources */}
                    <NavDropdown id="resources" label="Resources">
                        <div className="kdj-dropdown-section-title">RESOURCES</div>
                        <div className="kdj-dropdown-grid-2">
                            {resourcesMenu.map((item) => (
                                <DropdownItem key={item.label} item={item} />
                            ))}
                        </div>
                    </NavDropdown>

                    {/* Academy */}
                    <NavDropdown id="academy" label="Academy" badge="NEW">
                        <div className="kdj-dropdown-section-title">ACADEMY</div>
                        <div className="kdj-dropdown-grid-2">
                            {academyMenu.map((item) => (
                                <DropdownItem key={item.label} item={item} />
                            ))}
                        </div>
                    </NavDropdown>

                    {/* Solutions */}
                    <NavDropdown id="solutions" label="Solutions">
                        <div className="kdj-dropdown-section-title">SOLUTIONS</div>
                        <div className="kdj-dropdown-grid-2">
                            {solutionsMenu.map((item) => (
                                <DropdownItem key={item.label} item={item} />
                            ))}
                        </div>
                    </NavDropdown>

                    {/* Article */}
                    <a href="/articles" className="kdj-nav-link" onClick={(e) => { e.preventDefault(); router.push('/articles'); }}>
                        ARTICLE
                    </a>

                    {/* About */}
                    <NavDropdown id="about" label="About">
                        <div className="kdj-dropdown-section-title">ABOUT</div>
                        <div className="kdj-dropdown-grid-2">
                            {aboutMenu.map((item) => (
                                <DropdownItem key={item.label} item={item} />
                            ))}
                        </div>
                    </NavDropdown>

                    {/* Pricing (no dropdown) */}
                    <a href="/pricing" className="kdj-nav-link" onClick={(e) => { e.preventDefault(); router.push('/pricing'); }}>
                        Pricing
                    </a>
                    {hasMembership && (
                        <a href="/donate" className="kdj-nav-link" style={{ color: "#facc15", fontWeight: "600" }} onClick={(e) => { e.preventDefault(); router.push('/donate'); }}>
                            Donate ❤️
                        </a>
                    )}
                </nav>

                {/* Right Actions */}
                <div className="kdj-header-right">
                    {/* Search */}
                    <button className="kdj-search-trigger" onClick={() => setSearchOpen(!searchOpen)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                        </svg>
                        <span className="kdj-search-label">Search</span>
                        <kbd className="kdj-search-kbd">⌘K</kbd>
                    </button>

                    {/* Theme Toggle */}
                    <button onClick={toggleTheme} className="kdj-icon-btn" aria-label="Toggle theme" title={theme === "dark" ? "Light mode" : "Dark mode"}>
                        {theme === "dark" ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round">
                                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3ea6ff" strokeWidth="2" strokeLinecap="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                            </svg>
                        )}
                    </button>

                    {/* Notifications */}
                    <button className="kdj-icon-btn" aria-label="Notifications">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                        </svg>
                    </button>

                    {/* User / Login */}
                    <div className="flex items-center">
                        {!loading && (
                            user ? (
                                <div className="relative" ref={profileRef}>
                                    <button onClick={() => setProfileOpen(!profileOpen)} className="kdj-avatar-btn">
                                        <img src={user.photoURL || "/logo/tecsub.jpg"} alt={user.displayName || "User"} />
                                    </button>
                                    <AnimatePresence>
                                        {profileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="kdj-profile-menu"
                                            >
                                                {/* User Info Header */}
                                                <div className="kdj-profile-user-header">
                                                    <div className="kdj-profile-user-row">
                                                        <img
                                                            src={user.photoURL || "/logo/tecsub.jpg"}
                                                            alt={user.displayName || "User"}
                                                            className="kdj-profile-avatar"
                                                        />
                                                        <div className="kdj-profile-user-info">
                                                            <p className="kdj-profile-name">{user.displayName || "User"}</p>
                                                            <p className="kdj-profile-username">{user.email?.split('@')[0] || "user"}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Current Plan */}
                                                <div className="kdj-profile-plan">
                                                    <div className="kdj-profile-plan-row">
                                                        <span className="kdj-profile-plan-icon">🎯</span>
                                                        <span className="kdj-profile-plan-label">Current Plan</span>
                                                        <span className="kdj-profile-plan-badge">Free</span>
                                                    </div>
                                                </div>

                                                {/* Menu Items */}
                                                <div className="kdj-profile-menu-items">
                                                    <button onClick={() => { setProfileOpen(false); router.push('/admin'); }} className="kdj-profile-menu-item">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                                                        </svg>
                                                        <span>Profile</span>
                                                        <svg className="kdj-profile-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                                                    </button>
                                                    <button onClick={() => { setProfileOpen(false); router.push('/explore'); }} className="kdj-profile-menu-item">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                                        </svg>
                                                        <span>Favorites</span>
                                                        <svg className="kdj-profile-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                                                    </button>
                                                    <button onClick={() => { setProfileOpen(false); }} className="kdj-profile-menu-item">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1-2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                                                        </svg>
                                                        <span>Settings</span>
                                                        <svg className="kdj-profile-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                                                    </button>
                                                </div>

                                                {/* Sign Out */}
                                                <div className="kdj-profile-signout-wrap">
                                                    <button onClick={handleLogout} className="kdj-profile-menu-item signout">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                                                        </svg>
                                                        <span>Sign Out</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <button
                                    onClick={() => window.dispatchEvent(new Event("tecsub-open-auth"))}
                                    className="px-5 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-white/90 transition-all flex items-center gap-2 shadow-lg shadow-white/10"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                    </svg>
                                    Sign In
                                </button>
                            )
                        )}
                    </div>

                    {/* Mobile Menu Actions */}
                    <div className="flex md:hidden items-center gap-1">
                        <button 
                            className="kdj-icon-btn" 
                            onClick={() => window.dispatchEvent(new Event("tecsub-toggle-sidebar-mobile"))}
                            aria-label="Toggle sidebar"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
                        </button>
                        <button className="kdj-hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
                            <span className={`kdj-hamburger-line ${mobileMenuOpen ? 'open' : ''}`}/>
                            <span className={`kdj-hamburger-line ${mobileMenuOpen ? 'open' : ''}`}/>
                            <span className={`kdj-hamburger-line ${mobileMenuOpen ? 'open' : ''}`}/>
                        </button>
                    </div>

                </div>
            </header>

            {/* ═══ Search Overlay ═══ */}
            <AnimatePresence>
                {searchOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="kdj-search-overlay" onClick={() => setSearchOpen(false)}>
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="kdj-search-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="kdj-search-modal-bar">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                                <input
                                    type="text" placeholder="Search TECSUB..." autoFocus
                                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); if (e.key === "Escape") setSearchOpen(false); }}
                                />
                                <kbd onClick={() => setSearchOpen(false)}>ESC</kbd>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══ Mobile Menu ═══ */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="kdj-mobile-overlay" onClick={() => setMobileMenuOpen(false)}>
                        <motion.div
                            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="kdj-mobile-menu" onClick={(e) => e.stopPropagation()}
                        >
                            <div className="kdj-mobile-menu-header">
                                <span className="font-bold text-lg" style={{ color: 'var(--yt-text-primary)' }}>Menu</span>
                                <button onClick={() => setMobileMenuOpen(false)} className="kdj-icon-btn">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                                </button>
                            </div>
                            <div className="kdj-mobile-menu-body">
                                {[
                                    { label: 'TOOLS', items: productsMenu.items },
                                    { label: 'Resources', items: resourcesMenu },
                                    { label: 'Academy', items: academyMenu },
                                    { label: 'Solutions', items: solutionsMenu },
                                    { label: 'ARTICLE', items: [
                                        { label: "All Articles", icon: "📰", href: "/articles", color: "#00E5FF" },
                                        { label: "Tech News", icon: "⚡", href: "/news", color: "#f59e0b" },
                                    ]},
                                    { label: 'About', items: aboutMenu },
                                ].map((section) => (
                                    <div key={section.label} className="kdj-mobile-section">
                                        <div className="kdj-mobile-section-title">{section.label}</div>
                                        {section.items.map((item) => (
                                            <a key={item.label} href={item.href} onClick={(e) => { e.preventDefault(); router.push(item.href); setMobileMenuOpen(false); }} className="kdj-mobile-link">
                                                <span style={{ fontSize: '14px' }}>{item.icon}</span>
                                                <span>{item.label}</span>
                                                {(item as any).badge && <span className="kdj-badge">{(item as any).badge}</span>}
                                                {(item as any).soon && <span className="kdj-soon-badge">Soon</span>}
                                            </a>
                                        ))}
                                    </div>
                                ))}
                                <a href="/pricing" onClick={(e) => { e.preventDefault(); router.push('/pricing'); setMobileMenuOpen(false); }} className="kdj-mobile-link" style={{ fontWeight: 600 }}>
                                    💰 Pricing
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}