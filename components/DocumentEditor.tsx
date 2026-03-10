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

    /* ─── Handle File Uploads ─── */
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fileExtension = file.name.split(".").pop()?.toLowerCase();
        
        try {
            if (fileExtension === "docx") {
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.convertToHtml({ arrayBuffer });
                setEditorHtml(result.value);
            } else if (fileExtension === "md" || fileExtension === "txt") {
                const text = await file.text();
                
                // If markdown, ideally we use marked, but to keep dependencies light, 
                // we insert raw text into Quill and let user format.
                // Or if it contains HTML we can dangerously set it.
                if (fileExtension === "md") {
                    setEditorHtml(`<pre>${text}</pre>`);
                } else {
                    setEditorHtml(`<p>${text.replace(/\n/g, "<br/>")}</p>`);
                }
            } else {
                alert("Please upload a .docx, .md, or .txt file.");
            }
        } catch (err) {
            console.error("Error reading file:", err);
            alert("Error reading document.");
        }
        
        // Reset file input
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
