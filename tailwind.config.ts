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
                tecsubNavy: "#0A0A0B",
                tecsubCyan: "#00E5FF",
                tecsubBlue: "#0072BC",
                techWhite: "#FBF6F6",
                glass: {
                    dark: "rgba(10, 10, 11, 0.75)",
                    light: "rgba(255, 255, 255, 0.75)",
                },
                // Admin panel colors
                "admin-primary": "#2b4bee",
                "admin-primary-hover": "#1e3aa0",
                "admin-bg-dark": "#0f1115",
                "admin-bg-card": "#1a1d23",
                "admin-bg-lighter": "#232936",
                "admin-text": "#f8fafc",
                "admin-text-secondary": "#94a3b8",
                "admin-border": "#334155",
                "admin-success": "#10b981",
                "admin-warning": "#f59e0b",
                "admin-danger": "#ef4444",
            },
            fontFamily: {
                bebas: ['"Bebas Neue"', "sans-serif"],
                inter: ['"Inter"', "sans-serif"],
                "space-grotesk": ['"Space Grotesk"', "sans-serif"],
            },
            dropShadow: {
                glow: "0 0 20px rgba(0, 229, 255, 0.5)",
                "glow-lg": "0 0 40px rgba(0, 229, 255, 0.7)",
                text: "0 5px 15px rgba(0,0,0,0.5)",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-20px)" },
                },
                pulse_glow: {
                    "0%, 100%": { boxShadow: "0 0 20px rgba(0,229,255,0.3)" },
                    "50%": { boxShadow: "0 0 60px rgba(0,229,255,0.8)" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
                fadeInUp: {
                    "0%": { opacity: "0", transform: "translateY(30px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
            animation: {
                float: "float 6s ease-in-out infinite",
                pulse_glow: "pulse_glow 3s ease-in-out infinite",
                shimmer: "shimmer 3s ease-in-out infinite",
                fadeInUp: "fadeInUp 0.6s ease-out forwards",
            },
            backdropBlur: {
                xs: "2px",
            },
        },
    },
    plugins: [],
};

export default config;
