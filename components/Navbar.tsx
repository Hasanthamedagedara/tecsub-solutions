"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/components/ThemeProvider";
import { t } from "@/data/translations";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const { theme, toggleTheme, language, setLanguage } = useAppContext();

    const navLinks = [
        { label: t(language, "nav_tools"), href: "#tools" },
        { label: t(language, "nav_software"), href: "#software" },
        { label: t(language, "nav_news"), href: "#news" },
        { label: t(language, "nav_videos"), href: "#videos" },
        { label: t(language, "nav_prompts"), href: "#prompts" },
        { label: t(language, "nav_courses"), href: "#courses" },
    ];

    const langLabels = { en: "EN", si: "සි", ta: "த" };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed top-0 left-0 right-0 z-50 glass-nav"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <a href="#" className="flex items-center gap-2.5 font-bebas text-xl sm:text-2xl tracking-wider gradient-text">
                        <img
                            src="/logo.jpeg"
                            alt="TecSub Solutions Logo"
                            className="w-9 h-9 rounded-xl object-cover border border-white/10"
                        />
                        TECSUB SOLUTIONS
                    </a>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="px-3 py-2 text-xs font-medium uppercase tracking-wider hover:text-tecsubCyan transition-colors duration-300"
                                style={{ color: "var(--text-secondary)" }}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center gap-2">
                        {/* Language Switcher */}
                        <div className="relative">
                            <button
                                onClick={() => setLangOpen(!langOpen)}
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold border border-white/10 hover:border-tecsubCyan/30 transition-colors"
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
                                        className="absolute right-0 top-full mt-2 glass-panel py-1 min-w-[100px] overflow-hidden"
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
                            className="w-9 h-9 rounded-lg flex items-center justify-center border border-white/10 hover:border-tecsubCyan/30 transition-colors"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? (
                                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-tecsubBlue" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                                </svg>
                            )}
                        </button>

                        {/* CTA Button */}
                        <a
                            href="#contact"
                            className="hidden sm:inline-flex px-5 py-2 text-xs font-semibold tracking-wider uppercase rounded-full bg-gradient-to-r from-tecsubCyan to-tecsubBlue text-tecsubNavy hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all duration-300"
                        >
                            {t(language, "get_solutions")}
                        </a>

                        {/* Mobile Hamburger */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden flex flex-col gap-1.5 p-2"
                            aria-label="Toggle menu"
                        >
                            <motion.span
                                animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                                className="w-5 h-0.5 bg-tecsubCyan block"
                            />
                            <motion.span
                                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                                className="w-5 h-0.5 bg-tecsubCyan block"
                            />
                            <motion.span
                                animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                                className="w-5 h-0.5 bg-tecsubCyan block"
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="lg:hidden glass-nav overflow-hidden border-t border-white/[0.06]"
                    >
                        <div className="px-4 py-4 space-y-1">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-3 rounded-xl text-sm font-medium uppercase tracking-wider hover:bg-white/5 hover:text-tecsubCyan transition-all duration-300"
                                    style={{ color: "var(--text-secondary)" }}
                                >
                                    {link.label}
                                </a>
                            ))}
                            <a
                                href="#contact"
                                onClick={() => setIsOpen(false)}
                                className="block px-4 py-3 text-center rounded-full bg-gradient-to-r from-tecsubCyan to-tecsubBlue text-tecsubNavy font-semibold text-sm tracking-wider uppercase mt-4"
                            >
                                {t(language, "get_solutions")}
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
