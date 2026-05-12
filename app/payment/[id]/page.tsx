import { Suspense } from "react";
import PaymentPage from "@/components/PaymentPage";

// Required for static export on GitHub Pages
export async function generateStaticParams() {
    return [
        { id: '1' },
        { id: '2' },
        { id: '3' }
    ];
}

export default function Page({ params }: { params: { id: string } }) {
    return (
        <main className="min-h-screen bg-black">
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center bg-[#050505]">
                    <div className="w-16 h-16 border-4 border-white/10 border-t-[#d9ff00] rounded-full animate-spin" />
                </div>
            }>
                <PaymentPage id={params.id} />
            </Suspense>
        </main>
    );
}
