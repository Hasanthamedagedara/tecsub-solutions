"use client";

/* ─── Adsterra Ad Placement Component ───
   Each ad renders inside its own <iframe srcdoc> so that
   the global `atOptions` variable doesn't get overwritten
   by other ad instances on the same page.
   
   Formats:
   - "banner"        → 728×90 (desktop) / 320×50 (mobile)
   - "banner-md"     → 468×60 (desktop) / 320×50 (mobile)
   - "rectangle"     → 300×250
   - "sidebar"       → 160×600
   - "sidebar-short" → 160×300
   - "native"        → Native ads (3:1)
   - "in-content"    → Native ads (alias)
*/

import { useEffect, useState } from "react";

type AdFormat =
    | "banner"
    | "banner-md"
    | "rectangle"
    | "sidebar"
    | "sidebar-short"
    | "native"
    | "in-content";

interface AdPlacementProps {
    format: AdFormat;
    className?: string;
}

/* ── Banner ad configs ── */
const ADS = {
    "728x90": { key: "fab4548b5efa7488bcf199573cb1b9d3", w: 728, h: 90 },
    "320x50": { key: "17d6c09433ad372ba0f0e5dc446424f6", w: 320, h: 50 },
    "468x60": { key: "d313f4b4ab4a261aaa073a211f1ba03b", w: 468, h: 60 },
    "300x250": { key: "8d784274202ca73423a441cf4d6efadf", w: 300, h: 250 },
    "160x600": { key: "698894df0c3830dd82a1a58e0c876d4b", w: 160, h: 600 },
    "160x300": { key: "79e0924f819401dd05b1d3fad84e8937", w: 160, h: 300 },
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

/* ── Generates a self-contained HTML doc for native ads ── */
function nativeHtml() {
    return `<!DOCTYPE html>
<html><head><style>*{margin:0;padding:0}body{background:transparent}</style></head>
<body>
<script async data-cfasync="false" src="https://pl28783703.effectivegatecpm.com/5f7fc104d149ac94bf41e2d48a59715c/invoke.js"><\/script>
<div id="container-5f7fc104d149ac94bf41e2d48a59715c"></div>
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
    let isNative = false;
    let frameW = 0;
    let frameH = 0;

    switch (format) {
        case "banner":
            adConfig = isMobile ? ADS["320x50"] : ADS["728x90"];
            break;
        case "banner-md":
            adConfig = isMobile ? ADS["320x50"] : ADS["468x60"];
            break;
        case "rectangle":
            adConfig = ADS["300x250"];
            break;
        case "sidebar":
            adConfig = ADS["160x600"];
            break;
        case "sidebar-short":
            adConfig = ADS["160x300"];
            break;
        case "native":
        case "in-content":
            isNative = true;
            frameW = isMobile ? 320 : 728;
            frameH = 280;
            break;
    }

    if (adConfig) {
        frameW = adConfig.w;
        frameH = adConfig.h;
    }

    const srcDoc = isNative ? nativeHtml() : adConfig ? bannerHtml(adConfig) : "";

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
