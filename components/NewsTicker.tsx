"use client";

import { useState, useRef, useEffect } from "react";
import { techNews } from "@/data/product";
import { useAdminContent, adminToNews } from "@/hooks/useAdminContent";

/* ═══════════════════════════════════════════════
   NewsTicker
   – Infinite auto-scrolling marquee (duplicate-set technique)
   – Pauses on hover / touch so users can click
   – Shows a "NEW" badge for the 3 most recent items
   – Supports Sinhala / Tamil / English via Noto Sans
   ═══════════════════════════════════════════════ */
export default function NewsTicker() {
    const [paused, setPaused] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const adminNews = useAdminContent("news");

    /* Merge static + admin news, newest first */
    const allNews = [...adminToNews(adminNews), ...techNews].slice(0, 14);

    /* Sync pause state to animation-play-state */
    useEffect(() => {
        const el = wrapperRef.current;
        if (!el) return;
        el.style.animationPlayState = paused ? "paused" : "running";
    }, [paused]);

    if (allNews.length === 0) return null;

    const renderItems = (prefix: string) =>
        allNews.map((news, i) => (
            <button
                key={`${prefix}-${i}`}
                className="news-ticker-item"
                onClick={() => {
                    /* Scroll to the news section */
                    const el = document.getElementById("news");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                title={news.title}
            >
                {/* NEW badge for first 3 items */}
                {i < 3 && <span className="news-ticker-badge">NEW</span>}

                {/* Category dot */}
                <span
                    className="news-ticker-dot"
                    style={{ background: news.color ?? "#3ea6ff" }}
                />

                {/* Headline */}
                <span className="news-ticker-text">{news.title}</span>

                {/* Divider */}
                <span className="news-ticker-sep">◆</span>
            </button>
        ));

    return (
        <div
            className="news-ticker-container"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setTimeout(() => setPaused(false), 1500)}
            aria-label="Breaking news ticker"
        >
            {/* Label */}
            <div className="news-ticker-label">
                <span>LIVE</span>
            </div>

            {/* Scrolling area */}
            <div className="news-ticker-track">
                <div ref={wrapperRef} className="news-ticker-wrapper">
                    {/* Set A */}
                    <div className="news-ticker-set">{renderItems("a")}</div>
                    {/* Set B — identical duplicate for seamless loop */}
                    <div className="news-ticker-set" aria-hidden="true">{renderItems("b")}</div>
                </div>
            </div>
        </div>
    );
}
