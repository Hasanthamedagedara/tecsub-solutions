"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdPlacement from "@/components/AdPlacement";

/* ─── Types ─── */
interface CastMember {
    name: string;
    role: string;
    img: string;
}

interface DownloadLink {
    label: string;
    size: string;
    link: string;
}

interface Movie {
    id: string;
    title: string;
    sinhalaTitle: string;
    year: number;
    rating: number;
    votes: string;
    duration: string;
    views: string;
    quality: string;
    genre: string[];
    director: string;
    country: string;
    poster: string;
    banner: string;
    description: string;
    cast: CastMember[];
    downloads: DownloadLink[];
}

/* ─── Demo Data ─── */
const MOVIES: Movie[] = [
    {
        id: "mr-x-2026",
        title: "Mr. X",
        sinhalaTitle: "මිස්ටර් එක්ස්",
        year: 2026,
        rating: 6.1,
        votes: "1,240",
        duration: "147 min",
        views: "15,226",
        quality: "CAMCopy",
        genre: ["Action", "Sci-Fi", "Thriller"],
        director: "Manu Anand",
        country: "India",
        poster: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=500",
        banner: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200",
        description: "A mysterious operative known only as Mr. X must stop a global conspiracy that threatens to rewrite history using experimental time-dilation technology. As he navigates a web of lies, he discovers that his own past is the key to the future.",
        cast: [
            { name: "Arya", role: "Mr. X", img: "https://i.pravatar.cc/150?u=arya" },
            { name: "Gautham", role: "Agent K", img: "https://i.pravatar.cc/150?u=gautham" },
            { name: "Manju", role: "Elena", img: "https://i.pravatar.cc/150?u=manju" },
            { name: "Saritha", role: "Dr. Rao", img: "https://i.pravatar.cc/150?u=saritha" },
        ],
        downloads: [
            { label: "Direct & Telegram (480p)", size: "800 MB", link: "#" },
            { label: "Direct & Telegram (720p)", size: "1.7 GB", link: "#" },
            { label: "Direct & Telegram (1080p)", size: "3.5 GB", link: "#" },
        ]
    },
    {
        id: "biker-2026",
        title: "Biker",
        sinhalaTitle: "බයිකර්",
        year: 2026,
        rating: 6.9,
        votes: "2,100",
        duration: "135 min",
        views: "10,500",
        quality: "WEB-DL",
        genre: ["Action", "Drama"],
        director: "S. S. Rajamouli",
        country: "India",
        poster: "https://images.unsplash.com/photo-1558981403-c5f91cbba527?q=80&w=500",
        banner: "https://images.unsplash.com/photo-1558981403-c5f91cbba527?q=80&w=1200",
        description: "In the high-stakes world of underground bike racing, a young mechanic rises to the top, but soon finds himself caught between rival gangs and a corrupt police force.",
        cast: [
            { name: "John Doe", role: "Racer", img: "https://i.pravatar.cc/150?u=john" },
            { name: "Jane Smith", role: "Mechanic", img: "https://i.pravatar.cc/150?u=jane" },
        ],
        downloads: [
            { label: "Direct Link (720p)", size: "1.2 GB", link: "#" },
            { label: "Direct Link (1080p)", size: "2.4 GB", link: "#" },
        ]
    },
    // Add more movies from the screenshot...
    {
        id: "kraken-2026",
        title: "Kraken",
        sinhalaTitle: "ක්‍රැකන්",
        year: 2026,
        rating: 5.6,
        votes: "850",
        duration: "110 min",
        views: "4,200",
        quality: "WEB-DL",
        genre: ["Horror", "Mystery"],
        director: "James Wan",
        country: "USA",
        poster: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=500",
        banner: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200",
        description: "Deep-sea researchers awaken a prehistoric terror in the Mariana Trench. Now they must find a way back to the surface before the monster claims them all.",
        cast: [],
        downloads: []
    }
];

const YEARS = ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018"];

export default function MoviesPage() {
    const [view, setView] = useState<"grid" | "detail">("grid");
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [activeYear, setActiveYear] = useState<string | null>(null);

    const handleMovieClick = (movie: Movie) => {
        setSelectedMovie(movie);
        setView("detail");
        window.scrollTo(0, 0);
    };

    const handleBack = () => {
        setView("grid");
        setSelectedMovie(null);
        window.scrollTo(0, 0);
    };

    return (
        <div className="min-h-screen text-[#f1f1f1]" style={{ background: "#0f0f0f" }}>
            <Navbar />
            
            <div className="pt-24 pb-12">
                <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
                    
                    <AnimatePresence mode="wait">
                        {view === "grid" ? (
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {/* Header */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-6">
                                    <div>
                                        <h1 className="text-3xl font-bold mb-2">TECSUB MOVIES</h1>
                                        <p className="text-sm text-[#aaa]">Explore the latest Sinhala Subtitled movies and TV series.</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="relative group">
                                            <input 
                                                type="text" 
                                                placeholder="Search movies..." 
                                                className="bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-yt-red transition-all w-64"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col lg:flex-row gap-8">
                                    {/* Grid */}
                                    <div className="flex-1">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                                            {MOVIES.map((movie) => (
                                                <motion.div
                                                    key={movie.id}
                                                    layoutId={movie.id}
                                                    onClick={() => handleMovieClick(movie)}
                                                    className="group cursor-pointer relative"
                                                >
                                                    {/* Poster Container */}
                                                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-3 border border-white/5 transition-transform group-hover:scale-[1.02]">
                                                        <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                                                        
                                                        {/* Badges */}
                                                        <div className="absolute top-2 left-2 bg-yt-red text-[10px] font-bold px-2 py-0.5 rounded shadow-lg uppercase">
                                                            {movie.quality}
                                                        </div>
                                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-[10px] font-bold px-2 py-0.5 rounded shadow-lg text-yellow-400 flex items-center gap-1">
                                                            ★ {movie.rating}
                                                        </div>

                                                        {/* Hover Overlay */}
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <div className="w-12 h-12 rounded-full bg-yt-red/90 flex items-center justify-center text-white shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform">
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                                    <path d="M8 5.14v14l11-7-11-7z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Title */}
                                                    <h3 className="font-bold text-sm leading-snug group-hover:text-yt-red transition-colors line-clamp-2">
                                                        {movie.title} ({movie.year}) Sinhala Sub...
                                                    </h3>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sidebar */}
                                    <aside className="w-full lg:w-64 space-y-8">
                                        {/* Filters */}
                                        <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5">
                                            <h4 className="font-bold text-sm mb-4 border-b border-white/10 pb-3 uppercase tracking-wider">Release Year</h4>
                                            <div className="grid grid-cols-3 gap-2">
                                                {YEARS.map(y => (
                                                    <button 
                                                        key={y} 
                                                        onClick={() => setActiveYear(y)}
                                                        className={`text-[11px] py-2 rounded font-medium border transition-all ${activeYear === y ? "bg-yt-red border-yt-red text-white" : "border-white/10 hover:border-white/30 text-[#888]"}`}
                                                    >
                                                        {y}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Social Links */}
                                        <div className="space-y-3">
                                            <a href="#" className="flex items-center justify-center gap-2 py-3 bg-[#1877F2] rounded-lg text-sm font-bold hover:brightness-110 transition-all">
                                                Facebook Page
                                            </a>
                                            <a href="#" className="flex items-center justify-center gap-2 py-3 bg-[#0088CC] rounded-lg text-sm font-bold hover:brightness-110 transition-all">
                                                Telegram Channel
                                            </a>
                                            <a href="#" className="flex items-center justify-center gap-2 py-3 bg-[#FF0000] rounded-lg text-sm font-bold hover:brightness-110 transition-all">
                                                Youtube Channel
                                            </a>
                                        </div>
                                    </aside>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="detail"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                {/* Back Button */}
                                <button onClick={handleBack} className="flex items-center gap-2 text-sm font-medium text-[#888] hover:text-white transition-colors">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M19 12H5M12 19l-7-7 7-7" />
                                    </svg>
                                    Back to Movies
                                </button>

                                {/* Movie Header Section */}
                                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                                    {/* Poster */}
                                    <div className="w-full md:w-[300px] lg:w-[350px] flex-shrink-0">
                                        <img src={selectedMovie?.poster} alt={selectedMovie?.title} className="w-full rounded-2xl shadow-2xl border border-white/5" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 space-y-6">
                                        <div>
                                            <h1 className="text-3xl lg:text-4xl font-bold mb-2">{selectedMovie?.title} ({selectedMovie?.year}) Sinhala Subtitles</h1>
                                            <p className="text-xl text-yt-red font-medium">{selectedMovie?.sinhalaTitle}</p>
                                        </div>

                                        <div className="flex flex-wrap gap-4 items-center">
                                            <div className="flex items-center gap-1 text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i}>★</span>
                                                ))}
                                                <span className="ml-2 text-white font-bold">{selectedMovie?.rating}</span>
                                                <span className="text-xs text-[#666] ml-1">({selectedMovie?.votes} votes)</span>
                                            </div>
                                            <div className="h-4 w-px bg-white/10" />
                                            <div className="text-sm font-medium text-[#aaa]">{selectedMovie?.duration}</div>
                                            <div className="h-4 w-px bg-white/10" />
                                            <div className="text-sm font-medium text-[#aaa]">{selectedMovie?.views} views</div>
                                        </div>

                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 py-6 border-y border-white/10">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-[#666] mb-1">Director</p>
                                                <p className="font-medium">{selectedMovie?.director}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-[#666] mb-1">Country</p>
                                                <p className="font-medium">{selectedMovie?.country}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-wider text-[#666] mb-1">Year</p>
                                                <p className="font-medium">{selectedMovie?.year}</p>
                                            </div>
                                            <div className="col-span-full">
                                                <p className="text-[10px] uppercase tracking-wider text-[#666] mb-1">Genres</p>
                                                <div className="flex gap-2">
                                                    {selectedMovie?.genre.map(g => (
                                                        <span key={g} className="px-2 py-0.5 rounded bg-white/5 text-[11px] font-medium border border-white/10">{g}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Cast */}
                                        <div>
                                            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider">Cast</h4>
                                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                                {selectedMovie?.cast.map(c => (
                                                    <div key={c.name} className="flex-shrink-0 w-24 text-center">
                                                        <img src={c.img} alt={c.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-2 border border-white/10" />
                                                        <p className="text-[11px] font-bold truncate">{c.name}</p>
                                                        <p className="text-[10px] text-[#666] truncate">{c.role}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/5">
                                    <h4 className="font-bold text-lg mb-4 border-b border-white/10 pb-4">Synopsis</h4>
                                    <p className="text-[#aaa] leading-relaxed text-sm lg:text-base">
                                        {selectedMovie?.description}
                                    </p>
                                </div>

                                {/* Download Links */}
                                <div className="space-y-4">
                                    <h4 className="font-bold text-lg border-b border-white/10 pb-4">Download Links</h4>
                                    <div className="grid gap-3">
                                        {selectedMovie?.downloads.map(d => (
                                            <a 
                                                key={d.label} 
                                                href={d.link}
                                                className="flex items-center justify-between p-4 bg-yt-red/10 border border-yt-red/20 rounded-xl hover:bg-yt-red/20 transition-all group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-yt-red flex items-center justify-center text-white">
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                                                        </svg>
                                                    </div>
                                                    <span className="font-bold text-sm lg:text-base">{d.label}</span>
                                                </div>
                                                <span className="font-mono text-sm text-yt-red">{d.size}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                                
                                <AdPlacement format="banner" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <Footer />
        </div>
    );
}
