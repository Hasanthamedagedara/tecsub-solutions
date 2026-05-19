import type { Metadata, Viewport } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import ScrollToTop from "@/components/ScrollToTop";
import LayoutBars from "@/components/LayoutBars";
import ChatPanel from "@/components/ChatPanel";
import PdfModal from "@/components/PdfModal";
import AuthModal from "@/components/AuthModal";
import Sidebar from "@/components/Sidebar";
import { Roboto, Noto_Sans_Sinhala, Noto_Sans_Tamil } from "next/font/google";

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700", "900"],
    variable: "--font-roboto",
    display: "swap",
});

const notoSinhala = Noto_Sans_Sinhala({
    subsets: ["sinhala"],
    weight: ["400", "600"],
    variable: "--font-noto-sinhala",
    display: "swap",
});

const notoTamil = Noto_Sans_Tamil({
    subsets: ["tamil"],
    weight: ["400", "600"],
    variable: "--font-noto-tamil",
    display: "swap",
});


export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#0A0A0B",
};


export const metadata: Metadata = {
    metadataBase: new URL("https://tecsub.online"),
    title: {
        default: "Tecsub Solutions | Software Development & AI Tools Sri Lanka",
        template: "%s | Tecsub Solutions",
    },
    description:
        "Tecsub Solutions offers high-performance software and AI writing tools in Sri Lanka. Enhance your digital workspace today.",
    keywords: [
        "Tecsub Solutions", "Software Development Sri Lanka", "AI Tools Colombo", "Web Development Colombo", 
        "Online Utility Tools", "Bilingual Side-by-Side PDF Merger", "Sinhala Typing Online", "Singlish Unicode Converter",
        "AI Content Humanizer Sri Lanka", "Text Summarizer AI", "PDF split and merge", "Image background remover online",
        "TECSUB POSS ERP", "Mobile App development Sri Lanka", "Sri Lanka Tech Products", "YouTube video tag extractor",
        "Sinhala chatbot AI", "Tamil Keyboard input", "Free online image resizer", "PDF metadata editor"
    ],
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
        languages: {
            "en": "https://tecsub.online/?lang=en",
            "si-LK": "https://tecsub.online/?lang=si",
            "ta-LK": "https://tecsub.online/?lang=ta",
            "x-default": "https://tecsub.online",
        },
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/apple-icon.png",
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Tecsub Solutions",
    "image": "https://tecsub.online/logo/tecsub.jpg",
    "@id": "https://tecsub.online/#localbusiness",
    "url": "https://tecsub.online",
    "telephone": "+94726128749",
    "email": "tecsubsolutions@gmail.com",
    "priceRange": "$$",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "No. 45, Kandy Road",
        "addressLocality": "Kurunegala",
        "postalCode": "60000",
        "addressCountry": "LK"
    },
    "geo": {
        "@type": "GeoCoordinates",
        "latitude": 7.4817,
        "longitude": 80.3609
    },
    "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
    },
    "sameAs": [
        "https://www.facebook.com/Hasanthamedagedara",
        "https://www.youtube.com/@tecsub.0",
        "https://whatsapp.com/channel/0029Vb6cPkODuMRkMeIaT31F",
        "https://t.me/Hasanthamedagedra",
        "https://x.com/tecsubsolutions",
        "https://linkedin.com/company/tecsubsolutions",
        "https://instagram.com/tecsubsolutions"
    ],
    "description": "Tecsub Solutions is a leading software development provider in Sri Lanka, specializing in AI-driven tools and high-performance applications."
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`dark ${roboto.variable} ${notoSinhala.variable} ${notoTamil.variable}`} suppressHydrationWarning>
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
