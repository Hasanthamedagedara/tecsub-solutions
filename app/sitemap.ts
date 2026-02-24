import { MetadataRoute } from "next";

const BASE_URL = "https://tecsubsolutions.com";

/**
 * Auto-generated sitemap covering all public pages.
 * Private routes (/admin, /payment) are excluded.
 * Dynamic routes like /course/[id] are expanded using known course IDs.
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    /* ── Static Pages ── */
    const staticRoutes = [
        { path: "/", priority: 1.0, freq: "daily" as const },
        { path: "/tools", priority: 0.8, freq: "weekly" as const },
        { path: "/tools/yt-data-grab", priority: 0.7, freq: "monthly" as const },
        { path: "/prompts", priority: 0.8, freq: "weekly" as const },
        { path: "/courses", priority: 0.8, freq: "weekly" as const },
        { path: "/apps", priority: 0.7, freq: "weekly" as const },
        { path: "/apps/mod", priority: 0.7, freq: "weekly" as const },
        { path: "/apps/new-releases", priority: 0.7, freq: "weekly" as const },
        { path: "/assets", priority: 0.6, freq: "monthly" as const },
        { path: "/shop", priority: 0.7, freq: "weekly" as const },
        { path: "/about", priority: 0.5, freq: "monthly" as const },
        { path: "/privacy policy", priority: 0.3, freq: "yearly" as const },
        { path: "/Terms", priority: 0.3, freq: "yearly" as const },
        { path: "/Refund", priority: 0.3, freq: "yearly" as const },
    ];

    /* ── Dynamic: Course pages (expand /course/[id] for IDs 0-9) ── */
    const courseIds = Array.from({ length: 10 }, (_, i) => i);

    const courseRoutes = courseIds.map((id) => ({
        url: `${BASE_URL}/course/${id}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
    }));

    /* ── Combine all ── */
    const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
        url: `${BASE_URL}${r.path}`,
        lastModified: now,
        changeFrequency: r.freq,
        priority: r.priority,
    }));

    return [...staticEntries, ...courseRoutes];
}
