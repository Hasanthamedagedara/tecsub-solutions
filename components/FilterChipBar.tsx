"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

/* ─── Tab Config ─── */
interface ChipTab {
    key: string;
    label: string;
    href?: string;
    scrollTo?: string;
}

const TABS: ChipTab[] = [
    { key: "all", label: "All", href: "/" },
    { key: "foryou", label: "For You", href: "/" },
    { key: "news", label: "News", href: "/news" },
    { key: "prompts", label: "Prompts", href: "/prompts" },
    { key: "tools", label: "Tools", href: "/tools" },
    { key: "editor", label: "File Edit", href: "/editor" },
    { key: "translator", label: "Translator", href: "/translator" },
    { key: "assets", label: "Assets", href: "/explore" },
    { key: "apps", label: "Apps", href: "/apps" },
    { key: "software", label: "Software", href: "/explore" },
    { key: "shop", label: "Shop", href: "/shop" },
    { key: "convert", label: "Convert", href: "/tools" },
    { key: "books", label: "Books", href: "/explore" },
    { key: "videos", label: "Videos", href: "/explore" },
    { key: "images", label: "Images", href: "/explore" },
    { key: "wallpapers", label: "Wallpapers", href: "/explore" },
    { key: "courses", label: "Course", href: "/courses" },
    { key: "website", label: "Website", href: "/" },
    { key: "downnow", label: "Down Now", href: "/explore" },
    { key: "contacts", label: "Contacts", href: "/community" },
    { key: "about", label: "About", href: "/about" },
    { key: "feedback", label: "Feedback", href: "/community" },
];

/* ─── Detect WebView ─── */
function isAppWebView(): boolean {
    if (typeof window === "undefined") return false;
    const ua = navigator.userAgent || "";
    if (/; wv\)/.test(ua) || /TecsubApp/i.test(ua)) return true;
    const p = new URLSearchParams(window.location.search);
    return p.get("app") === "1" || p.get("mode") === "app";
}

/* ═══════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════ */
export default function FilterChipBar() {
    const [activeTab, setActiveTab] = useState("all");
    const [isApp, setIsApp] = useState(false);
    const [paused, setPaused] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();

    /* ─── Detect app ─── */
    useEffect(() => {
        const inApp = isAppWebView();
        setIsApp(inApp);
        if (inApp) {
            document.documentElement.style.setProperty("--yt-chipbar-height", "0px");
        }
    }, []);

    /* ─── Sync animation-play-state via CSS var ─── */
    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;
        el.style.animationPlayState = paused ? "paused" : "running";
    }, [paused]);

    const handleChipClick = useCallback(
        (tab: ChipTab) => {
            setActiveTab(tab.key);
            if (tab.key === "all") {
                if (pathname !== "/") { router.push("/"); }
                else {
                    window.dispatchEvent(new CustomEvent("tecsub-reshuffle-feed"));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }
                return;
            }
            if (tab.href) { router.push(tab.href); return; }
            if (tab.scrollTo) {
                if (pathname !== "/") { router.push(`/#${tab.scrollTo}`); }
                else {
                    const el = document.getElementById(tab.scrollTo);
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                }
            }
        },
        [pathname, router]
    );

    if (isApp) return null;

    return (
        <div
            className="chip-bar"
            id="yt-chip-bar"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setTimeout(() => setPaused(false), 1200)}
        >
            {/* ─── Ticker wrapper: the two duplicate sets ─── */}
            <div ref={wrapperRef} className="chip-ticker-wrapper">
                {/* Set A */}
                <div className="chip-ticker-set">
                    {TABS.map((tab) => (
                        <button
                            key={`a-${tab.key}`}
                            onClick={() => handleChipClick(tab)}
                            className={`chip-item ${activeTab === tab.key ? "chip-item-active" : ""}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                {/* Set B — duplicate for seamless loop */}
                <div className="chip-ticker-set" aria-hidden="true">
                    {TABS.map((tab) => (
                        <button
                            key={`b-${tab.key}`}
                            onClick={() => handleChipClick(tab)}
                            className={`chip-item ${activeTab === tab.key ? "chip-item-active" : ""}`}
                            tabIndex={-1}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
