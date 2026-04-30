"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdPlacement from "@/components/AdPlacement";

/* ─── Types ─── */
interface Movie {
    id: string;
    title: string;
    genre: string;
    year: number;
    rating: number;
    duration: string;
    description: string;
    quality: string;
    icon: string;
    color: string;
    badge?: string;
}

/* ─── Demo Movies ─── */
const DEFAULT_MOVIES: Movie[] = [
    {
        id: "m-001", title: "The AI Revolution", genre: "Documentary", year: 2026, rating: 4.9, duration: "1h 45m",
        description: "A deep dive into how artificial intelligence is reshaping the modern world, from automation to creative arts.",
        quality: "4K Ultra HD", icon: "🤖", color: "#3ea6ff", badge: "New Release",
    },
    {
        id: "m-002", title: "Code Runner", genre: "Action / Sci-Fi", year: 2025, rating: 4.7, duration: "2h 15m",
        description: "In a world where code is currency, a rogue developer must hack his way through the digital underworld to save the grid.",
        quality: "1080p Bluray", icon: "🏃", color: "#f1f1f1", badge: "Trending",
    },
    {
        id: "m-003", title: "Digital Frontier", genre: "Adventure", year: 2026, rating: 4.5, duration: "1h 55m",
        description: "Explorers venture into the uncharted territories of the metaverse, discovering civilizations built from pure data.",
        quality: "4K Ultra HD", icon: "🌐", color: "#00E5FF",
    },
    {
        id: "m-004", title: "Cyber Soul", genre: "Drama", year: 2024, rating: 4.8, duration: "2h 05m",
        description: "A poignant story about a humanoid AI searching for its identity in a society that only sees it as a machine.",
        quality: "1080p Bluray", icon: "🧠", color: "#C084FC",
    },
    {
        id: "m-005", title: "The Last Backup", genre: "Thriller", year: 2026, rating: 4.6, duration: "1h 40m",
        description: "When the global cloud fails, a group of scientists must protect the last remaining physical backup of human history.",
        quality: "4K Ultra HD", icon: "💾", color: "#F97316", badge: "Must Watch",
    },
    {
        id: "m-006", title: "Silicon Valley Noir", genre: "Crime", year: 2025, rating: 4.4, duration: "2h 10m",
        description: "A gritty look into the dark side of tech startups, where ambition leads to betrayal and high-stakes espionage.",
        quality: "1080p Bluray", icon: "🕵️", color: "#34D399",
    },
];

const GENRES = ["All", "Documentary", "Action", "Sci-Fi", "Adventure", "Drama", "Thriller", "Crime"];

export default function MoviesPage() {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [selectedGenre, setSelectedGenre] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState<Movie[]>(DEFAULT_MOVIES);

    const filtered = movies.filter((m) => {
        const matchGenre = selectedGenre === "All" || m.genre.includes(selectedGenre);
        const matchSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchGenre && matchSearch;
    });

    return (
        <div className="min-h-screen" style={{ background: "var(--yt-bg)" }}>
            <Navbar />
            <div className="pt-24 sm:pt-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                    {/* Hero */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                        <h1 className="font-bebas text-5xl sm:text-7xl gradient-text leading-[0.95] mb-4">🎬 TECSUB MOVIES</h1>
                        <p className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: "var(--yt-text-secondary)" }}>
                            Exclusive tech-themed documentaries, sci-fi thrillers, and educational films.
                        </p>
                    </motion.div>

                    {/* Search */}
                    <div className="mb-8 max-w-xl mx-auto">
                        <div className="relative">
                            <input
                                type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search movies..."
                                className="w-full px-5 py-3 pl-12 rounded-2xl text-sm outline-none"
                                style={{ background: "rgba(0,0,0,0.4)", border: "1px solid var(--yt-border)", color: "var(--yt-text-primary)" }}
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
                        </div>
                    </div>

                    {/* Genres */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {GENRES.map((genre) => (
                            <button
                                key={genre} onClick={() => setSelectedGenre(genre)}
                                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all ${selectedGenre === genre ? "bg-yt-accent text-white" : "bg-yt-chip-bg text-yt-text-primary hover:bg-yt-bg-hover"}`}
                            >
                                {genre}
                            </button>
                        ))}
                    </div>

                    {/* Movies Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((movie, i) => (
                            <motion.div
                                key={movie.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => setSelectedMovie(movie)}
                                className="group relative rounded-2xl overflow-hidden cursor-pointer"
                                style={{ background: "var(--yt-bg-secondary)", border: "1px solid var(--yt-border)" }}
                            >
                                <div className="aspect-video w-full flex items-center justify-center text-6xl relative overflow-hidden" style={{ background: `${movie.color}10` }}>
                                    {movie.icon}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl">▶️</div>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg leading-tight">{movie.title}</h3>
                                        {movie.badge && <span className="text-[10px] px-2 py-0.5 rounded-full bg-yt-red text-white font-bold">{movie.badge}</span>}
                                    </div>
                                    <p className="text-xs mb-3 line-clamp-2" style={{ color: "var(--yt-text-secondary)" }}>{movie.description}</p>
                                    <div className="flex items-center gap-4 text-[11px]" style={{ color: "var(--yt-text-secondary)" }}>
                                        <span>📅 {movie.year}</span>
                                        <span>⏱️ {movie.duration}</span>
                                        <span style={{ color: "var(--yt-accent)" }}>{movie.quality}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-4xl mb-4">🎬</p>
                            <p style={{ color: "var(--yt-text-secondary)" }}>No movies found in this genre.</p>
                        </div>
                    )}
                </div>

                {/* Modal */}
                <AnimatePresence>
                    {selectedMovie && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                            onClick={() => setSelectedMovie(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                                className="w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
                                style={{ background: "var(--yt-bg-secondary)", border: "1px solid var(--yt-border)" }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="aspect-video w-full flex items-center justify-center text-8xl" style={{ background: `${selectedMovie.color}15` }}>
                                    {selectedMovie.icon}
                                </div>
                                <div className="p-8">
                                    <div className="flex flex-wrap items-center gap-3 mb-4">
                                        <h2 className="text-3xl font-bold">{selectedMovie.title}</h2>
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-yt-accent/20 text-yt-accent border border-yt-accent/30">{selectedMovie.genre}</span>
                                    </div>
                                    <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--yt-text-secondary)" }}>{selectedMovie.description}</p>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 text-center">
                                        <div className="p-3 rounded-2xl bg-black/20 border border-white/5">
                                            <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--yt-text-secondary)" }}>Rating</p>
                                            <p className="font-bold">⭐ {selectedMovie.rating}</p>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-black/20 border border-white/5">
                                            <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--yt-text-secondary)" }}>Year</p>
                                            <p className="font-bold">{selectedMovie.year}</p>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-black/20 border border-white/5">
                                            <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--yt-text-secondary)" }}>Quality</p>
                                            <p className="font-bold text-yt-accent">{selectedMovie.quality}</p>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-black/20 border border-white/5">
                                            <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--yt-text-secondary)" }}>Runtime</p>
                                            <p className="font-bold">{selectedMovie.duration}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button className="flex-1 py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                                            <span>▶️</span> Watch Now
                                        </button>
                                        <button onClick={() => setSelectedMovie(null)} className="px-6 py-4 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-all">
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
                    <AdPlacement format="banner" />
                </div>
                <Footer />
            </div>
        </div>
    );
}
