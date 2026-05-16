"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Chapter } from "@/hooks/useAudioProcessor";
import type { ExportFormat, ExportQuality } from "@/hooks/useFFmpegSplitter";

const CHAPTER_COLORS = [
    "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
    "#ec4899", "#f43f5e", "#ef4444", "#f97316",
    "#f59e0b", "#eab308", "#84cc16", "#22c55e",
    "#10b981", "#14b8a6", "#06b6d4", "#3b82f6",
];

interface Props {
    chapters: Chapter[];
    onUpdate: (id: string, updates: Partial<Chapter>) => void;
    onDelete: (id: string) => void;
    onMerge: (id1: string, id2: string) => void;
    onSeek: (time: number) => void;
    onAddChapter: (start: number, end: number) => void;
    onSetChapters: (chapters: Chapter[]) => void;
    duration: number;
    playbackTime: number;
    onExport: (format: ExportFormat, quality: ExportQuality) => void;
    isExporting: boolean;
}

export default function ChapterEditor({ 
    chapters, onUpdate, onDelete, onMerge, onSeek, onAddChapter, onSetChapters, 
    duration, playbackTime, onExport, isExporting 
}: Props) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editStart, setEditStart] = useState("");
    const [editEnd, setEditEnd] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [newName, setNewName] = useState("");
    const [newStart, setNewStart] = useState("");
    const [newEnd, setNewEnd] = useState("");
    const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("mp3");
    const [pastedText, setPastedText] = useState("");
    const [isPasting, setIsPasting] = useState(false);
    const csvInputRef = useRef<HTMLInputElement>(null);
    const [csvError, setCsvError] = useState("");

    /* ── Timestamp Parsing Engine ── */
    const parseTimestamps = (text: string) => {
        const lines = text.split(/\r?\n/).filter(l => l.trim());
        const parsed: { start: number; name: string }[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line || line.startsWith('#')) continue;

            /* Extract time (HH:MM:SS or MM:SS) */
            const timeMatch = line.match(/(\d{1,2}:)?\d{1,2}:\d{2}/);
            if (!timeMatch) continue;

            const start = parseTimeInput(timeMatch[0]);
            const name = line.replace(timeMatch[0], '').replace(/^[-,.\s]+/, '').trim() || `Chapter ${i + 1}`;
            
            parsed.push({ start, name });
        }

        if (parsed.length === 0) return [];

        /* Sort by start time */
        parsed.sort((a, b) => a.start - b.start);

        /* Convert to segments with end times */
        const segments: Chapter[] = [];
        for (let i = 0; i < parsed.length; i++) {
            const current = parsed[i];
            const next = parsed[i + 1];
            const end = next ? next.start : duration;

            if (end > current.start) {
                segments.push({
                    id: `pasted-${Date.now()}-${i}`,
                    name: current.name,
                    start: current.start,
                    end: Math.min(end, duration),
                    color: CHAPTER_COLORS[i % CHAPTER_COLORS.length],
                });
            }
        }
        return segments;
    };

    const handlePasteSubmit = () => {
        const segments = parseTimestamps(pastedText);
        if (segments.length === 0) {
            setCsvError("No valid timestamps found. Example: 0:00 Intro");
            return;
        }
        onSetChapters(segments);
        setIsPasting(false);
        setPastedText("");
    };

    const markCurrentTime = () => {
        if (chapters.length === 0) {
            onAddChapter(0, playbackTime);
        } else {
            const last = chapters[chapters.length - 1];
            if (playbackTime > last.end) {
                onAddChapter(last.end, playbackTime);
            }
        }
    };

    /* ── Hotkeys ── */
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            if (e.key.toLowerCase() === 'm') {
                e.preventDefault();
                markCurrentTime();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [playbackTime, chapters]);

    const startEdit = (ch: Chapter) => {
        setEditingId(ch.id);
        setEditName(ch.name);
        setEditStart(formatTimeInput(ch.start));
        setEditEnd(formatTimeInput(ch.end));
    };

    const saveEdit = (id: string) => {
        onUpdate(id, {
            name: editName,
            start: parseTimeInput(editStart),
            end: parseTimeInput(editEnd),
        });
        setEditingId(null);
    };

    const cancelEdit = () => setEditingId(null);

    const handleAddChapter = () => {
        const start = parseTimeInput(newStart);
        const end = parseTimeInput(newEnd);
        if (end <= start) return;
        onAddChapter(start, end);
        setNewName("");
        setNewStart("");
        setNewEnd("");
        setShowAddForm(false);
    };

    const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setCsvError("");
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const text = ev.target?.result as string;
                const lines = text.split(/\r?\n/).filter(l => l.trim());
                const parsed: Chapter[] = [];
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line || line.startsWith('#') || line.toLowerCase().startsWith('name')) continue;
                    const parts = line.split(/[,;\t]/).map(p => p.trim());
                    let name: string, startStr: string, endStr: string;
                    if (parts.length >= 3) {
                        if (/^\d/.test(parts[0]) && parts[0].includes(':')) {
                            startStr = parts[0]; endStr = parts[1]; name = parts[2];
                        } else {
                            name = parts[0]; startStr = parts[1]; endStr = parts[2];
                        }
                    } else if (parts.length === 2) {
                        startStr = parts[0]; endStr = parts[1]; name = `Chapter ${i + 1}`;
                    } else continue;
                    const start = parseTimeInput(startStr!);
                    const end = parseTimeInput(endStr!);
                    if (isNaN(start) || isNaN(end) || end <= start) continue;
                    parsed.push({
                        id: `csv-${Date.now()}-${i}`,
                        name: name!,
                        start,
                        end: Math.min(end, duration),
                        color: CHAPTER_COLORS[i % CHAPTER_COLORS.length],
                    });
                }
                if (parsed.length === 0) {
                    setCsvError("No valid timestamps found. Use format: name,start,end");
                    return;
                }
                onSetChapters(parsed.sort((a, b) => a.start - b.start));
            } catch {
                setCsvError("Failed to parse CSV file");
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    return (
        <div className="space-y-4">
            {/* ── Dashboard: Manual Marking & Export ── */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-4 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Quick Dashboard</span>
                    <div className="flex bg-black/40 rounded-lg p-0.5 border border-white/5">
                        <button 
                            onClick={() => setSelectedFormat("mp3")}
                            className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all ${selectedFormat === "mp3" ? "bg-white/10 text-white" : "text-white/20 hover:text-white/40"}`}
                        >MP3</button>
                        <button 
                            onClick={() => setSelectedFormat("mp4")}
                            className={`px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all ${selectedFormat === "mp4" ? "bg-white/10 text-white" : "text-white/20 hover:text-white/40"}`}
                        >MP4</button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <button 
                        onClick={markCurrentTime}
                        className="flex flex-col items-center justify-center gap-2 py-4 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 rounded-2xl transition-all group"
                    >
                        <span className="text-xl group-hover:scale-110 transition-transform">📍</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Mark Current</span>
                    </button>
                    <button 
                        onClick={() => onExport(selectedFormat, "high")}
                        disabled={isExporting || chapters.length === 0}
                        className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl transition-all group ${
                            isExporting || chapters.length === 0 
                            ? "bg-white/5 opacity-50 cursor-not-allowed" 
                            : "bg-[#ff6b35]/10 hover:bg-[#ff6b35]/20 border border-[#ff6b35]/20"
                        }`}
                    >
                        <span className="text-xl group-hover:scale-110 transition-transform">✂️</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#ff6b35]">Split & Save</span>
                    </button>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Paste Chapters</span>
                        <button 
                            onClick={() => setIsPasting(!isPasting)}
                            className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            {isPasting ? "Close" : "Open Text Area"}
                        </button>
                    </div>
                    
                    <AnimatePresence>
                        {isPasting && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2 overflow-hidden">
                                <textarea 
                                    value={pastedText}
                                    onChange={(e) => setPastedText(e.target.value)}
                                    placeholder="0:00 Intro&#10;3:45 Cool Beat&#10;10:12 Outro"
                                    className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-3 text-xs font-mono text-white/80 placeholder:text-white/10 outline-none focus:border-indigo-500/30 transition-colors"
                                />
                                <button 
                                    onClick={handlePasteSubmit}
                                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all"
                                >
                                    Import Pasted Text
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <p className="text-[9px] text-white/20 text-center uppercase tracking-[0.15em]">
                    Press 'M' to mark instantly or paste YouTube chapters above
                </p>
            </div>

            <div className="h-px bg-white/5 mx-2" />

            {/* Header */}
            <div className="flex items-center justify-between px-1 mb-3">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-white/80">Chapters</h3>
                    <p className="text-[10px] text-white/30 mt-0.5">{chapters.length} segments</p>
                </div>
                <div className="flex items-center gap-1.5">
                    <button onClick={() => setShowAddForm(!showAddForm)}
                        className={`px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${showAddForm ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'bg-white/5 text-white/40 hover:text-white/60 hover:bg-white/10'}`}
                        title="Add custom timestamp">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        Add
                    </button>
                    <button onClick={() => csvInputRef.current?.click()}
                        className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-bold uppercase tracking-wider text-white/40 hover:text-white/60 transition-all flex items-center gap-1"
                        title="Import timestamps from CSV">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                        CSV
                    </button>
                    {chapters.length > 0 && (
                        <button onClick={() => onSetChapters([])}
                            className="px-2.5 py-1.5 bg-white/5 hover:bg-red-500/10 rounded-lg text-[9px] font-bold uppercase tracking-wider text-white/30 hover:text-red-400 transition-all"
                            title="Clear all chapters">
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* CSV hidden input */}
            <input type="file" ref={csvInputRef} className="hidden" accept=".csv,.txt,.tsv" onChange={handleCsvImport} />

            {/* CSV error */}
            {csvError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 text-[10px] text-red-300">
                    {csvError}
                </div>
            )}

            {/* Add Chapter Form */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="bg-[#111] border border-indigo-500/20 rounded-xl overflow-hidden">
                        <div className="p-3 space-y-2">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-400">+ New Chapter</span>
                            </div>
                            <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Chapter name"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-indigo-500/50 transition-colors" />
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="text-[9px] uppercase tracking-wider text-white/30 font-bold block mb-1">Start</label>
                                    <input type="text" value={newStart} onChange={e => setNewStart(e.target.value)} placeholder="0:00"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono text-white placeholder:text-white/20 outline-none focus:border-indigo-500/50" />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[9px] uppercase tracking-wider text-white/30 font-bold block mb-1">End</label>
                                    <input type="text" value={newEnd} onChange={e => setNewEnd(e.target.value)} placeholder="0:00"
                                        onKeyDown={e => { if (e.key === 'Enter') handleAddChapter(); }}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono text-white placeholder:text-white/20 outline-none focus:border-indigo-500/50" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleAddChapter}
                                    disabled={!newStart.trim() || !newEnd.trim()}
                                    className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/5 disabled:text-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors">
                                    Add Chapter
                                </button>
                                <button onClick={() => setShowAddForm(false)}
                                    className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chapter List */}
            <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                <AnimatePresence>
                    {chapters.map((ch, idx) => (
                        <motion.div
                            key={ch.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: idx * 0.03 }}
                            className="group relative bg-[#111] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all"
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ backgroundColor: ch.color }} />

                            {editingId === ch.id ? (
                                <div className="pl-4 pr-3 py-3 space-y-2">
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={e => setEditName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors"
                                        autoFocus
                                        onKeyDown={e => { if (e.key === "Enter") saveEdit(ch.id); if (e.key === "Escape") cancelEdit(); }}
                                    />
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <label className="text-[9px] uppercase tracking-wider text-white/30 font-bold block mb-1">Start</label>
                                            <input
                                                type="text"
                                                value={editStart}
                                                onChange={e => setEditStart(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono text-white outline-none focus:border-indigo-500/50 transition-colors"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-[9px] uppercase tracking-wider text-white/30 font-bold block mb-1">End</label>
                                            <input
                                                type="text"
                                                value={editEnd}
                                                onChange={e => setEditEnd(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono text-white outline-none focus:border-indigo-500/50 transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-1">
                                        <button onClick={() => saveEdit(ch.id)} className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors">Save</button>
                                        <button onClick={cancelEdit} className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-white/60 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="pl-4 pr-3 py-2.5 flex items-center gap-3">
                                    <button onClick={() => onSeek(ch.start)} className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                    </button>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-white/90 truncate">{ch.name}</p>
                                        <p className="text-[10px] font-mono text-white/30">
                                            {formatTimeDisplay(ch.start)} → {formatTimeDisplay(ch.end)}
                                            <span className="ml-2 text-white/20">({formatDuration(ch.end - ch.start)})</span>
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => startEdit(ch)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/30 hover:text-white transition-all"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg></button>
                                        <button onClick={() => onDelete(ch.id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-all"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg></button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
            `}</style>
        </div>
    );
}

function formatTimeDisplay(s: number): string {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    return `${m}:${sec.toString().padStart(2, "0")}`;
}

function formatDuration(s: number): string {
    if (s < 60) return `${Math.round(s)}s`;
    const m = Math.floor(s / 60);
    const sec = Math.round(s % 60);
    return `${m}m ${sec}s`;
}

function formatTimeInput(s: number): string {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
}

function parseTimeInput(str: string): number {
    const parts = str.split(":").map(Number);
    if (parts.length === 3) return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
    if (parts.length === 2) return (parts[0] || 0) * 60 + (parts[1] || 0);
    return parts[0] || 0;
}
