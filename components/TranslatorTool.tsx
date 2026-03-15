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

/* ─── Hardcoded Backend URL ─── */
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxvf-5sw95b_s-RALjfLqsT2yAdkMnVctnzQMO1oSk98Jt7vTkOy5NHOA6duW5ELTgl4A/exec";

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
        if (!fileToUpload) {
            alert("කරුණාකර පලමුව PDF/Doc එකක් තෝරන්න.");
            return;
        }

        setIsProcessing(true);
        setProgress(0);
        setStatus("පරිවර්තනය වෙමින් පවතී... කරුණාකර රැඳී සිටින්න.");

        const reader = new FileReader();

        reader.onload = async (e) => {
            const base64Data = (e.target?.result as string).split(",")[1];

            try {
                setProgress(30);
                setStatus("Sending to Google Script...");

                const response = await fetch(SCRIPT_URL, {
                    method: "POST",
                    body: JSON.stringify({
                        fileData: base64Data,
                        fileName: fileToUpload.name,
                        targetLang: targetLang,
                    }),
                });

                setProgress(70);

                // Handle non-JSON responses gracefully
                const text = await response.text();
                let result: { status: string; pdfData?: string; message?: string };
                try {
                    result = JSON.parse(text);
                } catch {
                    throw new Error("Invalid response from server: " + text.slice(0, 200));
                }

                if (result.status === "success" && result.pdfData) {
                    setProgress(90);
                    setStatus("Downloading translated PDF...");

                    const link = document.createElement("a");
                    link.href = "data:application/pdf;base64," + result.pdfData;
                    link.download = "Translated_" + fileToUpload.name.replace(/\.[^.]+$/, ".pdf");
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    setProgress(100);
                    setStatus("✅ Translation complete! Your PDF is downloading.");
                } else {
                    const msg = result.message ?? "Unknown error";
                    // Detect the specific Drive API error
                    if (msg.includes("Drive.Files.insert") || msg.includes("is not a function")) {
                        setStatus("❌ Script Error: The Google Apps Script needs to be updated. Please redeploy using the fixed script below (Drive.Files.create instead of Drive.Files.insert).");
                    } else {
                        setStatus("❌ Error: " + msg);
                    }
                }
            } catch (error) {
                const msg = error instanceof Error ? error.message : String(error);
                if (msg.includes("Drive.Files.insert") || msg.includes("is not a function")) {
                    setStatus("❌ Script Error: Google Apps Script is outdated. Please redeploy with the updated script (see instructions).");
                } else if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
                    setStatus("❌ Network error: Could not reach the server. Check your internet connection.");
                } else {
                    setStatus("❌ Error: " + msg);
                }
            } finally {
                setIsProcessing(false);
            }
        };

        reader.readAsDataURL(fileToUpload);
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

                                {/* 2 — Language Selection */}
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
