"use client";
import { useState, useEffect, useCallback } from "react";

/**
 * Reads published admin content from localStorage and merges with hardcoded defaults.
 * This connects the admin panel to the live website — like YouTube Studio controls a channel.
 */

export type AdminItem = {
    id: string; title: string; type: string;
    status: "published" | "draft" | "archived";
    category: string; author: string; createdAt: string; description?: string;
};

/** Returns all published items for a given admin tab key */
export function useAdminContent(tabKey: string): AdminItem[] {
    const [items, setItems] = useState<AdminItem[]>([]);

    const load = useCallback(() => {
        try {
            const raw = localStorage.getItem(`tecsub-admin-${tabKey}`);
            if (raw) {
                const parsed: AdminItem[] = JSON.parse(raw);
                setItems(parsed.filter(i => i.status === "published"));
            } else {
                setItems([]);
            }
        } catch { setItems([]); }
    }, [tabKey]);

    useEffect(() => {
        load();
        // Listen for changes from admin panel (same tab or cross-tab)
        const onStorage = (e: StorageEvent) => {
            if (e.key === `tecsub-admin-${tabKey}`) load();
        };
        window.addEventListener("storage", onStorage);

        // Also poll every 2s for same-tab updates (storage event doesn't fire in same tab)
        const interval = setInterval(load, 2000);

        return () => {
            window.removeEventListener("storage", onStorage);
            clearInterval(interval);
        };
    }, [tabKey, load]);

    return items;
}

/** Convert admin items to news format for TechNews component */
export function adminToNews(items: AdminItem[]) {
    const colors = ["#00E5FF", "#FF6B6B", "#FBBF24", "#34D399", "#818CF8", "#F472B6"];
    return items.map((item, i) => ({
        title: item.title,
        summary: item.description || "Published from admin panel",
        fullContent: item.description || item.title,
        category: item.category,
        date: item.createdAt,
        color: colors[i % colors.length],
    }));
}

/** Convert admin items to video format for ContentSections */
export function adminToVideos(items: AdminItem[]) {
    return items.map(item => ({
        id: item.description?.match(/[\w-]{11}/)?.[0] || "dQw4w9WgXcQ", // extract YouTube ID from description or use placeholder
        title: item.title,
    }));
}

/** Convert admin items to software download format */
export function adminToDownloads(items: AdminItem[]) {
    return items.map(item => ({
        name: item.title,
        description: item.description || "Added via admin panel",
        category: item.category,
        version: "1.0",
        size: "—",
        url: "#",
        icon: "📦",
    }));
}

/** Convert admin items to course format */
export function adminToCourses(items: AdminItem[]) {
    return items.map(item => ({
        title: item.title,
        description: item.description || "Course added from admin",
        price: "Free",
        duration: "—",
        level: "All Levels" as const,
        modules: [],
        icon: "📚",
    }));
}

/** Convert admin items to AI prompt format */
export function adminToPrompts(items: AdminItem[]) {
    return items.map(item => ({
        title: item.title,
        description: item.description || "Prompt added from admin",
        category: item.category,
        prompt: item.description || item.title,
        icon: "🤖",
        color: "#00E5FF",
    }));
}
