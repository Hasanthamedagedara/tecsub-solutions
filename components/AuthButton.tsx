import React from 'react';

export type AuthButtonVariant = 'primary' | 'outline';

export interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: AuthButtonVariant;
    icon?: React.ReactNode;
    isLoading?: boolean;
    children: React.ReactNode;
}

export default function AuthButton({
    variant = 'primary',
    icon,
    isLoading = false,
    children,
    className = '',
    disabled,
    ...props
}: AuthButtonProps) {
    const baseStyles = "relative w-full py-[14px] px-6 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ease-out overflow-hidden transform active:scale-[0.98]";

    const variants = {
        primary: "bg-white text-black hover:bg-gray-100 shadow-[0_4px_14px_0_rgba(255,255,255,0.2)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.3)]",
        outline: "bg-transparent border border-[rgba(255,255,255,0.2)] text-white hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.4)]"
    };

    const currentVariantStyle = variants[variant];
    const disabledStyle = (disabled || isLoading) ? "opacity-50 cursor-not-allowed transform-none shadow-none hover:shadow-none" : "";

    return (
        <button
            disabled={disabled || isLoading}
            className={`\${baseStyles} \${currentVariantStyle} \${disabledStyle} \${className}`}
            {...props}
        >
            {/* Loading Spinner */}
            {isLoading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current absolute left-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}

            {/* Optional Left Icon */}
            {!isLoading && icon && (
                <span className="absolute left-6 flex items-center justify-center w-6 h-6">
                    {icon}
                </span>
            )}

            {/* Button Text */}
            <span className={`\${icon || isLoading ? 'pl-8' : ''} tracking-wide`}>
                {children}
            </span>
        </button>
    );
}
