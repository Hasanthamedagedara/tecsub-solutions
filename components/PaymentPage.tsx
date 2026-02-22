"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { courses } from "@/data/product";
import { useRouter } from "next/navigation";

export default function PaymentPage({ id }: { id: string }) {
    const router = useRouter();
    const courseIndex = parseInt(id) - 1;
    const course = courses[courseIndex];

    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [cardName, setCardName] = useState("");
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const storageKey = `tecsub_course_${id}_paid`;

    // Already paid — redirect
    useEffect(() => {
        if (localStorage.getItem(storageKey) === "true") {
            router.push(`/course/${id}`);
        }
    }, [storageKey, id, router]);

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--navy)" }}>
                <div className="text-center">
                    <h1 className="font-bebas text-4xl text-red-400 mb-4">Course Not Found</h1>
                    <button
                        onClick={() => router.push("/")}
                        className="px-6 py-3 rounded-full bg-tecsubCyan text-tecsubNavy font-semibold"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    // Format card number with spaces
    const formatCardNumber = (val: string) => {
        const cleaned = val.replace(/\D/g, "").slice(0, 16);
        return cleaned.replace(/(.{4})/g, "$1 ").trim();
    };

    // Format expiry MM/YY
    const formatExpiry = (val: string) => {
        const cleaned = val.replace(/\D/g, "").slice(0, 4);
        if (cleaned.length >= 3) {
            return cleaned.slice(0, 2) + "/" + cleaned.slice(2);
        }
        return cleaned;
    };

    const isFormValid = cardNumber.replace(/\s/g, "").length === 16 && expiry.length === 5 && cvv.length >= 3 && cardName.length >= 2;

    const handlePay = () => {
        if (!isFormValid) {
            setError("Please fill in all fields correctly.");
            return;
        }
        setError("");
        setProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            setProcessing(false);
            setSuccess(true);
            localStorage.setItem(storageKey, "true");

            // Redirect after showing success
            setTimeout(() => {
                router.push(`/course/${id}`);
            }, 2500);
        }, 3000);
    };

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 flex items-center justify-center" style={{ background: "var(--navy)" }}>
            <div className="w-full max-w-lg">
                {/* Back Button */}
                <button
                    onClick={() => router.push(`/course/${id}`)}
                    className="flex items-center gap-2 mb-6 text-sm font-medium hover:text-tecsubCyan transition-colors"
                    style={{ color: "var(--text-secondary)" }}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Course
                </button>

                <AnimatePresence mode="wait">
                    {success ? (
                        /* ═══════════ SUCCESS STATE ═══════════ */
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="glass-panel p-8 sm:p-12 text-center"
                            style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: "1.25rem" }}
                        >
                            {/* Animated check */}
                            <motion.div
                                className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                                style={{ background: "rgba(34,197,94,0.12)", border: "2px solid rgba(34,197,94,0.3)" }}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            >
                                <motion.span
                                    className="text-5xl"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    ✓
                                </motion.span>
                            </motion.div>

                            <h2 className="font-bebas text-3xl sm:text-4xl tracking-wide mb-3 text-green-400">
                                Payment Successful!
                            </h2>
                            <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>
                                Your payment of <strong className="text-tecsubCyan">${course.price} USD</strong> has been processed.
                            </p>
                            <p className="text-xs mb-6" style={{ color: "var(--text-secondary)" }}>
                                Redirecting to your course content...
                            </p>

                            {/* Loading bar */}
                            <div className="w-48 h-1 mx-auto rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                                <motion.div
                                    className="h-full rounded-full bg-green-400"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 2.5, ease: "linear" }}
                                />
                            </div>
                        </motion.div>
                    ) : (
                        /* ═══════════ PAYMENT FORM ═══════════ */
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="glass-panel p-6 sm:p-10"
                            style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)", borderRadius: "1.25rem" }}
                        >
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="font-bebas text-2xl sm:text-3xl tracking-wide" style={{ color: "var(--text-primary)" }}>
                                        Secure Card Payment
                                    </h2>
                                </div>
                            </div>
                            <p className="text-xs mb-6" style={{ color: "var(--text-secondary)" }}>
                                Complete your purchase for <strong style={{ color: "var(--text-primary)" }}>{course.title}</strong>
                            </p>

                            {/* Order Summary */}
                            <div className="rounded-xl p-4 mb-6" style={{ background: "rgba(0,229,255,0.04)", border: "1px solid rgba(0,229,255,0.1)", borderRadius: "0.75rem" }}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{course.image}</span>
                                        <div>
                                            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{course.title}</p>
                                            <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>{course.duration} • {course.lessons} lessons</p>
                                        </div>
                                    </div>
                                    <p className="font-bebas text-2xl tracking-wide text-tecsubCyan">${course.price}</p>
                                </div>
                            </div>

                            {/* Card Form */}
                            <div className="space-y-4 mb-6">
                                {/* Cardholder Name */}
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>
                                        Cardholder Name
                                    </label>
                                    <input
                                        type="text"
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value)}
                                        placeholder="JOHN DOE"
                                        className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-300 focus:ring-2 focus:ring-tecsubCyan/40"
                                        style={{
                                            background: "rgba(0,0,0,0.4)",
                                            border: "1px solid rgba(255,255,255,0.08)",
                                            color: "var(--text-primary)",
                                            borderRadius: "0.75rem",
                                        }}
                                    />
                                </div>

                                {/* Card Number */}
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>
                                        Card Number
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                            placeholder="1234 5678 9012 3456"
                                            className="w-full px-4 py-3 rounded-xl text-sm font-mono outline-none transition-all duration-300 focus:ring-2 focus:ring-tecsubCyan/40"
                                            style={{
                                                background: "rgba(0,0,0,0.4)",
                                                border: "1px solid rgba(255,255,255,0.08)",
                                                color: "var(--text-primary)",
                                                borderRadius: "0.75rem",
                                            }}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1.5">
                                            {["VISA", "MC"].map((c) => (
                                                <span key={c} className="text-[8px] px-1.5 py-0.5 rounded font-bold" style={{ background: "rgba(255,255,255,0.1)", color: "var(--text-secondary)" }}>
                                                    {c}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Expiry + CVV */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>
                                            Expiry Date
                                        </label>
                                        <input
                                            type="text"
                                            value={expiry}
                                            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                            placeholder="MM/YY"
                                            className="w-full px-4 py-3 rounded-xl text-sm font-mono outline-none transition-all duration-300 focus:ring-2 focus:ring-tecsubCyan/40"
                                            style={{
                                                background: "rgba(0,0,0,0.4)",
                                                border: "1px solid rgba(255,255,255,0.08)",
                                                color: "var(--text-primary)",
                                                borderRadius: "0.75rem",
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest font-semibold mb-1.5 block" style={{ color: "var(--text-secondary)" }}>
                                            CVV
                                        </label>
                                        <input
                                            type="password"
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                            placeholder="•••"
                                            className="w-full px-4 py-3 rounded-xl text-sm font-mono outline-none transition-all duration-300 focus:ring-2 focus:ring-tecsubCyan/40"
                                            style={{
                                                background: "rgba(0,0,0,0.4)",
                                                border: "1px solid rgba(255,255,255,0.08)",
                                                color: "var(--text-primary)",
                                                borderRadius: "0.75rem",
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xs text-red-400 mb-4 flex items-center gap-2"
                                >
                                    <span>⚠️</span> {error}
                                </motion.p>
                            )}

                            {/* Security badges */}
                            <div className="flex items-center justify-center gap-4 mb-5">
                                {[
                                    { icon: "🔒", label: "SSL Encrypted" },
                                    { icon: "🛡️", label: "Secure Payment" },
                                    { icon: "✅", label: "Verified" },
                                ].map((badge) => (
                                    <div key={badge.label} className="flex items-center gap-1">
                                        <span className="text-xs">{badge.icon}</span>
                                        <span className="text-[9px] font-medium" style={{ color: "var(--text-secondary)" }}>{badge.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Pay Button */}
                            <button
                                onClick={handlePay}
                                disabled={processing || !isFormValid}
                                className={`w-full py-4 rounded-full font-bold text-sm uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${processing
                                        ? "bg-tecsubCyan/50 text-tecsubNavy cursor-wait"
                                        : isFormValid
                                            ? "bg-tecsubCyan text-tecsubNavy hover:shadow-[0_0_35px_rgba(0,229,255,0.5)]"
                                            : "bg-white/10 text-white/30 cursor-not-allowed"
                                    }`}
                            >
                                {processing ? (
                                    <>
                                        <motion.div
                                            className="w-4 h-4 border-2 border-tecsubNavy/30 border-t-tecsubNavy rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        />
                                        Processing Payment...
                                    </>
                                ) : (
                                    <>
                                        💳 Pay ${course.price} USD
                                    </>
                                )}
                            </button>

                            {/* Footer note */}
                            <p className="text-[10px] text-center mt-4" style={{ color: "var(--text-secondary)" }}>
                                By proceeding, you agree to our Terms of Service and Refund Policy.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
