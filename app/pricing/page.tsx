"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/components/ThemeProvider";
import { useRouter } from "next/navigation";

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
    const [currency, setCurrency] = useState<"USD" | "LKR">("USD");
    const [currencyOpen, setCurrencyOpen] = useState(false);
    const [coupon, setCoupon] = useState("");
    const [isApplied, setIsApplied] = useState(false);
    const [couponError, setCouponError] = useState(false);
    const { language } = useAppContext();
    const router = useRouter();

    // Exchange Rate: 1 USD = 300 LKR (approx)
    const LKR_RATE = 300;

    const currencies = [
        { code: "USD", symbol: "$", label: "US Dollar" },
        { code: "LKR", symbol: "Rs.", label: "SL Rupee" }
    ];

    const plans = [
        {
            id: "free",
            name: "Free",
            icon: "🌱",
            price: { monthly: 0, yearly: 0 },
            desc: language === "si" ? "නොමිලේ ආරම්භ කරන්න" : "Basic access to TECSUB ecosystem.",
            features: [
                "💬 Community Support",
                "⚠️ Ad-supported Experience",
                "🎓 Basic Academy Content",
                "✅ Tecsub Sinhala Typing",
                "✅ Free PDF Rotator & Crop Pages",
                "✅ Basic Technology Articles Hub",
                "✅ Standard AI Tools (Limited)",
                "✅ 720p Video Exports",
                "❌ No Bilingual Side-by-Side PDF Merger",
                "❌ No Advanced Batch PDF Converter",
                "❌ No YT Special Dashboard Access",
                "❌ No AI Background Remover",
                "❌ No High-res Image Enhancer"
            ],
            color: "#94a3b8",
            buttonText: "Current Plan",
            highlight: false
        },
        {
            id: "pro",
            name: "Pro",
            icon: "🚀",
            price: { monthly: 29, yearly: 240 },
            desc: language === "si" ? "වෘත්තීය නිර්මාණකරුවන් සඳහා" : "The complete creative toolkit.",
            features: [
                "🎓 Full Courses & Academy Access",
                "🚫 No Ads Experience",
                "✉️ Priority Email Support",
                "🔄 Early Access to New Features",
                "🔒 Private Creation Mode",
                "🌐 Unlimited Translator Usage",
                "✏️ Pro File Editor & Batch Tools",
                "🏢 Enterprise App Access",
                "🎨 Tecsub Designer (All Features)",
                "🎬 Tecsub Edito Pro License",
                "🎫 AI Captions & Subtitles",
                "🌍 Full Sinhala Typing suite",
                "📸 Premium OCR Scanner",
                "🪄 AI Image Enhancer (8K)",
                "✂️ Precision BG Remover",
                "📏 Pro Image Resizer",
                "🔄 Multi-format Converter",
                "🎬 YT Tag Extractor Pro",
                "🔍 AI Keyword Generator",
                "✨ AI Clipping (TikTok/Shorts)",
                "📥 All Video Downloader (4K)",
                "🎥 Cinema Studio 3.5 Access",
                "🤖 Advanced AI Models (Claude/GPT)",
                "🚀 Priority Global Infrastructure",
                "✅ Bilingual Side-by-Side PDF Merger",
                "✅ 30+ Dedicated Standalone PDF Tools",
                "✅ Advanced YT Special Asset Manager",
                "✅ YT Dashboard Mark Current Timestamp & Split",
                "✅ Premium Tech Articles Hub with Search & Filters",
                "✅ PDF OCR Text Extractor Pro"
            ],
            color: "#3ea6ff",
            buttonText: "Upgrade to Pro",
            highlight: true,
            badge: "POPULAR"
        },
        {
            id: "ultra",
            name: "Ultra",
            icon: "💎",
            price: { monthly: 99, yearly: 840 },
            desc: language === "si" ? "උපරිම බලය සහ ව්‍යවසාය විසඳුම්" : "Maximum scale for professionals.",
            features: [
                "🖥️ TECSUB POS Full License",
                "🌟 24/7 VIP Concierge Support",
                "👥 Team Collaboration (5 Seats)",
                "☁️ Infinite Asset Cloud Storage",
                "⚡ API Access for Developers",
                "🌍 Global CDN for Hosted Assets",
                "🛡️ Enterprise-Grade Security",
                "📈 Advanced Business Analytics",
                "🛠️ Custom Tools Integration",
                "📜 Commercial Usage Rights",
                "🚀 Priority Feature Requests",
                "✨ Unlimited AI Credits",
                "🎬 4K Cinematic Video Export",
                "🏗️ Dedicated GPU Instance",
                "🏷️ White-label Export Options",
                "📦 Bulk Media & Asset Downloads",
                "🎯 Custom Style Training (LoRA)",
                "✅ Unlimited Bilingual PDF Merges & Slicing",
                "✅ Custom PDF Workflows Automation & Bates Numbering",
                "✅ Dedicated GPU Instance for AI Video Splitting"
            ],
            color: "#d9ff00",
            buttonText: "Go Ultra",
            highlight: false
        }
    ];

    const formatPrice = (usd: number) => {
        let finalUsd = usd;
        if (isApplied) finalUsd = usd * 0.8; // 20% Discount
        if (currency === "USD") return `$${finalUsd.toFixed(2)}`;
        return `Rs. ${(finalUsd * LKR_RATE).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    };

    const handleApplyCoupon = () => {
        if (coupon.toLowerCase() === "tecsub.dev.me") {
            setIsApplied(true);
            setCouponError(false);
        } else {
            setCouponError(true);
            setIsApplied(false);
        }
    };

    const handlePlanSelect = (planId: string) => {
        if (planId === "free") return;
        const id = planId === "pro" ? "2" : "3";
        router.push(`/payment/${id}?type=subscription&plan=${planId}&cycle=${billingCycle}&currency=${currency}`);
    };

    const t = {
        title: { en: "PRICING", si: "මිල ගණන්" },
        subtitle: { en: "Connect with the full TECSUB ecosystem.", si: "සම්පූර්ණ TECSUB පද්ධතිය සමඟ සම්බන්ධ වන්න." },
        monthly: { en: "Monthly", si: "මාසික" },
        yearly: { en: "Yearly", si: "වාර්ික" },
        save: { en: "-30%", si: "-30%" }
    };

    const currentLang = (language === "si" || language === "ta") ? "si" : "en";

    return (
        <div className="min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-300 overflow-x-hidden">
            <Navbar />

            <main className="pt-24 pb-16 px-4">
                <div className="max-w-7xl mx-auto text-center mb-8 relative">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter mb-2 gradient-text italic">
                            {t.title[currentLang]}
                        </h1>
                        <p className="text-gray-400 text-sm font-medium">
                            {t.subtitle[currentLang]}
                        </p>
                    </motion.div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
                        {/* Monthly/Yearly Toggle */}
                        <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-black tracking-widest ${billingCycle === "monthly" ? "text-blue-500" : "text-gray-500"}`}>{t.monthly[currentLang].toUpperCase()}</span>
                            <button 
                                onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                                className="w-10 h-5 bg-gray-100 dark:bg-white/5 rounded-full p-0.5 relative transition-all shadow-inner"
                            >
                                <motion.div 
                                    animate={{ x: billingCycle === "monthly" ? 0 : 20 }}
                                    className="w-4 h-4 bg-gray-900 dark:bg-white rounded-full shadow-md"
                                />
                            </button>
                            <span className={`text-[10px] font-black tracking-widest ${billingCycle === "yearly" ? "text-blue-500" : "text-gray-500"}`}>{t.yearly[currentLang].toUpperCase()}</span>
                        </div>

                        {/* Currency Selector Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => setCurrencyOpen(!currencyOpen)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-blue-500/50 transition-all shadow-sm"
                            >
                                <span className="text-[10px] font-black text-blue-500">{currency}</span>
                                <svg className={`w-3 h-3 transition-transform ${currencyOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg>
                            </button>

                            <AnimatePresence>
                                {currencyOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full mt-2 left-0 w-32 bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                                    >
                                        {currencies.map((curr) => (
                                            <button
                                                key={curr.code}
                                                onClick={() => { setCurrency(curr.code as any); setCurrencyOpen(false); }}
                                                className={`w-full px-4 py-2 text-left text-[11px] font-bold hover:bg-gray-100 dark:hover:bg-white/5 transition-colors flex justify-between items-center ${currency === curr.code ? 'text-blue-500 bg-blue-500/5' : 'text-gray-500'}`}
                                            >
                                                <span>{curr.code}</span>
                                                <span className="opacity-40">{curr.symbol}</span>
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        {/* Coupon Code Input */}
                        <div className="flex items-center gap-2">
                            <input 
                                type="text"
                                value={coupon}
                                onChange={(e) => setCoupon(e.target.value)}
                                placeholder="PROMO CODE"
                                className={`px-4 py-1.5 rounded-lg bg-gray-100 dark:bg-white/5 border text-[10px] font-black outline-none transition-all w-32 ${couponError ? "border-red-500/50" : isApplied ? "border-green-500/50 text-green-500" : "border-gray-200 dark:border-white/10"}`}
                            />
                            <button 
                                onClick={handleApplyCoupon}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${isApplied ? "bg-green-500 text-white" : "bg-gray-900 dark:bg-white text-white dark:text-black hover:scale-105"}`}
                            >
                                {isApplied ? "APPLIED" : "APPLY"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
                    {plans.map((plan, idx) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`relative rounded-[1.5rem] p-5 flex flex-col border transition-all duration-300 ${plan.highlight ? 'bg-gray-50 dark:bg-white/[0.04] border-blue-500/40 shadow-2xl z-10 scale-105' : 'bg-white dark:bg-[#0d0d0d] border-gray-100 dark:border-white/5'}`}
                        >
                            {plan.badge && (
                                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[8px] font-black px-2.5 py-1 rounded-full tracking-tighter shadow-lg">
                                    {plan.badge}
                                </div>
                            )}

                            <div className="flex items-center gap-2.5 mb-3">
                                <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-lg shadow-inner">
                                    {plan.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-base font-black leading-none">{plan.name}</h3>
                                    <p className="text-[9px] text-gray-500 font-bold mt-1">{plan.desc}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-end gap-1">
                                    <span className="text-2xl font-black" style={{ color: plan.color }}>
                                        {formatPrice(billingCycle === "monthly" ? plan.price.monthly : Math.floor(plan.price.yearly / 12))}
                                    </span>
                                    <span className="text-[9px] text-gray-500 font-bold mb-1">/mo</span>
                                </div>
                                {billingCycle === "yearly" && plan.price.yearly > 0 && (
                                    <div className="text-[8px] font-black text-[#d9ff00] mt-0.5 uppercase">
                                        BILLED YEARLY ({formatPrice(plan.price.yearly)})
                                    </div>
                                )}
                            </div>

                            {/* SCROLLABLE FEATURES LIST - Hyper-Detailed */}
                            <div className="flex-1 bg-gray-100/50 dark:bg-black/20 rounded-xl p-3 mb-4 max-h-[160px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10">
                                <div className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-1">Full Ecosystem Features</div>
                                <div className="space-y-2.5">
                                    {plan.features.map((feature) => (
                                        <div key={feature} className="flex items-start gap-2">
                                            <div className="w-3 h-3 rounded-full flex items-center justify-center bg-gray-200 dark:bg-white/10 mt-0.5">
                                                {feature.startsWith("❌") ? (
                                                    <span className="text-[8px]">❌</span>
                                                ) : (
                                                    <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="6"><path d="M20 6L9 17l-5-5"/></svg>
                                                )}
                                            </div>
                                            <span className={`text-[10px] font-bold leading-tight ${feature.startsWith("❌") ? "text-gray-400 opacity-50" : "text-gray-700 dark:text-gray-300"}`}>{feature.replace("❌ ", "")}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button 
                                onClick={() => handlePlanSelect(plan.id)}
                                className={`w-full py-2.5 rounded-xl font-black text-[10px] transition-all ${plan.id === 'free' ? 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600 cursor-default shadow-inner' : plan.highlight ? 'bg-blue-500 text-white shadow-lg hover:scale-95 active:scale-90' : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:scale-95 shadow-md'}`}
                            >
                                {plan.buttonText.toUpperCase()}
                            </button>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Enterprise? <a href="/about" className="text-blue-500 hover:underline">Talk to us</a></p>
                </div>
            </main>

            <Footer />
            
            <style jsx global>{`
                .scrollbar-thin::-webkit-scrollbar { width: 3px; }
                .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
                .scrollbar-thin::-webkit-scrollbar-thumb { border-radius: 10px; background: rgba(255,255,255,0.05); }
            `}</style>
        </div>
    );
}
