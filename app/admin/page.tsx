"use client";

import { useState, useEffect, useRef } from "react";

/* ─── Types ─── */
type ContentItem = {
    id: string;
    title: string;
    type: string;
    status: "published" | "draft" | "archived";
    category: string;
    author: string;
    createdAt: string;
};

type Tab = {
    id: string;
    label: string;
    icon: string;
};

/* ─── Constants ─── */
const TABS: Tab[] = [
    { id: "overview", label: "Overview", icon: "grid_view" },
    { id: "news", label: "News Manager", icon: "article" },
    { id: "videos", label: "Video Library", icon: "video_library" },
    { id: "prompts", label: "AI Prompts", icon: "smart_toy" },
    { id: "software", label: "Software Files", icon: "folder_open" },
    { id: "courses", label: "Course Modules", icon: "school" },
    { id: "mod_apps", label: "Mod Apps", icon: "sports_esports" },
    { id: "new_releases", label: "New Releases", icon: "new_releases" },
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    "Tech News": { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
    Hardware: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
    Announcements: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
    Education: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
    Software: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20" },
    AI: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
    Tutorial: { bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/20" },
    Review: { bg: "bg-sky-500/10", text: "text-sky-400", border: "border-sky-500/20" },
    Default: { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/20" },
};

const ADMIN_PASSWORD = "tecsub2026";

/* ─── Helper: category badge style ─── */
function catStyle(cat: string) {
    return CATEGORY_COLORS[cat] || CATEGORY_COLORS.Default;
}

/* ─── Component ─── */
export default function AdminPage() {
    /* Auth */
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [password, setPassword] = useState("");

    /* Content state */
    const [activeTab, setActiveTab] = useState("news");
    const [items, setItems] = useState<ContentItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    /* Editing / Adding */
    const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newCategory, setNewCategory] = useState("Tech News");
    const [newAuthor, setNewAuthor] = useState("Admin");

    /* Upload simulation */
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadFile, setUploadFile] = useState<string | null>(null);
    const uploadTimer = useRef<NodeJS.Timeout | null>(null);

    /* ─── Load / Save ─── */
    useEffect(() => {
        const stored = localStorage.getItem(`tecsub-admin-${activeTab}`);
        if (stored) setItems(JSON.parse(stored));
        else setItems([]);
        setCurrentPage(1);
        setSearchQuery("");
    }, [activeTab]);

    const saveItems = (updated: ContentItem[]) => {
        setItems(updated);
        localStorage.setItem(`tecsub-admin-${activeTab}`, JSON.stringify(updated));
    };

    /* ─── Auth ─── */
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) setIsLoggedIn(true);
    };

    /* ─── CRUD ─── */
    const addItem = () => {
        if (!newTitle.trim()) return;
        const item: ContentItem = {
            id: `#${1000 + items.length + 1}`,
            title: newTitle,
            type: activeTab,
            status: "draft",
            category: newCategory,
            author: newAuthor,
            createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        };
        saveItems([item, ...items]);
        setNewTitle("");
        setNewCategory("Tech News");
        setNewAuthor("Admin");
        setShowAddModal(false);
    };

    const deleteItem = (id: string) => saveItems(items.filter((i) => i.id !== id));

    const updateItem = (item: ContentItem) => {
        saveItems(items.map((i) => (i.id === item.id ? item : i)));
        setEditingItem(null);
    };

    const cycleStatus = (item: ContentItem) => {
        const order: ContentItem["status"][] = ["draft", "published", "archived"];
        const next = order[(order.indexOf(item.status) + 1) % order.length];
        updateItem({ ...item, status: next });
    };

    /* ─── Upload simulation ─── */
    const simulateUpload = (fileName: string) => {
        setUploadFile(fileName);
        setUploadProgress(0);
        if (uploadTimer.current) clearInterval(uploadTimer.current);
        uploadTimer.current = setInterval(() => {
            setUploadProgress((p) => {
                if (p >= 100) {
                    if (uploadTimer.current) clearInterval(uploadTimer.current);
                    return 100;
                }
                return p + Math.random() * 15;
            });
        }, 300);
    };

    /* ─── Filtering ─── */
    const filtered = items.filter(
        (i) =>
            i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            i.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            i.id.includes(searchQuery)
    );
    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    /* ─── Stats ─── */
    const totalCount = items.length;
    const publishedCount = items.filter((i) => i.status === "published").length;
    const draftCount = items.filter((i) => i.status === "draft").length;

    /* ─── Tab label for breadcrumb ─── */
    const currentTabLabel = TABS.find((t) => t.id === activeTab)?.label || "Overview";

    /* ─── Status badge ─── */
    const statusBadge = (status: ContentItem["status"]) => {
        if (status === "published")
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-admin-success/10 text-admin-success border border-admin-success/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-admin-success animate-pulse" />
                    Published
                </span>
            );
        if (status === "archived")
            return (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-slate-400 border border-slate-600/30">
                    Archived
                </span>
            );
        return (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-admin-bg-lighter text-admin-text-secondary border border-admin-border">
                Draft
            </span>
        );
    };

    /* ═══════════════════════ LOGIN SCREEN ═══════════════════════ */
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-admin-bg-dark flex items-center justify-center p-4 font-['Noto_Sans',sans-serif]">
                <div className="w-full max-w-md bg-admin-bg-card p-8 rounded-2xl border border-admin-border shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-admin-primary to-transparent" />
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-admin-primary to-purple-600 flex items-center justify-center text-white font-bold text-2xl font-space-grotesk shadow-lg shadow-admin-primary/20 mx-auto mb-4">
                            TS
                        </div>
                        <h2 className="text-2xl font-space-grotesk font-bold text-white">Welcome Back</h2>
                        <p className="text-admin-text-secondary text-sm mt-2">TecSub Secure Admin Portal</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="w-full bg-admin-bg-dark border border-admin-border text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-admin-primary focus:border-transparent placeholder:text-slate-600 text-sm outline-none"
                        />
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-admin-primary hover:bg-admin-primary-hover text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-admin-primary/20"
                        >
                            <span className="material-symbols-outlined text-xl">login</span>
                            Sign In
                        </button>
                    </form>
                    <p className="text-center text-xs text-admin-text-secondary mt-6 flex items-center justify-center gap-1">
                        <span className="material-symbols-outlined text-sm">lock</span>
                        Secured Admin Portal
                    </p>
                </div>
            </div>
        );
    }

    /* ═══════════════════════ DASHBOARD ═══════════════════════ */
    return (
        <div className="bg-admin-bg-dark text-admin-text font-['Noto_Sans',sans-serif] antialiased selection:bg-admin-primary selection:text-white h-screen overflow-hidden flex">
            {/* ─── SIDEBAR ─── */}
            <aside className="w-64 h-full flex flex-col bg-admin-bg-card border-r border-admin-border shrink-0 overflow-y-auto">
                {/* Logo */}
                <div className="p-6 flex items-center gap-3 border-b border-admin-border/50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-admin-primary to-purple-600 flex items-center justify-center text-white font-bold text-xl font-space-grotesk shadow-lg shadow-admin-primary/20">
                        TS
                    </div>
                    <div>
                        <h1 className="text-white font-space-grotesk font-bold text-lg leading-tight">TecSub</h1>
                        <p className="text-admin-text-secondary text-xs">Admin Console</p>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
                    <p className="px-3 text-xs font-semibold text-admin-text-secondary uppercase tracking-wider mb-2">Main Menu</p>
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full text-left ${activeTab === tab.id
                                ? "bg-admin-primary/10 text-admin-primary border-l-2 border-admin-primary"
                                : "text-admin-text-secondary hover:bg-admin-bg-lighter hover:text-white border-l-2 border-transparent"
                                }`}
                        >
                            <span className={`material-symbols-outlined text-[22px] ${activeTab === tab.id ? "" : "group-hover:text-admin-primary"}`}>
                                {tab.icon}
                            </span>
                            <span className="font-medium text-sm">{tab.label}</span>
                        </button>
                    ))}

                    <div className="mt-8 mb-2 px-3 border-t border-admin-border/30 pt-6">
                        <p className="text-xs font-semibold text-admin-text-secondary uppercase tracking-wider mb-2">System</p>
                    </div>
                    <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-admin-text-secondary hover:bg-admin-bg-lighter hover:text-white transition-colors w-full text-left border-l-2 border-transparent">
                        <span className="material-symbols-outlined text-[22px]">settings</span>
                        <span className="font-medium text-sm">Settings</span>
                    </button>
                    <button
                        onClick={() => setIsLoggedIn(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-admin-text-secondary hover:bg-admin-bg-lighter hover:text-admin-danger transition-colors w-full text-left border-l-2 border-transparent"
                    >
                        <span className="material-symbols-outlined text-[22px]">logout</span>
                        <span className="font-medium text-sm">Logout</span>
                    </button>
                </nav>

                {/* User Profile Footer */}
                <div className="p-4 border-t border-admin-border bg-admin-bg-lighter/30">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-admin-primary to-purple-600 flex items-center justify-center text-white text-sm font-bold font-space-grotesk ring-2 ring-admin-primary/30">
                                HM
                            </div>
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-admin-success rounded-full ring-2 ring-admin-bg-card" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-semibold text-white truncate font-space-grotesk">Hasantha M.</span>
                            <span className="text-xs text-admin-text-secondary truncate">Super Admin</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ─── MAIN CONTENT ─── */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header */}
                <header className="h-16 border-b border-admin-border bg-admin-bg-card/50 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-space-grotesk font-bold text-white tracking-tight">{currentTabLabel}</h2>
                        <div className="h-4 w-px bg-admin-border mx-2" />
                        <div className="flex items-center gap-2 text-sm text-admin-text-secondary">
                            <span className="material-symbols-outlined text-base">home</span>
                            <span>/</span>
                            <span>Content</span>
                            <span>/</span>
                            <span className="text-white">{currentTabLabel}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href="/"
                            className="p-2 text-admin-text-secondary hover:text-white hover:bg-admin-bg-lighter rounded-lg transition-colors text-sm flex items-center gap-1"
                        >
                            <span className="material-symbols-outlined text-lg">open_in_new</span>
                            <span className="hidden sm:inline">View Site</span>
                        </a>
                        <button className="relative p-2 text-admin-text-secondary hover:text-white hover:bg-admin-bg-lighter rounded-lg transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                            {draftCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-admin-primary rounded-full" />}
                        </button>
                        <button className="p-2 text-admin-text-secondary hover:text-white hover:bg-admin-bg-lighter rounded-lg transition-colors">
                            <span className="material-symbols-outlined">help</span>
                        </button>
                    </div>
                </header>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth" style={{ scrollbarColor: "#334155 #0f1115" }}>
                    <div className="max-w-7xl mx-auto flex flex-col gap-6">
                        {/* ── Stats Row ── */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-admin-bg-card/70 backdrop-blur-xl border border-admin-border p-5 rounded-xl shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="material-symbols-outlined text-6xl text-admin-primary">article</span>
                                </div>
                                <p className="text-admin-text-secondary text-sm font-medium mb-1">Total Items</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-3xl font-space-grotesk font-bold text-white">{totalCount}</h3>
                                    {totalCount > 0 && (
                                        <span className="text-xs font-medium text-admin-success bg-admin-success/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                            <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                            Active
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="bg-admin-bg-card/70 backdrop-blur-xl border border-admin-border p-5 rounded-xl shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="material-symbols-outlined text-6xl text-admin-warning">pending_actions</span>
                                </div>
                                <p className="text-admin-text-secondary text-sm font-medium mb-1">Pending Review</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-3xl font-space-grotesk font-bold text-white">{draftCount}</h3>
                                    {draftCount > 0 && (
                                        <span className="text-xs font-medium text-admin-warning bg-admin-warning/10 px-2 py-0.5 rounded-full">
                                            Action Needed
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="bg-admin-bg-card/70 backdrop-blur-xl border border-admin-border p-5 rounded-xl shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <span className="material-symbols-outlined text-6xl text-admin-success">publish</span>
                                </div>
                                <p className="text-admin-text-secondary text-sm font-medium mb-1">Published</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-3xl font-space-grotesk font-bold text-white">{publishedCount}</h3>
                                    {publishedCount > 0 && (
                                        <span className="text-xs font-medium text-admin-success bg-admin-success/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                            <span className="material-symbols-outlined text-[14px]">trending_up</span>
                                            Live
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {activeTab === "overview" ? (
                            /* ── OVERVIEW TAB ── */
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-admin-bg-card p-6 rounded-xl border border-admin-border">
                                    <h3 className="text-lg font-space-grotesk font-bold text-white mb-4">Quick Actions</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {TABS.filter((t) => t.id !== "overview").map((tab) => (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className="flex items-center gap-3 p-4 rounded-xl bg-admin-bg-lighter/30 border border-admin-border/50 hover:border-admin-primary/50 hover:bg-admin-primary/5 transition-all text-left"
                                            >
                                                <span className="material-symbols-outlined text-admin-primary">{tab.icon}</span>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{tab.label}</p>
                                                    <p className="text-xs text-admin-text-secondary">Manage</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-admin-bg-card p-6 rounded-xl border border-admin-border flex flex-col gap-4">
                                    <h3 className="text-lg font-space-grotesk font-bold text-white mb-2">System Health</h3>
                                    <HealthCard icon="dns" label="Database" sub="Connected (12ms)" color="text-admin-success" />
                                    <HealthCard icon="cloud_done" label="CDN Status" sub="Operational" color="text-admin-primary" />
                                    <HealthCard icon="security" label="SSL Certificate" sub="Valid until 2027" color="text-admin-success" />
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* ── Action Toolbar ── */}
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-admin-bg-card p-4 rounded-xl border border-admin-border">
                                    <div className="flex flex-1 w-full sm:w-auto items-center gap-3">
                                        <div className="relative w-full max-w-md">
                                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-secondary text-xl">search</span>
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => {
                                                    setSearchQuery(e.target.value);
                                                    setCurrentPage(1);
                                                }}
                                                className="w-full bg-admin-bg-dark border border-admin-border text-white pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-admin-primary focus:border-transparent placeholder:text-slate-600 text-sm outline-none"
                                                placeholder="Search articles, tags, or IDs..."
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowAddModal(true)}
                                        className="flex items-center justify-center gap-2 bg-admin-primary hover:bg-admin-primary-hover text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all shadow-lg shadow-admin-primary/20 w-full sm:w-auto"
                                    >
                                        <span className="material-symbols-outlined text-xl">add</span>
                                        <span>Add New Item</span>
                                    </button>
                                </div>

                                {/* ── Data Table ── */}
                                <div className="bg-admin-bg-card rounded-xl border border-admin-border overflow-hidden flex flex-col">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-admin-bg-lighter/50 border-b border-admin-border text-xs uppercase tracking-wider text-admin-text-secondary font-semibold">
                                                    <th className="px-6 py-4 w-24">ID</th>
                                                    <th className="px-6 py-4 min-w-[300px]">Title &amp; Author</th>
                                                    <th className="px-6 py-4">Category</th>
                                                    <th className="px-6 py-4">Date</th>
                                                    <th className="px-6 py-4 text-center">Status</th>
                                                    <th className="px-6 py-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-admin-border/50 text-sm">
                                                {paginated.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="px-6 py-16 text-center">
                                                            <span className="material-symbols-outlined text-5xl text-admin-border mb-3 block">inbox</span>
                                                            <p className="text-admin-text-secondary text-sm">No items found</p>
                                                            <p className="text-slate-600 text-xs mt-1">Add your first item using the button above</p>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    paginated.map((item) => (
                                                        <tr key={item.id} className="group hover:bg-admin-bg-lighter/30 transition-colors">
                                                            <td className="px-6 py-4 text-admin-text-secondary font-mono">{item.id}</td>
                                                            <td className="px-6 py-4">
                                                                {editingItem?.id === item.id ? (
                                                                    <div className="flex items-center gap-2">
                                                                        <input
                                                                            type="text"
                                                                            value={editingItem.title}
                                                                            onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                                                                            className="flex-1 bg-admin-bg-dark border border-admin-primary/50 text-white px-3 py-1.5 rounded-lg text-sm outline-none focus:ring-1 focus:ring-admin-primary"
                                                                        />
                                                                        <button
                                                                            onClick={() => updateItem(editingItem)}
                                                                            className="px-3 py-1.5 bg-admin-primary text-white text-xs rounded-lg hover:bg-admin-primary-hover"
                                                                        >
                                                                            Save
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setEditingItem(null)}
                                                                            className="px-3 py-1.5 border border-admin-border text-admin-text-secondary text-xs rounded-lg hover:text-white"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-10 h-10 rounded-lg bg-admin-bg-lighter border border-admin-border flex items-center justify-center shrink-0">
                                                                            <span className="material-symbols-outlined text-admin-text-secondary text-lg">
                                                                                {activeTab === "videos" ? "play_circle" : activeTab === "prompts" ? "smart_toy" : activeTab === "software" ? "folder_zip" : activeTab === "courses" ? "school" : activeTab === "mod_apps" ? "sports_esports" : activeTab === "new_releases" ? "new_releases" : "article"}
                                                                            </span>
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-medium text-white group-hover:text-admin-primary transition-colors">{item.title}</p>
                                                                            <p className="text-xs text-admin-text-secondary">by {item.author}</p>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${catStyle(item.category).bg} ${catStyle(item.category).text} border ${catStyle(item.category).border}`}>
                                                                    {item.category}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-admin-text-secondary">{item.createdAt}</td>
                                                            <td className="px-6 py-4 text-center">
                                                                <button onClick={() => cycleStatus(item)} title="Click to change status">
                                                                    {statusBadge(item.status)}
                                                                </button>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                                    <button
                                                                        onClick={() => setEditingItem(item)}
                                                                        className="p-1.5 hover:bg-admin-bg-lighter rounded text-admin-text-secondary hover:text-admin-primary transition-colors"
                                                                        title="Edit"
                                                                    >
                                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => deleteItem(item.id)}
                                                                        className="p-1.5 hover:bg-admin-bg-lighter rounded text-admin-text-secondary hover:text-admin-danger transition-colors"
                                                                        title="Delete"
                                                                    >
                                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    <div className="border-t border-admin-border bg-admin-bg-card px-6 py-4 flex items-center justify-between">
                                        <span className="text-xs text-admin-text-secondary">
                                            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
                                            {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} items
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="px-3 py-1.5 text-xs font-medium rounded-md border border-admin-border text-admin-text-secondary hover:text-white hover:bg-admin-bg-lighter disabled:opacity-50 transition-colors"
                                            >
                                                Previous
                                            </button>
                                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                                                <button
                                                    key={p}
                                                    onClick={() => setCurrentPage(p)}
                                                    className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${currentPage === p
                                                        ? "border-admin-primary bg-admin-primary/10 text-admin-primary hover:bg-admin-primary/20"
                                                        : "border-admin-border text-admin-text-secondary hover:text-white hover:bg-admin-bg-lighter"
                                                        }`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                            {totalPages > 5 && <span className="text-admin-text-secondary px-1">...</span>}
                                            <button
                                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className="px-3 py-1.5 text-xs font-medium rounded-md border border-admin-border text-admin-text-secondary hover:text-white hover:bg-admin-bg-lighter disabled:opacity-50 transition-colors"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* ── Bottom: Upload & System Health ── */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* File Upload */}
                                    <div className="lg:col-span-2 bg-admin-bg-card p-6 rounded-xl border border-admin-border">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-space-grotesk font-bold text-white">Quick Upload</h3>
                                        </div>
                                        <div
                                            className="border-2 border-dashed border-admin-border rounded-lg p-8 flex flex-col items-center justify-center text-center hover:border-admin-primary/50 hover:bg-admin-bg-lighter/20 transition-all cursor-pointer group"
                                            onClick={() => simulateUpload(`demo_asset_${Date.now()}.png`)}
                                        >
                                            <div className="w-12 h-12 rounded-full bg-admin-bg-lighter flex items-center justify-center mb-3 group-hover:bg-admin-primary/20 transition-colors">
                                                <span className="material-symbols-outlined text-2xl text-admin-text-secondary group-hover:text-admin-primary">cloud_upload</span>
                                            </div>
                                            <p className="text-sm text-white font-medium mb-1">Click to upload or drag and drop</p>
                                            <p className="text-xs text-admin-text-secondary">SVG, PNG, JPG or GIF (max. 3MB)</p>
                                            {uploadFile && (
                                                <div className="w-full max-w-xs mt-6">
                                                    <div className="flex justify-between text-xs text-admin-text-secondary mb-1">
                                                        <span className="truncate max-w-[200px]">{uploadFile}</span>
                                                        <span>{Math.min(100, Math.round(uploadProgress))}%</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-admin-bg-dark rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-admin-primary rounded-full transition-all duration-300"
                                                            style={{ width: `${Math.min(100, uploadProgress)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* System Status */}
                                    <div className="bg-admin-bg-card p-6 rounded-xl border border-admin-border flex flex-col gap-4">
                                        <h3 className="text-lg font-space-grotesk font-bold text-white mb-2">System Health</h3>
                                        <HealthCard icon="dns" label="Database" sub="Connected (12ms)" color="text-admin-success" />
                                        <HealthCard icon="cloud_done" label="CDN Status" sub="Operational" color="text-admin-primary" />
                                        <div className="mt-auto">
                                            <a
                                                href="/"
                                                className="w-full py-2.5 rounded-lg border border-admin-border text-sm font-medium text-admin-text-secondary hover:text-white hover:bg-admin-bg-lighter transition-colors flex items-center justify-center gap-2"
                                            >
                                                <span className="material-symbols-outlined text-lg">open_in_new</span>
                                                View Public Site
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Footer */}
                        <div className="mt-12 text-center pb-6">
                            <p className="text-xs text-admin-text-secondary">TecSub Admin Panel © 2026. Secure Environment.</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* ─── ADD ITEM MODAL ─── */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
                    <div className="w-full max-w-md bg-admin-bg-card rounded-2xl border border-admin-border shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-admin-primary to-transparent" />
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-space-grotesk font-bold text-white">Add New Item</h3>
                                    <button onClick={() => setShowAddModal(false)} className="p-1 text-admin-text-secondary hover:text-white transition-colors">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-medium text-admin-text-secondary uppercase tracking-wider mb-1 block">Title</label>
                                        <input
                                            type="text"
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            className="w-full bg-admin-bg-dark border border-admin-border text-white px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-admin-primary focus:border-transparent placeholder:text-slate-600 text-sm outline-none"
                                            placeholder="Enter item title..."
                                            autoFocus
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-xs font-medium text-admin-text-secondary uppercase tracking-wider mb-1 block">Category</label>
                                            <select
                                                value={newCategory}
                                                onChange={(e) => setNewCategory(e.target.value)}
                                                className="w-full bg-admin-bg-dark border border-admin-border text-white px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-admin-primary focus:border-transparent text-sm outline-none"
                                            >
                                                {Object.keys(CATEGORY_COLORS)
                                                    .filter((c) => c !== "Default")
                                                    .map((cat) => (
                                                        <option key={cat} value={cat}>
                                                            {cat}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-admin-text-secondary uppercase tracking-wider mb-1 block">Author</label>
                                            <input
                                                type="text"
                                                value={newAuthor}
                                                onChange={(e) => setNewAuthor(e.target.value)}
                                                className="w-full bg-admin-bg-dark border border-admin-border text-white px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-admin-primary focus:border-transparent placeholder:text-slate-600 text-sm outline-none"
                                                placeholder="Author name..."
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={addItem}
                                        className="w-full flex items-center justify-center gap-2 bg-admin-primary hover:bg-admin-primary-hover text-white px-5 py-3 rounded-lg font-medium text-sm transition-all shadow-lg shadow-admin-primary/20"
                                    >
                                        <span className="material-symbols-outlined text-xl">add</span>
                                        Create Item
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─── Small reusable sub-component ─── */
function HealthCard({ icon, label, sub, color }: { icon: string; label: string; sub: string; color: string }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-admin-bg-lighter/30 border border-admin-border/50">
            <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined ${color}`}>{icon}</span>
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{label}</span>
                    <span className="text-xs text-admin-text-secondary">{sub}</span>
                </div>
            </div>
            <div className="w-2 h-2 bg-admin-success rounded-full animate-pulse" />
        </div>
    );
}
