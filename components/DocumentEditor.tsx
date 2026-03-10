"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Need to dynamically import ReactQuill to avoid SSR "document is not defined" issues
const ReactQuill = dynamic(() => import("react-quill"), {
    ssr: false,
    loading: () => <div className="loader mx-auto mt-10" />,
});

// Import Mammoth explicitly for client side DOCX parsing
import * as mammoth from "mammoth";

// Dynamically import html2pdf
const html2pdf = async () => {
    const html2pdfModule = (await import("html2pdf.js")).default;
    return html2pdfModule;
};

export default function DocumentEditor() {
    const [editorHtml, setEditorHtml] = useState("");
    const [exportType, setExportType] = useState("pdf");
    const [isExporting, setIsExporting] = useState(false);
    const quillRef = useRef<any>(null);

    const [isProcessing, setIsProcessing] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    /* ─── Handle File Uploads ─── */
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
        
        setIsProcessing(true);
        setStatusMessage("Analyzing document...");

        try {
            // Load extra scripts dynamically if needed
            const loadScript = (src: string) => new Promise((resolve, reject) => {
                if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
                const s = document.createElement("script");
                s.src = src;
                s.onload = resolve;
                s.onerror = reject;
                document.head.appendChild(s);
            });

            if (fileExtension === "docx") {
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.convertToHtml({ arrayBuffer });
                setEditorHtml(result.value);
            } 
            else if (fileExtension === "txt" || fileExtension === "md") {
                const text = await file.text();
                if (fileExtension === "md") {
                    setEditorHtml(`<pre>${text}</pre>`);
                } else {
                    setEditorHtml(`<p>${text.replace(/\n/g, "<br/>")}</p>`);
                }
            } 
            else if (['png', 'jpg', 'jpeg'].includes(fileExtension)) {
                setStatusMessage("Running AI Optical Character Recognition on image...");
                await loadScript("https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js");
                const Tesseract = (window as any).Tesseract;
                const result = await Tesseract.recognize(file, 'eng');
                setEditorHtml(`<p>${result.data.text.replace(/\n/g, "<br/>")}</p>`);
            }
            else if (fileExtension === "pdf") {
                setStatusMessage("Loading PDF parsing engine...");
                let finalHtml = "";
                
                await loadScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js");
                const pdfjsLib = (window as any)['pdfjs-dist/build/pdf'];
                pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
                
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                
                for (let i = 1; i <= pdf.numPages; i++) {
                    setStatusMessage(`Scanning PDF page ${i} of ${pdf.numPages}...`);
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map((item: any) => item.str).join(" ");
                    
                    // If no native text layer exists, assumption: Scanned image/photo PDF -> Run OCR
                    if (pageText.trim().length < 50) {
                        setStatusMessage(`Page ${i} appears to be a scan. Running OCR engine (this may take a moment)...`);
                        await loadScript("https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js");
                        const Tesseract = (window as any).Tesseract;

                        const viewport = page.getViewport({ scale: 2.0 }); // High res scale for better OCR
                        const canvas = document.createElement("canvas");
                        const context = canvas.getContext("2d");
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        await page.render({ canvasContext: context, viewport: viewport }).promise;
                        
                        // Convert canvas to image and OCR it
                        const imgDataUrl = canvas.toDataURL("image/jpeg");
                        const result = await Tesseract.recognize(imgDataUrl, 'eng');
                        finalHtml += `<p><strong>[Page ${i} OCR Results]</strong><br/>${result.data.text.replace(/\n/g, "<br/>")}</p>`;
                    } else {
                        finalHtml += `<p>${pageText}</p>`;
                    }
                }
                setEditorHtml(finalHtml);
            } 
            else if (fileExtension === "pptx") {
                setStatusMessage("Extracting text contents from ZIP/PPTX archive...");
                await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js");
                const JSZip = (window as any).JSZip;
                
                const arrayBuffer = await file.arrayBuffer();
                const zip = await JSZip.loadAsync(arrayBuffer);
                
                let slidesHtml = "";
                const slideFiles = Object.keys(zip.files).filter(name => name.startsWith("ppt/slides/slide") && name.endsWith(".xml"));
                
                for (let i = 0; i < slideFiles.length; i++) {
                    const xml = await zip.files[slideFiles[i]].async("string");
                    const matches = xml.match(/<a:t.*?>(.*?)<\/a:t>/g) || [];
                    const slideText = matches.map((m: string) => m.replace(/<\/?([^>]+)>/g, "")).join(" ");
                    
                    if (slideText) {
                        slidesHtml += `<h3>Slide ${i + 1}</h3><p>${slideText}</p><br/>`;
                    }
                }
                setEditorHtml(slidesHtml || "<p>No text found in presentation.</p>");
            } 
            else {
                alert("Please upload a supported format (.docx, .txt, .pdf, .pptx, or images).");
            }
        } catch (err) {
            console.error("Error processing document:", err);
            alert("Error processing document. Ensure it's not password protected or corrupted.");
        }
        
        setIsProcessing(false);
        setStatusMessage("");
        e.target.value = "";
    };

    /* ─── Handle Exporting ─── */
    const downloadFile = async () => {
        if (!editorHtml) return alert("Nothing to export!");

        if (exportType === "pdf") {
            setIsExporting(true);
            try {
                // Get the raw editor DOM element
                const element = document.querySelector(".ql-editor");
                if (element) {
                    const engine = await html2pdf();
                    const opt = {
                        margin: 10,
                        filename: 'tecsub_document.pdf',
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: { scale: 2 },
                        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                    };
                    await engine().set(opt).from(element).save();
                }
            } catch (err) {
                console.error("PDF Export error", err);
            }
            setIsExporting(false);
        } else if (exportType === "txt") {
            // Strip HTML to get plain text
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = editorHtml;
            const plainText = tempDiv.textContent || tempDiv.innerText || "";
            
            const blob = new Blob([plainText], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "tecsub_document.txt";
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    return (
        <div className="editor-interface max-w-5xl mx-auto w-full flex flex-col items-center">
            {/* ─── Toolbar ─── */}
            <div className="w-full bg-[#2c3e50] text-white p-4 rounded-t-xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg mt-6">
                
                {/* Upload Button */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <label className="bg-[#34495e] hover:bg-[#46627f] cursor-pointer px-4 py-2 rounded-lg font-medium transition-colors border border-[rgba(255,255,255,0.1)] flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                            <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" />
                        </svg>
                        Upload Doc
                        <input 
                            type="file" 
                            className="hidden" 
                            accept=".docx, .md, .txt" 
                            onChange={handleFileUpload} 
                        />
                    </label>
                    <span className="text-xs text-gray-400">Supports .docx, .md, .txt</span>
                </div>

                {/* Export Config */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select 
                        className="bg-[#34495e] text-white px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.1)] outline-none"
                        value={exportType}
                        onChange={(e) => setExportType(e.target.value)}
                    >
                        <option value="pdf">Export as PDF</option>
                        <option value="txt">Export as Text</option>
                    </select>
                    
                    <button 
                        onClick={downloadFile} 
                        disabled={isExporting}
                        className={`bg-[#27ae60] hover:bg-[#219150] text-white px-5 py-2 rounded-lg font-medium transition-colors whitespace-nowrap \${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isExporting ? 'Exporting...' : 'Download'}
                    </button>
                </div>
            </div>

            {/* Action Area for Status */}
            {statusMessage && (
                <div className="w-full bg-[#1abc9c] text-[#fff] p-3 text-center font-bold text-sm shadow-md flex items-center justify-center gap-3">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {statusMessage}
                </div>
            )}

            {/* ─── Quill Editor Container ─── */}
            <div className="w-full bg-white rounded-b-xl shadow-lg border-x border-b border-gray-200" style={{ height: "65vh" }}>
                <ReactQuill 
                    ref={quillRef}
                    theme="snow" 
                    value={editorHtml}
                    onChange={setEditorHtml}
                    className="h-full pb-[42px]" // Offset Quill's inner height quirks
                    modules={{
                        toolbar: [
                            [{ 'header': [1, 2, 3, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                            ['link', 'image', 'code-block'],
                            ['clean']
                        ]
                    }}
                />
            </div>
        </div>
    );
}
