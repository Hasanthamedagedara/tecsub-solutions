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
        default: "Tecsub Solutions | Software Development & AI Tools Sri Lanka",
        template: "%s | Tecsub Solutions",
    },
    description:
        "Tecsub Solutions provides high-performance software development, AI writing tools, and engineering solutions in Sri Lanka. Explore our next-gen applications.",
    keywords: ["Tecsub Solutions", "Software Development Sri Lanka", "AI Tools", "Web Development", "Technology", "Engineering", "Online Tools", "Sri Lanka Tech"],
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
        title: "Tecsub Solutions | Engineering the Future",
        description: "Leading software development and AI solutions provider in Sri Lanka.",
        url: "https://tecsub.online",
        siteName: "Tecsub Solutions",
        images: [{ url: "https://tecsub.online/logo/tecsub.jpg", width: 1200, height: 630, alt: "Tecsub Solutions Logo" }],
        type: "website",
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: "Tecsub Solutions | Engineering the Future",
        description: "High-performance software and AI tools from Tecsub Solutions.",
        images: ["https://tecsub.online/logo/tecsub.jpg"],
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

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Tecsub Solutions",
    "url": "https://tecsub.online",
    "logo": "https://tecsub.online/logo/tecsub.jpg",
    "sameAs": [
        "https://www.facebook.com/Hasanthamedagedara",
        "https://www.youtube.com/@tecsub.0",
        "https://whatsapp.com/channel/0029Vb6cPkODuMRkMeIaT31F",
        "https://t.me/Hasanthamedagedra"
    ],
    "description": "Tecsub Solutions is a leading software development provider in Sri Lanka, specializing in AI-driven tools and high-performance applications."
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
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
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
