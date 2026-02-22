"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useAppContext } from "@/components/ThemeProvider";
import { t } from "@/data/translations";

export default function BetaCommunity() {
    const { language } = useAppContext();
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [email, setEmail] = useState("");
    const [joined, setJoined] = useState(false);

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setJoined(true);
            setEmail("");
        }
    };

    return (
        <motion.section
            id="beta"
            ref={ref}
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
            <div className="glass-panel p-8 sm:p-12 text-center relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[400px] h-[400px] rounded-full bg-tecsubCyan/5 blur-[100px]" />
                </div>

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-tecsubCyan/20 bg-tecsubCyan/5 text-tecsubCyan text-xs font-semibold uppercase tracking-widest mb-6">
                        <span className="w-2 h-2 rounded-full bg-tecsubCyan animate-pulse" />
                        Beta Program
                    </div>

                    <h2 className="font-bebas text-4xl sm:text-6xl gradient-text leading-[0.95] mb-4">
                        {t(language, "section_beta")}
                    </h2>
                    <p className="text-base sm:text-lg max-w-xl mx-auto font-light mb-8" style={{ color: "var(--text-secondary)" }}>
                        {t(language, "section_beta_sub")}
                    </p>

                    {joined ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center justify-center gap-3 text-green-400 font-medium"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Welcome to the Beta program! We&apos;ll be in touch.
                        </motion.div>
                    ) : (
                        <form onSubmit={handleJoin} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                                className="w-full sm:flex-1 px-5 py-3 rounded-full bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-tecsubCyan transition-colors"
                                style={{ color: "var(--text-primary)" }}
                            />
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-8 py-3 rounded-full bg-tecsubCyan text-tecsubNavy font-semibold text-sm hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all duration-300 tracking-wide uppercase"
                            >
                                {t(language, "join_beta")}
                            </button>
                        </form>
                    )}

                    <div className="mt-6 flex items-center justify-center gap-6 text-xs" style={{ color: "var(--text-secondary)" }}>
                        <a
                            href="https://t.me/tecsub0"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-tecsubCyan transition-colors"
                        >
                            Join Telegram →
                        </a>
                        <span>•</span>
                        <span>Early access • Exclusive features</span>
                    </div>
                </div>
            </div>
        </motion.section>
    );
}
