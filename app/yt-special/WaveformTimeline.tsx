"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import type { WaveformData, SilenceRegion, Chapter } from "@/hooks/useAudioProcessor";

interface Props {
    waveformData: WaveformData;
    silenceRegions: SilenceRegion[];
    chapters: Chapter[];
    playbackTime: number;
    isPlaying: boolean;
    onSeek: (time: number) => void;
    onChapterDrag?: (id: string, newStart: number, newEnd: number) => void;
}

export default function WaveformTimeline({
    waveformData, silenceRegions, chapters, playbackTime, isPlaying, onSeek, onChapterDrag,
}: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [zoom, setZoom] = useState(1);
    const [scrollOffset, setScrollOffset] = useState(0);
    const [hoveredTime, setHoveredTime] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [containerWidth, setContainerWidth] = useState(0);
    const rafRef = useRef<number>(0);

    const { peaks, duration } = waveformData;
    const totalWidth = containerWidth * zoom;

    /* ── Resize observer ── */
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const obs = new ResizeObserver((entries) => {
            setContainerWidth(entries[0].contentRect.width);
        });
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    /* ── Draw waveform ── */
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !peaks || containerWidth === 0) return;

        const dpr = window.devicePixelRatio || 1;
        const width = totalWidth;
        const height = 200;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.scale(dpr, dpr);

        /* Background */
        ctx.fillStyle = "#0a0a0a";
        ctx.fillRect(0, 0, width, height);

        /* Grid lines */
        ctx.strokeStyle = "rgba(255,255,255,0.03)";
        ctx.lineWidth = 1;
        const gridInterval = duration > 600 ? 60 : duration > 120 ? 30 : duration > 30 ? 10 : 5;
        for (let t = 0; t < duration; t += gridInterval) {
            const x = (t / duration) * width;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        /* Time labels */
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        for (let t = 0; t < duration; t += gridInterval) {
            const x = (t / duration) * width;
            ctx.fillText(formatTime(t), x, 12);
        }

        /* Silence regions overlay */
        for (const region of silenceRegions) {
            const x1 = (region.start / duration) * width;
            const x2 = (region.end / duration) * width;
            ctx.fillStyle = "rgba(239,68,68,0.12)";
            ctx.fillRect(x1, 0, x2 - x1, height);

            /* Silence label */
            if (x2 - x1 > 30) {
                ctx.fillStyle = "rgba(239,68,68,0.5)";
                ctx.font = "9px monospace";
                ctx.textAlign = "center";
                ctx.fillText("SILENCE", (x1 + x2) / 2, height / 2 + 3);
            }
        }

        /* Chapter backgrounds */
        for (const ch of chapters) {
            const x1 = (ch.start / duration) * width;
            const x2 = (ch.end / duration) * width;
            ctx.fillStyle = ch.color + "08";
            ctx.fillRect(x1, 16, x2 - x1, height - 16);

            /* Chapter label */
            ctx.fillStyle = ch.color + "90";
            ctx.font = "bold 10px sans-serif";
            ctx.textAlign = "left";
            if (x2 - x1 > 50) {
                ctx.fillText(ch.name, x1 + 6, 28);
            }

            /* Chapter boundary line */
            ctx.strokeStyle = ch.color + "60";
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(x1, 16);
            ctx.lineTo(x1, height);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        /* Waveform bars */
        const barWidth = Math.max(1, width / peaks.length - 0.5);
        const centerY = height / 2 + 10;
        const maxAmplitude = height * 0.35;

        /* Normalize peaks */
        let maxPeak = 0;
        for (let i = 0; i < peaks.length; i++) {
            if (peaks[i] > maxPeak) maxPeak = peaks[i];
        }
        const normFactor = maxPeak > 0 ? 1 / maxPeak : 1;

        for (let i = 0; i < peaks.length; i++) {
            const x = (i / peaks.length) * width;
            const h = peaks[i] * normFactor * maxAmplitude;
            const t = i / peaks.length;

            /* Gradient color based on position */
            const r = Math.floor(99 + (168 - 99) * t);
            const g = Math.floor(102 + (85 - 102) * t);
            const b = Math.floor(241 + (247 - 241) * t);
            ctx.fillStyle = `rgba(${r},${g},${b},0.7)`;

            ctx.fillRect(x, centerY - h, barWidth, h * 2);
        }

        /* Hover line */
        if (hoveredTime !== null) {
            const hx = (hoveredTime / duration) * width;
            ctx.strokeStyle = "rgba(255,255,255,0.4)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(hx, 0);
            ctx.lineTo(hx, height);
            ctx.stroke();

            ctx.fillStyle = "rgba(255,255,255,0.8)";
            ctx.font = "11px monospace";
            ctx.textAlign = "center";
            ctx.fillText(formatTime(hoveredTime), hx, height - 6);
        }

        /* Playhead */
        const playX = (playbackTime / duration) * width;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#ffffff";
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(playX, 0);
        ctx.lineTo(playX, height);
        ctx.stroke();
        ctx.shadowBlur = 0;

        /* Playhead triangle */
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(playX - 5, 0);
        ctx.lineTo(playX + 5, 0);
        ctx.lineTo(playX, 8);
        ctx.closePath();
        ctx.fill();
    }, [peaks, duration, silenceRegions, chapters, playbackTime, hoveredTime, totalWidth, containerWidth]);

    /* ── Animation loop ── */
    useEffect(() => {
        const animate = () => {
            draw();
            if (isPlaying) {
                rafRef.current = requestAnimationFrame(animate);
            }
        };
        animate();
        return () => cancelAnimationFrame(rafRef.current);
    }, [draw, isPlaying]);

    /* Redraw when not playing */
    useEffect(() => {
        if (!isPlaying) draw();
    }, [draw, isPlaying, playbackTime, chapters, silenceRegions, zoom]);

    /* ── Mouse handlers ── */
    const getTimeFromEvent = useCallback((e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return 0;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left + scrollOffset;
        return (x / totalWidth) * duration;
    }, [duration, totalWidth, scrollOffset]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const t = getTimeFromEvent(e);
        setHoveredTime(Math.max(0, Math.min(duration, t)));
        if (isDragging) {
            onSeek(Math.max(0, Math.min(duration, t)));
        }
    }, [getTimeFromEvent, duration, isDragging, onSeek]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        setIsDragging(true);
        const t = getTimeFromEvent(e);
        onSeek(Math.max(0, Math.min(duration, t)));
    }, [getTimeFromEvent, duration, onSeek]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHoveredTime(null);
        setIsDragging(false);
    }, []);

    /* ── Zoom controls ── */
    const handleWheel = useCallback((e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setZoom(prev => Math.max(1, Math.min(20, prev + (e.deltaY > 0 ? -0.5 : 0.5))));
        }
    }, []);

    return (
        <div className="w-full space-y-2">
            {/* Controls bar */}
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">WAVEFORM</span>
                    <span className="text-[10px] font-mono text-white/50">{formatTime(playbackTime)} / {formatTime(duration)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setZoom(prev => Math.max(1, prev - 1))}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all text-xs font-bold"
                        title="Zoom out"
                    >−</button>
                    <span className="text-[10px] font-mono text-white/40 w-10 text-center">{zoom.toFixed(0)}x</span>
                    <button
                        onClick={() => setZoom(prev => Math.min(20, prev + 1))}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all text-xs font-bold"
                        title="Zoom in"
                    >+</button>
                    <button
                        onClick={() => { setZoom(1); setScrollOffset(0); }}
                        className="px-3 h-7 flex items-center justify-center rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all text-[10px] font-bold uppercase"
                    >Fit</button>
                </div>
            </div>

            {/* Canvas container */}
            <div
                ref={containerRef}
                className="relative w-full overflow-x-auto rounded-2xl border border-white/5 bg-[#0a0a0a] cursor-crosshair select-none"
                style={{ scrollBehavior: "smooth" }}
                onScroll={(e) => setScrollOffset((e.target as HTMLDivElement).scrollLeft)}
            >
                <canvas
                    ref={canvasRef}
                    onMouseMove={handleMouseMove}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onWheel={handleWheel}
                    className="block"
                />
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 px-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm bg-red-500/30 border border-red-500/50" />
                    <span className="text-[9px] uppercase tracking-wider text-white/30 font-bold">Silence</span>
                </div>
                {chapters.slice(0, 6).map(ch => (
                    <div key={ch.id} className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: ch.color + "40", borderColor: ch.color + "80", borderWidth: 1 }} />
                        <span className="text-[9px] uppercase tracking-wider text-white/30 font-bold">{ch.name}</span>
                    </div>
                ))}
                {chapters.length > 6 && (
                    <span className="text-[9px] text-white/20">+{chapters.length - 6} more</span>
                )}
            </div>
        </div>
    );
}

function formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
}
