"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { courses } from "@/data/product";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentPage({ id }: { id: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isSubscription = searchParams.get("type") === "subscription";
    const planName = searchParams.get("plan");
    const cycle = searchParams.get("cycle");
    const currency = searchParams.get("currency") || "USD";

    const LKR_RATE = 300;

    // Subscription data mapping
    const subscriptionPlans: Record<string, any> = {
        pro: {
            title: "TECSUB Pro Subscription",
            price: cycle === "monthly" ? 29 : 240,
            image: "🚀",
            duration: cycle === "monthly" ? "1 Month" : "1 Year",
            lessons: "Full Access",
            redirect: "/chat"
        },
        ultra: {
            title: "TECSUB Ultra Subscription",
            price: cycle === "monthly" ? 99 : 840,
            image: "💎",
            duration: cycle === "monthly" ? "1 Month" : "1 Year",
            lessons: "Enterprise Access",
            redirect: "/chat"
        }
    };

    const courseIndex = parseInt(id) - 1;
    const item = isSubscription && planName ? subscriptionPlans[planName] : courses[courseIndex];

    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [cardName, setCardName] = useState("");
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const storageKey = isSubscription ? `tecsub_sub_${planName}_paid` : `tecsub_course_${id}_paid`;

    // Already paid — redirect
    useEffect(() => {
        if (localStorage.getItem(storageKey) === "true") {
            router.push(isSubscription ? "/chat" : `/course/${id}`);
        }
    }, [storageKey, id, router, isSubscription]);

    if (!item) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505]">
                <div className="text-center">
                    <h1 className="text-4xl text-red-400 mb-4 font-black">ITEM NOT FOUND</h1>
                    <button
                        onClick={() => router.push("/")}
                        className="px-6 py-3 rounded-full bg-[#d9ff00] text-black font-black uppercase text-xs tracking-widest"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const finalPrice = currency === "USD" ? item.price : item.price * LKR_RATE;
    const priceString = currency === "USD" ? `$${finalPrice}` : `Rs. ${finalPrice.toLocaleString()}`;

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
                router.push(isSubscription ? "/chat" : `/course/${id}`);
            }, 2500);
        }, 3000);
    };

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 flex items-center justify-center bg-[#050505]">
            <div className="w-full max-w-lg">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 mb-6 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                    </svg>
                    Go Back
                </button>

                <AnimatePresence mode="wait">
                    {success ? (
                        /* ═══════════ SUCCESS STATE ═══════════ */
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="bg-white/5 border border-white/10 p-8 sm:p-12 text-center rounded-[2.5rem] backdrop-blur-xl"
                        >
                            <motion.div
                                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-[#d9ff00]/10 border border-[#d9ff00]/30"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            >
                                <motion.span
                                    className="text-3xl text-[#d9ff00]"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    ✓
                                </motion.span>
                            </motion.div>

                            <h2 className="text-3xl font-black italic tracking-tighter mb-3 text-white uppercase">
                                Payment Success!
                            </h2>
                            <p className="text-sm mb-2 text-gray-400 font-medium">
                                Your payment for <strong className="text-white">{item.title}</strong> has been processed.
                            </p>
                            <p className="text-[10px] font-black tracking-widest text-[#d9ff00] mb-6 uppercase">
                                Redirecting to your content...
                            </p>

                            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-[#d9ff00]"
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
                            className="bg-white/5 border border-white/10 p-6 sm:p-10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white">
                                        Secure Payment
                                    </h2>
                                    <p className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Encryption Protected</p>
                                </div>
                            </div>

                            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 mb-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="text-3xl bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center shadow-inner">{item.image}</span>
                                        <div>
                                            <p className="text-[13px] font-black uppercase text-white leading-tight">{item.title}</p>
                                            <p className="text-[9px] font-bold text-gray-500 mt-1 uppercase tracking-widest">{item.duration} • {item.lessons}</p>
                                        </div>
                                    </div>
                                    <p className="text-2xl font-black text-[#d9ff00] italic tracking-tighter">{priceString}</p>
                                </div>
                            </div>

                            <div className="space-y-5 mb-8">
                                <div>
                                    <label className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-500 mb-2 block">Cardholder Name</label>
                                    <input
                                        type="text"
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                                        placeholder="JOHN DOE"
                                        className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-xl text-sm font-bold text-white outline-none focus:border-blue-500 transition-all placeholder:text-gray-800"
                                    />
                                </div>

                                <div>
                                    <label className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-500 mb-2 block">Card Number</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                            placeholder="•••• •••• •••• ••••"
                                            className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-xl text-sm font-mono font-bold text-white outline-none focus:border-blue-500 transition-all placeholder:text-gray-800"
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                                            <div className="w-8 h-5 bg-white/5 rounded-sm border border-white/10" />
                                            <div className="w-8 h-5 bg-white/5 rounded-sm border border-white/10" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-500 mb-2 block">Expiry Date</label>
                                        <input
                                            type="text"
                                            value={expiry}
                                            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                            placeholder="MM / YY"
                                            className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-xl text-sm font-mono font-bold text-white outline-none focus:border-blue-500 transition-all placeholder:text-gray-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-500 mb-2 block">CVV</label>
                                        <input
                                            type="password"
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                            placeholder="•••"
                                            className="w-full px-5 py-3.5 bg-black/40 border border-white/10 rounded-xl text-sm font-mono font-bold text-white outline-none focus:border-blue-500 transition-all placeholder:text-gray-800"
                                        />
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <p className="text-[10px] text-red-500 mb-6 font-black uppercase tracking-widest text-center">⚠️ {error}</p>
                            )}

                            <button
                                onClick={handlePay}
                                disabled={processing || !isFormValid}
                                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${processing ? "bg-white/5 text-gray-600" : isFormValid ? "bg-white text-black hover:bg-[#d9ff00] hover:scale-95 shadow-xl" : "bg-white/5 text-gray-700"}`}
                            >
                                {processing ? "Processing..." : `Pay ${priceString}`}
                            </button>

                            <p className="text-[8px] text-center mt-6 text-gray-600 font-bold uppercase tracking-widest">
                                Secure Transaction Protected by AES-256 Encryption
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
