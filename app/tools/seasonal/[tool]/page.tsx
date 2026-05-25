import { Suspense } from "react";
import SeasonalToolContainer from "@/components/SeasonalToolContainer";

// Required for static export (next build)
export async function generateStaticParams() {
    return [
        { tool: "digital-pandal" },
        { tool: "digital-dansala" },
        { tool: "verse-book" },
        { tool: "avurudu-nakath" },
        { tool: "avurudu-greetings" },
        { tool: "avurudu-games" },
        { tool: "santa-letter" },
        { tool: "secret-santa" },
        { tool: "valentine-notes" },
        { tool: "exam-wishers" },
        { tool: "resolution-card" },
    ];
}

interface PageProps {
    params: {
        tool: string;
    };
}

export default function SeasonalToolPage({ params }: PageProps) {
    return (
        <main className="min-h-screen bg-black">
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-[#050505]">
                    <div className="w-16 h-16 border-4 border-white/10 border-t-[#ff6b35] rounded-full animate-spin" />
                </div>
            }>
                <SeasonalToolContainer toolSlug={params.tool} />
            </Suspense>
        </main>
    );
}
