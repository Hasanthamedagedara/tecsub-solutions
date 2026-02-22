"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "dark" | "light";
type Language = "en" | "si" | "ta";

interface AppContextType {
    theme: Theme;
    toggleTheme: () => void;
    language: Language;
    setLanguage: (lang: Language) => void;
}

const AppContext = createContext<AppContextType>({
    theme: "dark",
    toggleTheme: () => { },
    language: "en",
    setLanguage: () => { },
});

export function useAppContext() {
    return useContext(AppContext);
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>("dark");
    const [language, setLanguage] = useState<Language>("en");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Theme: check localStorage, then system preference
        const stored = localStorage.getItem("tecsub-theme") as Theme | null;
        if (stored) {
            setTheme(stored);
        } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
            setTheme("light");
        }

        // Language
        const storedLang = localStorage.getItem("tecsub-lang") as Language | null;
        if (storedLang) setLanguage(storedLang);

        // Listen for system theme changes
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = (e: MediaQueryListEvent) => {
            if (!localStorage.getItem("tecsub-theme")) {
                setTheme(e.matches ? "dark" : "light");
            }
        };
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const root = document.documentElement;
        root.classList.remove("dark", "light");
        root.classList.add(theme);
        localStorage.setItem("tecsub-theme", theme);
    }, [theme, mounted]);

    const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("tecsub-lang", lang);
    };

    if (!mounted) {
        return <div className="dark">{children}</div>;
    }

    return (
        <AppContext.Provider
            value={{ theme, toggleTheme, language, setLanguage: handleSetLanguage }}
        >
            {children}
        </AppContext.Provider>
    );
}
