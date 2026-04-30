"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function POSPage() {
    return (
        <div className="min-h-screen" style={{ background: "var(--yt-bg)" }}>
            <Navbar />
            <div className="pt-24 sm:pt-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                    
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-24 h-24 rounded-3xl bg-yt-accent/10 flex items-center justify-center text-5xl mb-8 text-yt-accent shadow-[0_0_50px_rgba(62,166,255,0.1)]"
                        >
                            💳
                        </motion.div>
                        
                        <h1 className="font-bebas text-5xl sm:text-7xl gradient-text mb-4 uppercase tracking-tight">
                            TECSUB POS SYSTEM
                        </h1>
                        
                        <p className="max-w-xl text-yt-text-secondary text-sm sm:text-base mb-10 leading-relaxed">
                            Welcome to the unified Tecsub POS interface. We are currently integrating the standalone system directly into the main platform for a seamless experience.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl mb-12">
                            {[
                                { label: "Security", icon: "🛡️", desc: "End-to-end encrypted transactions" },
                                { label: "Inventory", icon: "📦", desc: "Real-time stock management" },
                                { label: "Analytics", icon: "📊", desc: "Detailed sales and profit reports" }
                            ].map((item, i) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1 + 0.3 }}
                                    className="p-6 rounded-2xl bg-yt-bg-secondary border border-white/5 text-center"
                                >
                                    <div className="text-3xl mb-3">{item.icon}</div>
                                    <h3 className="font-bold mb-1">{item.label}</h3>
                                    <p className="text-[10px] text-yt-text-secondary uppercase tracking-widest">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="px-10 py-4 rounded-xl bg-yt-accent text-white font-bold hover:brightness-110 transition-all shadow-lg shadow-yt-accent/20">
                                Launch POS Terminal
                            </button>
                            <button className="px-10 py-4 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-all">
                                View Documentation
                            </button>
                        </div>
                    </div>

                </div>
                <Footer />
            </div>
        </div>
    );
}
