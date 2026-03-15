"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/components/ThemeProvider";
import { t } from "@/data/translations";
import { useRouter, usePathname } from "next/navigation";
import AuthButton from "@/components/AuthButton";

/* ─── Detect if running inside Android WebView app ─── */
function isAppWebView(): boolean {
    if (typeof window === "undefined") return false;
    const ua = navigator.userAgent || "";
    if (ua.includes("TECSUB_APP_USER_AGENT") || /TecsubApp/i.test(ua) || /; wv\)/.test(ua)) return true;
    const params = new URLSearchParams(window.location.search);
    if (params.get("app") === "1" || params.get("mode") === "app") return true;
    return false;
}

/* ─── YouTube-Style Header Bar ─── */
export default function Navbar() {
    const [searchFocused, setSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [isApp, setIsApp] = useState(false);
    const { theme, toggleTheme, language, setLanguage } = useAppContext();
    const router = useRouter();
    const searchRef = useRef<HTMLInputElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    /* ─── Detect app on mount ─── */
    useEffect(() => {
        setIsApp(isAppWebView());
    }, []);

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

    /* ─── Hide completely when inside app ─── */
    if (isApp) return null;


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

                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className="yt-icon-btn mr-2"
                    aria-label="Toggle theme"
                    title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                >
                    {theme === "dark" ? (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" y1="1" x2="12" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" />
                            <line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                    ) : (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3ea6ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                    )}
                </button>

                {/* Login / Sign Up */}
                <div className="flex items-center gap-2">
                    <AuthButton variant="primary" onClick={() => router.push('/login')}>Login</AuthButton>
                    <AuthButton variant="outline" className="hidden sm:flex" onClick={() => router.push('/signup')}>Sign Up</AuthButton>
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