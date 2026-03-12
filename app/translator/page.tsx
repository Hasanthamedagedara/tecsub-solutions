export const metadata = {
    title: "Translator & Reminder Tool | Tecsub Solutions",
    description:
        "Translate DOCX, TXT, PDF, and PPTX documents into 16+ languages and set payment reminders — all from your browser, for free.",
};

import TranslatorTool from "@/components/TranslatorTool";

export default function TranslatorPage() {
    return (
        <main className="yt-content">
            <div className="min-h-[85vh] flex flex-col items-center px-4 w-full">
                <div className="w-full max-w-5xl mt-6">
                    <h1 className="text-3xl font-bold mb-2">Translator & Reminder Tool</h1>
                    <p className="text-gray-400">
                        Upload any document, pick a target language, and download a translated PDF instantly. Switch tabs to manage payment reminders.
                    </p>
                </div>

                <TranslatorTool />
            </div>
        </main>
    );
}
