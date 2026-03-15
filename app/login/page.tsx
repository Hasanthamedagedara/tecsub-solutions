"use client";

import { useEffect } from "react";

export default function LoginPage() {
    /* Auto-open the AuthModal on mount */
    useEffect(() => {
        window.dispatchEvent(new Event("tecsub-open-auth"));
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--yt-bg)" }}>
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--yt-text-primary)" }}>
                    Welcome Back
                </h1>
                <p className="text-sm" style={{ color: "var(--yt-text-secondary)" }}>
                    Log in to your Tecsub account
                </p>
            </div>
        </div>
    );
}
