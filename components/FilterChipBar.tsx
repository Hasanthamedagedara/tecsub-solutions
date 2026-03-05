"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

/* ─── Tab Config ─── */
interface DropdownItem {
    label: string;
    icon: string;
    href?: string;          // route or hash
    action?: string;        // e.g. "mailto:", "whatsapp", "telegram"
}

interface ChipTab {
    key: string;
    label: string;
    scrollTo?: string;      // section-id for same-page scroll
    href?: string;          // for route navigation
    dropdown?: DropdownItem[];
}

const CHIP_TABS: ChipTab[] = [
    {
        key: "all",
        label: "All",
        scrollTo: "top",
    },
    {
        key: "recent",
        label: "Recent",
        scrollTo: "recent-updates",
    },
    {
        key: "trending",
        label: "Trending",
        scrollTo: "discovery-feed",
    },
    {
        key: "post",
        label: "Post",
        scrollTo: "content-sections",
    },
    {
        key: "video",
        label: "Video",
        scrollTo: "videos",
    },
    {
        key: "tools",
        label: "Tools",
        dropdown: [
            { label: "AI Tools", icon: "🤖", href: "#ai-lab" },
            { label: "YT Tools", icon: "🎬", href: "/tools/yt-data-grab" },
            { label: "Data Extract", icon: "📊", href: "/tools/yt-data-grab" },
            { label: "Mobile Tools", icon: "📱", href: "/tools" },
        ],
    },
    {
        key: "books",
        label: "Books",
        dropdown: [
            { label: "All Courses", icon: "🎓", href: "/courses" },
            { label: "Masterclass", icon: "🏆", href: "/courses" },
            { label: "Free Courses", icon: "🆓", href: "/courses" },
        ],
    },
    {
        key: "shop",
        label: "Shop",
        href: "/shop",
    },
    {
        key: "assets",
        label: "Assets",
        dropdown: [
            { label: "Website UI", icon: "🖥️", href: "/assets" },
            { label: "Transitions", icon: "✨", href: "/assets" },
            { label: "LUTs", icon: "🎨", href: "/assets" },
            { label: "Sound Effects", icon: "🔊", href: "/assets" },
            { label: "BG Music", icon: "🎵", href: "/assets" },
        ],
    },
    {
        key: "prompts",
        label: "Prompts",
        scrollTo: "ai-prompts",
    },
    {
        key: "convert",
        label: "Convert",
        scrollTo: "online-tools",
    },
    {
        key: "about",
        label: "About",
        href: "/about",
    },
    {
        key: "contact",
        label: "Contact Us",
        dropdown: [
            { label: "Email", icon: "📧", action: "mailto:tecsubsolutions@gmail.com" },
            { label: "WhatsApp", icon: "💬", action: "https://wa.me/94768123456" },
            { label: "Telegram", icon: "✈️", action: "https://t.me/tecsubsolutions" },
        ],
    },
];

/* ─── Component ─── */
export default function FilterChipBar() {
    const router = useRouter();
    const pathname = usePathname();
    const scrollRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);

    const [active, setActive] = useState("all");
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    /* Close dropdown on outside click */
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (barRef.current && !barRef.current.contains(e.target as Node)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    /* ─── Navigation handler ─── */
    const handleNav = useCallback(
        (href: string) => {
            setOpenDropdown(null);

            // External or action links
            if (href.startsWith("mailto:") || href.startsWith("https://wa.me") || href.startsWith("https://t.me")) {
                window.open(href, "_blank");
                return;
            }

            // Route navigation
            if (href.startsWith("/")) {
                router.push(href);
                return;
            }

            // Hash scroll
            const sectionId = href.replace("#", "");
            if (sectionId === "top") {
                window.scrollTo({ top: 0, behavior: "smooth" });
                return;
            }

            if (pathname === "/") {
                const el = document.getElementById(sectionId);
                if (el) el.scrollIntoView({ behavior: "smooth" });
            } else {
                router.push(`/#${sectionId}`);
            }
        },
        [pathname, router]
    );

    /* ─── Chip click ─── */
    const handleChipClick = (tab: ChipTab) => {
        setActive(tab.key);

        if (tab.dropdown) {
            setOpenDropdown(openDropdown === tab.key ? null : tab.key);
            return;
        }

        if (tab.href) {
            handleNav(tab.href);
            return;
        }

        if (tab.scrollTo) {
            handleNav(`#${tab.scrollTo}`);
        }

        // Dispatch reshuffle event when "All" is clicked
        if (tab.key === "all") {
            window.dispatchEvent(new CustomEvent("tecsub-reshuffle-feed"));
        }
    };

    /* ─── Dropdown item click ─── */
    const handleDropdownClick = (item: DropdownItem) => {
        if (item.action) {
            handleNav(item.action);
        } else if (item.href) {
            handleNav(item.href);
        }
    };

    return (
        <motion.div
            ref={barRef}
            className="chip-bar hidden lg:block"
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            {/* Scroll container */}
            <div
                ref={scrollRef}
                className="chip-bar-scroll"
            >
                {CHIP_TABS.map((tab, index) => (
                    <motion.div
                        key={tab.key}
                        className="relative"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 0.35,
                            delay: 0.15 + index * 0.05,
                            ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                    >
                        {/* Chip button */}
                        <motion.button
                            whileTap={{ scale: 0.93 }}
                            onClick={() => handleChipClick(tab)}
                            className={`chip-item ${active === tab.key ? "chip-item-active" : ""}`}
                        >
                            <span>{tab.label}</span>
                            {tab.dropdown && (
                                <motion.svg
                                    animate={{ rotate: openDropdown === tab.key ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="chip-arrow"
                                    width="10"
                                    height="10"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </motion.svg>
                            )}
                        </motion.button>

                        {/* Dropdown */}
                        <AnimatePresence>
                            {tab.dropdown && openDropdown === tab.key && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                                    transition={{ duration: 0.18 }}
                                    className="chip-dropdown"
                                >
                                    {tab.dropdown.map((item, di) => (
                                        <motion.button
                                            key={item.label}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: di * 0.04, duration: 0.15 }}
                                            onClick={() => handleDropdownClick(item)}
                                            className="chip-dropdown-item"
                                        >
                                            <span className="chip-dropdown-icon">{item.icon}</span>
                                            <span>{item.label}</span>
                                        </motion.button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
