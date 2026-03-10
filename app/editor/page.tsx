export const metadata = {
    title: "Document Editor",
    description: "Upload, edit, and export your DOCX, TXT, and Markdown files safely directly in the browser.",
};

import DocumentEditor from "@/components/DocumentEditor";

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
            </div>
        </main>
    );
}
