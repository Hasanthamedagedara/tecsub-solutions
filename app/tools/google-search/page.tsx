"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdPlacement from "@/components/AdPlacement";

interface SearchQueryPreset {
    id: string;
    title: string;
    description: string;
    queryTemplate: string;
    category: "ideas" | "pain-points" | "lanka";
    icon: string;
}

const PRESETS: SearchQueryPreset[] = [
    {
        id: "new-ideas-reddit",
        title: "New App Ideas (Reddit)",
        description: "Find threads where users wish for an app that doesn't exist on the market.",
        queryTemplate: 'site:reddit.com ("wish there was an app for" OR "is there an app that" OR "someone should build an app") "[KEYWORD]"',
        category: "ideas",
        icon: "💡"
    },
    {
        id: "new-ideas-global",
        title: "Global App Ideas (Web-wide)",
        description: "Search forums and social networks for app requests while filtering out store listings.",
        queryTemplate: '"i need an app that" OR "looking for an app that does" OR "app idea" "[KEYWORD]" -site:play.google.com -site:apps.apple.com',
        category: "ideas",
        icon: "🌍"
    },
    {
        id: "pain-points-bugs",
        title: "Bugs & Frustrations",
        description: "Identify problems, crashes, and interface updates that users absolutely hate.",
        queryTemplate: 'site:reddit.com "[KEYWORD]" ("the app is down" OR "app keeps crashing" OR "worst update" OR "hate the new interface")',
        category: "pain-points",
        icon: "💥"
    },
    {
        id: "pain-points-alternatives",
        title: "Alternative Seekers",
        description: "Find users actively looking for better alternatives because of high prices or ads.",
        queryTemplate: 'site:reddit.com ("alternative to" OR "better than" OR "app like") "[KEYWORD]" ("sucks" OR "expensive" OR "ads")',
        category: "pain-points",
        icon: "🔄"
    },
    {
        id: "pain-points-monetization",
        title: "Ads & Paywall Backlash",
        description: "Target apps ruined by subscriptions, intrusive advertisements, or sudden paywalls.",
        queryTemplate: 'site:reddit.com "[KEYWORD]" ("too many ads" OR "paywall" OR "subscription is too expensive" OR "ruined by ads")',
        category: "pain-points",
        icon: "💸"
    },
    {
        id: "srilanka-ideas",
        title: "Sri Lanka App Ideas",
        description: "Uncover tools, websites, and service requests specifically in the Sri Lankan context.",
        queryTemplate: 'site:reddit.com/r/srilanka ("any app for" OR "is there a website to" OR "looking for a tool") "[KEYWORD]"',
        category: "lanka",
        icon: "🇱🇰"
    },
    {
        id: "srilanka-pain-points",
        title: "Sri Lanka App Complaints",
        description: "Track bad experiences, frustrations, and service failures for popular Sri Lankan services.",
        queryTemplate: 'site:reddit.com/r/srilanka ("app" OR "service") ("bad experience" OR "not working" OR "useless" OR "frustrated") "[KEYWORD]"',
        category: "lanka",
        icon: "⚠️"
    }
];

const SUGGESTED_KEYWORDS = ["delivery", "finance", "photo edit", "music", "lanka", "booking", "education"];

export default function GoogleSearchDorkGenerator() {
    const [keyword, setKeyword] = useState("");
    const [activeTab, setActiveTab] = useState<"all" | "ideas" | "pain-points" | "lanka">("all");
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleSearch = (query: string) => {
        const encoded = encodeURIComponent(query);
        window.open(`https://www.google.com/search?q=${encoded}`, "_blank");
    };

    const getQueryString = (template: string) => {
        const kw = keyword.trim() || "keyword";
        return template.replace("[KEYWORD]", kw);
    };

    const filteredPresets = PRESETS.filter(
        (preset) => activeTab === "all" || preset.category === activeTab
    );

    return (
        <div className="min-h-screen text-[#f1f1f1]" style={{ background: "#0a0a0b" }}>
            <Navbar />

            <div className="pt-32 pb-20 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4"
                        >
                            Advanced Market Research
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter">
                            GOOGLE <span className="text-blue-500">DORK</span> CODES
                        </h1>
                        <p className="text-[#888] text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                            Generate powerful Boolean search strings to extract custom feature requests, app complaints, bugs, and alternatives directly from Reddit and the web.
                        </p>
                    </div>

                    {/* Search Field */}
                    <div className="max-w-2xl mx-auto mb-10">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative flex items-center bg-[#111] rounded-2xl border border-white/10 p-2 overflow-hidden">
                                <span className="pl-4 text-white/30 text-lg">🔍</span>
                                <input
                                    type="text"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    placeholder="Enter your target niche/app keyword (e.g. delivery, finance)..."
                                    className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-sm md:text-base placeholder:text-white/20"
                                />
                                {keyword && (
                                    <button 
                                        onClick={() => setKeyword("")}
                                        className="text-white/40 hover:text-white mr-2 text-xs uppercase font-black"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Keyword suggestions */}
                        <div className="flex flex-wrap items-center gap-2 mt-4 pl-1">
                            <span className="text-xs text-[#555] font-black uppercase tracking-wider">Try:</span>
                            {SUGGESTED_KEYWORDS.map((kw) => (
                                <button
                                    key={kw}
                                    onClick={() => setKeyword(kw)}
                                    className="px-2.5 py-1 bg-white/5 border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/10 rounded text-xs transition-colors"
                                >
                                    {kw}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex justify-center border-b border-white/5 mb-10 max-w-md mx-auto">
                        {(["all", "ideas", "pain-points", "lanka"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all ${
                                    activeTab === tab
                                        ? "text-blue-500 border-blue-500"
                                        : "text-white/40 border-transparent hover:text-white/80"
                                }`}
                            >
                                {tab === "pain-points" ? "Pain Points" : tab === "lanka" ? "Sri Lanka" : tab}
                            </button>
                        ))}
                    </div>

                    {/* Main Query List */}
                    <div className="space-y-6">
                        <AnimatePresence mode="wait">
                            {filteredPresets.map((preset) => {
                                const currentQuery = getQueryString(preset.queryTemplate);
                                return (
                                    <motion.div
                                        key={preset.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="bg-[#161618] border border-white/5 rounded-3xl p-6 relative overflow-hidden transition-all hover:border-white/10 group"
                                    >
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 blur-[50px] -z-10 rounded-full" />
                                        
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-xl shrink-0">
                                                {preset.icon}
                                            </div>
                                            <div className="flex-1 space-y-4">
                                                <div>
                                                    <h3 className="text-base font-black uppercase tracking-tight text-white group-hover:text-blue-400 transition-colors">
                                                        {preset.title}
                                                    </h3>
                                                    <p className="text-xs text-[#888] mt-1">
                                                        {preset.description}
                                                    </p>
                                                </div>

                                                {/* Code Display */}
                                                <div className="relative">
                                                    <textarea
                                                        readOnly
                                                        value={currentQuery}
                                                        rows={2}
                                                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-3 text-xs font-mono text-blue-400 select-all outline-none resize-none leading-relaxed"
                                                    />
                                                    <button
                                                        onClick={() => handleCopy(currentQuery, preset.id)}
                                                        className="absolute top-3 right-3 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-white/60 hover:text-white"
                                                        title="Copy string to clipboard"
                                                    >
                                                        {copiedId === preset.id ? (
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
                                                                <polyline points="20 6 9 17 4 12" />
                                                            </svg>
                                                        ) : (
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                                                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                </div>

                                                {/* Launch Search Button */}
                                                <button
                                                    onClick={() => handleSearch(currentQuery)}
                                                    className="inline-flex items-center gap-2 bg-white text-black font-black px-5 py-2.5 rounded-xl text-xs hover:bg-white/90 transition-all shadow-md active:scale-[0.98]"
                                                >
                                                    <img src="https://www.google.com/favicon.ico" className="w-3.5 h-3.5" alt="Google icon" />
                                                    LAUNCH SEARCH
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                        <polyline points="15 3 21 3 21 9" />
                                                        <line x1="10" y1="14" x2="21" y2="3" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Pro Tip Section */}
                    <div className="mt-16 bg-gradient-to-r from-blue-900/10 to-cyan-900/10 border border-blue-500/20 rounded-3xl p-6 md:p-8 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 text-xl shrink-0">
                            💡
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-sm font-black uppercase tracking-wider text-blue-400">Pro-Tip for Trending App Ideas</h3>
                            <p className="text-xs text-[#aaa] leading-relaxed">
                                When Google loads the search results, click on the <strong className="text-white">"Tools"</strong> button beneath the search bar, click <strong className="text-white">"Any time"</strong>, and choose <strong className="text-white">"Past month"</strong> or <strong className="text-white">"Past year"</strong>. This filters out stale posts and shows live, trending problems and requests that people are complaining about right now!
                            </p>
                        </div>
                    </div>

                    {/* Ad Placement */}
                    <div className="mt-12">
                        <AdPlacement format="banner" />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
