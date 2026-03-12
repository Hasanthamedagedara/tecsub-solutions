"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as mammoth from "mammoth";
import AdPlacement from "@/components/AdPlacement";

/* ─── Dynamic html2pdf import ─── */
const html2pdf = async () => {
    const html2pdfModule = (await import("html2pdf.js")).default;
    return html2pdfModule;
};

/* ─── UI Translation Data ─── */
type UILang = "en" | "si" | "ta";

const uiText: Record<UILang, Record<string, string>> = {
    en: {
        title: "Tecsub Translator",
        uiLang: "Interface Language",
        tabTranslate: "Translate",
        tabReminder: "Payment Reminder",
        uploadLabel: "Upload Document (DOCX, TXT, PDF, PPTX)",
        uploadHint: "Click or drag a file here to upload",
        targetLabel: "Translate To",
        gasLabel: "Google Script Web App URL",
        gasHint: "https://script.google.com/macros/s/...",
        gasRequired: "(Required)",
        translateBtn: "Translate & Download PDF",
        processing: "Processing...",
        remindTitle: "Payment Reminder",
        remindType: "Reminder Type",
        daily: "Daily",
        specific: "Specific Date",
        setRemind: "Set Reminder",
        reminderSuccess: "Reminder set successfully!",
        notSupported: "Notifications not supported in this browser.",
    },
    si: {
        title: "ටෙක්සබ් පරිවර්තකය",
        uiLang: "අතුරු මුහුණත් භාෂාව",
        tabTranslate: "පරිවර්තනය",
        tabReminder: "ගෙවීම් මතක් කිරීම",
        uploadLabel: "ලේඛනය උඩුගත කරන්න (DOCX, TXT, PDF, PPTX)",
        uploadHint: "උඩුගත කිරීමට ගොනුවක් මෙහි ඇදගෙන එන්න",
        targetLabel: "පරිවර්තනය කළ යුතු භාෂාව",
        gasLabel: "Google Script Web App URL",
        gasHint: "https://script.google.com/macros/s/...",
        gasRequired: "(අවශ්‍යයි)",
        translateBtn: "පරිවර්තනය කර PDF බාගන්න",
        processing: "සකසමින්...",
        remindTitle: "ගෙවීම් මතක් කිරීම්",
        remindType: "මතක් කිරීමේ ආකාරය",
        daily: "දිනපතා",
        specific: "නිශ්චිත දිනය",
        setRemind: "මතක් කිරීම සක්‍රිය කරන්න",
        reminderSuccess: "මතක් කිරීම සාර්ථකව සකසා ඇත!",
        notSupported: "මෙම බ්‍රවුසරයේ දැනුම්දීම් සඳහා සහාය නොදක්වයි.",
    },
    ta: {
        title: "டெக்சப் மொழிபெயர்ப்பாளர்",
        uiLang: "இடைமுக மொழி",
        tabTranslate: "மொழிபெயர்ப்பு",
        tabReminder: "கட்டண நினைவூட்டல்",
        uploadLabel: "ஆவணத்தை பதிவேற்றவும் (DOCX, TXT, PDF, PPTX)",
        uploadHint: "பதிவேற்ற ஒரு கோப்பை இங்கே இழுக்கவும்",
        targetLabel: "மொழிபெயர்க்க வேண்டிய மொழி",
        gasLabel: "Google Script Web App URL",
        gasHint: "https://script.google.com/macros/s/...",
        gasRequired: "(தேவை)",
        translateBtn: "மொழிபெயர்த்து PDF பதிவிறக்கவும்",
        processing: "செயலாக்கம்...",
        remindTitle: "கட்டண நினைவூட்டல்",
        remindType: "நினைவூட்டல் வகை",
        daily: "தினசரி",
        specific: "குறிப்பிட்ட தேதி",
        setRemind: "நினைவூட்டலை அமைக்கவும்",
        reminderSuccess: "நினைவூட்டல் வெற்றிகரமாக அமைக்கப்பட்டது!",
        notSupported: "இந்த உலாவியில் அறிவிப்புகள் ஆதரிக்கப்படவில்லை.",
    },
};

/* ─── Target Language List ─── */
const languages = [
    { code: "si", label: "Sinhala" },
    { code: "ta", label: "Tamil" },
    { code: "hi", label: "Hindi" },
    { code: "en", label: "English" },
    { code: "es", label: "Spanish" },
    { code: "fr", label: "French" },
    { code: "de", label: "German" },
    { code: "ja", label: "Japanese" },
    { code: "ko", label: "Korean" },
    { code: "zh", label: "Chinese" },
    { code: "ar", label: "Arabic" },
    { code: "pt", label: "Portuguese" },
    { code: "ru", label: "Russian" },
    { code: "it", label: "Italian" },
    { code: "th", label: "Thai" },
    { code: "bn", label: "Bengali" },
];

/* ═══════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════ */
export default function TranslatorTool() {
    /* ── state ── */
    const [uiLang, setUiLang] = useState<UILang>("en");
    const [activeTab, setActiveTab] = useState<"translate" | "reminder">("translate");
    const [gasUrl, setGasUrl] = useState("");
    const [targetLang, setTargetLang] = useState("si");
    const [status, setStatus] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [isDragOver, setIsDragOver] = useState(false);

    /* reminder state */
    const [remindType, setRemindType] = useState<"daily" | "specific">("daily");
    const [remindDate, setRemindDate] = useState("");
    const [reminderMsg, setReminderMsg] = useState("");

    const dropRef = useRef<HTMLDivElement>(null);
    const T = uiText[uiLang];

    /* ─── Chunking Helpers ─── */
    const chunkText = (text: string, maxLength = 1900): string[] => {
        const chunks: string[] = [];
        let index = 0;
        while (index < text.length) {
            let endIndex = Math.min(index + maxLength, text.length);
            if (endIndex < text.length) {
                const searchStr = text.substring(index, endIndex);
                const lastSpace = searchStr.lastIndexOf(" ");
                if (lastSpace > 0) endIndex = index + lastSpace;
            }
            chunks.push(text.substring(index, endIndex));
            index = endIndex;
        }
        return chunks;
    };

    /* ─── Drag & Drop ─── */
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);
    const handleDragLeave = useCallback(() => setIsDragOver(false), []);
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files.length > 0) setFileToUpload(e.dataTransfer.files[0]);
    }, []);

    /* ─── Translation Logic ─── */
    const translateAndDownload = async () => {
        if (!fileToUpload) return alert("Please select a file first!");
        if (!gasUrl.trim() || !gasUrl.includes("script.google.com")) {
            return alert("Please enter a valid Google Apps Script Web App URL.");
        }

        setIsProcessing(true);
        setProgress(0);
        setStatus("Extracting raw text from file...");

        try {
            let originalText = "";
            const ext = fileToUpload.name.split(".").pop()?.toLowerCase();

            const loadScript = (src: string) =>
                new Promise((resolve, reject) => {
                    if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
                    const s = document.createElement("script");
                    s.src = src;
                    s.onload = resolve;
                    s.onerror = reject;
                    document.head.appendChild(s);
                });

            if (ext === "docx") {
                const arrayBuffer = await fileToUpload.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                originalText = result.value;
            } else if (ext === "txt" || ext === "md") {
                originalText = await fileToUpload.text();
            } else if (ext === "pdf") {
                setStatus("Loading PDF engine...");
                await loadScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js");
                const pdfjsLib = (window as any)["pdfjs-dist/build/pdf"];
                pdfjsLib.GlobalWorkerOptions.workerSrc =
                    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
                const arrayBuffer = await fileToUpload.arrayBuffer();
                const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const tc = await page.getTextContent();
                    originalText += tc.items.map((item: any) => item.str).join(" ") + "\n\n";
                }
            } else if (ext === "pptx") {
                setStatus("Extracting slides...");
                await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js");
                const JSZip = (window as any).JSZip;
                const arrayBuffer = await fileToUpload.arrayBuffer();
                const zip = await JSZip.loadAsync(arrayBuffer);
                const slideFiles = Object.keys(zip.files).filter(
                    (name: string) => name.startsWith("ppt/slides/slide") && name.endsWith(".xml")
                );
                for (const fileName of slideFiles) {
                    const xml = await zip.files[fileName].async("string");
                    const matches = xml.match(/<a:t.*?>(.*?)<\/a:t>/g) || [];
                    const slideText = matches.map((m: string) => m.replace(/<\/?[^>]+(>|$)/g, "")).join(" ");
                    if (slideText) originalText += slideText + "\n\n";
                }
            } else {
                setStatus("Error: Unsupported file type.");
                setIsProcessing(false);
                return;
            }

            if (!originalText.trim()) {
                setStatus("File appears to be empty.");
                setIsProcessing(false);
                return;
            }

            /* Chunk & Translate with progress */
            const chunks = chunkText(originalText);
            let fullTranslatedText = "";

            for (let i = 0; i < chunks.length; i++) {
                const pct = Math.round(((i + 1) / chunks.length) * 100);
                setProgress(pct);
                setStatus(`Translating chunk ${i + 1} of ${chunks.length}...`);

                try {
                    const response = await fetch(
                        `${gasUrl}?target=${targetLang}&text=${encodeURIComponent(chunks[i])}`
                    );
                    if (!response.ok) throw new Error("API Error");
                    fullTranslatedText += (await response.text()) + "\n\n";
                    await new Promise((res) => setTimeout(res, 500));
                } catch {
                    setStatus(`Error translating chunk ${i + 1}.`);
                    setIsProcessing(false);
                    return;
                }
            }

            /* Render & Export PDF */
            setStatus("Generating translated PDF...");
            const element = document.createElement("div");
            element.style.padding = "40px";
            element.style.fontFamily = "Arial, sans-serif";
            element.style.color = "#000";
            element.style.fontSize = "16px";
            element.style.whiteSpace = "pre-wrap";
            element.innerText = fullTranslatedText;

            const engine = await html2pdf();
            const opt = {
                margin: 10,
                filename: `Translated_${targetLang.toUpperCase()}_${fileToUpload.name}.pdf`,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            };
            await engine().set(opt).from(element).save();
            setStatus("Success! File Downloaded.");
        } catch (err) {
            console.error(err);
            setStatus("An unknown error occurred.");
        }
        setIsProcessing(false);
    };

    /* ─── Reminder Logic ─── */
    const setReminder = () => {
        if (!("Notification" in window)) {
            setReminderMsg(T.notSupported);
            return;
        }
        Notification.requestPermission().then((perm) => {
            if (perm === "granted") {
                setReminderMsg(T.reminderSuccess);
                // In production, this would register a service worker / backend push
            }
        });
    };

    /* ═══════════ RENDER ═══════════ */
    return (
        <div className="w-full flex flex-col gap-6 items-center">
            <AdPlacement format="728x90" webOnly />

            {/* ── Main Card ── */}
            <div
                className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden"
                style={{
                    background: "linear-gradient(145deg, rgba(30,40,60,0.95), rgba(18,22,36,0.98))",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
            >
                {/* ── Header Row ── */}
                <div className="px-6 pt-6 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <h2
                        className="text-xl font-bold tracking-tight"
                        style={{
                            background: "linear-gradient(135deg, #1abc9c, #3498db)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        {T.title}
                    </h2>

                    {/* UI Language Picker */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{T.uiLang}</span>
                        <select
                            value={uiLang}
                            onChange={(e) => setUiLang(e.target.value as UILang)}
                            className="text-xs px-3 py-1.5 rounded-lg outline-none cursor-pointer"
                            style={{
                                background: "rgba(255,255,255,0.06)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                color: "#e0e0e0",
                            }}
                        >
                            <option value="en">English</option>
                            <option value="si">සිංහල</option>
                            <option value="ta">தமிழ்</option>
                        </select>
                    </div>
                </div>

                {/* ── Tab Bar ── */}
                <div className="px-6">
                    <div
                        className="flex rounded-xl p-1 gap-1"
                        style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                        {(["translate", "reminder"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className="relative flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300"
                                style={{
                                    color: activeTab === tab ? "#fff" : "#8899aa",
                                    background:
                                        activeTab === tab
                                            ? "linear-gradient(135deg, rgba(26,188,156,0.35), rgba(52,152,219,0.25))"
                                            : "transparent",
                                    boxShadow:
                                        activeTab === tab
                                            ? "0 0 20px rgba(26,188,156,0.15), inset 0 1px 0 rgba(255,255,255,0.08)"
                                            : "none",
                                }}
                            >
                                {tab === "translate" ? T.tabTranslate : T.tabReminder}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Tab Content ── */}
                <div className="p-6">
                    <AnimatePresence mode="wait">
                        {activeTab === "translate" ? (
                            <motion.div
                                key="translate"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.25 }}
                                className="flex flex-col gap-5"
                            >
                                {/* 1 — File Upload Drop Zone */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-300">
                                        1. {T.uploadLabel}
                                    </label>
                                    <div
                                        ref={dropRef}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className="relative rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer"
                                        style={{
                                            border: `2px dashed ${isDragOver ? "#1abc9c" : "rgba(255,255,255,0.12)"}`,
                                            background: isDragOver
                                                ? "rgba(26,188,156,0.08)"
                                                : "rgba(255,255,255,0.03)",
                                            boxShadow: isDragOver
                                                ? "inset 0 0 30px rgba(26,188,156,0.1)"
                                                : "none",
                                        }}
                                    >
                                        <input
                                            type="file"
                                            accept=".docx,.txt,.md,.pdf,.pptx"
                                            onChange={(e) => setFileToUpload(e.target.files?.[0] || null)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        {/* Upload Icon */}
                                        <svg
                                            width="36"
                                            height="36"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#1abc9c"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="mb-3 opacity-60"
                                        >
                                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                        <span className="text-white font-medium text-sm">
                                            {fileToUpload ? fileToUpload.name : T.uploadHint}
                                        </span>
                                        {fileToUpload && (
                                            <span className="text-xs text-gray-500 mt-1">
                                                {(fileToUpload.size / 1024).toFixed(1)} KB
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* 2 — Language & GAS Config */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-gray-300">
                                            2. {T.targetLabel}
                                        </label>
                                        <select
                                            value={targetLang}
                                            onChange={(e) => setTargetLang(e.target.value)}
                                            className="px-4 py-3 rounded-lg outline-none transition-colors"
                                            style={{
                                                background: "rgba(255,255,255,0.05)",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                color: "#e0e0e0",
                                            }}
                                        >
                                            {languages.map((lang) => (
                                                <option
                                                    key={lang.code}
                                                    value={lang.code}
                                                    style={{ background: "#1a1e2e", color: "#e0e0e0" }}
                                                >
                                                    {lang.label} ({lang.code})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-gray-300">
                                            3. {T.gasLabel}{" "}
                                            <span className="text-xs text-gray-500 font-normal ml-1">
                                                {T.gasRequired}
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={gasUrl}
                                            onChange={(e) => setGasUrl(e.target.value)}
                                            placeholder={T.gasHint}
                                            className="px-4 py-3 rounded-lg outline-none text-sm transition-colors placeholder-gray-600"
                                            style={{
                                                background: "rgba(255,255,255,0.05)",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                color: "#e0e0e0",
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                {isProcessing && progress > 0 && (
                                    <div className="w-full rounded-full overflow-hidden h-2" style={{ background: "rgba(255,255,255,0.06)" }}>
                                        <motion.div
                                            className="h-full rounded-full"
                                            style={{
                                                background: "linear-gradient(90deg, #1abc9c, #3498db)",
                                                boxShadow: "0 0 12px rgba(26,188,156,0.5)",
                                            }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.4 }}
                                        />
                                    </div>
                                )}

                                {/* Action Button */}
                                <button
                                    onClick={translateAndDownload}
                                    disabled={isProcessing}
                                    className="w-full py-4 rounded-xl font-bold text-base text-white transition-all duration-300"
                                    style={{
                                        background: isProcessing
                                            ? "rgba(100,100,120,0.4)"
                                            : "linear-gradient(135deg, #1abc9c, #16a085)",
                                        boxShadow: isProcessing
                                            ? "none"
                                            : "0 4px 20px rgba(26,188,156,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                                        cursor: isProcessing ? "not-allowed" : "pointer",
                                    }}
                                >
                                    {isProcessing ? T.processing : T.translateBtn}
                                </button>

                                {/* Status Message */}
                                {status && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center font-medium p-3 rounded-lg text-sm"
                                        style={{
                                            background: status.includes("Error")
                                                ? "rgba(231,76,60,0.15)"
                                                : "rgba(52,152,219,0.12)",
                                            color: status.includes("Error") ? "#e74c3c" : "#3498db",
                                        }}
                                    >
                                        {status}
                                    </motion.div>
                                )}
                            </motion.div>
                        ) : (
                            /* ── Reminder Tab ── */
                            <motion.div
                                key="reminder"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.25 }}
                                className="flex flex-col gap-5"
                            >
                                <h3
                                    className="text-lg font-bold"
                                    style={{
                                        background: "linear-gradient(135deg, #3498db, #9b59b6)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    {T.remindTitle}
                                </h3>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-300">
                                        {T.remindType}
                                    </label>
                                    <select
                                        value={remindType}
                                        onChange={(e) => setRemindType(e.target.value as "daily" | "specific")}
                                        className="px-4 py-3 rounded-lg outline-none transition-colors"
                                        style={{
                                            background: "rgba(255,255,255,0.05)",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            color: "#e0e0e0",
                                        }}
                                    >
                                        <option value="daily" style={{ background: "#1a1e2e" }}>
                                            {T.daily}
                                        </option>
                                        <option value="specific" style={{ background: "#1a1e2e" }}>
                                            {T.specific}
                                        </option>
                                    </select>
                                </div>

                                {remindType === "specific" && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        <input
                                            type="date"
                                            value={remindDate}
                                            onChange={(e) => setRemindDate(e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg outline-none"
                                            style={{
                                                background: "rgba(255,255,255,0.05)",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                color: "#e0e0e0",
                                                colorScheme: "dark",
                                            }}
                                        />
                                    </motion.div>
                                )}

                                <button
                                    onClick={setReminder}
                                    className="w-full py-4 rounded-xl font-bold text-base text-white transition-all duration-300"
                                    style={{
                                        background: "linear-gradient(135deg, #3498db, #2980b9)",
                                        boxShadow:
                                            "0 4px 20px rgba(52,152,219,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                                    }}
                                >
                                    {T.setRemind}
                                </button>

                                {reminderMsg && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center font-medium p-3 rounded-lg text-sm"
                                        style={{
                                            background: "rgba(26,188,156,0.12)",
                                            color: "#1abc9c",
                                        }}
                                    >
                                        {reminderMsg}
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <AdPlacement format="728x90" webOnly />
        </div>
    );
}
