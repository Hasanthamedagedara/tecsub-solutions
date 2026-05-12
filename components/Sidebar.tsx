"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

/* ─── Sidebar Navigation Config ─── */
const sidebarMain = [
    { title: "Home", href: "/", icon: "🏠" },
    { title: "TECSUB AI", href: "/chat", icon: "🤖" },
    { title: "TECSUB Tools", href: "/tools", icon: "🔧" },
    { title: "TECSUB APP", href: "https://play.google.com/store/apps/details?id=com.tecsub.solutions", icon: "📱" },
    { title: "TECSUB POSS", href: "/pos", icon: "🖥️" },
    { title: "Videos", href: "/videos", icon: "▶️" },
    { title: "News", href: "/news", icon: "📰" },
];

const sidebarTools = [
    { title: "Designer", href: "/designer", icon: "🎨" },
    { title: "Sinhala Typing", href: "/singlish", icon: "සි" },
    { title: "Captions", href: "/captions", icon: "🎫" },
    { title: "OCR Scanner", href: "/ocr", icon: "📸" },
    { title: "BG Remover", href: "/bg-remover", icon: "✂️" },
    { title: "Image Enhancer", href: "/enhancer", icon: "🪄" },
    { title: "Image Resizer", href: "/resizer", icon: "📏" },
    { title: "Image Converter", href: "/converter", icon: "🔄" },
    { title: "AI Clipping", href: "/clipping", icon: "✨" },
    { title: "Downloader", href: "/downloader", icon: "📥" },
    { title: "YT Tag Extractor", href: "/yt-tags", icon: "🎬" },
    { title: "Keyword Gen", href: "/keywords", icon: "🔍" },
    { title: "Translator", href: "/translator", icon: "🌐" },
    { title: "AI Prompts", href: "/prompts", icon: "🤖" },
    { title: "File Editor", href: "/editor", icon: "✏️" },
];

const sidebarContent = [
    { title: "Courses", href: "/courses", icon: "🎓" },
    { title: "Software", href: "/software", icon: "💻" },
    { title: "Apps", href: "/apps", icon: "📱" },
    { title: "Books", href: "/books", icon: "📚" },
    { title: "Movies", href: "/movies", icon: "🎬" },
    { title: "Images", href: "/images", icon: "🖼️" },
    { title: "Wallpapers", href: "/wallpapers", icon: "🎨" },
    { title: "Assets", href: "/assets", icon: "📦" },
];

const sidebarAccount = [
    { title: "Community", href: "/community", icon: "👥" },
    { title: "About", href: "/about", icon: "ℹ️" },
    { title: "Donate", href: "/donate", icon: "❤️" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [hasMembership, setHasMembership] = useState(false);

    /* Sync CSS variable for fixed bars offset */
    useEffect(() => {
        const w = collapsed ? "68px" : "260px";
        document.documentElement.style.setProperty("--sidebar-w", w);
    }, [collapsed]);

    /* External toggle listener & Membership sync */
    useEffect(() => {
        const checkMembership = () => {
            const isPro = localStorage.getItem("tecsub_sub_pro_paid") === "true";
            const isUltra = localStorage.getItem("tecsub_sub_ultra_paid") === "true";
            setHasMembership(isPro || isUltra);
        };
        checkMembership();
        window.addEventListener("storage", checkMembership);

        const handleToggle = () => setCollapsed(prev => !prev);
        const handleMobileToggle = () => setMobileOpen(prev => !prev);
        window.addEventListener("tecsub-toggle-sidebar", handleToggle);
        window.addEventListener("tecsub-toggle-sidebar-mobile", handleMobileToggle);
        return () => {
            window.removeEventListener("tecsub-toggle-sidebar", handleToggle);
            window.removeEventListener("tecsub-toggle-sidebar-mobile", handleMobileToggle);
            window.removeEventListener("storage", checkMembership);
        };
    }, []);

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    const NavItem = ({ item }: { item: { title: string; href: string; icon: string } }) => {
        const isExternal = item.href.startsWith("http");
        const isChat = item.href === "/chat";
        const active = !isExternal && isActive(item.href);

        const handleClick = (e: React.MouseEvent) => {
            if (item.href === "#chat") {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("tecsub-toggle-chat"));
            }
            setMobileOpen(false);
        };

        if (isExternal) {
            return (
                <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kdj-sidebar-item"
                >
                    <span className="kdj-sidebar-item-icon">{item.icon}</span>
                    {(!collapsed || mobileOpen) && <span className="kdj-sidebar-item-label">{item.title}</span>}
                    {!collapsed && (
                        <svg className="ml-auto opacity-40" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                        </svg>
                    )}
                </a>
            );
        }

        return (
            <Link
                href={item.href}
                onClick={handleClick}
                className={`kdj-sidebar-item ${active ? "active" : ""} ${isChat ? "chat-btn" : ""}`}
            >
                {active && <span className="kdj-sidebar-indicator" />}
                <span className="kdj-sidebar-item-icon">{item.icon}</span>
                {(!collapsed || mobileOpen) && <span className="kdj-sidebar-item-label">{item.title}</span>}
            </Link>
        );
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className="kdj-sidebar-toggle"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle sidebar"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
            </button>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className="kdj-sidebar-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`kdj-global-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "open" : ""}`}>
                {/* Brand & Toggle Section */}
                <div className="kdj-sidebar-header-wrap">
                    <button
                        className="kdj-sidebar-main-toggle"
                        onClick={() => setCollapsed(!collapsed)}
                        aria-label={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.3s ease" }}>
                            <rect x="3" y="3" width="18" height="18" rx="3" />
                            <line x1="9" y1="3" x2="9" y2="21" />
                            <path d="M16 15l-3-3 3-3" />
                        </svg>
                    </button>
                    {(!collapsed || mobileOpen) && (
                        <div className="kdj-sidebar-brand-simple">
                            <span className="kdj-sidebar-brand-name">
                                TecSub<span style={{ color: "#dc2626" }}>.lk</span>
                            </span>
                        </div>
                    )}
                </div>

                {/* Scrollable Nav */}
                <nav className="kdj-sidebar-nav">
                    {sidebarMain.map((item, idx) => <NavItem key={`${item.href}-${idx}`} item={item} />)}

                    {(!collapsed || mobileOpen) && <div className="kdj-sidebar-section-label">TOOLS</div>}
                    {sidebarTools.map((item) => <NavItem key={item.href} item={item} />)}

                    {(!collapsed || mobileOpen) && <div className="kdj-sidebar-section-label">CONTENT</div>}
                    {sidebarContent.map((item) => <NavItem key={item.href} item={item} />)}

                    {(!collapsed || mobileOpen) && <div className="kdj-sidebar-section-label">MORE</div>}
                    {sidebarAccount.filter(item => item.title !== "Donate" || hasMembership).map((item) => <NavItem key={item.href} item={item} />)}
                </nav>

                {/* Footer */}
                <div className="kdj-sidebar-footer">
                    {(!collapsed || mobileOpen) ? (
                        <div className="kdj-sidebar-footer-text">
                            <span>© 2026 TecSub Solutions</span>
                        </div>
                    ) : (
                        <div className="kdj-sidebar-footer-text">
                            <span>©</span>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}
