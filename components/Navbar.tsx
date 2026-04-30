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
                    <div className="w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden flex items-center justify-center bg-black">
                        <img
                            src="/logo/tecsub.jpg"
                            alt="TecSub Logo"
                            className="w-full h-full object-cover"
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

                {/* TECSUB POS Link */}
                <a
                    href="https://tecsubsolution.kozow.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 ml-4 px-3 py-1.5 rounded-lg hover:bg-yt-bg-hover transition-colors group shrink-0"
                    title="Open TECSUB POS"
                >
                    <div className="w-8 h-8 rounded-full bg-yt-accent/10 flex items-center justify-center text-yt-accent group-hover:bg-yt-accent group-hover:text-white transition-all">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                        </svg>
                    </div>
                    <div className="flex flex-col leading-tight hidden lg:flex">
                        <span className="text-[10px] font-bold text-yt-text-secondary uppercase tracking-tighter">System</span>
                        <span className="text-sm font-bold text-yt-text group-hover:text-yt-accent whitespace-nowrap">TECSUB POS</span>
                    </div>
                </a>

                {/* Google Play Store Link */}
                <a
                    href="https://play.google.com/store/apps/details?id=com.tecsub.solutions&hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 ml-4 px-3 py-1.5 rounded-lg hover:bg-yt-bg-hover transition-colors group shrink-0"
                    title="Download Tecsub App on Google Play"
                >
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.523 15.3414L20.355 12.5094L17.523 9.67742V15.3414ZM3.65503 2.50742L11.587 10.4394L13.841 8.18542L3.65503 2.50742ZM3.65503 22.5114L13.841 16.8334L11.587 14.5794L3.65503 22.5114ZM2.85503 3.32742V21.6914L10.771 13.7754L2.85503 3.32742ZM14.655 8.99942L12.385 11.2694L16.713 15.5974L21.155 13.3134C21.611 13.0854 21.855 12.6514 21.855 12.2134C21.855 11.7754 21.611 11.3414 21.155 11.1134L14.655 8.99942Z" />
                        </svg>
                    </div>
                    <div className="flex flex-col leading-tight hidden lg:flex">
                        <span className="text-[10px] font-bold text-yt-text-secondary uppercase tracking-tighter">Android App</span>
                        <span className="text-sm font-bold text-yt-text group-hover:text-green-500 whitespace-nowrap">Play Store</span>
                    </div>
                </a>

                {/* TECSUB UNIVERSAL POS Link */}
                <a
                    href="https://tecsubuniversalposs.kozow.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 ml-4 px-3 py-1.5 rounded-lg hover:bg-yt-bg-hover transition-colors group shrink-0"
                    title="Open TECSUB UNIVERSAL POS"
                >
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <div className="flex flex-col leading-tight hidden xl:flex">
                        <span className="text-[10px] font-bold text-yt-text-secondary uppercase tracking-tighter">Enterprise</span>
                        <span className="text-sm font-bold text-yt-text group-hover:text-blue-400 whitespace-nowrap">Universal POS</span>
                    </div>
                </a>
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