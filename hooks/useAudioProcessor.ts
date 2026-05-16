"use client";

import { useState, useCallback, useRef } from "react";

/* ─── Types ─── */
export interface SilenceRegion {
    start: number;
    end: number;
    duration: number;
}

export interface Chapter {
    id: string;
    name: string;
    start: number;
    end: number;
    color: string;
}

export interface WaveformData {
    peaks: Float32Array;
    duration: number;
    sampleRate: number;
}

export interface ProcessingStatus {
    stage: "idle" | "loading" | "analyzing" | "silence" | "chapters" | "ready" | "error";
    progress: number;
    message: string;
}

const CHAPTER_COLORS = [
    "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
    "#ec4899", "#f43f5e", "#ef4444", "#f97316",
    "#f59e0b", "#eab308", "#84cc16", "#22c55e",
    "#10b981", "#14b8a6", "#06b6d4", "#3b82f6",
];

/* ─── Hook ─── */
export function useAudioProcessor() {
    const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
    const [waveformData, setWaveformData] = useState<WaveformData | null>(null);
    const [silenceRegions, setSilenceRegions] = useState<SilenceRegion[]>([]);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [status, setStatus] = useState<ProcessingStatus>({
        stage: "idle", progress: 0, message: "",
    });
    const [fileMeta, setFileMeta] = useState<{
        name: string; size: number; duration: number; format: string; channels: number; sampleRate: number;
    } | null>(null);

    const audioCtxRef = useRef<AudioContext | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);
    const startTimeRef = useRef(0);
    const pauseOffsetRef = useRef(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackTime, setPlaybackTime] = useState(0);
    const rafRef = useRef<number>(0);

    /* ── Get or create AudioContext ── */
    const getCtx = useCallback(() => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new AudioContext();
        }
        return audioCtxRef.current;
    }, []);

    /* ── Load & decode file ── */
    const loadFile = useCallback(async (file: File) => {
        try {
            setStatus({ stage: "loading", progress: 10, message: "Loading file into memory..." });

            const arrayBuffer = await file.arrayBuffer();
            setStatus({ stage: "loading", progress: 30, message: "Decoding audio data..." });

            const ctx = getCtx();
            const decoded = await ctx.decodeAudioData(arrayBuffer.slice(0));

            setAudioBuffer(decoded);
            setFileMeta({
                name: file.name,
                size: file.size,
                duration: decoded.duration,
                format: file.name.split(".").pop()?.toUpperCase() || "UNKNOWN",
                channels: decoded.numberOfChannels,
                sampleRate: decoded.sampleRate,
            });

            setStatus({ stage: "analyzing", progress: 50, message: "Extracting waveform..." });

            /* Extract waveform peaks */
            const resolution = 2000;
            const channelData = decoded.getChannelData(0);
            const blockSize = Math.floor(channelData.length / resolution);
            const peaks = new Float32Array(resolution);

            for (let i = 0; i < resolution; i++) {
                let sum = 0;
                const start = i * blockSize;
                for (let j = 0; j < blockSize; j++) {
                    sum += Math.abs(channelData[start + j] || 0);
                }
                peaks[i] = sum / blockSize;
            }

            setWaveformData({ peaks, duration: decoded.duration, sampleRate: decoded.sampleRate });

            setStatus({ stage: "ready", progress: 100, message: "Analysis complete" });

            return decoded;
        } catch (err) {
            setStatus({ stage: "error", progress: 0, message: `Failed to load: ${(err as Error).message}` });
            return null;
        }
    }, [getCtx]);

    /* ── Detect silence regions ── */
    const detectSilence = useCallback((
        buffer: AudioBuffer,
        thresholdDb: number = -40,
        minSilenceLenMs: number = 1000
    ): SilenceRegion[] => {
        setStatus({ stage: "silence", progress: 60, message: "Scanning for silence..." });

        const channelData = buffer.getChannelData(0);
        const sampleRate = buffer.sampleRate;
        const threshold = Math.pow(10, thresholdDb / 20);
        const minSilenceSamples = (minSilenceLenMs / 1000) * sampleRate;

        const regions: SilenceRegion[] = [];
        let silenceStart = -1;
        const blockSize = 1024;

        for (let i = 0; i < channelData.length; i += blockSize) {
            let rms = 0;
            const end = Math.min(i + blockSize, channelData.length);
            for (let j = i; j < end; j++) {
                rms += channelData[j] * channelData[j];
            }
            rms = Math.sqrt(rms / (end - i));

            if (rms < threshold) {
                if (silenceStart === -1) silenceStart = i;
            } else {
                if (silenceStart !== -1) {
                    const silenceLen = i - silenceStart;
                    if (silenceLen >= minSilenceSamples) {
                        const startSec = silenceStart / sampleRate;
                        const endSec = i / sampleRate;
                        regions.push({
                            start: startSec,
                            end: endSec,
                            duration: endSec - startSec,
                        });
                    }
                    silenceStart = -1;
                }
            }
        }

        /* Handle trailing silence */
        if (silenceStart !== -1) {
            const silenceLen = channelData.length - silenceStart;
            if (silenceLen >= minSilenceSamples) {
                const startSec = silenceStart / sampleRate;
                const endSec = channelData.length / sampleRate;
                regions.push({
                    start: startSec,
                    end: endSec,
                    duration: endSec - startSec,
                });
            }
        }

        setSilenceRegions(regions);
        return regions;
    }, []);

    /* ── Detect chapters (energy-based) ── */
    const detectChapters = useCallback((
        buffer: AudioBuffer,
        detectedSilence: SilenceRegion[]
    ): Chapter[] => {
        setStatus({ stage: "chapters", progress: 80, message: "Detecting content boundaries..." });

        const duration = buffer.duration;
        const detected: Chapter[] = [];

        if (detectedSilence.length === 0) {
            /* No silence found — split by energy changes */
            const channelData = buffer.getChannelData(0);
            const sampleRate = buffer.sampleRate;
            const windowSec = 5;
            const windowSamples = windowSec * sampleRate;
            const energyValues: number[] = [];

            for (let i = 0; i < channelData.length; i += windowSamples) {
                let energy = 0;
                const end = Math.min(i + windowSamples, channelData.length);
                for (let j = i; j < end; j++) {
                    energy += channelData[j] * channelData[j];
                }
                energyValues.push(energy / (end - i));
            }

            /* Find significant energy changes */
            const boundaries: number[] = [0];
            for (let i = 1; i < energyValues.length; i++) {
                const prev = energyValues[i - 1] || 0.0001;
                const ratio = energyValues[i] / prev;
                if (ratio > 3 || ratio < 0.33) {
                    boundaries.push(i * windowSec);
                }
            }
            boundaries.push(duration);

            /* Merge boundaries too close together */
            const merged: number[] = [boundaries[0]];
            for (let i = 1; i < boundaries.length; i++) {
                if (boundaries[i] - merged[merged.length - 1] > 15) {
                    merged.push(boundaries[i]);
                }
            }
            if (merged[merged.length - 1] !== duration) merged.push(duration);

            for (let i = 0; i < merged.length - 1; i++) {
                detected.push({
                    id: `ch-${i}`,
                    name: `Chapter ${i + 1}`,
                    start: merged[i],
                    end: merged[i + 1],
                    color: CHAPTER_COLORS[i % CHAPTER_COLORS.length],
                });
            }
        } else {
            /* Use silence gaps as chapter boundaries */
            let currentStart = 0;
            let chapterIdx = 0;

            for (const region of detectedSilence) {
                if (region.start - currentStart > 2) {
                    detected.push({
                        id: `ch-${chapterIdx}`,
                        name: `Chapter ${chapterIdx + 1}`,
                        start: currentStart,
                        end: region.start,
                        color: CHAPTER_COLORS[chapterIdx % CHAPTER_COLORS.length],
                    });
                    chapterIdx++;
                }
                currentStart = region.end;
            }

            /* Final chapter after last silence */
            if (currentStart < duration - 2) {
                detected.push({
                    id: `ch-${chapterIdx}`,
                    name: `Chapter ${chapterIdx + 1}`,
                    start: currentStart,
                    end: duration,
                    color: CHAPTER_COLORS[chapterIdx % CHAPTER_COLORS.length],
                });
            }
        }

        /* If no chapters detected, create one spanning entire file */
        if (detected.length === 0) {
            detected.push({
                id: "ch-0",
                name: "Full Track",
                start: 0,
                end: duration,
                color: CHAPTER_COLORS[0],
            });
        }

        setChapters(detected);
        return detected;
    }, []);

    /* ── Full analysis pipeline ── */
    const analyzeFile = useCallback(async (
        file: File,
        silenceThresholdDb: number = -40,
        minSilenceLenMs: number = 1000
    ) => {
        const buffer = await loadFile(file);
        if (!buffer) return;

        const silence = detectSilence(buffer, silenceThresholdDb, minSilenceLenMs);
        detectChapters(buffer, silence);

        setStatus({ stage: "ready", progress: 100, message: "Analysis complete — ready to edit" });
    }, [loadFile, detectSilence, detectChapters]);

    /* ── Re-analyze with new settings ── */
    const reanalyze = useCallback((thresholdDb: number, minSilenceLenMs: number) => {
        if (!audioBuffer) return;
        const silence = detectSilence(audioBuffer, thresholdDb, minSilenceLenMs);
        detectChapters(audioBuffer, silence);
        setStatus({ stage: "ready", progress: 100, message: "Re-analysis complete" });
    }, [audioBuffer, detectSilence, detectChapters]);

    /* ── Playback controls ── */
    const play = useCallback((fromTime?: number) => {
        if (!audioBuffer) return;
        const ctx = getCtx();

        /* Stop existing */
        if (sourceRef.current) {
            try { sourceRef.current.stop(); } catch { /* ignore */ }
        }

        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);

        const offset = fromTime !== undefined ? fromTime : pauseOffsetRef.current;
        source.start(0, offset);
        startTimeRef.current = ctx.currentTime - offset;
        sourceRef.current = source;
        setIsPlaying(true);

        source.onended = () => {
            setIsPlaying(false);
            pauseOffsetRef.current = 0;
        };

        /* Update playback time */
        const tick = () => {
            if (!sourceRef.current) return;
            const t = ctx.currentTime - startTimeRef.current;
            setPlaybackTime(t);
            if (t < audioBuffer.duration) {
                rafRef.current = requestAnimationFrame(tick);
            }
        };
        rafRef.current = requestAnimationFrame(tick);
    }, [audioBuffer, getCtx]);

    const pause = useCallback(() => {
        if (sourceRef.current) {
            const ctx = getCtx();
            pauseOffsetRef.current = ctx.currentTime - startTimeRef.current;
            try { sourceRef.current.stop(); } catch { /* ignore */ }
            sourceRef.current = null;
        }
        cancelAnimationFrame(rafRef.current);
        setIsPlaying(false);
    }, [getCtx]);

    const seek = useCallback((time: number) => {
        pauseOffsetRef.current = time;
        setPlaybackTime(time);
        if (isPlaying) {
            play(time);
        }
    }, [isPlaying, play]);

    /* ── Update chapters ── */
    const updateChapter = useCallback((id: string, updates: Partial<Chapter>) => {
        setChapters(prev => prev.map(ch => ch.id === id ? { ...ch, ...updates } : ch));
    }, []);

    const deleteChapter = useCallback((id: string) => {
        setChapters(prev => prev.filter(ch => ch.id !== id));
    }, []);

    const addChapter = useCallback((start: number, end: number) => {
        const newId = `ch-${Date.now()}`;
        const idx = chapters.length;
        setChapters(prev => [...prev, {
            id: newId,
            name: `Chapter ${idx + 1}`,
            start,
            end,
            color: CHAPTER_COLORS[idx % CHAPTER_COLORS.length],
        }].sort((a, b) => a.start - b.start));
    }, [chapters.length]);

    const mergeChapters = useCallback((id1: string, id2: string) => {
        setChapters(prev => {
            const ch1 = prev.find(c => c.id === id1);
            const ch2 = prev.find(c => c.id === id2);
            if (!ch1 || !ch2) return prev;
            const merged: Chapter = {
                id: ch1.id,
                name: ch1.name,
                start: Math.min(ch1.start, ch2.start),
                end: Math.max(ch1.end, ch2.end),
                color: ch1.color,
            };
            return prev.filter(c => c.id !== id1 && c.id !== id2).concat(merged).sort((a, b) => a.start - b.start);
        });
    }, []);

    const setManualMode = useCallback((name: string, duration: number = 600) => {
        setFileMeta({
            name: name || "Manual Project",
            size: 0,
            duration: duration,
            format: "MANUAL",
            channels: 2,
            sampleRate: 44100,
        });
        setWaveformData({
            peaks: new Float32Array(2000).fill(0.05),
            duration: duration,
            sampleRate: 44100,
        });
        setChapters([{
            id: "ch-0",
            name: "Chapter 1",
            start: 0,
            end: duration,
            color: CHAPTER_COLORS[0],
        }]);
        setStatus({ stage: "ready", progress: 100, message: "Manual mode enabled" });
    }, []);

    /* ── Reset ── */
    const reset = useCallback(() => {
        if (sourceRef.current) {
            try { sourceRef.current.stop(); } catch { /* ignore */ }
        }
        cancelAnimationFrame(rafRef.current);
        setAudioBuffer(null);
        setWaveformData(null);
        setSilenceRegions([]);
        setChapters([]);
        setStatus({ stage: "idle", progress: 0, message: "" });
        setFileMeta(null);
        setIsPlaying(false);
        setPlaybackTime(0);
        pauseOffsetRef.current = 0;
    }, []);

    return {
        /* State */
        audioBuffer, waveformData, silenceRegions, chapters, status, fileMeta,
        isPlaying, playbackTime,
        /* Actions */
        analyzeFile, reanalyze, loadFile, setManualMode,
        play, pause, seek,
        updateChapter, deleteChapter, addChapter, mergeChapters,
        setChapters, reset,
    };
}
