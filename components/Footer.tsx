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
                            href="https://www.youtube.com/@tecsub.0"
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

            {/* Contact & Social strip */}
            <div className="border-t border-white/[0.06] py-8 px-4">
                <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
                    {/* Contact Number */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.15)" }}>
                            <svg className="w-4 h-4 text-tecsubCyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <a
                            href="tel:+94726128749"
                            className="text-sm sm:text-base font-semibold hover:text-tecsubCyan transition-colors duration-300 tracking-wide"
                            style={{ color: "var(--text-primary)" }}
                        >
                            +94-726128749
                        </a>
                    </div>

                    {/* Contact Email */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(0,229,255,0.08)", border: "1px solid rgba(0,229,255,0.15)" }}>
                            <svg className="w-4 h-4 text-tecsubCyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <a
                            href="mailto:tecsubsolutions@gmail.com"
                            className="text-sm sm:text-base font-semibold hover:text-tecsubCyan transition-colors duration-300 tracking-wide"
                            style={{ color: "var(--text-primary)" }}
                        >
                            tecsubsolutions@gmail.com
                        </a>
                    </div>

                    {/* Legal Links — Privacy, Refund, Terms */}
                    <div className="flex items-center gap-3 sm:gap-5 flex-wrap justify-center">
                        {[
                            { label: "Privacy Policy", href: "/privacy policy" },
                            { label: "Refund Policy", href: "/Refund" },
                            { label: "Terms of Service", href: "/Terms" },
                        ].map((link, i) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-xs sm:text-sm font-medium hover:text-tecsubCyan transition-colors duration-300"
                                style={{ color: "var(--text-secondary)" }}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Social Icons */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
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
            </div>
        </footer>
    );
}
