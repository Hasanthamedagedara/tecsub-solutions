"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as mammoth from "mammoth";
import AdPlacement from "@/components/AdPlacement";

/* ══════════════════════════════════════════════════════════
   CLIENT-SIDE TRANSLATION ENGINE
   – No server / Apps Script required
   – Uses Google Translate public endpoint (no API key)
   – Text extraction: mammoth (DOCX), FileReader (TXT/MD/PDF text)
   – PDF generation: html2pdf.js
   ══════════════════════════════════════════════════════════ */

/* ─── Dynamic html2pdf import ─── */
const loadHtml2pdf = async () => {
    const mod = (await import("html2pdf.js")).default;
    return mod;
};

/* ─── Google Translate (free, no key, 5000 char limit per call) ─── */
async function translateChunk(text: string, targetLang: string): Promise<string> {
    const encoded = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encoded}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Translate API error: ${res.status}`);
    const data = await res.json();
    // Response is an array of arrays: [[["translated","original",...],...],...]
    return (data[0] as Array<[string]>).map(a => a[0]).join("");
}

async function translateText(text: string, targetLang: string, onProgress?: (p: number) => void): Promise<string> {
    const MAX = 4500;
    if (text.length <= MAX) {
        const result = await translateChunk(text, targetLang);
        onProgress?.(100);
        return result;
    }

    // Split by paragraphs, batch into ≤MAX chunks
    const paras = text.split(/\n+/);
    const batches: string[] = [];
    let current = "";
    for (const p of paras) {
        if ((current + "\n" + p).length > MAX) {
            if (current) batches.push(current);
            current = p;
        } else {
            current = current ? current + "\n" + p : p;
        }
    }
    if (current) batches.push(current);

    const translated: string[] = [];
    for (let i = 0; i < batches.length; i++) {
        translated.push(await translateChunk(batches[i], targetLang));
        onProgress?.(Math.round(((i + 1) / batches.length) * 100));
    }
    return translated.join("\n\n");
}

/* ─── Text extraction ─── */
async function extractText(file: File): Promise<string> {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";

    if (ext === "txt" || ext === "md") {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string ?? "");
            reader.onerror = reject;
            reader.readAsText(file, "UTF-8");
        });
    }

    if (ext === "docx") {
        const buf = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: buf });
        return result.value;
    }

    if (ext === "pdf") {
        // For PDFs: read as array buffer, extract text via PDF.js if available,
        // otherwise return a helpful message
        try {
            // Dynamic PDF.js import
            const pdfjsLib = await import("pdfjs-dist").catch(() => null);
            if (pdfjsLib) {
                const pdfjsModule = pdfjsLib as typeof import("pdfjs-dist");
                if (!pdfjsModule.GlobalWorkerOptions.workerSrc) {
                    pdfjsModule.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.js`;
                }
                const buf = await file.arrayBuffer();
                const pdf = await pdfjsModule.getDocument({ data: buf }).promise;
                const pages: string[] = [];
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    pages.push(content.items.map((item: { str?: string }) => item.str ?? "").join(" "));
                }
                return pages.join("\n\n");
            }
        } catch { /* fallback below */ }

        // Fallback: read PDF as raw text (works for some PDFs)
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const raw = e.target?.result as string ?? "";
                // Extract readable text between PDF markers
                const matches = raw.match(/\(([^\)]{4,})\)/g) ?? [];
                const text = matches
                    .map(m => m.slice(1, -1))
                    .filter(t => /[a-zA-Z]{3,}/.test(t))
                    .join(" ");
                resolve(text || "[Could not extract text from this PDF. Try converting to DOCX first.]");
            };
            reader.readAsBinaryString(file);
        });
    }

    throw new Error(`Unsupported file type: .${ext}. Please use DOCX, TXT, or MD.`);
}

/* ─── Generate PDF from HTML string ─── */
async function generatePdf(htmlContent: string, filename: string): Promise<void> {
    const h2p = await loadHtml2pdf();
    const container = document.createElement("div");
    container.innerHTML = htmlContent;
    container.style.cssText = "font-family: 'Noto Sans', sans-serif; font-size:12px; color:#111; line-height:1.7; padding:20px;";
    document.body.appendChild(container);

    await h2p()
        .set({
            margin: [15, 15, 15, 15],
            filename: filename,
            image: { type: "jpeg", quality: 0.95 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(container)
        .save();

    document.body.removeChild(container);
}

/* ─── UI Text ─── */
type UILang = "en" | "si" | "ta";
const uiText: Record<UILang, Record<string, string>> = {
    en: {
        title: "Tecsub Translator", uiLang: "Interface Language",
        tabTranslate: "Translate", tabReminder: "Payment Reminder",
        uploadLabel: "Upload Document (DOCX, TXT, PDF)", uploadHint: "Click or drag a file here",
        targetLabel: "Translate To", translateBtn: "Translate & Download PDF",
        processing: "Processing...", remindTitle: "Payment Reminder",
        remindType: "Reminder Type", daily: "Daily", specific: "Specific Date",
        setRemind: "Set Reminder", reminderSuccess: "Reminder set!",
        notSupported: "Notifications not supported.",
    },
    si: {
        title: "ටෙක්සබ් පරිවර්තකය", uiLang: "අතුරු මුහුණත් භාෂාව",
        tabTranslate: "පරිවර්තනය", tabReminder: "ගෙවීම් මතක් කිරීම",
        uploadLabel: "ලේඛනය උඩුගත කරන්න (DOCX, TXT, PDF)", uploadHint: "ගොනුවක් මෙහි ඇදගෙන එන්න",
        targetLabel: "පරිවර්තනය කළ යුතු භාෂාව", translateBtn: "පරිවර්තනය කර PDF බාගන්න",
        processing: "සකසමින්...", remindTitle: "ගෙවීම් මතක් කිරීම්",
        remindType: "මතක් කිරීමේ ආකාරය", daily: "දිනපතා", specific: "නිශ්චිත දිනය",
        setRemind: "මතක් කිරීම සක්‍රිය කරන්න", reminderSuccess: "සාර්ථකයි!",
        notSupported: "දැනුම්දීම් සහාය නොදක්වයි.",
    },
    ta: {
        title: "டெக்சப் மொழிபெயர்ப்பாளர்", uiLang: "இடைமுக மொழி",
        tabTranslate: "மொழிபெயர்ப்பு", tabReminder: "கட்டண நினைவூட்டல்",
        uploadLabel: "ஆவணத்தை பதிவேற்றவும் (DOCX, TXT, PDF)", uploadHint: "கோப்பை இங்கே இழுக்கவும்",
        targetLabel: "மொழிபெயர்க்க வேண்டிய மொழி", translateBtn: "மொழிபெயர்த்து PDF பதிவிறக்கவும்",
        processing: "செயலாக்கம்...", remindTitle: "கட்டண நினைவூட்டல்",
        remindType: "நினைவூட்டல் வகை", daily: "தினசரி", specific: "தேதி",
        setRemind: "நினைவூட்டலை அமைக்கவும்", reminderSuccess: "அமைக்கப்பட்டது!",
        notSupported: "அறிவிப்புகள் ஆதரிக்கப்படவில்லை.",
    },
};

const languages = [
    { code: "si", label: "Sinhala" }, { code: "ta", label: "Tamil" },
    { code: "hi", label: "Hindi" }, { code: "en", label: "English" },
    { code: "es", label: "Spanish" }, { code: "fr", label: "French" },
    { code: "de", label: "German" }, { code: "ja", label: "Japanese" },
    { code: "ko", label: "Korean" }, { code: "zh", label: "Chinese (Simplified)" },
    { code: "ar", label: "Arabic" }, { code: "pt", label: "Portuguese" },
    { code: "ru", label: "Russian" }, { code: "it", label: "Italian" },
    { code: "th", label: "Thai" }, { code: "bn", label: "Bengali" },
    { code: "ms", label: "Malay" }, { code: "id", label: "Indonesian" },
    { code: "tr", label: "Turkish" }, { code: "vi", label: "Vietnamese" },
];

/* ══════════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════════ */
export default function TranslatorTool() {
    const [uiLang, setUiLang] = useState<UILang>("en");
    const [activeTab, setActiveTab] = useState<"translate" | "reminder">("translate");
    const [targetLang, setTargetLang] = useState("si");
    const [status, setStatus] = useState("");
    const [statusType, setStatusType] = useState<"info" | "success" | "error">("info");
    const [isProcessing, setIsProcessing] = useState(false);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [isDragOver, setIsDragOver] = useState(false);
    const [remindType, setRemindType] = useState<"daily" | "specific">("daily");
    const [remindDate, setRemindDate] = useState("");
    const [reminderMsg, setReminderMsg] = useState("");
    const dropRef = useRef<HTMLDivElement>(null);
    const T = uiText[uiLang];

    const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); }, []);
    const handleDragLeave = useCallback(() => setIsDragOver(false), []);
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault(); setIsDragOver(false);
        if (e.dataTransfer.files[0]) setFileToUpload(e.dataTransfer.files[0]);
    }, []);

    const setMsg = (msg: string, type: "info" | "success" | "error" = "info") => {
        setStatus(msg); setStatusType(type);
    };

    /* ─── Main translate handler ─── */
    const translateAndDownload = async () => {
        if (!fileToUpload) { setMsg("Please select a file first.", "error"); return; }

        setIsProcessing(true);
        setProgress(10);
        setMsg("Extracting text from document…");

        try {
            // Step 1: Extract text
            const text = await extractText(fileToUpload);
            if (!text || text.trim().length < 5) {
                throw new Error("No readable text found in the document.");
            }

            setProgress(25);
            setMsg(`Translating ${text.length} characters to ${languages.find(l => l.code === targetLang)?.label ?? targetLang}…`);

            // Step 2: Translate (client-side via Google Translate)
            const translated = await translateText(text, targetLang, (p) => {
                setProgress(25 + Math.round(p * 0.6)); // 25–85%
            });

            setProgress(88);
            setMsg("Generating PDF…");

            // Step 3: Build HTML for PDF
            const langLabel = languages.find(l => l.code === targetLang)?.label ?? targetLang;
            const htmlContent = `
                <div style="font-family:'Noto Sans',Arial,sans-serif;max-width:700px;margin:auto;">
                    <h1 style="font-size:18px;color:#1a73e8;border-bottom:2px solid #e8f0fe;padding-bottom:8px;margin-bottom:4px;">
                        Tecsub Translator
                    </h1>
                    <p style="font-size:10px;color:#888;margin-bottom:20px;">
                        Source: ${fileToUpload.name} &nbsp;|&nbsp; Translated to: ${langLabel}
                    </p>
                    ${translated.split("\n").map(line =>
                line.trim()
                    ? `<p style="margin:0 0 8px;font-size:12px;line-height:1.7;color:#111;">${line.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`
                    : "<br/>"
            ).join("")}
                </div>
            `;

            // Step 4: Generate & download PDF
            const pdfName = "Translated_" + fileToUpload.name.replace(/\.[^.]+$/, ".pdf");
            await generatePdf(htmlContent, pdfName);

            setProgress(100);
            setMsg("✅ Translation complete! PDF is downloading.", "success");

        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
                setMsg("❌ Network error: Check your internet connection and try again.", "error");
            } else {
                setMsg("❌ " + msg, "error");
            }
        } finally {
            setIsProcessing(false);
        }
    };

    /* ─── Reminder ─── */
    const setReminder = () => {
        if (!("Notification" in window)) { setReminderMsg(T.notSupported); return; }
        Notification.requestPermission().then((perm) => {
            if (perm === "granted") setReminderMsg(T.reminderSuccess);
        });
    };

    const statusBg: Record<string, string> = {
        info: "rgba(52,152,219,0.12)", success: "rgba(26,188,156,0.12)", error: "rgba(231,76,60,0.12)",
    };
    const statusColor: Record<string, string> = {
        info: "#3498db", success: "#1abc9c", error: "#e74c3c",
    };

    /* ─── Render ─── */
    return (
        <div className="w-full flex flex-col gap-6 items-center">
            <AdPlacement format="728x90" webOnly />

            <div
                className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden"
                style={{
                    background: "linear-gradient(145deg, rgba(30,40,60,0.95), rgba(18,22,36,0.98))",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
            >
                {/* ── Header ── */}
                <div className="px-6 pt-6 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                        <h2
                            className="text-xl font-bold tracking-tight"
                            style={{ background: "linear-gradient(135deg, #1abc9c, #3498db)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                        >
                            {T.title}
                        </h2>
                        <p className="text-[11px] text-gray-500 mt-0.5">100% client-side · No server required</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{T.uiLang}</span>
                        <select
                            value={uiLang}
                            onChange={(e) => setUiLang(e.target.value as UILang)}
                            className="text-xs px-3 py-1.5 rounded-lg outline-none cursor-pointer"
                            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#e0e0e0" }}
                        >
                            <option value="en">English</option>
                            <option value="si">සිංහල</option>
                            <option value="ta">தமிழ்</option>
                        </select>
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div className="px-6">
                    <div className="flex rounded-xl p-1 gap-1" style={{ background: "rgba(255,255,255,0.04)" }}>
                        {(["translate", "reminder"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className="relative flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300"
                                style={{
                                    color: activeTab === tab ? "#fff" : "#8899aa",
                                    background: activeTab === tab ? "linear-gradient(135deg, rgba(26,188,156,0.35), rgba(52,152,219,0.25))" : "transparent",
                                    boxShadow: activeTab === tab ? "0 0 20px rgba(26,188,156,0.15), inset 0 1px 0 rgba(255,255,255,0.08)" : "none",
                                }}
                            >
                                {tab === "translate" ? T.tabTranslate : T.tabReminder}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Content ── */}
                <div className="p-6">
                    <AnimatePresence mode="wait">
                        {activeTab === "translate" ? (
                            <motion.div key="translate" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="flex flex-col gap-5">

                                {/* 1 — File Drop Zone */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-300">1. {T.uploadLabel}</label>
                                    <div
                                        ref={dropRef}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className="relative rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer"
                                        style={{
                                            border: `2px dashed ${isDragOver ? "#1abc9c" : "rgba(255,255,255,0.12)"}`,
                                            background: isDragOver ? "rgba(26,188,156,0.08)" : "rgba(255,255,255,0.03)",
                                        }}
                                    >
                                        <input
                                            type="file"
                                            accept=".docx,.txt,.md,.pdf"
                                            onChange={(e) => setFileToUpload(e.target.files?.[0] || null)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1abc9c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-60">
                                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                        <span className="text-white font-medium text-sm">{fileToUpload ? fileToUpload.name : T.uploadHint}</span>
                                        {fileToUpload && <span className="text-xs text-gray-500 mt-1">{(fileToUpload.size / 1024).toFixed(1)} KB</span>}
                                    </div>
                                </div>

                                {/* 2 — Language */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-300">2. {T.targetLabel}</label>
                                    <select
                                        value={targetLang}
                                        onChange={(e) => setTargetLang(e.target.value)}
                                        className="px-4 py-3 rounded-lg outline-none transition-colors"
                                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e0e0e0" }}
                                    >
                                        {languages.map((lang) => (
                                            <option key={lang.code} value={lang.code} style={{ background: "#1a1e2e" }}>
                                                {lang.label} ({lang.code})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Progress bar */}
                                {isProcessing && (
                                    <div className="w-full rounded-full overflow-hidden h-2" style={{ background: "rgba(255,255,255,0.06)" }}>
                                        <motion.div
                                            className="h-full rounded-full"
                                            style={{ background: "linear-gradient(90deg, #1abc9c, #3498db)", boxShadow: "0 0 12px rgba(26,188,156,0.5)" }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                )}

                                {/* Button */}
                                <button
                                    onClick={translateAndDownload}
                                    disabled={isProcessing || !fileToUpload}
                                    className="w-full py-4 rounded-xl font-bold text-base text-white transition-all duration-300"
                                    style={{
                                        background: isProcessing ? "rgba(100,100,120,0.4)" : "linear-gradient(135deg, #1abc9c, #16a085)",
                                        boxShadow: isProcessing ? "none" : "0 4px 20px rgba(26,188,156,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                                        cursor: isProcessing || !fileToUpload ? "not-allowed" : "pointer",
                                        opacity: !fileToUpload && !isProcessing ? 0.6 : 1,
                                    }}
                                >
                                    {isProcessing ? `${T.processing} ${progress}%` : T.translateBtn}
                                </button>

                                {/* Status */}
                                {status && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center font-medium p-3 rounded-lg text-sm"
                                        style={{ background: statusBg[statusType], color: statusColor[statusType] }}
                                    >
                                        {status}
                                    </motion.div>
                                )}
                            </motion.div>
                        ) : (
                            /* ── Reminder Tab ── */
                            <motion.div key="reminder" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="flex flex-col gap-5">
                                <h3 className="text-lg font-bold" style={{ background: "linear-gradient(135deg, #3498db, #9b59b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{T.remindTitle}</h3>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-300">{T.remindType}</label>
                                    <select value={remindType} onChange={(e) => setRemindType(e.target.value as "daily" | "specific")} className="px-4 py-3 rounded-lg outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e0e0e0" }}>
                                        <option value="daily" style={{ background: "#1a1e2e" }}>{T.daily}</option>
                                        <option value="specific" style={{ background: "#1a1e2e" }}>{T.specific}</option>
                                    </select>
                                </div>
                                {remindType === "specific" && (
                                    <input type="date" value={remindDate} onChange={(e) => setRemindDate(e.target.value)} className="w-full px-4 py-3 rounded-lg outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e0e0e0", colorScheme: "dark" }} />
                                )}
                                <button onClick={setReminder} className="w-full py-4 rounded-xl font-bold text-base text-white transition-all duration-300" style={{ background: "linear-gradient(135deg, #3498db, #2980b9)", boxShadow: "0 4px 20px rgba(52,152,219,0.3)" }}>{T.setRemind}</button>
                                {reminderMsg && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center font-medium p-3 rounded-lg text-sm" style={{ background: "rgba(26,188,156,0.12)", color: "#1abc9c" }}>{reminderMsg}</motion.div>}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <AdPlacement format="728x90" webOnly />
        </div>
    );
}
