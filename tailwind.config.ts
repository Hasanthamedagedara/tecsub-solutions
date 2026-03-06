import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // YouTube dark theme palette
                "yt-bg": "#0f0f0f",
                "yt-bg-secondary": "#272727",
                "yt-bg-elevated": "#383838",
                "yt-bg-surface": "#1a1a1a",
                "yt-text": "#f1f1f1",
                "yt-text-secondary": "#aaaaaa",
                "yt-accent": "#3ea6ff",
                "yt-accent-hover": "#65b8ff",
                "yt-red": "#ff0000",
                "yt-border": "#3f3f3f",
                "yt-success": "#2ba640",
                "yt-warning": "#f59e0b",
                "yt-danger": "#ff4e45",
                // Legacy compat
                tecsubNavy: "#0f0f0f",
                tecsubCyan: "#3ea6ff",
                tecsubBlue: "#065fd4",
                techWhite: "#f1f1f1",
            },
            fontFamily: {
                roboto: ['"Roboto"', '"Arial"', "sans-serif"],
                inter: ['"Inter"', "sans-serif"],
                bebas: ['"Bebas Neue"', "sans-serif"],
            },
            borderRadius: {
                yt: "12px",
                "yt-sm": "8px",
                "yt-full": "18px",
            },
            keyframes: {
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
                fadeInUp: {
                    "0%": { opacity: "0", transform: "translateY(15px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
            animation: {
                shimmer: "shimmer 1.6s ease-in-out infinite",
                fadeInUp: "fadeInUp 0.4s ease-out forwards",
            },
        },
    },
    plugins: [],
};

export default config;
