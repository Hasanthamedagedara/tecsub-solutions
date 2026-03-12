export const metadata = {
    title: "Document Editor",
    description: "Upload, edit, and export your DOCX, TXT, and Markdown files safely directly in the browser.",
};

import DocumentEditor from "@/components/DocumentEditor";
import Link from "next/link";

export default function EditorPage() {
    return (
        <main className="yt-content">
            <div className="min-h-[85vh] flex flex-col items-center px-4 w-full">
                <div className="w-full max-w-5xl mt-6">
                    <h1 className="text-3xl font-bold mb-2">Rich Text File Editor</h1>
                    <p className="text-gray-400">
                        Upload a file (Word, Text, or Markdown). It will be safely converted and rendered into the editor below for complete customization before exporting.
                    </p>
                </div>

                <DocumentEditor />

                {/* PDF Editor Link */}
                <div className="w-full max-w-5xl mt-8 mb-6">
                    <Link
                        href="/tools"
                        className="block w-full p-5 rounded-2xl transition-all duration-300 hover:scale-[1.01] group"
                        style={{
                            background: "rgba(0,229,255,0.05)",
                            border: "1px solid rgba(0,229,255,0.15)",
                        }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                                style={{ background: "rgba(0,229,255,0.1)" }}
                            >
                                📄
                            </div>
                            <div>
                                <h3 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
                                    PDF Editor — Merge, Split, Compress & Edit
                                </h3>
                                <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                                    Need to edit PDF files? Open the full PDF Editor tool →
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </main>
    );
}
