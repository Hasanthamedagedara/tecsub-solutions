"use client";

import { useState } from "react";
import * as mammoth from "mammoth";

// Dynamically import html2pdf
const html2pdf = async () => {
    const html2pdfModule = (await import("html2pdf.js")).default;
    return html2pdfModule;
};

export default function TranslatorTool() {
    const [gasUrl, setGasUrl] = useState("");
    const [targetLang, setTargetLang] = useState("si");
    const [status, setStatus] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);

    const languages = [
        { code: "si", label: "Sinhala" },
        { code: "ta", label: "Tamil" },
        { code: "hi", label: "Hindi" },
        { code: "en", label: "English" },
        { code: "es", label: "Spanish" },
        { code: "fr", label: "French" },
        { code: "de", label: "German" },
        { code: "ja", label: "Japanese" }
    ];

    /* ─── Chunking Helper Functions ─── */
    // Split text into ~1900 char chunks ensuring we don't cut words in half
    const chunkText = (text: string, maxLength = 1900): string[] => {
        const chunks: string[] = [];
        let index = 0;

        while (index < text.length) {
            let endIndex = Math.min(index + maxLength, text.length);

            // If we are not at the end, find the nearest space to slice at cleanly
            if (endIndex < text.length) {
                const searchStr = text.substring(index, endIndex);
                const lastSpace = searchStr.lastIndexOf(" ");
                if (lastSpace > 0) {
                    endIndex = index + lastSpace;
                }
            }
            chunks.push(text.substring(index, endIndex));
            index = endIndex;
        }
        return chunks;
    };

    /* ─── Main Translation Logic ─── */
    const translateAndDownload = async () => {
        if (!fileToUpload) return alert("Please select a file first!");
        if (!gasUrl.trim() || !gasUrl.includes("script.google.com")) {
            return alert("Please enter a valid Google Apps Script Web App URL.");
        }

        setIsProcessing(true);
        setStatus("Extracting raw text from file...");

        try {
            let originalText = "";
            const fileExtension = fileToUpload.name.split(".").pop()?.toLowerCase();

            // Load extra scripts dynamically if needed
            const loadScript = (src: string) => new Promise((resolve, reject) => {
                if (document.querySelector(`script[src="\${src}"]`)) return resolve(true);
                const s = document.createElement("script");
                s.src = src;
                s.onload = resolve;
                s.onerror = reject;
                document.head.appendChild(s);
            });

            // 1. Extract
            if (fileExtension === "docx") {
                const arrayBuffer = await fileToUpload.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                originalText = result.value;
            } else if (fileExtension === "txt" || fileExtension === "md") {
                originalText = await fileToUpload.text();
            } else if (fileExtension === "pdf") {
                setStatus("Loading PDF engine...");
                await loadScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js");
                const pdfjsLib = (window as any)['pdfjs-dist/build/pdf'];
                pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

                const arrayBuffer = await fileToUpload.arrayBuffer();
                const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map((item: any) => item.str).join(" ");
                    originalText += pageText + "\n\n";
                }
            } else if (fileExtension === "pptx") {
                setStatus("Extracting slides from presentation...");
                await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js");
                const JSZip = (window as any).JSZip;

                const arrayBuffer = await fileToUpload.arrayBuffer();
                const zip = await JSZip.loadAsync(arrayBuffer);

                // Read slide URLs
                const slideFiles = Object.keys(zip.files).filter(name => name.startsWith("ppt/slides/slide") && name.endsWith(".xml"));
                for (const fileName of slideFiles) {
                    const xml = await zip.files[fileName].async("string");
                    // Regex strip to retrieve just presentation text strings inside <a:t>
                    const matches = xml.match(/<a:t.*?>(.*?)<\/a:t>/g) || [];
                    const slideText = matches.map(m => m.replace(/<\/?[^>]+(>|$)/g, "")).join(" ");
                    if (slideText) originalText += slideText + "\n\n";
                }
            } else {
                setStatus("Error: Only .docx, .md, .txt, .pdf, or .pptx files are supported.");
                setIsProcessing(false);
                return;
            }

            if (!originalText.trim()) {
                setStatus("File appears to be empty.");
                setIsProcessing(false);
                return;
            }

            // 2. Chunk & Translate
            const chunks = chunkText(originalText);
            let fullTranslatedText = "";

            for (let i = 0; i < chunks.length; i++) {
                setStatus(`Translating chunk \${i + 1} of \${chunks.length}... (Please wait)`);

                try {
                    // Send chunk to Google Script API securely via GET
                    const response = await fetch(`\${gasUrl}?target=\${targetLang}&text=\${encodeURIComponent(chunks[i])}`);

                    if (!response.ok) throw new Error("API Limit or Error");

                    const translatedChunk = await response.text();
                    fullTranslatedText += translatedChunk + "\n\n";

                    // Small delay to prevent hammering rate limits
                    await new Promise(res => setTimeout(res, 500));
                } catch (apiErr) {
                    setStatus(`Error translating chunk \${i + 1}. Check your Apps Script URL constraints.`);
                    setIsProcessing(false);
                    return;
                }
            }

            // 3. Render and Export PDF
            setStatus("Generating your Translated PDF...");

            // Create a temporary hidden div
            const element = document.createElement("div");
            element.style.padding = "40px";
            element.style.fontFamily = "Arial, sans-serif";
            element.style.color = "#000";
            element.style.fontSize = "16px";
            element.style.whiteSpace = "pre-wrap"; // Preserves line breaks automatically
            element.innerText = fullTranslatedText;

            const engine = await html2pdf();
            const opt = {
                margin: 10,
                filename: `Translated_\${targetLang.toUpperCase()}_\${fileToUpload.name}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            await engine().set(opt).from(element).save();

            setStatus("Success! File Downloaded.");

        } catch (err) {
            console.error(err);
            setStatus("An unknown error occurred during processing.");
        }

        setIsProcessing(false);
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-6 bg-[#2c3e50] rounded-xl shadow-lg border border-[rgba(255,255,255,0.05)] overflow-hidden">
            <div className="p-6 md:p-8 flex flex-col gap-6">

                {/* 1. File Upload */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-300">1. Upload Document (DOCX, TXT, PDF, PPTX)</label>
                    <div className="relative border-2 border-dashed border-[#46627f] rounded-lg p-6 bg-[#34495e] flex flex-col items-center justify-center text-center transition-colors hover:border-[#1abc9c]">
                        <input
                            type="file"
                            accept=".docx, .txt, .md, .pdf, .pptx"
                            onChange={(e) => setFileToUpload(e.target.files?.[0] || null)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="#aaa" className="mb-2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h6v6h6v10H6z" />
                        </svg>
                        <span className="text-white font-medium">
                            {fileToUpload ? fileToUpload.name : "Click or drag a file to upload"}
                        </span>
                    </div>
                </div>

                {/* 2. Language & GAS API Config */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-300">2. Target Language</label>
                        <select
                            value={targetLang}
                            onChange={(e) => setTargetLang(e.target.value)}
                            className="bg-[#34495e] text-white px-4 py-3 rounded-lg border border-[#46627f] outline-none hover:border-[#aaa]"
                        >
                            {languages.map(lang => (
                                <option key={lang.code} value={lang.code}>{lang.label} ({lang.code})</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-300">
                            3. Google Script Web App URL
                            <span className="text-xs text-gray-400 font-normal ml-2">(Required)</span>
                        </label>
                        <input
                            type="text"
                            value={gasUrl}
                            onChange={(e) => setGasUrl(e.target.value)}
                            placeholder="https://script.google.com/macros/s/..."
                            className="bg-[#34495e] text-white px-4 py-3 rounded-lg border border-[#46627f] outline-none text-sm placeholder-gray-500 hover:border-[#aaa] focus:border-[#1abc9c]"
                        />
                    </div>
                </div>

                {/* Action Area */}
                <div className="mt-4 pt-4 border-t border-[#46627f] flex flex-col gap-4">
                    <button
                        onClick={translateAndDownload}
                        disabled={isProcessing}
                        className={`w-full py-4 rounded-lg font-bold text-lg text-white transition-all shadow-md \${isProcessing ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#27ae60] hover:bg-[#219150] shadow-green-900/40'}`}
                    >
                        {isProcessing ? "Processing..." : "Translate & Download PDF"}
                    </button>

                    {status && (
                        <div className={`text-center font-medium p-3 rounded-md \${status.includes('Error') ? 'bg-red-900/50 text-red-200' : 'bg-blue-900/30 text-blue-300'}`}>
                            {status}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
