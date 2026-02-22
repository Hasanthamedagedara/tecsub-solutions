"use client";

import { motion } from "framer-motion";
import { youtubeChannels } from "@/data/product";
import { useAppContext } from "@/components/ThemeProvider";
import { t } from "@/data/translations";

export default function YouTubeBanner() {
    const { language } = useAppContext();

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative z-10 glass-panel mx-4 sm:mx-6 lg:mx-8 mt-20 p-4 sm:p-6"
        >
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    {/* YouTube Icon */}
                    <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-bebas text-xl tracking-wide" style={{ color: "var(--text-primary)" }}>
                            Watch & {t(language, "subscribe")}
                        </p>
                        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                            {youtubeChannels.length} channels • Tech content daily
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {youtubeChannels.map((channel) => (
                        <a
                            key={channel.name}
                            href={channel.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-full transition-all duration-300 hover:shadow-[0_0_25px_rgba(220,38,38,0.5)]"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                            {channel.name}
                        </a>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
