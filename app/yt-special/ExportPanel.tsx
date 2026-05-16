"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ExportSegment, ExportFormat, ExportQuality } from "@/hooks/useFFmpegSplitter";

interface Props {
    segments: ExportSegment[];
    exportProgress: number;
    isExporting: boolean;
    ffmpegLoaded: boolean;
    ffmpegLoading: boolean;
    onExport: (format: ExportFormat, quality: ExportQuality) => void;
    onDownloadSegment: (segment: ExportSegment, format: ExportFormat) => void;
    onDownloadAll: (format: ExportFormat) => void;
    onInitFFmpeg: () => void;
    processId: string;
}

const FORMATS: { value: ExportFormat; label: string; icon: string }[] = [
    { value: "mp3", label: "MP3", icon: "🎵" },
    { value: "wav", label: "WAV", icon: "🔊" },
    { value: "mp4", label: "MP4", icon: "🎬" },
    { value: "flac", label: "FLAC", icon: "💿" },
];

const QUALITIES: { value: ExportQuality; label: string; bitrate: string }[] = [
    { value: "low", label: "Low", bitrate: "128kbps" },
    { value: "medium", label: "Medium", bitrate: "192kbps" },
    { value: "high", label: "High", bitrate: "320kbps" },
    { value: "lossless", label: "Lossless", bitrate: "Max" },
];

export default function ExportPanel({
    segments, exportProgress, isExporting, ffmpegLoaded, ffmpegLoading,
    onExport, onDownloadSegment, onDownloadAll, onInitFFmpeg, processId,
}: Props) {
    const [format, setFormat] = useState<ExportFormat>("mp3");
    const [quality, setQuality] = useState<ExportQuality>("high");

    const completedSegments = segments.filter(s => s.status === "done");
    const hasResults = completedSegments.length > 0;

    return (
        <div className="space-y-6">
            {/* FFmpeg Status */}
            {!ffmpegLoaded && (
                <div className="bg-[#111] border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-sm font-bold text-white/80">Processing Engine</h4>
                            <p className="text-[10px] text-white/30 mt-0.5">FFmpeg.wasm needs to load once (~25MB)</p>
                        </div>
                        <button
                            onClick={onInitFFmpeg}
                            disabled={ffmpegLoading}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                                ffmpegLoading
                                    ? "bg-white/5 text-white/30 cursor-wait"
                                    : "bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95"
                            }`}
                        >
                            {ffmpegLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-3 h-3 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                                    Loading...
                                </span>
                            ) : "Load Engine"}
                        </button>
                    </div>
                </div>
            )}

            {/* Format & Quality Selectors */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-5 space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-white/40">Export Settings</h4>

                {/* Format */}
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/30 block mb-2">Format</label>
                    <div className="grid grid-cols-4 gap-2">
                        {FORMATS.map(f => (
                            <button
                                key={f.value}
                                onClick={() => setFormat(f.value)}
                                className={`py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex flex-col items-center gap-1 ${
                                    format === f.value
                                        ? "bg-indigo-600/20 border border-indigo-500/40 text-indigo-300"
                                        : "bg-white/5 border border-white/5 text-white/40 hover:text-white/60 hover:bg-white/10"
                                }`}
                            >
                                <span className="text-base">{f.icon}</span>
                                <span>{f.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quality */}
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-white/30 block mb-2">Quality</label>
                    <div className="grid grid-cols-4 gap-2">
                        {QUALITIES.map(q => (
                            <button
                                key={q.value}
                                onClick={() => setQuality(q.value)}
                                className={`py-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-0.5 ${
                                    quality === q.value
                                        ? "bg-indigo-600/20 border border-indigo-500/40 text-indigo-300"
                                        : "bg-white/5 border border-white/5 text-white/40 hover:text-white/60 hover:bg-white/10"
                                }`}
                            >
                                <span className="uppercase tracking-wider">{q.label}</span>
                                <span className="text-[9px] opacity-50">{q.bitrate}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Export Button */}
                <button
                    onClick={() => onExport(format, quality)}
                    disabled={isExporting || !ffmpegLoaded}
                    className={`w-full py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
                        isExporting
                            ? "bg-white/5 text-white/30 cursor-wait"
                            : !ffmpegLoaded
                            ? "bg-white/5 text-white/20 cursor-not-allowed"
                            : "bg-gradient-to-r from-[#ff6b35] to-[#ff4500] hover:from-[#ff7b45] hover:to-[#ff5510] text-white shadow-xl shadow-orange-500/20 active:scale-[0.98]"
                    }`}
                >
                    {isExporting ? (
                        <span className="flex items-center justify-center gap-3">
                            <span className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                            Processing {exportProgress}%...
                        </span>
                    ) : !ffmpegLoaded ? (
                        "Load engine first"
                    ) : (
                        `Split & Export as ${format.toUpperCase()}`
                    )}
                </button>
            </div>

            {/* Export Progress */}
            <AnimatePresence>
                {isExporting && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-[#111] border border-white/5 rounded-2xl p-5"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase tracking-widest text-white/40">Splitting Progress</span>
                            <span className="text-sm font-black text-indigo-400">{exportProgress}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"
                                animate={{ width: `${exportProgress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results */}
            <AnimatePresence>
                {hasResults && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#111] border border-white/5 rounded-2xl p-5 space-y-3"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h4 className="text-sm font-bold text-white/80">Ready to Download</h4>
                                <p className="text-[10px] text-white/30 mt-0.5">{completedSegments.length} segments processed</p>
                            </div>
                            <button
                                onClick={() => onDownloadAll(format)}
                                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
                            >
                                📦 Download All (ZIP)
                            </button>
                        </div>

                        <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
                            {segments.map((seg, idx) => (
                                <motion.div
                                    key={seg.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex items-center gap-3 py-2 px-3 rounded-xl bg-white/[0.02] border border-white/5"
                                >
                                    <span className="text-base">
                                        {seg.status === "done" ? "✅" : seg.status === "processing" ? "⏳" : seg.status === "error" ? "❌" : "⏸"}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-white/70 truncate">{seg.name}</p>
                                        <p className="text-[9px] font-mono text-white/20">
                                            {formatTime(seg.start)} → {formatTime(seg.end)}
                                        </p>
                                    </div>
                                    {seg.status === "done" && seg.blobUrl && (
                                        <button
                                            onClick={() => onDownloadSegment(seg, format)}
                                            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white/40 hover:text-white transition-all"
                                        >
                                            ↓ .{format}
                                        </button>
                                    )}
                                    {seg.status === "processing" && (
                                        <div className="w-4 h-4 border-2 border-indigo-400/20 border-t-indigo-400 rounded-full animate-spin" />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Process ID */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/20 block">Process ID</span>
                    <span className="text-[11px] font-mono text-white/40">{processId}</span>
                </div>
                <button
                    onClick={() => navigator.clipboard.writeText(processId)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold uppercase text-white/30 hover:text-white/50 transition-all"
                >
                    Copy
                </button>
            </div>
        </div>
    );
}

function formatTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
}
