"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { courses, wallets } from "@/data/product";
import { useAppContext } from "@/components/ThemeProvider";
import { t } from "@/data/translations";

export default function CoursePlatform() {
    const { language } = useAppContext();
    const router = useRouter();
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const handleEnroll = (index: number) => {
        router.push(`/course/${index}`);
    };

    return (
        <motion.section
            id="courses"
            ref={ref}
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        >
            <div className="mb-12 sm:mb-16">
                <h2 className="font-bebas text-4xl sm:text-6xl md:text-7xl gradient-text leading-[0.95]">
                    {t(language, "section_courses")}
                </h2>
                <p className="mt-3 text-base sm:text-lg max-w-xl font-light" style={{ color: "var(--text-secondary)" }}>
                    {t(language, "section_courses_sub")}
                </p>
            </div>

            {/* Course Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {courses.map((course, i) => (
                    <motion.div
                        key={course.title}
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: i * 0.15 }}
                        className="glass-panel p-6 sm:p-8 card-hover group flex flex-col"
                    >
                        {/* Icon & Level */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-4xl">{course.image}</span>
                            <span className="text-[10px] uppercase tracking-widest font-semibold px-3 py-1 rounded-full border border-tecsubCyan/20 text-tecsubCyan">
                                {course.level}
                            </span>
                        </div>

                        <h3 className="font-bebas text-xl sm:text-2xl tracking-wide mb-2" style={{ color: "var(--text-primary)" }}>
                            {course.title}
                        </h3>
                        <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: "var(--text-secondary)" }}>
                            {course.description}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-xs mb-5" style={{ color: "var(--text-secondary)" }}>
                            <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {course.duration}
                            </span>
                            <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                {course.lessons} lessons
                            </span>
                        </div>

                        {/* Price & CTA */}
                        <div className="flex items-center justify-between mt-auto">
                            <div className="font-bebas text-2xl tracking-wide" style={{ color: "var(--text-primary)" }}>
                                {course.price === 0 ? (
                                    <span className="text-green-400">{t(language, "free")}</span>
                                ) : (
                                    `$${course.price}`
                                )}
                            </div>
                            <button
                                onClick={() => handleEnroll(i)}
                                className="px-5 py-2.5 rounded-full bg-tecsubCyan text-tecsubNavy font-semibold text-sm hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all duration-300"
                            >
                                {course.price === 0 ? t(language, "access_now") : t(language, "enroll_now")}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Payment Methods inline */}
            <div className="glass-panel p-6 sm:p-8">
                <h3 className="font-bebas text-2xl tracking-wide mb-1" style={{ color: "var(--text-primary)" }}>
                    {t(language, "section_payments")}
                </h3>
                <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                    Visa / MasterCard • Google Pay • USDT TRC20 (Binance & Bybit)
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Card Payment */}
                    <div className="rounded-xl p-5 flex items-center gap-4" style={{ background: "rgba(0,0,0,0.2)" }}>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Visa / MasterCard</p>
                            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Secure card payments</p>
                        </div>
                    </div>

                    {/* Google Pay */}
                    <div className="rounded-xl p-5 flex items-center gap-4" style={{ background: "rgba(0,0,0,0.2)" }}>
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                                <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="#4285F4" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Google Pay</p>
                            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Fast & secure checkout</p>
                        </div>
                    </div>

                    {/* Crypto */}
                    {Object.values(wallets).map((wallet) => (
                        <div key={wallet.label} className="rounded-xl p-5" style={{ background: "rgba(0,0,0,0.2)" }}>
                            <p className="text-xs font-medium text-tecsubCyan mb-1">{wallet.label}</p>
                            <p className="text-[11px] font-mono break-all" style={{ color: "var(--text-secondary)" }}>
                                {wallet.address}
                            </p>
                            <button
                                onClick={() => navigator.clipboard.writeText(wallet.address)}
                                className="mt-2 text-[10px] px-3 py-1 rounded-full border border-tecsubCyan/20 text-tecsubCyan hover:bg-tecsubCyan/10 transition-colors"
                            >
                                Copy Address
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
