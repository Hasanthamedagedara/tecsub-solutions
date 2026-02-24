"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/components/ThemeProvider";
import { t } from "@/data/translations";
import { useRouter, usePathname } from "next/navigation";

/* ─── Nav item type with optional sub-dropdown ─── */
interface NavItem {
    label: string;
    href: string;
    subs?: { label: string; href: string }[];
}

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [hoverDropdown, setHoverDropdown] = useState<string | null>(null);
    const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
    const { theme, toggleTheme, language, setLanguage } = useAppContext();
    const router = useRouter();
    const pathname = usePathname();

    const navLinks: NavItem[] = [
        {
            label: t(language, "nav_tools"),
            href: "/tools",
            subs: [
                { label: "🤖 AI Tools", href: "#ai-lab" },
                { label: "🎬 YT Tools", href: "/tools/yt-data-grab" },
                { label: "📊 Data Extract Tools", href: "/tools/yt-data-grab" },
                { label: "📱 Mobile Tools", href: "/tools" },
            ],
        },
        { label: t(language, "nav_software"), href: "#software" },
        { label: t(language, "nav_news"), href: "#news" },
        { label: "AI Tool", href: "#ai-lab" },
        { label: t(language, "nav_courses"), href: "/courses" },
        {
            label: "Apps",
            href: "/apps",
            subs: [
                { label: "🎮 Mod Apps", href: "/apps/mod" },
                { label: "🆕 New Releases", href: "/apps/new-releases" },
            ],
        },
        { label: "Online Assets", href: "/assets" },
        { label: "Shop", href: "/shop" },
        { label: "About", href: "/about" },
    ];

    const langLabels: Record<string, string> = { en: "EN", si: "සි", ta: "ත" };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setIsOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    const handleNavClick = (href: string) => {
        setIsOpen(false);
        setLangOpen(false);
        setHoverDropdown(null);
        setMobileExpanded(null);

        if (href.startsWith("/")) {
            router.push(href);
            return;
        }

        const sectionId = href.replace("#", "");

        if (pathname === "/") {
            const el = document.getElementById(sectionId);
            if (el) {
                el.scrollIntoView({ behavior: "smooth" });
            }
        } else {
            router.push(`/#${sectionId}`);
        }
    };

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="fixed top-0 left-0 right-0 z-50 glass-nav"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20">

                        {/* Logo */}
                        <a href="/" className="flex items-center gap-2 sm:gap-4 group flex-shrink-0">
                            <div className="w-9 h-9 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl flex items-center justify-center border border-white/20 bg-white/10 p-1.5 sm:p-2 transition-all group-hover:border-tecsubCyan/50">
                                <img
                                    src="/logo/tecsub.svg"
                                    alt="TecSub Logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="font-bebas text-lg sm:text-2xl md:text-3xl tracking-wider gradient-text leading-none whitespace-nowrap">
                                TECSUB SOLUTIONS
                            </span>
                        </a>

                        {/* Desktop Nav */}
                        <div className="hidden lg:flex items-center gap-0.5">
                            {navLinks.map((link) => (
                                <div
                                    key={link.label}
                                    className="relative"
                                    onMouseEnter={() => link.subs && setHoverDropdown(link.label)}
                                    onMouseLeave={() => setHoverDropdown(null)}
                                >
                                    <button
                                        onClick={() => handleNavClick(link.href)}
                                        className="px-2.5 py-2 text-[11px] font-medium uppercase tracking-wider hover:text-tecsubCyan transition-colors duration-300 flex items-center gap-1"
                                        style={{ color: "var(--text-secondary)" }}
                                    >
                                        {link.label}
                                        {link.subs && (
                                            <svg className="w-3 h-3 opacity-50" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>

                                    {/* Desktop Dropdown */}
                                    <AnimatePresence>
                                        {link.subs && hoverDropdown === link.label && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -6 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute top-full left-0 mt-1 min-w-[200px] py-2 z-[60]"
                                                style={{
                                                    background: "rgba(10,10,11,0.96)",
                                                    backdropFilter: "blur(20px)",
                                                    border: "1px solid rgba(0,229,255,0.1)",
                                                    borderRadius: "0.75rem",
                                                    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                                                }}
                                            >
                                                {link.subs.map((sub) => (
                                                    <button
                                                        key={sub.label}
                                                        onClick={() => handleNavClick(sub.href)}
                                                        className="w-full px-4 py-2.5 text-left text-[12px] font-medium hover:bg-white/5 hover:text-tecsubCyan transition-all duration-200 flex items-center gap-2"
                                                        style={{ color: "rgba(255,255,255,0.85)" }}
                                                    >
                                                        {sub.label}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>

                        {/* Right Controls */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="relative">
                                <button
                                    onClick={() => { setLangOpen(!langOpen); setIsOpen(false); }}
                                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-[10px] sm:text-xs font-bold border border-white/10 hover:border-tecsubCyan/30 transition-colors"
                                    style={{ color: "var(--text-primary)" }}
                                >
                                    {langLabels[language]}
                                </button>
                                <AnimatePresence>
                                    {langOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -8 }}
                                            className="absolute right-0 top-full mt-2 glass-panel py-1 min-w-[100px] overflow-hidden z-[60]"
                                        >
                                            {(["en", "si", "ta"] as const).map((lang) => (
                                                <button
                                                    key={lang}
                                                    onClick={() => { setLanguage(lang); setLangOpen(false); }}
                                                    className={`w-full px-4 py-2 text-left text-xs hover:bg-white/10 transition-colors ${language === lang ? "text-tecsubCyan" : ""}`}
                                                    style={{ color: language === lang ? undefined : "var(--text-primary)" }}
                                                >
                                                    {lang === "en" ? "English" : lang === "si" ? "සිංහල" : "தமிழ்"}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button
                                onClick={toggleTheme}
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center border border-white/10 hover:border-tecsubCyan/30 transition-colors"
                                aria-label="Toggle theme"
                            >
                                {theme === "dark" ? (
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-tecsubBlue" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                                    </svg>
                                )}
                            </button>

                            <a
                                href="#contact"
                                className="hidden md:inline-flex px-4 py-2 text-[10px] sm:text-xs font-semibold tracking-wider uppercase rounded-full bg-gradient-to-r from-tecsubCyan to-tecsubBlue text-tecsubNavy hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all duration-300"
                            >
                                {t(language, "get_solutions")}
                            </a>

                            <button
                                onClick={() => { setIsOpen(!isOpen); setLangOpen(false); }}
                                className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center border border-white/10 hover:border-tecsubCyan/30 transition-colors ml-1"
                                aria-label="Toggle menu"
                            >
                                <div className="flex flex-col items-center justify-center gap-[5px] w-4">
                                    <motion.span
                                        animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                                        className="block w-full h-[2px] rounded-full bg-current transition-colors"
                                        style={{ color: isOpen ? "#00E5FF" : "var(--text-primary)" }}
                                    />
                                    <motion.span
                                        animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                                        className="block w-full h-[2px] rounded-full bg-current"
                                        style={{ color: "var(--text-primary)" }}
                                    />
                                    <motion.span
                                        animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                                        className="block w-full h-[2px] rounded-full bg-current transition-colors"
                                        style={{ color: isOpen ? "#00E5FF" : "var(--text-primary)" }}
                                    />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* ═══ Mobile Menu ═══ */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="fixed top-16 sm:top-20 left-0 right-0 z-50 lg:hidden overflow-y-auto"
                            style={{ maxHeight: "calc(100vh - 4rem)" }}
                        >
                            <div
                                className="mx-3 sm:mx-4 rounded-2xl p-4 sm:p-6 shadow-2xl"
                                style={{
                                    background: "rgba(10, 10, 11, 0.95)",
                                    backdropFilter: "blur(24px)",
                                    border: "1px solid rgba(0, 229, 255, 0.1)",
                                }}
                            >
                                <div className="space-y-1 mb-4">
                                    {navLinks.map((link, i) => (
                                        <div key={link.label}>
                                            <motion.button
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.04, duration: 0.3 }}
                                                onClick={() => {
                                                    if (link.subs) {
                                                        setMobileExpanded(mobileExpanded === link.label ? null : link.label);
                                                    } else {
                                                        handleNavClick(link.href);
                                                    }
                                                }}
                                                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium uppercase tracking-wider hover:bg-tecsubCyan/10 hover:text-tecsubCyan transition-all duration-300 text-left"
                                                style={{ color: "var(--text-primary)" }}
                                            >
                                                <span className="flex items-center gap-3">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-tecsubCyan/40 flex-shrink-0" />
                                                    {link.label}
                                                </span>
                                                {link.subs && (
                                                    <motion.span
                                                        animate={{ rotate: mobileExpanded === link.label ? 180 : 0 }}
                                                        className="text-xs opacity-50"
                                                    >
                                                        ▼
                                                    </motion.span>
                                                )}
                                            </motion.button>

                                            {/* Mobile Sub-dropdown */}
                                            <AnimatePresence>
                                                {link.subs && mobileExpanded === link.label && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.25 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="ml-8 mt-1 mb-2 space-y-0.5 pl-3" style={{ borderLeft: "2px solid rgba(0,229,255,0.2)" }}>
                                                            {link.subs.map((sub) => (
                                                                <button
                                                                    key={sub.label}
                                                                    onClick={() => handleNavClick(sub.href)}
                                                                    className="w-full text-left px-3 py-2 rounded-lg text-[13px] hover:bg-white/5 transition-all"
                                                                    style={{ color: "rgba(255,255,255,0.8)" }}
                                                                >
                                                                    {sub.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>

                                <div className="h-px my-3" style={{ background: "linear-gradient(90deg, transparent, rgba(0,229,255,0.2), transparent)" }} />

                                <motion.button
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.3 }}
                                    onClick={() => { handleNavClick("#contact"); }}
                                    className="w-full py-3 rounded-full bg-gradient-to-r from-tecsubCyan to-tecsubBlue text-tecsubNavy font-bold text-sm uppercase tracking-wider hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all duration-300"
                                >
                                    {t(language, "get_solutions")}
                                </motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}