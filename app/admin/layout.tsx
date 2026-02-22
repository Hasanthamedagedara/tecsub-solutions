import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "TecSub Admin Panel",
    description: "TecSub Solutions Admin Console — manage content, news, videos, courses, and more.",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {/* Admin-specific fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Noto+Sans:wght@400;500;600;700&display=swap"
                rel="stylesheet"
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
                rel="stylesheet"
            />
            {children}
        </>
    );
}
