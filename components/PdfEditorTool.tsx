"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PDFDocument, StandardFonts } from "pdf-lib";

/* ═══════════════════════════════════════════════════
   PDF EDITOR TOOL — Merge · Split · Compress · Edit
   ═══════════════════════════════════════════════════ */

type Tab = "merge" | "split" | "compress" | "edit";

const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: "merge", label: "Merge PDFs", icon: "📑" },
    { key: "split", label: "Split PDF", icon: "✂️" },
    { key: "compress", label: "Compress", icon: "📦" },
    { key: "edit", label: "Edit Text", icon: "✏️" },
];

/* ─── Shared Drop Zone ─── */
function DropZone({
    multiple,
    files,
    onFiles,
    hint,
}: {
    multiple?: boolean;
    files: File[];
    onFiles: (f: File[]) => void;
    hint?: string;
}) {
    const [isDrag, setIsDrag] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDrag(false);
            const dropped = Array.from(e.dataTransfer.files).filter((f) => f.type === "application/pdf");
            if (dropped.length) onFiles(multiple ? [...files, ...dropped] : [dropped[0]]);
        },
        [files, multiple, onFiles]
    );

    return (
        <div
            onDragOver={(e) => {
                e.preventDefault();
                setIsDrag(true);
            }}
            onDragLeave={() => setIsDrag(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className="relative rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer"
            style={{
                border: `2px dashed ${isDrag ? "#00E5FF" : "rgba(255,255,255,0.12)"}`,
                background: isDrag ? "rgba(0,229,255,0.06)" : "rgba(255,255,255,0.03)",
                boxShadow: isDrag ? "inset 0 0 30px rgba(0,229,255,0.08)" : "none",
            }}
        >
            <input
                ref={inputRef}
                type="file"
                accept=".pdf"
                multiple={multiple}
                className="hidden"
                onChange={(e) => {
                    const picked = Array.from(e.target.files || []);
                    if (picked.length) onFiles(multiple ? [...files, ...picked] : [picked[0]]);
                    e.target.value = "";
                }}
            />
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 opacity-60">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span className="text-white font-medium text-sm">
                {files.length > 0
                    ? files.map((f) => f.name).join(", ")
                    : hint || "Click or drag PDF files here"}
            </span>
            {files.length > 0 && (
                <span className="text-xs text-gray-500 mt-1">
                    {files.length} file{files.length > 1 ? "s" : ""} · {(files.reduce((a, f) => a + f.size, 0) / 1024).toFixed(1)} KB
                </span>
            )}
        </div>
    );
}

/* ─── Action Button ─── */
function ActionBtn({ onClick, disabled, label, processing }: { onClick: () => void; disabled?: boolean; label: string; processing?: boolean }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled || processing}
            className="w-full py-4 rounded-xl font-bold text-base text-white transition-all duration-300"
            style={{
                background: disabled || processing ? "rgba(100,100,120,0.4)" : "linear-gradient(135deg, #00E5FF, #0072BC)",
                boxShadow: disabled || processing ? "none" : "0 4px 20px rgba(0,229,255,0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
                cursor: disabled || processing ? "not-allowed" : "pointer",
            }}
        >
            {processing ? "⏳ Processing..." : label}
        </button>
    );
}

/* ─── Status Message ─── */
function StatusMsg({ msg }: { msg: string }) {
    if (!msg) return null;
    const isErr = msg.toLowerCase().includes("error");
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center font-medium p-3 rounded-lg text-sm"
            style={{
                background: isErr ? "rgba(231,76,60,0.15)" : "rgba(0,229,255,0.1)",
                color: isErr ? "#e74c3c" : "#00E5FF",
            }}
        >
            {msg}
        </motion.div>
    );
}

/* ─── Progress Bar ─── */
function ProgressBar({ value }: { value: number }) {
    if (value <= 0) return null;
    return (
        <div className="w-full rounded-full overflow-hidden h-2" style={{ background: "rgba(255,255,255,0.06)" }}>
            <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #00E5FF, #0072BC)", boxShadow: "0 0 12px rgba(0,229,255,0.5)" }}
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 0.4 }}
            />
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   MERGE TAB
   ═══════════════════════════════════════════════════ */
function MergeTab() {
    const [files, setFiles] = useState<File[]>([]);
    const [processing, setProcessing] = useState(false);
    const [status, setStatus] = useState("");
    const [progress, setProgress] = useState(0);

    const merge = async () => {
        if (files.length < 2) return setStatus("Please upload at least 2 PDF files.");
        setProcessing(true);
        setProgress(10);
        setStatus("Merging PDFs...");
        try {
            const mergedPdf = await PDFDocument.create();
            for (let i = 0; i < files.length; i++) {
                setProgress(10 + Math.round((i / files.length) * 70));
                const bytes = await files[i].arrayBuffer();
                const srcPdf = await PDFDocument.load(bytes);
                const pages = await mergedPdf.copyPages(srcPdf, srcPdf.getPageIndices());
                pages.forEach((page) => mergedPdf.addPage(page));
            }
            setProgress(90);
            const mergedBytes = await mergedPdf.save();
            const blob = new Blob([mergedBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Merged_PDF.pdf";
            a.click();
            URL.revokeObjectURL(url);
            setProgress(100);
            setStatus("✅ PDFs merged successfully! Download started.");
        } catch {
            setStatus("Error: Could not merge PDFs. Make sure all files are valid.");
        }
        setProcessing(false);
    };

    const removeFile = (index: number) => setFiles(files.filter((_, i) => i !== index));

    return (
        <div className="flex flex-col gap-5">
            <DropZone multiple files={files} onFiles={setFiles} hint="Drop or select multiple PDF files to merge" />

            {files.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                        📄 Files to merge ({files.length}):
                    </p>
                    {files.map((f, i) => (
                        <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg text-xs" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                            <span style={{ color: "var(--text-primary)" }}>
                                {i + 1}. {f.name} <span className="text-gray-500">({(f.size / 1024).toFixed(1)} KB)</span>
                            </span>
                            <button onClick={() => removeFile(i)} className="text-red-400 hover:text-red-300 transition-colors px-2">✕</button>
                        </div>
                    ))}
                </div>
            )}

            <ProgressBar value={progress} />
            <ActionBtn onClick={merge} disabled={files.length < 2} label={`📑 Merge ${files.length} PDFs`} processing={processing} />
            <StatusMsg msg={status} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   SPLIT TAB
   ═══════════════════════════════════════════════════ */
function SplitTab() {
    const [files, setFiles] = useState<File[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [rangeInput, setRangeInput] = useState("");
    const [processing, setProcessing] = useState(false);
    const [status, setStatus] = useState("");
    const [progress, setProgress] = useState(0);

    const loadFile = async (newFiles: File[]) => {
        setFiles(newFiles);
        setStatus("");
        setRangeInput("");
        if (newFiles.length > 0) {
            try {
                const bytes = await newFiles[0].arrayBuffer();
                const pdf = await PDFDocument.load(bytes);
                const count = pdf.getPageCount();
                setTotalPages(count);
                setRangeInput(`1-${count}`);
                setStatus(`PDF loaded: ${count} pages detected.`);
            } catch {
                setStatus("Error: Could not read PDF.");
                setTotalPages(0);
            }
        }
    };

    const parseRanges = (input: string, max: number): number[][] => {
        return input
            .split(",")
            .map((part) => part.trim())
            .filter(Boolean)
            .map((part) => {
                if (part.includes("-")) {
                    const [s, e] = part.split("-").map(Number);
                    return [Math.max(1, s), Math.min(max, e)];
                }
                const n = Number(part);
                return [n, n];
            })
            .filter(([s, e]) => s >= 1 && e >= s && s <= max);
    };

    const split = async () => {
        if (!files[0]) return;
        const ranges = parseRanges(rangeInput, totalPages);
        if (ranges.length === 0) return setStatus("Error: Invalid page range. Use format like 1-3, 5, 7-10");

        setProcessing(true);
        setProgress(10);
        setStatus("Splitting PDF...");
        try {
            const bytes = await files[0].arrayBuffer();
            const srcPdf = await PDFDocument.load(bytes);

            for (let r = 0; r < ranges.length; r++) {
                const [start, end] = ranges[r];
                setProgress(10 + Math.round((r / ranges.length) * 70));
                const newPdf = await PDFDocument.create();
                const indices = [];
                for (let p = start - 1; p < end; p++) indices.push(p);
                const pages = await newPdf.copyPages(srcPdf, indices);
                pages.forEach((page) => newPdf.addPage(page));
                const newBytes = await newPdf.save();
                const blob = new Blob([newBytes], { type: "application/pdf" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `Split_pages_${start}-${end}.pdf`;
                a.click();
                URL.revokeObjectURL(url);
            }
            setProgress(100);
            setStatus(`✅ Split into ${ranges.length} file${ranges.length > 1 ? "s" : ""}! Downloads started.`);
        } catch {
            setStatus("Error: Could not split PDF.");
        }
        setProcessing(false);
    };

    return (
        <div className="flex flex-col gap-5">
            <DropZone files={files} onFiles={loadFile} hint="Drop or select a PDF to split" />

            {totalPages > 0 && (
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
                        Page Range ({totalPages} pages total)
                    </label>
                    <input
                        type="text"
                        value={rangeInput}
                        onChange={(e) => setRangeInput(e.target.value)}
                        placeholder="e.g. 1-3, 5, 7-10"
                        className="px-4 py-3 rounded-lg outline-none text-sm transition-colors placeholder-gray-600"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e0e0e0" }}
                    />
                    <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
                        Separate ranges with commas. Each range becomes a separate PDF file.
                    </p>
                </div>
            )}

            <ProgressBar value={progress} />
            <ActionBtn onClick={split} disabled={!files[0] || !rangeInput} label="✂️ Split PDF" processing={processing} />
            <StatusMsg msg={status} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   COMPRESS TAB
   ═══════════════════════════════════════════════════ */
function CompressTab() {
    const [files, setFiles] = useState<File[]>([]);
    const [processing, setProcessing] = useState(false);
    const [status, setStatus] = useState("");
    const [progress, setProgress] = useState(0);
    const [sizes, setSizes] = useState({ original: 0, compressed: 0 });

    const compress = async () => {
        if (!files[0]) return;
        setProcessing(true);
        setProgress(20);
        setStatus("Compressing PDF...");
        const originalSize = files[0].size;
        try {
            const bytes = await files[0].arrayBuffer();
            setProgress(40);
            const pdf = await PDFDocument.load(bytes);

            // Strip metadata to reduce size
            pdf.setTitle("");
            pdf.setAuthor("");
            pdf.setSubject("");
            pdf.setKeywords([]);
            pdf.setProducer("");
            pdf.setCreator("");

            setProgress(70);
            const compressedBytes = await pdf.save({
                useObjectStreams: true,
                addDefaultPage: false,
            });

            setProgress(90);
            const compressedSize = compressedBytes.length;
            setSizes({ original: originalSize, compressed: compressedSize });

            const blob = new Blob([compressedBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Compressed_${files[0].name}`;
            a.click();
            URL.revokeObjectURL(url);
            setProgress(100);

            const saved = ((1 - compressedSize / originalSize) * 100);
            if (saved > 0) {
                setStatus(`✅ Compressed! Saved ${saved.toFixed(1)}% (${(originalSize / 1024).toFixed(1)} KB → ${(compressedSize / 1024).toFixed(1)} KB)`);
            } else {
                setStatus(`✅ PDF optimized! File was already well-compressed. Size: ${(compressedSize / 1024).toFixed(1)} KB`);
            }
        } catch {
            setStatus("Error: Could not compress PDF.");
        }
        setProcessing(false);
    };

    return (
        <div className="flex flex-col gap-5">
            <DropZone files={files} onFiles={setFiles} hint="Drop or select a PDF to compress" />

            {sizes.original > 0 && (
                <div className="flex justify-between text-xs px-1" style={{ color: "var(--text-secondary)" }}>
                    <span>Original: {(sizes.original / 1024).toFixed(1)} KB</span>
                    <span>Compressed: {(sizes.compressed / 1024).toFixed(1)} KB</span>
                    {sizes.compressed < sizes.original && (
                        <span className="text-green-400 font-semibold">
                            -{((1 - sizes.compressed / sizes.original) * 100).toFixed(0)}%
                        </span>
                    )}
                </div>
            )}

            <ProgressBar value={progress} />
            <ActionBtn onClick={compress} disabled={!files[0]} label="📦 Compress PDF" processing={processing} />
            <StatusMsg msg={status} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   EDIT TEXT TAB
   ═══════════════════════════════════════════════════ */
function EditTextTab() {
    const [files, setFiles] = useState<File[]>([]);
    const [processing, setProcessing] = useState(false);
    const [status, setStatus] = useState("");
    const [progress, setProgress] = useState(0);
    const [annotations, setAnnotations] = useState<{ text: string; x: number; y: number; page: number; size: number }[]>([]);
    const [newText, setNewText] = useState("");
    const [pageNum, setPageNum] = useState(1);
    const [posX, setPosX] = useState(50);
    const [posY, setPosY] = useState(700);
    const [fontSize, setFontSize] = useState(14);
    const [totalPages, setTotalPages] = useState(0);

    const loadFile = async (newFiles: File[]) => {
        setFiles(newFiles);
        setAnnotations([]);
        setStatus("");
        if (newFiles.length > 0) {
            try {
                const bytes = await newFiles[0].arrayBuffer();
                const pdf = await PDFDocument.load(bytes);
                const count = pdf.getPageCount();
                setTotalPages(count);
                setStatus(`PDF loaded: ${count} page${count > 1 ? "s" : ""}. Add text annotations below.`);
            } catch {
                setStatus("Error: Could not read PDF.");
                setTotalPages(0);
            }
        }
    };

    const addAnnotation = () => {
        if (!newText.trim()) return;
        setAnnotations([...annotations, { text: newText, x: posX, y: posY, page: pageNum, size: fontSize }]);
        setNewText("");
        setStatus(`Added "${newText}" to page ${pageNum}.`);
    };

    const removeAnnotation = (index: number) => setAnnotations(annotations.filter((_, i) => i !== index));

    const exportPdf = async () => {
        if (!files[0] || annotations.length === 0) return setStatus("Error: Add at least one text annotation first.");
        setProcessing(true);
        setProgress(20);
        setStatus("Adding text to PDF...");
        try {
            const bytes = await files[0].arrayBuffer();
            const pdf = await PDFDocument.load(bytes);
            const font = await pdf.embedFont(StandardFonts.Helvetica);

            setProgress(50);
            for (const ann of annotations) {
                const pageIndex = Math.max(0, Math.min(ann.page - 1, pdf.getPageCount() - 1));
                const page = pdf.getPage(pageIndex);
                page.drawText(ann.text, {
                    x: ann.x,
                    y: ann.y,
                    size: ann.size,
                    font,
                });
            }

            setProgress(80);
            const editedBytes = await pdf.save();
            const blob = new Blob([editedBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Edited_${files[0].name}`;
            a.click();
            URL.revokeObjectURL(url);
            setProgress(100);
            setStatus("✅ PDF exported with text annotations! Download started.");
        } catch (err) {
            console.error(err);
            setStatus("Error: Could not edit PDF.");
        }
        setProcessing(false);
    };

    return (
        <div className="flex flex-col gap-5">
            <DropZone files={files} onFiles={loadFile} hint="Drop or select a PDF to edit" />

            {totalPages > 0 && (
                <>
                    {/* Text Input Area */}
                    <div className="flex flex-col gap-3 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <p className="text-xs font-semibold" style={{ color: "#00E5FF" }}>✏️ Add Text Annotation</p>
                        <input
                            type="text"
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                            placeholder="Type text to add..."
                            className="px-4 py-3 rounded-lg outline-none text-sm placeholder-gray-600"
                            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e0e0e0" }}
                        />
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px]" style={{ color: "var(--text-secondary)" }}>Page</label>
                                <input type="number" min={1} max={totalPages} value={pageNum} onChange={(e) => setPageNum(+e.target.value)}
                                    className="px-3 py-2 rounded-lg outline-none text-xs text-center"
                                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e0e0e0" }}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px]" style={{ color: "var(--text-secondary)" }}>X Position</label>
                                <input type="number" min={0} max={600} value={posX} onChange={(e) => setPosX(+e.target.value)}
                                    className="px-3 py-2 rounded-lg outline-none text-xs text-center"
                                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e0e0e0" }}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px]" style={{ color: "var(--text-secondary)" }}>Y Position</label>
                                <input type="number" min={0} max={850} value={posY} onChange={(e) => setPosY(+e.target.value)}
                                    className="px-3 py-2 rounded-lg outline-none text-xs text-center"
                                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e0e0e0" }}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px]" style={{ color: "var(--text-secondary)" }}>Font Size</label>
                                <input type="number" min={6} max={72} value={fontSize} onChange={(e) => setFontSize(+e.target.value)}
                                    className="px-3 py-2 rounded-lg outline-none text-xs text-center"
                                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#e0e0e0" }}
                                />
                            </div>
                        </div>
                        <button
                            onClick={addAnnotation}
                            disabled={!newText.trim()}
                            className="py-2.5 rounded-lg font-semibold text-sm transition-all"
                            style={{
                                background: newText.trim() ? "rgba(0,229,255,0.15)" : "rgba(100,100,120,0.2)",
                                color: newText.trim() ? "#00E5FF" : "#666",
                                border: "1px solid rgba(0,229,255,0.2)",
                            }}
                        >
                            + Add Text
                        </button>
                    </div>

                    {/* Annotations List */}
                    {annotations.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                                📝 Text Annotations ({annotations.length}):
                            </p>
                            {annotations.map((ann, i) => (
                                <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg text-xs" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                    <span style={{ color: "var(--text-primary)" }}>
                                        &quot;{ann.text}&quot;{" "}
                                        <span className="text-gray-500">
                                            — Page {ann.page}, ({ann.x}, {ann.y}), {ann.size}px
                                        </span>
                                    </span>
                                    <button onClick={() => removeAnnotation(i)} className="text-red-400 hover:text-red-300 transition-colors px-2">✕</button>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            <ProgressBar value={progress} />
            <ActionBtn onClick={exportPdf} disabled={!files[0] || annotations.length === 0} label="📥 Export Edited PDF" processing={processing} />
            <StatusMsg msg={status} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export default function PdfEditorTool() {
    const [activeTab, setActiveTab] = useState<Tab>("merge");

    return (
        <div className="w-full flex flex-col gap-5">
            {/* Tab Bar */}
            <div
                className="flex rounded-xl p-1 gap-1"
                style={{ background: "rgba(255,255,255,0.04)" }}
            >
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className="relative flex-1 py-2.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-300"
                        style={{
                            color: activeTab === tab.key ? "#fff" : "#8899aa",
                            background:
                                activeTab === tab.key
                                    ? "linear-gradient(135deg, rgba(0,229,255,0.25), rgba(0,114,188,0.2))"
                                    : "transparent",
                            boxShadow:
                                activeTab === tab.key
                                    ? "0 0 20px rgba(0,229,255,0.1), inset 0 1px 0 rgba(255,255,255,0.08)"
                                    : "none",
                        }}
                    >
                        <span className="mr-1">{tab.icon}</span> {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === "merge" && <MergeTab />}
                    {activeTab === "split" && <SplitTab />}
                    {activeTab === "compress" && <CompressTab />}
                    {activeTab === "edit" && <EditTextTab />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
