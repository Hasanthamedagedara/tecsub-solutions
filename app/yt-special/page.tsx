"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAudioProcessor } from "@/hooks/useAudioProcessor";
import { useFFmpegSplitter } from "@/hooks/useFFmpegSplitter";
import type { ExportFormat, ExportQuality } from "@/hooks/useFFmpegSplitter";
import dynamic from "next/dynamic";

const WaveformTimeline = dynamic(() => import("./WaveformTimeline"), { ssr: false });
const ChapterEditor = dynamic(() => import("./ChapterEditor"), { ssr: false });
const ProcessingOverlay = dynamic(() => import("./ProcessingOverlay"), { ssr: false });
const ExportPanel = dynamic(() => import("./ExportPanel"), { ssr: false });

const FEATURES = [
    { icon: "🤫", title: "Silence Removal", desc: "Auto-detect and strip silent gaps from your audio" },
    { icon: "📝", title: "AI Timestamps", desc: "Smart chapter detection based on audio energy analysis" },
    { icon: "✂️", title: "Smart Splitter", desc: "Surgically split files at chapter boundaries" },
    { icon: "🔄", title: "Format Convert", desc: "Export to MP3, WAV, MP4, or FLAC with quality control" },
];

const ACCEPTED = ".mp3,.wav,.flac,.m4a,.ogg,.mp4,.mkv,.webm,.avi,.mov";

export default function YTSpecialPage() {
    const processor = useAudioProcessor();
    const splitter = useFFmpegSplitter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const [activeTab, setActiveTab] = useState<"timeline" | "export">("timeline");
    const [silenceThreshold, setSilenceThreshold] = useState(-40);
    const [minSilenceLen, setMinSilenceLen] = useState(1000);
    const [autoSilence, setAutoSilence] = useState(true);
    const processId = useMemo(() => crypto.randomUUID().slice(0, 8).toUpperCase(), []);

    /* ── YouTube link state ── */
    const [inputMode, setInputMode] = useState<"file" | "youtube">("file");
    const [ytUrl, setYtUrl] = useState("");
    const [ytFetching, setYtFetching] = useState(false);
    const [ytError, setYtError] = useState("");
    const [useProxy, setUseProxy] = useState(false);

    const PROXIES = [
        "https://api.allorigins.win/raw?url=",
        "https://corsproxy.io/?",
        "https://api.codetabs.com/v1/proxy?quest=",
    ];

    const COBALT_INSTANCES = [
        "https://api.cobalt.tools/api/json",
        "https://cobalt.sh/api/json",
        "https://api.v0.cobalt.tools/api/json",
    ];

    const isProcessing = processor.status.stage !== "idle" && processor.status.stage !== "ready" && processor.status.stage !== "error";
    const isReady = processor.status.stage === "ready";

    const isValidYtUrl = useCallback((url: string) => {
        return /^(https?:\/\/)?(www\.|music\.|m\.)?(youtube\.com\/(watch\?v=|shorts\/|live\/|embed\/|v\/)|youtu\.be\/)/i.test(url.trim());
    }, []);

    const handleFile = useCallback(async (f: File) => {
        if (f.size > 500 * 1024 * 1024) {
            alert("File too large. Maximum 500MB supported in browser.");
            return;
        }
        setFile(f);
        await processor.analyzeFile(f, silenceThreshold, minSilenceLen);
    }, [processor, silenceThreshold, minSilenceLen]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files[0];
        if (f) handleFile(f);
    }, [handleFile]);

    /* ── YouTube link handler ── */
    const handleYtFetch = useCallback(async (retryWithProxy = false) => {
        const url = ytUrl.trim();
        if (!url) return;
        if (!isValidYtUrl(url)) {
            setYtError("Please enter a valid YouTube URL");
            return;
        }
        setYtError("");
        setYtFetching(true);
        if (retryWithProxy) setUseProxy(true);

        const tryFetch = async (instanceUrl: string, body: any) => {
            const fetchUrl = useProxy || retryWithProxy 
                ? `${PROXIES[0]}${encodeURIComponent(instanceUrl)}`
                : instanceUrl;
            
            return await fetch(fetchUrl, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
        };

        try {
            let res;
            let success = false;
            let lastError = "";

            const requestBody = {
                url: url,
                aFormat: "mp3",
                isAudioOnly: true,
                filepathStyle: "classic",
            };

            /* Try multiple instances */
            for (const instance of COBALT_INSTANCES) {
                try {
                    res = await tryFetch(instance, requestBody);
                    if (res.ok) {
                        success = true;
                        break;
                    }
                } catch (e) {
                    lastError = (e as Error).message;
                }
            }

            if (!success) throw new Error(lastError || "Download service unavailable. Try using the proxy option.");
            
            const data = await res!.json();
            if (data.status === "error" || data.status === "rate-limit") {
                throw new Error(data.error?.code || data.text || "Service busy, try again later");
            }

            const downloadUrl = data.url || data.audio || data.stream;
            if (!downloadUrl) throw new Error("No download URL returned");

            /* Fetch the actual audio file with proxy rotation */
            let audioRes;
            let audioBlob;
            
            const fetchMedia = async (pUrl: string) => {
                const r = await fetch(pUrl);
                if (!r.ok) throw new Error("Failed to download");
                return await r.blob();
            };

            try {
                /* Try direct */
                audioRes = await fetch(downloadUrl);
                if (!audioRes.ok) throw new Error();
                audioBlob = await audioRes.blob();
            } catch {
                console.log("Direct media fetch failed, trying proxy rotation...");
                for (const proxy of PROXIES) {
                    try {
                        audioBlob = await fetchMedia(`${proxy}${encodeURIComponent(downloadUrl)}`);
                        if (audioBlob) break;
                    } catch (e) {
                        console.warn(`Proxy ${proxy} failed`);
                    }
                }
            }

            if (!audioBlob || audioBlob.size < 100) throw new Error("Failed to download audio even with proxies.");

            const filename = data.filename || `youtube-${Date.now()}.mp3`;
            const audioFile = new File([audioBlob], filename, { type: audioBlob.type || "audio/mpeg" });

            setYtFetching(false);
            handleFile(audioFile);
        } catch (err) {
            console.error("YT fetch error:", err);
            setYtFetching(false);
            const msg = (err as Error).message;
            if (msg.includes("403") || msg.includes("forbidden")) {
                setYtError("This video is restricted or private. Try the Proxy option or a different video.");
            } else if (msg.includes("429") || msg.includes("rate-limit")) {
                setYtError("Download limit reached. Please wait or use the Proxy option.");
            } else {
                setYtError(msg || "Could not fetch audio. Regional blocks or long videos might be the cause.");
            }
        }
    }, [ytUrl, isValidYtUrl, handleFile, useProxy]);

    const handleExport = useCallback(async (format: ExportFormat, quality: ExportQuality) => {
        if (!file || processor.chapters.length === 0) return;
        await splitter.splitFile(file, processor.chapters, format, quality);
    }, [file, processor.chapters, splitter]);

    const handleReset = useCallback(() => {
        processor.reset();
        splitter.cleanup();
        setFile(null);
        setActiveTab("timeline");
        setYtUrl("");
        setYtError("");
    }, [processor, splitter]);

    /* ─── LANDING STATE ─── */
    if (!file) {
        return (
            <div className="min-h-screen flex flex-col bg-[#050505] text-white font-sans">
                <Navbar />
                <main className="flex-1 flex flex-col items-center justify-center p-6 pt-24 pb-32">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-5xl w-full space-y-10">
                        {/* Badge */}
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#ff6b35]/10 border border-[#ff6b35]/20 rounded-full">
                            <span className="w-2 h-2 bg-[#ff6b35] rounded-full animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff6b35]">TECSUB YT Special</span>
                        </motion.div>

                        {/* Hero */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95]">
                            <span className="bg-gradient-to-r from-white via-white to-white/30 bg-clip-text text-transparent">AI-Powered</span>
                            <br />
                            <span className="bg-gradient-to-r from-[#ff6b35] via-[#ff4500] to-[#ff6b35] bg-clip-text text-transparent">Asset Manager</span>
                        </h1>
                        <p className="text-white/40 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                            Paste a YouTube link or upload a file — auto-detect silence, generate AI timestamps, split into chapters, and export in any format.
                        </p>

                        {/* ── Input Mode Tabs ── */}
                        <div className="flex justify-center">
                            <div className="flex gap-1 bg-[#111] border border-white/5 rounded-xl p-1">
                                <button onClick={() => setInputMode("file")}
                                    className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${inputMode === "file" ? "bg-white/10 text-white" : "text-white/30 hover:text-white/50"}`}>
                                    <span>📁</span> Upload File
                                </button>
                                <button onClick={() => setInputMode("youtube")}
                                    className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${inputMode === "youtube" ? "bg-red-600/20 text-red-400 border border-red-500/20" : "text-white/30 hover:text-white/50"}`}>
                                    <span>▶️</span> YouTube Link
                                </button>
                            </div>
                        </div>

                        <AnimatePresence mode="wait">
                            {inputMode === "file" ? (
                                /* ── File Upload Dropzone ── */
                                <motion.div key="file-drop" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className={`relative group cursor-pointer transition-all duration-300 ${dragOver ? "scale-[1.02]" : ""}`}
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={handleDrop}
                                >
                                    <div className={`absolute inset-0 blur-[100px] rounded-full transition-all duration-700 ${dragOver ? "bg-[#ff6b35]/30" : "bg-[#ff6b35]/10 group-hover:bg-[#ff6b35]/20"}`} />
                                    <div className={`relative bg-[#111] border p-12 md:p-16 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 transition-all ${dragOver ? "border-[#ff6b35]/40" : "border-white/5 group-hover:border-white/10"}`}>
                                        <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">🎬</div>
                                        <div className="space-y-2">
                                            <p className="text-lg font-bold text-white/80">Drop your audio or video file here</p>
                                            <p className="text-sm text-white/30">or click to browse</p>
                                        </div>
                                        <button className="px-10 py-4 bg-gradient-to-br from-[#ff6b35] to-[#ff4500] rounded-full text-sm font-black uppercase tracking-widest shadow-xl shadow-orange-600/20 group-hover:shadow-orange-600/40 transition-all active:scale-95">
                                            Browse Files
                                        </button>
                                        <p className="text-[10px] font-bold opacity-20 uppercase tracking-[0.2em]">MP3 • WAV • FLAC • MP4 • MKV • MOV — Max 500MB</p>
                                    </div>
                                </motion.div>
                            ) : (
                                /* ── YouTube Link Input ── */
                                <motion.div key="yt-link" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                    <div className="relative">
                                        <div className="absolute inset-0 blur-[100px] rounded-full bg-red-600/10" />
                                        <div className="relative bg-[#111] border border-white/5 p-8 md:p-12 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6">
                                            <div className="w-20 h-20 rounded-3xl bg-red-600/10 flex items-center justify-center text-4xl">▶️</div>
                                            <div className="space-y-2">
                                                <p className="text-lg font-bold text-white/80">Paste a YouTube Link</p>
                                                <p className="text-sm text-white/30">We'll extract the audio and process it automatically</p>
                                            </div>

                                            {/* URL Input */}
                                            <div className="w-full max-w-lg space-y-3">
                                                <div className="flex gap-2">
                                                    <div className="flex-1 relative">
                                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                                                        </div>
                                                        <input
                                                            type="url"
                                                            value={ytUrl}
                                                            onChange={e => { setYtUrl(e.target.value); setYtError(""); }}
                                                            onKeyDown={e => { if (e.key === "Enter") handleYtFetch(); }}
                                                            placeholder="https://www.youtube.com/watch?v=..."
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-red-500/40 transition-colors"
                                                            disabled={ytFetching}
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={handleYtFetch}
                                                        disabled={ytFetching || !ytUrl.trim()}
                                                        className={`px-8 rounded-2xl text-sm font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                                                            ytFetching ? "bg-white/5 text-white/30 cursor-wait" :
                                                            !ytUrl.trim() ? "bg-white/5 text-white/15 cursor-not-allowed" :
                                                            "bg-gradient-to-br from-red-600 to-red-700 text-white shadow-xl shadow-red-600/20 hover:shadow-red-600/40 active:scale-95"
                                                        }`}
                                                    >
                                                        {ytFetching ? (
                                                            <><span className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" /> Fetching...</>
                                                        ) : "Process"}
                                                    </button>
                                                </div>

                                                {/* Validation feedback */}
                                                {ytUrl.trim() && !ytFetching && (
                                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold ${
                                                        isValidYtUrl(ytUrl) ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                                                    }`}>
                                                        <span>{isValidYtUrl(ytUrl) ? "✅" : "⚠️"}</span>
                                                        <span>{isValidYtUrl(ytUrl) ? "Valid YouTube URL detected" : "Enter a valid YouTube video URL"}</span>
                                                    </div>
                                                )}

                                                {/* Error message & Actions */}
                                                {ytError && (
                                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                        className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-4 text-xs text-red-300 text-left leading-relaxed space-y-3">
                                                        <div className="flex items-start gap-3">
                                                            <span className="text-lg">⚠️</span>
                                                            <div>
                                                                <p className="font-bold mb-0.5 text-red-400">Unable to fetch audio</p>
                                                                <p className="text-red-300/60">{ytError}</p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex flex-wrap gap-2 pt-2 border-t border-red-500/10">
                                                            {!useProxy && (
                                                                <button onClick={() => handleYtFetch(true)}
                                                                    className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg font-bold transition-all flex items-center gap-2">
                                                                    <span>🌐</span> Retry with Proxy
                                                                </button>
                                                            )}
                                                            <button onClick={() => processor.setManualMode("YouTube Project: " + ytUrl.slice(-8), 1200)}
                                                                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 rounded-lg font-bold transition-all flex items-center gap-2">
                                                                <span>📝</span> Skip to Manual Editor
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>

                                            <p className="text-[10px] font-bold opacity-20 uppercase tracking-[0.2em]">Supports YouTube • YouTube Music • YouTube Shorts</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Features */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12">
                            {FEATURES.map((f, i) => (
                                <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                                    className="bg-[#111] border border-white/5 rounded-2xl p-5 text-left hover:border-white/10 transition-all group">
                                    <span className="text-2xl block mb-3 group-hover:scale-110 transition-transform inline-block">{f.icon}</span>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-white/70 mb-1">{f.title}</h3>
                                    <p className="text-[10px] text-white/30 leading-relaxed">{f.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </main>
                <Footer />
                <input type="file" ref={fileInputRef} className="hidden" accept={ACCEPTED} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>
        );
    }

    /* ─── EDITOR STATE ─── */
    return (
        <div className="min-h-screen flex flex-col bg-[#050505] text-white font-sans">
            <Navbar />
            <AnimatePresence>{isProcessing && <ProcessingOverlay status={processor.status} onCancel={handleReset} />}</AnimatePresence>

            <main className="flex-1 p-4 md:p-6 pt-20 pb-32">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[1400px] mx-auto space-y-4">
                    {/* Top Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 bg-[#111] border border-white/5 rounded-2xl px-5 py-3">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-[#ff6b35]/10 flex items-center justify-center text-lg flex-shrink-0">🎬</div>
                            <div className="min-w-0">
                                <h2 className="text-sm font-bold truncate">{processor.fileMeta?.name}</h2>
                                <div className="flex items-center gap-3 text-[10px] text-white/30 font-mono">
                                    <span>{formatDuration(processor.fileMeta?.duration || 0)}</span>
                                    <span>•</span>
                                    <span>{formatSize(processor.fileMeta?.size || 0)}</span>
                                    <span>•</span>
                                    <span>{processor.fileMeta?.format}</span>
                                    <span>•</span>
                                    <span>{processor.fileMeta?.sampleRate}Hz</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <InfoBadge label="Silence" value={`${processor.silenceRegions.length}`} color="#ef4444" />
                            <InfoBadge label="Chapters" value={`${processor.chapters.length}`} color="#6366f1" />
                            <button onClick={handleReset} className="ml-2 p-2.5 bg-white/5 hover:bg-red-500/10 text-red-500/60 hover:text-red-400 rounded-xl transition-all" title="Start over">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>

                    {/* Settings Row */}
                    <div className="flex flex-wrap gap-3">
                        <SettingToggle label="Auto Silence Detection" enabled={autoSilence} onToggle={() => setAutoSilence(!autoSilence)} />
                        {autoSilence && (
                            <>
                                <div className="flex items-center gap-2 bg-[#111] border border-white/5 rounded-xl px-4 py-2">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-white/30">Threshold</span>
                                    <input type="range" min={-60} max={-20} value={silenceThreshold} onChange={e => setSilenceThreshold(Number(e.target.value))}
                                        className="w-20 h-1 accent-indigo-500" />
                                    <span className="text-[10px] font-mono text-indigo-400 w-10">{silenceThreshold}dB</span>
                                </div>
                                <div className="flex items-center gap-2 bg-[#111] border border-white/5 rounded-xl px-4 py-2">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-white/30">Min Length</span>
                                    <input type="range" min={300} max={5000} step={100} value={minSilenceLen} onChange={e => setMinSilenceLen(Number(e.target.value))}
                                        className="w-20 h-1 accent-indigo-500" />
                                    <span className="text-[10px] font-mono text-indigo-400 w-12">{(minSilenceLen / 1000).toFixed(1)}s</span>
                                </div>
                                <button onClick={() => processor.reanalyze(silenceThreshold, minSilenceLen)}
                                    className="px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-[10px] font-bold uppercase tracking-widest text-indigo-300 hover:bg-indigo-600/30 transition-all">
                                    Re-analyze
                                </button>
                            </>
                        )}
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex gap-1 bg-[#111] border border-white/5 rounded-xl p-1 w-fit">
                        {(["timeline", "export"] as const).map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab ? "bg-white/10 text-white" : "text-white/30 hover:text-white/50"}`}>
                                {tab === "timeline" ? "🎵 Timeline" : "📦 Export"}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    {isReady && activeTab === "timeline" && (
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
                            <div className="space-y-4">
                                {processor.waveformData && (
                                    <WaveformTimeline
                                        waveformData={processor.waveformData}
                                        silenceRegions={processor.silenceRegions}
                                        chapters={processor.chapters}
                                        playbackTime={processor.playbackTime}
                                        isPlaying={processor.isPlaying}
                                        onSeek={processor.seek}
                                    />
                                )}
                                {/* Playback Controls */}
                                <div className="flex items-center gap-4 bg-[#111] border border-white/5 rounded-2xl px-5 py-3">
                                    <button onClick={() => processor.isPlaying ? processor.pause() : processor.play()}
                                        className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center text-xl hover:scale-110 active:scale-95 transition-all shadow-xl">
                                        {processor.isPlaying ? "⏸" : "▶"}
                                    </button>
                                    <div className="flex-1">
                                        <div className="text-xs font-mono text-white/50">
                                            {formatTime(processor.playbackTime)} / {formatTime(processor.fileMeta?.duration || 0)}
                                        </div>
                                        <div className="w-full h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all"
                                                style={{ width: `${((processor.playbackTime / (processor.fileMeta?.duration || 1)) * 100)}%` }} />
                                        </div>
                                    </div>
                                    <button onClick={() => processor.seek(0)} className="p-2 text-white/30 hover:text-white transition-all" title="Restart">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
                                    </button>
                                </div>
                            </div>
                            <ChapterEditor
                                chapters={processor.chapters}
                                onUpdate={processor.updateChapter}
                                onDelete={processor.deleteChapter}
                                onMerge={processor.mergeChapters}
                                onSeek={(t) => { processor.seek(t); processor.play(t); }}
                                onAddChapter={processor.addChapter}
                                onSetChapters={processor.setChapters}
                                duration={processor.fileMeta?.duration || 0}
                                playbackTime={processor.playbackTime}
                                onExport={handleExport}
                                isExporting={splitter.isExporting}
                            />
                        </div>
                    )}

                    {isReady && activeTab === "export" && (
                        <ExportPanel
                            segments={splitter.segments}
                            exportProgress={splitter.exportProgress}
                            isExporting={splitter.isExporting}
                            ffmpegLoaded={splitter.ffmpegLoaded}
                            ffmpegLoading={splitter.ffmpegLoading}
                            onExport={handleExport}
                            onDownloadSegment={splitter.downloadSegment}
                            onDownloadAll={(fmt) => splitter.downloadAllAsZip(splitter.segments.filter(s => s.status === "done"), fmt)}
                            onInitFFmpeg={splitter.initFFmpeg}
                            processId={processId}
                        />
                    )}
                </motion.div>
            </main>
            <Footer />
        </div>
    );
}

/* ─── Small UI Components ─── */
function InfoBadge({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <div className="px-3 py-1.5 bg-white/5 rounded-xl border border-white/5 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[9px] font-bold uppercase tracking-wider text-white/30">{label}</span>
            <span className="text-xs font-black" style={{ color }}>{value}</span>
        </div>
    );
}

function SettingToggle({ label, enabled, onToggle }: { label: string; enabled: boolean; onToggle: () => void }) {
    return (
        <button onClick={onToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-[10px] font-bold uppercase tracking-widest ${enabled ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-300" : "bg-[#111] border-white/5 text-white/30"}`}>
            <div className={`w-7 h-4 rounded-full flex items-center transition-all ${enabled ? "bg-indigo-600 justify-end" : "bg-white/10 justify-start"}`}>
                <div className="w-3 h-3 rounded-full bg-white mx-0.5" />
            </div>
            {label}
        </button>
    );
}

/* ─── Helpers ─── */
function formatTime(s: number): string {
    const m = Math.floor(s / 60); const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
}
function formatDuration(s: number): string {
    if (s < 60) return `${Math.round(s)}s`;
    const m = Math.floor(s / 60); const sec = Math.round(s % 60);
    if (m >= 60) { const h = Math.floor(m / 60); return `${h}h ${m % 60}m`; }
    return `${m}m ${sec}s`;
}
function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}
