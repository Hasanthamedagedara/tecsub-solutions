"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ScrollToTop() {
    const [showUp, setShowUp] = useState(false);
    const [showDown, setShowDown] = useState(false);

    useEffect(() => {
        const toggle = () => {
            const scrollY = window.scrollY;
            const docHeight = document.documentElement.scrollHeight;
            const winHeight = window.innerHeight;

            // Show "up" button after scrolling 300px down
            setShowUp(scrollY > 300);

            // Show "down" button when NOT near the bottom
            setShowDown(scrollY < docHeight - winHeight - 300);
        };

        toggle();
        window.addEventListener("scroll", toggle);
        return () => window.removeEventListener("scroll", toggle);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const scrollToBottom = () => {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-3">
            {/* Scroll to Top */}
            <AnimatePresence>
                {showUp && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        onClick={scrollToTop}
                        className="p-3 rounded-full bg-tecsubCyan text-tecsubNavy shadow-lg hover:shadow-tecsubCyan/50 transition-all active:scale-95"
                        aria-label="Scroll to top"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Scroll to Bottom */}
            <AnimatePresence>
                {showDown && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        onClick={scrollToBottom}
                        className="p-3 rounded-full bg-tecsubCyan text-tecsubNavy shadow-lg hover:shadow-tecsubCyan/50 transition-all active:scale-95"
                        aria-label="Scroll to bottom"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}