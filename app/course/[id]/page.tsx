"use client";

import { useEffect, useState } from "react";
import { courses, wallets } from "@/data/product";
import { motion } from "framer-motion";

export default function PaymentPage({ params }: { params: { id: string } }) {
    const [course, setCourse] = useState<(typeof courses)[number] | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto" | null>(null);
    const [copied, setCopied] = useState("");
    const [processing, setProcessing] = useState(false);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const idx = parseInt(params.id);
        if (!isNaN(idx) && idx >= 0 && idx < courses.length) {
            setCourse(courses[idx]);
        }
    }, [params.id]);

    const handleCopy = (address: string, label: string) => {
        navigator.clipboard.writeText(address);
        setCopied(label);
        setTimeout(() => setCopied(""), 2000);
    };

    const handleCardPayment = () => {
        setProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            setProcessing(false);
            setCompleted(true);
        }, 2500);
    };

    const handleCryptoConfirm = () => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setCompleted(true);
        }, 2000);
    };

    if (!course) {
        return (
            <div className="min-h-screen bg-tecsubNavy flex items-center justify-center">
                <div className="glass-panel p-8 text-center">
                    <p className="text-xl mb-4" style={{ color: "var(--text-primary)" }}>Course not found</p>
                    <a href="/#courses" className="text-tecsubCyan hover:underline text-sm">← Back to Courses</a>
                </div>
            </div>
        );
    }

    // Free course — direct access
    if (course.price === 0 && !completed) {
        return (
            <div className="min-h-screen bg-tecsubNavy flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-8 sm:p-12 max-w-lg w-full text-center"
                >
                    <span className="text-5xl mb-4 block">{course.image}</span>
                    <h1 className="font-bebas text-3xl gradient-text mb-2">{course.title}</h1>
                    <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>{course.description}</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-400 text-sm font-semibold mb-6">
                        <span>✓</span> FREE Access
                    </div>
                    <br />
                    <button
                        onClick={() => setCompleted(true)}
                        className="px-8 py-3 rounded-full bg-tecsubCyan text-tecsubNavy font-semibold hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all duration-300 uppercase tracking-wide text-sm"
                    >
                        Access Course Now
                    </button>
                </motion.div>
            </div>
        );
    }

    // Payment completed
    if (completed) {
        return (
            <div className="min-h-screen bg-tecsubNavy flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel p-8 sm:p-12 max-w-lg w-full text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6"
                    >
                        <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </motion.div>
                    <h1 className="font-bebas text-3xl gradient-text mb-2">Access Granted!</h1>
                    <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                        You now have full access to <strong>{course.title}</strong>
                    </p>

                    <div className="space-y-3">
                        <button className="w-full py-3 rounded-xl bg-tecsubCyan text-tecsubNavy font-semibold hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Watch Course
                        </button>
                        <button className="w-full py-3 rounded-xl border border-white/10 hover:border-tecsubCyan/30 transition-all flex items-center justify-center gap-2" style={{ color: "var(--text-primary)" }}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Files
                        </button>
                    </div>

                    <a href="/#courses" className="inline-block mt-8 text-xs text-tecsubCyan hover:underline">
                        ← Back to All Courses
                    </a>
                </motion.div>
            </div>
        );
    }

    // Payment Gateway
    return (
        <div className="min-h-screen bg-tecsubNavy p-4 sm:p-8">
            <div className="max-w-4xl mx-auto pt-8">
                {/* Back Link */}
                <a href="/#courses" className="text-xs text-tecsubCyan hover:underline mb-6 inline-block">
                    ← Back to Courses
                </a>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Course Summary — Left */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-panel p-6 sticky top-8"
                        >
                            <span className="text-4xl block mb-4">{course.image}</span>
                            <h1 className="font-bebas text-2xl tracking-wide mb-2" style={{ color: "var(--text-primary)" }}>
                                {course.title}
                            </h1>
                            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
                                {course.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
                                <span>⏱ {course.duration}</span>
                                <span>📋 {course.lessons} lessons</span>
                                <span>📊 {course.level}</span>
                            </div>
                            <div className="border-t border-white/[0.06] pt-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Total</span>
                                    <span className="font-bebas text-3xl text-tecsubCyan">${course.price}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Payment Methods — Right */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-3"
                    >
                        <h2 className="font-bebas text-xl tracking-wide mb-4" style={{ color: "var(--text-primary)" }}>
                            Choose Payment Method
                        </h2>

                        {/* Card Payment */}
                        <div
                            onClick={() => setPaymentMethod("card")}
                            className={`glass-panel p-5 mb-3 cursor-pointer transition-all ${paymentMethod === "card" ? "border-tecsubCyan/40 shadow-[0_0_20px_rgba(0,229,255,0.1)]" : ""
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                                        Visa / MasterCard
                                    </p>
                                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Secure card payment</p>
                                </div>
                                <div className="ml-auto">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "card" ? "border-tecsubCyan" : "border-white/20"
                                        }`}>
                                        {paymentMethod === "card" && <div className="w-2.5 h-2.5 rounded-full bg-tecsubCyan" />}
                                    </div>
                                </div>
                            </div>

                            {paymentMethod === "card" && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    className="mt-5 space-y-3"
                                >
                                    <input
                                        type="text"
                                        placeholder="Card Number"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-tecsubCyan"
                                        style={{ color: "var(--text-primary)" }}
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input type="text" placeholder="MM/YY" className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-tecsubCyan" style={{ color: "var(--text-primary)" }} />
                                        <input type="text" placeholder="CVC" className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-tecsubCyan" style={{ color: "var(--text-primary)" }} />
                                    </div>
                                    <input type="text" placeholder="Name on card" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-tecsubCyan" style={{ color: "var(--text-primary)" }} />
                                    <button
                                        onClick={handleCardPayment}
                                        disabled={processing}
                                        className="w-full py-3 rounded-xl bg-tecsubCyan text-tecsubNavy font-semibold text-sm hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all disabled:opacity-50"
                                    >
                                        {processing ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Processing...
                                            </span>
                                        ) : (
                                            `Pay $${course.price}`
                                        )}
                                    </button>
                                </motion.div>
                            )}
                        </div>

                        {/* Crypto Payment */}
                        <div
                            onClick={() => setPaymentMethod("crypto")}
                            className={`glass-panel p-5 cursor-pointer transition-all ${paymentMethod === "crypto" ? "border-tecsubCyan/40 shadow-[0_0_20px_rgba(0,229,255,0.1)]" : ""
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xl">₮</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                                        USDT TRC20
                                    </p>
                                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Binance / Bybit</p>
                                </div>
                                <div className="ml-auto">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "crypto" ? "border-tecsubCyan" : "border-white/20"
                                        }`}>
                                        {paymentMethod === "crypto" && <div className="w-2.5 h-2.5 rounded-full bg-tecsubCyan" />}
                                    </div>
                                </div>
                            </div>

                            {paymentMethod === "crypto" && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    className="mt-5 space-y-4"
                                >
                                    <div className="rounded-xl p-4" style={{ background: "rgba(0,0,0,0.3)" }}>
                                        <p className="text-xs font-medium text-tecsubCyan mb-2">
                                            Send exactly <span className="font-bold">{course.price} USDT</span> to one of these addresses:
                                        </p>
                                        {Object.values(wallets).map((w) => (
                                            <div key={w.label} className="mt-3 p-3 rounded-lg" style={{ background: "rgba(0,0,0,0.2)" }}>
                                                <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--text-secondary)" }}>{w.label}</p>
                                                <p className="text-xs font-mono break-all mb-2" style={{ color: "var(--text-primary)" }}>{w.address}</p>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleCopy(w.address, w.label); }}
                                                    className="text-[10px] px-3 py-1 rounded-full border border-tecsubCyan/20 text-tecsubCyan hover:bg-tecsubCyan/10 transition-colors"
                                                >
                                                    {copied === w.label ? "✓ Copied!" : "Copy Address"}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={handleCryptoConfirm}
                                        disabled={processing}
                                        className="w-full py-3 rounded-xl bg-tecsubCyan text-tecsubNavy font-semibold text-sm hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all disabled:opacity-50"
                                    >
                                        {processing ? "Confirming..." : "I've Sent the Payment"}
                                    </button>
                                    <p className="text-[10px] text-center" style={{ color: "var(--text-secondary)" }}>
                                        After confirming, your access will be activated within 5-30 minutes.
                                    </p>
                                </motion.div>
                            )}
                        </div>

                        {/* Security Badges */}
                        <div className="mt-6 flex items-center justify-center gap-6 text-[10px] uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>
                            <span className="flex items-center gap-1">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                SSL Encrypted
                            </span>
                            <span>•</span>
                            <span>Secure Payment</span>
                            <span>•</span>
                            <span>Instant Access</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
export async function generateStaticParams() {
  return [{ id: '1' }];
}