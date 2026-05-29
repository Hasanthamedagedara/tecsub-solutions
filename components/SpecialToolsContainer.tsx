"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SpecialToolsContainer() {
    const searchParams = useSearchParams();
    const [tab, setTab] = useState("card");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const tabParam = searchParams.get("tab");
        if (tabParam) {
            setTab(tabParam);
        }
    }, [searchParams]);

    const iframeSrc = `/special-tools-iframe.html?tab=${tab}&embed=true`;

    return (
        <div className="min-h-screen text-[#f1f1f1]" style={{ background: "#0a0a0b" }}>
            <Navbar />

            <div className="pt-28 pb-12">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="relative w-full rounded-[2rem] border border-white/5 bg-[#121214]/60 backdrop-blur-md overflow-hidden shadow-2xl">
                        {/* Top styling bar */}
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500 opacity-60 z-10" />

                        {isLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0b]/85 z-20 transition-all duration-300">
                                <div className="w-12 h-12 border-4 border-white/5 border-t-emerald-500 rounded-full animate-spin mb-4" />
                                <div className="text-xs font-black uppercase tracking-widest text-[#666]">
                                    Loading Creative Workspace...
                                </div>
                            </div>
                        )}

                        <iframe
                            src={iframeSrc}
                            className="w-full border-0 min-h-[850px] h-[85vh] block relative z-10"
                            onLoad={() => setIsLoading(false)}
                            title="Tecsub Labs Creative Suite"
                            allow="autoplay; camera; clipboard-write; clipboard-read; web-share"
                        />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
