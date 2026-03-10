"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

/* ─── Sidebar Items ─── */
interface SidebarItem {
    icon: string;
    label: string;
    href: string;
    type?: "divider" | "section-title";
}

const sidebarItems: SidebarItem[] = [
    { icon: "🏠", label: "Home", href: "/" },
    { icon: "🔥", label: "For You", href: "/" },
    { icon: "🎬", label: "Videos", href: "/explore" },
    { icon: "", label: "", href: "", type: "divider" },
    { icon: "", label: "Explore", href: "", type: "section-title" },
    { icon: "🛠️", label: "Tools", href: "/tools" },
    { icon: "📰", label: "News", href: "/news" },
    { icon: "🤖", label: "Prompts", href: "/prompts" },
    { icon: "📦", label: "Software", href: "/explore" },
    { icon: "📱", label: "Apps", href: "/apps" },
    { icon: "🛒", label: "Shop", href: "/shop" },
    { icon: "🔄", label: "Convert", href: "/tools" },
    { icon: "📚", label: "Books", href: "/explore" },
    { icon: "🖼️", label: "Images", href: "/explore" },
    { icon: "🎨", label: "Wallpapers", href: "/explore" },
    { icon: "🎓", label: "Courses", href: "/courses" },
    { icon: "⬇️", label: "Down Now", href: "/explore" },
    { icon: "", label: "", href: "", type: "divider" },
    { icon: "", label: "More", href: "", type: "section-title" },
    { icon: "🌐", label: "Community", href: "/community" },
    { icon: "📩", label: "Contacts", href: "/community" },
    { icon: "ℹ️", label: "About", href: "/about" },
    { icon: "📝", label: "Feedback", href: "/community" },
    { icon: "⚙️", label: "Studio", href: "/admin" },
];

export default function SidePanel() {
    const [expanded, setExpanded] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    /* ─── Listen for hamburger toggle from Navbar ─── */
    useEffect(() => {
        const handler = () => {
            if (window.innerWidth < 1024) {
                setMobileOpen((prev) => !prev);
            } else {
                setExpanded((prev) => !prev);
            }
        };
        window.addEventListener("yt-toggle-sidebar", handler);
        return () => window.removeEventListener("yt-toggle-sidebar", handler);
    }, []);

    /* ─── Close mobile sidebar on route change ─── */
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    const handleNav = (href: string) => {
        setMobileOpen(false);

        if (href.startsWith("/")) {
            router.push(href);
            return;
        }

        const sectionId = href.replace("#", "");
        if (pathname === "/") {
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        } else {
            router.push(`/#${sectionId}`);
        }
    };

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        if (href.startsWith("/")) return pathname.startsWith(href);
        return false;
    };

    /* ─── Sidebar Content ─── */
    const renderSidebarContent = (isMini: boolean) => (
        <nav className="py-2 space-y-0.5">
            {sidebarItems.map((item, i) => {
                if (item.type === "divider") {
                    return <div key={`div-${i}`} className="yt-sidebar-divider" />;
                }

                if (item.type === "section-title") {
                    if (isMini) return null;
                    return (
                        <div key={`title-${i}`} className="yt-sidebar-section-title">
                            {item.label}
                        </div>
                    );
                }

                return (
                    <button
                        key={item.label}
                        onClick={() => handleNav(item.href)}
                        className={`yt-sidebar-item ${isActive(item.href) ? "yt-sidebar-item-active" : ""}`}
                        title={isMini ? item.label : undefined}
                    >
                        <span className="yt-sidebar-item-icon">{item.icon}</span>
                        {!isMini && <span className="truncate">{item.label}</span>}
                    </button>
                );
            })}
        </nav>
    );

    return (
        <>
            {/* ═══ Desktop Sidebar ═══ */}
            <aside
                className={`yt-sidebar hidden lg:block ${!expanded ? "yt-sidebar-mini" : ""}`}
                id="yt-sidebar"
            >
                {renderSidebarContent(!expanded)}
            </aside>

            {/* ═══ Mobile Overlay ═══ */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-[55] bg-black/50"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="fixed top-0 left-0 bottom-0 z-[56] w-[260px] overflow-y-auto"
                            style={{
                                background: "#212121",
                            }}
                        >
                            {/* Mobile header */}
                            <div className="flex items-center gap-3 px-4 h-14 border-b border-[#3f3f3f]">
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className="yt-icon-btn"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
                                    </svg>
                                </button>
                                <a href="/" className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-md flex items-center justify-center bg-[#ff0000] p-0.5">
                                        <img
                                            src="/logo/tecsub.svg"
                                            alt="Logo"
                                            className="w-full h-full object-contain brightness-0 invert"
                                        />
                                    </div>
                                    <span className="text-base font-bold text-[#f1f1f1]">TECSUB</span>
                                </a>
                            </div>
                            <div className="px-2">
                                {renderSidebarContent(false)}
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
