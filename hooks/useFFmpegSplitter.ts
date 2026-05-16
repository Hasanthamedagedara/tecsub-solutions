"use client";

import { useState, useCallback, useRef } from "react";
import type { Chapter } from "./useAudioProcessor";

/* ─── Types ─── */
export interface ExportSegment {
    id: string;
    name: string;
    start: number;
    end: number;
    blobUrl: string | null;
    status: "pending" | "processing" | "done" | "error";
    progress: number;
}

export type ExportFormat = "mp3" | "wav" | "mp4" | "flac";
export type ExportQuality = "low" | "medium" | "high" | "lossless";

const QUALITY_MAP: Record<ExportFormat, Record<ExportQuality, string[]>> = {
    mp3: {
        low: ["-b:a", "128k"],
        medium: ["-b:a", "192k"],
        high: ["-b:a", "320k"],
        lossless: ["-b:a", "320k"],
    },
    wav: {
        low: ["-acodec", "pcm_s16le"],
        medium: ["-acodec", "pcm_s16le"],
        high: ["-acodec", "pcm_s24le"],
        lossless: ["-acodec", "pcm_s32le"],
    },
    mp4: {
        low: ["-b:a", "128k", "-c:v", "copy"],
        medium: ["-b:a", "192k", "-c:v", "copy"],
        high: ["-b:a", "320k", "-c:v", "copy"],
        lossless: ["-b:a", "320k", "-c:v", "copy"],
    },
    flac: {
        low: ["-compression_level", "5"],
        medium: ["-compression_level", "5"],
        high: ["-compression_level", "8"],
        lossless: ["-compression_level", "12"],
    },
};

/* ─── Hook ─── */
export function useFFmpegSplitter() {
    const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
    const [ffmpegLoading, setFfmpegLoading] = useState(false);
    const [segments, setSegments] = useState<ExportSegment[]>([]);
    const [exportProgress, setExportProgress] = useState(0);
    const [isExporting, setIsExporting] = useState(false);
    const ffmpegRef = useRef<any>(null);

    /* ── Load FFmpeg.wasm ── */
    const initFFmpeg = useCallback(async () => {
        if (ffmpegRef.current && ffmpegLoaded) return ffmpegRef.current;
        if (ffmpegLoading) return null;

        setFfmpegLoading(true);
        try {
            const { FFmpeg } = await import("@ffmpeg/ffmpeg");
            const { toBlobURL } = await import("@ffmpeg/util");

            const ffmpeg = new FFmpeg();

            const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
            });

            ffmpegRef.current = ffmpeg;
            setFfmpegLoaded(true);
            setFfmpegLoading(false);
            return ffmpeg;
        } catch (err) {
            console.error("FFmpeg load error:", err);
            setFfmpegLoading(false);
            return null;
        }
    }, [ffmpegLoaded, ffmpegLoading]);

    /* ── Split file into segments ── */
    const splitFile = useCallback(async (
        inputFile: File,
        chapters: Chapter[],
        format: ExportFormat,
        quality: ExportQuality
    ) => {
        setIsExporting(true);
        setExportProgress(0);

        const ffmpeg = await initFFmpeg();
        if (!ffmpeg) {
            setIsExporting(false);
            return [];
        }

        /* Initialize segment tracking */
        const initialSegments: ExportSegment[] = chapters.map(ch => ({
            id: ch.id,
            name: ch.name,
            start: ch.start,
            end: ch.end,
            blobUrl: null,
            status: "pending",
            progress: 0,
        }));
        setSegments(initialSegments);

        const { fetchFile } = await import("@ffmpeg/util");
        const inputName = `input.${inputFile.name.split(".").pop() || "mp3"}`;

        try {
            await ffmpeg.writeFile(inputName, await fetchFile(inputFile));
        } catch (err) {
            console.error("Failed to write input file:", err);
            setIsExporting(false);
            return [];
        }

        const results: ExportSegment[] = [...initialSegments];
        const qualityArgs = QUALITY_MAP[format]?.[quality] || [];

        for (let i = 0; i < chapters.length; i++) {
            const ch = chapters[i];
            const outputName = `output_${i}.${format}`;

            results[i] = { ...results[i], status: "processing", progress: 0 };
            setSegments([...results]);

            try {
                const args = [
                    "-ss", ch.start.toString(),
                    "-to", ch.end.toString(),
                    "-i", inputName,
                    ...qualityArgs,
                    "-y",
                    outputName,
                ];

                await ffmpeg.exec(args);

                const data = await ffmpeg.readFile(outputName);
                const blob = new Blob([data], { type: getMimeType(format) });
                const url = URL.createObjectURL(blob);

                results[i] = { ...results[i], blobUrl: url, status: "done", progress: 100 };

                /* Cleanup output file */
                try { await ffmpeg.deleteFile(outputName); } catch { /* ignore */ }
            } catch (err) {
                console.error(`Failed to split segment ${i}:`, err);
                results[i] = { ...results[i], status: "error", progress: 0 };
            }

            setSegments([...results]);
            setExportProgress(Math.round(((i + 1) / chapters.length) * 100));
        }

        /* Cleanup input file */
        try { await ffmpeg.deleteFile(inputName); } catch { /* ignore */ }

        setIsExporting(false);
        return results;
    }, [initFFmpeg]);

    /* ── Download all as ZIP ── */
    const downloadAllAsZip = useCallback(async (
        completedSegments: ExportSegment[],
        format: ExportFormat
    ) => {
        const JSZip = (await import("jszip")).default;
        const zip = new JSZip();

        for (const seg of completedSegments) {
            if (!seg.blobUrl) continue;
            const response = await fetch(seg.blobUrl);
            const blob = await response.blob();
            const safeName = seg.name.replace(/[^a-zA-Z0-9_\- ]/g, "").trim() || seg.id;
            zip.file(`${safeName}.${format}`, blob);
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `tecsub-yt-special-export.zip`;
        a.click();
        URL.revokeObjectURL(url);
    }, []);

    /* ── Download single segment ── */
    const downloadSegment = useCallback((segment: ExportSegment, format: ExportFormat) => {
        if (!segment.blobUrl) return;
        const a = document.createElement("a");
        a.href = segment.blobUrl;
        const safeName = segment.name.replace(/[^a-zA-Z0-9_\- ]/g, "").trim() || segment.id;
        a.download = `${safeName}.${format}`;
        a.click();
    }, []);

    /* ── Cleanup ── */
    const cleanup = useCallback(() => {
        segments.forEach(seg => {
            if (seg.blobUrl) URL.revokeObjectURL(seg.blobUrl);
        });
        setSegments([]);
        setExportProgress(0);
        setIsExporting(false);
    }, [segments]);

    return {
        ffmpegLoaded, ffmpegLoading, segments, exportProgress, isExporting,
        initFFmpeg, splitFile, downloadAllAsZip, downloadSegment, cleanup,
    };
}

function getMimeType(format: ExportFormat): string {
    switch (format) {
        case "mp3": return "audio/mpeg";
        case "wav": return "audio/wav";
        case "mp4": return "video/mp4";
        case "flac": return "audio/flac";
        default: return "application/octet-stream";
    }
}
