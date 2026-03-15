import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import ScrollToTop from "@/components/ScrollToTop";
import FilterChipBar from "@/components/FilterChipBar";
import ChatPanel from "@/components/ChatPanel";
import PdfModal from "@/components/PdfModal";
import AuthModal from "@/components/AuthModal";
import PostComposer from "@/components/PostComposer";

export const metadata: Metadata = {
    metadataBase: new URL("https://tecsubsolutions.com"),
    title: {
        default: "Tecsub Solutions | Engineering the Future",
        template: "%s | Tecsub Solutions",
    },
    description:
        "AI-driven reviews, high-performance applications, scalable software, and next-gen technology solutions by Tecsub Solutions.",
    keywords: ["Tecsub", "AI", "Software", "Web Development", "Technology", "Solutions", "Tech News", "Online Tools", "Courses", "AI Prompts"],
    authors: [{ name: "Tecsub Solutions", url: "https://tecsubsolutions.com" }],
    creator: "Tecsub Solutions",
    publisher: "Tecsub Solutions",
    robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
    },
    verification: {
        google: "ZPljKHMes5GVg_2Y3XubDmSRrLmCR9KXvOSC5fDNQ0k",
    },
    openGraph: {
        title: "Tecsub Solutions",
        description: "Engineering the Future — AI-driven reviews, high-performance apps & scalable software.",
        url: "https://tecsubsolutions.com",
        siteName: "Tecsub Solutions",
        type: "website",
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: "Tecsub Solutions",
        description: "Engineering the Future — AI-driven reviews, high-performance apps & scalable software.",
    },
    alternates: {
        canonical: "https://tecsubsolutions.com",
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
                {/* Instantly detect app WebView before paint — prevents header flash */}
                <script dangerouslySetInnerHTML={{
                    __html: `
                    (function(){
                        var ua = navigator.userAgent || '';
                        var sp = new URLSearchParams(window.location.search);
                        if (ua.indexOf('TECSUB_APP_USER_AGENT') !== -1 ||
                            ua.indexOf('TecsubApp') !== -1 ||
                            /; wv\\)/.test(ua) ||
                            sp.get('app') === '1' ||
                            sp.get('mode') === 'app') {
                            document.documentElement.classList.add('is-app');
                        }
                    })();
                `}} />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="font-roboto antialiased">
                <ThemeProvider>
                    <FilterChipBar />
                    {children}
                    <ChatPanel />
                    <PdfModal />
                    <AuthModal />
                    <PostComposer />
                    <ScrollToTop />
                </ThemeProvider>
            </body>
        </html>
    );
}
