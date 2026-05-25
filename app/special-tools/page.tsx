import { Suspense } from "react";
import SpecialToolsContainer from "@/components/SpecialToolsContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tecsub Labs | Creative Tools & Generators",
    description: "Design interactive professional profiles, create custom memes, generate advanced ASCII typography, and browse digital card styles online.",
};

export default function SpecialToolsPage() {
    return (
        <main className="min-h-screen bg-black">
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-[#050505]">
                    <div className="w-16 h-16 border-4 border-white/10 border-t-[#00ff88] rounded-full animate-spin" />
                </div>
            }>
                <SpecialToolsContainer />
            </Suspense>
        </main>
    );
}
