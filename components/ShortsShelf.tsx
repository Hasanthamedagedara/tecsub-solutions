"use client";

import { useRef } from "react";
import FeedCard, { FeedItem } from "./FeedCard";

export default function ShortsShelf({ shorts }: { shorts: FeedItem[] }) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

    if (!shorts || shorts.length === 0) return null;

    return (
        <div className="w-full my-6 overflow-hidden relative">
            {/* Shelf Header */}
            <div className="flex items-center gap-3 px-4 mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF0000">
                    <path d="M10 9.27l4 2.73-4 2.73V9.27M8 5v14l11-7L8 5z" />
                </svg>
                <h2 className="text-xl font-bold text-white tracking-wide">Shorts</h2>
            </div>

            {/* Scroll Container */}
            <div className="relative group">
                {/* Left Scroll Button */}
                <button
                    onClick={scrollLeft}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
                    </svg>
                </button>

                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-4 px-4 pb-4 snap-x snap-mandatory hide-scrollbar relative"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {shorts.map((short, idx) => (
                        <div key={short.id} className="snap-start shrink-0 w-[220px] sm:w-[260px]">
                            {/* We use the same FeedCard engine, 
                                but the `short-video` contentType string naturally passes the `isShort` prop internally,
                                forcing the 9/16 portrait ratio rendering automatically! */}
                            <FeedCard item={short} index={idx} onItemClick={() => console.log('Playing short:', short.title)} />
                        </div>
                    ))}
                </div>

                {/* Right Scroll Button */}
                <button
                    onClick={scrollRight}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
