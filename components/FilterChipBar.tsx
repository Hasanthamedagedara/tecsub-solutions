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
    { key: "videos", label: "Videos", scrollTo: "videos" },
    { key: "tools", label: "Tools", href: "/tools" },
    { key: "news", label: "News", scrollTo: "news" },
    { key: "ai", label: "AI Lab", scrollTo: "ai-lab" },
    { key: "prompts", label: "AI Prompts", href: "/prompts" },
    { key: "courses", label: "Courses", href: "/courses" },
    { key: "apps", label: "Apps", href: "/apps" },
    { key: "software", label: "Software", scrollTo: "software" },
    { key: "shop", label: "Shop", href: "/shop" },
    { key: "community", label: "Community", scrollTo: "social" },
    { key: "updates", label: "Recently uploaded", scrollTo: "recent-updates" },
    { key: "live", label: "Live", scrollTo: "videos" },
];

/* ─── Component ─── */
export default function FilterChipBar() {
    const [activeTab, setActiveTab] = useState("all");
    const scrollRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const pathname = usePathname();

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
