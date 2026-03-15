"use client";

import { useEffect } from "react";
import AuthModal from "@/components/AuthModal";

export default function SignupPage() {
    /* Auto-open the AuthModal on mount */
    useEffect(() => {
        window.dispatchEvent(new Event("tecsub-open-auth"));
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--yt-bg)" }}>
            {/* The AuthModal is already in layout.tsx and will be triggered by the event above */}
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--yt-text-primary)" }}>
                    Join Tecsub
                </h1>
                <p className="text-sm" style={{ color: "var(--yt-text-secondary)" }}>
                    Sign up to access all features
                </p>
            </div>
        </div>
    );
}
