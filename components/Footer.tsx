"use client";

import { motion } from "framer-motion";
import { socialLinks } from "@/data/product";
import SocialIcon from "@/components/SocialIcon";
import { useAppContext } from "@/components/ThemeProvider";
import { t } from "@/data/translations";

export default function Footer() {
    const { language } = useAppContext();

    return (
        <footer className="relative z-10 overflow-hidden">
            {/* Final CTA Section */}
            <div className="relative py-20 sm:py-32 px-4 sm:px-6 text-center">
                {/* Background glow */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[600px] h-[600px] rounded-full bg-tecsubCyan/5 blur-[120px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10"
                >
                    <h2 className="font-bebas text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] glow-text whitespace-pre-line">
                        {t(language, "cta_title")}
                    </h2>
                    <p className="mt-6 text-base sm:text-lg max-w-xl mx-auto font-light" style={{ color: "var(--text-secondary)" }}>
                        {t(language, "cta_sub")}
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="https://t.me/Hasanthamedagedra"
                            target="_blank"
                            rel="noopener noreferrer"
                            id="contact"
                            className="px-10 py-4 bg-tecsubCyan text-tecsubNavy font-semibold rounded-full hover:shadow-[0_0_40px_rgba(0,229,255,0.5)] transition-all duration-300 tracking-wide uppercase text-sm sm:text-base"
                        >
                            {t(language, "contact_us")}
                        </a>
                        <a
                            href="https://youtube.com/@hasanthamedagedara"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-10 py-4 border-2 border-white/20 font-semibold rounded-full hover:border-tecsubCyan hover:text-tecsubCyan transition-all duration-300 tracking-wide uppercase text-sm sm:text-base"
                            style={{ color: "var(--text-primary)" }}
                        >
                            {t(language, "watch_youtube")}
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* Social strip */}
            <div className="border-t border-white/[0.06] py-8 px-4">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 flex-wrap justify-center">
                        {socialLinks.slice(0, 8).map((link) => (
                            <a
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-icon-glow hover:text-tecsubCyan transition-colors duration-300"
                                title={link.name}
                                style={{ color: "var(--text-secondary)" }}
                            >
                                <SocialIcon name={link.name} className="w-5 h-5" />
                            </a>
                        ))}
                    </div>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                        © {new Date().getFullYear()} {t(language, "footer_copy")}
                    </p>
                </div>
            </div>
        </footer>
    );
}
