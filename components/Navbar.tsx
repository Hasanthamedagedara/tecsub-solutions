"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/components/ThemeProvider";
import { t } from "@/data/translations";
import { useRouter, usePathname } from "next/navigation";

/* ─── YouTube-Style Header Bar ─── */
export default function Navbar() {
    const [searchFocused, setSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const { theme, toggleTheme, language, setLanguage } = useAppContext();
    const router = useRouter();
    const searchRef = useRef<HTMLInputElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    /* ─── Close profile menu on outside click ─── */
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    /* ─── Toggle sidebar via custom event ─── */
    const toggleSidebar = () => {
        window.dispatchEvent(new CustomEvent("yt-toggle-sidebar"));
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            // Future: implement search
            console.log("Search:", searchQuery);
        }
    };

    return (
        <header className="yt-header" id="yt-header">
            {/* ─── Left: Hamburger + Logo ─── */}
            <div className="yt-header-left">
                <a href="/" className="flex items-center gap-2 group flex-shrink-0">
                    <div className="w-8 h-8 flex-shrink-0 rounded-lg flex items-center justify-center bg-yt-red p-1">
                        <img
                            src="/logo/tecsub.svg"
                            alt="TecSub Logo"
                            className="w-full h-full object-contain brightness-0 invert"
                        />
                    </div>
                    <span className="text-lg font-bold tracking-tight text-yt-text leading-none whitespace-nowrap hidden sm:block">
                        TECSUB
                    </span>
                </a>
            </div>

            {/* ─── Center: Search Bar ─── */}
            <div className="yt-header-center hidden md:flex">
                <div className={`yt-search-bar ${searchFocused ? "border-yt-accent" : ""}`}>
                    <input
                        ref={searchRef}
                        type="text"
                        className="yt-search-input"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button className="yt-search-btn" onClick={handleSearch} aria-label="Search">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.87,20.17l-5.59-5.59C16.35,13.35,17,11.75,17,10c0-3.87-3.13-7-7-7s-7,3.13-7,7s3.13,7,7,7c1.75,0,3.35-0.65,4.58-1.71l5.59,5.59L20.87,20.17z M5,10c0-2.76,2.24-5,5-5s5,2.24,5,5s-2.24,5-5,5S5,12.76,5,10z" />
                        </svg>
                    </button>
                </div>

                {/* Voice search button */}
                <button className="yt-icon-btn ml-2" aria-label="Voice search">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z" />
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                    </svg>
                </button>
            </div>

            {/* ─── Right: Icons ─── */}
            <div className="yt-header-right">
                {/* Mobile search button */}
                <button
                    className="yt-icon-btn md:hidden"
                    onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                    aria-label="Search"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.87,20.17l-5.59-5.59C16.35,13.35,17,11.75,17,10c0-3.87-3.13-7-7-7s-7,3.13-7,7s3.13,7,7,7c1.75,0,3.35-0.65,4.58-1.71l5.59,5.59L20.87,20.17z M5,10c0-2.76,2.24-5,5-5s5,2.24,5,5s-2.24,5-5,5S5,12.76,5,10z" />
                    </svg>
                </button>

                {/* Create / Upload */}
                <button className="yt-icon-btn hidden sm:flex" aria-label="Create">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14,13h-3v3H9v-3H6v-2h3V8h2v3h3V13z M17,6H3v12h14v-6.39l4,1.83V8.56l-4,1.83V6 M18,5v3.83L22,7v10l-4-1.83V19H2V5H18L18,5z" />
                    </svg>
                </button>

                {/* Notifications */}
                <button className="yt-icon-btn hidden sm:flex relative" aria-label="Notifications">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
                    </svg>
                    <span className="absolute top-1 right-1 w-[18px] h-[18px] rounded-full bg-yt-red text-[10px] font-medium text-white flex items-center justify-center">
                        3
                    </span>
                </button>

                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className="yt-icon-btn"
                    aria-label="Toggle theme"
                >
                    {theme === "dark" ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-yt-accent">
                            <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                        </svg>
                    )}
                </button>

                {/* Profile avatar */}
                <div ref={profileRef} className="relative">
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="yt-avatar"
                        aria-label="Profile menu"
                    >
                        T
                    </button>

                    <AnimatePresence>
                        {profileOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden z-[70]"
                                style={{
                                    background: "#282828",
                                    border: "1px solid #3f3f3f",
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                                    width: "min(300px, calc(100vw - 32px))",
                                }}
                            >
                                {/* Profile header */}
                                <div className="p-4 flex items-center gap-3 border-b border-[#3f3f3f]">
                                    <div className="yt-avatar w-10 h-10 text-base">T</div>
                                    <div>
                                        <div className="text-sm font-medium text-[#f1f1f1]">Tecsub Solutions</div>
                                        <div className="text-xs text-[#aaa]">@tecsubsolutions</div>
                                    </div>
                                </div>

                                {/* Menu items */}
                                <div className="py-2">
                                    {[
                                        { icon: "👤", label: "Your channel", href: "/about" },
                                        { icon: "🎬", label: "Studio", href: "/admin" },
                                        { icon: "🛒", label: "Shop", href: "/shop" },
                                        { icon: "📚", label: "Courses", href: "/courses" },
                                    ].map((item) => (
                                        <button
                                            key={item.label}
                                            onClick={() => { setProfileOpen(false); router.push(item.href); }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#f1f1f1] hover:bg-white/10 transition-colors text-left"
                                        >
                                            <span className="text-lg">{item.icon}</span>
                                            {item.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Language section */}
                                <div className="border-t border-[#3f3f3f] py-2">
                                    <div className="px-4 py-1 text-xs text-[#aaa] uppercase tracking-wider">Language</div>
                                    <div className="flex gap-1 px-4 py-2">
                                        {(["en", "si", "ta"] as const).map((lang) => (
                                            <button
                                                key={lang}
                                                onClick={() => { setLanguage(lang); setProfileOpen(false); }}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${language === lang
                                                    ? "bg-yt-accent text-[#0f0f0f]"
                                                    : "bg-white/10 text-[#f1f1f1] hover:bg-white/20"
                                                    }`}
                                            >
                                                {lang === "en" ? "EN" : lang === "si" ? "සිං" : "தமி"}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ─── Mobile Search Overlay ─── */}
            <AnimatePresence>
                {mobileSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute inset-0 bg-[#0f0f0f] z-[70] flex items-center px-3 gap-2"
                    >
                        <button
                            onClick={() => setMobileSearchOpen(false)}
                            className="yt-icon-btn flex-shrink-0"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                            </svg>
                        </button>
                        <div className="yt-search-bar flex-1">
                            <input
                                type="text"
                                className="yt-search-input"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                autoFocus
                            />
                            <button className="yt-search-btn" onClick={handleSearch}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.87,20.17l-5.59-5.59C16.35,13.35,17,11.75,17,10c0-3.87-3.13-7-7-7s-7,3.13-7,7s3.13,7,7,7c1.75,0,3.35-0.65,4.58-1.71l5.59,5.59L20.87,20.17z M5,10c0-2.76,2.24-5,5-5s5,2.24,5,5s-2.24,5-5,5S5,12.76,5,10z" />
                                </svg>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}