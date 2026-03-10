"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

/* ─── Tab Config ─── */
interface ChipTab {
    key: string;
    label: string;
    scrollTo?: string;
    href?: string;
}

const TABS: ChipTab[] = [
    { key: "all", label: "All" },
    { key: "foryou", label: "For You", scrollTo: "discovery-feed" },
    { key: "news", label: "News", scrollTo: "news" },
    { key: "prompts", label: "Prompts", href: "/prompts" },
    { key: "tools", label: "Tools", href: "/tools" },
    { key: "assets", label: "Assets", href: "/assets" },
    { key: "apps", label: "Apps", href: "/apps" },
    { key: "software", label: "Software", scrollTo: "software" },
    { key: "shop", label: "Shop", href: "/shop" },
    { key: "convert", label: "Convert", href: "/tools" },
    { key: "books", label: "Books", scrollTo: "content-sections" },
    { key: "videos", label: "Videos", scrollTo: "videos" },
    { key: "images", label: "Images", scrollTo: "content-sections" },
    { key: "wallpapers", label: "Wallpapers", scrollTo: "content-sections" },
    { key: "courses", label: "Course", href: "/courses" },
    { key: "website", label: "Website", scrollTo: "discovery-feed" },
    { key: "downnow", label: "Down Now", scrollTo: "software" },
    { key: "contacts", label: "Contacts", scrollTo: "social" },
    { key: "about", label: "About", href: "/about" },
    { key: "feedback", label: "Feedback", scrollTo: "social" },
];

/* ─── Detect if running inside Android WebView app ─── */
function isAppWebView(): boolean {
    if (typeof window === "undefined") return false;

    const ua = navigator.userAgent || "";

    // Detect Android WebView: contains "wv" (WebView marker)
    // or custom app identifier "TecsubApp"
    if (/; wv\)/.test(ua) || /TecsubApp/i.test(ua)) return true;

    // Also detect via URL parameter: ?app=1 or ?mode=app
    const params = new URLSearchParams(window.location.search);
    if (params.get("app") === "1" || params.get("mode") === "app") return true;

    return false;
}

/* ─── Component ─── */
export default function FilterChipBar() {
    const [activeTab, setActiveTab] = useState("all");
    const [isApp, setIsApp] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();

    /* ─── Detect app on mount ─── */
    useEffect(() => {
        const inApp = isAppWebView();
        setIsApp(inApp);

        // When running in app, set CSS variable to 0 so content
        // margin-top adjusts (no chip bar height)
        if (inApp) {
            document.documentElement.style.setProperty("--yt-chipbar-height", "0px");
        }
    }, []);

    const handleChipClick = useCallback(
        (tab: ChipTab) => {
            setActiveTab(tab.key);

            if (tab.key === "all") {
                if (pathname !== "/") {
                    router.push("/");
                } else {
                    window.dispatchEvent(new CustomEvent("tecsub-reshuffle-feed"));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }
                return;
            }

            if (tab.href) {
                router.push(tab.href);
                return;
            }

            if (tab.scrollTo) {
                if (pathname !== "/") {
                    router.push(`/#${tab.scrollTo}`);
                } else {
                    const el = document.getElementById(tab.scrollTo);
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                }
            }
        },
        [pathname, router]
    );

    /* ─── Hide completely when inside app ─── */
    if (isApp) return null;

    return (
        <div className="chip-bar" id="yt-chip-bar">
            <div ref={scrollRef} className="chip-bar-scroll">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => handleChipClick(tab)}
                        className={`chip-item ${activeTab === tab.key ? "chip-item-active" : ""}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
