"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

/* ─── Detect if running inside Android WebView app ─── */
function isAppWebView(): boolean {
    if (typeof window === "undefined") return false;
    const ua = navigator.userAgent || "";
    if (/; wv\)/.test(ua) || /TecsubApp/i.test(ua) || ua.includes("TECSUB_APP_USER_AGENT")) return true;
    const params = new URLSearchParams(window.location.search);
    if (params.get("app") === "1" || params.get("mode") === "app") return true;
    return false;
}

/* ─── Nav Items ─── */
interface NavItem {
    key: string;
    label: string;
    icon: React.ReactNode;
    href?: string;
    action?: string;
}

const HomeIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
);

const ExploreIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 10.9c-.61 0-1.1.49-1.1 1.1s.49 1.1 1.1 1.1c.61 0 1.1-.49 1.1-1.1s-.49-1.1-1.1-1.1zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm2.19 12.19L6 18l3.81-8.19L18 6l-3.81 8.19z" />
    </svg>
);

const ChatIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
    </svg>
);

const NotifIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
    </svg>
);

const MenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </svg>
);

const navItems: NavItem[] = [
    { key: "home", label: "Home", icon: <HomeIcon />, href: "/" },
    { key: "explore", label: "Explore", icon: <ExploreIcon />, href: "/tools" },
    { key: "chat", label: "Chat", icon: <ChatIcon />, action: "open-chat" },
    { key: "notifications", label: "Alerts", icon: <NotifIcon />, href: "#" },
    { key: "menu", label: "Menu", icon: <MenuIcon />, action: "toggle-sidebar" },
];

/* ─── Component ─── */
export default function BottomNav() {
    const [activeTab, setActiveTab] = useState("home");
    const [isApp, setIsApp] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        setIsApp(isAppWebView());
    }, []);

    useEffect(() => {
        if (pathname === "/") setActiveTab("home");
        else if (pathname === "/tools") setActiveTab("explore");
    }, [pathname]);

    const handleNavClick = (item: NavItem) => {
        setActiveTab(item.key);

        if (item.action === "open-chat") {
            window.dispatchEvent(new CustomEvent("tecsub-toggle-chat"));
            return;
        }

        if (item.action === "toggle-sidebar") {
            window.dispatchEvent(new CustomEvent("yt-toggle-sidebar"));
            return;
        }

        if (item.href) {
            if (item.href.startsWith("#")) {
                const el = document.getElementById(item.href.replace("#", ""));
                if (el) el.scrollIntoView({ behavior: "smooth" });
            } else {
                router.push(item.href);
            }
        }
    };

    return (
        <nav className="bottom-nav" id="bottom-nav">
            {navItems.map((item) => (
                <button
                    key={item.key}
                    onClick={() => handleNavClick(item)}
                    className={`bottom-nav-item ${activeTab === item.key ? "bottom-nav-item-active" : ""}`}
                    aria-label={item.label}
                >
                    <span className="bottom-nav-icon">{item.icon}</span>
                    <span className="bottom-nav-label">{item.label}</span>
                </button>
            ))}
        </nav>
    );
}
