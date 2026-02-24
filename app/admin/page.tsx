"use client";
import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Types ─── */
type ContentItem = {
    id: string; title: string; type: string;
    status: "published" | "draft" | "archived";
    category: string; author: string; createdAt: string; description?: string;
};
type Toast = { id: number; message: string; type: "success" | "error" | "info" };

/* ─── Tab Config ─── */
const TAB_PAGE_MAP: Record<string, { url: string; label: string }> = {
    news: { url: "/#news", label: "News" }, videos: { url: "/#videos", label: "Videos" },
    prompts: { url: "/prompts", label: "AI Prompts" }, software: { url: "/#software", label: "Software" },
    courses: { url: "/courses", label: "Courses" }, mod_apps: { url: "/apps/mod", label: "Mod Apps" },
    new_releases: { url: "/apps/new-releases", label: "New Releases" },
    online_assets: { url: "/assets", label: "Assets" }, shop: { url: "/shop", label: "Shop" },
};

type NavItem = { id: string; label: string; icon: string; children?: NavItem[] };
const NAV_ITEMS: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    {
        id: "content", label: "Content", icon: "video_library", children: [
            { id: "news", label: "News", icon: "article" },
            { id: "videos", label: "Videos", icon: "play_circle" },
            { id: "prompts", label: "AI Prompts", icon: "smart_toy" },
            { id: "software", label: "Software", icon: "folder_open" },
            { id: "courses", label: "Courses", icon: "school" },
            { id: "mod_apps", label: "Mod Apps", icon: "sports_esports" },
            { id: "new_releases", label: "New Releases", icon: "new_releases" },
            { id: "online_assets", label: "Online Assets", icon: "cloud" },
            { id: "shop", label: "Shop", icon: "storefront" },
        ]
    },
    { id: "comments", label: "Comments", icon: "chat" },
    { id: "analytics", label: "Analytics", icon: "analytics" },
    { id: "settings", label: "Settings", icon: "settings" },
];

const CATEGORIES = ["Tech News", "Hardware", "Announcements", "Education", "Software", "AI", "Tutorial", "Review"];
const CAT_COLORS: Record<string, string> = {
    "Tech News": "bg-blue-500", "Hardware": "bg-purple-500", "Announcements": "bg-amber-500",
    "Education": "bg-emerald-500", "Software": "bg-cyan-500", "AI": "bg-rose-500",
    "Tutorial": "bg-teal-500", "Review": "bg-sky-500",
};
const ADMIN_PASSWORD = "tecsub2026";

export default function AdminPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [password, setPassword] = useState("");
    const [activeTab, setActiveTab] = useState("dashboard");
    const [items, setItems] = useState<ContentItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [contentExpanded, setContentExpanded] = useState(true);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [detailItem, setDetailItem] = useState<ContentItem | null>(null);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [newTitle, setNewTitle] = useState("");
    const [newCategory, setNewCategory] = useState("Tech News");
    const [newAuthor, setNewAuthor] = useState("Admin");
    const [newDescription, setNewDescription] = useState("");
    const [wizardStep, setWizardStep] = useState(1);
    const [wizardType, setWizardType] = useState("news");
    const [activity, setActivity] = useState<{ text: string; time: string }[]>([]);
    const itemsPerPage = 8;
    const toastId = useRef(0);

    const contentTab = ["news", "videos", "prompts", "software", "courses", "mod_apps", "new_releases", "online_assets", "shop"].includes(activeTab) ? activeTab : "news";

    const addToast = useCallback((message: string, type: Toast["type"] = "success") => {
        const id = ++toastId.current;
        setToasts(t => [...t, { id, message, type }]);
        setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
    }, []);

    const addActivity = useCallback((text: string) => {
        setActivity(a => [{ text, time: new Date().toLocaleTimeString() }, ...a].slice(0, 20));
    }, []);

    useEffect(() => {
        const tab = ["news", "videos", "prompts", "software", "courses", "mod_apps", "new_releases", "online_assets", "shop"].includes(activeTab) ? activeTab : null;
        if (tab) {
            const stored = localStorage.getItem(`tecsub-admin-${tab}`);
            setItems(stored ? JSON.parse(stored) : []);
        }
        setCurrentPage(1); setSearchQuery(""); setStatusFilter("all");
    }, [activeTab]);

    const saveItems = (updated: ContentItem[]) => {
        setItems(updated);
        localStorage.setItem(`tecsub-admin-${contentTab}`, JSON.stringify(updated));
    };

    const handleLogin = (e: React.FormEvent) => { e.preventDefault(); if (password === ADMIN_PASSWORD) setIsLoggedIn(true); };

    const addItem = () => {
        if (!newTitle.trim()) return;
        const item: ContentItem = {
            id: `#${1000 + items.length + 1}`, title: newTitle, type: wizardType,
            status: "draft", category: newCategory, author: newAuthor,
            description: newDescription || undefined,
            createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        };
        saveItems([item, ...items]);
        addToast(`"${newTitle}" created as draft`);
        addActivity(`Created "${newTitle}" in ${wizardType}`);
        setNewTitle(""); setNewCategory("Tech News"); setNewAuthor("Admin"); setNewDescription("");
        setShowAddModal(false); setWizardStep(1);
    };

    const deleteItem = (id: string) => {
        const item = items.find(i => i.id === id);
        saveItems(items.filter(i => i.id !== id));
        addToast(`Item deleted`, "info");
        if (item) addActivity(`Deleted "${item.title}"`);
        if (detailItem?.id === id) setDetailItem(null);
    };

    const updateItem = (item: ContentItem) => {
        saveItems(items.map(i => i.id === item.id ? item : i));
        setEditingItem(null); setDetailItem(item);
        addToast(`"${item.title}" updated`);
        addActivity(`Updated "${item.title}"`);
    };

    const cycleStatus = (item: ContentItem) => {
        const order: ContentItem["status"][] = ["draft", "published", "archived"];
        const next = order[(order.indexOf(item.status) + 1) % order.length];
        const updated = { ...item, status: next };
        saveItems(items.map(i => i.id === item.id ? updated : i));
        addToast(`Status changed to ${next}`);
        addActivity(`"${item.title}" → ${next}`);
    };

    const filtered = items.filter(i => {
        const matchSearch = i.title.toLowerCase().includes(searchQuery.toLowerCase()) || i.category.toLowerCase().includes(searchQuery.toLowerCase()) || i.id.includes(searchQuery);
        const matchStatus = statusFilter === "all" || i.status === statusFilter;
        return matchSearch && matchStatus;
    });
    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalCount = items.length;
    const publishedCount = items.filter(i => i.status === "published").length;
    const draftCount = items.filter(i => i.status === "draft").length;

    const currentLabel = NAV_ITEMS.flatMap(n => n.children ? [n, ...n.children] : [n]).find(n => n.id === activeTab)?.label || "Dashboard";

    const statusBadge = (s: ContentItem["status"]) => {
        const cls = s === "published" ? "bg-admin-success/20 text-green-400" : s === "archived" ? "bg-admin-bg-lighter text-admin-text-secondary" : "bg-yellow-500/20 text-yellow-400";
        return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${cls}`}>
            {s === "published" && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}{s.charAt(0).toUpperCase() + s.slice(1)}
        </span>;
    };

    /* ═══ LOGIN ═══ */
    if (!isLoggedIn) return (
        <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4 font-['Roboto',sans-serif]">
            <div className="w-full max-w-sm bg-[#272727] p-8 rounded-2xl border border-[#3f3f3f] shadow-2xl">
                <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-admin-red flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">▶</div>
                    <h2 className="text-xl font-semibold text-white">TecSub Studio</h2>
                    <p className="text-[#aaa] text-sm mt-1">Sign in to manage your content</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password"
                        className="w-full bg-[#121212] border border-[#3f3f3f] text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-admin-primary focus:border-transparent placeholder:text-[#717171] text-sm outline-none" />
                    <button type="submit" className="w-full bg-admin-primary hover:bg-admin-primary-hover text-[#0f0f0f] font-semibold py-3 rounded-lg transition-colors text-sm">Sign In</button>
                </form>
            </div>
        </div>
    );

    /* ═══ MAIN LAYOUT ═══ */
    const isContentTab = ["news", "videos", "prompts", "software", "courses", "mod_apps", "new_releases", "online_assets", "shop"].includes(activeTab);

    return (
        <div className="bg-[#0f0f0f] text-[#f1f1f1] font-['Roboto',sans-serif] antialiased h-screen overflow-hidden flex flex-col">
            {/* ─── TOP BAR (YouTube Studio style) ─── */}
            <header className="h-14 bg-[#272727] border-b border-[#3f3f3f] flex items-center justify-between px-4 shrink-0 z-30">
                <div className="flex items-center gap-3">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-[#3f3f3f] rounded-full transition-colors">
                        <span className="material-symbols-outlined text-[22px] text-[#f1f1f1]">menu</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-admin-red flex items-center justify-center text-white text-sm font-bold">▶</div>
                        <span className="text-[15px] font-medium text-white hidden sm:block">TecSub Studio</span>
                    </div>
                </div>
                <div className="flex-1 max-w-lg mx-4 hidden md:block">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#717171] text-xl">search</span>
                        <input type="text" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Search across your content"
                            className="w-full bg-[#121212] border border-[#3f3f3f] text-white pl-10 pr-4 py-2 rounded-full focus:border-admin-primary placeholder:text-[#717171] text-sm outline-none" />
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => { setShowAddModal(true); setWizardStep(1); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3f3f3f] hover:bg-[#4f4f4f] rounded-lg transition-colors">
                        <span className="material-symbols-outlined text-xl text-white">add</span>
                        <span className="text-sm font-medium text-white hidden sm:block">Create</span>
                    </button>
                    <button className="relative p-2 hover:bg-[#3f3f3f] rounded-full transition-colors">
                        <span className="material-symbols-outlined text-[22px] text-[#f1f1f1]">notifications</span>
                        {draftCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-admin-red rounded-full" />}
                    </button>
                    <a href="/" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-[#3f3f3f] rounded-full transition-colors" title="View your channel">
                        <span className="material-symbols-outlined text-[22px] text-[#f1f1f1]">open_in_new</span>
                    </a>
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold ml-1 cursor-pointer">HM</div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* ─── SIDEBAR ─── */}
                <aside className={`${sidebarOpen ? "w-56" : "w-[72px]"} h-full flex flex-col bg-[#0f0f0f] border-r border-[#272727] shrink-0 overflow-y-auto overflow-x-hidden transition-all duration-200`}>
                    <nav className="flex-1 py-2 flex flex-col">
                        {NAV_ITEMS.map(item => (
                            <div key={item.id}>
                                <button onClick={() => { if (item.children) { setContentExpanded(!contentExpanded); } else { setActiveTab(item.id); } }}
                                    className={`flex items-center gap-3 w-full px-4 py-2.5 transition-colors text-left ${activeTab === item.id ? "bg-[#272727] text-white" : "text-[#aaa] hover:bg-[#1a1a1a] hover:text-white"} ${!sidebarOpen ? "justify-center px-0" : ""}`}>
                                    <span className={`material-symbols-outlined text-[22px] ${activeTab === item.id ? "text-white" : ""}`}>{item.icon}</span>
                                    {sidebarOpen && <span className="text-sm flex-1">{item.label}</span>}
                                    {sidebarOpen && item.children && <span className="material-symbols-outlined text-lg">{contentExpanded ? "expand_less" : "expand_more"}</span>}
                                </button>
                                {item.children && contentExpanded && sidebarOpen && (
                                    <div className="ml-4 border-l border-[#3f3f3f]">
                                        {item.children.map(child => (
                                            <button key={child.id} onClick={() => setActiveTab(child.id)}
                                                className={`flex items-center gap-3 w-full pl-4 pr-3 py-2 transition-colors text-left text-sm ${activeTab === child.id ? "text-white bg-[#272727]" : "text-[#aaa] hover:bg-[#1a1a1a] hover:text-white"}`}>
                                                <span className="material-symbols-outlined text-[18px]">{child.icon}</span>
                                                <span>{child.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                    {sidebarOpen && <div className="p-4 border-t border-[#272727]">
                        <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-2 text-[#aaa] hover:text-white text-sm w-full transition-colors">
                            <span className="material-symbols-outlined text-lg">logout</span>Sign out
                        </button>
                        <p className="text-[10px] text-[#555] mt-3">TecSub Studio v2.0</p>
                    </div>}
                </aside>

                {/* ─── MAIN CONTENT ─── */}
                <main className="flex-1 flex flex-col h-full overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarColor: "#3f3f3f #0f0f0f" }}>
                        <div className="max-w-6xl mx-auto">

                            {/* ═══ DASHBOARD ═══ */}
                            {activeTab === "dashboard" && (<>
                                <h1 className="text-2xl font-medium text-white mb-6">Channel dashboard</h1>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                                    {[{ l: "Total Content", v: (() => { let t = 0;["news", "videos", "prompts", "software", "courses", "mod_apps", "new_releases", "online_assets", "shop"].forEach(k => { const s = localStorage.getItem(`tecsub-admin-${k}`); if (s) t += JSON.parse(s).length; }); return t; })(), ic: "video_library", c: "text-admin-primary" },
                                    { l: "Published", v: (() => { let t = 0;["news", "videos", "prompts", "software", "courses", "mod_apps", "new_releases", "online_assets", "shop"].forEach(k => { const s = localStorage.getItem(`tecsub-admin-${k}`); if (s) t += JSON.parse(s).filter((x: ContentItem) => x.status === "published").length; }); return t; })(), ic: "check_circle", c: "text-green-400" },
                                    { l: "Drafts", v: (() => { let t = 0;["news", "videos", "prompts", "software", "courses", "mod_apps", "new_releases", "online_assets", "shop"].forEach(k => { const s = localStorage.getItem(`tecsub-admin-${k}`); if (s) t += JSON.parse(s).filter((x: ContentItem) => x.status === "draft").length; }); return t; })(), ic: "edit_note", c: "text-yellow-400" }
                                    ].map((card, i) => (
                                        <div key={i} className="bg-[#272727] rounded-xl p-5 border border-[#3f3f3f] hover:border-[#555] transition-colors">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm text-[#aaa]">{card.l}</span>
                                                <span className={`material-symbols-outlined ${card.c}`}>{card.ic}</span>
                                            </div>
                                            <p className="text-3xl font-medium text-white">{card.v}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div className="bg-[#272727] rounded-xl p-5 border border-[#3f3f3f]">
                                        <h3 className="text-base font-medium text-white mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-admin-primary">bolt</span>Quick actions
                                        </h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {NAV_ITEMS.find(n => n.id === "content")?.children?.map(child => (
                                                <button key={child.id} onClick={() => setActiveTab(child.id)}
                                                    className="flex items-center gap-2 p-3 rounded-lg bg-[#1a1a1a] border border-[#3f3f3f] hover:bg-[#3f3f3f] transition-colors text-left">
                                                    <span className="material-symbols-outlined text-lg text-[#aaa]">{child.icon}</span>
                                                    <span className="text-sm text-[#ddd]">{child.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-[#272727] rounded-xl p-5 border border-[#3f3f3f]">
                                        <h3 className="text-base font-medium text-white mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-admin-primary">schedule</span>Recent activity
                                        </h3>
                                        {activity.length === 0 ? <p className="text-sm text-[#717171]">No recent activity. Start managing content!</p> :
                                            <div className="space-y-2 max-h-60 overflow-y-auto">{activity.map((a, i) => (
                                                <div key={i} className="flex items-start gap-2 text-sm py-1.5 border-b border-[#3f3f3f]/50 last:border-0">
                                                    <span className="text-[10px] text-[#717171] mt-0.5 shrink-0">{a.time}</span>
                                                    <span className="text-[#ddd]">{a.text}</span>
                                                </div>
                                            ))}</div>}
                                    </div>
                                </div>
                            </>)}

                            {/* ═══ ANALYTICS TAB ═══ */}
                            {activeTab === "analytics" && (
                                <div>
                                    <h1 className="text-2xl font-medium text-white mb-6">Channel analytics</h1>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        {[{ l: "Content Items", v: totalCount, d: "+12% this month" }, { l: "Published Rate", v: `${totalCount ? Math.round(publishedCount / totalCount * 100) : 0}%`, d: "Across all channels" }, { l: "Pending Review", v: draftCount, d: "Items in draft" }].map((c, i) => (
                                            <div key={i} className="bg-[#272727] rounded-xl p-6 border border-[#3f3f3f]">
                                                <p className="text-sm text-[#aaa] mb-2">{c.l}</p>
                                                <p className="text-4xl font-medium text-white mb-1">{c.v}</p>
                                                <p className="text-xs text-[#717171]">{c.d}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="bg-[#272727] rounded-xl p-6 border border-[#3f3f3f]">
                                        <h3 className="text-base font-medium text-white mb-4">Content by category</h3>
                                        <div className="space-y-3">
                                            {NAV_ITEMS.find(n => n.id === "content")?.children?.map(child => {
                                                const s = localStorage.getItem(`tecsub-admin-${child.id}`);
                                                const count = s ? JSON.parse(s).length : 0;
                                                return <div key={child.id} className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-lg text-[#aaa]">{child.icon}</span>
                                                    <span className="text-sm text-[#ddd] w-28">{child.label}</span>
                                                    <div className="flex-1 h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                                                        <div className="h-full bg-admin-primary rounded-full transition-all" style={{ width: `${Math.min(100, count * 10)}%` }} />
                                                    </div>
                                                    <span className="text-sm text-[#aaa] w-8 text-right">{count}</span>
                                                </div>;
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ═══ COMMENTS TAB ═══ */}
                            {activeTab === "comments" && (
                                <div>
                                    <h1 className="text-2xl font-medium text-white mb-6">Comments</h1>
                                    <div className="bg-[#272727] rounded-xl p-8 border border-[#3f3f3f] text-center">
                                        <span className="material-symbols-outlined text-5xl text-[#3f3f3f] mb-3 block">chat_bubble_outline</span>
                                        <p className="text-[#aaa] text-sm">Comments will appear here as your audience engages with your content.</p>
                                        <p className="text-[#555] text-xs mt-2">This feature is coming soon</p>
                                    </div>
                                </div>
                            )}

                            {/* ═══ SETTINGS TAB ═══ */}
                            {activeTab === "settings" && (
                                <div>
                                    <h1 className="text-2xl font-medium text-white mb-6">Settings</h1>
                                    <div className="bg-[#272727] rounded-xl p-6 border border-[#3f3f3f] space-y-4">
                                        {[{ l: "Channel name", v: "TecSub Solutions" }, { l: "Admin email", v: "admin@tecsub.com" }, { l: "Storage", v: "localStorage (Client-side)" }].map((s, i) => (
                                            <div key={i} className="flex items-center justify-between py-3 border-b border-[#3f3f3f] last:border-0">
                                                <span className="text-sm text-[#aaa]">{s.l}</span><span className="text-sm text-white">{s.v}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ═══ CONTENT TABS ═══ */}
                            {isContentTab && (<>
                                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-2xl font-medium text-white">Channel {currentLabel.toLowerCase()}</h1>
                                        {TAB_PAGE_MAP[activeTab] && <a href={TAB_PAGE_MAP[activeTab].url} target="_blank" rel="noopener noreferrer" className="text-admin-primary text-sm hover:underline flex items-center gap-1">
                                            <span className="material-symbols-outlined text-base">open_in_new</span>View live
                                        </a>}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")} className="p-2 hover:bg-[#3f3f3f] rounded-lg transition-colors">
                                            <span className="material-symbols-outlined text-xl text-[#aaa]">{viewMode === "grid" ? "view_list" : "grid_view"}</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Filter pills */}
                                <div className="flex items-center gap-2 mb-4 overflow-x-auto">
                                    {["all", "published", "draft", "archived"].map(f => (
                                        <button key={f} onClick={() => { setStatusFilter(f); setCurrentPage(1); }}
                                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${statusFilter === f ? "bg-white text-[#0f0f0f]" : "bg-[#272727] text-[#aaa] hover:bg-[#3f3f3f]"}`}>
                                            {f.charAt(0).toUpperCase() + f.slice(1)}{f !== "all" && ` (${items.filter(i => f === "all" || i.status === f).length})`}
                                        </button>
                                    ))}
                                </div>

                                {/* Content */}
                                {paginated.length === 0 ? (
                                    <div className="bg-[#272727] rounded-xl p-12 border border-[#3f3f3f] text-center">
                                        <span className="material-symbols-outlined text-5xl text-[#3f3f3f] mb-3 block">inbox</span>
                                        <p className="text-[#aaa] text-sm">No content found</p>
                                        <button onClick={() => { setShowAddModal(true); setWizardStep(1); setWizardType(activeTab); }} className="mt-3 px-4 py-2 bg-admin-primary text-[#0f0f0f] rounded-lg text-sm font-medium hover:bg-admin-primary-hover transition-colors">
                                            Create your first item
                                        </button>
                                    </div>
                                ) : viewMode === "grid" ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                        {paginated.map(item => (
                                            <div key={item.id} onClick={() => setDetailItem(item)} className="bg-[#272727] rounded-xl border border-[#3f3f3f] hover:border-[#555] transition-all cursor-pointer group overflow-hidden">
                                                <div className="aspect-video bg-[#1a1a1a] relative flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-4xl text-[#3f3f3f]">{NAV_ITEMS.find(n => n.id === "content")?.children?.find(c => c.id === activeTab)?.icon || "article"}</span>
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                        <button onClick={e => { e.stopPropagation(); setEditingItem(item); }} className="p-2 bg-black/70 rounded-full hover:bg-black/90"><span className="material-symbols-outlined text-white text-lg">edit</span></button>
                                                        <button onClick={e => { e.stopPropagation(); deleteItem(item.id); }} className="p-2 bg-black/70 rounded-full hover:bg-black/90"><span className="material-symbols-outlined text-white text-lg">delete</span></button>
                                                    </div>
                                                    <div className="absolute top-2 right-2">{statusBadge(item.status)}</div>
                                                </div>
                                                <div className="p-3">
                                                    <p className="text-sm font-medium text-white line-clamp-2 mb-1">{item.title}</p>
                                                    <div className="flex items-center justify-between">
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${CAT_COLORS[item.category] || "bg-gray-500"} text-white`}>{item.category}</span>
                                                        <span className="text-[11px] text-[#717171]">{item.createdAt}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-[#272727] rounded-xl border border-[#3f3f3f] overflow-hidden">
                                        <table className="w-full text-left">
                                            <thead><tr className="border-b border-[#3f3f3f] text-xs text-[#aaa] uppercase">
                                                <th className="px-4 py-3">Content</th><th className="px-4 py-3 hidden md:table-cell">Category</th><th className="px-4 py-3 hidden sm:table-cell">Date</th><th className="px-4 py-3 text-center">Status</th><th className="px-4 py-3 text-right">Actions</th>
                                            </tr></thead>
                                            <tbody className="divide-y divide-[#3f3f3f]/50">
                                                {paginated.map(item => (
                                                    <tr key={item.id} onClick={() => setDetailItem(item)} className="hover:bg-[#1a1a1a] cursor-pointer transition-colors group">
                                                        <td className="px-4 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-28 h-16 rounded bg-[#1a1a1a] border border-[#3f3f3f] flex items-center justify-center shrink-0">
                                                                    <span className="material-symbols-outlined text-[#3f3f3f]">{NAV_ITEMS.find(n => n.id === "content")?.children?.find(c => c.id === activeTab)?.icon || "article"}</span>
                                                                </div>
                                                                <div><p className="text-sm font-medium text-white">{item.title}</p><p className="text-xs text-[#717171]">{item.author}</p></div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 hidden md:table-cell"><span className={`text-xs px-2 py-0.5 rounded ${CAT_COLORS[item.category] || "bg-gray-500"} text-white`}>{item.category}</span></td>
                                                        <td className="px-4 py-3 text-sm text-[#aaa] hidden sm:table-cell">{item.createdAt}</td>
                                                        <td className="px-4 py-3 text-center"><button onClick={e => { e.stopPropagation(); cycleStatus(item); }}>{statusBadge(item.status)}</button></td>
                                                        <td className="px-4 py-3 text-right">
                                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button onClick={e => { e.stopPropagation(); setEditingItem(item); }} className="p-1.5 hover:bg-[#3f3f3f] rounded"><span className="material-symbols-outlined text-lg text-[#aaa]">edit</span></button>
                                                                <button onClick={e => { e.stopPropagation(); deleteItem(item.id); }} className="p-1.5 hover:bg-[#3f3f3f] rounded"><span className="material-symbols-outlined text-lg text-[#aaa]">delete</span></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Pagination */}
                                {totalPages > 1 && <div className="flex items-center justify-between mt-4">
                                    <span className="text-xs text-[#717171]">Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}</span>
                                    <div className="flex gap-1">
                                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1.5 text-xs rounded bg-[#272727] text-[#aaa] hover:bg-[#3f3f3f] disabled:opacity-40">Prev</button>
                                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                                            <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-1.5 text-xs rounded ${currentPage === p ? "bg-white text-[#0f0f0f]" : "bg-[#272727] text-[#aaa] hover:bg-[#3f3f3f]"}`}>{p}</button>
                                        ))}
                                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1.5 text-xs rounded bg-[#272727] text-[#aaa] hover:bg-[#3f3f3f] disabled:opacity-40">Next</button>
                                    </div>
                                </div>}
                            </>)}

                        </div>
                    </div>
                </main>

                {/* ─── DETAIL DRAWER ─── */}
                {detailItem && (
                    <div className="w-96 h-full bg-[#272727] border-l border-[#3f3f3f] flex flex-col shrink-0 overflow-hidden animate-[slideIn_0.2s_ease-out]">
                        <div className="flex items-center justify-between p-4 border-b border-[#3f3f3f]">
                            <h3 className="text-sm font-medium text-white">Content details</h3>
                            <button onClick={() => setDetailItem(null)} className="p-1 hover:bg-[#3f3f3f] rounded-full"><span className="material-symbols-outlined text-lg text-[#aaa]">close</span></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            <div className="aspect-video bg-[#1a1a1a] rounded-lg flex items-center justify-center border border-[#3f3f3f]">
                                <span className="material-symbols-outlined text-4xl text-[#3f3f3f]">{NAV_ITEMS.find(n => n.id === "content")?.children?.find(c => c.id === detailItem.type)?.icon || "article"}</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-medium text-white mb-2">{detailItem.title}</h2>
                                <div className="flex items-center gap-2 mb-3">{statusBadge(detailItem.status)}<span className={`text-xs px-2 py-0.5 rounded ${CAT_COLORS[detailItem.category] || "bg-gray-500"} text-white`}>{detailItem.category}</span></div>
                            </div>
                            {detailItem.description && <div className="bg-[#1a1a1a] rounded-lg p-3 border border-[#3f3f3f]"><p className="text-sm text-[#ddd] whitespace-pre-wrap">{detailItem.description}</p></div>}
                            <div className="space-y-2">
                                {[["Author", detailItem.author], ["Type", detailItem.type.replace("_", " ")], ["Created", detailItem.createdAt], ["ID", detailItem.id]].map(([l, v]) => (
                                    <div key={l} className="flex items-center justify-between py-2 border-b border-[#3f3f3f]/50">
                                        <span className="text-xs text-[#aaa]">{l}</span><span className="text-sm text-white">{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 border-t border-[#3f3f3f] space-y-2">
                            <button onClick={() => { setEditingItem(detailItem); setDetailItem(null); }} className="w-full py-2 bg-admin-primary text-[#0f0f0f] rounded-lg text-sm font-medium hover:bg-admin-primary-hover transition-colors flex items-center justify-center gap-1">
                                <span className="material-symbols-outlined text-base">edit</span>Edit details
                            </button>
                            <div className="flex gap-2">
                                <button onClick={() => cycleStatus(detailItem)} className="flex-1 py-2 bg-[#3f3f3f] rounded-lg text-sm text-white hover:bg-[#4f4f4f] transition-colors">Change status</button>
                                <button onClick={() => { deleteItem(detailItem.id); }} className="px-4 py-2 bg-[#3f3f3f] rounded-lg text-sm text-admin-danger hover:bg-[#4f4f4f] transition-colors">
                                    <span className="material-symbols-outlined text-base">delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ─── CREATE MODAL (Wizard) ─── */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => { setShowAddModal(false); setWizardStep(1); }}>
                    <div className="w-full max-w-lg bg-[#272727] rounded-xl border border-[#3f3f3f] shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 border-b border-[#3f3f3f]">
                            <h3 className="text-base font-medium text-white">{wizardStep === 1 ? "Choose content type" : "Add details"}</h3>
                            <button onClick={() => { setShowAddModal(false); setWizardStep(1); }} className="p-1 hover:bg-[#3f3f3f] rounded-full"><span className="material-symbols-outlined text-lg text-[#aaa]">close</span></button>
                        </div>
                        <div className="p-4">
                            {/* Step indicator */}
                            <div className="flex items-center gap-2 mb-5">
                                {[1, 2].map(s => <div key={s} className="flex items-center gap-2">{s > 1 && <div className="w-12 h-0.5 bg-[#3f3f3f]" />}<div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${wizardStep >= s ? "bg-admin-primary text-[#0f0f0f]" : "bg-[#3f3f3f] text-[#aaa]"}`}>{s}</div></div>)}
                            </div>
                            {wizardStep === 1 ? (
                                <div className="grid grid-cols-3 gap-2">
                                    {NAV_ITEMS.find(n => n.id === "content")?.children?.map(child => (
                                        <button key={child.id} onClick={() => { setWizardType(child.id); setWizardStep(2); }}
                                            className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${wizardType === child.id ? "border-admin-primary bg-admin-primary/10" : "border-[#3f3f3f] bg-[#1a1a1a] hover:bg-[#3f3f3f]"}`}>
                                            <span className="material-symbols-outlined text-2xl text-[#aaa]">{child.icon}</span>
                                            <span className="text-xs text-[#ddd]">{child.label}</span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div><label className="text-xs text-[#aaa] mb-1 block">Title *</label>
                                        <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full bg-[#121212] border border-[#3f3f3f] text-white px-3 py-2.5 rounded-lg text-sm outline-none focus:border-admin-primary" placeholder="Enter title" autoFocus />
                                    </div>
                                    <div><label className="text-xs text-[#aaa] mb-1 block">Description</label>
                                        <textarea value={newDescription} onChange={e => setNewDescription(e.target.value)} rows={3} className="w-full bg-[#121212] border border-[#3f3f3f] text-white px-3 py-2.5 rounded-lg text-sm outline-none focus:border-admin-primary resize-none" placeholder="Add a description..." />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div><label className="text-xs text-[#aaa] mb-1 block">Category</label>
                                            <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-full bg-[#121212] border border-[#3f3f3f] text-white px-3 py-2.5 rounded-lg text-sm outline-none">
                                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div><label className="text-xs text-[#aaa] mb-1 block">Author</label>
                                            <input type="text" value={newAuthor} onChange={e => setNewAuthor(e.target.value)} className="w-full bg-[#121212] border border-[#3f3f3f] text-white px-3 py-2.5 rounded-lg text-sm outline-none focus:border-admin-primary" />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <button onClick={() => setWizardStep(1)} className="px-4 py-2.5 bg-[#3f3f3f] rounded-lg text-sm text-white hover:bg-[#4f4f4f]">Back</button>
                                        <button onClick={addItem} className="flex-1 py-2.5 bg-admin-primary text-[#0f0f0f] rounded-lg text-sm font-medium hover:bg-admin-primary-hover transition-colors">Create</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ─── EDIT MODAL ─── */}
            {editingItem && (
                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setEditingItem(null)}>
                    <div className="w-full max-w-lg bg-[#272727] rounded-xl border border-[#3f3f3f] shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-4 border-b border-[#3f3f3f]">
                            <h3 className="text-base font-medium text-white">Edit — {editingItem.id}</h3>
                            <button onClick={() => setEditingItem(null)} className="p-1 hover:bg-[#3f3f3f] rounded-full"><span className="material-symbols-outlined text-lg text-[#aaa]">close</span></button>
                        </div>
                        <div className="p-4 space-y-3">
                            <div><label className="text-xs text-[#aaa] mb-1 block">Title</label>
                                <input type="text" value={editingItem.title} onChange={e => setEditingItem({ ...editingItem, title: e.target.value })} className="w-full bg-[#121212] border border-[#3f3f3f] text-white px-3 py-2.5 rounded-lg text-sm outline-none focus:border-admin-primary" />
                            </div>
                            <div><label className="text-xs text-[#aaa] mb-1 block">Description</label>
                                <textarea value={editingItem.description || ""} onChange={e => setEditingItem({ ...editingItem, description: e.target.value })} rows={3} className="w-full bg-[#121212] border border-[#3f3f3f] text-white px-3 py-2.5 rounded-lg text-sm outline-none focus:border-admin-primary resize-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-xs text-[#aaa] mb-1 block">Category</label>
                                    <select value={editingItem.category} onChange={e => setEditingItem({ ...editingItem, category: e.target.value })} className="w-full bg-[#121212] border border-[#3f3f3f] text-white px-3 py-2.5 rounded-lg text-sm outline-none">
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div><label className="text-xs text-[#aaa] mb-1 block">Status</label>
                                    <select value={editingItem.status} onChange={e => setEditingItem({ ...editingItem, status: e.target.value as ContentItem["status"] })} className="w-full bg-[#121212] border border-[#3f3f3f] text-white px-3 py-2.5 rounded-lg text-sm outline-none">
                                        <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                                <button onClick={() => setEditingItem(null)} className="px-4 py-2.5 bg-[#3f3f3f] rounded-lg text-sm text-white hover:bg-[#4f4f4f]">Cancel</button>
                                <button onClick={() => updateItem(editingItem)} className="flex-1 py-2.5 bg-admin-primary text-[#0f0f0f] rounded-lg text-sm font-medium hover:bg-admin-primary-hover transition-colors">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── TOASTS ─── */}
            <div className="fixed bottom-4 left-4 z-50 space-y-2">
                {toasts.map(t => (
                    <div key={t.id} className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm animate-[slideIn_0.3s_ease-out] ${t.type === "success" ? "bg-admin-success text-white" : t.type === "error" ? "bg-admin-danger text-white" : "bg-[#3f3f3f] text-white"}`}>
                        <span className="material-symbols-outlined text-lg">{t.type === "success" ? "check_circle" : t.type === "error" ? "error" : "info"}</span>
                        {t.message}
                    </div>
                ))}
            </div>

            <style jsx global>{`
                @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                select option { background: #272727; color: #f1f1f1; }
            `}</style>
        </div>
    );
}
