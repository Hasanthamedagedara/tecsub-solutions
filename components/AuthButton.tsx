"use client";

import React from "react";

interface AuthButtonProps {
    variant?: "primary" | "secondary";
    icon?: React.ReactNode;
    children: React.ReactNode;
    onClick?: () => void;
    isLoading?: boolean;
    className?: string;
}

export default function AuthButton({
    variant = "primary",
    icon,
    children,
    onClick,
    isLoading = false,
    className = ""
}: AuthButtonProps) {

    const baseStyles = "w-full min-h-[50px] px-6 rounded-full flex items-center justify-center font-medium transition-all duration-300 relative group overflow-hidden shadow-sm hover:shadow-md active:scale-95";

    // Smooth, premium Tailwind styling as requested by the user
    // Secondary matches iOS/Google white minimal cards
    // Primary matches sleek dark mode/branding
    const variants = {
        primary: "bg-[#111] text-white hover:bg-[#222] border border-[#333] hover:border-[#555]",
        secondary: "bg-white border border-gray-200 text-black hover:bg-gray-50 hover:border-gray-300"
    };

    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            className={`\${baseStyles} \${variants[variant]} \${isLoading ? 'opacity-70 cursor-wait' : ''} \${className}`}
            aria-label={typeof children === 'string' ? children : "Authentication button"}
        >
            {isLoading ? (
                <svg className="animate-spin h-5 w-5 absolute" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                <>
                    {icon && (
                        <span className="absolute left-6 flex items-center justify-center w-6 h-6 transition-transform group-hover:scale-110">
                            {icon}
                        </span>
                    )}
                    <span className="flex-grow text-center">{children}</span>
                </>
            )}
        </button>
    );
}
