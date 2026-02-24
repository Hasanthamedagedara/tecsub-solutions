"use client";

/* ─── Ad Placement Component ─── 
   Integrates real Adsterra ad codes.
   - "banner": 728×90 on desktop, 320×50 on mobile
   - "native": Native ads script
   - "in-content": Native ads (same as native, placed between content)
   - "smart-link": Hidden, no visual container
*/

import { useEffect, useRef, useState } from "react";

type AdFormat = "banner" | "native" | "in-content" | "sidebar" | "smart-link";

interface AdPlacementProps {
    format: AdFormat;
    className?: string;
}

export default function AdPlacement({ format, className = "" }: AdPlacementProps) {
    const adRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const loaded = useRef(false);

    // Detect screen size
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // Inject ad scripts
    useEffect(() => {
        if (!adRef.current || loaded.current) return;
        loaded.current = true;

        const container = adRef.current;

        if (format === "banner") {
            // Banner ads: 728×90 for desktop, 320×50 for mobile
            const atScript = document.createElement("script");
            const invokeScript = document.createElement("script");

            if (!isMobile) {
                // Desktop: 728×90
                atScript.text = `
                    atOptions = {
                        'key' : 'fab4548b5efa7488bcf199573cb1b9d3',
                        'format' : 'iframe',
                        'height' : 90,
                        'width' : 728,
                        'params' : {}
                    };
                `;
                invokeScript.src = "https://www.highperformanceformat.com/fab4548b5efa7488bcf199573cb1b9d3/invoke.js";
            } else {
                // Mobile: 320×50
                atScript.text = `
                    atOptions = {
                        'key' : '17d6c09433ad372ba0f0e5dc446424f6',
                        'format' : 'iframe',
                        'height' : 50,
                        'width' : 320,
                        'params' : {}
                    };
                `;
                invokeScript.src = "https://www.highperformanceformat.com/17d6c09433ad372ba0f0e5dc446424f6/invoke.js";
            }

            container.appendChild(atScript);
            container.appendChild(invokeScript);
        } else if (format === "native" || format === "in-content") {
            // Native ads
            const script = document.createElement("script");
            script.async = true;
            script.setAttribute("data-cfasync", "false");
            script.src = "https://pl28783703.effectivegatecpm.com/5f7fc104d149ac94bf41e2d48a59715c/invoke.js";

            const nativeDiv = document.createElement("div");
            nativeDiv.id = "container-5f7fc104d149ac94bf41e2d48a59715c";

            container.appendChild(script);
            container.appendChild(nativeDiv);
        }

        return () => {
            // Cleanup on unmount
            if (container) {
                container.innerHTML = "";
            }
        };
    }, [format, isMobile]);

    // SmartLink ads are invisible
    if (format === "smart-link") {
        return (
            <div
                ref={adRef}
                data-ad-format="smart-link"
                className="hidden"
            />
        );
    }

    // Height config
    const heightClass =
        format === "banner"
            ? isMobile
                ? "min-h-[50px]"
                : "min-h-[90px]"
            : "min-h-[250px]";

    return (
        <div
            ref={adRef}
            data-ad-format={format}
            className={`relative ${heightClass} flex items-center justify-center overflow-hidden ${className}`}
            style={{
                borderRadius: "0.75rem",
            }}
        />
    );
}
