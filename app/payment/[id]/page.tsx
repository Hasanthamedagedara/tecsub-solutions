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
            <PaymentPage id={params.id} />
        </main>
    );
}
