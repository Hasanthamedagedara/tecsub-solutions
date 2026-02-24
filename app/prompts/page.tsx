"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ─── Types ─── */
interface Prompt {
    id: string;
    title: string;
    category: string;
    prompt: string;
    icon: string;
    color: string;
    tags: string[];
}

/* ─── Default Prompts ─── */
const DEFAULT_PROMPTS: Prompt[] = [
    {
        id: "pr-001", title: "SEO Blog Post Writer", category: "Content Writing",
        prompt: "Write a comprehensive, SEO-optimized blog post about [TOPIC]. Include:\n- An attention-grabbing title with the primary keyword\n- A meta description (155 characters)\n- An introduction with a hook\n- 5-7 H2 subheadings with keyword variations\n- Bullet points and numbered lists for readability\n- A FAQ section with 3-5 questions\n- A compelling conclusion with a call-to-action\n\nTarget keyword: [KEYWORD]\nWord count: 1500-2000 words\nTone: Professional yet conversational",
        icon: "✍️", color: "#4ADE80", tags: ["SEO", "Blog", "Content"],
    },
    {
        id: "pr-002", title: "YouTube Script Generator", category: "Video",
        prompt: "Create a YouTube video script for a [DURATION]-minute video about [TOPIC]. Structure:\n\n🎬 HOOK (0-15 seconds): An irresistible opening that stops scrolling\n📌 INTRO (15-30 seconds): Quick channel intro + what viewers will learn\n📝 MAIN CONTENT: Break into 3-5 key points with transitions\n💡 BONUS TIP: One unexpected insight\n🔔 CTA: Subscribe, like, comment prompt\n📝 OUTRO: Summary + next video teaser\n\nTone: Energetic and engaging\nInclude timestamps for each section",
        icon: "🎬", color: "#FF0000", tags: ["YouTube", "Script", "Video"],
    },
    {
        id: "pr-003", title: "Product Description Pro", category: "E-Commerce",
        prompt: "Write a high-converting product description for [PRODUCT NAME].\n\nProduct details: [DETAILS]\nTarget audience: [AUDIENCE]\n\nFormat:\n1. Headline that creates desire (max 10 words)\n2. Emotional opening paragraph (2-3 sentences)\n3. Key Features (5 bullet points with benefits, not just features)\n4. Social proof element\n5. Scarcity/urgency element\n6. Call-to-action button text\n\nUse power words: exclusive, transform, unleash, premium, limited\nTone: Persuasive, luxury feel",
        icon: "🛒", color: "#F97316", tags: ["Product", "Sales", "Copy"],
    },
    {
        id: "pr-004", title: "Code Refactoring Assistant", category: "Development",
        prompt: "Refactor the following code to improve:\n\n```\n[PASTE YOUR CODE HERE]\n```\n\nRequirements:\n1. Improve readability and maintainability\n2. Follow SOLID principles\n3. Add TypeScript types where applicable\n4. Extract reusable functions\n5. Add meaningful comments for complex logic\n6. Optimize performance (reduce unnecessary re-renders, memo where needed)\n7. Handle edge cases and errors gracefully\n8. Follow the project's naming conventions\n\nExplain each change you make and why.",
        icon: "💻", color: "#38BDF8", tags: ["Code", "Refactor", "Dev"],
    },
    {
        id: "pr-005", title: "Social Media Content Calendar", category: "Marketing",
        prompt: "Create a 7-day social media content calendar for [BRAND/NICHE].\n\nFor each day, provide:\n📅 Day & Platform (Instagram, TikTok, Twitter, LinkedIn)\n📝 Post Type (Reel, Carousel, Story, Thread)\n🎯 Topic/Hook\n✍️ Caption (with emojis and hashtags)\n📸 Visual Description\n⏰ Best posting time\n📊 Goal (Engagement/Reach/Conversion)\n\nBrand voice: [TONE]\nTarget audience: [AUDIENCE]\nInclude trending audio suggestions for Reels/TikTok",
        icon: "📱", color: "#E1306C", tags: ["Social", "Marketing", "Calendar"],
    },
    {
        id: "pr-006", title: "AI Image Prompt (Midjourney)", category: "AI Art",
        prompt: "Generate 5 detailed Midjourney prompts for: [CONCEPT]\n\nEach prompt should include:\n- Subject description with specific details\n- Art style (e.g., hyperrealistic, anime, oil painting, 3D render)\n- Lighting (e.g., golden hour, neon, dramatic shadows)\n- Camera angle (e.g., bird's eye, close-up, wide angle)\n- Color palette\n- Mood/atmosphere\n- Technical parameters: --ar 16:9 --v 6 --q 2\n\nVariations: photorealistic, illustration, cinematic, fantasy, minimalist",
        icon: "🎨", color: "#C084FC", tags: ["Midjourney", "AI Art", "Image"],
    },
    {
        id: "pr-007", title: "Email Marketing Sequence", category: "Marketing",
        prompt: "Write a 5-email welcome sequence for [BUSINESS TYPE].\n\nEmail 1 - Welcome & Deliver Lead Magnet\nEmail 2 - Share Your Story & Build Trust (Day 2)\nEmail 3 - Provide Value & Education (Day 4)\nEmail 4 - Social Proof & Case Study (Day 6)\nEmail 5 - Soft Pitch & Offer (Day 7)\n\nFor each email include:\n- Subject line (A/B test variants)\n- Preview text\n- Body copy\n- CTA button text\n- P.S. line\n\nGoal: 40%+ open rate, 15%+ click rate\nTone: Friendly, helpful, not salesy",
        icon: "📧", color: "#10A37F", tags: ["Email", "Marketing", "Sequence"],
    },
    {
        id: "pr-008", title: "Business Plan Generator", category: "Business",
        prompt: "Create a comprehensive business plan outline for [BUSINESS IDEA].\n\n1. Executive Summary\n2. Company Description & Mission Statement\n3. Market Analysis\n   - Target market size\n   - Competitor analysis (3-5 competitors)\n   - SWOT analysis\n4. Products/Services Description\n5. Marketing & Sales Strategy\n6. Revenue Model & Pricing\n7. Financial Projections (Year 1-3)\n8. Funding Requirements\n9. Team Structure\n10. Milestones & Timeline\n\nIndustry: [INDUSTRY]\nBudget: [BUDGET]\nLocation: [LOCATION]",
        icon: "📊", color: "#FFD93D", tags: ["Business", "Plan", "Strategy"],
    },
    {
        id: "pr-009", title: "Chat Support Response Template", category: "Customer Service",
        prompt: "Create professional customer support response templates for these scenarios:\n\n1. 🔄 Refund Request\n2. 🐛 Bug Report Acknowledgment\n3. ⏳ Delayed Delivery\n4. ⭐ Positive Review Response\n5. 😡 Angry Customer De-escalation\n6. 📦 Order Status Inquiry\n7. 🔐 Account Recovery\n8. 💡 Feature Request Response\n\nFor each template:\n- Greeting\n- Empathy statement\n- Solution/Action steps\n- Follow-up commitment\n- Professional closing\n\nBrand name: [BRAND]\nTone: Warm, professional, solution-oriented",
        icon: "💬", color: "#1DA1F2", tags: ["Support", "Templates", "Service"],
    },
    {
        id: "pr-010", title: "Viral TikTok Hook Generator", category: "Social Media",
        prompt: "Generate 20 viral TikTok/Reels hooks for [NICHE]. Each hook must:\n\n✅ Create curiosity in the first 1-2 seconds\n✅ Use pattern interrupts\n✅ Include text overlay suggestions\n✅ Specify the visual action for the first 3 seconds\n\nFormats to include:\n1. \"Stop scrolling if you...\" (3 hooks)\n2. \"I can't believe...\" (3 hooks)\n3. \"The secret to...\" (3 hooks)\n4. \"POV:\" hooks (3 hooks)\n5. \"Things nobody tells you about...\" (3 hooks)\n6. Controversial opinion hooks (3 hooks)\n7. Before/After hooks (2 hooks)\n\nTrending audio suggestion for each hook",
        icon: "🎵", color: "#00F2EA", tags: ["TikTok", "Viral", "Hooks"],
    },
    {
        id: "pr-011", title: "Resume & Cover Letter Writer", category: "Career",
        prompt: "Create a professional resume and cover letter for:\n\nPosition: [JOB TITLE]\nCompany: [COMPANY NAME]\nExperience: [YEARS] years in [FIELD]\n\nResume should include:\n- Professional summary (3 lines, impactful)\n- Key skills (10 relevant skills)\n- Work experience (3 positions with quantified achievements)\n- Education\n- Certifications\n- Format: ATS-friendly\n\nCover Letter:\n- Personalized opening mentioning the company\n- 3 key achievements aligned with job requirements\n- Cultural fit paragraph\n- Strong closing with call-to-action\n\nMy background: [YOUR BACKGROUND]",
        icon: "📄", color: "#A78BFA", tags: ["Resume", "Career", "Job"],
    },
    {
        id: "pr-012", title: "Landing Page Copy Framework", category: "Copywriting",
        prompt: "Write landing page copy using the PAS (Problem-Agitate-Solve) framework for [PRODUCT/SERVICE].\n\nSections:\n1. Hero Section:\n   - Headline (max 8 words, benefit-driven)\n   - Subheadline (clarify the offer)\n   - CTA button text\n\n2. Problem Section: 3 pain points the audience faces\n\n3. Agitate: Make the pain feel urgent\n\n4. Solution: Introduce the product as the answer\n\n5. Features → Benefits: 6 features with emotional benefits\n\n6. Social Proof: Testimonial templates (3)\n\n7. FAQ: 5 objection-handling questions\n\n8. Final CTA: Urgency + scarcity element\n\nTarget audience: [AUDIENCE]\nTone: [TONE]",
        icon: "🚀", color: "#EF4444", tags: ["Landing Page", "Copy", "Sales"],
    },
];

const CATEGORIES = ["All", "Content Writing", "Video", "E-Commerce", "Development", "Marketing", "AI Art", "Business", "Customer Service", "Social Media", "Career", "Copywriting"];

export default function PromptsPage() {
    const [prompts, setPrompts] = useState<Prompt[]>(DEFAULT_PROMPTS);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    /* ─── Sync with admin localStorage ─── */
    useEffect(() => {
        const loadFromStorage = () => {
            const stored = localStorage.getItem("tecsub-admin-prompts");
            if (stored) {
                try {
                    const adminItems = JSON.parse(stored);
                    if (adminItems.length > 0) {
                        const mapped: Prompt[] = adminItems.map((item: { id: string; title: string; category: string; status: string }, idx: number) => {
                            const def = DEFAULT_PROMPTS.find(p => p.title === item.title);
                            if (def) return { ...def, id: item.id };
                            const colors = ["#4ADE80", "#FF0000", "#F97316", "#38BDF8", "#E1306C", "#C084FC", "#10A37F", "#FFD93D"];
                            return {
                                id: item.id, title: item.title, category: item.category || "General",
                                prompt: `AI prompt for: ${item.title}\n\nCustomize this prompt with your specific details and requirements.`,
                                icon: "📝", color: colors[idx % colors.length],
                                tags: [item.category || "AI", "Custom"],
                            };
                        }).filter((item: { id: string }) => {
                            const adminItem = adminItems.find((a: { id: string; status: string }) => a.id === item.id);
                            return !adminItem || adminItem.status !== "archived";
                        });
                        setPrompts(mapped);
                        return;
                    }
                } catch { /* ignore */ }
            }
            // Seed admin localStorage with defaults
            const seed = DEFAULT_PROMPTS.map(p => ({
                id: p.id, title: p.title, type: "prompts", status: "published" as const,
                category: p.category, author: "Admin",
                createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            }));
            localStorage.setItem("tecsub-admin-prompts", JSON.stringify(seed));
            setPrompts(DEFAULT_PROMPTS);
        };
        loadFromStorage();
        window.addEventListener("storage", loadFromStorage);
        const interval = setInterval(loadFromStorage, 2000);
        return () => { window.removeEventListener("storage", loadFromStorage); clearInterval(interval); };
    }, []);

    /* ─── Copy to clipboard ─── */
    const handleCopy = async (prompt: Prompt) => {
        try {
            await navigator.clipboard.writeText(prompt.prompt);
            setCopiedId(prompt.id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch {
            // Fallback
            const textArea = document.createElement("textarea");
            textArea.value = prompt.prompt;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopiedId(prompt.id);
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    /* ─── Filter ─── */
    const filtered = prompts.filter(p => {
        const matchCat = selectedCategory === "All" || p.category === selectedCategory;
        const matchSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchCat && matchSearch;
    });

    return (
        <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
            <Navbar />
            <div className="pt-24 sm:pt-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

                    {/* Hero */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-10"
                    >
                        <h1 className="font-bebas text-5xl sm:text-7xl gradient-text leading-[0.95] mb-4">
                            📝 AI PROMPT LIBRARY
                        </h1>
                        <p className="text-sm sm:text-base max-w-2xl mx-auto mb-6" style={{ color: "var(--text-secondary)" }}>
                            Copy-paste ready AI prompts for ChatGPT, Claude, Gemini & more. Click any prompt to copy instantly.
                        </p>

                        {/* Search */}
                        <div className="max-w-md mx-auto mb-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search prompts..."
                                    className="w-full px-5 py-3 pl-12 rounded-2xl text-sm outline-none transition-all focus:ring-2 focus:ring-tecsubCyan/30"
                                    style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", color: "var(--text-primary)" }}
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg" style={{ color: "var(--text-secondary)" }}>🔍</span>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="flex flex-wrap justify-center gap-2">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${selectedCategory === cat
                                        ? "bg-tecsubCyan/20 text-tecsubCyan border border-tecsubCyan/30"
                                        : "border border-white/10 hover:border-white/20"
                                        }`}
                                    style={{ color: selectedCategory === cat ? undefined : "var(--text-secondary)" }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Prompts Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map((prompt, i) => (
                            <motion.div
                                key={prompt.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.04, duration: 0.4 }}
                                className="group rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:scale-[1.01]"
                                style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.borderColor = `${prompt.color}30`;
                                    (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px ${prompt.color}10`;
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                                }}
                            >
                                {/* Top bar */}
                                <div className="h-1" style={{ background: prompt.color }} />

                                <div className="p-5 flex flex-col flex-1">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                                                style={{ background: `${prompt.color}15` }}
                                            >
                                                {prompt.icon}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-sm leading-snug" style={{ color: "var(--text-primary)" }}>
                                                    {prompt.title}
                                                </h3>
                                                <p className="text-[10px] font-medium" style={{ color: prompt.color }}>
                                                    {prompt.category}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {prompt.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[9px] px-2 py-0.5 rounded-full font-medium"
                                                style={{ background: `${prompt.color}10`, color: prompt.color }}
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Prompt Preview / Copy Box */}
                                    <div
                                        className="relative rounded-xl p-3 mb-3 flex-1 cursor-pointer transition-all duration-300 hover:brightness-110"
                                        style={{
                                            background: "rgba(0,0,0,0.5)",
                                            border: `1px solid ${prompt.color}15`,
                                        }}
                                        onClick={() => setExpandedId(expandedId === prompt.id ? null : prompt.id)}
                                    >
                                        <pre
                                            className="text-[11px] leading-relaxed whitespace-pre-wrap font-sans overflow-hidden transition-all duration-300"
                                            style={{
                                                color: "var(--text-secondary)",
                                                maxHeight: expandedId === prompt.id ? "500px" : "80px",
                                            }}
                                        >
                                            {prompt.prompt}
                                        </pre>

                                        {/* Fade overlay when collapsed */}
                                        {expandedId !== prompt.id && (
                                            <div
                                                className="absolute bottom-0 left-0 right-0 h-10 rounded-b-xl pointer-events-none"
                                                style={{
                                                    background: "linear-gradient(transparent, rgba(0,0,0,0.8))",
                                                }}
                                            />
                                        )}

                                        {/* Expand hint */}
                                        <div className="absolute bottom-1 right-2 text-[9px] font-medium" style={{ color: `${prompt.color}80` }}>
                                            {expandedId === prompt.id ? "▲ Collapse" : "▼ Expand"}
                                        </div>
                                    </div>

                                    {/* Copy Button */}
                                    <button
                                        onClick={() => handleCopy(prompt)}
                                        className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:brightness-110 flex items-center justify-center gap-2"
                                        style={{
                                            background: copiedId === prompt.id ? `${prompt.color}` : `${prompt.color}15`,
                                            color: copiedId === prompt.id ? "#fff" : prompt.color,
                                            border: `1px solid ${prompt.color}30`,
                                        }}
                                    >
                                        {copiedId === prompt.id ? (
                                            <>✅ Copied!</>
                                        ) : (
                                            <>📋 Copy Prompt</>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Empty state */}
                    {filtered.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-3xl mb-3">🔍</p>
                            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No prompts found matching your search.</p>
                        </div>
                    )}
                </div>

                {/* ═══ Full Prompt Modal ═══ */}
                <AnimatePresence>
                    {expandedId && (() => {
                        const prompt = prompts.find(p => p.id === expandedId);
                        if (!prompt) return null;
                        return null; // The expand/collapse is inline — no modal needed
                    })()}
                </AnimatePresence>

                <Footer />
            </div>
        </div>
    );
}
