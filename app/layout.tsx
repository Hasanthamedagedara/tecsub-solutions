import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
    title: "Tecsub Solutions | Engineering the Future",
    description:
        "AI-driven reviews, high-performance applications, scalable software, and next-gen technology solutions by Tecsub Solutions.",
    keywords: ["Tecsub", "AI", "Software", "Web Development", "Technology", "Solutions"],
    openGraph: {
        title: "Tecsub Solutions",
        description: "Engineering the Future.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                {/* Adsterra Popunder */}
                <script src="https://pl28783989.effectivegatecpm.com/21/d9/12/21d912ad932565986d377b0f9218591e.js" async></script>
                {/* Adsterra Social Bar */}
                <script src="https://pl28783991.effectivegatecpm.com/9f/11/ec/9f11ec79f50dce3ab003f8f489f55e95.js" async></script>
            </head>
            <body className="font-inter antialiased">
                <ThemeProvider>
                    {children}
                    <ScrollToTop />
                </ThemeProvider>
            </body>
        </html>
    );
}