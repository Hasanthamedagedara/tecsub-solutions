"use client";

/* ─── Ad Placement Component ─── 
   Non-intrusive ad spaces for Adsterra / Monetag integration.
   Supports: Banner, Native, In-Content, Sidebar
   These render placeholder containers where ad scripts inject content.
*/

import { useEffect, useRef } from "react";

type AdFormat = "banner" | "native" | "in-content" | "sidebar" | "smart-link";

interface AdPlacementProps {
    format: AdFormat;
    className?: string;
}

export default function AdPlacement({ format, className = "" }: AdPlacementProps) {
    const adRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // In production, Adsterra/Monetag scripts auto-detect these containers
        // via data attributes and inject ads. No manual script loading needed.
        // The ad networks' head scripts handle the injection automatically.
    }, []);

    const formatConfig: Record<AdFormat, { height: string; label: string }> = {
        "banner": { height: "h-[90px] sm:h-[90px]", label: "728×90 Banner" },
        "native": { height: "min-h-[250px]", label: "Native Ad" },
        "in-content": { height: "h-[250px] sm:h-[280px]", label: "In-Content Ad" },
        "sidebar": { height: "h-[600px]", label: "Sidebar Ad" },
        "smart-link": { height: "h-0", label: "" },
    };

    // SmartLink ads are invisible — they work via onclick/direct traffic
    if (format === "smart-link") {
        return (
            <div
                ref={adRef}
                data-ad-format="smart-link"
                data-ad-network="adsterra-monetag"
                className="hidden"
            />
        );
    }

    const config = formatConfig[format];

    return (
        <div
            ref={adRef}
            data-ad-format={format}
            data-ad-network="adsterra-monetag"
            className={`relative ${config.height} rounded-xl overflow-hidden ${className}`}
            style={{
                background: "linear-gradient(135deg, rgba(0,229,255,0.02) 0%, rgba(0,114,188,0.02) 100%)",
                border: "1px dashed rgba(0,229,255,0.08)",
            }}
        >
            {/* Placeholder — replaced by ad network script in production */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] uppercase tracking-[0.2em] opacity-20" style={{ color: "var(--text-secondary)" }}>
                    {config.label}
                </span>
            </div>
        </div>
    );
}

/* ─── Popunder / Social Bar / Push Notification Script Container ─── 
   These ad types are loaded via <script> tags in the <head>.
   They auto-run and don't need visible containers.
   
   In production, add these to app/layout.tsx <head>:
   
   <!-- Adsterra Popunder -->
   <script data-cfasync="false" src="//your-adsterra-popunder-url.js"></script>
   
   <!-- Adsterra Social Bar -->  
   <script data-cfasync="false" src="//your-adsterra-social-bar-url.js"></script>
   
   <!-- Monetag MultiTag (auto-optimization) -->
   <script data-cfasync="false" src="//your-monetag-multitag-url.js"></script>
   
   <!-- Push Notification -->
   <script data-cfasync="false" src="//your-push-notification-url.js"></script>
*/
