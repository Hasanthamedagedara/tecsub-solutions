"use client";

/* ─── Adsterra Ad Placement Component ───
   Supports all Adsterra ad formats with responsive sizing.
   
   Formats:
   - "banner"      → 728×90 (desktop) / 320×50 (mobile)
   - "banner-md"   → 468×60 (medium banner)
   - "rectangle"   → 300×250 (in-content rectangle)
   - "sidebar"     → 160×600 (tall skyscraper)
   - "sidebar-short" → 160×300 (short sidebar)
   - "native"      → Native ads 3:1
   - "in-content"  → Native ads (alias, placed between content)
*/

import { useEffect, useRef, useState } from "react";

type AdFormat =
    | "banner"        // 728×90 desktop / 320×50 mobile
    | "banner-md"     // 468×60
    | "rectangle"     // 300×250
    | "sidebar"       // 160×600
    | "sidebar-short" // 160×300
    | "native"        // native ads
    | "in-content";   // native ads (alias)

interface AdPlacementProps {
    format: AdFormat;
    className?: string;
}

// Ad script configs
const AD_CONFIGS = {
    "728x90": {
        key: "fab4548b5efa7488bcf199573cb1b9d3",
        width: 728,
        height: 90,
    },
    "320x50": {
        key: "17d6c09433ad372ba0f0e5dc446424f6",
        width: 320,
        height: 50,
    },
    "468x60": {
        key: "d313f4b4ab4a261aaa073a211f1ba03b",
        width: 468,
        height: 60,
    },
    "300x250": {
        key: "8d784274202ca73423a441cf4d6efadf",
        width: 300,
        height: 250,
    },
    "160x600": {
        key: "698894df0c3830dd82a1a58e0c876d4b",
        width: 160,
        height: 600,
    },
    "160x300": {
        key: "79e0924f819401dd05b1d3fad84e8937",
        width: 160,
        height: 300,
    },
} as const;

const NATIVE_SCRIPT_URL = "https://pl28783703.effectivegatecpm.com/5f7fc104d149ac94bf41e2d48a59715c/invoke.js";
const NATIVE_CONTAINER_ID = "container-5f7fc104d149ac94bf41e2d48a59715c";

let instanceCounter = 0;

function injectBannerAd(
    container: HTMLElement,
    config: { key: string; width: number; height: number }
) {
    const optionsScript = document.createElement("script");
    optionsScript.text = `
        atOptions = {
            'key' : '${config.key}',
            'format' : 'iframe',
            'height' : ${config.height},
            'width' : ${config.width},
            'params' : {}
        };
    `;
    const invokeScript = document.createElement("script");
    invokeScript.src = `https://www.highperformanceformat.com/${config.key}/invoke.js`;

    container.appendChild(optionsScript);
    container.appendChild(invokeScript);
}

function injectNativeAd(container: HTMLElement, uniqueId: number) {
    const nativeDiv = document.createElement("div");
    nativeDiv.id = `${NATIVE_CONTAINER_ID}-${uniqueId}`;
    container.appendChild(nativeDiv);

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = NATIVE_SCRIPT_URL;
    container.appendChild(script);
}

export default function AdPlacement({ format, className = "" }: AdPlacementProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [ready, setReady] = useState(false);
    const uniqueId = useRef(++instanceCounter);

    // Detect screen size
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        setReady(true);
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // Inject scripts
    useEffect(() => {
        if (!ready || !containerRef.current) return;

        const container = containerRef.current;
        container.innerHTML = "";

        switch (format) {
            case "banner":
                injectBannerAd(container, isMobile ? AD_CONFIGS["320x50"] : AD_CONFIGS["728x90"]);
                break;
            case "banner-md":
                injectBannerAd(container, isMobile ? AD_CONFIGS["320x50"] : AD_CONFIGS["468x60"]);
                break;
            case "rectangle":
                injectBannerAd(container, AD_CONFIGS["300x250"]);
                break;
            case "sidebar":
                injectBannerAd(container, AD_CONFIGS["160x600"]);
                break;
            case "sidebar-short":
                injectBannerAd(container, AD_CONFIGS["160x300"]);
                break;
            case "native":
            case "in-content":
                injectNativeAd(container, uniqueId.current);
                break;
        }
    }, [format, isMobile, ready]);

    // Determine container sizing
    let sizeStyles: React.CSSProperties = {};

    switch (format) {
        case "banner":
            sizeStyles = isMobile
                ? { minHeight: "50px", maxWidth: "320px" }
                : { minHeight: "90px", maxWidth: "728px" };
            break;
        case "banner-md":
            sizeStyles = isMobile
                ? { minHeight: "50px", maxWidth: "320px" }
                : { minHeight: "60px", maxWidth: "468px" };
            break;
        case "rectangle":
            sizeStyles = { minHeight: "250px", maxWidth: "300px" };
            break;
        case "sidebar":
            sizeStyles = { minHeight: "600px", maxWidth: "160px" };
            break;
        case "sidebar-short":
            sizeStyles = { minHeight: "300px", maxWidth: "160px" };
            break;
        case "native":
        case "in-content":
            sizeStyles = { minHeight: "250px" };
            break;
    }

    return (
        <div
            ref={containerRef}
            data-ad-format={format}
            className={`relative flex items-center justify-center overflow-hidden mx-auto ${className}`}
            style={{ ...sizeStyles, width: "100%", borderRadius: "0.75rem" }}
        />
    );
}
