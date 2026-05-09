import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import ScrollToTop from "@/components/ScrollToTop";
import LayoutBars from "@/components/LayoutBars";
import ChatPanel from "@/components/ChatPanel";
import PdfModal from "@/components/PdfModal";
import AuthModal from "@/components/AuthModal";
import Sidebar from "@/components/Sidebar";


export const metadata: Metadata = {
    metadataBase: new URL("https://tecsub.online"),
    title: {
        default: "Tecsub Solutions | Engineering the Future",
        template: "%s | Tecsub Solutions",
    },
    description:
        "AI-driven reviews, high-performance applications, scalable software, and next-gen technology solutions by Tecsub Solutions.",
    keywords: ["Tecsub", "AI", "Software", "Web Development", "Technology", "Solutions", "Tech News", "Online Tools", "Courses", "AI Prompts"],
    authors: [{ name: "Tecsub Solutions", url: "https://tecsub.online" }],
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
        url: "https://tecsub.online",
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
        canonical: "https://tecsub.online",
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/apple-icon.png",
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
                    href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&family=Noto+Sans+Sinhala:wght@400;600&family=Noto+Sans+Tamil:wght@400;600&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className="font-roboto antialiased">
                <ThemeProvider>
                    <div className="kdj-app-layout">
                        <Sidebar />
                        <div className="kdj-app-content">
                            <LayoutBars />
                            {children}
                        </div>
                    </div>
                    <ChatPanel />
                    <PdfModal />
                    <AuthModal />

                    <ScrollToTop />
                </ThemeProvider>
            </body>
        </html>
    );
}
