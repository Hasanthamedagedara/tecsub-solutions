"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { onlineTools } from "@/data/product";
import { useAppContext } from "@/components/ThemeProvider";
import { t } from "@/data/translations";

export default function OnlineTools() {
    const { language } = useAppContext();
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const categoryColors: Record<string, string> = {
        Text: "#FF6B6B",
        Developer: "#00E5FF",
        Image: "#FFD93D",
        Design: "#C084FC",
        Calculator: "#4ADE80",
        Document: "#F97316",
        Security: "#EF4444",
        Utility: "#38BDF8",
    };

    return (
        <motion.section
            id="tools"
            ref={ref}
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
            <div className="mb-12 sm:mb-16">
                <h2 className="font-bebas text-4xl sm:text-6xl md:text-7xl gradient-text leading-[0.95]">
                    {t(language, "section_tools")}
                </h2>
                <p className="mt-3 text-base sm:text-lg max-w-xl font-light" style={{ color: "var(--text-secondary)" }}>
                    {t(language, "section_tools_sub")}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {onlineTools.map((tool, i) => (
                    <motion.div
                        key={tool.title}
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: i * 0.06 }}
                        className="glass-panel p-5 card-hover cursor-pointer group relative"
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold flex-shrink-0"
                                style={{ background: `${categoryColors[tool.category] || "#888"}20`, color: categoryColors[tool.category] || "#888" }}
                            >
                                {tool.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <span
                                    className="text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full"
                                    style={{ background: `${categoryColors[tool.category] || "#888"}15`, color: categoryColors[tool.category] || "#888" }}
                                >
                                    {tool.category}
                                </span>
                                <h3
                                    className="font-bebas text-lg tracking-wide mt-1.5 mb-1"
                                    style={{ color: "var(--text-primary)" }}
                                >
                                    {tool.title}
                                </h3>
                                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                                    {tool.description}
                                </p>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-px rounded-b-xl bg-gradient-to-r from-transparent via-tecsubCyan/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
