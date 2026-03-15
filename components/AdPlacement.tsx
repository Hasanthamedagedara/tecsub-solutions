"use client";

import { useEffect, useState } from "react";

export type AdFormat =
    | "300x250"
    | "728x90"
    | "160x600"
    | "468x60"
    | "320x100"
    | "banner";

interface AdPlacementProps {
    format: AdFormat;
    className?: string;
    mobileOnly?: boolean;
    webOnly?: boolean;
}

/* ── Adsterra Banner Ad Configs ── 
   Placeholder keys are used. 
   Replace with the actual keys from the dashboard when requested.
*/
const ADS: Record<AdFormat, { key: string; w: number; h: number }> = {
    "300x250": { key: "YOUR_300X250_ID_HERE", w: 300, h: 250 },
    "728x90": { key: "YOUR_728X90_ID_HERE", w: 728, h: 90 },
    "160x600": { key: "YOUR_160X600_ID_HERE", w: 160, h: 600 },
    "468x60": { key: "YOUR_468X60_ID_HERE", w: 468, h: 60 },
    "320x100": { key: "YOUR_320X100_ID_HERE", w: 320, h: 100 },
    "banner": { key: "YOUR_728X90_ID_HERE", w: 728, h: 90 },
};

/* ── Generates a self-contained HTML doc for banner ads ── */
function bannerHtml(ad: { key: string; w: number; h: number }) {
    return `<!DOCTYPE html>
<html><head><style>*{margin:0;padding:0;overflow:hidden}body{display:flex;align-items:center;justify-content:center;min-height:100%;background:transparent}</style></head>
<body>
<script type="text/javascript">
    atOptions = {
        'key' : '${ad.key}',
        'format' : 'iframe',
        'height' : ${ad.h},
        'width' : ${ad.w},
        'params' : {}
    };
</script>
<script type="text/javascript" src="https://www.highperformanceformat.com/${ad.key}/invoke.js"></script>
</body></html>`;
}

export default function AdPlacement({ format, className = "", mobileOnly = false, webOnly = false }: AdPlacementProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div style={{ width: ADS[format].w, height: ADS[format].h }} className={`bg-gray-800/20 animate-pulse mx-auto ${className}`} />;

    const adConfig = ADS[format];

    // Build the responsive class constraints as requested by the user
    let visibilityClass = "";
    if (webOnly) visibilityClass = "hidden sm:flex"; // Hide on mobile, show on web
    if (mobileOnly) visibilityClass = "flex sm:hidden"; // Show on mobile, hide on web

    return (
        <div
            data-ad-format={format}
            className={`flex items-center justify-center mx-auto ${visibilityClass} ${className}`}
            style={{ maxWidth: `${adConfig.w}px`, width: "100%", overflow: "hidden" }}
        >
            <iframe
                srcDoc={bannerHtml(adConfig)}
                width={adConfig.w}
                height={adConfig.h}
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
