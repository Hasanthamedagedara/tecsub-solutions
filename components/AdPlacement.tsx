"use client";

/* ─── Adsterra Ad Placement Component ───
   Each ad renders inside its own <iframe srcdoc> so that
   the global `atOptions` variable doesn't get overwritten
   by other ad instances on the same page.
   
   Formats:
   - "banner"    → 728×90 (desktop) / 320×50 (mobile)
   - "banner-md" → 468×60 (desktop) / 320×50 (mobile)
*/

import { useEffect, useState } from "react";

type AdFormat =
    | "banner"
    | "banner-md";

interface AdPlacementProps {
    format: AdFormat;
    className?: string;
}

/* ── Banner ad configs ── */
const ADS = {
    "728x90": { key: "fab4548b5efa7488bcf199573cb1b9d3", w: 728, h: 90 },
    "320x50": { key: "17d6c09433ad372ba0f0e5dc446424f6", w: 320, h: 50 },
    "468x60": { key: "d313f4b4ab4a261aaa073a211f1ba03b", w: 468, h: 60 },
};

/* ── Generates a self-contained HTML doc for banner ads ── */
function bannerHtml(ad: { key: string; w: number; h: number }) {
    return `<!DOCTYPE html>
<html><head><style>*{margin:0;padding:0;overflow:hidden}body{display:flex;align-items:center;justify-content:center;min-height:100%;background:transparent}</style></head>
<body>
<script>atOptions={'key':'${ad.key}','format':'iframe','height':${ad.h},'width':${ad.w},'params':{}};<\/script>
<script src="https://www.highperformanceformat.com/${ad.key}/invoke.js"><\/script>
</body></html>`;
}



export default function AdPlacement({ format, className = "" }: AdPlacementProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        setMounted(true);
        const onResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    if (!mounted) return null;

    /* ── Determine which ad config & dimensions to use ── */
    let adConfig: { key: string; w: number; h: number } | null = null;
    let frameW = 0;
    let frameH = 0;

    switch (format) {
        case "banner":
            adConfig = isMobile ? ADS["320x50"] : ADS["728x90"];
            break;
        case "banner-md":
            adConfig = isMobile ? ADS["320x50"] : ADS["468x60"];
            break;
    }

    if (adConfig) {
        frameW = adConfig.w;
        frameH = adConfig.h;
    }

    const srcDoc = adConfig ? bannerHtml(adConfig) : "";

    return (
        <div
            data-ad-format={format}
            className={`flex items-center justify-center mx-auto ${className}`}
            style={{ maxWidth: `${frameW}px`, width: "100%" }}
        >
            <iframe
                srcDoc={srcDoc}
                width={frameW}
                height={frameH}
                scrolling="no"
                style={{
                    border: "none",
                    overflow: "hidden",
                    display: "block",
                    maxWidth: "100%",
                    background: "transparent",
                }}
                sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                title={`ad-${format}`}
            />
        </div>
    );
}
