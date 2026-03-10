export const metadata = {
    title: "Document Translator",
    description: "Instantly translate entire DOCX and TXT files using Google Apps Script for free.",
};

import TranslatorTool from "@/components/TranslatorTool";

export default function TranslatorPage() {
    return (
        <main className="yt-content">
            <div className="min-h-[85vh] flex flex-col items-center px-4 w-full">
                <div className="w-full max-w-5xl mt-6">
                    <h1 className="text-3xl font-bold mb-2">Instant File Translator</h1>
                    <p className="text-gray-400">
                        Upload a Word or Text document, paste your Google Apps Script API URL, and instantly export a fully translated PDF at zero cost.
                    </p>
                </div>

                <TranslatorTool />
            </div>
        </main>
    );
}
