"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

const GAMES = [
    { id: "snake", title: "Snake Classic", desc: "Nokia 3310 retro snake game", icon: "🐍", color: "#8dad15", route: "/games/snake" },
    { id: "angry-birds", title: "Angry Birds", desc: "Launch birds to destroy structures", icon: "🐦", color: "#ef4444", route: "/games/angry-birds" },
    { id: "car-racing", title: "Mini Car Racing", desc: "Dodge traffic on the highway", icon: "🏎️", color: "#3b82f6", route: "/games/car-racing" },
    { id: "subway-run", title: "Subway Runner", desc: "Run, jump & dodge obstacles", icon: "🏃", color: "#22c55e", route: "/games/subway-run" },
    { id: "bubble-shooter", title: "Bubble Shooter", desc: "Match & pop colorful bubbles", icon: "🫧", color: "#a855f7", route: "/games/bubble-shooter" },
    { id: "media-match", title: "Media Match", desc: "Memory card matching game", icon: "🎴", color: "#f59e0b", route: "/games/media-match" },
];

export default function GamesPage() {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-[#050505] text-white">
            <Navbar />
            <main className="pt-32 pb-20 px-4 max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl sm:text-6xl font-black italic tracking-tighter mb-2 gradient-text uppercase">Tecsub Games</h1>
                    <p className="text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase">Retro & Modern Arcade Hub — {GAMES.length} Games</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {GAMES.map((game, i) => (
                        <motion.button
                            key={game.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            onClick={() => router.push(game.route)}
                            className="group p-6 rounded-[2rem] border text-left transition-all hover:scale-[1.02] relative overflow-hidden"
                            style={{ background: `${game.color}08`, borderColor: `${game.color}20` }}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 -translate-y-1/2 translate-x-1/2" style={{ background: game.color }} />
                            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{game.icon}</div>
                            <h3 className="text-lg font-black uppercase tracking-tight mb-1" style={{ color: game.color }}>{game.title}</h3>
                            <p className="text-xs text-gray-500">{game.desc}</p>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest" style={{ background: `${game.color}15`, color: game.color }}>Play Now →</span>
                            </div>
                        </motion.button>
                    ))}
                </div>
                <div className="mt-16 text-center text-gray-600">
                    <p className="text-[10px] font-black uppercase tracking-widest">All games run 100% in your browser — no downloads needed</p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
