"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useState } from "react";

const donateMethods = [
    {
        id: "paypal",
        title: "PayPal",
        desc: "Support us via PayPal",
        icon: "💳",
        color: "#0070ba",
        type: "button",
        url: "https://www.paypal.com/donate?hosted_button_id=YOUR_ID"
    },
    {
        id: "stripe",
        title: "Stripe",
        desc: "Credit / Debit Card",
        icon: "💳",
        color: "#635bff",
        type: "button",
        url: "https://buy.stripe.com/YOUR_STRIPE_LINK"
    },
    {
        id: "wise",
        title: "Wise",
        desc: "Bank Transfer via Wise",
        icon: "🌍",
        color: "#00b9ff",
        type: "copy",
        value: "wise-account@example.com"
    },
    {
        id: "binance",
        title: "Binance UID",
        desc: "Binance Internal Transfer",
        icon: "🟡",
        color: "#F3BA2F",
        type: "copy",
        value: "123456789"
    },
    {
        id: "bybit",
        title: "Bybit UID",
        desc: "Bybit Internal Transfer",
        icon: "⚫",
        color: "#ffffff",
        type: "copy",
        value: "987654321"
    },
    {
        id: "btc",
        title: "Bitcoin (BTC)",
        desc: "BTC (Network: Bitcoin)",
        icon: "₿",
        color: "#F7931A",
        type: "copy",
        value: "bc1q..."
    },
    {
        id: "usdt",
        title: "USDT (TRC20)",
        desc: "USDT (Network: Tron/TRC20)",
        icon: "₮",
        color: "#26A17B",
        type: "copy",
        value: "T..."
    }
];

export default function DonatePage() {
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ background: "var(--yt-bg)" }}>
            <Navbar />
            
            <main className="flex-1 pt-24 sm:pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Hero */}
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-block p-4 rounded-3xl bg-yellow-400/10 mb-6"
                        >
                            <span className="text-4xl">❤️</span>
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-bebas text-5xl sm:text-7xl gradient-text mb-4 uppercase tracking-tight"
                        >
                            Support TECSUB
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed"
                        >
                            Your support helps us keep our tools free and maintain high-quality servers. 
                            Every contribution makes a huge difference.
                        </motion.p>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {donateMethods.map((method, idx) => (
                            <motion.div
                                key={method.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="glass-panel p-6 card-hover flex flex-col group relative"
                                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div 
                                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                                        style={{ background: `${method.color}20`, color: method.color }}
                                    >
                                        {method.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white">{method.title}</h3>
                                        <p className="text-sm text-gray-500">{method.desc}</p>
                                    </div>
                                </div>

                                {method.type === "button" ? (
                                    <a
                                        href={method.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-auto w-full py-4 rounded-xl font-bold text-center transition-all duration-300 hover:brightness-110 active:scale-[0.98] shadow-lg"
                                        style={{ background: method.color, color: "white" }}
                                    >
                                        Donate via {method.title}
                                    </a>
                                ) : (
                                    <div className="mt-auto space-y-3">
                                        <div className="relative group/input">
                                            <div className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-gray-300 truncate pr-12">
                                                {method.value}
                                            </div>
                                            <button
                                                onClick={() => handleCopy(method.value as string, method.id)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
                                                title="Copy to clipboard"
                                            >
                                                {copied === method.id ? (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                ) : (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Thank You Note */}
                    <div className="mt-16 text-center">
                        <p className="text-sm text-gray-500 italic font-light">
                            * All donations are secure and greatly appreciated. Thank you for supporting TECSUB Solutions!
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
