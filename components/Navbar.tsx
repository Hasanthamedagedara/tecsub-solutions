"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/components/ThemeProvider";
import { t } from "@/data/translations";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const { theme, toggleTheme, language, setLanguage } = useAppContext();
    const router = useRouter();
    const pathname = usePathname();

    const navLinks = [
        { label: t(language, "nav_tools"), href: "#tools" },
        { label: t(language, "nav_software"), href: "#software" },
        { label: t(language, "nav_news"), href: "#news" },
        { label: t(language, "nav_videos"), href: "#videos" },
        { label: t(language, "nav_prompts"), href: "#prompts" },
        { label: t(language, "nav_courses"), href: "#courses" },
        { label: "Apps", href: "/apps" },
    ];

    const langLabels: Record<string, string> = { en: "EN", si: "සි", ta: "ත" };

    // Close mobile menu on resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setIsOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    // Handle nav link click — works from any page
    const handleNavClick = (href: string) => {
        setIsOpen(false);
        setLangOpen(false);

        // Page links (e.g., /apps) — navigate directly
        if (href.startsWith("/")) {
            router.push(href);
            return;
        }

        const sectionId = href.replace("#", "");

        if (pathname === "/" || pathname === "/tecsub-solutions/" || pathname === "/tecsub-solutions") {
            // On home page — scroll to section
            const el = document.getElementById(sectionId);
            if (el) {
                el.scrollIntoView({ behavior: "smooth" });
            }
        } else {
            // On subpage — navigate home first, then scroll
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
                                    src="/tecsub-solutions/logo/tecsub.svg"
                                    alt="TecSub Logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <span className="font-bebas text-lg sm:text-2xl md:text-3xl tracking-wider gradient-text leading-none whitespace-nowrap">
                                TECSUB SOLUTIONS
                            </span>
                        </a>

                        {/* Desktop Nav */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <button
                                    key={link.href}
                                    onClick={() => handleNavClick(link.href)}
                                    className="px-3 py-2 text-xs font-medium uppercase tracking-wider hover:text-tecsubCyan transition-colors duration-300"
                                    style={{ color: "var(--text-secondary)" }}
                                >
                                    {link.label}
                                </button>
                            ))}
                        </div>

                        {/* Right Controls */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            {/* Language Switcher */}
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

                            {/* Dark Mode Toggle */}
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

                            {/* CTA Button — desktop only */}
                            <a
                                href="#contact"
                                className="hidden md:inline-flex px-4 py-2 text-[10px] sm:text-xs font-semibold tracking-wider uppercase rounded-full bg-gradient-to-r from-tecsubCyan to-tecsubBlue text-tecsubNavy hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all duration-300"
                            >
                                {t(language, "get_solutions")}
                            </a>

                            {/* Hamburger Button — mobile/tablet */}
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

            {/* ═══════════ Mobile Menu Overlay ═══════════ */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Slide-down Menu */}
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
                                {/* Nav Links */}
                                <div className="space-y-1 mb-4">
                                    {navLinks.map((link, i) => (
                                        <motion.button
                                            key={link.href}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05, duration: 0.3 }}
                                            onClick={() => handleNavClick(link.href)}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium uppercase tracking-wider hover:bg-tecsubCyan/10 hover:text-tecsubCyan transition-all duration-300 text-left"
                                            style={{ color: "var(--text-primary)" }}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-tecsubCyan/40 flex-shrink-0" />
                                            {link.label}
                                        </motion.button>
                                    ))}
                                </div>

                                {/* Divider */}
                                <div className="h-px my-3" style={{ background: "linear-gradient(90deg, transparent, rgba(0,229,255,0.2), transparent)" }} />

                                {/* Mobile CTA */}
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