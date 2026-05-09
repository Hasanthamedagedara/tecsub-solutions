"use client";

import { usePathname } from "next/navigation";
import FilterChipBar from "./FilterChipBar";
import NewsTicker from "./NewsTicker";

const SHOW_ON_ROUTES = [
    "/",
    "/explore",
    "/news",
    "/videos",
    "/prompts",
    "/courses",
    "/apps",
    "/tools",
    "/software",
    "/images",
    "/movies",
    "/books",
    "/wallpapers",
    "/assets"
];

export default function LayoutBars() {
    const pathname = usePathname();
    
    // Exact match for the list of main discovery pages
    const show = SHOW_ON_ROUTES.includes(pathname);

    if (!show) return null;

    return (
        <>
            <FilterChipBar />
            <NewsTicker />
        </>
    );
}
