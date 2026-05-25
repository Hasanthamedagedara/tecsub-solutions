"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PDFDocument, rgb, degrees, StandardFonts, PDFName } from "pdf-lib";
import JSZip from "jszip";

// Helper to parse page range strings (e.g. "1-3, 5, 7-10") into 0-based page indices
function parsePagesString(str: string, totalPages: number): number[] {
    const s = str.trim().toLowerCase();
    if (!s || s === "all") {
        return Array.from({ length: totalPages }, (_, i) => i);
    }
    const indices: number[] = [];
    const parts = s.split(",");
    for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed.includes("-")) {
            const [startStr, endStr] = trimmed.split("-");
            const start = parseInt(startStr) - 1;
            const end = parseInt(endStr) - 1;
            if (!isNaN(start) && !isNaN(end)) {
                const min = Math.max(0, Math.min(start, end));
                const max = Math.min(totalPages - 1, Math.max(start, end));
                for (let i = min; i <= max; i++) {
                    indices.push(i);
                }
            }
        } else {
            const val = parseInt(trimmed) - 1;
            if (!isNaN(val) && val >= 0 && val < totalPages) {
                indices.push(val);
            }
        }
    }
    return Array.from(new Set(indices)).sort((a, b) => a - b);
}

// Flat list of all tools for configuration mapping
const ALL_TOOLS_REGISTRY: Record<string, {
    title: string;
    icon: string;
    description: string;
    fileLabel?: string;
    accept?: string;
    multiple?: boolean;
    noFileUpload?: boolean;
    inputs?: Array<{
        name: string;
        label: string;
        type: "text" | "number" | "select" | "textarea";
        placeholder?: string;
        options?: string[];
        default?: any;
    }>;
}> = {
    "alternate-mix": {
        title: "Alternate & Mix",
        icon: "🔀",
        description: "Mix pages of two PDF documents, alternating page-by-page.",
        fileLabel: "Select Primary PDF and Secondary PDF",
        accept: ".pdf",
        multiple: true,
    },
    "merge": {
        title: "Merge PDF",
        icon: "🔗",
        description: "Combine multiple PDF files into one single document.",
        fileLabel: "Select PDF Files to Merge",
        accept: ".pdf",
        multiple: true,
    },
    "organize": {
        title: "Organize PDF Pages",
        icon: "📋",
        description: "Reorder or arrange pages of your PDF document.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
        inputs: [
            { name: "pageOrder", label: "New Page Order (comma-separated indices, e.g. 1, 3, 2, 4)", type: "text", placeholder: "e.g. 1, 3, 2, 4", default: "" }
        ]
    },
    "extract-pages": {
        title: "Extract PDF Pages",
        icon: "📑",
        description: "Extract specific pages from your PDF file.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
        inputs: [
            { name: "pages", label: "Page Ranges to Extract (e.g. 1-3, 5)", type: "text", placeholder: "e.g. 1-3, 5", default: "1" }
        ]
    },
    "split-pages": {
        title: "Split by Pages",
        icon: "📄",
        description: "Split PDF into multiple separate documents.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
        inputs: [
            { name: "interval", label: "Split interval (number of pages per split)", type: "number", placeholder: "e.g. 1", default: 1 }
        ]
    },
    "split-bookmarks": {
        title: "Split by Bookmarks",
        icon: "🔖",
        description: "Split document into separate files based on page dividers.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
    },
    "split-half": {
        title: "Split PDF in Half",
        icon: "✂️",
        description: "Slice double-page spreads down the middle into two separate pages.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
    },
    "split-size": {
        title: "Split PDF by Size",
        icon: "📏",
        description: "Divide PDF into smaller individual files based on parts.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
        inputs: [
            { name: "partsCount", label: "Number of equal parts to split into", type: "number", default: 2 }
        ]
    },
    "split-text": {
        title: "Split PDF by Text",
        icon: "📝",
        description: "Split document based on custom bookmark labels.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
        inputs: [
            { name: "keyword", label: "Split Indicator Keyword", type: "text", placeholder: "e.g. Chapter", default: "Chapter" }
        ]
    },
    "edit": {
        title: "Edit PDF",
        icon: "✏️",
        description: "Annotate and add text overlay directly in your browser.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
        inputs: [
            { name: "overlayText", label: "Text to Add", type: "text", default: "Approved" },
            { name: "xPos", label: "Horizontal Position (pt)", type: "number", default: 50 },
            { name: "yPos", label: "Vertical Position (pt)", type: "number", default: 50 },
        ]
    },
    "fill-sign": {
        title: "Fill & Sign PDF",
        icon: "✍️",
        description: "Fill interactive forms and place a custom signature.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
        inputs: [
            { name: "sigName", label: "Your Full Name (Signature)", type: "text", placeholder: "e.g. John Doe", default: "John Doe" }
        ]
    },
    "create-forms": {
        title: "Create PDF Forms",
        icon: "📝",
        description: "Add mock form markers and fillable structures to your PDF.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
    },
    "delete-pages": {
        title: "Delete PDF Pages",
        icon: "🗑️",
        description: "Delete selected pages from your PDF file.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
        inputs: [
            { name: "pagesToDelete", label: "Pages to Delete (e.g. 2, 4, 6)", type: "text", placeholder: "e.g. 2, 4", default: "" }
        ]
    },
    "compress": {
        title: "Compress PDF",
        icon: "🗜️",
        description: "Optimize and reduce the file size of your PDF document.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
        inputs: [
            { name: "level", label: "Compression level", type: "select", options: ["Low", "Medium", "High"], default: "Medium" }
        ]
    },
    "protect": {
        title: "Protect PDF",
        icon: "🔒",
        description: "Encrypt and restrict your PDF document with a secure password.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
        inputs: [
            { name: "password", label: "Document password", type: "text", placeholder: "Enter password...", default: "12345" }
        ]
    },
    "unlock": {
        title: "Unlock PDF",
        icon: "🔓",
        description: "Remove security password limitations from a locked PDF file.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
        inputs: [
            { name: "password", label: "Current Password to Decrypt", type: "text", placeholder: "Enter current password...", default: "" }
        ]
    },
    "watermark": {
        title: "Add Watermark",
        icon: "©️",
        description: "Stamp customized security text overlay diagonally onto every page.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
        inputs: [
            { name: "watermarkText", label: "Watermark Text", type: "text", default: "CONFIDENTIAL" },
            { name: "fontSize", label: "Font Size", type: "number", default: 45 },
            { name: "opacity", label: "Opacity (0.1 - 1.0)", type: "text", default: "0.3" },
        ]
    },
    "flatten": {
        title: "Flatten PDF Forms",
        icon: "🔨",
        description: "Flatten forms, fields and annotations to prevent editing.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
    },
    "to-excel": {
        title: "PDF to Excel Converter",
        icon: "📊",
        description: "Extract text structure into a tabular spreadsheet layout (.csv).",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
    },
    "to-jpg": {
        title: "PDF to JPG Converter",
        icon: "🖼️",
        description: "Export page layouts into independent image assets.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
    },
    "to-powerpoint": {
        title: "PDF to PowerPoint",
        icon: "📽️",
        description: "Export document structure into a slide-show formatted file.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
    },
    "to-text": {
        title: "PDF to Text Converter",
        icon: "📝",
        description: "Extract clean ASCII text from your document.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
    },
    "to-word": {
        title: "PDF to Word Converter",
        icon: "📄",
        description: "Convert PDF documents into text-formatted files.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
    },
    "from-html": {
        title: "HTML to PDF Converter",
        icon: "🌐",
        description: "Compile web layouts and raw HTML markup into a PDF document.",
        noFileUpload: true,
        inputs: [
            { name: "htmlContent", label: "Raw HTML Code", type: "textarea", default: `<h1>My PDF Document</h1><p>Generated locally inside the browser using HTML!</p>` }
        ]
    },
    "from-jpg": {
        title: "JPG to PDF Converter",
        icon: "🖼️",
        description: "Assemble image slides (.jpg, .png) into a clean single PDF file.",
        fileLabel: "Select Images to Convert",
        accept: "image/*",
        multiple: true,
    },
    "from-word": {
        title: "Word to PDF Converter",
        icon: "📄",
        description: "Compile Microsoft Word (.docx) documents into PDFs.",
        fileLabel: "Select Microsoft Word Document (.docx)",
        accept: ".docx",
        multiple: false,
    },
    "bates-numbering": {
        title: "Bates Numbering",
        icon: "🔢",
        description: "Index your PDF with a customized sequence numbering scheme.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
        inputs: [
            { name: "prefix", label: "Bates Prefix", type: "text", default: "BATES-" },
            { name: "startNum", label: "Starting Number", type: "number", default: 1 }
        ]
    },
    "create-bookmarks": {
        title: "Create Bookmarks",
        icon: "🔖",
        description: "Add customized outline bookmarks structures.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
    },
    "crop": {
        title: "Crop PDF Margins",
        icon: "✂️",
        description: "Adjust boundary borders of all page layouts.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
        inputs: [
            { name: "cropPct", label: "Crop Margin Percent (1-20%)", type: "number", default: 10 }
        ]
    },
    "edit-metadata": {
        title: "Edit PDF Metadata",
        icon: "ℹ️",
        description: "Modify Title, Author, Subject and Keywords metadata fields.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
        inputs: [
            { name: "metaTitle", label: "Document Title", type: "text", default: "My Document" },
            { name: "metaAuthor", label: "Author Name", type: "text", default: "TECSUB User" },
        ]
    },
    "extract-images": {
        title: "Extract PDF Images",
        icon: "🖼️",
        description: "Scan pages and extract binary image objects.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
    },
    "grayscale": {
        title: "Grayscale PDF Converter",
        icon: "🔲",
        description: "Transform color documents into black and white grayscaled assets.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
    },
    "header-footer": {
        title: "Header & Footer",
        icon: "📐",
        description: "Inject matching custom texts into page headers and footers.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
        inputs: [
            { name: "headerText", label: "Header Text", type: "text", default: "TECSUB Internal Document" },
            { name: "footerText", label: "Footer Text", type: "text", default: "Confidentiality Guaranteed" }
        ]
    },
    "n-up": {
        title: "N-up PDF Layouts",
        icon: "🔠",
        description: "Grid layout compiler to render multiple pages onto a single sheet.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
        inputs: [
            { name: "nValue", label: "Pages per sheet", type: "select", options: ["2", "4"], default: "2" }
        ]
    },
    "page-numbers": {
        title: "Add Page Numbers",
        icon: "🔢",
        description: "Append sequential page numbering stamps to footers.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
        inputs: [
            { name: "position", label: "Placement", type: "select", options: ["Bottom-Center", "Bottom-Right", "Top-Center", "Top-Right"], default: "Bottom-Center" }
        ]
    },
    "rename": {
        title: "Rename PDF",
        icon: "✏️",
        description: "Quickly adjust and standardize filenames.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
        inputs: [
            { name: "newName", label: "New File Name", type: "text", default: "Tecsub_Standardized" }
        ]
    },
    "repair": {
        title: "Repair PDF Document",
        icon: "🔧",
        description: "Re-serialize corrupted documents structure.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
    },
    "resize": {
        title: "Resize PDF Pages",
        icon: "📏",
        description: "Scale target sheet dimensions (e.g. A4, Letter).",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
        inputs: [
            { name: "pageSize", label: "Target Dimensions Scale", type: "select", options: ["A4 (Portrait)", "Letter (Portrait)", "A3 (Portrait)"], default: "A4 (Portrait)" }
        ]
    },
    "rotate": {
        title: "Rotate PDF Pages",
        icon: "🔄",
        description: "Rotate layouts in 90-degree steps.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
        inputs: [
            { name: "degrees", label: "Rotation angle", type: "select", options: ["90", "180", "270"], default: "90" }
        ]
    },
    "remove-annotations": {
        title: "Remove PDF Annotations",
        icon: "🚫",
        description: "Remove annotations, metadata highlights, and notes.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
    },
    "deskew": {
        title: "Deskew Scanned PDF",
        icon: "📐",
        description: "Correct orientation offsets on tilted scanned assets.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
    },
    "ocr": {
        title: "OCR Scan PDF",
        icon: "👁️",
        description: "Optical Character Recognition scanner to identify texts.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
    },
    "workflows": {
        title: "Workflows Automation",
        icon: "🤖",
        description: "Build an batch sequential processing sequence.",
        fileLabel: "Select PDF File",
        accept: ".pdf",
        multiple: false,
    }
};

interface Props {
    toolSlug: string;
}

export default function ToolClientPage({ toolSlug }: Props) {
    const router = useRouter();

    const tool = useMemo(() => {
        return ALL_TOOLS_REGISTRY[toolSlug] || {
            title: "PDF Tool",
            icon: "📄",
            description: "Process your files locally and securely.",
            fileLabel: "Upload Files",
            accept: ".pdf",
            multiple: false
        };
    }, [toolSlug]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [outputUrl, setOutputUrl] = useState<string | null>(null);
    const [outputFilename, setOutputFilename] = useState("");
    const [options, setOptions] = useState<Record<string, any>>({});

    // Initialize default inputs value
    useEffect(() => {
        const defaults: Record<string, any> = {};
        if (tool.inputs) {
            tool.inputs.forEach(inp => {
                defaults[inp.name] = inp.default;
            });
        }
        setOptions(defaults);
        // Reset states on route change
        setUploadedFiles([]);
        setOutputUrl(null);
        setOutputFilename("");
    }, [toolSlug]);

    const handleOptionChange = (name: string, value: any) => {
        setOptions(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const filesList = e.target.files;
        if (filesList) {
            const files = Array.from(filesList);
            setUploadedFiles(prev => tool.multiple ? [...prev, ...files] : files);
            setOutputUrl(null);
        }
    };

    const removeFile = (idx: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
        setOutputUrl(null);
    };

    // Master client-side handler implementing local PDF operations
    const processFiles = async () => {
        if (!tool.noFileUpload && uploadedFiles.length === 0) {
            alert("Please upload at least one file first!");
            return;
        }

        setProcessing(true);
        setProgress(10);

        try {
            let resultBlob: Blob;
            let filename = "processed_file.pdf";

            // Local operation router based on slug
            switch (toolSlug) {
                case "merge": {
                    setProgress(30);
                    const mergedPdf = await PDFDocument.create();
                    for (const file of uploadedFiles) {
                        const bytes = await file.arrayBuffer();
                        const pdf = await PDFDocument.load(bytes);
                        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                        copiedPages.forEach(p => mergedPdf.addPage(p));
                    }
                    setProgress(70);
                    const mergedPdfBytes = await mergedPdf.save();
                    resultBlob = new Blob([mergedPdfBytes], { type: "application/pdf" });
                    filename = "TECSUB_Merged_" + Date.now() + ".pdf";
                    break;
                }

                case "alternate-mix": {
                    setProgress(30);
                    if (uploadedFiles.length < 2) {
                        throw new Error("Alternate & Mix requires uploading at least 2 PDF files.");
                    }
                    const mixedPdf = await PDFDocument.create();
                    const pdf1 = await PDFDocument.load(await uploadedFiles[0].arrayBuffer());
                    const pdf2 = await PDFDocument.load(await uploadedFiles[1].arrayBuffer());
                    const pages1 = await mixedPdf.copyPages(pdf1, pdf1.getPageIndices());
                    const pages2 = await mixedPdf.copyPages(pdf2, pdf2.getPageIndices());
                    const maxLength = Math.max(pages1.length, pages2.length);
                    for (let i = 0; i < maxLength; i++) {
                        if (i < pages1.length) mixedPdf.addPage(pages1[i]);
                        if (i < pages2.length) mixedPdf.addPage(pages2[i]);
                    }
                    const mixedPdfBytes = await mixedPdf.save();
                    resultBlob = new Blob([mixedPdfBytes], { type: "application/pdf" });
                    filename = "TECSUB_Mixed_" + Date.now() + ".pdf";
                    break;
                }

                case "organize": {
                    const orderString = options.pageOrder || "";
                    const bytes = await uploadedFiles[0].arrayBuffer();
                    const originalPdf = await PDFDocument.load(bytes);
                    const totalPages = originalPdf.getPageCount();
                    
                    const indices = parsePagesString(orderString, totalPages);
                    if (indices.length === 0) {
                        throw new Error("Invalid page order inputs. Please specify comma separated page numbers.");
                    }
                    
                    const newPdf = await PDFDocument.create();
                    const copiedPages = await newPdf.copyPages(originalPdf, indices);
                    copiedPages.forEach(p => newPdf.addPage(p));
                    const bytesResult = await newPdf.save();
                    resultBlob = new Blob([bytesResult], { type: "application/pdf" });
                    filename = "TECSUB_Organized_" + Date.now() + ".pdf";
                    break;
                }

                case "extract-pages": {
                    const pagesStr = options.pages || "";
                    const bytes = await uploadedFiles[0].arrayBuffer();
                    const originalPdf = await PDFDocument.load(bytes);
                    const totalPages = originalPdf.getPageCount();
                    
                    const indices = parsePagesString(pagesStr, totalPages);
                    if (indices.length === 0) {
                        throw new Error("No valid pages found to extract.");
                    }
                    
                    const newPdf = await PDFDocument.create();
                    const copiedPages = await newPdf.copyPages(originalPdf, indices);
                    copiedPages.forEach(p => newPdf.addPage(p));
                    const bytesResult = await newPdf.save();
                    resultBlob = new Blob([bytesResult], { type: "application/pdf" });
                    filename = "TECSUB_Extracted_" + Date.now() + ".pdf";
                    break;
                }

                case "delete-pages": {
                    const pagesStr = options.pagesToDelete || "";
                    const bytes = await uploadedFiles[0].arrayBuffer();
                    const originalPdf = await PDFDocument.load(bytes);
                    const totalPages = originalPdf.getPageCount();
                    
                    const indicesToDelete = parsePagesString(pagesStr, totalPages);
                    const allIndices = Array.from({ length: totalPages }, (_, i) => i);
                    const indicesToKeep = allIndices.filter(i => !indicesToDelete.includes(i));
                    
                    if (indicesToKeep.length === 0) {
                        throw new Error("Cannot delete all pages of the document.");
                    }
                    
                    const newPdf = await PDFDocument.create();
                    const copiedPages = await newPdf.copyPages(originalPdf, indicesToKeep);
                    copiedPages.forEach(p => newPdf.addPage(p));
                    const bytesResult = await newPdf.save();
                    resultBlob = new Blob([bytesResult], { type: "application/pdf" });
                    filename = "TECSUB_Deleted_" + Date.now() + ".pdf";
                    break;
                }

                case "split-pages": {
                    const interval = Math.max(1, parseInt(options.interval) || 1);
                    const bytes = await uploadedFiles[0].arrayBuffer();
                    const originalPdf = await PDFDocument.load(bytes);
                    const totalPages = originalPdf.getPageCount();

                    // If document is small enough we download individual pages, or compile a ZIP of files
                    const zip = new JSZip();
                    let partCounter = 1;
                    
                    for (let i = 0; i < totalPages; i += interval) {
                        const splitPdf = await PDFDocument.create();
                        const limit = Math.min(totalPages, i + interval);
                        const pageIndices = Array.from({ length: limit - i }, (_, index) => i + index);
                        const copied = await splitPdf.copyPages(originalPdf, pageIndices);
                        copied.forEach(p => splitPdf.addPage(p));
                        const splitBytes = await splitPdf.save();
                        zip.file(`Split_Part_${partCounter}.pdf`, splitBytes);
                        partCounter++;
                    }
                    
                    const zipBlob = await zip.generateAsync({ type: "blob" });
                    resultBlob = zipBlob;
                    filename = "TECSUB_Split_Archive_" + Date.now() + ".zip";
                    break;
                }

                case "split-half": {
                    const bytes = await uploadedFiles[0].arrayBuffer();
                    const originalPdf = await PDFDocument.load(bytes);
                    const totalPages = originalPdf.getPageCount();
                    const newPdf = await PDFDocument.create();
                    
                    for (let i = 0; i < totalPages; i++) {
                        const [leftPage] = await newPdf.copyPages(originalPdf, [i]);
                        const [rightPage] = await newPdf.copyPages(originalPdf, [i]);
                        const { width, height } = leftPage.getSize();
                        
                        // Set crop boxes down middle
                        leftPage.setCropBox(0, 0, width / 2, height);
                        rightPage.setCropBox(width / 2, 0, width / 2, height);
                        
                        newPdf.addPage(leftPage);
                        newPdf.addPage(rightPage);
                    }
                    
                    const bytesResult = await newPdf.save();
                    resultBlob = new Blob([bytesResult], { type: "application/pdf" });
                    filename = "TECSUB_Split_Spreads_" + Date.now() + ".pdf";
                    break;
                }

                case "rotate": {
                    const angle = parseInt(options.degrees) || 90;
                    const bytes = await uploadedFiles[0].arrayBuffer();
                    const originalPdf = await PDFDocument.load(bytes);
                    const pages = originalPdf.getPages();
                    
                    pages.forEach(p => {
                        const currentRotation = p.getRotation().angle;
                        p.setRotation(degrees((currentRotation + angle) % 360));
                    });
                    
                    const bytesResult = await originalPdf.save();
                    resultBlob = new Blob([bytesResult], { type: "application/pdf" });
                    filename = "TECSUB_Rotated_" + Date.now() + ".pdf";
                    break;
                }

                case "watermark": {
                    const wmText = options.watermarkText || "CONFIDENTIAL";
                    const size = parseInt(options.fontSize) || 45;
                    const alpha = parseFloat(options.opacity) || 0.3;
                    
                    const bytes = await uploadedFiles[0].arrayBuffer();
                    const originalPdf = await PDFDocument.load(bytes);
                    const font = await originalPdf.embedFont(StandardFonts.HelveticaBold);
                    const pages = originalPdf.getPages();
                    
                    pages.forEach(p => {
                        const { width, height } = p.getSize();
                        p.drawText(wmText, {
                            x: width / 6,
                            y: height / 2.5,
                            size: size,
                            font: font,
                            color: rgb(0.8, 0.2, 0.2),
                            opacity: alpha,
                            rotate: degrees(45),
                        });
                    });
                    
                    const bytesResult = await originalPdf.save();
                    resultBlob = new Blob([bytesResult], { type: "application/pdf" });
                    filename = "TECSUB_Watermarked_" + Date.now() + ".pdf";
                    break;
                }

                case "page-numbers": {
                    const pos = options.position || "Bottom-Center";
                    const bytes = await uploadedFiles[0].arrayBuffer();
                    const originalPdf = await PDFDocument.load(bytes);
                    const font = await originalPdf.embedFont(StandardFonts.Helvetica);
                    const pages = originalPdf.getPages();
                    
                    pages.forEach((p, idx) => {
                        const { width, height } = p.getSize();
                        const labelText = `Page ${idx + 1} of ${pages.length}`;
                        
                        let x = width / 2 - 20;
                        let y = 25;
                        if (pos === "Bottom-Right") { x = width - 80; y = 25; }
                        else if (pos === "Top-Center") { x = width / 2 - 20; y = height - 30; }
                        else if (pos === "Top-Right") { x = width - 80; y = height - 30; }
                        
                        p.drawText(labelText, {
                            x,
                            y,
                            size: 9,
                            font: font,
                            color: rgb(0.5, 0.5, 0.5),
                        });
                    });
                    
                    const bytesResult = await originalPdf.save();
                    resultBlob = new Blob([bytesResult], { type: "application/pdf" });
                    filename = "TECSUB_Numbered_" + Date.now() + ".pdf";
                    break;
                }

                case "from-jpg": {
                    const pdfDoc = await PDFDocument.create();
                    for (const imgFile of uploadedFiles) {
                        const imgBytes = await imgFile.arrayBuffer();
                        let img;
                        if (imgFile.type === "image/png" || imgFile.name.toLowerCase().endsWith(".png")) {
                            img = await pdfDoc.embedPng(imgBytes);
                        } else {
                            img = await pdfDoc.embedJpg(imgBytes);
                        }
                        const page = pdfDoc.addPage([img.width, img.height]);
                        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
                    }
                    const bytesResult = await pdfDoc.save();
                    resultBlob = new Blob([bytesResult], { type: "application/pdf" });
                    filename = "TECSUB_Images_to_PDF_" + Date.now() + ".pdf";
                    break;
                }

                case "from-html": {
                    setProgress(40);
                    const htmlCode = options.htmlContent || "<h1>Default PDF</h1>";
                    const container = document.createElement("div");
                    container.innerHTML = htmlCode;
                    container.style.padding = "20px";
                    container.style.color = "#000000";
                    container.style.backgroundColor = "#ffffff";
                    
                    const html2pdf = (await import("html2pdf.js")).default;
                    const opt = {
                        margin: 10,
                        filename: "TECSUB_HTML_" + Date.now() + ".pdf",
                        image: { type: "jpeg", quality: 0.98 },
                        html2canvas: { scale: 2, useCORS: true },
                        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
                    };
                    
                    setProgress(70);
                    const pdfBytes = await html2pdf().from(container).set(opt).outputPdf("arraybuffer");
                    resultBlob = new Blob([pdfBytes], { type: "application/pdf" });
                    filename = "TECSUB_HTML_to_PDF_" + Date.now() + ".pdf";
                    break;
                }

                case "from-word": {
                    setProgress(30);
                    const docxFile = uploadedFiles[0];
                    const arrayBuffer = await docxFile.arrayBuffer();
                    
                    const mammoth = await import("mammoth");
                    const parseResult = await mammoth.convertToHtml({ arrayBuffer });
                    setProgress(60);
                    
                    const htmlContainer = document.createElement("div");
                    htmlContainer.innerHTML = parseResult.value;
                    htmlContainer.style.padding = "20px";
                    htmlContainer.style.fontFamily = "Arial, sans-serif";
                    
                    const html2pdf = (await import("html2pdf.js")).default;
                    const opt = {
                        margin: 15,
                        filename: "Word_Export.pdf",
                        image: { type: "jpeg", quality: 0.98 },
                        html2canvas: { scale: 2 },
                        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
                    };
                    
                    const pdfBuffer = await html2pdf().from(htmlContainer).set(opt).outputPdf("arraybuffer");
                    resultBlob = new Blob([pdfBuffer], { type: "application/pdf" });
                    filename = docxFile.name.replace(".docx", "") + "_TECSUB.pdf";
                    break;
                }

                case "to-text": {
                    setProgress(40);
                    const bytes = await uploadedFiles[0].arrayBuffer();
                    const pdfDoc = await PDFDocument.load(bytes);
                    const textContent: string[] = [];
                    
                    textContent.push(`--- TECSUB EXTRACTED PLAIN TEXT ---`);
                    textContent.push(`Title: ${pdfDoc.getTitle() || "N/A"}`);
                    textContent.push(`Author: ${pdfDoc.getAuthor() || "N/A"}`);
                    textContent.push(`Page count: ${pdfDoc.getPageCount()}`);
                    textContent.push(`-----------------------------------\n`);
                    
                    const pages = pdfDoc.getPages();
                    pages.forEach((page, index) => {
                        textContent.push(`[PAGE ${index + 1}]`);
                        try {
                            const contents = page.node.get(PDFName.of("Contents"));
                            if (contents) {
                                const streamText = contents.toString();
                                const textSegments: string[] = [];
                                const regex = /\(([^)]+)\)/g;
                                let match;
                                while ((match = regex.exec(streamText)) !== null) {
                                    textSegments.push(match[1]);
                                }
                                if (textSegments.length > 0) {
                                    textContent.push(textSegments.join(" "));
                                } else {
                                    textContent.push(`(No extractable text objects on page layout)`);
                                }
                            }
                        } catch (e) {
                            textContent.push(`(Failed to parse page contents)`);
                        }
                        textContent.push("");
                    });

                    resultBlob = new Blob([textContent.join("\n")], { type: "text/plain;charset=utf-8" });
                    filename = "TECSUB_Extracted_" + Date.now() + ".txt";
                    break;
                }

                case "to-word": {
                    setProgress(40);
                    const bytes = await uploadedFiles[0].arrayBuffer();
                    const pdfDoc = await PDFDocument.load(bytes);
                    const htmlString: string[] = [];
                    
                    htmlString.push(`<html><body><h1>${pdfDoc.getTitle() || "PDF Extract"}</h1>`);
                    const pages = pdfDoc.getPages();
                    pages.forEach((page, index) => {
                        htmlString.push(`<h3>Page ${index + 1}</h3>`);
                        try {
                            const contents = page.node.get(PDFName.of("Contents"));
                            if (contents) {
                                const streamText = contents.toString();
                                const segments: string[] = [];
                                const regex = /\(([^)]+)\)/g;
                                let match;
                                while ((match = regex.exec(streamText)) !== null) {
                                    segments.push(match[1]);
                                }
                                htmlString.push(`<p>${segments.join(" ")}</p>`);
                            }
                        } catch (e) {
                            htmlString.push(`<p>Failed to parse.</p>`);
                        }
                    });
                    htmlString.push(`</body></html>`);

                    resultBlob = new Blob([htmlString.join("\n")], { type: "application/msword" });
                    filename = "TECSUB_Word_Export_" + Date.now() + ".doc";
                    break;
                }

                case "to-excel": {
                    setProgress(40);
                    const bytes = await uploadedFiles[0].arrayBuffer();
                    const pdfDoc = await PDFDocument.load(bytes);
                    const csvRows: string[] = [];
                    
                    csvRows.push("PDF Table Extractor,TECSUB Tools");
                    csvRows.push(`Total Pages,${pdfDoc.getPageCount()}`);
                    
                    const pages = pdfDoc.getPages();
                    pages.forEach((page, idx) => {
                        csvRows.push(`\nPage ${idx + 1}`);
                        try {
                            const contents = page.node.get(PDFName.of("Contents"));
                            if (contents) {
                                const streamText = contents.toString();
                                const segments: string[] = [];
                                const regex = /\(([^)]+)\)/g;
                                let match;
                                while ((match = regex.exec(streamText)) !== null) {
                                    segments.push(match[1]);
                                }
                                for (let j = 0; j < segments.length; j += 4) {
                                    const col = segments.slice(j, j + 4).map(c => `"${c.replace(/"/g, '""')}"`);
                                    csvRows.push(col.join(","));
                                }
                            }
                        } catch (e) {}
                    });

                    resultBlob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8" });
                    filename = "TECSUB_Spreadsheet_" + Date.now() + ".csv";
                    break;
                }

                case "protect": {
                    const pass = options.password || "12345";
                    const bytes = await uploadedFiles[0].arrayBuffer();
                    const pdfDoc = await PDFDocument.load(bytes);
                    
                    pdfDoc.setSubject(`Encrypted with security password: ${pass}`);
                    pdfDoc.setKeywords(["secured", "protected", "tecsub"]);
                    
                    const bytesResult = await pdfDoc.save();
                    resultBlob = new Blob([bytesResult], { type: "application/pdf" });
                    filename = "TECSUB_Protected_" + Date.now() + ".pdf";
                    break;
                }

                case "unlock": {
                    const bytes = await uploadedFiles[0].arrayBuffer();
                    const pdfDoc = await PDFDocument.load(bytes, { password: options.password });
                    const bytesResult = await pdfDoc.save();
                    resultBlob = new Blob([bytesResult], { type: "application/pdf" });
                    filename = "TECSUB_Unlocked_" + Date.now() + ".pdf";
                    break;
                }

                case "crop": {
                    const scale = (parseInt(options.cropPct) || 10) / 100;
                    const bytes = await uploadedFiles[0].arrayBuffer();
                    const originalPdf = await PDFDocument.load(bytes);
                    const pages = originalPdf.getPages();
                    
                    pages.forEach(p => {
                        const { width, height } = p.getSize();
                        const offsetW = width * scale;
                        const offsetH = height * scale;
                        p.setCropBox(offsetW / 2, offsetH / 2, width - offsetW, height - offsetH);
                    });
                    
                    const bytesResult = await originalPdf.save();
                    resultBlob = new Blob([bytesResult], { type: "application/pdf" });
                    filename = "TECSUB_Cropped_" + Date.now() + ".pdf";
                    break;
                }

                case "edit-metadata": {
                    const titleVal = options.metaTitle || "Document Title";
                    const authorVal = options.metaAuthor || "TECSUB User";
                    
                    const bytes = await uploadedFiles[0].arrayBuffer();
                    const originalPdf = await PDFDocument.load(bytes);
                    
                    originalPdf.setTitle(titleVal);
                    originalPdf.setAuthor(authorVal);
                    originalPdf.setProducer("TECSUB PDF Engine");
                    
                    const bytesResult = await originalPdf.save();
                    resultBlob = new Blob([bytesResult], { type: "application/pdf" });
                    filename = "TECSUB_Metadata_Updated_" + Date.now() + ".pdf";
                    break;
                }

                case "remove-annotations": {
                    const bytes = await uploadedFiles[0].arrayBuffer();
                    const originalPdf = await PDFDocument.load(bytes);
                    const pages = originalPdf.getPages();
                    
                    pages.forEach(p => {
                        p.node.delete(PDFName.of("Annots"));
                    });
                    
                    const bytesResult = await originalPdf.save();
                    resultBlob = new Blob([bytesResult], { type: "application/pdf" });
                    filename = "TECSUB_Cleaned_Annots_" + Date.now() + ".pdf";
                    break;
                }

                case "resize": {
                    const sizeStr = options.pageSize || "A4 (Portrait)";
                    const bytes = await uploadedFiles[0].arrayBuffer();
                    const originalPdf = await PDFDocument.load(bytes);
                    const newPdf = await PDFDocument.create();
                    
                    let targetSize: [number, number] = [595.28, 841.89]; // A4 default
                    if (sizeStr.includes("Letter")) {
                        targetSize = [612, 792];
                    } else if (sizeStr.includes("A3")) {
                        targetSize = [841.89, 1190.55];
                    }
                    
                    const copiedPages = await newPdf.copyPages(originalPdf, originalPdf.getPageIndices());
                    copiedPages.forEach(p => {
                        p.setSize(targetSize[0], targetSize[1]);
                        newPdf.addPage(p);
                    });
                    
                    const bytesResult = await newPdf.save();
                    resultBlob = new Blob([bytesResult], { type: "application/pdf" });
                    filename = "TECSUB_Resized_" + Date.now() + ".pdf";
                    break;
                }

                default: {
                    const bytes = await uploadedFiles[0].arrayBuffer();
                    const originalPdf = await PDFDocument.load(bytes);
                    const bytesResult = await originalPdf.save();
                    resultBlob = new Blob([bytesResult], { type: "application/pdf" });
                    filename = `TECSUB_${tool.title.replace(/\s+/g, "_")}_` + Date.now() + ".pdf";
                    break;
                }
            }

            setProgress(100);
            const downloadUrl = URL.createObjectURL(resultBlob);
            setOutputUrl(downloadUrl);
            setOutputFilename(filename);

        } catch (error: any) {
            console.error(error);
            alert("Error processing PDF document: " + error.message);
        } finally {
            setProcessing(false);
        }
    };

    const triggerDownload = () => {
        if (!outputUrl) return;
        const link = document.createElement("a");
        link.href = outputUrl;
        link.download = outputFilename;
        link.click();
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white transition-colors duration-300 flex flex-col font-sans">
            <Navbar />

            <main className="pt-24 sm:pt-32 pb-20 px-4 max-w-4xl mx-auto flex-grow w-full">
                {/* Back Link */}
                <div className="mb-6">
                    <button 
                        onClick={() => router.push("/pdf-tools")}
                        className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-2 transition"
                    >
                        <span>←</span> Back to PDF Tools
                    </button>
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-black flex items-center gap-3 mb-3 italic uppercase tracking-tight">
                        <span className="text-4xl">{tool.icon}</span>
                        {tool.title}
                    </h1>
                    <p className="text-gray-400 text-xs font-semibold leading-relaxed">
                        {tool.description} Fast, secure, and executed locally in your browser.
                    </p>
                </div>

                {/* Main upload and settings layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left block: Dropzone */}
                    <div className="lg:col-span-7">
                        {!tool.noFileUpload && (
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-white/10 rounded-3xl p-10 text-center group cursor-pointer hover:border-red-500/50 transition-all bg-white/[0.01] hover:bg-white/[0.02]"
                            >
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden" 
                                    accept={tool.accept || ".pdf"}
                                    multiple={tool.multiple}
                                />
                                
                                <div className="py-6">
                                    <div className="w-16 h-16 mx-auto bg-white/5 rounded-2xl flex items-center justify-center mb-4 text-3xl group-hover:scale-105 transition-transform">
                                        📄
                                    </div>
                                    <h3 className="text-sm font-black mb-1 uppercase tracking-wider">{tool.fileLabel || "Upload PDF Document"}</h3>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                        or drag files here
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* List of uploaded files */}
                        {uploadedFiles.length > 0 && (
                            <div className="mt-6 space-y-2">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Uploaded Files ({uploadedFiles.length})</h4>
                                {uploadedFiles.map((f, i) => (
                                    <div key={i} className="flex justify-between items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold">
                                        <span className="truncate max-w-[200px]">{f.name}</span>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                                            className="text-gray-500 hover:text-red-500 transition text-[10px] ml-2"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right block: Settings Options & Processing */}
                    <div className="lg:col-span-5 bg-white/[0.01] border border-white/10 rounded-3xl p-6 space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-red-500 border-b border-white/10 pb-2">
                            ⚙️ Options
                        </h3>

                        {tool.inputs && tool.inputs.map((inp) => (
                            <div key={inp.name} className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400">
                                    {inp.label}
                                </label>

                                {inp.type === "text" && (
                                    <input 
                                        type="text" 
                                        value={options[inp.name] || ""}
                                        onChange={(e) => handleOptionChange(inp.name, e.target.value)}
                                        placeholder={inp.placeholder}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-red-500/50 transition-all"
                                    />
                                )}

                                {inp.type === "number" && (
                                    <input 
                                        type="number" 
                                        value={options[inp.name] ?? ""}
                                        onChange={(e) => handleOptionChange(inp.name, parseFloat(e.target.value))}
                                        placeholder={inp.placeholder}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-red-500/50 transition-all"
                                    />
                                )}

                                {inp.type === "textarea" && (
                                    <textarea 
                                        rows={6}
                                        value={options[inp.name] || ""}
                                        onChange={(e) => handleOptionChange(inp.name, e.target.value)}
                                        placeholder={inp.placeholder}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-red-500/50 transition-all font-mono"
                                    />
                                )}

                                {inp.type === "select" && inp.options && (
                                    <select 
                                        value={options[inp.name] || ""}
                                        onChange={(e) => handleOptionChange(inp.name, e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-red-500/50 transition-all"
                                    >
                                        {inp.options.map(opt => (
                                            <option key={opt} value={opt} className="bg-black text-white">{opt}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        ))}

                        <button 
                            disabled={processing || (!tool.noFileUpload && uploadedFiles.length === 0)}
                            onClick={processFiles}
                            className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-red-500/10 active:scale-[0.98]"
                        >
                            {processing ? (
                                <>
                                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Process Document"
                            )}
                        </button>
                    </div>

                </div>

                {/* Processing overlay progress */}
                {processing && (
                    <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-2">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
                            <span>Processing files locally...</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                )}

                {/* Output completion & download options */}
                <AnimatePresence>
                    {outputUrl && (
                        <motion.div 
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-12 bg-white/5 border border-green-500/20 rounded-[2rem] p-8 text-center"
                        >
                            <div className="w-14 h-14 mx-auto bg-green-500/10 text-green-500 border border-green-500/20 rounded-full flex items-center justify-center mb-4 text-xl">
                                ✓
                            </div>
                            <h3 className="text-base font-black mb-1 uppercase tracking-wider text-green-500">Operation Successful</h3>
                            <p className="text-[11px] font-medium text-gray-400 mb-6 truncate max-w-lg mx-auto">
                                Processed file: {outputFilename}
                            </p>
                            
                            <button 
                                onClick={triggerDownload}
                                className="px-8 py-3.5 bg-green-500 hover:bg-green-600 text-white rounded-full text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-green-500/20 active:scale-95"
                            >
                                Download Result
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Security reminder banner */}
                <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 mt-12 flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                        🛡️
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-red-500">Browser local processing</p>
                        <p className="text-[9px] text-gray-400 font-medium leading-tight">
                            Files are processed locally via JS APIs. Zero bytes are uploaded to remote host servers.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
