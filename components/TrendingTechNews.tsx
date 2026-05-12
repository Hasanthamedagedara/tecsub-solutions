"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    description: string;
    thumbnail: string;
}

export default function TrendingTechNews() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<NewsItem | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchNews = async () => {
            const techRss = 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en';
            // Added cache busting timestamp
            const apiEndpoint = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(techRss)}&t=${Date.now()}`;

            try {
                const response = await fetch(apiEndpoint);
                const data = await response.json();
                if (data.status === 'ok') {
                    setNews(data.items);
                }
            } catch (err) {
                console.error("Failed to load tech news", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const handleWheelScroll = (e: React.WheelEvent) => {
        if (scrollRef.current) {
            // Horizontal scroll via mouse wheel
            scrollRef.current.scrollLeft += e.deltaY;
        }
    };

    return (
        <div className="tech-news-wrapper w-full overflow-hidden mb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="font-bebas text-3xl sm:text-5xl gradient-text mb-6">World Tech Trending</h2>
                
                <div 
                    ref={scrollRef}
                    onWheel={handleWheelScroll}
                    className="seen-container flex overflow-x-auto gap-4 pb-6 scrollbar-hide snap-x cursor-grab active:cursor-grabbing"
                >
                    {loading ? (
                        <div className="w-full text-center py-10 text-gray-500 font-medium animate-pulse">
                            Loading Trending Tech...
                        </div>
                    ) : (
                        news.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="tech-card min-w-[160px] sm:min-w-[180px] h-[240px] sm:h-[280px] rounded-2xl relative cursor-pointer overflow-hidden flex-shrink-0 border-2 border-white/5 hover:border-tecsubCyan transition-all duration-300 group snap-start"
                                onClick={() => setSelectedItem(item)}
                            >
                                {/* Background Image with Seed for randomness if no thumbnail */}
                                <div 
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                    style={{ 
                                        backgroundImage: `url('https://picsum.photos/seed/${idx + 50}/400/600')`,
                                    }}
                                />
                                
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                                
                                {/* Text Content */}
                                <div className="absolute bottom-0 p-4 w-full">
                                    <p className="text-white text-[11px] sm:text-xs font-bold leading-tight line-clamp-3 group-hover:text-tecsubCyan transition-colors">
                                        {item.title}
                                    </p>
                                    <div className="mt-2 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-tecsubCyan/40 w-1/3" />
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Modal for Preview */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                        onClick={() => setSelectedItem(null)}
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-[#0a0a0a] rounded-3xl overflow-hidden shadow-2xl border border-white/10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button 
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-4 right-4 z-[210] w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-md"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                            </button>
                            
                            <div className="p-8 sm:p-12 overflow-y-auto max-h-[80vh] scrollbar-hide">
                                <h3 className="font-bebas text-3xl sm:text-4xl leading-tight mb-6 text-tecsubCyan">
                                    {selectedItem.title}
                                </h3>
                                <div 
                                    className="text-gray-400 text-sm sm:text-base leading-relaxed mb-10 prose prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: selectedItem.description }}
                                />
                                <div className="flex justify-center">
                                    <a 
                                        href={selectedItem.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-tecsubCyan text-tecsubNavy font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-tecsubCyan/20"
                                    >
                                        Read Full Article
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
