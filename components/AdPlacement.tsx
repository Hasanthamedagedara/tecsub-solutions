"use client";

/* ─── Ad Placement Component ─── 
   Integrates real Adsterra ad codes.
   - "banner": 728×90 on desktop (≥768px), 320×50 on mobile (<768px)
   - "native" / "in-content": Native ads script
   - "smart-link": Hidden, no visual container
*/

import { useEffect, useRef, useState } from "react";

type AdFormat = "banner" | "native" | "in-content" | "sidebar" | "smart-link";

interface AdPlacementProps {
    format: AdFormat;
    className?: string;
}

// Counter to generate unique IDs for each native ad instance
let nativeAdCounter = 0;

export default function AdPlacement({ format, className = "" }: AdPlacementProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [ready, setReady] = useState(false);
    const instanceId = useRef<number>(0);

    // Assign unique ID on mount
    useEffect(() => {
        if (format === "native" || format === "in-content") {
            instanceId.current = ++nativeAdCounter;
        }
    }, [format]);

    // Detect screen size on client
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        setReady(true);
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // Inject ad scripts once ready
    useEffect(() => {
        if (!ready || !containerRef.current) return;

        const container = containerRef.current;
        // Clear previous ad content
        container.innerHTML = "";

        if (format === "banner") {
            if (!isMobile) {
                // ── Desktop: 728×90 banner ──
                const atScript = document.createElement("script");
                atScript.text = `
                    atOptions = {
                        'key' : 'fab4548b5efa7488bcf199573cb1b9d3',
                        'format' : 'iframe',
                        'height' : 90,
                        'width' : 728,
                        'params' : {}
                    };
                `;
                const invokeScript = document.createElement("script");
                invokeScript.src = "https://www.highperformanceformat.com/fab4548b5efa7488bcf199573cb1b9d3/invoke.js";

                container.appendChild(atScript);
                container.appendChild(invokeScript);
            } else {
                // ── Mobile: 320×50 banner ──
                const atScript = document.createElement("script");
                atScript.text = `
                    atOptions = {
                        'key' : '17d6c09433ad372ba0f0e5dc446424f6',
                        'format' : 'iframe',
                        'height' : 50,
                        'width' : 320,
                        'params' : {}
                    };
                `;
                const invokeScript = document.createElement("script");
                invokeScript.src = "https://www.highperformanceformat.com/17d6c09433ad372ba0f0e5dc446424f6/invoke.js";

                container.appendChild(atScript);
                container.appendChild(invokeScript);
            }
        } else if (format === "native" || format === "in-content") {
            // ── Native ads ──
            const uniqueContainerId = `container-5f7fc104d149ac94bf41e2d48a59715c-${instanceId.current}`;

            const nativeDiv = document.createElement("div");
            nativeDiv.id = uniqueContainerId;
            container.appendChild(nativeDiv);

            const script = document.createElement("script");
            script.async = true;
            script.setAttribute("data-cfasync", "false");
            script.src = "https://pl28783703.effectivegatecpm.com/5f7fc104d149ac94bf41e2d48a59715c/invoke.js";
            container.appendChild(script);
        }
    }, [format, isMobile, ready]);

    // SmartLink ads are invisible
    if (format === "smart-link") {
        return <div ref={containerRef} className="hidden" />;
    }

    // Determine container sizing
    const sizeStyles: React.CSSProperties =
        format === "banner"
            ? isMobile
                ? { minHeight: "50px", maxWidth: "320px" }
                : { minHeight: "90px", maxWidth: "728px" }
            : { minHeight: "250px" };

    return (
        <div
            ref={containerRef}
            data-ad-format={format}
            className={`relative flex items-center justify-center overflow-hidden mx-auto ${className}`}
            style={{
                ...sizeStyles,
                width: "100%",
                borderRadius: "0.75rem",
            }}
        />
    );
}
