"use client";

import React, { useState } from "react";

/* ─── Built-in Social SVG Icons ─── */
const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const FacebookIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

const XIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const AppleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
);

/* ─── Variant & Size types ─── */
type ButtonVariant = "primary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";
type SocialProvider = "google" | "facebook" | "x" | "apple";

interface AuthButtonProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: React.ReactNode;
    socialProvider?: SocialProvider;
    children: React.ReactNode;
    onClick?: () => void;
    isLoading?: boolean;
    fullWidth?: boolean;
    className?: string;
}

const SOCIAL_ICONS: Record<SocialProvider, React.ReactNode> = {
    google: <GoogleIcon />,
    facebook: <FacebookIcon />,
    x: <XIcon />,
    apple: <AppleIcon />,
};

export default function AuthButton({
    variant = "primary",
    size = "md",
    icon,
    socialProvider,
    children,
    onClick,
    isLoading = false,
    fullWidth = true,
    className = "",
}: AuthButtonProps) {
    const [pressed, setPressed] = useState(false);

    const resolvedIcon = socialProvider ? SOCIAL_ICONS[socialProvider] : icon;

    const sizeClasses: Record<ButtonSize, string> = {
        sm: "min-h-[40px] px-4 text-sm gap-2",
        md: "min-h-[50px] px-6 text-base gap-3",
        lg: "min-h-[56px] px-8 text-lg gap-3",
    };

    const variantClasses: Record<ButtonVariant, string> = {
        primary:
            "bg-[#111] text-white hover:bg-[#222] border border-[#333] hover:border-[#555] shadow-[0_0_20px_rgba(0,0,0,0.3)]",
        outline:
            "bg-white/[0.03] backdrop-blur-sm text-white border border-white/10 hover:bg-white/[0.08] hover:border-white/20",
        ghost:
            "bg-transparent text-gray-400 hover:text-white hover:bg-white/[0.06] border border-transparent",
        danger:
            "bg-gradient-to-r from-red-600 to-rose-500 text-white border-none hover:from-red-500 hover:to-rose-400 shadow-[0_0_20px_rgba(239,68,68,0.2)]",
    };

    const baseStyles = [
        "rounded-full flex items-center justify-center font-medium",
        "transition-all duration-300 relative group overflow-hidden",
        "active:scale-[0.97] select-none",
        fullWidth ? "w-full" : "w-auto",
        sizeClasses[size],
        variantClasses[variant],
        isLoading ? "opacity-70 cursor-wait" : "cursor-pointer",
        className,
    ].join(" ");

    const ariaLabel =
        socialProvider
            ? `Sign in with ${socialProvider.charAt(0).toUpperCase() + socialProvider.slice(1)}`
            : typeof children === "string"
                ? children
                : "Authentication button";

    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className={baseStyles}
            aria-label={ariaLabel}
            onPointerDown={() => setPressed(true)}
            onPointerUp={() => setPressed(false)}
            onPointerLeave={() => setPressed(false)}
        >
            {/* Shimmer hover effect */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

            {isLoading ? (
                <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            ) : (
                <>
                    {resolvedIcon && (
                        <span
                            className={`flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${pressed ? "scale-90" : "group-hover:scale-110"
                                }`}
                            style={socialProvider ? { position: "absolute", left: size === "sm" ? 16 : 24 } : undefined}
                        >
                            {resolvedIcon}
                        </span>
                    )}
                    <span className={`flex-grow text-center ${resolvedIcon && socialProvider ? "" : ""}`}>
                        {children}
                    </span>
                </>
            )}
        </button>
    );
}
